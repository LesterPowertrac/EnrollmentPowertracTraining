import { useEffect, useState } from 'react';
import axios from '../../../../Utils/API/axios';
import { formatDistanceToNow } from 'date-fns';
import Table from '../../../../Components/Table';
import echo from '../../../../Utils/API/echo';

const StudentActivityFeed = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial load
    axios.get('/api/my-activity-logs-students').then(res => {
      const normalized = res.data.map(log => ({
        ...log,
        created_at: new Date(log.created_at), // ✅ Normalize for consistent display
      }));
      setLogs(normalized);
      setLoading(false);
    });

    // // Debug: Echo connection events
    // echo.connector.pusher.connection.bind('connected', () => {
    //   console.log('✅ Pusher connected');
    // });

    // echo.connector.pusher.connection.bind('error', err => {
    //   console.error('❌ Pusher connection error', err);
    // });

    // Subscribe to activity-log channel
    const channel = echo.channel('activity-log');
    // console.log('👂 Listening to channel:', channel.name);

    channel.listen('.ActivityLogCreated', (e) => {
      const newLog = {
        ...e.log,
        created_at: new Date(e.log.created_at), // ✅ Normalize real-time timestamp
      };

      setLogs(prevLogs => {
        const exists = prevLogs.some(log => log.id === newLog.id);
        return exists ? prevLogs : [newLog, ...prevLogs];
      });
    });

    // Cleanup on unmount
    return () => {
      echo.leave('activity-log');
    };
  }, []);

  const columns = ['User', 'Action', 'Course', 'When'];

  const data = logs.map(log => [
    log.user?.name || 'System',
    log.action,
    log.subject_type === 'Enrollment' && log.course?.title
      ? log.course.title
      : '—',
    formatDistanceToNow(log.created_at, { addSuffix: true }) // ✅ Already a Date object
  ]);

  return (
    <div className="mb-8 bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Enrollment Activity</h2>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : logs.length === 0 ? (
        <p className="text-gray-500">No activity yet.</p>
      ) : (
        <Table columns={columns} data={data} />
      )}
    </div>
  );
};

export default StudentActivityFeed;

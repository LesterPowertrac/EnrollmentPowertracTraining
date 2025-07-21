import { useState, useEffect } from 'react';
import { useAuth } from '../../../Utils/AuthContext';
import axios from '../../../Utils/API/axios';
import echo from '../../../Utils/API/echo';
import Table from '../../../Components/Table';
import CourseStats from './AdminComponents/Charts/CourseStats';
import StudentTable from './StudentTable';
import AdminCards from './AdminComponents/Cards/AdminCards';

const AdminHome = () => {
  const { user, loading: authLoading } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loadingLog, setLoadingLog] = useState(true);
  const [error, setError] = useState(null);

  // 1) Initial fetch of logs
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await axios.get('/api/activity-logs');
        setLogs(res.data.map(log => ({
          ...log,
          created_at: new Date(log.created_at),
        })));
      } catch (err) {
        console.error(err);
        setError('Failed to load activity logs.');
      } finally {
        setLoadingLog(false);
      }
    };

    fetchLogs();
  }, []);

useEffect(() => {
  if (authLoading || !user) return;

  // ✅ Listen on the public channel
  echo.channel('activity-log')
    .listen('.ActivityLogCreated', e => {
      const newLog = {
        ...e.log,
        created_at: new Date(e.log.created_at),
      };

      setLogs(prev => {
        if (prev.some(l => l.id === newLog.id)) return prev;
        return [newLog, ...prev];
      });
    });

  // ✅ Leave the channel on cleanup
  return () => {
    echo.leaveChannel('activity-log');
  };
}, [authLoading, user]);




  // Table setup
  const columns = ['User', 'Action', 'Subject Type', 'Subject ID', 'Timestamp'];
  const data = logs.map(log => [
    log.user?.name || 'N/A',
    log.action,
    log.subject_type || '-',
    log.subject_id || '-',
    log.created_at.toLocaleString(),
  ]);

  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-600 text-lg">Loading dashboard...</p>
      </div>
    );
  }

  // Render
  return (
    <div>
      <AdminCards />

      <h2 className="text-xl font-bold mb-4">Course Enrollment Statistics</h2>
      <CourseStats />

      <h2 className="text-xl font-bold mb-4">List Of Students</h2>
      <StudentTable />

      <div className="my-8">
        <h2 className="text-xl font-bold mb-4">Activity Logs</h2>
        {error && <p className="text-red-500 mb-3">{error}</p>}
        {loadingLog ? (
          <p className="text-gray-600">Loading...</p>
        ) : logs.length === 0 ? (
          <p className="text-gray-600">No activity logs found.</p>
        ) : (
          <Table columns={columns} data={data} />
        )}
      </div>
    </div>
  );
};

export default AdminHome;

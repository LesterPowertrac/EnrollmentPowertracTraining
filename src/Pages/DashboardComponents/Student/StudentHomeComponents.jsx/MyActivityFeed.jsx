import { useEffect, useState } from 'react';
import axios from '../../../../Utils/API/axios';
import echo from '../../../../Utils/API/echo'; // 👈 import Echo instance

const MyActivityFeed = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    // Initial fetch
    axios.get('/api/my-activity').then(res => {
      const normalized = res.data.map(log => ({
        ...log,
        created_at: new Date(log.created_at),
      }));
      setLogs(normalized);
    });

    // Subscribe to activity-log channel
    const channel = echo.channel('activity-log');

    channel.listen('.ActivityLogCreated', (e) => {
      const newLog = {
        ...e.log,
        created_at: new Date(e.log.created_at),
      };

      // Prevent duplicate logs
      setLogs(prev => {
        const exists = prev.some(l => l.id === newLog.id);
        return exists ? prev : [newLog, ...prev];
      });
    });

    // Cleanup
    return () => {
      echo.leave('activity-log');
    };
  }, []);

  return (
    <div className="bg-white shadow rounded p-4">
      <h2 className="text-lg font-bold mb-4">History Timeline</h2>
      <ul className="space-y-4">
        {logs.map(log => (
          <li key={log.id} className="border-l-4 border-indigo-500 pl-4">
            <p className="text-sm text-gray-700">
              {log.user?.name} <strong>{log.action}</strong>
              {log.subject?.course?.title && (
                <> on <strong>{log.subject.course.title}</strong></>
              )}
            </p>
            <p className="text-xs text-gray-400">
              {log.created_at.toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyActivityFeed;

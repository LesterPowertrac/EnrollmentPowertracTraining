import { useEffect, useState, useMemo } from 'react';
import axios from '../../../../../Utils/API/axios';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';
import echo from '../../../../../Utils/API/echo';
import { useAuth } from '../../../../../Utils/AuthContext';
import { debounce } from 'lodash';

const CourseStats = () => {
  const { user, loading: authLoading } = useAuth();
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔁 Debounced fetcher
  const debouncedFetchStats = useMemo(() => debounce(() => {
    console.log("📊 Realtime: fetching updated course stats...");
    fetchStats();
  }, 300), []);

  // 📥 Fetch from API
  const fetchStats = async () => {
    try {
      const res = await axios.get('/api/course-stats');
      setStats(res.data);
    } catch (err) {
      console.error('Error loading course stats:', err);
      setError('Failed to load course statistics.');
    } finally {
      setLoading(false);
    }
  };

  // ⏳ Initial fetch
  useEffect(() => {
    if (!authLoading && user) {
      fetchStats();
    }
  }, [authLoading, user]);

  // 📡 Realtime updates
useEffect(() => {
  if (authLoading || !user) return;

  echo.channel('students').listen('.StudentChanged', debouncedFetchStats);
  echo.channel('courses').listen('.CourseChanged', debouncedFetchStats);
  echo.channel('enrollments').listen('.EnrollmentUpdated', debouncedFetchStats);

  return () => {
    echo.leaveChannel('students');
    echo.leaveChannel('courses');
    echo.leaveChannel('enrollments');
    debouncedFetchStats.cancel();
  };
}, [authLoading, user, debouncedFetchStats]);


  // 📊 Format chart data
  const data = stats.map(item => ({
    name: item.course?.title || 'Unknown',
    total: item.total,
  }));

  return (
    <div className="bg-white p-4 rounded shadow mb-6">
      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
      {loading ? (
        <p className="text-gray-500 text-sm">Loading statistics...</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={data}
            margin={{ top: 20, right: 20, left: 0, bottom: 40 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              angle={-25}
              textAnchor="end"
              interval={0}
              height={60}
            />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total" fill="#0f766e" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default CourseStats;

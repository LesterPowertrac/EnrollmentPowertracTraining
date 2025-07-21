import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '../../../../../Utils/AuthContext';
import axios from '../../../../../Utils/API/axios';
import echo from '../../../../../Utils/API/echo';
import { debounce } from 'lodash';

const AdminCards = () => {
  const { user, loading: authLoading } = useAuth();

  const [stats, setStats] = useState({
    total_students: 0,
    total_courses: 0,
    total_enrollments: 0,
    total_approved: 0,
  });

  const fetchStats = async () => {
    try {
      const { data } = await axios.get('/api/admin/stats');
      setStats({
        total_students: data.total_students,
        total_courses: data.total_courses,
        total_enrollments: data.total_enrollments,
        total_approved: data.total_approved,
      });
    } catch (err) {
      console.error('Failed to fetch admin stats', err);
    }
  };

  const debouncedFetchStats = useMemo(() => debounce(fetchStats, 300), []);

  // Initial fetch
  useEffect(() => {
    if (!authLoading && user) {
      fetchStats();
    }
  }, [authLoading, user]);

  // Realtime listeners
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

  const cards = [
    {
      label: 'Total Students',
      value: stats.total_students,
      color: 'bg-blue-100 text-blue-800',
    },
    {
      label: 'Total Courses',
      value: stats.total_courses,
      color: 'bg-green-100 text-green-800',
    },
    {
      label: 'Total Enrollments',
      value: stats.total_enrollments,
      color: 'bg-yellow-100 text-yellow-800',
    },
    {
      label: 'Approved Enrollments',
      value: stats.total_approved,
      color: 'bg-indigo-100 text-indigo-800',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {cards.map((card, idx) => (
        <div key={idx} className={`p-4 rounded shadow ${card.color}`}>
          <p className="text-sm">{card.label}</p>
          <h2 className="text-xl font-bold">{card.value}</h2>
        </div>
      ))}
    </div>
  );
};

export default AdminCards;

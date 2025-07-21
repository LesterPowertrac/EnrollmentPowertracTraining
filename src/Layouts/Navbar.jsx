import { useEffect, useState } from 'react';
import {
  FaBell,
  FaUserCircle,
  FaUser,
  FaSignOutAlt
} from 'react-icons/fa';
import { FaRegTrashCan } from 'react-icons/fa6';
import DropdownHover from '../Components/DropdownHover';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Utils/AuthContext';
import axios from '../Utils/API/axios';
import echo from '../Utils/API/echo';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);

  // Initial fetch for notifications (admin)
  useEffect(() => {
    if (user?.role === 'admin') {
      axios.get('/api/enrollments/unread').then(res => {
        setNotifications(res.data);
      });
    }
  }, [user]);

  // Initial fetch for notifications (student)
  useEffect(() => {
    if (user?.role === 'student') {
      axios.get('/api/enrollments/unread').then(res => {
        setNotifications(res.data);
      });
    }
  }, []);

  // Real-time updates
  useEffect(() => {
    if (!user) return;

    const channel = echo.channel('enrollments');

    const handleEnrollmentUpdate = (e) => {
      if (
        (user.role === 'admin') ||
        (user.role === 'student' && e.user?.id === user.id)
      ) {
        axios.get('/api/enrollments/unread').then(res => {
          setNotifications(res.data);
        });
      }
    };

    channel.listen('.EnrollmentUpdated', handleEnrollmentUpdate);

    return () => {
      echo.leave('enrollments');
    };
  }, [user]);

  const markAllAsRead = async () => {
    try {
      await axios.post('/api/enrollments/mark-all-read');
      setNotifications([]);
    } catch (error) {
      console.error('Failed to mark notifications as read', error);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await axios.post(`/api/enrollments/${id}/mark-read`);
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (error) {
      console.error('Failed to mark notification as read', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-indigo-500 text-white p-4 flex justify-between items-center px-5 shadow-lg shadow-slate-500/70 fixed top-0 left-64 w-[calc(100%-16rem)] z-10">
      <h1 className="text-xl font-bold">Dashboard</h1>
      <div className="flex items-center gap-4">
        {user?.role === 'admin' && (
          <span className="relative flex gap-4">
            <DropdownHover
              icon={FaRegTrashCan}
              options={[
                {
                  label: 'Trashed Students',
                  path: 'trashed-students',
                  icon: FaUser
                }
              ]}
            />
            <DropdownHover
              icon={FaBell}
              badgeCount={notifications.length}
              options={[
                ...(notifications.length > 0
                  ? notifications.map(e => ({
                      label: `${e.user?.name} enrolled in ${e.course?.title}`,
                      path: '#',
                      onClick: () => handleMarkAsRead(e.id)
                    }))
                  : [{ label: 'No new enrollments', path: '#' }]),
                { label: 'Mark all as read', onClick: markAllAsRead }
              ]}
            />
            {notifications.length > 0 && (
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
            )}
          </span>
        )}

        {user?.role === 'student' && (
          <span className="relative">
            <DropdownHover
              icon={FaBell}
              badgeCount={notifications.length}
              options={[
                ...(notifications.length > 0
                  ? notifications.map(e => ({
                      label: `Your enrollment for ${e.course?.title} was ${e.status}`,
                      path: '#',
                      onClick: () => handleMarkAsRead(e.id)
                    }))
                  : [{ label: 'No new notifications', path: '#' }]),
                { label: 'Mark all as read', onClick: markAllAsRead }
              ]}
            />
            {notifications.length > 0 && (
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
            )}
          </span>
        )}

        <DropdownHover
          icon={FaUserCircle}
          options={[
            { label: 'Profile', path: 'profile', icon: FaUserCircle },
            { label: 'Logout', onClick: handleLogout, icon: FaSignOutAlt }
          ]}
        />
      </div>
    </nav>
  );
};

export default Navbar;

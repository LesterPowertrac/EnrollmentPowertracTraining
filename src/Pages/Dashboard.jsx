

import { useAuth } from '../Utils/AuthContext';
import AdminHome from './DashboardComponents/Admin/AdminHome';
import StudentHome from './DashboardComponents/Student/StudentHome';

const Dashboard = () => {
  const { user } = useAuth();  

  return (
    <>
      {user?.role === 'admin' && (
        <AdminHome/>
      )}
      {user?.role === 'student' && (
        <StudentHome/>
      )}
    </>
  );
}

export default Dashboard
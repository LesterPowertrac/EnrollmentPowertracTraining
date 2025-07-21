import { Navigate, Outlet } from 'react-router-dom';
import Sidebar from '../Layouts/Sidebar';
import { useAuth } from '../Utils/AuthContext';
import Navbar from '../Layouts/Navbar';

const DefaultLayout = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-600 text-lg">Loading dashboard...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex">
      {/* Sidebar (fixed at w-64) */}
<div className="ml-64">
      <Sidebar user={user} />
</div>
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Navbar />

        {/* Content below navbar */}
        <main className="flex-1 p-5 mt-16">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DefaultLayout;

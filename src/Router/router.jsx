import {
  // createBrowserRouter, <--- for deployment
  createHashRouter, // <--- palitan soon ng createBrowserRouter pag dedeploy sa bluehost
  RouterProvider,
} from 'react-router-dom';

import { lazy } from 'react';

// Layouts
import Guestlayout from '../View/Guestlayout';
import DefaultLayout from '../View/DefaultLayout';

// Lazy Pages
const Login = lazy(() => import('../Pages/Login'));
const Dashboard = lazy(() => import('../Pages/Dashboard'));

// Suspense wrapper
import SuspenseWrapper from '../Utils/SuspenseWrapper';

// Admin
import AdminCourse from '../Pages/DashboardComponents/Admin/AdminCourse';
import EnrollmentRequests from '../Pages/DashboardComponents/Admin/EnrollmentRequests';

// Student
import AvailableCourses from '../Pages/DashboardComponents/Student/AvailableCourses';
import MyEnrollments from '../Pages/DashboardComponents/Student/MyEnrollments';
import Profile from '../Pages/DashboardComponents/Profile/Profile';
import AdminCertificates from '../Pages/DashboardComponents/Admin/AdminCertificates';
import RegisteredStudents from '../Pages/DashboardComponents/Admin/RegisteredStudents';
import TrashedStudents from '../Pages/DashboardComponents/Admin/TrashedStudents';
import StudentsData from '../Pages/DashboardComponents/Admin/StudentsData';

const router = createHashRouter([
  {
    path: '/login',
    element: <Guestlayout />,
    children: [
      {
        path: '',
        element: (
          <SuspenseWrapper fallback="Loading Login Page...">
            <Login />
          </SuspenseWrapper>
        ),
      },
    ],
  },
  {
    path: '/enrollment-dashboard',
    element: <DefaultLayout />,
    children: [
      {
        path: '',
        element: (
          <SuspenseWrapper fallback="Loading Dashboard...">
            <Dashboard />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'admin-course',
        element: (
          <SuspenseWrapper fallback="Loading Dashboard...">
            <AdminCourse />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'enrollment-requests',
        element: (
          <SuspenseWrapper fallback="Loading Dashboard...">
            <EnrollmentRequests />
          </SuspenseWrapper>
        ),
      },      
      {
        path: 'available-courses',
        element: (
          <SuspenseWrapper fallback="Loading Dashboard...">
            <AvailableCourses />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'my-enrollments',
        element: (
          <SuspenseWrapper fallback="Loading Dashboard...">
            <MyEnrollments />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'profile',
        element: (
          <SuspenseWrapper fallback="Loading Dashboard...">
            <Profile />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'admin-certificates',
        element: (
          <SuspenseWrapper fallback="Loading Dashboard...">
            <AdminCertificates />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'registered-students',
        element: (
          <SuspenseWrapper fallback="Loading Dashboard...">
            <RegisteredStudents />
          </SuspenseWrapper>
        ),
      }, 
      {
        path: 'trashed-students',
        element: (
          <SuspenseWrapper fallback="Loading Dashboard...">
            <TrashedStudents />
          </SuspenseWrapper>
        ),
      },      
      {
        path: 'students/:id', 
        element: (
          <SuspenseWrapper fallback="Loading Dashboard...">
            <StudentsData />
          </SuspenseWrapper>
        ),
      }, 
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}

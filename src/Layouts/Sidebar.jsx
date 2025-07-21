import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaHome, FaUser, FaThList } from 'react-icons/fa';
import pltciLogo from '../assets/pltci.jpg';

const Sidebar = ({ user }) => {
  return (
    <div className='w-64 h-screen bg-white text-black p-5 border-r shadow-lg shadow-slate-500/70 fixed left-0 z-50 overflow-y-auto'>
      <div className=" flex items-center gap-3">
        <img
          src={pltciLogo}
          alt="Avatar"
          className="w-10 h-10 rounded-full border object-cover"
        />
        <div>
          <p className="text-sm font-semibold">Powertrac Learning Center Inc.</p>
        </div>
      </div>

      {/* Avatar at top */}
      <div className="mt-10 mb-5 flex items-center gap-3 border-b pb-5">
        <img
          src={user?.avatar_url || '/default-avatar.png'}
          alt="Avatar"
          className="w-16 h-16 rounded-full border object-cover"
        />
        <div>
          <p className="text-sm font-semibold">{user?.name}</p>
          <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
        </div>

      </div>

      <nav className='space-y-2'>
        <NavLink
          to='/enrollment-dashboard'
          className='flex items-center gap-3 p-3 rounded hover:bg-indigo-500'
          activeclassname='bg-indigo-500'
        >
          <FaHome /> Home
        </NavLink>

        {user?.role === 'admin' ? (
          <>
            <NavLink
              to='registered-students'
              className='flex items-center gap-3 p-3 rounded hover:bg-indigo-500'
              activeclassname='bg-indigo-500'
            >
              <FaThList /> Registered Students
            </NavLink> 
            <NavLink
              to='admin-course'
              className='flex items-center gap-3 p-3 rounded hover:bg-indigo-500'
              activeclassname='bg-indigo-500'
            >
              <FaUser /> Created Course
            </NavLink>           
            <NavLink
              to='enrollment-requests'
              className='flex items-center gap-3 p-3 rounded hover:bg-indigo-500'
              activeclassname='bg-indigo-500'
            >
              <FaThList /> Enrollment Requests
            </NavLink>
            <NavLink
              to='admin-certificates'
              className='flex items-center gap-3 p-3 rounded hover:bg-indigo-500'
              activeclassname='bg-indigo-500'
            >
              <FaThList /> Certificates
            </NavLink>            
          </>
        ) : (
          <>
            <NavLink
              to='available-courses'
              className='flex items-center gap-3 p-3 rounded hover:bg-indigo-500'
              activeclassname='bg-indigo-500'
            >
              <FaUser /> Available Courses
            </NavLink>
            <NavLink
              to='my-enrollments'
              className='flex items-center gap-3 p-3 rounded hover:bg-indigo-500'
              activeclassname='bg-indigo-500'
            >
              <FaThList /> My Enrollments
            </NavLink>
          </>
        )}
      </nav>

      
    


    </div>
  );
};

export default Sidebar;

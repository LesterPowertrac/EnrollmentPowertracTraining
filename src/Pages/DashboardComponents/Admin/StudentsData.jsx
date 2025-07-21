import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../../../Utils/API/axios';
import echo from '../../../Utils/API/echo';

const StudentsData = () => {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  
useEffect(() => {
  const channel = echo.channel('students'); // ✅ Correct

  const handleStudentChange = (e) => {
    if (e.student?.id === parseInt(id)) {
      if (e.action === 'deleted' || e.action === 'force-deleted') {
        setStudent(null);
      } else {
        axios.get(`/api/students/${id}`)
          .then(res => setStudent(res.data))
          .catch(err => console.error('Failed to update student view', err));
      }
    }
  };

  channel.listen('.StudentChanged', handleStudentChange); // ✅ Listen on the channel

  return () => {
    echo.leaveChannel('students'); // ✅ Clean up
  };
}, [id]);



  if (loading) return <div>Loading...</div>;
  if (!student) return <div>No student found.</div>;

  const profile = student.profile || {};
  const competence = student.competence || {};

  return (
    <div className="p-6 bg-white rounded shadow max-w-3xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Student Details:</h2>

      {/* Profile Image */}
      {profile.avatar_url && (
        <div className="mb-4 flex justify-center">
          <img
            src={profile.avatar_url}
            alt="Avatar"
            className="w-28 h-28 rounded-full object-cover border"
          />
        </div>
      )}

      {/* Basic Info */}
      <div className="mb-4 space-y-1">
        <p><strong>Name:</strong> {student.name}</p>
        <p><strong>Email:</strong> {student.email}</p>
        <p><strong>Role:</strong> {student.role}</p>
      </div>

      {/* Profile Info */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Profile Info:</h3>
        <p><strong>Phone:</strong> {profile.phone || 'N/A'}</p>
        <p><strong>Birthdate:</strong> {profile.birthdate || 'N/A'}</p>
        <p><strong>Address:</strong> {profile.address || 'N/A'}</p>
      </div>

      {/* Competence Info */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Competence:</h3>
        <p><strong>Status:</strong> {competence.status || 'Not Evaluated'}</p>
        <p><strong>Evaluated By:</strong> {competence.evaluator?.name || 'N/A'}</p>
      </div>


      {/* Enrolled Courses */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Enrolled Courses:</h3>
        {student.enrollments?.length > 0 ? (
          <ul className="list-disc pl-6 space-y-1">
            {student.enrollments.map((e) => (
              <li key={e.id}>
                {e.course?.title || 'Untitled Course'} — <span className="capitalize">{e.status}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p>No enrolled courses found.</p>
        )}
      </div>
    </div>
  );
};

export default StudentsData;

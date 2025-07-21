import { useEffect, useState } from 'react';
import axios from '../../../Utils/API/axios';
import echo from '../../../Utils/API/echo';

const AvailableCourses = () => {
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchCoursesAndEnrollments();
  }, []);
  
  useEffect(() => {
    const channel = echo.channel('enrollments'); // ✅ public channel name

    channel.listen('.EnrollmentUpdated', (e) => {
      console.log('📡 EnrollmentUpdated in AvailableCourses:', e.enrollment);
      fetchCoursesAndEnrollments(); // Refresh to reflect status
    });

    return () => {
      echo.leave('enrollments'); // ✅ correct cleanup for public channel
    };
  }, []);


  const fetchCoursesAndEnrollments = async () => {
    setLoading(true);
    try {
      const [coursesRes, enrollmentsRes] = await Promise.all([
        axios.get('/api/courses'),
        axios.get('/api/enrollments/my') // ← replace with your route
      ]);

      setCourses(coursesRes.data);
      setEnrollments(enrollmentsRes.data);
    } catch (err) {
      console.error('Failed to load courses or enrollments', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (courseId) => {
    try {
      await axios.post('/api/enrollments', { course_id: courseId });
      setMessage('Enrollment request sent!');
      fetchCoursesAndEnrollments(); // refresh list
    } catch (err) {
      console.error('Enrollment failed', err);
      setMessage('Could not enroll — maybe already requested.');
    }
  };

  useEffect(() => {
    const courseChannel = echo.channel('courses');

    courseChannel.listen('.CourseChanged', (e) => {
      console.log('📡 CourseChanged in AvailableCourses:', e.type, e.course);
      fetchCoursesAndEnrollments();
    });

    return () => {
      echo.leaveChannel('courses'); // ✅ proper cleanup
    };
  }, []);



  const getStatus = (courseId) => {
    const match = enrollments.find((e) => e.course_id === courseId);
    return match?.status; // 'pending' or 'approved'
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4">Available Courses</h2>

      {message && (
        <div className="bg-yellow-100 text-yellow-800 p-2 rounded text-sm mb-4">
          {message}
        </div>
      )}

      <div className="overflow-auto rounded shadow bg-white">
        {loading ? (
          <p className="p-4 text-gray-500">Loading courses...</p>
        ) : courses.length === 0 ? (
          <p className="p-4 text-gray-500">No courses available.</p>
        ) : (
          <table className="min-w-full text-sm">
            <thead className="bg-gray-200 text-left">
              <tr>
                <th className="p-2">Title</th>
                <th className="p-2">Schedule</th>
                <th className="p-2">Slots</th>
                <th className="p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => {
                const status = getStatus(course.id);

                return (
                  <tr key={course.id} className="border-t">
                    <td className="p-2">{course.title}</td>
                    <td className="p-2">{course.schedule}</td>
                    <td className="p-2">{course.slots}</td>
                    <td className="p-2">
                      {status ? (
                        <span className="capitalize text-gray-500 text-sm">
                          {status}
                        </span>
                      ) : (
                        <button
                          onClick={() => handleEnroll(course.id)}
                          className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                        >
                          Enroll
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AvailableCourses;

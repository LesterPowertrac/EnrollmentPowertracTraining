import { useEffect, useState } from 'react';
import axios from '../../../Utils/API/axios';
import echo from '../../../Utils/API/echo'; // 👈 add this

const AdminCourse = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingCourse, setEditingCourse] = useState(null);
  const [form, setForm] = useState({
    title: '',
    code: '',
    description: '',
    schedule: '',
    slots: ''
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  // 👇 Real-time course updates
useEffect(() => {
  const channel = echo.channel('courses'); // 👈 PUBLIC channel

  channel.listen('.CourseChanged', (e) => {
    console.log('📡 CourseChanged:', e.type, e.course);

    setCourses(prev => {
      if (e.type === 'created') {
        const exists = prev.some(c => c.id === e.course.id);
        return exists ? prev : [e.course, ...prev];
      }

      if (e.type === 'updated') {
        return prev.map(c => c.id === e.course.id ? e.course : c);
      }

      if (e.type === 'deleted') {
        return prev.filter(c => c.id !== e.course.id);
      }

      return prev;
    });
  });

  return () => {
    echo.leaveChannel('courses'); // 👈 this should also match `.channel()`
  };
}, []);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/courses');
      setCourses(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      if (editingCourse) {
        await axios.put(`/api/courses/${editingCourse.id}`, form);
      } else {
        await axios.post('/api/courses', form);
      }

      resetForm(); // no need to manually fetchCourses anymore
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving course');
    }
  };

  const resetForm = () => {
    setForm({
      title: '',
      code: '',
      description: '',
      schedule: '',
      slots: ''
    });
    setEditingCourse(null);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this course?')) return;
    try {
      await axios.delete(`/api/courses/${id}`);
      // Immediately update UI just in case real-time doesn't sync fast enough
      setCourses(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleEdit = (course) => {
    setEditingCourse(course);
    setForm({
      title: course.title,
      code: course.code,
      description: course.description || '',
      schedule: course.schedule,
      slots: course.slots
    });
  };

  return (
    <div className="mb-8 ">
      <h2 className="text-xl font-bold mb-4">Course Management</h2>

      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow space-y-3 mb-6">
        <h3 className="text-lg font-semibold">
          {editingCourse ? 'Edit Course' : 'Add New Course'}
        </h3>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required className="border px-3 py-2 rounded" />
          <input name="code" placeholder="Code" value={form.code} onChange={handleChange} required className="border px-3 py-2 rounded" />
          <input name="schedule" placeholder="Schedule" value={form.schedule} onChange={handleChange} required className="border px-3 py-2 rounded" />
          <input name="slots" type="number" placeholder="Slots" value={form.slots} onChange={handleChange} required className="border px-3 py-2 rounded" />
        </div>
        <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} className="border px-3 py-2 rounded w-full" />

        <div className="flex gap-3 mt-2">
          <button type="submit" className="bg-teal-700 text-white px-4 py-2 rounded hover:bg-teal-800 cursor-pointer">
            {editingCourse ? 'Update Course' : 'Create Course'}
          </button>

          {editingCourse && (
            <button
              type="button"
              className="text-gray-600 underline"
              onClick={resetForm}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Course List Table */}
      <div className="overflow-auto rounded shadow bg-white">
        {loading ? (
          <p className="p-4 text-gray-500">Loading courses...</p>
        ) : (
          <table className="min-w-full text-sm">
            <thead className="bg-gray-200 text-left">
              <tr>
                <th className="p-2">Title</th>
                <th className="p-2">Code</th>
                <th className="p-2">Schedule</th>
                <th className="p-2">Slots</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course.id} className="border-t">
                  <td className="p-2">{course.title}</td>
                  <td className="p-2">{course.code}</td>
                  <td className="p-2">{course.schedule}</td>
                  <td className="p-2">{course.slots}</td>
                  <td className="p-2">
                    <button
                      onClick={() => handleEdit(course)}
                      className="text-blue-500 hover:underline text-sm mr-3 cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(course.id)}
                      className="text-red-500 hover:underline text-sm cursor-pointer"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminCourse;

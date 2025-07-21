import { useEffect, useState } from 'react';
import axios from '../../../Utils/API/axios';
import ExportCSVButton from '../../../Components/ExportCSVButton';
import { BlobProvider } from '@react-pdf/renderer';
import EnrollmentPDF from '../../../Components/EnrollmentPDF';
import echo from '../../../Utils/API/echo';


const EnrollmentRequests = () => {
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPdf, setShowPdf] = useState(false);
  const [filters, setFilters] = useState({
    student_name: '',
    course_id: '',
    status: ''
  });

useEffect(() => {
  const channel = echo.channel('activity-log');

  channel.listen('.ActivityLogCreated', (e) => {
    // console.log('📡 ActivityLogCreated event received in admin:', e.log);

    if (e.log.subject_type === 'Enrollment') {
      const newEnrollment = e.log.enrollment;

      if (newEnrollment?.user && newEnrollment?.course) {
        setEnrollments(prev => {
          newEnrollment.created_at = new Date(newEnrollment.created_at);

          const index = prev.findIndex(e => e.id === newEnrollment.id);
          if (index !== -1) {
            const updated = [...prev];
            updated[index] = newEnrollment;
            return updated;
          } else {
            return [newEnrollment, ...prev];
          }
        });
      } else {
        fetchEnrollments(); // fallback if data is incomplete
      }
    }
  });

  return () => {
    echo.leave('activity-log');
  };
}, []);


const fetchEnrollments = async () => {
  setLoading(true);
  try {
    const params = {};
    if (filters.student_name.trim()) params.student_name = filters.student_name;
    if (filters.course_id) params.course_id = filters.course_id;
    if (filters.status) params.status = filters.status;

    const res = await axios.get('/api/enrollments', { params });

    // ✅ Normalize timestamps
    const normalized = res.data.map(e => ({
      ...e,
      created_at: new Date(e.created_at),
    }));

    setEnrollments(normalized);
  } catch (err) {
    console.error(err);
    setError('Failed to load enrollment requests.');
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchEnrollments();
    axios.get('/api/courses').then(res => setCourses(res.data));
  }, []);

  useEffect(() => {
    fetchEnrollments();
    setShowPdf(false); // Hide old PDF on filter change
  }, [filters]);

  const resetFilters = () => {
    setFilters({ student_name: '', course_id: '', status: '' });
  };

  const handleSelect = (id, checked) => {
    setSelectedIds(prev =>
      checked ? [...prev, id] : prev.filter(x => x !== id)
    );
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      const allPending = enrollments.filter(e => e.status === 'pending').map(e => e.id);
      setSelectedIds(allPending);
    } else {
      setSelectedIds([]);
    }
  };

    const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this enrollment?")) return;
    try {
      await axios.delete(`/api/enrollments/${id}`);
      fetchEnrollments();
    } catch (err) {
      console.error('Failed to delete enrollment', err);
      alert("Deletion failed. See console for details.");
    }
  };

  const handleBulkAction = async (action) => {
    if (!selectedIds.length) return;
    if (!window.confirm(`Are you sure you want to ${action} selected enrollments?`)) return;

    try {
      await axios.post(`/api/enrollments/bulk-${action}`, { enrollment_ids: selectedIds });
      setSelectedIds([]);
      fetchEnrollments();
    } catch (err) {
      console.error(`Bulk ${action} failed`, err);
    }
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4">Enrollment Requests</h2>
      {error && <p className="text-red-500 text-sm">{error}</p>}

      {/* Filters + Export Controls */}
      <div className="flex flex-wrap gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by student name..."
          value={filters.student_name}
          onChange={e => setFilters({ ...filters, student_name: e.target.value })}
          className="border p-2 rounded w-1/3"
        />
        <select
          value={filters.course_id}
          onChange={e => setFilters({ ...filters, course_id: e.target.value })}
          className="border p-2 rounded w-1/4"
        >
          <option value="">All Courses</option>
          {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
        </select>
        <select
          value={filters.status}
          onChange={e => setFilters({ ...filters, status: e.target.value })}
          className="border p-2 rounded w-1/4"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
        <button
          onClick={resetFilters}
          className="bg-teal-700 text-white px-4 py-2 rounded hover:bg-teal-800 cursor-pointer"
        >
          Reset Filters
        </button>

{/* PDF Button + Conditional BlobProvider */}
{!showPdf ? (
  <button
    onClick={() => setShowPdf(true)}
    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
  >
    Generate PDF
  </button>
) : (
  <BlobProvider document={<EnrollmentPDF enrollments={enrollments} />}>
    {({ url, loading, error }) => {
      useEffect(() => {
        if (url && !loading && !error) {
          const link = document.createElement('a');
          link.href = url;
          link.download = `enrollments_${Date.now()}.pdf`;
          link.click();
          setShowPdf(false);
        }
      }, [url, loading, error]);

      return loading ? (
        <span className="text-sm text-gray-500">Preparing PDF…</span>
      ) : null;
    }}
  </BlobProvider>
)}



        <ExportCSVButton enrollments={enrollments} filename="filtered_enrollments.csv" />
      </div>

      {/* Bulk Actions */}
      <div className="mb-4">
        <button
          onClick={() => handleBulkAction('approve')}
          disabled={!selectedIds.length}
          className="px-3 py-1 bg-green-700 text-white rounded mr-2 disabled:opacity-50 cursor-pointer"
        >
          Approve Selected
        </button>
        <button
          onClick={() => handleBulkAction('reject')}
          disabled={!selectedIds.length}
          className="px-3 py-1 bg-red-600 text-white rounded mr-2 disabled:opacity-50 cursor-pointer"
        >
          Reject Selected
        </button>
        <button
          onClick={() => handleBulkAction('delete')}
          disabled={!selectedIds.length}
          className="px-3 py-1 bg-gray-600 text-white rounded disabled:opacity-50"
        >
          Delete Selected
        </button>
      </div>

      {/* Data Table */}
      <div className="overflow-auto rounded shadow bg-white">
        {loading ? (
          <p className="p-4 text-gray-500">Loading requests...</p>
        ) : !enrollments.length ? (
          <p className="p-4 text-gray-500">No enrollment requests found.</p>
        ) : (
          <table className="min-w-full text-sm">
            <thead className="bg-gray-200 text-left">
              <tr>
                <th className="p-2">
                  <input
                    type="checkbox"
                    onChange={e => handleSelectAll(e.target.checked)}
                    checked={
                      enrollments.filter(e => e.status === 'pending').length > 0 &&
                      selectedIds.length === enrollments.filter(e => e.status === 'pending').length
                    }
                  />
                </th>
                <th className="p-2">Student</th>
                <th className="p-2">Course</th>
                <th className="p-2">Status</th>
                <th className="p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {enrollments.map(e => (
                <tr key={e.id} className="border-t">
                  <td className="p-2">
                    {e.status === 'pending' && (
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(e.id)}
                        onChange={ev => handleSelect(e.id, ev.target.checked)}
                      />
                    )}
                  </td>
                  <td className="p-2">{e.user?.name || 'N/A'}</td>
                  <td className="p-2">{e.course?.title || 'N/A'}</td>
                  <td className="p-2 capitalize">{e.status}</td>
                  <td className="p-2">
                    <button
                      onClick={() => handleDelete(e.id)}
                      className="text-gray-600 hover:text-red-600 hover:underline text-sm cursor-pointer"
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

export default EnrollmentRequests;

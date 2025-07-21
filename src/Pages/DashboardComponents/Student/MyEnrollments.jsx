import { useEffect, useState } from 'react';
import axios from '../../../Utils/API/axios';
import echo from '../../../Utils/API/echo';

const MyEnrollments = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [summary, setSummary] = useState({ approved: 0, pending: 0, rejected: 0 });

  // ✅ Fetch both enrollments and summary on first load
  useEffect(() => {
    fetchMyEnrollments();
    fetchSummary();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [statusFilter, searchTerm, enrollments]);

  const fetchMyEnrollments = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/enrollments/my');
      setEnrollments(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load your enrollments.');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Added this function
  const fetchSummary = async () => {
    try {
      const res = await axios.get('/api/enrollments/status-summary');
      setSummary(res.data);
    } catch (err) {
      console.error("Failed to fetch summary", err);
    }
  };

  const applyFilters = () => {
    let list = [...enrollments];

    if (statusFilter !== 'all') {
      list = list.filter(e => e.status === statusFilter);
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      list = list.filter(e => e.course?.title?.toLowerCase().includes(term));
    }

    setFiltered(list);
  };

  const handleCancel = async (id) => {
    if (confirm("Cancel this enrollment?")) {
      try {
        await axios.delete(`/api/enrollments/${id}`);
        fetchMyEnrollments();
        fetchSummary(); // optional but good after cancellation
      } catch (err) {
        console.error("Failed to cancel", err);
      }
    }
  };

  // Real-time listener for public "enrollments" channel
  useEffect(() => {
    const channel = echo.channel('enrollments');

    channel.listen('.EnrollmentUpdated', (e) => {
      console.log('🔄 EnrollmentUpdated event received:', e.enrollment);
      fetchMyEnrollments();
      fetchSummary();
    });

    return () => {
      echo.leave('enrollments');
    };
  }, []);

  const total = summary.approved + summary.pending + summary.rejected;

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4">My Enrollments</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-green-100 text-green-800 p-4 rounded shadow">
          <p className="text-sm">Approved</p>
          <h2 className="text-xl font-bold">{summary.approved}</h2>
        </div>
        <div className="bg-yellow-100 text-yellow-800 p-4 rounded shadow">
          <p className="text-sm">Pending</p>
          <h2 className="text-xl font-bold">{summary.pending}</h2>
        </div>
        <div className="bg-red-100 text-red-800 p-4 rounded shadow">
          <p className="text-sm">Rejected</p>
          <h2 className="text-xl font-bold">{summary.rejected}</h2>
        </div>
        <div className="bg-blue-100 text-blue-800 p-4 rounded shadow">
          <p className="text-sm">Total</p>
          <h2 className="text-xl font-bold">{total}</h2>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by course title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border px-3 py-2 rounded w-full md:w-1/2"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border px-3 py-2 rounded w-full md:w-1/4"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <button
        onClick={() => {
          setSearchTerm('');
          setStatusFilter('all');
        }}
        className="text-sm text-blue-600 hover:underline mt-1 md:mt-0 cursor-pointer"
      >
        Clear Filters
      </button>

      {/* Enrollment Table */}
      <div className="overflow-auto rounded shadow bg-white">
        {error && <p className="p-4 text-red-500">{error}</p>}

        {loading ? (
          <p className="p-4 text-gray-500">Loading...</p>
        ) : filtered.length === 0 ? (
          <p className="p-4 text-gray-500">No enrollments found.</p>
        ) : (
          <table className="min-w-full text-sm">
            <thead className="bg-gray-200 text-left">
              <tr>
                <th className="p-2">Course Title</th>
                <th className="p-2">Schedule</th>
                <th className="p-2">Status</th>
                <th className="p-2">Enrolled On</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((enrollment) => (
                <tr key={enrollment.id} className="border-t">
                  <td className="p-2">{enrollment.course?.title || 'N/A'}</td>
                  <td className="p-2">{enrollment.course?.schedule || 'N/A'}</td>
                  <td className="p-2 capitalize">
                    {enrollment.status === 'approved' ? (
                      <div className="text-green-600 font-medium flex flex-col">
                        <span>{enrollment.status}</span>
                        <a
                          href={enrollment.certificate_url}
                          download
                          className="ml-2 text-blue-600 underline text-sm"
                        >
                          Download Certificate
                        </a>
                      </div>
                    ) : enrollment.status === 'rejected' ? (
                      <span className="text-red-600 font-medium">{enrollment.status}</span>
                    ) : (
                      <span className="text-yellow-600 font-medium">
                        {enrollment.status}
                        <button
                          onClick={() => handleCancel(enrollment.id)}
                          className="text-xs text-red-600 hover:underline ml-2"
                        >
                          Cancel
                        </button>
                      </span>
                    )}
                  </td>
                  <td className="p-2">
                    {new Date(enrollment.created_at).toLocaleDateString()}
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

export default MyEnrollments;

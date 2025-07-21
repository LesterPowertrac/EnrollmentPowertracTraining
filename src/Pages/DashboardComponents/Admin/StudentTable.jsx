import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Table from '../../../Components/Table';
import axios from '../../../Utils/API/axios';
import echo from '../../../Utils/API/echo';
import Select from '../../../Components/Select';

const StudentTable = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/students');
      setStudents(res.data);
    } catch (err) {
      console.error("Failed to fetch students", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  fetchStudents(); // ← Ensure it runs once on component mount
}, []);


useEffect(() => {
  const channel = echo.channel('students'); // ✅ CORRECT way to access a public channel
  let timeout;

  const handleStudentChange = () => {
    clearTimeout(timeout);
    timeout = setTimeout(fetchStudents, 300);
  };

  channel.listen('.StudentChanged', handleStudentChange);

  return () => {
    echo.leaveChannel('students'); // ✅ Proper cleanup
    clearTimeout(timeout); // Optional: clear timeout on unmount
  };
}, []);


  const filtered = students.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase())
  );
  const columns = ['Name', 'Email', 'Phone', 'Competence'];
  const data = filtered.map((s) => [
    <button
      onClick={() => navigate(`students/${s.id}`)}
      className="text-left text-blue-600 hover:underline w-full cursor-pointer"
    >
      {s.name}
    </button>,
    s.email,
    s.profile?.phone || '—',
    <span className='text-center'>
      <Select
        name={`competence-${s.id}`}
        value={s.competence?.status || ''}
        onChange={async (e) => {
          try {
            if (s.competence?.id) {
              await axios.post(`/api/competences/${s.competence.id}`, {
                _method: 'PUT',
                user_id: s.id,
                status: e.target.value,
              });
            } else {
              await axios.post('/api/competences', {
                user_id: s.id,
                status: e.target.value,
              });
            }
            fetchStudents(); // Refresh list
          } catch (err) {
            console.error('Failed to update competence', err);
          }
        }}
        options={[
          { value: '', label: 'Select', hidden: true },
          { value: 'Competent', label: 'Competent' },
          { value: 'Not Competent', label: 'Not Competent' },
          { value: 'Not Evaluated', label: 'Not Evaluated' },
        ]}
      />
      <div className="text-sm text-gray-600 mt-1">
        {s.competence?.evaluator?.name && `Evaluated by: ${s.competence.evaluator.name}`}
      </div>
    </span>
  ]);

  if (loading) return <div className="p-4">Loading...</div>;
  
  return (
    <>
      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email"
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <Table columns={columns} data={data} />
    </>
  );
};

export default StudentTable;

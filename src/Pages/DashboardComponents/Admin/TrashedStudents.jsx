import { useEffect, useState } from 'react';
import axios from '../../../Utils/API/axios';
import echo from '../../../Utils/API/echo';
import Button from '../../../Components/Button';
import Table from '../../../Components/Table';

const TrashedStudents = () => {
  const [trashed, setTrashed] = useState([]);
  const [message, setMessage] = useState('');

useEffect(() => {
  const channel = echo.channel('students'); // ✅ Correct way

  const handleStudentChange = (e) => {
    const types = ['deleted', 'restored', 'force-deleted'];
    if (types.includes(e.type)) {
      fetchTrashed();
    }
  };

  channel.listen('.StudentChanged', handleStudentChange); // ✅ Works now

  return () => {
    echo.leaveChannel('students'); // ✅ Proper cleanup
  };
}, []);


  const fetchTrashed = async () => {
    try {
      const res = await axios.get('/api/students/trashed');
      setTrashed(res.data);
    } catch (err) {
      console.error(err);
      setMessage('Failed to load trashed students.');
    }
  };

  const handleRestore = async (id) => {
    try {
      await axios.post(`/api/students/${id}/restore`);
      setMessage('Student restored.');
      fetchTrashed();
    } catch (err) {
      console.error(err);
      setMessage('Failed to restore student.');
    }
  };

    const handleForceDelete = async (id) => {
        if (!confirm("Are you sure you want to permanently delete this student?")) return;

        try {
            await axios.delete(`/api/students/${id}/force`);
            setMessage("Student permanently deleted.");
            fetchTrashed();
        } catch (err) {
            console.error("Force delete failed", err);
            setMessage("Failed to permanently delete student.");
        }
    };


  const columns = ['Name', 'Email', 'Deleted At', 'Actions'];
    const data = trashed.map((s) => [
    s.name,
    s.email,
    new Date(s.deleted_at).toLocaleDateString(),
    <div className="flex gap-2" key={s.id}>
        <Button
        text="Restore"
        size="sm"
        variant="success"
        onClick={() => handleRestore(s.id)}
        />
        <Button
        text="Delete Permanently"
        size="sm"
        variant="danger"
        onClick={() => handleForceDelete(s.id)}
        />
    </div>,
    ]);


  return (
    <div className="p-6 bg-white rounded shadow max-w-4xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Trashed Students</h2>
      {message && <div className="text-green-600 mb-4">{message}</div>}
      <Table columns={columns} data={data} />
    </div>
  );
};

export default TrashedStudents;

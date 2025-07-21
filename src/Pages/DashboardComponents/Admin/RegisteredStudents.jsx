import { useEffect, useState } from 'react';
import { useAuth } from '../../../Utils/AuthContext';
import axios from '../../../Utils/API/axios';
import echo from '../../../Utils/API/echo';
import Input from '../../../Components/Input';
import Button from '../../../Components/Button';
import Table from '../../../Components/Table';
import FileUploadButton from '../../../Components/FileUploadButton';
import Select from '../../../Components/Select';

const RegisteredStudents = () => {
  const { user, loading: authLoading } = useAuth(); // ✅ useAuth for gating
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
    phone: '',
    birthdate: '',
    avatar: null,
  });
  const [editingId, setEditingId] = useState(null);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/students');
      setStudents(res.data);
    } catch (err) {
      console.error('Failed to fetch students', err);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchStudents();
  }, []);

// Real-time Echo listener — only after auth completes
useEffect(() => {
  if (authLoading || !user) return;

  const channel = echo.channel('students'); // ✅ public channel syntax

  channel.listen('.StudentChanged', () => {
    fetchStudents();
  });

  return () => {
    echo.leave('students'); // ✅ no "private-" prefix for public
  };
}, [authLoading, user]);



  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('email', form.email);
    formData.append('address', form.address);
    formData.append('phone', form.phone);
    formData.append('birthdate', form.birthdate);
    if (!editingId) formData.append('password', form.password);
    if (form.avatar) formData.append('avatar', form.avatar);

    let url = '/api/students';
    if (editingId) {
      url = `/api/students/${editingId}`;
      formData.append('_method', 'PUT');
    }

    try {
      await axios.post(url, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setForm({
        name: '',
        email: '',
        password: '',
        address: '',
        phone: '',
        birthdate: '',
        avatar: null,
      });
      setEditingId(null);
      fetchStudents();
    } catch (err) {
      console.error('Failed to submit form', err);
    }
  };

  const handleEdit = (student) => {
    setForm({
      name: student.name,
      email: student.email,
      password: '',
      address: student.profile?.address || '',
      phone: student.profile?.phone || '',
      birthdate: student.profile?.birthdate || '',
      avatar: null,
    });
    setEditingId(student.id);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this student?')) return;
    try {
      await axios.delete(`/api/students/${id}`);
      fetchStudents();
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  const handleRestore = async (id) => {
    try {
      await axios.post(`/api/students/${id}/restore`);
      fetchStudents();
    } catch (err) {
      console.error('Restore failed', err);
    }
  };

  const columns = ['Name', 'Email', 'Phone', 'Competence', 'Actions'];
  const data = students.map((s) => [
    s.name,
    s.email,
    s.profile?.phone || '—',
    <>
      <Select
        key={`competence-${s.id}`}
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
            fetchStudents();
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
    </>,
    <div className="flex gap-2" key={`actions-${s.id}`}>
      {s.deleted_at ? (
        <Button text="Restore" size="sm" variant="success" onClick={() => handleRestore(s.id)} />
      ) : (
        <>
          <Button text="Edit" size="sm" variant="warning" onClick={() => handleEdit(s)} />
          <Button text="Delete" size="sm" variant="danger" onClick={() => handleDelete(s.id)} />
        </>
      )}
    </div>,
  ]);

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-6 bg-white rounded shadow max-w-4xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Register a Student</h2>

      <form onSubmit={handleSubmit} className="mb-6 space-y-4">
        <Input label="Name" name="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <Input label="Email" name="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        <Input label="Address" name="address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
        <Input label="Phone" name="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <Input label="Birthdate" name="birthdate" type="date" value={form.birthdate} onChange={(e) => setForm({ ...form, birthdate: e.target.value })} />
        {!editingId && <Input label="Password" type="password" name="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />}

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Profile Picture</label>
          <FileUploadButton name="file-upload" variant="primary" onFileSelect={(file) => setForm({ ...form, avatar: file })} accept="image/*" />
          {form.avatar && <img src={URL.createObjectURL(form.avatar)} alt="Preview" className="mt-2 h-24 w-24 object-cover rounded-full border" />}
        </div>

        <div className="flex gap-2">
          <Button text={editingId ? 'Update' : 'Create'} type="submit" variant="primary" />
          {editingId && <Button text="Cancel" variant="secondary" onClick={() => { setEditingId(null); setForm({ name: '', email: '', password: '', address: '', phone: '', birthdate: '', avatar: null }); }} />}
        </div>
      </form>

      <h2 className="text-xl font-bold mb-4">Registered Students</h2>
      <Table columns={columns} data={data} />
    </div>
  );
};

export default RegisteredStudents;

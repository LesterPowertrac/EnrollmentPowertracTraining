import Input from '../../../Components/Input';
import Button from '../../../Components/Button';
import { useState, useEffect } from 'react';
import axios from '../../../Utils/API/axios';

const Profile = () => {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    address: '',
    birthdate: '',
    avatar: null,
    avatar_url: ''
  });

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    axios.get('/api/profile').then(res => {
      const { name, profile, avatar_url } = res.data;
      setForm({
        name: name || '',
        phone: profile?.phone || '',
        address: profile?.address || '',
        birthdate: profile?.birthdate || '',
        avatar: null,
        avatar_url: avatar_url || ''
      });
      setLoading(false);
    });
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'avatar' && files[0]) {
      setForm(prev => ({ ...prev, avatar: files[0] }));
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const data = new FormData();
      data.append('name', form.name);
      data.append('phone', form.phone || '');
      data.append('address', form.address || '');
      data.append('birthdate', form.birthdate || '');
      if (form.avatar) data.append('avatar', form.avatar);

      await axios.post('/api/profile', data);
      setMessage('Profile updated successfully!');
    } catch (err) {
      console.error(err);
      setMessage('Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p>Loading profile...</p>;

  return (
    <div className="bg-white p-6 rounded shadow max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">My Profile</h2>

      {message && <p className="mb-4 text-green-600">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Avatar Display & Upload */}
        <div>
          <label className="block text-sm font-medium">Profile Picture</label>
          <div className="flex items-center gap-4 mt-2">
            <img
              src={preview || form.avatar_url}
              alt="Preview"
              className="w-16 h-16 object-cover rounded-full border"
            />
            <input
              type="file"
              name="avatar"
              accept="image/*"
              onChange={handleChange}
              className="border rounded px-3 py-2 w-full"
            />
          </div>
        </div>

        <Input label="Name" name="name" value={form.name} onChange={handleChange} />
        <Input label="Phone" name="phone" value={form.phone} onChange={handleChange} />
        <Input label="Address" name="address" value={form.address} onChange={handleChange} />
        <Input label="Birthdate" name="birthdate" type="date" value={form.birthdate} onChange={handleChange} />

        <Button type="submit" text={submitting ? 'Saving...' : 'Save Changes'} disabled={submitting} />
      </form>
    </div>
  );
};

export default Profile;

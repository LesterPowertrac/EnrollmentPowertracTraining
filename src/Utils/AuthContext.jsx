import { createContext, useContext, useEffect, useState } from 'react';
import axios from './API/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch the authenticated user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Always call the /sanctum/csrf-cookie before any auth-related request
        await axios.get('/sanctum/csrf-cookie');

        const res = await axios.get('/api/user');
        setUser(res.data);
      } catch (err) {
        console.error('Not authenticated:', err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = async (email, password) => {
    await axios.get('/sanctum/csrf-cookie');
    await axios.post('/login', { email, password });

    const userRes = await axios.get('/api/user');
    setUser(userRes.data);

    return userRes.data;
  };

  const logout = async () => {
    await axios.post('/logout');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../lib/store';
import { auth } from '../lib/api/auth';

export function useAuth() {
  const navigate = useNavigate();
  const { setUser } = useStore();

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        const { user, token, refreshToken } = await auth.login(email, password);
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refreshToken);
        setUser(user);
        navigate(user.type === 'student' ? '/dashboard' : '/parent/dashboard');
      } catch (error) {
        console.error('Login failed:', error);
        throw error;
      }
    },
    [navigate, setUser]
  );

  const logout = useCallback(async () => {
    await auth.logout();
    setUser(null);
    navigate('/');
  }, [navigate, setUser]);

  const register = useCallback(
    async (data: {
      email: string;
      password: string;
      name: string;
      userType: 'student' | 'parent';
    }) => {
      try {
        const { user, token, refreshToken } = await auth.register(data);
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refreshToken);
        setUser(user);
        navigate(user.type === 'student' ? '/dashboard' : '/parent/dashboard');
      } catch (error) {
        console.error('Registration failed:', error);
        throw error;
      }
    },
    [navigate, setUser]
  );

  return { login, logout, register };
}
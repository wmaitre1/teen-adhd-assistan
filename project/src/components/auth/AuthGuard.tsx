import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../../lib/store';
import { getCurrentUser } from '../../lib/auth';

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, setUser } = useStore();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
          // Redirect to appropriate login page based on the current path
          if (location.pathname.startsWith('/parent')) {
            navigate('/auth/parent');
          } else {
            navigate('/auth/student');
          }
          return;
        }
        setUser(currentUser);
      } catch (error) {
        console.error('Auth check failed:', error);
        navigate('/auth/error');
      }
    };

    if (!user) {
      checkAuth();
    }
  }, [user, setUser, navigate, location]);

  // Show loading state while checking auth
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Check if user has access to the current route
  const isParentRoute = location.pathname.startsWith('/parent');
  if (isParentRoute && user.role !== 'parent') {
    navigate('/dashboard');
    return null;
  }
  if (!isParentRoute && user.role === 'parent') {
    navigate('/parent/dashboard');
    return null;
  }

  return <>{children}</>;
}
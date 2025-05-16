import { useAuth } from '../context/AuthContext';
import type { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, login } = useAuth();
  
  // For this example, we're just automatically logging in
  // In a real app, we would redirect to a login page
  if (!isAuthenticated) {
    login();
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;
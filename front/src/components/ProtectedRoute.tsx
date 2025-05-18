import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ErrorPage from './ErrorPage';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    // Create a 403 error for unauthorized access
    const error = { status: 403 };
    return <ErrorPage setShowScene={() => {}} />;
  }

  return <>{children}</>;
};

export default ProtectedRoute; 
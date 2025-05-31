import { Navigate } from 'react-router-dom';

export function ProtectedRoute({ children }) {
  const isAuthenticated = !!localStorage.getItem('access_token');
  
  if (!isAuthenticated) {
    return <Navigate to="/connect" replace />;
  }

  return children;
}

export function AuthOnlyRoute({ children }) {
  const isAuthenticated = !!localStorage.getItem('access_token');
  
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}

import { Navigate } from 'react-router-dom';
import { useAuth, homeFor } from '../context/AuthContext';
import Navbar from './Navbar';
import { Spinner } from './ui';

export function ProtectedRoute({ roles, children }) {
  const { user, loading } = useAuth();
  if (loading) return <Spinner />;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to={homeFor(user.role)} replace />;
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </>
  );
}

export function GuestRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <Spinner />;
  if (user) return <Navigate to={homeFor(user.role)} replace />;
  return children;
}
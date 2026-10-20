import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute, GuestRoute } from './components/RouteGuards';
import Login from './pages/Login';
import Register from './pages/Register';
import Stores from './pages/Stores';
import OwnerDashboard from './pages/OwnerDashboard';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
      <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
      <Route path="/stores" element={<ProtectedRoute roles={['USER']}><Stores /></ProtectedRoute>} />
      <Route path="/owner" element={<ProtectedRoute roles={['STORE_OWNER']}><OwnerDashboard /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
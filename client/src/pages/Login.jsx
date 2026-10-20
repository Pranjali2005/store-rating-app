import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api, { errMsg } from '../api';
import { useAuth, homeFor } from '../context/AuthContext';
import { Alert, Button, Field } from '../components/ui';
import AuthLayout from './AuthLayout';

export default function Login() {
  const { saveSession } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', form);
      saveSession(data);
      navigate(homeFor(data.user.role), { replace: true });
    } catch (err) {
      setError(errMsg(err));
    } finally {
      setLoading(false);
    }
  };

  const fill = (email) => setForm({ email, password: 'Test@1234' });

  return (
    <AuthLayout title="Welcome back" subtitle="Log in to rate and discover stores">
      <form onSubmit={submit} className="space-y-4">
        <Alert>{error}</Alert>
        <Field label="Email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <Field label="Password" type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <Button type="submit" loading={loading}>Log in</Button>
      </form>

      <div className="mt-5 rounded-xl bg-slate-50 p-3 text-center text-xs text-slate-500">
        Demo accounts:{' '}
        <button type="button" onClick={() => fill('user1@example.com')} className="font-semibold text-indigo-600">Normal User</button>
        {' · '}
        <button type="button" onClick={() => fill('owner1@example.com')} className="font-semibold text-indigo-600">Store Owner</button>
      </div>

      <p className="mt-5 text-center text-sm text-slate-600">
        New here? <Link to="/register" className="font-semibold text-indigo-600">Create an account</Link>
      </p>
    </AuthLayout>
  );
}
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api, { errMsg } from '../api';
import { useAuth, homeFor } from '../context/AuthContext';
import { Alert, Button, Field } from '../components/ui';
import AuthLayout from './AuthLayout';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_RE = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/;

export default function Register() {
  const { saveSession } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ role: 'USER', name: '', email: '', address: '', password: '', storeName: '' });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    const e = {};
    const n = form.name.trim().length;
    if (n < 20 || n > 60) e.name = 'Name must be 20–60 characters';
    if (!EMAIL_RE.test(form.email.trim())) e.email = 'Enter a valid email address';
    if (!form.address.trim() || form.address.length > 400) e.address = 'Address is required (max 400 characters)';
    if (!PASSWORD_RE.test(form.password)) e.password = '8–16 characters, one uppercase letter and one special character';
    if (form.role === 'STORE_OWNER') {
      const s = form.storeName.trim().length;
      if (s < 2 || s > 100) e.storeName = 'Store name must be 2–100 characters';
    }
    return e;
  };

  const submit = async (ev) => {
    ev.preventDefault();
    setError('');
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length) return;

    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', form);
      saveSession(data);
      navigate(homeFor(data.user.role), { replace: true });
    } catch (err) {
      setError(errMsg(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Create your account" subtitle="Join as a user or register your store">
      <form onSubmit={submit} className="space-y-4" noValidate>
        <Alert>{error}</Alert>

        <div className="grid grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1 text-sm font-medium">
          {[['USER', 'Normal User'], ['STORE_OWNER', 'Store Owner']].map(([val, label]) => (
            <button
              key={val}
              type="button"
              onClick={() => setForm({ ...form, role: val })}
              className={`rounded-lg py-2 transition ${form.role === val ? 'bg-white text-indigo-600 shadow' : 'text-slate-500'}`}
            >
              {label}
            </button>
          ))}
        </div>

        <Field label="Full name (20–60 characters)" value={form.name} onChange={set('name')} error={errors.name} />
        <Field label="Email" type="email" value={form.email} onChange={set('email')} error={errors.email} />
        <Field as="textarea" label="Address" value={form.address} onChange={set('address')} error={errors.address} />
        {form.role === 'STORE_OWNER' && (
          <Field label="Store name" value={form.storeName} onChange={set('storeName')} error={errors.storeName} />
        )}
        <Field label="Password" type="password" value={form.password} onChange={set('password')} error={errors.password} />

        <Button type="submit" loading={loading}>Sign up</Button>
      </form>
      <p className="mt-5 text-center text-sm text-slate-600">
        Already registered? <Link to="/login" className="font-semibold text-indigo-600">Log in</Link>
      </p>
    </AuthLayout>
  );
}
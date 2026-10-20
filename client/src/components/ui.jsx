import { Loader2, AlertCircle } from 'lucide-react';

export const Spinner = ({ label = 'Loading...' }) => (
  <div className="flex items-center justify-center gap-2 py-16 text-slate-500">
    <Loader2 className="animate-spin" size={20} /> {label}
  </div>
);

export const Alert = ({ children }) =>
  children ? (
    <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
      <AlertCircle size={18} className="mt-0.5 shrink-0" /> <span>{children}</span>
    </div>
  ) : null;

export const Field = ({ label, error, ...props }) => (
  <label className="block">
    <span className="mb-1.5 block text-sm font-medium text-slate-700">{label}</span>
    {props.as === 'textarea' ? (
      <textarea
        rows={3}
        {...props}
        className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm outline-none transition focus:ring-4 ${
          error ? 'border-red-400 focus:ring-red-100' : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-100'
        }`}
      />
    ) : (
      <input
        {...props}
        className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm outline-none transition focus:ring-4 ${
          error ? 'border-red-400 focus:ring-red-100' : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-100'
        }`}
      />
    )}
    {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
  </label>
);

export const Button = ({ loading, children, ...props }) => (
  <button
    {...props}
    disabled={loading || props.disabled}
    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:from-indigo-700 hover:to-violet-700 disabled:opacity-60"
  >
    {loading && <Loader2 className="animate-spin" size={16} />}
    {children}
  </button>
);
import { Store } from 'lucide-react';

export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="grid min-h-screen place-items-center bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-500 px-4 py-10">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
        <div className="mb-6 text-center">
          <span className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white">
            <Store />
          </span>
          <h1 className="text-2xl font-extrabold">{title}</h1>
          <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
        </div>
        {children}
      </div>
    </div>
  );
}
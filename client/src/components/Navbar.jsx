import { LogOut, Store } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const initial = user?.name?.charAt(0).toUpperCase() || '?';

  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2 text-lg font-extrabold">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white">
            <Store size={18} />
          </span>
          RateMyStore
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5 rounded-full border border-slate-200 bg-white py-1 pl-1 pr-4 shadow-sm">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-sm font-bold text-white">
              {initial}
            </span>
            <div className="hidden leading-tight sm:block">
              <p className="max-w-40 truncate text-sm font-semibold">{user?.name}</p>
              <p className="text-xs text-slate-500">
                {user?.role === 'STORE_OWNER' ? 'Store Owner' : 'Normal User'}
              </p>
            </div>
          </div>

          <button
            onClick={logout}
            className="group flex items-center gap-2 rounded-full bg-gradient-to-r from-rose-500 to-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-red-500/30 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-red-500/40 active:translate-y-0"
          >
            <LogOut size={16} className="transition-transform group-hover:translate-x-0.5" />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
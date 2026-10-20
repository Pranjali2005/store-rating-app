import { useEffect, useState } from 'react';
import { MapPin, Search, Star } from 'lucide-react';
import api, { errMsg } from '../api';
import StarRating from '../components/StarRating';
import StoreImage from '../components/StoreImage';
import { Alert, Spinner } from '../components/ui';

export default function Stores() {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [savingId, setSavingId] = useState(null);

  // Debounced search
  useEffect(() => {
    const t = setTimeout(async () => {
      setLoading(true);
      setError('');
      try {
        const { data } = await api.get('/stores', { params: { search } });
        setStores(data);
      } catch (e) {
        setError(errMsg(e));
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [search]);

  const rate = async (id, value) => {
    setSavingId(id);
    setError('');
    try {
      const { data } = await api.put(`/stores/${id}/rating`, { value });
      setStores((list) => list.map((s) => (s._id === id ? data : s)));
    } catch (e) {
      setError(errMsg(e));
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Discover stores</h1>
          <p className="mt-1 text-slate-500">Rate your favourites and see what others think.</p>
        </div>
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search stores by name..."
            className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
          />
        </div>
      </div>

      <Alert>{error}</Alert>

      {loading ? (
        <Spinner label="Loading stores..." />
      ) : stores.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center text-slate-500">
          No stores found.
        </div>
      ) : (
        <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {stores.map((s) => (
            <div
              key={s._id}
              className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative">
                <StoreImage src={s.image} alt={s.name} className="aspect-[4/3] w-full" />
                <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-sm font-bold text-amber-700 shadow backdrop-blur">
                  <Star size={14} className="fill-amber-400 text-amber-400" />
                  {s.ratingCount ? s.avgRating.toFixed(1) : '–'}
                </span>
              </div>

              <div className="flex flex-1 flex-col p-5">
                <h2 className="text-lg font-bold leading-snug">{s.name}</h2>
                <p className="mt-2 flex items-start gap-1.5 text-sm text-slate-500">
                  <MapPin size={15} className="mt-0.5 shrink-0" /> {s.address}
                </p>
                <p className="mt-3 text-xs text-slate-400">
                  {s.ratingCount} {s.ratingCount === 1 ? 'rating' : 'ratings'}
                </p>

                <div className="mt-auto border-t border-slate-100 pt-4">
                  <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {s.myRating ? `Your rating: ${s.myRating}/5 (tap to update)` : 'Rate this store'}
                  </p>
                  <StarRating
                    value={s.myRating || 0}
                    onChange={(v) => rate(s._id, v)}
                    disabled={savingId === s._id}
                    size={26}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
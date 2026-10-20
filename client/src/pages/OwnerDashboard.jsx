import { useEffect, useRef, useState } from 'react';
import { Camera, Loader2, MapPin, Star, Trash2, Users } from 'lucide-react';
import api, { errMsg } from '../api';
import { resizeImage } from '../utils/image';
import StarRating from '../components/StarRating';
import StoreImage from '../components/StoreImage';
import { Alert, Spinner } from '../components/ui';

export default function OwnerDashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileRef = useRef(null);

  useEffect(() => {
    api
      .get('/owner/dashboard')
      .then((r) => setData(r.data))
      .catch((e) => setError(errMsg(e)))
      .finally(() => setLoading(false));
  }, []);

  const saveImage = async (image) => {
    setUploading(true);
    setUploadError('');
    try {
      const res = await api.put('/owner/store/image', { image });
      setData((d) => ({ ...d, store: { ...d.store, image: res.data.image } }));
    } catch (err) {
      setUploadError(err.response ? errMsg(err) : err.message);
    } finally {
      setUploading(false);
    }
  };

  const onPick = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    try {
      const image = await resizeImage(file);
      await saveImage(image);
    } catch (err) {
      setUploadError(err.message);
    }
  };

  if (loading) return <Spinner label="Loading dashboard..." />;
  if (error) return <Alert>{error}</Alert>;

  const { store } = data;

  return (
    <div>
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl md:grid md:grid-cols-5">
        <div className="relative h-64 md:col-span-2 md:h-auto md:min-h-80">
          <div className="absolute inset-0">
            <StoreImage src={store.image} alt={store.name} className="h-full w-full" />
          </div>

          <div className="absolute bottom-3 right-3 flex gap-2">
            <input ref={fileRef} type="file" accept="image/*" onChange={onPick} className="hidden" />
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-2 rounded-full bg-white/95 px-4 py-2.5 text-sm font-semibold text-slate-800 shadow-lg transition hover:bg-white disabled:opacity-60"
            >
              {uploading ? <Loader2 size={16} className="animate-spin" /> : <Camera size={16} />}
              {store.image ? 'Change photo' : 'Add store photo'}
            </button>
            {store.image && (
              <button
                onClick={() => saveImage('')}
                disabled={uploading}
                title="Remove photo"
                className="grid h-10 w-10 place-items-center rounded-full bg-white/95 text-slate-700 shadow-lg transition hover:bg-red-500 hover:text-white disabled:opacity-60"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col justify-center bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-500 p-8 text-white md:col-span-3">
          <p className="text-sm font-medium text-white/80">Your store</p>
          <h1 className="mt-1 text-3xl font-extrabold sm:text-4xl">{store.name}</h1>
          <p className="mt-3 flex items-center gap-1.5 text-white/85">
            <MapPin size={16} /> {store.address}
          </p>
          <p className="mt-6 text-sm text-white/70">
            Tip: a bright, landscape photo of your shop front looks best on the store card that
            customers see.
          </p>
        </div>
      </div>

      {uploadError && (
        <div className="mt-4">
          <Alert>{uploadError}</Alert>
        </div>
      )}

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="flex items-center gap-2 text-sm font-medium text-slate-500">
            <Star size={16} className="fill-amber-400 text-amber-400" /> Average rating
          </p>
          <p className="mt-2 text-4xl font-extrabold">
            {data.totalRatings ? data.averageRating.toFixed(1) : '–'}
            <span className="text-lg font-semibold text-slate-400"> / 5</span>
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="flex items-center gap-2 text-sm font-medium text-slate-500">
            <Users size={16} /> Total ratings
          </p>
          <p className="mt-2 text-4xl font-extrabold">{data.totalRatings}</p>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-6 py-4">
          <h2 className="text-lg font-bold">Users who rated your store</h2>
        </div>
        {data.ratings.length === 0 ? (
          <p className="px-6 py-12 text-center text-slate-500">No ratings yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-6 py-3">User</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Rating</th>
                  <th className="px-6 py-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.ratings.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50">
                    <td className="px-6 py-3.5 font-medium">{r.user.name}</td>
                    <td className="px-6 py-3.5 text-slate-500">{r.user.email}</td>
                    <td className="px-6 py-3.5">
                      <StarRating value={r.value} readOnly size={16} />
                    </td>
                    <td className="px-6 py-3.5 text-slate-500">
                      {new Date(r.updatedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
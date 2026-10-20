import { Store } from 'lucide-react';

// Shows the full photo (never cropped) over a blurred copy of itself.
// The parent className must give it a size, e.g. "aspect-[4/3] w-full".
export default function StoreImage({ src, alt = '', className = '' }) {
  return (
    <div
      className={`relative overflow-hidden bg-gradient-to-br from-indigo-100 via-violet-100 to-fuchsia-100 ${className}`}
    >
      {src ? (
        <>
          <img
            src={src}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full scale-125 object-cover opacity-80 blur-2xl"
          />
          <img src={src} alt={alt} className="absolute inset-0 h-full w-full object-contain" />
        </>
      ) : (
        <div className="absolute inset-0 grid place-items-center text-indigo-300">
          <Store size={52} />
        </div>
      )}
    </div>
  );
}
import { useState } from 'react';
import { Star } from 'lucide-react';

export default function StarRating({ value = 0, onChange, readOnly = false, disabled = false, size = 20 }) {
  const [hover, setHover] = useState(0);
  const shown = readOnly ? Math.round(value) : hover || value;

  return (
    <div className="inline-flex items-center gap-0.5" onMouseLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          aria-label={`${n} star`}
          disabled={readOnly || disabled}
          onMouseEnter={() => !readOnly && setHover(n)}
          onClick={() => onChange?.(n)}
          className={readOnly ? 'cursor-default' : 'cursor-pointer transition-transform hover:scale-110 disabled:opacity-60'}
        >
          <Star size={size} className={n <= shown ? 'fill-amber-400 text-amber-400' : 'text-slate-300'} />
        </button>
      ))}
    </div>
  );
}
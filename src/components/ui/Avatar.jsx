import React, { useState } from 'react';

export default function Avatar({
  src,
  alt = '',
  name = '',
  size = 'md',
  status, // 'online' | 'offline' | 'busy'
  className = ''
}) {
  const [hasError, setHasError] = useState(false);

  const sizes = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
    '2xl': 'w-20 h-20 text-xl'
  };

  const statusSizes = {
    xs: 'w-1.5 h-1.5 ring-1',
    sm: 'w-2 h-2 ring-1',
    md: 'w-2.5 h-2.5 ring-2',
    lg: 'w-3 h-3 ring-2',
    xl: 'w-3.5 h-3.5 ring-2',
    '2xl': 'w-4 h-4 ring-2'
  };

  const statusColors = {
    online: 'bg-emerald-500',
    offline: 'bg-slate-400',
    busy: 'bg-amber-500'
  };

  const getInitials = (str) => {
    if (!str) return 'U';
    const parts = str.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return str.slice(0, 2).toUpperCase();
  };

  return (
    <div className={`relative inline-flex shrink-0 ${sizes[size] || sizes.md} ${className}`}>
      {src && !hasError ? (
        <img
          src={src}
          alt={alt || name}
          onError={() => setHasError(true)}
          className="w-full h-full object-cover rounded-full ring-1 ring-slate-200"
        />
      ) : (
        <div className="w-full h-full rounded-full bg-brand-100 text-brand-700 font-semibold flex items-center justify-center ring-1 ring-brand-200">
          {getInitials(name || alt)}
        </div>
      )}
      {status && (
        <span
          className={`absolute bottom-0 right-0 rounded-full ring-white ${statusSizes[size] || statusSizes.md} ${
            statusColors[status] || statusColors.online
          }`}
        />
      )}
    </div>
  );
}

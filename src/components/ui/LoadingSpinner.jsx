import React from 'react';

export default function LoadingSpinner({
  size = 'md',
  message = 'Loading...',
  fullPage = false,
  className = ''
}) {
  const sizeMap = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-[3px]',
    lg: 'w-12 h-12 border-4'
  };

  const content = (
    <div className={`flex flex-col items-center justify-center gap-3 p-6 ${className}`}>
      <div
        className={`${sizeMap[size] || sizeMap.md} rounded-full border-brand-200 border-t-brand-600 animate-spin`}
      />
      {message && <p className="text-xs font-medium text-slate-500">{message}</p>}
    </div>
  );

  if (fullPage) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center w-full">
        {content}
      </div>
    );
  }

  return content;
}

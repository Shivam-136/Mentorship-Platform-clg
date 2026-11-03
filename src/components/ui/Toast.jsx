import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { removeToast } from '../../store/slices/uiSlice';

function ToastItem({ toast }) {
  const dispatch = useDispatch();

  useEffect(() => {
    if (toast.duration) {
      const timer = setTimeout(() => {
        dispatch(removeToast(toast.id));
      }, toast.duration);
      return () => clearTimeout(timer);
    }
  }, [dispatch, toast.id, toast.duration]);

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />,
    error: <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />,
    info: <Info className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />,
  };

  const borderStyles = {
    success: 'border-emerald-200 bg-white text-slate-900',
    error: 'border-rose-200 bg-white text-slate-900',
    warning: 'border-amber-200 bg-white text-slate-900',
    info: 'border-brand-200 bg-white text-slate-900',
  };

  return (
    <div
      role="alert"
      className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-lg transition-all transform ${
        borderStyles[toast.type] || borderStyles.info
      }`}
    >
      {icons[toast.type] || icons.info}
      <div className="flex-1 min-w-0 pr-1">
        {toast.title && (
          <h4 className="text-sm font-semibold text-slate-900 leading-tight">
            {toast.title}
          </h4>
        )}
        {toast.message && (
          <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
            {toast.message}
          </p>
        )}
      </div>
      <button
        type="button"
        onClick={() => dispatch(removeToast(toast.id))}
        className="text-slate-400 hover:text-slate-700 transition p-0.5 rounded-md hover:bg-slate-100"
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

export default function ToastContainer() {
  const toasts = useSelector((state) => state.ui.toasts);

  if (!toasts || toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  );
}


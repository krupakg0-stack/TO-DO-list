import React from 'react';
import { ToastState } from '../types/task';

export const Toast: React.FC<{ toast: ToastState | null }> = ({ toast }) => {
  if (!toast) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-gutter-sm px-gutter-md py-3 rounded-md bg-light-on-surface text-light-surface-container-lowest shadow-lg"
    >
      <span
        className={`material-symbols-outlined text-title-lg ${
          toast.isError ? 'text-danger-container' : 'text-success-container'
        }`}
        aria-hidden="true"
      >
        {toast.isError ? 'error' : 'check_circle'}
      </span>
      <span className="font-label text-label-md">{toast.message}</span>
    </div>
  );
};

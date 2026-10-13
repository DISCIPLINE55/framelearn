import React from 'react';
import { ToastItem } from '../../types';
import { Toast } from './Toast';

export interface ToastContainerProps {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
  position?: 'top-right' | 'top-center' | 'bottom-right' | 'bottom-center';
}

export const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  onDismiss,
  position = 'top-right',
}) => {
  if (toasts.length === 0) return null;

  const positionClasses = {
    'top-right': 'top-20 sm:top-24 right-4 sm:right-6 items-end',
    'top-center': 'top-20 sm:top-24 left-1/2 -translate-x-1/2 items-center',
    'bottom-right': 'bottom-6 right-4 sm:right-6 items-end',
    'bottom-center': 'bottom-6 left-1/2 -translate-x-1/2 items-center',
  };

  return (
    <aside
      aria-label="Notifications"
      className={`fixed z-[9999] flex flex-col gap-3 max-w-full pointer-events-none ${positionClasses[position]}`}
    >
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast toast={toast} onDismiss={onDismiss} />
        </div>
      ))}
    </aside>
  );
};

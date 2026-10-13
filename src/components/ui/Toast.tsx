import React, { useEffect, useState, useRef } from 'react';
import { ToastItem } from '../../types';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, Loader2, X } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface ToastProps {
  toast: ToastItem;
  onDismiss: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  const [isPaused, setIsPaused] = useState(false);
  const remainingTimeRef = useRef<number>(toast.duration ?? 4500);
  const startTimeRef = useRef<number>(Date.now());
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // If duration is 0 or undefined, or loading toast with no duration, don't auto-dismiss
    if (toast.duration === 0 || toast.type === 'loading') {
      return;
    }

    if (!isPaused) {
      startTimeRef.current = Date.now();
      timerRef.current = setTimeout(() => {
        onDismiss(toast.id);
      }, remainingTimeRef.current);
    } else {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        const elapsed = Date.now() - startTimeRef.current;
        remainingTimeRef.current = Math.max(0, remainingTimeRef.current - elapsed);
      }
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isPaused, onDismiss, toast.id, toast.duration, toast.type]);

  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  // Icon mapping
  const renderIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-sage-600 stroke-[2.5] flex-shrink-0" aria-hidden="true" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-600 stroke-[2.5] flex-shrink-0" aria-hidden="true" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-600 stroke-[2.5] flex-shrink-0" aria-hidden="true" />;
      case 'loading':
        return <Loader2 className="w-5 h-5 text-sage-600 animate-spin stroke-[2.5] flex-shrink-0" aria-hidden="true" />;
      case 'info':
      default:
        return <Info className="w-5 h-5 text-navy stroke-[2.5] flex-shrink-0" aria-hidden="true" />;
    }
  };

  // Border & Accent styling
  const typeStyles = {
    success: 'border-l-4 border-l-sage-600 border-sage-300 bg-white',
    error: 'border-l-4 border-l-red-600 border-red-200 bg-white',
    warning: 'border-l-4 border-l-amber-500 border-amber-200 bg-white',
    info: 'border-l-4 border-l-navy border-navy-200 bg-white',
    loading: 'border-l-4 border-l-sage border-sage-300 bg-white',
  };

  const isAlert = toast.type === 'error' || toast.type === 'warning';

  return (
    <div
      role={isAlert ? 'alert' : 'status'}
      aria-live={toast.type === 'error' ? 'assertive' : 'polite'}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        'w-full max-w-sm sm:max-w-md p-4 rounded-frame border-2 transition-all duration-300 ease-out shadow-2xl',
        'flex items-start gap-3 relative overflow-hidden',
        'animate-in fade-in slide-in-from-top-4 duration-200',
        'motion-reduce:transition-none motion-reduce:transform-none motion-reduce:animate-none',
        typeStyles[toast.type]
      )}
      data-testid={`toast-${toast.type}`}
    >
      <div className="pt-0.5">{renderIcon()}</div>

      <div className="flex-1 min-w-0 pr-2">
        {toast.title && (
          <h4 className="text-small font-display font-bold text-navy leading-snug">
            {toast.title}
          </h4>
        )}
        <p className="text-small font-medium text-navy-950 leading-relaxed break-words">
          {toast.message}
        </p>

        {toast.action && (
          <button
            type="button"
            onClick={() => {
              toast.action?.onClick();
              onDismiss(toast.id);
            }}
            className="mt-2 text-caption font-bold text-navy hover:text-sage-700 underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-navy rounded"
          >
            {toast.action.label}
          </button>
        )}
      </div>

      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        aria-label="Dismiss notification"
        className="text-navy-600 hover:text-navy hover:bg-navy/5 p-1 rounded-md transition-colors flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage"
      >
        <X className="w-4 h-4 stroke-[2.5]" aria-hidden="true" />
      </button>
    </div>
  );
};

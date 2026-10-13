import React, { useEffect, useRef } from 'react';
import { Button } from './Button';
import { AlertTriangle, AlertCircle, HelpCircle, X } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'primary';
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  isLoading = false,
  onConfirm,
  onCancel,
}) => {
  const cancelBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isLoading) {
        onCancel();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
      // Focus safe cancel button on open
      setTimeout(() => {
        cancelBtnRef.current?.focus();
      }, 50);
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, isLoading, onCancel]);

  if (!isOpen) return null;

  const renderIcon = () => {
    switch (variant) {
      case 'danger':
        return <AlertCircle className="w-6 h-6 text-red-600 stroke-[2.5]" aria-hidden="true" />;
      case 'warning':
        return <AlertTriangle className="w-6 h-6 text-amber-600 stroke-[2.5]" aria-hidden="true" />;
      case 'primary':
      default:
        return <HelpCircle className="w-6 h-6 text-navy stroke-[2.5]" aria-hidden="true" />;
    }
  };

  const getConfirmButtonVariant = () => {
    switch (variant) {
      case 'danger':
        return 'danger';
      case 'warning':
        return 'secondary';
      case 'primary':
      default:
        return 'primary';
    }
  };

  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-desc"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-navy/80 backdrop-blur-sm transition-opacity"
        onClick={() => {
          if (!isLoading) onCancel();
        }}
      />

      {/* Dialog Box */}
      <div
        className={cn(
          'relative w-full max-w-md bg-white rounded-frame shadow-elevated border-2 border-sage-300 z-10 flex flex-col overflow-hidden',
          'animate-in fade-in zoom-in-95 duration-200 motion-reduce:animate-none'
        )}
      >
        <div className="flex items-start justify-between p-6 pb-4 border-b-2 border-sage-300 bg-surface-light">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-white border border-sage-300 shadow-sm">
              {renderIcon()}
            </div>
            <h3 id="confirm-dialog-title" className="text-h3 font-display font-bold text-navy">
              {title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            aria-label="Close dialog"
            className="rounded-full w-8 h-8 flex items-center justify-center text-navy hover:bg-navy/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        <div className="p-6">
          <p id="confirm-dialog-desc" className="text-body font-medium text-navy-950 leading-relaxed">
            {message}
          </p>
        </div>

        <div className="p-6 pt-4 border-t-2 border-sage-300 bg-surface-light flex items-center justify-end gap-3">
          <Button
            ref={cancelBtnRef}
            variant="outline"
            size="sm"
            onClick={onCancel}
            disabled={isLoading}
          >
            {cancelLabel}
          </Button>
          <Button
            variant={getConfirmButtonVariant()}
            size="sm"
            onClick={onConfirm}
            isLoading={isLoading}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};

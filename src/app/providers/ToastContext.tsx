import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { ToastItem, ToastOptions, ToastType } from '../../types';
import { ToastContainer } from '../../components/ui/ToastContainer';

export interface ToastContextValue {
  toasts: ToastItem[];
  addToast: (type: ToastType, message: string, options?: ToastOptions) => string;
  removeToast: (id: string) => void;
  removeAllToasts: () => void;
  toast: {
    success: (message: string, options?: ToastOptions) => string;
    error: (message: string, options?: ToastOptions) => string;
    warning: (message: string, options?: ToastOptions) => string;
    info: (message: string, options?: ToastOptions) => string;
    loading: (message: string, options?: ToastOptions) => string;
    dismiss: (id: string) => void;
    dismissAll: () => void;
  };
}

const ToastContext = createContext<ToastContextValue | null>(null);

const MAX_TOASTS = 5;
const DEDUPLICATION_WINDOW_MS = 1200;

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const recentMessagesRef = useRef<Map<string, number>>(new Map());

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const removeAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  const addToast = useCallback(
    (type: ToastType, message: string, options?: ToastOptions): string => {
      const now = Date.now();
      const lastSeen = recentMessagesRef.current.get(message);

      // Deduplication: prevent bursts of identical toasts
      if (lastSeen && now - lastSeen < DEDUPLICATION_WINDOW_MS) {
        return '';
      }
      recentMessagesRef.current.set(message, now);

      // Clean up old deduplication entries
      if (recentMessagesRef.current.size > 20) {
        for (const [msg, time] of recentMessagesRef.current.entries()) {
          if (now - time > DEDUPLICATION_WINDOW_MS * 2) {
            recentMessagesRef.current.delete(msg);
          }
        }
      }

      const id = `toast-${now}-${Math.random().toString(36).substring(2, 9)}`;
      const newToast: ToastItem = {
        id,
        type,
        message,
        title: options?.title,
        duration: options?.duration,
        action: options?.action,
        createdAt: now,
      };

      setToasts((prev) => {
        const next = [...prev, newToast];
        if (next.length > MAX_TOASTS) {
          return next.slice(next.length - MAX_TOASTS);
        }
        return next;
      });

      return id;
    },
    []
  );

  const toastMethods = {
    success: useCallback((message: string, options?: ToastOptions) => addToast('success', message, options), [addToast]),
    error: useCallback((message: string, options?: ToastOptions) => addToast('error', message, options), [addToast]),
    warning: useCallback((message: string, options?: ToastOptions) => addToast('warning', message, options), [addToast]),
    info: useCallback((message: string, options?: ToastOptions) => addToast('info', message, options), [addToast]),
    loading: useCallback((message: string, options?: ToastOptions) => addToast('loading', message, options), [addToast]),
    dismiss: removeToast,
    dismissAll: removeAllToasts,
  };

  return (
    <ToastContext.Provider
      value={{
        toasts,
        addToast,
        removeToast,
        removeAllToasts,
        toast: toastMethods,
      }}
    >
      {children}
      <ToastContainer toasts={toasts} onDismiss={removeToast} position="top-right" />
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextValue => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

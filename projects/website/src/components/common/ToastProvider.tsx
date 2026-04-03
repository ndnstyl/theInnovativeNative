import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import Toast, { type ToastData, type ToastVariant } from './Toast';

interface ToastContextValue {
  showToast: (message: string, variant?: ToastVariant, duration?: number) => void;
}

const ToastContext = createContext<ToastContextValue>({
  showToast: () => {},
});

export const useToast = () => useContext(ToastContext);

const DEFAULT_DURATIONS: Record<ToastVariant, number> = {
  success: 5000,
  error: 8000,
  warning: 5000,
  info: 5000,
};

const MAX_VISIBLE = 5;
const DEDUP_WINDOW_MS = 2000;

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const recentMessages = useRef<Map<string, number>>(new Map());

  const showToast = useCallback((message: string, variant: ToastVariant = 'info', duration?: number) => {
    // Deduplicate: skip if same message shown within 2 seconds
    const now = Date.now();
    const dedupKey = `${variant}:${message}`;
    const lastShown = recentMessages.current.get(dedupKey);
    if (lastShown && now - lastShown < DEDUP_WINDOW_MS) return;
    recentMessages.current.set(dedupKey, now);

    // Clean old dedup entries
    recentMessages.current.forEach((ts, key) => {
      if (now - ts > DEDUP_WINDOW_MS * 2) recentMessages.current.delete(key);
    });

    const id = `toast-${now}-${Math.random().toString(36).slice(2, 6)}`;
    const toast: ToastData = {
      id,
      message,
      variant,
      duration: duration || DEFAULT_DURATIONS[variant],
    };

    setToasts(prev => {
      const next = [...prev, toast];
      // Remove oldest if over max
      return next.length > MAX_VISIBLE ? next.slice(next.length - MAX_VISIBLE) : next;
    });
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="toast-container" aria-live="polite" aria-atomic="false">
        {toasts.map(toast => (
          <Toast key={toast.id} toast={toast} onDismiss={dismissToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

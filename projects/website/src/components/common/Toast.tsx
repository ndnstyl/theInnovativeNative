import React, { useEffect, useRef } from 'react';

export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

export interface ToastData {
  id: string;
  message: string;
  variant: ToastVariant;
  duration: number;
}

interface ToastProps {
  toast: ToastData;
  onDismiss: (id: string) => void;
}

const VARIANT_STYLES: Record<ToastVariant, { borderColor: string; icon: string }> = {
  success: { borderColor: '#3fb950', icon: 'fa-circle-check' },
  error: { borderColor: '#ff6b6b', icon: 'fa-circle-exclamation' },
  warning: { borderColor: '#ffaa00', icon: 'fa-triangle-exclamation' },
  info: { borderColor: '#00ffff', icon: 'fa-circle-info' },
};

const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  const timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    timerRef.current = setTimeout(() => onDismiss(toast.id), toast.duration);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [toast.id, toast.duration, onDismiss]);

  const style = VARIANT_STYLES[toast.variant];

  return (
    <div className="toast" style={{ borderLeftColor: style.borderColor }}>
      <i className={`fa-solid ${style.icon}`} style={{ color: style.borderColor, flexShrink: 0 }} />
      <span className="toast__message">{toast.message}</span>
      <button
        className="toast__dismiss"
        onClick={() => onDismiss(toast.id)}
        aria-label="Dismiss"
      >
        <i className="fa-solid fa-xmark" />
      </button>
    </div>
  );
};

export default Toast;

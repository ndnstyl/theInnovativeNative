import React, { useState, useEffect } from 'react';
import { useToast } from './ToastProvider';

const OfflineBanner: React.FC = () => {
  const [isOffline, setIsOffline] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleOffline = () => setIsOffline(true);
    const handleOnline = () => {
      setIsOffline(false);
      showToast('Back online', 'success', 3000);
    };

    // Check initial state
    if (!navigator.onLine) setIsOffline(true);

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);
    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, [showToast]);

  if (!isOffline) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 10001,
      padding: '10px 16px',
      background: 'rgba(255, 170, 0, 0.95)',
      color: '#000',
      fontSize: '14px',
      fontWeight: 600,
      textAlign: 'center',
      backdropFilter: 'blur(8px)',
    }}>
      <i className="fa-solid fa-wifi" style={{ marginRight: '8px', opacity: 0.6 }} />
      You&apos;re offline — some features may not work
    </div>
  );
};

export default OfflineBanner;

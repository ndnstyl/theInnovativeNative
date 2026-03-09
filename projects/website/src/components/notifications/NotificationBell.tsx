import React, { useState, useRef, useEffect } from 'react';
import { useNotificationCount } from '@/hooks/useNotificationCount';
import NotificationDropdown from './NotificationDropdown';

const NotificationBell: React.FC = () => {
  const count = useNotificationCount();
  const [isOpen, setIsOpen] = useState(false);
  const bellRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (bellRef.current && !bellRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handler);
      return () => document.removeEventListener('mousedown', handler);
    }
  }, [isOpen]);

  return (
    <div className="notification-bell" ref={bellRef}>
      <button
        className="notification-bell__trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={`Notifications${count > 0 ? ` (${count} unread)` : ''}`}
      >
        <i className="fa-regular fa-bell" />
        {count > 0 && (
          <span className="notification-bell__badge">
            {count > 99 ? '99+' : count}
          </span>
        )}
      </button>
      <NotificationDropdown isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
};

export default NotificationBell;

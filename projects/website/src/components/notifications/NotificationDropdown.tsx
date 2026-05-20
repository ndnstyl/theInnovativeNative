import React from 'react';
import Link from 'next/link';
import { useNotifications } from '@/hooks/useNotifications';
import NotificationItem from './NotificationItem';

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ isOpen, onClose }) => {
  const { notifications, isLoading, markAsRead, markAllRead } = useNotifications();

  if (!isOpen) return null;

  const hasUnread = notifications.some((n) => !n.is_read);

  return (
    <>
      <div className="notification-dropdown__backdrop" onClick={onClose} />
      <div className="notification-dropdown">
        <div className="notification-dropdown__header">
          <h3>Notifications</h3>
          {hasUnread && (
            <button className="notification-dropdown__mark-all" onClick={markAllRead}>
              Mark all read
            </button>
          )}
        </div>

        <div className="notification-dropdown__list">
          {isLoading ? (
            <div className="notification-dropdown__loading">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="notification-dropdown__skeleton" />
              ))}
            </div>
          ) : notifications.length === 0 ? (
            <div className="notification-dropdown__empty">
              <i className="fa-regular fa-bell" />
              <p>No notifications yet</p>
            </div>
          ) : (
            notifications.slice(0, 20).map((n) => (
              <NotificationItem
                key={n.id}
                notification={n}
                onRead={(id) => { markAsRead(id); onClose(); }}
              />
            ))
          )}
        </div>

        <div className="notification-dropdown__footer">
          <Link href="/notifications" onClick={onClose}>
            See all notifications
          </Link>
        </div>
      </div>
    </>
  );
};

export default NotificationDropdown;

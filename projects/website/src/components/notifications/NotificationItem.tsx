import React from 'react';
import { useRouter } from 'next/router';
import { NOTIFICATION_TYPE_CONFIG } from '@/lib/notifications/notificationTypes';
import type { NotificationWithSource } from '@/types/notifications';

interface NotificationItemProps {
  notification: NotificationWithSource;
  onRead: (id: string) => void;
}

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'now';
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d`;
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onRead }) => {
  const router = useRouter();
  const config = NOTIFICATION_TYPE_CONFIG[notification.type] || NOTIFICATION_TYPE_CONFIG.generic;

  const handleClick = () => {
    if (!notification.is_read) onRead(notification.id);
    const route = config.getRoute(notification.content_type, notification.content_id);
    router.push(route);
  };

  // Build description text
  let descText = '';
  if (notification.group_count > 1 && notification.group_members.length > 0) {
    const names = notification.group_members.slice(0, 2).map((m) => m.name);
    const others = notification.group_count - names.length;
    descText = others > 0
      ? `${names.join(', ')} and ${others} other${others > 1 ? 's' : ''} ${notification.description}`
      : `${names.join(' and ')} ${notification.description}`;
  } else if (notification.source_user) {
    descText = `${notification.source_user.display_name} ${notification.description}`;
  } else {
    descText = notification.description || 'New notification';
  }

  const avatarUrl = notification.source_user?.avatar_url;
  const avatarInitial = notification.source_user?.display_name?.charAt(0).toUpperCase() || '?';

  return (
    <button
      className={`notification-item ${notification.is_read ? '' : 'notification-item--unread'}`}
      onClick={handleClick}
    >
      <div className="notification-item__icon">
        {avatarUrl ? (
          <img src={avatarUrl} alt="" className="notification-item__avatar" />
        ) : (
          <span className="notification-item__avatar notification-item__avatar--placeholder">
            {avatarInitial}
          </span>
        )}
        <span className="notification-item__type-icon">
          <i className={config.icon} />
        </span>
      </div>
      <div className="notification-item__content">
        <p className="notification-item__text">{descText}</p>
        <span className="notification-item__time">{relativeTime(notification.created_at)}</span>
      </div>
      {!notification.is_read && <span className="notification-item__dot" />}
    </button>
  );
};

export default NotificationItem;

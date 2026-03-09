import React from 'react';
import { useNotificationPreferences } from '@/hooks/useNotificationPreferences';
import { NOTIFICATION_TYPE_CONFIG } from '@/lib/notifications/notificationTypes';
import type { NotificationType, NotificationChannel } from '@/types/notifications';

const CONFIGURABLE_TYPES: NotificationType[] = [
  'like_post',
  'comment_post',
  'reply_comment',
  'mention',
  'dm_received',
  'admin_post',
  'event_reminder',
];

const CHANNELS: NotificationChannel[] = ['in_app', 'email'];

const NotificationPreferences: React.FC = () => {
  const { isLoading, toggle, isEnabled } = useNotificationPreferences();

  if (isLoading) {
    return <div className="notification-preferences notification-preferences--loading">Loading...</div>;
  }

  return (
    <div className="notification-preferences">
      <p className="notification-preferences__description">
        Choose how you want to be notified for each type of activity.
      </p>
      <div className="notification-preferences__table">
        <div className="notification-preferences__row notification-preferences__row--header">
          <span>Type</span>
          <span>In-App</span>
          <span>Email</span>
        </div>
        {CONFIGURABLE_TYPES.map((type) => {
          const config = NOTIFICATION_TYPE_CONFIG[type];
          return (
            <div key={type} className="notification-preferences__row">
              <span className="notification-preferences__type">
                <i className={config.icon} />
                {config.label}
              </span>
              {CHANNELS.map((channel) => (
                <label key={channel} className="notification-preferences__toggle">
                  <input
                    type="checkbox"
                    checked={isEnabled(type, channel)}
                    onChange={() => toggle(type, channel)}
                  />
                  <span className="notification-preferences__switch" />
                </label>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NotificationPreferences;

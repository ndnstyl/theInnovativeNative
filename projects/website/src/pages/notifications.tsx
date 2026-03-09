import React from 'react';
import ClassroomLayout from '@/components/layout/ClassroomLayout';
import { useNotifications } from '@/hooks/useNotifications';
import NotificationItem from '@/components/notifications/NotificationItem';

const NotificationsPage: React.FC = () => {
  const { notifications, isLoading, hasMore, loadMore, markAsRead, markAllRead } = useNotifications();
  const hasUnread = notifications.some((n) => !n.is_read);

  return (
    <ClassroomLayout title="Notifications">
      <div className="notifications-page">
        <div className="notifications-page__header">
          <h1>
            <i className="fa-regular fa-bell" />
            Notifications
          </h1>
          {hasUnread && (
            <button className="notifications-page__mark-all" onClick={markAllRead}>
              Mark all as read
            </button>
          )}
        </div>

        <div className="notifications-page__list">
          {isLoading && notifications.length === 0 ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="notification-dropdown__skeleton" />
            ))
          ) : notifications.length === 0 ? (
            <div className="notifications-page__empty">
              <i className="fa-regular fa-bell" />
              <h3>All caught up</h3>
              <p>You have no notifications.</p>
            </div>
          ) : (
            <>
              {notifications.map((n) => (
                <NotificationItem key={n.id} notification={n} onRead={markAsRead} />
              ))}
              {hasMore && (
                <button className="notifications-page__load-more" onClick={loadMore}>
                  Load more
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </ClassroomLayout>
  );
};

export default NotificationsPage;

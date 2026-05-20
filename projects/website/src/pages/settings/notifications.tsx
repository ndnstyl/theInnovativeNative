import React from 'react';
import ClassroomLayout from '@/components/layout/ClassroomLayout';
import NotificationPreferences from '@/components/notifications/NotificationPreferences';

const NotificationSettingsPage: React.FC = () => {
  return (
    <ClassroomLayout title="Notification Settings">
      <div className="notifications-page">
        <div className="notifications-page__header">
          <h1>
            <i className="fa-solid fa-gear" />
            Notification Settings
          </h1>
        </div>
        <NotificationPreferences />
      </div>
    </ClassroomLayout>
  );
};

export default NotificationSettingsPage;

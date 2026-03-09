import React from 'react';
import ClassroomLayout from '@/components/layout/ClassroomLayout';
import EventList from '@/components/calendar/EventList';

const CalendarPage: React.FC = () => {
  return (
    <ClassroomLayout title="Calendar">
      <div className="calendar-page">
        <div className="calendar-page__header">
          <h1>
            <i className="fa-regular fa-calendar" />
            Community Calendar
          </h1>
        </div>
        <EventList />
      </div>
    </ClassroomLayout>
  );
};

export default CalendarPage;

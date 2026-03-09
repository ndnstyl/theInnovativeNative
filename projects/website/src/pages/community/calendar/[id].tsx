import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import ClassroomLayout from '@/components/layout/ClassroomLayout';
import EventDetail from '@/components/calendar/EventDetail';

const EventDetailPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <ClassroomLayout title="Event Details">
      <div className="calendar-page">
        <div className="calendar-page__breadcrumb">
          <Link href="/community/calendar">
            <i className="fa-solid fa-arrow-left" />
            Back to Calendar
          </Link>
        </div>
        {typeof id === 'string' ? (
          <EventDetail occurrenceId={id} />
        ) : (
          <div className="event-detail event-detail--loading">
            <div className="event-detail__skeleton-title" />
          </div>
        )}
      </div>
    </ClassroomLayout>
  );
};

export default EventDetailPage;

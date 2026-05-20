import React from 'react';
import Link from 'next/link';
import { useEventDetail } from '@/hooks/useEventDetail';
import RsvpButton from './RsvpButton';
import AttendeeList from './AttendeeList';
import CategoryBadge from './CategoryBadge';
import TimezoneDisplay from './TimezoneDisplay';

interface EventDetailProps {
  occurrenceId: string;
}

function formatFullDate(iso: string, tz: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: tz,
  });
}

function formatTimeRange(start: string, end: string, tz: string): string {
  const s = new Date(start);
  const e = new Date(end);
  const startStr = s.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: tz });
  const endStr = e.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: tz });
  return `${startStr} - ${endStr}`;
}

const EventDetail: React.FC<EventDetailProps> = ({ occurrenceId }) => {
  const { event, attendees, rsvpCount, userRsvp, isLoading, error } = useEventDetail(occurrenceId);

  if (isLoading) {
    return (
      <div className="event-detail event-detail--loading">
        <div className="event-detail__skeleton-title" />
        <div className="event-detail__skeleton-body" />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="event-detail event-detail--error">
        <i className="fa-solid fa-triangle-exclamation" />
        <h2>Event Not Found</h2>
        <p>{error || 'This event may have been removed.'}</p>
        <Link href="/community/calendar" className="btn btn--secondary">
          Back to Calendar
        </Link>
      </div>
    );
  }

  const isPast = event.status === 'completed' || event.status === 'cancelled';

  return (
    <div className="event-detail">
      {event.cover_image_url && (
        <div className="event-detail__cover">
          <img src={event.cover_image_url} alt={event.display_title} />
        </div>
      )}

      <div className="event-detail__content">
        <div className="event-detail__main">
          <div className="event-detail__header">
            {event.category_name && event.category_color && (
              <CategoryBadge name={event.category_name} color={event.category_color} />
            )}
            {event.status === 'cancelled' && (
              <span className="event-detail__cancelled-tag">Cancelled</span>
            )}
            <h1>{event.display_title}</h1>
          </div>

          <div className="event-detail__schedule">
            <div className="event-detail__schedule-item">
              <i className="fa-regular fa-calendar" />
              <span>{formatFullDate(event.start_time, event.timezone)}</span>
            </div>
            <div className="event-detail__schedule-item">
              <i className="fa-regular fa-clock" />
              <span>{formatTimeRange(event.start_time, event.end_time, event.timezone)}</span>
              <TimezoneDisplay timezone={event.timezone} />
            </div>
            {event.location_url && (
              <div className="event-detail__schedule-item">
                <i className="fa-solid fa-location-dot" />
                <a href={event.location_url} target="_blank" rel="noopener noreferrer">
                  {event.location_url.includes('zoom') ? 'Zoom Meeting' :
                   event.location_url.includes('meet.google') ? 'Google Meet' :
                   'Join Event'}
                </a>
              </div>
            )}
            {event.recurrence_rule && event.recurrence_rule !== 'none' && (
              <div className="event-detail__schedule-item">
                <i className="fa-solid fa-repeat" />
                <span>Repeats {event.recurrence_rule}</span>
              </div>
            )}
          </div>

          {event.display_description && (
            <div className="event-detail__description">
              <h2>About This Event</h2>
              <p>{event.display_description}</p>
            </div>
          )}

          <div className="event-detail__host">
            <h3>Hosted by</h3>
            <div className="event-detail__host-info">
              {event.host_avatar ? (
                <img src={event.host_avatar} alt={event.host_name} className="event-detail__host-avatar" />
              ) : (
                <span className="event-detail__host-avatar event-detail__host-avatar--placeholder">
                  {event.host_name.charAt(0).toUpperCase()}
                </span>
              )}
              <span className="event-detail__host-name">{event.host_name}</span>
            </div>
          </div>
        </div>

        <div className="event-detail__sidebar">
          {!isPast && (
            <RsvpButton
              occurrenceId={occurrenceId}
              initialStatus={userRsvp}
              capacity={event.capacity}
              rsvpCount={rsvpCount}
            />
          )}
          <AttendeeList attendees={attendees} rsvpCount={rsvpCount} capacity={event.capacity} />
        </div>
      </div>
    </div>
  );
};

export default EventDetail;

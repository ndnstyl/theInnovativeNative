import React from 'react';
import Link from 'next/link';
import type { EventWithOccurrence } from '@/types/calendar';
import CategoryBadge from './CategoryBadge';

interface EventCardProps {
  event: EventWithOccurrence;
}

function formatEventDate(iso: string, tz: string): { day: string; month: string; time: string; weekday: string } {
  const d = new Date(iso);
  return {
    day: d.toLocaleDateString('en-US', { day: 'numeric', timeZone: tz }),
    month: d.toLocaleDateString('en-US', { month: 'short', timeZone: tz }),
    weekday: d.toLocaleDateString('en-US', { weekday: 'short', timeZone: tz }),
    time: d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: tz }),
  };
}

function formatTimeRange(start: string, end: string, tz: string): string {
  const s = new Date(start);
  const e = new Date(end);
  const startStr = s.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: tz });
  const endStr = e.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: tz });
  return `${startStr} - ${endStr}`;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const date = formatEventDate(event.start_time, event.timezone);
  const timeRange = formatTimeRange(event.start_time, event.end_time, event.timezone);
  const isFull = event.capacity > 0 && event.rsvp_count >= event.capacity;

  return (
    <Link href={`/community/calendar/${event.occurrence_id}`} className="event-card">
      {event.cover_image_url && (
        <div className="event-card__cover">
          <img src={event.cover_image_url} alt={event.display_title} />
        </div>
      )}
      <div className="event-card__body">
        <div className="event-card__date-block">
          <span className="event-card__month">{date.month}</span>
          <span className="event-card__day">{date.day}</span>
          <span className="event-card__weekday">{date.weekday}</span>
        </div>
        <div className="event-card__info">
          <h3 className="event-card__title">{event.display_title}</h3>
          <div className="event-card__meta">
            <span className="event-card__time">
              <i className="fa-regular fa-clock" />
              {timeRange}
            </span>
            {event.host_name && (
              <span className="event-card__host">
                <i className="fa-regular fa-user" />
                {event.host_name}
              </span>
            )}
          </div>
          <div className="event-card__footer">
            {event.category_name && event.category_color && (
              <CategoryBadge name={event.category_name} color={event.category_color} />
            )}
            <span className="event-card__rsvp-count">
              <i className="fa-solid fa-user-check" />
              {event.rsvp_count}{event.capacity > 0 ? ` / ${event.capacity}` : ''}
              {isFull && <span className="event-card__full-tag">Full</span>}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;

import React from 'react';
import Link from 'next/link';
import type { AttendeeData } from '@/types/calendar';

interface AttendeeListProps {
  attendees: AttendeeData[];
  rsvpCount: number;
  capacity: number;
}

const AttendeeList: React.FC<AttendeeListProps> = ({ attendees, rsvpCount, capacity }) => {
  return (
    <div className="attendee-list">
      <div className="attendee-list__header">
        <h3>
          <i className="fa-solid fa-users" />
          Attendees
          <span className="attendee-list__count">
            {rsvpCount}{capacity > 0 ? ` / ${capacity}` : ''}
          </span>
        </h3>
      </div>

      {capacity > 0 && (
        <div className="attendee-list__capacity-bar">
          <div
            className="attendee-list__capacity-fill"
            style={{ width: `${Math.min((rsvpCount / capacity) * 100, 100)}%` }}
          />
        </div>
      )}

      <div className="attendee-list__grid">
        {attendees.map((a) => (
          <Link
            key={a.user_id}
            href={a.username ? `/members/${a.username}` : '#'}
            className="attendee-list__item"
          >
            {a.avatar_url ? (
              <img src={a.avatar_url} alt={a.display_name} className="attendee-list__avatar" />
            ) : (
              <span className="attendee-list__avatar attendee-list__avatar--placeholder">
                {a.display_name.charAt(0).toUpperCase()}
              </span>
            )}
            <span className="attendee-list__name">{a.display_name}</span>
          </Link>
        ))}
        {attendees.length === 0 && (
          <p className="attendee-list__empty">No attendees yet. Be the first!</p>
        )}
      </div>
    </div>
  );
};

export default AttendeeList;

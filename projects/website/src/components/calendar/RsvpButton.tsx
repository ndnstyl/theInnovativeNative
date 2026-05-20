import React from 'react';
import { useRsvp } from '@/hooks/useRsvp';
import type { RsvpStatus } from '@/types/calendar';

interface RsvpButtonProps {
  occurrenceId: string;
  initialStatus: RsvpStatus | null;
  capacity: number;
  rsvpCount: number;
}

const RsvpButton: React.FC<RsvpButtonProps> = ({ occurrenceId, initialStatus, capacity, rsvpCount }) => {
  const { rsvp, cancelRsvp, isRsvped, isLoading, error } = useRsvp(occurrenceId, initialStatus);

  const isFull = capacity > 0 && rsvpCount >= capacity;

  return (
    <div className="rsvp-button">
      {isRsvped ? (
        <button
          className="rsvp-button__btn rsvp-button__btn--cancel"
          onClick={cancelRsvp}
          disabled={isLoading}
        >
          {isLoading ? (
            <i className="fa-solid fa-spinner fa-spin" />
          ) : (
            <>
              <i className="fa-solid fa-check" />
              Going — Cancel
            </>
          )}
        </button>
      ) : (
        <button
          className="rsvp-button__btn rsvp-button__btn--rsvp"
          onClick={rsvp}
          disabled={isLoading || isFull}
        >
          {isLoading ? (
            <i className="fa-solid fa-spinner fa-spin" />
          ) : isFull ? (
            'Event Full'
          ) : (
            <>
              <i className="fa-solid fa-calendar-check" />
              RSVP
            </>
          )}
        </button>
      )}
      {error && <p className="rsvp-button__error">{error}</p>}
    </div>
  );
};

export default RsvpButton;

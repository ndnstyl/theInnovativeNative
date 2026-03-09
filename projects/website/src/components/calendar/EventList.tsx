import React from 'react';
import { useEvents } from '@/hooks/useEvents';
import EventCard from './EventCard';
import CategoryFilter from './CategoryFilter';

const EventList: React.FC = () => {
  const { events, isLoading, error, view, setView, filterByCategory, setPage, hasMore, totalCount } = useEvents();
  const currentPage = Math.floor(totalCount / 20);

  return (
    <div className="event-list">
      <div className="event-list__controls">
        <div className="event-list__view-toggle">
          <button
            className={`event-list__view-btn ${view === 'upcoming' ? 'active' : ''}`}
            onClick={() => setView('upcoming')}
          >
            Upcoming
          </button>
          <button
            className={`event-list__view-btn ${view === 'past' ? 'active' : ''}`}
            onClick={() => setView('past')}
          >
            Past
          </button>
        </div>
        <CategoryFilter selected={null} onSelect={filterByCategory} />
      </div>

      {error && (
        <div className="event-list__error">
          <i className="fa-solid fa-triangle-exclamation" />
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="event-list__loading">
          <div className="event-list__skeleton" />
          <div className="event-list__skeleton" />
          <div className="event-list__skeleton" />
        </div>
      ) : events.length === 0 ? (
        <div className="event-list__empty">
          <i className="fa-regular fa-calendar" />
          <h3>{view === 'upcoming' ? 'No upcoming events' : 'No past events'}</h3>
          <p>{view === 'upcoming' ? 'Check back soon for new events.' : 'Events you attended will appear here.'}</p>
        </div>
      ) : (
        <>
          <div className="event-list__grid">
            {events.map((evt) => (
              <EventCard key={evt.occurrence_id} event={evt} />
            ))}
          </div>
          {hasMore && (
            <button className="event-list__load-more" onClick={() => setPage(currentPage + 1)}>
              Load More
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default EventList;

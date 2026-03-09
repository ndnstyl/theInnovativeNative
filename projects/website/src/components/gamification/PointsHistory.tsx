import React from 'react';
import { usePointsHistory } from '@/hooks/usePointsHistory';

interface Props {
  memberId: string;
}

const sourceIcons: Record<string, string> = {
  like_received: 'fa-solid fa-heart',
  lesson_completed: 'fa-solid fa-graduation-cap',
  course_completed: 'fa-solid fa-trophy',
  event_attended: 'fa-solid fa-calendar-check',
  admin_award: 'fa-solid fa-star',
  admin_adjustment: 'fa-solid fa-sliders',
  reversal: 'fa-solid fa-rotate-left',
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

const PointsHistory: React.FC<Props> = ({ memberId }) => {
  const { entries, isLoading, loadMore, hasMore } = usePointsHistory(memberId);

  if (isLoading && entries.length === 0) {
    return <div className="points-history__loading">Loading points history...</div>;
  }

  if (entries.length === 0) {
    return <div className="points-history__empty">No points earned yet.</div>;
  }

  return (
    <div className="points-history">
      <h3 className="points-history__title">Points History</h3>
      <ul className="points-history__list">
        {entries.map((entry) => (
          <li key={entry.id} className="points-history__item">
            <i className={sourceIcons[entry.source_type] || 'fa-solid fa-circle'} />
            <span className="points-history__desc">{entry.source_description}</span>
            <span className={`points-history__value ${entry.points > 0 ? 'points-history__value--positive' : 'points-history__value--negative'}`}>
              {entry.points > 0 ? '+' : ''}{entry.points}
            </span>
            <span className="points-history__time">{timeAgo(entry.created_at)}</span>
          </li>
        ))}
      </ul>
      {hasMore && (
        <button className="points-history__load-more" onClick={loadMore}>
          Load More
        </button>
      )}
    </div>
  );
};

export default PointsHistory;

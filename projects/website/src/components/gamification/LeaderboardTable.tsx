import React from 'react';
import LeaderboardRow from './LeaderboardRow';
import type { LeaderboardEntry } from '@/types/gamification';

interface Props {
  entries: LeaderboardEntry[];
  onLoadMore: () => void;
  hasMore: boolean;
  isLoading: boolean;
}

const LeaderboardTable: React.FC<Props> = ({ entries, onLoadMore, hasMore, isLoading }) => {
  if (!isLoading && entries.length === 0) {
    return (
      <div className="leaderboard__empty">
        <i className="fa-solid fa-trophy" />
        <p>No rankings yet — start earning points!</p>
      </div>
    );
  }

  return (
    <div className="leaderboard__table" role="table" aria-label="Leaderboard rankings">
      <div className="leaderboard__header-row" role="row">
        <span role="columnheader">Rank</span>
        <span role="columnheader">Member</span>
        <span role="columnheader">Level</span>
        <span role="columnheader">Points</span>
      </div>
      {entries.map((entry) => (
        <LeaderboardRow key={entry.member_id} entry={entry} />
      ))}
      {hasMore && (
        <button
          className="leaderboard__load-more"
          onClick={onLoadMore}
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : 'Load More'}
        </button>
      )}
    </div>
  );
};

export default LeaderboardTable;

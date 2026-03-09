import React from 'react';
import Link from 'next/link';
import { getBadgeComponent } from './badges';
import type { LeaderboardEntry } from '@/types/gamification';

interface Props {
  entry: LeaderboardEntry;
}

const LeaderboardRow: React.FC<Props> = ({ entry }) => {
  const BadgeIcon = getBadgeComponent(entry.level_number);
  const profileUrl = entry.username ? `/members/${entry.username}` : '#';

  const rankClass =
    entry.rank === 1 ? 'leaderboard__rank--gold' :
    entry.rank === 2 ? 'leaderboard__rank--silver' :
    entry.rank === 3 ? 'leaderboard__rank--bronze' : '';

  return (
    <Link
      href={profileUrl}
      className={`leaderboard__row ${entry.is_current_user ? 'leaderboard__row--current' : ''}`}
      role="row"
    >
      <span className={`leaderboard__rank ${rankClass}`} role="cell">
        #{entry.rank}
      </span>
      <span className="leaderboard__member" role="cell">
        <span className="leaderboard__avatar-wrap">
          {entry.avatar_url ? (
            <img src={entry.avatar_url} alt={entry.display_name} className="leaderboard__avatar" />
          ) : (
            <span className="leaderboard__avatar-fallback">
              {entry.display_name.charAt(0).toUpperCase()}
            </span>
          )}
          <span className="leaderboard__badge-overlay">
            <BadgeIcon size={16} />
          </span>
        </span>
        <span className="leaderboard__name">{entry.display_name}</span>
      </span>
      <span className="leaderboard__level" role="cell">
        {entry.level_name}
      </span>
      <span className="leaderboard__points" role="cell">
        {entry.points.toLocaleString()}
      </span>
    </Link>
  );
};

export default LeaderboardRow;

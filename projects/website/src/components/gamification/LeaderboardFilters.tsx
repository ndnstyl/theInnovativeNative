import React from 'react';
import { useRouter } from 'next/router';
import type { TimeFilter } from '@/types/gamification';

interface Props {
  timeFilter: TimeFilter;
  setTimeFilter: (f: TimeFilter) => void;
}

const filters: { label: string; value: TimeFilter }[] = [
  { label: '7 Days', value: '7d' },
  { label: '30 Days', value: '30d' },
  { label: 'All Time', value: 'all' },
];

const LeaderboardFilters: React.FC<Props> = ({ timeFilter, setTimeFilter }) => {
  const router = useRouter();

  const handleClick = (value: TimeFilter) => {
    setTimeFilter(value);
    router.replace({ query: { ...router.query, period: value } }, undefined, { shallow: true });
  };

  return (
    <div className="leaderboard__filters">
      {filters.map((f) => (
        <button
          key={f.value}
          className={`leaderboard__filter-tab ${timeFilter === f.value ? 'leaderboard__filter-tab--active' : ''}`}
          onClick={() => handleClick(f.value)}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
};

export default LeaderboardFilters;

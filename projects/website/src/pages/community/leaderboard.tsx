import React, { useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import ClassroomLayout from '@/components/layout/ClassroomLayout';
import ProtectedRoute from '@/components/common/ProtectedRoute';
import LeaderboardTable from '@/components/gamification/LeaderboardTable';
import LeaderboardFilters from '@/components/gamification/LeaderboardFilters';
import { useLeaderboard } from '@/hooks/useLeaderboard';
import type { TimeFilter } from '@/types/gamification';

const LeaderboardPage = () => {
  const router = useRouter();
  const { entries, isLoading, error, timeFilter, setTimeFilter, loadMore, hasMore } = useLeaderboard();

  // Sync URL query param on mount
  useEffect(() => {
    const period = router.query.period as TimeFilter;
    if (period && ['7d', '30d', 'all'].includes(period) && period !== timeFilter) {
      setTimeFilter(period);
    }
  }, [router.query.period]);

  return (
    <ClassroomLayout title="Leaderboard">
      <ProtectedRoute>
        <Head>
          <title>Leaderboard | The Innovative Native</title>
        </Head>
        <div className="leaderboard">
          <div className="leaderboard__header">
            <h1>
              <i className="fa-solid fa-trophy" /> Leaderboard
            </h1>
            <span className="leaderboard__live-indicator">
              <span className="leaderboard__live-dot" /> Live
            </span>
          </div>
          <LeaderboardFilters timeFilter={timeFilter} setTimeFilter={setTimeFilter} />
          {error && <p className="leaderboard__error">{error}</p>}
          {isLoading && entries.length === 0 ? (
            <div className="leaderboard__skeleton">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="leaderboard__skeleton-row" />
              ))}
            </div>
          ) : (
            <LeaderboardTable
              entries={entries}
              onLoadMore={loadMore}
              hasMore={hasMore}
              isLoading={isLoading}
            />
          )}
        </div>
      </ProtectedRoute>
    </ClassroomLayout>
  );
};

export default LeaderboardPage;

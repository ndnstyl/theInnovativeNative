import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface ActivityItem {
  id: string;
  type: 'lesson_complete';
  description: string;
  timestamp: string;
}

interface ProfileActivityProps {
  userId: string;
}

const PAGE_SIZE = 20;

const ProfileActivity: React.FC<ProfileActivityProps> = ({ userId }) => {
  const { supabaseClient } = useAuth();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(0);

  useEffect(() => {
    const fetchActivity = async () => {
      setIsLoading(true);

      const { data, error } = await supabaseClient
        .from('lesson_progress')
        .select(`
          id,
          completed_at,
          lessons!inner (title, courses!inner (title))
        `)
        .eq('user_id', userId)
        .eq('completed', true)
        .order('completed_at', { ascending: false })
        .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

      if (!error && data) {
        const items: ActivityItem[] = data.map((row: any) => ({
          id: row.id,
          type: 'lesson_complete' as const,
          description: `Completed "${row.lessons.title}" in ${row.lessons.courses.title}`,
          timestamp: row.completed_at,
        }));

        if (page === 0) {
          setActivities(items);
        } else {
          setActivities(prev => [...prev, ...items]);
        }
        setHasMore(items.length === PAGE_SIZE);
      }
      setIsLoading(false);
    };

    fetchActivity();
  }, [supabaseClient, userId, page]);

  function formatTimeAgo(dateStr: string): string {
    const now = new Date();
    const date = new Date(dateStr);
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / 86400000);
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  return (
    <div className="profile-activity">
      <h2 className="profile-activity__title">Recent Activity</h2>

      {isLoading && activities.length === 0 ? (
        <p className="profile-activity__empty">Loading activity...</p>
      ) : activities.length === 0 ? (
        <p className="profile-activity__empty">No activity yet.</p>
      ) : (
        <div className="profile-activity__list">
          {activities.map((item) => (
            <div key={item.id} className="profile-activity__item">
              <div className="profile-activity__icon">
                <i className="fa-solid fa-graduation-cap"></i>
              </div>
              <div className="profile-activity__content">
                <p>{item.description}</p>
                <span className="profile-activity__time">{formatTimeAgo(item.timestamp)}</span>
              </div>
            </div>
          ))}

          {hasMore && (
            <button
              className="profile-activity__load-more"
              onClick={() => setPage(p => p + 1)}
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : 'Load More'}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfileActivity;

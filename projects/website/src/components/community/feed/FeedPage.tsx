import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import { useFeed } from '@/hooks/useFeed';
import { useRealtimeFeed } from '@/hooks/useRealtimeFeed';
import CategoryFilter from './CategoryFilter';
import PinnedPosts from './PinnedPosts';
import PostCard from './PostCard';
import PostComposer from './PostComposer';
import FeedSkeleton from './FeedSkeleton';
import NewPostsToast from './NewPostsToast';
import type { FeedSort, FeedCategory } from '@/types/feed';

const FeedPage: React.FC = () => {
  const router = useRouter();
  const { supabaseClient, session } = useAuth();
  const [categoryId, setCategoryId] = useState<string | undefined>(undefined);
  const [sort, setSort] = useState<FeedSort>((router.query.sort as FeedSort) || 'recent');
  const [communityId, setCommunityId] = useState<string>('');
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);

  const { posts, loading, error, hasMore, loadMore, refresh } = useFeed({
    categoryId,
    sort,
  });

  const { newPostCount, clearNewPosts, setRefreshCallback } = useRealtimeFeed();
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Fetch community + categories on mount
  useEffect(() => {
    if (!supabaseClient) return;

    supabaseClient
      .from('communities')
      .select('id')
      .limit(1)
      .single()
      .then(({ data }) => {
        if (data) setCommunityId(data.id);
      });

    supabaseClient
      .from('categories')
      .select('id, name')
      .order('display_order', { ascending: true })
      .then(({ data }) => {
        if (data) setCategories(data);
      });
  }, [supabaseClient]);

  // Set refresh callback for realtime
  useEffect(() => {
    setRefreshCallback(refresh);
  }, [setRefreshCallback, refresh]);

  // Infinite scroll via IntersectionObserver
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, loading, loadMore]);

  const handleSortChange = (newSort: FeedSort) => {
    setSort(newSort);
    router.replace({ query: { ...router.query, sort: newSort } }, undefined, { shallow: true });
  };

  const pinnedPosts = posts.filter(p => p.pinned_position !== null);
  const regularPosts = posts.filter(p => p.pinned_position === null);

  return (
    <div className="community-feed">
      <NewPostsToast count={newPostCount} onLoad={clearNewPosts} />

      {session && communityId && (
        <PostComposer
          communityId={communityId}
          categories={categories}
          onPostCreated={refresh}
        />
      )}

      <div className="community-feed__controls">
        <CategoryFilter activeId={categoryId} onChange={setCategoryId} />
        <div className="community-feed__sort">
          <button
            className={`community-feed__sort-btn ${sort === 'recent' ? 'active' : ''}`}
            onClick={() => handleSortChange('recent')}
          >
            Recent
          </button>
          <button
            className={`community-feed__sort-btn ${sort === 'popular' ? 'active' : ''}`}
            onClick={() => handleSortChange('popular')}
          >
            Popular
          </button>
        </div>
      </div>

      {loading && posts.length === 0 ? (
        <FeedSkeleton />
      ) : error ? (
        <div className="community-feed__error" role="alert" aria-live="polite">
          <p>Failed to load feed. <button onClick={refresh}>Retry</button></p>
        </div>
      ) : (
        <>
          <PinnedPosts posts={pinnedPosts} />

          <div className="community-feed__list">
            {regularPosts.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>

          {loading && posts.length > 0 && (
            <div className="community-feed__loading-more">
              <div className="spinner spinner--sm" />
            </div>
          )}

          <div ref={sentinelRef} className="community-feed__sentinel" />

          {!hasMore && posts.length > 0 && (
            <div className="community-feed__end">
              You&apos;ve reached the beginning of the community. Welcome!
            </div>
          )}

          {!loading && posts.length === 0 && (
            <div className="community-feed__empty">
              <i className="fa-regular fa-comments" style={{ fontSize: 48, color: '#333', marginBottom: 16 }}></i>
              <h3>No posts yet</h3>
              <p>Be the first to share something with the community.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FeedPage;

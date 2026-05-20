import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { useAuth } from '@/contexts/AuthContext';
import { getValidToken, getStoredUserId } from '@/lib/auth-token';
import { COMMUNITY_ID } from '@/lib/constants';
import CategoryFilter from './CategoryFilter';
import PostCard from './PostCard';
import PostComposer from './PostComposer';
import FeedSkeleton from './FeedSkeleton';
import type { FeedPost, FeedSort } from '@/types/feed';

const PostModal = dynamic(() => import('./PostModal'), { ssr: false });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const PAGE_SIZE = 20;

/** Direct REST helper — returns parsed JSON or throws */
async function restFetch<T>(path: string, token: string | null): Promise<T> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${token || SUPABASE_ANON_KEY}`,
      'Accept': 'application/json',
    },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || `HTTP ${res.status}`);
  }
  return res.json();
}

const FeedPage: React.FC = () => {
  const router = useRouter();
  const { session } = useAuth();

  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [categoryId, setCategoryId] = useState<string | undefined>(undefined);
  const [sort, setSort] = useState<FeedSort>((router.query.sort as FeedSort) || 'recent');
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [routerReady, setRouterReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const offsetRef = useRef(0);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // ---- Read ?post= param on mount (client-side only — static export) ----
  useEffect(() => {
    if (!router.isReady) return;
    setRouterReady(true);
    const postParam = router.query.post;
    const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (postParam && typeof postParam === 'string' && UUID_RE.test(postParam)) {
      setSelectedPostId(postParam);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady]);

  // ---- Sync ?post= param when selectedPostId changes ----
  useEffect(() => {
    if (!routerReady) return;
    if (selectedPostId) {
      router.push(
        { query: { ...router.query, post: selectedPostId } },
        undefined,
        { shallow: true },
      );
    } else {
      const { post: _removed, ...rest } = router.query;
      router.replace({ query: rest }, undefined, { shallow: true });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPostId, routerReady]);

  // ---- Fetch categories on mount ----
  useEffect(() => {
    const token = getValidToken();
    restFetch<{ id: string; name: string; display_order: number }[]>(
      `categories?community_id=eq.${COMMUNITY_ID}&select=id,name,display_order&order=display_order.asc`,
      token,
    )
      .then(data => setCategories(data || []))
      .catch(() => { /* categories are non-critical */ });
  }, []);

  // ---- Fetch posts ----
  const fetchPosts = useCallback(async (offset: number, append: boolean) => {
    if (append) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }
    setError(null);

    const token = getValidToken();
    const userId = getStoredUserId();

    try {
      // Build query params
      const params = new URLSearchParams();
      params.set('community_id', `eq.${COMMUNITY_ID}`);
      params.set('deleted_at', 'is.null');
      params.set('select', [
        '*',
        'profiles!posts_author_id_fkey(display_name,avatar_url,username,level,is_agent)',
        'categories!posts_category_id_fkey(name)',
      ].join(','));

      if (categoryId) {
        params.set('category_id', `eq.${categoryId}`);
      }

      // Sort: pinned first (asc, nulls last), then created_at desc
      if (sort === 'recent') {
        params.set('order', 'pinned_position.asc.nullslast,created_at.desc');
      } else {
        params.set('order', 'like_count.desc,comment_count.desc');
      }

      params.set('offset', String(offset));
      params.set('limit', String(PAGE_SIZE));

      const rows = await restFetch<any[]>(`posts?${params.toString()}`, token);

      // Map rows into FeedPost shape
      const mapped: FeedPost[] = (rows || []).map((row: any) => ({
        id: row.id,
        community_id: row.community_id,
        author_id: row.author_id,
        category_id: row.category_id,
        title: row.title,
        body: row.body,
        body_html: row.body_html,
        pinned_position: row.pinned_position,
        like_count: row.like_count ?? 0,
        comment_count: row.comment_count ?? 0,
        edited_at: row.edited_at,
        deleted_at: row.deleted_at,
        created_at: row.created_at,
        updated_at: row.updated_at,
        author_display_name: row.profiles?.display_name || 'Unknown',
        author_avatar_url: row.profiles?.avatar_url || null,
        author_username: row.profiles?.username || null,
        author_level: row.profiles?.level ?? 1,
        author_is_agent: row.profiles?.is_agent ?? false,
        category_name: row.categories?.name || null,
        recent_commenters: [],
        last_comment_at: null,
      }));

      // Batch-check user likes
      if (userId && mapped.length > 0) {
        const postIds = mapped.map(p => p.id);
        const idsParam = `in.(${postIds.join(',')})`;
        try {
          const reactions = await restFetch<{ target_id: string }[]>(
            `reactions?user_id=eq.${userId}&target_type=eq.post&target_id=${idsParam}&select=target_id`,
            token,
          );
          const likedIds = new Set((reactions || []).map(r => r.target_id));
          mapped.forEach(p => { p.is_liked = likedIds.has(p.id); });
        } catch {
          // Likes check failing is non-critical
        }
      }

      // Fetch recent commenters for all posts in this batch
      if (mapped.length > 0) {
        const postIds = mapped.map(p => p.id);
        const idsParam = `in.(${postIds.join(',')})`;
        try {
          const comments = await restFetch<{
            post_id: string;
            created_at: string;
            profiles: { display_name: string; avatar_url: string | null } | null;
          }[]>(
            `comments?post_id=${idsParam}&deleted_at=is.null&select=post_id,created_at,profiles!comments_author_id_fkey(display_name,avatar_url)&order=created_at.desc&limit=100`,
            token,
          );

          // Group commenters by post_id, deduplicate by display_name, keep most recent 5
          const commentMap = new Map<string, { commenters: { url: string | null; name: string }[]; lastAt: string }>();
          for (const c of comments || []) {
            if (!commentMap.has(c.post_id)) {
              commentMap.set(c.post_id, { commenters: [], lastAt: c.created_at });
            }
            const entry = commentMap.get(c.post_id)!;
            const name = c.profiles?.display_name || 'Unknown';
            if (!entry.commenters.some(x => x.name === name) && entry.commenters.length < 5) {
              entry.commenters.push({ url: c.profiles?.avatar_url || null, name });
            }
          }

          mapped.forEach(p => {
            const entry = commentMap.get(p.id);
            if (entry) {
              p.recent_commenters = entry.commenters;
              p.last_comment_at = entry.lastAt;
            }
          });
        } catch {
          // Commenters fetch failing is non-critical
        }
      }

      if (append) {
        setPosts(prev => [...prev, ...mapped]);
      } else {
        setPosts(mapped);
      }

      setHasMore(mapped.length === PAGE_SIZE);
      offsetRef.current = offset + mapped.length;
    } catch (err: any) {
      setError(err.message || 'Failed to load feed');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [categoryId, sort]);

  // ---- Initial fetch + refetch on filter/sort change ----
  useEffect(() => {
    offsetRef.current = 0;
    fetchPosts(0, false);
  }, [fetchPosts]);

  // ---- Infinite scroll ----
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading && !loadingMore) {
          fetchPosts(offsetRef.current, true);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, loading, loadingMore, fetchPosts]);

  const handleSortChange = (newSort: FeedSort) => {
    setSort(newSort);
    router.replace({ query: { ...router.query, sort: newSort } }, undefined, { shallow: true });
  };

  const handleRefresh = () => {
    offsetRef.current = 0;
    fetchPosts(0, false);
  };

  return (
    <div className="community-feed">
      {session && (
        <PostComposer
          communityId={COMMUNITY_ID}
          categories={categories}
          onPostCreated={handleRefresh}
        />
      )}

      <div className="community-feed__controls">
        <CategoryFilter categories={categories} activeId={categoryId} onChange={setCategoryId} />
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
        <div className="community-feed__error">
          <p>Failed to load feed. <button onClick={handleRefresh}>Retry</button></p>
        </div>
      ) : (
        <>
          <div className="community-feed__list">
            {posts.map(post => (
              <PostCard
                key={post.id}
                post={post}
                onPostClick={setSelectedPostId}
                onPostDeleted={handleRefresh}
                onPinChanged={handleRefresh}
              />
            ))}
          </div>

          {loadingMore && (
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
      <PostModal
        postId={selectedPostId}
        onClose={() => setSelectedPostId(null)}
        onCommentCountChange={(postId, newCount) => {
          setPosts(prev => prev.map(p =>
            p.id === postId ? { ...p, comment_count: newCount } : p
          ));
        }}
      />
    </div>
  );
};

export default FeedPage;

import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import type { FeedPost, FeedSort } from '@/types/feed';

interface UseFeedOptions {
  categoryId?: string;
  sort?: FeedSort;
  pageSize?: number;
}

export function useFeed(options: UseFeedOptions = {}) {
  const { categoryId, sort = 'recent', pageSize = 20 } = options;
  const { supabaseClient, session } = useAuth();
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const cursorRef = useRef<string | null>(null);

  const fetchPosts = useCallback(async (cursor?: string | null) => {
    if (!supabaseClient) return;
    setLoading(true);
    setError(null);

    try {
      // Get the community ID (single community v1)
      const { data: community } = await supabaseClient
        .from('communities')
        .select('id')
        .limit(1)
        .single();

      if (!community) {
        setError('Community not found');
        setLoading(false);
        return;
      }

      let query = supabaseClient
        .from('posts')
        .select(`
          *,
          profiles!posts_author_id_fkey (display_name, avatar_url, username),
          categories!posts_category_id_fkey (name)
        `)
        .eq('community_id', community.id)
        .is('deleted_at', null);

      if (categoryId) {
        query = query.eq('category_id', categoryId);
      }

      if (sort === 'recent') {
        query = query.order('pinned_position', { ascending: true, nullsFirst: false })
          .order('created_at', { ascending: false });
      } else {
        // Popular: order by engagement (like_count + comment_count desc)
        query = query.order('like_count', { ascending: false })
          .order('comment_count', { ascending: false });
      }

      if (cursor) {
        query = query.lt('created_at', cursor);
      }

      query = query.limit(pageSize);

      const { data, error: fetchError } = await query;

      if (fetchError) {
        setError(fetchError.message);
        setLoading(false);
        return;
      }

      const mapped: FeedPost[] = (data || []).map((row: any) => ({
        id: row.id,
        community_id: row.community_id,
        author_id: row.author_id,
        category_id: row.category_id,
        title: row.title,
        body: row.body,
        body_html: row.body_html,
        pinned_position: row.pinned_position,
        like_count: row.like_count,
        comment_count: row.comment_count,
        edited_at: row.edited_at,
        deleted_at: row.deleted_at,
        created_at: row.created_at,
        updated_at: row.updated_at,
        author_display_name: row.profiles?.display_name || 'Unknown',
        author_avatar_url: row.profiles?.avatar_url || null,
        author_username: row.profiles?.username || null,
        category_name: row.categories?.name || null,
      }));

      // Check if user has liked these posts
      if (session?.user?.id && mapped.length > 0) {
        const postIds = mapped.map(p => p.id);
        const { data: userReactions } = await supabaseClient
          .from('reactions')
          .select('target_id')
          .eq('user_id', session.user.id)
          .eq('target_type', 'post')
          .in('target_id', postIds);

        const likedIds = new Set((userReactions || []).map(r => r.target_id));
        mapped.forEach(p => { p.is_liked = likedIds.has(p.id); });
      }

      if (cursor) {
        setPosts(prev => [...prev, ...mapped]);
      } else {
        setPosts(mapped);
      }

      setHasMore(mapped.length === pageSize);
      if (mapped.length > 0) {
        cursorRef.current = mapped[mapped.length - 1].created_at;
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load feed');
    } finally {
      setLoading(false);
    }
  }, [supabaseClient, session, categoryId, sort, pageSize]);

  useEffect(() => {
    cursorRef.current = null;
    fetchPosts();
  }, [fetchPosts]);

  const loadMore = useCallback(() => {
    if (hasMore && !loading) {
      fetchPosts(cursorRef.current);
    }
  }, [hasMore, loading, fetchPosts]);

  const refresh = useCallback(() => {
    cursorRef.current = null;
    fetchPosts();
  }, [fetchPosts]);

  return { posts, loading, error, hasMore, loadMore, refresh };
}

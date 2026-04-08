import { useState, useEffect, useCallback, useRef } from 'react';
import { getValidToken, getStoredUserId } from '@/lib/auth-token';
import type { FeedPost, FeedComment } from '@/types/feed';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const COMMENTS_PAGE_SIZE = 10;

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

interface UsePostDetailReturn {
  post: FeedPost | null;
  comments: FeedComment[];
  loading: boolean;
  error: string | null;
  hasMoreComments: boolean;
  loadMoreComments: () => void;
  refetchComments: () => void;
}

/**
 * Reusable hook for fetching a single post with its comments.
 * Returns null-ish data when postId is null (modal not open).
 * Uses direct REST fetch — no Supabase JS client.
 */
export function usePostDetail(postId: string | null): UsePostDetailReturn {
  const [post, setPost] = useState<FeedPost | null>(null);
  const [comments, setComments] = useState<FeedComment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMoreComments, setHasMoreComments] = useState(true);
  const commentOffsetRef = useRef(0);

  const fetchComments = useCallback(async (offset: number, append: boolean) => {
    if (!postId) return;
    const token = getValidToken();

    try {
      // Fetch top-level comments (no parent)
      const commentData = await restFetch<any[]>(
        `comments?post_id=eq.${postId}&parent_comment_id=is.null&deleted_at=is.null&select=*,profiles!comments_author_id_fkey(display_name,avatar_url,username)&order=created_at.asc&offset=${offset}&limit=${COMMENTS_PAGE_SIZE}`,
        token,
      );

      if (!commentData || commentData.length === 0) {
        setHasMoreComments(false);
        if (!append) setComments([]);
        return;
      }

      // Fetch replies for these comments
      const commentIds = commentData.map((c: any) => c.id);
      const idsParam = `in.(${commentIds.join(',')})`;
      let repliesMap = new Map<string, FeedComment[]>();

      try {
        const replies = await restFetch<any[]>(
          `comments?parent_comment_id=${idsParam}&select=*,profiles!comments_author_id_fkey(display_name,avatar_url,username)&order=created_at.asc&limit=50`,
          token,
        );

        (replies || []).forEach((r: any) => {
          const mapped: FeedComment = {
            ...r,
            author_display_name: r.profiles?.display_name || 'Unknown',
            author_avatar_url: r.profiles?.avatar_url || null,
            author_username: r.profiles?.username || null,
            replies: [],
          };
          const existing = repliesMap.get(r.parent_comment_id) || [];
          existing.push(mapped);
          repliesMap.set(r.parent_comment_id, existing);
        });
      } catch {
        // Replies fetch failing is non-critical
      }

      // Check user likes on comments
      const userId = getStoredUserId();
      let likedCommentIds = new Set<string>();
      if (userId) {
        const allIds = [
          ...commentIds,
          ...Array.from(repliesMap.values()).flat().map(r => r.id),
        ];
        if (allIds.length > 0) {
          try {
            const reactions = await restFetch<{ target_id: string }[]>(
              `reactions?user_id=eq.${userId}&target_type=eq.comment&target_id=in.(${allIds.join(',')})&select=target_id`,
              token,
            );
            likedCommentIds = new Set((reactions || []).map(r => r.target_id));
          } catch {
            // Like check failing is non-critical
          }
        }
      }

      const mapped: FeedComment[] = commentData.map((c: any) => {
        const replies = (repliesMap.get(c.id) || []).map(r => ({
          ...r,
          is_liked: likedCommentIds.has(r.id),
        }));
        return {
          ...c,
          author_display_name: c.profiles?.display_name || 'Unknown',
          author_avatar_url: c.profiles?.avatar_url || null,
          author_username: c.profiles?.username || null,
          replies,
          is_liked: likedCommentIds.has(c.id),
        };
      });

      setHasMoreComments(commentData.length === COMMENTS_PAGE_SIZE);
      commentOffsetRef.current = offset + commentData.length;

      if (append) {
        setComments(prev => [...prev, ...mapped]);
      } else {
        setComments(mapped);
      }
    } catch (err: any) {
      // Only set error if this is the initial load, not a load-more
      if (!append) {
        setError(err.message || 'Failed to load comments');
      }
    }
  }, [postId]);

  const fetchPost = useCallback(async () => {
    if (!postId) return;
    setLoading(true);
    setError(null);
    commentOffsetRef.current = 0;

    const token = getValidToken();
    const userId = getStoredUserId();

    try {
      // Fetch post with author profile and category via REST join
      const rows = await restFetch<any[]>(
        `posts?id=eq.${postId}&deleted_at=is.null&select=*,profiles!posts_author_id_fkey(display_name,avatar_url,username,level,is_agent),categories!posts_category_id_fkey(name)`,
        token,
      );

      if (!rows || rows.length === 0) {
        setError('Post not found');
        setPost(null);
        setLoading(false);
        return;
      }

      const row = rows[0];
      const mappedPost: FeedPost = {
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
      };

      // Check if current user liked this post
      if (userId) {
        try {
          const reactions = await restFetch<{ id: string }[]>(
            `reactions?user_id=eq.${userId}&target_type=eq.post&target_id=eq.${postId}&select=id&limit=1`,
            token,
          );
          mappedPost.is_liked = (reactions && reactions.length > 0) || false;
        } catch {
          // Like check failing is non-critical
        }
      }

      setPost(mappedPost);

      // Fetch first batch of comments
      await fetchComments(0, false);
    } catch (err: any) {
      setError(err.message || 'Failed to load post');
    } finally {
      setLoading(false);
    }
  }, [postId, fetchComments]);

  // Fetch post when postId changes
  useEffect(() => {
    if (!postId) {
      setPost(null);
      setComments([]);
      setError(null);
      setLoading(false);
      setHasMoreComments(true);
      commentOffsetRef.current = 0;
      return;
    }
    fetchPost();
  }, [postId, fetchPost]);

  const loadMoreComments = useCallback(() => {
    if (hasMoreComments) {
      fetchComments(commentOffsetRef.current, true);
    }
  }, [hasMoreComments, fetchComments]);

  const refetchComments = useCallback(() => {
    commentOffsetRef.current = 0;
    fetchComments(0, false);
  }, [fetchComments]);

  return { post, comments, loading, error, hasMoreComments, loadMoreComments, refetchComments };
}

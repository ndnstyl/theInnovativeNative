import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import type { FeedPost, FeedComment, FeedAttachment, FeedPoll } from '@/types/feed';

export function usePost(postId: string) {
  const { supabaseClient, session } = useAuth();
  const [post, setPost] = useState<FeedPost | null>(null);
  const [comments, setComments] = useState<FeedComment[]>([]);
  const [attachments, setAttachments] = useState<FeedAttachment[]>([]);
  const [poll, setPoll] = useState<FeedPoll | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMoreComments, setHasMoreComments] = useState(true);
  const commentOffsetRef = useRef(0);

  const fetchPost = useCallback(async () => {
    if (!supabaseClient || !postId) return;
    setLoading(true);
    setError(null);

    try {
      // Fetch post with author and category
      const { data: postData, error: postError } = await supabaseClient
        .from('posts')
        .select(`
          *,
          profiles!posts_author_id_fkey (display_name, avatar_url, username),
          categories!posts_category_id_fkey (name)
        `)
        .eq('id', postId)
        .is('deleted_at', null)
        .single();

      if (postError || !postData) {
        setError('Post not found');
        setLoading(false);
        return;
      }

      const mappedPost: FeedPost = {
        ...postData,
        author_display_name: (postData as any).profiles?.display_name || 'Unknown',
        author_avatar_url: (postData as any).profiles?.avatar_url || null,
        author_username: (postData as any).profiles?.username || null,
        author_level: (postData as any).profiles?.level ?? 1,
        category_name: (postData as any).categories?.name || null,
        recent_commenters: [],
        last_comment_at: null,
      };

      // Check if liked
      if (session?.user?.id) {
        const { data: reaction } = await supabaseClient
          .from('reactions')
          .select('id')
          .eq('user_id', session.user.id)
          .eq('target_type', 'post')
          .eq('target_id', postId)
          .limit(1);
        mappedPost.is_liked = (reaction && reaction.length > 0) || false;
      }

      setPost(mappedPost);

      // Fetch attachments
      const { data: attachData } = await supabaseClient
        .from('post_attachments')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      setAttachments((attachData as FeedAttachment[]) || []);

      // Fetch poll if exists
      const { data: pollData } = await supabaseClient
        .from('polls')
        .select('*, poll_options(*)')
        .eq('post_id', postId)
        .single();

      if (pollData) {
        setPoll({
          ...pollData,
          options: ((pollData as any).poll_options || []).sort(
            (a: any, b: any) => a.display_order - b.display_order
          ),
        });
      }

      // Fetch first batch of comments
      await fetchComments(0);
    } catch (err: any) {
      setError(err.message || 'Failed to load post');
    } finally {
      setLoading(false);
    }
  }, [supabaseClient, session, postId]);

  const fetchComments = useCallback(async (offset: number) => {
    if (!supabaseClient || !postId) return;

    const { data: commentData } = await supabaseClient
      .from('comments')
      .select(`
        *,
        profiles!comments_author_id_fkey (display_name, avatar_url, username)
      `)
      .eq('post_id', postId)
      .is('parent_comment_id', null)
      .order('created_at', { ascending: true })
      .range(offset, offset + 9);

    if (!commentData || commentData.length === 0) {
      setHasMoreComments(false);
      return;
    }

    // Fetch replies for these comments
    const commentIds = commentData.map(c => c.id);
    const { data: replies } = await supabaseClient
      .from('comments')
      .select(`
        *,
        profiles!comments_author_id_fkey (display_name, avatar_url, username)
      `)
      .in('parent_comment_id', commentIds)
      .order('created_at', { ascending: true })
      .limit(50);

    const repliesMap = new Map<string, FeedComment[]>();
    (replies || []).forEach((r: any) => {
      const mapped: FeedComment = {
        ...r,
        author_display_name: r.profiles?.display_name || 'Unknown',
        author_avatar_url: r.profiles?.avatar_url || null,
        author_username: r.profiles?.username || null,
      };
      const existing = repliesMap.get(r.parent_comment_id) || [];
      existing.push(mapped);
      repliesMap.set(r.parent_comment_id, existing);
    });

    const mapped: FeedComment[] = commentData.map((c: any) => ({
      ...c,
      author_display_name: c.profiles?.display_name || 'Unknown',
      author_avatar_url: c.profiles?.avatar_url || null,
      author_username: c.profiles?.username || null,
      replies: repliesMap.get(c.id) || [],
    }));

    setHasMoreComments(commentData.length === 10);
    commentOffsetRef.current = offset + commentData.length;

    if (offset === 0) {
      setComments(mapped);
    } else {
      setComments(prev => [...prev, ...mapped]);
    }
  }, [supabaseClient, postId]);

  useEffect(() => {
    commentOffsetRef.current = 0;
    fetchPost();
  }, [fetchPost]);

  const loadMoreComments = useCallback(() => {
    if (hasMoreComments) {
      fetchComments(commentOffsetRef.current);
    }
  }, [hasMoreComments, fetchComments]);

  return { post, comments, attachments, poll, loading, error, hasMoreComments, loadMoreComments };
}

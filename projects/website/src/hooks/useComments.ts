import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import type { FeedComment, CreateCommentPayload } from '@/types/feed';

export function useComments(postId: string) {
  const { supabaseClient, session } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addComment = useCallback(async (payload: CreateCommentPayload): Promise<FeedComment | null> => {
    if (!supabaseClient || !session?.user?.id) return null;
    setLoading(true);
    setError(null);

    try {
      const { data, error: insertError } = await supabaseClient
        .from('comments')
        .insert({
          post_id: payload.post_id,
          author_id: payload.author_id,
          parent_comment_id: payload.parent_comment_id || null,
          body: payload.body,
          body_html: payload.body_html,
        })
        .select(`
          *,
          profiles!comments_author_id_fkey (display_name, avatar_url, username)
        `)
        .single();

      if (insertError) throw insertError;

      const mapped: FeedComment = {
        ...data,
        author_display_name: (data as any).profiles?.display_name || 'Unknown',
        author_avatar_url: (data as any).profiles?.avatar_url || null,
        author_username: (data as any).profiles?.username || null,
        replies: [],
      };

      return mapped;
    } catch (err: any) {
      setError(err.message || 'Failed to add comment');
      return null;
    } finally {
      setLoading(false);
    }
  }, [supabaseClient, session]);

  const deleteComment = useCallback(async (commentId: string, hasReplies: boolean): Promise<boolean> => {
    if (!supabaseClient) return false;
    setLoading(true);

    try {
      if (hasReplies) {
        // Soft-delete: set deleted_at so replies remain visible
        const { error: updateError } = await supabaseClient
          .from('comments')
          .update({ deleted_at: new Date().toISOString() })
          .eq('id', commentId);

        if (updateError) throw updateError;
      } else {
        // Hard delete
        const { error: deleteError } = await supabaseClient
          .from('comments')
          .delete()
          .eq('id', commentId);

        if (deleteError) throw deleteError;
      }

      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to delete comment');
      return false;
    } finally {
      setLoading(false);
    }
  }, [supabaseClient]);

  return { addComment, deleteComment, loading, error };
}

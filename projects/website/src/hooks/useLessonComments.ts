import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import type { LessonCommentWithAuthor } from '@/types/supabase';

/**
 * Comment CRUD with threading for lesson discussions.
 */
export function useLessonComments(lessonId: string | undefined) {
  const { supabaseClient, session } = useAuth();
  const [comments, setComments] = useState<LessonCommentWithAuthor[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchComments = useCallback(async () => {
    if (!lessonId) return;
    setLoading(true);
    try {
      // Fetch all comments for this lesson, joined with author profiles
      const { data, error } = await supabaseClient
        .from('lesson_comments')
        .select(`
          *,
          author:profiles!lesson_comments_author_id_fkey (
            id,
            display_name,
            avatar_url
          )
        `)
        .eq('lesson_id', lessonId)
        .is('deleted_at', null)
        .order('created_at', { ascending: true });

      if (error) {
        // Fallback: fetch without join if FK name doesn't match
        const { data: fallbackData, error: fallbackErr } = await supabaseClient
          .from('lesson_comments')
          .select('*')
          .eq('lesson_id', lessonId)
          .is('deleted_at', null)
          .order('created_at', { ascending: true });

        if (fallbackErr) throw fallbackErr;

        // Fetch author profiles separately
        const authorIds = Array.from(new Set((fallbackData ?? []).map((c) => c.author_id)));
        const { data: profiles } = await supabaseClient
          .from('profiles')
          .select('id, display_name, avatar_url')
          .in('id', authorIds);

        const profileMap = new Map(
          (profiles ?? []).map((p) => [p.id, p])
        );

        const flat: LessonCommentWithAuthor[] = (fallbackData ?? []).map((c) => ({
          ...c,
          author: profileMap.get(c.author_id) ?? {
            id: c.author_id,
            display_name: 'Unknown',
            avatar_url: null,
          },
        }));

        // Build threaded structure
        setComments(buildThreads(flat));
        return;
      }

      // Build threaded structure from joined data
      const flat: LessonCommentWithAuthor[] = (data ?? []).map((c: any) => ({
        ...c,
        author: c.author ?? {
          id: c.author_id,
          display_name: 'Unknown',
          avatar_url: null,
        },
      }));

      setComments(buildThreads(flat));
    } catch (err) {
      console.error('Error fetching lesson comments:', err);
    } finally {
      setLoading(false);
    }
  }, [supabaseClient, lessonId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const addComment = useCallback(
    async (body: string, bodyHtml: string, parentId?: string): Promise<boolean> => {
      if (!lessonId || !session?.user?.id) return false;
      try {
        const { error } = await supabaseClient.from('lesson_comments').insert({
          lesson_id: lessonId,
          author_id: session.user.id,
          parent_comment_id: parentId ?? null,
          body,
          body_html: bodyHtml,
        });

        if (error) throw error;
        await fetchComments();
        return true;
      } catch (err) {
        console.error('Error adding comment:', err);
        return false;
      }
    },
    [supabaseClient, session?.user?.id, lessonId, fetchComments]
  );

  const editComment = useCallback(
    async (commentId: string, body: string, bodyHtml: string): Promise<boolean> => {
      try {
        const { error } = await supabaseClient
          .from('lesson_comments')
          .update({ body, body_html: bodyHtml })
          .eq('id', commentId);

        if (error) throw error;
        await fetchComments();
        return true;
      } catch (err) {
        console.error('Error editing comment:', err);
        return false;
      }
    },
    [supabaseClient, fetchComments]
  );

  const deleteComment = useCallback(
    async (commentId: string): Promise<boolean> => {
      try {
        const { error } = await supabaseClient
          .from('lesson_comments')
          .update({ deleted_at: new Date().toISOString() })
          .eq('id', commentId);

        if (error) throw error;
        await fetchComments();
        return true;
      } catch (err) {
        console.error('Error deleting comment:', err);
        return false;
      }
    },
    [supabaseClient, fetchComments]
  );

  return {
    comments,
    loading,
    addComment,
    editComment,
    deleteComment,
    refetch: fetchComments,
  };
}

/**
 * Build a threaded comment tree from a flat list.
 * Top-level comments have parent_comment_id === null.
 */
function buildThreads(flat: LessonCommentWithAuthor[]): LessonCommentWithAuthor[] {
  const map = new Map<string, LessonCommentWithAuthor>();
  const roots: LessonCommentWithAuthor[] = [];

  flat.forEach((c) => {
    map.set(c.id, { ...c, replies: [] });
  });

  flat.forEach((c) => {
    const node = map.get(c.id)!;
    if (c.parent_comment_id && map.has(c.parent_comment_id)) {
      map.get(c.parent_comment_id)!.replies!.push(node);
    } else {
      roots.push(node);
    }
  });

  return roots;
}

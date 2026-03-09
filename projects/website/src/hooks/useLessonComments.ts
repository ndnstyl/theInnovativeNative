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
      // Fetch comments then join profiles separately (user_id FK)
      const { data: rawComments, error } = await supabaseClient
        .from('lesson_comments')
        .select('*')
        .eq('lesson_id', lessonId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Fetch author profiles separately
      const authorIds = Array.from(new Set((rawComments ?? []).map((c) => c.user_id)));
      const { data: profiles } = authorIds.length > 0
        ? await supabaseClient
            .from('profiles')
            .select('id, display_name, avatar_url')
            .in('id', authorIds)
        : { data: [] };

      const profileMap = new Map(
        (profiles ?? []).map((p) => [p.id, p])
      );

      const flat: LessonCommentWithAuthor[] = (rawComments ?? []).map((c) => ({
        ...c,
        author: profileMap.get(c.user_id) ?? {
          id: c.user_id,
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
    async (body: string, _bodyHtml: string, parentId?: string): Promise<boolean> => {
      if (!lessonId || !session?.user?.id) return false;
      try {
        const { error } = await supabaseClient.from('lesson_comments').insert({
          lesson_id: lessonId,
          user_id: session.user.id,
          parent_id: parentId ?? null,
          content: body,
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
    async (commentId: string, body: string, _bodyHtml: string): Promise<boolean> => {
      try {
        const { error } = await supabaseClient
          .from('lesson_comments')
          .update({ content: body })
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
          .delete()
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
 * Top-level comments have parent_id === null.
 */
function buildThreads(flat: LessonCommentWithAuthor[]): LessonCommentWithAuthor[] {
  const map = new Map<string, LessonCommentWithAuthor>();
  const roots: LessonCommentWithAuthor[] = [];

  flat.forEach((c) => {
    map.set(c.id, { ...c, replies: [] });
  });

  flat.forEach((c) => {
    const node = map.get(c.id)!;
    if (c.parent_id && map.has(c.parent_id)) {
      map.get(c.parent_id)!.replies!.push(node);
    } else {
      roots.push(node);
    }
  });

  return roots;
}

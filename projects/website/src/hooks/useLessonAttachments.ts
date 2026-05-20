import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import type { LessonAttachment } from '@/types/supabase';

/**
 * Attachment CRUD + Supabase Storage upload for lesson files.
 */
export function useLessonAttachments(lessonId: string | undefined) {
  const { supabaseClient, session } = useAuth();
  const [attachments, setAttachments] = useState<LessonAttachment[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const fetchAttachments = useCallback(async () => {
    if (!lessonId) return;
    setLoading(true);
    try {
      const { data, error } = await supabaseClient
        .from('lesson_attachments')
        .select('*')
        .eq('lesson_id', lessonId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setAttachments(data ?? []);
    } catch {
      // Fetch failed — empty attachment list shown
    } finally {
      setLoading(false);
    }
  }, [supabaseClient, lessonId]);

  useEffect(() => {
    fetchAttachments();
  }, [fetchAttachments]);

  const uploadAttachment = useCallback(
    async (file: File): Promise<LessonAttachment | null> => {
      if (!lessonId || !session?.user?.id) return null;
      setUploading(true);

      try {
        // Upload to Supabase Storage
        const filePath = `lesson-attachments/${lessonId}/${Date.now()}-${file.name}`;
        const { error: uploadErr } = await supabaseClient.storage
          .from('classroom')
          .upload(filePath, file);

        if (uploadErr) throw uploadErr;

        // Create database record
        const { data, error: insertErr } = await supabaseClient
          .from('lesson_attachments')
          .insert({
            lesson_id: lessonId,
            file_name: file.name,
            file_path: filePath,
            file_type: file.type || 'application/octet-stream',
            file_size: file.size,
          })
          .select()
          .single();

        if (insertErr) throw insertErr;
        await fetchAttachments();
        return data;
      } catch {
        return null;
      } finally {
        setUploading(false);
      }
    },
    [supabaseClient, session?.user?.id, lessonId, fetchAttachments]
  );

  const deleteAttachment = useCallback(
    async (attachment: LessonAttachment): Promise<boolean> => {
      try {
        // Delete from storage
        const { error: storageErr } = await supabaseClient.storage
          .from('classroom')
          .remove([attachment.file_path]);

        // Storage delete failure is non-critical — DB record still removed

        // Delete from database
        const { error: dbErr } = await supabaseClient
          .from('lesson_attachments')
          .delete()
          .eq('id', attachment.id);

        if (dbErr) throw dbErr;
        await fetchAttachments();
        return true;
      } catch {
        return false;
      }
    },
    [supabaseClient, fetchAttachments]
  );

  const getDownloadUrl = useCallback(
    (filePath: string): string => {
      const { data } = supabaseClient.storage
        .from('classroom')
        .getPublicUrl(filePath);

      return data.publicUrl;
    },
    [supabaseClient]
  );

  return {
    attachments,
    loading,
    uploading,
    uploadAttachment,
    deleteAttachment,
    getDownloadUrl,
    refetch: fetchAttachments,
  };
}

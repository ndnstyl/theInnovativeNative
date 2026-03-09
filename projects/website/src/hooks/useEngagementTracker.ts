import { useCallback, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import type { Json } from '@/types/supabase';

type EngagementEvent =
  | 'lesson_view'
  | 'video_play'
  | 'video_pause'
  | 'video_complete'
  | 'content_scroll'
  | 'attachment_download'
  | 'comment_post'
  | 'lesson_complete';

/**
 * Fire-and-forget engagement tracking.
 * Inserts rows into content_engagement_log without blocking UI.
 * Deduplicates rapid events via a 2-second cooldown per event type.
 */
export function useEngagementTracker() {
  const { supabaseClient, session } = useAuth();
  const cooldownMap = useRef<Record<string, number>>({});

  const track = useCallback(
    (
      lessonId: string,
      courseId: string,
      eventType: EngagementEvent,
      eventMeta?: Record<string, Json>
    ) => {
      if (!session?.user?.id) return;

      // Cooldown: skip if same event fired within last 2s
      const key = `${eventType}:${lessonId}`;
      const now = Date.now();
      if (cooldownMap.current[key] && now - cooldownMap.current[key] < 2000) return;
      cooldownMap.current[key] = now;

      // Fire and forget — no await, no error surfacing to UI
      supabaseClient
        .from('content_engagement_log')
        .insert({
          user_id: session.user.id,
          lesson_id: lessonId,
          course_id: courseId,
          event_type: eventType,
          event_meta: (eventMeta ?? {}) as Json,
        })
        .then(({ error }) => {
          if (error) console.warn('[engagement] tracking failed:', error.message);
        });
    },
    [supabaseClient, session?.user?.id]
  );

  return { track };
}

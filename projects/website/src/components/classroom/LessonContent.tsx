import React, { useRef, useEffect } from 'react';
import VideoPlayer from '@/components/classroom/VideoPlayer';
import type { Lesson } from '@/types/supabase';

interface LessonContentProps {
  lesson: Lesson;
}

/**
 * Renders lesson content: video (if present) + HTML/text content.
 * Uses content_html when available, falls back to content.
 * Shows "Content coming soon" for empty lessons.
 * The h1 title receives focus on lesson change for accessibility (A11Y-005).
 */
const LessonContent: React.FC<LessonContentProps> = ({ lesson }) => {
  const titleRef = useRef<HTMLHeadingElement>(null);

  // Focus title on lesson change for screen reader announcements
  useEffect(() => {
    titleRef.current?.focus();
  }, [lesson.id]);

  const htmlContent = lesson.content_html || null;
  const plainContent = lesson.content || null;
  const hasContent = !!(htmlContent || plainContent);

  return (
    <div className="classroom-lesson">
      <h1
        ref={titleRef}
        className="classroom-lesson__title"
        tabIndex={-1}
      >
        {lesson.title}
      </h1>

      {lesson.video_url && (
        <div className="classroom-lesson__video">
          <VideoPlayer url={lesson.video_url} title={lesson.title} />
        </div>
      )}

      {hasContent ? (
        <div className="classroom-lesson__content">
          {htmlContent ? (
            <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
          ) : (
            <div style={{ whiteSpace: 'pre-wrap' }}>{plainContent}</div>
          )}
        </div>
      ) : !lesson.video_url ? (
        <div className="classroom-lesson__empty">
          <i className="fa-regular fa-file-lines"></i>
          <p>Content coming soon</p>
        </div>
      ) : null}
    </div>
  );
};

export default LessonContent;

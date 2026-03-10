import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { extractYouTubeId } from '@/lib/utils';
import type { Lesson } from '@/types/supabase';

interface LessonContentProps {
  lesson: Lesson;
}

const LessonContent: React.FC<LessonContentProps> = ({ lesson }) => {
  const videoId = lesson.video_url ? extractYouTubeId(lesson.video_url) : null;

  return (
    <div className="classroom-lesson">
      <h1 className="classroom-lesson__title">{lesson.title}</h1>

      {lesson.video_url && (
        <div className="classroom-lesson__video">
          {videoId ? (
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?rel=0`}
              title={lesson.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <video controls src={lesson.video_url}>
              Your browser does not support the video tag.
            </video>
          )}
        </div>
      )}

      {lesson.content && (
        <div className="classroom-lesson__content">
          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
            {lesson.content}
          </ReactMarkdown>
        </div>
      )}
    </div>
  );
};

export default LessonContent;

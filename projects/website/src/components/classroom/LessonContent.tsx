import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import type { Lesson } from '@/types/supabase';

interface LessonContentProps {
  lesson: Lesson;
}

function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
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

      {lesson.content_markdown && (
        <div className="classroom-lesson__content">
          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
            {lesson.content_markdown}
          </ReactMarkdown>
        </div>
      )}
    </div>
  );
};

export default LessonContent;

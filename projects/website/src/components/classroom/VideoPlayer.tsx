import React from 'react';
import { extractYouTubeId } from '@/lib/utils';

interface VideoPlayerProps {
  url: string;
  title?: string;
}

function extractVimeoId(url: string): string | null {
  const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  return match ? match[1] : null;
}

/**
 * Video player supporting YouTube, Vimeo, and native video URLs.
 * Only renders when url is truthy. Responsive 16:9 aspect ratio.
 */
const VideoPlayer: React.FC<VideoPlayerProps> = ({ url, title = 'Video' }) => {
  if (!url) return null;

  const youtubeId = extractYouTubeId(url);
  const vimeoId = !youtubeId ? extractVimeoId(url) : null;

  return (
    <div className="classroom-video-player" style={{ aspectRatio: '16 / 9' }}>
      {youtubeId ? (
        <iframe
          src={`https://www.youtube.com/embed/${youtubeId}?rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
        />
      ) : vimeoId ? (
        <iframe
          src={`https://player.vimeo.com/video/${vimeoId}?title=0&byline=0&portrait=0`}
          title={title}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          loading="lazy"
        />
      ) : (
        <video controls src={url} title={title}>
          Your browser does not support the video tag.
        </video>
      )}
    </div>
  );
};

export default VideoPlayer;

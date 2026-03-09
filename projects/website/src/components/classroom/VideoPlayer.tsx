import React from 'react';

interface VideoPlayerProps {
  url: string;
  title?: string;
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

function extractVimeoId(url: string): string | null {
  const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  return match ? match[1] : null;
}

/**
 * Video player supporting YouTube, Vimeo, and native video URLs.
 */
const VideoPlayer: React.FC<VideoPlayerProps> = ({ url, title = 'Video' }) => {
  const youtubeId = extractYouTubeId(url);
  const vimeoId = !youtubeId ? extractVimeoId(url) : null;

  return (
    <div className="classroom-video-player">
      {youtubeId ? (
        <iframe
          src={`https://www.youtube.com/embed/${youtubeId}?rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : vimeoId ? (
        <iframe
          src={`https://player.vimeo.com/video/${vimeoId}?title=0&byline=0&portrait=0`}
          title={title}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
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

import React, { useState } from "react";

interface YouTubeEmbedProps {
  videoId: string;
  title: string;
}

const YouTubeEmbed = ({ videoId, title }: YouTubeEmbedProps) => {
  const [playing, setPlaying] = useState(false);

  const src = `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&autoplay=1`;

  return (
    <div className="gw-youtube">
      <div
        className="gw-youtube__wrapper"
        onClick={() => setPlaying(true)}
        role={playing ? undefined : "button"}
        tabIndex={playing ? undefined : 0}
        onKeyDown={(e) => {
          if (!playing && (e.key === "Enter" || e.key === " ")) setPlaying(true);
        }}
        aria-label={playing ? undefined : `Play: ${title}`}
      >
        {playing ? (
          <iframe
            src={src}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
          />
        ) : (
          <div className="gw-youtube__placeholder">
            <div className="gw-youtube__play-btn">
              <i className="fa-sharp fa-solid fa-play" />
            </div>
            <div className="gw-youtube__title">{title}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default YouTubeEmbed;

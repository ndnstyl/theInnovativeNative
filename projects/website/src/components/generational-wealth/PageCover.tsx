import React, { useState } from "react";
import YouTubeEmbed from "./YouTubeEmbed";

interface PageCoverProps {
  imageSrc: string;
  imageAlt: string;
  videoPlaceholder?: boolean;
  videoId?: string;
  videoTitle?: string;
}

const PageCover = ({
  imageSrc,
  imageAlt,
  videoPlaceholder = true,
  videoId,
  videoTitle,
}: PageCoverProps) => {
  const [showPlaceholder, setShowPlaceholder] = useState(false);
  const [imgError, setImgError] = useState(false);

  const hasVideo = Boolean(videoId);

  return (
    <div className="gw-page-cover" data-pagefind-ignore>
      <div className="gw-page-cover__image-wrap">
        {imgError ? (
          <div className="gw-page-cover__image-fallback" />
        ) : (
          <img
            src={imageSrc}
            alt={imageAlt}
            className="gw-page-cover__image"
            loading="eager"
            onError={() => setImgError(true)}
          />
        )}
        <div className="gw-page-cover__overlay" />
      </div>

      {hasVideo ? (
        <div className="gw-page-cover__video-holder gw-page-cover__video-holder--live">
          <YouTubeEmbed videoId={videoId as string} title={videoTitle ?? "Section video"} />
        </div>
      ) : (
        videoPlaceholder && (
          <div className="gw-page-cover__video-holder" onClick={() => setShowPlaceholder(!showPlaceholder)}>
            {showPlaceholder ? (
              <div className="gw-page-cover__video-slot">
                <p>Video coming soon — Mike is filming this section</p>
              </div>
            ) : (
              <button className="gw-page-cover__play-btn" aria-label="Play section video">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="24" cy="24" r="23" stroke="#00FFFF" strokeWidth="2" />
                  <path d="M19 14L35 24L19 34V14Z" fill="#00FFFF" />
                </svg>
                <span className="gw-page-cover__play-label">Section video coming soon</span>
              </button>
            )}
          </div>
        )
      )}
    </div>
  );
};

export default PageCover;

import React, { useState, useEffect, useCallback } from "react";
import Image, { StaticImageData } from "next/image";
import YoutubeEmbed from "@/components/youtube/YoutubeEmbed";

interface VideoThumbnailModalProps {
  thumbnailSrc: string | StaticImageData;
  videoId: string;
  title: string;
  description?: string;
  aspectRatio?: "16:9" | "4:3";
  className?: string;
  showPlayButton?: boolean;
}

const VideoThumbnailModal = ({
  thumbnailSrc,
  videoId,
  title,
  description,
  aspectRatio = "16:9",
  className = "",
  showPlayButton = true,
}: VideoThumbnailModalProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const handleEscapeKey = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") {
      closeModal();
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleEscapeKey);
      document.body.style.overflow = "hidden";
    } else {
      document.removeEventListener("keydown", handleEscapeKey);
      document.body.style.overflow = "";
    }

    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleEscapeKey]);

  const aspectRatioClass = aspectRatio === "16:9" ? "aspect-16-9" : "aspect-4-3";

  return (
    <>
      <div
        className={`video-thumbnail-trigger ${className}`}
        onClick={openModal}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && openModal()}
        aria-label={`Play video: ${title}`}
      >
        <div className="video-thumbnail-wrapper">
          <Image
            src={thumbnailSrc}
            alt={title}
            fill
            style={{ objectFit: "cover" }}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {showPlayButton && (
            <div className="video-play-overlay">
              <div className="play-button">
                <i className="fa-sharp fa-solid fa-play"></i>
              </div>
            </div>
          )}
        </div>
        {(title || description) && (
          <div className="video-thumbnail-info">
            {title && <h4 className="video-thumbnail-title">{title}</h4>}
            {description && <p className="video-thumbnail-description">{description}</p>}
          </div>
        )}
      </div>

      {isOpen && (
        <div
          className="video-backdrop video-zoom-in"
          onClick={closeModal}
          role="dialog"
          aria-modal="true"
          aria-label={title}
        >
          <div className="video-inner">
            <div
              className={`video-container video-container--responsive ${aspectRatioClass}`}
              onClick={(e) => e.stopPropagation()}
            >
              <YoutubeEmbed embedId={videoId} title={title} autoplay={true} />
              <button
                aria-label="Close video"
                className="close-video-popup"
                onClick={closeModal}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VideoThumbnailModal;

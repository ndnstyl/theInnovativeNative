import React, { useState, useEffect, useCallback } from "react";
import Image, { StaticImageData } from "next/image";
import YoutubeEmbed from "@/components/youtube/YoutubeEmbed";

interface WorkflowVideo {
  id: number;
  title: string;
  description: string;
  thumbnail: StaticImageData | string;
  videoId: string;
  tags: string[];
  duration?: string;
}

interface WorkflowShowcaseProps {
  videos: WorkflowVideo[];
  title?: string;
  subtitle?: string;
}

const WorkflowShowcase = ({
  videos,
  title = "Workflows & Walkthroughs",
  subtitle = "See the systems in action",
}: WorkflowShowcaseProps) => {
  const [activeVideo, setActiveVideo] = useState<WorkflowVideo | null>(null);

  const openVideo = (video: WorkflowVideo) => setActiveVideo(video);
  const closeVideo = () => setActiveVideo(null);

  const handleEscapeKey = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") {
      closeVideo();
    }
  }, []);

  useEffect(() => {
    if (activeVideo) {
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
  }, [activeVideo, handleEscapeKey]);

  if (!videos || videos.length === 0) {
    return null;
  }

  return (
    <>
      <section className="section workflow-showcase fade-wrapper">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-lg-8 text-center">
              <div className="section__header fade-top">
                <span className="sub-title">
                  {subtitle}
                  <span className="icon-wrapper">
                    <i className="fa-sharp fa-solid fa-play"></i>
                  </span>
                </span>
                <h2 className="title">{title}</h2>
              </div>
            </div>
          </div>

          <div className="row gaper">
            {videos.map((video) => (
              <div key={video.id} className="col-12 col-md-6 col-lg-4">
                <div
                  className="workflow-video-card fade-top"
                  onClick={() => openVideo(video)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && openVideo(video)}
                  style={{
                    cursor: "pointer",
                    borderRadius: "12px",
                    overflow: "hidden",
                    backgroundColor: "rgba(255, 255, 255, 0.02)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    transition: "all 0.3s ease",
                  }}
                >
                  <div
                    className="workflow-video-thumbnail"
                    style={{
                      position: "relative",
                      aspectRatio: "16 / 9",
                      overflow: "hidden",
                    }}
                  >
                    {typeof video.thumbnail === "string" ? (
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <Image
                        src={video.thumbnail}
                        alt={video.title}
                        fill
                        style={{ objectFit: "cover" }}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    )}
                    <div
                      className="video-overlay"
                      style={{
                        position: "absolute",
                        inset: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background:
                          "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.6) 100%)",
                        opacity: 0.9,
                        transition: "opacity 0.3s ease",
                      }}
                    >
                      <div
                        className="play-icon"
                        style={{
                          width: "60px",
                          height: "60px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: "#00FFFF",
                          color: "#000",
                          borderRadius: "50%",
                          fontSize: "20px",
                          boxShadow: "0 4px 20px rgba(0, 255, 255, 0.4)",
                          transition: "transform 0.3s ease",
                        }}
                      >
                        <i
                          className="fa-sharp fa-solid fa-play"
                          style={{ marginLeft: "3px" }}
                        ></i>
                      </div>
                    </div>
                    {video.duration && (
                      <span
                        style={{
                          position: "absolute",
                          bottom: "10px",
                          right: "10px",
                          padding: "4px 8px",
                          backgroundColor: "rgba(0, 0, 0, 0.8)",
                          borderRadius: "4px",
                          fontSize: "12px",
                          color: "#fff",
                          fontWeight: 500,
                        }}
                      >
                        {video.duration}
                      </span>
                    )}
                  </div>

                  <div style={{ padding: "20px" }}>
                    <h4
                      style={{
                        fontSize: "18px",
                        fontWeight: 600,
                        color: "#fff",
                        marginBottom: "8px",
                        lineHeight: 1.4,
                      }}
                    >
                      {video.title}
                    </h4>
                    <p
                      style={{
                        fontSize: "14px",
                        color: "rgba(255, 255, 255, 0.7)",
                        lineHeight: 1.5,
                        marginBottom: "12px",
                      }}
                    >
                      {video.description}
                    </p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                      {video.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          style={{
                            padding: "4px 10px",
                            backgroundColor: "rgba(0, 255, 255, 0.1)",
                            borderRadius: "4px",
                            fontSize: "12px",
                            color: "#00FFFF",
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Modal */}
      {activeVideo && (
        <div
          className="video-backdrop video-zoom-in"
          onClick={closeVideo}
          role="dialog"
          aria-modal="true"
          aria-label={activeVideo.title}
        >
          <div className="video-inner">
            <div
              className="video-container video-container--responsive aspect-16-9"
              onClick={(e) => e.stopPropagation()}
            >
              <YoutubeEmbed
                embedId={activeVideo.videoId}
                title={activeVideo.title}
                autoplay={true}
              />
              <button
                aria-label="Close video"
                className="close-video-popup"
                onClick={closeVideo}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .workflow-video-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 40px rgba(0, 255, 255, 0.15);
          border-color: rgba(0, 255, 255, 0.2);
        }

        .workflow-video-card:hover .play-icon {
          transform: scale(1.1);
        }

        .workflow-video-card:hover .video-overlay {
          opacity: 1;
        }

        .workflow-video-card:focus {
          outline: 2px solid #00ffff;
          outline-offset: 4px;
        }
      `}</style>
    </>
  );
};

export default WorkflowShowcase;

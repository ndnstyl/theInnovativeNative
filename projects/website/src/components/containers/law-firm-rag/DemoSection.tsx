import React, { useState } from "react";
import Image from "next/image";
import star from "public/images/star.png";

interface DemoSectionProps {
  videoId?: string;
}

const DemoSection = ({ videoId = "ZkLx4zC62Xk" }: DemoSectionProps) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

  return (
    <section id="demo-section" className="section lfr-demo fade-wrapper">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-8 text-center">
            <span className="sub-title fade-top">
              PRODUCT DEMO
              <i className="fa-solid fa-arrow-right"></i>
            </span>
            <h2 className="title title-anim mt-3">
              See Your Second Brain In Action
            </h2>
            <p className="lfr-demo__subtitle fade-top">
              Watch how legal professionals are using RAG to unlock their institutional knowledge.
            </p>
          </div>
        </div>

        <div className="row justify-content-center mt-5">
          <div className="col-12 col-lg-10">
            <div className="lfr-demo__video-wrapper fade-top">
              {!isPlaying ? (
                <div className="lfr-demo__thumbnail" onClick={handlePlay}>
                  <Image
                    src={thumbnailUrl}
                    alt="Video thumbnail - See Your Second Brain In Action"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 900px"
                    style={{ objectFit: "cover" }}
                    priority={false}
                  />
                  <div className="lfr-demo__thumbnail-overlay">
                    <button className="lfr-demo__play-button" aria-label="Play video">
                      <i className="fa-solid fa-play"></i>
                    </button>
                  </div>
                  <div className="lfr-demo__duration">
                    <i className="fa-solid fa-clock"></i>
                    <span>3:45</span>
                  </div>
                </div>
              ) : (
                <div className="lfr-demo__iframe-wrapper">
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
                    title="Law Firm RAG Demo Video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              )}
            </div>

            <div className="lfr-demo__highlights fade-top">
              <div className="lfr-demo__highlight">
                <i className="fa-solid fa-magnifying-glass"></i>
                <span>Natural language queries</span>
              </div>
              <div className="lfr-demo__highlight">
                <i className="fa-solid fa-file-lines"></i>
                <span>Source document linking</span>
              </div>
              <div className="lfr-demo__highlight">
                <i className="fa-solid fa-certificate"></i>
                <span>Citation verification</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Image src={star} alt="" className="star" aria-hidden="true" />

      <div className="lines d-none d-lg-flex">
        <div className="line"></div>
        <div className="line"></div>
        <div className="line"></div>
        <div className="line"></div>
        <div className="line"></div>
      </div>
    </section>
  );
};

export default DemoSection;

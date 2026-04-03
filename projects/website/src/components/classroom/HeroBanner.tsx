import React from 'react';

const HeroBanner: React.FC = () => {
  return (
    <div className="hero-banner">
      <div className="hero-banner__image-wrapper">
        <img
          src="/images/classroom/banner.jpg"
          alt="BuildMyTribe.AI community classroom banner"
          className="hero-banner__image"
          width={900}
          height={400}
          loading="eager"
        />
      </div>
    </div>
  );
};

export default HeroBanner;

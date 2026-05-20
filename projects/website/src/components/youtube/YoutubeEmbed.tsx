import React from "react";

type VideoProps = {
  embedId: string;
  width?: string | number;
  height?: string | number;
  title?: string;
  autoplay?: boolean;
};

const YoutubeEmbed = ({
  embedId,
  width = "100%",
  height = "100%",
  title = "Embedded video",
  autoplay = false
}: VideoProps) => {
  const src = `https://www.youtube.com/embed/${embedId}${autoplay ? '?autoplay=1' : ''}`;

  return (
    <iframe
      width={width}
      height={height}
      src={src}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      title={title}
      className="video"
      loading="lazy"
      style={{ border: 0 }}
    />
  );
};

export default YoutubeEmbed;

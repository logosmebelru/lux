import { memo } from "react";
import SmartImage from "./SmartImage";
import SmartVideo from "./SmartVideo";

const MediaPanel = memo(function MediaPanel({ src, videoSrc, posterSrc, alt, label }) {
  return (
    <div className="media-panel">
      {videoSrc ? (
        <SmartVideo
          src={videoSrc}
          poster={posterSrc || src}
          alt={alt}
          className="media-panel-image"
          fallbackLabel={label}
        />
      ) : (
        <SmartImage
          src={src}
          alt={alt}
          className="media-panel-image"
          fallbackLabel={label}
        />
      )}
      <div className="media-panel-glow" />
    </div>
  );
});

export default MediaPanel;

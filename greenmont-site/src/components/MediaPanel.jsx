import { memo } from "react";
import SmartImage from "./SmartImage";

const MediaPanel = memo(function MediaPanel({ src, alt, label }) {
  return (
    <div className="media-panel">
      <SmartImage
        src={src}
        alt={alt}
        className="media-panel-image"
        fallbackLabel={label}
      />
      <div className="media-panel-glow" />
    </div>
  );
});

export default MediaPanel;

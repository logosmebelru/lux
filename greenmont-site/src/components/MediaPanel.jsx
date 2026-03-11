import SmartImage from "./SmartImage";

export default function MediaPanel({ src, alt, label }) {
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
}

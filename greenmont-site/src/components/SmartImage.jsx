import { useState } from "react";

export default function SmartImage({
  src,
  alt,
  className,
  fallbackLabel,
  loading = "lazy",
  decoding = "async"
}) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className={`image-fallback ${className || ""}`}>
        <span>{fallbackLabel || "Greenmont Luxury"}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={loading}
      decoding={decoding}
      onError={() => setFailed(true)}
    />
  );
}

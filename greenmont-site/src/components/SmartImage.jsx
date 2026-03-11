import { memo, useEffect, useMemo, useState } from "react";
import { buildAssetCandidateChain } from "../utils/mediaFallbacks";

const SmartImage = memo(function SmartImage({
  src,
  alt,
  className,
  fallbackLabel,
  loading = "lazy",
  decoding = "async",
  fetchPriority = "auto"
}) {
  const candidates = useMemo(() => buildAssetCandidateChain(src), [src]);
  const [candidateIndex, setCandidateIndex] = useState(0);

  useEffect(() => {
    setCandidateIndex(0);
  }, [src]);

  const activeSrc = candidates[candidateIndex];

  if (!activeSrc) {
    return (
      <div className={`image-fallback ${className || ""}`}>
        <span>{fallbackLabel || "Greenmont"}</span>
      </div>
    );
  }

  return (
    <img
      src={activeSrc}
      alt={alt}
      className={className}
      loading={loading}
      decoding={decoding}
      fetchPriority={fetchPriority}
      draggable={false}
      onError={() => setCandidateIndex((index) => index + 1)}
    />
  );
});

export default SmartImage;

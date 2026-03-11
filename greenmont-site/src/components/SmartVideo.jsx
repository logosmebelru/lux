import { memo, useEffect, useState } from "react";
import SmartImage from "./SmartImage";

const SmartVideo = memo(function SmartVideo({
  src,
  poster,
  alt,
  className,
  fallbackLabel,
  autoPlay = true,
  loop = true,
  muted = true,
  playsInline = true
}) {
  const [isAvailable, setIsAvailable] = useState(Boolean(src));
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    setIsAvailable(Boolean(src));
  }, [src]);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return undefined;
    }

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPreference = () => setPrefersReducedMotion(mediaQuery.matches);

    syncPreference();

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", syncPreference);
      return () => mediaQuery.removeEventListener("change", syncPreference);
    }

    mediaQuery.addListener(syncPreference);
    return () => mediaQuery.removeListener(syncPreference);
  }, []);

  if (!src || !isAvailable) {
    return (
      <SmartImage
        src={poster}
        alt={alt}
        className={className}
        fallbackLabel={fallbackLabel}
        loading="eager"
        fetchPriority="high"
      />
    );
  }

  return (
    <video
      className={className}
      poster={poster}
      aria-label={alt}
      autoPlay={autoPlay && !prefersReducedMotion}
      loop={loop}
      muted={muted}
      playsInline={playsInline}
      preload={prefersReducedMotion ? "none" : "metadata"}
      onError={() => setIsAvailable(false)}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
});

export default SmartVideo;

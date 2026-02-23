import { useState, useRef, useEffect, ImgHTMLAttributes } from "react";

interface OptimizedImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, "onLoad" | "onError"> {
  /** If true, image loads eagerly (for above-the-fold content) */
  priority?: boolean;
  /** Optional explicit width/height for sizing hints */
  width?: number;
  height?: number;
  /** Tailwind classes for the wrapper div */
  wrapperClassName?: string;
}

/**
 * A performance-optimized image component with:
 * - Native lazy loading
 * - CSS blur-up placeholder
 * - Smooth fade-in on load
 * - decoding="async" for non-blocking rendering
 * - fetchpriority for critical images
 */
const OptimizedImage = ({
  src,
  alt = "",
  className = "",
  wrapperClassName = "",
  priority = false,
  style,
  ...rest
}: OptimizedImageProps) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // If the image is already cached/complete when mounted, mark loaded immediately
  useEffect(() => {
    if (imgRef.current?.complete && imgRef.current.naturalWidth > 0) {
      setLoaded(true);
    }
  }, [src]);

  return (
    <div
      className={`relative overflow-hidden ${wrapperClassName}`}
      style={style}
    >
      {/* Skeleton placeholder — shown until image loads */}
      {!loaded && !error && (
        <div className="absolute inset-0 bg-muted animate-pulse" />
      )}

      <img
        ref={imgRef}
        src={src}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding={priority ? "sync" : "async"}
        // @ts-ignore — fetchpriority is valid HTML but not yet in React types
        fetchpriority={priority ? "high" : undefined}
        className={`transition-opacity duration-500 ease-out ${
          loaded ? "opacity-100" : "opacity-0"
        } ${className}`}
        onLoad={() => setLoaded(true)}
        onError={() => {
          setError(true);
          setLoaded(true); // stop showing skeleton
        }}
        {...rest}
      />
    </div>
  );
};

export default OptimizedImage;

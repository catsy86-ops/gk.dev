import { useState } from "react";
import { cn } from "@/lib/utils";

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  widths?: number[];
  sizes?: string;
  loading?: "lazy" | "eager";
}

export function OptimizedImage({
  src,
  alt,
  className,
  containerClassName,
  widths = [400, 800, 1200],
  sizes = "100vw",
  loading = "lazy",
}: OptimizedImageProps) {
  const [loaded, setLoaded] = useState(false);

  const srcSet = widths
    .map((w) => {
      const url = new URL(src);
      url.searchParams.set("w", String(w));
      return `${url.toString()} ${w}w`;
    })
    .join(", ");

  return (
    <div className={cn("relative overflow-hidden", containerClassName)}>
      <img
        src={src}
        srcSet={srcSet}
        sizes={sizes}
        alt={alt}
        loading={loading}
        className={cn(
          "transition-opacity duration-500",
          loaded ? "opacity-100" : "opacity-0",
          className
        )}
        onLoad={() => setLoaded(true)}
      />
      {!loaded && (
        <div className="absolute inset-0 animate-pulse bg-muted" />
      )}
    </div>
  );
}

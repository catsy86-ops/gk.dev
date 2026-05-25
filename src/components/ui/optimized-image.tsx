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

  const buildUrl = (raw: string, w?: number) => {
    const url = new URL(raw);
    if (w) url.searchParams.set("w", String(w));
    url.searchParams.set("auto", "format");
    return url.toString();
  };

  const optimizedSrc = buildUrl(src);

  const srcSet = widths
    .map((w) => `${buildUrl(src, w)} ${w}w`)
    .join(", ");

  return (
    <div className={cn("relative overflow-hidden", containerClassName)}>
      <img
        src={optimizedSrc}
        srcSet={srcSet}
        sizes={sizes}
        alt={alt}
        loading={loading}
        className={cn(
          "transition-all duration-700 ease-out",
          loaded ? "opacity-100 blur-0 scale-100" : "opacity-0 blur-lg scale-105",
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

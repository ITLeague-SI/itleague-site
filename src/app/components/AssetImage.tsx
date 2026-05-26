import Image from "next/image";

type Props = {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
  ariaHidden?: boolean;
  unoptimized?: boolean;
};

function defaultUnoptimized(src: string): boolean {
  // Files served from our own /api/figma-assets/* route are already cache-immutable.
  return src.startsWith("/api/figma-assets/");
}

/**
 * Thin wrapper around next/image:
 * - figma-assets (local API) are served as-is (no on-the-fly conversion).
 * - Falls back to `fill` mode when explicit dimensions aren't given;
 *   in that case the parent must be position:relative with a fixed size.
 */
export function AssetImage({
  src,
  alt = "",
  width,
  height,
  className,
  priority,
  sizes,
  ariaHidden,
  unoptimized,
}: Props) {
  const useFill = !width || !height;
  const finalUnoptimized = unoptimized ?? defaultUnoptimized(src);
  return (
    <Image
      src={src}
      alt={alt}
      className={className}
      priority={priority}
      unoptimized={finalUnoptimized}
      aria-hidden={ariaHidden}
      {...(useFill
        ? { fill: true, sizes: sizes ?? "100vw" }
        : { width, height })}
    />
  );
}

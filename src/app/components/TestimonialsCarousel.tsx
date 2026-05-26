"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import type { Testimonial } from "@/lib/content";
import { figmaAsset } from "@/lib/figma-asset";

const ARROW_LEFT  = figmaAsset("e7a8b9c0-carousel-arrow-left");
const ARROW_RIGHT = figmaAsset("e8b9c0d1-carousel-arrow-right");

type Props = {
  items: Testimonial[];
};

export function TestimonialsCarousel({ items }: Props) {
  const [index, setIndex] = useState(0);
  const count = items.length;

  const go = useCallback(
    (delta: number) => {
      if (count <= 1) return;
      setIndex((i) => (i + delta + count) % count);
    },
    [count],
  );

  useEffect(() => {
    if (count <= 1) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") go(-1);
      else if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [count, go]);

  if (count === 0) return null;
  const current = items[Math.min(index, count - 1)];
  const hasControls = count > 1;

  return (
    <div
      className="quote"
      role="region"
      aria-roledescription="карусель відгуків"
      aria-label="Відгуки учасників"
    >
      {hasControls && (
        <button
          type="button"
          aria-label="Попередній відгук"
          className="quote-arrow"
          onClick={() => go(-1)}
        >
          <Image src={ARROW_LEFT} alt="" aria-hidden width={24} height={24} unoptimized />
        </button>
      )}
      <blockquote aria-live="polite">
        &quot;{current.quote}&quot;
        <cite>
          <strong>{current.author_name}</strong>
          {current.author_role && <span>{current.author_role}</span>}
        </cite>
        {hasControls && (
          <span className="sr-only">
            {` Відгук ${index + 1} з ${count}.`}
          </span>
        )}
      </blockquote>
      {hasControls && (
        <button
          type="button"
          aria-label="Наступний відгук"
          className="quote-arrow"
          onClick={() => go(1)}
        >
          <Image src={ARROW_RIGHT} alt="" aria-hidden width={24} height={24} unoptimized />
        </button>
      )}
    </div>
  );
}

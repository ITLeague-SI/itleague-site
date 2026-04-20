"use client";

import { useEffect, useRef, useState } from "react";

type Tone = "green" | "blue" | "neutral";

export function CodeBlock({
  lines,
  tone = "green",
}: {
  lines: Array<[string, string]>;
  tone?: Tone;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const rafId = requestAnimationFrame(() => {
      const rect = node.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.9 && rect.bottom > 0) {
        setVisible(true);
      }
    });

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -10% 0px" }
    );

    observer.observe(node);

    return () => {
      cancelAnimationFrame(rafId);
      observer.disconnect();
    };
  }, []);

  return (
    <div className={`code-block${visible ? " is-visible" : ""}`} ref={ref}>
      {lines.map(([label, value], index) => (
        <p key={label} style={{ transitionDelay: `${index * 140}ms` }}>
          <span className="code-pink">&gt; {label}: </span>
          <span className={`code-${tone}`}>{value}</span>
        </p>
      ))}
    </div>
  );
}

"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Tone = "green" | "blue" | "neutral";

type TypeState = { lineIdx: number; charIdx: number };

const CHAR_MS = 38;
const LINE_PAUSE_MS = 220;

export function CodeBlock({
  lines,
  tone = "green",
}: {
  lines: Array<[string, string]>;
  tone?: Tone;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  const [state, setState] = useState<TypeState>({ lineIdx: 0, charIdx: 0 });

  const meta = useMemo(() => {
    const prefixes = lines.map(([label]) => `> ${label}: `);
    const lineLens = lines.map(
      ([label, value]) => `> ${label}: `.length + value.length,
    );
    return { prefixes, lineLens };
  }, [lines]);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
            return;
          }
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -10% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      const last = lines.length - 1;
      // Skip the typewriter animation entirely for users who prefer reduced motion.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setState({ lineIdx: last, charIdx: meta.lineLens[last] });
      return;
    }

    const { lineLens } = meta;
    const lineCount = lines.length;
    const start = performance.now();
    let rafId: number | null = null;

    const tick = (now: number) => {
      let elapsed = now - start;
      let lineIdx = 0;
      let charIdx = 0;
      let done = false;

      while (lineIdx < lineCount) {
        const lineDur = lineLens[lineIdx] * CHAR_MS;
        if (elapsed < lineDur) {
          charIdx = Math.min(
            lineLens[lineIdx],
            Math.floor(elapsed / CHAR_MS) + 1,
          );
          break;
        }
        elapsed -= lineDur;
        if (lineIdx === lineCount - 1) {
          charIdx = lineLens[lineIdx];
          done = true;
          break;
        }
        if (elapsed < LINE_PAUSE_MS) {
          charIdx = lineLens[lineIdx];
          break;
        }
        elapsed -= LINE_PAUSE_MS;
        lineIdx++;
      }

      setState((prev) =>
        prev.lineIdx === lineIdx && prev.charIdx === charIdx
          ? prev
          : { lineIdx, charIdx },
      );

      if (!done) {
        rafId = requestAnimationFrame(tick);
      } else {
        rafId = null;
      }
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [visible, lines, meta]);

  return (
    <div className={`code-block${visible ? " is-visible" : ""}`} ref={ref}>
      {lines.map(([label, value], i) => {
        const prefix = meta.prefixes[i];
        const lineLen = meta.lineLens[i];
        const typed =
          i < state.lineIdx ? lineLen : i === state.lineIdx ? state.charIdx : 0;
        const showPrefix = Math.min(typed, prefix.length);
        const showValue = Math.max(0, typed - prefix.length);
        const isCurrent = i === state.lineIdx && typed < lineLen;
        return (
          <p key={label}>
            <span className="code-pink">{prefix.slice(0, showPrefix)}</span>
            <span className={`code-${tone}`}>{value.slice(0, showValue)}</span>
            {isCurrent && <span aria-hidden="true" className="code-caret" />}
          </p>
        );
      })}
    </div>
  );
}

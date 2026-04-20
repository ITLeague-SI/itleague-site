"use client";

import { useEffect, useRef, useState } from "react";

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

  useEffect(() => {
    if (!visible) return;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let cancelled = false;
    const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

    (async () => {
      if (reduced) {
        if (cancelled) return;
        const last = lines.length - 1;
        const [lbl, val] = lines[last];
        setState({ lineIdx: last, charIdx: `> ${lbl}: `.length + val.length });
        return;
      }

      for (let l = 0; l < lines.length; l++) {
        const [label, value] = lines[l];
        const lineLen = `> ${label}: `.length + value.length;
        for (let c = 1; c <= lineLen; c++) {
          if (cancelled) return;
          setState({ lineIdx: l, charIdx: c });
          await wait(CHAR_MS);
        }
        if (l < lines.length - 1) {
          await wait(LINE_PAUSE_MS);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [visible, lines]);

  const totalLines = lines.length;

  return (
    <div className={`code-block${visible ? " is-visible" : ""}`} ref={ref}>
      {lines.map(([label, value], i) => {
        const prefix = `> ${label}: `;
        const lineLen = prefix.length + value.length;
        const typed =
          i < state.lineIdx ? lineLen : i === state.lineIdx ? state.charIdx : 0;
        const showPrefix = Math.min(typed, prefix.length);
        const showValue = Math.max(0, typed - prefix.length);
        const isCurrent = i === state.lineIdx && typed < lineLen;
        const isLastDone = i === totalLines - 1 && typed >= lineLen;
        return (
          <p key={label}>
            <span className="code-pink">{prefix.slice(0, showPrefix)}</span>
            <span className={`code-${tone}`}>{value.slice(0, showValue)}</span>
            {(isCurrent || isLastDone) && (
              <span aria-hidden="true" className="code-caret" />
            )}
          </p>
        );
      })}
    </div>
  );
}

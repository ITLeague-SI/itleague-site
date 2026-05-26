"use client";

import { useEffect, useState } from "react";
import { AssetImage } from "./AssetImage";
import { figmaAsset } from "@/lib/figma-asset";

const STEPS = ["SOLVE", "RANK", "GROW", "REPEAT"] as const;
const STEP_MS = 5000;

const STAIRS_TOP    = figmaAsset("a1b2c3d4-about-loop-stairs-top");
const STAIRS_BOTTOM = figmaAsset("a2b3c4d5-about-loop-stairs-bottom");

export function AboutLoop() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % STEPS.length);
    }, STEP_MS);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="loop" role="list" aria-label="Цикл росту: Solve → Rank → Grow → Repeat">
      {STEPS.map((item, index) => {
        const isActive = index === active;
        return (
          <span
            key={item}
            role="listitem"
            className={isActive ? "loop-step-active" : undefined}
            aria-current={isActive ? "step" : undefined}
          >
            {item}
          </span>
        );
      })}
      <div className="loop-core" aria-hidden="true">
        <AssetImage
          src={STAIRS_BOTTOM}
          alt=""
          ariaHidden
          width={82}
          height={86}
          className="loop-core-stairs loop-core-stairs-bottom"
        />
        <AssetImage
          src={STAIRS_TOP}
          alt=""
          ariaHidden
          width={82}
          height={81}
          className="loop-core-stairs loop-core-stairs-top"
        />
      </div>
    </div>
  );
}

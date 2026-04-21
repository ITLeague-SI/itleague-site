"use client";

import { useEffect, useState } from "react";
import {
  IconEnter,
  IconGame,
  IconPositive,
  IconTree,
  IconTrophy,
} from "./GrowthIcons";

// 5 шагов из Figma (node 23:521). Порядок фиксирован, подписи строго как в макете.
const steps = [
  { label: "Реєстрація", Icon: IconEnter },
  { label: "Вибір\nтурніру", Icon: IconTree },
  { label: "Виконання\nзадач", Icon: IconGame },
  { label: "Оцінка\nта рейтинг", Icon: IconTrophy },
  { label: "Зростання\nу лізі", Icon: IconPositive },
] as const;

// 5 секунд на каждый кружок — задано в задаче.
const STEP_MS = 5000;

export function GrowthSteps() {
  // Начинаем с 0 — первый круг активен сразу при маунте.
  const [active, setActive] = useState(0);

  useEffect(() => {
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % steps.length);
    }, STEP_MS);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="growth-line" role="list">
      {steps.map((step, index) => {
        const Icon = step.Icon;
        const isActive = index === active;
        return (
          <article
            key={step.label}
            role="listitem"
            className={`growth-step${isActive ? " growth-step-active" : ""}`}
            aria-current={isActive ? "step" : undefined}
          >
            <h3>{step.label}</h3>
            <div className="growth-step-circle">
              <Icon />
            </div>
            <p>{String(index + 1).padStart(2, "0")}</p>
          </article>
        );
      })}
    </div>
  );
}

"use client";

/* eslint-disable @next/next/no-img-element */

import { useCallback, useEffect, useRef, useState } from "react";
import type { Expert } from "@/lib/supabase/types";

type Props = {
  expert: Expert;
  onClose: () => void;
};

// Должно совпадать с duration у @keyframes expert-modal-pop-out / fade-out.
const CLOSE_DURATION_MS = 220;

export function ExpertModal({ expert, onClose }: Props) {
  const [phase, setPhase] = useState<"open" | "closing">("open");
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  // Держим onClose в ref, чтобы эффекты не перезапускались при смене его identity.
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  // Стабильный колбэк — не зависит ни от phase, ни от onClose.
  // Благодаря этому эффекты ниже навешиваются один раз на всё время жизни модалки.
  const requestClose = useCallback(() => {
    setPhase((prev) => (prev === "closing" ? prev : "closing"));
  }, []);

  // Когда фаза переходит в "closing" — ждём анимацию и демонтируем компонент.
  useEffect(() => {
    if (phase !== "closing") return;
    const id = window.setTimeout(() => {
      onCloseRef.current();
    }, CLOSE_DURATION_MS);
    return () => window.clearTimeout(id);
  }, [phase]);

  // Escape + блокировка скролла body + focus restore + focus trap —
  // навешиваются один раз (requestClose стабильный).
  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;

    const getFocusable = (): HTMLElement[] => {
      const root = dialogRef.current;
      if (!root) return [];
      return Array.from(
        root.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
      ).filter((el) => !el.hasAttribute("disabled"));
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        requestClose();
        return;
      }
      if (e.key !== "Tab") return;
      const focusable = getFocusable();
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Отдаём фокус кнопке-закрытию после маунта (через rAF, чтобы браузер
    // успел позиционировать элемент после анимации pop-in).
    const raf = window.requestAnimationFrame(() => {
      closeBtnRef.current?.focus();
    });

    return () => {
      window.removeEventListener("keydown", onKey);
      window.cancelAnimationFrame(raf);
      document.body.style.overflow = prevOverflow;
      // Возвращаем фокус элементу, с которого модалка была открыта.
      previouslyFocused?.focus?.();
    };
  }, [requestClose]);

  const achievements = expert.achievements
    ? expert.achievements.split("\n").filter((line) => line.trim().length > 0)
    : [];

  return (
    <div
      className="expert-modal-backdrop"
      data-phase={phase}
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) requestClose();
      }}
    >
      <div
        ref={dialogRef}
        className="expert-modal"
        data-phase={phase}
        role="dialog"
        aria-modal="true"
        aria-labelledby="expert-modal-title"
      >
        <button
          ref={closeBtnRef}
          type="button"
          className="expert-modal-close"
          onClick={requestClose}
          aria-label="Закрити"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M6 6L18 18M18 6L6 18"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
        <div className="expert-modal-photo">
          {expert.photo_url ? (
            <img alt={expert.name} src={expert.photo_url} />
          ) : (
            <div className="expert-modal-photo-placeholder" aria-hidden="true" />
          )}
        </div>
        <div className="expert-modal-body">
          <h3 id="expert-modal-title">{expert.name}</h3>
          {expert.role && <p className="expert-modal-role">{expert.role}</p>}
          {expert.bio && <p className="expert-modal-bio">{expert.bio}</p>}
          {achievements.length > 0 && (
            <div className="expert-modal-achievements">
              <h4>Регалії</h4>
              <ul>
                {achievements.map((line, i) => (
                  <li key={`${i}-${line}`}>{line.replace(/^[•\-\s]+/, "")}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

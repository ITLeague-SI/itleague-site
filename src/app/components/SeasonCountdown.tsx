"use client";

import { useEffect, useState } from "react";
import { SEASON_START_ISO } from "@/lib/content";

type Snapshot = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  started: boolean;
};

function snapshotFor(target: number, now: number): Snapshot {
  const diffMs = target - now;
  if (diffMs <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, started: true };
  }
  const totalSeconds = Math.floor(diffMs / 1000);
  return {
    days: Math.floor(totalSeconds / 86_400),
    hours: Math.floor((totalSeconds % 86_400) / 3_600),
    minutes: Math.floor((totalSeconds % 3_600) / 60),
    seconds: totalSeconds % 60,
    started: false,
  };
}

/**
 * "До старту сезону" countdown — ticks once per second towards
 * SEASON_START_ISO. Hydrates with the same zero-state the server
 * emits, then snaps to the real value once mounted to avoid a server
 * vs client text mismatch.
 */
export function SeasonCountdown() {
  const [snap, setSnap] = useState<Snapshot>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    started: false,
  });

  useEffect(() => {
    const target = new Date(SEASON_START_ISO).getTime();
    const update = () => setSnap(snapshotFor(target, Date.now()));
    update();
    const id = window.setInterval(update, 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div
      className="season-countdown"
      aria-live="polite"
      aria-label={
        snap.started
          ? "Сезон стартував"
          : `До старту сезону: ${snap.days} днів, ${snap.hours} годин, ${snap.minutes} хвилин, ${snap.seconds} секунд`
      }
    >
      <p className="season-countdown-label">
        <ClockIcon />
        <span>{snap.started ? "Сезон стартував" : "До старту сезону"}</span>
      </p>

      <div className="season-countdown-grid">
        <Cell value={snap.days} label="Днів" />
        <Cell value={snap.hours} label="Годин" />
        <Cell value={snap.minutes} label="Хвилин" />
        <Cell value={snap.seconds} label="Секунд" />
      </div>
    </div>
  );
}

function Cell({ value, label }: { value: number; label: string }) {
  return (
    <div className="season-countdown-cell">
      <span className="season-countdown-value">{pad(value)}</span>
      <span className="season-countdown-cell-label">{label}</span>
    </div>
  );
}

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

function ClockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M8 4v4l2.5 2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

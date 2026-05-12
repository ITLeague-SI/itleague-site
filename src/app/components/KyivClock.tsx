"use client";

import { useEffect, useRef, useState } from "react";

const TZ = "Europe/Kyiv";

const timeFormatter = new Intl.DateTimeFormat("uk-UA", {
  timeZone: TZ,
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});
const utcHourFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: "UTC",
  hour: "2-digit",
  hour12: false,
});
const kyivHourFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: TZ,
  hour: "2-digit",
  hour12: false,
});

function format(now: Date) {
  const time = timeFormatter.format(now);
  const utcHour = Number(utcHourFormatter.format(now));
  const kyivHour = Number(kyivHourFormatter.format(now));
  let diff = kyivHour - utcHour;
  if (diff > 12) diff -= 24;
  if (diff < -12) diff += 24;
  const sign = diff >= 0 ? "+" : "-";
  return `${time} (GMT${sign}${Math.abs(diff)})`;
}

export function KyivClock() {
  const [value, setValue] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const tick = () => setValue(format(new Date()));

    const start = () => {
      if (intervalRef.current !== null) return;
      tick();
      intervalRef.current = setInterval(tick, 1000);
    };

    const stop = () => {
      if (intervalRef.current === null) return;
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    };

    const onVisibility = () => {
      if (document.hidden) stop();
      else start();
    };

    if (!document.hidden) start();
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <p className="time" suppressHydrationWarning>
      {value ?? "--:--:--"}
    </p>
  );
}

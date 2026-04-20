"use client";

import { useEffect, useState } from "react";

const TZ = "Europe/Kyiv";

function format(now: Date) {
  const time = new Intl.DateTimeFormat("uk-UA", {
    timeZone: TZ,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(now);

  const utcHour = Number(
    new Intl.DateTimeFormat("en-US", { timeZone: "UTC", hour: "2-digit", hour12: false }).format(now)
  );
  const kyivHour = Number(
    new Intl.DateTimeFormat("en-US", { timeZone: TZ, hour: "2-digit", hour12: false }).format(now)
  );
  let diff = kyivHour - utcHour;
  if (diff > 12) diff -= 24;
  if (diff < -12) diff += 24;
  const sign = diff >= 0 ? "+" : "-";

  return `${time} (GMT${sign}${Math.abs(diff)})`;
}

export function KyivClock() {
  const [value, setValue] = useState<string | null>(null);

  useEffect(() => {
    const update = () => setValue(format(new Date()));
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <p className="time" suppressHydrationWarning>
      {value ?? "--:--:-- (GMT+2)"}
    </p>
  );
}

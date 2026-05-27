"use client";

import Image from "next/image";
import { useState } from "react";
import { FreeTrialModal } from "./FreeTrialModal";

type Props = {
  label: string;
  arrowSrc: string;
  variant: "primary" | "light" | "ghost";
};

/**
 * The "Обрати free trial" tariff button — paid tiers redirect to
 * WayForPay, but the free trial opens a popup form here so the team
 * gets a notification with the user's contact details by email.
 */
export function FreeTrialButton({ label, arrowSrc, variant }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className={`button button-${variant}`}
        onClick={() => setOpen(true)}
      >
        <span>{label}</span>
        {variant !== "primary" && (
          <Image
            src={arrowSrc}
            alt=""
            aria-hidden="true"
            width={16}
            height={16}
            unoptimized
          />
        )}
      </button>
      <FreeTrialModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}

"use client";

/* eslint-disable @next/next/no-img-element */

import { useState } from "react";
import type { Expert } from "@/lib/supabase/types";
import { ExpertModal } from "./ExpertModal";

type Props = {
  expert: Expert;
};

export function ExpertCard({ expert }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className="judge-card"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-label={`Детальніше про ${expert.name}`}
      >
        <div className="judge-photo">
          {expert.photo_url && <img alt={expert.name} src={expert.photo_url} />}
          <span className="judge-photo-cta" aria-hidden="true">
            <span>Детальніше</span>
            <svg
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M12 8.0026H4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8 4L12 8L8 12"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>
        <h3>{expert.name}</h3>
        {expert.role && <p>{expert.role}</p>}
      </button>
      {open && (
        <ExpertModal expert={expert} onClose={() => setOpen(false)} />
      )}
    </>
  );
}

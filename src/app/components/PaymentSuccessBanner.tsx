"use client";

import { useEffect, useState } from "react";

/**
 * Shows a thank-you banner at the top of the page when the URL contains
 * `?payment=success` — set as the WayForPay invoice ReturnURL so users
 * land back on the homepage with a clear confirmation after checkout.
 *
 * Auto-dismisses after 10 seconds; can also be closed manually.
 * The query parameter is removed from the URL once shown so a refresh
 * doesn't keep re-triggering the banner.
 */
export function PaymentSuccessBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("payment") !== "success") return;

    setVisible(true);

    // Clean the URL so a refresh / share doesn't replay the banner.
    params.delete("payment");
    const cleaned =
      window.location.pathname +
      (params.toString() ? "?" + params.toString() : "") +
      window.location.hash;
    window.history.replaceState(null, "", cleaned);

    const id = window.setTimeout(() => setVisible(false), 10_000);
    return () => window.clearTimeout(id);
  }, []);

  if (!visible) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="payment-success-banner"
    >
      <span className="payment-success-banner-text">
        ✅ Дякуємо! Платіж прийнято. Деталі доступу прийдуть на пошту протягом 5 хвилин.
      </span>
      <button
        type="button"
        aria-label="Закрити повідомлення"
        className="payment-success-banner-close"
        onClick={() => setVisible(false)}
      >
        ×
      </button>
    </div>
  );
}

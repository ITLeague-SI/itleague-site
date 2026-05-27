"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type Props = {
  open: boolean;
  onClose: () => void;
};

type Status = "idle" | "submitting" | "success" | "error";

/**
 * Modal popup shown when the user clicks "Обрати free trial".
 * Collects name + email + phone and POSTs them to /submit-form.php
 * (a small PHP handler hosted alongside the static build) which emails
 * the team inbox via cPanel's mail() function.
 *
 * Design: Figma node 38:207 in the pop-up file.
 */
export function FreeTrialModal({ open, onClose }: Props) {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    email?: string;
    phone?: string;
  }>({});
  const [mounted, setMounted] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);

  // Track mount so we can safely call document.body in the portal.
  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll while modal is open; restore on close.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // Focus the first input for keyboard users.
    firstFieldRef.current?.focus();
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // ESC closes the modal.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Reset transient state when the modal opens fresh.
  useEffect(() => {
    if (open) {
      setStatus("idle");
      setErrorMsg("");
      setFieldErrors({});
    }
  }, [open]);

  if (!open || !mounted) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "submitting") return;

    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get("name") ?? "").trim(),
      email: String(fd.get("email") ?? "").trim(),
      phone: String(fd.get("phone") ?? "").trim(),
      // honeypot — empty unless a bot fills it
      website: String(fd.get("website") ?? "").trim(),
    };

    setStatus("submitting");
    setErrorMsg("");
    setFieldErrors({});

    try {
      const res = await fetch("/submit-form.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setStatus("success");
        formRef.current?.reset();
        return;
      }
      // Validation (422) returns { errors: { field: msg } }
      // Other failures return { error: msg }
      const data = await res.json().catch(() => ({}));
      if (data.errors && typeof data.errors === "object") {
        setFieldErrors(data.errors);
        setStatus("error");
      } else {
        setErrorMsg(
          data.error || "Помилка відправки. Спробуйте ще раз через хвилину.",
        );
        setStatus("error");
      }
    } catch {
      setErrorMsg(
        "Не вдалось з'єднатися з сервером. Перевірте інтернет і спробуйте ще раз.",
      );
      setStatus("error");
    }
  };

  return createPortal(
    <div
      className="free-trial-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="free-trial-modal-title"
      onClick={(e) => {
        // Close when clicking the dimmed area outside the dialog.
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="free-trial-modal">
        <button
          type="button"
          className="free-trial-modal-close"
          aria-label="Закрити вікно"
          onClick={onClose}
        >
          ×
        </button>

        <div className="free-trial-modal-heading">
          <h2 id="free-trial-modal-title">Приєднуйся до першого сезону</h2>
          <p>Залиш свої дані, щоб отримати доступ до змагань</p>
        </div>

        <div className="free-trial-modal-card">
          {/* Decorative bracket corners (top-left & bottom-right). */}
          <span className="free-trial-modal-corner free-trial-modal-corner-tl" aria-hidden="true" />
          <span className="free-trial-modal-corner free-trial-modal-corner-br" aria-hidden="true" />

          {status === "success" ? (
            <div className="free-trial-modal-success">
              <div className="free-trial-modal-success-icon" aria-hidden="true">
                ✓
              </div>
              <h3>Дякуємо!</h3>
              <p>
                Заявку прийнято. Найближчим часом ми зв&apos;яжемося з вами по
                вказаних контактах та надішлемо доступ до змагань.
              </p>
              <button
                type="button"
                className="free-trial-modal-submit"
                onClick={onClose}
              >
                <span>Готово</span>
              </button>
            </div>
          ) : (
            <form
              ref={formRef}
              className="free-trial-modal-form"
              onSubmit={handleSubmit}
              noValidate
            >
              <FormField
                label="Ім'я"
                name="name"
                type="text"
                placeholder="Введіть ваше ім'я"
                icon="user"
                inputRef={firstFieldRef}
                error={fieldErrors.name}
                disabled={status === "submitting"}
                autoComplete="name"
                required
                maxLength={100}
              />
              <FormField
                label="Email"
                name="email"
                type="email"
                placeholder="your.email@example.com"
                icon="mail"
                error={fieldErrors.email}
                disabled={status === "submitting"}
                autoComplete="email"
                required
              />
              <FormField
                label="Номер телефону"
                name="phone"
                type="tel"
                placeholder="+380 XX XXX XX XX"
                icon="phone"
                error={fieldErrors.phone}
                disabled={status === "submitting"}
                autoComplete="tel"
                required
              />

              {/* Honeypot — invisible to humans, only bots fill it. */}
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                className="free-trial-modal-honeypot"
                aria-hidden="true"
              />

              <div className="free-trial-modal-privacy">
                <ShieldIcon />
                <span>
                  Ваші дані захищені та використовуються виключно для зв&apos;язку
                  в рамках турніру
                </span>
              </div>

              {status === "error" && errorMsg && (
                <p className="free-trial-modal-error" role="alert">
                  {errorMsg}
                </p>
              )}

              <button
                type="submit"
                className="free-trial-modal-submit"
                disabled={status === "submitting"}
              >
                <span>
                  {status === "submitting"
                    ? "Відправляємо…"
                    : "Приєднатися до ліги"}
                </span>
                {status !== "submitting" && <ArrowRightIcon />}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}

function FormField({
  label,
  name,
  type,
  placeholder,
  icon,
  inputRef,
  error,
  disabled,
  autoComplete,
  required,
  maxLength,
}: {
  label: string;
  name: string;
  type: string;
  placeholder: string;
  icon: "user" | "mail" | "phone";
  inputRef?: React.Ref<HTMLInputElement>;
  error?: string;
  disabled?: boolean;
  autoComplete?: string;
  required?: boolean;
  maxLength?: number;
}) {
  const id = `free-trial-${name}`;
  return (
    <div className="free-trial-modal-field">
      <label htmlFor={id}>{label}</label>
      <div className={`free-trial-modal-input${error ? " has-error" : ""}`}>
        <span className="free-trial-modal-input-icon" aria-hidden="true">
          {icon === "user" && <UserIcon />}
          {icon === "mail" && <MailIcon />}
          {icon === "phone" && <PhoneIcon />}
        </span>
        <input
          ref={inputRef}
          id={id}
          name={name}
          type={type}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
          maxLength={maxLength}
          disabled={disabled}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
        />
      </div>
      {error && (
        <p id={`${id}-error`} className="free-trial-modal-field-error">
          {error}
        </p>
      )}
    </div>
  );
}

/* ---------- icons (inline SVG, currentColor) ---------- */

function UserIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="6.667" r="3.333" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3.333 17.5a6.667 6.667 0 0 1 13.334 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <rect x="2.5" y="4.167" width="15" height="11.667" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3 5l7 5.5L17 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M5.5 2.5h2.083a.833.833 0 0 1 .824.707l.6 3.59a.833.833 0 0 1-.239.74l-1.378 1.378a11.667 11.667 0 0 0 5.444 5.444l1.379-1.378a.833.833 0 0 1 .74-.24l3.59.6a.833.833 0 0 1 .707.824V15a2.5 2.5 0 0 1-2.5 2.5A12.5 12.5 0 0 1 3 5a2.5 2.5 0 0 1 2.5-2.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M8 1.333 2.667 3.333v4c0 3.334 2.282 6.45 5.333 7.334 3.052-.884 5.333-4 5.333-7.334v-4L8 1.333Z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M4 10h12M11 5l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

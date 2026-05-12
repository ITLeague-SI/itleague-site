"use client";

import { useFormStatus } from "react-dom";

type DeleteFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  id: string;
  confirmText: string;
  label?: string;
  pendingLabel?: string;
};

function DangerButton({
  children,
  pendingLabel,
}: {
  children: React.ReactNode;
  pendingLabel: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className="admin-btn admin-btn-danger"
      formNoValidate
      disabled={pending}
      aria-disabled={pending}
    >
      {pending ? pendingLabel : children}
    </button>
  );
}

export function DeleteForm({
  action,
  id,
  confirmText,
  label = "Удалить",
  pendingLabel = "Удаление…",
}: DeleteFormProps) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!window.confirm(confirmText)) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <DangerButton pendingLabel={pendingLabel}>{label}</DangerButton>
    </form>
  );
}

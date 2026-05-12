import Link from "next/link";
import type { Faq } from "@/lib/supabase/types";
import { adminErrorMessage } from "@/lib/admin/error-messages";
import { SubmitButton } from "../_components/SubmitButton";

type Props = {
  action: (formData: FormData) => void | Promise<void>;
  initial?: Partial<Faq>;
  error?: string;
  submitLabel: string;
};

export function FaqForm({ action, initial, error, submitLabel }: Props) {
  return (
    <form action={action} className="admin-form">
      <label>
        <span>Вопрос</span>
        <input
          type="text"
          name="question"
          required
          defaultValue={initial?.question ?? ""}
          placeholder="Например: Сколько стоит участие?"
        />
      </label>

      <label>
        <span>Ответ</span>
        <textarea
          name="answer"
          required
          rows={6}
          defaultValue={initial?.answer ?? ""}
          placeholder="Развёрнутый ответ для пользователя"
        />
      </label>

      <div className="admin-form-row">
        <label>
          <span>Порядок</span>
          <input
            type="number"
            name="sort_order"
            defaultValue={initial?.sort_order ?? 0}
            step={1}
          />
        </label>
        <label className="admin-form-check">
          <input
            type="checkbox"
            name="published"
            defaultChecked={initial?.published ?? true}
          />
          <span>Опубликовано</span>
        </label>
      </div>

      {error && <p className="admin-alert">{adminErrorMessage(error)}</p>}

      <div className="admin-form-actions">
        <Link href="/admin/faqs" className="admin-btn">
          Отмена
        </Link>
        <SubmitButton>{submitLabel}</SubmitButton>
      </div>
    </form>
  );
}

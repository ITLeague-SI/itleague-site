import Link from "next/link";
import type { Testimonial } from "@/lib/supabase/types";
import { adminErrorMessage } from "@/lib/admin/error-messages";
import { SubmitButton } from "../_components/SubmitButton";

type Props = {
  action: (formData: FormData) => void | Promise<void>;
  initial?: Partial<Testimonial>;
  error?: string;
  submitLabel: string;
  isEdit?: boolean;
};

export function TestimonialForm({
  action,
  initial,
  error,
  submitLabel,
  isEdit,
}: Props) {
  return (
    <form action={action} className="admin-form" encType="multipart/form-data">
      <div className="admin-form-row">
        <label>
          <span>Имя автора</span>
          <input
            type="text"
            name="author_name"
            required
            defaultValue={initial?.author_name ?? ""}
            placeholder="Иван Петров"
          />
        </label>
        <label>
          <span>Роль / должность</span>
          <input
            type="text"
            name="author_role"
            defaultValue={initial?.author_role ?? ""}
            placeholder="Участник сезона 2025"
          />
        </label>
      </div>

      <label>
        <span>Цитата</span>
        <textarea
          name="quote"
          required
          rows={5}
          defaultValue={initial?.quote ?? ""}
          placeholder="Что именно понравилось в лиге"
        />
      </label>

      <label>
        <span>Фото (jpg / png / webp, до 5 МБ)</span>
        <input type="file" name="photo" accept="image/*" />
      </label>
      {initial?.photo_url && (
        <div className="admin-form-preview">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={initial.photo_url} alt="" />
          {isEdit && (
            <label className="admin-form-check">
              <input type="checkbox" name="remove_photo" />
              <span>Удалить текущее фото</span>
            </label>
          )}
        </div>
      )}

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
        <Link href="/admin/testimonials" className="admin-btn">
          Отмена
        </Link>
        <SubmitButton>{submitLabel}</SubmitButton>
      </div>
    </form>
  );
}

import Link from "next/link";
import type { HeroSlide } from "@/lib/supabase/types";
import { adminErrorMessage } from "@/lib/admin/error-messages";
import { SubmitButton } from "../_components/SubmitButton";

type Props = {
  action: (formData: FormData) => void | Promise<void>;
  initial?: Partial<HeroSlide>;
  error?: string;
  submitLabel: string;
  isEdit?: boolean;
};

export function HeroSlideForm({
  action,
  initial,
  error,
  submitLabel,
  isEdit,
}: Props) {
  return (
    <form action={action} className="admin-form" encType="multipart/form-data">
      <label>
        <span>
          Фото {isEdit ? "(оставь пустым, чтобы не менять)" : "(обязательно)"}
        </span>
        <input
          type="file"
          name="photo"
          accept="image/*"
          required={!isEdit}
        />
      </label>
      {initial?.photo_url && (
        <div className="admin-form-preview">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={initial.photo_url} alt="" />
        </div>
      )}

      <label>
        <span>Alt-текст (для доступности)</span>
        <input
          type="text"
          name="alt"
          defaultValue={initial?.alt ?? ""}
          placeholder="Финал сезона 2025"
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
        <Link href="/admin/hero-slides" className="admin-btn">
          Отмена
        </Link>
        <SubmitButton>{submitLabel}</SubmitButton>
      </div>
    </form>
  );
}

import Image from "next/image";
import Link from "next/link";
import type { Expert } from "@/lib/supabase/types";
import { adminErrorMessage } from "@/lib/admin/error-messages";
import { SubmitButton } from "../_components/SubmitButton";

type Props = {
  action: (formData: FormData) => void | Promise<void>;
  initial?: Partial<Expert>;
  error?: string;
  submitLabel: string;
  isEdit?: boolean;
};

export function ExpertForm({
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
          <span>Имя</span>
          <input
            type="text"
            name="name"
            required
            defaultValue={initial?.name ?? ""}
            placeholder="Алиса Кузьменко"
          />
        </label>
        <label>
          <span>Роль / специализация</span>
          <input
            type="text"
            name="role"
            defaultValue={initial?.role ?? ""}
            placeholder="Senior Frontend / Судья"
          />
        </label>
      </div>

      <label>
        <span>Фото (jpg / png / webp, до 5 МБ)</span>
        <input type="file" name="photo" accept="image/*" />
      </label>
      {initial?.photo_url && (
        <div className="admin-form-preview">
          <Image src={initial.photo_url} alt="" width={220} height={180} />
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
        <Link href="/admin/experts" className="admin-btn">
          Отмена
        </Link>
        <SubmitButton>{submitLabel}</SubmitButton>
      </div>
    </form>
  );
}

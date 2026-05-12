import Link from "next/link";
import type { PricingTier } from "@/lib/supabase/types";
import { adminErrorMessage } from "@/lib/admin/error-messages";
import { SubmitButton } from "../_components/SubmitButton";

type Props = {
  action: (formData: FormData) => void | Promise<void>;
  initial?: Partial<PricingTier>;
  error?: string;
  submitLabel: string;
};

export function PricingTierForm({ action, initial = {}, error, submitLabel }: Props) {
  return (
    <form action={action} className="admin-form">
      <label className="admin-form-field">
        <span>Название тарифа *</span>
        <input
          type="text"
          name="name"
          required
          defaultValue={initial.name ?? ""}
          placeholder="Core"
        />
      </label>
      <label className="admin-form-field">
        <span>Цена *</span>
        <input
          type="text"
          name="price"
          required
          defaultValue={initial.price ?? ""}
          placeholder="₴5.500"
        />
      </label>
      <label className="admin-form-field">
        <span>Период</span>
        <input
          type="text"
          name="period"
          defaultValue={initial.period ?? ""}
          placeholder="/3 міс"
        />
      </label>
      <label className="admin-form-field">
        <span>Описание (строка 1)</span>
        <input
          type="text"
          name="description_top"
          defaultValue={initial.description_top ?? ""}
          placeholder="Для активного росту"
        />
      </label>
      <label className="admin-form-field">
        <span>Описание (строка 2)</span>
        <input
          type="text"
          name="description_bottom"
          defaultValue={initial.description_bottom ?? ""}
          placeholder="та змагань"
        />
      </label>
      <label className="admin-form-field">
        <span>Текст кнопки</span>
        <input
          type="text"
          name="cta_label"
          defaultValue={initial.cta_label ?? ""}
          placeholder="Обрати core"
        />
      </label>
      <label className="admin-form-field">
        <span>Порядок сортировки</span>
        <input
          type="number"
          name="sort_order"
          defaultValue={initial.sort_order ?? 0}
        />
      </label>
      <label className="admin-form-check">
        <input
          type="checkbox"
          name="published"
          defaultChecked={initial.published ?? true}
        />
        <span>Опубликовано</span>
      </label>
      {error && <p className="admin-alert">{adminErrorMessage(error)}</p>}
      <div className="admin-form-actions">
        <Link href="/admin/pricing-tiers" className="admin-btn">
          Отмена
        </Link>
        <SubmitButton>{submitLabel}</SubmitButton>
      </div>
    </form>
  );
}

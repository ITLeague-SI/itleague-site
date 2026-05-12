import Link from "next/link";
import type { PricingFeature } from "@/lib/supabase/types";
import { adminErrorMessage } from "@/lib/admin/error-messages";
import { SubmitButton } from "../_components/SubmitButton";

type Props = {
  action: (formData: FormData) => void | Promise<void>;
  initial?: Partial<PricingFeature>;
  error?: string;
  submitLabel: string;
};

const HINT =
  "Многострочное значение: каждая новая строка отображается отдельным блоком в ячейке.";

export function PricingFeatureForm({ action, initial = {}, error, submitLabel }: Props) {
  return (
    <form action={action} className="admin-form">
      <label className="admin-form-field">
        <span>Название фичи *</span>
        <input
          type="text"
          name="label"
          required
          defaultValue={initial.label ?? ""}
          placeholder="Оцінка журі"
        />
      </label>
      <label className="admin-form-field">
        <span>Free</span>
        <textarea
          name="value_free"
          rows={2}
          defaultValue={initial.value_free ?? ""}
          placeholder="❌"
        />
      </label>
      <label className="admin-form-field">
        <span>Basic</span>
        <textarea
          name="value_basic"
          rows={2}
          defaultValue={initial.value_basic ?? ""}
        />
      </label>
      <label className="admin-form-field">
        <span>Core</span>
        <textarea
          name="value_core"
          rows={2}
          defaultValue={initial.value_core ?? ""}
        />
      </label>
      <label className="admin-form-field">
        <span>Pro</span>
        <textarea
          name="value_pro"
          rows={2}
          defaultValue={initial.value_pro ?? ""}
        />
      </label>
      <p className="admin-form-hint">{HINT}</p>
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
        <Link href="/admin/pricing-features" className="admin-btn">
          Отмена
        </Link>
        <SubmitButton>{submitLabel}</SubmitButton>
      </div>
    </form>
  );
}

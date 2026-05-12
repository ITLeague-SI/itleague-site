import Link from "next/link";
import { requireAdmin } from "@/lib/auth/guard";
import { getAdminSupabase } from "@/lib/supabase/admin";
import { getSupabaseServiceEnv } from "@/lib/supabase/env";
import type { PricingFeature } from "@/lib/supabase/types";
import { adminErrorMessage } from "@/lib/admin/error-messages";
import { DeleteForm } from "../_components/DeleteForm";
import { deletePricingFeatureAction } from "./actions";

type Props = { searchParams: Promise<{ error?: string }> };

async function loadItems(): Promise<{ items: PricingFeature[]; error: string | null }> {
  const { configured } = getSupabaseServiceEnv();
  if (!configured) return { items: [], error: "no_config" };
  try {
    const supabase = getAdminSupabase();
    const { data, error } = await supabase
      .from("pricing_features")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
    if (error) {
      console.error("[admin/pricing-features:list]", error);
      return { items: [], error: "db" };
    }
    return { items: (data ?? []) as PricingFeature[], error: null };
  } catch (e) {
    console.error("[admin/pricing-features:list]", e);
    return { items: [], error: "db" };
  }
}

function abbreviate(value: string): string {
  const first = value.split("\n")[0] ?? "";
  return first.length > 30 ? `${first.slice(0, 30)}…` : first;
}

export default async function PricingFeaturesPage({ searchParams }: Props) {
  await requireAdmin("/admin/pricing-features");
  const { error } = await searchParams;
  const { items, error: loadError } = await loadItems();

  return (
    <div className="admin-page">
      <header className="admin-page-head">
        <div>
          <h1>Фичи тарифов</h1>
          <p>Строки таблицы сравнения тарифов.</p>
        </div>
        <Link
          href="/admin/pricing-features/new"
          className="admin-btn admin-btn-primary"
        >
          + Добавить
        </Link>
      </header>

      {(error || loadError) && (
        <p className="admin-alert">{adminErrorMessage(error ?? loadError)}</p>
      )}

      {items.length === 0 ? (
        <p className="admin-empty">Пока пусто. Добавь первую строку.</p>
      ) : (
        <ul className="admin-list">
          {items.map((item) => (
            <li key={item.id} className="admin-list-item">
              <div className="admin-list-main">
                <div className="admin-list-title">
                  {item.label}
                  {!item.published && <span className="admin-tag">черновик</span>}
                </div>
                <div className="admin-list-sub">
                  Free: {abbreviate(item.value_free) || "—"} · Basic:{" "}
                  {abbreviate(item.value_basic) || "—"} · Core:{" "}
                  {abbreviate(item.value_core) || "—"} · Pro:{" "}
                  {abbreviate(item.value_pro) || "—"}
                </div>
                <div className="admin-list-meta">Порядок: {item.sort_order}</div>
              </div>
              <div className="admin-list-actions">
                <Link
                  href={`/admin/pricing-features/${item.id}`}
                  className="admin-btn"
                >
                  Ред.
                </Link>
                <DeleteForm
                  action={deletePricingFeatureAction}
                  id={item.id}
                  confirmText={`Удалить строку «${item.label}»?`}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

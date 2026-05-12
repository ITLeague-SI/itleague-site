import Link from "next/link";
import { requireAdmin } from "@/lib/auth/guard";
import { getAdminSupabase } from "@/lib/supabase/admin";
import { getSupabaseServiceEnv } from "@/lib/supabase/env";
import type { PricingTier } from "@/lib/supabase/types";
import { adminErrorMessage } from "@/lib/admin/error-messages";
import { DeleteForm } from "../_components/DeleteForm";
import { deletePricingTierAction } from "./actions";

type Props = { searchParams: Promise<{ error?: string }> };

async function loadItems(): Promise<{ items: PricingTier[]; error: string | null }> {
  const { configured } = getSupabaseServiceEnv();
  if (!configured) return { items: [], error: "no_config" };
  try {
    const supabase = getAdminSupabase();
    const { data, error } = await supabase
      .from("pricing_tiers")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
    if (error) {
      console.error("[admin/pricing-tiers:list]", error);
      return { items: [], error: "db" };
    }
    return { items: (data ?? []) as PricingTier[], error: null };
  } catch (e) {
    console.error("[admin/pricing-tiers:list]", e);
    return { items: [], error: "db" };
  }
}

export default async function PricingTiersPage({ searchParams }: Props) {
  await requireAdmin("/admin/pricing-tiers");
  const { error } = await searchParams;
  const { items, error: loadError } = await loadItems();

  return (
    <div className="admin-page">
      <header className="admin-page-head">
        <div>
          <h1>Тарифы</h1>
          <p>Карточки тарифов в секции «Обери свій рівень участі».</p>
        </div>
        <Link href="/admin/pricing-tiers/new" className="admin-btn admin-btn-primary">
          + Добавить
        </Link>
      </header>

      {(error || loadError) && (
        <p className="admin-alert">{adminErrorMessage(error ?? loadError)}</p>
      )}

      {items.length === 0 ? (
        <p className="admin-empty">Пока пусто. Добавь первый тариф.</p>
      ) : (
        <ul className="admin-list">
          {items.map((item) => (
            <li key={item.id} className="admin-list-item">
              <div className="admin-list-main">
                <div className="admin-list-title">
                  {item.name} · {item.price}
                  {item.period && (
                    <span className="admin-list-sub"> {item.period}</span>
                  )}
                  {!item.published && <span className="admin-tag">черновик</span>}
                </div>
                <div className="admin-list-sub">
                  {item.description_top}
                  {item.description_bottom && ` · ${item.description_bottom}`}
                </div>
                <div className="admin-list-meta">
                  Порядок: {item.sort_order} · CTA: «{item.cta_label}»
                </div>
              </div>
              <div className="admin-list-actions">
                <Link href={`/admin/pricing-tiers/${item.id}`} className="admin-btn">
                  Ред.
                </Link>
                <DeleteForm
                  action={deletePricingTierAction}
                  id={item.id}
                  confirmText={`Удалить тариф «${item.name}»?`}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

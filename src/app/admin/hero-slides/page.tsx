import Link from "next/link";
import { requireAdmin } from "@/lib/auth/guard";
import { getAdminSupabase } from "@/lib/supabase/admin";
import { getSupabaseServiceEnv } from "@/lib/supabase/env";
import type { HeroSlide } from "@/lib/supabase/types";
import { adminErrorMessage } from "@/lib/admin/error-messages";
import { DeleteForm } from "../_components/DeleteForm";
import { deleteHeroSlideAction } from "./actions";

type Props = { searchParams: Promise<{ error?: string }> };

async function loadItems(): Promise<{ items: HeroSlide[]; error: string | null }> {
  const { configured } = getSupabaseServiceEnv();
  if (!configured) return { items: [], error: "no_config" };
  try {
    const supabase = getAdminSupabase();
    const { data, error } = await supabase
      .from("hero_slides")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
    if (error) {
      console.error("[admin/hero-slides:list]", error);
      return { items: [], error: "db" };
    }
    return { items: (data ?? []) as HeroSlide[], error: null };
  } catch (e) {
    console.error("[admin/hero-slides:list]", e);
    return { items: [], error: "db" };
  }
}

export default async function HeroSlidesPage({ searchParams }: Props) {
  await requireAdmin("/admin/hero-slides");
  const { error } = await searchParams;
  const { items, error: loadError } = await loadItems();

  return (
    <div className="admin-page">
      <header className="admin-page-head">
        <div>
          <h1>Слайдер</h1>
          <p>Фотографии в ленте под hero-секцией.</p>
        </div>
        <Link
          href="/admin/hero-slides/new"
          className="admin-btn admin-btn-primary"
        >
          + Добавить
        </Link>
      </header>

      {(error || loadError) && (
        <p className="admin-alert">
          {adminErrorMessage(error ?? loadError)}
        </p>
      )}

      {items.length === 0 ? (
        <p className="admin-empty">Пока пусто. Загрузи первое фото.</p>
      ) : (
        <ul className="admin-grid">
          {items.map((item) => (
            <li key={item.id} className="admin-card-media">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.photo_url} alt={item.alt ?? ""} />
              <div className="admin-card-meta">
                <div className="admin-list-title">
                  {item.alt || "Без описания"}
                  {!item.published && (
                    <span className="admin-tag">черновик</span>
                  )}
                </div>
                <div className="admin-list-meta">
                  Порядок: {item.sort_order}
                </div>
              </div>
              <div className="admin-list-actions">
                <Link
                  href={`/admin/hero-slides/${item.id}`}
                  className="admin-btn"
                >
                  Ред.
                </Link>
                <DeleteForm
                  action={deleteHeroSlideAction}
                  id={item.id}
                  confirmText="Удалить слайд из героя?"
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

import Link from "next/link";
import { requireAdmin } from "@/lib/auth/guard";
import { getAdminSupabase } from "@/lib/supabase/admin";
import { getSupabaseServiceEnv } from "@/lib/supabase/env";
import type { Expert } from "@/lib/supabase/types";
import { deleteExpertAction } from "./actions";

type Props = { searchParams: Promise<{ error?: string }> };

async function loadItems(): Promise<{ items: Expert[]; error: string | null }> {
  const { configured } = getSupabaseServiceEnv();
  if (!configured) {
    return {
      items: [],
      error: "Supabase не настроен. Укажи переменные окружения в .env.local.",
    };
  }
  try {
    const supabase = getAdminSupabase();
    const { data, error } = await supabase
      .from("experts")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
    if (error) return { items: [], error: error.message };
    return { items: (data ?? []) as Expert[], error: null };
  } catch (e) {
    return { items: [], error: e instanceof Error ? e.message : "Ошибка" };
  }
}

export default async function ExpertsPage({ searchParams }: Props) {
  await requireAdmin("/admin/experts");
  const { error } = await searchParams;
  const { items, error: loadError } = await loadItems();

  return (
    <div className="admin-page">
      <header className="admin-page-head">
        <div>
          <h1>Эксперты и судьи</h1>
          <p>Карточки людей, которые оценивают участников.</p>
        </div>
        <Link href="/admin/experts/new" className="admin-btn admin-btn-primary">
          + Добавить
        </Link>
      </header>

      {(error || loadError) && (
        <p className="admin-alert">
          {decodeURIComponent(error ?? loadError ?? "")}
        </p>
      )}

      {items.length === 0 ? (
        <p className="admin-empty">Пока пусто. Добавь первого эксперта.</p>
      ) : (
        <ul className="admin-list">
          {items.map((item) => (
            <li key={item.id} className="admin-list-item">
              {item.photo_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.photo_url}
                  alt=""
                  className="admin-list-thumb"
                />
              )}
              <div className="admin-list-main">
                <div className="admin-list-title">
                  {item.name}
                  {!item.published && (
                    <span className="admin-tag">черновик</span>
                  )}
                </div>
                {item.role && (
                  <div className="admin-list-meta">{item.role}</div>
                )}
                <div className="admin-list-meta">
                  Порядок: {item.sort_order}
                </div>
              </div>
              <div className="admin-list-actions">
                <Link href={`/admin/experts/${item.id}`} className="admin-btn">
                  Ред.
                </Link>
                <form action={deleteExpertAction}>
                  <input type="hidden" name="id" value={item.id} />
                  <button
                    type="submit"
                    className="admin-btn admin-btn-danger"
                    formNoValidate
                  >
                    Удалить
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

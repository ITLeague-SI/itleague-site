import Link from "next/link";
import { requireAdmin } from "@/lib/auth/guard";
import { getAdminSupabase } from "@/lib/supabase/admin";
import { getSupabaseServiceEnv } from "@/lib/supabase/env";
import type { Testimonial } from "@/lib/supabase/types";
import { DeleteForm } from "../_components/DeleteForm";
import { deleteTestimonialAction } from "./actions";

type Props = { searchParams: Promise<{ error?: string }> };

async function loadItems(): Promise<{ items: Testimonial[]; error: string | null }> {
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
      .from("testimonials")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
    if (error) return { items: [], error: error.message };
    return { items: (data ?? []) as Testimonial[], error: null };
  } catch (e) {
    return { items: [], error: e instanceof Error ? e.message : "Ошибка" };
  }
}

export default async function TestimonialsPage({ searchParams }: Props) {
  await requireAdmin("/admin/testimonials");
  const { error } = await searchParams;
  const { items, error: loadError } = await loadItems();

  return (
    <div className="admin-page">
      <header className="admin-page-head">
        <div>
          <h1>Отзывы</h1>
          <p>Карточки с отзывами участников и тренеров.</p>
        </div>
        <Link
          href="/admin/testimonials/new"
          className="admin-btn admin-btn-primary"
        >
          + Добавить
        </Link>
      </header>

      {(error || loadError) && (
        <p className="admin-alert">
          {decodeURIComponent(error ?? loadError ?? "")}
        </p>
      )}

      {items.length === 0 ? (
        <p className="admin-empty">Пока пусто. Добавь первый отзыв.</p>
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
                  {item.author_name}
                  {!item.published && (
                    <span className="admin-tag">черновик</span>
                  )}
                </div>
                {item.author_role && (
                  <div className="admin-list-meta">{item.author_role}</div>
                )}
                <div className="admin-list-sub">{item.quote}</div>
                <div className="admin-list-meta">
                  Порядок: {item.sort_order}
                </div>
              </div>
              <div className="admin-list-actions">
                <Link
                  href={`/admin/testimonials/${item.id}`}
                  className="admin-btn"
                >
                  Ред.
                </Link>
                <DeleteForm
                  action={deleteTestimonialAction}
                  id={item.id}
                  confirmText={`Удалить отзыв «${item.author_name}»?`}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

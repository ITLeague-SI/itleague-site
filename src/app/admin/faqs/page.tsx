import Link from "next/link";
import { requireAdmin } from "@/lib/auth/guard";
import { getAdminSupabase } from "@/lib/supabase/admin";
import { getSupabaseServiceEnv } from "@/lib/supabase/env";
import type { Faq } from "@/lib/supabase/types";
import { DeleteForm } from "../_components/DeleteForm";
import { deleteFaqAction } from "./actions";

type Props = { searchParams: Promise<{ error?: string }> };

async function loadFaqs(): Promise<{ items: Faq[]; error: string | null }> {
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
      .from("faqs")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
    if (error) return { items: [], error: error.message };
    return { items: (data ?? []) as Faq[], error: null };
  } catch (e) {
    return { items: [], error: e instanceof Error ? e.message : "Ошибка" };
  }
}

export default async function FaqsPage({ searchParams }: Props) {
  await requireAdmin("/admin/faqs");
  const { error } = await searchParams;
  const { items, error: loadError } = await loadFaqs();

  return (
    <div className="admin-page">
      <header className="admin-page-head">
        <div>
          <h1>Вопрос–ответ</h1>
          <p>Редактируй блок FAQ на лендинге.</p>
        </div>
        <Link href="/admin/faqs/new" className="admin-btn admin-btn-primary">
          + Добавить
        </Link>
      </header>

      {(error || loadError) && (
        <p className="admin-alert">{decodeURIComponent(error ?? loadError ?? "")}</p>
      )}

      {items.length === 0 ? (
        <p className="admin-empty">Пока пусто. Добавь первый вопрос.</p>
      ) : (
        <ul className="admin-list">
          {items.map((item) => (
            <li key={item.id} className="admin-list-item">
              <div className="admin-list-main">
                <div className="admin-list-title">
                  {item.question}
                  {!item.published && <span className="admin-tag">черновик</span>}
                </div>
                <div className="admin-list-sub">{item.answer}</div>
                <div className="admin-list-meta">
                  Порядок: {item.sort_order} · обновлено{" "}
                  {new Date(item.updated_at).toLocaleString("ru-RU")}
                </div>
              </div>
              <div className="admin-list-actions">
                <Link href={`/admin/faqs/${item.id}`} className="admin-btn">
                  Ред.
                </Link>
                <DeleteForm
                  action={deleteFaqAction}
                  id={item.id}
                  confirmText={`Удалить вопрос «${item.question}»?`}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

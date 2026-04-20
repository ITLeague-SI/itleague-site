import Link from "next/link";
import { requireAdmin } from "@/lib/auth/guard";
import { getAdminSupabase } from "@/lib/supabase/admin";
import { getSupabaseServiceEnv } from "@/lib/supabase/env";

type Counts = {
  faqs: number | null;
  testimonials: number | null;
  hero: number | null;
  experts: number | null;
};

async function loadCounts(): Promise<{ counts: Counts; error: string | null }> {
  const { configured } = getSupabaseServiceEnv();
  if (!configured) {
    return {
      counts: { faqs: null, testimonials: null, hero: null, experts: null },
      error:
        "Supabase не настроен. Добавь NEXT_PUBLIC_SUPABASE_URL и SUPABASE_SERVICE_ROLE_KEY в .env.local.",
    };
  }
  try {
    const supabase = getAdminSupabase();
    const [faqs, testimonials, hero, experts] = await Promise.all([
      supabase.from("faqs").select("*", { count: "exact", head: true }),
      supabase.from("testimonials").select("*", { count: "exact", head: true }),
      supabase.from("hero_slides").select("*", { count: "exact", head: true }),
      supabase.from("experts").select("*", { count: "exact", head: true }),
    ]);
    return {
      counts: {
        faqs: faqs.count ?? 0,
        testimonials: testimonials.count ?? 0,
        hero: hero.count ?? 0,
        experts: experts.count ?? 0,
      },
      error: null,
    };
  } catch (e) {
    return {
      counts: { faqs: null, testimonials: null, hero: null, experts: null },
      error: e instanceof Error ? e.message : "Не удалось подключиться к Supabase.",
    };
  }
}

export default async function AdminDashboard() {
  await requireAdmin("/admin");
  const { counts, error } = await loadCounts();

  const cards: Array<{ href: string; label: string; value: number | null }> = [
    { href: "/admin/faqs", label: "Вопрос–ответ", value: counts.faqs },
    { href: "/admin/testimonials", label: "Отзывы", value: counts.testimonials },
    { href: "/admin/hero-slides", label: "Слайды", value: counts.hero },
    { href: "/admin/experts", label: "Эксперты", value: counts.experts },
  ];

  return (
    <div className="admin-page">
      <header className="admin-page-head">
        <h1>Привет, админ</h1>
        <p>Выбери раздел, чтобы редактировать контент лендинга.</p>
      </header>

      {error && <p className="admin-alert">{error}</p>}

      <div className="admin-cards">
        {cards.map((card) => (
          <Link key={card.href} href={card.href} className="admin-card">
            <span className="admin-card-label">{card.label}</span>
            <span className="admin-card-value">
              {card.value === null ? "—" : card.value}
            </span>
            <span className="admin-card-cta">Открыть →</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth/guard";
import { getAdminSupabase } from "@/lib/supabase/admin";
import type { HeroSlide } from "@/lib/supabase/types";
import { HeroSlideForm } from "../HeroSlideForm";
import { updateHeroSlideAction } from "../actions";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
};

export default async function EditHeroSlidePage({ params, searchParams }: Props) {
  const { id } = await params;
  await requireAdmin(`/admin/hero-slides/${id}`);
  const { error } = await searchParams;

  const supabase = getAdminSupabase();
  const { data, error: loadError } = await supabase
    .from("hero_slides")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (loadError) {
    return (
      <div className="admin-page">
        <p className="admin-alert">{loadError.message}</p>
      </div>
    );
  }
  if (!data) notFound();

  const item = data as HeroSlide;
  const bound = updateHeroSlideAction.bind(null, item.id);

  return (
    <div className="admin-page">
      <header className="admin-page-head">
        <h1>Редактирование слайда</h1>
      </header>
      <HeroSlideForm
        action={bound}
        initial={item}
        error={error}
        submitLabel="Сохранить"
        isEdit
      />
    </div>
  );
}

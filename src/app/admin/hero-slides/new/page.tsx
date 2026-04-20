import { requireAdmin } from "@/lib/auth/guard";
import { HeroSlideForm } from "../HeroSlideForm";
import { createHeroSlideAction } from "../actions";

type Props = { searchParams: Promise<{ error?: string }> };

export default async function NewHeroSlidePage({ searchParams }: Props) {
  await requireAdmin("/admin/hero-slides/new");
  const { error } = await searchParams;
  return (
    <div className="admin-page">
      <header className="admin-page-head">
        <h1>Новый слайд</h1>
      </header>
      <HeroSlideForm
        action={createHeroSlideAction}
        error={error}
        submitLabel="Загрузить"
      />
    </div>
  );
}

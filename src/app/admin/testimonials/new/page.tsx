import { requireAdmin } from "@/lib/auth/guard";
import { TestimonialForm } from "../TestimonialForm";
import { createTestimonialAction } from "../actions";

type Props = { searchParams: Promise<{ error?: string }> };

export default async function NewTestimonialPage({ searchParams }: Props) {
  await requireAdmin("/admin/testimonials/new");
  const { error } = await searchParams;
  return (
    <div className="admin-page">
      <header className="admin-page-head">
        <h1>Новый отзыв</h1>
      </header>
      <TestimonialForm
        action={createTestimonialAction}
        error={error}
        submitLabel="Создать"
      />
    </div>
  );
}

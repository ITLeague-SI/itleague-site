import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth/guard";
import { getAdminSupabase } from "@/lib/supabase/admin";
import type { Testimonial } from "@/lib/supabase/types";
import { TestimonialForm } from "../TestimonialForm";
import { updateTestimonialAction } from "../actions";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
};

export default async function EditTestimonialPage({ params, searchParams }: Props) {
  const { id } = await params;
  await requireAdmin(`/admin/testimonials/${id}`);
  const { error } = await searchParams;

  const supabase = getAdminSupabase();
  const { data, error: loadError } = await supabase
    .from("testimonials")
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

  const item = data as Testimonial;
  const bound = updateTestimonialAction.bind(null, item.id);

  return (
    <div className="admin-page">
      <header className="admin-page-head">
        <h1>Редактирование отзыва</h1>
      </header>
      <TestimonialForm
        action={bound}
        initial={item}
        error={error}
        submitLabel="Сохранить"
        isEdit
      />
    </div>
  );
}

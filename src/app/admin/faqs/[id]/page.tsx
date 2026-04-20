import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth/guard";
import { getAdminSupabase } from "@/lib/supabase/admin";
import type { Faq } from "@/lib/supabase/types";
import { FaqForm } from "../FaqForm";
import { updateFaqAction } from "../actions";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
};

export default async function EditFaqPage({ params, searchParams }: Props) {
  const { id } = await params;
  await requireAdmin(`/admin/faqs/${id}`);
  const { error } = await searchParams;

  const supabase = getAdminSupabase();
  const { data, error: loadError } = await supabase
    .from("faqs")
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

  const faq = data as Faq;
  const bound = updateFaqAction.bind(null, faq.id);

  return (
    <div className="admin-page">
      <header className="admin-page-head">
        <h1>Редактирование FAQ</h1>
      </header>
      <FaqForm
        action={bound}
        initial={faq}
        error={error}
        submitLabel="Сохранить"
      />
    </div>
  );
}

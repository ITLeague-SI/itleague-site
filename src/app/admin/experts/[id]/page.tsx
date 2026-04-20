import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth/guard";
import { getAdminSupabase } from "@/lib/supabase/admin";
import type { Expert } from "@/lib/supabase/types";
import { ExpertForm } from "../ExpertForm";
import { updateExpertAction } from "../actions";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
};

export default async function EditExpertPage({ params, searchParams }: Props) {
  const { id } = await params;
  await requireAdmin(`/admin/experts/${id}`);
  const { error } = await searchParams;

  const supabase = getAdminSupabase();
  const { data, error: loadError } = await supabase
    .from("experts")
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

  const item = data as Expert;
  const bound = updateExpertAction.bind(null, item.id);

  return (
    <div className="admin-page">
      <header className="admin-page-head">
        <h1>Редактирование эксперта</h1>
      </header>
      <ExpertForm
        action={bound}
        initial={item}
        error={error}
        submitLabel="Сохранить"
        isEdit
      />
    </div>
  );
}

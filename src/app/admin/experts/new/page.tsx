import { requireAdmin } from "@/lib/auth/guard";
import { ExpertForm } from "../ExpertForm";
import { createExpertAction } from "../actions";

type Props = { searchParams: Promise<{ error?: string }> };

export default async function NewExpertPage({ searchParams }: Props) {
  await requireAdmin("/admin/experts/new");
  const { error } = await searchParams;
  return (
    <div className="admin-page">
      <header className="admin-page-head">
        <h1>Новый эксперт</h1>
      </header>
      <ExpertForm
        action={createExpertAction}
        error={error}
        submitLabel="Создать"
      />
    </div>
  );
}

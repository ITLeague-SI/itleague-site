import { requireAdmin } from "@/lib/auth/guard";
import { FaqForm } from "../FaqForm";
import { createFaqAction } from "../actions";

type Props = { searchParams: Promise<{ error?: string }> };

export default async function NewFaqPage({ searchParams }: Props) {
  await requireAdmin("/admin/faqs/new");
  const { error } = await searchParams;
  return (
    <div className="admin-page">
      <header className="admin-page-head">
        <h1>Новый FAQ</h1>
      </header>
      <FaqForm action={createFaqAction} error={error} submitLabel="Создать" />
    </div>
  );
}

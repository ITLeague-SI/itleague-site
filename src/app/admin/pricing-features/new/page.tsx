import { requireAdmin } from "@/lib/auth/guard";
import { PricingFeatureForm } from "../PricingFeatureForm";
import { createPricingFeatureAction } from "../actions";

type Props = { searchParams: Promise<{ error?: string }> };

export default async function NewPricingFeaturePage({ searchParams }: Props) {
  await requireAdmin("/admin/pricing-features/new");
  const { error } = await searchParams;
  return (
    <div className="admin-page">
      <header className="admin-page-head">
        <h1>Новая фича</h1>
      </header>
      <PricingFeatureForm
        action={createPricingFeatureAction}
        submitLabel="Создать"
        error={error}
      />
    </div>
  );
}

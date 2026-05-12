import { requireAdmin } from "@/lib/auth/guard";
import { PricingTierForm } from "../PricingTierForm";
import { createPricingTierAction } from "../actions";

type Props = { searchParams: Promise<{ error?: string }> };

export default async function NewPricingTierPage({ searchParams }: Props) {
  await requireAdmin("/admin/pricing-tiers/new");
  const { error } = await searchParams;
  return (
    <div className="admin-page">
      <header className="admin-page-head">
        <h1>Новый тариф</h1>
      </header>
      <PricingTierForm
        action={createPricingTierAction}
        submitLabel="Создать"
        error={error}
      />
    </div>
  );
}

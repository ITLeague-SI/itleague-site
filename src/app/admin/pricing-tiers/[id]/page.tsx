import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth/guard";
import { getAdminSupabase } from "@/lib/supabase/admin";
import type { PricingTier } from "@/lib/supabase/types";
import { PricingTierForm } from "../PricingTierForm";
import { updatePricingTierAction } from "../actions";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
};

export default async function EditPricingTierPage({ params, searchParams }: Props) {
  const { id } = await params;
  await requireAdmin(`/admin/pricing-tiers/${id}`);
  const { error } = await searchParams;

  const supabase = getAdminSupabase();
  const { data, error: loadError } = await supabase
    .from("pricing_tiers")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (loadError) {
    console.error("[admin/pricing-tiers:edit]", loadError);
  }
  if (!data) notFound();

  const tier = data as PricingTier;
  const update = updatePricingTierAction.bind(null, id);

  return (
    <div className="admin-page">
      <header className="admin-page-head">
        <h1>Редактирование тарифа</h1>
      </header>
      <PricingTierForm
        action={update}
        initial={tier}
        submitLabel="Сохранить"
        error={error}
      />
    </div>
  );
}

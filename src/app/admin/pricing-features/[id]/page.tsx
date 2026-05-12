import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth/guard";
import { getAdminSupabase } from "@/lib/supabase/admin";
import type { PricingFeature } from "@/lib/supabase/types";
import { PricingFeatureForm } from "../PricingFeatureForm";
import { updatePricingFeatureAction } from "../actions";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
};

export default async function EditPricingFeaturePage({
  params,
  searchParams,
}: Props) {
  const { id } = await params;
  await requireAdmin(`/admin/pricing-features/${id}`);
  const { error } = await searchParams;

  const supabase = getAdminSupabase();
  const { data, error: loadError } = await supabase
    .from("pricing_features")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (loadError) {
    console.error("[admin/pricing-features:edit]", loadError);
  }
  if (!data) notFound();

  const feature = data as PricingFeature;
  const update = updatePricingFeatureAction.bind(null, id);

  return (
    <div className="admin-page">
      <header className="admin-page-head">
        <h1>Редактирование фичи</h1>
      </header>
      <PricingFeatureForm
        action={update}
        initial={feature}
        submitLabel="Сохранить"
        error={error}
      />
    </div>
  );
}

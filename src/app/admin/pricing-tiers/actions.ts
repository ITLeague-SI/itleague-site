"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/guard";
import { deleteRowSimple, refreshPages } from "@/lib/admin/crud";
import { failRedirect } from "@/lib/admin/errors";
import { getAdminSupabase } from "@/lib/supabase/admin";

const SCOPE = "pricing-tiers";
const TABLE = "pricing_tiers";
const LIST_PATH = "/admin/pricing-tiers";
const REVALIDATE = ["/admin/pricing-tiers"];

type Payload = {
  name: string;
  price: string;
  period: string;
  description_top: string;
  description_bottom: string;
  cta_label: string;
  sort_order: number;
  published: boolean;
};

function readPayload(formData: FormData): Payload {
  return {
    name: String(formData.get("name") ?? "").trim(),
    price: String(formData.get("price") ?? "").trim(),
    period: String(formData.get("period") ?? "").trim(),
    description_top: String(formData.get("description_top") ?? "").trim(),
    description_bottom: String(formData.get("description_bottom") ?? "").trim(),
    cta_label: String(formData.get("cta_label") ?? "").trim(),
    sort_order:
      Number.parseInt(String(formData.get("sort_order") ?? "0"), 10) || 0,
    published: formData.get("published") === "on",
  };
}

export async function createPricingTierAction(formData: FormData) {
  await requireAdmin("/admin/pricing-tiers/new");
  const payload = readPayload(formData);
  if (!payload.name || !payload.price) {
    failRedirect(SCOPE, "/admin/pricing-tiers/new", "missing");
  }
  const supabase = getAdminSupabase();
  const { error } = await supabase.from(TABLE).insert(payload);
  if (error) failRedirect(SCOPE, "/admin/pricing-tiers/new", "db", error);
  refreshPages(REVALIDATE);
  redirect(LIST_PATH);
}

export async function updatePricingTierAction(id: string, formData: FormData) {
  await requireAdmin(`/admin/pricing-tiers/${id}`);
  const payload = readPayload(formData);
  if (!payload.name || !payload.price) {
    failRedirect(SCOPE, `/admin/pricing-tiers/${id}`, "missing");
  }
  const supabase = getAdminSupabase();
  const { error } = await supabase.from(TABLE).update(payload).eq("id", id);
  if (error) failRedirect(SCOPE, `/admin/pricing-tiers/${id}`, "db", error);
  refreshPages(REVALIDATE);
  redirect(LIST_PATH);
}

export async function deletePricingTierAction(formData: FormData) {
  await requireAdmin(LIST_PATH);
  const id = String(formData.get("id") ?? "");
  if (!id) failRedirect(SCOPE, LIST_PATH, "missing");
  await deleteRowSimple({
    scope: SCOPE,
    table: TABLE,
    id,
    listPath: LIST_PATH,
    revalidatePaths: REVALIDATE,
  });
}

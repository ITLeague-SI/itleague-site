"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/guard";
import { deleteRowSimple, refreshPages } from "@/lib/admin/crud";
import { failRedirect } from "@/lib/admin/errors";
import { getAdminSupabase } from "@/lib/supabase/admin";

const SCOPE = "pricing-features";
const TABLE = "pricing_features";
const LIST_PATH = "/admin/pricing-features";
const REVALIDATE = ["/admin/pricing-features"];

type Payload = {
  label: string;
  value_free: string;
  value_basic: string;
  value_core: string;
  value_pro: string;
  sort_order: number;
  published: boolean;
};

function readPayload(formData: FormData): Payload {
  return {
    label: String(formData.get("label") ?? "").trim(),
    value_free: String(formData.get("value_free") ?? ""),
    value_basic: String(formData.get("value_basic") ?? ""),
    value_core: String(formData.get("value_core") ?? ""),
    value_pro: String(formData.get("value_pro") ?? ""),
    sort_order:
      Number.parseInt(String(formData.get("sort_order") ?? "0"), 10) || 0,
    published: formData.get("published") === "on",
  };
}

export async function createPricingFeatureAction(formData: FormData) {
  await requireAdmin("/admin/pricing-features/new");
  const payload = readPayload(formData);
  if (!payload.label) {
    failRedirect(SCOPE, "/admin/pricing-features/new", "missing");
  }
  const supabase = getAdminSupabase();
  const { error } = await supabase.from(TABLE).insert(payload);
  if (error) failRedirect(SCOPE, "/admin/pricing-features/new", "db", error);
  refreshPages(REVALIDATE);
  redirect(LIST_PATH);
}

export async function updatePricingFeatureAction(id: string, formData: FormData) {
  await requireAdmin(`/admin/pricing-features/${id}`);
  const payload = readPayload(formData);
  if (!payload.label) {
    failRedirect(SCOPE, `/admin/pricing-features/${id}`, "missing");
  }
  const supabase = getAdminSupabase();
  const { error } = await supabase.from(TABLE).update(payload).eq("id", id);
  if (error) failRedirect(SCOPE, `/admin/pricing-features/${id}`, "db", error);
  refreshPages(REVALIDATE);
  redirect(LIST_PATH);
}

export async function deletePricingFeatureAction(formData: FormData) {
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

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/guard";
import { failRedirect } from "@/lib/admin/errors";
import { getAdminSupabase } from "@/lib/supabase/admin";

const SCOPE = "faqs";

type Payload = {
  question: string;
  answer: string;
  sort_order: number;
  published: boolean;
};

function readPayload(formData: FormData): Payload {
  return {
    question: String(formData.get("question") ?? "").trim(),
    answer: String(formData.get("answer") ?? "").trim(),
    sort_order: Number.parseInt(String(formData.get("sort_order") ?? "0"), 10) || 0,
    published: formData.get("published") === "on",
  };
}

function refreshPublicPaths() {
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/faqs");
}

export async function createFaqAction(formData: FormData) {
  await requireAdmin("/admin/faqs");
  const payload = readPayload(formData);
  if (!payload.question || !payload.answer) {
    failRedirect(SCOPE, "/admin/faqs/new", "missing");
  }
  const supabase = getAdminSupabase();
  const { error } = await supabase.from("faqs").insert(payload);
  if (error) {
    failRedirect(SCOPE, "/admin/faqs/new", "db", error);
  }
  refreshPublicPaths();
  redirect("/admin/faqs");
}

export async function updateFaqAction(id: string, formData: FormData) {
  await requireAdmin(`/admin/faqs/${id}`);
  const payload = readPayload(formData);
  if (!payload.question || !payload.answer) {
    failRedirect(SCOPE, `/admin/faqs/${id}`, "missing");
  }
  const supabase = getAdminSupabase();
  const { error } = await supabase.from("faqs").update(payload).eq("id", id);
  if (error) {
    failRedirect(SCOPE, `/admin/faqs/${id}`, "db", error);
  }
  refreshPublicPaths();
  redirect("/admin/faqs");
}

export async function deleteFaqAction(formData: FormData) {
  await requireAdmin("/admin/faqs");
  const id = String(formData.get("id") ?? "");
  if (!id) redirect("/admin/faqs");
  const supabase = getAdminSupabase();
  const { error } = await supabase.from("faqs").delete().eq("id", id);
  if (error) {
    failRedirect(SCOPE, "/admin/faqs", "db", error);
  }
  refreshPublicPaths();
  redirect("/admin/faqs");
}

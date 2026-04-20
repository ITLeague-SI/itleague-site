"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/guard";
import { getAdminSupabase } from "@/lib/supabase/admin";

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
    redirect("/admin/faqs/new?error=missing");
  }
  const supabase = getAdminSupabase();
  const { error } = await supabase.from("faqs").insert(payload);
  if (error) {
    redirect(`/admin/faqs/new?error=${encodeURIComponent(error.message)}`);
  }
  refreshPublicPaths();
  redirect("/admin/faqs");
}

export async function updateFaqAction(id: string, formData: FormData) {
  await requireAdmin(`/admin/faqs/${id}`);
  const payload = readPayload(formData);
  if (!payload.question || !payload.answer) {
    redirect(`/admin/faqs/${id}?error=missing`);
  }
  const supabase = getAdminSupabase();
  const { error } = await supabase.from("faqs").update(payload).eq("id", id);
  if (error) {
    redirect(`/admin/faqs/${id}?error=${encodeURIComponent(error.message)}`);
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
    redirect(`/admin/faqs?error=${encodeURIComponent(error.message)}`);
  }
  refreshPublicPaths();
  redirect("/admin/faqs");
}

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/guard";
import { getAdminSupabase } from "@/lib/supabase/admin";
import { removeImage, uploadImage } from "@/lib/supabase/storage";

function refresh() {
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/testimonials");
}

type BaseFields = {
  author_name: string;
  author_role: string | null;
  quote: string;
  sort_order: number;
  published: boolean;
};

function readBase(formData: FormData): BaseFields {
  return {
    author_name: String(formData.get("author_name") ?? "").trim(),
    author_role:
      String(formData.get("author_role") ?? "").trim() || null,
    quote: String(formData.get("quote") ?? "").trim(),
    sort_order:
      Number.parseInt(String(formData.get("sort_order") ?? "0"), 10) || 0,
    published: formData.get("published") === "on",
  };
}

async function photoFromForm(formData: FormData): Promise<string | null> {
  const file = formData.get("photo");
  if (file instanceof File && file.size > 0) {
    return uploadImage("testimonials", file);
  }
  return null;
}

export async function createTestimonialAction(formData: FormData) {
  await requireAdmin("/admin/testimonials/new");
  const base = readBase(formData);
  if (!base.author_name || !base.quote) {
    redirect("/admin/testimonials/new?error=missing");
  }

  let photo_url: string | null = null;
  try {
    photo_url = await photoFromForm(formData);
  } catch (e) {
    redirect(
      `/admin/testimonials/new?error=${encodeURIComponent(
        e instanceof Error ? e.message : "upload-failed"
      )}`
    );
  }

  const supabase = getAdminSupabase();
  const { error } = await supabase
    .from("testimonials")
    .insert({ ...base, photo_url });
  if (error) {
    if (photo_url) await removeImage(photo_url);
    redirect(
      `/admin/testimonials/new?error=${encodeURIComponent(error.message)}`
    );
  }
  refresh();
  redirect("/admin/testimonials");
}

export async function updateTestimonialAction(id: string, formData: FormData) {
  await requireAdmin(`/admin/testimonials/${id}`);
  const base = readBase(formData);
  if (!base.author_name || !base.quote) {
    redirect(`/admin/testimonials/${id}?error=missing`);
  }
  const removeCurrent = formData.get("remove_photo") === "on";

  const supabase = getAdminSupabase();
  const { data: current } = await supabase
    .from("testimonials")
    .select("photo_url")
    .eq("id", id)
    .maybeSingle();

  let photo_url: string | null = (current?.photo_url as string | null) ?? null;

  try {
    const uploaded = await photoFromForm(formData);
    if (uploaded) {
      if (photo_url) await removeImage(photo_url);
      photo_url = uploaded;
    } else if (removeCurrent && photo_url) {
      await removeImage(photo_url);
      photo_url = null;
    }
  } catch (e) {
    redirect(
      `/admin/testimonials/${id}?error=${encodeURIComponent(
        e instanceof Error ? e.message : "upload-failed"
      )}`
    );
  }

  const { error } = await supabase
    .from("testimonials")
    .update({ ...base, photo_url })
    .eq("id", id);
  if (error) {
    redirect(
      `/admin/testimonials/${id}?error=${encodeURIComponent(error.message)}`
    );
  }
  refresh();
  redirect("/admin/testimonials");
}

export async function deleteTestimonialAction(formData: FormData) {
  await requireAdmin("/admin/testimonials");
  const id = String(formData.get("id") ?? "");
  if (!id) redirect("/admin/testimonials");
  const supabase = getAdminSupabase();
  const { data: current } = await supabase
    .from("testimonials")
    .select("photo_url")
    .eq("id", id)
    .maybeSingle();
  const { error } = await supabase.from("testimonials").delete().eq("id", id);
  if (error) {
    redirect(`/admin/testimonials?error=${encodeURIComponent(error.message)}`);
  }
  await removeImage((current?.photo_url as string | null) ?? null);
  refresh();
  redirect("/admin/testimonials");
}

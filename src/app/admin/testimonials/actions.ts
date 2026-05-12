"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/guard";
import { failRedirect } from "@/lib/admin/errors";
import { getAdminSupabase } from "@/lib/supabase/admin";
import { removeImage, uploadImage } from "@/lib/supabase/storage";

const SCOPE = "testimonials";

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
    failRedirect(SCOPE, "/admin/testimonials/new", "missing");
  }

  const supabase = getAdminSupabase();
  const { data: inserted, error: insertError } = await supabase
    .from("testimonials")
    .insert({ ...base, photo_url: null })
    .select("id")
    .single();
  if (insertError || !inserted) {
    failRedirect(SCOPE, "/admin/testimonials/new", "db", insertError);
  }

  const file = formData.get("photo");
  if (file instanceof File && file.size > 0) {
    let photo_url: string;
    try {
      photo_url = await uploadImage("testimonials", file);
    } catch (e) {
      await supabase.from("testimonials").delete().eq("id", inserted!.id);
      failRedirect(SCOPE, "/admin/testimonials/new", "upload", e);
    }
    const { error: updateError } = await supabase
      .from("testimonials")
      .update({ photo_url: photo_url! })
      .eq("id", inserted!.id);
    if (updateError) {
      await removeImage(photo_url!);
      await supabase.from("testimonials").delete().eq("id", inserted!.id);
      failRedirect(SCOPE, "/admin/testimonials/new", "db", updateError);
    }
  }

  refresh();
  redirect("/admin/testimonials");
}

export async function updateTestimonialAction(id: string, formData: FormData) {
  await requireAdmin(`/admin/testimonials/${id}`);
  const base = readBase(formData);
  if (!base.author_name || !base.quote) {
    failRedirect(SCOPE, `/admin/testimonials/${id}`, "missing");
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
    failRedirect(SCOPE, `/admin/testimonials/${id}`, "upload", e);
  }

  const { error } = await supabase
    .from("testimonials")
    .update({ ...base, photo_url })
    .eq("id", id);
  if (error) {
    failRedirect(SCOPE, `/admin/testimonials/${id}`, "db", error);
  }
  refresh();
  redirect("/admin/testimonials");
}

export async function deleteTestimonialAction(formData: FormData) {
  await requireAdmin("/admin/testimonials");
  const id = String(formData.get("id") ?? "");
  if (!id) redirect("/admin/testimonials");
  const supabase = getAdminSupabase();
  const { data, error } = await supabase
    .from("testimonials")
    .delete()
    .eq("id", id)
    .select("photo_url")
    .maybeSingle();
  if (error) {
    failRedirect(SCOPE, "/admin/testimonials", "db", error);
  }
  await removeImage((data?.photo_url as string | null) ?? null);
  refresh();
  redirect("/admin/testimonials");
}

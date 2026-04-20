"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/guard";
import { getAdminSupabase } from "@/lib/supabase/admin";
import { removeImage, uploadImage } from "@/lib/supabase/storage";

function refresh() {
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/experts");
}

type BaseFields = {
  name: string;
  role: string | null;
  sort_order: number;
  published: boolean;
};

function readBase(formData: FormData): BaseFields {
  return {
    name: String(formData.get("name") ?? "").trim(),
    role: String(formData.get("role") ?? "").trim() || null,
    sort_order:
      Number.parseInt(String(formData.get("sort_order") ?? "0"), 10) || 0,
    published: formData.get("published") === "on",
  };
}

async function photoFromForm(formData: FormData): Promise<string | null> {
  const file = formData.get("photo");
  if (file instanceof File && file.size > 0) {
    return uploadImage("experts", file);
  }
  return null;
}

export async function createExpertAction(formData: FormData) {
  await requireAdmin("/admin/experts/new");
  const base = readBase(formData);
  if (!base.name) redirect("/admin/experts/new?error=missing");

  let photo_url: string | null = null;
  try {
    photo_url = await photoFromForm(formData);
  } catch (e) {
    redirect(
      `/admin/experts/new?error=${encodeURIComponent(
        e instanceof Error ? e.message : "upload-failed"
      )}`
    );
  }

  const supabase = getAdminSupabase();
  const { error } = await supabase
    .from("experts")
    .insert({ ...base, photo_url });
  if (error) {
    if (photo_url) await removeImage(photo_url);
    redirect(`/admin/experts/new?error=${encodeURIComponent(error.message)}`);
  }
  refresh();
  redirect("/admin/experts");
}

export async function updateExpertAction(id: string, formData: FormData) {
  await requireAdmin(`/admin/experts/${id}`);
  const base = readBase(formData);
  if (!base.name) redirect(`/admin/experts/${id}?error=missing`);
  const removeCurrent = formData.get("remove_photo") === "on";

  const supabase = getAdminSupabase();
  const { data: current } = await supabase
    .from("experts")
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
      `/admin/experts/${id}?error=${encodeURIComponent(
        e instanceof Error ? e.message : "upload-failed"
      )}`
    );
  }

  const { error } = await supabase
    .from("experts")
    .update({ ...base, photo_url })
    .eq("id", id);
  if (error) {
    redirect(`/admin/experts/${id}?error=${encodeURIComponent(error.message)}`);
  }
  refresh();
  redirect("/admin/experts");
}

export async function deleteExpertAction(formData: FormData) {
  await requireAdmin("/admin/experts");
  const id = String(formData.get("id") ?? "");
  if (!id) redirect("/admin/experts");
  const supabase = getAdminSupabase();
  const { data: current } = await supabase
    .from("experts")
    .select("photo_url")
    .eq("id", id)
    .maybeSingle();
  const { error } = await supabase.from("experts").delete().eq("id", id);
  if (error) {
    redirect(`/admin/experts?error=${encodeURIComponent(error.message)}`);
  }
  await removeImage((current?.photo_url as string | null) ?? null);
  refresh();
  redirect("/admin/experts");
}

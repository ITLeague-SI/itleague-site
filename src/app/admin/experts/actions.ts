"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/guard";
import { failRedirect } from "@/lib/admin/errors";
import { getAdminSupabase } from "@/lib/supabase/admin";
import { removeImage, uploadImage } from "@/lib/supabase/storage";

const SCOPE = "experts";

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
  if (!base.name) failRedirect(SCOPE, "/admin/experts/new", "missing");

  const supabase = getAdminSupabase();
  const { data: inserted, error: insertError } = await supabase
    .from("experts")
    .insert({ ...base, photo_url: null })
    .select("id")
    .single();
  if (insertError || !inserted) {
    failRedirect(SCOPE, "/admin/experts/new", "db", insertError);
  }

  const file = formData.get("photo");
  if (file instanceof File && file.size > 0) {
    let photo_url: string;
    try {
      photo_url = await uploadImage("experts", file);
    } catch (e) {
      await supabase.from("experts").delete().eq("id", inserted!.id);
      failRedirect(SCOPE, "/admin/experts/new", "upload", e);
    }
    const { error: updateError } = await supabase
      .from("experts")
      .update({ photo_url: photo_url! })
      .eq("id", inserted!.id);
    if (updateError) {
      await removeImage(photo_url!);
      await supabase.from("experts").delete().eq("id", inserted!.id);
      failRedirect(SCOPE, "/admin/experts/new", "db", updateError);
    }
  }

  refresh();
  redirect("/admin/experts");
}

export async function updateExpertAction(id: string, formData: FormData) {
  await requireAdmin(`/admin/experts/${id}`);
  const base = readBase(formData);
  if (!base.name) failRedirect(SCOPE, `/admin/experts/${id}`, "missing");
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
    failRedirect(SCOPE, `/admin/experts/${id}`, "upload", e);
  }

  const { error } = await supabase
    .from("experts")
    .update({ ...base, photo_url })
    .eq("id", id);
  if (error) {
    failRedirect(SCOPE, `/admin/experts/${id}`, "db", error);
  }
  refresh();
  redirect("/admin/experts");
}

export async function deleteExpertAction(formData: FormData) {
  await requireAdmin("/admin/experts");
  const id = String(formData.get("id") ?? "");
  if (!id) redirect("/admin/experts");
  const supabase = getAdminSupabase();
  const { data, error } = await supabase
    .from("experts")
    .delete()
    .eq("id", id)
    .select("photo_url")
    .maybeSingle();
  if (error) {
    failRedirect(SCOPE, "/admin/experts", "db", error);
  }
  await removeImage((data?.photo_url as string | null) ?? null);
  refresh();
  redirect("/admin/experts");
}

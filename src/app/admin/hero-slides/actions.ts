"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/guard";
import { getAdminSupabase } from "@/lib/supabase/admin";
import { removeImage, uploadImage } from "@/lib/supabase/storage";

function refresh() {
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/hero-slides");
}

type BaseFields = {
  alt: string | null;
  sort_order: number;
  published: boolean;
};

function readBase(formData: FormData): BaseFields {
  return {
    alt: String(formData.get("alt") ?? "").trim() || null,
    sort_order:
      Number.parseInt(String(formData.get("sort_order") ?? "0"), 10) || 0,
    published: formData.get("published") === "on",
  };
}

export async function createHeroSlideAction(formData: FormData) {
  await requireAdmin("/admin/hero-slides/new");
  const base = readBase(formData);
  const file = formData.get("photo");

  if (!(file instanceof File) || file.size === 0) {
    redirect("/admin/hero-slides/new?error=no-photo");
  }

  let photo_url: string;
  try {
    photo_url = await uploadImage("hero", file as File);
  } catch (e) {
    redirect(
      `/admin/hero-slides/new?error=${encodeURIComponent(
        e instanceof Error ? e.message : "upload-failed"
      )}`
    );
  }

  const supabase = getAdminSupabase();
  const { error } = await supabase
    .from("hero_slides")
    .insert({ ...base, photo_url });
  if (error) {
    await removeImage(photo_url);
    redirect(
      `/admin/hero-slides/new?error=${encodeURIComponent(error.message)}`
    );
  }
  refresh();
  redirect("/admin/hero-slides");
}

export async function updateHeroSlideAction(id: string, formData: FormData) {
  await requireAdmin(`/admin/hero-slides/${id}`);
  const base = readBase(formData);
  const file = formData.get("photo");

  const supabase = getAdminSupabase();
  const { data: current } = await supabase
    .from("hero_slides")
    .select("photo_url")
    .eq("id", id)
    .maybeSingle();

  let photo_url: string = (current?.photo_url as string) ?? "";

  if (file instanceof File && file.size > 0) {
    try {
      const uploaded = await uploadImage("hero", file);
      if (photo_url) await removeImage(photo_url);
      photo_url = uploaded;
    } catch (e) {
      redirect(
        `/admin/hero-slides/${id}?error=${encodeURIComponent(
          e instanceof Error ? e.message : "upload-failed"
        )}`
      );
    }
  }

  if (!photo_url) redirect(`/admin/hero-slides/${id}?error=no-photo`);

  const { error } = await supabase
    .from("hero_slides")
    .update({ ...base, photo_url })
    .eq("id", id);
  if (error) {
    redirect(
      `/admin/hero-slides/${id}?error=${encodeURIComponent(error.message)}`
    );
  }
  refresh();
  redirect("/admin/hero-slides");
}

export async function deleteHeroSlideAction(formData: FormData) {
  await requireAdmin("/admin/hero-slides");
  const id = String(formData.get("id") ?? "");
  if (!id) redirect("/admin/hero-slides");
  const supabase = getAdminSupabase();
  const { data: current } = await supabase
    .from("hero_slides")
    .select("photo_url")
    .eq("id", id)
    .maybeSingle();
  const { error } = await supabase.from("hero_slides").delete().eq("id", id);
  if (error) {
    redirect(`/admin/hero-slides?error=${encodeURIComponent(error.message)}`);
  }
  await removeImage((current?.photo_url as string | null) ?? null);
  refresh();
  redirect("/admin/hero-slides");
}

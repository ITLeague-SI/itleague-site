import "server-only";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { failRedirect } from "./errors";
import { getAdminSupabase } from "@/lib/supabase/admin";
import { removeImage, uploadImage } from "@/lib/supabase/storage";

type PhotoFolder = "experts" | "testimonials" | "hero";

type CommonArgs = {
  scope: string;
  table: string;
  listPath: string;
  revalidatePaths?: string[];
};

export function refreshPages(extra: string[] = []) {
  revalidatePath("/");
  revalidatePath("/admin");
  for (const p of extra) revalidatePath(p);
}

/**
 * Insert a row with photo_url=null first, upload the file, then update the row.
 * If anything fails the row + (any uploaded) file are removed so we never leak orphans.
 * Use for experts/testimonials where photo_url is nullable.
 */
export async function createRowWithOptionalPhoto<TBase extends object>(
  args: CommonArgs & {
    base: TBase;
    formData: FormData;
    folder: PhotoFolder;
    newPath: string;
  },
): Promise<never> {
  const { scope, table, base, formData, folder, newPath, listPath, revalidatePaths } = args;
  const supabase = getAdminSupabase();

  const { data: inserted, error: insertError } = await supabase
    .from(table)
    .insert({ ...base, photo_url: null })
    .select("id")
    .single();
  if (insertError || !inserted) {
    failRedirect(scope, newPath, "db", insertError);
  }
  const rowId = inserted!.id as string;

  const file = formData.get("photo");
  if (file instanceof File && file.size > 0) {
    let photo_url: string;
    try {
      photo_url = await uploadImage(folder, file);
    } catch (e) {
      await supabase.from(table).delete().eq("id", rowId);
      failRedirect(scope, newPath, "upload", e);
    }
    const { error: updateError } = await supabase
      .from(table)
      .update({ photo_url: photo_url! })
      .eq("id", rowId);
    if (updateError) {
      await removeImage(photo_url!);
      await supabase.from(table).delete().eq("id", rowId);
      failRedirect(scope, newPath, "db", updateError);
    }
  }

  refreshPages(revalidatePaths);
  redirect(listPath);
}

/**
 * Insert a row that always carries a photo (e.g. hero_slides where photo_url is NOT NULL).
 * The file is uploaded first; if the insert fails the file is removed.
 */
export async function createRowWithRequiredPhoto<TBase extends object>(
  args: CommonArgs & {
    base: TBase;
    formData: FormData;
    folder: PhotoFolder;
    newPath: string;
  },
): Promise<never> {
  const { scope, table, base, formData, folder, newPath, listPath, revalidatePaths } = args;
  const file = formData.get("photo");
  if (!(file instanceof File) || file.size === 0) {
    failRedirect(scope, newPath, "missing");
  }

  let photo_url: string;
  try {
    photo_url = await uploadImage(folder, file as File);
  } catch (e) {
    failRedirect(scope, newPath, "upload", e);
  }

  const supabase = getAdminSupabase();
  const { error } = await supabase
    .from(table)
    .insert({ ...base, photo_url: photo_url! });
  if (error) {
    await removeImage(photo_url!);
    failRedirect(scope, newPath, "db", error);
  }

  refreshPages(revalidatePaths);
  redirect(listPath);
}

/**
 * Update a row, handling optional photo replace / removal.
 * `requirePhoto` enforces a non-empty photo_url on the resulting row.
 */
export async function updateRowWithOptionalPhoto<TBase extends object>(
  args: CommonArgs & {
    id: string;
    base: TBase;
    formData: FormData;
    folder: PhotoFolder;
    editPath: string;
    requirePhoto?: boolean;
  },
): Promise<never> {
  const {
    scope, table, id, base, formData, folder,
    editPath, listPath, revalidatePaths, requirePhoto = false,
  } = args;
  const removeCurrent = formData.get("remove_photo") === "on";
  const supabase = getAdminSupabase();

  const { data: current } = await supabase
    .from(table)
    .select("photo_url")
    .eq("id", id)
    .maybeSingle();
  let photo_url: string | null = (current?.photo_url as string | null) ?? null;

  const file = formData.get("photo");
  if (file instanceof File && file.size > 0) {
    try {
      const uploaded = await uploadImage(folder, file);
      if (photo_url) await removeImage(photo_url);
      photo_url = uploaded;
    } catch (e) {
      failRedirect(scope, editPath, "upload", e);
    }
  } else if (removeCurrent && photo_url) {
    await removeImage(photo_url);
    photo_url = null;
  }

  if (requirePhoto && !photo_url) {
    failRedirect(scope, editPath, "missing");
  }

  const { error } = await supabase
    .from(table)
    .update({ ...base, photo_url })
    .eq("id", id);
  if (error) {
    failRedirect(scope, editPath, "db", error);
  }

  refreshPages(revalidatePaths);
  redirect(listPath);
}

/**
 * Delete a row in a single round-trip and clean up the associated photo (if any).
 */
export async function deleteRowWithPhoto(
  args: CommonArgs & { id: string },
): Promise<never> {
  const { scope, table, id, listPath, revalidatePaths } = args;
  const supabase = getAdminSupabase();

  const { data, error } = await supabase
    .from(table)
    .delete()
    .eq("id", id)
    .select("photo_url")
    .maybeSingle();
  if (error) {
    failRedirect(scope, listPath, "db", error);
  }
  await removeImage((data?.photo_url as string | null) ?? null);

  refreshPages(revalidatePaths);
  redirect(listPath);
}

/**
 * Delete a row that has no associated photo (e.g. faqs).
 */
export async function deleteRowSimple(
  args: CommonArgs & { id: string },
): Promise<never> {
  const { scope, table, id, listPath, revalidatePaths } = args;
  const supabase = getAdminSupabase();
  const { error } = await supabase.from(table).delete().eq("id", id);
  if (error) {
    failRedirect(scope, listPath, "db", error);
  }
  refreshPages(revalidatePaths);
  redirect(listPath);
}

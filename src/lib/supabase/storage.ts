import "server-only";
import { getAdminSupabase } from "./admin";

const BUCKET = "media";
const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);

export async function uploadImage(
  folder: "testimonials" | "hero" | "experts",
  file: File
): Promise<string> {
  if (file.size === 0) throw new Error("Файл пустой");
  if (file.size > MAX_BYTES) throw new Error("Файл больше 5 МБ");
  if (!ALLOWED.has(file.type)) {
    throw new Error("Разрешены только изображения: jpg, png, webp, avif");
  }

  const ext = file.name.split(".").pop()?.toLowerCase() || "bin";
  const rand = Math.random().toString(36).slice(2, 10);
  const path = `${folder}/${Date.now()}-${rand}.${ext}`;

  const supabase = getAdminSupabase();
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    contentType: file.type,
    upsert: false,
  });
  if (error) throw new Error(`Загрузка не удалась: ${error.message}`);

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export function storagePathFromPublicUrl(url: string): string | null {
  try {
    const u = new URL(url);
    const marker = `/storage/v1/object/public/${BUCKET}/`;
    const i = u.pathname.indexOf(marker);
    if (i === -1) return null;
    return u.pathname.slice(i + marker.length);
  } catch {
    return null;
  }
}

export async function removeImage(publicUrl: string | null | undefined) {
  if (!publicUrl) return;
  const path = storagePathFromPublicUrl(publicUrl);
  if (!path) return;
  const supabase = getAdminSupabase();
  await supabase.storage.from(BUCKET).remove([path]);
}

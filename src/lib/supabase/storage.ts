import "server-only";
import { getAdminSupabase } from "./admin";

const BUCKET = "media";
const MAX_BYTES = 5 * 1024 * 1024;

type DetectedImage = { mime: string; ext: "jpg" | "png" | "webp" | "avif" };

async function detectImageType(file: File): Promise<DetectedImage | null> {
  const head = new Uint8Array(await file.slice(0, 16).arrayBuffer());
  if (head.length < 12) return null;

  // JPEG: FF D8 FF
  if (head[0] === 0xff && head[1] === 0xd8 && head[2] === 0xff) {
    return { mime: "image/jpeg", ext: "jpg" };
  }
  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    head[0] === 0x89 &&
    head[1] === 0x50 &&
    head[2] === 0x4e &&
    head[3] === 0x47 &&
    head[4] === 0x0d &&
    head[5] === 0x0a &&
    head[6] === 0x1a &&
    head[7] === 0x0a
  ) {
    return { mime: "image/png", ext: "png" };
  }
  // WebP: "RIFF" .... "WEBP"
  if (
    head[0] === 0x52 &&
    head[1] === 0x49 &&
    head[2] === 0x46 &&
    head[3] === 0x46 &&
    head[8] === 0x57 &&
    head[9] === 0x45 &&
    head[10] === 0x42 &&
    head[11] === 0x50
  ) {
    return { mime: "image/webp", ext: "webp" };
  }
  // AVIF: ISO BMFF "ftyp" at offset 4, brand "avif"/"avis"
  if (
    head[4] === 0x66 &&
    head[5] === 0x74 &&
    head[6] === 0x79 &&
    head[7] === 0x70 &&
    head[8] === 0x61 &&
    head[9] === 0x76 &&
    head[10] === 0x69 &&
    (head[11] === 0x66 || head[11] === 0x73)
  ) {
    return { mime: "image/avif", ext: "avif" };
  }
  return null;
}

export async function uploadImage(
  folder: "testimonials" | "hero" | "experts",
  file: File
): Promise<string> {
  if (file.size === 0) throw new Error("Файл пустой");
  if (file.size > MAX_BYTES) throw new Error("Файл больше 5 МБ");

  const detected = await detectImageType(file);
  if (!detected) {
    throw new Error("Разрешены только изображения: jpg, png, webp, avif");
  }

  const rand = crypto.getRandomValues(new Uint8Array(8));
  const randHex = Array.from(rand, (b) => b.toString(16).padStart(2, "0")).join(
    "",
  );
  const path = `${folder}/${Date.now()}-${randHex}.${detected.ext}`;

  const supabase = getAdminSupabase();
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    contentType: detected.mime,
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

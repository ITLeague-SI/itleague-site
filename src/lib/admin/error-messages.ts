const MESSAGES: Record<string, string> = {
  missing: "Заполни обязательные поля.",
  upload:
    "Не удалось загрузить файл. Проверь формат (jpg/png/webp/avif) и размер до 5 МБ.",
  db: "Ошибка базы данных. Попробуй позже.",
  internal: "Внутренняя ошибка. Попробуй позже.",
  no_config:
    "Supabase не настроен. Укажи переменные окружения в .env.local.",
};

export function adminErrorMessage(
  code: string | null | undefined,
): string | null {
  if (!code) return null;
  return MESSAGES[code] ?? MESSAGES.internal;
}

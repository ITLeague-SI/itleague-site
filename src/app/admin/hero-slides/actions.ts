"use server";

import { requireAdmin } from "@/lib/auth/guard";
import {
  createRowWithRequiredPhoto,
  deleteRowWithPhoto,
  updateRowWithOptionalPhoto,
} from "@/lib/admin/crud";
import { failRedirect } from "@/lib/admin/errors";

const SCOPE = "hero-slides";
const TABLE = "hero_slides";
const LIST_PATH = "/admin/hero-slides";
const REVALIDATE = ["/admin/hero-slides"];

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
  await createRowWithRequiredPhoto({
    scope: SCOPE,
    table: TABLE,
    base,
    formData,
    folder: "hero",
    newPath: "/admin/hero-slides/new",
    listPath: LIST_PATH,
    revalidatePaths: REVALIDATE,
  });
}

export async function updateHeroSlideAction(id: string, formData: FormData) {
  await requireAdmin(`/admin/hero-slides/${id}`);
  const base = readBase(formData);
  await updateRowWithOptionalPhoto({
    scope: SCOPE,
    table: TABLE,
    id,
    base,
    formData,
    folder: "hero",
    editPath: `/admin/hero-slides/${id}`,
    listPath: LIST_PATH,
    revalidatePaths: REVALIDATE,
    requirePhoto: true,
  });
}

export async function deleteHeroSlideAction(formData: FormData) {
  await requireAdmin(LIST_PATH);
  const id = String(formData.get("id") ?? "");
  if (!id) failRedirect(SCOPE, LIST_PATH, "missing");
  await deleteRowWithPhoto({
    scope: SCOPE,
    table: TABLE,
    id,
    listPath: LIST_PATH,
    revalidatePaths: REVALIDATE,
  });
}

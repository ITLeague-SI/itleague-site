"use server";

import { requireAdmin } from "@/lib/auth/guard";
import {
  createRowWithOptionalPhoto,
  deleteRowWithPhoto,
  updateRowWithOptionalPhoto,
} from "@/lib/admin/crud";
import { failRedirect } from "@/lib/admin/errors";

const SCOPE = "experts";
const TABLE = "experts";
const LIST_PATH = "/admin/experts";
const REVALIDATE = ["/admin/experts"];

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

export async function createExpertAction(formData: FormData) {
  await requireAdmin("/admin/experts/new");
  const base = readBase(formData);
  if (!base.name) failRedirect(SCOPE, "/admin/experts/new", "missing");
  await createRowWithOptionalPhoto({
    scope: SCOPE,
    table: TABLE,
    base,
    formData,
    folder: "experts",
    newPath: "/admin/experts/new",
    listPath: LIST_PATH,
    revalidatePaths: REVALIDATE,
  });
}

export async function updateExpertAction(id: string, formData: FormData) {
  await requireAdmin(`/admin/experts/${id}`);
  const base = readBase(formData);
  if (!base.name) failRedirect(SCOPE, `/admin/experts/${id}`, "missing");
  await updateRowWithOptionalPhoto({
    scope: SCOPE,
    table: TABLE,
    id,
    base,
    formData,
    folder: "experts",
    editPath: `/admin/experts/${id}`,
    listPath: LIST_PATH,
    revalidatePaths: REVALIDATE,
  });
}

export async function deleteExpertAction(formData: FormData) {
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

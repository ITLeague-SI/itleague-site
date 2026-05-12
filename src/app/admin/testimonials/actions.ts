"use server";

import { requireAdmin } from "@/lib/auth/guard";
import {
  createRowWithOptionalPhoto,
  deleteRowWithPhoto,
  updateRowWithOptionalPhoto,
} from "@/lib/admin/crud";
import { failRedirect } from "@/lib/admin/errors";

const SCOPE = "testimonials";
const TABLE = "testimonials";
const LIST_PATH = "/admin/testimonials";
const REVALIDATE = ["/admin/testimonials"];

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

export async function createTestimonialAction(formData: FormData) {
  await requireAdmin("/admin/testimonials/new");
  const base = readBase(formData);
  if (!base.author_name || !base.quote) {
    failRedirect(SCOPE, "/admin/testimonials/new", "missing");
  }
  await createRowWithOptionalPhoto({
    scope: SCOPE,
    table: TABLE,
    base,
    formData,
    folder: "testimonials",
    newPath: "/admin/testimonials/new",
    listPath: LIST_PATH,
    revalidatePaths: REVALIDATE,
  });
}

export async function updateTestimonialAction(id: string, formData: FormData) {
  await requireAdmin(`/admin/testimonials/${id}`);
  const base = readBase(formData);
  if (!base.author_name || !base.quote) {
    failRedirect(SCOPE, `/admin/testimonials/${id}`, "missing");
  }
  await updateRowWithOptionalPhoto({
    scope: SCOPE,
    table: TABLE,
    id,
    base,
    formData,
    folder: "testimonials",
    editPath: `/admin/testimonials/${id}`,
    listPath: LIST_PATH,
    revalidatePaths: REVALIDATE,
  });
}

export async function deleteTestimonialAction(formData: FormData) {
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

import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function detectContentType(buffer: Buffer): string | null {
  if (
    buffer.length >= 8 &&
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47
  ) {
    return "image/png";
  }
  if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8) {
    return "image/jpeg";
  }
  if (
    buffer.length >= 12 &&
    buffer[0] === 0x52 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x46 &&
    buffer[8] === 0x57 &&
    buffer[9] === 0x45 &&
    buffer[10] === 0x42 &&
    buffer[11] === 0x50
  ) {
    return "image/webp";
  }
  return null;
}

const ASSETS_ROOT = path.join(process.cwd(), "public", "figma-assets");

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  if (!UUID_RE.test(id)) {
    return new NextResponse("Bad Request", { status: 400 });
  }

  const filePath = path.join(ASSETS_ROOT, `${id.toLowerCase()}.asset`);
  const resolved = path.resolve(filePath);
  if (!resolved.startsWith(ASSETS_ROOT + path.sep)) {
    return new NextResponse("Bad Request", { status: 400 });
  }

  let buffer: Buffer;
  try {
    buffer = await readFile(resolved);
  } catch (err) {
    const code = (err as NodeJS.ErrnoException).code;
    if (code === "ENOENT" || code === "EISDIR") {
      return new NextResponse("Not Found", { status: 404 });
    }
    return new NextResponse("Internal Error", { status: 500 });
  }

  const contentType = detectContentType(buffer);
  if (!contentType) {
    return new NextResponse("Unsupported Media Type", { status: 415 });
  }

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Cache-Control": "public, max-age=31536000, immutable",
      "Content-Type": contentType,
      "X-Content-Type-Options": "nosniff",
    },
  });
}

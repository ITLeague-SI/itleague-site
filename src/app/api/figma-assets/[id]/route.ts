import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

const contentTypes = {
  png: "image/png",
  jpg: "image/jpeg",
  svg: "image/svg+xml",
} as const;

function getContentType(buffer: Buffer) {
  if (buffer.subarray(0, 4).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47]))) {
    return contentTypes.png;
  }

  if (buffer.subarray(0, 2).equals(Buffer.from([0xff, 0xd8]))) {
    return contentTypes.jpg;
  }

  return contentTypes.svg;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const safeId = id.replace(/[^a-f0-9-]/gi, "");
  const filePath = path.join(process.cwd(), "public", "figma-assets", `${safeId}.asset`);
  const buffer = await readFile(filePath);

  return new NextResponse(buffer, {
    headers: {
      "Cache-Control": "public, max-age=31536000, immutable",
      "Content-Type": getContentType(buffer),
    },
  });
}

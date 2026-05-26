import map from "./figma-assets-map.json";

const extByUuid = map as Record<string, string>;

export function figmaAsset(id: string): string {
  const ext = extByUuid[id];
  if (!ext) {
    throw new Error(
      `figmaAsset: no extension registered for "${id}". Did you forget to add the file to public/figma-assets/?`,
    );
  }
  return `/figma-assets/${id}.${ext}`;
}

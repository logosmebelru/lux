const EXTENSIONS = ["avif", "webp", "jpg", "jpeg", "png"];

export function buildAssetCandidateChain(src) {
  if (!src || typeof src !== "string") {
    return [];
  }

  const match = src.match(/^(.*)\.([a-z0-9]+)(\?.*)?$/i);
  if (!match) {
    return [src];
  }

  const base = match[1];
  const originalExt = match[2].toLowerCase();
  const query = match[3] || "";

  const variants = [src];
  for (const ext of EXTENSIONS) {
    if (ext !== originalExt) {
      variants.push(`${base}.${ext}${query}`);
    }
  }

  return variants;
}

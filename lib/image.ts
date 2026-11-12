export const FALLBACK_IMAGE = "/assets/studio-photo-dRYpf4Lz.jpg";

const INVALID_IMAGE_VALUES = new Set(["null", "undefined", "none"]);

export function sanitizeImageSrc(value: unknown): string | null {
  if (typeof value !== "string") return null;

  const trimmed = value.trim();
  if (trimmed === "") return null;
  if (INVALID_IMAGE_VALUES.has(trimmed.toLowerCase())) return null;

  return trimmed;
}

export function firstImage(...values: unknown[]): string {
  for (const value of values) {
    const src = sanitizeImageSrc(value);
    if (src !== null) return src;
  }
  return FALLBACK_IMAGE;
}

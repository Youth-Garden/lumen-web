// Utilities for generating DiceBear avatar URLs via the public API.
// ----------------------------------------------------------------
// DiceBear exposes a large collection of avatar styles that are rendered
// as SVG or PNG through a simple HTTP GET request. This helper builds the
// URL for the **8.x** API (the current stable version) and keeps the list
// of supported styles in one place.

/**
 * All officially supported DiceBear styles for the 8.x API.
 * The list mirrors the styles enumerated in the DiceBear docs:
 * https://www.dicebear.com/styles
 */
export const AvatarStyles = [
  // human-like avatars
  'avataaars',
  'big-ears',
  'big-ears-neutral',
  // pixel-art avatars
  'pixel-art',
  'pixel-art-neutral',
  // bot / robot avatars
  'bottts',
  // simple geometric avatars
  'identicon',
  'initials',
  // hand-drawn style
  'micah',
  // cartoon-style avatar
  'thumbs',
] as const;

/**
 * Generate a DiceBear avatar URL.
 *
 * @param style   The avatar style - must be one of {@link DiceBearStyles}.
 * @param seed    A deterministic seed (e.g. user id, email, username).
 * @param options Optional query parameters passed straight to the API.
 *                Typical values are `size`, `radius`, `backgroundColor`, ...
 * @returns A fully-qualified URL pointing at the generated SVG.
 */
export function getAvatarUrl(
  style: (typeof AvatarStyles)[number],
  seed: string,
  options: Record<string, string | number> = {},
): string {
  // Use the SVG format because it scales cleanly inside React components.
  // Callers that need PNG can switch the extension to `png`.
  const base = `https://api.dicebear.com/8.x/${style}/svg`;

  // The API expects the seed to be URL-encoded.
  const params = new URLSearchParams({ seed });

  // Append any additional options, converting all values to strings.
  Object.entries(options).forEach(([key, value]) => {
    params.append(key, String(value));
  });

  return `${base}?${params.toString()}`;
}

/**
 * Convenience helper that returns a data-URI containing the SVG. This is
 * useful when you want to avoid an extra network request at runtime: the
 * SVG is fetched once and embedded inline. The function performs a `fetch`
 * under the hood, so it returns a Promise.
 *
 * @param style   Desired DiceBear style.
 * @param seed    Seed value for deterministic output.
 * @param options Same options as {@link getDiceBearAvatarUrl}.
 * @returns Promise that resolves to a `data:image/svg+xml;base64,...` URL.
 */
export async function getAvatarDataUri(
  style: (typeof AvatarStyles)[number],
  seed: string,
  options: (typeof AvatarStyles)[number] extends never
    ? never
    : Record<string, string | number> = {},
): Promise<string> {
  const url = getAvatarUrl(style, seed, options);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch DiceBear avatar: ${response.status}`);
  }
  const svg = await response.text();
  const base64 = Buffer.from(svg, 'utf-8').toString('base64');
  return `data:image/svg+xml;base64,${base64}`;
}

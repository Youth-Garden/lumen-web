// DiceBear avatar helper
// This module provides a simple, dependency‑free way to construct DiceBear avatar URLs
// for the various styles offered by the public DiceBear API.
//
// Usage example (in a React component):
//   import { getDiceBearUrl, diceBearStyles } from '@/lib/avatar';
//   const avatarUrl = getDiceBearUrl('avataaars', user.id, { background: '#f0f0f0' });
//   <img src={avatarUrl} alt="User avatar" />
//
// The API endpoint format is:
//   https://avatars.dicebear.com/v2/<style>/<seed>.svg   (or .png for PNG output)
//   Optional query parameters can be added for size, colors, etc.

export const diceBearStyles = [
  // Classic styles
  'avataaars',
  'bottts',
  'croodles',
  'croodles-neutral',
  'identicon',
  'initials',
  'micah',
  'miniavs',
  'open-peeps',
  // Pixel art family
  'pixel-art',
  'pixel-art-neutral',
  'pixel-art-neutral-skin',
  'pixel-art-skin',
  'pixel-art-skin-variant',
  'pixel-art-skin-variant2',
  'pixel-art-skin-variant3',
  'pixel-art-skin-variant4',
  'pixel-art-skin-variant5',
  // Big‑ears family (legacy)
  'big-ears',
  'big-ears-neutral',
  'big-ears-neutral-skin',
  'big-ears-skin',
  'big-ears-skin-variant',
  // Additional experimental / themed styles
  'adventurer',
  'adventurer-neutral',
  'adventurer-neutral-skin',
  'adventurer-skin',
  'adventurer-skin-variant',
  'personas',
  'personas-neutral',
  'personas-skin',
  'personas-skin-variant',
  'robot',
  'human',
  'human-neutral',
  'human-skin',
  'human-skin-variant',
];

/**
 * Optional parameters that can be passed to the DiceBear API.
 * Refer to the DiceBear documentation for the full list of supported keys.
 */
export interface DiceBearOptions {
  size?: number;            // Desired height/width in pixels
  background?: string;      // Hex colour without the leading '#', e.g. "%23ffffff"
  // Any other query parameters supported by the API can be added here.
  [key: string]: string | number | undefined;
}

function encode(str: string): string {
  return encodeURIComponent(str);
}

/**
 * Build a DiceBear SVG avatar URL.
 * @param style The avatar style – must be one of `diceBearStyles`.
 * @param seed  A deterministic seed (e.g. user ID, username, email).
 * @param options Optional query parameters.
 */
export function getDiceBearUrl(
  style: string,
  seed: string,
  options?: DiceBearOptions,
): string {
  const base = `https://avatars.dicebear.com/v2/${encode(style)}/${encode(seed)}.svg`;
  if (!options || Object.keys(options).length === 0) return base;
  const query = Object.entries(options)
    .filter(([, v]) => v !== undefined)
    .map(([k, v]) => `${encode(k)}=${encode(String(v))}`)
    .join('&');
  return `${base}?${query}`;
}

/**
 * Build a DiceBear PNG avatar URL.
 * Same parameters as `getDiceBearUrl` but returns a PNG image.
 */
export function getDiceBearUrlPng(
  style: string,
  seed: string,
  options?: DiceBearOptions,
): string {
  const base = `https://avatars.dicebear.com/v2/${encode(style)}/${encode(seed)}.png`;
  if (!options || Object.keys(options).length === 0) return base;
  const query = Object.entries(options)
    .filter(([, v]) => v !== undefined)
    .map(([k, v]) => `${encode(k)}=${encode(String(v))}`)
    .join('&');
  return `${base}?${query}`;
}

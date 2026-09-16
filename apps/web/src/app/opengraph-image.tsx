import { ImageResponse } from 'next/og';
import { readFile } from 'fs/promises';
import { join } from 'path';

export const runtime = 'nodejs';
export const alt = 'Lumen Learning Dashboard';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  const logoData = await readFile(join(process.cwd(), 'public/logo.png'));

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(to bottom right, #ffffff, #f8fafc)',
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        // @ts-expect-error - NextJS img
        src={logoData.buffer as ArrayBuffer}
        alt="Lumen Logo"
        style={{ width: '600px', height: '600px', objectFit: 'contain' }}
      />
    </div>,
    { ...size },
  );
}

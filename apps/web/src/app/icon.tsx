import { ImageResponse } from 'next/og';
import { readFile } from 'fs/promises';
import { join } from 'path';

export const runtime = 'nodejs';
export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default async function Icon() {
  const logoData = await readFile(join(process.cwd(), 'public/logo.png'));

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <img
        // @ts-expect-error - NextJS img
        src={logoData.buffer as ArrayBuffer}
        alt="Icon"
        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
      />
    </div>,
    { ...size },
  );
}

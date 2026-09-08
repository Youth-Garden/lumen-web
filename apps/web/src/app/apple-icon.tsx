import { readFile } from 'fs/promises';
import { ImageResponse } from 'next/og';
import { join } from 'path';

export const runtime = 'nodejs';
export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default async function AppleIcon() {
  const logoData = await readFile(join(process.cwd(), 'public/logo.png'));

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#ffffff',
        borderRadius: '20px',
      }}
    >
      <img
        // @ts-expect-error - NextJS img
        src={logoData.buffer as ArrayBuffer}
        alt="Apple Icon"
        style={{ width: '80%', height: '80%', objectFit: 'contain' }}
      />
    </div>,
    { ...size },
  );
}

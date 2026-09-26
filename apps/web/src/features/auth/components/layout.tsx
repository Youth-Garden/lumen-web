'use client';

import { OpenEffect } from '@lumen/uikit/components';
import { useTranslations } from 'next-intl';
import { PropsWithChildren, useId } from 'react';
import { Silk } from './silk';

export default function AuthLayout({ children }: PropsWithChildren) {
  const t = useTranslations('Auth.Layout');
  // useId() trả về dạng ":r0:" — bỏ dấu ":" để dùng an toàn trong id/url()
  const waveId = `wave-edge-${useId().replace(/:/g, '')}`;

  return (
    <div className="min-h-screen w-full flex relative">
      {/* Left side - Silk Brand Background */}
      <div className="hidden lg:flex lg:w-7/12 relative overflow-hidden">
        {/* Lớp nền được clip theo hình sóng — chỉ clip phần visual, không clip text */}
        <div
          className="absolute inset-0"
          style={{ clipPath: `url(#${waveId})` }}
        >
          {/* React Bits Silk WebGL background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#1e3a8a] via-[#2563eb] to-[#38bdf8]">
            <Silk
              speed={5}
              scale={1}
              color="#66abff"
              noiseIntensity={1.5}
              rotation={0}
              lightMode={true}
            />
          </div>

          {/* Vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/5 to-black/25 pointer-events-none" />

          {/* Dot grid */}
          <div
            className="absolute inset-0 opacity-[0.06] pointer-events-none"
            style={{
              backgroundImage:
                'radial-gradient(circle, #ffffff 1px, transparent 1px)',
              backgroundSize: '22px 22px',
            }}
          />
        </div>

        {/* Định nghĩa path cho mép sóng — chỉnh amplitude/tần số ở đây */}
        <svg width="0" height="0" className="absolute" aria-hidden="true">
          <defs>
            <clipPath id={waveId} clipPathUnits="objectBoundingBox">
              <path
                d="M0,0
                   L0.82,0
                   Q0.97,0.08 0.85,0.15
                   Q0.73,0.22 0.85,0.3
                   Q0.97,0.38 0.85,0.45
                   Q0.73,0.52 0.85,0.6
                   Q0.97,0.68 0.85,0.75
                   Q0.73,0.82 0.85,0.9
                   Q0.95,0.95 0.9,1
                   L0,1
                   Z"
              />
            </clipPath>
          </defs>
        </svg>

        {/* Content — nằm ngoài clip nên chữ không bao giờ bị cắt */}
        <div className="absolute bottom-16 left-16 z-20 text-white max-w-lg">
          <h1 className="text-5xl font-bold mb-4 tracking-tight leading-[1.1] text-white">
            {t('title')}
          </h1>
          <p className="text-zinc-100/90 text-lg leading-relaxed">
            {t('subtitle')}
          </p>
        </div>
      </div>

      {/* Right side - Auth Form */}
      <div className="w-full lg:w-5/12 flex flex-col justify-center items-center px-4 sm:px-12 xl:px-24">
        <OpenEffect className="w-full max-w-[550px]">{children}</OpenEffect>
      </div>
    </div>
  );
}

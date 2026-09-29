'use client';

import { OpenEffect } from '@lumen/uikit/components';
import { useTranslations } from 'next-intl';
import { PropsWithChildren } from 'react';
import { Silk } from './silk';

export default function AuthLayout({ children }: PropsWithChildren) {
  const t = useTranslations('Auth.Layout');

  return (
    <div className="min-h-screen w-full flex p-3 lg:p-4 overflow-x-hidden">
      {/* Left side - Minimal Hero Panel with Bottom-Left Copy */}
      <div className="hidden lg:flex lg:w-[52%] xl:w-[54%] relative select-none flex-col justify-end p-8 xl:p-14 rounded-3xl overflow-hidden text-white shadow-2xl bg-[#090d16] my-1 ml-1">
        {/* WebGL Silk Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#090e1a] via-[#102456] to-[#1e40af]">
            <Silk
              speed={3.5}
              scale={1.1}
              color="#3b82f6"
              noiseIntensity={1.2}
              rotation={0}
              lightMode={true}
            />
          </div>

          {/* Radial Ambient Glow */}
          <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

          {/* Vignette Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/30 pointer-events-none" />

          {/* Subtle Dot Grid */}
          <div
            className="absolute inset-0 opacity-[0.06] pointer-events-none"
            style={{
              backgroundImage:
                'radial-gradient(circle, #ffffff 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />
        </div>

        {/* Bottom-Left Main Content Block */}
        <div className="relative z-20 max-w-lg pb-2 xl:pb-6">
          <h1 className="text-3xl xl:text-4xl font-extrabold tracking-tight text-white leading-[1.25]">
            <span className="block">{t('titleLine1')}</span>
            <span className="block">{t('titleLine2')}</span>
            <span className="block">{t('titleLine3')}</span>
          </h1>
        </div>
      </div>

      {/* Right side - Auth Form Container */}
      <div className="w-full lg:w-[48%] xl:w-[46%] flex flex-col justify-center items-center px-6 sm:px-12 lg:px-12 xl:px-16 py-8">
        <OpenEffect className="w-full max-w-[560px]">{children}</OpenEffect>
      </div>
    </div>
  );
}

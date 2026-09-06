import { PropsWithChildren } from 'react';
import { useTranslations } from 'next-intl';
import { OpenEffect } from '@lumen/uikit/components';
import { Silk } from './silk';

export default function AuthLayout({ children }: PropsWithChildren) {
  const t = useTranslations('Auth.Layout');

  return (
    <div className="min-h-screen w-full flex bg-background relative">
      {/* Left side - Silk Brand Background */}
      <div className="hidden lg:flex lg:w-7/12 relative overflow-hidden">
        {/* React Bits Silk WebGL background */}
        <div className="absolute inset-0">
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
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/5 to-black/25 z-10 pointer-events-none" />

        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.06] z-10 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle, #ffffff 1px, transparent 1px)',
            backgroundSize: '22px 22px',
          }}
        />

        {/* Content */}
        <div className="absolute bottom-16 left-16 z-20 text-white max-w-lg animate-in slide-in-from-bottom-8 duration-700">
          <h1 className="text-5xl font-bold mb-4 tracking-tight leading-[1.1]">
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

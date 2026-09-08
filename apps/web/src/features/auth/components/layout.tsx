'use client';

import { PropsWithChildren } from 'react';
import { useTranslations } from 'next-intl';
import { motion, type Variants } from 'framer-motion';
import { OpenEffect } from '@lumen/uikit/components';
import { Silk } from './silk';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.3,
    },
  },
};

const charVariants: Variants = {
  hidden: { opacity: 0, y: 24, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.7,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

const subtitleVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      delay: 0.2,
      ease: 'easeOut',
    },
  },
};

function AnimatedHeadline({ text }: { text: string }) {
  return (
    <motion.h1
      className="text-5xl font-bold mb-4 tracking-tight leading-[1.1] gradient-text drop-shadow-[0_0_30px_rgba(102,171,255,0.4)]"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      aria-label={text}
    >
      {text.split('').map((char, i) => (
        <motion.span
          key={`${char}-${i}`}
          variants={charVariants}
          className="inline-block whitespace-pre"
          aria-hidden="true"
        >
          {char}
        </motion.span>
      ))}
    </motion.h1>
  );
}

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
        <div className="absolute bottom-16 left-16 z-20 text-white max-w-lg">
          <AnimatedHeadline text={t('title')} />
          <motion.p
            className="text-zinc-100/90 text-lg leading-relaxed"
            variants={subtitleVariants}
            initial="hidden"
            animate="visible"
          >
            {t('subtitle')}
          </motion.p>
        </div>
      </div>

      {/* Right side - Auth Form */}
      <div className="w-full lg:w-5/12 flex flex-col justify-center items-center px-4 sm:px-12 xl:px-24">
        <OpenEffect className="w-full max-w-[550px]">{children}</OpenEffect>
      </div>
    </div>
  );
}

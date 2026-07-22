'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { motion, useReducedMotion } from 'framer-motion';
import { Icons } from '@lumen/uikit/icons';
import { RouteEnum } from '@/shared/constants';
import { NoiseTexture } from '@/shared/components/noise-texture';
import { Backlight } from '@/shared/components/backlight';
import { NeonGradientCard } from '@/shared/components/neon-gradient-card';
import { PulsatingButton } from '@/shared/components/pulsating-button';
import { InteractiveHoverButton } from '@/shared/components/interactive-hover-button';
import { fadeUpVariants, staggerContainer } from './animations';

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80';

export function Hero() {
  const t = useTranslations('Index');
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      className="relative overflow-hidden pt-24 pb-20 lg:pt-32 lg:pb-28"
      aria-labelledby="hero-title"
    >
      {/* Background Noise Texture */}
      <NoiseTexture noiseOpacity={0.15} slope={0.12} frequency={0.5} />

      {/* Decorative background gradients & Backlight */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px]"
      >
        <Backlight blur={80} className="absolute left-1/2 top-10 -translate-x-1/2 opacity-60">
          <div className="h-[400px] w-[600px] rounded-full bg-gradient-to-r from-primary/30 to-sky-400/20" />
        </Backlight>
      </div>

      <motion.div
        initial="hidden"
        animate="show"
        variants={staggerContainer}
        className="container relative z-10 mx-auto px-4 flex flex-col items-center text-center"
      >
        <motion.div
          variants={fadeUpVariants}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary shadow-sm backdrop-blur-md"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
          </span>
          {t('versionLaunched')}
        </motion.div>

        <motion.h1
          variants={fadeUpVariants}
          className="mb-8 max-w-4xl text-5xl font-black leading-[1.1] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl"
        >
          <span className="block text-foreground">{t('heroTitle1')}</span>
          <span className="mt-2 block bg-gradient-to-r from-primary via-indigo-500 to-sky-500 bg-clip-text text-transparent">
            {t('heroTitle2')}
          </span>
        </motion.h1>

        <motion.p
          variants={fadeUpVariants}
          className="mb-10 max-w-2xl text-lg font-medium leading-relaxed text-muted-foreground sm:text-xl"
        >
          {t('heroSubtitle')}
        </motion.p>

        <motion.div
          variants={fadeUpVariants}
          className="flex w-full flex-col items-center justify-center gap-4 sm:w-auto sm:flex-row"
        >
          <Link href={RouteEnum.LOGIN} className="w-full sm:w-auto">
            <PulsatingButton
              pulseColor="rgba(59, 130, 246, 0.35)"
              className="w-full sm:w-auto min-h-[52px] text-base"
            >
              {t('startFree')}
              <Icons name="arrow-right" className="h-5 w-5" />
            </PulsatingButton>
          </Link>
          <Link href="#features" className="w-full sm:w-auto">
            <InteractiveHoverButton className="w-full sm:w-auto min-h-[52px]">
              {t('exploreFeatures')}
            </InteractiveHoverButton>
          </Link>
        </motion.div>

        {/* Big Dashboard/Image wrapped in NeonGradientCard */}
        <motion.div
          variants={fadeUpVariants}
          className="relative mt-16 w-full max-w-5xl lg:mt-24"
        >
          <NeonGradientCard
            borderSize={2}
            borderRadius={24}
            neonColors={{ firstColor: '#3b82f6', secondColor: '#06b6d4' }}
            className="shadow-2xl"
          >
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-card border border-border/40">
              <div className="absolute inset-0 bg-gradient-to-t from-background/30 via-transparent to-transparent z-10 pointer-events-none" />
              <Image
                src={HERO_IMAGE}
                alt={t('heroTitle1') + ' ' + t('heroTitle2')}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 1024px"
                className="object-cover"
              />
            </div>
          </NeonGradientCard>
        </motion.div>
      </motion.div>
    </section>
  );
}


'use client';

import { Backlight } from '@/shared/components/backlight';
import { InteractiveHoverButton } from '@/shared/components/interactive-hover-button';
import { NeonGradientCard } from '@/shared/components/neon-gradient-card';
import { NoiseTexture } from '@/shared/components/noise-texture';
import { PulsatingButton } from '@/shared/components/pulsating-button';
import { RouteEnum } from '@/shared/constants';
import { Icons } from '@lumen/uikit/icons';
import { motion, useReducedMotion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
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
      <NoiseTexture noiseOpacity={0.12} slope={0.12} frequency={0.5} />

      {/* Decorative background gradients & Backlight */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px]"
      >
        <Backlight
          blur={80}
          className="absolute left-1/2 top-10 -translate-x-1/2 opacity-60"
        >
          <div className="h-[400px] w-[650px] rounded-full bg-gradient-to-r from-primary/30 via-indigo-500/20 to-sky-400/25" />
        </Backlight>
      </div>

      <motion.div
        initial="hidden"
        animate="show"
        variants={staggerContainer}
        className="container relative z-10 mx-auto px-4 flex flex-col items-center text-center max-w-6xl"
      >
        {/* Version Badge */}
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

        {/* Hero Title */}
        <motion.h1
          id="hero-title"
          variants={fadeUpVariants}
          className="mb-8 max-w-4xl text-5xl font-black leading-[1.1] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl"
        >
          <span className="block text-foreground">{t('heroTitle1')}</span>
          <span className="mt-2 block bg-gradient-to-r from-primary via-indigo-500 to-sky-500 bg-clip-text text-transparent">
            {t('heroTitle2')}
          </span>
        </motion.h1>

        {/* Hero Subtitle */}
        <motion.p
          variants={fadeUpVariants}
          className="mb-10 max-w-2xl text-lg font-medium leading-relaxed text-muted-foreground sm:text-xl"
        >
          {t('heroSubtitle')}
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          variants={fadeUpVariants}
          className="flex w-full flex-col items-center justify-center gap-4 sm:w-auto sm:flex-row"
        >
          <Link href={RouteEnum.LOGIN} className="w-full sm:w-auto">
            <PulsatingButton
              pulseColor="rgba(59, 130, 246, 0.35)"
              className="w-full sm:w-auto min-h-[52px] text-base px-8 font-semibold"
            >
              {t('startFree')}
              <Icons name="arrow-right" className="h-5 w-5 ml-1" />
            </PulsatingButton>
          </Link>
          <Link href="#features" className="w-full sm:w-auto">
            <InteractiveHoverButton className="w-full sm:w-auto min-h-[52px] px-8 text-base">
              {t('exploreFeatures')}
            </InteractiveHoverButton>
          </Link>
        </motion.div>

        {/* Professional Dashboard Showcase Frame */}
        <motion.div
          variants={fadeUpVariants}
          className="relative mt-16 w-full max-w-5xl lg:mt-24"
        >
          <NeonGradientCard
            borderSize={2}
            borderRadius={24}
            neonColors={{ firstColor: '#3b82f6', secondColor: '#6366f1' }}
            className="shadow-2xl"
          >
            <div className="relative overflow-hidden rounded-xl bg-card border border-border/40">
              {/* Browser Window Bar */}
              <div className="flex items-center justify-between border-b border-border/50 bg-muted/60 px-4 py-3 backdrop-blur-md">
                <div className="flex items-center space-x-2">
                  <div className="h-3 w-3 rounded-full bg-rose-500/80" />
                  <div className="h-3 w-3 rounded-full bg-amber-500/80" />
                  <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
                </div>
                <div className="rounded-md border border-border/40 bg-background/80 px-3 py-1 text-xs text-muted-foreground font-mono">
                  lumen.learning/dashboard
                </div>
                <div className="w-12" />
              </div>

              {/* Showcase Image */}
              <div className="relative aspect-[16/9] w-full">
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
            </div>
          </NeonGradientCard>
        </motion.div>
      </motion.div>
    </section>
  );
}

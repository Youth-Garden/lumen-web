'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Icons } from '@lumen/uikit/icons';
import { Button } from '@lumen/uikit/components';
import { RouteEnum } from '@/shared/constants';
import { fadeUpVariants, staggerContainer } from './animations';

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80';

export function Hero() {
  const t = useTranslations('Index');

  return (
    <section className="relative overflow-hidden pt-24 pb-20 lg:pt-32 lg:pb-28">
      {/* Soft decorative background glows (calmer than before) */}
      <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[360px] w-[560px] rounded-full bg-primary/10 opacity-40 blur-[120px]" />
      <div className="absolute -right-40 top-40 -z-10 h-[280px] w-[280px] rounded-full bg-sky-500/10 opacity-40 blur-[100px]" />

      <motion.div
        initial="hidden"
        animate="show"
        variants={staggerContainer}
        className="container relative z-10 mx-auto px-4"
      >
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left: copy + CTAs */}
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <motion.div
              variants={fadeUpVariants}
              className="mb-6 inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary shadow-sm backdrop-blur-sm"
            >
              <span className="relative mr-2.5 flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              {t('versionLaunched')}
            </motion.div>

            <motion.h1
              variants={fadeUpVariants}
              className="mb-6 text-4xl font-black leading-[1.1] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
            >
              <span className="block text-foreground">{t('heroTitle1')}</span>
              <span className="mt-2 block bg-gradient-to-r from-primary to-sky-500 bg-clip-text text-transparent">
                {t('heroTitle2')}
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUpVariants}
              className="mb-8 max-w-xl text-lg font-medium leading-relaxed text-muted-foreground sm:text-xl"
            >
              {t('heroSubtitle')}
            </motion.p>

            <motion.div
              variants={fadeUpVariants}
              className="flex w-full flex-col items-center justify-center gap-4 sm:w-auto sm:flex-row lg:justify-start"
            >
              <Link href={RouteEnum.REGISTER} className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="group w-full gap-2 rounded-full px-8 text-lg min-h-[56px] shadow-lg transition-all hover:shadow-xl focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:w-auto"
                >
                  {t('startFree')}
                  <Icons
                    name="arrow-right"
                    className="h-5 w-5 transition-transform group-hover:translate-x-1"
                  />
                </Button>
              </Link>
              <Link href="#features" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full min-h-[56px] rounded-full border-border/60 px-8 text-lg hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:w-auto"
                >
                  {t('exploreFeatures')}
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Right: hero visual with floating thumbnails */}
          <motion.div
            variants={fadeUpVariants}
            className="relative mx-auto w-full max-w-xl"
          >
            {/* Main image */}
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-border/60 bg-card shadow-2xl">
              <Image
                src={HERO_IMAGE}
                alt={t('heroTitle1') + ' ' + t('heroTitle2')}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>

            {/* Floating thumbnail — bottom left */}
            <div className="absolute -bottom-6 -left-4 hidden h-28 w-28 overflow-hidden rounded-2xl border-4 border-background bg-card shadow-xl sm:block md:-left-8">
              <Image
                src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=200&q=80"
                alt="Study materials"
                fill
                sizes="112px"
                className="object-cover transition-transform duration-500 hover:scale-110"
              />
            </div>

            {/* Floating thumbnail — top right */}
            <div className="absolute -right-4 -top-6 hidden h-24 w-24 overflow-hidden rounded-2xl border-4 border-background bg-card shadow-xl sm:block md:-right-8">
              <Image
                src="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=200&q=80"
                alt="Reading books"
                fill
                sizes="96px"
                className="object-cover transition-transform duration-500 hover:scale-110"
              />
            </div>

            {/* Floating rating card */}
            <div className="absolute -bottom-5 right-2 hidden items-center gap-2 rounded-2xl border border-border/60 bg-card px-4 py-3 shadow-xl sm:flex">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-base font-bold text-primary">
                ★
              </span>
              <div className="leading-tight">
                <p className="text-sm font-bold text-foreground">4.9/5</p>
                <p className="text-xs text-muted-foreground">{t('heroRatingLabel')}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

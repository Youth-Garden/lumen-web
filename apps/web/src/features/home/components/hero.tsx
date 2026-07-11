'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Icons } from '@lumen/uikit/icons';
import { Button } from '@lumen/uikit/components';
import { RouteEnum } from '@/shared/constants';
import { fadeUpVariants, staggerContainer } from './animations';

export function Hero() {
  const t = useTranslations('Index');

  return (
    <section className="relative overflow-hidden pt-24 pb-20 lg:pt-32 lg:pb-28">
      {/* Decorative background elements */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[400px] w-[600px] rounded-full bg-primary/20 opacity-30 blur-[120px]" />
      <div className="absolute -left-32 top-32 -z-10 h-[300px] w-[300px] rounded-full bg-indigo-500/20 opacity-30 blur-[100px]" />
      <div className="absolute -right-32 top-64 -z-10 h-[300px] w-[300px] rounded-full bg-emerald-500/20 opacity-30 blur-[100px]" />

      <motion.div
        initial="hidden"
        animate="show"
        variants={staggerContainer}
        className="container relative z-10 mx-auto px-4 text-center"
      >
        <div className="mx-auto flex max-w-4xl flex-col items-center">
          <motion.div
            variants={fadeUpVariants}
            className="mb-8 inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary shadow-sm backdrop-blur-sm"
          >
            <span className="relative mr-2.5 flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            {t('versionLaunched')}
          </motion.div>

          <motion.h1
            variants={fadeUpVariants}
            className="mb-8 text-5xl font-black leading-[1.1] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl"
          >
            <span className="block text-foreground">{t('heroTitle1')}</span>
            <span className="mt-2 block bg-gradient-to-r from-primary via-indigo-500 to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
              {t('heroTitle2')}
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUpVariants}
            className="mb-10 max-w-2xl text-xl font-medium leading-relaxed text-muted-foreground sm:text-2xl"
          >
            {t('heroSubtitle')}
          </motion.p>

          <motion.div
            variants={fadeUpVariants}
            className="flex w-full flex-col items-center justify-center gap-4 sm:w-auto sm:flex-row"
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

        {/* Product visual mockup */}
        <motion.div
          variants={fadeUpVariants}
          className="mx-auto mt-20 max-w-5xl"
        >
          <div className="relative rounded-3xl border border-border/60 bg-card/60 p-2 shadow-2xl backdrop-blur-sm">
            <div className="overflow-hidden rounded-2xl border border-border/40 bg-background">
              <div className="flex items-center gap-1.5 border-b border-border/40 px-4 py-3">
                <span className="h-3 w-3 rounded-full bg-red-400/80" />
                <span className="h-3 w-3 rounded-full bg-yellow-400/80" />
                <span className="h-3 w-3 rounded-full bg-green-400/80" />
                <div className="ml-3 h-5 flex-1 rounded-md bg-muted" />
              </div>
              <div className="grid gap-4 p-6 sm:grid-cols-3">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="space-y-3 rounded-xl border border-border/40 bg-card p-4"
                  >
                    <div className="h-9 w-9 rounded-lg bg-primary/10" />
                    <div className="h-3 w-3/4 rounded bg-muted" />
                    <div className="h-3 w-full rounded bg-muted/70" />
                    <div className="h-3 w-5/6 rounded bg-muted/70" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

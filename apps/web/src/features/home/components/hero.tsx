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
      {/* Refined modern background */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]">
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[500px] w-[500px] rounded-full bg-primary/20 opacity-30 blur-[120px]" />
      </div>

      <motion.div
        initial="hidden"
        animate="show"
        variants={staggerContainer}
        className="container relative z-10 mx-auto px-4 flex flex-col items-center text-center"
      >
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
          className="mb-8 max-w-4xl text-5xl font-black leading-[1.1] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl"
        >
          <span className="block text-foreground">{t('heroTitle1')}</span>
          <span className="mt-2 block bg-gradient-to-r from-primary to-sky-500 bg-clip-text text-transparent">
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

        {/* Big Dashboard/Image below */}
        <motion.div
          variants={fadeUpVariants}
          className="relative mt-16 w-full max-w-5xl lg:mt-24"
        >
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-border/60 bg-card shadow-2xl ring-1 ring-foreground/5">
            <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent z-10"></div>
            <Image
              src={HERO_IMAGE}
              alt={t('heroTitle1') + ' ' + t('heroTitle2')}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 1024px"
              className="object-cover"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Icons } from '@lumen/uikit/icons';
import { Button } from '@lumen/uikit/components';
import { RouteEnum } from '@/shared/constants';
import { fadeUpVariants, staggerContainer } from './animations';

export function FinalCta() {
  const t = useTranslations('Index');

  return (
    <section className="py-28">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        className="container mx-auto px-4"
      >
        <motion.div
          variants={fadeUpVariants}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-indigo-500 to-primary px-6 py-16 text-center text-primary-foreground sm:px-16"
        >
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

          <h2 className="relative z-10 mx-auto max-w-2xl text-3xl font-black tracking-tight sm:text-4xl md:text-5xl">
            {t('ctaTitle')}
          </h2>
          <p className="relative z-10 mx-auto mt-4 max-w-xl text-lg text-primary-foreground/90">
            {t('ctaSubtitle')}
          </p>
          <Link href={RouteEnum.REGISTER} className="relative z-10 mt-8 inline-block">
            <Button
              size="lg"
              variant="secondary"
              className="gap-2 rounded-full px-8 text-lg min-h-[56px] shadow-lg focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {t('ctaButton')}
              <Icons name="arrow-right" className="h-5 w-5" />
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}

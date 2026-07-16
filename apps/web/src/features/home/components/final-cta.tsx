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
          className="relative overflow-hidden rounded-3xl bg-primary px-6 py-16 text-center text-primary-foreground sm:px-16"
        >

          <div className="relative z-10 mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-black tracking-tight sm:text-4xl md:text-5xl">
              {t('ctaTitle')}
            </h2>
            <p className="mt-4 text-lg text-primary-foreground/90 mx-auto max-w-xl">
              {t('ctaSubtitle')}
            </p>
            <Link href={RouteEnum.REGISTER} className="mt-8 inline-block">
              <Button
                size="lg"
                variant="secondary"
                className="gap-2 rounded-full px-8 text-lg min-h-[56px] shadow-lg focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {t('ctaButton')}
                <Icons name="arrow-right" className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

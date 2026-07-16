'use client';

import Link from 'next/link';
import Image from 'next/image';
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

          <div className="relative z-10 mx-auto grid max-w-4xl items-center gap-8 lg:grid-cols-[1fr_auto] lg:text-left">
            <div>
              <h2 className="mx-auto max-w-2xl text-3xl font-black tracking-tight sm:text-4xl md:text-5xl">
                {t('ctaTitle')}
              </h2>
              <p className="mt-4 max-w-xl text-lg text-primary-foreground/90">
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

            <div className="relative mx-auto hidden aspect-square w-44 overflow-hidden rounded-3xl border-4 border-white/20 shadow-xl lg:block">
              <Image
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=300&q=80"
                alt="Students learning"
                fill
                sizes="176px"
                className="object-cover"
              />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

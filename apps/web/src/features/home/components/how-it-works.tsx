'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { cn } from '@lumen/uikit/utils';
import { SectionHeading } from './section-heading';
import { fadeUpVariants, staggerContainer } from './animations';

const STEPS = [
  {
    n: 1,
    titleKey: 'step1Title',
    descKey: 'step1Desc',
    imageUrl: '/home/how-it-works/step1.svg',
  },
  {
    n: 2,
    titleKey: 'step2Title',
    descKey: 'step2Desc',
    imageUrl: '/home/how-it-works/step2.svg',
  },
  {
    n: 3,
    titleKey: 'step3Title',
    descKey: 'step3Desc',
    imageUrl: '/home/how-it-works/step3.svg',
  },
  {
    n: 4,
    titleKey: 'step4Title',
    descKey: 'step4Desc',
    imageUrl: '/home/how-it-works/step4.svg',
  },
] as const;

export function HowItWorks() {
  const t = useTranslations('Index');

  return (
    <section className="bg-zinc-50 py-28 dark:bg-zinc-900/20">
      <div className="container mx-auto max-w-6xl px-4">
        <SectionHeading
          eyebrow={t('howItWorksEyebrow')}
          title={t('howItWorksTitle')}
          subtitle={t('howItWorksSubtitle')}
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="mt-16 space-y-14 md:space-y-20"
        >
          {STEPS.map((step, i) => {
            const reversed = i % 2 === 1;
            return (
              <motion.div
                key={step.n}
                variants={fadeUpVariants}
                className="grid items-center gap-8 md:grid-cols-2 md:gap-12"
              >
                {/* Image side */}
                <div
                  className={cn(
                    'relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-border/60 bg-card shadow-lg',
                    reversed ? 'md:order-2' : 'md:order-1',
                  )}
                >
                  <Image
                    src={step.imageUrl}
                    alt={t(step.titleKey)}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 hover:scale-105"
                  />
                  <span className="absolute left-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground shadow-md">
                    {step.n}
                  </span>
                </div>

                {/* Text side */}
                <div
                  className={cn(
                    'flex flex-col',
                    reversed ? 'md:order-1' : 'md:order-2',
                  )}
                >
                  <span className="mb-3 inline-flex w-fit items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
                    {t('howItWorksStepLabel', { n: step.n })}
                  </span>
                  <h3 className="mb-3 text-2xl font-bold tracking-tight md:text-3xl">
                    {t(step.titleKey)}
                  </h3>
                  <p className="max-w-md text-base leading-relaxed text-muted-foreground">
                    {t(step.descKey)}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

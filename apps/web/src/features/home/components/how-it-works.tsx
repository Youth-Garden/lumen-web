'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { SectionHeading } from './section-heading';
import { fadeUpVariants, staggerContainer } from './animations';

const STEPS = [
  { n: 1, titleKey: 'step1Title', descKey: 'step1Desc' },
  { n: 2, titleKey: 'step2Title', descKey: 'step2Desc' },
  { n: 3, titleKey: 'step3Title', descKey: 'step3Desc' },
  { n: 4, titleKey: 'step4Title', descKey: 'step4Desc' },
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
          className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4"
        >
          {STEPS.map((step) => (
            <motion.div key={step.n} variants={fadeUpVariants} className="relative">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground shadow-md">
                {step.n}
              </div>
              <h3 className="mb-2 text-xl font-bold">{t(step.titleKey)}</h3>
              <p className="text-muted-foreground">{t(step.descKey)}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

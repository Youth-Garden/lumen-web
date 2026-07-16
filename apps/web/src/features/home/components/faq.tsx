'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Icons } from '@lumen/uikit/icons';
import { SectionHeading } from './section-heading';
import { fadeUpVariants } from './animations';

const FAQS = [
  { qKey: 'faq1Q', aKey: 'faq1A' },
  { qKey: 'faq2Q', aKey: 'faq2A' },
  { qKey: 'faq3Q', aKey: 'faq3A' },
  { qKey: 'faq4Q', aKey: 'faq4A' },
] as const;

export function Faq() {
  const t = useTranslations('Index');

  return (
    <section className="py-28 bg-background">
      <div className="container mx-auto max-w-3xl px-4">
        <SectionHeading title={t('faqTitle')} subtitle={t('faqSubtitle')} />

        <motion.div
          variants={fadeUpVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="divide-y divide-border border-y border-border"
        >
          {FAQS.map((faq) => (
            <details
              key={faq.qKey}
              className="group py-6"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-bold text-foreground transition-colors hover:text-primary">
                {t(faq.qKey)}
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary/80 transition-colors group-hover:bg-primary/10 group-hover:text-primary">
                  <Icons
                    name="chevron-down"
                    className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180 group-hover:text-primary"
                  />
                </div>
              </summary>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground pr-8">{t(faq.aKey)}</p>
            </details>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

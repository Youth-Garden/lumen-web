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
    <section className="py-28">
      <div className="container mx-auto max-w-3xl px-4">
        <SectionHeading title={t('faqTitle')} subtitle={t('faqSubtitle')} />

        <motion.div
          variants={fadeUpVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="space-y-3"
        >
          {FAQS.map((faq) => (
            <details
              key={faq.qKey}
              className="group rounded-2xl border border-border bg-card p-5 shadow-sm transition-colors open:border-primary/40"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">
                {t(faq.qKey)}
                <Icons
                  name="chevron-down"
                  className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-open:rotate-180"
                />
              </summary>
              <p className="mt-3 text-muted-foreground">{t(faq.aKey)}</p>
            </details>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

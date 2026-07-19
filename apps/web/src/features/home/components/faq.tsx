'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Icons } from '@lumen/uikit/icons';
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
      <div className="container mx-auto max-w-6xl px-4">
        <div className="grid gap-12 lg:grid-cols-[1fr_2fr]">
          {/* Left Column: Title and Help Center Card */}
          <motion.div
            variants={fadeUpVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
            className="flex flex-col gap-8"
          >
            <h2 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">
              {t('faqTitle')}
            </h2>

            <div className="flex max-w-sm flex-col gap-3 rounded-xl border border-border bg-card p-5 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Help Center
              </h3>
              <p className="text-sm text-foreground">
                Need more details? Contact our support team directly.
              </p>
              <Link
                href="#"
                className="mt-1 inline-flex items-center text-sm font-semibold text-primary transition-colors hover:text-primary/80 hover:underline"
              >
                Contact Support{' '}
                <Icons name="arrow-right" className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </motion.div>

          {/* Right Column: FAQs List */}
          <motion.div
            variants={fadeUpVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
            className="divide-y divide-border border-y border-border min-h-[450px]"
          >
            {FAQS.map((faq) => (
              <details key={faq.qKey} className="group py-6">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-bold text-foreground transition-colors hover:text-primary">
                  {t(faq.qKey)}
                  <div className="flex h-7 w-7 items-center justify-center border border-border bg-background transition-colors group-hover:border-primary group-hover:text-primary">
                    <Icons
                      name="plus"
                      className="h-4 w-4 shrink-0 text-foreground transition-transform group-open:rotate-45 group-hover:text-primary"
                    />
                  </div>
                </summary>
                <p className="mt-4 text-base leading-relaxed text-muted-foreground pr-8">
                  {t(faq.aKey)}
                </p>
              </details>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

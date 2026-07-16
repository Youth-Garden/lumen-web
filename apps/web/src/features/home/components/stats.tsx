'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { fadeUpVariants, staggerContainer } from './animations';

const STATS = [
  { value: '50K+', labelKey: 'statLearners' },
  { value: '1M+', labelKey: 'statWords' },
  { value: '4.9/5', labelKey: 'statRating' },
  { value: '95%', labelKey: 'statSuccess' },
] as const;

export function Stats() {
  const t = useTranslations('Index');

  return (
    <section className="relative py-20 bg-gradient-to-br from-primary/5 via-indigo-500/5 to-primary/5 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />
      </div>

      <div className="container relative mx-auto max-w-6xl px-4">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="grid grid-cols-2 gap-6 md:grid-cols-4 lg:gap-8"
        >
          {STATS.map((stat) => (
            <motion.div
              key={stat.labelKey}
              variants={fadeUpVariants}
              className="relative group"
            >
              {/* Glow effect on hover */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/20 to-indigo-500/20 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />

              <div className="relative rounded-2xl border border-border/40 bg-card/50 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-primary/20">
                {/* Icon decoration */}
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-indigo-500/10 text-primary">
                  {stat.value.includes('K+') || stat.value.includes('M+') ? (
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H5m12-6a3 3 0 11-6 0v-1a3 3 0 016 0v1zm-6 0V7a3 3 0 11-6 0v6m12 0v6a3 3 0 01-6 0v-6m6 0h-3m-3 0H6" />
                    </svg>
                  ) : stat.value.includes('/') ? (
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.678a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.679c.3.922-.755 1.688-1.538 1.115l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.573-1.838-.193-1.538-1.115l1.518-4.679a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.678z" />
                    </svg>
                  ) : stat.value.includes('%') ? (
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 000-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  ) : (
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  )}
                </div>

                <div className="text-center">
                  <p className="text-3xl font-black tracking-tight text-primary transition-colors duration-300 group-hover:text-indigo-600 sm:text-4xl md:text-5xl">
                    {stat.value}
                  </p>
                  <p className="mt-2 text-sm font-medium text-muted-foreground transition-colors duration-300 group-hover:text-foreground/80 md:text-base">
                    {t(stat.labelKey)}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
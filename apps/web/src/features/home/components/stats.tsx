'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { fadeUpVariants, staggerContainer } from './animations';

const STATS = [
  { value: '3,248', labelKey: 'statLearners', icon: 'users' },
  { value: '18,500', labelKey: 'statWords', icon: 'book' },
  { value: '4.7/5', labelKey: 'statRating', icon: 'star' },
  { value: '82%', labelKey: 'statSuccess', icon: 'trophy' },
] as const;

export function Stats() {
  const t = useTranslations('Index');

  return (
    <section className="relative py-20 bg-background overflow-hidden">      <div className="container relative mx-auto max-w-6xl px-4">
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
              <div className="relative rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-primary/20">
                {/* Icon decoration */}
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  {stat.icon === 'users' && (
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H5m12-6a3 3 0 11-6 0v-1a3 3 0 016 0v1zm-6 0V7a3 3 0 11-6 0v6m12 0v6a3 3 0 01-6 0v-6m6 0h-3m-3 0H6" />
                    </svg>
                  )}
                  {stat.icon === 'book' && (
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  )}
                  {stat.icon === 'star' && (
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.678a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.679c.3.922-.755 1.688-1.538 1.115l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.573-1.838-.193-1.538-1.115l1.518-4.679a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.678z" />
                    </svg>
                  )}
                  {stat.icon === 'trophy' && (
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 000-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
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
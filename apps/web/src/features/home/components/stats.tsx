'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Icons } from '@lumen/uikit/icons';
import { fadeUpVariants, staggerContainer } from './animations';

const STATS = [
  { value: '1,250+', labelKey: 'statLearners', icon: 'users' },
  { value: '45,800+', labelKey: 'statWords', icon: 'book' },
  { value: '4.9/5', labelKey: 'statRating', icon: 'star' },
  { value: '94%', labelKey: 'statSuccess', icon: 'trophy' },
] as const;

export function Stats() {
  const t = useTranslations('Index');

  return (
    <section className="relative py-20 bg-background overflow-hidden">
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
              <div className="relative rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-primary/20">
                {/* Icon decoration */}
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icons name={stat.icon} className="h-6 w-6" />
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
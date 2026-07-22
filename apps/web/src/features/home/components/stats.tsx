'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Icons } from '@lumen/uikit/icons';
import { Highlighter } from '@/shared/components/highlighter';
import { fadeUpVariants, staggerContainer } from './animations';

const STATS = [
  { value: '50+', labelKey: 'statLearners', icon: 'users', action: 'highlight' as const },
  { value: '5,000+', labelKey: 'statWords', icon: 'book', action: 'underline' as const },
  { value: '5.0/5', labelKey: 'statRating', icon: 'star', action: 'circle' as const },
  { value: '98%', labelKey: 'statSuccess', icon: 'trophy', action: 'box' as const },
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
              <div className="relative rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-primary/30">
                {/* Icon decoration */}
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icons name={stat.icon} className="h-6 w-6" />
                </div>

                <div className="text-center">
                  <p className="text-3xl font-black tracking-tight text-primary transition-colors duration-300 group-hover:text-indigo-600 sm:text-4xl md:text-5xl">
                    {stat.value}
                  </p>
                  <div className="mt-3 text-sm font-semibold text-muted-foreground md:text-base">
                    <Highlighter
                      action={stat.action}
                      color="rgba(59, 130, 246, 0.25)"
                      isView={true}
                      animationDuration={800}
                    >
                      {t(stat.labelKey)}
                    </Highlighter>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}


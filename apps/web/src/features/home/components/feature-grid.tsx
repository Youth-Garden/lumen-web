'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Icons } from '@lumen/uikit/icons';
import { Card, CardContent } from '@lumen/uikit/components';
import { SectionHeading } from './section-heading';
import { fadeUpVariants, staggerContainer } from './animations';

const FEATURES = [
  {
    icon: 'file-question',
    titleKey: 'featureToeicTitle',
    descKey: 'featureToeicDesc',
  },
  {
    icon: 'headphones',
    titleKey: 'featureDictationTitle',
    descKey: 'featureDictationDesc',
  },
  { icon: 'brain', titleKey: 'featureVocabTitle', descKey: 'featureVocabDesc' },
  { icon: 'quiz', titleKey: 'featureQuizTitle', descKey: 'featureQuizDesc' },
  {
    icon: 'pen-tool',
    titleKey: 'featureGrammarTitle',
    descKey: 'featureGrammarDesc',
  },
  {
    icon: 'book-open',
    titleKey: 'featureReadingTitle',
    descKey: 'featureReadingDesc',
  },
  {
    icon: 'mic',
    titleKey: 'featureListeningTitle',
    descKey: 'featureListeningDesc',
  },
  {
    icon: 'bar-chart',
    titleKey: 'featureProgressTitle',
    descKey: 'featureProgressDesc',
  },
] as const;

const ICON_COLORS = [
  'bg-primary/10 text-primary',
  'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
  'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  'bg-rose-500/10 text-rose-600 dark:text-rose-400',
  'bg-sky-500/10 text-sky-600 dark:text-sky-400',
  'bg-violet-500/10 text-violet-600 dark:text-violet-400',
  'bg-teal-500/10 text-teal-600 dark:text-teal-400',
];

export function FeatureGrid() {
  const t = useTranslations('Index');

  return (
    <section id="features" className="scroll-mt-20 py-28">
      <div className="container mx-auto max-w-6xl px-4">
        <SectionHeading
          eyebrow={t('featuresEyebrow')}
          title={t('featuresTitle')}
          subtitle={t('featuresSubtitle')}
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {FEATURES.map((feature, i) => (
            <motion.div key={feature.titleKey} variants={fadeUpVariants}>
              <Card className="group h-full border-border p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl">
                <CardContent className="space-y-4 p-0">
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl ${ICON_COLORS[i % ICON_COLORS.length]}`}
                  >
                    <Icons name={feature.icon} className="h-7 w-7" />
                  </div>
                  <h3 className="text-xl font-bold">{t(feature.titleKey)}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {t(feature.descKey)}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

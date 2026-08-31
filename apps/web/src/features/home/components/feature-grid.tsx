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

export function FeatureGrid() {
  const t = useTranslations('Index');

  return (
    <section id="features" className="scroll-mt-20 py-28 bg-primary/5 relative">
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
          {FEATURES.map((feature) => (
            <motion.div key={feature.titleKey} variants={fadeUpVariants}>
              <Card className="group h-full border-border/60 bg-card p-6 shadow-sm ring-1 ring-foreground/5 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-primary/30">
                <CardContent className="space-y-4 p-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icons name={feature.icon} className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold tracking-tight text-foreground">
                    {t(feature.titleKey)}
                  </h3>
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

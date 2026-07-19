'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Icons } from '@lumen/uikit/icons';
import { Button } from '@lumen/uikit/components';
import { RouteEnum } from '@/shared/constants';
import { fadeUpVariants, staggerContainer } from './animations';

const TESTIMONIALS = [
  {
    name: 'Emma Johnson',
    role: 'Student',
    image:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80',
    quoteKey: 'testimonial1Quote',
    rating: 5,
  },
  {
    name: 'Michael Chen',
    role: 'Professional',
    image:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80',
    quoteKey: 'testimonial2Quote',
    rating: 5,
  },
  {
    name: 'Sarah Martinez',
    role: 'Learner',
    image:
      'https://images.unsplash.com/photo-1438761681033-6461ffad4208?auto=format&fit=crop&w=100&q=80',
    quoteKey: 'testimonial3Quote',
    rating: 4,
  },
] as const;

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Icons
          key={i}
          name="star"
          className={`h-4 w-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30'}`}
        />
      ))}
    </div>
  );
}

export function Testimonials() {
  const t = useTranslations('Index');

  return (
    <section className="py-28 bg-muted">
      <div className="container mx-auto max-w-6xl px-4">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="text-center mb-16"
        >
          <motion.h2
            variants={fadeUpVariants}
            className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl"
          >
            {t('testimonialsTitle')}
          </motion.h2>
          <motion.p
            variants={fadeUpVariants}
            className="mt-4 text-lg text-muted-foreground md:text-xl"
          >
            {t('testimonialsSubtitle')}
          </motion.p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          {TESTIMONIALS.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              variants={fadeUpVariants}
              className="group relative rounded-3xl border border-border/60 bg-card p-8 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
            >
              {/* Quote mark */}
              <div className="absolute -top-4 -left-4 h-20 w-20 text-primary/10">
                <Icons name="quote" className="h-full w-full" />
              </div>

              <div className="relative z-10 space-y-6">
                {/* Stars */}
                <Stars rating={testimonial.rating} />

                {/* Quote */}
                <blockquote className="text-base leading-relaxed text-muted-foreground md:text-lg">
                  &ldquo;{t(testimonial.quoteKey)}&rdquo;
                </blockquote>

                {/* Divider */}
                <div className="h-px w-full bg-border/60" />

                {/* Author */}
                <div className="flex items-center gap-4">
                  <div className="relative h-12 w-12 overflow-hidden rounded-full border-2 border-primary/20">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-foreground">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to action */}
        <motion.div variants={fadeUpVariants} className="mt-16 text-center">
          <h3 className="text-2xl font-bold tracking-tight md:text-3xl">
            {t('joinSuccessStories')}
          </h3>
          <p className="mt-3 text-muted-foreground md:text-lg">
            {t('joinSuccessSubtitle')}
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href={RouteEnum.LOGIN}>
              <Button
                size="lg"
                className="group gap-2 rounded-full px-8 text-lg min-h-[56px] shadow-lg transition-all hover:shadow-xl focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {t('startFree')}
                <Icons
                  name="arrow-right"
                  className="h-5 w-5 transition-transform group-hover:translate-x-1"
                />
              </Button>
            </Link>
            <Link href="#features">
              <Button
                size="lg"
                variant="outline"
                className="min-h-[56px] rounded-full border-border/60 px-8 text-lg hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {t('seeFeatures')}
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

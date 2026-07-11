'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { AnimatePresence, motion } from 'framer-motion';
import { Icons } from '@lumen/uikit/icons';
import { Button, ThemeSwitcher } from '@lumen/uikit/components';
import { RouteEnum } from '@/shared/constants';
import { cn } from '@lumen/uikit/utils';
import { Hero } from '../components/hero';
import { FeatureGrid } from '../components/feature-grid';
import { HowItWorks } from '../components/how-it-works';
import { BlogSection } from '../components/blog-section';
import { Faq } from '../components/faq';
import { FinalCta } from '../components/final-cta';
import { SiteFooter } from '../components/site-footer';

export default function HomePage() {
  const t = useTranslations('Index');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-foreground selection:bg-primary/20">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-4">
          <Link
            href={RouteEnum.HOME}
            className="flex items-center space-x-2 rounded-md group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            aria-label="Lumen home"
          >
            <div className="flex h-9 w-9 items-center justify-center">
              <Icons name="logo" className="h-8 w-8 text-primary" />
            </div>
            <span className="text-lg font-bold tracking-tight">Lumen</span>
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden items-center space-x-3 sm:flex">
            <ThemeSwitcher />
            <Link href={RouteEnum.LOGIN}>
              <Button
                variant="ghost"
                className="min-h-[44px] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {t('login')}
              </Button>
            </Link>
            <Link href={RouteEnum.REGISTER}>
              <Button className="min-h-[44px] rounded-full px-6 shadow-sm transition-all hover:shadow-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                {t('startNow')}
              </Button>
            </Link>
          </nav>

          {/* Mobile controls */}
          <div className="flex items-center space-x-2 sm:hidden">
            <ThemeSwitcher />
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen((v) => !v)}
            >
              <Icons
                name={mobileMenuOpen ? 'close' : 'menu'}
                className="h-5 w-5"
              />
            </Button>
          </div>
        </div>

        {/* Mobile menu panel */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              key="mobile-menu"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ type: 'spring', stiffness: 320, damping: 30 }}
              className="border-t border-border/40 bg-background/95 backdrop-blur-md sm:hidden"
            >
              <nav className="container mx-auto flex flex-col gap-2 px-4 py-4">
                <Link
                  href={RouteEnum.LOGIN}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button
                    variant="ghost"
                    className="w-full min-h-[44px] justify-start focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {t('login')}
                  </Button>
                </Link>
                <Link
                  href={RouteEnum.REGISTER}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button className="w-full min-h-[44px] justify-start rounded-full focus-visible:ring-2 focus-visible:ring-ring">
                    {t('startNow')}
                  </Button>
                </Link>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="flex-1">
        <Hero />
        <FeatureGrid />
        <HowItWorks />
        <BlogSection />
        <Faq />
        <FinalCta />
      </main>

      <SiteFooter />
    </div>
  );
}

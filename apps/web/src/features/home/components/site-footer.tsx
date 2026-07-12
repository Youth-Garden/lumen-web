'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Icons } from '@lumen/uikit/icons';
import { Logo } from '@lumen/uikit/components';
import { RouteEnum } from '@/shared/constants';

export function SiteFooter() {
  const t = useTranslations('Index');

  const productLinks = [
    { labelKey: 'featureToeicTitle', href: RouteEnum.TOEIC },
    { labelKey: 'featureDictationTitle', href: RouteEnum.DICTATION },
    { labelKey: 'featureVocabTitle', href: RouteEnum.VOCABULARY },
    { labelKey: 'featureQuizTitle', href: RouteEnum.QUIZ },
  ];

  const resourceLinks = [
    { labelKey: 'blogTitle', href: RouteEnum.READING },
    { labelKey: 'footerHelp', href: '#' },
    { labelKey: 'footerGuides', href: '#' },
  ];

  const companyLinks = [
    { labelKey: 'footerAbout', href: '#' },
    { labelKey: 'footerCareers', href: '#' },
    { labelKey: 'terms', href: '#' },
    { labelKey: 'privacy', href: '#' },
    { labelKey: 'contact', href: '#' },
  ];

  const socials = ['twitter', 'github', 'youtube'];

  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-4 py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link
              href={RouteEnum.HOME}
              className="flex items-center space-x-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Lumen home"
            >
              <div className="flex h-9 w-9 items-center justify-center">
                <Logo showText={false} iconSize={32} />
              </div>
              <span className="text-lg font-bold">Lumen Platform</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm text-muted-foreground">
              {t('footerTagline')}
            </p>
            <div className="mt-6 flex space-x-3">
              {socials.map((s) => (
                <Link
                  key={s}
                  href="#"
                  aria-label={s}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <Icons name="languages" className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wide text-foreground">
              {t('footerProductTitle')}
            </h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {productLinks.map((l) => (
                <li key={l.labelKey}>
                  <Link
                    href={l.href}
                    className="transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {t(l.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wide text-foreground">
              {t('footerResourceTitle')}
            </h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {resourceLinks.map((l) => (
                <li key={l.labelKey}>
                  <Link
                    href={l.href}
                    className="transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {t(l.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wide text-foreground">
              {t('footerCompanyTitle')}
            </h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {companyLinks.map((l) => (
                <li key={l.labelKey}>
                  <Link
                    href={l.href}
                    className="transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {t(l.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-sm text-muted-foreground sm:flex-row">
          <p>
            &copy; {new Date().getFullYear()} Lumen Inc.{' '}
            {t('allRightsReserved')}
          </p>
        </div>
      </div>
    </footer>
  );
}

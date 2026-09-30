'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Locale } from '@/shared/types';
import { Button } from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';
import { cookieHelper } from '@lumen/utils';
import './globals.css';

const MESSAGES: Record<
  Locale,
  { title: string; subtitle: string; backHome: string }
> = {
  [Locale.VI]: {
    title: 'Đã có lỗi xảy ra!',
    subtitle:
      'Chúng tôi xin lỗi vì sự bất tiện này. Đã có sự cố trong quá trình xử lý.',
    backHome: 'Về trang chủ',
  },
  [Locale.EN]: {
    title: 'Something went wrong!',
    subtitle:
      'We apologize for the inconvenience. An unexpected error has occurred.',
    backHome: 'Back to Home',
  },
};

export default function GlobalError() {
  const [locale, setLocale] = useState<Locale>(Locale.VI);

  useEffect(() => {
    const savedLocale = cookieHelper.get('NEXT_LOCALE');
    if (savedLocale === Locale.EN || savedLocale === Locale.VI) {
      setLocale(savedLocale as Locale);
    }
  }, []);

  const t = MESSAGES[locale];

  return (
    <html lang={locale}>
      <body className="bg-background text-foreground antialiased flex flex-col items-center justify-center min-h-screen p-4">
        <div className="relative flex max-w-md flex-col items-center space-y-6 text-center">
          {/* Ambient Glow */}
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-64 h-64 bg-destructive/10 blur-[80px] rounded-full pointer-events-none -z-10" />

          {/* Standalone 3D Error State Image */}
          <Image
            src="/images/common/error-state.png"
            alt={t.title}
            width={180}
            height={180}
            className="w-40 h-40 md:w-48 md:h-48 object-contain select-none pointer-events-none"
            priority
          />

          {/* Text */}
          <div className="space-y-2">
            <h1 className="text-3xl font-black tracking-tight sm:text-4xl text-foreground">
              {t.title}
            </h1>
            <p className="text-muted-foreground text-sm max-w-xs mx-auto leading-relaxed">
              {t.subtitle}
            </p>
          </div>

          {/* Action */}
          <Button
            variant="default"
            size="lg"
            onClick={() => {
              window.location.href = `/${locale}`;
            }}
            className="cursor-pointer mt-2"
          >
            <Icons name="home" />
            <span>{t.backHome}</span>
          </Button>
        </div>
      </body>
    </html>
  );
}

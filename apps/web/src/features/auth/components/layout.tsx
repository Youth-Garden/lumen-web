import { PropsWithChildren } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { OpenEffect, Button } from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';
import { RouteEnum } from '@/shared/constants';

export default function AuthLayout({ children }: PropsWithChildren) {
  const t = useTranslations('Auth.Layout');
  return (
    <div className="min-h-screen w-full flex bg-background relative">
      <div className="absolute top-6 right-6 lg:top-8 lg:right-8 z-50">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full text-muted-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800"
        >
          <Link href={RouteEnum.HOME}>
            <Icons name="close" className="w-5 h-5" />
            <span className="sr-only">Close</span>
          </Link>
        </Button>
      </div>

      {/* Left side - Cover Image */}
      <div className="hidden lg:flex lg:w-7/12 relative bg-zinc-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40 z-10" />
        <Image
          src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop"
          alt="Auth Background"
          fill
          className="object-cover opacity-60"
        />
        <div className="absolute bottom-16 left-16 z-20 text-white max-w-lg animate-in slide-in-from-bottom-8 duration-700">
          <h1 className="text-5xl font-bold mb-4 tracking-tight">
            {t('title')}
          </h1>
          <p className="text-zinc-300 text-lg leading-relaxed">
            {t('subtitle')}
          </p>
        </div>
      </div>

      {/* Right side - Auth Form */}
      <div className="w-full lg:w-5/12 flex flex-col justify-center items-center px-4 sm:px-12 xl:px-24">
        <OpenEffect className="w-full max-w-[550px]">{children}</OpenEffect>
      </div>
    </div>
  );
}

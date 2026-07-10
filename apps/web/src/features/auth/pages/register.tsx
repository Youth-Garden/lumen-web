'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { Icons } from '@lumen/uikit/icons';

import {
  Button,
  Input,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@lumen/uikit/components';
import {
  RegisterFormData,
  getRegisterSchema,
} from '@/features/auth/validations/auth';
import { authService } from '@/services/auth';
import { RouteEnum } from '@/shared/constants';
import { useTranslations } from 'next-intl';

export default function RegisterPage() {
  const t = useTranslations('Auth.Register');
  const tVal = useTranslations('Auth.Validation');
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(getRegisterSchema(tVal)),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  async function onSubmit(data: RegisterFormData) {
    try {
      setIsLoading(true);
      await Promise.all([
        authService.register({ email: data.email, password: data.password }),
        new Promise((resolve) => setTimeout(resolve, 500)),
      ]);

      toast.success(t('success'), {
        description: t('successDesc'),
      });

      router.push(RouteEnum.LOGIN);
    } catch (error) {
      // Errors handled globally
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex flex-col space-y-2 text-center mb-4">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-zinc-900 rounded-xl shadow-lg ring-1 ring-zinc-800">
            <Icons name="command" className="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
        <p className="text-sm text-muted-foreground">{t('subtitle')}</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('email')}</FormLabel>
                <FormControl>
                  <Input
                    placeholder="name@example.com"
                    type="email"
                    autoComplete="email"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('password')}</FormLabel>
                <FormControl>
                  <Input
                    placeholder="••••••••"
                    type="password"
                    autoComplete="new-password"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('confirmPassword')}</FormLabel>
                <FormControl>
                  <Input
                    placeholder="••••••••"
                    type="password"
                    autoComplete="new-password"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full mt-6" disabled={isLoading}>
            {isLoading ? (
              <>
                <Icons name="loader-2" className="mr-2 h-4 w-4 animate-spin" />
                {t('processing')}
              </>
            ) : (
              t('submit')
            )}
          </Button>
        </form>
      </Form>

      <div className="text-center text-sm text-muted-foreground mt-6">
        {t('hasAccount')}{' '}
        <Link
          href={RouteEnum.LOGIN}
          className="font-medium text-primary hover:underline hover:text-primary/90 transition-colors"
        >
          {t('loginNow')}
        </Link>
      </div>
    </div>
  );
}

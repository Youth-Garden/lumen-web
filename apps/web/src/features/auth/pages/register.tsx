'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { Icons } from '@lumen/uikit/icons';

import {
  Button,
  Input,
  PasswordInput,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Logo,
} from '@lumen/uikit/components';
import {
  RegisterFormData,
  getRegisterSchema,
} from '@/features/auth/validations/auth';
import { authService } from '@/services/auth';
import { RouteEnum } from '@/shared/constants';
import { useTranslations } from 'next-intl';
import { useAuthStore } from '@/store/auth.store';
import { useGoogleLogin } from '@react-oauth/google';

export default function RegisterPage() {
  const t = useTranslations('Auth.Register');
  const tVal = useTranslations('Auth.Validation');
  const router = useRouter();
  const searchParams = useSearchParams();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setIsLoading(true);
        const res = await authService.googleLogin(tokenResponse.access_token);
        const tokens = res.data;
        setAuth(tokens.user);

        toast.success(t('success'), {
          description: t('successDesc'),
        });
        const callbackUrl = searchParams.get('callbackUrl');
        router.push(callbackUrl || RouteEnum.DASHBOARD);
        router.refresh();
      } catch (error: any) {
        toast.error(
          'Google registration failed: ' + (error.message || 'Unknown error'),
        );
      } finally {
        setIsLoading(false);
      }
    },
    onError: () => {
      toast.error('Google registration failed');
    },
  });

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
          <Logo showText={false} iconSize={80} />
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
                  <PasswordInput
                    placeholder="••••••••"
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
                  <PasswordInput
                    placeholder="••••••••"
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

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            {t('orContinueWith') || 'Or continue with'}
          </span>
        </div>
      </div>

      <Button
        variant="outline"
        type="button"
        disabled={isLoading}
        className="w-full"
        onClick={() => handleGoogleLogin()}
      >
        <Icons name="google" className="mr-2 h-4 w-4" />
        Google
      </Button>

      <div className="text-center text-sm text-muted-foreground mt-2">
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

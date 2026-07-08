'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { Loader2, Command } from 'lucide-react';

import { Button, Input, Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@lumen/uikit/components';
import { LoginFormData, getLoginSchema } from '@/features/auth';
import { authService } from '@/services/auth';
import { useAuthStore } from '@/store/auth.store';
import { RouteEnum } from '@/shared/constants';

export default function LoginPage() {
  const t = useTranslations('Auth.Login');
  const tVal = useTranslations('Auth.Validation');
  const router = useRouter();
  const searchParams = useSearchParams();
  const setAuth = useAuthStore((state) => state.setAuth);
  
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(getLoginSchema(tVal)),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(data: LoginFormData) {
    try {
      setIsLoading(true);
      // Wait for at least 500ms to show loading state nicely
      const [res] = await Promise.all([
        authService.login(data),
        new Promise(resolve => setTimeout(resolve, 500))
      ]);
      
      const tokens = res.data; // Since BaseResponse is { code, message, data }
      setAuth(tokens.user, tokens.accessToken, tokens.refreshToken);
      
      toast.success(t('success'), {
        description: t('successDesc'),
      });

      const callbackUrl = searchParams.get('callbackUrl');
      router.push(callbackUrl || RouteEnum.DASHBOARD);
      router.refresh();
    } catch (error) {
      // Errors are handled by the API interceptors/toast
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex flex-col space-y-2 text-center mb-4">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-zinc-900 rounded-xl shadow-lg ring-1 ring-zinc-800">
            <Command className="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
        <p className="text-sm text-muted-foreground">
          {t('subtitle')}
        </p>
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
                <div className="flex items-center justify-between">
                  <FormLabel>{t('password')}</FormLabel>
                  <Link 
                    href={RouteEnum.FORGOT_PASSWORD}
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    {t('forgotPassword')}
                  </Link>
                </div>
                <FormControl>
                  <Input 
                    placeholder="••••••••" 
                    type="password" 
                    autoComplete="current-password"
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
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('processing')}
              </>
            ) : (
              t('submit')
            )}
          </Button>
        </form>
      </Form>

      <div className="text-center text-sm text-muted-foreground mt-6">
        {t('noAccount')}{' '}
        <Link 
          href={RouteEnum.REGISTER}
          className="font-medium text-primary hover:underline hover:text-primary/90 transition-colors"
        >
          {t('registerNow')}
        </Link>
      </div>
    </div>
  );
}

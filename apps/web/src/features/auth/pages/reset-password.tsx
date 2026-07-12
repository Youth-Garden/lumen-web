'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { Icons } from '@lumen/uikit/icons';

import {
  Button,
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
  ResetPasswordFormData,
  getResetPasswordSchema,
} from '@/features/auth/validations/auth';
import { authService } from '@/services/auth';
import { RouteEnum } from '@/shared/constants';

export default function ResetPasswordPage() {
  const t = useTranslations('Auth.ResetPassword');
  const tVal = useTranslations('Auth.Validation');
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      toast.error(t('missingToken'));
      router.push(RouteEnum.LOGIN);
    }
  }, [token, router, t]);

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(getResetPasswordSchema(tVal)),
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) return;
    try {
      setIsLoading(true);
      await authService.resetPassword({
        token,
        newPassword: data.newPassword,
      });
      setIsSuccess(true);
      toast.success(t('success'), {
        description: t('successDesc'),
      });

      router.push(RouteEnum.LOGIN);
    } catch (error: any) {
      toast.error(t('error'), {
        description: error?.response?.data?.message || t('errorDesc'),
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) return null;

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex flex-col space-y-2 text-center mb-4">
        <div className="flex justify-center mb-4">
          <Logo showText={false} iconSize={80} />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
        <p className="text-sm text-muted-foreground">{t('description')}</p>
      </div>

      {isSuccess ? (
        <div className="flex flex-col gap-4 items-center justify-center p-6 bg-muted/50 rounded-lg border text-center">
          <Icons name="check-circle" className="h-10 w-10 text-primary" />
          <div className="space-y-1">
            <h3 className="font-medium text-foreground">{t('resetSuccess')}</h3>
            <p className="text-sm text-muted-foreground">{t('redirecting')}</p>
          </div>
        </div>
      ) : (
        <>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('newPassword')}</FormLabel>
                    <FormControl>
                      <PasswordInput
                        placeholder="********"
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
                        placeholder="********"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button className="w-full" type="submit" disabled={isLoading}>
                {isLoading && (
                  <Icons
                    name="loader-2"
                    className="mr-2 h-4 w-4 animate-spin"
                  />
                )}
                {t('submit')}
              </Button>
            </form>
          </Form>

          <div className="text-center text-sm text-muted-foreground">
            <Link
              href={RouteEnum.LOGIN}
              className="hover:text-primary underline underline-offset-4"
            >
              {t('cancel')}
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

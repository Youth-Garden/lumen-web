'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
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
  Logo,
} from '@lumen/uikit/components';
import {
  ForgotPasswordFormData,
  getForgotPasswordSchema,
} from '@/features/auth/validations/auth';
import { authService } from '@/services/auth';
import { RouteEnum } from '@/shared/constants';

export default function ForgotPasswordPage() {
  const t = useTranslations('Auth.ForgotPassword');
  const tVal = useTranslations('Auth.Validation');
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(getForgotPasswordSchema(tVal)),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      setIsLoading(true);
      await authService.forgotPassword({ email: data.email });
      setIsSuccess(true);
      toast.success(t('success'), {
        description: t('successDesc'),
      });
    } catch (error: any) {
      toast.error(t('error'), {
        description: error?.response?.data?.message || t('errorDesc'),
      });
    } finally {
      setIsLoading(false);
    }
  };

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
            <h3 className="font-medium text-foreground">{t('checkEmail')}</h3>
            <p className="text-sm text-muted-foreground">
              {t('checkEmailDesc')}
            </p>
          </div>
          <Button
            variant="outline"
            className="w-full mt-4"
            onClick={() => router.push(RouteEnum.LOGIN)}
          >
            {t('backToLogin')}
          </Button>
        </div>
      ) : (
        <>
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
                        autoCapitalize="none"
                        autoComplete="email"
                        autoCorrect="off"
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
            {t('rememberPassword')}{' '}
            <Link
              href={RouteEnum.LOGIN}
              className="hover:text-primary underline underline-offset-4"
            >
              {t('loginLink')}
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

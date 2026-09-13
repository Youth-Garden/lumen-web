'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import {
  VerifyEmailOtpFormData,
  getVerifyEmailOtpSchema,
} from '@/features/auth/validations/auth';
import { authService } from '@/services/auth';
import { RouteEnum } from '@/shared/constants';
import { useAuthStore } from '@/store/auth.store';
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Logo,
} from '@lumen/uikit/components';

import { Icons } from '@lumen/uikit/icons';
import { useGoogleLogin } from '@react-oauth/google';

type Step = 'email' | 'otp';

export default function LoginPage() {
  const t = useTranslations('Auth.Login');
  const tVal = useTranslations('Auth.Validation');
  const router = useRouter();
  const searchParams = useSearchParams();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [step, setStep] = useState<Step>('email');
  const [isLoading, setIsLoading] = useState(false);
  const [resendIn, setResendIn] = useState(0);

  const form = useForm<VerifyEmailOtpFormData>({
    resolver: zodResolver(getVerifyEmailOtpSchema(tVal)),
    defaultValues: { email: '', otp: '' },
  });

  const handleGoogleLogin = useGoogleLogin({
    prompt: 'select_account',
    onSuccess: async (tokenResponse) => {
      try {
        setIsLoading(true);
        const res = await authService.googleLogin(tokenResponse.access_token);
        const tokens = res.data;
        setAuth(tokens.user, tokens.accessToken, tokens.refreshToken);

        const callbackUrl = searchParams.get('callbackUrl');
        router.push(callbackUrl || RouteEnum.DASHBOARD);
        router.refresh();
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : 'Unknown error';
        toast.error('Google login failed: ' + message);
      } finally {
        setIsLoading(false);
      }
    },
    onError: () => {
      toast.error('Google login failed');
    },
  });

  async function handleSendOtp() {
    const valid = await form.trigger('email');
    if (!valid) return;
    try {
      setIsLoading(true);
      await authService.sendEmailOtp({ email: form.getValues('email') });
      setStep('otp');
      toast.success(t('otpSent'));
      startResendTimer();
    } catch {
      // Errors handled globally
    } finally {
      setIsLoading(false);
    }
  }

  async function onVerify(data: VerifyEmailOtpFormData) {
    try {
      setIsLoading(true);
      const [res] = await Promise.all([
        authService.verifyEmailOtp({ email: data.email, otp: data.otp }),
        new Promise((resolve) => setTimeout(resolve, 500)),
      ]);

      const tokens = res.data;
      setAuth(tokens.user, tokens.accessToken, tokens.refreshToken);

      const callbackUrl = searchParams.get('callbackUrl');
      router.push(callbackUrl || RouteEnum.DASHBOARD);
      router.refresh();
    } catch {
      // Errors handled globally
    } finally {
      setIsLoading(false);
    }
  }

  function startResendTimer() {
    setResendIn(30);
    const id = setInterval(() => {
      setResendIn((current) => {
        if (current <= 1) {
          clearInterval(id);
          return 0;
        }
        return current - 1;
      });
    }, 1000);
  }

  async function handleResend() {
    if (resendIn > 0) return;
    await authService.sendEmailOtp({ email: form.getValues('email') });
    toast.success(t('otpSent'));
    startResendTimer();
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
        <form onSubmit={form.handleSubmit(onVerify)} className="space-y-4">
          {step === 'email' ? (
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
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                          event.preventDefault();
                          handleSendOtp();
                        }
                      }}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ) : (
            <div className="space-y-4">
              <div className="rounded-lg bg-muted/50 px-3 py-2 text-sm text-muted-foreground">
                {t('otpSentTo')}{' '}
                <span className="font-medium text-foreground">
                  {form.getValues('email')}
                </span>
              </div>
              <FormField
                control={form.control}
                name="otp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('otp')}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="123456"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        maxLength={6}
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="button"
                variant="text"
                className="h-auto p-0 text-sm"
                disabled={resendIn > 0}
                onClick={handleResend}
              >
                {resendIn > 0
                  ? t('resendIn', { seconds: resendIn })
                  : t('resend')}
              </Button>
            </div>
          )}

          {step === 'email' ? (
            <Button
              type="button"
              className="w-full mt-6"
              disabled={isLoading}
              onClick={handleSendOtp}
            >
              {isLoading ? (
                <>
                  <Icons
                    name="loader-2"
                    className="mr-2 h-4 w-4 animate-spin"
                  />
                  {t('processing')}
                </>
              ) : (
                t('sendCode')
              )}
            </Button>
          ) : (
            <div className="space-y-3">
              <Button
                type="submit"
                className="w-full mt-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Icons
                      name="loader-2"
                      className="mr-2 h-4 w-4 animate-spin"
                    />
                    {t('processing')}
                  </>
                ) : (
                  t('verify')
                )}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full"
                disabled={isLoading}
                onClick={() => setStep('email')}
              >
                {t('backToEmail')}
              </Button>
            </div>
          )}
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
        <Icons name="google" className="h-4 w-4" />
        Google
      </Button>
    </div>
  );
}

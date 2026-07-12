import * as z from 'zod';

import { TranslateFn } from '@/shared/types';

export const getLoginSchema = (translate: TranslateFn) =>
  z.object({
    email: z.string().email({ message: translate('invalidEmail') }),
    password: z.string().min(6, { message: translate('passwordMin') }),
  });

export const getRegisterSchema = (translate: TranslateFn) =>
  z
    .object({
      email: z.string().email({ message: translate('invalidEmail') }),
      password: z.string().min(6, { message: translate('passwordMin') }),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: translate('passwordMismatch'),
      path: ['confirmPassword'],
    });

export const getForgotPasswordSchema = (translate: TranslateFn) =>
  z.object({
    email: z.string().email({ message: translate('invalidEmail') }),
  });

export const getResetPasswordSchema = (translate: TranslateFn) =>
  z
    .object({
      newPassword: z.string().min(8, { message: translate('passwordMin') }),
      confirmPassword: z.string(),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: translate('passwordMismatch'),
      path: ['confirmPassword'],
    });

export type LoginFormData = z.infer<ReturnType<typeof getLoginSchema>>;
export type RegisterFormData = z.infer<ReturnType<typeof getRegisterSchema>>;
export type ForgotPasswordFormData = z.infer<ReturnType<typeof getForgotPasswordSchema>>;
export type ResetPasswordFormData = z.infer<ReturnType<typeof getResetPasswordSchema>>;

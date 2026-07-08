import * as z from 'zod';

import { TranslateFn } from '@/shared/types';

export const getLoginSchema = (t: TranslateFn) => z.object({
  email: z.string().email({ message: t('invalidEmail') }),
  password: z.string().min(6, { message: t('passwordMin') }),
});

export const getRegisterSchema = (t: TranslateFn) => z.object({
  email: z.string().email({ message: t('invalidEmail') }),
  password: z.string().min(6, { message: t('passwordMin') }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: t('passwordMismatch'),
  path: ['confirmPassword'],
});

export type LoginFormData = z.infer<ReturnType<typeof getLoginSchema>>;
export type RegisterFormData = z.infer<ReturnType<typeof getRegisterSchema>>;

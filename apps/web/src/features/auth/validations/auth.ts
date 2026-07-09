import * as z from 'zod';

import { TranslateFn } from '@/shared/types';

export const getLoginSchema = (translate: TranslateFn) => z.object({
  email: z.string().email({ message: translate('invalidEmail') }),
  password: z.string().min(6, { message: translate('passwordMin') }),
});

export const getRegisterSchema = (translate: TranslateFn) => z.object({
  email: z.string().email({ message: translate('invalidEmail') }),
  password: z.string().min(6, { message: translate('passwordMin') }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: translate('passwordMismatch'),
  path: ['confirmPassword'],
});

export type LoginFormData = z.infer<ReturnType<typeof getLoginSchema>>;
export type RegisterFormData = z.infer<ReturnType<typeof getRegisterSchema>>;

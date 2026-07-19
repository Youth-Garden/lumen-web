import * as z from 'zod';

import { TranslateFn } from '@/shared/types';

export const getVerifyEmailOtpSchema = (translate: TranslateFn) =>
  z.object({
    email: z.string().email({ message: translate('invalidEmail') }),
    otp: z
      .string()
      .length(6, { message: translate('otpLength') })
      .regex(/^\d+$/, { message: translate('otpDigits') }),
  });

export type VerifyEmailOtpFormData = z.infer<
  ReturnType<typeof getVerifyEmailOtpSchema>
>;

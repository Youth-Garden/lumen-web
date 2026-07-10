export type TranslationKey = string;
export type TranslateFn<T = TranslationKey> = (
  key: T,
  values?: Record<string, unknown>,
) => string;

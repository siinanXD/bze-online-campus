import { getRequestConfig } from 'next-intl/server';

export const locales = ['de', 'en', 'fr', 'ar', 'uk', 'tr'] as const;
export const defaultLocale = 'de';

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale =
    requested && (locales as readonly string[]).includes(requested)
      ? requested
      : defaultLocale;

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});

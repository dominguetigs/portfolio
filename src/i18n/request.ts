import * as rootParams from 'next/root-params';

import { getRequestConfig } from 'next-intl/server';
import { hasLocale } from 'next-intl';

import { routing } from './routing';

export default getRequestConfig(async ({ locale: explicitLocale }) => {
  // An explicit locale (getTranslations({ locale })) wins; otherwise the
  // `[locale]` root param of the current route.
  const requested = explicitLocale ?? (await rootParams.locale());
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});

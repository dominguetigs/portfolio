import type { MetadataRoute } from 'next';

import { SITE_URL } from '@/constants';
import { routing } from '@/i18n/routing';

export default function sitemap(): MetadataRoute.Sitemap {
  const languages = Object.fromEntries(
    routing.locales.map(locale => [locale, `${SITE_URL}/${locale}`]),
  );

  return routing.locales.map(locale => ({
    url: `${SITE_URL}/${locale}`,
    changeFrequency: 'monthly',
    priority: locale === routing.defaultLocale ? 1 : 0.8,
    alternates: { languages },
  }));
}

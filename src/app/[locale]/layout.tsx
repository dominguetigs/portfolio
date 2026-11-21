import type { Metadata, Viewport } from 'next';
import { Nunito } from 'next/font/google';
import { PT_Sans } from 'next/font/google';
import { notFound } from 'next/navigation';

import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getTranslations } from 'next-intl/server';

import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

import '../globals.css';
import { ThemeProvider } from '@/hooks/theme-provider';
import { MainContent } from '@/components/main-content';
import { SplashHeadScript } from '@/components/splash-screen/splash-state';
import { CONTACT_INFO, SITE_URL } from '@/constants';
import { routing } from '@/i18n/routing';

const nunito = Nunito({
  variable: '--font-nunito',
  subsets: ['latin'],
});

const ptSans = PT_Sans({
  variable: '--font-pt-sans',
  subsets: ['latin'],
  weight: ['400', '700'],
});

const OPEN_GRAPH_LOCALES: Record<string, string> = {
  pt: 'pt_BR',
  en: 'en_US',
  es: 'es_ES',
};

type LayoutProps = Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>;

export function generateStaticParams() {
  return routing.locales.map(locale => ({ locale }));
}

export async function generateMetadata({
  params,
}: Pick<LayoutProps, 'params'>): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata' });

  const title = t('title');
  const description = t('description');

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    alternates: {
      canonical: `/${locale}`,
      languages: {
        ...Object.fromEntries(routing.locales.map(l => [l, `/${l}`])),
        'x-default': `/${routing.defaultLocale}`,
      },
    },
    icons: {
      icon: [
        { url: '/favicon/pi-g-favicon.svg', type: 'image/svg+xml' },
        {
          url: '/favicon/pi-g-favicon-dark.svg',
          type: 'image/svg+xml',
          media: '(prefers-color-scheme: dark)',
        },
        {
          url: '/favicon/favicon-16x16.png',
          sizes: '16x16',
          type: 'image/png',
        },
        {
          url: '/favicon/favicon-16x16-dark.png',
          sizes: '16x16',
          type: 'image/png',
          media: '(prefers-color-scheme: dark)',
        },
        {
          url: '/favicon/favicon-32x32.png',
          sizes: '32x32',
          type: 'image/png',
        },
        {
          url: '/favicon/favicon-32x32-dark.png',
          sizes: '32x32',
          type: 'image/png',
          media: '(prefers-color-scheme: dark)',
        },
      ],
      shortcut: '/favicon/pi-g-favicon.svg',
      apple: {
        url: '/favicon/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    },
    openGraph: {
      type: 'website',
      locale: OPEN_GRAPH_LOCALES[locale],
      alternateLocale: routing.locales
        .filter(l => l !== locale)
        .map(l => OPEN_GRAPH_LOCALES[l]),
      url: `/${locale}`,
      siteName: CONTACT_INFO.name,
      title,
      description,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f1dfbe' },
    { media: '(prefers-color-scheme: dark)', color: '#020618' },
  ],
};

export default async function RootLayout({ children, params }: LayoutProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const t = await getTranslations({ locale, namespace: 'Index.Hero' });

  const person = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: CONTACT_INFO.name,
    jobTitle: t('titles.main'),
    url: `${SITE_URL}/${locale}`,
    image: `${SITE_URL}/hero-profile.png`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'São Paulo',
      addressRegion: 'SP',
      addressCountry: 'BR',
    },
    sameAs: CONTACT_INFO.social.map(({ url }) => url),
  };

  return (
    <html lang={locale} suppressHydrationWarning className="overflow-x-hidden">
      <head>
        <SplashHeadScript />
        <noscript>
          <style>{'[data-splash-screen]{display:none}'}</style>
        </noscript>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(person).replace(/</g, '\\u003c'),
          }}
        />
      </head>
      <body
        className={`${nunito.variable} ${ptSans.variable} antialiased relative overflow-x-hidden`}
      >
        <NextIntlClientProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <MainContent>{children}</MainContent>
          </ThemeProvider>
        </NextIntlClientProvider>

        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

import type { Metadata } from 'next';
import { Nunito } from 'next/font/google';
import { PT_Sans } from 'next/font/google';

import { hasLocale, NextIntlClientProvider } from 'next-intl';

import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

import '../globals.css';
import { ThemeProvider } from '@/hooks/theme-provider';
import { MainContent } from '@/components/main-content';
import { routing } from '@/i18n/routing';
import { notFound } from 'next/navigation';

const nunito = Nunito({
  variable: '--font-nunito',
  subsets: ['latin'],
});

const ptSans = PT_Sans({
  variable: '--font-pt-sans',
  subsets: ['latin'],
  weight: ['400', '700'],
});

export const metadata: Metadata = {
  title: 'Gustavo Domingueti - Portfolio',
  description: 'Portfolio pessoal de Gustavo Domingueti, Engenheiro Frontend',
  icons: {
    icon: [
      { url: '/favicon/pi-g-favicon.svg', type: 'image/svg+xml' },
      {
        url: '/favicon/pi-g-favicon-dark.svg',
        type: 'image/svg+xml',
        media: '(prefers-color-scheme: dark)',
      },
      { url: '/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      {
        url: '/favicon/favicon-16x16-dark.png',
        sizes: '16x16',
        type: 'image/png',
        media: '(prefers-color-scheme: dark)',
      },
      { url: '/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
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
    locale: 'pt_BR',
    url: '/',
    title: 'Gustavo Domingueti - Portfolio',
    description: 'Portfolio pessoal de Gustavo Domingueti, Engenheiro Frontend',
    siteName: 'Gustavo Domingueti - Portfolio',
  },
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html lang={locale} suppressHydrationWarning className="overflow-x-hidden">
      <head>
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Gustavo Domingueti - Portfolio" />
        <meta
          property="og:description"
          content="Portfolio pessoal de Gustavo Domingueti, Engenheiro Frontend"
        />
        <meta property="og:url" content="/" />
        <meta
          property="og:site_name"
          content="Gustavo Domingueti - Portfolio"
        />
        <meta property="og:locale" content="pt_BR" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, viewport-fit=cover, user-scalable=no"
        />
        <meta name="orientation" content="portrait" />
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

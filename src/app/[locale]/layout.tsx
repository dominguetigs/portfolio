import type { Metadata } from 'next';
import { Nunito } from 'next/font/google';
import { PT_Sans } from 'next/font/google';

import { hasLocale, NextIntlClientProvider } from 'next-intl';

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
    <html lang={locale} suppressHydrationWarning>
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
        {/* <style>
          {`
            @media only screen and (max-width: 1024px) and (orientation: landscape) {
              body::before {
                content: "Por favor, gire o dispositivo para o modo retrato";
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: var(--background);
                color: var(--foreground);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.5rem;
                font-family: var(--font-nunito);
                text-align: center;
                padding: 2rem;
                z-index: 9999;
              }
              body > div {
                display: none;
              }
            }
          `}
        </style> */}
      </head>
      <body
        className={`${nunito.variable} ${ptSans.variable} antialiased relative`}
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
      </body>
    </html>
  );
}

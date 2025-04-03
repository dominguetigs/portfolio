import type { Metadata } from 'next';
import { Nunito } from 'next/font/google';
import { PT_Sans } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { MainContent } from '@/components/main-content';

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
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
      </head>
      <body
        className={`${nunito.variable} ${ptSans.variable} antialiased relative`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <MainContent>{children}</MainContent>
        </ThemeProvider>
      </body>
    </html>
  );
}

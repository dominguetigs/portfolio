import { useTransition } from 'react';

import { useLocale } from 'next-intl';

import { useRouter, usePathname } from '@/i18n/navigation';

import { LANGUAGES } from './constants';

const [DEFAULT_LANGUAGE] = LANGUAGES;
const TIMEOUT = 300;

export function useLanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const currentLanguage =
    LANGUAGES.find(lang => lang.code === locale) || DEFAULT_LANGUAGE;

  function handleChangeLanguage(newLocale: string) {
    if (newLocale === locale) {
      return;
    }

    document.body.classList.add('changing-locale');

    startTransition(() => {
      router.replace(pathname, { locale: newLocale });

      const timeout = setTimeout(() => {
        document.body.classList.remove('changing-locale');
        clearTimeout(timeout);
      }, TIMEOUT);
    });
  }

  return {
    currentLanguage,
    languages: LANGUAGES,
    isPending,
    handleChangeLanguage,
  };
}

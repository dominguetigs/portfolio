'use client';

import Image from 'next/image';
import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';
import { useTransition } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const languages = [
  {
    code: 'en',
    name: 'English',
    flag: '/flags/usa.svg',
  },
  {
    code: 'pt',
    name: 'Português',
    flag: '/flags/brazil.svg',
  },
  {
    code: 'es',
    name: 'Español',
    flag: '/flags/spain.svg',
  },
];

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const currentLanguage =
    languages.find(lang => lang.code === locale) || languages[0];

  function handleChangeLanguage(newLocale: string) {
    if (newLocale === locale) return;

    // Aplicar efeito de esmaecimento
    document.body.classList.add('changing-locale');

    startTransition(() => {
      // Usar o pathname atual para preservar a rota
      router.replace(pathname, { locale: newLocale });

      // Remover o efeito após a transição
      setTimeout(() => {
        document.body.classList.remove('changing-locale');
      }, 300);
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          disabled={isPending}
          aria-label="Mudar idioma"
          className="relative p-1 flex items-center justify-center"
        >
          <div className="relative w-6 h-6 rounded-full overflow-hidden">
            <Image
              src={currentLanguage.flag}
              alt={currentLanguage.name}
              fill
              className="object-cover"
              priority
            />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map(language => (
          <DropdownMenuItem
            key={language.code}
            disabled={isPending}
            onClick={() => handleChangeLanguage(language.code)}
            className={cn(
              'flex items-center gap-2 h-9',
              language.code === locale && 'bg-muted font-medium',
            )}
          >
            <div className="relative w-6 h-6 rounded-full overflow-hidden flex-shrink-0">
              <Image
                src={language.flag}
                alt={language.name}
                fill
                className="object-cover"
              />
            </div>
            <span>{language.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

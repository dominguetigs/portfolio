'use client';

import { ComponentProps } from 'react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { FlagButton } from './flag-button';
import { LanguageItem } from './language-item';
import { useLanguageSwitcher } from './use-language-switcher';

type LanguageSwitcherProps = ComponentProps<typeof Button>;

export function LanguageSwitcher(props: LanguageSwitcherProps) {
  const { currentLanguage, languages, isPending, handleChangeLanguage } =
    useLanguageSwitcher();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <FlagButton
          language={currentLanguage}
          isPending={isPending}
          {...props}
        />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        {languages.map(language => (
          <LanguageItem
            key={language.code}
            language={language}
            isSelected={language.code === currentLanguage.code}
            isPending={isPending}
            onClick={() => handleChangeLanguage(language.code)}
          />
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

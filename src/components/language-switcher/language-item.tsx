import Image from 'next/image';

import { DropdownMenuItem } from '@/components/ui/dropdown-menu';

import { cn } from '@/lib/utils';

import { Language } from '@/types';

interface LanguageItemProps {
  language: Language;
  isSelected: boolean;
  isPending?: boolean;
  onClick: VoidFunction;
}

export function LanguageItem({
  language,
  isSelected,
  isPending,
  onClick,
}: LanguageItemProps) {
  return (
    <DropdownMenuItem
      disabled={isPending}
      onClick={onClick}
      className={cn(
        'flex items-center gap-2 h-9',
        isSelected && 'bg-muted font-medium',
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
  );
}

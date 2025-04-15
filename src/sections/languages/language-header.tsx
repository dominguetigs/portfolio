'use client';

import Image from 'next/image';

interface LanguageHeaderProps {
  language: string;
  level: string;
  flag: string;
  flagAlt: string;
}

export const LanguageHeader = ({
  language,
  level,
  flag,
  flagAlt,
}: LanguageHeaderProps) => {
  return (
    <div className="flex items-center gap-3 mb-5 md:mb-0 md:min-w-[180px]">
      {flag && (
        <div className="relative h-10 w-10 overflow-hidden rounded-full border border-border shadow-sm flex-shrink-0">
          <Image
            src={flag}
            alt={flagAlt}
            fill
            sizes="40px"
            className="object-cover"
            priority
          />
        </div>
      )}
      <div>
        <h3 className="text-base sm:text-lg font-semibold">{language}</h3>
        <p className="text-xs sm:text-sm text-muted-foreground">{level}</p>
      </div>
    </div>
  );
};

import { useTranslations } from 'next-intl';

import { AnimatedHeart } from './animated-heart';
import { AuthorLink } from './author-link';

export function CopyrightMessage() {
  const t = useTranslations('Index.Footer');

  return (
    <p className="flex items-center justify-center gap-1.5">
      {t('madeWith')}
      <AnimatedHeart />
      {t('by')}
      <AuthorLink />
    </p>
  );
}

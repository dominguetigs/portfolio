import { ComponentProps } from 'react';

import Image from 'next/image';

import { useTranslations } from 'next-intl';

import { motion } from 'framer-motion';

import { Button } from '@/components/ui/button';

import { Language } from '@/types';

import { springAnimation } from './animations';

interface FlagButtonProps extends ComponentProps<typeof Button> {
  language: Language;
  isPending?: boolean;
}

export function FlagButton({ language, isPending, ...props }: FlagButtonProps) {
  const t = useTranslations('Index.Header');

  const { name, flag } = language;

  return (
    <Button
      variant="outline"
      size="icon"
      disabled={isPending}
      aria-label={t('changeLanguage')}
      className="relative p-1 flex items-center justify-center group overflow-hidden hover:shadow-[0_0_15px_rgba(255,255,255,0.2)]"
      {...props}
    >
      <motion.div
        className="relative w-6 h-6 rounded-full overflow-hidden"
        initial="initial"
        whileHover="hover"
        animate="initial"
        variants={springAnimation}
      >
        <Image src={flag} alt={name} fill className="object-cover" priority />
      </motion.div>
    </Button>
  );
}

'use client';

import { ReactNode } from 'react';

import { useTranslations } from 'next-intl';

import { motion } from 'framer-motion';

import { Copy } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { fadeInUpVariants } from './animations';

interface ContactInfoCardProps {
  icon: ReactNode;
  title: string;
  content: string;
  showCopyButton?: boolean;
  onCopy?: () => void;
}

export function ContactInfoCard({
  icon,
  title,
  content,
  showCopyButton = false,
  onCopy,
}: ContactInfoCardProps) {
  const t = useTranslations('Index.Contact');

  return (
    <motion.div
      className="bg-card rounded-lg p-4 shadow-md transition-shadow border border-border"
      variants={fadeInUpVariants}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-start gap-4">
        <div className="bg-primary/10 p-3 rounded-full">{icon}</div>
        <div className="flex-1">
          <h3 className="font-semibold text-lg mb-1 text-foreground">
            {title}
          </h3>
          <p
            className={`text-muted-foreground mb-${showCopyButton ? '3' : '0'} ${title === t('email') ? 'break-all' : ''}`}
          >
            {content}
          </p>
          {showCopyButton && (
            <Button
              onClick={onCopy}
              variant="link"
              className="text-sm p-0! h-auto text-primary hover:text-primary/80"
              aria-label={`${t('copy')} ${title}`}
            >
              <Copy className="h-4 w-4 mr-1.5" /> {t('copy')}
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

'use client';

import { useTranslations } from 'next-intl';

import { motion } from 'framer-motion';

import { Check, Mail, MapPin, Phone } from 'lucide-react';

import { toast } from 'sonner';

import { CONTACT_INFO } from '@/constants';

import { copyTextToClipboard } from '@/utils';

import { ContactInfoCard } from './contact-info-card';
import { leftColVariants } from './animations';

export function ContactInfoContainer() {
  const t = useTranslations('Index.Contact');

  const handleCopy = async (type: 'email' | 'phone') => {
    const text = CONTACT_INFO[type];

    const success = await copyTextToClipboard(text);

    if (success) {
      showCopiedToast(type);
    }
  };

  const showCopiedToast = (type: 'email' | 'phone') => {
    const messages = {
      email: t('emailCopiedMessage'),
      phone: t('phoneCopiedMessage'),
    };

    const message = messages[type];

    toast.success(message, {
      position: 'bottom-center',
      duration: 2000,
      icon: <Check className="h-4 w-4" />,
    });
  };

  return (
    <motion.div className="flex flex-col gap-6" variants={leftColVariants}>
      <ContactInfoCard
        icon={<Mail className="h-6 w-6 text-primary" />}
        title={t('email')}
        content={CONTACT_INFO.email}
        showCopyButton
        onCopy={() => handleCopy('email')}
      />

      <ContactInfoCard
        icon={<Phone className="h-6 w-6 text-primary" />}
        title={t('phone')}
        content={CONTACT_INFO.phone}
        showCopyButton
        onCopy={() => handleCopy('phone')}
      />

      <ContactInfoCard
        icon={<MapPin className="h-6 w-6 text-primary" />}
        title={t('location')}
        content={CONTACT_INFO.location}
      />
    </motion.div>
  );
}

'use client';

import { useTranslations } from 'next-intl';

import { motion } from 'framer-motion';

import { Check, Mail, MapPin, Phone } from 'lucide-react';

import { toast } from 'sonner';

import { copyTextToClipboard } from '@/utils';

import { ContactInfoCard } from './contact-info-card';
import { leftColVariants } from './animations';

export function ContactInfoContainer() {
  const t = useTranslations('Index.Contact');

  const contactInfo = {
    email: 'gustavo.s.domingueti@icloud.com',
    phone: '+55 (11) 9 7158-1380',
    location: 'São Paulo, SP - Brasil',
  };

  const handleCopy = async (text: string, type: string) => {
    const success = await copyTextToClipboard(text);

    if (success) {
      showCopiedToast(type);
    }
  };

  const showCopiedToast = (type: string) => {
    const message =
      type === 'email' ? t('emailCopiedMessage') : t('phoneCopiedMessage');

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
        content={contactInfo.email}
        showCopyButton
        onCopy={() => handleCopy(contactInfo.email, 'email')}
      />

      <ContactInfoCard
        icon={<Phone className="h-6 w-6 text-primary" />}
        title={t('phone')}
        content={contactInfo.phone}
        showCopyButton
        onCopy={() => handleCopy(contactInfo.phone, 'phone')}
      />

      <ContactInfoCard
        icon={<MapPin className="h-6 w-6 text-primary" />}
        title={t('location')}
        content={contactInfo.location}
      />
    </motion.div>
  );
}

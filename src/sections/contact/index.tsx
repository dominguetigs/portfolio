'use client';

import { useState } from 'react';

import { useTranslations } from 'next-intl';

import { motion } from 'framer-motion';

import { Toaster } from '@/components/ui/sonner';

import {
  sectionVariants,
  titleVariants,
  descriptionVariants,
  rightColVariants,
} from './animations';
import { ContactForm } from './contact-form';
import { ContactInfoContainer } from './contact-info-container';
import { ThankYouDialog } from './thank-you-dialog';
import { playThankYouSound } from './utils/audio';

export function ContactSection() {
  const t = useTranslations('Index.Contact');

  const [showThankYouMessage, setShowThankYouMessage] = useState(false);
  const [shouldPlaySound, setShouldPlaySound] = useState(false);

  const handleFormSubmitSuccess = () => {
    setShouldPlaySound(true);
    setShowThankYouMessage(true);
  };

  const handleAnimationStart = () => {
    if (shouldPlaySound) {
      playThankYouSound();
    }
  };

  const handleDialogClose = () => {
    setShowThankYouMessage(false);

    if (shouldPlaySound) {
      setShouldPlaySound(false);
    }
  };

  return (
    <motion.section
      className="mt-20 pt-4"
      id="contact"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.02 }}
      variants={sectionVariants}
    >
      <Toaster />

      <ThankYouDialog
        isOpen={showThankYouMessage}
        onClose={handleDialogClose}
        onAnimationStart={handleAnimationStart}
      />

      <motion.h2
        className="text-3xl font-bold mb-6 text-center"
        variants={titleVariants}
      >
        {t('title')}
      </motion.h2>

      <motion.p
        className="text-center text-muted-foreground mb-10 max-w-xl mx-auto"
        variants={descriptionVariants}
      >
        {t('description')}
      </motion.p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <ContactInfoContainer />

        <motion.div
          className="bg-card rounded-lg p-4 shadow-md border border-border flex flex-col"
          variants={rightColVariants}
          transition={{ duration: 0.3 }}
        >
          <h3 className="font-semibold text-lg mb-4 text-foreground">
            {t('sendMessage')}
          </h3>
          <ContactForm onSubmitSuccess={handleFormSubmitSuccess} />
        </motion.div>
      </div>
    </motion.section>
  );
}

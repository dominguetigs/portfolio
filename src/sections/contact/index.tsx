'use client';

import { useTranslations } from 'next-intl';
import { motion, Variants } from 'framer-motion';
import {
  Copy,
  Check,
  Mail,
  Phone,
  MapPin,
  Send,
  Loader2,
  HeartHandshake,
} from 'lucide-react';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { useState, FormEvent } from 'react';

export function ContactSection() {
  const t = useTranslations('Index.Contact');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showThankYouMessage, setShowThankYouMessage] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const contactInfo = {
    email: 'gustavo.s.domingueti@icloud.com',
    phone: '+55 (11) 9 7158-1380',
    location: 'São Paulo, SP - Brasil',
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      toast.error(t('formError'), {
        position: 'bottom-center',
        duration: 3000,
      });
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send message');
      }

      // Show thank you message instead of toast
      setShowThankYouMessage(true);

      // Limpar o formulário
      setFormData({
        name: '',
        email: '',
        message: '',
      });
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      toast.error(t('messageError'), {
        position: 'bottom-center',
        duration: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopy = (text: string, type: string) => {
    try {
      // Verificar se a API Clipboard está disponível
      if (navigator?.clipboard?.writeText) {
        navigator.clipboard
          .writeText(text)
          .then(() => {
            showCopiedToast(type);
          })
          .catch(err => {
            console.error('Falha ao copiar texto: ', err);
            fallbackCopyTextToClipboard(text, type);
          });
      } else {
        // Usar método alternativo se clipboard API não estiver disponível
        fallbackCopyTextToClipboard(text, type);
      }
    } catch (error) {
      console.error('Erro ao copiar: ', error);
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

  // Método alternativo para copiar texto quando clipboard API não está disponível
  const fallbackCopyTextToClipboard = (text: string, type: string) => {
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;

      // Tornar o elemento invisível
      textArea.style.position = 'fixed';
      textArea.style.top = '0';
      textArea.style.left = '0';
      textArea.style.width = '2em';
      textArea.style.height = '2em';
      textArea.style.padding = '0';
      textArea.style.border = 'none';
      textArea.style.outline = 'none';
      textArea.style.boxShadow = 'none';
      textArea.style.background = 'transparent';

      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      try {
        const successful = document.execCommand('copy');
        if (successful) {
          showCopiedToast(type);
        }
      } catch (err) {
        console.error('Fallback: Não foi possível copiar', err);
      }

      document.body.removeChild(textArea);
    } catch (error) {
      console.error('Fallback: Erro ao copiar: ', error);
    }
  };

  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 90,
        damping: 18,
      },
    },
  };

  // Animações para a seção
  const sectionVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: 'beforeChildren',
        staggerChildren: 0.15,
        duration: 0.8,
        delayChildren: 0.2,
      },
    },
  };

  const titleVariants = {
    hidden: { opacity: 0, y: -15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
      },
    },
  };

  const descriptionVariants = {
    hidden: { opacity: 0, scale: 0.98 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.7,
        delay: 0.3,
        ease: 'easeOut',
      },
    },
  };

  const leftColVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 80,
        damping: 20,
        when: 'beforeChildren',
        staggerChildren: 0.15,
      },
    },
  };

  const rightColVariants = {
    hidden: { opacity: 0, x: 30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 80,
        damping: 20,
      },
    },
  };

  // Animation variants for thank you dialog content
  const dialogContentVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: 'beforeChildren',
        staggerChildren: 0.2,
        duration: 0.3,
      },
    },
  };

  // Animation for staggered text elements
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 100,
      },
    },
  };

  // Heart icon animation
  const heartAnimation: Variants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: [0, 1.2, 1],
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
    pulse: {
      scale: [1, 1.2, 1],
      transition: {
        duration: 1.2,
        repeat: Infinity,
        repeatType: 'reverse',
      },
    },
  };

  return (
    <motion.section
      className="mt-20 pt-4"
      id="contact"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.05 }}
      variants={sectionVariants}
    >
      <Toaster />

      {/* Thank you message dialog */}
      <Dialog open={showThankYouMessage} onOpenChange={setShowThankYouMessage}>
        <DialogContent className="sm:max-w-md">
          <motion.div
            variants={dialogContentVariants}
            initial="hidden"
            animate="visible"
          >
            <DialogHeader className="gap-2">
              <motion.div
                className="flex justify-center mb-4 text-primary"
                variants={heartAnimation}
                animate={showThankYouMessage ? ['visible', 'pulse'] : 'hidden'}
              >
                <HeartHandshake className="h-12 w-12 text-primary" />
              </motion.div>

              <motion.div variants={itemVariants}>
                <DialogTitle className="text-center text-2xl">
                  {t('thankYouTitle') || 'Thank you!'}
                </DialogTitle>
              </motion.div>

              <motion.div variants={itemVariants}>
                <DialogDescription className="text-center">
                  {t('thankYouMessage') ||
                    'Your message has been sent successfully. I will get back to you as soon as possible.'}
                </DialogDescription>
              </motion.div>
            </DialogHeader>

            <DialogFooter className="mt-6 sm:justify-center">
              <motion.div variants={itemVariants}>
                <Button
                  onClick={() => setShowThankYouMessage(false)}
                  className="min-w-[120px]"
                >
                  {t('close') || 'Close'}
                </Button>
              </motion.div>
            </DialogFooter>
          </motion.div>
        </DialogContent>
      </Dialog>

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
        <motion.div className="flex flex-col gap-6" variants={leftColVariants}>
          <motion.div
            className="bg-card rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow border border-border"
            variants={fadeInUpVariants}
            whileHover={{
              y: -3,
              boxShadow:
                '0 8px 20px -5px rgba(0,0,0,0.08), 0 6px 8px -6px rgba(0,0,0,0.08)',
            }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-1 text-foreground">
                  {t('email')}
                </h3>
                <p className="text-muted-foreground mb-3 break-all">
                  {contactInfo.email}
                </p>
                <Button
                  onClick={() => handleCopy(contactInfo.email, 'email')}
                  variant="link"
                  className="text-sm p-0! h-auto text-primary hover:text-primary/80"
                  aria-label={t('copyEmail')}
                >
                  <Copy className="h-4 w-4 mr-1.5" /> {t('copy')}
                </Button>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-card rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow border border-border"
            variants={fadeInUpVariants}
            whileHover={{
              y: -3,
              boxShadow:
                '0 8px 20px -5px rgba(0,0,0,0.08), 0 6px 8px -6px rgba(0,0,0,0.08)',
            }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <Phone className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-1 text-foreground">
                  {t('phone')}
                </h3>
                <p className="text-muted-foreground mb-3">
                  {contactInfo.phone}
                </p>
                <Button
                  onClick={() => handleCopy(contactInfo.phone, 'phone')}
                  variant="link"
                  className="text-sm p-0! h-auto text-primary hover:text-primary/80"
                  aria-label={t('copyPhone')}
                >
                  <Copy className="h-4 w-4 mr-1.5" /> {t('copy')}
                </Button>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-card rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow border border-border"
            variants={fadeInUpVariants}
            whileHover={{
              y: -3,
              boxShadow:
                '0 8px 20px -5px rgba(0,0,0,0.08), 0 6px 8px -6px rgba(0,0,0,0.08)',
            }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1 text-foreground">
                  {t('location')}
                </h3>
                <p className="text-muted-foreground">{contactInfo.location}</p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          className="bg-card rounded-lg p-6 shadow-md border border-border"
          variants={rightColVariants}
          whileHover={{
            boxShadow:
              '0 8px 20px -5px rgba(0,0,0,0.08), 0 6px 8px -6px rgba(0,0,0,0.08)',
          }}
          transition={{ duration: 0.3 }}
        >
          <h3 className="font-semibold text-lg mb-4 text-foreground">
            {t('sendMessage')}
          </h3>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium mb-1 text-foreground"
              >
                {t('name')}
              </label>
              <motion.div
                whileFocus={{ scale: 1.01 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
              >
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder={t('namePlaceholder')}
                  required
                />
              </motion.div>
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium mb-1 text-foreground"
              >
                {t('emailLabel')}
              </label>
              <motion.div
                whileFocus={{ scale: 1.01 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
              >
                <Input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder={t('emailPlaceholder')}
                  required
                />
              </motion.div>
            </div>
            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium mb-1 text-foreground"
              >
                {t('message')}
              </label>
              <motion.div
                whileFocus={{ scale: 1.01 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
              >
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4}
                  className="resize-none max-h-24"
                  placeholder={t('messagePlaceholder')}
                  required
                />
              </motion.div>
            </div>
            <motion.div
              whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
              whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
              className="mt-2"
            >
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {t('sending')}
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    {t('send')}
                  </>
                )}
              </Button>
            </motion.div>
          </form>
        </motion.div>
      </div>
    </motion.section>
  );
}

'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Copy, Check, Mail, Phone, MapPin, Send, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useState, FormEvent } from 'react';

export function ContactSection() {
  const t = useTranslations('Index.Contact');
  const [isSubmitting, setIsSubmitting] = useState(false);
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

      toast.success(t('messageSent'), {
        position: 'bottom-center',
        duration: 3000,
      });

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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 120,
        damping: 14,
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
        staggerChildren: 0.1,
        duration: 0.5,
        delayChildren: 0.1,
      },
    },
  };

  const titleVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  const descriptionVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        delay: 0.2,
        ease: 'easeOut',
      },
    },
  };

  const leftColVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
        when: 'beforeChildren',
        staggerChildren: 0.1,
      },
    },
  };

  const rightColVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <motion.section
      className="mt-20 pt-4"
      id="contact"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-200px', amount: 0.25 }}
      variants={sectionVariants}
    >
      <Toaster />

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
              y: -5,
              boxShadow:
                '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',
            }}
            transition={{ duration: 0.2 }}
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
              y: -5,
              boxShadow:
                '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',
            }}
            transition={{ duration: 0.2 }}
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
              y: -5,
              boxShadow:
                '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',
            }}
            transition={{ duration: 0.2 }}
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
              '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',
          }}
          transition={{ duration: 0.2 }}
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
              whileHover={{ scale: isSubmitting ? 1 : 1.03 }}
              whileTap={{ scale: isSubmitting ? 1 : 0.97 }}
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

'use client';

import { useState } from 'react';

import { useTranslations } from 'next-intl';

import { motion } from 'framer-motion';

import { Send, Loader2 } from 'lucide-react';

import { toast } from 'sonner';

import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

import { formInputFocusAnimation, submitButtonAnimation } from './animations';
import { ContactFormValues, contactFormSchema } from './schemas';

interface ContactFormProps {
  onSubmitSuccess: () => void;
}

export function ContactForm({ onSubmitSuccess }: ContactFormProps) {
  const t = useTranslations('Index.Contact');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    mode: 'onBlur',
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send message');
      }

      onSubmitSuccess();

      reset();
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

  const getErrorMessage = (fieldName: keyof ContactFormValues) => {
    if (!errors[fieldName]) return undefined;
    return t(errors[fieldName]?.message as string);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 flex-1"
    >
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium mb-1 text-foreground"
        >
          {t('name')}
        </label>
        <motion.div {...formInputFocusAnimation}>
          <Input
            id="name"
            {...register('name')}
            placeholder={t('namePlaceholder')}
            className={errors.name ? 'border-red-500' : ''}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'name-error' : undefined}
          />
          {errors.name && (
            <p id="name-error" className="text-red-500 text-sm mt-1">
              {getErrorMessage('name')}
            </p>
          )}
        </motion.div>
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium mb-1 text-foreground"
        >
          {t('emailLabel')}
        </label>
        <motion.div {...formInputFocusAnimation}>
          <Input
            type="email"
            id="email"
            {...register('email')}
            placeholder={t('emailPlaceholder')}
            className={errors.email ? 'border-red-500' : ''}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
          {errors.email && (
            <p id="email-error" className="text-red-500 text-sm mt-1">
              {getErrorMessage('email')}
            </p>
          )}
        </motion.div>
      </div>

      <div>
        <label
          htmlFor="message"
          className="block text-sm font-medium mb-1 text-foreground"
        >
          {t('message')}
        </label>

        <motion.div {...formInputFocusAnimation}>
          <Textarea
            id="message"
            {...register('message')}
            rows={4}
            className={`resize-none max-h-24 ${errors.message ? 'border-red-500' : ''}`}
            placeholder={t('messagePlaceholder')}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? 'message-error' : undefined}
          />
          {errors.message && (
            <p id="message-error" className="text-red-500 text-sm mt-1">
              {getErrorMessage('message')}
            </p>
          )}
        </motion.div>
      </div>

      <motion.div {...submitButtonAnimation(isSubmitting)} className="mt-auto">
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
  );
}

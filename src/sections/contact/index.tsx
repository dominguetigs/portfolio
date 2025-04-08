'use client';

import { useTranslations } from 'next-intl';
import { motion, Variants, AnimatePresence } from 'framer-motion';
import {
  Copy,
  Check,
  Mail,
  Phone,
  MapPin,
  Send,
  Loader2,
  HeartHandshake,
  Heart,
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
import { useState, FormEvent, useEffect } from 'react';

// Interface para os erros de formulário
interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

// Interface para compatibilidade com prefixos de navegador
interface WindowWithAudioContext extends Window {
  webkitAudioContext?: typeof AudioContext;
}

// Função para tocar um som suave de agradecimento
const playThankYouSound = () => {
  try {
    // Criação segura do contexto de áudio para navegadores modernos
    const AudioContextClass =
      window.AudioContext ||
      ((window as WindowWithAudioContext)
        .webkitAudioContext as typeof AudioContext);

    if (!AudioContextClass) {
      console.warn('Web Audio API não suportada neste navegador');
      return;
    }

    const audioCtx = new AudioContextClass();

    // Volume principal para fácil ajuste
    const masterVolume = 0.12;

    // Melodia tipo "Sino" - Uma melodia mais suave e calorosa
    // Simula um "carrilhão" ou sinos de agradecimento/gratidão
    const notes = [
      { freq: 392.0, duration: 0.15, when: 0.0 }, // G4 - Primeira nota
      { freq: 523.25, duration: 0.25, when: 0.15 }, // C5 - Segunda nota
      { freq: 659.25, duration: 0.3, when: 0.3 }, // E5 - Terceira nota
      { freq: 783.99, duration: 0.5, when: 0.45 }, // G5 - Nota final sustentada
    ];

    // Reproduzir as notas principais com timing mais preciso
    notes.forEach(note => {
      // Criar oscilador principal
      const oscillator = audioCtx.createOscillator();
      // Usando 'triangle' para um som mais caloroso como de sino
      oscillator.type = 'triangle';
      oscillator.frequency.value = note.freq;

      // Usar dois ganhos para controle fino de envelope
      const attackGain = audioCtx.createGain();
      const mainGain = audioCtx.createGain();

      // Conectar os nós de áudio
      oscillator.connect(attackGain);
      attackGain.connect(mainGain);
      mainGain.connect(audioCtx.destination);

      // Timing absoluto para maior precisão
      const startTime = audioCtx.currentTime + note.when;
      const releaseTime = startTime + note.duration;

      // Criar envelope ADSR suave
      mainGain.gain.value = 0;

      // Attack
      mainGain.gain.setValueAtTime(0, startTime);
      mainGain.gain.linearRampToValueAtTime(masterVolume, startTime + 0.04);

      // Decay & Sustain
      mainGain.gain.linearRampToValueAtTime(
        masterVolume * 0.8,
        startTime + 0.12,
      );

      // Release
      mainGain.gain.setValueAtTime(masterVolume * 0.8, releaseTime - 0.1);
      mainGain.gain.linearRampToValueAtTime(0, releaseTime);

      // Adicionar um leve vibrato para dar vida ao som
      const vibrato = audioCtx.createOscillator();
      vibrato.frequency.value = 5 + Math.random() * 2; // 5-7 Hz vibrato

      const vibratoGain = audioCtx.createGain();
      vibratoGain.gain.value = 3; // Sutileza do vibrato

      vibrato.connect(vibratoGain);
      vibratoGain.connect(oscillator.frequency);

      // Iniciar os osciladores
      oscillator.start(startTime);
      oscillator.stop(releaseTime + 0.1);

      vibrato.start(startTime);
      vibrato.stop(releaseTime + 0.1);

      // Adicionar harmônicos para um som mais rico
      if (note.when >= 0.3) {
        // Apenas para as últimas notas
        const harmonic = audioCtx.createOscillator();
        harmonic.type = 'sine';
        harmonic.frequency.value = note.freq * 1.5; // Harmônico uma quinta acima

        const harmonicGain = audioCtx.createGain();
        harmonicGain.gain.value = 0;

        harmonic.connect(harmonicGain);
        harmonicGain.connect(audioCtx.destination);

        harmonicGain.gain.setValueAtTime(0, startTime);
        harmonicGain.gain.linearRampToValueAtTime(
          masterVolume * 0.3,
          startTime + 0.05,
        );
        harmonicGain.gain.linearRampToValueAtTime(0, releaseTime);

        harmonic.start(startTime);
        harmonic.stop(releaseTime + 0.1);
      }
    });

    // Adicionar um brilho final com reverberação simulada
    setTimeout(() => {
      const shimmer = audioCtx.createOscillator();
      shimmer.type = 'sine';
      shimmer.frequency.value = 1046.5; // C6 - Nota aguda de "brilho"

      const shimmerGain = audioCtx.createGain();
      shimmerGain.gain.value = 0;

      shimmer.connect(shimmerGain);
      shimmerGain.connect(audioCtx.destination);

      const shimmerStart = audioCtx.currentTime;
      shimmerGain.gain.setValueAtTime(0, shimmerStart);
      shimmerGain.gain.linearRampToValueAtTime(
        masterVolume * 0.2,
        shimmerStart + 0.1,
      );
      shimmerGain.gain.exponentialRampToValueAtTime(0.001, shimmerStart + 1.2);

      shimmer.start(shimmerStart);
      shimmer.stop(shimmerStart + 1.3);
    }, 700);
  } catch (error) {
    console.warn('Não foi possível reproduzir som:', error);
  }
};

export function ContactSection() {
  const t = useTranslations('Index.Contact');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showThankYouMessage, setShowThankYouMessage] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    message: false,
  });

  // Referência para controlar quando o som deve ser reproduzido
  const [shouldPlaySound, setShouldPlaySound] = useState(false);

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

    // Marcar campo como tocado
    setTouched(prev => ({
      ...prev,
      [name]: true,
    }));

    // Validar o campo quando o usuário digita
    validateField(name, value);
  };

  // Função para validar um campo específico
  const validateField = (name: string, value: string) => {
    const fieldErrors: FormErrors = { ...errors };

    switch (name) {
      case 'name':
        if (!value.trim()) {
          fieldErrors.name = t('validation.nameRequired');
        } else {
          delete fieldErrors.name;
        }
        break;

      case 'email':
        if (!value.trim()) {
          fieldErrors.email = t('validation.emailRequired');
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          fieldErrors.email = t('validation.emailInvalid');
        } else {
          delete fieldErrors.email;
        }
        break;

      case 'message':
        if (!value.trim()) {
          fieldErrors.message = t('validation.messageRequired');
        } else if (value.trim().length < 10) {
          fieldErrors.message = t('validation.messageTooShort');
        } else {
          delete fieldErrors.message;
        }
        break;
    }

    setErrors(fieldErrors);
    return Object.keys(fieldErrors).length === 0;
  };

  // Função para validar todo o formulário
  const validateForm = () => {
    const fieldErrors: FormErrors = {};

    if (!formData.name.trim()) {
      fieldErrors.name = t('validation.nameRequired');
    }

    if (!formData.email.trim()) {
      fieldErrors.email = t('validation.emailRequired');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      fieldErrors.email = t('validation.emailInvalid');
    }

    if (!formData.message.trim()) {
      fieldErrors.message = t('validation.messageRequired');
    } else if (formData.message.trim().length < 10) {
      fieldErrors.message = t('validation.messageTooShort');
    }

    setErrors(fieldErrors);
    return Object.keys(fieldErrors).length === 0;
  };

  // Função para tratar o blur dos inputs
  const handleBlur = (field: string) => {
    setTouched(prev => ({
      ...prev,
      [field]: true,
    }));

    validateField(field, formData[field as keyof typeof formData]);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Marcar todos os campos como tocados
    setTouched({
      name: true,
      email: true,
      message: true,
    });

    // Validar o formulário antes de enviar
    if (!validateForm()) {
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

      // Permitir a reprodução do som
      setShouldPlaySound(true);

      // Show thank you message instead of toast
      setShowThankYouMessage(true);

      // Limpar o formulário
      setFormData({
        name: '',
        email: '',
        message: '',
      });

      // Resetar erros e estados de toque
      setErrors({});
      setTouched({
        name: false,
        email: false,
        message: false,
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
    hidden: { opacity: 0, y: 5 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
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
        staggerChildren: 0.08,
        duration: 0.5,
        delayChildren: 0.1,
      },
    },
  };

  const titleVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: 'easeOut',
      },
    },
  };

  const descriptionVariants = {
    hidden: { opacity: 0, scale: 0.99 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        delay: 0.1,
        ease: 'easeOut',
      },
    },
  };

  const leftColVariants = {
    hidden: { opacity: 0, x: -15 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 16,
        when: 'beforeChildren',
        staggerChildren: 0.08,
      },
    },
  };

  const rightColVariants = {
    hidden: { opacity: 0, x: 15 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 16,
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

  // Confetti hearts animation
  const confettiVariants: Variants = {
    hidden: {
      scale: 0,
      opacity: 0,
    },
    visible: i => ({
      scale: [0, 1, 0.8],
      opacity: [0, 1, 0],
      x: [0, (i % 2 === 0 ? 1 : -1) * (Math.random() * 80 + 30)],
      y: [0, -(Math.random() * 100 + 50)],
      rotate: [0, Math.random() * 360],
      transition: {
        duration: 1.5 + Math.random() * 0.8,
        ease: 'easeOut',
      },
    }),
  };

  // Array para gerar vários corações
  const heartsArray = Array.from({ length: 24 }, (_, i) => i);

  // Iniciar a animação e tocar som quando o diálogo é aberto
  useEffect(() => {
    if (showThankYouMessage) {
      setShowConfetti(true);

      // Tocar som de agradecimento se o formulário foi enviado com sucesso
      if (shouldPlaySound) {
        playThankYouSound();
      }
    } else {
      setShowConfetti(false);

      // Resetar o flag de som quando o diálogo for fechado
      if (shouldPlaySound) {
        setShouldPlaySound(false);
      }
    }
  }, [showThankYouMessage, shouldPlaySound]);

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
                className="flex justify-center mb-4 text-primary relative"
                variants={heartAnimation}
                animate={showThankYouMessage ? ['visible', 'pulse'] : 'hidden'}
              >
                <div className="bg-primary/30 p-4 rounded-full">
                  <HeartHandshake className="h-12 w-12 text-primary" />
                </div>

                {/* Confetti de corações */}
                <AnimatePresence>
                  {showConfetti && (
                    <>
                      {heartsArray.map(i => (
                        <motion.div
                          key={i}
                          custom={i}
                          variants={confettiVariants}
                          initial="hidden"
                          animate="visible"
                          exit="hidden"
                          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                        >
                          <Heart
                            className={`text-primary ${i % 4 === 0 ? 'h-2 w-2' : i % 4 === 1 ? 'h-3 w-3' : i % 4 === 2 ? 'h-4 w-4' : 'h-2.5 w-2.5'}`}
                            fill="currentColor"
                          />
                        </motion.div>
                      ))}
                    </>
                  )}
                </AnimatePresence>
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

            <DialogFooter className="mt-6 flex flex-row justify-center sm:justify-center">
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
            className="bg-card rounded-lg p-4 shadow-md transition-shadow border border-border"
            variants={fadeInUpVariants}
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
            className="bg-card rounded-lg p-4 shadow-md transition-shadow border border-border"
            variants={fadeInUpVariants}
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
            className="bg-card rounded-lg p-4 shadow-md transition-shadow border border-border"
            variants={fadeInUpVariants}
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
          className="bg-card rounded-lg p-4 shadow-md border border-border flex flex-col"
          variants={rightColVariants}
          transition={{ duration: 0.3 }}
        >
          <h3 className="font-semibold text-lg mb-4 text-foreground">
            {t('sendMessage')}
          </h3>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 flex-1">
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
                  onBlur={() => handleBlur('name')}
                  placeholder={t('namePlaceholder')}
                  className={
                    errors.name && touched.name ? 'border-red-500' : ''
                  }
                  aria-invalid={Boolean(errors.name && touched.name)}
                  aria-describedby="name-error"
                />
                {errors.name && touched.name && (
                  <p id="name-error" className="text-red-500 text-sm mt-1">
                    {errors.name}
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
                  onBlur={() => handleBlur('email')}
                  placeholder={t('emailPlaceholder')}
                  className={
                    errors.email && touched.email ? 'border-red-500' : ''
                  }
                  aria-invalid={Boolean(errors.email && touched.email)}
                  aria-describedby="email-error"
                />
                {errors.email && touched.email && (
                  <p id="email-error" className="text-red-500 text-sm mt-1">
                    {errors.email}
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
              <motion.div
                whileFocus={{ scale: 1.01 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
              >
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur('message')}
                  rows={4}
                  className={`resize-none max-h-24 ${errors.message && touched.message ? 'border-red-500' : ''}`}
                  placeholder={t('messagePlaceholder')}
                  aria-invalid={Boolean(errors.message && touched.message)}
                  aria-describedby="message-error"
                />
                {errors.message && touched.message && (
                  <p id="message-error" className="text-red-500 text-sm mt-1">
                    {errors.message}
                  </p>
                )}
              </motion.div>
            </div>
            <motion.div
              whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
              whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
              className="mt-auto"
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

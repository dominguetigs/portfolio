'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowDown, ArrowUp } from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';

interface HeroSectionProps {
  linkedin: string;
  github: string;
  twitter?: string;
  onScrollDown: () => void;
}

// Interface para os títulos com dados adicionais para animar
interface AnimatedTitle {
  text: string;
  color?: string;
  icon?: string;
}

export function HeroSection({
  linkedin,
  github,
  // twitter,
  onScrollDown,
}: HeroSectionProps) {
  const t = useTranslations('Index.Hero');

  // Array de textos relacionados à tecnologia, ciência, matemática e astronomia com cores temáticas
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const titles: AnimatedTitle[] = [
    { text: t('titles.main'), color: 'text-primary' }, // Usar o título fornecido como primeiro item
    { text: t('titles.software'), color: 'text-primary' },
    { text: t('titles.mechatronics'), color: 'text-primary' },
    { text: t('titles.web'), color: 'text-primary' },
    { text: t('titles.math'), color: 'text-primary' },
    { text: t('titles.tech'), color: 'text-primary' },
    { text: t('titles.data'), color: 'text-primary' },
    { text: t('titles.astronomy'), color: 'text-primary' },
    { text: t('titles.algorithms'), color: 'text-primary' },
    { text: t('titles.problems'), color: 'text-primary' },
  ];

  const [currentTitleIndex, setCurrentTitleIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(100);

  // Referência para controlar a animação de digitação
  const typingRef = useRef<NodeJS.Timeout | null>(null);

  const [isAtTop, setIsAtTop] = useState(true);

  // Function to handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      // Check if we're at the top of the page (with a small threshold)
      setIsAtTop(window.scrollY < 200);
    };

    // Initial check
    handleScroll();

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);

    // Clean up
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Function to scroll to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // Função para gerenciar o efeito de digitação
  useEffect(() => {
    const currentTitle = titles[currentTitleIndex].text;

    // Função para lidar com a animação de digitação/deleção
    const handleTyping = () => {
      if (!isDeleting) {
        // Digitando: adiciona um caractere ao texto exibido
        if (displayText.length < currentTitle.length) {
          setDisplayText(currentTitle.substring(0, displayText.length + 1));
          // Variação na velocidade de digitação para parecer mais natural
          setTypingSpeed(100 + Math.random() * 80);
        } else {
          // Texto completo, pausa antes de começar a deletar
          setTypingSpeed(2000); // Pausa mais longa ao término da digitação
          setIsDeleting(true);
        }
      } else {
        // Deletando: remove um caractere do texto exibido
        if (displayText.length > 0) {
          setDisplayText(currentTitle.substring(0, displayText.length - 1));
          // Deleção mais rápida que digitação
          setTypingSpeed(50 + Math.random() * 30);
        } else {
          // Texto deletado, avança para o próximo título
          setIsDeleting(false);
          setCurrentTitleIndex(prevIndex => (prevIndex + 1) % titles.length);
          setTypingSpeed(500); // Pequena pausa antes de começar o próximo título
        }
      }
    };

    // Limpa o timeout anterior e inicia um novo
    if (typingRef.current) {
      clearTimeout(typingRef.current);
    }
    typingRef.current = setTimeout(handleTyping, typingSpeed);

    // Limpa o timeout quando o componente for desmontado
    return () => {
      if (typingRef.current) {
        clearTimeout(typingRef.current);
      }
    };
  }, [displayText, isDeleting, currentTitleIndex, titles, typingSpeed]);

  useEffect(() => {
    // Adicionar a animação personalizada de bounce-up ao CSS
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes bounce-up {
        0%, 100% {
          transform: translateY(0);
        }
        50% {
          transform: translateY(-10px);
        }
      }
      .animate-bounce-up {
        animation: bounce-up 1s infinite;
      }
    `;
    document.head.appendChild(style);

    return () => {
      // Remover o estilo quando o componente for desmontado
      document.head.removeChild(style);
    };
  }, []);

  return (
    <>
      {/* Botão de scroll up fixo no rodapé alinhado à direita */}
      <AnimatePresence mode="wait">
        {!isAtTop && (
          <motion.div
            key="scroll-up-button"
            initial={{
              opacity: 0,
              scale: 1.2,
              y: 15,
              filter: 'blur(3px)',
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
              filter: 'blur(0px)',

              transition: {
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
              },
            }}
            exit={{
              opacity: 0,
              scale: 0.9,
              y: 10,
              filter: 'blur(2px)',

              transition: {
                duration: 0.4,
                ease: [0.22, 1, 0.36, 1],
              },
            }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Button
              size="icon"
              onClick={scrollToTop}
              className="rounded-full shadow-md animate-bounce-up"
            >
              <motion.div
                initial={{ rotate: 0 }}
                animate={{
                  rotate: [0, -8, 0, 8, 0],
                  transition: {
                    delay: 0.15,
                    duration: 0.5,
                    ease: 'easeInOut',
                  },
                }}
              >
                <ArrowUp className="h-6 w-6" />
              </motion.div>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <section className="min-h-[calc(100vh-56px)] flex flex-col items-center justify-center relative px-4 py-10 mt-[-24px]">
        <div className="text-center max-w-3xl mx-auto flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, type: 'spring' }}
              className="mb-6 relative"
            >
              <div className="w-48 h-48 mx-auto relative mb-6 overflow-hidden rounded-full border-4 border-primary/20 shadow-lg">
                <Image
                  src="/hero-profile.png"
                  alt={t('alt.profile')}
                  fill
                  sizes="(max-width: 768px) 100vw, 192px"
                  className="object-cover"
                  style={{
                    filter: 'contrast(1.05) saturate(1.1)',
                  }}
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent mix-blend-overlay"></div>
              </div>
              <div className="absolute -z-10 w-64 h-64 rounded-full blur-3xl bg-primary/10 opacity-60 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
            </motion.div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-2">
              {t('name')}
            </h1>
            <div className="h-9 md:h-10 flex justify-center items-center">
              <div className="text-xl md:text-2xl relative inline-flex min-h-10 items-center">
                <span
                  className={`${titles[currentTitleIndex].color} font-medium`}
                >
                  {displayText}
                </span>
                <motion.div
                  animate={{
                    opacity: [1, 0],
                    transition: {
                      repeat: Infinity,
                      duration: 0.6,
                      repeatType: 'reverse',
                    },
                  }}
                  className={`ml-1 h-[1.2em] w-[4px] ${titles[currentTitleIndex].color} bg-current inline-block`}
                ></motion.div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4 mb-8"
          >
            <p className="text-muted-foreground">{t('location')}</p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href={`mailto:${t('contact.email')}`}
                className="text-muted-foreground hover:text-foreground"
              >
                {t('contact.email')}
              </a>
              <span className="hidden sm:inline text-muted-foreground">•</span>
              <a
                href={`tel:${t('contact.phone')}`}
                className="text-muted-foreground hover:text-foreground"
              >
                {t('contact.phone')}
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-4 mb-16"
          >
            <a href={linkedin} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm">
                {t('social.linkedin')}
              </Button>
            </a>
            <a href={github} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm">
                {t('social.github')}
              </Button>
            </a>
          </motion.div>

          {/* Botão de scroll down apenas quando estiver na seção hero */}
          <AnimatePresence mode="wait">
            {isAtTop && (
              <motion.div
                key="scroll-down-button"
                initial={{
                  opacity: 0,
                  scale: 1.2,
                  y: -15,
                  filter: 'blur(3px)',
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: 0,
                  filter: 'blur(0px)',
                  transition: {
                    duration: 0.6,
                    delay: 0.2,
                    ease: [0.22, 1, 0.36, 1],
                  },
                }}
                exit={{
                  opacity: 0,
                  scale: 0.9,
                  y: -10,
                  filter: 'blur(2px)',
                  transition: {
                    duration: 0.4,
                    ease: [0.22, 1, 0.36, 1],
                  },
                }}
              >
                <Button
                  size="icon"
                  onClick={onScrollDown}
                  className="rounded-full animate-bounce shadow-md"
                >
                  <motion.div
                    initial={{ rotate: 0 }}
                    animate={{
                      rotate: [0, 8, 0, -8, 0],
                      transition: {
                        delay: 0.15,
                        duration: 0.5,
                        ease: 'easeInOut',
                      },
                    }}
                  >
                    <ArrowDown className="h-6 w-6" />
                  </motion.div>
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </>
  );
}

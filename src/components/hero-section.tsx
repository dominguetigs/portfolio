'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowDown, ArrowUp } from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';

interface HeroSectionProps {
  name: string;
  title: string; // Mantido para compatibilidade, mas agora será um dos textos da animação
  location: string;
  phone: string;
  email: string;
  linkedin: string;
  github: string;
  twitter: string;
  onScrollDown: () => void;
}

// Interface para os títulos com dados adicionais para animar
interface AnimatedTitle {
  text: string;
  color?: string;
  icon?: string;
}

export function HeroSection({
  name,
  title,
  location,
  phone,
  email,
  linkedin,
  github,
  // twitter,
  onScrollDown,
}: HeroSectionProps) {
  // Array de textos relacionados à tecnologia, ciência, matemática e astronomia com cores temáticas
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const titles: AnimatedTitle[] = [
    { text: title, color: 'text-primary' }, // Usar o título fornecido como primeiro item
    { text: 'Engenheiro de Software', color: 'text-primary' },
    { text: 'Engenheiro Mecatrônico', color: 'text-primary' },
    { text: 'Desenvolvedor Web', color: 'text-primary' },
    { text: 'Entusiasta em Matemática', color: 'text-primary' },
    { text: 'Pesquisador em Tecnologia', color: 'text-primary' },
    { text: 'Explorador de Dados', color: 'text-primary' },
    { text: 'Curioso em Astronomia', color: 'text-primary' },
    { text: 'Analista de Algoritmos', color: 'text-primary' },
    { text: 'Solucionador de Problemas', color: 'text-primary' },
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
      {!isAtTop && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-6 right-6 z-50"
        >
          <Button
            size="icon"
            onClick={scrollToTop}
            className="rounded-full shadow-md animate-bounce-up"
          >
            <ArrowUp className="h-6 w-6" />
          </Button>
        </motion.div>
      )}

      <section className="min-h-screen flex flex-col items-center justify-center relative px-4 py-10">
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
                  alt="Profile"
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
              {name}
            </h1>
            <div className="h-9 md:h-10 flex justify-center items-center">
              <div className="text-xl md:text-2xl relative inline-flex min-h-10">
                <span
                  className={`${titles[currentTitleIndex].color} font-medium`}
                >
                  {displayText}
                </span>
                <motion.span
                  animate={{
                    opacity: [1, 0],
                    transition: {
                      repeat: Infinity,
                      duration: 0.6,
                      repeatType: 'reverse',
                    },
                  }}
                  className={`ml-1 h-full w-[3px] ${titles[currentTitleIndex].color} bg-current`}
                ></motion.span>

                {/* Partículas de texto - efeito decorativo */}
                <AnimatePresence>
                  {!isDeleting &&
                    displayText.length ===
                      titles[currentTitleIndex].text.length && (
                      <motion.div
                        className="absolute top-0 left-0 w-full"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        {Array.from({ length: 3 }).map((_, i) => (
                          <motion.span
                            key={i}
                            className={`absolute text-xs ${titles[currentTitleIndex].color} opacity-50`}
                            initial={{
                              y: 0,
                              x: Math.random() * 100 - 50,
                              rotate: Math.random() * 360,
                              scale: 0,
                            }}
                            animate={{
                              y: -40 - Math.random() * 20,
                              x: Math.random() * 200 - 100,
                              rotate: Math.random() * 360,
                              scale: [0, 1, 0],
                              opacity: [0, 1, 0],
                            }}
                            transition={{
                              duration: 1.5 + Math.random() * 0.5,
                              ease: 'easeOut',
                            }}
                          >
                            {
                              ['✧', '✦', '★', '✴', '✺'][
                                Math.floor(Math.random() * 5)
                              ]
                            }
                          </motion.span>
                        ))}
                      </motion.div>
                    )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4 mb-8"
          >
            <p className="text-muted-foreground">{location}</p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href={`mailto:${email}`}
                className="text-muted-foreground hover:text-foreground"
              >
                {email}
              </a>
              <span className="hidden sm:inline text-muted-foreground">•</span>
              <a
                href={`tel:${phone}`}
                className="text-muted-foreground hover:text-foreground"
              >
                {phone}
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
                LinkedIn
              </Button>
            </a>
            <a href={github} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm">
                GitHub
              </Button>
            </a>
          </motion.div>

          {/* Botão de scroll down apenas quando estiver na seção hero */}
          {isAtTop && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <Button
                size="icon"
                onClick={onScrollDown}
                className="rounded-full animate-bounce shadow-md"
              >
                <ArrowDown className="h-6 w-6" />
              </Button>
            </motion.div>
          )}
        </div>
      </section>
    </>
  );
}

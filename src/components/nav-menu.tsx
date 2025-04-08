'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import {
  User,
  Code,
  Briefcase,
  GraduationCap,
  Globe,
  Rocket,
  MessageSquare,
  ArrowUp,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

import { throttle } from '@/utils/throttle';

// Mapeamento de ícones para cada seção
const sectionIcons: Record<string, React.ReactNode> = {
  about: <User className="h-4 w-4" />,
  skills: <Code className="h-4 w-4" />,
  projects: <Rocket className="h-4 w-4" />,
  experience: <Briefcase className="h-4 w-4" />,
  education: <GraduationCap className="h-4 w-4" />,
  languages: <Globe className="h-4 w-4" />,
  contact: <MessageSquare className="h-4 w-4" />,
};

// Define section IDs
const sectionIds = [
  'about',
  'skills',
  'projects',
  'experience',
  'education',
  'languages',
  'contact',
];

export function NavMenu() {
  const t = useTranslations('Index.Navigation');
  const [activeSection, setActiveSection] = useState('');
  const [userClicked, setUserClicked] = useState(false);
  const [showMenu, setShowMenu] = useState(true);
  const [showScrollTopButton, setShowScrollTopButton] = useState(false);
  const [mounted, setMounted] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const observersRef = useRef<Record<string, IntersectionObserver>>({});
  const activeSectionRef = useRef(activeSection);
  const userClickedRef = useRef(userClicked);

  // Get translated sections
  const sections = sectionIds.map(id => ({
    id,
    label: t(id),
  }));

  // Verificar se o componente está montado (cliente)
  useEffect(() => {
    setMounted(true);
    return () => {
      setMounted(false);
      // Limpar todos os observers quando o componente for desmontado
      Object.values(observersRef.current).forEach(observer =>
        observer.disconnect(),
      );
    };
  }, []);

  // Atualizar as refs quando os estados mudarem
  useEffect(() => {
    activeSectionRef.current = activeSection;
  }, [activeSection]);

  useEffect(() => {
    userClickedRef.current = userClicked;
  }, [userClicked]);

  // Configurar os observadores de interseção para cada seção
  useEffect(() => {
    if (!mounted) return;

    // Limpar observers existentes
    Object.values(observersRef.current).forEach(observer =>
      observer.disconnect(),
    );
    observersRef.current = {};

    // Criar novo conjunto de observers
    const sectionObservers: Record<string, IntersectionObserver> = {};
    const observerOptions = {
      rootMargin: '-10% 0px -80% 0px', // Dá destaque para elementos próximos ao topo da tela
      threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5], // Vários thresholds para detecção mais suave
    };

    // Callback para quando a interseção muda
    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      // Se o usuário acabou de clicar, não modifique a seção ativa com base no scroll
      if (userClickedRef.current) return;

      // Encontrar a entrada com maior proporção de interseção
      let maxRatio = -1;
      let maxSectionId = '';

      entries.forEach(entry => {
        const sectionId = entry.target.id;
        if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
          maxRatio = entry.intersectionRatio;
          maxSectionId = sectionId;
        }
      });

      // Se encontramos uma seção com interseção, ative-a
      if (maxSectionId && maxSectionId !== activeSectionRef.current) {
        setActiveSection(maxSectionId);
      }
    };

    // Criar um observer para cada seção
    sections.forEach(section => {
      const element = document.getElementById(section.id);
      if (element) {
        const observer = new IntersectionObserver(
          handleIntersection,
          observerOptions,
        );
        observer.observe(element);
        sectionObservers[section.id] = observer;
      }
    });

    observersRef.current = sectionObservers;

    return () => {
      // Limpar observers quando as seções mudarem
      Object.values(sectionObservers).forEach(observer =>
        observer.disconnect(),
      );
    };
  }, [mounted, userClicked]);

  // Function to scroll to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // Função para determinar a visibilidade do menu e botão de scroll to top com base na posição de scroll
  useEffect(() => {
    if (!mounted) return;

    // Referência para o timeout de debounce
    let debounceTimeout: NodeJS.Timeout | null = null;

    const checkScrollPosition = throttle(() => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const viewportHeight = window.innerHeight;
      const isAtHeroSection = scrollY < viewportHeight * 0.9;
      const shouldShowScrollButton = scrollY > 300;

      // Aplicar a mudança imediatamente
      setShowMenu(!isAtHeroSection);
      setShowScrollTopButton(shouldShowScrollButton);

      // Se tiver acontecido um scroll para o topo (ou próximo dele), fazer
      // uma verificação adicional após um pequeno intervalo
      if (scrollY < 100) {
        // Limpar qualquer timeout existente
        if (debounceTimeout) {
          clearTimeout(debounceTimeout);
        }

        // Verificar novamente após um curto período para confirmar
        debounceTimeout = setTimeout(() => {
          const currentScrollY =
            window.scrollY || document.documentElement.scrollTop;
          const currentIsAtHeroSection = currentScrollY < viewportHeight * 0.9;
          setShowMenu(!currentIsAtHeroSection);
          setShowScrollTopButton(currentScrollY > 300);
        }, 50);
      }
    }, 50); // Throttle mais rápido para resposta mais ágil

    // Verificar a posição inicial do scroll
    checkScrollPosition();

    // Registrar o event listener
    window.addEventListener('scroll', checkScrollPosition);

    // Limpar
    return () => {
      window.removeEventListener('scroll', checkScrollPosition);
      if (debounceTimeout) {
        clearTimeout(debounceTimeout);
      }
    };
  }, [mounted]);

  const scrollToSection = (id: string) => {
    if (!mounted) return;

    try {
      // Limpar qualquer timeout existente
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
      }

      // Marcar que o usuário clicou e atualizar a seção ativa
      setUserClicked(true);
      setActiveSection(id);

      // Obter o elemento da seção
      const sectionElement = document.getElementById(id);

      if (sectionElement) {
        // Procurar pelo título da seção com ID específico
        const titleId = `title-${id}`;
        const titleElement =
          document.getElementById(titleId) ||
          sectionElement.querySelector('h2') ||
          sectionElement.firstElementChild;

        const targetElement = titleElement || sectionElement;

        // Posição desejada do título na tela (em px a partir do topo)
        const desiredTopPosition = 50;

        // Calcular a posição de scroll para posicionar o elemento na posição desejada
        const rect = targetElement.getBoundingClientRect();
        const currentTopPosition = rect.top;
        const currentScrollPosition = window.scrollY;

        // Quanto precisamos rolar para que o elemento esteja na posição desejada
        const offsetPosition =
          currentScrollPosition + (currentTopPosition - desiredTopPosition);

        // Realizar o scroll
        window.scrollTo({
          top: Math.max(0, offsetPosition), // Evitar valores negativos
          behavior: 'smooth',
        });

        // Reativar a detecção de scroll após um período suficiente para a animação completar
        // e garantir que o usuário possa ver o resultado do clique
        timeoutRef.current = setTimeout(() => {
          // Verificar se o título está visível após o scroll e ajustar se necessário
          const newRect = targetElement.getBoundingClientRect();
          if (Math.abs(newRect.top - desiredTopPosition) > 20) {
            // Se a posição ainda estiver muito distante do desejado, fazer um ajuste final
            window.scrollBy({
              top: newRect.top - desiredTopPosition,
              behavior: 'smooth',
            });
          }

          // Usar um segundo timeout para desativar o userClicked após as animações
          clickTimeoutRef.current = setTimeout(() => {
            setUserClicked(false);
          }, 500); // Tempo extra após a animação de scroll
        }, 800); // Aguardar a animação de scroll
      }
    } catch (error) {
      console.error('Erro ao rolar para seção:', error);
      // Em caso de erro, garantir que o usuário não fique preso no estado de clique
      setUserClicked(false);
    }
  };

  // Se não estiver montado (renderização no servidor), não renderizar nada
  if (!mounted) return null;

  return (
    <>
      <AnimatePresence>
        {showMenu && (
          <>
            {/* Menu desktop (lateral) */}
            <div className="hidden lg:block">
              <motion.nav
                className="fixed top-1/2 -translate-y-1/2 z-50"
                style={{
                  left: `max(2rem, min(calc((100vw - min(64rem, 95vw)) / 2 / 2), 300px))`,
                }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{
                  duration: 0.5,
                  ease: 'easeInOut',
                }}
              >
                <div className="bg-card/80 backdrop-blur-sm border rounded-full shadow-sm p-2 flex flex-col gap-2">
                  {sections.map(section => (
                    <motion.button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={cn(
                        'relative rounded-full p-2 transition-colors flex items-center gap-2 group',
                        activeSection === section.id
                          ? 'text-primary-foreground font-medium'
                          : 'text-muted-foreground hover:text-foreground',
                      )}
                    >
                      {activeSection === section.id && (
                        <motion.div
                          layoutId="desktopNavIndicator"
                          className="absolute inset-0 rounded-full bg-primary"
                          transition={{
                            type: 'spring',
                            stiffness: 500,
                            damping: 30,
                          }}
                        />
                      )}
                      <span className="relative z-10">
                        {sectionIcons[section.id]}
                      </span>
                      <span className="absolute left-10 opacity-0 group-hover:opacity-100 transition-opacity bg-card/90 backdrop-blur-sm border rounded-md py-1 px-2 text-xs whitespace-nowrap shadow-sm text-foreground">
                        {section.label}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </motion.nav>
            </div>

            {/* Container para navegação mobile e botão de scroll */}
            <div className="lg:hidden">
              <div className="fixed bottom-4 left-0 right-0 z-50 flex justify-center">
                <motion.div
                  className="relative mx-auto"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{
                    duration: 0.5,
                    ease: 'easeInOut',
                  }}
                >
                  {/* Wrapper para centralizar o conjunto menu+botão */}
                  <div className="flex items-center">
                    {/* Menu de navegação mobile */}
                    <div className="bg-card/80 backdrop-blur-sm border rounded-full shadow-sm px-3 py-2 flex items-center gap-2">
                      {sections.map(section => (
                        <motion.button
                          key={section.id}
                          onClick={() => scrollToSection(section.id)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className={cn(
                            'relative rounded-full p-2 transition-colors',
                            activeSection === section.id
                              ? 'text-primary-foreground'
                              : 'text-muted-foreground hover:text-foreground',
                          )}
                        >
                          {activeSection === section.id && (
                            <motion.div
                              layoutId="mobileNavIndicator"
                              className="absolute inset-0 rounded-full bg-primary"
                              transition={{
                                type: 'spring',
                                stiffness: 500,
                                damping: 30,
                              }}
                            />
                          )}
                          <span className="relative z-10">
                            {sectionIcons[section.id] ||
                              section.id.charAt(0).toUpperCase()}
                          </span>
                        </motion.button>
                      ))}
                    </div>

                    {/* Botão de scroll to top (à direita) */}
                    <AnimatePresence>
                      {showScrollTopButton && (
                        <motion.div
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
                          className="ml-2"
                        >
                          <Button
                            size="icon"
                            onClick={scrollToTop}
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
                                  repeat: Infinity,
                                  repeatDelay: 3,
                                },
                              }}
                            >
                              <ArrowUp className="h-6 w-6" />
                            </motion.div>
                          </Button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              </div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

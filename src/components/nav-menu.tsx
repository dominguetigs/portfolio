'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { User, Code, Briefcase, GraduationCap, Globe } from 'lucide-react';

interface NavMenuProps {
  sections: { id: string; label: string }[];
}

// Mapeamento de ícones para cada seção
const sectionIcons: Record<string, React.ReactNode> = {
  about: <User className="h-4 w-4" />,
  skills: <Code className="h-4 w-4" />,
  experience: <Briefcase className="h-4 w-4" />,
  education: <GraduationCap className="h-4 w-4" />,
  languages: <Globe className="h-4 w-4" />,
};

// Função de throttle para limitar a frequência de chamadas de uma função
function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let lastCall = 0;
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      func(...args);
    }
  };
}

// Função de debounce para atrasar a execução de uma função
function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null;
  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
}

export function NavMenu({ sections }: NavMenuProps) {
  const [activeSection, setActiveSection] = useState('');
  const [userClicked, setUserClicked] = useState(false);
  const [showMenu, setShowMenu] = useState(true);
  const [mounted, setMounted] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const activeSectionRef = useRef(activeSection);

  // Verificar se o componente está montado (cliente)
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Atualizar a ref quando o estado mudar
  useEffect(() => {
    activeSectionRef.current = activeSection;
  }, [activeSection]);

  useEffect(() => {
    // Só executar no cliente após a montagem
    if (!mounted) return;

    // Função para determinar a visibilidade do menu
    const checkInitialScrollPosition = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const viewportHeight = window.innerHeight;
      const isAtHeroSection = scrollY < viewportHeight * 0.9;

      // Definir a visibilidade do menu com base na posição inicial
      setShowMenu(!isAtHeroSection);
    };

    // Verificar a posição inicial do scroll
    checkInitialScrollPosition();

    // Função para lidar com o scroll
    const handleScroll = () => {
      try {
        const scrollY = window.scrollY || document.documentElement.scrollTop;
        const viewportHeight = window.innerHeight;
        const scrollPosition = scrollY + 80; // Usar uma posição mais próxima ao topo da tela

        // Verificar se estamos na seção hero ou próximo do topo da página
        const isAtHeroSection = scrollY < viewportHeight * 0.9;

        // Atualizar a visibilidade do menu
        if (showMenu !== !isAtHeroSection) {
          setShowMenu(!isAtHeroSection);
        }

        // Se o usuário acabou de clicar, não modifique a seção ativa
        // mas ainda permite que o menu desapareça quando necessário
        if (userClicked) return;

        // Encontrar qual seção está visível na posição atual
        let currentSection = null;
        let minDistance = Infinity;

        // Para cada seção, calcular a distância entre o topo da seção e a posição de referência
        for (const section of sections) {
          const element = document.getElementById(section.id);

          if (element) {
            // Tentar encontrar o título da seção
            const titleId = `title-${section.label.toLowerCase().replace(/\s+/g, '-')}`;
            const titleElement =
              document.getElementById(titleId) ||
              element.querySelector('h2') ||
              element.firstElementChild;

            const targetElement = titleElement || element;
            const rect = targetElement.getBoundingClientRect();
            const elementTop = scrollY + rect.top;
            const distance = Math.abs(scrollPosition - elementTop);

            // A seção cuja distância do título ao topo da viewport é a menor
            if (distance < minDistance) {
              minDistance = distance;
              currentSection = section.id;
            }
          }
        }

        // Apenas atualizar se a seção ativa mudou
        if (currentSection && currentSection !== activeSectionRef.current) {
          setActiveSection(currentSection);
        }
      } catch (error) {
        console.error('Erro na detecção de scroll:', error);
      }
    };

    // Aplicar throttle e debounce à função de scroll
    const throttledHandleScroll = throttle(handleScroll, 50);

    // Debounce para atualização da visibilidade do menu
    const debouncedVisibilityUpdate = debounce(() => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const viewportHeight = window.innerHeight;
      const isAtHeroSection = scrollY < viewportHeight * 0.9;
      setShowMenu(!isAtHeroSection);
    }, 150);

    // Registrar os event listeners
    window.addEventListener('scroll', throttledHandleScroll);
    window.addEventListener('scroll', debouncedVisibilityUpdate);

    // Executar uma vez para definir a seção inicial
    setTimeout(handleScroll, 200);

    // Limpar
    return () => {
      window.removeEventListener('scroll', throttledHandleScroll);
      window.removeEventListener('scroll', debouncedVisibilityUpdate);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [sections, userClicked, showMenu, mounted]);

  const scrollToSection = (id: string) => {
    // Só executar no cliente após a montagem
    if (!mounted) return;

    try {
      // Marcar que o usuário clicou e atualizar a seção ativa
      setUserClicked(true);
      setActiveSection(id);

      // Limpar qualquer timeout existente
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Obter o elemento da seção
      const sectionElement = document.getElementById(id);

      if (sectionElement) {
        // Procurar pelo título da seção com ID específico
        const titleId = `title-${sections
          .find(s => s.id === id)
          ?.label.toLowerCase()
          .replace(/\s+/g, '-')}`;
        const titleElement =
          document.getElementById(titleId) ||
          sectionElement.querySelector('h2') ||
          sectionElement.firstElementChild;

        const targetElement = titleElement || sectionElement;

        // Posição desejada do título na tela (em px a partir do topo)
        const desiredTopPosition = 100;

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

        // Verificar se o título está visível após o scroll
        const checkTitleVisibility = () => {
          // Se o elemento não existir mais, retorne
          if (!targetElement) return;

          const newRect = targetElement.getBoundingClientRect();

          // Se o topo do elemento estiver fora da área visível, ajuste
          if (newRect.top < 30) {
            // Ajuste adicional para garantir que o título esteja visível
            window.scrollBy({
              top: newRect.top - desiredTopPosition,
              behavior: 'smooth',
            });
          } else if (newRect.top > 150) {
            // Se estiver muito abaixo, também ajustar
            window.scrollBy({
              top: newRect.top - desiredTopPosition,
              behavior: 'smooth',
            });
          }
        };

        // Reativar a detecção de scroll após a animação terminar e verificar visibilidade
        timeoutRef.current = setTimeout(() => {
          checkTitleVisibility();
          setTimeout(() => {
            setUserClicked(false);
          }, 300);
        }, 1000);
      }
    } catch (error) {
      console.error('Erro ao rolar para seção:', error);
      setUserClicked(false); // Garantir que o usuário possa tentar novamente
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
                className="fixed left-8 top-1/2 -translate-y-1/2 z-50"
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

            {/* Menu mobile (inferior com ícones) */}
            <div className="lg:hidden">
              <motion.nav
                className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{
                  duration: 0.5,
                  ease: 'easeInOut',
                }}
              >
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
              </motion.nav>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

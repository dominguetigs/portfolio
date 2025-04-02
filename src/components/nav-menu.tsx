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

export function NavMenu({ sections }: NavMenuProps) {
  const [activeSection, setActiveSection] = useState(sections[0]?.id);
  const [userClicked, setUserClicked] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
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

    // Função simplificada para determinar a seção mais visível
    const handleScroll = () => {
      // Se o usuário acabou de clicar, não modifique a seção ativa
      if (userClicked) return;

      try {
        // Posição da janela de visualização
        const scrollY = window.scrollY || document.documentElement.scrollTop;
        const viewportHeight = window.innerHeight;
        const scrollPosition = scrollY + viewportHeight / 4;

        // Verificar se estamos na seção hero ou próximo do topo da página
        // Usar uma abordagem mais agressiva para ocultar o menu no topo
        const isAtHeroSection = scrollY < viewportHeight * 0.9;

        // Atualizar a visibilidade do menu
        if (showMenu !== !isAtHeroSection) {
          setShowMenu(!isAtHeroSection);
        }

        // Encontrar qual seção está visível na posição atual
        let currentSection = null;

        // Percorrer as seções da última para a primeira
        for (let i = sections.length - 1; i >= 0; i--) {
          const section = sections[i];
          const element = document.getElementById(section.id);

          if (element) {
            const rect = element.getBoundingClientRect();
            const elementTop = scrollY + rect.top;
            const elementBottom = elementTop + rect.height;

            // Se a posição de rolagem está dentro desta seção
            if (
              scrollPosition >= elementTop &&
              scrollPosition <= elementBottom
            ) {
              currentSection = section.id;
              break;
            }
          }
        }

        // Se nenhuma seção foi encontrada, tente uma abordagem mais simples
        if (!currentSection) {
          for (const section of sections) {
            const element = document.getElementById(section.id);
            if (element) {
              const rect = element.getBoundingClientRect();
              // Se a seção estiver pelo menos parcialmente visível
              if (rect.top < viewportHeight && rect.bottom > 0) {
                currentSection = section.id;
                // Quanto mais centralizada a seção, maior a probabilidade de ser escolhida
                if (rect.top > 0 && rect.top < viewportHeight / 2) {
                  break;
                }
              }
            }
          }
        }

        // Se ainda não encontrou, use a primeira seção
        if (!currentSection && sections.length > 0) {
          currentSection = sections[0].id;
        }

        // Apenas atualizar se a seção ativa mudou
        if (currentSection && currentSection !== activeSectionRef.current) {
          setActiveSection(currentSection);
        }
      } catch (error) {
        console.error('Erro na detecção de scroll:', error);
      }
    };

    // Registrar o event listener
    window.addEventListener('scroll', handleScroll);

    // Executar uma vez para definir a seção inicial
    setTimeout(handleScroll, 200);

    // Limpar
    return () => {
      window.removeEventListener('scroll', handleScroll);
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
      setShowMenu(true); // Sempre mostrar o menu quando um item for clicado

      // Limpar qualquer timeout existente
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Rolar para a seção
      const element = document.getElementById(id);
      if (element) {
        const headerOffset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });

        // Reativar a detecção de scroll após a animação terminar
        timeoutRef.current = setTimeout(() => {
          setUserClicked(false);
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

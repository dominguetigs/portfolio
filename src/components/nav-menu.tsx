'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
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
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const activeSectionRef = useRef(activeSection);

  // Atualizar a ref quando o estado mudar
  useEffect(() => {
    activeSectionRef.current = activeSection;
  }, [activeSection]);

  useEffect(() => {
    // Função simplificada para determinar a seção mais visível
    const handleScroll = () => {
      // Se o usuário acabou de clicar, não modifique a seção ativa
      if (userClicked) return;

      // Posição da janela de visualização
      const scrollPosition = window.scrollY + window.innerHeight / 4;

      // Encontrar qual seção está visível na posição atual
      let currentSection = null;

      // Percorrer as seções da última para a primeira (para dar prioridade à que está mais abaixo quando há sobreposição)
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        const element = document.getElementById(section.id);

        if (element) {
          // Obter a posição e dimensões do elemento
          const rect = element.getBoundingClientRect();
          const elementTop = window.scrollY + rect.top;
          const elementBottom = elementTop + rect.height;

          // Se a posição de rolagem está dentro desta seção
          if (scrollPosition >= elementTop && scrollPosition <= elementBottom) {
            currentSection = section.id;
            break;
          }
        }
      }

      // Se nenhuma seção foi encontrada, use a primeira ou a última dependendo da posição
      if (!currentSection) {
        const firstElement = document.getElementById(sections[0]?.id);
        if (
          firstElement &&
          scrollPosition <
            firstElement.getBoundingClientRect().top + window.scrollY
        ) {
          currentSection = sections[0]?.id;
        } else {
          currentSection = sections[sections.length - 1]?.id;
        }
      }

      // Apenas atualizar se a seção ativa mudou
      if (currentSection && currentSection !== activeSectionRef.current) {
        setActiveSection(currentSection);
      }
    };

    // Registrar o event listener
    window.addEventListener('scroll', handleScroll);

    // Executar uma vez para definir a seção inicial
    handleScroll();

    // Limpar
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [sections, userClicked]); // Removendo activeSection das dependências

  const scrollToSection = (id: string) => {
    // Marcar que o usuário clicou e atualizar a seção ativa
    setUserClicked(true);
    setActiveSection(id);

    // Limpar qualquer timeout existente
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Rolar para a seção
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });

      // Reativar a detecção de scroll após a animação terminar
      timeoutRef.current = setTimeout(() => {
        setUserClicked(false);
      }, 1000);
    }
  };

  // Menu desktop (lateral)
  const DesktopMenu = (
    <div className="hidden md:block">
      <nav className="fixed left-8 top-1/2 -translate-y-1/2 z-50">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="bg-card/80 backdrop-blur-sm border rounded-lg shadow-sm p-2 flex flex-col gap-2">
            {sections.map(section => (
              <motion.button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  'relative rounded-lg px-3 py-2 text-sm transition-colors min-w-[120px] text-left flex items-center gap-2',
                  activeSection === section.id
                    ? 'text-primary-foreground font-medium'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {activeSection === section.id && (
                  <motion.div
                    layoutId="desktopNavIndicator"
                    className="absolute inset-0 rounded-lg bg-primary"
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
                <span className="relative z-10">{section.label}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </nav>
    </div>
  );

  // Menu mobile (inferior com ícones)
  const MobileMenu = (
    <div className="md:hidden">
      <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
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
        </motion.div>
      </nav>
    </div>
  );

  return (
    <>
      {DesktopMenu}
      {MobileMenu}
    </>
  );
}

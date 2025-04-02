'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface NavMenuProps {
  sections: { id: string; label: string }[];
}

export function NavMenu({ sections }: NavMenuProps) {
  const [activeSection, setActiveSection] = useState(sections[0]?.id);

  useEffect(() => {
    const handleScroll = () => {
      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (!element) continue;

        const rect = element.getBoundingClientRect();
        if (rect.top <= 100 && rect.bottom >= 100) {
          setActiveSection(section.id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: 'smooth',
      });
    }
  };

  return (
    <nav className="sticky top-4 z-50 py-2">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex justify-center"
      >
        <div className="bg-card border rounded-full shadow-sm px-4 py-2 flex gap-2">
          {sections.map(section => (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className={cn(
                'relative rounded-full px-3 py-1 text-sm transition-colors',
                activeSection === section.id
                  ? 'text-primary-foreground'
                  : 'hover:text-accent-foreground',
              )}
            >
              {activeSection === section.id && (
                <motion.div
                  layoutId="navIndicator"
                  className="absolute inset-0 rounded-full bg-primary"
                  transition={{ type: 'spring', duration: 0.6 }}
                />
              )}
              <span className="relative z-10">{section.label}</span>
            </button>
          ))}
        </div>
      </motion.div>
    </nav>
  );
}

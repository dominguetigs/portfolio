'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

export function GhibliBackground() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [previousTheme, setPreviousTheme] = useState<string | null>(null);

  // Only render the component client-side to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Rastrear o tema anterior para ajudar na transição
  useEffect(() => {
    if (mounted && theme) {
      // Guardar o tema anterior apenas quando já tivermos um tema e o componente estiver montado
      if (previousTheme !== theme) {
        setPreviousTheme(theme);
      }
    }
  }, [theme, mounted, previousTheme]);

  if (!mounted) return null;

  // Configurações para uma animação mais suave e sem atrasos
  const animationConfig = {
    initial: { opacity: 0, scale: 1.02, y: 20 },
    animate: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 3.5,
        ease: [0.25, 0.4, 0.3, 1],
      },
    },
    exit: { opacity: 0, scale: 0.98, y: -20 },
    transition: {
      opacity: { duration: 2.5, ease: [0.25, 0.4, 0.3, 1] },
      scale: { duration: 3.0, ease: [0.25, 0.4, 0.3, 1] },
      y: { duration: 3.0, ease: [0.25, 0.4, 0.3, 1] },
    },
  };

  return (
    <div className="fixed inset-0 w-full h-full -z-10 pointer-events-none overflow-hidden">
      {/* Container principal para ambos os backgrounds */}
      <div className="relative w-full h-full">
        {/* Layer para o tema atual */}
        <AnimatePresence mode="sync" initial={false}>
          <motion.div
            key={theme}
            initial={animationConfig.initial}
            animate={animationConfig.animate}
            exit={animationConfig.exit}
            transition={animationConfig.transition}
            className="absolute inset-0 w-full h-full"
          >
            {theme === 'dark' ? (
              <Image
                src="/bg-dark.png"
                alt="Night landscape background"
                fill
                priority
                className="object-cover opacity-60 transition-transform duration-[3500ms] will-change-transform hover:scale-[1.02]"
                style={{ objectPosition: '40% 20%' }}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
                quality={100}
              />
            ) : (
              <Image
                src="/bg-light.png"
                alt="Day landscape background"
                fill
                priority
                className="object-cover opacity-35 transition-transform duration-[3500ms] will-change-transform hover:scale-[1.02]"
                style={{ objectPosition: '40% 20%' }}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
                quality={100}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Gradient overlay com transição suave */}
      <motion.div
        key={`overlay-${theme}`}
        initial={{ opacity: 0.7 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2.0 }}
        className={`absolute inset-0 w-full h-full pointer-events-none ${
          theme === 'dark'
            ? 'bg-gradient-to-t from-background/90 via-background/40 to-transparent'
            : 'bg-gradient-to-t from-background/85 via-background/30 to-transparent'
        }`}
      />
    </div>
  );
}

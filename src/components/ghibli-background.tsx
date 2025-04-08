'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

export function GhibliBackground() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Only render the component client-side to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 w-full h-full -z-10 pointer-events-none overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={theme}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full h-full"
        >
          {theme === 'dark' ? (
            <Image
              src="/bg-dark.png"
              alt="Night landscape background"
              fill
              priority
              className="object-cover md:object-bottom opacity-40"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
              quality={100}
            />
          ) : (
            <Image
              src="/bg-light.png"
              alt="Day landscape background"
              fill
              priority
              className="object-cover md:object-bottom opacity-20"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
              quality={100}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Gradient overlay to ensure content readability */}
      <div
        className={`absolute inset-0 w-full h-full pointer-events-none ${
          theme === 'dark'
            ? 'bg-gradient-to-t from-background/90 via-background/40 to-transparent'
            : 'bg-gradient-to-t from-background/85 via-background/30 to-transparent'
        }`}
      />
    </div>
  );
}

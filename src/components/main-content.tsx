'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { SplashScreen } from './splash-screen';

interface MainContentProps {
  children: React.ReactNode;
}

export function MainContent({ children }: MainContentProps) {
  const [splashComplete, setSplashComplete] = useState(false);

  const handleSplashComplete = () => {
    setSplashComplete(true);
  };

  return (
    <>
      <SplashScreen onComplete={handleSplashComplete} />

      {/* Conteúdo principal - só é animado após o splash screen */}
      {splashComplete && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        >
          <div className="texture" />
          {children}
        </motion.div>
      )}
    </>
  );
}

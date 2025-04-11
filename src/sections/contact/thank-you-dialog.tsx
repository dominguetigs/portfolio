'use client';

import { useEffect, useState } from 'react';

import { useTranslations } from 'next-intl';

import { motion, AnimatePresence } from 'framer-motion';

import { HeartHandshake, Heart } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

import {
  dialogContentVariants,
  dialogItemVariants,
  heartAnimation,
  confettiVariants,
} from './animations';

interface ThankYouDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAnimationStart: () => void;
}

export function ThankYouDialog({
  isOpen,
  onClose,
  onAnimationStart,
}: ThankYouDialogProps) {
  const t = useTranslations('Index.Contact');
  const [showConfetti, setShowConfetti] = useState(false);

  const heartsArray = Array.from({ length: 24 }, (_, i) => i);

  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true);
      onAnimationStart();
    } else {
      setShowConfetti(false);
    }
  }, [isOpen, onAnimationStart]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <motion.div
          variants={dialogContentVariants}
          initial="hidden"
          animate="visible"
        >
          <DialogHeader className="gap-2">
            <motion.div
              className="flex justify-center mb-4 text-primary relative"
              variants={heartAnimation}
              animate={isOpen ? ['visible', 'pulse'] : 'hidden'}
            >
              <div className="bg-primary/30 p-4 rounded-full">
                <HeartHandshake className="h-12 w-12 text-primary" />
              </div>

              <AnimatePresence>
                {showConfetti && (
                  <>
                    {heartsArray.map(i => (
                      <motion.div
                        key={i}
                        custom={i}
                        variants={confettiVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                      >
                        <Heart
                          className={`text-primary ${i % 4 === 0 ? 'h-2 w-2' : i % 4 === 1 ? 'h-3 w-3' : i % 4 === 2 ? 'h-4 w-4' : 'h-2.5 w-2.5'}`}
                          fill="currentColor"
                        />
                      </motion.div>
                    ))}
                  </>
                )}
              </AnimatePresence>
            </motion.div>

            <motion.div variants={dialogItemVariants}>
              <DialogTitle className="text-center text-2xl">
                {t('thankYouTitle') || 'Thank you!'}
              </DialogTitle>
            </motion.div>

            <motion.div variants={dialogItemVariants}>
              <DialogDescription className="text-center">
                {t('thankYouMessage') ||
                  'Your message has been sent successfully. I will get back to you as soon as possible.'}
              </DialogDescription>
            </motion.div>
          </DialogHeader>

          <DialogFooter className="mt-6 flex flex-row justify-center sm:justify-center">
            <motion.div variants={dialogItemVariants}>
              <Button onClick={() => onClose()} className="min-w-[120px]">
                {t('close') || 'Close'}
              </Button>
            </motion.div>
          </DialogFooter>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}

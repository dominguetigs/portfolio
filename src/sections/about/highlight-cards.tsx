'use client';

import { useTranslations } from 'next-intl';

import { motion } from 'framer-motion';

import { Card, CardContent } from '@/components/ui/card';

import {
  highlightCardsContainerAnimation,
  createCardAnimation,
} from './animations';
import { HIGHLIGHT_CARDS } from './constants';

export function HighlightCards() {
  const t = useTranslations('Index.About');
  const highlights = HIGHLIGHT_CARDS(t);

  return (
    <motion.div
      className="col-span-1 md:col-span-3 mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4"
      {...highlightCardsContainerAnimation}
    >
      {highlights.map((card, index) => (
        <motion.div
          key={index}
          {...createCardAnimation(index)}
          className="h-full"
        >
          <Card className="hover:bg-card/80 transition-colors p-4 flex flex-col items-center text-center h-full">
            <CardContent className="p-0 flex flex-col items-center h-full">
              {card.icon}
              <h4 className="font-medium mb-2">{card.title}</h4>
              <p className="text-sm text-muted-foreground">
                {card.description}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}

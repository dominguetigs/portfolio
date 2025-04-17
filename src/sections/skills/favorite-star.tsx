'use client';

import { motion } from 'framer-motion';

import { Star } from 'lucide-react';

import { favoriteStarAnimation } from './animations';

interface FavoriteStarProps {
  isFavorite: boolean;
  inView: boolean;
  delay: number;
  index: number;
}

export function FavoriteStar({
  isFavorite,
  inView,
  delay,
  index,
}: FavoriteStarProps) {
  if (!isFavorite) {
    return null;
  }

  return (
    <motion.div
      className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full p-0.5 shadow-sm z-10"
      {...favoriteStarAnimation}
      animate={favoriteStarAnimation.animate(inView)}
      transition={favoriteStarAnimation.transition(delay, index)}
    >
      <Star className="h-3 w-3 fill-current" />
    </motion.div>
  );
}

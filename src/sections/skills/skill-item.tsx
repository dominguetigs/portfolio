'use client';

import { motion, AnimatePresence } from 'framer-motion';

import { useInView } from 'react-intersection-observer';

import { Card } from '@/components/ui/card';

import { skillItemAnimation, skillItemContainerAnimation } from './animations';
import { CategoryHeader } from './category-header';
import { SKILLS } from './constants';
import { SkillIcon } from './skill-icon';
import { SkillLevel } from './skill-level';
import { FavoriteStar } from './favorite-star';
import { Skill } from './types';
import { sortItems } from './utils';

interface SkillItemProps {
  label: string;
  category: string;
  items: string[];
  delay?: number;
}

export function SkillItem({
  label,
  category,
  items,
  delay = 0,
}: SkillItemProps) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
    rootMargin: '-20px 0px 0px 0px',
  });

  const skills = items.map(skill => SKILLS.find(s => s.id === skill));
  const sortedItems = sortItems(skills as Skill[]);

  return (
    <motion.div
      ref={ref}
      {...skillItemContainerAnimation}
      animate={skillItemContainerAnimation.animate(inView)}
      transition={skillItemContainerAnimation.transition(delay)}
      className="mb-8"
    >
      <CategoryHeader
        label={label}
        category={category}
        inView={inView}
        delay={delay}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
        <AnimatePresence>
          {sortedItems.map((item, index) => (
            <motion.div
              key={item.id}
              {...skillItemAnimation}
              animate={skillItemAnimation.animate(inView)}
              transition={skillItemAnimation.transition(delay, index)}
              layout
              className="relative"
            >
              <Card className="p-3 hover:shadow-md transition-all h-full overflow-hidden">
                <div className="flex items-center gap-3 relative">
                  <SkillIcon icon={item.icon} color={item.color} />

                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate pr-2">
                      {item.name}
                    </div>

                    <SkillLevel
                      level={item.level}
                      inView={inView}
                      delay={delay}
                      index={index}
                    />
                  </div>

                  <FavoriteStar
                    isFavorite={item.isFavorite}
                    inView={inView}
                    delay={delay}
                    index={index}
                  />
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

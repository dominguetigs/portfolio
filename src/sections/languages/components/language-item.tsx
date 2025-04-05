'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { BookOpen, Headphones, MessageSquare, Pencil } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { useTranslations } from 'next-intl';

interface LanguageItemProps {
  language: string;
  level: string;
  reading: number;
  writing: number;
  speaking: number;
  listening: number;
  flag: string;
  delay?: number;
}

const SkillBar = ({ level }: { level: number }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
    rootMargin: '-50px 0px',
  });

  return (
    <div ref={ref} className="flex gap-[2px] w-full">
      {[1, 2, 3, 4, 5].map(i => (
        <motion.div
          key={i}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={
            inView ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }
          }
          transition={{
            duration: 0.4,
            delay: 0.2 + i * 0.1,
            type: 'spring',
            stiffness: 200,
          }}
          className={`h-1.5 flex-1 rounded-full ${
            i <= level ? 'bg-primary' : 'bg-muted'
          }`}
          style={{ originX: 0 }}
        />
      ))}
    </div>
  );
};

export const LanguageItem = ({
  language,
  level,
  reading,
  writing,
  speaking,
  listening,
  flag,
  delay = 0,
}: LanguageItemProps) => {
  const t = useTranslations('Index.Languages');
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
    rootMargin: '-50px 0px',
  });

  const levels = [
    t('levels.a1'),
    t('levels.a2'),
    t('levels.b1'),
    t('levels.b2'),
    t('levels.c1c2'),
  ];

  return (
    <motion.div
      ref={ref}
      className="bg-card border border-border rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow"
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{
        duration: 0.5,
        delay,
        type: 'spring',
        stiffness: 100,
        damping: 12,
      }}
      whileHover={{ scale: 1.01 }}
    >
      <div className="flex flex-col md:flex-row md:items-center md:gap-6">
        {/* Cabeçalho com bandeira e nome */}
        <div className="flex items-center gap-3 mb-5 md:mb-0 md:min-w-[180px]">
          {flag && (
            <div className="relative h-10 w-10 overflow-hidden rounded-full border border-border shadow-sm flex-shrink-0">
              <Image
                src={flag}
                alt={t('flagAlt', { language })}
                fill
                sizes="40px"
                className="object-cover"
                priority
              />
            </div>
          )}
          <div>
            <h3 className="text-base sm:text-lg font-semibold">{language}</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">{level}</p>
          </div>
        </div>

        {/* Grid de habilidades */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-5 w-full md:grid-cols-4 md:gap-4">
          {/* Leitura */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 mb-1">
              <BookOpen className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-medium">{t('skills.reading')}</span>
            </div>
            <SkillBar level={reading} />
            <div className="text-[10px] text-muted-foreground">
              {levels[reading - 1]}
            </div>
          </div>

          {/* Escrita */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 mb-1">
              <Pencil className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-medium">{t('skills.writing')}</span>
            </div>
            <SkillBar level={writing} />
            <div className="text-[10px] text-muted-foreground">
              {levels[writing - 1]}
            </div>
          </div>

          {/* Fala */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 mb-1">
              <MessageSquare className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-medium">
                {t('skills.speaking')}
              </span>
            </div>
            <SkillBar level={speaking} />
            <div className="text-[10px] text-muted-foreground">
              {levels[speaking - 1]}
            </div>
          </div>

          {/* Compreensão */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 mb-1">
              <Headphones className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-medium">
                {t('skills.listening')}
              </span>
            </div>
            <SkillBar level={listening} />
            <div className="text-[10px] text-muted-foreground">
              {levels[listening - 1]}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

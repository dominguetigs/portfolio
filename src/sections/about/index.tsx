'use client';

import { motion } from 'framer-motion';
import {
  User,
  Briefcase,
  Users,
  Code2,
  GanttChart,
  Lightbulb,
} from 'lucide-react';
import { MotionSection, SectionHeader } from '@/sections/ui';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Card, CardContent } from '@/components/ui/card';

interface AboutSectionProps {
  aboutRef: React.RefObject<HTMLElement | null>;
}

export function AboutSection({ aboutRef }: AboutSectionProps) {
  const t = useTranslations('Index.About');

  return (
    <MotionSection id="about" ref={aboutRef} className="py-16">
      <SectionHeader title={t('title')} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <motion.div
          className="col-span-1"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{
            once: true,
            amount: 0.03,
            margin: '-30px 0px 0px 0px',
          }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          <div className="relative w-full aspect-square max-w-[300px] md:max-w-none mx-auto md:mx-0 overflow-hidden rounded-lg shadow-lg">
            <Image
              src="/hero-profile-2.png"
              alt={t('alt.profileImage')}
              fill
              className="object-cover object-center"
              sizes="(max-width: 768px) 300px, 100%"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          </div>
        </motion.div>

        <motion.div
          className="col-span-1 md:col-span-2 prose prose-lg dark:prose-invert"
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{
            once: true,
            amount: 0.03,
            margin: '-30px 0px 0px 0px',
          }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <h3 className="text-xl font-semibold flex items-center gap-2 mb-4">
            <User className="h-5 w-5 text-primary" />
            {t('sections.whoAmI.title')}
          </h3>
          <p className="mb-6 text-muted-foreground">
            {t('sections.whoAmI.content')}
          </p>

          <h3 className="text-xl font-semibold flex items-center gap-2 mb-4">
            <Briefcase className="h-5 w-5 text-primary" />
            {t('sections.sectorExperience.title')}
          </h3>
          <p className="mb-6 text-muted-foreground">
            {t('sections.sectorExperience.content')}
          </p>

          <h3 className="text-xl font-semibold flex items-center gap-2 mb-4">
            <Users className="h-5 w-5 text-primary" />
            {t('sections.leadershipDevelopment.title')}
          </h3>
          <p className="text-muted-foreground">
            {t('sections.leadershipDevelopment.content')}
          </p>
        </motion.div>

        <motion.div
          className="col-span-1 md:col-span-3 mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{
            once: true,
            amount: 0.03,
            margin: '-30px 0px 0px 0px',
          }}
          transition={{ duration: 0.4, delay: 0.25 }}
        >
          {[
            {
              icon: <Code2 className="h-8 w-8 text-primary mb-3" />,
              title: t('highlights.frontendSpecialist.title'),
              description: t('highlights.frontendSpecialist.description'),
            },
            {
              icon: <GanttChart className="h-8 w-8 text-primary mb-3" />,
              title: t('highlights.softwareArchitecture.title'),
              description: t('highlights.softwareArchitecture.description'),
            },
            {
              icon: <Users className="h-8 w-8 text-primary mb-3" />,
              title: t('highlights.technicalLeadership.title'),
              description: t('highlights.technicalLeadership.description'),
            },
            {
              icon: <Lightbulb className="h-8 w-8 text-primary mb-3" />,
              title: t('highlights.constantInnovation.title'),
              description: t('highlights.constantInnovation.description'),
            },
          ].map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, rotateY: 90 }}
              whileInView={{ opacity: 1, rotateY: 0 }}
              viewport={{
                once: true,
                amount: 0.3,
              }}
              transition={{
                duration: 0.6,
                delay: 0.3 + index * 0.15,
                type: 'spring',
                stiffness: 80,
              }}
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
      </div>
    </MotionSection>
  );
}

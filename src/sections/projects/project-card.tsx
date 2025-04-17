'use client';

import Image from 'next/image';

import { useTranslations } from 'next-intl';

import { motion } from 'framer-motion';

import { ExternalLink, Rocket } from 'lucide-react';

import { Badge } from '@/components/ui/badge';

import {
  projectCardAnimation,
  getProjectCardTransition,
  projectCardViewport,
} from './animations';
import { ProjectTypes, WorkProject, PersonalProject } from './types';
import { isPersonalProject, isWorkProject } from './utils';

export type ProjectCardProps = {
  project: WorkProject | PersonalProject;
  index: number;
  type: ProjectTypes;
};

export function ProjectCard({ project, index, type }: ProjectCardProps) {
  const t = useTranslations('Index.Projects');

  const { id, title, description, image, technologies } = project;

  const year = isWorkProject(project) ? project.year : undefined;
  const language = isPersonalProject(project) ? project.language : undefined;
  const url = isWorkProject(project) ? project.url : undefined;
  const repository = isPersonalProject(project)
    ? project.repository
    : undefined;
  const demo = isPersonalProject(project) ? project.demo : undefined;

  const handleClick = () => {
    if (type === 'work' && url) {
      window.open(url, '_blank');
    } else if (type === 'personal' && repository) {
      window.open(repository, '_blank');
    }
  };

  const handleDemoClick = (e: React.MouseEvent) => {
    if (demo) {
      e.stopPropagation();
      window.open(demo, '_blank');
    }
  };

  return (
    <motion.div
      key={id}
      className="group relative overflow-hidden rounded-xl border bg-card hover:bg-card/80 transition-colors shadow-sm cursor-pointer"
      {...projectCardAnimation}
      viewport={projectCardViewport}
      transition={getProjectCardTransition(index)}
      onClick={handleClick}
    >
      <div className="aspect-video w-full bg-muted/40 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 dark:from-black/70 to-black/10 dark:to-black/0 z-10"></div>
        {image ? (
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover object-top"
            sizes="(max-width: 768px) 100vw, 400px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Rocket className="w-20 h-20 text-primary/50 dark:text-primary/40" />
          </div>
        )}
        <div className="absolute bottom-2 left-2 z-20">
          <span className="bg-primary/90 text-primary-foreground text-xs px-2 py-1 rounded">
            {type === 'work' ? year : language}
          </span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground mb-2">{description}</p>
        <div className="flex flex-wrap gap-1">
          {technologies.map(tech => (
            <Badge key={`${id}-${tech}`} variant="secondary">
              {tech}
            </Badge>
          ))}
        </div>
      </div>

      {(type === 'work' || demo) && (
        <div className="absolute top-2 right-2 z-20">
          <span
            className="bg-background/80 backdrop-blur-sm text-foreground text-xs px-2 py-1 rounded flex items-center gap-1"
            onClick={type === 'personal' ? handleDemoClick : undefined}
          >
            <ExternalLink className="h-3 w-3" />
            {type === 'work' ? t('visit') : t('demo')}
          </span>
        </div>
      )}
    </motion.div>
  );
}

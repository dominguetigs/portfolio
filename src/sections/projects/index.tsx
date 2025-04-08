'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SectionHeader, MotionSection } from '@/sections/ui';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Github, Rocket, Briefcase, User } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

type Project = {
  id: string;
  title: string;
  description: string;
  repository?: string;
  demo?: string;
  image?: string;
  technologies: string[];
  language: string;
};

type WorkProject = {
  id: string;
  title: string;
  description: string;
  url: string;
  image?: string;
  technologies: string[];
  year: string;
};

export function ProjectsSection() {
  const t = useTranslations('Index.Projects');
  const [activeTab, setActiveTab] = useState('work');

  // Detectar se é dispositivo móvel
  useEffect(() => {
    const checkIfMobile = () => {
      // Esta função é usada apenas para adicionar/remover o event listener
      // e não precisa armazenar o estado em uma variável
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  const personalProjects: Project[] = [
    {
      id: 'task-management-app',
      title: 'Task Management App',
      description: t('projects.0.description'),
      repository: 'https://github.com/dominguetigs/task-management-app',
      demo: 'https://task-management-app-gt62.vercel.app/',
      image: '/projects/task-management-app.png',
      technologies: ['React', 'NextJS', 'TypeScript'],
      language: 'TypeScript',
    },
    {
      id: 'chat-bot-experiment',
      title: 'Chat Bot Experiment',
      description: t('projects.1.description'),
      repository: 'https://github.com/dominguetigs/chat-bot-experiment',
      demo: 'https://chat-bot-experiment.vercel.app/',
      image: '/projects/chat-bot-experiment.png',
      technologies: ['React', 'Vite', 'TypeScript'],
      language: 'TypeScript',
    },
    {
      id: 'js-funcional',
      title: 'JS Funcional',
      description: t('projects.2.description'),
      repository: 'https://github.com/dominguetigs/js-funcional',
      technologies: ['JavaScript', 'Functional'],
      language: 'JavaScript',
    },
    {
      id: 'ps-scheduler',
      title: 'PS Scheduler',
      description: t('projects.3.description'),
      repository: 'https://github.com/dominguetigs/ps-scheduler',
      demo: 'https://ps-scheduler.vercel.app/',
      image: '/projects/ps-scheduler.png',
      technologies: ['TypeScript', 'Web', 'Mobile'],
      language: 'TypeScript',
    },
    {
      id: 'snake-game',
      title: 'Snake Game',
      description: t('projects.4.description'),
      repository: 'https://github.com/dominguetigs/snake-game',
      image: '/projects/snake-game.png',
      technologies: ['JavaScript', 'Canvas', 'Game'],
      language: 'JavaScript',
    },
    {
      id: 'memory-game',
      title: 'Memory Game',
      description: t('projects.5.description'),
      repository: 'https://github.com/dominguetigs/memory-game',
      demo: 'https://dominguetigs.github.io/memory-game/src',
      image: '/projects/memory-game.webp',
      technologies: ['JavaScript', 'Webpack', 'Game'],
      language: 'JavaScript',
    },
  ];

  const workProjects: WorkProject[] = [
    {
      id: 'livemenu',
      title: 'Live Menu',
      description: t('workProjects.0.description'),
      url: 'https://beta.livemenu.app/pt/menu/5f7f5b92959b14b72ffc06bd',
      technologies: ['React', 'NextJS', 'TypeScript', 'Tailwind CSS'],
      year: '2023-2024',
    },
    {
      id: 'skeelo',
      title: t('workProjects.1.title'),
      description: t('workProjects.1.description'),
      url: 'https://loja.skeelo.com/',
      image: '/projects/work/skeelo-store.png',
      technologies: ['Shopify', 'JavaScript', 'SCSS'],
      year: '2022-2023',
    },
    {
      id: 'stf-jurisprudencia',
      title: t('workProjects.2.title'),
      description: t('workProjects.2.description'),
      url: 'https://jurisprudencia.stf.jus.br/pages/search?base=acordaos&sinonimo=true&plural=true&page=1&pageSize=10&queryString=STF&sort=_score&sortBy=desc',
      image: '/projects/work/stf.png',
      technologies: ['Angular', 'SCSS', 'TypeScript'],
      year: '2019-2020',
    },
  ];

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <MotionSection id="projects" className="py-16" delay={0.1}>
      <SectionHeader title={t('title')} />
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.03, margin: '-30px 0px 0px 0px' }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="mb-6"
      >
        <p className="text-muted-foreground">{t('description')}</p>
      </motion.div>

      <Tabs
        defaultValue="work"
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{
            once: true,
            amount: 0.03,
            margin: '-30px 0px 0px 0px',
          }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mb-8"
        >
          {/* Seletor para dispositivos móveis */}
          <div className="block sm:hidden w-full mb-4">
            <label className="block text-sm font-medium mb-2 text-muted-foreground">
              {t('workTab')}/{t('personalTab')}
            </label>
            <Select value={activeTab} onValueChange={handleTabChange}>
              <SelectTrigger className="w-1/2 bg-card">
                <SelectValue
                  placeholder={
                    activeTab === 'work' ? t('workTab') : t('personalTab')
                  }
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="work" className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-primary" />
                    <span>{t('workTab')}</span>
                  </div>
                </SelectItem>
                <SelectItem
                  value="personal"
                  className="flex items-center gap-2"
                >
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-primary" />
                    <span>{t('personalTab')}</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tabs para telas maiores que celulares pequenos */}
          <TabsList className="hidden sm:grid md:grid grid-cols-2 w-full max-w-md mx-auto">
            <TabsTrigger value="work" className="flex items-center gap-1.5">
              <Briefcase className="h-4 w-4" />
              <span>{t('workTab')}</span>
            </TabsTrigger>
            <TabsTrigger value="personal" className="flex items-center gap-1.5">
              <User className="h-4 w-4" />
              <span>{t('personalTab')}</span>
            </TabsTrigger>
          </TabsList>
        </motion.div>

        <TabsContent value="work" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workProjects.map((project, index) => (
              <motion.div
                key={project.id}
                className="group relative overflow-hidden rounded-xl border bg-card hover:bg-card/80 transition-colors shadow-sm cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{
                  once: true,
                  amount: 0.1,
                  margin: '-20px 0px 0px 0px',
                }}
                transition={{
                  duration: 0.3,
                  delay: 0.05 + index * 0.05,
                  ease: 'easeOut',
                }}
                onClick={() => window.open(project.url, '_blank')}
              >
                <div className="aspect-video w-full bg-muted/40 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 dark:from-black/70 to-black/10 dark:to-black/0 z-10"></div>
                  {project.image ? (
                    <Image
                      src={project.image}
                      alt={project.title}
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
                      {project.year}
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2">
                    {project.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {project.technologies.map(tech => (
                      <Badge key={`${project.id}-${tech}`} variant="secondary">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="absolute top-2 right-2 z-20">
                  <span className="bg-background/80 backdrop-blur-sm text-foreground text-xs px-2 py-1 rounded flex items-center gap-1">
                    <ExternalLink className="h-3 w-3" />
                    {t('visit')}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="personal" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {personalProjects.map((project, index) => (
              <motion.div
                key={project.id}
                className="group relative overflow-hidden rounded-xl border bg-card hover:bg-card/80 transition-colors shadow-sm cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{
                  once: true,
                  amount: 0.1,
                  margin: '-20px 0px 0px 0px',
                }}
                transition={{
                  duration: 0.3,
                  delay: 0.05 + index * 0.05,
                  ease: 'easeOut',
                }}
                onClick={() => window.open(project.repository, '_blank')}
              >
                <div className="aspect-video w-full bg-muted/40 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 dark:from-black/70 to-black/10 dark:to-black/0 z-10"></div>
                  {project.image ? (
                    <Image
                      src={project.image}
                      alt={project.title}
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
                      {project.language}
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2">
                    {project.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {project.technologies.map(tech => (
                      <Badge key={`${project.id}-${tech}`} variant="secondary">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>

                {project.demo && (
                  <div className="absolute top-2 right-2 z-20">
                    <span
                      className="bg-background/80 backdrop-blur-sm text-foreground text-xs px-2 py-1 rounded flex items-center gap-1 cursor-pointer"
                      onClick={e => {
                        e.stopPropagation();
                        window.open(project.demo, '_blank');
                      }}
                    >
                      <ExternalLink className="h-3 w-3" />
                      {t('demo')}
                    </span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          <motion.div
            className="mt-10 text-center"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.8 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <a
              href="https://github.com/dominguetigs?tab=repositories"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-5 py-2.5 rounded-full transition-all font-medium w-auto max-w-full overflow-hidden text-ellipsis whitespace-nowrap mx-auto"
            >
              <Github className="h-4 w-4 flex-shrink-0" />
              <span>{t('viewMore')}</span>
              <ExternalLink className="h-3 w-3 flex-shrink-0" />
            </a>
          </motion.div>
        </TabsContent>
      </Tabs>
    </MotionSection>
  );
}

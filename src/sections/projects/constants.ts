import { TranslationFunction } from '@/types';

import { PersonalProject, WorkProject } from './types';

export const PERSONAL_PROJECTS = (
  t: TranslationFunction,
): PersonalProject[] => [
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

export const WORK_PROJECTS = (t: TranslationFunction): WorkProject[] => [
  {
    id: 'livemenu',
    title: 'Live Menu',
    description: t('workProjects.0.description'),
    url: 'https://beta.livemenu.app/pt/menu/5f7f5b92959b14b72ffc06bd',
    image: '/projects/work/livemenu.png',
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

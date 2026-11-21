import type { IconType } from 'react-icons';
import {
  SiAngular,
  SiCss3,
  SiCypress,
  SiGit,
  SiGo,
  SiHtml5,
  SiJavascript,
  SiJest,
  SiNextdotjs,
  SiNodedotjs,
  SiOpengl,
  SiReact,
  SiSupabase,
  SiSwift,
  SiTailwindcss,
  SiThreedotjs,
  SiTypescript,
} from 'react-icons/si';

import type { PlantKind } from './plant-art';

export type GardenSkill = {
  name: string;
  icon: IconType;
  plant: PlantKind;
};

/** What Gustavo uses every day: grown plants. */
export const HARVEST: GardenSkill[] = [
  { name: 'TypeScript', icon: SiTypescript, plant: 'tomato' },
  { name: 'React', icon: SiReact, plant: 'sunflower' },
  { name: 'Next.js', icon: SiNextdotjs, plant: 'herb' },
  { name: 'Angular', icon: SiAngular, plant: 'daisy' },
  { name: 'JavaScript', icon: SiJavascript, plant: 'wheat' },
  { name: 'Node.js', icon: SiNodedotjs, plant: 'lettuce' },
  { name: 'HTML', icon: SiHtml5, plant: 'daisy' },
  { name: 'CSS', icon: SiCss3, plant: 'herb' },
  { name: 'Tailwind CSS', icon: SiTailwindcss, plant: 'lettuce' },
  { name: 'Jest', icon: SiJest, plant: 'tomato' },
  { name: 'Cypress', icon: SiCypress, plant: 'wheat' },
  { name: 'Git', icon: SiGit, plant: 'sunflower' },
];

/** What he is going deeper into: seedlings. */
export const SPROUTING: GardenSkill[] = [
  { name: 'three.js', icon: SiThreedotjs, plant: 'seedling' },
  { name: 'React Three Fiber', icon: SiReact, plant: 'seedling' },
  { name: 'GLSL', icon: SiOpengl, plant: 'seedling' },
  { name: 'Supabase', icon: SiSupabase, plant: 'seedling' },
  { name: 'Swift', icon: SiSwift, plant: 'seedling' },
  { name: 'Go', icon: SiGo, plant: 'seedling' },
];

/** Everything else he has worked with: the seed packet. */
export const SEEDS = [
  'Angular Material',
  'AngularJS',
  'RxJS',
  'NgRx',
  'Redux',
  'Zustand',
  'Vue.js',
  'Svelte',
  'jQuery',
  'Sass',
  'Less',
  'Styled Components',
  'CSS Modules',
  'Chakra UI',
  'Bootstrap',
  'Ionic',
  'Shopify',
  'Python',
  'Elixir',
  'Shell Script',
  'REST',
  'GraphQL',
  'Socket.io',
  'Firebase',
  'MongoDB',
  'MySQL',
  'PostgreSQL',
  'SQLite',
  'Elasticsearch',
  'React Testing Library',
  'Karma',
  'Protractor',
  'Webpack',
  'Vite',
  'Babel',
  'Gulp',
  'Grunt',
  'Docker',
  'AWS',
  'Google Cloud',
  'Vercel',
  'Azure DevOps',
  'GitHub',
  'Bitbucket',
  'Sentry',
  'Datadog',
  'New Relic',
  'Linux',
  'Scrum',
];

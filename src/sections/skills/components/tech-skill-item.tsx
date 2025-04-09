'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { useInView } from 'react-intersection-observer';
import {
  Code,
  CodeSquare,
  Layout,
  Server,
  Database,
  PenTool,
  Smartphone,
  Cloud,
  CheckSquare,
  Package,
  Globe,
  Terminal,
  Star,
  GitBranch,
  ListChecks,
  Monitor,
  Activity,
  Store,
} from 'lucide-react';
import {
  SiHtml5,
  SiCss3,
  SiJavascript,
  SiNextdotjs,
  SiAngular,
  SiVuedotjs,
  SiTailwindcss,
  SiBootstrap,
  SiSass,
  SiLess,
  SiChakraui,
  SiStyledcomponents,
  SiTypescript,
  SiElixir,
  SiGo,
  SiSocketdotio,
  SiJest,
  SiCypress,
  SiWebpack,
  SiGulp,
  SiGrunt,
  SiMysql,
  SiPostgresql,
  SiMongodb,
  SiFirebase,
  SiIonic,
  SiSwift,
  SiAmazon,
  SiVercel,
  SiJquery,
  SiGit,
  SiGithub,
  SiNpm,
  SiYarn,
  SiJira,
  SiGraphql,
  SiShopify,
  SiReact,
  SiNodedotjs,
  SiBower,
  SiProtractor,
  SiBabel,
  SiDocker,
  SiVite,
  SiTrello,
  SiSqlite,
  SiPnpm,
  SiGooglecloud,
  SiBitbucket,
  SiRedux,
  SiLinux,
  SiSentry,
  SiDatadog,
  SiElasticsearch,
  SiNgrx,
  SiApple,
  SiNewrelic,
  SiSvelte,
} from 'react-icons/si';
import { cn } from '@/lib/utils';

// Componente personalizado para o ícone do Python com as cores originais
const PythonIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 128 128"
    className={className}
  >
    <linearGradient
      id="python-original-a"
      gradientUnits="userSpaceOnUse"
      x1="70.252"
      y1="1237.476"
      x2="170.659"
      y2="1151.089"
      gradientTransform="matrix(.563 0 0 -.568 -29.215 707.817)"
    >
      <stop offset="0" stopColor="#5A9FD4" />
      <stop offset="1" stopColor="#306998" />
    </linearGradient>
    <linearGradient
      id="python-original-b"
      gradientUnits="userSpaceOnUse"
      x1="209.474"
      y1="1098.811"
      x2="173.62"
      y2="1149.537"
      gradientTransform="matrix(.563 0 0 -.568 -29.215 707.817)"
    >
      <stop offset="0" stopColor="#FFD43B" />
      <stop offset="1" stopColor="#FFE873" />
    </linearGradient>
    <path
      fill="url(#python-original-a)"
      d="M63.391 1.988c-4.222.02-8.252.379-11.8 1.007-10.45 1.846-12.346 5.71-12.346 12.837v9.411h24.693v3.137H29.977c-7.176 0-13.46 4.313-15.426 12.521-2.268 9.405-2.368 15.275 0 25.096 1.755 7.311 5.947 12.519 13.124 12.519h8.491V67.234c0-8.151 7.051-15.34 15.426-15.34h24.665c6.866 0 12.346-5.654 12.346-12.548V15.833c0-6.693-5.646-11.72-12.346-12.837-4.244-.706-8.645-1.027-12.866-1.008zM50.037 9.557c2.55 0 4.634 2.117 4.634 4.721 0 2.593-2.083 4.69-4.634 4.69-2.56 0-4.633-2.097-4.633-4.69-.001-2.604 2.073-4.721 4.633-4.721z"
      transform="translate(0 10.26)"
    />
    <path
      fill="url(#python-original-b)"
      d="M91.682 28.38v10.966c0 8.5-7.208 15.655-15.426 15.655H51.591c-6.756 0-12.346 5.783-12.346 12.549v23.515c0 6.691 5.818 10.628 12.346 12.547 7.816 2.297 15.312 2.713 24.665 0 6.216-1.801 12.346-5.423 12.346-12.547v-9.412H63.938v-3.138h37.012c7.176 0 9.852-5.005 12.348-12.519 2.578-7.735 2.467-15.174 0-25.096-1.774-7.145-5.161-12.521-12.348-12.521h-9.268zM77.809 87.927c2.561 0 4.634 2.097 4.634 4.692 0 2.602-2.074 4.719-4.634 4.719-2.55 0-4.633-2.117-4.633-4.719 0-2.595 2.083-4.692 4.633-4.692z"
      transform="translate(0 10.26)"
    />
    <path
      opacity=".444"
      fill="url(#python-original-a)"
      d="M63.391 1.988c-4.222.02-8.252.379-11.8 1.007-10.45 1.846-12.346 5.71-12.346 12.837v9.411h24.693v3.137H29.977c-7.176 0-13.46 4.313-15.426 12.521-2.268 9.405-2.368 15.275 0 25.096 1.755 7.311 5.947 12.519 13.124 12.519h8.491V67.234c0-8.151 7.051-15.34 15.426-15.34h24.665c6.866 0 12.346-5.654 12.346-12.548V15.833c0-6.693-5.646-11.72-12.346-12.837-4.244-.706-8.645-1.027-12.866-1.008zM50.037 9.557c2.55 0 4.634 2.117 4.634 4.721 0 2.593-2.083 4.69-4.634 4.69-2.56 0-4.633-2.097-4.633-4.69-.001-2.604 2.073-4.721 4.633-4.721z"
      transform="translate(0 10.26)"
    />
  </svg>
);

// Mapeamento de tecnologias para seus respectivos ícones
const techIcons: Record<string, React.ReactNode> = {
  // Frontend
  'Vanilla JavaScript': <SiJavascript className="h-5 w-5" />,
  JQuery: <SiJquery className="h-5 w-5" />,
  Bootstrap: <SiBootstrap className="h-5 w-5" />,
  Html5: <SiHtml5 className="h-5 w-5" />,
  Css3: <SiCss3 className="h-5 w-5" />,
  AngularJS: <SiAngular className="h-5 w-5" />,
  Angular: <SiAngular className="h-5 w-5" />,
  'Angular Material': <SiAngular className="h-5 w-5" />,
  RxJS: <Code className="h-5 w-5" />,
  ReactJS: <SiReact className="h-5 w-5" />,
  'Next.js': <SiNextdotjs className="h-5 w-5" />,
  'Styled Components': <SiStyledcomponents className="h-5 w-5" />,
  'Css Modules': <SiCss3 className="h-5 w-5" />,
  ChakraUI: <SiChakraui className="h-5 w-5" />,
  VueJS: <SiVuedotjs className="h-5 w-5" />,
  Svelte: <SiSvelte className="h-5 w-5" />,
  Tailwind: <SiTailwindcss className="h-5 w-5" />,
  Shopify: <SiShopify className="h-5 w-5" />,
  Redux: <SiRedux className="h-5 w-5" />,
  Zustand: <Store className="h-5 w-5" />,
  Ngrx: <SiNgrx className="h-5 w-5" />,

  // Transpiladores/Linguagens
  Less: <SiLess className="h-5 w-5" />,
  Sass: <SiSass className="h-5 w-5" />,
  JavaScript: <SiJavascript className="h-5 w-5" />,
  TypeScript: <SiTypescript className="h-5 w-5" />,
  ShellScript: <Terminal className="h-5 w-5" />,

  // Sistemas Operacionais
  Linux: <SiLinux className="h-5 w-5" />,
  Windows: <Monitor className="h-5 w-5" />,
  Mac: <SiApple className="h-5 w-5" />,

  // Backend
  NodeJS: <SiNodedotjs className="h-5 w-5" />,
  Python: <PythonIcon className="h-5 w-5" />,
  Elixir: <SiElixir className="h-5 w-5" />,
  Go: <SiGo className="h-5 w-5" />,

  // Websockets
  'Socket.Io': <SiSocketdotio className="h-5 w-5" />,

  // Testes
  Jest: <SiJest className="h-5 w-5" />,
  Cypress: <SiCypress className="h-5 w-5" />,
  Karma: <CheckSquare className="h-5 w-5" />,
  Protractor: <SiProtractor className="h-5 w-5" />,
  'React Testing Library': <SiReact className="h-5 w-5" />,

  // Monitoramento
  Sentry: <SiSentry className="h-5 w-5" />,
  'New Relic': <SiNewrelic className="h-5 w-5" />,
  Datadog: <SiDatadog className="h-5 w-5" />,

  // Task Mng.
  Babel: <SiBabel className="h-5 w-5" />,
  Gulp: <SiGulp className="h-5 w-5" />,
  Grunt: <SiGrunt className="h-5 w-5" />,
  Webpack: <SiWebpack className="h-5 w-5" />,
  Vite: <SiVite className="h-5 w-5" />,

  // Pkg Mng.
  Pnpm: <SiPnpm className="h-5 w-5" />,
  Npm: <SiNpm className="h-5 w-5" />,
  Yarn: <SiYarn className="h-5 w-5" />,
  Bower: <SiBower className="h-5 w-5" />,

  // Database
  MySQL: <SiMysql className="h-5 w-5" />,
  Postgres: <SiPostgresql className="h-5 w-5" />,
  MongoDB: <SiMongodb className="h-5 w-5" />,
  'Firebase Realtime DB': <SiFirebase className="h-5 w-5" />,
  SQLite: <SiSqlite className="h-5 w-5" />,
  ElasticSearch: <SiElasticsearch className="h-5 w-5" />,

  // Mobile
  Ionic: <SiIonic className="h-5 w-5" />,
  Swift: <SiSwift className="h-5 w-5" />,

  // Infraestrutura
  AWS: <SiAmazon className="h-5 w-5" />,
  Firebase: <SiFirebase className="h-5 w-5" />,
  Vercel: <SiVercel className="h-5 w-5" />,
  Docker: <SiDocker className="h-5 w-5" />,
  'Google Cloud': <SiGooglecloud className="h-5 w-5" />,
  Bitbucket: <SiBitbucket className="h-5 w-5" />,
  'Azure DevOps': <Cloud className="h-5 w-5" />,

  // ALM
  Git: <SiGit className="h-5 w-5" />,
  GitHub: <SiGithub className="h-5 w-5" />,
  GitFlow: <GitBranch className="h-5 w-5" />,
  Jira: <SiJira className="h-5 w-5" />,
  Trello: <SiTrello className="h-5 w-5" />,

  // Outros
  GraphQL: <SiGraphql className="h-5 w-5" />,
};

// Nível de habilidade para cada tecnologia (1-5)
const techSkillLevels: Record<string, number> = {
  // Frontend (exemplos)
  'Vanilla JavaScript': 5,
  JQuery: 4,
  Bootstrap: 4,
  Html5: 5,
  Css3: 5,
  AngularJS: 4,
  Angular: 5,
  'Angular Material': 4,
  RxJS: 3,
  ReactJS: 5,
  'Next.js': 4,
  'Styled Components': 4,
  'Css Modules': 5,
  ChakraUI: 5,
  VueJS: 3,
  Svelte: 3,
  Tailwind: 5,
  Shopify: 3,
  Redux: 4,
  Zustand: 4,
  Ngrx: 3,

  // Transpiladores/Linguagens
  Less: 4,
  Sass: 5,
  JavaScript: 5,
  TypeScript: 5,
  ShellScript: 3,

  // Sistemas Operacionais
  Linux: 5,
  Windows: 4,
  Mac: 5,

  // Backend
  NodeJS: 4,
  Python: 3,
  Elixir: 2,
  Go: 1,

  // Websockets
  'Socket.Io': 4,

  // Testes
  Protractor: 4,
  Karma: 4,
  Cypress: 4,
  Jest: 5,
  'React Testing Library': 4,

  // Monitoramento
  Sentry: 4,
  'New Relic': 2,
  Datadog: 2,

  // Task Mng.
  Babel: 5,
  Gulp: 4,
  Grunt: 3,
  Webpack: 5,
  Vite: 4,

  // Pkg Mng.
  Bower: 4,
  Npm: 5,
  Yarn: 5,
  Pnpm: 5,

  // Database
  MySQL: 4,
  Postgres: 2,
  MongoDB: 3,
  'Firebase:Realtime Database': 4,
  SQLite: 5,
  ElasticSearch: 3,

  // Mobile
  Ionic: 2,
  Swift: 1,

  // Infraestrutura
  AWS: 3,
  Firebase: 4,
  Vercel: 4,
  Docker: 3,
  'Azure DevOps': 2,
  'Google Cloud': 2,
  Bitbucket: 4,

  // ALM
  Jira: 5,
  Trello: 4,

  // Controle de Versão e Gestão
  Git: 5,
  GitFlow: 5,
  GitHub: 5,
  Scrum: 5,
  Kanban: 4,
  GraphQL: 2,
};

// Lista de tecnologias favoritas (que terão estrela)
const favoriteSkills = [
  'ReactJS',
  'Next.js',
  'Tailwind',
  'Sass',
  'ChakraUI',
  'JavaScript',
  'TypeScript',
  'Swift',
  'NodeJS',
  'MySQL',
  'Vercel',
  'Git',
  'GitHub',
  'Scrum',
  'GraphQL',
  'Html5',
  'Css3',
  'Vanilla JavaScript',
  'Jest',
  'Cypress',
  'Babel',
  'Webpack',
  'Npm',
  'Yarn',
  'Jira',
  'Docker',
  'Vite',
  'SQLite',
  'Pnpm',
  'Zustand',
  'Sentry',
  'Mac',
  'Linux',
];

// Mapeamento de cores para tecnologias
const techColors: Record<string, string> = {
  // Frontend
  Html5: 'text-html5',
  Css3: 'text-css3',
  'Vanilla JavaScript': 'text-javascript',
  JavaScript: 'text-javascript',
  TypeScript: 'text-typescript',
  ReactJS: 'text-reactjs',
  'Next.js': 'text-nextjs dark:text-nextjs-light',
  VueJS: 'text-vuejs',
  Svelte: 'text-svelte',
  Angular: 'text-angular',
  AngularJS: 'text-angularjs',
  'Angular Material': 'text-angular-material',
  RxJS: 'text-rxjs',

  // Estilização
  Tailwind: 'text-tailwind',
  Bootstrap: 'text-bootstrap',
  Sass: 'text-sass',
  Less: 'text-less dark:text-less-light',
  'Styled Components': 'text-styled-components',
  ChakraUI: 'text-chakraui',

  // Sistemas Operacionais
  Linux: 'text-linux dark:text-linux-light',
  Windows: 'text-windows',
  Mac: 'text-mac',

  // Backend
  NodeJS: 'text-nodejs',
  Python: 'text-python',
  Elixir: 'text-elixir',
  Go: 'text-go',
  ShellScript: 'text-shellscript dark:text-shellscript-light',

  // Monitoramento
  Sentry: 'text-sentry dark:text-sentry-light',
  'New Relic': 'text-new-relic',
  Datadog: 'text-datadog',

  // Databases
  MySQL: 'text-mysql',
  Postgres: 'text-postgres',
  MongoDB: 'text-mongodb',
  'Firebase Realtime DB': 'text-firebase',
  SQLite: 'text-sqlite',
  ElasticSearch: 'text-destructive',

  // Ferramentas
  Git: 'text-git',
  GitHub: 'text-github dark:text-github-light',
  Webpack: 'text-webpack',
  'Socket.Io': 'text-socketio dark:text-socketio-light',
  Babel: 'text-babel',
  Bower: 'text-bower',
  Jest: 'text-jest',
  Cypress: 'text-cypress dark:text-cypress-light',
  Gulp: 'text-gulp',
  Grunt: 'text-grunt',
  Pnpm: 'text-pnpm',
  Npm: 'text-npm',
  Yarn: 'text-yarn',
  Jira: 'text-jira',
  Trello: 'text-trello',
  Vite: 'text-vite',

  // State Management
  Redux: 'text-redux',
  Ngrx: 'text-ngrx',
  Zustand: 'text-zustand dark:text-zustand-light',

  // Infraestrutura
  AWS: 'text-aws',
  Firebase: 'text-firebase',
  Vercel: 'text-vercel dark:text-vercel-light',
  'React Testing Library': 'text-react-testing-library',
  Karma: 'text-karma',
  Protractor: 'text-protractor',
  Docker: 'text-docker',
  'Azure DevOps': 'text-azure',
  'Google Cloud': 'text-googlecloud',
  Bitbucket: 'text-bitbucket',

  Swift: 'text-swift',
  Ionic: 'text-ionic',
  'CSS Modules': 'text-css-modules',
  GitFlow: 'text-git',

  // Outros
  Shopify: 'text-shopify',
  GraphQL: 'text-graphql',
  JQuery: 'text-jquery',
};

// Mapeamento de ícones para cada categoria
const categoryIcons: Record<string, React.ReactNode> = {
  core: <Code className="h-5 w-5" />,
  frameworks: <Layout className="h-5 w-5" />,
  ui: <PenTool className="h-5 w-5" />,
  mobile: <Smartphone className="h-5 w-5" />,
  ecommerceCms: <Layout className="h-5 w-5" />,
  stateManagement: <Activity className="h-5 w-5" />,
  operatingSystems: <Monitor className="h-5 w-5" />,
  monitoring: <Activity className="h-5 w-5" />,

  programmingLanguages: <CodeSquare className="h-5 w-5" />,

  backendTechnologies: <Server className="h-5 w-5" />,
  communication: <Globe className="h-5 w-5" />,

  databases: <Database className="h-5 w-5" />,

  testing: <CheckSquare className="h-5 w-5" />,
  build: <Terminal className="h-5 w-5" />,
  packageManagers: <Package className="h-5 w-5" />,
  devops: <Cloud className="h-5 w-5" />,
  projectManagement: <CheckSquare className="h-5 w-5" />,
  agileMethodologies: <ListChecks className="h-5 w-5" />,
};

interface TechSkillItemProps {
  label: string;
  category: string;
  items: string[];
  delay?: number;
}

export function TechSkillItem({
  label,
  category,
  items,
  delay = 0,
}: TechSkillItemProps) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
    rootMargin: '-20px 0px 0px 0px',
  });

  // Função para ordenar os itens colocando favoritos primeiro, e depois por nível de habilidade
  const sortedItems = [...items].sort((a, b) => {
    // Primeiro, verificar se os itens são favoritos
    const aIsFavorite = favoriteSkills.includes(a);
    const bIsFavorite = favoriteSkills.includes(b);

    // Se um é favorito e o outro não, o favorito vem primeiro
    if (aIsFavorite && !bIsFavorite) return -1;
    if (!aIsFavorite && bIsFavorite) return 1;

    // Se ambos são favoritos ou ambos não são, ordena por nível de habilidade
    return (techSkillLevels[b] || 3) - (techSkillLevels[a] || 3);
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay }}
      className="mb-8"
    >
      <motion.div
        className="flex items-center gap-2 mb-4"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5, delay: delay + 0.1 }}
      >
        {categoryIcons[category] && (
          <motion.span
            className="text-primary"
            whileHover={{ scale: 1.2, rotate: 5 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
          >
            {categoryIcons[category]}
          </motion.span>
        )}
        <h3 className="text-lg font-semibold">{label}</h3>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
        <AnimatePresence>
          {sortedItems.map((item, index) => (
            <motion.div
              key={item}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={
                inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }
              }
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{
                duration: 0.3,
                delay: inView ? delay + index * 0.08 : 0,
                type: 'spring',
                stiffness: 200,
              }}
              whileHover={{
                scale: 1.03,
                y: -5,
                transition: {
                  type: 'spring',
                  stiffness: 300,
                  damping: 15,
                  mass: 0.8,
                },
              }}
              whileTap={{ scale: 0.98 }}
              layout
              className="relative"
            >
              <Card className="p-3 hover:shadow-md transition-all h-full overflow-hidden">
                <div className="flex items-center gap-3 relative">
                  <motion.div
                    className="text-primary flex-shrink-0"
                    whileHover={{
                      scale: 1.3,
                      rotate: 5,
                      transition: {
                        type: 'spring',
                        stiffness: 400,
                        damping: 5,
                      },
                    }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <div
                      className={cn(
                        'fill-current',
                        techColors[item] || 'text-primary',
                      )}
                    >
                      {techIcons[item] || <Code className="h-5 w-5" />}
                    </div>
                  </motion.div>

                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate pr-2">
                      {item}
                    </div>
                    <div className="flex gap-1 mt-1.5">
                      {[1, 2, 3, 4, 5].map(i => (
                        <motion.div
                          key={i}
                          initial={{ scale: 0, opacity: 0 }}
                          animate={
                            inView
                              ? { scale: 1, opacity: 1 }
                              : { scale: 0, opacity: 0 }
                          }
                          transition={{
                            delay: inView ? delay + index * 0.08 + i * 0.05 : 0,
                            duration: 0.3,
                          }}
                          className={`w-3 h-1.5 rounded-full ${
                            i <= (techSkillLevels[item] || 3)
                              ? 'bg-primary'
                              : 'bg-muted'
                          }`}
                        ></motion.div>
                      ))}
                    </div>
                  </div>

                  {favoriteSkills.includes(item) && (
                    <motion.div
                      className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full p-0.5 shadow-sm z-10"
                      initial={{ scale: 0 }}
                      animate={inView ? { scale: 1 } : { scale: 0 }}
                      transition={{
                        delay: inView ? delay + index * 0.08 + 0.2 : 0,
                        type: 'spring',
                        stiffness: 300,
                      }}
                    >
                      <Star className="h-3 w-3 fill-current" />
                    </motion.div>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

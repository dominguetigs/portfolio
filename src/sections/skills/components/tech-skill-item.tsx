'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { useInView } from 'react-intersection-observer';
import {
  Code,
  CodeSquare,
  FileCode,
  Layout,
  Server,
  Database,
  PenTool,
  Smartphone,
  Cloud,
  CheckSquare,
  Package,
  GitBranch,
  Globe,
  Terminal,
  BoxIcon,
  Star,
  Wrench,
} from 'lucide-react';

// Mapeamento de ícones para cada categoria
const categoryIcons: Record<string, React.ReactNode> = {
  Frontend: <Layout className="h-5 w-5" />,
  Transpiladores: <CodeSquare className="h-5 w-5" />,
  Backend: <Server className="h-5 w-5" />,
  Websockets: <Globe className="h-5 w-5" />,
  Testes: <CheckSquare className="h-5 w-5" />,
  'Task Mng.': <Terminal className="h-5 w-5" />,
  'Pkg Mng.': <Package className="h-5 w-5" />,
  Database: <Database className="h-5 w-5" />,
  Mobile: <Smartphone className="h-5 w-5" />,
  Infraestrutura: <Cloud className="h-5 w-5" />,
  ALM: <GitBranch className="h-5 w-5" />,
  'Build & Bundlers': <Terminal className="h-5 w-5" />,
  'Gerenciadores de Pacotes': <Package className="h-5 w-5" />,
  'DevOps & CI/CD': <Cloud className="h-5 w-5" />,
  'Gestão de Projetos': <CheckSquare className="h-5 w-5" />,
  'Tecnologias Backend': <Server className="h-5 w-5" />,
  Comunicação: <Globe className="h-5 w-5" />,
  'Bancos de Dados': <Database className="h-5 w-5" />,
  'UI & Estilização': <PenTool className="h-5 w-5" />,
  'Frameworks & Bibliotecas': <Layout className="h-5 w-5" />,
  Core: <Code className="h-5 w-5" />,
  'Linguagens de Programação': <CodeSquare className="h-5 w-5" />,
  Ferramentas: <Wrench className="h-5 w-5" />,
  'E-commerce/CMS': <Layout className="h-5 w-5" />,
};

// Mapeamento de tecnologias para seus respectivos ícones
const techIcons: Record<string, React.ReactNode> = {
  // Frontend
  'Vanilla JavaScript': <FileCode className="h-5 w-5" />,
  JQuery: <Code className="h-5 w-5" />,
  Bootstrap: <Layout className="h-5 w-5" />,
  Html5: <FileCode className="h-5 w-5" />,
  Css3: <PenTool className="h-5 w-5" />,
  AngularJS: <Code className="h-5 w-5" />,
  Angular: <Code className="h-5 w-5" />,
  'Angular Material': <Layout className="h-5 w-5" />,
  RxJS: <CodeSquare className="h-5 w-5" />,
  ReactJS: <CodeSquare className="h-5 w-5" />,
  Next: <Layout className="h-5 w-5" />,
  'Styled Components': <PenTool className="h-5 w-5" />,
  'Css Modules': <PenTool className="h-5 w-5" />,
  ChakraUI: <Layout className="h-5 w-5" />,
  VueJS: <CodeSquare className="h-5 w-5" />,
  Tailwind: <PenTool className="h-5 w-5" />,
  Shopify: <Layout className="h-5 w-5" />,

  // Transpiladores
  Less: <CodeSquare className="h-5 w-5" />,
  Sass: <CodeSquare className="h-5 w-5" />,
  Typescript: <CodeSquare className="h-5 w-5" />,

  // Backend
  NodeJS: <Server className="h-5 w-5" />,
  Python: <FileCode className="h-5 w-5" />,
  Elixir: <FileCode className="h-5 w-5" />,

  // Websockets
  'Socket.Io': <Globe className="h-5 w-5" />,

  // Testes
  Protractor: <CheckSquare className="h-5 w-5" />,
  Karma: <CheckSquare className="h-5 w-5" />,
  Cypress: <CheckSquare className="h-5 w-5" />,
  Jest: <CheckSquare className="h-5 w-5" />,

  // Task Mng.
  Gulp: <Terminal className="h-5 w-5" />,
  Grunt: <Terminal className="h-5 w-5" />,
  Webpack: <BoxIcon className="h-5 w-5" />,

  // Pkg Mng.
  Bower: <Package className="h-5 w-5" />,
  Npm: <Package className="h-5 w-5" />,
  Yarn: <Package className="h-5 w-5" />,

  // Database
  MySQL: <Database className="h-5 w-5" />,
  Postgres: <Database className="h-5 w-5" />,
  MongoDB: <Database className="h-5 w-5" />,
  'Firebase:Realtime Database': <Database className="h-5 w-5" />,

  // Mobile
  'Ionic 4': <Smartphone className="h-5 w-5" />,

  // Infraestrutura
  AWS: <Cloud className="h-5 w-5" />,
  Firebase: <Cloud className="h-5 w-5" />,
  Vercel: <Cloud className="h-5 w-5" />,

  // ALM
  VSTS: <GitBranch className="h-5 w-5" />,
  Jira: <CheckSquare className="h-5 w-5" />,
};

// Nível de habilidade para cada tecnologia (1-5)
const techSkillLevels: Record<string, number> = {
  // Frontend (exemplos)
  'Vanilla JavaScript': 5,
  JQuery: 4,
  Bootstrap: 4,
  Html5: 5,
  Css3: 5,
  AngularJS: 3,
  Angular: 5,
  'Angular Material': 3,
  RxJS: 3,
  ReactJS: 5,
  'Next.js': 4,
  'Styled Components': 4,
  'Css Modules': 5,
  ChakraUI: 5,
  VueJS: 3,
  Tailwind: 5,
  Shopify: 3,

  // Transpiladores/Linguagens
  Less: 4,
  Sass: 5,
  JavaScript: 5,
  TypeScript: 5,

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

  // Task Mng.
  Gulp: 4,
  Grunt: 3,
  Webpack: 5,

  // Pkg Mng.
  Bower: 4,
  Npm: 5,
  Yarn: 5,

  // Database
  MySQL: 4,
  Postgres: 2,
  MongoDB: 3,
  'Firebase:Realtime Database': 4,

  // Mobile
  Ionic: 2,
  Swift: 1,

  // Infraestrutura
  AWS: 3,
  Firebase: 4,
  Vercel: 4,

  // ALM
  VSTS: 4,
  Jira: 5,

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
  'Webpack',
  'Npm',
  'Yarn',
  'Jira',
];

interface TechSkillItemProps {
  label: string;
  items: string[];
  delay?: number;
}

export function TechSkillItem({ label, items, delay = 0 }: TechSkillItemProps) {
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
        {categoryIcons[label] && (
          <motion.span
            className="text-primary"
            whileHover={{ scale: 1.2, rotate: 5 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
          >
            {categoryIcons[label]}
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
                boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.1)',
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
                    {techIcons[item] || <Code className="h-5 w-5" />}
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

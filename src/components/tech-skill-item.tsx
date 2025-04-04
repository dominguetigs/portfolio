'use client';

import { motion } from 'framer-motion';
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
  AngularJS: 5,
  Angular: 5,
  'Angular Material': 5,
  RxJS: 5,
  ReactJS: 5,
  Next: 4,
  'Styled Components': 4,
  'Css Modules': 4,
  ChakraUI: 3,
  VueJS: 3,
  Tailwind: 5,

  // Transpiladores
  Less: 4,
  Sass: 5,
  Typescript: 5,

  // Backend
  NodeJS: 4,
  Python: 3,
  Elixir: 2,

  // Websockets
  'Socket.Io': 4,

  // Testes
  Protractor: 4,
  Karma: 4,
  Cypress: 4,
  Jest: 5,

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
  Postgres: 3,
  MongoDB: 3,
  'Firebase:Realtime Database': 4,

  // Mobile
  Ionic: 2,

  // Infraestrutura
  AWS: 3,
  Firebase: 4,
  Vercel: 4,

  // ALM
  VSTS: 4,
  Jira: 5,
};

interface TechSkillItemProps {
  label: string;
  items: string[];
  delay?: number;
}

export function TechSkillItem({ label, items, delay = 0 }: TechSkillItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay }}
      className="mb-8"
    >
      <div className="flex items-center gap-2 mb-3">
        {categoryIcons[label] && (
          <span className="text-primary">{categoryIcons[label]}</span>
        )}
        <h3 className="text-lg font-semibold">{label}</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: delay + index * 0.05 }}
            className="bg-card border rounded-lg p-3 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-primary">
                {techIcons[item] || <Code className="h-5 w-5" />}
              </span>
              <span className="font-medium">{item}</span>
            </div>

            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map(i => (
                <div
                  key={i}
                  className={`w-5 h-2 rounded-full ${
                    i <= (techSkillLevels[item] || 3)
                      ? 'bg-primary'
                      : 'bg-muted'
                  }`}
                ></div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

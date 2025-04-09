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

// Componente personalizado para o ícone do RxJS com as cores originais
const RxJSIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 283.5 283.5"
    className={className}
  >
    <defs>
      <linearGradient
        id="rxjs-gradient-1"
        x1="53.489"
        y1="247.701"
        x2="177.925"
        y2="115.323"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0" stopColor="#E01D84" />
        <stop offset="0.401" stopColor="#DF1D85" />
        <stop offset="0.77" stopColor="#932C87" />
        <stop offset="1" stopColor="#5D2F88" />
      </linearGradient>
      <radialGradient
        id="rxjs-gradient-2"
        cx="190.449"
        cy="80.2"
        r="121.582"
        gradientTransform="matrix(1 0.00239 -0.00200 0.8362 0.1607 12.6849)"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0" stopColor="#E01D84" />
        <stop offset="0.139" stopColor="#DE1E85" />
        <stop offset="0.285" stopColor="#D62085" />
        <stop offset="0.434" stopColor="#C92386" />
        <stop offset="0.586" stopColor="#B72786" />
        <stop offset="0.739" stopColor="#9D2B87" />
        <stop offset="0.891" stopColor="#7C2E88" />
        <stop offset="1" stopColor="#5D2F88" />
      </radialGradient>
      <linearGradient
        id="rxjs-gradient-3"
        x1="83.205"
        y1="62.336"
        x2="137.364"
        y2="62.336"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0" stopColor="#E01D84" />
        <stop offset="0.238" stopColor="#DA1E85" />
        <stop offset="0.658" stopColor="#C72085" />
        <stop offset="0.999" stopColor="#B52284" />
      </linearGradient>
    </defs>
    <g>
      <path
        d="M220.4,213.7c23-10,32.8-27.3,32.8-27.3c21.5-29.3,14.2-60.2,14.2-60.2c-13.7,29.8-26.2,38-26.2,38 c33.7-51.3,0.2-82.3,0.2-82.3c13.7,29.2-4.5,64.8-4.5,64.8c-15.3,32.2-37,43.7-37,43.7c24.2,4.5,42-11.8,42-11.8 c-34.7,37.5-72.3,35.7-72.3,35.7c15.8,17.7,39.5,16.2,39.5,16.2c-31,7.3-60.1-3-84-22.9c-4.5-3.7-8.8-7.7-12.8-12 c0,0-3.6-3.8-4.3-4.8l-0.1-0.1c-0.5,18.5,18.8,35.7,18.8,35.7c-24.2-10-35.3-31.7-35.3-31.7s-16.3-27.8-4.5-59.5 c11.7-31.3,46.6-38.3,47.5-38.5c29.5,14.3,54.5,18.8,54.5,18.8c7.4,1.2,13.7,1.8,19.1,1.8c32.8,0.2,30.6-18.8,30.6-18.8 c0.5-22.2-33-45.8-33-45.8c-26.1-19.3-51.1-24.7-71-24.6c-0.8,0-1.6,0-2.4,0c0,0-3.3-3.2-5.4-4.6c-11.4-7.6-28.4-10.1-38.7,0.6 c-3.1,3.2-5.7,6.7-8.6,9.9c-3.3,3.6-7.3,6.6-11.9,8.3c-4,1.5-8,1.2-12.1,1.9c-4.2,0.7-8.5,2.2-11.9,4.9c-3.7,3-5.2,7-5.6,11.6 c-0.4,3.6-0.3,7.3-0.5,10.9c-0.5,10.6-3.9,13.6-11.5,19.5c-3.2,2.4-5.9,5.6-7.9,9c-6,10.6,3.6,21.6,4.1,32.3 c0.1,2.2-0.1,4.4-0.9,6.5c-0.8,2.3-2.4,3.8-3.7,5.7c-1.8,2.5-3,5.5-2.5,8.6c0.5,3.1,2.1,6,3.6,8.7c2.9,4.8,6.5,9.1,10.3,13.2 c0.2,0.2,0.4,0.4,0.6,0.7c0-0.1-0.1-0.2-0.1-0.3c0.4,1.4,0.9,2.7,1.4,4c1.6,4.5,2.3,6.1,2.3,6.1c0,0,0-0.1-0.1-0.2 c3.2,7.6,7.3,15.1,12.1,22.2c26,38.8,68.2,52.2,68.2,52.2c62.5,21.2,105.2-10,105.2-10c39.3-27,47.2-58.2,47.2-58.2 C234.1,216,220.4,213.7,220.4,213.7z"
        fill="#fff"
      />
      <path
        d="M29.6,175.3c-5.2-16.2-6.7-33.3-3.7-50.9c1.3-7.3,3.3-14.3,5.5-21.4c0,0,13.8-45.3,60.5-66 c0,0,16.1-8.5,40.3-9.1c0,0-3.3-3.2-5.4-4.6c-11.4-7.6-28.4-10.1-38.7,0.6c-3.1,3.2-5.7,6.7-8.6,9.9c-3.3,3.6-7.3,6.6-11.9,8.3 c-4,1.5-8,1.2-12.1,1.9c-4.2,0.7-8.5,2.2-11.9,4.9c-3.7,3-5.2,7-5.6,11.6c-0.4,3.6-0.3,7.3-0.5,10.9c-0.5,10.6-3.9,13.6-11.5,19.5 c-3.2,2.4-5.9,5.6-7.9,9c-6,10.6,3.6,21.6,4.1,32.3c0.1,2.2-0.1,4.4-0.9,6.5c-0.8,2.3-2.4,3.8-3.7,5.7c-1.8,2.5-3,5.5-2.5,8.6 c0.5,3.1,2.1,6,3.6,8.7c2.9,4.8,6.5,9.1,10.3,13.2C29.2,174.9,29.4,175.1,29.6,175.3"
        fill="#e32286"
      />
      <path
        d="M107.9,190.5c-0.5,18.5,18.8,35.7,18.8,35.7c-24.2-10-35.3-31.7-35.3-31.7s-16.3-27.8-4.5-59.5 s47.5-38.5,47.5-38.5c29.5,14.3,54.5,18.8,54.5,18.8c52.7,8.8,49.7-17,49.7-17c0.5-22.2-33-45.8-33-45.8 C145.9,8.4,91.9,37,91.9,37c-46.7,20.7-60.5,66-60.5,66c-2.2,7.1-4.2,14.1-5.5,21.4c-5.1,29.7,2.6,57.8,19.3,82.8 c26,38.8,68.2,52.2,68.2,52.2c62.5,21.2,105.2-10,105.2-10c39.3-27,47.2-58.2,47.2-58.2c-31.7,24.8-45.3,22.5-45.3,22.5 c23-10,32.8-27.3,32.8-27.3c21.5-29.3,14.2-60.2,14.2-60.2c-13.7,29.8-26.2,38-26.2,38c33.7-51.3,0.2-82.3,0.2-82.3 c13.7,29.2-4.5,64.8-4.5,64.8c-15.3,32.2-37,43.7-37,43.7c24.2,4.5,42-11.8,42-11.8c-34.7,37.5-72.3,35.7-72.3,35.7 c15.8,17.7,39.5,16.2,39.5,16.2c-31,7.3-60.1-3-84-22.9c-4.5-3.7-8.8-7.7-12.8-12C112.2,195.5,108.7,191.6,107.9,190.5 L107.9,190.5z"
        fill="url(#rxjs-gradient-1)"
      />
      <path
        d="M31.3,103c0,0,13.8-45.3,60.5-66c0,0,54-28.7,113.7,15.5c0,0,33.5,23.7,33,45.8c0,0,3,25.8-49.7,17 c0,0-25-4.5-54.5-18.8c0,0-5.4-2.3-8.5-3.8c-3.1-1.5-12.1-4.8-12.1-4.8C72,75.4,49.6,107.3,49.6,107.3 c-13.9,15.6-17.2,35.8-17.2,35.8c-3.9,19.3,0.3,39.6,0.3,39.6s0.5,2.2,0.6,2.5c0,0-1.4-2.9-4.4-12.3c0,0-2.9-8.8-4.1-21.9 c0,0-1.4-13.6,1.6-28.5C26.3,122.5,28.7,110.7,31.3,103z"
        fill="url(#rxjs-gradient-2)"
      />
      <path
        d="M137.4,58.2l-34.1-10.6c-0.2,0-1.2-0.5-3,0c0,0-20.1,5.1-16.6,16.1c0,0,2.1,6.9,7.8,13.6l37.5-1.8L137.4,58.2z"
        fill="url(#rxjs-gradient-3)"
      />
      <circle cx="171.6" cy="73.2" r="5.4" fill="#fff" />
    </g>
  </svg>
);

// Componente personalizado para o ícone do Karma com as cores originais
const KarmaIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 -29 256 256"
    className={className}
  >
    <g>
      <path
        d="M154.565149,138.601931 L193.810636,197.149425 L255.853854,197.149425 L185.543111,93.2663908 L154.565149,138.601931"
        fill="#429F87"
      />
      <path
        d="M29.4919847,169.993808 L58.2277395,142.923525 L104.170421,197.149425 L74.6784368,88.3749272 L49.7777778,129.336889 L29.4919847,169.993808"
        fill="#429F87"
      />
      <path
        d="M29.4919847,169.993808 L74.6784368,88.3749272 L45.9495479,115.457962 L0,61.2300996 L29.4919847,169.993808"
        fill="#56C5A8"
      />
      <path
        d="M249.938391,0.603218391 L187.895172,0.603218391 L149.896337,56.7466667 L149.896337,0.603218391 L92.9848889,0.603218391 L92.9848889,58.8319387 L123.329226,170.665686 L130.400123,197.149425 L149.896337,197.149425 L149.896337,148.011157 L249.938391,0.603218391"
        fill="#56C5A8"
      />
    </g>
  </svg>
);

// Componente personalizado para o ícone do Zustand com as cores originais
const ZustandIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 512 512"
    className={className}
  >
    <image href="/zustand.svg" width="512" height="512" />
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
  RxJS: <RxJSIcon className="h-5 w-5" />,
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
  Zustand: <ZustandIcon className="h-5 w-5" />,
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
  Karma: <KarmaIcon className="h-5 w-5" />,
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
  RxJS: 4,
  ReactJS: 5,
  'Next.js': 4,
  'Styled Components': 4,
  'Css Modules': 5,
  ChakraUI: 5,
  VueJS: 3,
  Svelte: 2,
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

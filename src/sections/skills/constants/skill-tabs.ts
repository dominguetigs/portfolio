import { SkillTab } from '../types';

export const SKILL_TABS: SkillTab[] = [
  {
    tabKey: 'frontend',
    categories: [
      {
        translationKey: 'sections.core',
        category: 'core',
        items: ['html5', 'css3', 'javascript'],
      },
      {
        translationKey: 'sections.frameworks',
        category: 'frameworks',
        items: [
          'angular',
          'angular-js',
          'jquery',
          'next-js',
          'react-js',
          'rxjs',
          'svelte',
          'vuejs',
        ],
      },
      {
        translationKey: 'sections.stateManagement',
        category: 'stateManagement',
        items: ['redux', 'zustand', 'ngrx'],
      },
      {
        translationKey: 'sections.ui',
        category: 'ui',
        items: [
          'angular-material',
          'bootstrap',
          'chakra-ui',
          'css-modules',
          'less',
          'sass',
          'styled-components',
          'tailwind',
        ],
      },
      {
        translationKey: 'sections.mobile',
        category: 'mobile',
        items: ['ionic', 'swift'],
      },
      {
        translationKey: 'sections.ecommerceCms',
        category: 'ecommerceCms',
        items: ['shopify'],
      },
    ],
  },
  {
    tabKey: 'languages',
    categories: [
      {
        translationKey: 'sections.programmingLanguages',
        category: 'programmingLanguages',
        items: [
          'elixir',
          'go',
          'javascript',
          'python',
          'shellscript',
          'swift',
          'typescript',
        ],
      },
    ],
  },
  {
    tabKey: 'backend',
    categories: [
      {
        translationKey: 'sections.backendTechnologies',
        category: 'backendTechnologies',
        items: ['node-js', 'python', 'elixir', 'go'],
      },
      {
        translationKey: 'sections.communication',
        category: 'communication',
        items: ['socket-io', 'rest-api', 'graphql'],
      },
    ],
  },
  {
    tabKey: 'data',
    categories: [
      {
        translationKey: 'sections.databases',
        category: 'databases',
        items: [
          'elasticsearch',
          'firebase-realtime-db',
          'mongodb',
          'mysql',
          'postgre-sql',
          'sqlite',
        ],
      },
    ],
  },
  {
    tabKey: 'tools',
    categories: [
      {
        translationKey: 'sections.testing',
        category: 'testing',
        items: [
          'cypress',
          'jest',
          'karma',
          'protractor',
          'react-testing-library',
        ],
      },
      {
        translationKey: 'sections.monitoring',
        category: 'monitoring',
        items: ['sentry', 'new-relic', 'datadog'],
      },
      {
        translationKey: 'sections.operatingSystems',
        category: 'operatingSystems',
        items: ['linux', 'windows', 'mac'],
      },
      {
        translationKey: 'sections.build',
        category: 'build',
        items: ['babel', 'webpack', 'vite', 'gulp', 'grunt'],
      },
      {
        translationKey: 'sections.packageManagers',
        category: 'packageManagers',
        items: ['npm', 'yarn', 'bower', 'pnpm'],
      },
      {
        translationKey: 'sections.devops',
        category: 'devops',
        items: [
          'aws',
          'azure-devops',
          'bitbucket',
          'docker',
          'firebase',
          'git',
          'git-flow',
          'github',
          'google-cloud',
          'vercel',
        ],
      },
      {
        translationKey: 'sections.projectManagement',
        category: 'projectManagement',
        items: ['jira', 'trello'],
      },
      {
        translationKey: 'sections.agileMethodologies',
        category: 'agileMethodologies',
        items: ['scrum', 'kanban'],
      },
    ],
  },
];

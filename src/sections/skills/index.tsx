'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Layout, CodeSquare, Server, Database, Wrench } from 'lucide-react';
import { SectionHeader, MotionSection } from '@/sections/ui';
import { TechSkillItem } from './components/tech-skill-item';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useTranslations } from 'next-intl';

export function SkillsSection() {
  const t = useTranslations('Index.Skills');
  const [selectedSkillTab, setSelectedSkillTab] = useState('frontend');
  const [hasAnimated, setHasAnimated] = useState(false);
  const [refSkills, inViewSkills] = useInView({
    triggerOnce: true,
    threshold: 0.05,
    rootMargin: '-20px 0px 0px 0px',
  });

  const handleTabChange = (value: string) => {
    setSelectedSkillTab(value);
  };

  // Efeito para animar a troca de categoria quando a seção aparecer pela primeira vez
  useEffect(() => {
    if (inViewSkills && !hasAnimated) {
      // Apenas marcar como animado para que os componentes TechSkillItem possam usar seus próprios efeitos de animação
      setHasAnimated(true);
    }
  }, [inViewSkills, hasAnimated]);

  return (
    <MotionSection id="skills" className="py-16" delay={0.1} ref={refSkills}>
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
        value={selectedSkillTab}
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
          className="mb-6"
        >
          {/* Seletor para dispositivos móveis */}
          <div className="block lg:hidden w-full mb-4">
            <label className="block text-sm font-medium mb-2 text-muted-foreground">
              {t('mobileSelectLabel')}
            </label>
            <Select value={selectedSkillTab} onValueChange={handleTabChange}>
              <SelectTrigger className="w-full max-w-1/2 md:max-w-[calc(1/3*100%-0.5rem)] bg-card">
                <SelectValue placeholder={t('mobileSelectLabel')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  value="frontend"
                  className="flex items-center gap-2"
                >
                  <div className="flex items-center gap-2">
                    <Layout className="h-4 w-4 text-primary" />
                    <span>{t('categories.frontend')}</span>
                  </div>
                </SelectItem>
                <SelectItem
                  value="languages"
                  className="flex items-center gap-2"
                >
                  <div className="flex items-center gap-2">
                    <CodeSquare className="h-4 w-4 text-primary" />
                    <span>{t('categories.languages')}</span>
                  </div>
                </SelectItem>
                <SelectItem value="backend" className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    <Server className="h-4 w-4 text-primary" />
                    <span>{t('categories.backend')}</span>
                  </div>
                </SelectItem>
                <SelectItem value="data" className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    <Database className="h-4 w-4 text-primary" />
                    <span>{t('categories.data')}</span>
                  </div>
                </SelectItem>
                <SelectItem
                  value="tools-infra"
                  className="flex items-center gap-2"
                >
                  <div className="flex items-center gap-2">
                    <Wrench className="h-4 w-4 text-primary" />
                    <span>{t('categories.tools')}</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tabs para desktop */}
          <TabsList className="hidden lg:grid grid-cols-5 w-full gap-1">
            <TabsTrigger value="frontend" className="flex items-center gap-1.5">
              <Layout className="h-4 w-4" />
              <span>{t('categories.frontend')}</span>
            </TabsTrigger>
            <TabsTrigger
              value="languages"
              className="flex items-center gap-1.5"
            >
              <CodeSquare className="h-4 w-4" />
              <span>{t('categories.languages')}</span>
            </TabsTrigger>
            <TabsTrigger value="backend" className="flex items-center gap-1.5">
              <Server className="h-4 w-4" />
              <span>{t('categories.backend')}</span>
            </TabsTrigger>
            <TabsTrigger value="data" className="flex items-center gap-1.5">
              <Database className="h-4 w-4" />
              <span>{t('categories.data')}</span>
            </TabsTrigger>
            <TabsTrigger
              value="tools-infra"
              className="flex items-center gap-1.5"
            >
              <Wrench className="h-4 w-4" />
              <span>{t('categories.tools')}</span>
            </TabsTrigger>
          </TabsList>
        </motion.div>

        <TabsContent value="frontend" className="space-y-8">
          <TechSkillItem
            label={t('sections.core')}
            category="core"
            items={['Html5', 'Css3', 'Vanilla JavaScript']}
            delay={0.1}
          />
          <TechSkillItem
            label={t('sections.frameworks')}
            category="frameworks"
            items={[
              'Angular',
              'ReactJS',
              'Next.js',
              'VueJS',
              'AngularJS',
              'RxJS',
              'JQuery',
            ]}
            delay={0.2}
          />
          <TechSkillItem
            label={t('sections.ui')}
            category="ui"
            items={[
              'Tailwind',
              'Sass',
              'Bootstrap',
              'Styled Components',
              'ChakraUI',
              'Css Modules',
              'Less',
              'Angular Material',
            ]}
            delay={0.3}
          />
          <TechSkillItem
            label={t('sections.mobile')}
            category="mobile"
            items={['Ionic', 'Swift']}
            delay={0.4}
          />
          <TechSkillItem
            label={t('sections.ecommerceCms')}
            category="ecommerceCms"
            items={['Shopify']}
            delay={0.5}
          />
        </TabsContent>

        <TabsContent value="languages" className="space-y-8">
          <TechSkillItem
            label={t('sections.programmingLanguages')}
            category="programmingLanguages"
            items={[
              'JavaScript',
              'TypeScript',
              'Python',
              'Elixir',
              'Go',
              'Swift',
              'ShellScript',
            ]}
            delay={0.1}
          />
        </TabsContent>

        <TabsContent value="backend" className="space-y-8">
          <TechSkillItem
            label={t('sections.backendTechnologies')}
            category="backendTechnologies"
            items={['NodeJS', 'Python', 'Elixir', 'Go']}
            delay={0.1}
          />
          <TechSkillItem
            label={t('sections.communication')}
            category="communication"
            items={['Socket.Io', 'REST API', 'GraphQL']}
            delay={0.2}
          />
        </TabsContent>

        <TabsContent value="data" className="space-y-8">
          <TechSkillItem
            label={t('sections.databases')}
            category="databases"
            items={[
              'MySQL',
              'Postgres',
              'MongoDB',
              'Firebase Realtime DB',
              'SQLite',
            ]}
            delay={0.1}
          />
        </TabsContent>

        <TabsContent value="tools-infra" className="space-y-8">
          <TechSkillItem
            label={t('sections.testing')}
            category="testing"
            items={[
              'Jest',
              'Cypress',
              'Karma',
              'Protractor',
              'React Testing Library',
            ]}
            delay={0.1}
          />
          <TechSkillItem
            label={t('sections.build')}
            category="build"
            items={['Babel', 'Webpack', 'Vite', 'Gulp', 'Grunt']}
            delay={0.2}
          />
          <TechSkillItem
            label={t('sections.packageManagers')}
            category="packageManagers"
            items={['Npm', 'Yarn', 'Bower', 'Pnpm']}
            delay={0.3}
          />
          <TechSkillItem
            label={t('sections.devops')}
            category="devops"
            items={[
              'Git',
              'GitHub',
              'Bitbucket',
              'GitFlow',
              'Docker',
              'AWS',
              'Google Cloud',
              'Azure DevOps',
              'Vercel',
              'Firebase',
            ]}
            delay={0.4}
          />
          <TechSkillItem
            label={t('sections.projectManagement')}
            category="projectManagement"
            items={['Jira', 'Trello']}
            delay={0.5}
          />
          <TechSkillItem
            label={t('sections.agileMethodologies')}
            category="agileMethodologies"
            items={['Scrum', 'Kanban']}
            delay={0.6}
          />
        </TabsContent>
      </Tabs>
    </MotionSection>
  );
}

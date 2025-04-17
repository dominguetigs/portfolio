'use client';

import { useState } from 'react';

import { useTranslations } from 'next-intl';

import { motion } from 'framer-motion';

import { ExternalLink } from 'lucide-react';

import { SiGithub } from 'react-icons/si';

import { TabsContent } from '@/components/ui/tabs';

import { CONTACT_INFO } from '@/constants';

import { SectionHeader, MotionSection } from '@/sections/ui';

import {
  projectsSectionDelay,
  projectsDescriptionAnimation,
  githubViewMoreAnimation,
} from './animations';
import { PERSONAL_PROJECTS, WORK_PROJECTS } from './constants';
import { ProjectsTabs } from './projects-tabs';
import { ProjectsGrid } from './projects-grid';

export function ProjectsSection() {
  const t = useTranslations('Index.Projects');
  const [activeTab, setActiveTab] = useState('work');

  const workProjects = WORK_PROJECTS(t);
  const personalProjects = PERSONAL_PROJECTS(t);

  const githubUrl = CONTACT_INFO.social.find(s => s.name === 'github')?.url;

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <MotionSection id="projects" className="py-16" delay={projectsSectionDelay}>
      <SectionHeader title={t('title')} />
      <motion.div {...projectsDescriptionAnimation} className="mb-6">
        <p className="text-muted-foreground">{t('description')}</p>
      </motion.div>

      <ProjectsTabs activeTab={activeTab} onTabChange={handleTabChange}>
        <TabsContent value="work" className="mt-0">
          <ProjectsGrid projects={workProjects} type="work" />
        </TabsContent>

        <TabsContent value="personal" className="mt-0">
          <ProjectsGrid projects={personalProjects} type="personal" />

          <motion.div
            className="mt-10 text-center"
            {...githubViewMoreAnimation}
          >
            <a
              href={`${githubUrl}?tab=repositories`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-5 py-2.5 rounded-full transition-all font-medium w-auto max-w-full overflow-hidden text-ellipsis whitespace-nowrap mx-auto"
            >
              <SiGithub className="h-4 w-4 flex-shrink-0" />
              <span>{t('viewMore')}</span>
              <ExternalLink className="h-3 w-3 flex-shrink-0" />
            </a>
          </motion.div>
        </TabsContent>
      </ProjectsTabs>
    </MotionSection>
  );
}

'use client';

import { useTranslations } from 'next-intl';

import { motion } from 'framer-motion';

import { Briefcase, User } from 'lucide-react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { tabsAnimation } from './animations';

interface ProjectsTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  children: React.ReactNode;
}

export function ProjectsTabs({
  activeTab,
  onTabChange,
  children,
}: ProjectsTabsProps) {
  const t = useTranslations('Index.Projects');

  return (
    <Tabs
      defaultValue="work"
      value={activeTab}
      onValueChange={onTabChange}
      className="w-full"
    >
      <motion.div {...tabsAnimation} className="mb-8">
        {/* Seletor para dispositivos móveis */}
        <div className="block sm:hidden w-full mb-4">
          <label className="block text-sm font-medium mb-2 text-muted-foreground">
            {t('workTab')}/{t('personalTab')}
          </label>
          <Select value={activeTab} onValueChange={onTabChange}>
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
              <SelectItem value="personal" className="flex items-center gap-2">
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

      {children}
    </Tabs>
  );
}

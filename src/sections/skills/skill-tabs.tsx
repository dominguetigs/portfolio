'use client';

import { useState } from 'react';

import { useTranslations } from 'next-intl';

import { motion } from 'framer-motion';

import { Layout } from 'lucide-react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { mobileTabsAnimation } from './animations';
import { TAB_ICONS, SKILL_TABS } from './constants';
import { SkillItem } from './skill-item';

export function SkillTabs() {
  const t = useTranslations('Index.Skills');
  const [selectedSkillTab, setSelectedSkillTab] = useState('frontend');

  const handleTabChange = (value: string) => {
    setSelectedSkillTab(value);
  };

  return (
    <Tabs
      value={selectedSkillTab}
      onValueChange={handleTabChange}
      className="w-full"
    >
      <motion.div {...mobileTabsAnimation} className="mb-6">
        {/* Mobile Selector */}
        <div className="block lg:hidden w-full mb-4">
          <label className="block text-sm font-medium mb-2 text-muted-foreground">
            {t('mobileSelectLabel')}
          </label>
          <Select value={selectedSkillTab} onValueChange={handleTabChange}>
            <SelectTrigger className="w-full max-w-1/2 md:max-w-[calc(1/3*100%-0.5rem)] bg-card">
              <SelectValue placeholder={t('mobileSelectLabel')} />
            </SelectTrigger>
            <SelectContent>
              {SKILL_TABS.map(tab => (
                <SelectItem
                  key={tab.tabKey}
                  value={tab.tabKey}
                  className="flex items-center gap-2"
                >
                  <div className="flex items-center gap-2">
                    {TAB_ICONS[tab.tabKey as keyof typeof TAB_ICONS] || (
                      <Layout className="h-4 w-4 text-primary" />
                    )}
                    <span>{t(`categories.${tab.tabKey}`)}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Desktop Tabs */}
        <TabsList className="hidden lg:grid grid-cols-5 w-full gap-1">
          {SKILL_TABS.map(tab => (
            <TabsTrigger
              key={tab.tabKey}
              value={tab.tabKey}
              className="flex items-center gap-1.5"
            >
              {TAB_ICONS[tab.tabKey as keyof typeof TAB_ICONS] || (
                <Layout className="h-4 w-4" />
              )}
              <span>{t(`categories.${tab.tabKey}`)}</span>
            </TabsTrigger>
          ))}
        </TabsList>
      </motion.div>

      {/* Tab Contents */}
      {SKILL_TABS.map(tab => (
        <TabsContent key={tab.tabKey} value={tab.tabKey} className="space-y-8">
          {tab.categories.map((category, index) => (
            <SkillItem
              key={category.category}
              label={t(category.translationKey)}
              category={category.category}
              items={category.items}
              delay={index * 0.1}
            />
          ))}
        </TabsContent>
      ))}
    </Tabs>
  );
}

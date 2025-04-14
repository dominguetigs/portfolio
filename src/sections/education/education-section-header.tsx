'use client';

import { LucideIcon } from 'lucide-react';

import { SectionToggleButton } from './section-toggle-button';

interface EducationSectionHeaderProps {
  title: string;
  Icon: LucideIcon;
  isExpanded: boolean;
  onToggle: VoidFunction;
  showLessText: string;
  showMoreText: string;
}

export function EducationSectionHeader({
  title,
  Icon,
  isExpanded,
  onToggle,
  showLessText,
  showMoreText,
}: EducationSectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-xl font-semibold text-primary flex items-center gap-2">
        <Icon className="h-5 w-5" />
        <span>{title}</span>
      </h3>

      <SectionToggleButton
        isExpanded={isExpanded}
        onToggle={onToggle}
        showLessText={showLessText}
        showMoreText={showMoreText}
      />
    </div>
  );
}

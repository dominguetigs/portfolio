'use client';

import { useState } from 'react';

import { GraduationCap } from 'lucide-react';

import { EducationList } from './education-list';
import { EducationSectionHeader } from './education-section-header';
import { Education } from './types';

export function AcademicEducation({
  title,
  showMoreText,
  showLessText,
  items,
}: Education) {
  const [showAllItems, setShowAllItems] = useState(false);

  const toggleItems = () => {
    setShowAllItems(!showAllItems);
  };

  return (
    <div>
      <EducationSectionHeader
        title={title}
        Icon={GraduationCap}
        isExpanded={showAllItems}
        onToggle={toggleItems}
        showLessText={showLessText}
        showMoreText={showMoreText}
      />

      <div className="mb-8">
        <EducationList
          items={items}
          visibleCount={showAllItems ? items.length : 1}
          baseDelay={0.15}
        />
      </div>
    </div>
  );
}

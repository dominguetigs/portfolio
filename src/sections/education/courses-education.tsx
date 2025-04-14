'use client';

import { useState } from 'react';

import { Award } from 'lucide-react';

import { EducationList } from './education-list';
import { EducationSectionHeader } from './education-section-header';
import { Education } from './types';

export function CoursesEducation({
  title,
  showMoreText,
  showLessText,
  items,
}: Education) {
  const [showAllItems, setShowAllItems] = useState(false);

  const toggleItems = () => {
    setShowAllItems(!showAllItems);
  };

  const midPoint = Math.ceil(items.length / 2);
  const leftColumnItems = items.slice(0, midPoint);
  const rightColumnItems = items.slice(midPoint);

  return (
    <div>
      <EducationSectionHeader
        title={title}
        Icon={Award}
        isExpanded={showAllItems}
        onToggle={toggleItems}
        showLessText={showLessText}
        showMoreText={showMoreText}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-0 mt-0">
        <div>
          <EducationList
            items={leftColumnItems}
            visibleCount={showAllItems ? leftColumnItems.length : 1}
            baseDelay={0.15}
          />
        </div>

        <div>
          <EducationList
            items={rightColumnItems}
            visibleCount={showAllItems ? rightColumnItems.length : 1}
            baseDelay={0.15}
          />
        </div>
      </div>
    </div>
  );
}

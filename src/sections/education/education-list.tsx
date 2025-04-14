'use client';

import { EducationItem } from './education-item';
import { EducationItem as EducationItemType } from './types';

interface EducationListProps {
  items: EducationItemType[];
  visibleCount: number;
  baseDelay: number;
}

export function EducationList({
  items,
  visibleCount,
  baseDelay,
}: EducationListProps) {
  return (
    <>
      {items.slice(0, visibleCount).map((item, index) => (
        <EducationItem
          key={`${item.institution}-${item.course}-${index}`}
          period={item.period}
          type={item.type}
          institution={item.institution}
          course={item.course}
          location={item.location}
          description={item.description}
          delay={baseDelay + index * 0.05}
        />
      ))}
    </>
  );
}

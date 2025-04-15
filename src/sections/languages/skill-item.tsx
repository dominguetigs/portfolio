'use client';

import { SkillBar } from './skill-bar';
import { SkillIcon } from './skill-icons';

interface SkillItemProps {
  skillName: 'reading' | 'writing' | 'speaking' | 'listening';
  skillLevel: number;
  levelLabel: string;
  translationLabel: string;
}

export const SkillItem = ({
  skillName,
  skillLevel,
  levelLabel,
  translationLabel,
}: SkillItemProps) => {
  return (
    <div className="space-y-1.5">
      <SkillIcon name={skillName} label={translationLabel} />
      <SkillBar level={skillLevel} />
      <div className="text-[10px] text-muted-foreground">{levelLabel}</div>
    </div>
  );
};

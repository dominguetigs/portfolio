'use client';

import { BookOpen, Headphones, MessageSquare, Pencil } from 'lucide-react';

interface SkillIconProps {
  name: 'reading' | 'writing' | 'speaking' | 'listening';
  label: string;
}

export const SkillIcon = ({ name, label }: SkillIconProps) => {
  const icons = {
    reading: <BookOpen className="h-3.5 w-3.5 text-primary" />,
    writing: <Pencil className="h-3.5 w-3.5 text-primary" />,
    speaking: <MessageSquare className="h-3.5 w-3.5 text-primary" />,
    listening: <Headphones className="h-3.5 w-3.5 text-primary" />,
  };

  return (
    <div className="flex items-center gap-1.5 mb-1">
      {icons[name]}
      <span className="text-xs font-medium">{label}</span>
    </div>
  );
};

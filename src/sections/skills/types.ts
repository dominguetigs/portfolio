import { SKILLS } from './constants';

export interface Skill {
  id: string;
  name: string;
  icon: React.ReactNode | null;
  level: number;
  color: string | null;
  isFavorite: boolean;
}

export interface SkillCategory {
  translationKey: string;
  category: string;
  items: (typeof SKILLS)[number]['id'][];
}

export interface SkillTab {
  tabKey: string;
  categories: SkillCategory[];
}

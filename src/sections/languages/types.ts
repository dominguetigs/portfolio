export interface LanguageItemProps {
  language: string;
  level: string;
  reading: number;
  writing: number;
  speaking: number;
  listening: number;
  flag: string;
  flagAlt: string;
  delay?: number;
}

export interface SkillBarProps {
  level: number;
}

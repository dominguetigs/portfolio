import { ReactNode } from 'react';

export interface BioSection {
  icon: React.ReactNode;
  title: string;
  content: string;
}

export interface HighlightCard {
  icon: ReactNode;
  title: string;
  description: string;
}

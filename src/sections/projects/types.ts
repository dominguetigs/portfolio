export type Project = {
  id: string;
  title: string;
  description: string;
  image?: string;
  technologies: string[];
};

export type WorkProject = Project & {
  url: string;
  year: string;
};

export type PersonalProject = Project & {
  language: string;
  repository?: string;
  demo?: string;
};

export type ProjectTypes = 'work' | 'personal';

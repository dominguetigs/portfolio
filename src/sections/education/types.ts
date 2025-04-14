export type EducationItem = {
  period: string;
  type: string;
  institution: string;
  course: string;
  location?: string;
  description?: string;
};

export type Education = {
  title: string;
  showMoreText: string;
  showLessText: string;
  items: EducationItem[];
};

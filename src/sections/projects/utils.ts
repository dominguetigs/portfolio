import { PersonalProject, WorkProject } from './types';

export const isWorkProject = (
  project: WorkProject | PersonalProject,
): project is WorkProject => {
  return (project as WorkProject).url !== undefined;
};

export const isPersonalProject = (
  project: WorkProject | PersonalProject,
): project is PersonalProject => {
  return (project as PersonalProject).repository !== undefined;
};

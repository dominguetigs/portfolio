'use client';

import { ProjectCard } from './project-card';
import { ProjectTypes, WorkProject, PersonalProject } from './types';

interface ProjectsGridProps {
  projects: WorkProject[] | PersonalProject[];
  type: ProjectTypes;
}

export function ProjectsGrid({ projects, type }: ProjectsGridProps) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, index) => (
          <ProjectCard
            key={project.id}
            project={project}
            index={index}
            type={type}
          />
        ))}
      </div>
    </>
  );
}

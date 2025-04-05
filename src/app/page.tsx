'use client';

import { useRef } from 'react';
import { HeroSection } from '@/app/sections/hero';
import { NavMenu } from '@/components/nav-menu';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

// Import sections
import { AboutSection } from '@/app/sections/about';
import { SkillsSection } from '@/app/sections/skills';
import { ProjectsSection } from '@/app/sections/projects';
import { ExperienceSection } from '@/app/sections/experience';
import { EducationSection } from '@/app/sections/education';
import { LanguagesSection } from '@/app/sections/languages';

export default function Home() {
  const aboutRef = useRef<HTMLElement | null>(null);

  const scrollToAbout = () => {
    aboutRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen pb-20">
      <Header />

      <HeroSection
        name="Gustavo Domingueti"
        title="Engenheiro Frontend"
        location="São Paulo, SP - Brasil"
        phone="+55 (11) 9 7158-1380"
        email="gustavo.s.domingueti@icloud.com"
        linkedin="https://linkedin.com/in/dominguetigs"
        github="https://github.com/dominguetigs"
        twitter="https://twitter.com/@gustavo.domingueti"
        onScrollDown={scrollToAbout}
      />

      <NavMenu />

      <div className="container mx-auto px-4 max-w-5xl lg:pl-[180px]">
        <AboutSection aboutRef={aboutRef} />
        <SkillsSection />
        <ProjectsSection />
        <ExperienceSection />
        <EducationSection />
        <LanguagesSection />
      </div>

      <Footer />
    </div>
  );
}

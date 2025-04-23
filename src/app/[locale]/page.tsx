'use client';

import { useRef } from 'react';
import { HeroSection } from '@/sections/hero';
import { NavMenu } from '@/components/nav-menu';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

import { AboutSection } from '@/sections/about';
import { SkillsSection } from '@/sections/skills';
import { ProjectsSection } from '@/sections/projects';
import { ExperienceSection } from '@/sections/experience';
import { EducationSection } from '@/sections/education';
import { LanguagesSection } from '@/sections/languages';
import { ContactSection } from '@/sections/contact';

export default function Home() {
  const aboutRef = useRef<HTMLElement | null>(null);

  return (
    <div className="min-h-screen pb-20 container max-w-4xl mx-auto px-4">
      <Header />

      <HeroSection aboutRef={aboutRef} />

      <NavMenu />

      <AboutSection aboutRef={aboutRef} />
      <SkillsSection />
      <ProjectsSection />
      <ExperienceSection />
      <EducationSection />
      <LanguagesSection />
      <ContactSection />

      <Footer />
    </div>
  );
}

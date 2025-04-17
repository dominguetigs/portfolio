'use client';

import { useState, useEffect, RefObject } from 'react';

import { ContactInfo } from './contact-info';
import { HeroTitle } from './hero-title';
import { ScrollDownButton } from './scroll-down-button';
import { ScrollTopButton } from './scroll-top-button';
import { SocialLinks } from './social-links';

interface HeroSectionProps {
  aboutRef: RefObject<HTMLElement | null>;
}

export function HeroSection({ aboutRef }: HeroSectionProps) {
  const [isAtTop, setIsAtTop] = useState(true);

  const scrollToAboutSection = () => {
    aboutRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const viewportHeight = window.innerHeight;
      const isAtHeroSection = scrollY < viewportHeight * 0.9;

      setIsAtTop(isAtHeroSection);
    };

    handleScroll();

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <ScrollTopButton isVisible={!isAtTop} />

      <section className="min-h-[calc(100vh-100px)] flex flex-col items-center justify-center relative px-4 py-10 mt-[-24px] max-w-full">
        <div className="text-center max-w-3xl mx-auto flex flex-col items-center">
          <HeroTitle />
          <ContactInfo />
          <SocialLinks />

          <ScrollDownButton
            isVisible={isAtTop}
            onClick={scrollToAboutSection}
          />
        </div>
      </section>
    </>
  );
}

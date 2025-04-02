'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowDown } from 'lucide-react';
import Image from 'next/image';

interface HeroSectionProps {
  name: string;
  title: string;
  location: string;
  phone: string;
  email: string;
  linkedin: string;
  github: string;
  twitter: string;
  onScrollDown: () => void;
}

export function HeroSection({
  name,
  title,
  location,
  phone,
  email,
  linkedin,
  github,
  twitter,
  onScrollDown,
}: HeroSectionProps) {
  return (
    <section className="min-h-screen flex flex-col justify-center items-center relative px-4">
      <div className="text-center max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, type: 'spring' }}
            className="mb-6 relative"
          >
            <div className="w-48 h-48 mx-auto relative mb-6 overflow-hidden rounded-full border-4 border-primary/20 shadow-lg">
              <Image
                src="/hero-profile.png"
                alt="Profile"
                fill
                sizes="(max-width: 768px) 100vw, 192px"
                className="object-cover"
                style={{
                  filter: 'contrast(1.05) saturate(1.1)',
                }}
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent mix-blend-overlay"></div>
            </div>
            <div className="absolute -z-10 w-64 h-64 rounded-full blur-3xl bg-primary/10 opacity-60 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
          </motion.div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-2">
            {name}
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground">{title}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-4 mb-8"
        >
          <p className="text-muted-foreground">{location}</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href={`mailto:${email}`}
              className="text-muted-foreground hover:text-foreground"
            >
              {email}
            </a>
            <span className="hidden sm:inline text-muted-foreground">•</span>
            <a
              href={`tel:${phone}`}
              className="text-muted-foreground hover:text-foreground"
            >
              {phone}
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap justify-center gap-4"
        >
          <a href={linkedin} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="sm">
              LinkedIn
            </Button>
          </a>
          <a href={github} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="sm">
              GitHub
            </Button>
          </a>
          <a href={twitter} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="sm">
              Twitter
            </Button>
          </a>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="mt-[100px] sm:mt-[200px]"
      >
        <Button
          size="icon"
          onClick={onScrollDown}
          className="rounded-full animate-bounce"
        >
          <ArrowDown className="h-6 w-6" />
        </Button>
      </motion.div>
    </section>
  );
}

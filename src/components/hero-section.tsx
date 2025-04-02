'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowDown } from 'lucide-react';

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
          className="flex justify-center gap-4"
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
        className="absolute bottom-10 left-0 right-0 flex justify-center"
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

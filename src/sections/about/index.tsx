import { motion } from 'framer-motion';
import {
  User,
  Briefcase,
  Users,
  Code2,
  GanttChart,
  Lightbulb,
} from 'lucide-react';
import { MotionSection, SectionHeader } from '@/sections/ui';
import Image from 'next/image';

interface AboutSectionProps {
  aboutRef: React.RefObject<HTMLElement | null>;
}

export function AboutSection({ aboutRef }: AboutSectionProps) {
  return (
    <MotionSection id="about" ref={aboutRef} className="py-16">
      <SectionHeader title="Sobre" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <motion.div
          className="col-span-1"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{
            once: true,
            amount: 0.03,
            margin: '-30px 0px 0px 0px',
          }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          <div className="relative w-full aspect-square max-w-[300px] mx-auto overflow-hidden rounded-lg shadow-lg">
            <Image
              src="/hero-profile-2.png"
              alt="Gustavo Domingueti"
              fill
              className="object-cover object-center"
              sizes="(max-width: 768px) 100vw, 300px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          </div>
        </motion.div>

        <motion.div
          className="col-span-1 md:col-span-2 prose prose-lg dark:prose-invert"
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{
            once: true,
            amount: 0.03,
            margin: '-30px 0px 0px 0px',
          }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <h3 className="text-xl font-semibold flex items-center gap-2 mb-4">
            <User className="h-5 w-5 text-primary" />
            Quem sou
          </h3>
          <p className="mb-6">
            Desenvolvedor Frontend com quase 10 anos de experiência no
            desenvolvimento de aplicações web, atuando em projetos complexos e
            de alto impacto. Forte expertise em JavaScript, TypeScript, HTML e
            CSS, com especialização em Angular, React e Next.js além das
            melhores práticas em arquitetura de software e performance.
          </p>

          <h3 className="text-xl font-semibold flex items-center gap-2 mb-4">
            <Briefcase className="h-5 w-5 text-primary" />
            Experiência Setorial
          </h3>
          <p className="mb-6">
            Experiência nos setores de restaurantes, fintechs, educação e saúde,
            liderando o desenvolvimento de sistemas escaláveis e modernos.
            Habilidade em monorepos (Nx), testes automatizados (Jest, Cypress),
            microfrontends (Module Federation) e infraestrutura em nuvem (AWS,
            Firebase, Vercel). Conhecimento avançado em design system,
            acessibilidade e UI/UX.
          </p>

          <h3 className="text-xl font-semibold flex items-center gap-2 mb-4">
            <Users className="h-5 w-5 text-primary" />
            Liderança e Desenvolvimento
          </h3>
          <p>
            Experiência comprovada na mentoria de desenvolvedores, liderança de
            times e facilitação da migração de sistemas legados para tecnologias
            modernas. Sempre atualizado com as melhores práticas do mercado,
            buscando constantemente aprender, inovar e otimizar processos de
            desenvolvimento.
          </p>
        </motion.div>

        <motion.div
          className="col-span-1 md:col-span-3 mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{
            once: true,
            amount: 0.03,
            margin: '-30px 0px 0px 0px',
          }}
          transition={{ duration: 0.4, delay: 0.25 }}
        >
          <div className="bg-card hover:bg-card/80 transition-colors border rounded-lg p-4 shadow-sm flex flex-col items-center text-center">
            <Code2 className="h-8 w-8 text-primary mb-3" />
            <h4 className="font-medium mb-2">Frontend Especialista</h4>
            <p className="text-sm text-muted-foreground">
              Domínio avançado das principais tecnologias e frameworks frontend
              modernos
            </p>
          </div>

          <div className="bg-card hover:bg-card/80 transition-colors border rounded-lg p-4 shadow-sm flex flex-col items-center text-center">
            <GanttChart className="h-8 w-8 text-primary mb-3" />
            <h4 className="font-medium mb-2">Arquitetura de Software</h4>
            <p className="text-sm text-muted-foreground">
              Experiência em projetar sistemas escaláveis e de alta performance
            </p>
          </div>

          <div className="bg-card hover:bg-card/80 transition-colors border rounded-lg p-4 shadow-sm flex flex-col items-center text-center">
            <Users className="h-8 w-8 text-primary mb-3" />
            <h4 className="font-medium mb-2">Liderança Técnica</h4>
            <p className="text-sm text-muted-foreground">
              Habilidade em guiar equipes e mentorear desenvolvedores
            </p>
          </div>

          <div className="bg-card hover:bg-card/80 transition-colors border rounded-lg p-4 shadow-sm flex flex-col items-center text-center">
            <Lightbulb className="h-8 w-8 text-primary mb-3" />
            <h4 className="font-medium mb-2">Inovação Constante</h4>
            <p className="text-sm text-muted-foreground">
              Sempre atualizado com as tecnologias e práticas mais recentes do
              mercado
            </p>
          </div>
        </motion.div>
      </div>
    </MotionSection>
  );
}

'use client';

import { useRef, useState, useEffect } from 'react';
import { ThemeToggle } from '@/components/theme-toggle';
import { HeroSection } from '@/components/hero-section';
import { NavMenu } from '@/components/nav-menu';
import { MotionSection } from '@/components/motion-section';
import { SectionHeader } from '@/components/section-header';
import { TechSkillItem } from '@/components/tech-skill-item';
import { ExperienceItem } from '@/components/experience-item';
import { EducationItem } from '@/components/education-item';
import { LanguageItem } from '@/components/language-item';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  GraduationCap,
  Award,
  Check,
  Layout,
  CodeSquare,
  Server,
  Database,
  Wrench,
  User,
  Briefcase,
  Users,
  Code2,
  GanttChart,
  Lightbulb,
  Rocket,
  ExternalLink,
  Github,
  FileDown,
  Download,
  FileText,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

const sections = [
  { id: 'about', label: 'Sobre' },
  { id: 'skills', label: 'Habilidades' },
  { id: 'projects', label: 'Projetos' },
  { id: 'experience', label: 'Experiência Profissional' },
  { id: 'education', label: 'Educação' },
  { id: 'languages', label: 'Idiomas' },
];

export default function Home() {
  const aboutRef = useRef<HTMLElement>(null);
  const [selectedSkillTab, setSelectedSkillTab] = useState('frontend');
  const [hasAnimated, setHasAnimated] = useState(false);
  const [clickedSection, setClickedSection] = useState<string | null>(null);
  const [refSkills, inViewSkills] = useInView({
    triggerOnce: true,
    threshold: 0.05,
    rootMargin: '-20px 0px 0px 0px',
  });

  const scrollToAbout = () => {
    aboutRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleTabChange = (value: string) => {
    setSelectedSkillTab(value);
  };

  const handleSectionClick = (sectionId: string) => {
    setClickedSection(sectionId);
  };

  // Efeito para animar a troca de categoria quando a seção aparecer pela primeira vez
  useEffect(() => {
    if (inViewSkills && !hasAnimated) {
      // Apenas marcar como animado para que os componentes TechSkillItem possam usar seus próprios efeitos de animação
      setHasAnimated(true);
    }
  }, [inViewSkills, hasAnimated]);

  return (
    <div className="min-h-screen pb-20">
      <div className="absolute top-4 right-4 z-50 flex items-center gap-3">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              aria-label="Download currículo"
            >
              <FileText className="h-[1.2rem] w-[1.2rem]" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-2" align="end">
            <div className="flex flex-col gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center justify-start gap-2"
                onClick={() => window.open('/cv/resume.pdf', '_blank')}
              >
                <Download className="h-4 w-4" />
                <span>Currículo (Inglês)</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center justify-start gap-2"
                onClick={() => window.open('/cv/curriculum.pdf', '_blank')}
              >
                <FileDown className="h-4 w-4" />
                <span>Currículo (Português)</span>
              </Button>
            </div>
          </PopoverContent>
        </Popover>
        <ThemeToggle />
      </div>

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

      <NavMenu sections={sections} onSectionClick={handleSectionClick} />

      <div className="container mx-auto px-4 max-w-5xl lg:pl-[180px]">
        <MotionSection
          id="about"
          ref={aboutRef}
          className="py-16"
          skipYAnimation={clickedSection === 'about'}
        >
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
                desenvolvimento de aplicações web, atuando em projetos complexos
                e de alto impacto. Forte expertise em JavaScript, TypeScript,
                HTML e CSS, com especialização em Angular, React e Next.js além
                das melhores práticas em arquitetura de software e performance.
              </p>

              <h3 className="text-xl font-semibold flex items-center gap-2 mb-4">
                <Briefcase className="h-5 w-5 text-primary" />
                Experiência Setorial
              </h3>
              <p className="mb-6">
                Experiência nos setores de restaurantes, fintechs, educação e
                saúde, liderando o desenvolvimento de sistemas escaláveis e
                modernos. Habilidade em monorepos (Nx), testes automatizados
                (Jest, Cypress), microfrontends (Module Federation) e
                infraestrutura em nuvem (AWS, Firebase, Vercel). Conhecimento
                avançado em design system, acessibilidade e UI/UX.
              </p>

              <h3 className="text-xl font-semibold flex items-center gap-2 mb-4">
                <Users className="h-5 w-5 text-primary" />
                Liderança e Desenvolvimento
              </h3>
              <p>
                Experiência comprovada na mentoria de desenvolvedores, liderança
                de times e facilitação da migração de sistemas legados para
                tecnologias modernas. Sempre atualizado com as melhores práticas
                do mercado, buscando constantemente aprender, inovar e otimizar
                processos de desenvolvimento.
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
                  Domínio avançado das principais tecnologias e frameworks
                  frontend modernos
                </p>
              </div>

              <div className="bg-card hover:bg-card/80 transition-colors border rounded-lg p-4 shadow-sm flex flex-col items-center text-center">
                <GanttChart className="h-8 w-8 text-primary mb-3" />
                <h4 className="font-medium mb-2">Arquitetura de Software</h4>
                <p className="text-sm text-muted-foreground">
                  Experiência em projetar sistemas escaláveis e de alta
                  performance
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
                  Sempre atualizado com as tecnologias e práticas mais recentes
                  do mercado
                </p>
              </div>
            </motion.div>
          </div>
        </MotionSection>

        <MotionSection
          id="skills"
          className="py-16"
          delay={0.1}
          ref={refSkills}
          skipYAnimation={clickedSection === 'skills'}
        >
          <SectionHeader title="Habilidades" />
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.03, margin: '-30px 0px 0px 0px' }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="mb-6"
          >
            <p className="text-muted-foreground">
              Principais tecnologias e ferramentas que domino, organizadas por
              categorias.
            </p>
          </motion.div>

          <Tabs
            value={selectedSkillTab}
            onValueChange={handleTabChange}
            className="w-full"
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{
                once: true,
                amount: 0.03,
                margin: '-30px 0px 0px 0px',
              }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="mb-6"
            >
              {/* Seletor para dispositivos móveis */}
              <div className="block lg:hidden w-full mb-4">
                <label className="block text-sm font-medium mb-2 text-muted-foreground">
                  Selecione uma categoria
                </label>
                <Select
                  value={selectedSkillTab}
                  onValueChange={handleTabChange}
                >
                  <SelectTrigger className="w-full max-w-xs bg-card">
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem
                      value="frontend"
                      className="flex items-center gap-2"
                    >
                      <div className="flex items-center gap-2">
                        <Layout className="h-4 w-4 text-primary" />
                        <span>Frontend</span>
                      </div>
                    </SelectItem>
                    <SelectItem
                      value="languages"
                      className="flex items-center gap-2"
                    >
                      <div className="flex items-center gap-2">
                        <CodeSquare className="h-4 w-4 text-primary" />
                        <span>Linguagens</span>
                      </div>
                    </SelectItem>
                    <SelectItem
                      value="backend"
                      className="flex items-center gap-2"
                    >
                      <div className="flex items-center gap-2">
                        <Server className="h-4 w-4 text-primary" />
                        <span>Backend</span>
                      </div>
                    </SelectItem>
                    <SelectItem
                      value="data"
                      className="flex items-center gap-2"
                    >
                      <div className="flex items-center gap-2">
                        <Database className="h-4 w-4 text-primary" />
                        <span>Dados</span>
                      </div>
                    </SelectItem>
                    <SelectItem
                      value="tools-infra"
                      className="flex items-center gap-2"
                    >
                      <div className="flex items-center gap-2">
                        <Wrench className="h-4 w-4 text-primary" />
                        <span>Ferramentas</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Tabs para desktop */}
              <TabsList className="hidden lg:grid grid-cols-5 w-full gap-1">
                <TabsTrigger
                  value="frontend"
                  className="flex items-center gap-1.5"
                >
                  <Layout className="h-4 w-4" />
                  <span>Frontend</span>
                </TabsTrigger>
                <TabsTrigger
                  value="languages"
                  className="flex items-center gap-1.5"
                >
                  <CodeSquare className="h-4 w-4" />
                  <span>Linguagens</span>
                </TabsTrigger>
                <TabsTrigger
                  value="backend"
                  className="flex items-center gap-1.5"
                >
                  <Server className="h-4 w-4" />
                  <span>Backend</span>
                </TabsTrigger>
                <TabsTrigger value="data" className="flex items-center gap-1.5">
                  <Database className="h-4 w-4" />
                  <span>Dados</span>
                </TabsTrigger>
                <TabsTrigger
                  value="tools-infra"
                  className="flex items-center gap-1.5"
                >
                  <Wrench className="h-4 w-4" />
                  <span>Ferramentas</span>
                </TabsTrigger>
              </TabsList>
            </motion.div>

            <TabsContent value="frontend" className="space-y-8">
              <TechSkillItem
                label="Core"
                items={['Html5', 'Css3', 'Vanilla JavaScript']}
                delay={0.1}
              />
              <TechSkillItem
                label="Frameworks & Bibliotecas"
                items={[
                  'Angular',
                  'ReactJS',
                  'Next.js',
                  'VueJS',
                  'AngularJS',
                  'RxJS',
                  'JQuery',
                ]}
                delay={0.2}
              />
              <TechSkillItem
                label="UI & Estilização"
                items={[
                  'Tailwind',
                  'Sass',
                  'Bootstrap',
                  'Styled Components',
                  'Angular Material',
                  'ChakraUI',
                  'Css Modules',
                  'Less',
                ]}
                delay={0.3}
              />
              <TechSkillItem label="Mobile" items={['Ionic 4']} delay={0.4} />
            </TabsContent>

            <TabsContent value="languages" className="space-y-8">
              <TechSkillItem
                label="Linguagens de Programação"
                items={['JavaScript', 'TypeScript', 'Python', 'Elixir']}
                delay={0.1}
              />
            </TabsContent>

            <TabsContent value="backend" className="space-y-8">
              <TechSkillItem
                label="Tecnologias Backend"
                items={['NodeJS', 'Python', 'Elixir']}
                delay={0.1}
              />
              <TechSkillItem
                label="Comunicação"
                items={['Socket.Io', 'REST API', 'GraphQL']}
                delay={0.2}
              />
            </TabsContent>

            <TabsContent value="data" className="space-y-8">
              <TechSkillItem
                label="Bancos de Dados"
                items={['MySQL', 'Postgres', 'MongoDB', 'Firebase Realtime DB']}
                delay={0.1}
              />
            </TabsContent>

            <TabsContent value="tools-infra" className="space-y-8">
              <TechSkillItem
                label="Testes"
                items={['Jest', 'Cypress', 'Karma', 'Protractor']}
                delay={0.1}
              />
              <TechSkillItem
                label="Build & Bundlers"
                items={['Webpack', 'Gulp', 'Grunt']}
                delay={0.2}
              />
              <TechSkillItem
                label="Gerenciadores de Pacotes"
                items={['Npm', 'Yarn', 'Bower']}
                delay={0.3}
              />
              <TechSkillItem
                label="DevOps & CI/CD"
                items={[
                  'Git',
                  'GitHub',
                  'GitFlow',
                  'AWS',
                  'Vercel',
                  'Firebase',
                ]}
                delay={0.4}
              />
              <TechSkillItem
                label="Gestão de Projetos"
                items={['Jira', 'VSTS', 'Scrum', 'Kanban']}
                delay={0.5}
              />
            </TabsContent>
          </Tabs>
        </MotionSection>

        <MotionSection
          id="projects"
          className="py-16"
          delay={0.1}
          skipYAnimation={clickedSection === 'projects'}
        >
          <SectionHeader title="Projetos" />
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.03, margin: '-30px 0px 0px 0px' }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="mb-6"
          >
            <p className="text-muted-foreground">
              Seleção de projetos pessoais que demonstram minhas habilidades
              técnicas e criatividade. Clique nos links para acessar o
              repositório ou a demonstração.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Task Management App */}
            <motion.div
              className="group relative overflow-hidden rounded-xl border bg-card shadow-sm transition-all hover:shadow-lg"
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{
                once: true,
                amount: 0.1,
                margin: '-20px 0px 0px 0px',
              }}
              transition={{
                duration: 0.5,
                delay: 0.05,
                type: 'spring',
                stiffness: 100,
                damping: 15,
              }}
              whileHover={{
                y: -8,
                boxShadow:
                  '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                transition: { duration: 0.3 },
              }}
            >
              <div className="aspect-video w-full bg-muted/40 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/0 z-10"></div>
                <motion.div
                  className="absolute inset-0 bg-primary/20"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                ></motion.div>
                <motion.div
                  className="w-full h-full flex items-center justify-center text-4xl font-bold text-primary/20"
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <Rocket className="w-20 h-20 opacity-40" />
                </motion.div>
                <div className="absolute bottom-2 left-2 z-20">
                  <span className="bg-primary/90 text-primary-foreground text-xs px-2 py-1 rounded">
                    TypeScript
                  </span>
                </div>
              </div>

              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold">Task Management App</h3>
                  <div className="flex gap-2">
                    <a
                      href="https://github.com/dominguetigs/task-management-app"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                      aria-label="Ver código no GitHub"
                    >
                      <Github className="h-5 w-5" />
                    </a>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Aplicativo de gerenciamento de tarefas construído com
                  React/NextJS e TypeScript.
                </p>
                <div className="flex flex-wrap gap-1 mb-4">
                  <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded">
                    React
                  </span>
                  <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded">
                    NextJS
                  </span>
                  <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded">
                    TypeScript
                  </span>
                </div>
                <a
                  href="https://github.com/dominguetigs/task-management-app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  Ver repositório
                  <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              </div>
            </motion.div>

            {/* Chat Bot Experiment */}
            <motion.div
              className="group relative overflow-hidden rounded-xl border bg-card shadow-sm transition-all hover:shadow-lg"
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{
                once: true,
                amount: 0.1,
                margin: '-20px 0px 0px 0px',
              }}
              transition={{
                duration: 0.5,
                delay: 0.15,
                type: 'spring',
                stiffness: 100,
                damping: 15,
              }}
              whileHover={{
                y: -8,
                boxShadow:
                  '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                transition: { duration: 0.3 },
              }}
            >
              <div className="aspect-video w-full bg-muted/40 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/0 z-10"></div>
                <motion.div
                  className="absolute inset-0 bg-primary/20"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                ></motion.div>
                <motion.div
                  className="w-full h-full flex items-center justify-center text-4xl font-bold text-primary/20"
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <Rocket className="w-20 h-20 opacity-40" />
                </motion.div>
                <div className="absolute bottom-2 left-2 z-20">
                  <span className="bg-primary/90 text-primary-foreground text-xs px-2 py-1 rounded">
                    TypeScript
                  </span>
                </div>
              </div>

              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold">Chat Bot Experiment</h3>
                  <div className="flex gap-2">
                    <a
                      href="https://github.com/dominguetigs/chat-bot-experiment"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                      aria-label="Ver código no GitHub"
                    >
                      <Github className="h-5 w-5" />
                    </a>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Experimento de chatbot construído com React e Vite utilizando
                  TypeScript.
                </p>
                <div className="flex flex-wrap gap-1 mb-4">
                  <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded">
                    React
                  </span>
                  <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded">
                    Vite
                  </span>
                  <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded">
                    TypeScript
                  </span>
                </div>
                <a
                  href="https://github.com/dominguetigs/chat-bot-experiment"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  Ver repositório
                  <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              </div>
            </motion.div>

            {/* JS Funcional */}
            <motion.div
              className="group relative overflow-hidden rounded-xl border bg-card shadow-sm transition-all hover:shadow-lg"
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{
                once: true,
                amount: 0.1,
                margin: '-20px 0px 0px 0px',
              }}
              transition={{
                duration: 0.5,
                delay: 0.25,
                type: 'spring',
                stiffness: 100,
                damping: 15,
              }}
              whileHover={{
                y: -8,
                boxShadow:
                  '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                transition: { duration: 0.3 },
              }}
            >
              <div className="aspect-video w-full bg-muted/40 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/0 z-10"></div>
                <motion.div
                  className="absolute inset-0 bg-primary/20"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                ></motion.div>
                <motion.div
                  className="w-full h-full flex items-center justify-center text-4xl font-bold text-primary/20"
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <Rocket className="w-20 h-20 opacity-40" />
                </motion.div>
                <div className="absolute bottom-2 left-2 z-20">
                  <span className="bg-primary/90 text-primary-foreground text-xs px-2 py-1 rounded">
                    JavaScript
                  </span>
                </div>
              </div>

              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold">JS Funcional</h3>
                  <div className="flex gap-2">
                    <a
                      href="https://github.com/dominguetigs/js-funcional"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                      aria-label="Ver código no GitHub"
                    >
                      <Github className="h-5 w-5" />
                    </a>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Conceitos de programação funcional utilizando a linguagem
                  Javascript.
                </p>
                <div className="flex flex-wrap gap-1 mb-4">
                  <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded">
                    JavaScript
                  </span>
                  <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded">
                    Functional
                  </span>
                </div>
                <a
                  href="https://github.com/dominguetigs/js-funcional"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  Ver repositório
                  <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              </div>
            </motion.div>

            {/* PS Scheduler */}
            <motion.div
              className="group relative overflow-hidden rounded-xl border bg-card shadow-sm transition-all hover:shadow-lg"
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{
                once: true,
                amount: 0.1,
                margin: '-20px 0px 0px 0px',
              }}
              transition={{
                duration: 0.5,
                delay: 0.35,
                type: 'spring',
                stiffness: 100,
                damping: 15,
              }}
              whileHover={{
                y: -8,
                boxShadow:
                  '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                transition: { duration: 0.3 },
              }}
            >
              <div className="aspect-video w-full bg-muted/40 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/0 z-10"></div>
                <motion.div
                  className="absolute inset-0 bg-primary/20"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                ></motion.div>
                <motion.div
                  className="w-full h-full flex items-center justify-center text-4xl font-bold text-primary/20"
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <Rocket className="w-20 h-20 opacity-40" />
                </motion.div>
                <div className="absolute bottom-2 left-2 z-20">
                  <span className="bg-primary/90 text-primary-foreground text-xs px-2 py-1 rounded">
                    TypeScript
                  </span>
                </div>
              </div>

              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold">PS Scheduler</h3>
                  <div className="flex gap-2">
                    <a
                      href="https://github.com/dominguetigs/ps-scheduler"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                      aria-label="Ver código no GitHub"
                    >
                      <Github className="h-5 w-5" />
                    </a>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Aplicação web e mobile para agendar mensagens para contatos.
                </p>
                <div className="flex flex-wrap gap-1 mb-4">
                  <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded">
                    TypeScript
                  </span>
                  <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded">
                    Web
                  </span>
                  <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded">
                    Mobile
                  </span>
                </div>
                <a
                  href="https://github.com/dominguetigs/ps-scheduler"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  Ver repositório
                  <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              </div>
            </motion.div>

            {/* Snake Game */}
            <motion.div
              className="group relative overflow-hidden rounded-xl border bg-card shadow-sm transition-all hover:shadow-lg"
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{
                once: true,
                amount: 0.1,
                margin: '-20px 0px 0px 0px',
              }}
              transition={{
                duration: 0.5,
                delay: 0.45,
                type: 'spring',
                stiffness: 100,
                damping: 15,
              }}
              whileHover={{
                y: -8,
                boxShadow:
                  '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                transition: { duration: 0.3 },
              }}
            >
              <div className="aspect-video w-full bg-muted/40 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/0 z-10"></div>
                <motion.div
                  className="absolute inset-0 bg-primary/20"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                ></motion.div>
                <motion.div
                  className="w-full h-full flex items-center justify-center text-4xl font-bold text-primary/20"
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <Rocket className="w-20 h-20 opacity-40" />
                </motion.div>
                <div className="absolute bottom-2 left-2 z-20">
                  <span className="bg-primary/90 text-primary-foreground text-xs px-2 py-1 rounded">
                    JavaScript
                  </span>
                </div>
              </div>

              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold">Snake Game</h3>
                  <div className="flex gap-2">
                    <a
                      href="https://github.com/dominguetigs/snake-game"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                      aria-label="Ver código no GitHub"
                    >
                      <Github className="h-5 w-5" />
                    </a>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Jogo da cobrinha em JavaScript e Canvas.
                </p>
                <div className="flex flex-wrap gap-1 mb-4">
                  <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded">
                    JavaScript
                  </span>
                  <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded">
                    Canvas
                  </span>
                  <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded">
                    Game
                  </span>
                </div>
                <a
                  href="https://github.com/dominguetigs/snake-game"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  Ver repositório
                  <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              </div>
            </motion.div>

            {/* Memory Game */}
            <motion.div
              className="group relative overflow-hidden rounded-xl border bg-card shadow-sm transition-all hover:shadow-lg"
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{
                once: true,
                amount: 0.1,
                margin: '-20px 0px 0px 0px',
              }}
              transition={{
                duration: 0.5,
                delay: 0.55,
                type: 'spring',
                stiffness: 100,
                damping: 15,
              }}
              whileHover={{
                y: -8,
                boxShadow:
                  '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                transition: { duration: 0.3 },
              }}
            >
              <div className="aspect-video w-full bg-muted/40 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/0 z-10"></div>
                <motion.div
                  className="absolute inset-0 bg-primary/20"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                ></motion.div>
                <motion.div
                  className="w-full h-full flex items-center justify-center text-4xl font-bold text-primary/20"
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <Rocket className="w-20 h-20 opacity-40" />
                </motion.div>
                <div className="absolute bottom-2 left-2 z-20">
                  <span className="bg-primary/90 text-primary-foreground text-xs px-2 py-1 rounded">
                    JavaScript
                  </span>
                </div>
              </div>

              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold">Memory Game</h3>
                  <div className="flex gap-2">
                    <a
                      href="https://github.com/dominguetigs/memory-game"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                      aria-label="Ver código no GitHub"
                    >
                      <Github className="h-5 w-5" />
                    </a>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Jogo da memória utilizando JS e WEBPACK.
                </p>
                <div className="flex flex-wrap gap-1 mb-4">
                  <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded">
                    JavaScript
                  </span>
                  <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded">
                    Webpack
                  </span>
                  <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded">
                    Game
                  </span>
                </div>
                <a
                  href="https://github.com/dominguetigs/memory-game"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  Ver repositório
                  <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              </div>
            </motion.div>
          </div>

          <motion.div
            className="mt-12 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5, delay: 0.7, type: 'spring' }}
          >
            <a
              href="https://github.com/dominguetigs?tab=repositories"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary px-5 py-2.5 rounded-full transition-all font-medium hover:scale-105 hover:shadow-md"
            >
              <Github className="h-4 w-4" />
              Ver mais projetos no GitHub
              <ExternalLink className="h-3 w-3" />
            </a>
          </motion.div>
        </MotionSection>

        <MotionSection
          id="experience"
          className="py-16"
          delay={0.1}
          skipYAnimation={clickedSection === 'experience'}
        >
          <SectionHeader title="Experiência Profissional" />
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.03, margin: '-30px 0px 0px 0px' }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="mb-8"
          >
            <p className="text-muted-foreground">
              Minha jornada profissional inclui experiência em diferentes
              setores e projetos, sempre focando em desenvolvimento frontend e
              entrega de valor.
            </p>
          </motion.div>
          <div className="space-y-2">
            <ExperienceItem
              period="2023 – Atual"
              title="Líder Técnico Frontend • Engenheiro Frontend"
              company="Tagme"
              location="Rio de Janeiro, RJ"
              description={
                <>
                  <div className="absolute -top-3 right-5 md:right-5 sm:right-2 xs:right-0 bg-primary text-background dark:text-white text-xs px-2 py-1 rounded-md shadow-sm z-10">
                    Atual
                  </div>
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-primary font-medium">
                        Abr 2024 – Atual
                      </span>
                      <span className="text-sm bg-primary/10 px-2 py-0.5 rounded">
                        Líder Técnico Frontend
                      </span>
                    </div>
                    <div className="mb-4">
                      <h4 className="font-medium mb-2 text-sm uppercase tracking-wide text-primary/70">
                        Responsabilidades
                      </h4>
                      <ul className="space-y-2">
                        {[
                          'Responsável pela liderança da arquitetura Front-end da empresa, promovendo a aplicação de boas práticas e desenvolvendo bibliotecas reutilizáveis.',
                          'Liderança e execução na criação de um sistema de cardápios customizável, utilizando Next.js/React.js, garantindo flexibilidade e escalabilidade.',
                          'Liderança e desenvolvimento de um sistema administrativo centralizado para gestão dos produtos da empresa, utilizando tecnologias como NX, microfrontends, Dynamic Federation e Angular 18.',
                        ].map((item, idx) => (
                          <motion.li
                            key={`lead-${idx}`}
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{
                              once: true,
                              amount: 0.05,
                              margin: '-20px 0px 0px 0px',
                            }}
                            transition={{
                              duration: 0.3,
                              delay: 0.1 + idx * 0.05,
                              type: 'tween',
                            }}
                            className="flex gap-2"
                          >
                            <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-primary font-medium">
                        Nov 2023 – Atual
                      </span>
                      <span className="text-sm bg-primary/10 px-2 py-0.5 rounded">
                        Engenheiro Frontend
                      </span>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2 text-sm uppercase tracking-wide text-primary/70">
                        Responsabilidades
                      </h4>
                      <ul className="space-y-2">
                        {[
                          'Manutenção de sistema customizado de cardápios.',
                          'Manutenção e novas features de Admin para configuração dos cardápios.',
                          'Utilização das tecnologias Angular, React/Next, e Tailwind CSS.',
                        ].map((item, idx) => (
                          <motion.li
                            key={`eng-${idx}`}
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{
                              once: true,
                              amount: 0.05,
                              margin: '-20px 0px 0px 0px',
                            }}
                            transition={{
                              duration: 0.3,
                              delay: 0.1 + idx * 0.05,
                              type: 'tween',
                            }}
                            className="flex gap-2"
                          >
                            <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </>
              }
              responsibilities={[]}
              technologies={[
                'Angular',
                'React',
                'Next.js',
                'Tailwind CSS',
                'TypeScript',
                'NX',
                'Microfrontends',
                'Dynamic Federation',
              ]}
              delay={0.09}
              className="border-l-4 border-primary/60 shadow-md"
            />

            <ExperienceItem
              period="2022 – 2023"
              title="Engenheiro Frontend"
              company="Skeelo"
              location="São Paulo, SP"
              description="Experiência em uma equipe dedicada ao desenvolvimento dos projetos Web em uma empresa do ramo literário/educacional."
              responsibilities={[
                'CMS construído em Vue.js 2.0.',
                'Landing pages para Ebooks, Audiobooks e Minibooks, desenvolvidas em Angular 10.',
                'Novo site institucional utilizando Next.js/React.',
                'Loja Skeelo implementada com Shopify, customizada com JavaScript e Sass.',
                'Desenvolvimento do novo Webapp em ReactJS, replicando as funcionalidades do app.',
                'Projeto para o leitor web, oferecendo aos usuários a opção de ler pelo computador.',
                'Participação ativa na definição da arquitetura dos projetos Front-end.',
                'Contribuição na mentoria de estagiários/juniores da equipe.',
              ]}
              technologies={[
                'Vue.js',
                'Angular',
                'Next.js',
                'React',
                'Shopify',
                'Sass',
                'JavaScript',
              ]}
              delay={0.2}
            />

            <ExperienceItem
              period="2021 – 2022"
              title="Engenheiro Frontend"
              company="Zup Innovation"
              location="São Paulo, SP"
              description=""
              responsibilities={[
                'Experiência na squad Pj Emps da tribo de Seguros do banco Itaú.',
                'Desenvolvimento do fluxo completo para consultores de seguros.',
                'Criação de telas de relatório e agenda para consultores.',
                'Utilização de monorepo com o framework Nx.',
                'Desenvolvimento predominante em Angular, com partes em React e webcomponents.',
                'Implementação de testes unitários com Jest.',
                'Utilização do Gitflow para gerenciamento do código.',
                'Configuração de build/deploy em esteiras da AWS.',
              ]}
              technologies={[
                'Angular',
                'React',
                'Web Components',
                'Jest',
                'Nx',
                'AWS',
                'GitFlow',
              ]}
              delay={0.25}
            />

            <ExperienceItem
              period="2021 – 2021"
              title="Engenheiro de Software"
              company="Prevent Senior"
              location="São Paulo, SP"
              description="Experiência na Prevent Senior, fazendo parte de uma equipe responsável por diversas frentes."
              responsibilities={[
                'Atuação em projetos legados construídos em JSP (JavaServer Pages) e incorporação de jQuery.',
                'Participação em segmentos migrados para Angular 4+, contribuindo para a modernização.',
                'Envolvimento em diversas frentes, incluindo Plantão, Credenciamento, Corporativo e Blindagem.',
              ]}
              technologies={['JSP', 'jQuery', 'Angular', 'JavaScript']}
              delay={0.3}
            />

            <ExperienceItem
              period="2020 – 2021"
              title="Engenheiro de Software"
              company="Comexport"
              location="São Paulo, SP"
              description="Participação na equipe responsável pelo principal produto da empresa, gerenciando todo o fluxo de trading."
              responsibilities={[
                'Trabalho intensivo com Angular, começando com a versão 4 e migrando para a versão 10.',
              ]}
              technologies={['Angular', 'TypeScript', 'RxJS', 'SCSS']}
              delay={0.35}
            />

            <ExperienceItem
              period="2019 – 2020"
              title="Desenvolvedor de Software"
              company="Digesto Pesquisa e Banco de Dados"
              location="São Paulo, SP"
              description="No Digesto, fiz parte de um time onde a principal responsabilidade era dar suporte/customizar/promover o principal produto da empresa - Digesto Informações processuais - onde o cliente - advogados, escritórios de advocacia e empresas que queriam melhor controle de seu jurídico - tinham disponível uma plataforma em que conseguiam monitorar seus processos, acompanhar e distribuir os mesmos e através disso obter informações concretas."
              responsibilities={[
                'Desenvolvimento Frontend com Angular 7, 8, 9, Sass, HTML5 e Angular Material.',
                'Testes E2E com Cypress.',
                'Desenvolvimento Backend com Python, Flask e Flask Potion.',
                'Manipulação de banco de dados com MySQL e PostgreSQL.',
                'Controle de versão com Git.',
                'Mentoria na área de Frontend, com foco em Angular e alguma atuação em React.',
                "Participação em Digesto Talks, com uma palestra sobre 'Angular e Conceitos'.",
                'Atuação como UX Designer, prototipando telas para projetos diversos.',
                'Atuação como Scrum Master, responsável pelo planejamento de sprints e daily meetings.',
                'Participação em projetos importantes do Governo, incluindo STF Jurisprudência e STF CMS.',
                'Suporte ao cliente e orientação para a utilização do sistema.',
              ]}
              technologies={[
                'Angular',
                'Angular Material',
                'Sass',
                'HTML5',
                'Cypress',
                'Python',
                'Flask',
                'MySQL',
                'PostgreSQL',
                'Git',
                'Scrum',
              ]}
              delay={0.4}
              className="border-l-4 border-primary/60 shadow-md"
            />

            <ExperienceItem
              period="2018 – 2019"
              title="Analista de Desenvolvimento"
              company="Cedro Technologies"
              location="São Paulo, SP"
              description="Participação no desenvolvimento de diversos projetos do ramo financeiro, incluindo a construção do Front-end da plataforma ImparCapital desde o início."
              responsibilities={[
                'Utilização de Angular 6 no Frontend para criar interfaces de usuário dinâmicas e responsivas.',
                'Estilização do Frontend utilizando Sass para garantir uma apresentação visual atraente e moderna.',
                'Contribuição no Backend utilizando .NET Core para fornecer a lógica de negócios e funcionalidades necessárias aos sistemas financeiros.',
                'Utilização do banco de dados MySQL para armazenar e gerenciar os dados dos projetos.',
                'Versionamento do código-fonte realizado com Git para facilitar o trabalho colaborativo e rastrear as alterações.',
              ]}
              technologies={['Angular 6', 'Sass', '.NET Core', 'MySQL', 'Git']}
              delay={0.7}
            />

            <ExperienceItem
              period="2018 – 2018"
              title="Web UI Developer"
              company="Grupo Sym"
              location="Divinópolis, MG"
              description="Desenvolvimento de sistema de apoio ao público profissional de Medicina."
              responsibilities={[
                'Desenvolvimento Frontend em um sistema de apoio ao público profissional de Medicina, utilizando AngularJS.',
                'Estilização do Frontend utilizando Sass para garantir uma apresentação visual atraente e consistente.',
                'Contribuição no Backend utilizando .Net Core para fornecer suporte e funcionalidades essenciais ao sistema.',
                'Utilização do Controle de Versão SVN para gerenciar e rastrear alterações no código-fonte.',
                'Customização e implementação de quebra de páginas no editor de texto, semelhante ao Microsoft Word, para melhorar a usabilidade e a experiência do usuário.',
              ]}
              technologies={['AngularJS', 'Sass', '.NET Core', 'SVN']}
              delay={0.5}
            />

            <ExperienceItem
              period="2016 – 2018"
              title="Full Stack Web Developer"
              company="Find Soluções Corporativa Ltda"
              location="Divinópolis, MG"
              description="Desenvolvimento Full Stack em projeto de rede social estudantil."
              responsibilities={[
                'Utilização de AngularJS no Frontend, com Gulp para o fluxo de trabalho e LESS para estilização.',
                'Implementação do Backend com Node.js.',
                'Utilização do banco de dados NoSQL MongoDB.',
                'Integração do Firebase para notificações em tempo real.',
                'Utilização do Socket.IO para construção do chat na plataforma.',
                'Utilização do Google Analytics para mapeamento da interação do usuário.',
                'Controle de versão realizado com Git.',
              ]}
              technologies={[
                'AngularJS',
                'Node.js',
                'MongoDB',
                'Firebase',
                'Socket.IO',
                'LESS',
                'Gulp',
                'Git',
                'Google Analytics',
              ]}
              delay={0.55}
            />
          </div>
        </MotionSection>

        <MotionSection
          id="education"
          className="py-16"
          delay={0.1}
          skipYAnimation={clickedSection === 'education'}
        >
          <SectionHeader title="Educação" />
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.03, margin: '-30px 0px 0px 0px' }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="mb-6"
          >
            <p className="text-muted-foreground">
              Minha formação acadêmica e cursos complementares que contribuíram
              para o meu desenvolvimento profissional e aprimoramento técnico na
              área de desenvolvimento.
            </p>
          </motion.div>

          <div className="space-y-10">
            <div>
              <h3 className="text-xl font-semibold mb-4 text-primary flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                <span>Formação Acadêmica</span>
              </h3>

              <div className="mb-8">
                <EducationItem
                  period="2013-2017"
                  type="Bacharelado"
                  institution="Pitágoras"
                  course="Engenharia de Controle e Automação"
                  location="Divinópolis"
                  description="Formação com foco em automação industrial, sistemas de controle, programação, eletrônica e gestão de projetos."
                  delay={0.15}
                  showTimeline={false}
                />
                <EducationItem
                  period="2010-2011"
                  type="Técnico"
                  institution="CECON"
                  course="Análises clínicas"
                  location="Divinópolis"
                  description="Curso técnico em análises laboratoriais, desenvolvendo habilidades analíticas e metodológicas."
                  delay={0.2}
                  showTimeline={false}
                />
                <EducationItem
                  period="2003-2004"
                  type="Técnico"
                  institution="INFO"
                  course="Informática"
                  location="Varginha"
                  description="Curso técnico em informática, com foco em manutenção de computadores e fundamentos de programação."
                  delay={0.25}
                  isLast={true}
                  showTimeline={false}
                />
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4 text-primary flex items-center gap-2">
                <Award className="h-5 w-5" />
                <span>Cursos e Certificações</span>
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-0 mt-0">
                <div>
                  <EducationItem
                    period="2021–2023"
                    type="Curso"
                    institution="Rocketseat"
                    course="Ignite - ReactJS"
                    description="Curso avançado de ReactJS, abordando conceitos como Context API, Hooks, React Query, e desenvolvimento de aplicações modernas."
                    delay={0.15}
                    showTimeline={false}
                  />
                  <EducationItem
                    period="21 horas"
                    type="Curso"
                    institution="desenvolvedor.io"
                    course="Desenvolvimento Avançado em Angular"
                    description="Aprofundamento em Angular, incluindo arquitetura de componentes, gerenciamento de estado, performance e técnicas avançadas."
                    delay={0.2}
                    showTimeline={false}
                  />
                  <EducationItem
                    period="30 horas"
                    type="Curso"
                    institution="Cod3r"
                    course="Javascript Funcional e Reativo"
                    description="Programação funcional e reativa com JavaScript, explorando paradigmas funcionais e uso de RxJS."
                    delay={0.25}
                    isLast={true}
                    showTimeline={false}
                  />
                </div>

                <div>
                  <EducationItem
                    period="4 horas"
                    type="Curso"
                    institution="Domestika"
                    course="Programação Criativa: produza peças visuais com Javascript"
                    description="Curso de programação criativa com JavaScript para criar visualizações e animações interativas."
                    delay={0.15}
                    showTimeline={false}
                  />
                  <EducationItem
                    period="39 aulas"
                    type="Curso"
                    institution="Udemy"
                    course="Protótipos rápidos e funcionais com Figma"
                    description="Criação de protótipos de alta fidelidade usando Figma, com foco em UX/UI Design e prototipagem interativa."
                    delay={0.2}
                    showTimeline={false}
                  />
                  <EducationItem
                    period="8 horas"
                    type="Curso"
                    institution="Data Science Academy"
                    course="Inteligência Artificial Fundamentos"
                    description="Introdução aos conceitos fundamentais de inteligência artificial e aplicações práticas."
                    delay={0.25}
                    isLast={true}
                    showTimeline={false}
                  />
                </div>
              </div>
            </div>
          </div>
        </MotionSection>

        <MotionSection
          id="languages"
          className="py-16"
          delay={0.1}
          skipYAnimation={clickedSection === 'languages'}
        >
          <SectionHeader title="Idiomas" />
          <div className="space-y-8 md:space-y-8">
            <div className="mb-6">
              <p className="text-muted-foreground mb-4">
                Avaliação de habilidades linguísticas baseada no Quadro Europeu
                Comum de Referência para Línguas (QECR).
              </p>
            </div>

            <LanguageItem
              language="Português"
              level="Nativo (C2)"
              reading={5}
              writing={5}
              speaking={5}
              listening={5}
              flag="/flags/brazil.svg"
              delay={0.2}
            />

            <LanguageItem
              language="Inglês"
              level="Intermediário (B1/B2)"
              reading={4}
              writing={3}
              speaking={3}
              listening={4}
              flag="/flags/usa.svg"
              delay={0.3}
            />

            <LanguageItem
              language="Espanhol"
              level="Básico (A2)"
              reading={2}
              writing={1}
              speaking={1}
              listening={2}
              flag="/flags/spain.svg"
              delay={0.4}
            />
          </div>
        </MotionSection>
      </div>

      <footer className="mt-16 pb-8 text-center text-sm text-muted-foreground">
        <p className="flex items-center justify-center gap-1.5">
          Feito com{' '}
          <motion.span
            className="text-primary"
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut',
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-heart"
            >
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>
          </motion.span>{' '}
          por{' '}
          <a
            href="https://linkedin.com/in/dominguetigs"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary font-semibold hover:underline hover:brightness-110 transition-all cursor-pointer"
          >
            Gustavo Domingueti
          </a>
        </p>
      </footer>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Layout, CodeSquare, Server, Database, Wrench } from 'lucide-react';
import { SectionHeader } from '@/components/section-header';
import { MotionSection } from '@/components/motion-section';
import { TechSkillItem } from '@/components/tech-skill-item';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function SkillsSection() {
  const [selectedSkillTab, setSelectedSkillTab] = useState('frontend');
  const [hasAnimated, setHasAnimated] = useState(false);
  const [refSkills, inViewSkills] = useInView({
    triggerOnce: true,
    threshold: 0.05,
    rootMargin: '-20px 0px 0px 0px',
  });

  const handleTabChange = (value: string) => {
    setSelectedSkillTab(value);
  };

  // Efeito para animar a troca de categoria quando a seção aparecer pela primeira vez
  useEffect(() => {
    if (inViewSkills && !hasAnimated) {
      // Apenas marcar como animado para que os componentes TechSkillItem possam usar seus próprios efeitos de animação
      setHasAnimated(true);
    }
  }, [inViewSkills, hasAnimated]);

  return (
    <MotionSection id="skills" className="py-16" delay={0.1} ref={refSkills}>
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
            <Select value={selectedSkillTab} onValueChange={handleTabChange}>
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
                <SelectItem value="backend" className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    <Server className="h-4 w-4 text-primary" />
                    <span>Backend</span>
                  </div>
                </SelectItem>
                <SelectItem value="data" className="flex items-center gap-2">
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
            <TabsTrigger value="frontend" className="flex items-center gap-1.5">
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
            <TabsTrigger value="backend" className="flex items-center gap-1.5">
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
            items={['Git', 'GitHub', 'GitFlow', 'AWS', 'Vercel', 'Firebase']}
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
  );
}

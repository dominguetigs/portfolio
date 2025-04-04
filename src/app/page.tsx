'use client';

import { useRef, useState } from 'react';
import { ThemeToggle } from '@/components/theme-toggle';
import { HeroSection } from '@/components/hero-section';
import { NavMenu } from '@/components/nav-menu';
import { MotionSection } from '@/components/motion-section';
import { SectionHeader } from '@/components/section-header';
import { TechSkillItem } from '@/components/tech-skill-item';
import { ExperienceItem } from '@/components/experience-item';
import { EducationItem } from '@/components/education-item';
import { motion } from 'framer-motion';
import {
  GraduationCap,
  Award,
  Check,
  Layout,
  CodeSquare,
  Server,
  Database,
  Wrench,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const sections = [
  { id: 'about', label: 'Sobre' },
  { id: 'skills', label: 'Habilidades' },
  { id: 'experience', label: 'Experiência Profissional' },
  { id: 'education', label: 'Educação' },
  { id: 'languages', label: 'Idiomas' },
];

export default function Home() {
  const aboutRef = useRef<HTMLElement>(null);
  const [selectedSkillTab, setSelectedSkillTab] = useState('frontend');

  const scrollToAbout = () => {
    aboutRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleTabChange = (value: string) => {
    setSelectedSkillTab(value);
  };

  return (
    <div className="min-h-screen pb-20">
      <div className="absolute top-4 right-4 z-50">
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

      <NavMenu sections={sections} />

      <div className="container mx-auto px-4 max-w-5xl lg:pl-[180px]">
        <MotionSection id="about" ref={aboutRef} className="py-16">
          <SectionHeader title="Sobre" />
          <div className="prose prose-lg dark:prose-invert">
            <p className="mb-4">
              Desenvolvedor Frontend com quase 10 anos de experiência no
              desenvolvimento de aplicações web, atuando em projetos complexos e
              de alto impacto. Forte expertise em JavaScript, TypeScript, HTML e
              CSS, com especialização em Angular, React e Next.js além das
              melhores práticas em arquitetura de software e performance.
            </p>
            <p className="mb-4">
              Experiência nos setores de restaurantes, fintechs, educação e
              saúde, liderando o desenvolvimento de sistemas escaláveis e
              modernos. Habilidade em monorepos (Nx), testes automatizados
              (Jest, Cypress), microfrontends (Module Federation) e
              infraestrutura em nuvem (AWS, Firebase, Vercel). Conhecimento
              avançado em design system, acessibilidade e UI/UX.
            </p>
            <p>
              Experiência comprovada na mentoria de desenvolvedores, liderança
              de times e facilitação da migração de sistemas legados para
              tecnologias modernas. Sempre atualizado com as melhores práticas
              do mercado, buscando constantemente aprender, inovar e otimizar
              processos de desenvolvimento.
            </p>
          </div>
        </MotionSection>

        <MotionSection id="skills" className="py-16" delay={0.1}>
          <SectionHeader title="Habilidades" />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
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
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
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

        <MotionSection id="experience" className="py-16" delay={0.1}>
          <SectionHeader title="Experiência Profissional" />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
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
                            animate={{ opacity: 1, x: 0 }}
                            transition={{
                              duration: 0.3,
                              delay: 0.1 + idx * 0.05,
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
                            animate={{ opacity: 1, x: 0 }}
                            transition={{
                              duration: 0.3,
                              delay: 0.1 + idx * 0.05,
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
              delay={0.1}
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
              delay={0.3}
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
              delay={0.4}
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
              delay={0.5}
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
              delay={0.6}
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
              delay={0.8}
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
              delay={0.9}
            />
          </div>
        </MotionSection>

        <MotionSection id="education" className="py-16" delay={0.1}>
          <SectionHeader title="Educação" />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
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
                  delay={0.1}
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
                  delay={0.3}
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
                    delay={0.4}
                    showTimeline={false}
                  />
                  <EducationItem
                    period="21 horas"
                    type="Curso"
                    institution="desenvolvedor.io"
                    course="Desenvolvimento Avançado em Angular"
                    description="Aprofundamento em Angular, incluindo arquitetura de componentes, gerenciamento de estado, performance e técnicas avançadas."
                    delay={0.5}
                    showTimeline={false}
                  />
                  <EducationItem
                    period="30 horas"
                    type="Curso"
                    institution="Cod3r"
                    course="Javascript Funcional e Reativo"
                    description="Programação funcional e reativa com JavaScript, explorando paradigmas funcionais e uso de RxJS."
                    delay={0.6}
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
                    delay={0.7}
                    showTimeline={false}
                  />
                  <EducationItem
                    period="39 aulas"
                    type="Curso"
                    institution="Udemy"
                    course="Protótipos rápidos e funcionais com Figma"
                    description="Criação de protótipos de alta fidelidade usando Figma, com foco em UX/UI Design e prototipagem interativa."
                    delay={0.8}
                    showTimeline={false}
                  />
                  <EducationItem
                    period="8 horas"
                    type="Curso"
                    institution="Data Science Academy"
                    course="Inteligência Artificial Fundamentos"
                    description="Introdução aos conceitos fundamentais de inteligência artificial e aplicações práticas."
                    delay={0.9}
                    isLast={true}
                    showTimeline={false}
                  />
                </div>
              </div>
            </div>
          </div>
        </MotionSection>

        <MotionSection id="languages" className="py-16" delay={0.1}>
          <SectionHeader title="Idiomas" />
          <div className="space-y-6">
            <motion.div
              className="flex items-center justify-between"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-baseline gap-2">
                <motion.span
                  className="font-semibold"
                  whileHover={{ color: 'var(--primary)' }}
                >
                  Português
                </motion.span>
                <span className="text-muted-foreground text-sm">(Nativo)</span>
              </div>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(i => (
                  <motion.div
                    key={i}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{
                      duration: 0.4,
                      delay: 0.3 + i * 0.1,
                      type: 'spring',
                      stiffness: 200,
                    }}
                    whileHover={{
                      scaleY: 1.5,
                      transition: { duration: 0.2 },
                    }}
                    className="w-5 h-2 bg-primary rounded-full"
                    style={{ originX: 0 }}
                  ></motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="flex items-center justify-between"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-baseline gap-2">
                <motion.span
                  className="font-semibold"
                  whileHover={{ color: 'var(--primary)' }}
                >
                  Inglês
                </motion.span>
                <span className="text-muted-foreground text-sm">
                  (Intermediário)
                </span>
              </div>
              <div className="flex gap-1">
                {[1, 2, 3].map(i => (
                  <motion.div
                    key={i}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{
                      duration: 0.4,
                      delay: 0.4 + i * 0.1,
                      type: 'spring',
                      stiffness: 200,
                    }}
                    whileHover={{
                      scaleY: 1.5,
                      transition: { duration: 0.2 },
                    }}
                    className="w-5 h-2 bg-primary rounded-full"
                    style={{ originX: 0 }}
                  ></motion.div>
                ))}
                {[4, 5].map(i => (
                  <motion.div
                    key={i}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{
                      duration: 0.4,
                      delay: 0.4 + i * 0.1,
                      type: 'spring',
                      stiffness: 200,
                    }}
                    whileHover={{
                      scaleY: 1.5,
                      transition: { duration: 0.2 },
                    }}
                    className="w-5 h-2 bg-muted rounded-full"
                    style={{ originX: 0 }}
                  ></motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </MotionSection>
      </div>
    </div>
  );
}

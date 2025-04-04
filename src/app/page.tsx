'use client';

import { useRef } from 'react';
import { ThemeToggle } from '@/components/theme-toggle';
import { HeroSection } from '@/components/hero-section';
import { NavMenu } from '@/components/nav-menu';
import { MotionSection } from '@/components/motion-section';
import { SectionHeader } from '@/components/section-header';
import { TechSkillItem } from '@/components/tech-skill-item';
import { ExperienceItem } from '@/components/experience-item';
import { EducationItem } from '@/components/education-item';

const sections = [
  { id: 'about', label: 'Sobre' },
  { id: 'skills', label: 'Habilidades' },
  { id: 'experience', label: 'Experiência' },
  { id: 'education', label: 'Educação' },
  { id: 'languages', label: 'Idiomas' },
];

export default function Home() {
  const aboutRef = useRef<HTMLElement>(null);

  const scrollToAbout = () => {
    aboutRef.current?.scrollIntoView({ behavior: 'smooth' });
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
          <div className="space-y-8">
            <div>
              <TechSkillItem
                label="Frontend"
                items={[
                  'Vanilla JavaScript',
                  'JQuery',
                  'Bootstrap',
                  'Html5',
                  'Css3',
                  'AngularJS',
                  'Angular',
                  'Angular Material',
                  'RxJS',
                  'ReactJS',
                  'Next',
                  'Styled Components',
                  'Css Modules',
                  'ChakraUI',
                  'VueJS',
                  'Tailwind',
                ]}
                delay={0.1}
              />
              <TechSkillItem
                label="Transpiladores"
                items={['Less', 'Sass', 'Typescript']}
                delay={0.2}
              />
              <TechSkillItem
                label="Backend"
                items={['NodeJS', 'Python', 'Elixir']}
                delay={0.3}
              />
              <TechSkillItem
                label="Websockets"
                items={['Socket.Io']}
                delay={0.4}
              />
              <TechSkillItem
                label="Testes"
                items={['Protractor', 'Karma', 'Cypress', 'Jest']}
                delay={0.5}
              />
              <TechSkillItem
                label="Task Mng."
                items={['Gulp', 'Grunt', 'Webpack']}
                delay={0.6}
              />
              <TechSkillItem
                label="Pkg Mng."
                items={['Bower', 'Npm', 'Yarn']}
                delay={0.7}
              />
              <TechSkillItem
                label="Database"
                items={[
                  'MySQL',
                  'Postgres',
                  'MongoDB',
                  'Firebase:Realtime Database',
                ]}
                delay={0.8}
              />
              <TechSkillItem label="Mobile" items={['Ionic 4']} delay={0.9} />
              <TechSkillItem
                label="Infraestrutura"
                items={['AWS', 'Firebase', 'Vercel']}
                delay={1.0}
              />
              <TechSkillItem label="ALM" items={['VSTS', 'Jira']} delay={1.1} />
            </div>
          </div>
        </MotionSection>

        <MotionSection id="experience" className="py-16" delay={0.1}>
          <SectionHeader title="Experiência" />
          <div className="space-y-12">
            <ExperienceItem
              period="2023 – Atual"
              title="Engenheiro Frontend"
              company="Tagme"
              location="São Paulo, SP"
              description="Experiência em uma equipe dedicada ao desenvolvimento de sistemas para restaurantes."
              responsibilities={[
                'Liderança na construção de um novo menu customizável para cardápios.',
                'Liderança do front-end geral da empresa, aplicando boas práticas e criando bibliotecas.',
                'Liderança de um time na construção de um novo aplicativo em React Native.',
                'Utilização das tecnologias Angular, React/Next, e Tailwind CSS.',
              ]}
              delay={0.1}
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
              delay={0.2}
            />

            <ExperienceItem
              period="2021 – 2022"
              title="Engenheiro Frontend"
              company="Zup Innovation"
              location="São Paulo, SP"
              description="Experiência na squad Pj Emps da tribo de Seguros do banco Itaú."
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
              delay={0.5}
            />

            <ExperienceItem
              period="2019 – 2020"
              title="Desenvolvedor de Software"
              company="Digesto Pesquisa e Banco de Dados"
              location="São Paulo, SP"
              description="Desenvolvimento de software para pesquisa e banco de dados jurídicos."
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
              delay={0.6}
            />
          </div>
        </MotionSection>

        <MotionSection id="education" className="py-16" delay={0.1}>
          <SectionHeader title="Educação" />
          <div className="space-y-8">
            <EducationItem
              period="2013-2017"
              type="Bacharelado"
              institution="Pitágoras"
              course="Engenharia de Controle e Automação"
              location="Divinópolis"
              delay={0.1}
            />
            <EducationItem
              period="2010-2011"
              type="Técnico"
              institution="CECON"
              course="Análises clínicas"
              location="Divinópolis"
              delay={0.2}
            />
            <EducationItem
              period="2003-2004"
              type="Técnico"
              institution="INFO"
              course="Informática"
              location="Varginha"
              delay={0.3}
            />

            <div className="pt-8">
              <h3 className="text-lg font-semibold mb-4">
                Cursos e Certificações
              </h3>
              <div className="space-y-4">
                <EducationItem
                  period="2021–2023"
                  type="Curso"
                  institution="Rocketseat"
                  course="Ignite, ReactJS"
                  delay={0.4}
                />
                <EducationItem
                  period="4 horas"
                  type="Curso"
                  institution="Domestika"
                  course="Programação Criativa: produza peças visuais com Javascript"
                  delay={0.5}
                />
                <EducationItem
                  period="21 horas"
                  type="Curso"
                  institution="desenvolvedor.io"
                  course="Desenvolvimento Avançado em Angular"
                  delay={0.6}
                />
                <EducationItem
                  period="30 horas"
                  type="Curso"
                  institution="Cod3r"
                  course="Javascript Funcional e Reativo"
                  delay={0.7}
                />
                <EducationItem
                  period="39 aulas"
                  type="Curso"
                  institution="Udemy"
                  course="Protótipos rápidos e funcionais com Figma"
                  delay={0.8}
                />
                <EducationItem
                  period="8 horas"
                  type="Curso"
                  institution="Data Science Academy"
                  course="Introdução à Ciência de Dados 2.0"
                  delay={0.9}
                />
                <EducationItem
                  period="8 horas"
                  type="Curso"
                  institution="Data Science Academy"
                  course="Big Data Fundamentos 2.0"
                  delay={1.0}
                />
                <EducationItem
                  period="8 horas"
                  type="Curso"
                  institution="Data Science Academy"
                  course="Inteligência Artificial Fundamentos"
                  delay={1.1}
                />
              </div>
            </div>
          </div>
        </MotionSection>

        <MotionSection id="languages" className="py-16" delay={0.1}>
          <SectionHeader title="Idiomas" />
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-baseline gap-2">
                <span className="font-semibold">Português</span>
                <span className="text-muted-foreground text-sm">(Nativo)</span>
              </div>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(i => (
                  <div
                    key={i}
                    className="w-5 h-2 bg-primary rounded-full"
                  ></div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-baseline gap-2">
                <span className="font-semibold">Inglês</span>
                <span className="text-muted-foreground text-sm">
                  (Intermediário)
                </span>
              </div>
              <div className="flex gap-1">
                {[1, 2, 3].map(i => (
                  <div
                    key={i}
                    className="w-5 h-2 bg-primary rounded-full"
                  ></div>
                ))}
                {[4, 5].map(i => (
                  <div key={i} className="w-5 h-2 bg-muted rounded-full"></div>
                ))}
              </div>
            </div>
          </div>
        </MotionSection>
      </div>
    </div>
  );
}

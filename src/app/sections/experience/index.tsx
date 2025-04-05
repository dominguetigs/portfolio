import { motion } from 'framer-motion';
import { SectionHeader } from '@/components/section-header';
import { MotionSection } from '@/components/motion-section';
import { ExperienceItem } from '@/components/experience-item';
import { Check } from 'lucide-react';

export function ExperienceSection() {
  return (
    <MotionSection id="experience" className="py-16" delay={0.1}>
      <SectionHeader title="Experiência Profissional" />
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.01, margin: '-10px 0px' }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="mb-8"
      >
        <p className="text-muted-foreground">
          Minha jornada profissional inclui experiência em diferentes setores e
          projetos, sempre focando em desenvolvimento frontend e entrega de
          valor.
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
                          amount: 0.01,
                          margin: '-10px 0px',
                        }}
                        transition={{
                          duration: 0.25,
                          delay: 0.05 + idx * 0.03,
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
                          amount: 0.01,
                          margin: '-10px 0px',
                        }}
                        transition={{
                          duration: 0.25,
                          delay: 0.05 + idx * 0.03,
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
  );
}

import { motion } from 'framer-motion';
import { SectionHeader, MotionSection } from '@/sections/ui';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Github, Rocket } from 'lucide-react';
import Image from 'next/image';

type Project = {
  id: string;
  title: string;
  description: string;
  detailedDescription: string;
  repository: string;
  demo?: string;
  image?: string;
  technologies: string[];
  language: string;
};

export function ProjectsSection() {
  const projects: Project[] = [
    {
      id: 'task-management-app',
      title: 'Task Management App',
      description:
        'Aplicativo de gerenciamento de tarefas construído com React/NextJS e TypeScript.',
      detailedDescription:
        'Uma aplicação completa de gerenciamento de tarefas com recursos como criação, edição, exclusão e filtragem de tarefas. Inclui autenticação de usuários, personalização de temas e armazenamento local. O projeto foi desenvolvido usando React e Next.js com TypeScript para garantir tipagem estática e melhor manutenção do código.',
      repository: 'https://github.com/dominguetigs/task-management-app',
      demo: 'https://task-management-app-gt62.vercel.app/',
      image: '/projects/task-management-app.png',
      technologies: ['React', 'NextJS', 'TypeScript'],
      language: 'TypeScript',
    },
    {
      id: 'chat-bot-experiment',
      title: 'Chat Bot Experiment',
      description:
        'Experimento de chatbot construído com React e Vite utilizando TypeScript.',
      detailedDescription:
        'Um experimento de chatbot que simula conversas usando processamento de linguagem natural básico. O projeto usa React com Vite para um ambiente de desenvolvimento rápido e eficiente. Implementei vários tipos de respostas, incluindo sugestões, links e ações automatizadas para demonstrar as possibilidades de um sistema de chatbot.',
      repository: 'https://github.com/dominguetigs/chat-bot-experiment',
      demo: 'https://chat-bot-experiment.vercel.app/',
      image: '/projects/chat-bot-experiment.png',
      technologies: ['React', 'Vite', 'TypeScript'],
      language: 'TypeScript',
    },
    {
      id: 'js-funcional',
      title: 'JS Funcional',
      description:
        'Conceitos de programação funcional utilizando a linguagem Javascript.',
      detailedDescription:
        'Um projeto para explorar e demonstrar conceitos de programação funcional em JavaScript. Inclui exemplos de funções puras, imutabilidade, funções de primeira classe, composição de funções, currying, e outras técnicas funcionais. O objetivo é mostrar como esses conceitos podem ser aplicados em projetos reais para criar código mais limpo e manutenível.',
      repository: 'https://github.com/dominguetigs/js-funcional',
      technologies: ['JavaScript', 'Functional'],
      language: 'JavaScript',
    },
    {
      id: 'ps-scheduler',
      title: 'PS Scheduler',
      description:
        'Aplicação web e mobile para agendar mensagens para contatos.',
      detailedDescription:
        'PS Scheduler é uma aplicação híbrida que permite aos usuários programar mensagens para serem enviadas automaticamente em datas e horários específicos. Desenvolvida com tecnologias web e empacotada para mobile, a aplicação sincroniza os dados entre dispositivos e oferece opções como mensagens recorrentes, templates personalizados e notificações de entrega.',
      repository: 'https://github.com/dominguetigs/ps-scheduler',
      demo: 'https://ps-scheduler.vercel.app/',
      image: '/projects/ps-scheduler.png',
      technologies: ['TypeScript', 'Web', 'Mobile'],
      language: 'TypeScript',
    },
    {
      id: 'snake-game',
      title: 'Snake Game',
      description: 'Jogo da cobrinha em JavaScript e Canvas.',
      detailedDescription:
        'Uma implementação clássica do jogo da cobrinha (Snake) usando JavaScript e a API Canvas. O jogo inclui diferentes níveis de dificuldade, sistema de pontuação e ranking. Foi desenvolvido com foco em práticas modernas de JavaScript e otimização de desempenho para garantir uma experiência de jogo suave em diversos dispositivos.',
      repository: 'https://github.com/dominguetigs/snake-game',
      image: '/projects/snake-game.png',
      technologies: ['JavaScript', 'Canvas', 'Game'],
      language: 'JavaScript',
    },
    {
      id: 'memory-game',
      title: 'Memory Game',
      description: 'Jogo da memória utilizando JS e WEBPACK.',
      detailedDescription:
        'Um jogo da memória interativo construído com JavaScript e empacotado com Webpack. O jogo oferece diferentes temas e níveis de dificuldade, com animações suaves e responsividade para funcionar em qualquer dispositivo. Implementei um sistema de pontuação baseado no tempo e número de tentativas para adicionar um elemento competitivo.',
      repository: 'https://github.com/dominguetigs/memory-game',
      demo: 'https://dominguetigs.github.io/memory-game/src',
      image: '/projects/memory-game.webp',
      technologies: ['JavaScript', 'Webpack', 'Game'],
      language: 'JavaScript',
    },
  ];

  return (
    <MotionSection id="projects" className="py-16" delay={0.1}>
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
          técnicas e criatividade. Clique nos cards para acessar o repositório
          no GitHub.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map(project => (
          <motion.div
            key={project.id}
            className="group relative overflow-hidden rounded-xl border bg-card hover:bg-card/80 transition-colors shadow-sm cursor-pointer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{
              once: true,
              amount: 0.1,
              margin: '-20px 0px 0px 0px',
            }}
            transition={{
              duration: 0.3,
              delay: 0.05 + projects.indexOf(project) * 0.05,
              ease: 'easeOut',
            }}
            onClick={() => window.open(project.repository, '_blank')}
          >
            <div className="aspect-video w-full bg-muted/40 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 dark:from-black/70 to-black/10 dark:to-black/0 z-10"></div>
              {project.image ? (
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 768px) 100vw, 400px"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Rocket className="w-20 h-20 text-primary/50 dark:text-primary/40" />
                </div>
              )}
              <div className="absolute bottom-2 left-2 z-20">
                <span className="bg-primary/90 text-primary-foreground text-xs px-2 py-1 rounded">
                  {project.language}
                </span>
              </div>
            </div>

            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">{project.title}</h3>
              <p className="text-sm text-muted-foreground mb-2">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-1">
                {project.technologies.map(tech => (
                  <Badge
                    key={`${project.id}-${tech}`}
                    variant="secondary"
                    className="bg-primary/10 text-primary hover:bg-primary/20"
                  >
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="mt-10 text-center"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <a
          href="https://github.com/dominguetigs?tab=repositories"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-5 py-2.5 rounded-full transition-all font-medium w-auto max-w-full overflow-hidden text-ellipsis whitespace-nowrap mx-auto"
        >
          <Github className="h-4 w-4 flex-shrink-0" />
          <span>Ver mais projetos no GitHub</span>
          <ExternalLink className="h-3 w-3 flex-shrink-0" />
        </a>
      </motion.div>
    </MotionSection>
  );
}

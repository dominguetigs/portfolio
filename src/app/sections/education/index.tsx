import { motion } from 'framer-motion';
import { SectionHeader, MotionSection } from '@/app/sections/ui';
import { EducationItem } from './components/education-item';
import { GraduationCap, Award } from 'lucide-react';

export function EducationSection() {
  return (
    <MotionSection id="education" className="py-16" delay={0.1}>
      <SectionHeader title="Educação" />
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.03, margin: '-30px 0px 0px 0px' }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="mb-6"
      >
        <p className="text-muted-foreground">
          Minha formação acadêmica e cursos complementares que contribuíram para
          o meu desenvolvimento profissional e aprimoramento técnico na área de
          desenvolvimento.
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
  );
}

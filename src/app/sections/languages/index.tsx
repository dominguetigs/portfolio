import { SectionHeader } from '@/components/section-header';
import { MotionSection } from '@/components/motion-section';
import { LanguageItem } from '@/components/language-item';

export function LanguagesSection() {
  return (
    <MotionSection id="languages" className="py-16" delay={0.1}>
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
  );
}

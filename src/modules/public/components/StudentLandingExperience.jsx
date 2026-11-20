import { useNavigate } from 'react-router-dom';
import LandingHero from '../../../app/components/landing/LandingHero';
import LandingProcess from '../../../app/components/landing/LandingProcess';
import LandingFeatures from '../../../app/components/landing/LandingFeatures';
import LandingStats from '../../../app/components/landing/LandingStats';
import LandingIntegrations from '../../../app/components/landing/LandingIntegrations';
import LandingFaq from '../../../app/components/landing/LandingFaq';
import LandingFinalCta from '../../../app/components/landing/LandingFinalCta';
import { STUDENT_THEME } from '../../../app/components/landing/landingTheme';
import { PRIMARY_CTA } from './studentLandingJourney.js';
import StudentHeroDecorations from './landing/StudentHeroDecorations';
import StudentMockClassPanel from './landing/StudentMockClassPanel';
import StudentProcessCards from './landing/StudentProcessCards';
import StudentAiPanel from './landing/StudentAiPanel';
import StudentFormsSection from './landing/StudentFormsSection';
import { STUDENT_AI_ITEMS, STUDENT_AI_PANEL_HEADER, STUDENT_FAQ_ITEMS, STUDENT_INTEGRATIONS_LOOP, STUDENT_STATS } from './landing/studentLandingContent';

const CTA = { label: PRIMARY_CTA.label, to: PRIMARY_CTA.href };

// Mirrors app/pages/Landing.jsx section by section with the student theme.
// Header and footer live in StudentLayout so the inner student pages share them.
export default function StudentLandingExperience() {
  const navigate = useNavigate();
  const theme = STUDENT_THEME;

  return (
    <main id="contenido" style={{ position: 'relative', width: '100%', overflow: 'hidden', backgroundColor: '#ffffff', color: '#0F172A', fontFamily: "'Inter', system-ui, sans-serif" }}>
      <LandingHero
        navigate={navigate}
        theme={theme}
        badge="IA para Alumnos"
        title="Entiende qué sigue "
        highlight="después de cada clase"
        titleSuffix="."
        subtitle="Katedra reúne tus materiales, actividades y comentarios para que sepas qué revisar, cómo mejorar y cuál es tu siguiente paso."
        cta={CTA}
        decorations={<StudentHeroDecorations />}
        mockup={<StudentMockClassPanel />}
      />

      <LandingProcess
        theme={theme}
        id="como-funciona"
        eyebrow="Cómo funciona"
        title="De la consigna al siguiente paso en "
        highlight="tres pasos"
        description="Sin buscar entre archivos sueltos. Katedra conecta cada actividad con su material y con lo que te dijo tu profesor."
        cards={<StudentProcessCards />}
      />

      <LandingFeatures
        theme={theme}
        id="ia-para-aprender"
        eyebrow="IA para aprender"
        title="IA para comprender, "
        highlight="no para copiar"
        items={STUDENT_AI_ITEMS}
        panelHeader={STUDENT_AI_PANEL_HEADER}
        renderPanel={(activeFeature) => <StudentAiPanel activeFeature={activeFeature} />}
      />

      <LandingStats theme={theme} title="Todo lo de tu clase, " highlight="en un solo lugar" data={STUDENT_STATS} />

      <LandingIntegrations
        theme={theme}
        id="conexiones"
        eyebrow="Llévalo a donde sea"
        title="Tus materiales, en los formatos "
        highlight="de siempre"
        items={STUDENT_INTEGRATIONS_LOOP}
      />

      <StudentFormsSection navigate={navigate} />

      <LandingFaq theme={theme} id="preguntas" title="Lo que conviene saber." items={STUDENT_FAQ_ITEMS} />

      <LandingFinalCta
        navigate={navigate}
        theme={theme}
        title="Cuando sabes qué sigue, "
        highlight="puedes seguir aprendiendo"
        description="Crea tu cuenta y ten a la mano tus materiales, actividades y comentarios."
        cta={CTA}
      />
    </main>
  );
}

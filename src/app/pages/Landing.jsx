import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Container from '../components/Container';
import Button from '../components/Button';
import Card from '../components/Card';
import FeatureCard from '../components/FeatureCard';
import StatusBadge from '../components/StatusBadge';

export default function Landing() {
  const navigate = useNavigate();
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <div className="w-full min-h-screen bg-canvas text-ink flex flex-col justify-between selection:bg-brand-primary selection:text-white">
      {/* Header / Top Nav - strictly using the dedicated Navbar component */}
      <Navbar />

      {/* Hero Section */}
      <main className="w-full flex-grow flex items-center py-12 md:py-24 z-10">
        <Container size="7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Column: Headline and CTAs */}
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left lg:col-span-7 space-y-6 sm:space-y-8">
              {/* Badge Indicator - strictly using StatusBadge component */}
              <StatusBadge pulseColor="bg-emerald-500">
                Katedra AI Engine v1.0 Activo
              </StatusBadge>

              {/* Hero Headline */}
              <h1 className="font-sans font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-display-lg lg:tracking-display-xl leading-[1.15] sm:leading-[1.1] text-ink">
                Diseña temarios académicos con el poder de la <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400">Inteligencia Artificial</span>
              </h1>

              {/* Subhead */}
              <p className="text-ink-muted text-sm sm:text-base md:text-lg tracking-body-lg max-w-2xl leading-relaxed">
                Katedra ayuda a los profesores a ahorrar hasta un 40% de tiempo en preparación. Genera teoría completa, ejercicios prácticos, exámenes y diapositivas de presentación en segundos.
              </p>

              {/* Call to Actions */}
              <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto">
                <Button
                  variant="primary"
                  onClick={() => navigate('/dashboard')}
                  className="w-full sm:w-auto px-8 py-3.5 text-xs sm:text-sm font-semibold shadow-[0_0_25px_rgba(5,43,88,0.4)] animate-fade-in"
                >
                  Comenzar Gratis
                </Button>
                <a
                  href="#features"
                  className="w-full sm:w-auto"
                >
                  <Button
                    variant="secondary"
                    className="w-full px-8 py-3.5 text-xs sm:text-sm font-semibold animate-fade-in"
                  >
                    Ver Características
                  </Button>
                </a>
              </div>
            </div>

            {/* Right Column: High-fidelity editor mockup framed inside dedicated Card */}
            <div className="w-full lg:col-span-5 rounded-xl border border-hairline bg-surface-1 p-3 shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-t from-canvas via-transparent to-transparent z-10 pointer-events-none"></div>
              <div className="w-full aspect-[16/10] bg-surface-2 rounded-lg border border-hairline-strong flex flex-col overflow-hidden text-left text-xs font-mono">
                {/* Fake OS Header */}
                <div className="h-8 border-b border-hairline px-4 flex items-center justify-between bg-surface-3">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444]/30"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-[#eab308]/30"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-[#22c55e]/30"></span>
                  </div>
                  <span className="text-[10px] text-ink-tertiary">katedra-ai-interface // core-canvas</span>
                  <div className="w-12"></div>
                </div>
                
                {/* Fake Content Editor Mock */}
                <div className="flex-1 flex">
                  {/* Fake Sidebar */}
                  <div className="w-1/4 border-r border-hairline p-4 hidden sm:block bg-surface-3/50 space-y-3">
                    <div className="h-3 w-16 bg-brand-primary/20 rounded"></div>
                    <div className="space-y-2">
                      <div className="h-2.5 w-full bg-hairline rounded"></div>
                      <div className="h-2.5 w-5/6 bg-hairline rounded"></div>
                      <div className="h-2.5 w-4/5 bg-hairline rounded"></div>
                    </div>
                  </div>
                  {/* Fake Workspace */}
                  <div className="flex-1 p-6 space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="h-4 w-1/3 bg-hairline rounded"></div>
                      <div className="h-5 w-16 bg-brand-primary/40 rounded"></div>
                    </div>
                    <div className="space-y-2.5">
                      <div className="h-3 w-full bg-hairline-strong rounded"></div>
                      <div className="h-3 w-11/12 bg-hairline-strong rounded"></div>
                      <div className="h-3 w-4/5 bg-hairline-strong rounded"></div>
                    </div>
                    <div className="border border-hairline p-4 rounded bg-canvas/60 space-y-2">
                      <div className="h-2.5 w-1/4 bg-brand-primary/30 rounded"></div>
                      <div className="h-2 w-full bg-hairline rounded"></div>
                      <div className="h-2 w-11/12 bg-hairline rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </main>

      {/* Feature Grid */}
      <section id="features" className="w-full border-t border-hairline bg-surface-1/40 py-20">
        <Container size="6xl">
          <div className="text-center max-w-xl mx-auto mb-16 space-y-4">
            <h2 className="font-sans font-semibold text-2xl md:text-3xl tracking-headline text-ink">
              Todo lo que necesitas para tu clase, en segundos.
            </h2>
            <p className="text-ink-muted text-sm tracking-body leading-relaxed">
              Katedra automatiza la parte repetitiva para que te concentres en la enseñanza.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 - using dedicated FeatureCard component */}
            <FeatureCard
              title="1. Teoría Estructurada"
              description="Genera explicaciones académicas rigurosas adaptadas a los temas exactos de tu plan de estudios."
              icon={
                <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              }
            />

            {/* Feature 2 - using dedicated FeatureCard component */}
            <FeatureCard
              title="2. Ejercicios y Exámenes"
              description="Obtén cuestionarios de opción múltiple, problemas de desarrollo y claves de respuestas listas para fotocopiar."
              icon={
                <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              }
            />

            {/* Feature 3 - using dedicated FeatureCard component */}
            <FeatureCard
              title="3. Diapositivas en Segundos"
              description="Esquemas estructurados de diapositivas que puedes utilizar para armar tus presentaciones de clase de manera ágil."
              icon={
                <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              }
            />
          </div>
        </Container>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="w-full py-24 relative overflow-hidden">
        {/* Background Accents */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[1px] bg-gradient-to-r from-transparent via-brand-primary/50 to-transparent opacity-50"></div>
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-brand-primary/10 rounded-full blur-[120px] pointer-events-none"></div>

        <Container size="6xl" className="relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
            <h2 className="font-sans font-bold text-3xl md:text-5xl tracking-headline text-ink">
              Planes diseñados para tu carga académica
            </h2>
            <p className="text-ink-muted text-sm md:text-lg tracking-body leading-relaxed">
              Comienza gratis para probar el motor de IA, o sube de nivel con el plan Pro para desbloquear todo el potencial de Katedra sin límites.
            </p>
          </div>

          {/* Toggle Switch */}
          <div className="flex justify-center mb-16">
            <div className="bg-surface-2 p-1.5 rounded-full border border-hairline inline-flex items-center shadow-inner relative">
              <button 
                onClick={() => setIsAnnual(false)} 
                className={`relative z-10 px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${!isAnnual ? 'text-ink' : 'text-ink-muted hover:text-ink'}`}
              >
                Mensual
              </button>
              <button 
                onClick={() => setIsAnnual(true)} 
                className={`relative z-10 px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 flex items-center gap-2 ${isAnnual ? 'text-ink' : 'text-ink-muted hover:text-ink'}`}
              >
                Anual
                <span className={`transition-colors duration-300 ${isAnnual ? 'bg-emerald-500/20 text-emerald-500' : 'bg-surface-3 text-ink-subtle'} text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider`}>
                  Ahorra 20%
                </span>
              </button>
              {/* Highlight Pill */}
              <div 
                className={`absolute top-1.5 bottom-1.5 w-1/2 bg-surface-1 shadow-[0_2px_8px_rgba(0,0,0,0.1)] rounded-full border border-hairline-strong transition-transform duration-300 ease-in-out ${isAnnual ? 'translate-x-[calc(100%-6px)]' : 'translate-x-0'}`} 
                style={{ left: '6px' }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 max-w-5xl mx-auto items-stretch">
            
            {/* Free Plan */}
            <Card surface="1" className="h-full border-hairline flex flex-col justify-between hover:border-hairline-strong hover:shadow-[0_10px_30px_rgba(0,0,0,0.05)] transition-all duration-300 group rounded-[24px]" style={{ padding: '3.5rem' }}>
              <div className="flex-1 flex flex-col" style={{ gap: '2.5rem' }}>
                <div>
                  <h3 className="text-2xl font-bold text-ink mb-3 group-hover:text-brand-primary transition-colors">Básico (Gratis)</h3>
                  <p className="text-ink-muted text-sm md:text-base leading-relaxed">Perfecto para conocer la plataforma y generar tu primer contenido esencial.</p>
                </div>
                
                <div className="flex items-baseline gap-1.5 pb-8 border-b border-hairline" style={{ borderBottomWidth: '1px' }}>
                  <span className="text-5xl font-black tracking-tighter text-ink">$0</span>
                  <span className="text-base font-medium text-ink-muted">/mes</span>
                </div>

                <ul className="flex-1 flex flex-col text-sm md:text-base text-ink-subtle" style={{ gap: '1.5rem' }}>
                  <li className="flex items-start gap-4">
                    <svg className="w-6 h-6 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    <span>Hasta <strong className="text-ink font-semibold">3 temarios</strong> al mes</span>
                  </li>
                  <li className="flex items-start gap-4">
                    <svg className="w-6 h-6 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    <span>Generación de Teoría básica</span>
                  </li>
                  <li className="flex items-start gap-4">
                    <svg className="w-6 h-6 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    <span>Máximo 5 ejercicios por tema</span>
                  </li>
                  <li className="flex items-start gap-4 opacity-40">
                    <svg className="w-6 h-6 text-rose-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                    <span className="line-through">Generador de Diapositivas (PPTX)</span>
                  </li>
                  <li className="flex items-start gap-4 opacity-40">
                    <svg className="w-6 h-6 text-rose-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                    <span className="line-through">Quizzes dinámicos ilimitados</span>
                  </li>
                </ul>
              </div>
              
              <div style={{ marginTop: '2.5rem' }}>
                <Button variant="secondary" className="w-full py-4 text-base font-bold rounded-xl" onClick={() => navigate('/login')}>
                  Comenzar Gratis
                </Button>
              </div>
            </Card>

            {/* Pro Plan */}
            <Card surface="2" className="h-full border border-brand-primary ring-4 ring-brand-primary/10 relative flex flex-col justify-between shadow-[0_20px_50px_rgba(5,43,88,0.2)] rounded-[24px] overflow-hidden bg-gradient-to-b from-surface-2 to-surface-1" style={{ padding: '3.5rem' }}>
              
              {/* Highlight Badge */}
              <div className="absolute top-6 right-8">
                <span className="bg-gradient-to-r from-brand-primary to-indigo-600 text-white text-[11px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg">
                  Recomendado
                </span>
              </div>
              
              {/* Subtle top glow line */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-400 via-brand-primary to-purple-500 opacity-90" />
              
              {/* Ambient Glow behind the price */}
              <div className="absolute top-12 left-10 w-32 h-32 bg-brand-primary/10 rounded-full blur-[40px] pointer-events-none"></div>

              <div className="relative z-10 flex-1 flex flex-col" style={{ gap: '2.5rem' }}>
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-2xl font-bold text-ink">Katedra Pro</h3>
                    <svg className="w-5 h-5 text-indigo-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" /></svg>
                  </div>
                  <p className="text-ink-muted text-sm md:text-base leading-relaxed">Para profesores exigentes que buscan automatización total y cero límites.</p>
                </div>
                
                <div className="flex items-end gap-1.5 pb-8 border-b border-hairline-strong" style={{ borderBottomWidth: '1px' }}>
                  <span className="text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-brand-primary">
                    ${isAnnual ? '12' : '15'}
                  </span>
                  <div className="flex flex-col pb-1">
                    <span className="text-base font-medium text-ink-muted">/mes</span>
                  </div>
                  {isAnnual && (
                    <span className="ml-2 text-xs font-semibold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded pb-1 mb-1">
                      Facturado anualmente ($144)
                    </span>
                  )}
                </div>

                <ul className="flex-1 flex flex-col text-sm md:text-base text-ink-subtle" style={{ gap: '1.5rem' }}>
                  <li className="flex items-start gap-4">
                    <div className="w-6 h-6 rounded-full bg-brand-primary/20 flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <span><strong className="text-ink font-semibold">Temarios ilimitados</strong> sin restricciones</span>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="w-6 h-6 rounded-full bg-brand-primary/20 flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <span>Generación de <strong className="text-ink font-semibold">Teoría avanzada y profunda</strong></span>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="w-6 h-6 rounded-full bg-brand-primary/20 flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <span>Quizzes y ejercicios infinitos</span>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    </div>
                    <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-indigo-500">Generador de Diapositivas Inteligente</span>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="w-6 h-6 rounded-full bg-brand-primary/20 flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <span>Exportación Premium (PDF, PPTX)</span>
                  </li>
                </ul>
              </div>
              
              <div style={{ marginTop: '2.5rem' }}>
                <Button variant="primary" className="relative z-10 w-full py-4 text-base font-bold shadow-[0_10px_25px_rgba(5,43,88,0.5)] hover:shadow-[0_15px_35px_rgba(5,43,88,0.7)] hover:-translate-y-1 transition-all duration-300 rounded-xl" onClick={() => navigate('/login')}>
                  Mejorar a Pro
                </Button>
              </div>
            </Card>

          </div>
        </Container>
      </section>

      {/* Footer - strictly using the dedicated Footer component */}
      <Footer />
    </div>
  );
}

import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col justify-between selection:bg-brand-primary selection:text-white">
      {/* Header / Top Nav */}
      <header className="h-[56px] border-b border-hairline px-6 flex items-center justify-between bg-canvas/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          {/* Lavender Brand Mark */}
          <div className="w-5 h-5 rounded-sm bg-brand-primary flex items-center justify-center shadow-[0_0_12px_rgba(5,43,88,0.5)]">
            <span className="text-[10px] font-bold text-white">K</span>
          </div>
          <span className="font-sans font-semibold tracking-subhead text-[15px]">Katedra</span>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm text-ink-muted">
          <a href="#features" className="hover:text-ink transition-colors">Características</a>
          <a href="#impact" className="hover:text-ink transition-colors">Impacto</a>
          <a href="#tech" className="hover:text-ink transition-colors">Tecnología</a>
        </nav>
        <div>
          <button 
            onClick={() => navigate('/dashboard')}
            className="bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-medium px-4 py-2 rounded-md transition-all active:scale-[0.98] shadow-[0_0_15px_rgba(5,43,88,0.3)] hover:shadow-[0_0_20px_rgba(5,43,88,0.5)] cursor-pointer"
          >
            Ingresar al Panel
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center px-4 py-16 md:py-24 text-center max-w-4xl mx-auto z-10">
        {/* Badge Indicator */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-2 border border-hairline text-ink-muted text-xs mb-8 animate-fade-in">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Katedra AI Engine v1.0 Activo</span>
        </div>

        {/* Hero Headline */}
        <h1 className="font-sans font-bold text-4xl md:text-6xl tracking-display-lg md:tracking-display-xl leading-[1.1] mb-6 text-ink">
          Diseña temarios académicos con el poder de la <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400">Inteligencia Artificial</span>
        </h1>

        {/* Subhead */}
        <p className="text-ink-muted text-lg md:text-xl tracking-body-lg max-w-2xl mb-10 leading-relaxed">
          Katedra ayuda a los profesores a ahorrar hasta un 40% de tiempo en preparación. Genera teoría completa, ejercicios prácticos, exámenes y diapositivas de presentación en segundos.
        </p>

        {/* Call to Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-16">
          <button 
            onClick={() => navigate('/dashboard')}
            className="w-full sm:w-auto bg-brand-primary hover:bg-brand-primary-hover text-white text-sm font-medium px-6 py-3 rounded-md transition-all active:scale-[0.98] shadow-[0_0_25px_rgba(5,43,88,0.4)] cursor-pointer"
          >
            Comenzar Gratis
          </button>
          <a
            href="#features" 
            className="w-full sm:w-auto bg-surface-1 hover:bg-surface-2 border border-hairline text-ink text-sm font-medium px-6 py-3 rounded-md transition-all active:scale-[0.98]"
          >
            Ver Características
          </a>
        </div>

        {/* Product Screenshot Mockup / Showcase */}
        <div id="showcase" className="w-full rounded-xl border border-hairline bg-surface-1 p-3 shadow-2xl relative group overflow-hidden">
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
      </main>

      {/* Feature Grid */}
      <section id="features" className="border-t border-hairline bg-surface-1/40 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-16">
            <h2 className="font-sans font-semibold text-2xl md:text-3xl tracking-headline mb-4 text-ink">
              Todo lo que necesitas para tu clase, en segundos.
            </h2>
            <p className="text-ink-muted text-sm tracking-body leading-relaxed">
              Katedra automatiza la parte repetitiva para que te concentres en la enseñanza.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="bg-surface-1 border border-hairline rounded-lg p-6 space-y-4 hover:border-brand-primary/50 transition-colors">
              <div className="w-8 h-8 rounded bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary-hover">
                <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-base font-semibold tracking-card-title text-ink">1. Teoría Estructurada</h3>
              <p className="text-ink-muted text-xs tracking-body leading-relaxed">
                Genera explicaciones académicas rigurosas adaptadas a los temas exactos de tu plan de estudios.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-surface-1 border border-hairline rounded-lg p-6 space-y-4 hover:border-brand-primary/50 transition-colors">
              <div className="w-8 h-8 rounded bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary-hover">
                <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <h3 className="text-base font-semibold tracking-card-title text-ink">2. Ejercicios y Exámenes</h3>
              <p className="text-ink-muted text-xs tracking-body leading-relaxed">
                Obtén cuestionarios de opción múltiple, problemas de desarrollo y claves de respuestas listas para fotocopiar.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-surface-1 border border-hairline rounded-lg p-6 space-y-4 hover:border-brand-primary/50 transition-colors">
              <div className="w-8 h-8 rounded bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary-hover">
                <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-base font-semibold tracking-card-title text-ink">3. Diapositivas en Segundos</h3>
              <p className="text-ink-muted text-xs tracking-body leading-relaxed">
                Esquemas estructurados de diapositivas que puedes utilizar para armar tus presentaciones de clase de manera ágil.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-hairline py-8 px-6 text-center text-xs text-ink-muted bg-canvas">
        <p>© 2026 Katedra. Creado con amor para la comunidad educativa.</p>
      </footer>
    </div>
  );
}

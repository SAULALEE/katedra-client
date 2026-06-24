import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTemarios } from '../hooks/useTemarios';
import ResponsiveSidebar from '../components/ResponsiveSidebar';
import Button from '../components/Button';

export default function GeneratedContents() {
  const navigate = useNavigate();
  const { courses, loading } = useTemarios();

  return (
    <div className="w-full h-screen bg-canvas text-ink flex flex-col md:flex-row overflow-hidden font-sans">

      {/* Sidebar */}
      <ResponsiveSidebar />

      {/* Main Panel Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-surface-2 relative h-screen">

        {/* Top Navbar */}
        <header className="h-[88px] border-b border-hairline bg-canvas/80 backdrop-blur-md sticky top-0 z-30 w-full flex items-center px-6 sm:px-10 justify-between transition-all">
          <div className="flex flex-col">
            <h2 className="text-xl sm:text-2xl font-bold leading-tight tracking-tight text-ink">Materiales Educativos</h2>
            <span className="text-xs mt-1 font-medium text-brand-secure">Material generado con IA</span>
          </div>
          <Button
            variant="primary"
            onClick={() => navigate('/generador')}
            className="bg-brand-primary text-white hover:bg-brand-primary-hover px-6 py-3 text-sm font-bold rounded-xl shadow-elevated hover:-translate-y-0.5 transition-all duration-300"
          >
            + Nuevo Material
          </Button>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto scrollbar-none">
          <div className="p-6 sm:p-10 lg:p-14 w-full max-w-7xl mx-auto flex flex-col gap-10">

            {/* Header info */}
            <div className="flex flex-col gap-3">
              <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-ink">Explora tus Temarios</h3>
              <p className="text-base text-ink-subtle max-w-2xl leading-relaxed">
                Administra, revisa y exporta todos los contenidos generados con Inteligencia Artificial. Haz clic en cualquier módulo para abrir el visor interactivo.
              </p>
            </div>

            {/* Grid of contents */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {[1, 2, 3].map((skeleton) => (
                  <div key={skeleton} className="p-8 h-56 animate-pulse border border-hairline rounded-[24px] bg-canvas shadow-soft flex flex-col gap-4">
                    <div className="w-1/3 h-4 bg-surface-3 rounded"></div>
                    <div className="w-3/4 h-6 bg-surface-3 rounded mt-3"></div>
                    <div className="w-1/2 h-4 bg-surface-3 rounded"></div>
                  </div>
                ))}
              </div>
            ) : courses.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 px-6 text-center border-2 border-dashed border-hairline rounded-[32px] bg-canvas/50 shadow-soft">
                <div className="w-20 h-20 rounded-2xl bg-brand-primary/10 text-brand-primary border border-brand-primary/20 flex items-center justify-center mb-6 shadow-sm">
                  <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h4 className="text-2xl font-bold text-ink">Sin contenidos generados</h4>
                <p className="text-sm text-ink-muted max-w-md mt-3 mb-8 leading-relaxed">
                  El repositorio está vacío. Inicia la experiencia creando tu primer contenido automatizado con Katedra AI.
                </p>
                <Button variant="primary" onClick={() => navigate('/generador')} className="bg-brand-primary text-white hover:bg-brand-primary-hover px-8 py-3.5 text-sm font-bold rounded-xl shadow-soft hover:-translate-y-1 transition-all duration-300">
                  Comenzar Creación
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {courses.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => navigate(`/contenido/${c.id}`)}
                    className="p-8 border border-hairline rounded-[28px] bg-canvas shadow-soft hover:shadow-illustrative hover:-translate-y-2 transition-all duration-400 flex flex-col justify-between group cursor-pointer relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                    <div className="flex flex-col gap-5">
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] font-bold text-brand-primary bg-brand-primary/10 border border-brand-primary/20 px-3 py-1.5 rounded-lg uppercase tracking-widest shadow-sm">
                          {c.origen || 'AI Generado'}
                        </span>
                        <span className="text-[11px] font-bold text-ink-subtle">{c.createdAt ? c.createdAt.split('T')[0] : ''}</span>
                      </div>

                      <div className="mt-1">
                        <h4 className="text-xl font-bold text-ink leading-snug mb-2 group-hover:text-brand-primary transition-colors line-clamp-2 tracking-tight">{c.titulo}</h4>
                        <p className="text-sm font-medium text-ink-muted truncate">{c.asignatura}</p>
                      </div>

                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-2 text-[10px] font-bold text-ink-subtle border border-hairline group-hover:border-brand-primary/20 transition-colors">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                          Teoría
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-2 text-[10px] font-bold text-ink-subtle border border-hairline group-hover:border-brand-primary/20 transition-colors">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
                          Quizzes
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-2 text-[10px] font-bold text-ink-subtle border border-hairline group-hover:border-brand-primary/20 transition-colors">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>
                          Slides
                        </span>
                      </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-hairline flex items-center justify-between">
                      <span className="text-[11px] font-bold text-semantic-success bg-semantic-success/10 border border-semantic-success/20 px-3 py-1.5 rounded-lg flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-semantic-success shadow-[0_0_8px_var(--app-semantic-success)] animate-pulse"></span> Generado
                      </span>
                      <span className="text-sm font-bold text-brand-primary flex items-center gap-1.5 group-hover:gap-2.5 transition-all">
                        Abrir Visor
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  );
}

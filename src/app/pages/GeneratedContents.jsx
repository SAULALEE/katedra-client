import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTemarios } from '../hooks/useTemarios';
import ResponsiveSidebar from '../components/ResponsiveSidebar';
import Card from '../components/Card';
import Button from '../components/Button';

export default function GeneratedContents() {
  const navigate = useNavigate();
  const { courses, loading } = useTemarios();

  return (
    <div className="w-full min-h-screen bg-canvas text-ink flex flex-col md:flex-row selection:bg-brand-primary selection:text-white">
      
      {/* Sidebar */}
      <ResponsiveSidebar />

      {/* Main Panel Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-canvas">
        
        {/* Top Navbar */}
        <header className="h-[64px] border-b border-hairline bg-canvas/80 backdrop-blur-md sticky top-0 z-30 w-full flex items-center px-4 sm:px-6 md:px-8 justify-between">
          <div>
            <h2 className="text-body font-semibold tracking-card-title text-ink">Módulo de Contenidos Generados</h2>
            <span className="text-[10px] text-ink-muted uppercase tracking-widest font-mono">Gestión de Material AI</span>
          </div>
          <Button 
            variant="primary" 
            onClick={() => navigate('/generador')}
            className="px-4 py-2 font-medium shadow-[0_0_15px_rgba(5,43,88,0.3)]"
          >
            + Nuevo Contenido
          </Button>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 sm:p-8 md:p-10 w-full max-w-7xl mx-auto flex flex-col gap-8">
            
            {/* Header info */}
            <div className="flex flex-col gap-2">
              <h3 className="text-display-sm font-bold tracking-tight text-ink">Explora tus Materiales</h3>
              <p className="text-body-sm text-ink-muted max-w-2xl">
                Aquí se encuentran todos los contenidos generados con Inteligencia Artificial. Haz clic en cualquier tarjeta para abrir el visor interactivo de la teoría, ejercicios, evaluaciones y diapositivas.
              </p>
            </div>

            {/* Grid of contents */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((skeleton) => (
                  <Card key={skeleton} surface="1" className="p-8 h-48 animate-pulse border-hairline flex flex-col gap-4">
                    <div className="w-1/3 h-3 bg-hairline rounded"></div>
                    <div className="w-3/4 h-5 bg-hairline rounded mt-2"></div>
                    <div className="w-1/2 h-3 bg-hairline rounded"></div>
                  </Card>
                ))}
              </div>
            ) : courses.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 px-4 text-center border-2 border-dashed border-hairline rounded-xl bg-surface-1/50">
                <div className="w-16 h-16 rounded-full bg-surface-2 flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h4 className="text-body-lg font-bold text-ink">No hay contenidos generados</h4>
                <p className="text-body-sm text-ink-muted max-w-sm mt-2 mb-6">
                  Comienza cargando un temario desde tu panel o ve directamente al generador para crear tu primer contenido con IA.
                </p>
                <Button variant="primary" onClick={() => navigate('/generador')} className="px-6 py-2">
                  Crear Primer Contenido
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {courses.map((c) => (
                  <Card 
                    key={c.id} 
                    surface="1" 
                    className="p-8 border-hairline hover:border-brand-primary/50 shadow-md hover:shadow-[0_10px_30px_rgba(5,43,88,0.2)] transition-all duration-300 flex flex-col justify-between group cursor-pointer"
                    onClick={() => navigate(`/contenido/${c.id}`)}
                  >
                    <div className="flex flex-col gap-4">
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] font-bold text-brand-primary bg-brand-primary/10 px-2 py-0.5 rounded uppercase tracking-wider">
                          {c.origen || 'AI Generado'}
                        </span>
                        <span className="text-caption text-ink-tertiary">{c.fecha}</span>
                      </div>
                      
                      <div>
                        <h4 className="text-body-lg font-bold text-ink leading-tight mb-1 group-hover:text-brand-primary transition-colors line-clamp-2">{c.nombre}</h4>
                        <p className="text-body-sm text-ink-muted truncate">{c.curso}</p>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-surface-2 text-[10px] text-ink-muted border border-hairline">
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                          Teoría
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-surface-2 text-[10px] text-ink-muted border border-hairline">
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
                          Quizzes
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-surface-2 text-[10px] text-ink-muted border border-hairline">
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>
                          Slides
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-8 pt-4 border-t border-hairline flex items-center justify-between">
                      <span className="text-xs font-medium text-emerald-400 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Listo
                      </span>
                      <span className="text-body-sm font-semibold text-indigo-400 flex items-center gap-1 group-hover:gap-2 transition-all">
                        Ver
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                      </span>
                    </div>
                  </Card>
                ))}
              </div>
            )}
            
          </div>
        </div>
      </main>
    </div>
  );
}

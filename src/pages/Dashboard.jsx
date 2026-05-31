import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Fake starting data matching Spanish domain
const INITIAL_COURSES = [
  { id: '1', nombre: 'Introducción a Python y Control de Flujo', curso: 'Programación I', temas: 5, fecha: '2026-05-28', estado: 'Completado' },
  { id: '2', nombre: 'Límites, Continuidad y Derivadas', curso: 'Cálculo Diferencial', temas: 8, fecha: '2026-05-25', estado: 'Completado' },
  { id: '3', nombre: 'Leyes de Newton y Fuerza de Fricción', curso: 'Física Clásica', temas: 4, fecha: '2026-05-20', estado: 'Completado' },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState(INITIAL_COURSES);

  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col md:flex-row selection:bg-brand-primary selection:text-white">
      
      {/* Sidebar - Linear style */}
      <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-hairline bg-surface-1 flex flex-col justify-between p-6">
        <div className="space-y-8">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-5 h-5 rounded-sm bg-brand-primary flex items-center justify-center shadow-[0_0_12px_rgba(5,43,88,0.5)]">
              <span className="text-[10px] font-bold text-white">K</span>
            </div>
            <span className="font-sans font-semibold tracking-subhead text-[15px]">Katedra</span>
          </div>

          {/* Navigation links */}
          <nav className="space-y-1.5">
            <button className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-md bg-surface-2 text-ink text-xs font-medium border border-hairline transition-all">
              <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span>Mis Temarios</span>
            </button>
            <button 
              onClick={() => navigate('/generador')}
              className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-md text-ink-muted hover:text-ink hover:bg-surface-2/50 text-xs font-medium transition-all"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Generar Nuevo</span>
            </button>
          </nav>
        </div>

        {/* User Card */}
        <div className="border-t border-hairline pt-4 flex items-center gap-3 mt-8 md:mt-0">
          <div className="w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center font-bold text-xs text-white">
            P
          </div>
          <div>
            <p className="text-xs font-medium text-ink">Prof. Alejandro</p>
            <p className="text-[10px] text-ink-muted">Plan Premium</p>
          </div>
        </div>
      </aside>

      {/* Main Panel Content */}
      <main className="flex-1 flex flex-col min-w-0">
        
        {/* Top Navbar */}
        <header className="h-[56px] border-b border-hairline px-6 flex items-center justify-between bg-canvas/80 backdrop-blur-md sticky top-0 z-40">
          <h2 className="text-sm font-semibold tracking-card-title text-ink">Panel del Profesor</h2>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/generador')}
              className="bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-medium px-4 py-2 rounded-md transition-all active:scale-[0.98] cursor-pointer shadow-[0_0_15px_rgba(5,43,88,0.3)]"
            >
              + Generar Material
            </button>
          </div>
        </header>

        {/* Dashboard Panels */}
        <div className="flex-1 p-6 space-y-8 overflow-y-auto">
          
          {/* Stats Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Stat 1 */}
            <div className="bg-surface-1 border border-hairline rounded-lg p-5 space-y-1">
              <span className="text-[10px] uppercase tracking-widest text-ink-muted">Materiales Generados</span>
              <p className="text-2xl font-bold tracking-display-md text-ink">47</p>
              <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                <span>↑ 12 esta semana</span>
              </span>
            </div>
            {/* Stat 2 */}
            <div className="bg-surface-1 border border-hairline rounded-lg p-5 space-y-1">
              <span className="text-[10px] uppercase tracking-widest text-ink-muted">Tiempo Total Ahorrado</span>
              <p className="text-2xl font-bold tracking-display-md text-ink">34.8 hrs</p>
              <span className="text-[10px] text-indigo-400">~ 30-40% por temario</span>
            </div>
            {/* Stat 3 */}
            <div className="bg-surface-1 border border-hairline rounded-lg p-5 space-y-1">
              <span className="text-[10px] uppercase tracking-widest text-ink-muted">Llamadas a IA</span>
              <p className="text-2xl font-bold tracking-display-md text-ink">112</p>
              <span className="text-[10px] text-ink-muted">Límite: Ilimitado Premium</span>
            </div>
          </div>

          {/* List of generated temarios */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold tracking-card-title text-ink">Materiales Recientes</h3>
              <span className="text-xs text-ink-muted">{courses.length} documentos activos</span>
            </div>

            {/* Courses Table / List */}
            <div className="bg-surface-1 border border-hairline rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-hairline bg-surface-2 text-ink-muted font-medium">
                      <th className="p-4">Nombre del Temario</th>
                      <th className="p-4">Curso / Materia</th>
                      <th className="p-4">Subtemas</th>
                      <th className="p-4">Fecha</th>
                      <th className="p-4">Estado</th>
                      <th className="p-4 text-right">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-hairline">
                    {courses.map((c) => (
                      <tr key={c.id} className="hover:bg-surface-2/40 transition-colors">
                        <td className="p-4 font-medium text-ink">{c.nombre}</td>
                        <td className="p-4 text-ink-muted">{c.curso}</td>
                        <td className="p-4 text-ink-muted">{c.temas} subtemas</td>
                        <td className="p-4 text-ink-muted">{c.fecha}</td>
                        <td className="p-4">
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px]">
                            <span className="w-1 h-1 rounded-full bg-emerald-400"></span>
                            {c.estado}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button 
                            onClick={() => navigate('/generador')}
                            className="text-xs font-semibold text-brand-primary-hover hover:text-ink transition-colors cursor-pointer"
                          >
                            Abrir Editor
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getContenidoTemario } from '../services/temarioService';
import { useTemarios } from '../hooks/useTemarios';
import Button from '../components/Button';
import ResponsiveSidebar from '../components/ResponsiveSidebar';

// Reusable SVG Icons for exports
const IconGoogleForms = () => (
  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14.5 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V7.5L14.5 2Z" fill="#7248B9" fillOpacity="0.1"/>
    <path d="M14.5 2V7.5H20" stroke="#7248B9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14.5 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V7.5L14.5 2Z" stroke="#7248B9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 13H16M8 17H16M8 9H10" stroke="#7248B9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconMSForms = () => (
  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="4" width="16" height="16" rx="2" fill="#00828A" fillOpacity="0.1"/>
    <rect x="4" y="4" width="16" height="16" rx="2" stroke="#00828A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 12L11 15L16 9" stroke="#00828A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconPDF = () => (
  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z" fill="#E11D48" fillOpacity="0.1"/>
    <path d="M14 2V8H20M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z" stroke="#E11D48" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 15H15M9 11H15M9 19H11" stroke="#E11D48" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconPPTX = () => (
  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 4H20C21.1046 4 22 4.89543 22 6V18C22 19.1046 21.1046 20 20 20H4C2.89543 20 2 19.1046 2 18V6C2 4.89543 2.89543 4 4 4Z" fill="#EA580C" fillOpacity="0.1"/>
    <path d="M4 4H20C21.1046 4 22 4.89543 22 6V18C22 19.1046 21.1046 20 20 20H4C2.89543 20 2 19.1046 2 18V6C2 4.89543 2.89543 4 4 4Z" stroke="#EA580C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 10C8 8.89543 8.89543 8 10 8H14C15.1046 8 16 8.89543 16 10C16 11.1046 15.1046 12 14 12H8V10ZM8 12V16" stroke="#EA580C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default function ContentViewer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { courses } = useTemarios();
  
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('teoria');
  const [checkedAnswers, setCheckedAnswers] = useState({});
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const course = courses.find(c => c.id === id) || { titulo: 'Temario Generado', asignatura: 'Cargando...' };

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      try {
        const data = await getContenidoTemario(id);
        setContent(data);
      } catch (err) {
        console.error("Error cargando el contenido", err);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, [id]);

  return (
    <div className="w-full min-h-screen bg-canvas text-ink flex flex-col md:flex-row font-sans">
      
      <ResponsiveSidebar />

      <main className="flex-1 flex flex-col min-w-0 bg-surface-2 relative h-screen">
        
        {/* Top Navbar */}
        <header className="min-h-[88px] border-b border-hairline bg-canvas/90 backdrop-blur-md sticky top-0 z-30 w-full flex items-center py-4 sm:py-0">
          <div className="w-full px-6 sm:px-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex flex-col flex-1 min-w-0 pr-4">
              <h2 className="text-sm sm:text-base font-bold text-ink leading-snug">{course.titulo || course.nombre}</h2>
              <span className="text-[11px] font-medium text-ink-subtle mt-1">{course.asignatura || course.curso}</span>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <Button 
                variant="secondary" 
                onClick={() => navigate(-1)}
                className="px-5 py-2.5 text-xs font-bold bg-surface-1 hover:bg-surface-3 transition-colors border-hairline rounded-xl shadow-sm"
              >
                Volver
              </Button>
            </div>
          </div>
        </header>

        {/* Viewer Content */}
        <div className="flex-1 overflow-y-auto scrollbar-none">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[500px] gap-6">
              <div className="w-12 h-12 rounded-full border-[3px] border-surface-3 border-t-brand-primary animate-spin"></div>
              <p className="text-sm text-ink-subtle font-bold tracking-widest uppercase animate-pulse">Cargando Material...</p>
            </div>
          ) : !content ? (
             <div className="flex flex-col items-center justify-center h-full min-h-[500px] gap-5">
                <div className="w-16 h-16 rounded-[20px] bg-red-500/10 text-red-500 flex items-center justify-center">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                </div>
                <p className="text-base font-bold text-ink">Material No Encontrado</p>
             </div>
          ) : (
            <div className="flex flex-col w-full h-full bg-surface-2">
              
              {/* Navigation Tabs */}
              <div className="border-b border-hairline bg-canvas px-6 sm:px-10 flex gap-8 sm:gap-10 overflow-x-auto sticky top-0 z-20 backdrop-blur-md scrollbar-none select-none">
                {[
                  { id: 'teoria', label: 'Teoría Docente' },
                  { id: 'ejercicios', label: 'Ejercicios Prácticos' },
                  { id: 'evaluacion', label: 'Evaluación' },
                  { id: 'diapositivas', label: 'Diapositivas' }
                ].map((tab) => (
                  <button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-5 text-[13px] font-bold transition-all border-b-[3px] cursor-pointer whitespace-nowrap ${
                      activeTab === tab.id 
                        ? 'border-brand-primary text-brand-primary' 
                        : 'border-transparent text-ink-subtle hover:text-ink hover:border-hairline-strong'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Dynamic Content Body Container */}
              <div className="p-6 sm:p-10 lg:p-12 w-full max-w-5xl mx-auto animate-fade-in pb-24">
                
                {/* 1. Teoría Docente */}
                {activeTab === 'teoria' && (
                  <div className="flex flex-col gap-6 w-full">
                    <div className="flex justify-end sticky top-[80px] z-10 pt-2 pb-2">
                      <button onClick={() => window.print()} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest bg-canvas border border-hairline hover:bg-surface-3 shadow-sm transition-all cursor-pointer text-ink">
                        <IconPDF />
                        <span>Exportar PDF</span>
                      </button>
                    </div>

                    <div className="p-8 sm:p-12 bg-canvas border border-hairline rounded-[24px] shadow-illustrative flex flex-col">
                      <div className="mb-8 border-b border-hairline pb-6">
                        <h1 className="text-2xl sm:text-3xl font-bold text-ink mb-2">{course.titulo || 'Módulo Teórico'}</h1>
                        <p className="text-sm font-bold text-brand-primary">{course.asignatura || 'Material Académico'}</p>
                      </div>
                      
                      <div className="text-sm sm:text-base text-ink-muted leading-relaxed font-medium whitespace-pre-line">
                        {content.teoria}
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. Ejercicios Prácticos */}
                {activeTab === 'ejercicios' && (
                  <div className="flex flex-col gap-8 w-full">
                    
                    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6 bg-canvas p-6 rounded-[24px] border border-hairline shadow-sm select-none">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center shrink-0 border border-brand-primary/20">
                          <svg className="w-5 h-5 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        </div>
                        <div className="flex flex-col">
                          <h3 className="text-lg font-bold text-ink">Hoja de Ejercicios</h3>
                          <span className="text-xs font-medium text-ink-subtle">Problemas resueltos y casos prácticos.</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="text-[10px] uppercase tracking-widest text-ink-subtle font-bold mr-2 hidden sm:block">Extraer a:</span>
                        <button onClick={() => alert('Exportar a Google Forms')} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-bold uppercase tracking-widest border border-[#7248B9]/20 bg-[#7248B9]/5 hover:bg-[#7248B9]/10 text-[#7248B9] transition-all cursor-pointer">
                          <IconGoogleForms /> <span className="mt-0.5">Forms</span>
                        </button>
                        <button onClick={() => alert('Exportar a MS Forms')} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-bold uppercase tracking-widest border border-[#00828A]/20 bg-[#00828A]/5 hover:bg-[#00828A]/10 text-[#00828A] transition-all cursor-pointer">
                          <IconMSForms /> <span className="mt-0.5">MS Forms</span>
                        </button>
                        <button onClick={() => window.print()} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-bold uppercase tracking-widest border border-[#E11D48]/20 bg-[#E11D48]/5 hover:bg-[#E11D48]/10 text-[#E11D48] transition-all cursor-pointer">
                          <IconPDF /> <span className="mt-0.5">PDF</span>
                        </button>
                      </div>
                    </div>

                    <div className="p-8 sm:p-12 bg-canvas border border-hairline rounded-[24px] shadow-illustrative flex flex-col text-sm sm:text-base text-ink-muted leading-relaxed font-medium whitespace-pre-line">
                      {content.ejercicios}
                    </div>
                  </div>
                )}

                {/* 3. Evaluacion Tab View */}
                {activeTab === 'evaluacion' && (
                  <div className="flex flex-col gap-8 w-full">
                    
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-5 border border-hairline bg-canvas p-6 rounded-[24px] shadow-sm select-none">
                      <div className="flex flex-col gap-1">
                        <h3 className="text-lg font-bold text-ink">Banco de Preguntas</h3>
                        <p className="text-xs font-medium text-ink-subtle">Cuestionario interactivo autogenerado.</p>
                      </div>

                      <div className="flex items-center gap-3">
                        <button onClick={() => alert('Exportar a Google Forms')} className="w-10 h-10 flex items-center justify-center rounded-xl border border-[#7248B9]/20 bg-[#7248B9]/5 hover:bg-[#7248B9]/10 text-[#7248B9] transition-all cursor-pointer group">
                          <IconGoogleForms />
                        </button>
                        <button onClick={() => alert('Exportar a MS Forms')} className="w-10 h-10 flex items-center justify-center rounded-xl border border-[#00828a]/20 bg-[#00828a]/5 hover:bg-[#00828a]/10 text-[#00828a] transition-all cursor-pointer group">
                          <IconMSForms />
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col gap-8">
                      {content.evaluacion.map((q, qIndex) => {
                        const isCorrect = checkedAnswers[qIndex] === q.opcionCorrectaIndex;
                        const isAnswered = checkedAnswers[qIndex] !== undefined;

                        return (
                          <div key={qIndex} className="flex flex-col gap-6 p-6 sm:p-8 shadow-soft border border-hairline bg-canvas rounded-[24px] relative">
                            <span className="text-[10px] text-brand-primary font-bold uppercase tracking-widest bg-brand-primary/10 px-3 py-1.5 rounded-lg w-max select-none">Pregunta #{qIndex + 1}</span>
                            
                            <h4 className="text-base sm:text-lg font-bold text-ink leading-relaxed mt-1">{q.pregunta}</h4>
                            
                            <div className="flex flex-col gap-3">
                              {q.opciones.map((opt, optIndex) => {
                                const isSelected = checkedAnswers[qIndex] === optIndex;
                                return (
                                  <button
                                    key={optIndex}
                                    onClick={() => setCheckedAnswers({...checkedAnswers, [qIndex]: optIndex})}
                                    disabled={isAnswered}
                                    className={`w-full text-left p-4 rounded-xl text-sm font-semibold transition-all border-2 flex justify-between items-center ${
                                      isSelected 
                                        ? 'bg-brand-primary/10 border-brand-primary text-brand-primary' 
                                        : isAnswered
                                          ? 'bg-surface-2 border-transparent text-ink-muted opacity-60 cursor-not-allowed'
                                          : 'bg-canvas border-hairline hover:border-ink-subtle text-ink cursor-pointer hover:bg-surface-1'
                                    }`}
                                  >
                                    <span className="flex items-center gap-3">
                                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold border-2 ${isSelected ? 'border-brand-primary bg-brand-primary text-white' : 'border-hairline-strong text-ink-subtle'}`}>
                                        {String.fromCharCode(65 + optIndex)}
                                      </span>
                                      {opt}
                                    </span>
                                  </button>
                                );
                              })}
                            </div>

                            {isAnswered && (
                              <div className={`mt-2 p-5 rounded-xl border flex gap-4 animate-fade-in ${
                                isCorrect 
                                  ? 'bg-semantic-success/10 border-semantic-success/20 text-semantic-success' 
                                  : 'bg-red-500/10 border-red-500/20 text-red-500'
                              }`}>
                                <div className="shrink-0 mt-0.5">
                                  {isCorrect ? (
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                  ) : (
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                                  )}
                                </div>
                                <div className="flex flex-col">
                                  <h5 className="text-sm font-bold uppercase tracking-widest mb-1">
                                    {isCorrect ? 'Correcto' : 'Incorrecto'}
                                  </h5>
                                  <p className="text-ink text-xs font-medium leading-relaxed">{q.explicacion}</p>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 4. Diapositivas Tab View */}
                {activeTab === 'diapositivas' && (
                  <div className="flex flex-col gap-8 w-full">
                    
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5 bg-canvas p-6 rounded-[24px] border border-hairline shadow-sm select-none">
                      <div className="flex flex-col gap-1">
                        <h3 className="text-lg font-bold text-ink">Presentación Visual</h3>
                        <p className="text-xs font-medium text-ink-subtle">Visor de láminas autogeneradas (16:9).</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button onClick={() => alert('Generando PPTX...')} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-bold uppercase tracking-widest border border-[#EA580C]/20 bg-[#EA580C]/5 hover:bg-[#EA580C]/10 text-[#EA580C] transition-all cursor-pointer">
                          <IconPPTX /> <span className="mt-0.5">PPTX</span>
                        </button>
                        <button onClick={() => alert('Generando PDF...')} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-bold uppercase tracking-widest border border-[#E11D48]/20 bg-[#E11D48]/5 hover:bg-[#E11D48]/10 text-[#E11D48] transition-all cursor-pointer">
                          <IconPDF /> <span className="mt-0.5">PDF</span>
                        </button>
                      </div>
                    </div>

                    {/* Presentation Simulator */}
                    <div className="flex flex-col items-center bg-surface-2 p-6 sm:p-10 rounded-[32px] border border-hairline shadow-inner">
                      
                      <div className="w-full max-w-4xl aspect-video bg-white dark:bg-[#0B0F19] text-gray-900 dark:text-gray-100 rounded-[16px] shadow-illustrative overflow-hidden flex flex-col p-10 sm:p-16 transition-all duration-300 relative border border-hairline-strong">
                        
                        <div className="absolute top-0 left-0 w-full h-2 bg-brand-primary"></div>
                        
                        <div className="flex-1 flex flex-col justify-center">
                          <h2 className="text-2xl sm:text-4xl font-extrabold mb-8 leading-tight tracking-tight text-[#0F172A] dark:text-white">
                            {content.diapositivas[currentSlideIndex].titulo}
                          </h2>
                          <ul className="flex flex-col gap-5 text-sm sm:text-xl text-slate-600 dark:text-slate-300 font-medium">
                            {content.diapositivas[currentSlideIndex].puntos.map((pt, pIndex) => (
                              <li key={pIndex} className="flex items-start gap-4">
                                <span className="text-brand-primary mt-1.5 shrink-0 text-xl font-bold">✓</span>
                                <span className="leading-relaxed opacity-90">{pt}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="flex justify-between items-center mt-10 pt-6 border-t border-slate-200 dark:border-slate-800 select-none">
                          <div className="flex items-center gap-3">
                            <div className="w-6 h-6 bg-brand-primary rounded-md flex items-center justify-center">
                              <span className="text-white text-[10px] font-black">K</span>
                            </div>
                            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{course.asignatura}</span>
                          </div>
                          <span className="text-xs font-bold text-slate-400 dark:text-slate-500 font-mono tracking-widest">
                            {String(currentSlideIndex + 1).padStart(2, '0')} / {String(content.diapositivas.length).padStart(2, '0')}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-center gap-6 mt-10 select-none">
                        <button 
                          onClick={() => setCurrentSlideIndex(Math.max(0, currentSlideIndex - 1))}
                          disabled={currentSlideIndex === 0}
                          className="w-10 h-10 rounded-full flex items-center justify-center bg-canvas border border-hairline text-ink hover:bg-surface-3 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer shadow-sm"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
                        </button>
                        
                        <div className="flex gap-2">
                          {content.diapositivas.map((_, idx) => (
                            <button
                              key={idx}
                              onClick={() => setCurrentSlideIndex(idx)}
                              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${currentSlideIndex === idx ? 'w-6 bg-brand-primary' : 'w-2 bg-ink-tertiary hover:bg-ink-muted'}`}
                            />
                          ))}
                        </div>

                        <button 
                          onClick={() => setCurrentSlideIndex(Math.min(content.diapositivas.length - 1, currentSlideIndex + 1))}
                          disabled={currentSlideIndex === content.diapositivas.length - 1}
                          className="w-10 h-10 rounded-full flex items-center justify-center bg-canvas border border-hairline text-ink hover:bg-surface-3 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer shadow-sm"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                        </button>
                      </div>

                    </div>
                  </div>
                )}
                
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

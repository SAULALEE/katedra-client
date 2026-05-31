import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getContenidoTemario } from '../services/temarioService';
import { useTemarios } from '../hooks/useTemarios';
import Button from '../components/Button';
import Card from '../components/Card';
import ResponsiveSidebar from '../components/ResponsiveSidebar';

export default function ContentViewer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { courses } = useTemarios();
  
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('teoria');
  const [checkedAnswers, setCheckedAnswers] = useState({});
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const course = courses.find(c => c.id === id) || { nombre: 'Temario Generado', curso: 'Cargando...' };

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
    <div className="w-full min-h-screen bg-canvas text-ink flex flex-col md:flex-row selection:bg-brand-primary selection:text-white">
      
      {/* Sidebar */}
      <ResponsiveSidebar />

      {/* Main Panel Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-canvas">
        
        {/* Top Navbar */}
        <header className="h-[64px] border-b border-hairline bg-canvas/80 backdrop-blur-md sticky top-0 z-30 w-full flex items-center px-4 sm:px-6 md:px-8 justify-between">
          <div className="flex flex-col">
            <h2 className="text-body font-semibold tracking-card-title text-ink">{course.nombre}</h2>
            <span className="text-caption text-ink-muted">{course.curso}</span>
          </div>
          <div className="flex items-center gap-4">
            <Button 
              variant="secondary" 
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 font-medium"
            >
              Volver al Panel
            </Button>
            <Button 
              variant="primary" 
              onClick={() => window.print()}
              className="px-4 py-2 font-medium shadow-[0_0_15px_rgba(5,43,88,0.3)]"
            >
              Exportar PDF
            </Button>
          </div>
        </header>

        {/* Viewer Content */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] gap-4">
              <div className="w-10 h-10 rounded-full border-2 border-hairline border-t-brand-primary animate-spin"></div>
              <p className="text-body-sm text-ink-muted animate-pulse">Recuperando contenido generado...</p>
            </div>
          ) : !content ? (
             <div className="flex flex-col items-center justify-center h-full min-h-[400px] gap-4">
                <p className="text-body font-semibold text-rose-400">Error al cargar el contenido.</p>
             </div>
          ) : (
            <div className="flex flex-col w-full">
              
              {/* Tab Navigation */}
              <div className="border-b border-hairline bg-surface-1/40 px-6 sm:px-10 flex gap-6 sm:gap-8 overflow-x-auto sticky top-0 z-20 backdrop-blur-md">
                <button 
                  onClick={() => setActiveTab('teoria')}
                  className={`py-4 text-body-sm font-medium transition-all border-b-2 cursor-pointer whitespace-nowrap ${activeTab === 'teoria' ? 'border-brand-primary text-ink' : 'border-transparent text-ink-muted hover:text-ink'}`}
                >
                  Teoría Docente
                </button>
                <button 
                  onClick={() => setActiveTab('ejercicios')}
                  className={`py-4 text-body-sm font-medium transition-all border-b-2 cursor-pointer whitespace-nowrap ${activeTab === 'ejercicios' ? 'border-brand-primary text-ink' : 'border-transparent text-ink-muted hover:text-ink'}`}
                >
                  Ejercicios Prácticos
                </button>
                <button 
                  onClick={() => setActiveTab('evaluacion')}
                  className={`py-4 text-body-sm font-medium transition-all border-b-2 cursor-pointer whitespace-nowrap ${activeTab === 'evaluacion' ? 'border-brand-primary text-ink' : 'border-transparent text-ink-muted hover:text-ink'}`}
                >
                  Evaluación (Quizzes)
                </button>
                <button 
                  onClick={() => setActiveTab('diapositivas')}
                  className={`py-4 text-body-sm font-medium transition-all border-b-2 cursor-pointer whitespace-nowrap ${activeTab === 'diapositivas' ? 'border-brand-primary text-ink' : 'border-transparent text-ink-muted hover:text-ink'}`}
                >
                  Diapositivas
                </button>
              </div>

              {/* Content Body */}
              <div className="p-6 sm:p-10 w-full max-w-5xl mx-auto animate-fade-in pb-20">
                
                {/* 1. Teoría */}
                {activeTab === 'teoria' && (
                  <Card surface="1" className="p-8 sm:p-12 shadow-xl border-hairline bg-surface-1">
                    <div className="prose prose-invert max-w-none text-ink text-body-sm sm:text-body leading-relaxed whitespace-pre-line">
                      {content.teoria}
                    </div>
                  </Card>
                )}

                {/* 2. Ejercicios */}
                {activeTab === 'ejercicios' && (
                  <Card surface="1" className="p-8 sm:p-12 shadow-xl border-hairline bg-surface-1">
                    <div className="prose prose-invert max-w-none text-ink text-body-sm sm:text-body leading-relaxed whitespace-pre-line">
                      {content.ejercicios}
                    </div>
                  </Card>
                )}

                {/* 3. Evaluacion */}
                {activeTab === 'evaluacion' && (
                  <div className="flex flex-col gap-8">
                    <div className="flex flex-col gap-2">
                      <h3 className="text-body-lg font-bold text-ink tracking-tight">Banco de Preguntas</h3>
                      <p className="text-body-sm text-ink-muted">Valida el conocimiento de tus alumnos con estas preguntas autogeneradas.</p>
                    </div>
                    {content.evaluacion.map((q, qIndex) => {
                      const isCorrect = checkedAnswers[qIndex] === q.opcionCorrectaIndex;
                      const isAnswered = checkedAnswers[qIndex] !== undefined;

                      return (
                        <Card key={qIndex} surface="1" className="flex flex-col gap-6 p-8 shadow-md hover:shadow-xl transition-shadow duration-300 border-hairline">
                          <span className="text-caption font-mono text-ink-muted font-semibold uppercase tracking-wider bg-surface-2 w-max px-3 py-1 rounded">Pregunta #{qIndex + 1}</span>
                          <h4 className="text-body font-semibold text-ink leading-relaxed">{q.pregunta}</h4>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {q.opciones.map((opt, optIndex) => {
                              const isSelected = checkedAnswers[qIndex] === optIndex;
                              return (
                                <button
                                  key={optIndex}
                                  onClick={() => setCheckedAnswers({...checkedAnswers, [qIndex]: optIndex})}
                                  className={`text-left p-5 rounded-md text-body-sm transition-all border flex justify-between items-center cursor-pointer ${
                                    isSelected 
                                      ? 'bg-brand-primary/10 border-brand-primary text-ink font-semibold shadow-[0_2px_10px_rgba(5,43,88,0.15)]' 
                                      : 'bg-surface-2 border-hairline hover:border-hairline-strong text-ink-muted hover:text-ink'
                                  }`}
                                >
                                  <span>{opt}</span>
                                  {isSelected && <span className="w-2.5 h-2.5 rounded-full bg-brand-primary shadow-[0_0_8px_rgba(5,43,88,1)]"></span>}
                                </button>
                              );
                            })}
                          </div>

                          {/* FeedBack */}
                          {isAnswered && (
                            <div className={`mt-2 p-6 rounded-md border text-body-sm leading-relaxed flex flex-col gap-2 animate-fade-in ${isCorrect ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/5 border-rose-500/20 text-rose-400'}`}>
                              <span className="font-semibold block text-base flex items-center gap-2">
                                {isCorrect ? (
                                  <><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> ¡Respuesta Correcta!</>
                                ) : (
                                  <><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg> Respuesta Incorrecta</>
                                )}
                              </span>
                              <p className="text-ink-muted text-body-sm mt-1">{q.explicacion}</p>
                            </div>
                          )}
                        </Card>
                      );
                    })}
                  </div>
                )}

                {/* 4. Diapositivas */}
                {activeTab === 'diapositivas' && (
                  <div className="flex flex-col gap-8 animate-fade-in">
                    
                    {/* Header & Actions */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5 bg-surface-1 p-6 sm:p-8 rounded-xl border border-hairline shadow-md">
                      <div className="flex flex-col gap-1.5">
                        <h3 className="text-body-lg font-bold text-ink tracking-tight">Presentación Generada</h3>
                        <p className="text-body-sm text-ink-muted">Vista previa de las diapositivas listas para tu clase. Exporta en el formato que prefieras.</p>
                      </div>
                      <div className="flex items-center gap-3 w-full sm:w-auto">
                        <Button variant="secondary" className="flex-1 sm:flex-none flex items-center justify-center gap-2.5 px-4 py-2.5 bg-surface-2 hover:bg-surface-3 border-hairline hover:border-hairline-strong transition-all" onClick={() => alert('Generando y descargando PPTX...')}>
                          <svg className="w-4 h-4 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            <text x="9" y="15" fontSize="6" fontWeight="bold" fill="currentColor" stroke="none">PPT</text>
                          </svg>
                          <span className="font-semibold text-xs">Descargar PPTX</span>
                        </Button>
                        <Button variant="secondary" className="flex-1 sm:flex-none flex items-center justify-center gap-2.5 px-4 py-2.5 bg-surface-2 hover:bg-surface-3 border-hairline hover:border-hairline-strong transition-all" onClick={() => alert('Generando y descargando PDF...')}>
                          <svg className="w-4 h-4 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            <text x="9" y="15" fontSize="6" fontWeight="bold" fill="currentColor" stroke="none">PDF</text>
                          </svg>
                          <span className="font-semibold text-xs">Descargar PDF</span>
                        </Button>
                      </div>
                    </div>

                    {/* Preview Area */}
                    <div className="flex flex-col items-center bg-surface-2/50 p-6 sm:p-10 rounded-xl border border-hairline">
                      
                      {/* Slide Frame (16:9 Aspect Ratio) */}
                      <div className="w-full max-w-4xl aspect-video bg-white text-gray-900 rounded-lg shadow-[0_10px_40px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col p-10 sm:p-16 transition-all duration-500 transform relative group">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-primary to-indigo-400"></div>
                        
                        <div className="flex-1 flex flex-col justify-center">
                          <h2 className="text-3xl sm:text-5xl font-extrabold mb-8 text-slate-800 leading-tight tracking-tight">
                            {content.diapositivas[currentSlideIndex].titulo}
                          </h2>
                          <ul className="flex flex-col gap-6 text-lg sm:text-2xl text-slate-600 list-none ml-2">
                            {content.diapositivas[currentSlideIndex].puntos.map((pt, pIndex) => (
                              <li key={pIndex} className="flex items-start gap-5">
                                <span className="text-brand-primary mt-1.5 shrink-0 text-xl">■</span>
                                <span className="leading-relaxed">{pt}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        {/* Slide Footer */}
                        <div className="flex justify-between items-center mt-12 pt-6 border-t border-slate-200">
                          <div className="flex items-center gap-3">
                            <div className="w-7 h-7 bg-brand-primary rounded flex items-center justify-center shadow-md">
                              <span className="text-white text-xs font-bold">K</span>
                            </div>
                            <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Katedra</span>
                          </div>
                          <span className="text-sm font-bold text-slate-400 font-mono">
                            {currentSlideIndex + 1} / {content.diapositivas.length}
                          </span>
                        </div>
                      </div>

                      {/* Presentation Controls */}
                      <div className="flex items-center gap-8 mt-10">
                        <button 
                          onClick={() => setCurrentSlideIndex(Math.max(0, currentSlideIndex - 1))}
                          disabled={currentSlideIndex === 0}
                          className="w-12 h-12 rounded-full flex items-center justify-center bg-surface-1 border border-hairline text-ink hover:bg-surface-3 hover:border-hairline-strong disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
                          aria-label="Diapositiva Anterior"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                        </button>
                        
                        <div className="flex gap-2">
                          {content.diapositivas.map((_, idx) => (
                            <button
                              key={idx}
                              onClick={() => setCurrentSlideIndex(idx)}
                              className={`h-2 rounded-full transition-all duration-300 ${currentSlideIndex === idx ? 'w-8 bg-brand-primary' : 'w-2 bg-hairline-strong hover:bg-ink-muted'}`}
                              aria-label={`Ir a diapositiva ${idx + 1}`}
                            />
                          ))}
                        </div>

                        <button 
                          onClick={() => setCurrentSlideIndex(Math.min(content.diapositivas.length - 1, currentSlideIndex + 1))}
                          disabled={currentSlideIndex === content.diapositivas.length - 1}
                          className="w-12 h-12 rounded-full flex items-center justify-center bg-surface-1 border border-hairline text-ink hover:bg-surface-3 hover:border-hairline-strong disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
                          aria-label="Siguiente Diapositiva"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
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

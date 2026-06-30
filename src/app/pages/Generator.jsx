import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGenerator } from '../hooks/useGenerator';
import { Input, Textarea } from '../components/Input';
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

export default function Generator() {
  const navigate = useNavigate();
  const [mobileActiveTab, setMobileActiveTab] = useState('config');
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  
  const {
    tema, setTema,
    materia, setMateria,
    unidades, setUnidades,
    isGenerating,
    generationStep,
    generatedData,
    activeTab, setActiveTab,
    checkedAnswers, setCheckedAnswers,
    handleGenerate
  } = useGenerator();

  return (
    <div className="w-full h-screen bg-canvas text-ink flex flex-col md:flex-row font-sans overflow-hidden">
      
      <ResponsiveSidebar />

      <main className="flex-1 flex flex-col min-w-0 bg-surface-2 relative h-screen">
        
        <header className="min-h-[88px] border-b border-hairline bg-canvas/90 backdrop-blur-md sticky top-0 z-30 w-full flex items-center py-4 sm:py-0">
          <div className="w-full px-6 sm:px-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex flex-col flex-1 min-w-0 pr-4">
              <h2 className="text-sm sm:text-base font-bold text-ink leading-snug">Editor de Temarios con IA</h2>
              <span className="text-[11px] font-medium text-brand-secure mt-1">Generación de Contenido Académico</span>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <Button 
                variant="secondary"
                onClick={() => navigate('/dashboard')}
                className="px-5 py-2.5 text-xs font-bold bg-surface-1 hover:bg-surface-3 transition-colors border-hairline rounded-xl shadow-sm"
              >
                Volver al Panel
              </Button>
            </div>
          </div>
        </header>

        <div className="lg:hidden flex border-b border-hairline bg-canvas p-4 gap-3 sticky top-[88px] z-20 w-full">
          <button
            onClick={() => setMobileActiveTab('config')}
            className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all cursor-pointer text-center ${
              mobileActiveTab === 'config'
                ? 'bg-brand-primary text-white shadow-soft'
                : 'text-ink-subtle hover:text-ink bg-surface-2 hover:bg-surface-3 border border-transparent'
            }`}
          >
            Configuración
          </button>
          <button
            onClick={() => setMobileActiveTab('content')}
            className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all cursor-pointer text-center flex items-center justify-center gap-2 relative ${
              mobileActiveTab === 'content'
                ? 'bg-brand-primary text-white shadow-soft'
                : 'text-ink-subtle hover:text-ink bg-surface-2 hover:bg-surface-3 border border-transparent'
            }`}
          >
            {isGenerating ? 'Generando...' : 'Contenido AI'}
            {isGenerating && (
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
              </span>
            )}
          </button>
        </div>

        <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden">
          
          <section className={`w-full lg:w-[460px] border-b lg:border-b-0 lg:border-r border-hairline bg-canvas p-6 sm:p-10 flex flex-col gap-10 overflow-y-auto shrink-0 scrollbar-none ${
            mobileActiveTab === 'config' ? 'flex' : 'hidden lg:flex'
          }`}>
            <div className="flex flex-col gap-2">
              <h3 className="text-3xl font-bold tracking-tight text-ink">Configuración</h3>
              <p className="text-sm text-ink-subtle leading-relaxed font-medium">Proporciona los datos del curso para la IA y personaliza los subtemas a estructurar.</p>
            </div>

            <div className="flex flex-col gap-8">
              <Input 
                label="Asignatura / Curso"
                value={materia}
                onChange={(e) => setMateria(e.target.value)}
                placeholder="Ej. Programación I"
                className="py-4 px-5 text-sm rounded-2xl"
              />
              <Input 
                label="Tema Principal"
                value={tema}
                onChange={(e) => setTema(e.target.value)}
                placeholder="Ej. Estructuras de Datos Lineales"
                className="py-4 px-5 text-sm rounded-2xl"
              />
              <Textarea 
                label="Subtemas o Unidades (Sílabo)"
                rows={7}
                value={unidades}
                onChange={(e) => setUnidades(e.target.value)}
                placeholder="Ej. 1.1 Pilas (push, pop)&#10;1.2 Listas enlazadas&#10;1.3 Colas de prioridad"
                className="py-4 px-5 text-sm rounded-2xl"
              />

              <Button
                variant="primary"
                onClick={() => {
                  handleGenerate();
                  setMobileActiveTab('content');
                }}
                disabled={isGenerating || !tema || !materia}
                className="w-full py-4.5 text-sm font-bold shadow-elevated hover:-translate-y-1 transition-all duration-300 rounded-xl bg-brand-primary text-white mt-4 disabled:opacity-50 disabled:hover:translate-y-0"
              >
                {isGenerating ? 'Generando Material...' : 'Generar Material con IA'}
              </Button>
            </div>

            <div className="p-6 text-xs text-brand-primary leading-relaxed border border-brand-primary/20 bg-brand-primary/5 rounded-2xl mt-auto shadow-sm">
              <span className="font-bold block mb-2 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                Nota del Motor AI
              </span>
              Esta integración generará teoría completa, ejercicios con soluciones, un examen evaluatorio estructurado de opción múltiple y el esquema para diapositivas docentes de apoyo.
            </div>
          </section>

          <section className={`flex-1 flex flex-col bg-surface-2 min-w-0 ${
            mobileActiveTab === 'content' ? 'flex' : 'hidden lg:flex'
          }`}>
            
            <div className="h-[72px] border-b border-hairline bg-canvas overflow-x-auto w-full select-none sticky top-0 z-10 scrollbar-none">
              <div className="w-full h-full px-6 sm:px-10 flex items-center gap-6 sm:gap-10 min-w-[600px]">
                {[
                  { id: 'teoria', label: 'Teoría Docente' },
                  { id: 'ejercicios', label: 'Ejercicios Prácticos' },
                  { id: 'evaluacion', label: 'Evaluación' },
                  { id: 'diapositivas', label: 'Diapositivas' }
                ].map((tab) => (
                  <button 
                    key={tab.id}
                    disabled={!generatedData}
                    onClick={() => setActiveTab(tab.id)}
                    className={`h-full text-xs sm:text-[13px] px-2 font-bold transition-all border-b-[3px] cursor-pointer whitespace-nowrap ${
                      activeTab === tab.id && generatedData 
                        ? 'text-brand-primary border-brand-primary' 
                        : 'text-ink-subtle border-transparent hover:text-ink hover:bg-surface-2 disabled:opacity-30 disabled:cursor-not-allowed'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-none">
              <div className="p-6 sm:p-10 lg:p-12 w-full max-w-5xl mx-auto">
              
                {isGenerating && (
                  <div className="min-h-[500px] flex flex-col items-center justify-center gap-8 text-center py-20 bg-canvas border border-hairline rounded-[32px] shadow-sm px-8">
                    <div className="w-12 h-12 rounded-full border-[3px] border-surface-3 border-t-brand-primary animate-spin"></div>
                    <div className="flex flex-col gap-3 max-w-lg">
                      <p className="text-xl font-bold text-ink tracking-tight">El motor de IA está cocinando tu contenido...</p>
                      <p className="text-xs text-brand-primary font-bold uppercase tracking-widest animate-pulse bg-brand-primary/10 px-4 py-2 rounded-xl w-max mx-auto border border-brand-primary/20">{generationStep}</p>
                    </div>
                  </div>
                )}

                {!isGenerating && !generatedData && (
                  <div className="min-h-[500px] flex flex-col items-center justify-center gap-8 text-center py-20 px-10 bg-canvas/50 border-2 border-dashed border-hairline-strong rounded-[32px]">
                    <div className="w-16 h-16 rounded-[20px] bg-canvas border border-hairline flex items-center justify-center shadow-sm">
                      <svg className="w-8 h-8 text-brand-primary opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                      </svg>
                    </div>
                    <div className="flex flex-col gap-3 max-w-md">
                      <h4 className="text-xl font-bold text-ink">Material Académico Vacío</h4>
                      <p className="text-sm text-ink-subtle leading-relaxed font-medium">
                        Usa el panel de configuración a la izquierda para ingresar el nombre de la asignatura y el temario.
                      </p>
                    </div>
                  </div>
                )}

                {!isGenerating && generatedData && (
                  <div className="flex flex-col gap-8 sm:gap-10 animate-fade-in pb-24">
                    
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
                            <h1 className="text-2xl sm:text-3xl font-bold text-ink mb-2">{tema || 'Módulo Teórico'}</h1>
                            <p className="text-sm font-bold text-brand-primary">{materia || 'Material Académico'}</p>
                          </div>
                          
                          <div className="text-sm sm:text-base text-ink-muted leading-relaxed font-medium whitespace-pre-line">
                            {generatedData.teoria}
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
                          {generatedData.ejercicios}
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
                          {generatedData.evaluacion.map((q, qIndex) => {
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
                                {generatedData.diapositivas[currentSlideIndex].titulo}
                              </h2>
                              <ul className="flex flex-col gap-5 text-sm sm:text-xl text-slate-600 dark:text-slate-300 font-medium">
                                {generatedData.diapositivas[currentSlideIndex].puntos.map((pt, pIndex) => (
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
                                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{materia || 'Material AI'}</span>
                              </div>
                              <span className="text-xs font-bold text-slate-400 dark:text-slate-500 font-mono tracking-widest">
                                {String(currentSlideIndex + 1).padStart(2, '0')} / {String(generatedData.diapositivas.length).padStart(2, '0')}
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
                              {generatedData.diapositivas.map((_, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => setCurrentSlideIndex(idx)}
                                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${currentSlideIndex === idx ? 'w-6 bg-brand-primary' : 'w-2 bg-ink-tertiary hover:bg-ink-muted'}`}
                                />
                              ))}
                            </div>

                            <button 
                              onClick={() => setCurrentSlideIndex(Math.min(generatedData.diapositivas.length - 1, currentSlideIndex + 1))}
                              disabled={currentSlideIndex === generatedData.diapositivas.length - 1}
                              className="w-10 h-10 rounded-full flex items-center justify-center bg-canvas border border-hairline text-ink hover:bg-surface-3 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer shadow-sm"
                            >
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                            </button>
                          </div>

                        </div>
                      </div>
                    )}
                    
                  </div>
                )}

              </div>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}

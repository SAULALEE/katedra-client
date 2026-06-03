import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGenerator } from '../hooks/useGenerator';
import { Input, Textarea } from '../components/Input';
import Button from '../components/Button';
import Card from '../components/Card';
import ResponsiveSidebar from '../components/ResponsiveSidebar';

export default function Generator() {
  const navigate = useNavigate();
  const [mobileActiveTab, setMobileActiveTab] = React.useState('config');
  
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
    <div className="w-full min-h-screen bg-canvas text-ink flex flex-col md:flex-row selection:bg-brand-primary selection:text-white">
      
      {/* Sidebar Navigation */}
      <ResponsiveSidebar />

      {/* Main Content Workspace */}
      <main className="flex-1 flex flex-col min-w-0 bg-canvas">
        
        {/* Top Navbar (Consistent h-[56px] header from DESIGN.md) */}
        <header className="h-[56px] border-b border-hairline bg-canvas/80 backdrop-blur-md sticky top-0 z-30 w-full flex items-center">
          <div className="w-full px-6 sm:px-8 flex items-center justify-between">
            <h2 className="text-sm font-semibold tracking-card-title text-ink">Editor de Temarios con IA</h2>
            <div className="flex items-center gap-3">
              <Button 
                variant="secondary"
                onClick={() => navigate('/dashboard')}
                className="px-3.5 py-1.5 text-xs font-bold"
              >
                Volver al Panel
              </Button>
            </div>
          </div>
        </header>

        {/* Mobile Segmented Tab Control (Sticky under main header) */}
        <div className="lg:hidden flex border-b border-hairline bg-surface-1/60 p-3.5 gap-3 sticky top-[56px] z-20 w-full backdrop-blur-md">
          <button
            onClick={() => setMobileActiveTab('config')}
            className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all cursor-pointer text-center ${
              mobileActiveTab === 'config'
                ? 'bg-brand-primary text-white shadow-[0_2px_12px_rgba(14,165,233,0.3)]'
                : 'text-ink-muted hover:text-ink bg-surface-2/40 hover:bg-surface-2'
            }`}
          >
            Configuración del Material
          </button>
          <button
            onClick={() => setMobileActiveTab('content')}
            className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all cursor-pointer text-center flex items-center justify-center gap-2 relative ${
              mobileActiveTab === 'content'
                ? 'bg-brand-primary text-white shadow-[0_2px_12px_rgba(14,165,233,0.3)]'
                : 'text-ink-muted hover:text-ink bg-surface-2/40 hover:bg-surface-2'
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

        {/* Main split work space */}
        <div className="flex-1 flex flex-col lg:flex-row min-h-0">
          
          {/* Left Side: Setup Wizard Panel */}
          <section className={`w-full lg:w-[420px] border-b lg:border-b-0 lg:border-r border-hairline bg-surface-1/60 p-6 sm:p-8 md:p-10 flex flex-col gap-8 overflow-y-auto shrink-0 ${
            mobileActiveTab === 'config' ? 'flex' : 'hidden lg:flex'
          }`}>
            <div>
              <h3 className="text-body-lg font-bold tracking-card-title text-ink mb-2">Configuración del Temario</h3>
              <p className="text-caption text-ink-muted leading-relaxed">Proporciona los datos del curso para la IA y personaliza los subtemas.</p>
            </div>

            <div className="flex flex-col gap-6">
              {/* Input 1: Materia */}
              <Input 
                label="Asignatura / Curso"
                value={materia}
                onChange={(e) => setMateria(e.target.value)}
                placeholder="Ej. Programación I"
              />

              {/* Input 2: Tema General */}
              <Input 
                label="Tema Principal"
                value={tema}
                onChange={(e) => setTema(e.target.value)}
                placeholder="Ej. Estructuras de Datos Lineales"
              />

              {/* Input 3: Detalle del Sílabo */}
              <Textarea 
                label="Subtemas o Unidades (Sílabo)"
                rows={6}
                value={unidades}
                onChange={(e) => setUnidades(e.target.value)}
                placeholder="Ej. 1.1 Pilas (push, pop)&#10;1.2 Listas enlazadas&#10;1.3 Colas de prioridad"
              />

              {/* Generate Button */}
              <Button
                variant="primary"
                onClick={() => {
                  handleGenerate();
                  setMobileActiveTab('content');
                }}
                disabled={isGenerating || !tema || !materia}
                className="w-full py-4 text-body-sm font-semibold shadow-[0_0_20px_rgba(5,43,88,0.3)] hover:shadow-[0_0_25px_rgba(5,43,88,0.5)] transition-all duration-200 rounded-xl cursor-pointer mt-2"
              >
                {isGenerating ? 'Generando Material...' : 'Generar Material con IA'}
              </Button>
            </div>

            {/* Prompting Note using custom Card */}
            <Card surface="2" className="p-6 text-caption text-ink-subtle leading-relaxed border border-hairline bg-surface-2/30 rounded-xl mt-auto">
              <span className="font-semibold text-ink block mb-2">Nota del Motor AI</span>
              Esta llamada integra prompts validados según `ai-integration.md`. Generará teoría completa, ejercicios con soluciones, un examen evaluatorio estructurado de 3 preguntas y 3 diapositivas docentes de apoyo.
            </Card>
          </section>

          {/* Right Side: Result Viewer Panel */}
          <section className={`flex-1 flex flex-col bg-canvas min-w-0 ${
            mobileActiveTab === 'content' ? 'flex' : 'hidden lg:flex'
          }`}>
            
            {/* Tab Selection */}
            <div className="h-14 border-b border-hairline bg-surface-1/40 overflow-x-auto w-full select-none sticky top-0 z-10">
              <div className="w-full h-full px-6 sm:px-8 flex items-center gap-2 min-w-[550px]">
                <button 
                  disabled={!generatedData}
                  onClick={() => setActiveTab('teoria')}
                  className={`h-full text-body-sm px-4.5 font-bold transition-all border-b-2 cursor-pointer flex items-center gap-2 ${activeTab === 'teoria' && generatedData ? 'text-ink border-brand-primary' : 'text-ink-muted border-transparent hover:text-ink disabled:opacity-30 disabled:cursor-not-allowed'}`}
                >
                  Teoría
                </button>
                <button 
                  disabled={!generatedData}
                  onClick={() => setActiveTab('ejercicios')}
                  className={`h-full text-body-sm px-4.5 font-bold transition-all border-b-2 cursor-pointer flex items-center gap-2 ${activeTab === 'ejercicios' && generatedData ? 'text-ink border-brand-primary' : 'text-ink-muted border-transparent hover:text-ink disabled:opacity-30 disabled:cursor-not-allowed'}`}
                >
                  Ejercicios Prácticos
                </button>
                <button 
                  disabled={!generatedData}
                  onClick={() => setActiveTab('evaluacion')}
                  className={`h-full text-body-sm px-4.5 font-bold transition-all border-b-2 cursor-pointer flex items-center gap-2 ${activeTab === 'evaluacion' && generatedData ? 'text-ink border-brand-primary' : 'text-ink-muted border-transparent hover:text-ink disabled:opacity-30 disabled:cursor-not-allowed'}`}
                >
                  Evaluación (Quizzes)
                </button>
                <button 
                  disabled={!generatedData}
                  onClick={() => setActiveTab('diapositivas')}
                  className={`h-full text-body-sm px-4.5 font-bold transition-all border-b-2 cursor-pointer flex items-center gap-2 ${activeTab === 'diapositivas' && generatedData ? 'text-ink border-brand-primary' : 'text-ink-muted border-transparent hover:text-ink disabled:opacity-30 disabled:cursor-not-allowed'}`}
                >
                  Diapositivas
                </button>
              </div>
            </div>

            {/* Content Wrapper */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-6 sm:p-8 md:p-10 lg:p-12 w-full max-w-5xl mx-auto">
              
                {/* State A: Generating AI Loading state */}
                {isGenerating && (
                  <div className="min-h-[450px] flex flex-col items-center justify-center gap-6 text-center py-20 bg-surface-1/20 border border-hairline rounded-2xl px-6">
                    {/* Custom Spinner */}
                    <div className="w-12 h-12 rounded-full border-2 border-hairline border-t-brand-primary animate-spin"></div>
                    <div className="flex flex-col gap-2 max-w-md">
                      <p className="text-body font-bold text-ink">El motor de IA está cocinando tu contenido...</p>
                      <p className="text-xs text-brand-primary font-mono font-bold animate-pulse tracking-wide bg-brand-primary/10 px-3 py-1 rounded-lg w-max mx-auto border border-brand-primary/20">{generationStep}</p>
                    </div>
                  </div>
                )}

                {/* State B: Empty State (No generation yet) */}
                {!isGenerating && !generatedData && (
                  <div className="min-h-[450px] flex flex-col items-center justify-center gap-6 text-center py-20 px-8 bg-surface-1/30 border border-dashed border-hairline rounded-2xl">
                    <div className="w-14 h-14 rounded-2xl bg-surface-1 border border-hairline flex items-center justify-center text-ink-muted shadow-md">
                      <svg className="w-7 h-7 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                      </svg>
                    </div>
                    <div className="flex flex-col gap-2 max-w-sm">
                      <h4 className="text-body font-bold text-ink">Material Académico Vacío</h4>
                      <p className="text-xs text-ink-muted leading-relaxed">
                        Usa el panel de configuración para ingresar el nombre de la asignatura y el temario. Haz clic en "Generar Material con IA" para comenzar.
                      </p>
                    </div>
                  </div>
                )}

                {/* State C: Render Output */}
                {!isGenerating && generatedData && (
                  <div className="flex flex-col gap-8 sm:gap-10 animate-fade-in">
                    
                    {/* 1. Teoría Tab View */}
                    {activeTab === 'teoria' && (
                      <div className="flex flex-col gap-8 prose prose-invert max-w-none text-ink bg-surface-1 p-6 sm:p-10 border border-hairline rounded-2xl shadow-xl">
                        <div className="flex justify-between items-center border-b border-hairline pb-5 select-none">
                          <span className="text-[10px] uppercase tracking-wider text-brand-primary font-bold bg-brand-primary/10 border border-brand-primary/20 px-3 py-1.5 rounded-lg">Teoría Docente</span>
                          <button 
                            onClick={() => window.print()}
                            className="text-xs text-ink-muted hover:text-ink hover:underline cursor-pointer font-bold"
                          >
                            Imprimir / Guardar PDF
                          </button>
                        </div>
                        {/* Rendered Text */}
                        <div className="whitespace-pre-line flex flex-col gap-5 text-sm sm:text-[15px] text-ink-muted leading-relaxed">
                          {generatedData.teoria}
                        </div>
                      </div>
                    )}

                    {/* 2. Ejercicios Tab View */}
                    {activeTab === 'ejercicios' && (
                      <div className="flex flex-col gap-8 text-ink bg-surface-1 p-6 sm:p-10 border border-hairline rounded-2xl shadow-xl">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 border-b border-hairline pb-5 select-none">
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] uppercase tracking-wider text-brand-primary font-bold bg-brand-primary/10 border border-brand-primary/20 px-3 py-1.5 rounded-lg">Guía Práctica</span>
                            <span className="text-xs text-ink-muted font-medium hidden md:inline">Contiene ejercicios resueltos</span>
                          </div>
                          
                          {/* Export buttons row */}
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] uppercase tracking-widest text-ink-muted font-bold mr-1">Exportar a:</span>
                            <button 
                              onClick={() => alert('Exportar ejercicios a Google Forms (Simulado)')}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-wide uppercase border border-[#7248B9]/30 bg-[#7248B9]/5 hover:bg-[#7248B9]/15 text-[#7248B9] dark:text-[#b392f0] transition-colors cursor-pointer select-none"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              Google Forms
                            </button>
                            <button 
                              onClick={() => alert('Exportar ejercicios a Microsoft Forms (Simulado)')}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-wide uppercase border border-[#00828a]/30 bg-[#00828a]/5 hover:bg-[#00828a]/15 text-[#00828a] dark:text-[#33c2cc] transition-colors cursor-pointer select-none"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                              </svg>
                              MS Forms
                            </button>
                          </div>
                        </div>
                        <div className="whitespace-pre-line flex flex-col gap-5 text-sm sm:text-[15px] text-ink-muted leading-relaxed">
                          {generatedData.ejercicios}
                        </div>
                      </div>
                    )}

                    {/* 3. Evaluacion Tab View */}
                    {activeTab === 'evaluacion' && (
                      <div className="flex flex-col gap-8">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 border-b border-hairline pb-5 select-none">
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] uppercase tracking-wider text-brand-primary font-bold bg-brand-primary/10 border border-brand-primary/20 px-3 py-1.5 rounded-lg">Banco de Evaluaciones</span>
                            <span className="text-xs text-ink-muted font-medium hidden sm:inline">3 preguntas de opción múltiple</span>
                          </div>

                          {/* Export buttons row */}
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] uppercase tracking-widest text-ink-muted font-bold mr-1">Exportar a:</span>
                            <button 
                              onClick={() => alert('Exportar examen a Google Forms (Simulado)')}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-wide uppercase border border-[#7248B9]/30 bg-[#7248B9]/5 hover:bg-[#7248B9]/15 text-[#7248B9] dark:text-[#b392f0] transition-colors cursor-pointer select-none"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              Google Forms
                            </button>
                            <button 
                              onClick={() => alert('Exportar examen a Microsoft Forms (Simulado)')}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-wide uppercase border border-[#00828a]/30 bg-[#00828a]/5 hover:bg-[#00828a]/15 text-[#00828a] dark:text-[#33c2cc] transition-colors cursor-pointer select-none"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                              </svg>
                              MS Forms
                            </button>
                          </div>
                        </div>

                        <div className="flex flex-col gap-8">
                          {generatedData.evaluacion.map((q, qIndex) => {
                            const isCorrect = checkedAnswers[qIndex] === q.opcionCorrectaIndex;
                            const isAnswered = checkedAnswers[qIndex] !== undefined;

                            return (
                              <Card key={qIndex} surface="1" className="flex flex-col gap-6 p-6 sm:p-10 border border-hairline rounded-2xl">
                                <span className="text-[10px] font-mono text-ink-muted font-bold uppercase tracking-wider bg-surface-2 px-3.5 py-1.5 rounded-lg w-max select-none">Pregunta #{qIndex + 1}</span>
                                <h4 className="text-sm sm:text-[17px] font-bold text-ink leading-relaxed">{q.pregunta}</h4>
                                
                                {/* Options */}
                                <div className="grid grid-cols-1 gap-4">
                                  {q.opciones.map((opt, optIndex) => {
                                    const isSelected = checkedAnswers[qIndex] === optIndex;
                                    return (
                                      <button
                                        key={optIndex}
                                        onClick={() => setCheckedAnswers({...checkedAnswers, [qIndex]: optIndex})}
                                        className={`w-full text-left p-4.5 rounded-xl text-sm transition-all border flex justify-between items-center cursor-pointer ${
                                          isSelected 
                                            ? 'bg-brand-primary/10 border-brand-primary text-ink font-semibold shadow-[0_2px_12px_rgba(14,165,233,0.15)]' 
                                            : 'bg-surface-2 border-hairline hover:border-hairline-strong text-ink-muted hover:text-ink'
                                        }`}
                                      >
                                        <span>{opt}</span>
                                        {isSelected && <span className="w-2.5 h-2.5 rounded-full bg-brand-primary shadow-[0_0_8px_rgba(14,165,233,1)]"></span>}
                                      </button>
                                    );
                                  })}
                                </div>

                                {/* FeedBack */}
                                {isAnswered && (
                                  <div className={`p-5.5 rounded-xl border text-sm leading-relaxed flex flex-col gap-2 ${isCorrect ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/5 border-rose-500/20 text-rose-400'}`}>
                                    <span className="font-bold block">{isCorrect ? '✓ Respuesta Correcta' : '✗ Respuesta Incorrecta'}</span>
                                    <p className="text-ink-muted text-xs mt-1 leading-relaxed">{q.explicacion}</p>
                                  </div>
                                )}
                              </Card>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* 4. Diapositivas Tab View */}
                    {activeTab === 'diapositivas' && (
                      <div className="flex flex-col gap-8">
                        <div className="flex justify-between items-center border-b border-hairline pb-5 select-none">
                          <span className="text-[10px] uppercase tracking-wider text-brand-primary font-bold bg-brand-primary/10 border border-brand-primary/20 px-3 py-1.5 rounded-lg">Esquemas de Diapositivas</span>
                          <span className="text-xs text-ink-muted font-medium">3 láminas de apoyo</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {generatedData.diapositivas.map((slide, sIndex) => (
                            <Card key={sIndex} surface="1" className="flex flex-col justify-between aspect-auto md:aspect-[4/3] min-h-[260px] p-6 sm:p-8 rounded-2xl hover:border-brand-primary/40 transition-all duration-300 bg-surface-1 border border-hairline">
                              <div>
                                <span className="text-[9px] uppercase tracking-wider text-brand-primary font-bold bg-brand-primary/10 px-2.5 py-1 rounded-lg block w-max mb-4 select-none">Lámina #{sIndex + 1}</span>
                                <h4 className="text-sm font-bold text-ink mb-4 leading-snug">{slide.titulo}</h4>
                                <ul className="flex flex-col gap-2.5 text-xs text-ink-muted list-disc list-inside leading-relaxed">
                                  {slide.puntos.map((pt, pIndex) => (
                                    <li key={pIndex}>{pt}</li>
                                  ))}
                                </ul>
                              </div>
                              <span className="text-[9px] text-ink-tertiary text-right mt-6 font-mono select-none">Katedra Presentador</span>
                            </Card>
                          ))}
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

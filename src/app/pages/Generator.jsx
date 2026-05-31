import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGenerator } from '../hooks/useGenerator';
import { Input, Textarea } from '../components/Input';
import Button from '../components/Button';
import Card from '../components/Card';

export default function Generator() {
  const navigate = useNavigate();
  
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
    <div className="w-full min-h-screen bg-canvas text-ink flex flex-col selection:bg-brand-primary selection:text-white">
      
      {/* Header bar */}
      <header className="h-[56px] border-b border-hairline px-4 sm:px-6 flex items-center justify-between bg-canvas/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/dashboard')}>
          <div className="w-5 h-5 rounded-sm bg-brand-primary flex items-center justify-center shadow-[0_0_12px_rgba(5,43,88,0.5)]">
            <span className="text-[10px] font-bold text-white">K</span>
          </div>
          <span className="font-sans font-semibold tracking-subhead text-[15px] hidden xs:block">Katedra — Editor de Temarios</span>
        </div>

        <div className="flex items-center gap-3">
          <Button 
            variant="secondary"
            onClick={() => navigate('/dashboard')}
            className="px-3.5 py-1.5 text-xs"
          >
            Volver al Panel
          </Button>
        </div>
      </header>

      {/* Main split work space */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0">
        
        {/* Left Side: Setup Wizard Panel */}
        <section className="w-full lg:w-100 border-b lg:border-b-0 lg:border-r border-hairline bg-surface-1/60 p-6 sm:p-8 flex flex-col gap-6 overflow-y-auto shrink-0">
          <div>
            <h3 className="text-body-lg font-semibold tracking-card-title text-ink mb-1">Configuración del Temario</h3>
            <p className="text-caption text-ink-muted">Proporciona los datos del curso para la IA.</p>
          </div>

          <div className="flex flex-col gap-5">
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
              rows={5}
              value={unidades}
              onChange={(e) => setUnidades(e.target.value)}
              placeholder="Ej. 1.1 Pilas (push, pop)&#10;1.2 Listas enlazadas&#10;1.3 Colas de prioridad"
            />

            {/* Generate Button */}
            <Button
              variant="primary"
              onClick={handleGenerate}
              disabled={isGenerating || !tema || !materia}
              className="w-full py-4 text-body-sm font-semibold shadow-[0_0_20px_rgba(5,43,88,0.3)] hover:shadow-[0_0_25px_rgba(5,43,88,0.5)] transition-shadow duration-200"
            >
              {isGenerating ? 'Generando Material...' : 'Generar Material con IA'}
            </Button>
          </div>

          {/* Prompting Note using custom Card */}
          <Card surface="2" className="p-5 text-caption text-ink-subtle leading-relaxed border border-hairline bg-surface-2/30">
            <span className="font-semibold text-ink block mb-1.5">Nota del Motor AI</span>
            Esta llamada integra prompts validados según `ai-integration.md`. Generará teoría completa, ejercicios con soluciones, un examen evaluatorio estructurado de 3 preguntas y 3 diapositivas docentes de apoyo.
          </Card>
        </section>

        {/* Right Side: Result Viewer Panel */}
        <section className="flex-1 flex flex-col bg-canvas min-w-0">
          
          {/* Tab Selection */}
          <div className="h-12 border-b border-hairline bg-surface-1/40 overflow-x-auto w-full select-none">
            <div className="w-full h-full px-6 sm:px-8 flex items-center gap-2 min-w-[500px]">
              <button 
                disabled={!generatedData}
                onClick={() => setActiveTab('teoria')}
                className={`h-full text-body-sm px-4 font-medium transition-all border-b-2 cursor-pointer flex items-center gap-2 ${activeTab === 'teoria' && generatedData ? 'text-ink border-brand-primary' : 'text-ink-muted border-transparent hover:text-ink disabled:opacity-30 disabled:cursor-not-allowed'}`}
              >
                Teoría
              </button>
              <button 
                disabled={!generatedData}
                onClick={() => setActiveTab('ejercicios')}
                className={`h-full text-body-sm px-4 font-medium transition-all border-b-2 cursor-pointer flex items-center gap-2 ${activeTab === 'ejercicios' && generatedData ? 'text-ink border-brand-primary' : 'text-ink-muted border-transparent hover:text-ink disabled:opacity-30 disabled:cursor-not-allowed'}`}
              >
                Ejercicios Prácticos
              </button>
              <button 
                disabled={!generatedData}
                onClick={() => setActiveTab('evaluacion')}
                className={`h-full text-body-sm px-4 font-medium transition-all border-b-2 cursor-pointer flex items-center gap-2 ${activeTab === 'evaluacion' && generatedData ? 'text-ink border-brand-primary' : 'text-ink-muted border-transparent hover:text-ink disabled:opacity-30 disabled:cursor-not-allowed'}`}
              >
                Evaluación (Quizzes)
              </button>
              <button 
                disabled={!generatedData}
                onClick={() => setActiveTab('diapositivas')}
                className={`h-full text-body-sm px-4 font-medium transition-all border-b-2 cursor-pointer flex items-center gap-2 ${activeTab === 'diapositivas' && generatedData ? 'text-ink border-brand-primary' : 'text-ink-muted border-transparent hover:text-ink disabled:opacity-30 disabled:cursor-not-allowed'}`}
              >
                Diapositivas
              </button>
            </div>
          </div>

          {/* Content Wrapper */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6 sm:p-8 md:p-12 w-full max-w-5xl mx-auto">
            
              {/* State A: Generating AI Loading state */}
              {isGenerating && (
                <div className="h-[450px] flex flex-col items-center justify-center gap-6 text-center">
                  {/* Custom Spinner */}
                  <div className="w-12 h-12 rounded-full border-2 border-hairline border-t-brand-primary animate-spin"></div>
                  <div className="flex flex-col gap-2">
                    <p className="text-body-lg font-semibold text-ink">El motor de IA está cocinando tu contenido...</p>
                    <p className="text-body-sm text-brand-primary-hover font-mono font-medium animate-pulse">{generationStep}</p>
                  </div>
                </div>
              )}

              {/* State B: Empty State (No generation yet) */}
              {!isGenerating && !generatedData && (
                <div className="h-[450px] flex flex-col items-center justify-center gap-5 text-center">
                  <div className="w-14 h-14 rounded-lg bg-surface-1 border border-hairline flex items-center justify-center text-ink-muted shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
                    <svg className="w-7 h-7 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                  </div>
                  <div className="flex flex-col gap-2 max-w-sm">
                    <h4 className="text-body font-semibold text-ink">Material Académico Vacío</h4>
                    <p className="text-body-sm text-ink-muted leading-relaxed">
                      Usa el panel lateral para ingresar el nombre de la asignatura y la unidad. Haz clic en "Generar Material con IA" para comenzar.
                    </p>
                  </div>
                </div>
              )}

              {/* State C: Render Output */}
              {!isGenerating && generatedData && (
                <div className="flex flex-col gap-8 animate-fade-in">
                  
                  {/* 1. Teoría Tab View */}
                  {activeTab === 'teoria' && (
                    <div className="flex flex-col gap-6 prose prose-invert max-w-none text-ink text-body-sm sm:text-body leading-relaxed">
                      <div className="flex justify-between items-center border-b border-hairline pb-4 select-none">
                        <span className="text-caption uppercase tracking-wider text-brand-primary-hover font-semibold bg-brand-primary/10 border border-brand-primary/20 px-2.5 py-1 rounded">Teoría Docente</span>
                        <button 
                          onClick={() => window.print()}
                          className="text-body-sm text-ink-muted hover:text-ink hover:underline cursor-pointer font-medium"
                        >
                          Imprimir / Guardar PDF
                        </button>
                      </div>
                      {/* Rendered Text */}
                      <div className="whitespace-pre-line flex flex-col gap-4">
                        {generatedData.teoria}
                      </div>
                    </div>
                  )}

                  {/* 2. Ejercicios Tab View */}
                  {activeTab === 'ejercicios' && (
                    <div className="flex flex-col gap-6 text-ink text-body-sm sm:text-body leading-relaxed">
                      <div className="flex justify-between items-center border-b border-hairline pb-4 select-none">
                        <span className="text-caption uppercase tracking-wider text-brand-primary-hover font-semibold bg-brand-primary/10 border border-brand-primary/20 px-2.5 py-1 rounded">Guía Práctica</span>
                        <span className="text-body-sm text-ink-muted">Contiene ejercicios resueltos</span>
                      </div>
                      <div className="whitespace-pre-line flex flex-col gap-4">
                        {generatedData.ejercicios}
                      </div>
                    </div>
                  )}

                  {/* 3. Evaluacion Tab View */}
                  {activeTab === 'evaluacion' && (
                    <div className="flex flex-col gap-6">
                      <div className="flex justify-between items-center border-b border-hairline pb-4 select-none">
                        <span className="text-caption uppercase tracking-wider text-brand-primary-hover font-semibold bg-brand-primary/10 border border-brand-primary/20 px-2.5 py-1 rounded">Banco de Evaluaciones</span>
                        <span className="text-body-sm text-ink-muted">3 preguntas de opción múltiple</span>
                      </div>

                      <div className="flex flex-col gap-8">
                        {generatedData.evaluacion.map((q, qIndex) => {
                          const isCorrect = checkedAnswers[qIndex] === q.opcionCorrectaIndex;
                          const isAnswered = checkedAnswers[qIndex] !== undefined;

                          return (
                            <Card key={qIndex} surface="1" className="flex flex-col gap-5 p-6 sm:p-8">
                              <span className="text-caption font-mono text-ink-muted font-semibold uppercase tracking-wider">Pregunta #{qIndex + 1}</span>
                              <h4 className="text-body font-semibold text-ink">{q.pregunta}</h4>
                              
                              {/* Options */}
                              <div className="grid grid-cols-1 gap-3">
                                {q.opciones.map((opt, optIndex) => {
                                  const isSelected = checkedAnswers[qIndex] === optIndex;
                                  return (
                                    <button
                                      key={optIndex}
                                      onClick={() => setCheckedAnswers({...checkedAnswers, [qIndex]: optIndex})}
                                      className={`w-full text-left p-4 rounded-md text-body-sm transition-all border flex justify-between items-center cursor-pointer ${
                                        isSelected 
                                          ? 'bg-brand-primary/10 border-brand-primary text-ink font-semibold shadow-[0_2px_10px_rgba(5,43,88,0.15)]' 
                                          : 'bg-surface-2 border-hairline hover:border-hairline-strong text-ink-muted hover:text-ink'
                                      }`}
                                    >
                                      <span>{opt}</span>
                                      {isSelected && <span className="w-2 h-2 rounded-full bg-brand-primary shadow-[0_0_8px_rgba(5,43,88,1)]"></span>}
                                    </button>
                                  );
                                })}
                              </div>

                              {/* FeedBack */}
                              {isAnswered && (
                                <div className={`p-5 rounded-md border text-body-sm leading-relaxed flex flex-col gap-1.5 ${isCorrect ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/5 border-rose-500/20 text-rose-400'}`}>
                                  <span className="font-semibold block">{isCorrect ? '✓ Respuesta Correcta' : '✗ Respuesta Incorrecta'}</span>
                                  <p className="text-ink-muted text-caption mt-1">{q.explicacion}</p>
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
                    <div className="flex flex-col gap-6">
                      <div className="flex justify-between items-center border-b border-hairline pb-4 select-none">
                        <span className="text-caption uppercase tracking-wider text-brand-primary-hover font-semibold bg-brand-primary/10 border border-brand-primary/20 px-2.5 py-1 rounded">Esquemas de Diapositivas</span>
                        <span className="text-body-sm text-ink-muted">3 láminas de apoyo</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                        {generatedData.diapositivas.map((slide, sIndex) => (
                          <Card key={sIndex} surface="1" className="flex flex-col justify-between aspect-square p-6 sm:p-8">
                            <div>
                              <span className="text-caption uppercase tracking-wider text-brand-primary-hover font-semibold bg-brand-primary/10 px-2 py-0.5 rounded block w-max mb-4 select-none">Lámina #{sIndex + 1}</span>
                              <h4 className="text-body font-semibold text-ink mb-4">{slide.titulo}</h4>
                              <ul className="flex flex-col gap-2.5 text-body-sm text-ink-muted list-disc list-inside leading-relaxed">
                                {slide.puntos.map((pt, pIndex) => (
                                  <li key={pIndex}>{pt}</li>
                                ))}
                              </ul>
                            </div>
                            <span className="text-caption text-ink-tertiary text-right mt-6 font-mono select-none">Katedra Presentador</span>
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
    </div>
  );
}

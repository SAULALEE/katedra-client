import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// High-fidelity structured mock data for Katedra AI output in Spanish
const MOCK_GENERATED_CONTENT = {
  teoria: `## Unidad 1: Estructuras de Datos Lineales

### 1.1 Introducción a las Estructuras de Datos
En programación, una estructura de datos es una forma particular de organizar y almacenar datos en una computadora para que puedan usarse de manera eficiente. Las estructuras de datos lineales son aquellas cuyos elementos forman una secuencia ordenada donde cada elemento tiene un único predecesor y sucesor directo (excepto el primero y el último).

### 1.2 Listas Enlazadas (Linked Lists)
Una lista enlazada es una colección lineal de elementos de datos, llamados nodos, donde el orden lineal no está dado por su ubicación física en la memoria. En su lugar, cada nodo contiene un puntero o referencia que apunta al siguiente nodo de la secuencia.

*   **Nodo:** Contiene el campo de valor (dato) y el enlace al siguiente nodo (*next*).
*   **Complejidad temporal:** Búsqueda $O(n)$, Inserción al inicio $O(1)$, Eliminación al inicio $O(1)$.

### 1.3 Pilas (Stacks)
Una pila es una estructura de tipo **LIFO** (Last In, First Out - Último en entrar, primero en salir). Permite almacenar y recuperar datos utilizando únicamente dos operaciones básicas:
1.  **Push:** Introduce un elemento en el tope de la pila.
2.  **Pop:** Retira el elemento superior del tope de la pila.
`,
  ejercicios: `## Guía de Ejercicios Prácticos: Estructuras de Datos Lineales

### Ejercicio 1: Inversión de una Lista Enlazada
**Instrucciones:** Escribe una función en Python/JavaScript que tome la cabeza (*head*) de una lista enlazada simple y la invierta de forma iterativa, devolviendo la nueva cabeza.

*   **Restricción de Espacio:** $O(1)$ memoria auxiliar.
*   **Restricción de Tiempo:** $O(n)$ complejidad lineal.

**Solución Guía:**
\`\`\`javascript
function invertirLista(head) {
  let prev = null;
  let current = head;
  while (current !== null) {
    let nextTemp = current.next;
    current.next = prev;
    prev = current;
    current = nextTemp;
  }
  return prev;
}
\`\`\`

### Ejercicio 2: El problema de los Paréntesis Balanceados
**Instrucciones:** Utilizando una pila (*Stack*), diseña un algoritmo para determinar si una cadena de texto que contiene paréntesis \`()\`, llaves \`{}\` y corchetes \`[]\` se encuentra balanceada correctamente.
`,
  evaluacion: [
    {
      pregunta: "¿Cuál es la complejidad de tiempo para insertar un nodo al inicio de una Lista Enlazada Simple?",
      opciones: ["O(1) - Tiempo Constante", "O(n) - Tiempo Lineal", "O(log n) - Tiempo Logarítmico", "O(n²) - Tiempo Cuadrático"],
      opcionCorrectaIndex: 0,
      explicacion: "Dado que solo se requiere reasignar el puntero 'next' del nuevo nodo al actual 'head' y reasignar el puntero de la cabeza, la operación se realiza en tiempo constante O(1)."
    },
    {
      pregunta: "¿Qué principio de almacenamiento rige el funcionamiento de una estructura de tipo Pila (Stack)?",
      opciones: ["FIFO (First In, First Out)", "LIFO (Last In, First Out)", "LILO (Last In, Last Out)", "Random Access"],
      opcionCorrectaIndex: 1,
      explicacion: "Las Pilas se rigen bajo el principio LIFO (Last In, First Out), donde el último elemento añadido al tope es el primero en ser extraído."
    },
    {
      pregunta: "Si realizas una operación 'pop' en una pila que se encuentra vacía, ¿qué término técnico describe este error de desbordamiento?",
      opciones: ["Stack Overflow", "Stack Underflow", "Null Pointer Exception", "Memory Leak"],
      opcionCorrectaIndex: 1,
      explicacion: "El intento de extraer un elemento de una pila sin datos disponibles se denomina técnicamente 'Stack Underflow'."
    }
  ],
  diapositivas: [
    {
      titulo: "Diapositiva 1: Estructuras Lineales",
      puntos: [
        "Definición básica de estructuras secuenciales.",
        "Diferencia entre orden físico (arrays) y lógico (listas).",
        "Importancia de la selección de estructuras en la optimización."
      ]
    },
    {
      titulo: "Diapositiva 2: La Lista Enlazada Simple",
      puntos: [
        "Estructura del Nodo: Dato + Enlace al sucesor.",
        "Ventaja: Inserciones y eliminaciones ultra rápidas O(1).",
        "Desventaja: Búsqueda secuencial costosa O(n)."
      ]
    },
    {
      titulo: "Diapositiva 3: Pilas y su Aplicación",
      puntos: [
        "Concepto LIFO (Last In, First Out).",
        "Operaciones fundamentales: Push y Pop.",
        "Casos prácticos: Historial del navegador y llamadas recursivas."
      ]
    }
  ]
};

export default function Generator() {
  const navigate = useNavigate();
  
  // Wizard States
  const [tema, setTema] = useState('Estructuras de Datos Lineales');
  const [materia, setMateria] = useState('Programación I');
  const [unidades, setUnidades] = useState('Unidad 1: Pilas y Listas Enlazadas');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState('');
  const [generatedData, setGeneratedData] = useState(null);
  
  // Viewer States
  const [activeTab, setActiveTab] = useState('teoria'); // teoria | ejercicios | evaluacion | diapositivas
  const [checkedAnswers, setCheckedAnswers] = useState({}); // questionIndex: optionIndex

  // Trigger Fake AI Generation Sequence
  const handleGenerate = () => {
    setIsGenerating(true);
    setGeneratedData(null);
    setCheckedAnswers({});
    
    const steps = [
      'Analizando sílabo académico...',
      'Generando explicaciones de teoría con Anthropic API...',
      'Estructurando problemas prácticos y soluciones...',
      'Creando banco de preguntas tipo test de opción múltiple...',
      'Compilando esquema para diapositivas de clase...',
      'Validando esquemas de datos finales...'
    ];

    let currentStepIndex = 0;
    setGenerationStep(steps[currentStepIndex]);

    const interval = setInterval(() => {
      currentStepIndex++;
      if (currentStepIndex < steps.length) {
        setGenerationStep(steps[currentStepIndex]);
      } else {
        clearInterval(interval);
        setIsGenerating(false);
        setGeneratedData(MOCK_GENERATED_CONTENT);
      }
    }, 1200); // 1.2s per step to look extremely deliberate and high-quality
  };

  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col selection:bg-brand-primary selection:text-white">
      
      {/* Header bar */}
      <header className="h-[56px] border-b border-hairline px-6 flex items-center justify-between bg-canvas/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/dashboard')}>
          <div className="w-5 h-5 rounded-sm bg-brand-primary flex items-center justify-center shadow-[0_0_12px_rgba(5,43,88,0.5)]">
            <span className="text-[10px] font-bold text-white">K</span>
          </div>
          <span className="font-sans font-semibold tracking-subhead text-[15px] hidden sm:block">Katedra — Editor de Temarios</span>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/dashboard')}
            className="bg-surface-1 hover:bg-surface-2 border border-hairline text-ink-muted hover:text-ink text-xs font-medium px-4 py-2 rounded-md transition-all active:scale-[0.98]"
          >
            Volver al Panel
          </button>
        </div>
      </header>

      {/* Main split work space */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0">
        
        {/* Left Side: Setup Wizard Panel */}
        <section className="w-full lg:w-96 border-b lg:border-b-0 lg:border-r border-hairline bg-surface-1/60 p-6 space-y-6 overflow-y-auto">
          <div>
            <h3 className="text-sm font-semibold tracking-card-title text-ink mb-1">Configuración del Temario</h3>
            <p className="text-[11px] text-ink-muted">Proporciona los datos del curso para la IA.</p>
          </div>

          <div className="space-y-4">
            {/* Input 1: Materia */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-wider text-ink-muted font-medium">Asignatura / Curso</label>
              <input 
                type="text" 
                value={materia}
                onChange={(e) => setMateria(e.target.value)}
                placeholder="Ej. Programación I"
                className="w-full bg-surface-1 border border-hairline hover:border-hairline-strong focus:border-brand-primary rounded-md p-3 text-xs text-ink outline-none transition-colors"
              />
            </div>

            {/* Input 2: Tema General */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-wider text-ink-muted font-medium">Tema Principal</label>
              <input 
                type="text" 
                value={tema}
                onChange={(e) => setTema(e.target.value)}
                placeholder="Ej. Estructuras de Datos Lineales"
                className="w-full bg-surface-1 border border-hairline hover:border-hairline-strong focus:border-brand-primary rounded-md p-3 text-xs text-ink outline-none transition-colors"
              />
            </div>

            {/* Input 3: Detalle del Sílabo */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-wider text-ink-muted font-medium">Subtemas o Unidades (Sílabo)</label>
              <textarea 
                rows={5}
                value={unidades}
                onChange={(e) => setUnidades(e.target.value)}
                placeholder="Ej. 1.1 Pilas (push, pop)&#10;1.2 Listas enlazadas&#10;1.3 Colas de prioridad"
                className="w-full bg-surface-1 border border-hairline hover:border-hairline-strong focus:border-brand-primary rounded-md p-3 text-xs text-ink outline-none transition-colors resize-none font-mono"
              />
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !tema || !materia}
              className="w-full bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-semibold p-3.5 rounded-md transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(5,43,88,0.3)] hover:shadow-[0_0_25px_rgba(5,43,88,0.5)] cursor-pointer"
            >
              {isGenerating ? 'Generando Material...' : 'Generar Material con IA'}
            </button>
          </div>

          {/* Prompting Note */}
          <div className="border border-hairline rounded bg-surface-2 p-4 text-[10px] text-ink-subtle leading-relaxed">
            <span className="font-semibold text-ink block mb-1">Nota del Motor AI</span>
            Esta llamada integra prompts validados según `ai-integration.md`. Generará teoría completa, ejercicios con soluciones, un examen evaluatorio estructurado de 3 preguntas y 3 diapositivas docentes de apoyo.
          </div>
        </section>

        {/* Right Side: Result Viewer Panel */}
        <section className="flex-1 flex flex-col bg-canvas min-w-0">
          
          {/* Tab Selection */}
          <div className="h-12 border-b border-hairline bg-surface-1/40 px-6 flex items-center gap-1 overflow-x-auto">
            <button 
              disabled={!generatedData}
              onClick={() => setActiveTab('teoria')}
              className={`h-full text-xs px-4 font-medium transition-all border-b-2 cursor-pointer flex items-center gap-2 ${activeTab === 'teoria' && generatedData ? 'text-ink border-brand-primary' : 'text-ink-muted border-transparent hover:text-ink disabled:opacity-30 disabled:cursor-not-allowed'}`}
            >
              Teoría
            </button>
            <button 
              disabled={!generatedData}
              onClick={() => setActiveTab('ejercicios')}
              className={`h-full text-xs px-4 font-medium transition-all border-b-2 cursor-pointer flex items-center gap-2 ${activeTab === 'ejercicios' && generatedData ? 'text-ink border-brand-primary' : 'text-ink-muted border-transparent hover:text-ink disabled:opacity-30 disabled:cursor-not-allowed'}`}
            >
              Ejercicios Prácticos
            </button>
            <button 
              disabled={!generatedData}
              onClick={() => setActiveTab('evaluacion')}
              className={`h-full text-xs px-4 font-medium transition-all border-b-2 cursor-pointer flex items-center gap-2 ${activeTab === 'evaluacion' && generatedData ? 'text-ink border-brand-primary' : 'text-ink-muted border-transparent hover:text-ink disabled:opacity-30 disabled:cursor-not-allowed'}`}
            >
              Evaluación (Quizzes)
            </button>
            <button 
              disabled={!generatedData}
              onClick={() => setActiveTab('diapositivas')}
              className={`h-full text-xs px-4 font-medium transition-all border-b-2 cursor-pointer flex items-center gap-2 ${activeTab === 'diapositivas' && generatedData ? 'text-ink border-brand-primary' : 'text-ink-muted border-transparent hover:text-ink disabled:opacity-30 disabled:cursor-not-allowed'}`}
            >
              Diapositivas
            </button>
          </div>

          {/* Content Wrapper */}
          <div className="flex-1 p-6 md:p-8 overflow-y-auto max-w-4xl w-full mx-auto">
            
            {/* State A: Generating AI Loading state */}
            {isGenerating && (
              <div className="h-[400px] flex flex-col items-center justify-center space-y-6 text-center">
                {/* Custom Spinner */}
                <div className="w-12 h-12 rounded-full border-2 border-hairline border-t-brand-primary animate-spin"></div>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-ink">El motor de IA está cocinando tu contenido...</p>
                  <p className="text-xs text-brand-primary-hover font-mono font-medium animate-pulse">{generationStep}</p>
                </div>
              </div>
            )}

            {/* State B: Empty State (No generation yet) */}
            {!isGenerating && !generatedData && (
              <div className="h-[400px] flex flex-col items-center justify-center space-y-4 text-center">
                <div className="w-12 h-12 rounded bg-surface-1 border border-hairline flex items-center justify-center text-ink-muted">
                  <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
                <div className="space-y-1.5 max-w-sm">
                  <h4 className="text-sm font-semibold text-ink">Material Académico Vacío</h4>
                  <p className="text-xs text-ink-muted leading-relaxed">
                    Usa el panel lateral para ingresar el nombre de la asignatura y la unidad. Haz clic en "Generar Material con IA" para comenzar.
                  </p>
                </div>
              </div>
            )}

            {/* State C: Render Output */}
            {!isGenerating && generatedData && (
              <div className="space-y-6">
                
                {/* 1. Teoría Tab View */}
                {activeTab === 'teoria' && (
                  <div className="space-y-4 prose prose-invert max-w-none text-ink text-sm leading-relaxed">
                    <div className="flex justify-between items-center border-b border-hairline pb-4 mb-4">
                      <span className="text-[10px] uppercase tracking-wider text-brand-primary-hover font-semibold bg-brand-primary/10 border border-brand-primary/20 px-2 py-0.5 rounded">Teoría Docente</span>
                      <button 
                        onClick={() => window.print()}
                        className="text-[11px] text-ink-muted hover:text-ink hover:underline"
                      >
                        Imprimir / Guardar PDF
                      </button>
                    </div>
                    {/* Rendered Text */}
                    <div className="whitespace-pre-line space-y-4">
                      {generatedData.teoria}
                    </div>
                  </div>
                )}

                {/* 2. Ejercicios Tab View */}
                {activeTab === 'ejercicios' && (
                  <div className="space-y-4 text-ink text-sm leading-relaxed">
                    <div className="flex justify-between items-center border-b border-hairline pb-4 mb-4">
                      <span className="text-[10px] uppercase tracking-wider text-brand-primary-hover font-semibold bg-brand-primary/10 border border-brand-primary/20 px-2 py-0.5 rounded">Guía Práctica</span>
                      <span className="text-xs text-ink-muted">Contiene ejercicios resueltos</span>
                    </div>
                    <div className="whitespace-pre-line">
                      {generatedData.ejercicios}
                    </div>
                  </div>
                )}

                {/* 3. Evaluacion Tab View */}
                {activeTab === 'evaluacion' && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center border-b border-hairline pb-4">
                      <span className="text-[10px] uppercase tracking-wider text-brand-primary-hover font-semibold bg-brand-primary/10 border border-brand-primary/20 px-2 py-0.5 rounded">Banco de Evaluaciones</span>
                      <span className="text-xs text-ink-muted">3 preguntas de opción múltiple</span>
                    </div>

                    <div className="space-y-8">
                      {generatedData.evaluacion.map((q, qIndex) => {
                        const isCorrect = checkedAnswers[qIndex] === q.opcionCorrectaIndex;
                        const isAnswered = checkedAnswers[qIndex] !== undefined;

                        return (
                          <div key={qIndex} className="bg-surface-1 border border-hairline rounded-lg p-5 space-y-4">
                            <span className="text-[10px] font-mono text-ink-muted">Pregunta #{qIndex + 1}</span>
                            <h4 className="text-sm font-semibold text-ink">{q.pregunta}</h4>
                            
                            {/* Options */}
                            <div className="grid grid-cols-1 gap-2">
                              {q.opciones.map((opt, optIndex) => {
                                const isSelected = checkedAnswers[qIndex] === optIndex;
                                return (
                                  <button
                                    key={optIndex}
                                    onClick={() => setCheckedAnswers({...checkedAnswers, [qIndex]: optIndex})}
                                    className={`w-full text-left p-3 rounded text-xs transition-all border flex justify-between items-center cursor-pointer ${
                                      isSelected 
                                        ? 'bg-brand-primary/10 border-brand-primary text-ink' 
                                        : 'bg-surface-2 border-hairline hover:border-hairline-strong text-ink-muted hover:text-ink'
                                    }`}
                                  >
                                    <span>{opt}</span>
                                    {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-brand-primary shadow-[0_0_8px_rgba(5,43,88,1)]"></span>}
                                  </button>
                                );
                              })}
                            </div>

                            {/* FeedBack */}
                            {isAnswered && (
                              <div className={`p-4 rounded border text-xs leading-relaxed space-y-1 ${isCorrect ? 'bg-emerald-500/5 border-emerald-500/25 text-emerald-400' : 'bg-rose-500/5 border-rose-500/25 text-rose-400'}`}>
                                <span className="font-semibold block">{isCorrect ? '✓ Respuesta Correcta' : '✗ Respuesta Incorrecta'}</span>
                                <p className="text-ink-muted text-[11px] mt-1">{q.explicacion}</p>
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
                  <div className="space-y-6">
                    <div className="flex justify-between items-center border-b border-hairline pb-4">
                      <span className="text-[10px] uppercase tracking-wider text-brand-primary-hover font-semibold bg-brand-primary/10 border border-brand-primary/20 px-2 py-0.5 rounded">Esquemas de Diapositivas</span>
                      <span className="text-xs text-ink-muted">3 láminas de apoyo</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {generatedData.diapositivas.map((slide, sIndex) => (
                        <div key={sIndex} className="bg-surface-1 border border-hairline rounded-lg p-5 flex flex-col justify-between aspect-square">
                          <div>
                            <span className="text-[9px] uppercase tracking-wider text-brand-primary-hover font-semibold bg-brand-primary/10 px-1.5 py-0.5 rounded block w-max mb-3">Lámina #{sIndex + 1}</span>
                            <h4 className="text-xs font-semibold text-ink mb-3">{slide.titulo}</h4>
                            <ul className="space-y-2 text-[10px] text-ink-muted list-disc list-inside">
                              {slide.puntos.map((pt, pIndex) => (
                                <li key={pIndex}>{pt}</li>
                              ))}
                            </ul>
                          </div>
                          <span className="text-[9px] text-ink-tertiary text-right mt-4">Katedra Presentador</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            )}

          </div>
        </section>

      </div>
    </div>
  );
}

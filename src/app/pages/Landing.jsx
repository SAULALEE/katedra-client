import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Container from '../components/Container';
import Button from '../components/Button';
import Card from '../components/Card';
import FeatureCard from '../components/FeatureCard';
import StatusBadge from '../components/StatusBadge';

// Sample topics for the interactive playground
const PLAYGROUND_COURSES = [
  {
    name: 'Introducción a la Inteligencia Artificial',
    level: 'Bachillerato / Universidad',
    modules: [
      'Módulo 1: Historia y Conceptos Básicos',
      'Módulo 2: Aprendizaje Supervisado vs No Supervisado',
      'Módulo 3: Redes Neuronales y Deep Learning',
      'Módulo 4: Ética y Futuro de la IA'
    ],
    details: {
      theory: 'La inteligencia artificial (IA) es la simulación de procesos de inteligencia humana por parte de máquinas, especialmente sistemas informáticos...',
      exercises: ['¿Cuál es la diferencia entre IA fuerte y débil?', 'Desarrolle un caso de uso de machine learning en la medicina.'],
      slides: ['1. Bienvenidos a la era inteligente', '2. Redes Neuronales', '3. Conclusiones y Debate']
    }
  },
  {
    name: 'Álgebra Lineal Aplicada',
    level: 'Universidad (Ingeniería)',
    modules: [
      'Módulo 1: Matrices y Determinantes',
      'Módulo 2: Espacios Vectoriales',
      'Módulo 3: Transformaciones Lineales',
      'Módulo 4: Valores y Vectores Propios'
    ],
    details: {
      theory: 'El álgebra lineal es una rama de las matemáticas que estudia conceptos tales como vectores, matrices, espacio dual, sistemas de ecuaciones lineales...',
      exercises: ['Calcule el determinante de una matriz 3x3 dada.', 'Demuestre si el conjunto W es un subespacio vectorial.'],
      slides: ['1. Fundamentos de Matrices', '2. Interpretación Geométrica de Vectores', '3. Aplicaciones en Gráficos 3D']
    }
  },
  {
    name: 'Historia Contemporánea de América Latina',
    level: 'Secundaria / Bachillerato',
    modules: [
      'Módulo 1: Procesos de Independencia',
      'Módulo 2: La Consolidación de los Estados Nación',
      'Módulo 3: Revoluciones y Conflictos del Siglo XX',
      'Módulo 4: Globalización e Integración Regional'
    ],
    details: {
      theory: 'La historia contemporánea de América Latina abarca los complejos procesos políticos, sociales y económicos desde finales del siglo XVIII hasta el presente...',
      exercises: ['Elabore un mapa conceptual de la Revolución Mexicana.', 'Compare las reformas estructurales de los años 90.'],
      slides: ['1. Rutas de la Independencia', '2. Economías de Exportación del Siglo XIX', '3. Retos de la Democracia Moderna']
    }
  }
];

export default function Landing() {
  const navigate = useNavigate();
  const [isAnnual, setIsAnnual] = useState(true);
  const [selectedCourseIndex, setSelectedCourseIndex] = useState(0);
  const [activePlaygroundTab, setActivePlaygroundTab] = useState('modules'); // modules, theory, exercises, slides
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(100);
  const [faqOpenIndex, setFaqOpenIndex] = useState(null);

  const activeCourse = PLAYGROUND_COURSES[selectedCourseIndex];

  // Simulate generation animation when course changes
  useEffect(() => {
    setIsGenerating(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsGenerating(false);
          return 100;
        }
        return prev + 10;
      });
    }, 45);

    return () => clearInterval(interval);
  }, [selectedCourseIndex]);

  const toggleFaq = (index) => {
    setFaqOpenIndex(faqOpenIndex === index ? null : index);
  };

  return (
    <div className="w-full min-h-screen bg-canvas text-ink flex flex-col justify-between selection:bg-brand-primary selection:text-white">
      {/* Header / Top Nav */}
      <Navbar />

      {/* Hero Section */}
      <main className="w-full flex-grow flex items-center py-16 md:py-28 relative overflow-hidden">
        {/* Glow ambient backgrounds */}
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-brand-primary/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[45vw] h-[45vw] bg-indigo-600/5 rounded-full blur-[140px] pointer-events-none"></div>
        
        <Container size="7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Column: Headline and CTAs */}
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left lg:col-span-7 space-y-6 sm:space-y-8 z-10">
              {/* Badge Indicator */}
              <StatusBadge pulseColor="bg-emerald-500" className="border border-brand-primary/20 bg-brand-primary/5 hover:bg-brand-primary/10 transition-colors">
                Katedra AI Engine v1.1 Activo • Prepárate para el ciclo 2026
              </StatusBadge>

              {/* Hero Headline */}
              <h1 className="font-sans font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-display-xl leading-[1.08] text-ink">
                Diseña temarios académicos con el poder de la <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400">Inteligencia Artificial</span>
              </h1>

              {/* Subhead */}
              <p className="text-ink-muted text-base sm:text-lg md:text-xl tracking-body-lg max-w-2xl leading-relaxed">
                Katedra ayuda a los profesores a ahorrar hasta un 40% de tiempo en preparación. Genera teoría rigurosa, ejercicios de desarrollo, exámenes con clave y diapositivas de clase listas en segundos.
              </p>

              {/* Call to Actions */}
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto pt-2">
                <Button
                  variant="primary"
                  onClick={() => navigate('/dashboard')}
                  className="w-full sm:w-auto px-8 py-4 text-sm font-semibold rounded-xl shadow-[0_0_30px_rgba(5,43,88,0.45)] hover:shadow-[0_0_35px_rgba(5,43,88,0.7)] hover:-translate-y-0.5 transition-all duration-300 animate-fade-in"
                >
                  Comenzar Gratis
                </Button>
                <a href="#demo" className="w-full sm:w-auto">
                  <Button
                    variant="secondary"
                    className="w-full px-8 py-4 text-sm font-semibold rounded-xl hover:-translate-y-0.5 transition-all duration-300 animate-fade-in"
                  >
                    Probar Demo En Vivo
                  </Button>
                </a>
              </div>
              
              {/* Micro Social Proof / Trust Badges */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-8 gap-y-3 pt-6 border-t border-hairline w-full opacity-70">
                <div className="flex items-center gap-1.5 text-xs text-ink-subtle">
                  <svg className="w-4 h-4 text-brand-primary" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                  <span>4.9/5 Calificación</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-ink-subtle">
                  <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                  <span>Calidad Académica Garantizada</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-ink-subtle">
                  <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <span>Listo en 10 segundos</span>
                </div>
              </div>
            </div>

            {/* Right Column: Premium High-fidelity interactive canvas mockup */}
            <div className="w-full lg:col-span-5 relative group z-10">
              {/* Outer shadow glow */}
              <div className="absolute inset-0 bg-brand-primary/10 rounded-2xl blur-2xl opacity-50 group-hover:opacity-80 transition-opacity duration-500"></div>
              
              <div className="w-full rounded-2xl border border-hairline bg-surface-1 p-3 shadow-2xl relative overflow-hidden">
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-surface-1 via-surface-1/80 to-transparent z-10 pointer-events-none"></div>
                <div className="w-full aspect-[16/11] bg-surface-2 rounded-xl border border-hairline-strong flex flex-col overflow-hidden text-left text-[11px] font-mono">
                  {/* Fake OS Header */}
                  <div className="h-9 border-b border-hairline px-4 flex items-center justify-between bg-surface-3">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444]/40"></span>
                      <span className="w-2.5 h-2.5 rounded-full bg-[#eab308]/40"></span>
                      <span className="w-2.5 h-2.5 rounded-full bg-[#22c55e]/40"></span>
                    </div>
                    <span className="text-[10px] text-ink-tertiary select-none">katedra-engine-canvas // live-preview</span>
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                    </div>
                  </div>
                  
                  {/* Workspace Content */}
                  <div className="flex-1 flex flex-col p-5 space-y-4">
                    {/* Course selector header simulator */}
                    <div className="flex justify-between items-center pb-3 border-b border-hairline">
                      <div className="flex flex-col gap-1">
                        <span className="text-[9px] text-brand-primary font-bold uppercase tracking-wider">Materia Activa</span>
                        <span className="text-xs font-sans font-bold text-ink truncate max-w-[180px]">Introducción a la Inteligencia Artificial</span>
                      </div>
                      <span className="bg-brand-primary/20 text-brand-primary border border-brand-primary/30 px-2 py-0.5 rounded text-[9px] font-bold">PROCESADOR IA v1.1</span>
                    </div>

                    {/* Simulating active processing steps */}
                    <div className="space-y-3 font-sans">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-ink-muted">Analizando directrices del programa educativo...</span>
                        <span className="text-emerald-400 font-mono font-bold">100%</span>
                      </div>
                      <div className="w-full h-1.5 bg-surface-3 rounded-full overflow-hidden">
                        <div className="h-full bg-brand-primary rounded-full transition-all duration-1000" style={{ width: '100%' }}></div>
                      </div>

                      <div className="bg-surface-3/30 border border-hairline rounded-lg p-3 space-y-2 mt-2">
                        <div className="flex items-center gap-2 text-[10px] text-ink font-semibold">
                          <svg className="w-3.5 h-3.5 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                          <span>Temario Modular Estructurado (4 Bloques)</span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-ink font-semibold">
                          <svg className="w-3.5 h-3.5 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                          <span>Resumen Teórico del Bloque I (1,200 palabras)</span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-ink font-semibold">
                          <svg className="w-3.5 h-3.5 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                          <span>Banco de 15 Preguntas con Clave de Respuestas</span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-brand-primary font-bold animate-pulse">
                          <span className="w-2 h-2 rounded-full bg-brand-primary shrink-0 animate-ping"></span>
                          <span>Diseñando Esquema de Diapositivas PPTX...</span>
                        </div>
                      </div>
                    </div>

                    {/* Code Snippet Simulator */}
                    <div className="border border-hairline p-3 rounded-lg bg-surface-3/50 space-y-2.5 font-mono text-[9px]">
                      <div className="flex justify-between text-ink-muted text-[8px]">
                        <span>katedra-pptx-renderer.py</span>
                        <span>v1.1</span>
                      </div>
                      <div className="space-y-1 text-ink-subtle">
                        <div><span className="text-pink-400">import</span> katedra_engine <span className="text-pink-400">as</span> ke</div>
                        <div>slide_layout = ke.Presentation.new_deck(theme=<span className="text-emerald-400">"linear_dark"</span>)</div>
                        <div>slide_layout.add_slide(title=<span className="text-emerald-400">"Introducción a Redes Neuronales"</span>)</div>
                        <div>slide_layout.compile_and_export(format=<span className="text-amber-400">"pptx"</span>)</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </main>

      {/* Interactive Sandbox/Demo Section */}
      <section id="demo" className="w-full py-20 border-t border-hairline bg-surface-1/10 relative">
        <Container size="6xl">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-4">
            <StatusBadge pulseColor="bg-brand-primary" className="bg-surface-2 border-hairline">
              PROBADOR EN VIVO
            </StatusBadge>
            <h2 className="font-sans font-bold text-3xl md:text-4xl tracking-headline text-ink">
              Experimenta el motor de Katedra
            </h2>
            <p className="text-ink-muted text-sm tracking-body leading-relaxed max-w-xl mx-auto">
              Selecciona una de las materias sugeridas a continuación y mira el temario, teoría y diapositivas académicas estructuradas que la IA genera al instante.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto items-stretch">
            {/* Sandbox Sidebar Course Selector */}
            <div className="lg:col-span-4 flex flex-col gap-3">
              <span className="text-[10px] text-ink-subtle font-bold uppercase tracking-wider ml-1 select-none">Selecciona una materia</span>
              {PLAYGROUND_COURSES.map((course, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    if (!isGenerating) setSelectedCourseIndex(idx);
                  }}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-300 cursor-pointer flex flex-col gap-1.5 ${
                    selectedCourseIndex === idx
                      ? 'bg-surface-2 border-brand-primary text-ink shadow-[0_4px_12px_rgba(5,43,88,0.15)]'
                      : 'bg-surface-1 hover:bg-surface-2/60 border-hairline text-ink-muted hover:text-ink'
                  }`}
                >
                  <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded self-start ${
                    selectedCourseIndex === idx ? 'bg-brand-primary/20 text-brand-primary' : 'bg-surface-3 text-ink-subtle'
                  }`}>
                    {course.level}
                  </span>
                  <span className="font-sans font-semibold text-sm leading-snug">{course.name}</span>
                </button>
              ))}
            </div>

            {/* Sandbox Content Viewer */}
            <div className="lg:col-span-8 bg-surface-1 border border-hairline rounded-2xl shadow-xl flex flex-col overflow-hidden min-h-[360px] relative">
              {/* Fake Toolbar Tabs */}
              <div className="border-b border-hairline px-4 bg-surface-2/40 flex flex-wrap items-center justify-between gap-2">
                <div className="flex overflow-x-auto gap-1 py-2 scrollbar-none">
                  {[
                    { id: 'modules', label: '1. Módulos Generados' },
                    { id: 'theory', label: '2. Teoría de Muestra' },
                    { id: 'exercises', label: '3. Ejercicios Prácticos' },
                    { id: 'slides', label: '4. Diapositivas' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActivePlaygroundTab(tab.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                        activePlaygroundTab === tab.id
                          ? 'bg-brand-primary/10 text-brand-primary border border-brand-primary/20'
                          : 'text-ink-subtle hover:text-ink hover:bg-surface-2/60 border border-transparent'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
                
                {/* Generation Indicator */}
                <div className="py-2 text-[10px] text-ink-tertiary flex items-center gap-1.5 font-mono select-none">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>ENGINE: ACTIVE</span>
                </div>
              </div>

              {/* Sandbox Screen Canvas */}
              <div className="p-6 flex-1 flex flex-col justify-start relative">
                {isGenerating ? (
                  <div className="absolute inset-0 bg-surface-1/90 backdrop-blur-sm z-20 flex flex-col items-center justify-center gap-4">
                    <div className="relative w-12 h-12 flex items-center justify-center">
                      <div className="absolute w-full h-full rounded-full border-4 border-hairline"></div>
                      <div className="absolute w-full h-full rounded-full border-4 border-t-brand-primary border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
                    </div>
                    <div className="flex flex-col items-center gap-1 font-mono">
                      <span className="text-xs text-brand-primary font-bold animate-pulse">GENERANDO CONTENIDOS...</span>
                      <span className="text-[10px] text-ink-muted">Rediseñando plan curricular con Inteligencia Artificial</span>
                    </div>
                  </div>
                ) : null}

                {/* Tab 1: Modules */}
                {activePlaygroundTab === 'modules' && (
                  <div className="space-y-4 animate-fade-in">
                    <h4 className="font-sans font-bold text-base text-ink flex items-center gap-2">
                      <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
                      Estructura Curricular Generada
                    </h4>
                    <div className="space-y-2.5">
                      {activeCourse.modules.map((mod, i) => (
                        <div key={i} className="flex items-center gap-3 p-3.5 bg-surface-2/40 border border-hairline rounded-xl hover:border-hairline-strong transition-all duration-200">
                          <span className="w-6 h-6 rounded-full bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-xs font-bold text-brand-primary shrink-0 select-none">
                            {i + 1}
                          </span>
                          <span className="font-sans text-sm font-medium text-ink">{mod}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tab 2: Theory */}
                {activePlaygroundTab === 'theory' && (
                  <div className="space-y-4 animate-fade-in">
                    <h4 className="font-sans font-bold text-base text-ink flex items-center gap-2">
                      <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                      Explicación Teórica Sugerida
                    </h4>
                    <div className="bg-surface-2/30 border border-hairline p-5 rounded-xl space-y-3">
                      <span className="text-[10px] text-brand-primary font-bold uppercase tracking-wider block select-none">Bloque de Fundamentos</span>
                      <p className="font-sans text-sm leading-relaxed text-ink-muted">
                        {activeCourse.details.theory}
                      </p>
                      <p className="font-sans text-xs italic text-ink-subtle border-t border-hairline/60 pt-2.5">
                        * Esta teoría se genera automáticamente adaptando la complejidad según el nivel seleccionado (Bachillerato, Licenciatura, Posgrado).
                      </p>
                    </div>
                  </div>
                )}

                {/* Tab 3: Exercises */}
                {activePlaygroundTab === 'exercises' && (
                  <div className="space-y-4 animate-fade-in">
                    <h4 className="font-sans font-bold text-base text-ink flex items-center gap-2">
                      <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                      Banco de Ejercicios Académicos
                    </h4>
                    <div className="space-y-3">
                      {activeCourse.details.exercises.map((ex, i) => (
                        <div key={i} className="p-4 bg-surface-2/40 border border-hairline rounded-xl space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-2.5 py-0.5 rounded select-none">Problema #{i+1}</span>
                            <span className="text-[9px] text-ink-subtle">Nivel sugerido: Medio</span>
                          </div>
                          <p className="font-sans text-sm text-ink-muted leading-relaxed font-medium">{ex}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tab 4: Slides */}
                {activePlaygroundTab === 'slides' && (
                  <div className="space-y-4 animate-fade-in">
                    <h4 className="font-sans font-bold text-base text-ink flex items-center gap-2">
                      <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                      Estructura de Diapositivas
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {activeCourse.details.slides.map((slide, i) => (
                        <div key={i} className="aspect-[4/3] bg-surface-2 border border-hairline hover:border-brand-primary/40 rounded-xl p-4 flex flex-col justify-between hover:shadow-lg transition-all duration-200">
                          <span className="text-[9px] font-mono text-ink-subtle select-none">DIAPOSITIVA {i+1}</span>
                          <p className="font-sans text-xs font-semibold text-ink leading-snug text-center py-2">{slide}</p>
                          <div className="h-1 w-full bg-brand-primary/20 rounded-full overflow-hidden">
                            <div className="h-full bg-brand-primary rounded-full" style={{ width: '40%' }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Call to action inside Sandbox */}
              <div className="border-t border-hairline p-4 bg-surface-2/20 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-xs text-ink-muted text-center sm:text-left">¿Te gusta la estructura generada? Descarga este material y mucho más creando tu cuenta.</span>
                <Button variant="primary" onClick={() => navigate('/dashboard')} className="px-5 py-2 text-xs font-bold rounded-lg shrink-0">
                  Generar Mi Propia Materia
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Feature Grid Section */}
      <section id="features" className="w-full border-t border-hairline bg-surface-1/40 py-24 relative">
        <Container size="6xl">
          <div className="text-center max-w-xl mx-auto mb-20 space-y-4">
            <StatusBadge pulseColor="bg-indigo-500" className="bg-surface-2 border-hairline">
              CARACTERÍSTICAS
            </StatusBadge>
            <h2 className="font-sans font-bold text-3xl md:text-4xl tracking-headline text-ink">
              Todo lo que necesitas para tu clase, en segundos.
            </h2>
            <p className="text-ink-muted text-sm md:text-base tracking-body leading-relaxed max-w-lg mx-auto">
              Katedra automatiza la planeación y la creación de materiales didácticos para que dediques más tiempo a tus alumnos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
            {/* Feature 1 */}
            <FeatureCard
              title="1. Teoría Estructurada"
              description="Genera explicaciones académicas robustas, adaptadas rigurosamente al nivel escolar y a los temas exactos de tu plan curricular oficial."
              icon={
                <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              }
              className="hover:translate-y-[-2px] transition-transform duration-300"
            />

            {/* Feature 2 */}
            <FeatureCard
              title="2. Ejercicios y Exámenes"
              description="Obtén cuestionarios de opción múltiple, problemas de desarrollo con rúbrica, claves de respuestas y formatos limpios listos para imprimir."
              icon={
                <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              }
              className="hover:translate-y-[-2px] transition-transform duration-300"
            />

            {/* Feature 3 */}
            <FeatureCard
              title="3. Diapositivas Estructuradas"
              description="Esquemas lógicos detallados y listas de conceptos diapositiva por diapositiva que puedes utilizar de inmediato en PowerPoint, Keynote o Canva."
              icon={
                <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              }
              className="hover:translate-y-[-2px] transition-transform duration-300"
            />
          </div>
        </Container>
      </section>

      {/* Impact Stats Section */}
      <section id="impact" className="w-full py-20 border-t border-hairline bg-surface-1/20 relative">
        <Container size="6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto text-center">
            <div className="p-6 space-y-2 border-b md:border-b-0 md:border-r border-hairline">
              <span className="text-5xl font-black tracking-display-lg text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">40%</span>
              <p className="text-sm font-semibold text-ink font-sans">Ahorro de Tiempo Promedio</p>
              <p className="text-xs text-ink-muted max-w-[220px] mx-auto leading-relaxed">Menos horas dedicadas a tareas administrativas de redacción.</p>
            </div>
            <div className="p-6 space-y-2 border-b md:border-b-0 md:border-r border-hairline">
              <span className="text-5xl font-black tracking-display-lg text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">+10k</span>
              <p className="text-sm font-semibold text-ink font-sans">Temarios y Clases Creados</p>
              <p className="text-xs text-ink-muted max-w-[220px] mx-auto leading-relaxed">Utilizado por profesores en colegios y universidades prestigiosas.</p>
            </div>
            <div className="p-6 space-y-2">
              <span className="text-5xl font-black tracking-display-lg text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">98%</span>
              <p className="text-sm font-semibold text-ink font-sans">Índice de Satisfacción</p>
              <p className="text-xs text-ink-muted max-w-[220px] mx-auto leading-relaxed">Los docentes destacan la rigurosidad conceptual y rapidez de la IA.</p>
            </div>
          </div>
        </Container>
      </section>

      {/* Tech Stack & Integrations */}
      <section id="tech" className="w-full py-20 border-t border-hairline bg-surface-1/40">
        <Container size="6xl">
          <div className="text-center max-w-xl mx-auto mb-12 space-y-3">
            <span className="text-[10px] text-brand-primary font-bold uppercase tracking-wider block">COMPATIBILIDAD</span>
            <h3 className="font-sans font-bold text-2xl md:text-3xl text-ink tracking-headline">
              Exportación y flujos de trabajo sin fricción
            </h3>
            <p className="text-ink-muted text-xs md:text-sm tracking-body leading-relaxed max-w-md mx-auto">
              Todo el contenido generado en Katedra está optimizado para integrarse directamente con tus herramientas escolares diarias.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 max-w-4xl mx-auto">
            {[
              { name: 'Microsoft PowerPoint', color: 'bg-orange-500/10 text-orange-500 border-orange-500/20' },
              { name: 'Adobe PDF Reader', color: 'bg-red-500/10 text-red-500 border-red-500/20' },
              { name: 'Google Classroom', color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' },
              { name: 'Canvas LMS', color: 'bg-pink-500/10 text-pink-500 border-pink-500/20' },
              { name: 'Moodle Académico', color: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
              { name: 'Markdown Académico', color: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20' }
            ].map((tech, i) => (
              <span 
                key={i} 
                className={`px-4 py-2 rounded-full border text-xs font-semibold select-none transition-all duration-300 hover:-translate-y-0.5 ${tech.color}`}
              >
                {tech.name}
              </span>
            ))}
          </div>
        </Container>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="w-full py-24 border-t border-hairline relative overflow-hidden">
        {/* Ambient top lines and glow effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[1px] bg-gradient-to-r from-transparent via-brand-primary/50 to-transparent opacity-40"></div>
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-brand-primary/10 rounded-full blur-[130px] pointer-events-none"></div>

        <Container size="6xl" className="relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
            <StatusBadge pulseColor="bg-brand-primary" className="bg-surface-2 border-hairline">
              PLANES Y TARIFAS
            </StatusBadge>
            <h2 className="font-sans font-bold text-3xl md:text-5xl tracking-headline text-ink">
              Planes diseñados para tu carga académica
            </h2>
            <p className="text-ink-muted text-sm md:text-base tracking-body leading-relaxed max-w-md mx-auto">
              Comienza gratis para probar el motor de IA o suscríbete al plan Pro para desbloquear todo el potencial de Katedra sin límites.
            </p>
          </div>

          {/* Toggle Switch */}
          <div className="flex justify-center mb-16">
            <div className="bg-surface-2 p-1.5 rounded-full border border-hairline inline-flex items-center shadow-inner relative select-none">
              <button 
                onClick={() => setIsAnnual(false)} 
                className={`relative z-10 px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 cursor-pointer ${!isAnnual ? 'text-ink' : 'text-ink-muted hover:text-ink'}`}
              >
                Mensual
              </button>
              <button 
                onClick={() => setIsAnnual(true)} 
                className={`relative z-10 px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 flex items-center gap-2 cursor-pointer ${isAnnual ? 'text-ink' : 'text-ink-muted hover:text-ink'}`}
              >
                Anual
                <span className={`transition-colors duration-300 ${isAnnual ? 'bg-emerald-500/20 text-emerald-400' : 'bg-surface-3 text-ink-subtle'} text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider font-extrabold`}>
                  Ahorra 20%
                </span>
              </button>
              {/* Highlight Pill */}
              <div 
                className={`absolute top-1.5 bottom-1.5 w-1/2 bg-surface-1 shadow-[0_2px_8px_rgba(0,0,0,0.2)] rounded-full border border-hairline-strong transition-transform duration-300 ease-in-out ${isAnnual ? 'translate-x-[calc(100%-6px)]' : 'translate-x-0'}`} 
                style={{ left: '6px' }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 max-w-4xl mx-auto items-stretch">
            
            {/* Free Plan */}
            <Card surface="1" className="h-full border-hairline flex flex-col justify-between hover:border-hairline-strong hover:shadow-[0_12px_40px_rgba(0,0,0,0.15)] transition-all duration-300 group rounded-[24px] p-8 md:p-12">
              <div className="flex-1 flex flex-col gap-8">
                <div>
                  <h3 className="text-xl font-bold text-ink mb-2 group-hover:text-brand-primary transition-colors">Básico (Gratis)</h3>
                  <p className="text-ink-muted text-xs leading-relaxed">Perfecto para conocer la plataforma y estructurar tus primeros temarios esenciales.</p>
                </div>
                
                <div className="flex items-baseline gap-1.5 pb-6 border-b border-hairline">
                  <span className="text-5xl font-black tracking-tighter text-ink">$0</span>
                  <span className="text-sm font-medium text-ink-muted">/mes</span>
                </div>

                <ul className="flex-1 flex flex-col gap-4 text-xs md:text-sm text-ink-subtle">
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                    <span>Hasta <strong className="text-ink font-semibold">3 temarios</strong> al mes</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                    <span>Generación de Teoría básica</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                    <span>Máximo 5 ejercicios por tema</span>
                  </li>
                  <li className="flex items-center gap-3 opacity-30">
                    <svg className="w-5 h-5 text-rose-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                    <span className="line-through">Generador de Diapositivas</span>
                  </li>
                  <li className="flex items-center gap-3 opacity-30">
                    <svg className="w-5 h-5 text-rose-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                    <span className="line-through">Exportación Premium (PDF, PPTX)</span>
                  </li>
                </ul>
              </div>
              
              <div className="mt-8">
                <Button variant="secondary" className="w-full py-3.5 text-xs font-bold rounded-xl" onClick={() => navigate('/login')}>
                  Comenzar Gratis
                </Button>
              </div>
            </Card>

            {/* Pro Plan */}
            <Card surface="2" className="h-full border border-brand-primary/60 ring-2 ring-brand-primary/10 relative flex flex-col justify-between shadow-[0_20px_50px_rgba(5,43,88,0.25)] rounded-[24px] overflow-hidden bg-gradient-to-b from-surface-2 to-surface-1 p-8 md:p-12">
              
              {/* Highlight Badge */}
              <div className="absolute top-6 right-8">
                <span className="bg-gradient-to-r from-brand-primary to-indigo-600 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
                  Recomendado
                </span>
              </div>
              
              {/* Subtle top glow line */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-400 via-brand-primary to-purple-500 opacity-95" />
              
              {/* Ambient Glow behind the price */}
              <div className="absolute top-12 left-10 w-32 h-32 bg-brand-primary/10 rounded-full blur-[40px] pointer-events-none"></div>

              <div className="relative z-10 flex-1 flex flex-col gap-8">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-bold text-ink">Katedra Pro</h3>
                    <svg className="w-4 h-4 text-indigo-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" /></svg>
                  </div>
                  <p className="text-ink-muted text-xs leading-relaxed">Para profesores exigentes que buscan automatización total de contenidos y cero límites.</p>
                </div>
                
                <div className="flex items-end gap-1.5 pb-6 border-b border-hairline-strong">
                  <span className="text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400">
                    ${isAnnual ? '12' : '15'}
                  </span>
                  <div className="flex flex-col pb-0.5">
                    <span className="text-sm font-medium text-ink-muted">/mes</span>
                  </div>
                  {isAnnual && (
                    <span className="ml-3 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded pb-1 mb-1 self-center border border-emerald-500/20">
                      Facturado anual ($144)
                    </span>
                  )}
                </div>

                <ul className="flex-1 flex flex-col gap-4 text-xs md:text-sm text-ink-subtle">
                  <li className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center shrink-0">
                      <svg className="w-3.5 h-3.5 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <span><strong className="text-ink font-semibold">Temarios ilimitados</strong> sin restricciones</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center shrink-0">
                      <svg className="w-3.5 h-3.5 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <span>Generación de <strong className="text-ink font-semibold">Teoría avanzada y profunda</strong></span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center shrink-0">
                      <svg className="w-3.5 h-3.5 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <span>Quizzes y ejercicios infinitos</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
                      <svg className="w-3.5 h-3.5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    </div>
                    <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Generador de Diapositivas</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center shrink-0">
                      <svg className="w-3.5 h-3.5 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <span>Exportación Premium Completa (PowerPoint, PDF, Word)</span>
                  </li>
                </ul>
              </div>
              
              <div className="mt-8">
                <Button variant="primary" className="relative z-10 w-full py-3.5 text-xs font-bold shadow-[0_10px_25px_rgba(5,43,88,0.5)] hover:shadow-[0_15px_35px_rgba(5,43,88,0.7)] hover:-translate-y-0.5 transition-all duration-300 rounded-xl" onClick={() => navigate('/login')}>
                  Mejorar a Pro
                </Button>
              </div>
            </Card>

          </div>
        </Container>
      </section>

      {/* FAQs Section */}
      <section className="w-full py-20 border-t border-hairline bg-surface-1/10">
        <Container size="5xl">
          <div className="text-center max-w-xl mx-auto mb-14 space-y-4">
            <span className="text-[10px] text-brand-primary font-bold uppercase tracking-wider block">RESPUESTAS</span>
            <h3 className="font-sans font-bold text-3xl text-ink tracking-headline">
              Preguntas Frecuentes
            </h3>
            <p className="text-ink-muted text-xs md:text-sm tracking-body leading-relaxed max-w-md mx-auto">
              Todo lo que necesitas saber sobre el funcionamiento de Katedra.
            </p>
          </div>

          <div className="space-y-4 max-w-3xl mx-auto">
            {[
              {
                q: '¿Cómo exporto mis temarios y diapositivas?',
                a: 'Una vez generado tu contenido en el panel de control de Katedra, verás botones de exportación directa a formato PDF para temarios y teoría, y archivos estructurados para PowerPoint (PPTX) o procesadores de texto.'
              },
              {
                q: '¿Es el contenido adaptado al nivel de mis estudiantes?',
                a: 'Sí. El motor de Katedra te permite elegir el nivel escolar (Secundaria, Bachillerato, Universidad, Posgrado) y el enfoque metodológico de la materia para asegurar que la teoría y los ejercicios tengan la rigurosidad correcta.'
              },
              {
                q: '¿Cómo funciona la garantía de calidad académica?',
                a: 'Katedra utiliza algoritmos de IA especializados entrenados bajo currículas académicas estructuradas, evitando alucinaciones y asegurando que las explicaciones sigan secuencias didácticas lógicas.'
              },
              {
                q: '¿Puedo cancelar mi suscripción Pro en cualquier momento?',
                a: 'Absolutamente. Si optas por el plan de suscripción mensual o anual Pro, puedes cancelarlo directamente desde el menú de tu cuenta sin plazos forzosos ni penalizaciones.'
              }
            ].map((faq, i) => (
              <div 
                key={i} 
                className="bg-surface-1 border border-hairline rounded-xl overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => toggleFaq(i)}
                  className="w-full text-left p-5 flex items-center justify-between text-ink hover:text-brand-primary transition-colors cursor-pointer select-none font-sans font-semibold text-sm"
                >
                  <span>{faq.q}</span>
                  <svg 
                    className={`w-4 h-4 text-ink-subtle transform transition-transform duration-300 ${faqOpenIndex === i ? 'rotate-180 text-brand-primary' : ''}`} 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div 
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    faqOpenIndex === i ? 'max-h-40 border-t border-hairline bg-surface-2/20' : 'max-h-0'
                  }`}
                >
                  <p className="p-5 text-xs sm:text-sm text-ink-muted leading-relaxed font-sans">
                    {faq.a}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}


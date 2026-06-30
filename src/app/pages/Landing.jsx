import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const DISPLAY = "'Playfair Display', serif";
const BODY = "'Inter', system-ui, sans-serif";

const PLAYGROUND_COURSES = [
  {
    name: 'Introducción a la IA',
    topic: 'Bachillerato / Universidad',
    icon: '🤖',
    tint: '#D1FAE5',
    modules: [
      { n: '1', t: 'Historia y Conceptos Básicos' },
      { n: '2', t: 'Aprendizaje Supervisado vs No Supervisado' },
      { n: '3', t: 'Redes Neuronales y Deep Learning' },
      { n: '4', t: 'Ética y Futuro de la IA' }
    ],
    theoryTitle: 'Bloque de Fundamentos',
    theoryBody: 'La inteligencia artificial (IA) es la simulación de procesos de inteligencia humana por parte de máquinas. Estos procesos incluyen el aprendizaje, el razonamiento y la autocorrección...',
    quiz: {
      q: '¿Cuál es la característica principal de una red neuronal artificial?',
      options: [
        { label: 'Es un algoritmo lineal simple', correct: false },
        { label: 'Simula las interconexiones de las neuronas biológicas', correct: true },
        { label: 'No requiere datos para entrenarse', correct: false }
      ]
    },
    slides: [
      { tag: 'DIAPOSITIVA 1', title: 'Bienvenidos a la era inteligente', bg: '#E0F2FE', fg: '#0284C7' },
      { tag: 'DIAPOSITIVA 2', title: 'Redes Neuronales', bg: '#F3E8FF', fg: '#7E22CE' },
      { tag: 'DIAPOSITIVA 3', title: 'Conclusiones y Debate', bg: '#FFEDD5', fg: '#C2410C' }
    ]
  },
  {
    name: 'Álgebra Lineal Aplicada',
    topic: 'Universidad (Ingeniería)',
    icon: '📐',
    tint: '#E0F2FE',
    modules: [
      { n: '1', t: 'Matrices y Determinantes' },
      { n: '2', t: 'Espacios Vectoriales' },
      { n: '3', t: 'Transformaciones Lineales' },
      { n: '4', t: 'Valores y Vectores Propios' }
    ],
    theoryTitle: 'Fundamentos de Matrices',
    theoryBody: 'El álgebra lineal es una rama de las matemáticas que estudia conceptos tales como vectores, matrices, espacio dual, sistemas de ecuaciones lineales y enfoques afines...',
    quiz: {
      q: '¿Qué condición debe cumplir una matriz para ser invertible?',
      options: [
        { label: 'Tener ceros en la diagonal', correct: false },
        { label: 'Su determinante debe ser diferente de cero', correct: true },
        { label: 'Debe ser una matriz rectangular', correct: false }
      ]
    },
    slides: [
      { tag: 'DIAPOSITIVA 1', title: 'Fundamentos de Matrices', bg: '#D1FAE5', fg: '#047857' },
      { tag: 'DIAPOSITIVA 2', title: 'Interpretación Geométrica', bg: '#FFEDD5', fg: '#C2410C' },
      { tag: 'DIAPOSITIVA 3', title: 'Aplicaciones en Gráficos 3D', bg: '#F3E8FF', fg: '#7E22CE' }
    ]
  },
  {
    name: 'Historia Contemporánea',
    topic: 'Secundaria / Bachillerato',
    icon: '🏛️',
    tint: '#FFEDD5',
    modules: [
      { n: '1', t: 'Procesos de Independencia' },
      { n: '2', t: 'Consolidación de los Estados Nación' },
      { n: '3', t: 'Revoluciones del Siglo XX' },
      { n: '4', t: 'Globalización e Integración Regional' }
    ],
    theoryTitle: 'Revoluciones y Conflictos',
    theoryBody: 'La historia contemporánea de América Latina abarca los complejos procesos políticos, sociales y económicos desde finales del siglo XVIII hasta el presente, destacando la influencia de potencias extranjeras...',
    quiz: {
      q: '¿Cuál fue un detonante clave de las independencias latinoamericanas?',
      options: [
        { label: 'La crisis de la monarquía española', correct: true },
        { label: 'El fin de la guerra fría', correct: false },
        { label: 'La revolución industrial', correct: false }
      ]
    },
    slides: [
      { tag: 'DIAPOSITIVA 1', title: 'Rutas de la Independencia', bg: '#F3E8FF', fg: '#7E22CE' },
      { tag: 'DIAPOSITIVA 2', title: 'Economías de Exportación', bg: '#E0F2FE', fg: '#0284C7' },
      { tag: 'DIAPOSITIVA 3', title: 'Retos de la Democracia', bg: '#D1FAE5', fg: '#047857' }
    ]
  }
];

const FEATURES = [
  {
    title: 'Teoría Estructurada',
    body: 'Explicaciones académicas robustas, adaptadas rigurosamente al nivel escolar y a los temas exactos de tu plan curricular oficial.',
    icon: '📚',
    tint: '#D1FAE5', // Mint
    iconBg: '#A7F3D0',
    border: '#A7F3D0'
  },
  {
    title: 'Ejercicios y Exámenes',
    body: 'Cuestionarios de opción múltiple, problemas de desarrollo con rúbrica, claves de respuestas y formatos limpios listos para imprimir.',
    icon: '✍️',
    tint: '#FFEDD5', // Peach
    iconBg: '#FED7AA',
    border: '#FED7AA'
  },
  {
    title: 'Diapositivas Listas',
    body: 'Esquemas lógicos detallados diapositiva por diapositiva, listos para usar de inmediato en PowerPoint, Keynote o Canva.',
    icon: '📽️',
    tint: '#E0F2FE', // Sky
    iconBg: '#BAE6FD',
    border: '#BAE6FD'
  }
];

export default function Landing() {
  const navigate = useNavigate();
  const [isAnnual, setIsAnnual] = useState(true);
  const [activeSubjIndex, setActiveSubjIndex] = useState(null);
  const [activeTab, setActiveTab] = useState('modules');
  const [isGenerating, setIsGenerating] = useState(false);
  const [faqOpenIndex, setFaqOpenIndex] = useState(null);

  const activeCourse = activeSubjIndex !== null ? PLAYGROUND_COURSES[activeSubjIndex] : null;

  const handleSelectSubject = (idx) => {
    if (activeSubjIndex === idx) return;
    setActiveSubjIndex(idx);
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
    }, 1800);
  };

  const toggleFaq = (idx) => {
    setFaqOpenIndex(faqOpenIndex === idx ? null : idx);
  };

  return (
    <div className="w-full min-h-screen bg-white text-slate-900" style={{ fontFamily: BODY }}>
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative bg-slate-900 pt-24 pb-60 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(900px 420px at 50% -10%, rgba(16,185,129,0.18), transparent 60%)' }} />
        
        <div className="relative max-w-4xl mx-auto z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/5 text-slate-300 text-sm font-medium mb-7">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,0.22)]" />
            Usado por +10,000 docentes
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{ fontFamily: DISPLAY }}
            className="text-white font-extrabold text-5xl md:text-7xl leading-tight tracking-tight mb-6">
            Diseña temarios a la<br />velocidad del <em className="italic text-emerald-300">pensamiento.</em>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-9">
            Teoría rigurosa, ejercicios con clave y diapositivas de clase — generadas en segundos.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-4">
            <button onClick={() => navigate('/dashboard')} className="px-7 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold text-base shadow-[0_8px_26px_rgba(16,185,129,0.34)] transition-all">
              Comenzar Gratis
            </button>
            <a href="#playground" className="px-7 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold text-base transition-all">
              Probar Demo En Vivo
            </a>
          </motion.div>
        </div>

        {/* Floating Mockup */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="relative max-w-3xl mx-auto mt-16 -mb-48 z-20">
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            className="bg-white rounded-2xl shadow-[0_40px_90px_-20px_rgba(2,6,23,0.55),0_0_0_1px_rgba(255,255,255,0.04)] overflow-hidden text-left">
            {/* Mockup Header */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-100">
              <span className="w-3 h-3 rounded-full bg-red-400" />
              <span className="w-3 h-3 rounded-full bg-amber-400" />
              <span className="w-3 h-3 rounded-full bg-emerald-400" />
              <span className="ml-3 text-sm text-slate-400 font-medium">Biología_Celular_Temario.pdf</span>
            </div>
            {/* Mockup Body */}
            <div className="p-8 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <div className="text-xs uppercase tracking-widest text-emerald-500 font-bold mb-2.5">Módulo 03</div>
                <h3 style={{ fontFamily: DISPLAY }} className="text-2xl font-bold text-slate-900 mb-4 leading-snug">Respiración Celular</h3>
                <div className="h-2.5 rounded-full bg-slate-100 mb-2.5 w-full" />
                <div className="h-2.5 rounded-full bg-slate-100 mb-2.5 w-11/12" />
                <div className="h-2.5 rounded-full bg-slate-100 mb-5 w-4/5" />
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-semibold">
                  ✓ Clave de respuestas incluida
                </div>
              </div>
              <div className="bg-slate-50 rounded-xl p-5">
                <div className="text-xs font-bold text-slate-700 mb-3">Quiz Rápido</div>
                <div className="text-sm text-slate-600 mb-3 leading-relaxed">¿Qué organelo es el sitio principal del ciclo de Krebs?</div>
                <div className="flex flex-col gap-2">
                  <div className="px-3 py-2 rounded-lg bg-white border border-slate-200 text-sm text-slate-500">Ribosoma</div>
                  <div className="px-3 py-2 rounded-lg bg-emerald-50 border border-emerald-300 text-sm text-emerald-800 font-semibold flex justify-between">Mitocondria <span>✓</span></div>
                  <div className="px-3 py-2 rounded-lg bg-white border border-slate-200 text-sm text-slate-500">Núcleo</div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* PLAYGROUND SECTION */}
      <section id="playground" className="bg-white pt-60 pb-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="text-xs uppercase tracking-widest text-emerald-500 font-bold mb-3">El Motor Katedra</div>
            <h2 style={{ fontFamily: DISPLAY }} className="text-3xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">Observa cómo nace un curso</h2>
            <p className="text-lg text-slate-500">Selecciona una materia. Katedra diseña los módulos, la teoría y los ejercicios en tiempo real.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6 bg-slate-50 border border-slate-200 rounded-3xl p-6 shadow-[0_30px_70px_-40px_rgba(15,23,42,0.25)]">
            {/* Sidebar */}
            <aside className="flex flex-col gap-2">
              <div className="text-xs uppercase tracking-widest text-slate-400 font-bold px-2.5 pb-2">Materias</div>
              {PLAYGROUND_COURSES.map((subj, idx) => (
                <button 
                  key={idx}
                  onClick={() => handleSelectSubject(idx)}
                  className={`flex items-center gap-3 p-3 rounded-xl text-left transition-all ${activeSubjIndex === idx ? 'bg-white shadow-sm border border-slate-200' : 'hover:bg-slate-100 border border-transparent'}`}>
                  <span className="w-10 h-10 rounded-lg flex items-center justify-center text-xl shrink-0" style={{ background: subj.tint }}>{subj.icon}</span>
                  <span className="flex flex-col">
                    <span className="text-sm font-semibold text-slate-900">{subj.name}</span>
                    <span className="text-xs text-slate-500">{subj.topic}</span>
                  </span>
                </button>
              ))}
              <div className="mt-auto pt-4 px-2.5 flex items-center gap-2 text-xs text-slate-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Katedra AI · Listo
              </div>
            </aside>

            {/* Viewer */}
            <div className="bg-white border border-slate-200 rounded-2xl min-h-[520px] flex flex-col overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <span className={`w-2.5 h-2.5 rounded-full ${isGenerating ? 'bg-amber-400 animate-pulse' : (activeCourse ? 'bg-emerald-500' : 'bg-slate-300')}`} />
                  <span className="text-sm font-semibold text-slate-700">
                    {activeCourse ? activeCourse.name : 'Espacio de Trabajo'}
                  </span>
                </div>
                <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
                  {['modules', 'theory', 'exercises', 'slides'].map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab)} 
                      className={`px-3 py-1.5 rounded-md text-xs font-semibold capitalize transition-colors ${activeTab === tab ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-8 flex-1 overflow-y-auto">
                {!activeCourse ? (
                  <div className="h-full flex flex-col items-center justify-center text-center text-slate-400">
                    <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-3xl mb-4">✨</div>
                    <div className="text-lg font-semibold text-slate-600 mb-2">Selecciona una materia para iniciar</div>
                    <div className="text-sm max-w-xs">Katedra redactará un kit educativo completo en segundos.</div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {activeTab === 'modules' && (
                      <div>
                        <div className="flex items-center gap-2 mb-4">
                          <span className="w-6 h-6 rounded bg-emerald-50 text-emerald-700 flex items-center justify-center text-xs font-bold">1</span>
                          <span className="text-sm uppercase tracking-widest text-slate-400 font-bold">Módulos</span>
                        </div>
                        {isGenerating ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {[1,2,3,4].map(i => <div key={i} className="h-11 rounded-xl bg-slate-100 animate-pulse" style={{ animationDelay: `${i*0.15}s` }} />)}
                          </div>
                        ) : (
                          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {activeCourse.modules.map((m, i) => (
                              <div key={i} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50 text-sm font-medium text-slate-700 flex items-center gap-3">
                                <span className="text-emerald-500 font-bold">{m.n}</span> {m.t}
                              </div>
                            ))}
                          </motion.div>
                        )}
                      </div>
                    )}

                    {activeTab === 'theory' && (
                      <div>
                        <div className="flex items-center gap-2 mb-4">
                          <span className="w-6 h-6 rounded bg-emerald-50 text-emerald-700 flex items-center justify-center text-xs font-bold">2</span>
                          <span className="text-sm uppercase tracking-widest text-slate-400 font-bold">Teoría</span>
                        </div>
                        {isGenerating ? (
                          <div className="space-y-2.5">
                            <div className="h-3 rounded-full bg-slate-100 animate-pulse" />
                            <div className="h-3 rounded-full bg-slate-100 w-11/12 animate-pulse" style={{ animationDelay: '.15s' }} />
                            <div className="h-3 rounded-full bg-slate-100 w-4/5 animate-pulse" style={{ animationDelay: '.3s' }} />
                          </div>
                        ) : (
                          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                            <h4 style={{ fontFamily: DISPLAY }} className="text-2xl font-bold text-slate-900 mb-3">{activeCourse.theoryTitle}</h4>
                            <p className="text-base text-slate-600 leading-relaxed">{activeCourse.theoryBody}</p>
                          </motion.div>
                        )}
                      </div>
                    )}

                    {activeTab === 'exercises' && (
                      <div>
                        <div className="flex items-center gap-2 mb-4">
                          <span className="w-6 h-6 rounded bg-emerald-50 text-emerald-700 flex items-center justify-center text-xs font-bold">3</span>
                          <span className="text-sm uppercase tracking-widest text-slate-400 font-bold">Ejercicios</span>
                        </div>
                        {isGenerating ? (
                          <div className="space-y-2.5">
                            {[1,2,3].map(i => <div key={i} className="h-10 rounded-xl bg-slate-100 animate-pulse" style={{ animationDelay: `${i*0.15}s` }} />)}
                          </div>
                        ) : (
                          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                            <div className="text-base font-semibold text-slate-900 mb-4">{activeCourse.quiz.q}</div>
                            <div className="flex flex-col gap-2.5">
                              {activeCourse.quiz.options.map((opt, i) => (
                                <div key={i} className={`p-3 rounded-xl border flex justify-between items-center text-sm ${opt.correct ? 'bg-emerald-50 border-emerald-200 text-emerald-800 font-medium' : 'bg-white border-slate-200 text-slate-600'}`}>
                                  <span>{opt.label}</span>
                                  {opt.correct && <span className="font-bold text-emerald-600">✓ Clave</span>}
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </div>
                    )}

                    {activeTab === 'slides' && (
                      <div>
                        <div className="flex items-center gap-2 mb-4">
                          <span className="w-6 h-6 rounded bg-emerald-50 text-emerald-700 flex items-center justify-center text-xs font-bold">4</span>
                          <span className="text-sm uppercase tracking-widest text-slate-400 font-bold">Diapositivas</span>
                        </div>
                        {isGenerating ? (
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {[1,2,3].map(i => <div key={i} className="h-28 rounded-xl bg-slate-100 animate-pulse" style={{ animationDelay: `${i*0.15}s` }} />)}
                          </div>
                        ) : (
                          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {activeCourse.slides.map((sl, i) => (
                              <div key={i} className="rounded-xl border border-slate-100 overflow-hidden bg-white shadow-sm">
                                <div className="h-16 flex items-end p-3" style={{ background: sl.bg }}>
                                  <span className="text-[10px] font-bold" style={{ color: sl.fg }}>{sl.tag}</span>
                                </div>
                                <div className="p-3">
                                  <div className="text-sm font-semibold text-slate-800 leading-snug">{sl.title}</div>
                                </div>
                              </div>
                            ))}
                          </motion.div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="bg-white py-24 px-6 border-t border-slate-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 style={{ fontFamily: DISPLAY }} className="text-3xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">Todo lo que necesitas, en segundos.</h2>
            <p className="text-lg text-slate-500">Desde la primera nota de clase hasta el examen final — redactado, estructurado y listo para enseñar.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <div key={i} className="rounded-3xl p-8 transition-transform hover:-translate-y-1.5 border" style={{ background: f.tint, borderColor: f.border }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-6 shadow-sm" style={{ background: f.iconBg }}>
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{f.title}</h3>
                <p className="text-sm text-slate-700 leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="bg-slate-50 py-20 px-6 border-y border-slate-200">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
          {[
            { v: '40%', l: 'Ahorro de Tiempo Promedio' },
            { v: '+10k', l: 'Temarios y Clases Creados' },
            { v: '98%', l: 'Índice de Satisfacción' }
          ].map((s, i) => (
            <div key={i}>
              <div style={{ fontFamily: DISPLAY }} className="text-5xl md:text-6xl font-extrabold text-slate-900 mb-3">{s.v}</div>
              <div className="text-sm font-medium text-slate-500">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* INTEGRATIONS */}
      <section id="integrations" className="bg-white py-24 px-6 overflow-hidden">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 style={{ fontFamily: DISPLAY }} className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">Exporta hacia donde ya trabajas</h2>
          <p className="text-lg text-slate-500">Un clic para enviar a PowerPoint, PDF, o tu LMS favorito.</p>
        </div>
        <div className="relative max-w-5xl mx-auto" style={{ maskImage: 'linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent)' }}>
          <div className="flex justify-center gap-4 flex-wrap">
            {['Microsoft PowerPoint', 'Adobe PDF Reader', 'Google Classroom', 'Canvas LMS', 'Moodle', 'Markdown'].map((ig, i) => (
              <div key={i} className="flex items-center gap-3 px-6 py-3 rounded-xl border border-slate-200 bg-white shadow-sm">
                <span className="font-semibold text-slate-700 text-sm">{ig}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="bg-slate-50 py-24 px-6 border-t border-slate-200">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 style={{ fontFamily: DISPLAY }} className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">Planes para tu carga académica</h2>
            <div className="inline-flex items-center p-1.5 bg-white border border-slate-200 rounded-xl relative shadow-sm">
              <div className="absolute top-1.5 bottom-1.5 w-1/2 rounded-lg bg-slate-900 transition-transform duration-300" style={{ transform: isAnnual ? 'translateX(100%)' : 'translateX(0)', width: 'calc(50% - 6px)' }} />
              <button onClick={() => setIsAnnual(false)} className={`relative z-10 px-6 py-2 rounded-lg text-sm font-bold transition-colors ${!isAnnual ? 'text-white' : 'text-slate-500'}`}>Mensual</button>
              <button onClick={() => setIsAnnual(true)} className={`relative z-10 px-6 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-2 ${isAnnual ? 'text-white' : 'text-slate-500'}`}>
                Anual <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500 text-emerald-50 uppercase tracking-widest font-black">−20%</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch max-w-4xl mx-auto">
            {/* Free */}
            <div className="bg-white rounded-[24px] p-8 border border-slate-200 shadow-sm flex flex-col">
              <h3 style={{ fontFamily: DISPLAY }} className="text-2xl font-bold text-slate-900 mb-2">Básico (Gratis)</h3>
              <p className="text-sm text-slate-500 mb-6">Para estructurar tus primeros temarios.</p>
              <div className="flex items-baseline gap-1 mb-8">
                <span style={{ fontFamily: DISPLAY }} className="text-5xl font-extrabold text-slate-900">$0</span>
                <span className="text-slate-500 text-sm">/mes</span>
              </div>
              <ul className="flex flex-col gap-4 text-sm text-slate-600 mb-8 flex-1">
                <li className="flex items-center gap-3"><span className="text-emerald-500 font-bold">✓</span> Hasta 3 temarios al mes</li>
                <li className="flex items-center gap-3"><span className="text-emerald-500 font-bold">✓</span> Teoría básica</li>
                <li className="flex items-center gap-3"><span className="text-emerald-500 font-bold">✓</span> 5 ejercicios por tema</li>
                <li className="flex items-center gap-3 opacity-40"><span className="text-slate-400">−</span> Diapositivas completas</li>
              </ul>
              <button onClick={() => navigate('/login')} className="w-full py-3.5 rounded-xl border-2 border-slate-900 text-slate-900 font-bold hover:bg-slate-50 transition-colors">
                Comenzar Gratis
              </button>
            </div>

            {/* Pro */}
            <div className="bg-slate-900 rounded-[24px] p-8 shadow-xl flex flex-col relative overflow-hidden">
              <div className="absolute top-5 right-5 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-emerald-500 text-white">Recomendado</div>
              <h3 style={{ fontFamily: DISPLAY }} className="text-2xl font-bold text-white mb-2">Katedra Pro</h3>
              <p className="text-sm text-slate-400 mb-6">Automatización total sin límites.</p>
              <div className="flex items-baseline gap-1 mb-8">
                <span style={{ fontFamily: DISPLAY }} className="text-5xl font-extrabold text-white">${isAnnual ? '12' : '15'}</span>
                <span className="text-slate-400 text-sm">/mes</span>
              </div>
              <ul className="flex flex-col gap-4 text-sm text-slate-300 mb-8 flex-1">
                <li className="flex items-center gap-3"><span className="text-emerald-400 font-bold">✓</span> Temarios ilimitados</li>
                <li className="flex items-center gap-3"><span className="text-emerald-400 font-bold">✓</span> Teoría avanzada</li>
                <li className="flex items-center gap-3"><span className="text-emerald-400 font-bold">✓</span> Quizzes infinitos</li>
                <li className="flex items-center gap-3"><span className="text-emerald-400 font-bold">✓</span> Generador de Diapositivas</li>
                <li className="flex items-center gap-3"><span className="text-emerald-400 font-bold">✓</span> Exportación Premium</li>
              </ul>
              <button onClick={() => navigate('/login')} className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold transition-colors">
                Mejorar a Pro
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQS */}
      <section id="faqs" className="bg-white py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 style={{ fontFamily: DISPLAY }} className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">Preguntas Frecuentes</h2>
          </div>
          <div className="space-y-4">
            {[
              { q: '¿Cómo exporto mis temarios y diapositivas?', a: 'Una vez generado tu contenido, verás botones de exportación directa a PDF y archivos estructurados para PowerPoint (PPTX).' },
              { q: '¿Es el contenido adaptado al nivel de mis estudiantes?', a: 'Sí. El motor te permite elegir el nivel escolar para asegurar la rigurosidad correcta.' },
              { q: '¿Puedo cancelar mi suscripción en cualquier momento?', a: 'Absolutamente. Puedes cancelar directamente desde tu cuenta sin plazos forzosos.' }
            ].map((faq, i) => (
              <div key={i} className="border border-slate-200 rounded-2xl overflow-hidden transition-colors" style={{ background: faqOpenIndex === i ? '#F9FAFB' : '#fff' }}>
                <button onClick={() => toggleFaq(i)} className="w-full p-5 text-left flex justify-between items-center font-bold text-slate-900">
                  {faq.q}
                  <span className={`transform transition-transform text-slate-400 ${faqOpenIndex === i ? 'rotate-180' : ''}`}>▼</span>
                </button>
                {faqOpenIndex === i && (
                  <div className="px-5 pb-5 text-slate-600 text-sm leading-relaxed border-t border-slate-100 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

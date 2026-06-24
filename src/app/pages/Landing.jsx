import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { FaFilePdf, FaFilePowerpoint, FaFileWord, FaGoogleDrive, FaMicrosoft } from 'react-icons/fa6';
import { SiGoogleforms } from 'react-icons/si';
import LandingHeader from '../components/LandingHeader';
import Footer from '../components/Footer';
import Container from '../components/Container';
import Button from '../components/Button';

/* ------------------------------------------------------------------ *
 *  Shared section-chrome classNames — Katedra Design System (DESIGN.md)
 *  Kept as plain Tailwind class strings (not inline styles) to avoid
 *  repeating the same kicker/heading/lead combo across every section.
 * ------------------------------------------------------------------ */
const KICKER = 'text-[11px] font-extrabold uppercase tracking-[1.5px] text-purple-600 dark:text-purple-400 select-none';
const SECTION_HEADING = 'font-bold text-4xl md:text-5xl tracking-tight text-ink';
const SECTION_LEAD = 'text-base leading-relaxed text-ink-muted';

// Hex constants used exclusively as SVG drawing attributes (stroke/fill on
// the hand-drawn book illustration) — vector-art data, not themable chrome.
const INK = '#0F172A';
const BLUE = '#2563EB';
const GREEN = '#10B981';
const GREEN_DEEP = '#059669';
const MUTED = 'rgba(15,23,42,0.55)';

// Soft radial glows that replace the old flat white/lilac section banding.
const GLOW_BLUE_TOP =
  'absolute -z-10 inset-x-0 top-0 h-[480px] pointer-events-none bg-[radial-gradient(55%_60%_at_50%_0%,rgba(37,99,235,0.08),transparent_72%)]';
const GLOW_MINT_BOTTOM =
  'absolute -z-10 inset-x-0 bottom-0 h-[420px] pointer-events-none bg-[radial-gradient(50%_60%_at_50%_100%,rgba(16,185,129,0.07),transparent_72%)]';
const GLOW_MINT_TOP =
  'absolute -z-10 inset-x-0 top-0 h-[420px] pointer-events-none bg-[radial-gradient(55%_60%_at_50%_0%,rgba(16,185,129,0.07),transparent_72%)]';

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

// Export/import targets that genuinely exist in Katedra's product scope
// (Generator/ContentViewer export panels, Dashboard's source-document import).
const EXPORT_TOOLS = [
  { Icon: FaFilePdf, label: 'Exportar a PDF', color: '#E2574C' },
  { Icon: FaFilePowerpoint, label: 'Diapositivas en PowerPoint', color: '#D24726' },
  { Icon: FaFileWord, label: 'Temarios en Word', color: '#2B579A' },
  { Icon: SiGoogleforms, label: 'Exámenes en Google Forms', color: '#673AB7' },
  { Icon: FaMicrosoft, label: 'Cuestionarios en Microsoft Forms', color: '#7719AA' },
  { Icon: FaGoogleDrive, label: 'Importar desde Google Drive', color: '#0F9D58' }
];

const FEATURES = [
  {
    bg: 'bg-canvas dark:bg-surface-2 border border-hairline',
    accent: 'text-blue-600 dark:text-blue-400',
    title: 'Contenido Teórico Adaptado',
    desc: 'Textos claros y bien fundamentados, siempre alineados al grado escolar de tus estudiantes y a los temas de tu programa oficial.',
    icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
  },
  {
    bg: 'bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30',
    accent: 'text-emerald-600 dark:text-emerald-400',
    title: 'Evaluaciones Integrales',
    desc: 'Genera exámenes de opción múltiple o preguntas de desarrollo con sus respectivas claves de respuesta, en formatos listos para aplicar.',
    icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01'
  },
  {
    bg: 'bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30',
    accent: 'text-blue-600 dark:text-blue-400',
    title: 'Esquemas para Presentaciones',
    desc: 'Obtén el guion estructurado para cada diapositiva de tu clase, optimizado para exportarlo fácilmente a PowerPoint, Keynote o Canva.',
    icon: 'M7 12l3-3 3 3 4-4M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z'
  }
];

const IMPACT_STATS = [
  { n: '40%', t: 'Ahorro de Tiempo', d: 'Reducción significativa del tiempo dedicado a la planificación y redacción.', c: 'text-blue-600' },
  { n: '+10k', t: 'Clases Preparadas', d: 'Respaldando a docentes e instituciones educativas de toda la región.', c: 'text-emerald-600' },
  { n: '98%', t: 'Satisfacción Docente', d: 'Los profesionales de la educación valoran la calidad y pertinencia de los materiales.', c: 'text-blue-600' }
];

const FAQS = [
  { q: '¿Cómo descargo mi material?', a: 'Al finalizar la revisión de tu clase, tendrás opciones visibles para descargar los materiales en formato PDF, exportar los cuestionarios a documentos de texto o transferir las diapositivas a PowerPoint (PPTX).' },
  { q: '¿El contenido es adecuado para la edad de mis alumnos?', a: 'Sí, completamente. Antes de generar el temario, el sistema solicita el grado escolar (desde educación básica hasta posgrado) para garantizar que el lenguaje, los ejemplos y la profundidad académica sean los indicados.' },
  { q: '¿Qué tan confiable es la información generada?', a: 'La plataforma ha sido desarrollada junto a especialistas en educación. Se basa en enfoques pedagógicos probados para asegurar que las secuencias de aprendizaje tengan coherencia y exactitud académica.' },
  { q: '¿Es complicado cancelar mi suscripción si dejo de usarla?', a: 'El proceso es muy sencillo. Puedes cancelar tu suscripción en cualquier momento desde tu panel de usuario, sin necesidad de trámites adicionales ni correos.' }
];

/* ------------------------------------------------------------------ *
 *  Scrollytelling hero — a fixed/pinned book SVG that draws itself
 *  as the visitor scrolls, narrating: topic -> AI drafts -> materials
 * ------------------------------------------------------------------ */
function ScrollytellingHero({ navigate }) {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end end']
  });

  // Smooth the raw scroll signal so fast/trackpad scrolling doesn't make the
  // book-drawing animation feel choppy — every transform below derives from
  // this spring instead of the raw value.
  const progress = useSpring(scrollYProgress, { stiffness: 300, damping: 40, mass: 0.5, restDelta: 0.001 });

  // Draw stages (pathLength is animated by framer-motion)
  const coverDraw = useTransform(progress, [0.02, 0.32], [0, 1]);
  const pagesDraw = useTransform(progress, [0.18, 0.55], [0, 1]);
  const linesDraw = useTransform(progress, [0.34, 0.74], [0, 1]);
  const capDraw   = useTransform(progress, [0.60, 0.86], [0, 1]);
  const checkDraw = useTransform(progress, [0.72, 0.92], [0, 1]);

  // Stage handoff: intro copy fades out, generated result fades in
  const introOpacity = useTransform(progress, [0, 0.30, 0.46], [1, 1, 0]);
  const introY       = useTransform(progress, [0, 0.46], [0, -48]);
  const resultOpacity = useTransform(progress, [0.52, 0.74], [0, 1]);
  const resultY       = useTransform(progress, [0.52, 0.86], [56, 0]);

  const bookScale = useTransform(progress, [0, 0.5, 1], [0.94, 1, 1.05]);
  const bookRotate = useTransform(progress, [0, 1], [-3, 2]);
  const hintOpacity = useTransform(progress, [0, 0.08], [1, 0]);

  const pageLines = [42, 70, 98, 126, 154];

  return (
    <section ref={heroRef} className="relative w-full h-[300vh] bg-surface-1">
      {/* soft ambient field */}
      <div className={`absolute inset-0 pointer-events-none bg-[radial-gradient(60%_50%_at_50%_0%,var(--color-canvas),transparent_70%)]`} />

      <div className="sticky top-0 h-screen w-full flex items-center overflow-hidden">
        <Container size="7xl" className="relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">

            {/* LEFT — narrative copy, stage-crossfaded */}
            <div className="lg:col-span-6 relative min-h-[340px] flex items-center">
              {/* Stage 1 — the pitch */}
              <motion.div style={{ opacity: introOpacity, y: introY }} className="absolute inset-0 flex flex-col justify-center gap-6">
                <span className={KICKER}>
                  Katedra · Para Educadores
                </span>
                <h1 className="font-bold text-5xl md:text-6xl lg:text-[68px] tracking-tight leading-[1.02] text-ink">
                  Diseña tus clases con<br />agilidad y<br />
                  <span className="text-blue-600">precisión profesional.</span>
                </h1>
                <p className="text-base md:text-lg leading-relaxed max-w-md text-ink-muted">
                  Obtén temarios bien estructurados, explicaciones teóricas sólidas y presentaciones completas en pocos minutos, optimizando tu labor docente.
                </p>
                <div className="flex flex-col sm:flex-row items-start gap-3 pt-1">
                  <Button variant="primary" onClick={() => navigate('/dashboard')}
                    className="px-7 py-3.5 text-sm font-bold !rounded-xl">
                    Comenzar Gratis
                  </Button>
                  <a href="#demo">
                    <Button variant="secondary"
                      className="px-7 py-3.5 text-sm font-bold !rounded-xl">
                      Probar Demo En Vivo
                    </Button>
                  </a>
                </div>
              </motion.div>

              {/* Stage 2 — the generated result */}
              <motion.div style={{ opacity: resultOpacity, y: resultY }} className="absolute inset-0 flex flex-col justify-center gap-5">
                <span className="text-[11px] font-extrabold uppercase tracking-[1.5px] text-emerald-600 dark:text-emerald-400 flex items-center gap-2 select-none">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Materiales listos
                </span>
                <h2 className="font-bold text-4xl md:text-5xl tracking-tight leading-[1.05] text-ink">
                  Tu curso completo,<br />en un solo lugar.
                </h2>
                <div className="flex flex-col gap-2.5 max-w-md">
                  {[
                    'Temarios modulares detallados',
                    'Explicaciones teóricas claras y adaptadas',
                    'Bancos de ejercicios con claves de respuesta',
                    'Estructuras para presentaciones de clase'
                  ].map((t, i) => (
                    <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-surface-1 border border-hairline shadow-soft">
                      <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 bg-emerald-100">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-emerald-600"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      </span>
                      <span className="text-sm font-medium text-ink">{t}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-1">
                  <Button variant="primary" onClick={() => navigate('/dashboard')}
                    className="px-7 py-3.5 text-sm font-bold !rounded-xl">
                    Crear el mío →
                  </Button>
                </div>
              </motion.div>
            </div>

            {/* RIGHT — the drawing book */}
            <div className="lg:col-span-6 flex items-center justify-center">
              <motion.div style={{ scale: bookScale, rotate: bookRotate, willChange: 'transform' }} className="w-full max-w-[460px]">
                <svg viewBox="0 0 420 360" className="w-full h-auto" fill="none">
                  {/* graduation cap (draws late) */}
                  <motion.path
                    d="M210 22 L262 46 L210 70 L158 46 Z"
                    stroke={BLUE} strokeWidth="3" strokeLinejoin="round" strokeLinecap="round"
                    style={{ pathLength: capDraw }} />
                  <motion.path
                    d="M178 54 L178 84 C178 96 242 96 242 84 L242 54"
                    stroke={BLUE} strokeWidth="3" strokeLinecap="round"
                    style={{ pathLength: capDraw }} />
                  <motion.path d="M262 46 L262 78" stroke={GREEN} strokeWidth="3" strokeLinecap="round" style={{ pathLength: capDraw }} />
                  <motion.circle cx="262" cy="82" r="4" fill={GREEN} style={{ opacity: capDraw }} />

                  {/* book cover */}
                  <motion.path
                    d="M210 118 C150 96 78 96 30 118 L30 300 C78 280 150 280 210 302 C270 280 342 280 390 300 L390 118 C342 96 270 96 210 118 Z"
                    stroke={INK} strokeWidth="3" strokeLinejoin="round" strokeLinecap="round"
                    style={{ pathLength: coverDraw }} />
                  {/* spine */}
                  <motion.path d="M210 118 L210 302" stroke={INK} strokeWidth="3" strokeLinecap="round" style={{ pathLength: pagesDraw }} />
                  {/* inner page edges */}
                  <motion.path d="M210 130 C158 112 96 112 52 128" stroke={MUTED} strokeWidth="2" strokeLinecap="round" style={{ pathLength: pagesDraw }} />
                  <motion.path d="M210 130 C262 112 324 112 368 128" stroke={MUTED} strokeWidth="2" strokeLinecap="round" style={{ pathLength: pagesDraw }} />

                  {/* text lines — left page */}
                  {pageLines.map((dx, i) => (
                    <motion.path key={'l' + i}
                      d={`M62 ${150 + i * 26} C100 ${143 + i * 26} 160 ${143 + i * 26} ${200 - (i % 2) * 28} ${150 + i * 26}`}
                      stroke={i === 0 ? BLUE : 'rgba(37,99,235,0.45)'} strokeWidth={i === 0 ? 3 : 2} strokeLinecap="round"
                      style={{ pathLength: linesDraw }} />
                  ))}
                  {/* text lines — right page */}
                  {pageLines.map((dx, i) => (
                    <motion.path key={'r' + i}
                      d={`M220 ${150 + i * 26} C260 ${143 + i * 26} 320 ${143 + i * 26} ${358 - (i % 2) * 30} ${150 + i * 26}`}
                      stroke={i === 0 ? GREEN_DEEP : 'rgba(16,185,129,0.45)'} strokeWidth={i === 0 ? 3 : 2} strokeLinecap="round"
                      style={{ pathLength: linesDraw }} />
                  ))}

                  {/* finished check badge */}
                  <motion.circle cx="338" cy="246" r="22" fill="#fff" stroke={GREEN} strokeWidth="3" style={{ pathLength: checkDraw, opacity: checkDraw }} />
                  <motion.path d="M328 246 L335 253 L349 239" stroke={GREEN_DEEP} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" style={{ pathLength: checkDraw }} />
                </svg>
              </motion.div>
            </div>
          </div>
        </Container>

        {/* scroll hint */}
        <motion.div style={{ opacity: hintOpacity }} className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none">
          <span className="text-[10px] font-bold uppercase tracking-[1.35px] text-ink-muted">Desliza</span>
          <svg width="16" height="22" viewBox="0 0 16 22" fill="none" className="animate-bounce text-ink">
            <path d="M8 2 L8 18 M3 13 L8 19 L13 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.div>
      </div>
    </section>
  );
}

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
    <div className="w-full min-h-screen flex flex-col justify-between bg-surface-1 text-ink">
      {/* Header / Top Nav — transparent floating pill, exclusive to Landing */}
      <LandingHeader />

      {/* Scrollytelling Hero */}
      <ScrollytellingHero navigate={navigate} />

      {/* Interactive Sandbox/Demo Section */}
      <section id="demo" className="relative w-full py-24 overflow-hidden bg-surface-1">
        <div className={GLOW_BLUE_TOP} />
        <div className={GLOW_MINT_BOTTOM} />
        <Container size="6xl">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-4">
            <span className={KICKER}>Demostración interactiva</span>
            <h2 className={SECTION_HEADING}>Explora los resultados</h2>
            <p className={`${SECTION_LEAD} max-w-xl mx-auto`}>
              Selecciona una asignatura de ejemplo y observa cómo Katedra estructura los contenidos académicos en tiempo real.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto items-stretch">
            {/* Sandbox Sidebar Course Selector */}
            <div className="lg:col-span-4 flex flex-col gap-3">
              <span className="text-[10px] font-bold uppercase tracking-[1.35px] ml-1 select-none text-ink-muted">Selecciona una materia</span>
              {PLAYGROUND_COURSES.map((course, idx) => {
                const active = selectedCourseIndex === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => { if (!isGenerating) setSelectedCourseIndex(idx); }}
                    className={`w-full text-left p-5 rounded-2xl transition-all duration-300 cursor-pointer flex flex-col gap-2 bg-surface-1 border ${active ? 'border-blue-600 shadow-elevated' : 'border-hairline'}`}
                  >
                    <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full self-start ${active ? 'bg-blue-100 text-blue-600' : 'bg-canvas text-ink-muted'}`}>
                      {course.level}
                    </span>
                    <span className="font-semibold text-sm leading-snug text-ink">{course.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Sandbox Content Viewer */}
            <div className="lg:col-span-8 flex flex-col overflow-hidden min-h-[360px] relative rounded-[28px] bg-surface-1 border border-hairline shadow-hi">
              {/* Toolbar Tabs */}
              <div className="px-5 py-1 flex flex-wrap items-center justify-between gap-2 border-b border-hairline bg-surface-1">
                <div className="flex overflow-x-auto gap-1 py-3 scrollbar-none">
                  {[
                    { id: 'modules', label: '1. Módulos' },
                    { id: 'theory', label: '2. Teoría' },
                    { id: 'exercises', label: '3. Ejercicios' },
                    { id: 'slides', label: '4. Diapositivas' }
                  ].map((tab) => {
                    const active = activePlaygroundTab === tab.id;
                    return (
                      <button key={tab.id} onClick={() => setActivePlaygroundTab(tab.id)}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${active ? 'bg-blue-100 text-blue-600' : 'bg-transparent text-ink-muted'}`}>
                        {tab.label}
                      </button>
                    );
                  })}
                </div>
                <div className="py-2 text-[10px] flex items-center gap-1.5 font-bold select-none text-emerald-600">
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse bg-emerald-500"></span>
                  <span>ENGINE: ACTIVE</span>
                </div>
              </div>

              {/* Sandbox Screen Canvas */}
              <div className="p-6 sm:p-8 flex-1 flex flex-col justify-start relative">
                {isGenerating ? (
                  <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 bg-surface-1/90 backdrop-blur-sm">
                    <div className="relative w-12 h-12 flex items-center justify-center">
                      <div className="absolute w-full h-full rounded-full border-4 border-hairline"></div>
                      <div className="absolute w-full h-full rounded-full animate-spin border-4 border-transparent border-t-blue-600"></div>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-xs font-bold animate-pulse text-blue-600">GENERANDO CONTENIDOS...</span>
                      <span className="text-[10px] text-ink-muted">Preparando tus materiales de clase...</span>
                    </div>
                    <div className="w-32 h-1 rounded-full overflow-hidden bg-hairline">
                      <motion.div className="h-full rounded-full bg-blue-600" animate={{ width: `${progress}%` }} transition={{ duration: 0.15, ease: 'linear' }} />
                    </div>
                  </div>
                ) : null}

                {activePlaygroundTab === 'modules' && (
                  <div className="space-y-4">
                    <h4 className="font-bold text-lg flex items-center gap-2 tracking-tight text-ink">
                      <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
                      Estructura del Curso
                    </h4>
                    <div className="space-y-2.5">
                      {activeCourse.modules.map((mod, i) => (
                        <div key={i} className="flex items-center gap-3 p-4 rounded-2xl transition-all duration-200 bg-canvas border border-hairline">
                          <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 select-none bg-blue-100 text-blue-600">{i + 1}</span>
                          <span className="text-sm font-medium text-ink">{mod}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activePlaygroundTab === 'theory' && (
                  <div className="space-y-4">
                    <h4 className="font-bold text-lg flex items-center gap-2 tracking-tight text-ink">
                      <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                      Desarrollo del Tema
                    </h4>
                    <div className="p-5 rounded-2xl space-y-3 bg-canvas border border-hairline">
                      <span className="text-[10px] font-bold uppercase tracking-[1.35px] block select-none text-blue-600">Bloque de Fundamentos</span>
                      <p className="text-sm leading-relaxed text-ink-muted">{activeCourse.details.theory}</p>
                      <p className="text-xs italic pt-2.5 border-t border-hairline text-ink-muted">
                      * El nivel de profundidad se ajusta automáticamente según la edad y grado escolar de tus alumnos.
                      </p>
                    </div>
                  </div>
                )}

                {activePlaygroundTab === 'exercises' && (
                  <div className="space-y-4">
                    <h4 className="font-bold text-lg flex items-center gap-2 tracking-tight text-ink">
                      <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                      Ejercicios de Práctica
                    </h4>
                    <div className="space-y-3">
                      {activeCourse.details.exercises.map((ex, i) => (
                        <div key={i} className="p-4 rounded-2xl space-y-2 bg-canvas border border-hairline">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full select-none text-emerald-600 bg-emerald-100">Problema #{i + 1}</span>
                            <span className="text-[9px] text-ink-muted">Nivel sugerido: Medio</span>
                          </div>
                          <p className="text-sm leading-relaxed font-medium text-ink">{ex}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activePlaygroundTab === 'slides' && (
                  <div className="space-y-4">
                    <h4 className="font-bold text-lg flex items-center gap-2 tracking-tight text-ink">
                      <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                      Guion para tu Presentación
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {activeCourse.details.slides.map((slide, i) => (
                        <div key={i} className="aspect-[4/3] rounded-2xl p-4 flex flex-col justify-between transition-all duration-200 bg-canvas border border-hairline">
                          <span className="text-[9px] font-bold select-none text-ink-muted">DIAPOSITIVA {i + 1}</span>
                          <p className="text-xs font-semibold leading-snug text-center py-2 text-ink">{slide}</p>
                          <div className="h-1.5 w-full rounded-full overflow-hidden bg-blue-100">
                            <div className="h-full rounded-full w-[40%] bg-blue-600"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* CTA inside Sandbox */}
              <div className="p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-hairline bg-canvas">
                <span className="text-sm text-center sm:text-left text-ink-muted">Explora todo el potencial de la plataforma creando tu cuenta gratuita para generar materiales de tus propias asignaturas.</span>
                <Button variant="primary" onClick={() => navigate('/dashboard')} className="px-5 py-2.5 text-xs font-bold !rounded-xl shrink-0">
                  Comenzar a Crear
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Feature Grid Section — illustrative super-rounded cards */}
      <section id="features" className="relative w-full py-32 overflow-hidden bg-surface-1">
        <div className={GLOW_MINT_TOP} />
        <Container size="6xl">
          <div className="text-center max-w-xl mx-auto mb-20 space-y-4">
            <span className={KICKER}>Beneficios</span>
            <h2 className={SECTION_HEADING}>Optimización de tu tiempo docente</h2>
            <p className={`${SECTION_LEAD} max-w-lg mx-auto`}>
              Automatizamos la redacción y estructuración de los contenidos para que puedas concentrar tu energía en la enseñanza y el desarrollo de tus estudiantes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
            {FEATURES.map((f, i) => (
              <div key={i} className={`flex flex-col gap-6 p-10 sm:p-12 rounded-[80px] transition-all duration-300 hover:-translate-y-1.5 shadow-soft hover:shadow-illustrative ${f.bg}`}>
                <span className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 bg-surface-1 shadow-soft">
                  <svg className={`w-7 h-7 ${f.accent}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={f.icon} /></svg>
                </span>
                <div className="flex flex-col gap-3">
                  <h3 className="font-bold text-2xl tracking-tight text-ink">{f.title}</h3>
                  <p className="text-[15px] leading-relaxed text-ink-muted">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Impact Stats Section */}
      <section id="impact" className="relative w-full py-24 overflow-hidden bg-surface-1">
        <div className={GLOW_BLUE_TOP} />
        <Container size="6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto text-center">
            {IMPACT_STATS.map((s, i) => (
              <div key={i} className="p-8 rounded-[40px] space-y-2 bg-canvas shadow-soft">
                <span className={`block text-6xl font-bold leading-none tracking-tight ${s.c}`}>{s.n}</span>
                <p className="text-sm font-bold pt-2 text-ink">{s.t}</p>
                <p className="text-xs max-w-[220px] mx-auto leading-relaxed text-ink-muted">{s.d}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Tech Stack & Integrations — auto-scrolling, pauses on hover */}
      <section id="tech" className="relative w-full py-24 overflow-hidden bg-surface-1">
        <div className={GLOW_MINT_TOP} />
        <Container size="6xl">
          <div className="text-center max-w-xl mx-auto mb-16 space-y-4">
            <span className={`${KICKER} block`}>Flujo de trabajo integrado</span>
            <h2 className={SECTION_HEADING}>Exportación a formatos estándar</h2>
            <p className={`${SECTION_LEAD} max-w-lg mx-auto`}>
              Descarga tus planificaciones en los formatos ofimáticos más utilizados. Integración fluida con las herramientas que ya utilizas en tu labor diaria.
            </p>
          </div>
        </Container>

        <div className="relative w-full [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
          <div className="flex items-center gap-4 w-max pr-4 animate-marquee hover:[animation-play-state:paused]">
            {[...EXPORT_TOOLS, ...EXPORT_TOOLS].map(({ Icon, label, color }, i) => (
              <div key={i}
                className="flex items-center gap-3 pl-3.5 pr-6 py-3.5 rounded-full shrink-0 transition-all duration-300 hover:-translate-y-0.5 bg-canvas border border-hairline shadow-soft">
                <span className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 bg-surface-1 shadow-soft">
                  <Icon size={17} color={color} />
                </span>
                <span className="text-sm font-semibold whitespace-nowrap text-ink">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="relative w-full py-32 overflow-hidden bg-canvas">
        <div className={GLOW_BLUE_TOP} />
        <div className={GLOW_MINT_BOTTOM} />
        <Container size="6xl">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
            <span className={KICKER}>Planes y Opciones</span>
            <h2 className={SECTION_HEADING}>Selecciona la opción adecuada</h2>
            <p className={`${SECTION_LEAD} max-w-md mx-auto`}>
              Comienza con la versión gratuita para evaluar la plataforma, o adquiere la versión Pro para planificar tus periodos escolares sin limitaciones.
            </p>
          </div>

          {/* Toggle Switch */}
          <div className="flex justify-center mb-16">
            <div className="p-1.5 rounded-full inline-flex items-center relative select-none bg-surface-1 border border-hairline shadow-soft">
              <motion.div
                className="absolute top-1.5 bottom-1.5 left-1.5 w-[calc(50%-6px)] rounded-full bg-canvas border border-hairline"
                animate={{ x: isAnnual ? '100%' : '0%' }}
                transition={{ type: 'spring', stiffness: 400, damping: 32 }}
              />
              <button onClick={() => setIsAnnual(false)} className={`relative z-10 px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 cursor-pointer ${!isAnnual ? 'text-ink' : 'text-ink-muted'}`}>Mensual</button>
              <button onClick={() => setIsAnnual(true)} className={`relative z-10 px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 flex items-center gap-2 cursor-pointer ${isAnnual ? 'text-ink' : 'text-ink-muted'}`}>
                Anual
                <span className="text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider font-extrabold bg-emerald-100 text-emerald-600">Ahorra 20%</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
            {/* Free Plan */}
            <div className="h-full flex flex-col justify-between rounded-[32px] p-10 transition-all duration-300 bg-surface-1 border border-hairline shadow-soft">
              <div className="flex-1 flex flex-col gap-8">
                <div>
                  <h3 className="text-2xl font-bold mb-2 tracking-tight text-ink">Básico (Gratis)</h3>
                  <p className="text-sm leading-relaxed text-ink-muted">Perfecto para familiarizarse con la plataforma y estructurar las primeras unidades de estudio.</p>
                </div>
                <div className="flex items-baseline gap-1.5 pb-6 border-b border-hairline">
                  <span className="text-5xl font-bold tracking-tight text-ink">$0</span>
                  <span className="text-sm font-medium text-ink-muted">/mes</span>
                </div>
                <ul className="flex-1 flex flex-col gap-4 text-sm text-ink">
                  {[['Hasta 3 temarios al mes', true], ['Generación de Teoría básica', true], ['Máximo 5 ejercicios por tema', true], ['Generador de Diapositivas', false], ['Exportación Premium (PDF, PPTX)', false]].map(([txt, ok], i) => (
                    <li key={i} className={`flex items-center gap-3 ${ok ? '' : 'opacity-40'}`}>
                      <svg className={`w-5 h-5 shrink-0 ${ok ? 'text-emerald-600' : 'text-ink-tertiary'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={ok ? 'M5 13l4 4L19 7' : 'M6 18L18 6M6 6l12 12'} /></svg>
                      <span className={ok ? '' : 'line-through'}>{txt}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-8">
                <Button variant="secondary" className="w-full py-3.5 text-sm font-bold !rounded-xl !border-[1.5px] !border-ink" onClick={() => navigate('/login')}>
                  Comenzar Gratis
                </Button>
              </div>
            </div>

            {/* Pro Plan */}
            <div className="h-full relative flex flex-col justify-between rounded-[32px] p-10 overflow-hidden bg-[#0F172A] shadow-hi">
              <div className="absolute top-6 right-8">
                <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-emerald-500 text-white">Recomendado</span>
              </div>
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 to-emerald-500" />
              <div className="relative z-10 flex-1 flex flex-col gap-8">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-2xl font-bold text-white">Katedra Pro</h3>
                    <svg className="w-5 h-5 fill-emerald-500" viewBox="0 0 20 20"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" /></svg>
                  </div>
                  <p className="text-sm leading-relaxed text-white/65">Para docentes e instituciones que requieren agilizar la creación continua de material didáctico.</p>
                </div>
                <div className="flex items-end gap-1.5 pb-6 border-b border-white/15">
                  <span className="text-5xl font-bold tracking-tight text-white">${isAnnual ? '12' : '15'}</span>
                  <span className="text-sm font-medium pb-1 text-white/65">/mes</span>
                  {isAnnual && (<span className="ml-3 text-[10px] font-bold px-2 py-0.5 rounded-full pb-1 mb-1 self-center text-emerald-500 bg-emerald-500/15">Facturado anual ($144)</span>)}
                </div>
                <ul className="flex-1 flex flex-col gap-4 text-sm text-white/85">
                  {['Temarios ilimitados sin restricciones', 'Teoría avanzada y profunda', 'Quizzes y ejercicios infinitos', 'Generador de Diapositivas', 'Exportación Premium (PowerPoint, PDF, Word)'].map((txt, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${i === 3 ? 'bg-emerald-500' : 'bg-white/12'}`}>
                        <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d={i === 3 ? 'M13 10V3L4 14h7v7l9-11h-7z' : 'M5 13l4 4L19 7'} /></svg>
                      </span>
                      <span>{txt}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-8">
                <Button variant="primary" className="relative z-10 w-full py-3.5 text-sm font-bold !rounded-xl !bg-white !text-[#0F172A] hover:!bg-surface-2 hover:-translate-y-0.5 transition-all duration-300" onClick={() => navigate('/login')}>
                  Mejorar a Pro
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* FAQs Section */}
      <section className="relative w-full py-32 overflow-hidden bg-surface-1">
        <div className={GLOW_BLUE_TOP} />
        <Container size="5xl">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <span className={KICKER}>
              Respuestas
            </span>
            <h2 className="font-bold text-4xl md:text-5xl tracking-tight text-ink pt-2">
              Preguntas Frecuentes
            </h2>
            <p className="text-base leading-relaxed text-ink-muted max-w-lg mx-auto">
              Resolvemos tus dudas principales para que uses Katedra con total confianza.
            </p>
          </div>

          <div className="flex flex-col gap-6 max-w-3xl mx-auto w-full">
             {FAQS.map((faq, i) => {
                const open = faqOpenIndex === i;
                return (
                  <div
                    key={i}
                    className={`rounded-[32px] overflow-hidden transition-all duration-300 border ${
                      open
                        ? 'border-blue-600 dark:border-blue-500 bg-surface-2 shadow-elevated'
                        : 'border-hairline bg-canvas hover:border-hairline-strong hover:bg-surface-2 hover:-translate-y-0.5 hover:shadow-soft'
                    }`}
                  >
                    <button
                      onClick={() => toggleFaq(i)}
                      className={`w-full text-left p-8 flex items-center justify-between transition-colors cursor-pointer select-none font-bold text-base md:text-lg ${
                        open ? 'text-blue-600 dark:text-blue-400' : 'text-ink'
                      }`}
                    >
                      <span>{faq.q}</span>
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                        open ? 'bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400' : 'bg-surface-3/50 text-ink-muted'
                      }`}>
                        <svg
                          className={`w-4 h-4 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2.5}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </span>
                    </button>
                    <div className={`grid transition-all duration-300 ease-in-out ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                      <div className="overflow-hidden">
                        <p className="px-8 pb-8 pt-6 text-sm md:text-base leading-relaxed text-ink-muted border-t border-hairline bg-surface-2">
                          {faq.a}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </Container>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}

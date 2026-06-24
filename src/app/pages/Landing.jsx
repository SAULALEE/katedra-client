import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Container from '../components/Container';
import Button from '../components/Button';
import Card from '../components/Card';
import FeatureCard from '../components/FeatureCard';
import StatusBadge from '../components/StatusBadge';

/* ------------------------------------------------------------------ *
 *  Whimsical design tokens — official palette (blues & greens)
 *  Hex values taken verbatim from whimsical.design.md
 * ------------------------------------------------------------------ */
const DISPLAY = "'Agrandir','Avenir','Montserrat','Segoe UI',sans-serif";
const BODY = "'Manrope','Helvetica Neue',Helvetica,Arial,sans-serif";
const INK = '#0F172A';        // primary
const BLUE = '#2563EB';       // primary-light
const BLUE_PALE = '#DBEAFE';  // primary-pale
const LILAC = '#F0F4F8';      // surface-lilac (surface-light)
const GREEN = '#10B981';      // accent-magenta -> emerald
const GREEN_DEEP = '#059669'; // accent-aqua
const MINT = '#D1FAE5';       // accent-blue-pale -> mint
const HAIR = 'rgba(15,23,42,0.08)';
const MUTED = 'rgba(15,23,42,0.60)';
const SHADOW_LO = '0 8px 16px -4px rgba(15,23,42,0.06)';
const SHADOW_MD = '0 16px 32px -4px rgba(15,23,42,0.08)';
const SHADOW_HI = '0 32px 64px -8px rgba(15,23,42,0.12)';

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

  // Draw stages (pathLength is animated by framer-motion)
  const coverDraw = useTransform(scrollYProgress, [0.02, 0.32], [0, 1]);
  const pagesDraw = useTransform(scrollYProgress, [0.18, 0.55], [0, 1]);
  const linesDraw = useTransform(scrollYProgress, [0.34, 0.74], [0, 1]);
  const capDraw   = useTransform(scrollYProgress, [0.60, 0.86], [0, 1]);
  const checkDraw = useTransform(scrollYProgress, [0.72, 0.92], [0, 1]);

  // Stage handoff: intro copy fades out, generated result fades in
  const introOpacity = useTransform(scrollYProgress, [0, 0.30, 0.46], [1, 1, 0]);
  const introY       = useTransform(scrollYProgress, [0, 0.46], [0, -48]);
  const resultOpacity = useTransform(scrollYProgress, [0.52, 0.74], [0, 1]);
  const resultY       = useTransform(scrollYProgress, [0.52, 0.86], [56, 0]);

  const bookScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.94, 1, 1.05]);
  const bookRotate = useTransform(scrollYProgress, [0, 1], [-3, 2]);
  const hintOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0]);

  const pageLines = [42, 70, 98, 126, 154];

  return (
    <section ref={heroRef} className="relative w-full" style={{ height: '300vh', backgroundColor: '#ffffff' }}>
      {/* soft ambient field */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: `radial-gradient(60% 50% at 50% 0%, ${LILAC} 0%, rgba(240,244,248,0) 70%)`
      }} />

      <div className="sticky top-0 h-screen w-full flex items-center overflow-hidden">
        <Container size="7xl" className="relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">

            {/* LEFT — narrative copy, stage-crossfaded */}
            <div className="lg:col-span-6 relative min-h-[340px] flex items-center">
              {/* Stage 1 — the pitch */}
              <motion.div style={{ opacity: introOpacity, y: introY }} className="absolute inset-0 flex flex-col justify-center gap-6">
                <span style={{ fontFamily: BODY, color: BLUE, letterSpacing: '1.35px' }}
                      className="text-[11px] font-bold uppercase">
                  Katedra · AI Engine v1.1
                </span>
                <h1 style={{ fontFamily: DISPLAY, color: INK, letterSpacing: '-0.03em', lineHeight: 1.02 }}
                    className="font-bold text-5xl md:text-6xl lg:text-[68px]">
                  Diseña temarios<br />a la velocidad<br />
                  <span style={{ color: BLUE }}>del pensamiento.</span>
                </h1>
                <p style={{ fontFamily: BODY, color: MUTED }} className="text-base md:text-lg leading-relaxed max-w-md">
                  Teoría rigurosa, ejercicios con clave y diapositivas de clase — generadas en segundos. Desliza para ver cómo la IA construye tu curso.
                </p>
                <div className="flex flex-col sm:flex-row items-start gap-3 pt-1">
                  <Button variant="primary" onClick={() => navigate('/dashboard')}
                    className="!bg-[#0F172A] !text-white px-7 py-3.5 text-sm font-bold !rounded-xl"
                    style={{ fontFamily: BODY, boxShadow: SHADOW_MD }}>
                    Comenzar Gratis
                  </Button>
                  <a href="#demo">
                    <Button variant="secondary"
                      className="!bg-white !text-[#0F172A] px-7 py-3.5 text-sm font-bold !rounded-xl"
                      style={{ fontFamily: BODY, border: `1px solid ${HAIR}` }}>
                      Probar Demo En Vivo
                    </Button>
                  </a>
                </div>
              </motion.div>

              {/* Stage 2 — the generated result */}
              <motion.div style={{ opacity: resultOpacity, y: resultY }} className="absolute inset-0 flex flex-col justify-center gap-5">
                <span style={{ fontFamily: BODY, color: GREEN_DEEP, letterSpacing: '1.35px' }}
                      className="text-[11px] font-bold uppercase flex items-center gap-2">
                  <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: GREEN }} />
                  Materiales listos
                </span>
                <h2 style={{ fontFamily: DISPLAY, color: INK, letterSpacing: '-0.03em', lineHeight: 1.05 }}
                    className="font-bold text-4xl md:text-5xl">
                  Tu curso completo,<br />en un solo lugar.
                </h2>
                <div className="flex flex-col gap-2.5 max-w-md">
                  {[
                    'Temario modular estructurado (4 bloques)',
                    'Resumen teórico — 1.200 palabras por bloque',
                    'Banco de 15 preguntas con clave',
                    'Esquema de diapositivas listo para PPTX'
                  ].map((t, i) => (
                    <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-2xl"
                         style={{ background: '#fff', border: `1px solid ${HAIR}`, boxShadow: SHADOW_LO }}>
                      <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ background: MINT }}>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={GREEN_DEEP} strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      </span>
                      <span style={{ fontFamily: BODY, color: INK }} className="text-sm font-medium">{t}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-1">
                  <Button variant="primary" onClick={() => navigate('/dashboard')}
                    className="!bg-[#0F172A] !text-white px-7 py-3.5 text-sm font-bold !rounded-xl"
                    style={{ fontFamily: BODY, boxShadow: SHADOW_MD }}>
                    Crear el mío →
                  </Button>
                </div>
              </motion.div>
            </div>

            {/* RIGHT — the drawing book */}
            <div className="lg:col-span-6 flex items-center justify-center">
              <motion.div style={{ scale: bookScale, rotate: bookRotate }} className="w-full max-w-[460px]">
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
          <span style={{ fontFamily: BODY, color: MUTED, letterSpacing: '1.35px' }} className="text-[10px] font-bold uppercase">Desliza</span>
          <svg width="16" height="22" viewBox="0 0 16 22" fill="none" className="animate-bounce">
            <path d="M8 2 L8 18 M3 13 L8 19 L13 13" stroke={INK} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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

  const FEATURES = [
    {
      fill: LILAC,
      title: 'Teoría Estructurada',
      desc: 'Explicaciones académicas robustas, adaptadas rigurosamente al nivel escolar y a los temas exactos de tu plan curricular oficial.',
      icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
      accent: BLUE
    },
    {
      fill: MINT,
      title: 'Ejercicios y Exámenes',
      desc: 'Cuestionarios de opción múltiple, problemas de desarrollo con rúbrica, claves de respuestas y formatos limpios listos para imprimir.',
      icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01',
      accent: GREEN_DEEP
    },
    {
      fill: BLUE_PALE,
      title: 'Diapositivas Listas',
      desc: 'Esquemas lógicos detallados diapositiva por diapositiva, listos para usar de inmediato en PowerPoint, Keynote o Canva.',
      icon: 'M7 12l3-3 3 3 4-4M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z',
      accent: BLUE
    }
  ];

  return (
    <div className="w-full min-h-screen flex flex-col justify-between" style={{ background: '#ffffff', color: INK, fontFamily: BODY }}>
      {/* Header / Top Nav */}
      <Navbar />

      {/* Scrollytelling Hero */}
      <ScrollytellingHero navigate={navigate} />

      {/* Interactive Sandbox/Demo Section */}
      <section id="demo" className="w-full py-24" style={{ background: LILAC }}>
        <Container size="6xl">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-4">
            <span style={{ fontFamily: BODY, color: BLUE, letterSpacing: '1.35px' }} className="text-[11px] font-bold uppercase">Probador en vivo</span>
            <h2 style={{ fontFamily: DISPLAY, color: INK, letterSpacing: '-0.02em' }} className="font-bold text-4xl md:text-5xl">
              Experimenta el motor de Katedra
            </h2>
            <p style={{ fontFamily: BODY, color: MUTED }} className="text-base leading-relaxed max-w-xl mx-auto">
              Selecciona una materia y mira el temario, la teoría y las diapositivas que la IA genera al instante.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto items-stretch">
            {/* Sandbox Sidebar Course Selector */}
            <div className="lg:col-span-4 flex flex-col gap-3">
              <span style={{ fontFamily: BODY, color: MUTED, letterSpacing: '1.35px' }} className="text-[10px] font-bold uppercase ml-1 select-none">Selecciona una materia</span>
              {PLAYGROUND_COURSES.map((course, idx) => (
                <button
                  key={idx}
                  onClick={() => { if (!isGenerating) setSelectedCourseIndex(idx); }}
                  className="w-full text-left p-4 rounded-2xl transition-all duration-300 cursor-pointer flex flex-col gap-1.5"
                  style={{
                    background: '#fff',
                    border: `1.5px solid ${selectedCourseIndex === idx ? BLUE : HAIR}`,
                    boxShadow: selectedCourseIndex === idx ? SHADOW_MD : 'none'
                  }}
                >
                  <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full self-start"
                    style={{ fontFamily: BODY, background: selectedCourseIndex === idx ? BLUE_PALE : LILAC, color: selectedCourseIndex === idx ? BLUE : MUTED }}>
                    {course.level}
                  </span>
                  <span style={{ fontFamily: BODY, color: INK }} className="font-semibold text-sm leading-snug">{course.name}</span>
                </button>
              ))}
            </div>

            {/* Sandbox Content Viewer */}
            <div className="lg:col-span-8 flex flex-col overflow-hidden min-h-[360px] relative rounded-[28px]"
                 style={{ background: '#fff', border: `1px solid ${HAIR}`, boxShadow: SHADOW_HI }}>
              {/* Toolbar Tabs */}
              <div className="px-4 flex flex-wrap items-center justify-between gap-2" style={{ borderBottom: `1px solid ${HAIR}`, background: '#fff' }}>
                <div className="flex overflow-x-auto gap-1 py-2.5 scrollbar-none">
                  {[
                    { id: 'modules', label: '1. Módulos' },
                    { id: 'theory', label: '2. Teoría' },
                    { id: 'exercises', label: '3. Ejercicios' },
                    { id: 'slides', label: '4. Diapositivas' }
                  ].map((tab) => (
                    <button key={tab.id} onClick={() => setActivePlaygroundTab(tab.id)}
                      className="px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors cursor-pointer"
                      style={{
                        fontFamily: BODY,
                        background: activePlaygroundTab === tab.id ? BLUE_PALE : 'transparent',
                        color: activePlaygroundTab === tab.id ? BLUE : MUTED
                      }}>
                      {tab.label}
                    </button>
                  ))}
                </div>
                <div className="py-2 text-[10px] flex items-center gap-1.5 font-bold select-none" style={{ fontFamily: BODY, color: GREEN_DEEP }}>
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: GREEN }}></span>
                  <span>ENGINE: ACTIVE</span>
                </div>
              </div>

              {/* Sandbox Screen Canvas */}
              <div className="p-6 flex-1 flex flex-col justify-start relative">
                {isGenerating ? (
                  <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4" style={{ background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(4px)' }}>
                    <div className="relative w-12 h-12 flex items-center justify-center">
                      <div className="absolute w-full h-full rounded-full" style={{ border: `4px solid ${HAIR}` }}></div>
                      <div className="absolute w-full h-full rounded-full animate-spin" style={{ border: '4px solid transparent', borderTopColor: BLUE }}></div>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <span style={{ fontFamily: BODY, color: BLUE }} className="text-xs font-bold animate-pulse">GENERANDO CONTENIDOS...</span>
                      <span style={{ fontFamily: BODY, color: MUTED }} className="text-[10px]">Rediseñando plan curricular con IA</span>
                    </div>
                  </div>
                ) : null}

                {activePlaygroundTab === 'modules' && (
                  <div className="space-y-4">
                    <h4 style={{ fontFamily: DISPLAY, color: INK, letterSpacing: '-0.01em' }} className="font-bold text-lg flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke={BLUE}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
                      Estructura Curricular Generada
                    </h4>
                    <div className="space-y-2.5">
                      {activeCourse.modules.map((mod, i) => (
                        <div key={i} className="flex items-center gap-3 p-3.5 rounded-2xl transition-all duration-200" style={{ background: LILAC, border: `1px solid ${HAIR}` }}>
                          <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 select-none" style={{ fontFamily: BODY, background: BLUE_PALE, color: BLUE }}>{i + 1}</span>
                          <span style={{ fontFamily: BODY, color: INK }} className="text-sm font-medium">{mod}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activePlaygroundTab === 'theory' && (
                  <div className="space-y-4">
                    <h4 style={{ fontFamily: DISPLAY, color: INK, letterSpacing: '-0.01em' }} className="font-bold text-lg flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke={BLUE}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                      Explicación Teórica Sugerida
                    </h4>
                    <div className="p-5 rounded-2xl space-y-3" style={{ background: LILAC, border: `1px solid ${HAIR}` }}>
                      <span style={{ fontFamily: BODY, color: BLUE, letterSpacing: '1.35px' }} className="text-[10px] font-bold uppercase block select-none">Bloque de Fundamentos</span>
                      <p style={{ fontFamily: BODY, color: MUTED }} className="text-sm leading-relaxed">{activeCourse.details.theory}</p>
                      <p className="text-xs italic pt-2.5" style={{ borderTop: `1px solid ${HAIR}`, fontFamily: BODY, color: MUTED }}>
                        * La teoría se adapta automáticamente al nivel seleccionado (Bachillerato, Licenciatura, Posgrado).
                      </p>
                    </div>
                  </div>
                )}

                {activePlaygroundTab === 'exercises' && (
                  <div className="space-y-4">
                    <h4 style={{ fontFamily: DISPLAY, color: INK, letterSpacing: '-0.01em' }} className="font-bold text-lg flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke={BLUE}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                      Banco de Ejercicios Académicos
                    </h4>
                    <div className="space-y-3">
                      {activeCourse.details.exercises.map((ex, i) => (
                        <div key={i} className="p-4 rounded-2xl space-y-2" style={{ background: LILAC, border: `1px solid ${HAIR}` }}>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full select-none" style={{ fontFamily: BODY, color: GREEN_DEEP, background: MINT }}>Problema #{i + 1}</span>
                            <span style={{ fontFamily: BODY, color: MUTED }} className="text-[9px]">Nivel sugerido: Medio</span>
                          </div>
                          <p style={{ fontFamily: BODY, color: INK }} className="text-sm leading-relaxed font-medium">{ex}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activePlaygroundTab === 'slides' && (
                  <div className="space-y-4">
                    <h4 style={{ fontFamily: DISPLAY, color: INK, letterSpacing: '-0.01em' }} className="font-bold text-lg flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke={BLUE}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                      Estructura de Diapositivas
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {activeCourse.details.slides.map((slide, i) => (
                        <div key={i} className="aspect-[4/3] rounded-2xl p-4 flex flex-col justify-between transition-all duration-200" style={{ background: LILAC, border: `1px solid ${HAIR}` }}>
                          <span style={{ fontFamily: BODY, color: MUTED }} className="text-[9px] font-bold select-none">DIAPOSITIVA {i + 1}</span>
                          <p style={{ fontFamily: BODY, color: INK }} className="text-xs font-semibold leading-snug text-center py-2">{slide}</p>
                          <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ background: BLUE_PALE }}>
                            <div className="h-full rounded-full" style={{ width: '40%', background: BLUE }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* CTA inside Sandbox */}
              <div className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderTop: `1px solid ${HAIR}`, background: LILAC }}>
                <span style={{ fontFamily: BODY, color: MUTED }} className="text-xs text-center sm:text-left">¿Te gusta la estructura? Descarga este material creando tu cuenta.</span>
                <Button variant="primary" onClick={() => navigate('/dashboard')} className="!bg-[#0F172A] !text-white px-5 py-2.5 text-xs font-bold !rounded-xl shrink-0" style={{ fontFamily: BODY }}>
                  Generar Mi Propia Materia
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Feature Grid Section — illustrative super-rounded cards */}
      <section id="features" className="w-full py-28" style={{ background: '#fff' }}>
        <Container size="6xl">
          <div className="text-center max-w-xl mx-auto mb-20 space-y-4">
            <span style={{ fontFamily: BODY, color: BLUE, letterSpacing: '1.35px' }} className="text-[11px] font-bold uppercase">Características</span>
            <h2 style={{ fontFamily: DISPLAY, color: INK, letterSpacing: '-0.02em' }} className="font-bold text-4xl md:text-5xl">
              Todo lo que necesitas, en segundos.
            </h2>
            <p style={{ fontFamily: BODY, color: MUTED }} className="text-base leading-relaxed max-w-lg mx-auto">
              Katedra automatiza la planeación y la creación de materiales didácticos para que dediques más tiempo a tus alumnos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
            {FEATURES.map((f, i) => (
              <div key={i} className="flex flex-col gap-5 p-10 rounded-[80px] transition-transform duration-300 hover:-translate-y-1.5"
                   style={{ background: f.fill, boxShadow: SHADOW_LO }}>
                <span className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: '#fff', boxShadow: SHADOW_LO }}>
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke={f.accent}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={f.icon} /></svg>
                </span>
                <h3 style={{ fontFamily: DISPLAY, color: INK, letterSpacing: '-0.01em' }} className="font-bold text-2xl">{f.title}</h3>
                <p style={{ fontFamily: BODY, color: MUTED }} className="text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Impact Stats Section */}
      <section id="impact" className="w-full py-24" style={{ background: LILAC }}>
        <Container size="6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto text-center">
            {[
              { n: '40%', t: 'Ahorro de Tiempo Promedio', d: 'Menos horas dedicadas a tareas administrativas de redacción.', c: BLUE },
              { n: '+10k', t: 'Temarios y Clases Creados', d: 'Utilizado por profesores en colegios y universidades prestigiosas.', c: GREEN_DEEP },
              { n: '98%', t: 'Índice de Satisfacción', d: 'Los docentes destacan la rigurosidad conceptual y la rapidez de la IA.', c: BLUE }
            ].map((s, i) => (
              <div key={i} className="p-8 rounded-[40px] space-y-2" style={{ background: '#fff', boxShadow: SHADOW_LO }}>
                <span style={{ fontFamily: DISPLAY, color: s.c, letterSpacing: '-0.03em' }} className="block text-6xl font-bold leading-none">{s.n}</span>
                <p style={{ fontFamily: BODY, color: INK }} className="text-sm font-bold pt-2">{s.t}</p>
                <p style={{ fontFamily: BODY, color: MUTED }} className="text-xs max-w-[220px] mx-auto leading-relaxed">{s.d}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Tech Stack & Integrations */}
      <section id="tech" className="w-full py-24" style={{ background: '#fff' }}>
        <Container size="6xl">
          <div className="text-center max-w-xl mx-auto mb-12 space-y-3">
            <span style={{ fontFamily: BODY, color: BLUE, letterSpacing: '1.35px' }} className="text-[11px] font-bold uppercase block">Compatibilidad</span>
            <h3 style={{ fontFamily: DISPLAY, color: INK, letterSpacing: '-0.02em' }} className="font-bold text-3xl md:text-4xl">
              Exportación sin fricción
            </h3>
            <p style={{ fontFamily: BODY, color: MUTED }} className="text-sm leading-relaxed max-w-md mx-auto">
              Todo el contenido generado se integra directamente con tus herramientas escolares diarias.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 max-w-4xl mx-auto">
            {['Microsoft PowerPoint', 'Adobe PDF Reader', 'Google Classroom', 'Canvas LMS', 'Moodle Académico', 'Markdown Académico'].map((tech, i) => (
              <span key={i} className="px-5 py-2.5 rounded-full text-sm font-semibold select-none transition-all duration-300 hover:-translate-y-0.5"
                style={{ fontFamily: BODY, background: LILAC, color: INK, border: `1px solid ${HAIR}` }}>
                {tech}
              </span>
            ))}
          </div>
        </Container>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="w-full py-28" style={{ background: LILAC }}>
        <Container size="6xl">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
            <span style={{ fontFamily: BODY, color: BLUE, letterSpacing: '1.35px' }} className="text-[11px] font-bold uppercase">Planes y tarifas</span>
            <h2 style={{ fontFamily: DISPLAY, color: INK, letterSpacing: '-0.02em' }} className="font-bold text-4xl md:text-5xl">
              Planes para tu carga académica
            </h2>
            <p style={{ fontFamily: BODY, color: MUTED }} className="text-base leading-relaxed max-w-md mx-auto">
              Comienza gratis o suscríbete a Pro para desbloquear todo el potencial de Katedra sin límites.
            </p>
          </div>

          {/* Toggle Switch */}
          <div className="flex justify-center mb-16">
            <div className="p-1.5 rounded-full inline-flex items-center relative select-none" style={{ background: '#fff', border: `1px solid ${HAIR}`, boxShadow: SHADOW_LO }}>
              <button onClick={() => setIsAnnual(false)} className="relative z-10 px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 cursor-pointer"
                style={{ fontFamily: BODY, color: !isAnnual ? INK : MUTED }}>Mensual</button>
              <button onClick={() => setIsAnnual(true)} className="relative z-10 px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 flex items-center gap-2 cursor-pointer"
                style={{ fontFamily: BODY, color: isAnnual ? INK : MUTED }}>
                Anual
                <span className="text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider font-extrabold" style={{ background: MINT, color: GREEN_DEEP }}>Ahorra 20%</span>
              </button>
              <div className="absolute top-1.5 bottom-1.5 rounded-full transition-transform duration-300 ease-in-out"
                style={{ background: LILAC, border: `1px solid ${HAIR}`, left: '6px', width: 'calc(50% - 6px)', transform: isAnnual ? 'translateX(100%)' : 'translateX(0)' }} />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
            {/* Free Plan */}
            <div className="h-full flex flex-col justify-between rounded-[32px] p-10 transition-all duration-300" style={{ background: '#fff', border: `1px solid ${HAIR}`, boxShadow: SHADOW_LO }}>
              <div className="flex-1 flex flex-col gap-8">
                <div>
                  <h3 style={{ fontFamily: DISPLAY, color: INK }} className="text-2xl font-bold mb-2">Básico (Gratis)</h3>
                  <p style={{ fontFamily: BODY, color: MUTED }} className="text-sm leading-relaxed">Perfecto para conocer la plataforma y estructurar tus primeros temarios.</p>
                </div>
                <div className="flex items-baseline gap-1.5 pb-6" style={{ borderBottom: `1px solid ${HAIR}` }}>
                  <span style={{ fontFamily: DISPLAY, color: INK, letterSpacing: '-0.03em' }} className="text-5xl font-bold">$0</span>
                  <span style={{ fontFamily: BODY, color: MUTED }} className="text-sm font-medium">/mes</span>
                </div>
                <ul className="flex-1 flex flex-col gap-4 text-sm" style={{ fontFamily: BODY, color: INK }}>
                  {[['Hasta 3 temarios al mes', true], ['Generación de Teoría básica', true], ['Máximo 5 ejercicios por tema', true], ['Generador de Diapositivas', false], ['Exportación Premium (PDF, PPTX)', false]].map(([txt, ok], i) => (
                    <li key={i} className="flex items-center gap-3" style={{ opacity: ok ? 1 : 0.4 }}>
                      <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke={ok ? GREEN_DEEP : '#94A3B8'}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={ok ? 'M5 13l4 4L19 7' : 'M6 18L18 6M6 6l12 12'} /></svg>
                      <span style={{ textDecoration: ok ? 'none' : 'line-through' }}>{txt}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-8">
                <Button variant="secondary" className="w-full py-3.5 text-sm font-bold !rounded-xl !bg-white !text-[#0F172A]" style={{ fontFamily: BODY, border: `1.5px solid ${INK}` }} onClick={() => navigate('/login')}>
                  Comenzar Gratis
                </Button>
              </div>
            </div>

            {/* Pro Plan */}
            <div className="h-full relative flex flex-col justify-between rounded-[32px] p-10 overflow-hidden" style={{ background: INK, boxShadow: SHADOW_HI }}>
              <div className="absolute top-6 right-8">
                <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full" style={{ fontFamily: BODY, background: GREEN, color: '#fff' }}>Recomendado</span>
              </div>
              <div className="absolute top-0 left-0 right-0 h-1.5" style={{ background: `linear-gradient(90deg, ${BLUE}, ${GREEN})` }} />
              <div className="relative z-10 flex-1 flex flex-col gap-8">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 style={{ fontFamily: DISPLAY, color: '#fff' }} className="text-2xl font-bold">Katedra Pro</h3>
                    <svg className="w-5 h-5" fill={GREEN} viewBox="0 0 20 20"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" /></svg>
                  </div>
                  <p style={{ fontFamily: BODY, color: 'rgba(255,255,255,0.65)' }} className="text-sm leading-relaxed">Para profesores exigentes que buscan automatización total y cero límites.</p>
                </div>
                <div className="flex items-end gap-1.5 pb-6" style={{ borderBottom: '1px solid rgba(255,255,255,0.15)' }}>
                  <span style={{ fontFamily: DISPLAY, color: '#fff', letterSpacing: '-0.03em' }} className="text-5xl font-bold">${isAnnual ? '12' : '15'}</span>
                  <span style={{ fontFamily: BODY, color: 'rgba(255,255,255,0.65)' }} className="text-sm font-medium pb-1">/mes</span>
                  {isAnnual && (<span className="ml-3 text-[10px] font-bold px-2 py-0.5 rounded-full pb-1 mb-1 self-center" style={{ fontFamily: BODY, color: GREEN, background: 'rgba(16,185,129,0.15)' }}>Facturado anual ($144)</span>)}
                </div>
                <ul className="flex-1 flex flex-col gap-4 text-sm" style={{ fontFamily: BODY, color: 'rgba(255,255,255,0.85)' }}>
                  {['Temarios ilimitados sin restricciones', 'Teoría avanzada y profunda', 'Quizzes y ejercicios infinitos', 'Generador de Diapositivas', 'Exportación Premium (PowerPoint, PDF, Word)'].map((txt, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ background: i === 3 ? GREEN : 'rgba(255,255,255,0.12)' }}>
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="#fff"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d={i === 3 ? 'M13 10V3L4 14h7v7l9-11h-7z' : 'M5 13l4 4L19 7'} /></svg>
                      </span>
                      <span>{txt}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-8">
                <Button variant="primary" className="relative z-10 w-full py-3.5 text-sm font-bold !rounded-xl !bg-white !text-[#0F172A] hover:-translate-y-0.5 transition-all duration-300" style={{ fontFamily: BODY, boxShadow: SHADOW_MD }} onClick={() => navigate('/login')}>
                  Mejorar a Pro
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* FAQs Section */}
      <section className="w-full py-24" style={{ background: '#fff' }}>
        <Container size="5xl">
          <div className="text-center max-w-xl mx-auto mb-14 space-y-4">
            <span style={{ fontFamily: BODY, color: BLUE, letterSpacing: '1.35px' }} className="text-[11px] font-bold uppercase block">Respuestas</span>
            <h3 style={{ fontFamily: DISPLAY, color: INK, letterSpacing: '-0.02em' }} className="font-bold text-4xl">Preguntas Frecuentes</h3>
            <p style={{ fontFamily: BODY, color: MUTED }} className="text-sm leading-relaxed max-w-md mx-auto">Todo lo que necesitas saber sobre el funcionamiento de Katedra.</p>
          </div>

          <div className="space-y-4 max-w-3xl mx-auto">
            {[
              { q: '¿Cómo exporto mis temarios y diapositivas?', a: 'Una vez generado tu contenido, verás botones de exportación directa a PDF para temarios y teoría, y archivos estructurados para PowerPoint (PPTX) o procesadores de texto.' },
              { q: '¿Es el contenido adaptado al nivel de mis estudiantes?', a: 'Sí. El motor te permite elegir el nivel escolar (Secundaria, Bachillerato, Universidad, Posgrado) y el enfoque metodológico para asegurar la rigurosidad correcta.' },
              { q: '¿Cómo funciona la garantía de calidad académica?', a: 'Katedra usa algoritmos especializados entrenados bajo currículas estructuradas, evitando alucinaciones y asegurando secuencias didácticas lógicas.' },
              { q: '¿Puedo cancelar mi suscripción Pro en cualquier momento?', a: 'Absolutamente. Puedes cancelar el plan mensual o anual directamente desde el menú de tu cuenta sin plazos forzosos ni penalizaciones.' }
            ].map((faq, i) => (
              <div key={i} className="rounded-2xl overflow-hidden transition-all duration-300" style={{ background: '#fff', border: `1px solid ${HAIR}` }}>
                <button onClick={() => toggleFaq(i)} className="w-full text-left p-5 flex items-center justify-between transition-colors cursor-pointer select-none font-bold text-base"
                  style={{ fontFamily: BODY, color: faqOpenIndex === i ? BLUE : INK }}>
                  <span>{faq.q}</span>
                  <svg className="w-4 h-4 transform transition-transform duration-300" style={{ transform: faqOpenIndex === i ? 'rotate(180deg)' : 'none' }} fill="none" viewBox="0 0 24 24" stroke={faqOpenIndex === i ? BLUE : MUTED}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="transition-all duration-300 ease-in-out overflow-hidden" style={{ maxHeight: faqOpenIndex === i ? '200px' : '0', background: faqOpenIndex === i ? LILAC : 'transparent' }}>
                  <p style={{ fontFamily: BODY, color: MUTED }} className="p-5 text-sm leading-relaxed">{faq.a}</p>
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

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// Animated Counter component that starts when it enters the viewport
function AnimatedCounter({ target, prefix = '', suffix = '' }) {
  const [value, setValue] = useState(0);
  const elementRef = useRef(null);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setHasStarted(true);
        }
      },
      { threshold: 0.1 }
    );
    if (elementRef.current) {
      observer.observe(elementRef.current);
    }
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!hasStarted) return;
    let start = null;
    const duration = 1500;

    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * ease));
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);
  }, [hasStarted, target]);

  return (
    <span ref={elementRef}>
      {prefix}
      {value.toLocaleString()}
      {suffix}
    </span>
  );
}

export default function Landing() {
  const navigate = useNavigate();
  const [selectedSubject, setSelectedSubject] = useState(0);
  const [selectedTab, setSelectedTab] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [billing, setBilling] = useState('monthly');
  const [openFaq, setOpenFaq] = useState(0);

  // Simulated content generation when subject or tab changes
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1150);
    return () => clearTimeout(timer);
  }, [selectedSubject, selectedTab]);

  const handleSelectSubject = (idx) => {
    setSelectedSubject(idx);
    setSelectedTab(0);
  };

  const handleSelectTab = (idx) => {
    setSelectedTab(idx);
  };

  const SUBJECTS = [
    {
      name: 'Biología',
      icon: '🧬',
      topic: 'Biología Celular',
      accent: '#10B981',
      modules: [
        { title: 'Estructura Celular y Organelos', desc: 'Membranas, citoesqueleto y el sistema de endomembranas.', weeks: 'Sem 1–2' },
        { title: 'Respiración Celular', desc: 'Glucólisis, el ciclo de Krebs y la fosforilación oxidativa.', weeks: 'Sem 3–4' },
        { title: 'Fotosíntesis', desc: 'Reacciones lumínicas, el ciclo de Calvin y captura de energía.', weeks: 'Sem 5' },
        { title: 'División Celular y el Ciclo', desc: 'Mitosis, meiosis y regulación de puntos de control.', weeks: 'Sem 6–7' }
      ],
      theoryTitle: 'Respiración Mitocondrial',
      theory: [
        'La mitocondria es el sitio principal de síntesis de ATP en las células eucariotas. El piruvato generado por la glucólisis se importa a la matriz, donde se descarboxila y se introduce en el ciclo del ácido cítrico.',
        'Cada vuelta del ciclo libera transportadores de electrones — NADH y FADH₂ — que donan electrones a la cadena respiratoria incrustada en la membrana interna, estableciendo un gradiente de protones.',
        'La ATP sintasa aprovecha la fuerza protón-motriz para fosforilar el ADP, produciendo aproximadamente 30–32 ATP por molécula de glucosa bajo condiciones aeróbicas.'
      ],
      theoryCitation: 'Citado automáticamente · Alberts, Biología Molecular de la Célula, 6.ª ed.',
      exerciseTitle: 'Respiración · Opción Múltiple',
      exercises: [
        { question: '¿En qué compartimento tiene lugar el ciclo del ácido cítrico?', options: ['Citoplasma', 'Matriz mitocondrial', 'Núcleo', 'Membrana interna'], answer: 1 },
        { question: '¿Qué alimenta directamente a la ATP sintasa?', options: ['Gradiente de protones', 'NADPH', 'Fosforilación a nivel de sustrato', 'Entrada de calcio'], answer: 0 }
      ],
      slidesTitle: 'Respiración Celular — Diapositivas',
      slides: ['Por qué las células necesitan ATP', 'Glucólisis de un vistazo', 'El ciclo de Krebs', 'Cadena de transporte de electrones']
    },
    {
      name: 'Historia',
      icon: '🏛️',
      topic: 'La Guerra Fría',
      accent: '#475569', // Slate Blue Accent
      modules: [
        { title: 'Orígenes, 1945–1947', desc: 'Yalta, Potsdam y la ruptura de la alianza de guerra.', weeks: 'Sem 1–2' },
        { title: 'Contención y Crisis', desc: 'El bloqueo de Berlín, Corea y la crisis de los misiles en Cuba.', weeks: 'Sem 3–5' },
        { title: 'Détente y Guerras Proxy', desc: 'Vietnam, control de armas y los Acuerdos de Helsinki.', weeks: 'Sem 6–7' },
        { title: 'Colapso, 1985–1991', desc: 'Glasnost, perestroika y la caída del Muro.', weeks: 'Sem 8' }
      ],
      theoryTitle: 'La Doctrina de la Contención',
      theory: [
        'Articulated by George Kennan en su artículo "X" de 1947, la contención sostenía que el expansionismo soviético podía ser frenado mediante una presión firme en una serie de puntos geográficos y políticos.',
        'La doctrina dio forma a la Doctrina Truman y al Plan Marshall, comprometiendo a los Estados Unidos con la reconstrucción económica y militar de Europa Occidental.',
        'Los críticos argumentaron que la contención era reactiva y costosa, arrastrando a las superpotencias a conflictos indirectos en Asia, África y América Latina.'
      ],
      theoryCitation: 'Citado automáticamente · Gaddis, La Guerra Fría',
      exercises: [
        { question: '¿Quién escribió el artículo "X" de 1947 sobre la contención?', options: ['Dean Acheson', 'George Kennan', 'Harry Truman', 'John Foster Dulles'], answer: 1 },
        { question: '¿Qué programa reconstruyó económicamente Europa Occidental?', options: ['Lend-Lease', 'El Plan Marshall', 'OTAN', 'Bretton Woods'], answer: 1 }
      ],
      slidesTitle: 'La Guerra Fría — Diapositivas',
      slides: ['Un continente dividido', 'Explicación de la contención', 'Puntos de conflicto', 'Hacia 1991']
    },
    {
      name: 'Cálculo',
      icon: '📐',
      topic: 'Cálculo Integral',
      accent: '#2C5282', // Steel Blue Accent
      modules: [
        { title: 'Antiderivadas', desc: 'Integrales indefinidas y la regla de potencia inversa.', weeks: 'Sem 1' },
        { title: 'La Integral Definida', desc: 'Sumas de Riemann y el Teorema Fundamental.', weeks: 'Sem 2–3' },
        { title: 'Técnicas de Integración', desc: 'Sustitución, partes y fracciones parciales.', weeks: 'Sem 4–5' },
        { title: 'Aplicaciones', desc: 'Área, volumen de revolución y longitud de arco.', weeks: 'Sem 6–7' }
      ],
      theoryTitle: 'El Teorema Fundamental del Cálculo',
      theory: [
        'El Teorema Fundamental conecta la diferenciación y la integración: si F es una antiderivada de una función continua f, entonces la integral definida de f de a a b es igual a F(b) − F(a).',
        'Este resultado transforma el problema de calcular áreas bajo curvas —resuelto históricamente sumando límites— en la búsqueda de antiderivadas.',
        'Su segunda parte garantiza que la función de acumulación definida por una integral es diferenciable, con derivada igual al integrando original.'
      ],
      theoryCitation: 'Citado automáticamente · Stewart, Cálculo: Trascendentes Tempranas',
      exercises: [
        { question: '¿Cuál es la integral de 2x dx?', options: ['x² + C', '2 + C', 'x²', '2x² + C'], answer: 0 },
        { question: 'El TFC conecta la integración con qué operación?', options: ['Multiplicación', 'Diferenciación', 'Factorización', 'Límites'], answer: 1 }
      ],
      slidesTitle: 'Cálculo Integral — Diapositivas',
      slides: ['El área como acumulación', 'Sumas de Riemann', 'Las dos partes del TFC', 'Ejemplos resueltos']
    },
    {
      name: 'Literatura',
      icon: '📖',
      topic: 'Poesía Modernista',
      accent: '#F59E0B',
      modules: [
        { title: 'Raíces del Modernismo', desc: 'Simbolismo, imagismo y ruptura de la forma romántica.', weeks: 'Sem 1–2' },
        { title: 'Eliot y La Tierra Baldía', desc: 'Fragmentación, alusión y el método mítico.', weeks: 'Sem 3–4' },
        { title: 'Pound e Imagismo', desc: 'Precisión, la imagen y "hacerlo nuevo".', weeks: 'Sem 5' },
        { title: 'Voces Posteriores', desc: 'Stevens, Moore y la línea americana.', weeks: 'Sem 6–7' }
      ],
      theoryTitle: 'El Método Mítico',
      theory: [
        'Los poetas modernistas respondieron a un mundo de posguerra fracturado abandonando la narrativa continua a favor de la yuxtaposición, el collage y la alusión al mito y la historia.',
        'T. S. Eliot describió este "método mítico" como una forma de dar forma y significado al caos de la experiencia contemporánea al alinearla con patrones antiguos.',
        'El resultado es una poesía que exige una lectura active: ensamblar el significado a partir de fragmentos en lugar de recibirlo de un hablante estable.'
      ],
      theoryCitation: 'Citado automáticamente · Eliot, "Ulysses, Order, and Myth" (1923)',
      exercises: [
        { question: '¿Qué poeta acuñó la frase "make it new"?', options: ['T. S. Eliot', 'Ezra Pound', 'Wallace Stevens', 'W. B. Yeats'], answer: 1 },
        { question: 'El "método mítico" da orden a la experiencia al alinearla con:', options: ['Leyes científicas', 'Mitos antiguos', 'Ideología política', 'Diarios personales'], answer: 1 }
      ],
      slidesTitle: 'Poesía Modernista — Diapositivas',
      slides: ['Un siglo fracturado', 'Imagismo y precisión', 'La Tierra Baldía', 'Leyendo los fragmentos']
    }
  ];

  const INTEGRATIONS = [
    { 
      name: 'PowerPoint', 
      dotColor: '#EA580C',
      icon: (color) => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M7 12h10M7 8h10M7 16h6" />
        </svg>
      )
    },
    { 
      name: 'PDF', 
      dotColor: '#DC2626',
      icon: (color) => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
      )
    },
    { 
      name: 'Google Classroom', 
      dotColor: '#10B981',
      icon: (color) => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="12" rx="2" />
          <path d="M12 15v5M9 20h6" />
          <circle cx="12" cy="9" r="2" />
        </svg>
      )
    },
    { 
      name: 'Canvas LMS', 
      dotColor: '#F43F5E',
      icon: (color) => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          <path d="M2 12h20" />
        </svg>
      )
    },
    { 
      name: 'Moodle', 
      dotColor: '#F59E0B',
      icon: (color) => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
        </svg>
      )
    }
  ];

  // Repeat integrations list to ensure seamless infinite horizontal scrolling marquee
  const INTEGRATIONS_LOOP = [...INTEGRATIONS, ...INTEGRATIONS, ...INTEGRATIONS, ...INTEGRATIONS];

  const FAQ_DATA = [
    { q: '¿Qué tan rigurosa es la teoría generada?', a: 'Cada nota de teoría se basa en fuentes académicas establecidas y se cita automáticamente para que puedas verificarla con un solo clic. Tú sigues siendo el editor en jefe — Katedra redacta y tú apruebas.' },
    { q: '¿Puedo editar todo lo que Katedra produce?', a: 'Sí. Los módulos, la teoría, los ejercicios y las diapositivas son totalmente editables dentro de un editor de documentos limpio. Modifica oraciones, cambia preguntas o reestructura bloques antes de exportar.' },
    { q: '¿A qué formatos puedo exportar mis cursos?', a: 'Soportamos exportación directa a PowerPoint (PPTX), PDF estructurado, Google Classroom, Canvas LMS y Moodle de manera nativa para integrarse a tu flujo de enseñanza diario.' },
    { q: '¿El motor funciona para cualquier materia?', a: 'Katedra maneja ciencias naturales, humanidades, matemáticas, ingeniería y más. Si puedes definir el tema, la inteligencia artificial puede estructurar el temario.' },
    { q: '¿Hay algún plan gratuito?', a: 'Sí, el plan Básico es gratuito para siempre e incluye la creación de cursos completos con un límite mensual. Puedes mejorar a Pro en cualquier momento.' }
  ];

  const STATS_DATA = [
    { target: 40, prefix: '', suffix: '%', label: 'Ahorro de tiempo promedio' },
    { target: 10000, prefix: '+', suffix: '', label: 'Temarios diseñados' },
    { target: 98, prefix: '', suffix: '%', label: 'Índice de satisfacción' }
  ];

  const activeCourse = SUBJECTS[selectedSubject];

  // Carousel single color for all text/icons
  const CAROUSEL_COLOR = '#475569';

  return (
    <div style={{ position: 'relative', width: '100%', overflow: 'hidden', backgroundColor: '#ffffff', color: '#0F172A', fontFamily: "'Inter', system-ui, sans-serif" }}>
      
      {/* GLOBAL CUSTOM KEYFRAMES & STYLES */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: .5; transform: scale(1); }
          50% { opacity: .85; transform: scale(1.08); }
        }
        @keyframes floatY {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-14px); }
        }
        @keyframes floatY2 {
          0%, 100% { transform: translateY(0) rotate(-2deg); }
          50% { transform: translateY(-10px) rotate(-2deg); }
        }
        @keyframes shimmer {
          0% { background-position: -400px 0; }
          100% { background-position: 400px 0; }
        }
        @media (max-width: 820px) {
          .nav-links { display: none !important; }
          .floating-doodles { display: none !important; }
        }
        @media (max-width: 720px) {
          .pg-grid { grid-template-columns: 1fr !important; }
          .pg-sidebar {
            flex-direction: row !important;
            overflow-x: auto !important;
            border-right: none !important;
            border-bottom: 1px solid #EEF1F5 !important;
            gap: 8px !important;
            padding: 10px !important;
          }
          .pg-sidebar-header { display: none !important; }
          .pg-sidebar-footer { display: none !important; }
          .pg-sidebar button { width: auto !important; flex: 0 0 auto !important; margin-bottom: 0 !important; }
          .footer-grid { grid-template-columns: 1fr 1fr !important; gap: 28px !important; }
          .footer-grid-brand { grid-column: 1 / -1; }
        }
        @media (max-width: 480px) {
          .footer-grid { grid-template-columns: 1fr !important; }
        }
      `}} />

      {/* ============ NAVBAR ============ */}
      <nav style={{
        position: 'fixed',
        top: '16px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 100,
        width: 'min(1180px, calc(100% - 32px))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '11px 14px 11px 20px',
        borderRadius: '16px',
        background: 'rgba(255, 255, 255, 0.72)',
        backdropFilter: 'blur(18px) saturate(180%)',
        WebkitBackdropFilter: 'blur(18px) saturate(180%)',
        border: '1px solid rgba(255, 255, 255, 0.6)',
        boxShadow: '0 8px 30px rgba(15, 23, 42, 0.10)',
        transition: 'all 0.3s ease'
      }}>
        <a href="#top" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <span style={{ display: 'grid', placeItems: 'center', width: '32px', height: '32px', borderRadius: '9px', background: 'linear-gradient(135deg, #2B6CB0, #2C5282)', boxShadow: '0 4px 12px rgba(43, 108, 176, 0.4)' }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
              <path d="M3 9.5L12 4l9 5.5-9 5.5-9-5.5Z" fill="#fff" />
              <path d="M6.5 12v4.2c0 .9 2.46 2.3 5.5 2.3s5.5-1.4 5.5-2.3V12" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" />
            </svg>
          </span>
          <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '18px', letterSpacing: '-0.9px', color: '#0F172A' }}>Katedra</span>
        </a>
        
        <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {['Características', 'Integraciones', 'Planes', 'FAQs'].map((label, i) => {
            const targets = ['#features', '#integrations', '#pricing', '#faqs'];
            return (
              <a 
                key={i} 
                href={targets[i]} 
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  fontSize: '14px',
                  color: '#475569',
                  textDecoration: 'none',
                  padding: '8px 13px',
                  borderRadius: '8px',
                  transition: 'background 0.2s, color 0.2s'
                }}
                onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#F1F5F9'; e.currentTarget.style.color = '#0F172A'; }}
                onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#475569'; }}
              >
                {label}
              </a>
            );
          })}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <a 
            href="#" 
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 600,
              fontSize: '14px',
              color: '#0F172A',
              textDecoration: 'none',
              padding: '9px 15px',
              borderRadius: '9px',
              border: '1px solid #E2E8F0',
              background: '#fff',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#F8FAFC'; e.currentTarget.style.borderColor = '#CBD5E1'; }}
            onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#fff'; e.currentTarget.style.borderColor = '#E2E8F0'; }}
          >
            Acceder
          </a>
          <a 
            href="#" 
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 700,
              fontSize: '14px',
              color: '#fff',
              textDecoration: 'none',
              padding: '10px 17px',
              borderRadius: '9px',
              background: 'linear-gradient(135deg, #2B6CB0, #2C5282)',
              boxShadow: '0 4px 14px rgba(43, 108, 176, 0.42)',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.filter = 'brightness(1.05)'; }}
            onMouseOut={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.filter = 'none'; }}
          >
            Registrarse
          </a>
        </div>
      </nav>

      {/* ============ HERO SECTION ============ */}
      <header id="top" style={{ position: 'relative', padding: '148px 24px 0', background: 'radial-gradient(130% 135% at 12% 6%, #2B6CB0 0%, #2C5282 20%, #475569 42%, #10B981 66%, #34D399 86%, #FCD34D 112%)', overflow: 'hidden' }}>
        
        {/* Glow Blobs */}
        <div style={{ position: 'absolute', width: '520px', height: '520px', left: '-120px', bottom: '-90px', borderRadius: '50%', background: 'radial-gradient(circle, #34D399 0%, rgba(52,211,153,0) 68%)', filter: 'blur(18px)', opacity: 0.6, animation: 'pulseGlow 9s ease-in-out infinite', pointerEvents: 'none' }}></div>
        <div style={{ position: 'absolute', width: '440px', height: '440px', right: '-120px', bottom: '-40px', borderRadius: '50%', background: 'radial-gradient(circle, #FBBF24 0%, rgba(251,191,36,0) 70%)', filter: 'blur(20px)', opacity: 0.5, animation: 'pulseGlow 12s ease-in-out infinite', pointerEvents: 'none' }}></div>
        <div style={{ position: 'absolute', width: '400px', height: '400px', right: '-80px', top: '20px', borderRadius: '50%', background: 'radial-gradient(circle, #475569 0%, rgba(71,85,105,0) 70%)', filter: 'blur(20px)', opacity: 0.4, animation: 'pulseGlow 11s ease-in-out infinite', pointerEvents: 'none' }}></div>
        
        {/* Noise overlay */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', mixBlendMode: 'overlay', opacity: 0.5, backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")` }}></div>

        <div style={{ relative: 'zIndex', zIndex: 2, maxWidth: '920px', margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          <motion.div 
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '100px', background: 'rgba(255, 255, 255, 0.16)', border: '1px solid rgba(255, 255, 255, 0.28)', backdropFilter: 'blur(8px)', marginBottom: '26px' }}
          >
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#34D399', boxShadow: '0 0 8px #34D399' }}></span>
            <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '9px', letterSpacing: '1.35px', textTransform: 'uppercase', color: 'rgba(255, 255, 255, 0.92)', whiteSpace: 'nowrap' }}>
              IA para Educadores
            </span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.04, ease: [0.16, 1, 0.3, 1] }}
            style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 'clamp(38px, 6.6vw, 76px)', lineHeight: 1.02, letterSpacing: '-2px', color: '#fff', margin: '0 0 22px', textWrap: 'balance' }}
          >
            Diseña tu plan de estudios a la velocidad del pensamiento.
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: 'clamp(16px, 2vw, 20px)', lineHeight: 1.55, color: 'rgba(255, 255, 255, 0.86)', maxWidth: '620px', margin: '0 auto 36px', textWrap: 'pretty' }}
          >
            Teoría rigurosa, ejercicios con clave y diapositivas de clase — generadas en <span style={{ fontFamily: "'Manrope', sans-serif", fontStyle: 'italic', fontWeight: 600, color: '#ffffff' }}>segundos</span> para educadores.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
            style={{ display: 'flex', flexWrap: 'wrap', gap: '13px', justifyContent: 'center' }}
          >
            <a 
              href="#" 
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 700,
                fontSize: '16px',
                color: '#0F172A',
                textDecoration: 'none',
                padding: '15px 28px',
                borderRadius: '11px',
                background: '#fff',
                boxShadow: '0 10px 30px rgba(15, 23, 42, 0.28)',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(15, 23, 42, 0.34)'; }}
              onMouseOut={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(15, 23, 42, 0.28)'; }}
            >
              Comenzar Gratis
            </a>
            <a 
              href="#playground" 
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 700,
                fontSize: '16px',
                color: '#fff',
                textDecoration: 'none',
                padding: '15px 28px',
                borderRadius: '11px',
                background: 'rgba(255, 255, 255, 0.12)',
                border: '1px solid rgba(255, 255, 255, 0.4)',
                backdropFilter: 'blur(8px)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '9px',
                transition: 'background 0.2s'
              }}
              onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.22)'; }}
              onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.12)'; }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M8 5v14l11-7-11-7Z" fill="#fff" /></svg>
              Probar Demo
            </a>
          </motion.div>
        </div>

        {/* Floating Doc Mockup */}
        <div style={{ zIndex: 2, maxWidth: '880px', margin: '64px auto -120px', paddingBottom: 0, position: 'relative' }}>
          
          {/* Floating Sticker Doodles */}
          <div className="floating-doodles" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 5 }}>
            {/* Apple */}
            <div style={{ position: 'absolute', top: '-28px', left: '-38px', transform: 'rotate(-9deg)' }}>
              <div style={{ animation: 'floatY 6s ease-in-out infinite', display: 'grid', placeItems: 'center', width: '62px', height: '62px', borderRadius: '18px', background: '#FEF2F2', border: '1.5px solid #FECACA', boxShadow: '0 14px 28px rgba(15, 23, 42, 0.16)' }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 7.2c-1.4-1.9-4.3-2-5.6-.1C5 9 5.3 12.6 6.9 15c1 1.5 1.9 2.9 3.3 2.9.8 0 1.1-.4 1.8-.4s1 .4 1.8 0.4c1.4 0 2.3-1.4 3.3-2.9 1.6-2.4 1.9-6 .5-7.9-1.3-1.9-4.2-1.8-5.6.1Z" />
                  <path d="M12 7.2c-.2-1.6.5-3 1.9-3.6" stroke="#059669" />
                </svg>
              </div>
            </div>

            {/* Lightbulb */}
            <div style={{ position: 'absolute', top: '-36px', right: '-30px', transform: 'rotate(7deg)' }}>
              <div style={{ animation: 'floatY 7s ease-in-out infinite 0.4s', display: 'grid', placeItems: 'center', width: '60px', height: '60px', borderRadius: '18px', background: '#FFFBEB', border: '1.5px solid #FDE68A', boxShadow: '0 14px 28px rgba(15, 23, 42, 0.16)' }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9.5 18h5M10.5 21h3" />
                  <path d="M12 3a6 6 0 0 0-3.6 10.8c.5.4.8.9.9 1.6l.1.6h5.2l.1-.6c.1-.7.4-1.2.9-1.6A6 6 0 0 0 12 3Z" />
                  <path d="M12 3V1.5M4.6 6 3.5 5M19.4 6l1.1-1" stroke="#FBBF24" />
                </svg>
              </div>
            </div>

            {/* Checklist */}
            <div style={{ position: 'absolute', top: '132px', right: '-54px', transform: 'rotate(8deg)' }}>
              <div style={{ animation: 'floatY2 8s ease-in-out infinite', display: 'grid', placeItems: 'center', width: '58px', height: '58px', borderRadius: '16px', background: '#ECFDF5', border: '1.5px solid #A7F3D0', boxShadow: '0 14px 28px rgba(15, 23, 42, 0.16)' }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="5" y="4.5" width="14" height="16.5" rx="2.2" />
                  <path d="M9 4.5V3.5h6v1" />
                  <path d="m8 11 1.1 1.1L11.4 10M8 16l1.1 1.1L11.4 15" />
                  <path d="M14 11h3M14 16h3" />
                </svg>
              </div>
            </div>

            {/* Open Book (Slate Blue Variation) */}
            <div style={{ position: 'absolute', bottom: '78px', left: '-50px', transform: 'rotate(-7deg)' }}>
              <div style={{ animation: 'floatY 7.5s ease-in-out infinite 0.2s', display: 'grid', placeItems: 'center', width: '60px', height: '60px', borderRadius: '18px', background: '#F1F5F9', border: '1.5px solid #CBD5E1', boxShadow: '0 14px 28px rgba(15, 23, 42, 0.16)' }}>
                <svg width="27" height="27" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 6.5C10.3 5.2 7.8 4.8 5.5 5.1v11.2c2.3-.3 4.8.1 6.5 1.4 1.7-1.3 4.2-1.7 6.5-1.4V5.1C16.2 4.8 13.7 5.2 12 6.5Z" />
                  <path d="M12 6.5v11.2" />
                </svg>
              </div>
            </div>

            {/* Pencil */}
            <div style={{ position: 'absolute', bottom: '-8px', left: '64px', transform: 'rotate(10deg)' }}>
              <div style={{ animation: 'floatY2 6.5s ease-in-out infinite 0.3s', display: 'grid', placeItems: 'center', width: '54px', height: '54px', borderRadius: '16px', background: '#FFFBEB', border: '1.5px solid #FDE68A', boxShadow: '0 14px 28px rgba(15, 23, 42, 0.16)' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 20.5 5 16 16 5l3.5 3.5L8.5 19.5 4 20.5Z" />
                  <path d="M14 7l3.5 3.5" />
                  <path d="M4 20.5 6.5 18" stroke="#92400E" />
                </svg>
              </div>
            </div>

            {/* Sparkles */}
            <div style={{ position: 'absolute', top: '20px', left: '120px', color: '#FCD34D', animation: 'pulseGlow 3.5s ease-in-out infinite' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l1.6 6.4L20 10l-6.4 1.6L12 18l-1.6-6.4L4 10l6.4-1.6L12 2Z" /></svg>
            </div>
            <div style={{ position: 'absolute', bottom: '120px', right: '20px', color: '#fff', animation: 'pulseGlow 4s ease-in-out infinite 0.6s' }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l1.6 6.4L20 10l-6.4 1.6L12 18l-1.6-6.4L4 10l6.4-1.6L12 2Z" /></svg>
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
            style={{ position: 'relative', background: '#fff', borderRadius: '18px', boxShadow: '0 40px 90px rgba(15,23,42,0.35), 0 8px 24px rgba(15,23,42,0.18)', overflow: 'hidden', animation: 'floatY 7s ease-in-out infinite' }}
          >
            {/* Header window */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '13px 18px', borderBottom: '1px solid #F1F5F9', background: '#FCFCFD' }}>
              <span style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#FB7185' }}></span>
              <span style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#FBBF24' }}></span>
              <span style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#34D399' }}></span>
              <span style={{ marginLeft: '12px', fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: '12px', color: '#94A3B8' }}>Biología_Celular_Módulo_3.pdf</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 0 }}>
              <div style={{ padding: '26px 28px', textAlign: 'left', borderRight: '1px solid #F1F5F9' }}>
                <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '9px', letterSpacing: '1.2px', textTransform: 'uppercase', color: '#10B981', marginBottom: '9px' }}>Teoría · Sección 3.2</div>
                <div style={{ fontFamily: "'Inter'", fontWeight: 600, fontSize: '21px', letterSpacing: '-0.6px', color: '#0F172A', marginBottom: '14px' }}>Respiración Mitocondrial</div>
                <div style={{ height: '8px', borderRadius: '4px', background: '#F1F5F9', marginBottom: '9px' }}></div>
                <div style={{ height: '8px', borderRadius: '4px', background: '#F1F5F9', width: '92%', marginBottom: '9px' }}></div>
                <div style={{ height: '8px', borderRadius: '4px', background: '#F1F5F9', width: '78%', marginBottom: '20px' }}></div>
                <div style={{ display: 'inline-block', padding: '5px 11px', borderRadius: '7px', background: '#ECFDF5', color: '#059669', fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '11px' }}>↳ Citado de Alberts, 6.ª ed.</div>
              </div>
              <div style={{ padding: '24px 22px', textAlign: 'left', background: '#FAFAFB' }}>
                <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '9px', letterSpacing: '1.2px', textTransform: 'uppercase', color: '#475569', marginBottom: '12px' }}>Evaluación Rápida</div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: '13px', color: '#0F172A', marginBottom: '13px', lineHeight: 1.4 }}>¿Dónde ocurre el ciclo de Krebs?</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '9px', padding: '9px 11px', borderRadius: '8px', border: '1px solid #E2E8F0', background: '#fff', fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: '12px', color: '#475569' }}>A · Citoplasma</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '9px', padding: '9px 11px', borderRadius: '8px', border: '1.5px solid #10B981', background: '#ECFDF5', fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '12px', color: '#065F46' }}>B · Matriz mitocondrial <span style={{ marginLeft: 'auto', color: '#10B981' }}>✓</span></div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '9px', padding: '9px 11px', borderRadius: '8px', border: '1px solid #E2E8F0', background: '#fff', fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: '12px', color: '#475569' }}>C · Núcleo</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div style={{ height: '150px' }}></div>
      </header>

      {/* ============ PLAYGROUND SECTION ============ */}
      <section id="playground" style={{ position: 'relative', background: '#fff', padding: '172px 24px 96px' }}>
        <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
          
          <motion.div 
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.75, ease: 'easeOut' }}
            style={{ textAlign: 'center', marginBottom: '44px' }}
          >
            <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '9px', letterSpacing: '1.35px', textTransform: 'uppercase', color: '#10B981', marginBottom: '14px' }}>El Motor · Demo en vivo</div>
            
            <h2 style={{
              fontFamily: "'Inter'",
              fontWeight: 600,
              fontSize: 'clamp(30px, 4.6vw, 52px)',
              lineHeight: 1.05,
              letterSpacing: '-1.6px',
              margin: '0 auto',
              maxWidth: '760px',
              background: 'linear-gradient(90deg, #0F172A 0%, #0F172A 50%, #CBD5E1 50%, #CBD5E1 100%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
              backgroundSize: '200% 100%',
              backgroundPosition: '0% 0',
              transition: 'background-position 1.3s ease'
            }}>
              Observa cómo un curso completo se arma solo.
            </h2>
            <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: '17px', color: '#64748B', maxWidth: '560px', margin: '16px auto 0' }}>
              Elige una materia. Katedra redacta los módulos, la teoría, los ejercicios y las diapositivas <span style={{ fontFamily: "'Manrope', sans-serif", fontStyle: 'italic', fontWeight: 600, color: '#0F172A' }}>en vivo</span>.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.75, delay: 0.12, ease: 'easeOut' }}
            className="pg-grid"
            style={{ display: 'grid', gridTemplateColumns: '236px 1fr', gap: 0, border: '1px solid #E8EBF0', borderRadius: '18px', overflow: 'hidden', boxShadow: '0 24px 60px rgba(15, 23, 42, 0.10)', background: '#fff', minHeight: '520px' }}
          >
            {/* Sidebar */}
            <aside className="pg-sidebar" style={{ background: '#FAFBFC', borderRight: '1px solid #EEF1F5', padding: '18px 14px', display: 'flex', flexDirection: 'column' }}>
              <div className="pg-sidebar-header" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '9px', letterSpacing: '1.2px', textTransform: 'uppercase', color: '#94A3B8', padding: '6px 10px 12px' }}>Elige una materia</div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                {SUBJECTS.map((s, idx) => {
                  const active = idx === selectedSubject;
                  return (
                    <button 
                      key={idx}
                      onClick={() => handleSelectSubject(idx)} 
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '11px',
                        width: '100%',
                        textAlign: 'left',
                        padding: '11px 12px',
                        borderRadius: '11px',
                        cursor: 'pointer',
                        border: '1px solid ' + (active ? '#A7F3D0' : 'transparent'),
                        background: active ? '#ECFDF5' : 'transparent',
                        color: active ? '#065F46' : '#475569',
                        transition: 'background .2s ease, border-color .2s ease, color .2s ease'
                      }}
                    >
                      <span style={{ fontSize: '18px', lineHeight: 1 }}>{s.icon}</span>
                      <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '1px' }}>
                        <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '13.5px' }}>{s.name}</span>
                        <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: '11px', opacity: 0.62 }}>{s.topic}</span>
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="pg-sidebar-footer" style={{ marginTop: 'auto', padding: '14px 10px 4px', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: '11px', color: '#94A3B8' }}>
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10B981', boxShadow: '0 0 7px #10B981' }}></span>
                Motor de Katedra activo
              </div>
            </aside>

            {/* Main Viewer */}
            <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, background: '#fff' }}>
              {/* Toolbar Tabs */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '11px 16px', borderBottom: '1px solid #EEF1F5', background: '#FCFCFD', overflowX: 'auto' }}>
                {['Módulos', 'Teoría', 'Ejercicios', 'Diapositivas'].map((label, idx) => {
                  const active = idx === selectedTab;
                  return (
                    <button 
                      key={idx}
                      onClick={() => handleSelectTab(idx)}
                      style={{
                        padding: '8px 15px',
                        borderRadius: '9px',
                        border: 'none',
                        cursor: 'pointer',
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 700,
                        fontSize: '13.5px',
                        whiteSpace: 'nowrap',
                        transition: 'background .2s, color .2s',
                        background: active ? '#0F172A' : 'transparent',
                        color: active ? '#fff' : '#64748B'
                      }}
                    >
                      {idx + 1}. {label}
                    </button>
                  );
                })}
                <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px', paddingLeft: '12px' }}>
                  <span style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: isLoading ? '#F59E0B' : '#10B981',
                    boxShadow: '0 0 8px ' + (isLoading ? '#F59E0B' : '#10B981'),
                    animation: isLoading ? 'blink 1s infinite' : 'none'
                  }}></span>
                  <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: '12px', color: '#94A3B8', whiteSpace: 'nowrap' }}>
                    {isLoading ? 'Generando' : 'Listo'}
                  </span>
                </div>
              </div>

              {/* Viewer body */}
              <div style={{ position: 'relative', flex: 1, padding: '28px 30px', minHeight: '380px', textAlign: 'left' }}>
                
                {/* Skeleton Loader */}
                {isLoading && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                      <span style={{ width: '16px', height: '16px', border: '2px solid #E2E8F0', borderTopColor: '#2B6CB0', borderRadius: '50%', animation: 'spin .7s linear infinite', display: 'inline-block' }}></span>
                      <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: '13px', color: '#2B6CB0' }}>
                        {selectedTab === 0 ? 'Estructurando módulos...' : selectedTab === 1 ? 'Redactando notas teóricas...' : selectedTab === 2 ? 'Escribiendo banco de preguntas...' : 'Diseñando diapositivas de clase...'}
                      </span>
                    </div>
                    {['100%', '94%', '88%', '97%', '72%', '90%', '60%'].map((w, idx) => (
                      <div key={idx} style={{ height: '13px', borderRadius: '6px', width: w, background: 'linear-gradient(90deg, #F1F5F9 25%, #E8EDF3 37%, #F1F5F9 63%)', backgroundSize: '800px 100%', animation: 'shimmer 1.4s linear infinite' }}></div>
                    ))}
                  </div>
                )}

                {/* Content Modules */}
                {!isLoading && selectedTab === 0 && (
                  <div>
                    <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '9px', letterSpacing: '1.2px', textTransform: 'uppercase', color: '#10B981', marginBottom: '6px' }}>Temario del Curso</div>
                    <div style={{ fontFamily: "'Inter'", fontWeight: 600, fontSize: '22px', letterSpacing: '-0.6px', marginBottom: '20px' }}>{activeCourse.topic}</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '11px' }}>
                      {activeCourse.modules.map((m, i) => (
                        <div key={i} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', padding: '14px 16px', border: '1px solid #EEF1F5', borderRadius: '12px', background: '#FCFCFD', animation: 'fadeUp .5s both' }}>
                          <span style={{ display: 'grid', placeItems: 'center', flex: 'none', width: '28px', height: '28px', borderRadius: '8px', background: '#F1F5F9', color: '#475569', fontFamily: "'Inter'", fontWeight: 700, fontSize: '13px' }}>{i + 1}</span>
                          <div style={{ minWidth: 0 }}>
                            <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '15px', color: '#0F172A', marginBottom: '3px' }}>{m.title}</div>
                            <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: '13px', color: '#64748B', lineHeight: 1.45 }}>{m.desc}</div>
                          </div>
                          <span style={{ marginLeft: 'auto', flex: 'none', fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: '11px', color: '#94A3B8', whiteSpace: 'nowrap' }}>{m.weeks}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Content Theory */}
                {!isLoading && selectedTab === 1 && (
                  <div>
                    <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '9px', letterSpacing: '1.2px', textTransform: 'uppercase', color: '#10B981', marginBottom: '6px' }}>Nota de Teoría</div>
                    <div style={{ fontFamily: "'Inter'", fontWeight: 600, fontSize: '22px', letterSpacing: '-0.6px', marginBottom: '18px' }}>{activeCourse.theoryTitle}</div>
                    {activeCourse.theory.map((t, i) => (
                      <p key={i} style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: '14.5px', lineHeight: 1.72, color: '#334155', margin: '0 0 14px', animation: 'fadeUp .5s both' }}>{t}</p>
                    ))}
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginTop: '6px', padding: '8px 13px', borderRadius: '9px', background: '#ECFDF5', border: '1px solid #A7F3D0', animation: 'fadeUp .5s both' }}>
                      <span style={{ color: '#059669' }}>✦</span>
                      <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '12px', color: '#065F46' }}>{activeCourse.theoryCitation}</span>
                    </div>
                  </div>
                )}

                {/* Content Exercises */}
                {!isLoading && selectedTab === 2 && (
                  <div>
                    <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '9px', letterSpacing: '1.2px', textTransform: 'uppercase', color: '#10B981', marginBottom: '6px' }}>Ejercicios · Clave de Respuestas Incluida</div>
                    <div style={{ fontFamily: "'Inter'", fontWeight: 600, fontSize: '22px', letterSpacing: '-0.6px', marginBottom: '20px' }}>{activeCourse.name}</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                      {activeCourse.exercises.map((q, qi) => (
                        <div key={qi} style={{ padding: '18px 20px', border: '1px solid #EEF1F5', borderRadius: '14px', background: '#FCFCFD', animation: 'fadeUp .5s both' }}>
                          <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '14.5px', color: '#0F172A', marginBottom: '13px', lineHeight: 1.45 }}>{qi + 1}. {q.question}</div>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '9px' }}>
                            {q.options.map((o, oi) => {
                              const correct = oi === q.answer;
                              return (
                                <div 
                                  key={oi} 
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '9px',
                                    padding: '11px 13px',
                                    borderRadius: '10px',
                                    fontFamily: "'Inter', sans-serif",
                                    border: correct ? '1.5px solid #10B981' : '1px solid #E8EBF0',
                                    background: correct ? '#ECFDF5' : '#fff',
                                    color: correct ? '#065F46' : '#475569'
                                  }}
                                >
                                  <span style={{ fontFamily: "'Inter'", fontWeight: 700, fontSize: '12px', opacity: 0.7 }}>{String.fromCharCode(65 + oi)}</span>
                                  <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: '13px' }}>{o}</span>
                                  {correct && <span style={{ marginLeft: 'auto', color: '#10B981', fontWeight: 'bold' }}>✓</span>}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Content Slides */}
                {!isLoading && selectedTab === 3 && (
                  <div>
                    <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '9px', letterSpacing: '1.2px', textTransform: 'uppercase', color: '#10B981', marginBottom: '6px' }}>Presentación de Clase</div>
                    <div style={{ fontFamily: "'Inter'", fontWeight: 600, fontSize: '22px', letterSpacing: '-0.6px', marginBottom: '20px' }}>{activeCourse.slidesTitle}</div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(168px, 1fr))', gap: '14px' }}>
                      {activeCourse.slides.map((title, i) => {
                        const slideBars = ['#10B981', '#475569', '#F59E0B', '#2B6CB0'];
                        return (
                          <div key={i} style={{ aspectRatio: '16/10', borderRadius: '12px', border: '1px solid #EEF1F5', overflow: 'hidden', background: '#fff', boxShadow: '0 6px 18px rgba(15,23,42,0.07)', display: 'flex', flexDirection: 'column', animation: 'fadeUp .5s both' }}>
                            <div style={{ height: '6px', background: slideBars[i % slideBars.length] }}></div>
                            <div style={{ padding: '13px 14px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                              <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '8px', letterSpacing: '1px', textTransform: 'uppercase', color: '#94A3B8', marginBottom: '7px' }}>Diapositiva {i + 1}</div>
                              <div style={{ fontFamily: "'Inter'", fontWeight: 600, fontSize: '14px', letterSpacing: '-0.3px', color: '#0F172A', lineHeight: 1.25, marginBottom: '9px' }}>{title}</div>
                              <div style={{ height: '5px', borderRadius: '3px', background: '#F1F5F9', marginBottom: '5px' }}></div>
                              <div style={{ height: '5px', borderRadius: '3px', background: '#F1F5F9', width: '80%', marginBottom: '5px' }}></div>
                              <div style={{ height: '5px', borderRadius: '3px', background: '#F1F5F9', width: '60%' }}></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============ FEATURE GRID SECTION ============ */}
      <section id="features" style={{ background: '#fff', padding: '40px 24px 96px' }}>
        <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
          
          <motion.div 
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.75, ease: 'easeOut' }}
            style={{ textAlign: 'center', marginBottom: '46px' }}
          >
            <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '9px', letterSpacing: '1.35px', textTransform: 'uppercase', color: '#10B981', marginBottom: '14px' }}>Todo Incluido</div>
            <h2 style={{ fontFamily: "'Inter'", fontWeight: 600, fontSize: 'clamp(30px, 4.6vw, 50px)', lineHeight: 1.06, letterSpacing: '-1.6px', margin: '0 auto', maxWidth: '680px', color: '#0F172A' }}>
              Tres entregables, <span style={{ fontFamily: "'Manrope', sans-serif", fontStyle: 'italic', fontWeight: 600, color: '#0F172A' }}>un solo prompt</span>.
            </h2>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '22px' }}>
            
            {/* Card 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.75, ease: 'easeOut' }}
              className="lift-card"
              style={{ display: 'flex', flexDirection: 'column', borderRadius: '16px', border: '1px solid #E8EBF0', background: '#fff', overflow: 'hidden', boxShadow: '0 1px 2px rgba(15,23,42,0.04)', transition: 'transform .35s cubic-bezier(.2,.8,.2,1), box-shadow .35s ease', cursor: 'default' }}
            >
              <div style={{ position: 'relative', height: '218px', background: '#F5F7FA', borderBottom: '1px solid #EEF1F5', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', left: '9%', right: '9%', top: '26px', background: '#fff', border: '1px solid #EEF1F5', borderRadius: '12px', boxShadow: '0 12px 30px rgba(15,23,42,0.08)', overflow: 'hidden' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '9px 12px', borderBottom: '1px solid #F1F5F9' }}>
                    <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#E2E8F0' }}></span>
                    <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#E2E8F0' }}></span>
                    <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#E2E8F0' }}></span>
                    <span style={{ marginLeft: '6px', height: '6px', width: '44%', borderRadius: '3px', background: '#EEF1F5' }}></span>
                  </div>
                  <div style={{ padding: '16px 16px 20px' }}>
                    <div style={{ display: 'inline-block', padding: '3px 8px', borderRadius: '5px', background: '#ECFDF5', color: '#059669', fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '7px', letterSpacing: '.8px', textTransform: 'uppercase', marginBottom: '9px' }}>Teoría · 3.2</div>
                    <div style={{ height: '9px', width: '72%', borderRadius: '4px', background: '#1F2937', marginBottom: '12px' }}></div>
                    <div style={{ height: '6px', borderRadius: '3px', background: '#EEF1F5', marginBottom: '7px' }}></div>
                    <div style={{ height: '6px', width: '94%', borderRadius: '3px', background: '#EEF1F5', marginBottom: '7px' }}></div>
                    <div style={{ height: '6px', width: '80%', borderRadius: '3px', background: '#EEF1F5', marginBottom: '14px' }}></div>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '5px 9px', borderRadius: '6px', background: '#ECFDF5', border: '1px solid #A7F3D0' }}>
                      <span style={{ color: '#059669', fontSize: '9px' }}>✦</span>
                      <span style={{ height: '5px', width: '60px', borderRadius: '3px', background: '#6EE7B7' }}></span>
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ padding: '24px 26px 28px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontFamily: "'Inter'", fontWeight: 600, fontSize: '22px', letterSpacing: '-0.7px', margin: '0 0 9px', color: '#0F172A' }}>Teoría Estructurada</h3>
                <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: '14.5px', lineHeight: 1.6, color: '#475569', margin: '0 0 16px', flex: 1 }}>
                  Notas de clase rigurosas y citables organizadas en módulos limpios — nunca un bloque de texto genérico.
                </p>
                <a className="explore-link" href="#playground" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '14px', color: '#059669', textDecoration: 'none', width: 'fit-content' }}>
                  Explorar teoría <span style={{ display: 'inline-block', transition: 'transform .25s ease' }}>›</span>
                </a>
              </div>
            </motion.div>

            {/* Card 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.75, delay: 0.09, ease: 'easeOut' }}
              className="lift-card"
              style={{ display: 'flex', flexDirection: 'column', borderRadius: '16px', border: '1px solid #E8EBF0', background: '#fff', overflow: 'hidden', boxShadow: '0 1px 2px rgba(15,23,42,0.04)', transition: 'transform .35s cubic-bezier(.2,.8,.2,1), box-shadow .35s ease', cursor: 'default' }}
            >
              <div style={{ position: 'relative', height: '218px', background: '#F5F7FA', borderBottom: '1px solid #EEF1F5', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', left: '9%', right: '9%', top: '24px', background: '#fff', border: '1px solid #EEF1F5', borderRadius: '12px', boxShadow: '0 12px 30px rgba(15,23,42,0.08)', padding: '16px' }}>
                  <div style={{ display: 'inline-block', padding: '3px 8px', borderRadius: '5px', background: '#FFFBEB', color: '#D97706', fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '7px', letterSpacing: '.8px', textTransform: 'uppercase', marginBottom: '11px' }}>P1 · Clave de respuestas</div>
                  <div style={{ height: '8px', width: '82%', borderRadius: '4px', background: '#1F2937', marginBottom: '14px' }}></div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 10px', border: '1px solid #EEF1F5', borderRadius: '8px' }}><span style={{ fontFamily: "'Inter'", fontWeight: 700, fontSize: '9px', color: '#94A3B8' }}>A</span><span style={{ height: '5px', width: '52%', borderRadius: '3px', background: '#EEF1F5' }}></span></div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 10px', border: '1.5px solid #F59E0B', borderRadius: '8px', background: '#FFFBEB' }}><span style={{ fontFamily: "'Inter'", fontWeight: 700, fontSize: '9px', color: '#D97706' }}>B</span><span style={{ height: '5px', width: '60%', borderRadius: '3px', background: '#FCD34D' }}></span><span style={{ marginLeft: 'auto', color: '#D97706', fontSize: '11px', fontWeight: 'bold' }}>✓</span></div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 10px', border: '1px solid #EEF1F5', borderRadius: '8px' }}><span style={{ fontFamily: "'Inter'", fontWeight: 700, fontSize: '9px', color: '#94A3B8' }}>C</span><span style={{ height: '5px', width: '44%', borderRadius: '3px', background: '#EEF1F5' }}></span></div>
                  </div>
                </div>
              </div>
              <div style={{ padding: '24px 26px 28px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontFamily: "'Inter'", fontWeight: 600, fontSize: '22px', letterSpacing: '-0.7px', margin: '0 0 9px', color: '#0F172A' }}>Ejercicios y Exámenes</h3>
                <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: '14.5px', lineHeight: 1.6, color: '#475569', margin: '0 0 16px', flex: 1 }}>
                  Opción múltiple, preguntas abiertas y exámenes completos — cada uno con su respectiva clave de respuestas.
                </p>
                <a className="explore-link" href="#playground" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '14px', color: '#D97706', textDecoration: 'none', width: 'fit-content' }}>
                  Explorar ejercicios <span style={{ display: 'inline-block', transition: 'transform .25s ease' }}>›</span>
                </a>
              </div>
            </motion.div>

            {/* Card 3 */}
            <motion.div 
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.75, delay: 0.18, ease: 'easeOut' }}
              className="lift-card"
              style={{ display: 'flex', flexDirection: 'column', borderRadius: '16px', border: '1px solid #E8EBF0', background: '#fff', overflow: 'hidden', boxShadow: '0 1px 2px rgba(15,23,42,0.04)', transition: 'transform .35s cubic-bezier(.2,.8,.2,1), box-shadow .35s ease', cursor: 'default' }}
            >
              <div style={{ position: 'relative', height: '218px', background: '#F5F7FA', borderBottom: '1px solid #EEF1F5', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', left: '9%', right: '9%', top: '26px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '11px' }}>
                  <div style={{ background: '#fff', border: '1px solid #EEF1F5', borderRadius: '9px', overflow: 'hidden', boxShadow: '0 8px 20px rgba(15,23,42,0.06)' }}><div style={{ height: '5px', background: '#475569' }}></div><div style={{ padding: '11px 12px' }}><div style={{ height: '6px', width: '70%', borderRadius: '3px', background: '#1F2937', marginBottom: '7px' }}></div><div style={{ height: '4px', borderRadius: '2px', background: '#EEF1F5', marginBottom: '4px' }}></div><div style={{ height: '4px', width: '80%', borderRadius: '2px', background: '#EEF1F5' }}></div></div></div>
                  <div style={{ background: '#fff', border: '1px solid #EEF1F5', borderRadius: '9px', overflow: 'hidden', boxShadow: '0 8px 20px rgba(15,23,42,0.06)' }}><div style={{ height: '5px', background: '#10B981' }}></div><div style={{ padding: '11px 12px' }}><div style={{ height: '6px', width: '60%', borderRadius: '3px', background: '#1F2937', marginBottom: '7px' }}></div><div style={{ height: '4px', borderRadius: '2px', background: '#EEF1F5', marginBottom: '4px' }}></div><div style={{ height: '4px', width: '70%', borderRadius: '2px', background: '#EEF1F5' }}></div></div></div>
                  <div style={{ background: '#fff', border: '1px solid #EEF1F5', borderRadius: '9px', overflow: 'hidden', boxShadow: '0 8px 20px rgba(15,23,42,0.06)' }}><div style={{ height: '5px', background: '#F59E0B' }}></div><div style={{ padding: '11px 12px' }}><div style={{ height: '6px', width: '66%', borderRadius: '3px', background: '#1F2937', marginBottom: '7px' }}></div><div style={{ height: '4px', borderRadius: '2px', background: '#EEF1F5', marginBottom: '4px' }}></div><div style={{ height: '4px', width: '76%', borderRadius: '2px', background: '#EEF1F5' }}></div></div></div>
                  <div style={{ background: '#fff', border: '1px solid #EEF1F5', borderRadius: '9px', overflow: 'hidden', boxShadow: '0 8px 20px rgba(15,23,42,0.06)' }}><div style={{ height: '5px', background: '#2B6CB0' }}></div><div style={{ padding: '11px 12px' }}><div style={{ height: '7px', width: '72%', borderRadius: '3.5px', background: '#1F2937', marginBottom: '7px' }}></div><div style={{ height: '4px', borderRadius: '2px', background: '#EEF1F5', marginBottom: '4px' }}></div><div style={{ height: '4px', width: '64%', borderRadius: '2px', background: '#EEF1F5' }}></div></div></div>
                </div>
              </div>
              <div style={{ padding: '24px 26px 28px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontFamily: "'Inter'", fontWeight: 600, fontSize: '22px', letterSpacing: '-0.7px', margin: '0 0 9px', color: '#0F172A' }}>Diapositivas Listas</h3>
                <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: '14.5px', lineHeight: 1.6, color: '#475569', margin: '0 0 16px', flex: 1 }}>
                  Una presentación pulida y lista para cada módulo — exportable directamente a PowerPoint.
                </p>
                <a className="explore-link" href="#playground" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '14px', color: '#2B6CB0', textDecoration: 'none', width: 'fit-content' }}>
                  Explorar diapositivas <span style={{ display: 'inline-block', transition: 'transform .25s ease' }}>›</span>
                </a>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ============ STATS SECTION ============ */}
      <section style={{ background: '#F9FAFB', padding: '80px 24px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          
          <motion.div 
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.75, ease: 'easeOut' }}
            style={{ textAlign: 'center', marginBottom: '50px' }}
          >
            <h2 style={{ fontFamily: "'Inter'", fontWeight: 600, fontSize: 'clamp(28px, 4.2vw, 44px)', lineHeight: 1.08, letterSpacing: '-1.4px', margin: 0, color: '#0F172A' }}>
              Horas devueltas <span style={{ fontFamily: "'Manrope', sans-serif", fontStyle: 'italic', fontWeight: 600, color: '#0F172A' }}>cada semana</span>.
            </h2>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
            {STATS_DATA.map((st, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-10%' }}
                transition={{ duration: 0.75, delay: idx * 0.08, ease: 'easeOut' }}
                style={{ textAlign: 'center', padding: '38px 24px', background: '#fff', border: '1px solid #EEF1F5', borderRadius: '16px', boxShadow: '0 1px 2px rgba(15,23,42,0.04)' }}
              >
                <div style={{ fontFamily: "'Inter'", fontWeight: 700, fontSize: 'clamp(42px, 6vw, 60px)', letterSpacing: '-2.4px', lineHeight: 1, background: 'linear-gradient(135deg, #10B981, #059669)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
                  <AnimatedCounter target={st.target} prefix={st.prefix} suffix={st.suffix} />
                </div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: '15px', color: '#475569', marginTop: '14px' }}>{st.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ INTEGRATIONS SECTION ============ */}
      <section id="integrations" style={{ 
        position: 'relative',
        padding: '88px 0', 
        overflow: 'hidden',
        background: 'linear-gradient(135deg, rgba(43, 108, 176, 0.28), rgba(71, 85, 105, 0.16) 35%, rgba(16, 185, 129, 0.24) 70%, rgba(251, 191, 36, 0.14))',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderTop: '1px solid rgba(255, 255, 255, 0.25)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.25)'
      }}>
        {/* Glow Blobs within the section to resemble the start of the landing */}
        <div style={{ position: 'absolute', width: '260px', height: '260px', left: '-50px', top: '-50px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.35) 0%, rgba(16,185,129,0) 70%)', filter: 'blur(12px)', pointerEvents: 'none' }}></div>
        <div style={{ position: 'absolute', width: '220px', height: '220px', right: '-40px', bottom: '-40px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(251,191,36,0.3) 0%, rgba(251,191,36,0) 70%)', filter: 'blur(14px)', pointerEvents: 'none' }}></div>

        <motion.div 
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.75, ease: 'easeOut' }}
          style={{ textAlign: 'center', marginBottom: '46px', padding: '0 24px', relative: 'zIndex', zIndex: 1, position: 'relative' }}
        >
          <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '9px', letterSpacing: '1.35px', textTransform: 'uppercase', color: '#10B981', marginBottom: '14px' }}>Llévalo a donde sea</div>
          <h2 style={{ fontFamily: "'Inter'", fontWeight: 600, fontSize: 'clamp(28px, 4.2vw, 44px)', lineHeight: 1.08, letterSpacing: '-1.4px', margin: '0 auto', maxWidth: '620px', color: '#0F172A' }}>
            Exporta a las herramientas con las que <span style={{ fontFamily: "'Manrope', sans-serif", fontStyle: 'italic', fontWeight: 600, color: '#0F172A' }}>ya enseñas</span>.
          </h2>
        </motion.div>

        {/* Blurred, semi-transparent carousel marquee */}
        <div style={{ position: 'relative', width: '100%', WebkitMaskImage: 'linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)', maskImage: 'linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)' }}>
          <div style={{ display: 'flex', gap: '18px', width: 'max-content', animation: 'marquee 32s linear infinite' }}>
            {INTEGRATIONS_LOOP.map((ig, idx) => (
              <div 
                key={idx} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '12px', 
                  padding: '13px 22px', 
                  borderRadius: '16px', 
                  border: '1px solid rgba(255, 255, 255, 0.45)', 
                  background: 'rgba(255, 255, 255, 0.58)', 
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  whiteSpace: 'nowrap', 
                  boxShadow: '0 4px 14px rgba(15,23,42,0.03)',
                  position: 'relative'
                }}
              >
                {/* Brand dot: a distinctive colored mark for each brand to avoid repetition */}
                <span style={{
                  position: 'absolute',
                  top: '6px',
                  right: '6px',
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: ig.dotColor,
                  opacity: 0.8,
                  boxShadow: `0 0 6px ${ig.dotColor}`
                }}></span>

                <span style={{ 
                  display: 'grid', 
                  placeItems: 'center', 
                  width: '32px', 
                  height: '32px', 
                  borderRadius: '8px', 
                  background: 'rgba(255, 255, 255, 0.4)', 
                  color: CAROUSEL_COLOR,
                  opacity: 0.65 // Translucent single-color icon style
                }}>
                  {ig.icon(CAROUSEL_COLOR)}
                </span>
                <span style={{ 
                  fontFamily: "'Inter', sans-serif", 
                  fontWeight: 600, 
                  fontSize: '14.5px', 
                  color: CAROUSEL_COLOR,
                  opacity: 0.75
                }}>
                  {ig.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ PRICING SECTION ============ */}
      <section id="pricing" style={{ background: '#F9FAFB', padding: '90px 24px' }}>
        <div style={{ maxWidth: '980px', margin: '0 auto' }}>
          
          <motion.div 
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.75, ease: 'easeOut' }}
            style={{ textAlign: 'center', marginBottom: '14px' }}
          >
            <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '9px', letterSpacing: '1.35px', textTransform: 'uppercase', color: '#10B981', marginBottom: '14px' }}>Precios</div>
            <h2 style={{ fontFamily: "'Inter'", fontWeight: 600, fontSize: 'clamp(30px, 4.6vw, 50px)', lineHeight: 1.05, letterSpacing: '-1.6px', margin: '0 auto', maxWidth: '640px', color: '#0F172A' }}>
              Planes para tu carga académica.
            </h2>
          </motion.div>

          {/* Billing toggle */}
          <motion.div 
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.75, delay: 0.08, ease: 'easeOut' }}
            style={{ display: 'flex', justifyContent: 'center', margin: '30px 0 42px' }}
          >
            <div style={{ position: 'relative', display: 'flex', padding: '5px', borderRadius: '12px', background: '#fff', border: '1px solid #E8EBF0', boxShadow: '0 1px 3px rgba(15,23,42,0.05)' }}>
              <div style={{
                position: 'absolute',
                top: '5px',
                bottom: '5px',
                left: billing === 'monthly' ? '5px' : '50%',
                width: 'calc(50% - 5px)',
                borderRadius: '9px',
                background: '#0F172A',
                transition: 'left .35s cubic-bezier(.4, 0, .2, 1)'
              }}></div>
              <button 
                onClick={() => setBilling('monthly')} 
                style={{
                  position: 'relative',
                  zIndex: 1,
                  padding: '10px 22px',
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 700,
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '7px',
                  transition: 'color .3s',
                  color: billing === 'monthly' ? '#fff' : '#64748B'
                }}
              >
                Mensual
              </button>
              <button 
                onClick={() => setBilling('yearly')} 
                style={{
                  position: 'relative',
                  zIndex: 1,
                  padding: '10px 22px',
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 700,
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '7px',
                  transition: 'color .3s',
                  color: billing === 'yearly' ? '#fff' : '#64748B'
                }}
              >
                Anual <span style={{ fontSize: '11px', color: '#10B981', fontWeight: 700 }}>−20%</span>
              </button>
            </div>
          </motion.div>

          {/* Pricing cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '22px', maxWidth: '760px', margin: '0 auto' }}>
            
            {/* Basic card */}
            <motion.div 
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.75, ease: 'easeOut' }}
              style={{ padding: '32px', borderRadius: '18px', border: '1px solid #E8EBF0', background: '#fff', display: 'flex', flexDirection: 'column' }}
            >
              <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '14px', color: '#0F172A', marginBottom: '6px' }}>Básico</div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: '13px', color: '#64748B', marginBottom: '22px' }}>Para probar la plataforma.</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '24px' }}>
                <span style={{ fontFamily: "'Inter'", fontWeight: 700, fontSize: '46px', letterSpacing: '-2px', color: '#0F172A' }}>$0</span>
                <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: '14px', color: '#94A3B8' }}>/siempre</span>
              </div>
              <a 
                href="#" 
                style={{
                  textAlign: 'center',
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 700,
                  fontSize: '14.5px',
                  color: '#0F172A',
                  textDecoration: 'none',
                  padding: '13px',
                  borderRadius: '10px',
                  border: '1px solid #E2E8F0',
                  background: '#fff',
                  marginBottom: '26px',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#F8FAFC'; e.currentTarget.style.borderColor = '#CBD5E1'; }}
                onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#fff'; e.currentTarget.style.borderColor = '#E2E8F0'; }}
              >
                Comenzar gratis
              </a>
              {['3 cursos al mes', 'Teoría y ejercicios', 'Exportación a PDF', 'Soporte de la comunidad'].map((bf, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '11px', padding: '7px 0', fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: '14px', color: '#334155' }}>
                  <span style={{ display: 'grid', placeItems: 'center', width: '19px', height: '19px', borderRadius: '50%', background: '#F1F5F9', color: '#64748B', fontSize: '11px', flex: 'none' }}>✓</span>
                  {bf}
                </div>
              ))}
            </motion.div>

            {/* Pro card (Steel Blue theme) */}
            <motion.div 
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.75, delay: 0.1, ease: 'easeOut' }}
              style={{ position: 'relative', padding: '32px', borderRadius: '18px', background: 'linear-gradient(165deg, #1A365D, #0F172A)', boxShadow: '0 30px 60px rgba(15,23,42,0.35)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
            >
              <div style={{ position: 'absolute', width: '280px', height: '280px', right: '-90px', top: '-90px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.32), transparent 68%)', pointerEvents: 'none' }}></div>
              <div style={{ position: 'absolute', top: '22px', right: '22px', padding: '5px 11px', borderRadius: '100px', background: 'rgba(16,185,129,0.16)', border: '1px solid rgba(16,185,129,0.4)', fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '10px', letterSpacing: '.5px', color: '#34D399' }}>RECOMENDADO</div>
              
              <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '14px', color: '#fff', marginBottom: '6px' }}>Katedra Pro</div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: '13px', color: '#94A3B8', marginBottom: '22px' }}>Para toda tu carga académica.</div>
              
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '5px', marginBottom: '4px' }}>
                <span style={{ fontFamily: "'Inter'", fontWeight: 700, fontSize: '46px', letterSpacing: '-2px', color: '#fff' }}>{billing === 'monthly' ? '$19' : '$15'}</span>
                <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: '14px', color: '#94A3B8' }}>/mes</span>
              </div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: '12px', color: '#34D399', marginBottom: '24px', minHeight: '16px' }}>
                {billing === 'monthly' ? 'Facturado mensualmente' : 'Facturado $180/año — ahorra $48'}
              </div>
              
              <a 
                href="#" 
                style={{
                  textAlign: 'center',
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 700,
                  fontSize: '14.5px',
                  color: '#0F172A',
                  textDecoration: 'none',
                  padding: '13px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #34D399, #10B981)',
                  boxShadow: '0 8px 22px rgba(16, 185, 129, 0.4)',
                  marginBottom: '26px',
                  position: 'relative',
                  zIndex: 1,
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.filter = 'brightness(1.05)'; }}
                onMouseOut={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.filter = 'none'; }}
              >
                Comenzar prueba Pro
              </a>
              {['Temarios ilimitados', 'Teoría avanzada y profunda', 'Diapositivas y claves de respuesta', 'Todos los formatos de exportación', 'Soporte prioritario'].map((pf, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '11px', padding: '7px 0', fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: '14px', color: '#E2E8F0', position: 'relative', zIndex: 1 }}>
                  <span style={{ display: 'grid', placeItems: 'center', width: '19px', height: '19px', borderRadius: '50%', background: 'rgba(16,185,129,0.18)', color: '#34D399', fontSize: '11px', flex: 'none' }}>✓</span>
                  {pf}
                </div>
              ))}
            </motion.div>

          </div>
        </div>
      </section>

      {/* ============ FAQS SECTION ============ */}
      <section id="faqs" style={{ background: '#fff', padding: '90px 24px' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>
          
          <motion.div 
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.75, ease: 'easeOut' }}
            style={{ textAlign: 'center', marginBottom: '44px' }}
          >
            <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '9px', letterSpacing: '1.35px', textTransform: 'uppercase', color: '#10B981', marginBottom: '14px' }}>Preguntas Frecuentes</div>
            <h2 style={{ fontFamily: "'Inter'", fontWeight: 600, fontSize: 'clamp(30px, 4.6vw, 48px)', lineHeight: 1.05, letterSpacing: '-1.6px', margin: 0, color: '#0F172A' }}>
              Resolvemos tus dudas.
            </h2>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.75, delay: 0.08, ease: 'easeOut' }}
            style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
          >
            {FAQ_DATA.map((faq, idx) => {
              const isOpen = idx === openFaq;
              return (
                <div key={idx} style={{ border: '1px solid #E8EBF0', borderRadius: '14px', overflow: 'hidden', background: '#fff' }}>
                  <button 
                    onClick={() => setOpenFaq(isOpen ? -1 : idx)} 
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      padding: '20px 22px',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '16px', color: isOpen ? '#10B981' : '#0F172A', flex: 1 }}>{faq.q}</span>
                    <span style={{
                      display: 'grid',
                      placeItems: 'center',
                      width: '28px',
                      height: '28px',
                      borderRadius: '8px',
                      background: isOpen ? '#10B981' : '#F1F5F9',
                      color: isOpen ? '#fff' : '#64748B',
                      fontSize: '20px',
                      fontWeight: 400,
                      flex: 'none',
                      transition: 'transform .35s, background .25s, color .25s',
                      transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)'
                    }}>
                      +
                    </span>
                  </button>
                  <div style={{
                    overflow: 'hidden',
                    transition: 'max-height .4s cubic-bezier(.4, 0, .2, 1), opacity .3s ease',
                    maxHeight: isOpen ? '260px' : '0',
                    opacity: isOpen ? 1 : 0
                  }}>
                    <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: '14.5px', lineHeight: 1.65, color: '#475569', margin: 0, padding: '0 22px 22px' }}>{faq.a}</p>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ============ CTA BANNER SECTION ============ */}
      <section style={{ background: '#fff', padding: '20px 24px 96px' }}>
        <motion.div 
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.75, ease: 'easeOut' }}
          style={{ position: 'relative', maxWidth: '1080px', margin: '0 auto', padding: '64px 32px', borderRadius: '26px', textAlign: 'center', overflow: 'hidden', background: 'radial-gradient(125% 140% at 18% 8%, #2B6CB0, #475569 34%, #10B981 66%, #34D399 88%, #FCD34D 116%)' }}
        >
          {/* Noise overlay */}
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', mixBlendMode: 'overlay', opacity: 0.45, backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n2'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/></filter><rect width='100%' height='100%' filter='url(%23n2)'/></svg>")` }}></div>
          <div style={{ position: 'absolute', width: '380px', height: '380px', left: '-80px', bottom: '-160px', borderRadius: '50%', background: 'radial-gradient(circle, #10B981, transparent 68%)', opacity: 0.5, filter: 'blur(10px)', pointerEvents: 'none' }}></div>
          
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h2 style={{ fontFamily: "'Inter'", fontWeight: 600, fontSize: 'clamp(30px, 5vw, 52px)', lineHeight: 1.04, letterSpacing: '-1.8px', color: '#fff', margin: '0 auto 16px', maxWidth: '620px', textWrap: 'balance' }}>
              Tu siguiente temario está a <span style={{ fontFamily: "'Manrope', sans-serif", fontStyle: 'italic', fontWeight: 600, color: '#ffffff' }}>un solo prompt</span> de distancia.
            </h2>
            <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: '18px', color: 'rgba(255, 255, 255, 0.86)', margin: '0 auto 30px', maxWidth: '480px' }}>
              Únete a más de 10,000 educadores que diseñan mejores clases en menos tiempo.
            </p>
            <a 
              href="#" 
              style={{
                display: 'inline-block',
                fontFamily: "'Inter', sans-serif",
                fontWeight: 700,
                fontSize: '16px',
                color: '#0F172A',
                textDecoration: 'none',
                padding: '16px 32px',
                borderRadius: '12px',
                background: '#fff',
                boxShadow: '0 14px 34px rgba(15, 23, 42, 0.3)',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(15, 23, 42, 0.34)'; }}
              onMouseOut={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 14px 34px rgba(15, 23, 42, 0.3)'; }}
            >
              Comenzar Gratis
            </a>
          </div>
        </motion.div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer style={{ background: '#0F172A', padding: '64px 24px 36px' }}>
        <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
          
          <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr 1fr', gap: '40px', paddingBottom: '48px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <div className="footer-grid-brand">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <span style={{ display: 'grid', placeItems: 'center', width: '30px', height: '30px', borderRadius: '9px', background: 'linear-gradient(135deg, #2B6CB0, #2C5282)' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M3 9.5L12 4l9 5.5-9 5.5-9-5.5Z" fill="#fff" /><path d="M6.5 12v4.2c0 .9 2.46 2.3 5.5 2.3s5.5-1.4 5.5-2.3V12" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" /></svg>
                </span>
                <span style={{ fontFamily: "'Inter'", fontWeight: 700, fontSize: '18px', letterSpacing: '-0.9px', color: '#fff' }}>Katedra</span>
              </div>
              <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: '14px', lineHeight: 1.6, color: '#94A3B8', margin: '0 0 20px', maxWidth: '260px' }}>
                El coautor de IA para educadores. Temarios, teoría y diapositivas estructuradas en segundos.
              </p>
              <div style={{ display: 'flex', gap: '10px' }}>
                {['𝕏', 'in', '✉'].map((so, idx) => (
                  <a 
                    key={idx}
                    href="#" 
                    className="social-icon"
                    style={{
                      display: 'grid',
                      placeItems: 'center',
                      width: '36px',
                      height: '36px',
                      borderRadius: '9px',
                      background: 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#CBD5E1',
                      textDecoration: 'none',
                      fontSize: '15px',
                      transition: 'all 0.2s'
                    }}
                  >
                    {so}
                  </a>
                ))}
              </div>
            </div>

            {[
              { title: 'Producto', links: ['Características', 'Integraciones', 'Planes', 'Actualizaciones'] },
              { title: 'Recursos', links: ['Documentación', 'Guías', 'Blog', 'Comunidad'] },
              { title: 'Compañía', links: ['Acerca de', 'Carreras', 'Contacto', 'Privacidad'] }
            ].map((col, idx) => (
              <div key={idx}>
                <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '12px', letterSpacing: '.4px', textTransform: 'uppercase', color: '#fff', marginBottom: '18px' }}>{col.title}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '11px' }}>
                  {col.links.map((lk, li) => (
                    <a 
                      key={li} 
                      href="#" 
                      className="footer-link"
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 500,
                        fontSize: '14px',
                        color: '#94A3B8',
                        textDecoration: 'none',
                        width: 'fit-content',
                        transition: 'color 0.2s'
                      }}
                      onMouseOver={(e) => { e.currentTarget.style.color = '#fff'; }}
                      onMouseOut={(e) => { e.currentTarget.style.color = '#94A3B8'; }}
                    >
                      {lk}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', justifyContent: 'space-between', alignItems: 'center', paddingTop: '28px' }}>
            <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: '13px', color: '#64748B' }}>© 2026 Katedra Labs, Inc. Todos los derechos reservados.</span>
            <div style={{ display: 'flex', gap: '22px' }}>
              <a href="#" className="footer-link" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: '13px', color: '#64748B', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={(e) => { e.currentTarget.style.color = '#fff'; }} onMouseOut={(e) => { e.currentTarget.style.color = '#64748B'; }}>Privacidad</a>
              <a href="#" className="footer-link" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: '13px', color: '#64748B', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={(e) => { e.currentTarget.style.color = '#fff'; }} onMouseOut={(e) => { e.currentTarget.style.color = '#64748B'; }}>Términos</a>
              <a href="#" className="footer-link" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: '13px', color: '#64748B', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={(e) => { e.currentTarget.style.color = '#fff'; }} onMouseOut={(e) => { e.currentTarget.style.color = '#64748B'; }}>Estado</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}

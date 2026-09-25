import { useEffect, useRef, useState } from 'react';
import {
  AnimatePresence, MotionConfig, motion, useReducedMotion, useScroll, useSpring, useTransform,
} from 'framer-motion';
import {
  ArrowDown, ArrowLeft, ArrowRight, BookOpen, Check, CheckCircle2,
  ChevronDown, CircleHelp, ClipboardCheck, Compass, FileText,
  GraduationCap, Layers3, LockKeyhole, Menu, MessageSquareText,
  Play, RotateCcw, Search, Sparkles, X,
} from 'lucide-react';
import {
  AI_HELP, DEMO_STEPS, PRIMARY_CTA, getDemoStep, getFormResult, nextDemoStep, previousDemoStep,
} from './studentLandingJourney.js';
import {
  editorialItem, editorialStagger, indicatorSpring, panelSwap, previewItem, previewSequence,
} from './studentLandingMotion.js';
import { BsMicrosoftTeams } from 'react-icons/bs';

const NAV = [
  ['Cómo funciona', '#como-funciona'],
  ['IA para aprender', '#ia-para-aprender'],
  ['Katedra Forms', '#katedra-forms'],
  ['Preguntas', '#preguntas'],
];

function Brand() {
  return <a className="sl-brand" href="#inicio" aria-label="Katedra, volver al inicio"><span>Katedra</span></a>;
}

function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const menuButtonRef = useRef(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 28);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const onEscape = (event) => {
      if (event.key === 'Escape') {
        setOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onEscape);
    return () => document.removeEventListener('keydown', onEscape);
  }, [open]);

  return <header className={`sl-header${scrolled || open ? ' is-scrolled' : ''}`}>
    <nav className="sl-nav" aria-label="Navegación de alumnos">
      <Brand />
      <div className="sl-nav-links sl-nav-desktop">
        {NAV.map(([label, href]) => <a key={href} href={href}>{label}</a>)}
        <a className="sl-nav-teachers" href="/">Para profesores</a>
      </div>
      <a className="sl-nav-cta" href={PRIMARY_CTA.href} onClick={() => setOpen(false)}>{PRIMARY_CTA.label} <ArrowRight size={16} aria-hidden="true" /></a>
      <motion.button ref={menuButtonRef} className="sl-menu-toggle" type="button" aria-label={open ? 'Cerrar menú' : 'Abrir menú'} aria-expanded={open} aria-controls="sl-nav-links" onClick={() => setOpen(!open)} whileTap={reduceMotion ? undefined : { scale: 0.94 }}>{open ? <X size={22} /> : <Menu size={22} />}</motion.button>
      <AnimatePresence initial={false}>
        {open && <motion.div id="sl-nav-links" className="sl-nav-links sl-mobile-links" initial={reduceMotion ? false : { opacity: 0.9, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={reduceMotion ? { opacity: 1 } : { opacity: 0, y: -6 }} transition={{ duration: 0.18 }}>
          {NAV.map(([label, href]) => <a key={href} href={href} onClick={() => setOpen(false)}>{label}</a>)}
          <a className="sl-nav-teachers" href="/" onClick={() => setOpen(false)}>Para profesores</a>
        </motion.div>}
      </AnimatePresence>
    </nav>
  </header>;
}

function ProductPreview() {
  const reduceMotion = useReducedMotion();
  return <motion.div className="sl-preview-wrap" initial={reduceMotion ? false : { opacity: 0.97, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.2 }} transition={{ duration: 0.58, ease: 'easeOut' }}>
    <div className="sl-preview-label">Vista conceptual · Ejemplo de clase</div>
    <div className="sl-preview" aria-label="Ejemplo de clase de ecosistemas con material, actividad, retroalimentación y siguiente paso">
      <aside className="sl-preview-sidebar" aria-label="Secciones de la clase">
        <div className="sl-preview-mini-brand"><span>K</span> Tu espacio</div>
        <span className="sl-preview-side-label">MIS CLASES</span>
        <span className="sl-preview-side-active"><BookOpen size={16} /> Ecosistemas</span>
        <span className="sl-preview-side-item"><Layers3 size={16} /> Materiales</span>
        <span className="sl-preview-side-item"><ClipboardCheck size={16} /> Actividades</span>
        <div className="sl-preview-side-foot">Una clase. Una ruta clara.</div>
      </aside>
      <motion.div className="sl-preview-main" variants={previewSequence} initial={reduceMotion ? false : 'rest'} whileInView="ready" viewport={{ once: false, amount: 0.25 }}>
        <div className="sl-preview-topline"><span>Biología <span aria-hidden="true">/</span> Ecosistemas</span><span className="sl-preview-today">En curso</span></div>
        <motion.div className="sl-preview-heading" variants={previewItem}><div><span className="sl-overline">TEMA ACTUAL</span><h2>Flujo de energía</h2><p>Continúa donde te quedaste.</p></div><span className="sl-preview-lesson">Clase 04</span></motion.div>
        <motion.div className="sl-preview-progress" variants={previewItem}><div><strong>Progreso de la clase</strong><span>3 de 5 pasos</span></div><div className="sl-progress-track"><span /></div></motion.div>
        <motion.div className="sl-preview-grid" variants={previewItem}>
          <div className="sl-preview-material"><span className="sl-preview-kicker"><FileText size={15} /> MATERIAL RELACIONADO</span><strong>Productores y consumidores</strong><small>Lectura · páginas 8–12</small><span className="sl-preview-link">Ver el esquema de la página 10 <ArrowRight size={13} /></span></div>
          <div className="sl-preview-task"><span className="sl-preview-kicker"><ClipboardCheck size={15} /> ACTIVIDAD PENDIENTE</span><strong>Explica una cadena alimenticia</strong><small>Conecta el material con tu respuesta.</small><span className="sl-preview-task-state">Siguiente actividad</span></div>
        </motion.div>
        <motion.div className="sl-preview-feedback" variants={previewItem}><div className="sl-preview-avatar">P</div><div><span>Comentario de tu profesor</span><p>“Vas bien. Explica por qué los productores son el punto de entrada de energía.”</p></div></motion.div>
        <motion.div className="sl-preview-next" variants={previewItem}><span className="sl-next-icon"><Compass size={18} /></span><div><small>SIGUIENTE PASO RECOMENDADO</small><strong>Repasa el esquema y practica con otra cadena alimenticia.</strong></div><ArrowRight size={19} aria-hidden="true" /></motion.div>
      </motion.div>
    </div>
  </motion.div>;
}

function Hero() {
  const reduceMotion = useReducedMotion();
  return <section className="sl-hero" id="inicio" aria-labelledby="sl-hero-title">
    <motion.div className="sl-hero-text" variants={editorialStagger} initial={reduceMotion ? false : 'rest'} animate="ready">
      <motion.span className="sl-pill" variants={editorialItem}><span className="sl-live-dot" /> Próximamente para alumnos</motion.span>
      <motion.h1 id="sl-hero-title" variants={editorialItem}>Entiende qué sigue <em>después de cada clase.</em></motion.h1>
      <motion.p variants={editorialItem}>Katedra reúne tus materiales, actividades y comentarios para que sepas qué revisar, cómo mejorar y cuál es tu siguiente paso.</motion.p>
      <motion.div className="sl-hero-actions" variants={editorialItem}><a className="sl-button sl-button-primary" href={PRIMARY_CTA.href}>{PRIMARY_CTA.label} <ArrowRight size={18} /></a><a className="sl-button sl-button-ghost" href="#la-duda"><Play size={17} /> Ver cómo se organiza</a></motion.div>
      <a className="sl-hero-teachers" href="/">¿Das clases? Conoce Katedra para profesores <ArrowRight size={14} /></a>
    </motion.div>
    <ProductPreview />
    <motion.a
      className="sl-hero-scroll"
      href="#la-duda"
      animate={reduceMotion ? undefined : { y: [0, 5, 0] }}
      transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
    >
      De la duda a una ruta
      <motion.span
        animate={reduceMotion ? undefined : { y: [0, 4, 0] }}
        transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
        style={{ display: 'inline-flex' }}
      >
        <ArrowDown size={15} />
      </motion.span>
    </motion.a>
  </section>;
}

function SectionIntro({ eyebrow, title, description, id }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      className="sl-section-intro"
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.2 }}
      transition={{ duration: 0.48, ease: 'easeOut' }}
    >
      <span className="sl-eyebrow">{eyebrow}</span>
      <h2 id={id}>{title}</h2>
      {description && <p>{description}</p>}
    </motion.div>
  );
}

function Problem() {
  const sectionRef = useRef(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start 80%', 'end 25%'] });
  const progress = useSpring(scrollYProgress, { stiffness: 110, damping: 32 });
  const questionsOpacity = useTransform(progress, [0, 0.7, 1], [1, 0.92, 0.85]);
  const questionsX = useTransform(progress, [0, 1], [0, 14]);
  const routeOpacity = useTransform(progress, [0, 0.5, 1], [0.86, 0.93, 1]);
  const routeX = useTransform(progress, [0, 1], [10, 0]);
  const firstStepOpacity = useTransform(progress, [0, 0.33], [0.86, 1]);
  const secondStepOpacity = useTransform(progress, [0.18, 0.65], [0.86, 1]);
  const finalStepOpacity = useTransform(progress, [0.42, 0.9], [0.86, 1]);
  return <section ref={sectionRef} className="sl-problem sl-section" id="la-duda" aria-labelledby="sl-problem-title"><div className="sl-container">
    <div className="sl-problem-layout">
      <div className="sl-problem-heading"><span className="sl-eyebrow">01 / CONFUSIÓN</span><h2 id="sl-problem-title">A veces el problema no es estudiar.<br /><em>Es saber por dónde empezar.</em></h2><p>Archivos, tareas y comentarios llegan por separado. La clase debería ayudarte a encontrar el hilo.</p></div>
      <motion.div
        className="sl-problem-image"
        initial={reduceMotion ? false : { opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <motion.img
          src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=800"
          alt="Estudiante analizando notas"
          className="sl-dispersed-image"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.4 }}
        />
      </motion.div>
      <div className="sl-problem-copy">
        <div className="sl-transform" aria-label="De archivos dispersos a un siguiente paso claro">
          <motion.div className="sl-chaos" style={reduceMotion ? undefined : { opacity: questionsOpacity, x: questionsX }}><span className="sl-chaos-note n1">¿Cuál archivo reviso?</span><span className="sl-chaos-note n2">¿Qué quiso decir mi profesor?</span><span className="sl-chaos-note n3">¿Dónde estaba el material?</span><span className="sl-chaos-note n4">¿Qué hago después de mi calificación?</span></motion.div>
          <div className="sl-transform-arrow" aria-hidden="true"><ArrowRight size={22} /></div>
          <motion.div className="sl-order" style={reduceMotion ? undefined : { opacity: routeOpacity, x: routeX }}><span className="sl-order-label">KATEDRA LO REÚNE</span><motion.div style={reduceMotion ? undefined : { opacity: firstStepOpacity }}><span>01</span> Tu clase y su tema <Check size={16} /></motion.div><motion.div style={reduceMotion ? undefined : { opacity: secondStepOpacity }}><span>02</span> Material y actividad <Check size={16} /></motion.div><motion.div className="is-active" style={reduceMotion ? undefined : { opacity: finalStepOpacity }}><span>03</span> Tu siguiente paso <ArrowRight size={16} /></motion.div></motion.div>
        </div>
        <p className="sl-problem-caption">Archivos dispersos <ArrowRight size={15} /> clase organizada <ArrowRight size={15} /> siguiente paso claro</p>
      </div>
    </div>
  </div></section>;
}

function Demo() {
  const [active, setActive] = useState(0);
  const reduceMotion = useReducedMotion();
  const step = getDemoStep(active);
  return <section className="sl-demo sl-section" id="como-funciona" aria-labelledby="sl-demo-title"><div className="sl-container">
    <SectionIntro eyebrow="02 / COMPRENSIÓN" title="Sigue una actividad real, de la consigna al siguiente paso." description="Explora un ejemplo de clase. Selecciona cada etapa para ver cómo se conecta con la anterior." id="sl-demo-title" />
    <div className="sl-demo-shell"><div className="sl-demo-head"><span><span className="sl-live-dot" /> DEMO INTERACTIVA</span><span>Biología · Ecosistemas</span></div>
      <div className="sl-demo-steps" aria-label="Etapas de la actividad">{DEMO_STEPS.map((item, index) => <motion.button className={`sl-demo-step${index === active ? ' is-active' : ''}${index < active ? ' is-complete' : ''}`} key={item.id} type="button" aria-current={index === active ? 'step' : undefined} onClick={() => setActive(index)} whileTap={reduceMotion ? undefined : { scale: 0.98 }}>
        {index === active && <motion.span className="sl-demo-active-indicator" layoutId="sl-demo-active-indicator" transition={indicatorSpring} aria-hidden="true" />}
        <span className="sl-demo-step-num">{index < active ? <Check size={15} /> : item.number}</span><span><strong>{item.title}</strong><small>{item.cue}</small></span>
      </motion.button>)}</div>
      <span className="sl-sr-only" role="status" aria-live="polite">Paso {active + 1} de {DEMO_STEPS.length}. {step.title}. {step.body}</span>
      <motion.div className="sl-demo-content" layout={!reduceMotion} transition={{ layout: { duration: 0.27 } }}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div className="sl-demo-main" key={step.id} initial={reduceMotion ? false : panelSwap.initial} animate={panelSwap.animate} exit={reduceMotion ? { opacity: 1, transition: { duration: 0 } } : panelSwap.exit}>
            <span className="sl-demo-status">{step.status}</span><h3>{step.title}</h3><p>{step.body}</p><div className="sl-demo-detail"><Sparkles size={17} aria-hidden="true" /><span>{step.detail}</span></div>
          </motion.div>
        </AnimatePresence>
        <aside className="sl-demo-rail"><span>EN ESTA CLASE</span><strong>Flujo de energía</strong><p>La actividad siempre conserva su relación con el material y la devolución.</p><div className="sl-demo-rail-progress"><motion.span animate={{ width: `${((active + 1) / DEMO_STEPS.length) * 100}%` }} transition={{ duration: reduceMotion ? 0 : 0.3, ease: 'easeOut' }} /></div><small>Paso {active + 1} de {DEMO_STEPS.length}</small></aside>
      </motion.div>
      <div className="sl-demo-controls"><button type="button" onClick={() => setActive(previousDemoStep(active))} disabled={active === 0}><ArrowLeft size={16} /> Anterior</button><span>Ejemplo de clase · Vista conceptual</span><button type="button" onClick={() => setActive(nextDemoStep(active))} disabled={active === DEMO_STEPS.length - 1}>Siguiente <ArrowRight size={16} /></button></div>
    </div>
  </div></section>;
}

function Benefits() {
  const reduceMotion = useReducedMotion();
  const [practiceChoice, setPracticeChoice] = useState(1);

  return (
    <section className="sl-benefits sl-section" id="beneficios" aria-labelledby="sl-benefits-title">
      <div className="sl-container">
        <SectionIntro
          eyebrow="03 / ACCIÓN"
          title="Encuentra. Entiende. Practica. Mejora."
          description="Cada parte de la clase te acerca a una acción concreta."
          id="sl-benefits-title"
        />

        {/* 01 / ENCONTRAR */}
        <motion.div
          className="sl-benefit-row"
          initial={reduceMotion ? false : { opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.25 }}
          transition={{ duration: 0.52, ease: 'easeOut' }}
        >
          <div className="sl-benefit-copy">
            <span>01 / ENCONTRAR</span>
            <h3>El material correcto, en el momento correcto.</h3>
            <p>Encuentra el recurso de una actividad sin abrir archivos innecesarios ni perder el hilo.</p>
          </div>
          <div className="sl-find-visual">
            <motion.div
              className="sl-search"
              whileHover={reduceMotion ? undefined : { scale: 1.01, borderColor: '#7c3aed' }}
              transition={{ duration: 0.2 }}
            >
              <Search size={18} />
              <span>flujo de energía</span>
              <span className="sl-search-badge">⌘ K</span>
            </motion.div>
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 14, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: false }}
              whileHover={reduceMotion ? undefined : { y: -3, scale: 1.015, boxShadow: '0 8px 24px rgba(124, 58, 237, 0.14)' }}
              transition={{ type: 'spring', stiffness: 280, damping: 22, delay: 0.15 }}
            >
              <FileText size={20} />
              <span>
                <strong>Productores y consumidores</strong>
                <small>Relacionado con la actividad actual · Pág. 10</small>
              </span>
              <motion.span
                animate={reduceMotion ? undefined : { scale: [1, 1.15, 1] }}
                transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 2 }}
                style={{ display: 'inline-flex' }}
              >
                <CheckCircle2 size={19} />
              </motion.span>
            </motion.div>
            <motion.div
              className="sl-find-dim"
              initial={reduceMotion ? false : { opacity: 0, y: 10 }}
              whileInView={{ opacity: 0.65, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <FileText size={18} /> Lecturas secundarias y notas anteriores (4 archivos)
            </motion.div>
          </div>
        </motion.div>

        {/* 02 & 03 PAIR */}
        <div className="sl-benefit-pair">
          {/* 02 / ENTENDER */}
          <motion.div
            className="sl-benefit-tile sl-understand"
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.25 }}
            whileHover={reduceMotion ? undefined : { y: -4 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <span>02 / ENTENDER</span>
            <h3>Comprende la consigna antes de empezar.</h3>
            <p>Una explicación breve señala qué hacer y qué revisar con precisión.</p>
            <blockquote>
              “Explica{' '}
              <motion.mark
                initial={reduceMotion ? false : { backgroundColor: 'rgba(237,233,254,0)', color: '#1e293b' }}
                whileInView={{ backgroundColor: '#ede9fe', color: '#5b21b6' }}
                viewport={{ once: false }}
                transition={{ duration: 0.45, delay: 0.25 }}
              >
                qué cambia
              </motion.mark>{' '}
              si disminuyen los productores.”
            </blockquote>
            <motion.div
              className="sl-inline-hint"
              initial={reduceMotion ? false : { opacity: 0, y: 12, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: false }}
              transition={{ type: 'spring', stiffness: 300, damping: 24, delay: 0.35 }}
            >
              <CircleHelp size={16} /> Compara la energía disponible antes y después.
            </motion.div>
          </motion.div>

          {/* 03 / PRACTICAR */}
          <motion.div
            className="sl-benefit-tile sl-practice"
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.25 }}
            whileHover={reduceMotion ? undefined : { y: -4 }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
          >
            <span>03 / PRACTICAR</span>
            <h3>Refuerza justo el concepto que necesitas.</h3>
            <p>Prueba una variación interactiva conectada directamente con el tema.</p>
            <div className="sl-practice-question">¿Qué organismo inicia el flujo de energía?</div>
            <div className="sl-practice-options" style={{ display: 'grid', gap: '8px' }}>
              <motion.button
                type="button"
                className={`sl-practice-btn${practiceChoice === 1 ? ' is-selected' : ''}`}
                onClick={() => setPracticeChoice(1)}
                whileHover={reduceMotion ? undefined : { scale: 1.015, x: 2 }}
                whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '11px 13px',
                  border: practiceChoice === 1 ? '1px solid #f97316' : '1px solid #e8ebf0',
                  borderRadius: '9px',
                  background: practiceChoice === 1 ? '#fff7ed' : '#fff',
                  color: practiceChoice === 1 ? '#9a3412' : '#334155',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  textAlign: 'left',
                  width: '100%'
                }}
              >
                <Check size={16} color={practiceChoice === 1 ? '#ea580c' : '#94a3b8'} />
                <span>Los productores</span>
                <AnimatePresence>
                  {practiceChoice === 1 && (
                    <motion.span
                      initial={reduceMotion ? false : { opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      style={{ marginLeft: 'auto', color: '#ea580c', fontSize: '10px', fontWeight: 700 }}
                    >
                      Correcto
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
              <motion.button
                type="button"
                className={`sl-practice-btn${practiceChoice === 0 ? ' is-selected' : ''}`}
                onClick={() => setPracticeChoice(0)}
                whileHover={reduceMotion ? undefined : { scale: 1.015, x: 2 }}
                whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '11px 13px',
                  border: practiceChoice === 0 ? '1px solid #be185d' : '1px solid #e8ebf0',
                  borderRadius: '9px',
                  background: practiceChoice === 0 ? '#fdf2f8' : '#fff',
                  color: practiceChoice === 0 ? '#9d174d' : '#334155',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  textAlign: 'left',
                  width: '100%'
                }}
              >
                <X size={16} color={practiceChoice === 0 ? '#db2777' : '#94a3b8'} />
                <span>Los consumidores primarios</span>
                <AnimatePresence>
                  {practiceChoice === 0 && (
                    <motion.span
                      initial={reduceMotion ? false : { opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      style={{ marginLeft: 'auto', color: '#db2777', fontSize: '10px', fontWeight: 700 }}
                    >
                      Intenta de nuevo
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* 04 / MEJORAR */}
        <motion.div
          className="sl-improve"
          initial={reduceMotion ? false : { opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.25 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
        >
          <div>
            <span>04 / MEJORAR</span>
            <h3>Un comentario puede convertirse en una ruta.</h3>
            <p>Convierte la devolución de tu profesor en pasos ordenados que puedas seguir con confianza.</p>
          </div>
          <div className="sl-improve-flow">
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false }}
              whileHover={reduceMotion ? undefined : { scale: 1.02 }}
              transition={{ duration: 0.4 }}
            >
              <MessageSquareText size={18} />
              <span>“Explica por qué los productores son importantes.”</span>
            </motion.div>
            <svg className="sl-improve-path" viewBox="0 0 16 32" aria-hidden="true" style={{ height: '32px' }}>
              <motion.path
                d="M8 2 V26 M3 21 L8 26 L13 21"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={reduceMotion ? false : { pathLength: 0, opacity: 0.3 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: false }}
                transition={{ duration: 0.7, ease: 'easeOut', delay: 0.2 }}
              />
            </svg>
            <motion.div
              className="is-action"
              initial={reduceMotion ? false : { opacity: 0, y: 12, scale: 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: false }}
              whileHover={reduceMotion ? undefined : { scale: 1.02, boxShadow: '0 8px 25px rgba(124, 58, 237, 0.45)' }}
              transition={{ delay: 0.5, type: 'spring', stiffness: 300, damping: 25 }}
            >
              <Compass size={18} />
              <span>Revisa el esquema · practica otro ejemplo</span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function AiSupport() {
  const [active, setActive] = useState(0);
  const reduceMotion = useReducedMotion();
  const help = AI_HELP[active];
  return (
    <section className="sl-ai sl-section" id="ia-para-aprender" aria-labelledby="sl-ai-title">
      <div className="sl-container sl-ai-container">
        <div className="sl-ai-layout">
        <motion.div
          className="sl-ai-copy"
          initial={reduceMotion ? false : { opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, amount: 0.25 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <span className="sl-eyebrow">AYUDA DENTRO DE LA CLASE</span>
          <h2 id="sl-ai-title">IA para comprender, <em>no para copiar.</em></h2>
          <p>Si una consigna o un comentario no queda claro, recibes una explicación conectada con el material de tu clase.</p>
          <div className="sl-ai-tabs" aria-label="Ejemplos de ayuda con IA">
            {AI_HELP.map((item, index) => (
              <motion.button
                key={item.title}
                type="button"
                className={index === active ? 'is-active' : ''}
                onClick={() => setActive(index)}
                aria-pressed={index === active}
                whileHover={reduceMotion ? undefined : { scale: 1.015, x: 3 }}
                whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                style={{ position: 'relative' }}
              >
                {index === active && (
                  <motion.span
                    layoutId="sl-ai-tab-active"
                    className="sl-ai-tab-indicator"
                    style={{
                      position: 'absolute',
                      inset: 0,
                      borderRadius: '10px',
                      border: '1px solid #ddd6fe',
                      background: '#fff',
                      boxShadow: '0 4px 14px rgba(124, 58, 237, 0.08)'
                    }}
                    transition={indicatorSpring}
                    aria-hidden="true"
                  />
                )}
                <span style={{ position: 'relative', zIndex: 1 }}>{item.title}</span>
                <ArrowRight size={15} style={{ position: 'relative', zIndex: 1 }} />
              </motion.button>
            ))}
          </div>
        </motion.div>

        <div className="sl-ai-right">
          <motion.div
            className="sl-ai-chat"
            layout={!reduceMotion}
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.25 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
          <div className="sl-ai-chat-head">
            <motion.span
              className="sl-ai-orb"
              animate={reduceMotion ? undefined : { rotate: [0, 8, -8, 0], scale: [1, 1.06, 1] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
            >
              <Sparkles size={18} />
            </motion.span>
            <div>
              <strong>Ayuda de Katedra</strong>
              <small>Contexto: Ecosistemas · Flujo de energía</small>
            </div>
          </div>
          <span className="sl-sr-only" role="status" aria-live="polite">
            {help.title}. {help.prompt} {help.answer} {help.action}
          </span>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              className="sl-ai-conversation"
              key={help.title}
              initial={reduceMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? { opacity: 1 } : { opacity: 0, y: -8 }}
              transition={{ duration: 0.24, ease: 'easeOut' }}
            >
              <motion.div
                className="sl-ai-message-user"
                initial={reduceMotion ? false : { opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                {help.prompt}
              </motion.div>
              <motion.div
                className="sl-ai-message"
                initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: 0.08 }}
              >
                <span><Sparkles size={15} /></span>
                <p>{help.answer}</p>
              </motion.div>
              <motion.div
                className="sl-ai-action"
                initial={reduceMotion ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: 0.16 }}
                whileHover={reduceMotion ? undefined : { scale: 1.03 }}
              >
                <BookOpen size={16} /> {help.action}
              </motion.div>
            </motion.div>
          </AnimatePresence>
          <div className="sl-ai-chat-foot">
            <LockKeyhole size={15} /> Tus respuestas siguen siendo tuyas.
          </div>
        </motion.div>
        </div>
        </div>
        <motion.div
          className="sl-image-wrapper sl-image-ai"
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
        >
          <motion.img
            src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1400"
            alt="Interfaz de aprendizaje en computadora"
            className="sl-dispersed-image"
            whileHover={reduceMotion ? undefined : { scale: 1.02 }}
            transition={{ duration: 0.4 }}
          />
        </motion.div>
      </div>
    </section>
  );
}

const FORM_OPTIONS = [
  'Aumenta la energía disponible para todos',
  'Disminuye la energía para los consumidores',
  'No cambia la cadena alimenticia',
];

function Forms() {
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const reduceMotion = useReducedMotion();
  const result = revealed ? getFormResult(selected) : null;
  const choose = (index) => { setSelected(index); setRevealed(false); };

  return (
    <section className="sl-forms sl-section" id="katedra-forms" aria-labelledby="sl-forms-title">
      <div className="sl-container sl-forms-layout">
        <motion.div
          className="sl-forms-copy"
          initial={reduceMotion ? false : { opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, amount: 0.25 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <span className="sl-eyebrow">KATEDRA FORMS</span>
          <h2 id="sl-forms-title">Una evaluación también puede mostrarte cómo avanzar.</h2>
          <p>Responde, comprende la explicación y descubre qué concepto conviene reforzar. El profesor decide cuándo mostrar resultados y si hay otro intento.</p>
          <motion.div
            className="sl-forms-note"
            whileHover={reduceMotion ? undefined : { x: 3 }}
          >
            <CheckCircle2 size={19} /> Una calificación no tiene que ser el final de la clase.
          </motion.div>
        </motion.div>

        <motion.div
          className="sl-forms-card"
          layout={!reduceMotion}
          initial={reduceMotion ? false : { opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.25 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <div className="sl-forms-top">
            <span>Katedra Forms</span>
            <small>Vista conceptual</small>
          </div>
          <div className="sl-forms-progress">
            <span>Pregunta 4 de 10</span>
            <span>40% del intento</span>
          </div>
          <div className="sl-progress-track">
            <motion.span
              initial={{ width: 0 }}
              whileInView={{ width: '40%' }}
              viewport={{ once: false }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          </div>
          <h3>¿Qué sucede si disminuye la población de productores en una cadena alimenticia?</h3>
          <div className="sl-form-options">
            {FORM_OPTIONS.map((option, index) => (
              <motion.button
                type="button"
                key={option}
                className={`${selected === index ? 'is-selected' : ''}${result && index === result.correctIndex ? ' is-correct' : ''}${result && selected === index && !result.correct ? ' is-incorrect' : ''}`}
                aria-pressed={selected === index}
                onClick={() => choose(index)}
                whileHover={reduceMotion ? undefined : { x: 3, scale: 1.005 }}
                whileTap={reduceMotion ? undefined : { scale: 0.985 }}
              >
                <span>{String.fromCharCode(65 + index)}</span>
                {option}
                {result && index === result.correctIndex && <small>Respuesta correcta</small>}
                {result && selected === index && !result.correct && <small>Tu respuesta</small>}
                {selected === index && !result && <Check size={17} />}
              </motion.button>
            ))}
          </div>
          <motion.button
            className="sl-form-submit"
            type="button"
            disabled={selected === null}
            onClick={() => setRevealed(true)}
            whileHover={reduceMotion || selected === null ? undefined : { scale: 1.02 }}
            whileTap={reduceMotion || selected === null ? undefined : { scale: 0.97 }}
          >
            {revealed ? 'Comprobar de nuevo' : 'Comprobar respuesta'} <ArrowRight size={16} />
          </motion.button>
          <span className="sl-sr-only" role="status" aria-live="polite">
            {result ? `${result.correct ? 'Respuesta correcta.' : 'Respuesta incorrecta.'} Los productores son el punto de entrada de energía. Siguiente paso: repasa el esquema y practica una variación.` : ''}
          </span>
          <AnimatePresence initial={false}>
            {result && (
              <motion.div
                className="sl-form-explanation"
                initial={reduceMotion ? false : { opacity: 0, y: 12, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={reduceMotion ? { opacity: 1 } : { opacity: 0, y: -6 }}
                transition={{ duration: 0.3, type: 'spring', stiffness: 300, damping: 25 }}
              >
                <strong>{result.correct ? 'Correcto. ' : 'Revisa el concepto. '}Los productores son el punto de entrada de energía.</strong>
                <p>Si disminuyen, hay menos energía disponible para los consumidores.</p>
                <span><RotateCcw size={15} /> Siguiente paso: repasa el esquema y practica una variación.</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}

function Connection() {
  const reduceMotion = useReducedMotion();
  const items = [
    ['Profesor', 'Publica el material'],
    ['Alumno', 'Estudia el tema'],
    ['Alumno', 'Responde'],
    ['Profesor', 'Retroalimenta'],
    ['Katedra', 'Organiza el siguiente paso'],
  ];

  const containerVariants = {
    rest: {},
    ready: {
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    rest: { opacity: 0, y: 20, scale: 0.94 },
    ready: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: 'spring', stiffness: 280, damping: 24 },
    },
  };

  return (
    <section className="sl-connection sl-section" id="conexion" aria-labelledby="sl-connection-title">
      <div className="sl-container">
        <SectionIntro
          eyebrow="04 / PROGRESO"
          title="Tu profesor da el contexto. Tú encuentras el camino."
          description="Katedra conecta lo que se enseña, lo que respondes y lo que puedes mejorar."
          id="sl-connection-title"
        />
        <motion.ol
          className="sl-connection-flow"
          variants={containerVariants}
          initial={reduceMotion ? false : 'rest'}
          whileInView="ready"
          viewport={{ once: false, amount: 0.2 }}
        >
          {items.map(([role, action], index) => (
            <motion.li
              key={`${role}-${action}`}
              className={index === items.length - 1 ? 'is-final' : ''}
              variants={itemVariants}
              whileHover={reduceMotion ? undefined : { y: -6, scale: 1.03 }}
              transition={{ duration: 0.2 }}
            >
              <motion.span
                className="sl-connection-icon"
                whileHover={reduceMotion ? undefined : { rotate: 8, scale: 1.1 }}
              >
                {role === 'Profesor' ? <GraduationCap size={20} /> : role === 'Alumno' ? <BookOpen size={20} /> : <Compass size={20} />}
              </motion.span>
              <span>
                <small>{role}</small>
                <strong>{action}</strong>
              </span>
            </motion.li>
          ))}
        </motion.ol>
      </div>
    </section>
  );
}

function Comparison() {
  const reduceMotion = useReducedMotion();
  const features = [
    { name: 'Organizar clases y temas', classroom: true, teams: true, katedra: true, katedraOnly: false },
    { name: 'Asignar tareas y entregas', classroom: true, teams: true, katedra: true, katedraOnly: false },
    { name: 'Subir materiales y archivos', classroom: true, teams: true, katedra: true, katedraOnly: false },
    { name: 'IA para explicar dudas', classroom: false, teams: false, katedra: true, katedraOnly: true },
    { name: 'Sugerencia automática de siguientes pasos', classroom: false, teams: false, katedra: true, katedraOnly: true },
    { name: 'Ruta de aprendizaje basada en feedback', classroom: false, teams: false, katedra: true, katedraOnly: true },
  ];

  return (
    <section className="sl-comparison sl-section" id="comparativa" aria-labelledby="sl-comparison-title">
      <div className="sl-container">
        <SectionIntro
          eyebrow="04 / LA DIFERENCIA"
          title="Lo que ya conoces, y lo que Katedra añade."
          description="Las plataformas tradicionales administran archivos. Katedra acompaña tu aprendizaje."
          id="sl-comparison-title"
        />

        <motion.div
          className="sl-comparison-table-wrapper"
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <table className="sl-comparison-table">
            <thead>
              <tr>
                <th className="sl-comp-feat-head">Característica</th>
                <th>
                  <div className="sl-comp-head">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/5/59/Google_Classroom_Logo.png" alt="Google Classroom" width="22" height="22" />
                    <span>Classroom</span>
                  </div>
                </th>
                <th>
                  <div className="sl-comp-head">
                    <BsMicrosoftTeams className="sl-comp-teams-icon" aria-hidden="true" />
                    <span>Teams</span>
                  </div>
                </th>
                <th className="sl-comp-katedra sl-comp-katedra-head">
                  <div className="sl-comp-head">
                    <span className="sl-brand-mark" style={{ width: 22, height: 22, fontSize: 12, borderRadius: 6 }}>K</span>
                    <span>Katedra</span>
                  </div>
                  <span className="sl-comp-badge">Lo que añade</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {features.map((feat, i) => (
                <motion.tr
                  key={feat.name}
                  className={feat.katedraOnly ? 'sl-comp-row-highlight' : ''}
                  initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ delay: i * 0.06, duration: 0.35 }}
                >
                  <td className="sl-comp-feat-name">
                    {feat.katedraOnly && <span className="sl-comp-new-tag">Nuevo</span>}
                    {feat.katedraOnly ? ' ' : null}
                    {feat.name}
                  </td>
                  <td>
                    {feat.classroom
                      ? <span className="sl-comp-check sl-comp-check-yes" aria-label="Disponible"><CheckCircle2 size={18} /></span>
                      : <span className="sl-comp-check sl-comp-check-no" aria-label="No disponible"><X size={16} /></span>}
                  </td>
                  <td>
                    {feat.teams
                      ? <span className="sl-comp-check sl-comp-check-yes" aria-label="Disponible"><CheckCircle2 size={18} /></span>
                      : <span className="sl-comp-check sl-comp-check-no" aria-label="No disponible"><X size={16} /></span>}
                  </td>
                  <td className="sl-comp-katedra">
                    {feat.katedra
                      ? <span className="sl-comp-check sl-comp-check-katedra" aria-label="Disponible en Katedra"><CheckCircle2 size={18} /></span>
                      : <span className="sl-comp-check sl-comp-check-no" aria-label="No disponible"><X size={16} /></span>}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>
    </section>
  );
}

function Trust() {
  const reduceMotion = useReducedMotion();
  return (
    <section className="sl-trust sl-section" aria-labelledby="sl-trust-title">
      <div className="sl-container">
        <motion.div
          className="sl-trust-intro"
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.45 }}
        >
          <span className="sl-eyebrow">CON CLARIDAD Y CONTROL</span>
          <h2 id="sl-trust-title">La ayuda funciona dentro de las reglas de tu clase.</h2>
        </motion.div>

        <motion.div
          className="sl-trust-points"
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <p>
            <GraduationCap size={20} />
            <span>Tu profesor define los materiales, las actividades y los intentos.</span>
          </p>
          <p>
            <Layers3 size={20} />
            <span>La IA trabaja con el contexto de la clase y ayuda a comprender.</span>
          </p>
          <p>
            <LockKeyhole size={20} />
            <span>Tus respuestas son tuyas. Katedra no cambia la calificación ni reemplaza el criterio docente.</span>
          </p>
        </motion.div>

        <motion.div
          className="sl-trust-image"
          initial={reduceMotion ? false : { opacity: 0, x: 20, scale: 0.97 }}
          whileInView={{ opacity: 1, x: 0, scale: 1 }}
          viewport={{ once: false }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <motion.img
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=700"
            alt="Estudiantes colaborando"
            className="sl-dispersed-image"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.4 }}
          />
        </motion.div>
      </div>
    </section>
  );
}

const FAQ = [
  ['¿Ya puedo crear una cuenta de alumno?', 'Todavía no. La experiencia para alumnos está en desarrollo; el registro disponible actualmente es para profesores.'],
  ['¿Cuándo estará disponible?', 'Aún no hay una fecha anunciada. Esta página muestra una vista conceptual de la experiencia prevista.'],
  ['¿La IA hace mis tareas?', 'No. Puede explicar consignas, aclarar comentarios y proponer práctica. Tus respuestas siguen siendo tuyas.'],
  ['¿Quién controla los materiales?', 'El profesor selecciona y organiza los materiales y define las reglas de las actividades.'],
  ['¿Cómo recibiré la retroalimentación?', 'La propuesta reúne el comentario del profesor con tu actividad y señala material relacionado para continuar.'],
  ['¿Katedra reemplaza al profesor?', 'No. El profesor dirige la clase y conserva el criterio sobre actividades, evaluación e intentos.'],
  ['¿Qué es Katedra Forms?', 'Es la experiencia de evaluaciones prevista para la clase: pregunta, respuesta y, cuando el profesor lo permita, explicación y refuerzo.'],
];

function Faq() {
  const [open, setOpen] = useState(0);
  const reduceMotion = useReducedMotion();
  return (
    <section className="sl-faq sl-section" id="preguntas" aria-labelledby="sl-faq-title">
      <div className="sl-container sl-faq-layout">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.45 }}
        >
          <span className="sl-eyebrow">PREGUNTAS FRECUENTES</span>
          <h2 id="sl-faq-title">Lo que conviene saber antes de empezar.</h2>
          <p>La experiencia para alumnos sigue en desarrollo.</p>
        </motion.div>
        <div className="sl-faq-list">
          {FAQ.map(([question, answer], index) => (
            <motion.div className="sl-faq-item" key={question} layout={!reduceMotion}>
              <h3>
                <button
                  type="button"
                  aria-expanded={open === index}
                  aria-controls={`sl-faq-${index}`}
                  onClick={() => setOpen(open === index ? -1 : index)}
                >
                  {question}
                  <motion.span
                    animate={{ rotate: open === index ? 180 : 0 }}
                    transition={{ duration: 0.25 }}
                    style={{ display: 'inline-flex' }}
                  >
                    <ChevronDown size={20} />
                  </motion.span>
                </button>
              </h3>
              <div id={`sl-faq-${index}`} aria-hidden={open !== index} className="sl-faq-panel">
                <AnimatePresence initial={false}>
                  {open === index && (
                    <motion.div
                      className="sl-faq-answer"
                      initial={reduceMotion ? false : { height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={reduceMotion ? { height: 0, opacity: 0 } : { height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: 'easeOut' }}
                    >
                      <p>{answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Waitlist() {
  const reduceMotion = useReducedMotion();
  return (
    <section className="sl-final" id="aviso" aria-labelledby="sl-final-title">
      <motion.div
        className="sl-container sl-final-card"
        initial={reduceMotion ? false : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.25 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div>
          <span className="sl-pill">PRÓXIMAMENTE PARA ALUMNOS</span>
          <h2 id="sl-final-title">Cuando sabes qué sigue, puedes seguir aprendiendo.</h2>
          <p>Estamos preparando una experiencia que reúna el material, tu trabajo y la ruta para mejorar.</p>
          <motion.a
            className="sl-button sl-button-primary"
            href={PRIMARY_CTA.href}
            whileHover={reduceMotion ? undefined : { scale: 1.03 }}
            whileTap={reduceMotion ? undefined : { scale: 0.98 }}
          >
            {PRIMARY_CTA.label} <ArrowRight size={17} />
          </motion.a>
          <a className="sl-final-secondary" href="#la-duda">
            Ver cómo se organiza una clase <ArrowRight size={16} />
          </a>
        </div>
        <div className="sl-availability">
          <span className="sl-availability-icon"><Compass size={25} /></span>
          <strong>La experiencia para alumnos está en desarrollo.</strong>
          <p>El registro de interés aún no está habilitado. Mientras tanto, explora la clase de ejemplo y conoce la ruta que estamos preparando.</p>
          <span>Vista conceptual · No recopilamos tu correo</span>
        </div>
      </motion.div>
    </section>
  );
}

function Footer() {
  return <footer className="sl-footer"><div className="sl-container"><div className="sl-footer-main"><div><Brand /><p>Katedra reúne la clase, el trabajo y la retroalimentación para ayudarte a reconocer tu siguiente paso.</p><span>Experiencia para alumnos en desarrollo.</span></div><nav aria-label="Navegación del pie de página"><a href="#como-funciona">Cómo funciona</a><a href="#ia-para-aprender">IA para aprender</a><a href="#katedra-forms">Katedra Forms</a><a href="#preguntas">Preguntas</a><a href="/">Para profesores</a></nav></div><div className="sl-footer-bottom"><span>© {new Date().getFullYear()} Katedra</span><a href="#privacidad">Privacidad</a><a href="#terminos">Términos</a></div><div className="sl-footer-disclosures"><p id="privacidad"><strong>Privacidad:</strong> esta vista no recibe ni almacena datos. Publicaremos la información aplicable antes de habilitar el registro.</p><p id="terminos"><strong>Términos:</strong> la experiencia para alumnos aún no está disponible. La demo es conceptual.</p></div></div></footer>;
}

export default function StudentLandingExperience() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const reduceMotion = useReducedMotion();

  return (
    <MotionConfig reducedMotion="user">
      <div className="sl-page">
        <motion.div
          className="sl-scroll-progress"
          style={reduceMotion ? undefined : { scaleX }}
          aria-hidden="true"
        />
        <a className="sl-skip" href="#contenido">Saltar al contenido</a>
        <Header />
        <main id="contenido">
          <Hero />
          <Problem />
          <Demo />
          <Benefits />
          <AiSupport />
          <Forms />
          <Connection />
          <Comparison />
          <Trust />
          <Faq />
          <Waitlist />
        </main>
        <Footer />
      </div>
    </MotionConfig>
  );
}

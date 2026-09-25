import { useEffect, useRef, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import { ArrowRight, Menu, MessageCircle, Search, Send, X } from 'lucide-react';
import { getStudentChatReply, STUDENT_CHAT_SUGGESTIONS } from '../studentPortal.js';
import { useAuth } from '../../../app/hooks/useAuth.js';
import './StudentLandingExperience.css';
import './StudentPortal.css';

const MAIN_LINKS = [
  { label: 'Cómo funciona', to: '/alumnos#como-funciona' },
  { label: 'Materiales', to: '/alumnos#beneficios' },
  { label: 'IA para aprender', to: '/alumnos#ia-para-aprender' },
  { label: 'Preguntas', to: '/alumnos#preguntas' },
];

function Brand() {
  return <Link className="sl-brand" to="/alumnos" aria-label="Katedra Alumnos, ir al inicio"><span className="sl-brand-mark" aria-hidden="true">K</span>Katedra <span className="sl-brand-sub">Alumnos</span></Link>;
}

function StudentHeader({ auth = false }) {
  const { user, isAuthenticated } = useAuth();
  const studentSignedIn = isAuthenticated && user?.rol === 'ROLE_ALUMNO';
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuButton = useRef(null);
  const searchButton = useRef(null);
  const searchInput = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 28);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  useEffect(() => { if (searchOpen) searchInput.current?.focus(); }, [searchOpen]);
  useEffect(() => {
    if (!open && !searchOpen) return undefined;
    const onEscape = (event) => {
      if (event.key === 'Escape') {
        setOpen(false);
        setSearchOpen(false);
        if (searchOpen && window.innerWidth > 1180) searchButton.current?.focus();
        else menuButton.current?.focus();
      }
    };
    document.addEventListener('keydown', onEscape);
    return () => document.removeEventListener('keydown', onEscape);
  }, [open, searchOpen]);

  const submitSearch = (event) => {
    event.preventDefault();
    const query = new FormData(event.currentTarget).get('q').trim();
    setSearchOpen(false);
    setOpen(false);
    navigate('/alumnos/buscar' + (query ? '?q=' + encodeURIComponent(query) : ''));
  };

  return <header className={'sl-header sl-site-header' + (auth ? ' sl-site-header-auth' : '') + (scrolled || open || searchOpen || location.pathname !== '/alumnos' ? ' is-scrolled' : '')}>
    <div className="sl-site-nav">
      <Brand />
      {!auth && <>
        <nav className="sl-site-main-links" aria-label="Secciones de Katedra Alumnos">
          {MAIN_LINKS.map(({ label, to }) => <Link key={to} to={to}>{label}</Link>)}
        </nav>
        <button ref={searchButton} className="sl-site-search-toggle" type="button" aria-label="Abrir búsqueda" aria-expanded={searchOpen} aria-controls="sl-site-search-panel" onClick={() => { setSearchOpen(!searchOpen); setOpen(false); }}><Search size={18} aria-hidden="true" /><span>Buscar</span></button>
        <Link className="sl-site-forms" to="/alumnos/forms">Katedra Forms <ArrowRight size={14} aria-hidden="true" /></Link>
      </>}
      <div className="sl-site-tools">
        {studentSignedIn ? <Link className="sl-site-register" to="/alumnos/mi-cuenta">Mi cuenta</Link> : <>
        <Link className="sl-site-login" to="/alumnos/iniciar-sesion" aria-current={location.pathname === '/alumnos/iniciar-sesion' ? 'page' : undefined}>Iniciar sesión</Link>
        <Link className="sl-site-register" to="/alumnos/crear-cuenta" aria-current={location.pathname === '/alumnos/crear-cuenta' ? 'page' : undefined}>Crear cuenta</Link>
        </>}
      </div>
      {!auth && <button ref={menuButton} className="sl-site-menu-button" type="button" aria-expanded={open} aria-controls="sl-site-mobile-nav" aria-label={open ? 'Cerrar menú' : 'Abrir menú'} onClick={() => { setOpen(!open); setSearchOpen(false); }}>{open ? <X size={23} /> : <Menu size={23} />}</button>}
    </div>
    {!auth && <>
      <div id="sl-site-search-panel" className="sl-site-search-panel" hidden={!searchOpen}>
        <form role="search" onSubmit={submitSearch}><label htmlFor="sl-site-search-input">Buscar en Katedra Alumnos</label><div><Search size={20} aria-hidden="true" /><input id="sl-site-search-input" ref={searchInput} name="q" type="search" placeholder="Busca temas, IA, Forms o materiales" /><button type="submit">Buscar <ArrowRight size={16} aria-hidden="true" /></button></div></form>
        <p>Busca entre las secciones y preguntas de la experiencia de alumnos.</p>
      </div>
      <nav id="sl-site-mobile-nav" className="sl-site-mobile-nav" aria-label="Menú de Katedra Alumnos" hidden={!open}>
        {MAIN_LINKS.map(({ label, to }) => <Link key={to} to={to} onClick={() => setOpen(false)}>{label}</Link>)}
        <button type="button" onClick={() => { setOpen(false); setSearchOpen(true); }}>Buscar en Alumnos <Search size={17} aria-hidden="true" /></button>
        <Link className="sl-site-forms" to="/alumnos/forms" onClick={() => setOpen(false)}>Katedra Forms <ArrowRight size={15} aria-hidden="true" /></Link>
        {studentSignedIn ? <Link to="/alumnos/mi-cuenta" onClick={() => setOpen(false)}>Mi cuenta</Link> : <>
          <Link to="/alumnos/iniciar-sesion" onClick={() => setOpen(false)}>Iniciar sesión</Link>
          <Link to="/alumnos/crear-cuenta" onClick={() => setOpen(false)}>Crear cuenta</Link>
        </>}
        <Link to="/alumnos/mapa-del-sitio" onClick={() => setOpen(false)}>Mapa del sitio</Link>
        <Link to="/alumnos/contacto" onClick={() => setOpen(false)}>Contáctanos</Link>
      </nav>
    </>}
  </header>;
}

function StudentFooter() {
  return <footer className="sl-footer">
    <div className="sl-container">
      <div className="sl-footer-main">
        <div><Brand /><p>Katedra reúne la clase, el trabajo y la retroalimentación para ayudarte a reconocer tu siguiente paso.</p></div>
        <nav aria-label="Navegación del pie de página">
          <Link to="/alumnos#como-funciona">Cómo funciona</Link>
          <Link to="/alumnos#ia-para-aprender">IA para aprender</Link>
          <Link to="/alumnos/forms">Katedra Forms</Link>
          <Link to="/alumnos/buscar">Buscar</Link>
          <Link to="/alumnos/contacto">Contáctanos</Link>
          <Link to="/alumnos/mapa-del-sitio">Mapa del sitio</Link>
          <Link to="/alumnos/recuperar-contrasena">Recuperar contraseña</Link>
          <Link to="/">Para profesores</Link>
        </nav>
      </div>
      <div className="sl-footer-bottom"><span>© {new Date().getFullYear()} Katedra</span><a href="#privacidad">Privacidad</a><a href="#terminos">Términos</a></div>
      <div className="sl-footer-disclosures">
        <p id="privacidad"><strong>Privacidad:</strong> el registro y el inicio de sesión envían tus datos al servidor de Katedra. La búsqueda y el chat de esta página funcionan en tu navegador.</p>
        <p id="terminos"><strong>Términos:</strong> tu cuenta te permite acceder a Katedra Alumnos. La incorporación a clases y las actividades se habilitan por separado.</p>
      </div>
    </div>
  </footer>;
}

function StudentChatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const launcher = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);
  useEffect(() => {
    if (!open) return undefined;
    const onEscape = (event) => {
      if (event.key === 'Escape') {
        setOpen(false);
        launcher.current?.focus();
      }
    };
    document.addEventListener('keydown', onEscape);
    return () => document.removeEventListener('keydown', onEscape);
  }, [open]);

  const send = (question) => {
    const cleaned = question.trim();
    if (!cleaned) return;
    setMessages((current) => [...current, { question: cleaned, answer: getStudentChatReply(cleaned) }]);
    setInput('');
  };

  return <div className="sl-chatbot">
    {open && <section className="sl-chat-panel" role="dialog" aria-label="Ayuda de Katedra Alumnos">
      <div className="sl-chat-heading"><div><strong>Ayuda</strong><span>Respuestas rápidas</span></div><button type="button" aria-label="Cerrar chat" onClick={() => { setOpen(false); launcher.current?.focus(); }}><X size={18} /></button></div>
      <div className="sl-chat-messages" aria-live="polite">
        <p className="sl-chat-greeting">Hola. ¿En qué puedo ayudarte?</p>
        {messages.map(({ question, answer }, index) => <div className="sl-chat-exchange" key={index}><p className="sl-chat-question">{question}</p><p className="sl-chat-answer">{answer}</p></div>)}
      </div>
      <div className="sl-chat-suggestions">{STUDENT_CHAT_SUGGESTIONS.map((question) => <button type="button" key={question} onClick={() => send(question)}>{question}</button>)}</div>
      <form className="sl-chat-entry" onSubmit={(event) => { event.preventDefault(); send(input); }}>
        <label className="sl-sr-only" htmlFor="sl-chat-input">Escribe una pregunta</label>
        <input id="sl-chat-input" ref={inputRef} value={input} onChange={(event) => setInput(event.target.value)} placeholder="Escribe una pregunta" maxLength={180} />
        <button type="submit" disabled={!input.trim()} aria-label="Enviar pregunta"><Send size={17} /></button>
      </form>
    </section>}
    <button ref={launcher} className="sl-chat-launcher" type="button" aria-label={open ? 'Cerrar ayuda' : 'Abrir ayuda'} aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X size={23} /> : <MessageCircle size={23} />}<span>Chat</span></button>
  </div>;
}

export default function StudentLayout() {
  const location = useLocation();
  const auth = location.pathname === '/alumnos/iniciar-sesion' || location.pathname === '/alumnos/crear-cuenta';

  useEffect(() => {
    if (location.hash) {
      requestAnimationFrame(() => document.getElementById(location.hash.slice(1))?.scrollIntoView());
    } else {
      window.scrollTo(0, 0);
    }
  }, [location.pathname, location.hash]);

  return <MotionConfig reducedMotion="user"><div className={auth ? "sl-page sl-auth-shell" : "sl-page"}>
    <a className="sl-skip" href="#contenido">Saltar al contenido</a>
    <StudentHeader key={location.pathname + location.hash} auth={auth} />
    <Outlet />
    {!auth && <StudentFooter />}
    <StudentChatbot />
  </div></MotionConfig>;
}

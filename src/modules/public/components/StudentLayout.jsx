import { useEffect, useRef, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import { Menu, MessageCircle, Search, Send, X } from 'lucide-react';
import { getStudentChatReply, STUDENT_CHAT_SUGGESTIONS } from '../studentPortal.js';
import { useAuth } from '../../../app/hooks/useAuth.js';
import LandingHeader from '../../../app/components/LandingHeader';
import { ghostButtonHover, ghostButtonStyle } from '../../../app/components/landing/landingStyles';
import LandingFooter from '../../../app/components/landing/LandingFooter';
import LandingGlobalStyles from '../../../app/components/landing/LandingGlobalStyles';
import { STUDENT_THEME } from '../../../app/components/landing/landingTheme';
import { STUDENT_FAQ_LINK, STUDENT_FOOTER_BOTTOM_LINKS, STUDENT_FOOTER_COLUMNS, STUDENT_LINKS } from './landing/studentLandingContent';
import './StudentLandingExperience.css';
import './StudentPortal.css';

const SECTION_LINKS = [...STUDENT_LINKS, STUDENT_FAQ_LINK];
const SEARCH_QUICK_LINKS = [...SECTION_LINKS, { label: 'Mapa del sitio', to: '/alumnos/mapa-del-sitio' }];
const MENU_PANEL_STYLE = { position: 'absolute', top: 'calc(100% + 10px)', left: 0, width: '100%' };

function StudentHeader({ auth = false }) {
  const { user, isAuthenticated } = useAuth();
  const studentSignedIn = isAuthenticated && user?.rol === 'ROLE_ALUMNO';
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const menuButton = useRef(null);
  const searchButton = useRef(null);
  const searchInput = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => { if (searchOpen) searchInput.current?.focus(); }, [searchOpen]);
  useEffect(() => {
    if (!open && !searchOpen) return undefined;
    const onEscape = (event) => {
      if (event.key === 'Escape') {
        setOpen(false);
        setSearchOpen(false);
        if (searchOpen && window.innerWidth > 820) searchButton.current?.focus();
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

  const current = (path) => location.pathname === path;
  const actions = studentSignedIn
    ? [{ label: 'Mi cuenta', to: '/alumnos/mi-cuenta', variant: 'primary', current: current('/alumnos/mi-cuenta') }]
    : [
      { label: 'Acceder', to: '/alumnos/iniciar-sesion', variant: 'ghost', current: current('/alumnos/iniciar-sesion') },
      { label: 'Registrarse', to: '/alumnos/crear-cuenta', variant: 'primary', current: current('/alumnos/crear-cuenta') },
    ];

  return <LandingHeader
    navigate={navigate}
    theme={STUDENT_THEME}
    ariaLabel="Navegación de Katedra Alumnos"
    brandTo="/alumnos"
    brandSuffix="Alumnos"
    links={auth ? [] : STUDENT_LINKS}
    crossLink={auth ? null : { label: 'Para profesores', to: '/' }}
    actions={actions}
    forceScrolled={open || searchOpen || location.pathname !== '/alumnos'}
    renderExtraActions={auth ? undefined : (scrolled) => <button ref={searchButton} className="sl-search-toggle" type="button" aria-label="Buscar en Katedra Alumnos" aria-expanded={searchOpen} aria-controls="sl-site-search-panel" onClick={() => { setSearchOpen(!searchOpen); setOpen(false); }} style={{ ...ghostButtonStyle(scrolled), display: 'grid', placeItems: 'center', width: '38px', height: '38px', padding: 0, cursor: 'pointer' }} {...ghostButtonHover(scrolled)}><Search size={17} aria-hidden="true" /></button>}
    renderTrailing={auth ? undefined : (scrolled) => <button ref={menuButton} className="sl-menu-button" type="button" aria-expanded={open} aria-controls="sl-site-mobile-nav" aria-label={open ? 'Cerrar menú' : 'Abrir menú'} onClick={() => { setOpen(!open); setSearchOpen(false); }} style={{ ...ghostButtonStyle(scrolled), padding: '8px', cursor: 'pointer' }}>{open ? <X size={20} /> : <Menu size={20} />}</button>}
  >
    {!auth && <>
      <div id="sl-site-search-panel" className="sl-site-search-panel" hidden={!searchOpen}>
        <form role="search" onSubmit={submitSearch}>
          <label htmlFor="sl-site-search-input">Buscar en Katedra Alumnos</label>
          <div className="sl-search-field"><Search size={18} aria-hidden="true" /><input id="sl-site-search-input" ref={searchInput} name="q" type="search" placeholder="Busca temas, IA, Forms o materiales" autoComplete="off" /><button type="submit">Buscar</button></div>
        </form>
        <div className="sl-search-quick"><span>Ir a</span>{SEARCH_QUICK_LINKS.map(({ label, to }) => <Link key={to} to={to} onClick={() => setSearchOpen(false)}>{label}</Link>)}</div>
      </div>
      <div id="sl-site-mobile-nav" className="sl-site-mobile-nav" style={MENU_PANEL_STYLE} hidden={!open}>
        {SECTION_LINKS.map(({ label, to }) => <Link key={to} to={to} onClick={() => setOpen(false)}>{label}</Link>)}
        <button type="button" onClick={() => { setOpen(false); setSearchOpen(true); }}>Buscar en Alumnos <Search size={17} aria-hidden="true" /></button>
        {studentSignedIn ? <Link to="/alumnos/mi-cuenta" onClick={() => setOpen(false)}>Mi cuenta</Link> : <>
          <Link to="/alumnos/iniciar-sesion" onClick={() => setOpen(false)}>Acceder</Link>
          <Link to="/alumnos/crear-cuenta" onClick={() => setOpen(false)}>Registrarse</Link>
        </>}
        <Link to="/alumnos/mapa-del-sitio" onClick={() => setOpen(false)}>Mapa del sitio</Link>
        <Link to="/alumnos/contacto" onClick={() => setOpen(false)}>Contáctanos</Link>
        <Link to="/" onClick={() => setOpen(false)}>Para profesores</Link>
      </div>
    </>}
  </LandingHeader>;
}

function StudentFooter() {
  const navigate = useNavigate();
  return <LandingFooter
    navigate={navigate}
    theme={STUDENT_THEME}
    brandSuffix="Alumnos"
    description="Katedra reúne la clase, el trabajo y la retroalimentación para ayudarte a reconocer tu siguiente paso."
    crossLink={{ label: 'Conoce Katedra para profesores →', to: '/' }}
    columns={STUDENT_FOOTER_COLUMNS}
    copyright={`© ${new Date().getFullYear()} Katedra. Todos los derechos reservados.`}
    bottomLinks={STUDENT_FOOTER_BOTTOM_LINKS}
  >
    <div className="sl-footer-disclosures">
      <p id="privacidad"><strong>Privacidad:</strong> el registro y el inicio de sesión envían tus datos al servidor de Katedra. La búsqueda y el chat de esta página funcionan en tu navegador.</p>
      <p id="terminos"><strong>Términos:</strong> tu cuenta te permite acceder a Katedra Alumnos. La incorporación a clases y las actividades se habilitan por separado.</p>
    </div>
  </LandingFooter>;
}

const REPLY_DELAY_MS = 650;

function StudentChatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const launcher = useRef(null);
  const inputRef = useRef(null);
  const scroller = useRef(null);
  const timers = useRef(new Set());
  const nextId = useRef(0);

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);
  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);
  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight });
  }, [messages, open]);
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

  const typing = messages.some((message) => message.answer === null);

  const send = (question) => {
    const cleaned = question.trim();
    if (!cleaned || typing) return;
    const id = nextId.current++;
    const answer = getStudentChatReply(cleaned);
    const instant = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    setMessages((current) => [...current, { id, question: cleaned, answer: instant ? answer : null }]);
    setInput('');
    if (instant) return;
    const timer = setTimeout(() => {
      timers.current.delete(timer);
      setMessages((current) => current.map((message) => (message.id === id ? { ...message, answer } : message)));
    }, REPLY_DELAY_MS);
    timers.current.add(timer);
  };

  return <div className="sl-chatbot">
    {open && <section className="sl-chat-panel" role="dialog" aria-label="Ayuda de Katedra Alumnos">
      <div className="sl-chat-heading">
        <span className="sl-chat-avatar" aria-hidden="true">K</span>
        <div><strong>Katedra Ayuda</strong><span><i aria-hidden="true" /> Respuestas rápidas</span></div>
        <button type="button" aria-label="Cerrar chat" onClick={() => { setOpen(false); launcher.current?.focus(); }}><X size={18} /></button>
      </div>
      <div className="sl-chat-messages" ref={scroller} aria-live="polite">
        <p className="sl-chat-bot">Hola. Soy la ayuda de Katedra Alumnos. ¿En qué puedo ayudarte?</p>
        {messages.map(({ id, question, answer }) => <div className="sl-chat-exchange" key={id}>
          <p className="sl-chat-user">{question}</p>
          {answer === null ? <p className="sl-chat-bot sl-chat-typing" role="status" aria-label="Escribiendo respuesta"><span /><span /><span /></p> : <p className="sl-chat-bot">{answer}</p>}
        </div>)}
      </div>
      <div className="sl-chat-suggestions">{STUDENT_CHAT_SUGGESTIONS.map((question) => <button type="button" key={question} disabled={typing} onClick={() => send(question)}>{question}</button>)}</div>
      <form className="sl-chat-entry" onSubmit={(event) => { event.preventDefault(); send(input); }}>
        <label className="sl-sr-only" htmlFor="sl-chat-input">Escribe una pregunta</label>
        <input id="sl-chat-input" ref={inputRef} value={input} onChange={(event) => setInput(event.target.value)} placeholder="Escribe una pregunta" maxLength={180} autoComplete="off" />
        <button type="submit" disabled={!input.trim() || typing} aria-label="Enviar pregunta"><Send size={16} /></button>
      </form>
    </section>}
    <button ref={launcher} className="sl-chat-launcher" type="button" aria-label={open ? 'Cerrar ayuda' : 'Abrir ayuda'} aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X size={20} /> : <MessageCircle size={20} />}<span>Ayuda</span></button>
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
    <LandingGlobalStyles />
    <StudentHeader key={location.pathname + location.hash} auth={auth} />
    <Outlet />
    {!auth && <StudentFooter />}
    <StudentChatbot />
  </div></MotionConfig>;
}

import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowRight, BookOpen, ClipboardCheck, Eye, EyeOff, LockKeyhole, Mail, Map, Search, Sparkles } from 'lucide-react';
import { searchStudentContent, validateStudentAccess, validateStudentPasswordReset, validateStudentRecoveryEmail } from '../studentPortal.js';
import { requestStudentPasswordReset, resetStudentPassword } from '../services/studentPasswordRecoveryService.js';
import { useAuth } from '../../../app/hooks/useAuth.js';
import StudentAuthFrame from '../components/StudentAuthFrame.jsx';

function PageHeading({ eyebrow, title, description, icon: Icon }) {
  return <div className="sl-portal-heading">
    <span className="sl-portal-eyebrow">{Icon && <Icon size={17} aria-hidden="true" />}{eyebrow}</span>
    <h1>{title}</h1>
    <p>{description}</p>
  </div>;
}

function DemoNotice({ children }) {
  return <div className="sl-portal-notice"><Sparkles size={18} aria-hidden="true" /><span>{children}</span></div>;
}

export function StudentAuthPage({ mode }) {
  const register = mode === 'register';
  const navigate = useNavigate();
  const { login, registerStudent, loading, error: authError, clearError } = useAuth();
  const [fields, setFields] = useState({ nombre: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const update = (field, value) => {
    setFields((current) => ({ ...current, [field]: value }));
    setError('');
    clearError();
  };
  const submit = async (event) => {
    event.preventDefault();
    const validation = validateStudentAccess(mode, fields);
    if (validation) {
      setError(validation);
      return;
    }
    setError('');
    const success = register
      ? await registerStudent(fields.email.trim(), fields.password, fields.nombre.trim())
      : await login(fields.email.trim(), fields.password, Date.now(), 'ROLE_ALUMNO');
    if (success) navigate('/alumnos/panel', { replace: true });
    else setFields((current) => ({ ...current, password: '', confirmPassword: '' }));
  };

  return <StudentAuthFrame
    eyebrow="Katedra Alumnos"
    headline={register ? 'Crea tu cuenta de alumno.' : 'Entra a tu cuenta.'}
    lead={register ? 'Solo necesitas tu nombre, correo y una contraseña.' : 'Revisa tus clases, entregas y retroalimentación en un solo lugar.'}
    title={register ? 'Crea tu cuenta' : 'Inicia sesión en tu cuenta'}
    description={register ? 'Empieza a aprender con Katedra.' : 'Bienvenido de nuevo. Continúa con tus clases.'}
  >
    <form onSubmit={submit} noValidate>
      {register && <div className="sl-portal-field"><label htmlFor="sl-auth-name">Nombre completo</label><input id="sl-auth-name" type="text" autoComplete="name" value={fields.nombre} onChange={(event) => update('nombre', event.target.value)} placeholder="Tu nombre" disabled={loading} /></div>}
      <div className="sl-portal-field"><label htmlFor="sl-auth-email">Correo electrónico</label><input id="sl-auth-email" type="email" autoComplete="email" value={fields.email} onChange={(event) => update('email', event.target.value)} placeholder="tu@escuela.edu" disabled={loading} /></div>
      <div className="sl-portal-field">
        <div className="sl-portal-label-row"><label htmlFor="sl-auth-password">Contraseña</label>{!register && <Link to="/alumnos/recuperar-contrasena">¿La olvidaste?</Link>}</div>
        <div className="sl-portal-password-wrap"><input id="sl-auth-password" type={showPassword ? 'text' : 'password'} autoComplete={register ? 'new-password' : 'current-password'} value={fields.password} onChange={(event) => update('password', event.target.value)} placeholder={register ? 'Mínimo 8 caracteres' : 'Tu contraseña'} disabled={loading} /><button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div>
      </div>
      {register && <div className="sl-portal-field"><label htmlFor="sl-auth-confirm">Confirmar contraseña</label><input id="sl-auth-confirm" type={showPassword ? 'text' : 'password'} autoComplete="new-password" value={fields.confirmPassword} onChange={(event) => update('confirmPassword', event.target.value)} placeholder="Repite la contraseña" disabled={loading} /></div>}
      {(error || authError) && <p className="sl-portal-error" role="alert">{error || authError}</p>}
      <button className="sl-portal-primary" type="submit" disabled={loading}>{loading ? 'Un momento…' : register ? 'Crear cuenta' : 'Iniciar sesión'} <ArrowRight size={17} aria-hidden="true" /></button>
    </form>
    <p className="sl-portal-switch">{register ? '¿Ya tienes cuenta?' : '¿Aún no tienes cuenta?'} <Link to={register ? '/alumnos/iniciar-sesion' : '/alumnos/crear-cuenta'}>{register ? 'Inicia sesión' : 'Crea una cuenta'}</Link></p>
  </StudentAuthFrame>;
}

export function StudentAccountPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const signOut = async () => {
    await logout();
    navigate('/alumnos', { replace: true });
  };
  return <main id="contenido" className="sl-portal-main"><div className="sl-container sl-portal-narrow">
    <PageHeading eyebrow="MI CUENTA" title={`Hola, ${user?.nombre?.split(' ')[0] || 'alumno'}.`} description="Tu cuenta de Katedra Alumnos está activa." icon={BookOpen} />
    <div className="sl-portal-card"><h2>Tus datos</h2><p><strong>Nombre:</strong> {user?.nombre}</p><p><strong>Correo:</strong> {user?.email}</p><button className="sl-portal-primary" type="button" onClick={signOut}>Cerrar sesión</button></div>
  </div></main>;
}

export function StudentRecoveryPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    const validation = validateStudentRecoveryEmail(email);
    if (validation) {
      setError(validation);
      setSent(false);
      return;
    }

    setError('');
    setLoading(true);
    try {
      await requestStudentPasswordReset(email.trim());
      setSent(true);
    } catch {
      setError('No pudimos procesar la solicitud. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return <StudentAuthFrame
    eyebrow="Recupera tu acceso"
    icon={LockKeyhole}
    headline="Vuelve a tus clases en un momento."
    lead="Te enviaremos un enlace seguro para que elijas una contraseña nueva."
    title="Recupera tu contraseña"
    description="Escribe el correo de tu cuenta y te enviaremos un enlace."
  >
    <form onSubmit={submit} noValidate>
      <div className="sl-portal-field"><label htmlFor="sl-recovery-email">Correo electrónico</label><input id="sl-recovery-email" type="email" autoComplete="email" value={email} onChange={(event) => { setEmail(event.target.value); setError(''); setSent(false); }} placeholder="tu@escuela.edu" disabled={loading} required /></div>
      {error && <p role="alert" className="sl-portal-error">{error}</p>}
      {sent && <p role="status" className="sl-portal-success">Si el correo corresponde a una cuenta, recibirás un enlace válido por 15 minutos.</p>}
      <button className="sl-portal-primary" type="submit" disabled={loading}>{loading ? 'Enviando…' : 'Enviar enlace'} <ArrowRight size={17} aria-hidden="true" /></button>
    </form>
    <p className="sl-portal-switch">¿La recordaste? <Link to="/alumnos/iniciar-sesion">Inicia sesión</Link></p>
  </StudentAuthFrame>;
}

export function StudentPasswordResetPage() {
  const [searchParams] = useSearchParams();
  const tokenFromLink = searchParams.get('token') || '';
  const [token, setToken] = useState(tokenFromLink);
  const [fields, setFields] = useState({ password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (tokenFromLink) navigate('/alumnos/restablecer-contrasena', { replace: true });
  }, [tokenFromLink, navigate]);

  const submit = async (event) => {
    event.preventDefault();
    if (!token) {
      setError('El enlace no es válido o ya venció. Solicita uno nuevo.');
      return;
    }

    const validation = validateStudentPasswordReset(fields.password, fields.confirmPassword);
    if (validation) {
      setError(validation);
      return;
    }

    setError('');
    setLoading(true);
    try {
      await resetStudentPassword(token, fields.password);
      setToken('');
      setFields({ password: '', confirmPassword: '' });
      setSuccess(true);
    } catch {
      setError('No pudimos actualizar la contraseña. Revisa el enlace e inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const frame = {
    eyebrow: 'Recupera tu acceso',
    icon: LockKeyhole,
    headline: 'Una contraseña nueva y sigues donde ibas.',
    lead: 'Por seguridad, al cambiarla cerramos tus sesiones anteriores.'
  };
  const backToLogin = <p className="sl-portal-switch"><Link to="/alumnos/iniciar-sesion">Volver al inicio de sesión</Link></p>;

  if (success) return <StudentAuthFrame {...frame} title="Contraseña actualizada" description="Ya puedes iniciar sesión con tu nueva contraseña.">
    <p role="status" className="sl-portal-success">Tu contraseña se actualizó.</p>
    <Link className="sl-portal-primary sl-portal-block" to="/alumnos/iniciar-sesion">Ir al inicio de sesión <ArrowRight size={17} aria-hidden="true" /></Link>
  </StudentAuthFrame>;

  if (!token) return <StudentAuthFrame {...frame} title="Enlace no válido" description="El enlace no es válido o ya venció. Solicita uno nuevo.">
    {error && <p role="alert" className="sl-portal-error">{error}</p>}
    <Link className="sl-portal-primary sl-portal-block" to="/alumnos/recuperar-contrasena">Solicitar otro enlace <ArrowRight size={17} aria-hidden="true" /></Link>
    {backToLogin}
  </StudentAuthFrame>;

  return <StudentAuthFrame {...frame} title="Elige una nueva contraseña" description="Debe tener entre 8 y 100 caracteres.">
    <form onSubmit={submit} noValidate>
      <div className="sl-portal-field"><label htmlFor="sl-reset-password">Nueva contraseña</label><div className="sl-portal-password-wrap"><input id="sl-reset-password" type={showPassword ? 'text' : 'password'} autoComplete="new-password" value={fields.password} onChange={(event) => { setFields((current) => ({ ...current, password: event.target.value })); setError(''); }} placeholder="Mínimo 8 caracteres" disabled={loading} required /><button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div></div>
      <div className="sl-portal-field"><label htmlFor="sl-reset-confirm">Confirmar contraseña</label><input id="sl-reset-confirm" type={showPassword ? 'text' : 'password'} autoComplete="new-password" value={fields.confirmPassword} onChange={(event) => { setFields((current) => ({ ...current, confirmPassword: event.target.value })); setError(''); }} placeholder="Repite tu nueva contraseña" disabled={loading} required /></div>
      {error && <p role="alert" className="sl-portal-error">{error}</p>}
      <button className="sl-portal-primary" type="submit" disabled={loading}>{loading ? 'Guardando…' : 'Guardar contraseña'} <ArrowRight size={17} aria-hidden="true" /></button>
    </form>
    {backToLogin}
  </StudentAuthFrame>;
}

function StudentSearchForm({ initialQuery, onSearch }) {
  const [query, setQuery] = useState(initialQuery);
  return <form className="sl-portal-search-form" role="search" onSubmit={(event) => { event.preventDefault(); onSearch(query.trim()); }}>
    <label className="sl-sr-only" htmlFor="sl-page-search">Buscar en Katedra Alumnos</label>
    <Search size={21} aria-hidden="true" /><input id="sl-page-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Busca materiales, IA, Forms…" autoFocus /><button type="submit">Buscar</button>
  </form>;
}

export function StudentSearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeQuery = searchParams.get('q') || '';
  const results = searchStudentContent(activeQuery);
  return <main id="contenido" className="sl-portal-main"><div className="sl-container sl-portal-narrow">
    <PageHeading eyebrow="EXPLORA ALUMNOS" title="Busca en Katedra Alumnos." description="Encuentra secciones y preguntas frecuentes." icon={Search} />
    <StudentSearchForm key={activeQuery} initialQuery={activeQuery} onSearch={(query) => setSearchParams(query ? { q: query } : {})} />
    {!activeQuery.trim() ? <DemoNotice>La búsqueda cubre las secciones públicas y preguntas frecuentes.</DemoNotice> : <>
      <p className="sl-portal-result-count" role="status">{results.length === 0 ? 'No encontramos resultados para' : results.length + (results.length === 1 ? ' resultado para' : ' resultados para')} «{activeQuery}».</p>
      {results.length ? <ul className="sl-portal-results">{results.map(({ title, description, href }, index) => <li key={href + index}><Link to={href}><strong>{title}</strong><span>{description}</span><ArrowRight size={18} aria-hidden="true" /></Link></li>)}</ul> : <div className="sl-portal-card"><p>Prueba con «material», «evaluación», «IA» o «retroalimentación».</p><Link className="sl-portal-text-link" to="/alumnos">Volver al inicio <ArrowRight size={16} /></Link></div>}
    </>}
  </div></main>;
}

export function StudentMissingPage({ forms = false }) {
  return <main id="contenido" className="sl-portal-main sl-portal-missing"><div className="sl-container sl-portal-narrow">
    <span className="sl-portal-404" aria-hidden="true">404</span>
    <PageHeading eyebrow="PÁGINA NO ENCONTRADA" title={forms ? 'No encontramos la página de Katedra Forms.' : 'No encontramos esta página de Alumnos.'} description={forms ? 'Katedra Forms aún no tiene una página disponible para alumnos. Puedes explorar su demostración dentro de la landing.' : 'La dirección que abriste no corresponde a una página disponible de Katedra Alumnos.'} icon={ClipboardCheck} />
    <div className="sl-portal-actions"><Link className="sl-portal-primary" to="/alumnos">Volver a Alumnos <ArrowRight size={17} /></Link>{forms && <Link className="sl-portal-secondary" to="/alumnos#katedra-forms">Ver demo de Forms</Link>}</div>
  </div></main>;
}

export function StudentContactPage() {
  return <main id="contenido" className="sl-portal-main"><div className="sl-container sl-portal-narrow">
    <PageHeading eyebrow="CONTÁCTANOS" title="Contacto" description="El canal de contacto para alumnos todavía no está disponible." icon={Mail} />
    <div className="sl-portal-card"><p>Para preguntas frecuentes, utiliza la ayuda de esta página. Si usas Katedra como profesor, vuelve al sitio principal.</p><div className="sl-portal-actions"><Link className="sl-portal-primary" to="/alumnos">Volver al inicio <ArrowRight size={17} /></Link><Link className="sl-portal-secondary" to="/">Katedra para profesores</Link></div></div>
  </div></main>;
}

export function StudentSitemapPage() {
  return <main id="contenido" className="sl-portal-main"><div className="sl-container">
    <PageHeading eyebrow="MAPA DEL SITIO" title="Explora Katedra Alumnos." description="Secciones principales y páginas adicionales." icon={Map} />
    <div className="sl-portal-sitemap">
      <section className="sl-portal-card" aria-labelledby="sl-map-main"><h2 id="sl-map-main">Secciones principales</h2><nav aria-label="Secciones principales"><Link to="/alumnos">Inicio de Alumnos</Link><Link to="/alumnos#como-funciona">Cómo funciona</Link><Link to="/alumnos#ia-para-aprender">IA para aprender</Link><Link to="/alumnos/forms">Katedra Forms · página no disponible</Link></nav></section>
      <section className="sl-portal-card" aria-labelledby="sl-map-secondary"><h2 id="sl-map-secondary">Secciones secundarias</h2><nav aria-label="Secciones secundarias"><Link to="/alumnos#como-funciona">Material y actividades</Link><Link to="/alumnos#katedra-forms">Demo de Forms</Link><Link to="/alumnos#preguntas">Preguntas frecuentes</Link></nav></section>
      <section className="sl-portal-card" aria-labelledby="sl-map-extra"><h2 id="sl-map-extra">Elementos adicionales</h2><nav aria-label="Elementos adicionales"><Link to="/alumnos/iniciar-sesion">Iniciar sesión</Link><Link to="/alumnos/crear-cuenta">Crear cuenta</Link><Link to="/alumnos/mi-cuenta">Mi cuenta</Link><Link to="/alumnos/recuperar-contrasena">Recuperar contraseña</Link><Link to="/alumnos/buscar">Buscar</Link><Link to="/alumnos/contacto">Contáctanos</Link><Link to="/">Katedra para profesores</Link></nav></section>
    </div>
  </div></main>;
}

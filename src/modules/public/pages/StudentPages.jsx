import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, BookOpen, ClipboardCheck, Eye, EyeOff, LockKeyhole, Mail, Map, Search, Sparkles } from 'lucide-react';
import { searchStudentContent, validateStudentAccess } from '../studentPortal.js';
import { useAuth } from '../../../app/hooks/useAuth.js';

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
    if (success) navigate('/alumnos/mi-cuenta', { replace: true });
    else setFields((current) => ({ ...current, password: '', confirmPassword: '' }));
  };

  return <main id="contenido" className="sl-portal-main sl-portal-auth-main">
    <div className="sl-portal-auth-layout sl-container">
      <div className="sl-portal-auth-intro">
        <PageHeading eyebrow="KATEDRA ALUMNOS" title={register ? 'Crea tu cuenta de alumno.' : 'Entra a tu cuenta.'} description={register ? 'Solo necesitas tu nombre, correo y una contraseña.' : 'Escribe tu correo y contraseña para continuar.'} icon={BookOpen} />
        <div className="sl-portal-auth-orbit" aria-hidden="true"><BookOpen size={66} strokeWidth={1.3} /><span>Katedra Alumnos</span></div>
      </div>
      <div className="sl-portal-card sl-portal-auth-card">
        <span className="sl-portal-card-kicker">Katedra Alumnos</span>
        <h2>{register ? 'Crear cuenta' : 'Iniciar sesión'}</h2>
        <form onSubmit={submit} noValidate>
          {register && <div className="sl-portal-field"><label htmlFor="sl-auth-name">Nombre completo</label><input id="sl-auth-name" type="text" autoComplete="name" value={fields.nombre} onChange={(event) => update('nombre', event.target.value)} placeholder="Tu nombre" disabled={loading} /></div>}
          <div className="sl-portal-field"><label htmlFor="sl-auth-email">Correo electrónico</label><input id="sl-auth-email" type="email" autoComplete="email" value={fields.email} onChange={(event) => update('email', event.target.value)} placeholder="tu@escuela.edu" disabled={loading} /></div>
          <div className="sl-portal-field">
            <div className="sl-portal-label-row"><label htmlFor="sl-auth-password">Contraseña</label>{!register && <Link to="/alumnos/recuperar-contrasena">¿La olvidaste?</Link>}</div>
            <div className="sl-portal-password-wrap"><input id="sl-auth-password" type={showPassword ? 'text' : 'password'} autoComplete={register ? 'new-password' : 'current-password'} value={fields.password} onChange={(event) => update('password', event.target.value)} placeholder={register ? 'Mínimo 6 caracteres' : 'Tu contraseña'} disabled={loading} /><button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div>
          </div>
          {register && <>
            <div className="sl-portal-field"><label htmlFor="sl-auth-confirm">Confirmar contraseña</label><input id="sl-auth-confirm" type={showPassword ? 'text' : 'password'} autoComplete="new-password" value={fields.confirmPassword} onChange={(event) => update('confirmPassword', event.target.value)} placeholder="Repite la contraseña" disabled={loading} /></div>
          </>}
          {(error || authError) && <p className="sl-portal-error" role="alert">{error || authError}</p>}
          <button className="sl-portal-primary" type="submit" disabled={loading}>{loading ? 'Un momento…' : register ? 'Crear cuenta' : 'Iniciar sesión'} <ArrowRight size={17} aria-hidden="true" /></button>
        </form>
        <p className="sl-portal-switch">{register ? '¿Ya tienes cuenta?' : '¿Aún no tienes cuenta?'} <Link to={register ? '/alumnos/iniciar-sesion' : '/alumnos/crear-cuenta'}>{register ? 'Iniciar sesión' : 'Crear cuenta'}</Link></p>
        <Link className="sl-portal-back" to="/alumnos"><ArrowLeft size={16} aria-hidden="true" /> Volver a Katedra Alumnos</Link>
      </div>
    </div>
  </main>;
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
  return <main id="contenido" className="sl-portal-main"><div className="sl-container sl-portal-narrow">
    <PageHeading eyebrow="ACCESO DE ALUMNOS" title="Recuperar contraseña" description="El restablecimiento por correo todavía no está disponible." icon={LockKeyhole} />
    <div className="sl-portal-card"><p>Si recuerdas tu contraseña, vuelve al inicio de sesión.</p><div className="sl-portal-actions"><Link className="sl-portal-primary" to="/alumnos/iniciar-sesion">Iniciar sesión <ArrowRight size={17} /></Link></div></div>
  </div></main>;
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
      <section className="sl-portal-card" aria-labelledby="sl-map-secondary"><h2 id="sl-map-secondary">Secciones secundarias</h2><nav aria-label="Secciones secundarias"><Link to="/alumnos#la-duda">La duda</Link><Link to="/alumnos#beneficios">Material y actividades</Link><Link to="/alumnos#katedra-forms">Demo de Forms</Link><Link to="/alumnos#preguntas">Preguntas frecuentes</Link></nav></section>
      <section className="sl-portal-card" aria-labelledby="sl-map-extra"><h2 id="sl-map-extra">Elementos adicionales</h2><nav aria-label="Elementos adicionales"><Link to="/alumnos/iniciar-sesion">Iniciar sesión</Link><Link to="/alumnos/crear-cuenta">Crear cuenta</Link><Link to="/alumnos/mi-cuenta">Mi cuenta</Link><Link to="/alumnos/recuperar-contrasena">Recuperar contraseña</Link><Link to="/alumnos/buscar">Buscar</Link><Link to="/alumnos/contacto">Contáctanos</Link><Link to="/">Katedra para profesores</Link></nav></section>
    </div>
  </div></main>;
}

import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, BookOpen, ClipboardCheck, Eye, EyeOff, LockKeyhole, Mail, Map, Search, Sparkles } from 'lucide-react';
import { searchStudentContent, validateStudentAccess } from '../studentPortal.js';

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
  const [fields, setFields] = useState({ nombre: '', email: '', password: '', confirmPassword: '', acceptedTerms: false });
  const [error, setError] = useState('');
  const [complete, setComplete] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const update = (field, value) => {
    setFields((current) => ({ ...current, [field]: value }));
    setError('');
    setComplete(false);
  };
  const submit = (event) => {
    event.preventDefault();
    const validation = validateStudentAccess(mode, fields);
    if (validation) {
      setError(validation);
      setComplete(false);
      return;
    }
    setError('');
    setComplete(true);
    setFields((current) => ({ ...current, password: '', confirmPassword: '' }));
  };

  return <main id="contenido" className="sl-portal-main sl-portal-auth-main">
    <div className="sl-portal-auth-layout sl-container">
      <div className="sl-portal-auth-intro">
        <PageHeading eyebrow="ACCESO DE EJEMPLO" title={register ? 'Crea tu espacio de alumno.' : 'Continúa tu recorrido.'} description={register ? 'Explora cómo se vería el registro para seguir tus clases y actividades.' : 'Explora cómo se vería el acceso a tus clases y tu siguiente paso.'} icon={BookOpen} />
        <div className="sl-portal-auth-orbit" aria-hidden="true"><BookOpen size={66} strokeWidth={1.3} /><span>Tu espacio para aprender</span></div>
        <div className="sl-portal-path"><span>01 · Tu clase</span><span>02 · Tu actividad</span><span>03 · Tu siguiente paso</span></div>
        <p>Las cuentas de alumnos aún no están habilitadas. Este formulario comprueba los datos localmente y no crea una sesión.</p>
      </div>
      <div className="sl-portal-card sl-portal-auth-card">
        <span className="sl-portal-card-kicker">Katedra Alumnos · Demostración</span>
        <h2>{register ? 'Crear cuenta' : 'Iniciar sesión'}</h2>
        <DemoNotice>No se enviarán ni guardarán tus datos.</DemoNotice>
        <form onSubmit={submit} noValidate>
          {register && <div className="sl-portal-field"><label htmlFor="sl-auth-name">Nombre completo</label><input id="sl-auth-name" type="text" autoComplete="name" value={fields.nombre} onChange={(event) => update('nombre', event.target.value)} placeholder="Tu nombre" /></div>}
          <div className="sl-portal-field"><label htmlFor="sl-auth-email">Correo electrónico</label><input id="sl-auth-email" type="email" autoComplete="email" value={fields.email} onChange={(event) => update('email', event.target.value)} placeholder="tu@escuela.edu" /></div>
          <div className="sl-portal-field">
            <div className="sl-portal-label-row"><label htmlFor="sl-auth-password">Contraseña</label>{!register && <Link to="/alumnos/recuperar-contrasena">¿La olvidaste?</Link>}</div>
            <div className="sl-portal-password-wrap"><input id="sl-auth-password" type={showPassword ? 'text' : 'password'} autoComplete={register ? 'new-password' : 'current-password'} value={fields.password} onChange={(event) => update('password', event.target.value)} placeholder={register ? 'Mínimo 6 caracteres' : 'Tu contraseña'} /><button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div>
          </div>
          {register && <>
            <div className="sl-portal-field"><label htmlFor="sl-auth-confirm">Confirmar contraseña</label><input id="sl-auth-confirm" type={showPassword ? 'text' : 'password'} autoComplete="new-password" value={fields.confirmPassword} onChange={(event) => update('confirmPassword', event.target.value)} placeholder="Repite la contraseña" /></div>
            <label className="sl-portal-checkbox"><input type="checkbox" checked={fields.acceptedTerms} onChange={(event) => update('acceptedTerms', event.target.checked)} /><span>Entiendo que esta demostración no crea una cuenta de alumno.</span></label>
          </>}
          {error && <p className="sl-portal-error" role="alert">{error}</p>}
          {complete && <p className="sl-portal-success" role="status">Datos válidos. Esta demostración no {register ? 'creó una cuenta' : 'inició sesión'}.</p>}
          <button className="sl-portal-primary" type="submit">{register ? 'Revisar registro de ejemplo' : 'Probar inicio de sesión'} <ArrowRight size={17} aria-hidden="true" /></button>
        </form>
        <p className="sl-portal-switch">{register ? '¿Ya conoces el acceso?' : '¿Quieres ver el registro?'} <Link to={register ? '/alumnos/iniciar-sesion' : '/alumnos/crear-cuenta'}>{register ? 'Iniciar sesión' : 'Crear cuenta'}</Link></p>
        <Link className="sl-portal-back" to="/alumnos"><ArrowLeft size={16} aria-hidden="true" /> Volver a Katedra Alumnos</Link>
      </div>
    </div>
  </main>;
}

export function StudentRecoveryPage() {
  return <main id="contenido" className="sl-portal-main"><div className="sl-container sl-portal-narrow">
    <PageHeading eyebrow="ACCESO DE ALUMNOS" title="Recuperar contraseña" description="Estamos preparando el acceso para alumnos. La recuperación de contraseña estará disponible cuando existan cuentas reales." icon={LockKeyhole} />
    <div className="sl-portal-card"><DemoNotice>Esta página no envía correos ni solicita datos personales.</DemoNotice><p>Si buscabas el acceso actual de profesores, vuelve a la página principal de Katedra. Si estás explorando la experiencia de alumnos, puedes regresar a la demostración de inicio de sesión.</p><div className="sl-portal-actions"><Link className="sl-portal-primary" to="/alumnos/iniciar-sesion">Volver al acceso <ArrowRight size={17} /></Link><Link className="sl-portal-secondary" to="/">Ir a Katedra para profesores</Link></div></div>
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
    <PageHeading eyebrow="EXPLORA ALUMNOS" title="Busca tu siguiente paso." description="Encuentra secciones y preguntas frecuentes de esta experiencia de ejemplo." icon={Search} />
    <StudentSearchForm key={activeQuery} initialQuery={activeQuery} onSearch={(query) => setSearchParams(query ? { q: query } : {})} />
    {!activeQuery.trim() ? <DemoNotice>La búsqueda cubre las secciones públicas y preguntas frecuentes de esta demo.</DemoNotice> : <>
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
    <PageHeading eyebrow="CONTÁCTANOS" title="Estamos preparando tu espacio." description="El canal de contacto para alumnos se habilitará cuando exista una cuenta real." icon={Mail} />
    <div className="sl-portal-card"><DemoNotice>Esta demostración no recibe mensajes ni datos de contacto.</DemoNotice><p>Para resolver dudas sobre lo que ves aquí, abre el chatbot de ejemplo. Si usas Katedra como profesor, vuelve al sitio principal.</p><div className="sl-portal-actions"><Link className="sl-portal-primary" to="/alumnos">Volver al inicio <ArrowRight size={17} /></Link><Link className="sl-portal-secondary" to="/">Katedra para profesores</Link></div></div>
  </div></main>;
}

export function StudentSitemapPage() {
  return <main id="contenido" className="sl-portal-main"><div className="sl-container">
    <PageHeading eyebrow="MAPA DEL SITIO" title="Explora Katedra Alumnos." description="Secciones principales, recursos de la landing y páginas adicionales de esta demostración." icon={Map} />
    <div className="sl-portal-sitemap">
      <section className="sl-portal-card" aria-labelledby="sl-map-main"><h2 id="sl-map-main">Secciones principales</h2><nav aria-label="Secciones principales"><Link to="/alumnos">Inicio de Alumnos</Link><Link to="/alumnos#como-funciona">Cómo funciona</Link><Link to="/alumnos#ia-para-aprender">IA para aprender</Link><Link to="/alumnos/forms">Katedra Forms · página no disponible</Link></nav></section>
      <section className="sl-portal-card" aria-labelledby="sl-map-secondary"><h2 id="sl-map-secondary">Secciones secundarias</h2><nav aria-label="Secciones secundarias"><Link to="/alumnos#la-duda">La duda</Link><Link to="/alumnos#beneficios">Material y actividades</Link><Link to="/alumnos#katedra-forms">Demo de Forms</Link><Link to="/alumnos#preguntas">Preguntas frecuentes</Link></nav></section>
      <section className="sl-portal-card" aria-labelledby="sl-map-extra"><h2 id="sl-map-extra">Elementos adicionales</h2><nav aria-label="Elementos adicionales"><Link to="/alumnos/iniciar-sesion">Iniciar sesión</Link><Link to="/alumnos/crear-cuenta">Crear cuenta</Link><Link to="/alumnos/recuperar-contrasena">Recuperar contraseña</Link><Link to="/alumnos/buscar">Buscar</Link><Link to="/alumnos/contacto">Contáctanos</Link><Link to="/">Katedra para profesores</Link></nav></section>
    </div>
  </div></main>;
}

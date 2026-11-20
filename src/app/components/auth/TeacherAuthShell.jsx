import { Link, useNavigate } from 'react-router-dom';
import TeacherCharacter, { TeacherMiniCharacter } from './TeacherCharacter';
import './teacherAuth.css';

const NAV_LINKS = [
  ['Características', '/#features'],
  ['Integraciones', '/#integrations'],
  ['Planes', '/#pricing'],
  ['FAQs', '/#faqs']
];

/**
 * Page frame shared by every teacher auth screen: gradient background, glass nav and a
 * split card (illustration + copy on the left, form on the right). Keeps login, password
 * recovery and password change visually identical.
 */
export default function TeacherAuthShell({
  eyebrow,
  headline,
  lead,
  title,
  description,
  excited = false,
  navAction = { label: 'Registrarse', to: '/register' },
  children
}) {
  const navigate = useNavigate();

  return (
    <div data-root className="kt-page" style={{ position: 'fixed', inset: 0, overflow: 'auto', display: 'flex', flexDirection: 'column', fontFamily: "'Manrope', sans-serif", background: 'radial-gradient(130% 135% at 12% 6%, #1E3A8A 0%, #2563EB 22%, #06B6D4 42%, #10B981 66%, #34D399 86%, #FCD34D 112%)', zIndex: 9999 }}>
      <nav className="kt-nav" style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 40px', background: 'rgba(255, 255, 255, 0.08)', backdropFilter: 'blur(16px) saturate(120%)', WebkitBackdropFilter: 'blur(16px) saturate(120%)', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', boxShadow: '0 4px 30px rgba(0, 0, 0, 0.03)' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '18px', letterSpacing: '-0.9px', color: '#fff' }}>Katedra</span>
        </Link>

        <div className="kt-nav-links" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {NAV_LINKS.map(([label, href]) => (
            <a key={href} href={href} className="kt-nav-link">{label}</a>
          ))}
        </div>

        <Link to={navAction.to} className="kt-nav-cta">{navAction.label}</Link>
      </nav>

      {/* decorative layer */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '-140px', left: '-120px', width: '520px', height: '520px', borderRadius: '50%', background: 'radial-gradient(circle at 50% 50%, rgba(52,211,153,.55), rgba(52,211,153,0) 68%)', filter: 'blur(30px)', animation: 'blobFloat 14s ease-in-out infinite' }}></div>
        <div style={{ position: 'absolute', bottom: '-180px', right: '-120px', width: '560px', height: '560px', borderRadius: '50%', background: 'radial-gradient(circle at 50% 50%, rgba(252,211,77,.5), rgba(252,211,77,0) 66%)', filter: 'blur(34px)', animation: 'blobFloat2 17s ease-in-out infinite' }}></div>
        <div style={{ position: 'absolute', top: '36%', right: '16%', width: '340px', height: '340px', borderRadius: '50%', background: 'radial-gradient(circle at 50% 50%, rgba(6,182,212,.4), rgba(6,182,212,0) 70%)', filter: 'blur(30px)', animation: 'blobFloat 20s ease-in-out infinite' }}></div>
        <svg style={{ position: 'absolute', inset: '-6%', width: '112%', height: '112%', opacity: .16, mixBlendMode: 'overlay', animation: 'grainShift 8s steps(6) infinite' }} xmlns="http://www.w3.org/2000/svg">
          <filter id="ktGrain">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"></feTurbulence>
            <feColorMatrix type="saturate" values="0"></feColorMatrix>
          </filter>
          <rect width="100%" height="100%" filter="url(#ktGrain)"></rect>
        </svg>
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'safe center', justifyContent: 'center', padding: '80px 28px 40px', position: 'relative', zIndex: 2 }}>
        <main className="kt-card kt-stage" style={{ position: 'relative', zIndex: 2, display: 'grid', gridTemplateColumns: '1.02fr 1fr', width: '100%', maxWidth: '940px', minHeight: '600px', background: 'rgba(255,255,255,.72)', backdropFilter: 'blur(22px) saturate(1.3)', WebkitBackdropFilter: 'blur(22px) saturate(1.3)', border: '1px solid rgba(255,255,255,.6)', borderRadius: '26px', overflow: 'hidden', boxShadow: '0 40px 90px -30px rgba(15,23,42,.55), 0 8px 24px -12px rgba(15,23,42,.3)', animation: 'cardRise 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}>
          {/* LEFT: illustration pane */}
          <div className="kt-left" style={{ position: 'relative', padding: '44px 40px', background: 'linear-gradient(165deg,#ECFDF5 0%,#F0FDFA 46%,#FEFCE8 100%)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(120% 90% at 20% 0%, rgba(16,185,129,.10), transparent 60%)', pointerEvents: 'none' }}></div>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 700, fontSize: '10px', letterSpacing: '1.35px', textTransform: 'uppercase', color: '#059669', marginBottom: '12px' }}>{eyebrow}</div>
              <h2 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: '29px', lineHeight: '1.12', letterSpacing: '-1.4px', color: '#0F172A', margin: '0 0 8px' }}>{headline}</h2>
              <p style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: '14px', lineHeight: '1.55', color: '#475569', margin: 0, maxWidth: '280px' }}>{lead}</p>
            </div>
            <div style={{ position: 'relative', zIndex: 1, flex: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', minHeight: '250px', marginTop: '10px' }}>
              <TeacherCharacter excited={excited} />
            </div>
          </div>

          {/* RIGHT: form pane */}
          <div className="kt-right" style={{ position: 'relative', padding: '48px 46px', background: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div className="kt-mobchar" style={{ display: 'none', justifyContent: 'center', marginBottom: '6px' }}>
              <TeacherMiniCharacter />
            </div>

            <button type="button" onClick={() => navigate('/')} aria-label="Ir al inicio de Katedra" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '26px', cursor: 'pointer', border: 'none', background: 'none', padding: 0, alignSelf: 'flex-start' }}>
              <span style={{ width: '30px', height: '30px', borderRadius: '9px', background: 'linear-gradient(150deg,#10B981,#059669)', display: 'grid', placeItems: 'center', boxShadow: '0 4px 12px -3px rgba(16,185,129,.6)' }}><span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '17px', color: '#fff', letterSpacing: '-1px' }}>K</span></span>
              <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: '18px', letterSpacing: '-.8px', color: '#0F172A' }}>Katedra</span>
            </button>

            <h1 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: '27px', lineHeight: 1.1, letterSpacing: '-1px', color: '#0F172A', margin: '0 0 7px' }}>{title}</h1>
            <p style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: '14.5px', color: '#64748B', margin: '0 0 26px' }}>{description}</p>

            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export function AuthMessage({ kind = 'error', children }) {
  const isError = kind === 'error';
  return (
    <div
      role={isError ? 'alert' : 'status'}
      style={{
        padding: '12px',
        background: isError ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
        border: `1px solid ${isError ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)'}`,
        borderRadius: '10px',
        color: isError ? '#EF4444' : '#059669',
        fontFamily: "'Manrope', sans-serif",
        fontSize: '13px',
        fontWeight: 600,
        lineHeight: '1.4'
      }}
    >
      {children}
    </div>
  );
}

export function AuthLabel({ htmlFor, children }) {
  return (
    <label htmlFor={htmlFor} style={{ display: 'block', fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: '12.5px', letterSpacing: '-.2px', color: '#334155', marginBottom: '6px' }}>
      {children}
    </label>
  );
}

export function AuthFooterLink({ prompt, to, children }) {
  return (
    <p style={{ textAlign: 'center', fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: '13.5px', color: '#64748B', margin: '22px 0 0' }}>
      {prompt}{prompt ? ' ' : ''}
      <Link to={to} style={{ color: '#059669', fontWeight: 700, textDecoration: 'none' }}>{children}</Link>
    </p>
  );
}

export function PasswordVisibilityToggle({ visible, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
      style={{ position: 'absolute', right: '6px', top: '50%', transform: 'translateY(-50%)', width: '34px', height: '34px', display: 'grid', placeItems: 'center', border: 'none', background: 'none', cursor: 'pointer', color: '#94A3B8', borderRadius: '8px' }}
    >
      {visible ? (
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 19c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
      ) : (
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>
      )}
    </button>
  );
}

export function SubmitButton({ loading, loadingLabel, children }) {
  return (
    <button type="submit" className="kt-submit-btn" disabled={loading}>
      {loading ? (
        <>
          <span style={{ width: '16px', height: '16px', border: '2.5px solid rgba(255,255,255,.4)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'spin .7s linear infinite' }}></span>
          <span>{loadingLabel}</span>
        </>
      ) : (
        <span>{children}</span>
      )}
    </button>
  );
}

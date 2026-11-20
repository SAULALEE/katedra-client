// Shared full-screen card for standalone teacher auth screens
// (change, forgot and reset password).
export default function AuthCard({ title, description, children }) {
  return (
    <div style={{ position: 'fixed', inset: 0, overflow: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '28px', fontFamily: "'Manrope', sans-serif", background: 'radial-gradient(130% 135% at 12% 6%, #1E3A8A 0%, #2563EB 22%, #06B6D4 42%, #10B981 66%, #34D399 86%, #FCD34D 112%)' }}>
      <main style={{ width: '100%', maxWidth: '420px', background: 'rgba(255,255,255,.94)', backdropFilter: 'blur(22px) saturate(1.3)', border: '1px solid rgba(255,255,255,.6)', borderRadius: '22px', padding: '38px 36px', boxShadow: '0 40px 90px -30px rgba(15,23,42,.55), 0 8px 24px -12px rgba(15,23,42,.3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '22px' }}>
          <div style={{ width: '30px', height: '30px', borderRadius: '9px', background: 'linear-gradient(150deg,#10B981,#059669)', display: 'grid', placeItems: 'center', boxShadow: '0 4px 12px -3px rgba(16,185,129,.6)' }}><span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '17px', color: '#fff', letterSpacing: '-1px' }}>K</span></div>
          <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: '18px', letterSpacing: '-.8px', color: '#0F172A' }}>Katedra</span>
        </div>

        <h1 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: '24px', lineHeight: 1.15, letterSpacing: '-1px', color: '#0F172A', margin: '0 0 7px' }}>{title}</h1>
        <p style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: '13.5px', color: '#64748B', margin: '0 0 22px' }}>
          {description}
        </p>

        {children}
      </main>
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
        border: `1px solid ${isError ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.25)'}`,
        borderRadius: '10px',
        color: isError ? '#EF4444' : '#047857',
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

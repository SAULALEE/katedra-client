
export default function LandingFooter() {
  return (
      <footer style={{ background: '#0F172A', padding: '64px 24px 36px' }}>
        <div style={{ maxWidth: '1080px', margin: '0 auto' }}>

          <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr 1fr', gap: '40px', paddingBottom: '48px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <div className="footer-grid-brand">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <span style={{ fontFamily: "'Inter'", fontWeight: 700, fontSize: '18px', letterSpacing: '-0.9px', color: '#fff' }}>Katedra</span>
              </div>
              <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: '14px', lineHeight: 1.6, color: '#94A3B8', margin: '0 0 20px', maxWidth: '260px' }}>
                Herramientas para crear Temarios, Teoría docente, Evaluaciones y Diapositivas.
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
            <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: '13px', color: '#64748B' }}>© 2026 Katedra. Todos los derechos reservados.</span>
            <div style={{ display: 'flex', gap: '22px' }}>
              <a href="#" className="footer-link" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: '13px', color: '#64748B', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={(e) => { e.currentTarget.style.color = '#fff'; }} onMouseOut={(e) => { e.currentTarget.style.color = '#64748B'; }}>Privacidad</a>
              <a href="#" className="footer-link" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: '13px', color: '#64748B', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={(e) => { e.currentTarget.style.color = '#fff'; }} onMouseOut={(e) => { e.currentTarget.style.color = '#64748B'; }}>Términos</a>
              <a href="#" className="footer-link" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: '13px', color: '#64748B', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={(e) => { e.currentTarget.style.color = '#fff'; }} onMouseOut={(e) => { e.currentTarget.style.color = '#64748B'; }}>Estado</a>
            </div>
          </div>
        </div>
      </footer>
  );
}

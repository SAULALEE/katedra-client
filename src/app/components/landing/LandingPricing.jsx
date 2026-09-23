import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

export default function LandingPricing({ billing, setBilling, planesLoading, planesError, planesVisibles, comprarPlan }) {
  return (
      <section id="pricing" style={{ background: '#ffffff', padding: '120px 24px' }}>
        <div style={{ maxWidth: '980px', margin: '0 auto' }}>

          <motion.div
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: '-10%' }}
            transition={{ duration: 0.75, ease: 'easeOut' }}
            style={{ textAlign: 'center', marginBottom: '14px' }}
          >
            <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '10px', letterSpacing: '1.5px', textTransform: 'uppercase', color: '#10B981', marginBottom: '16px' }}>Precios</div>
            <h2 style={{ fontFamily: "'Inter'", fontWeight: 600, fontSize: 'clamp(32px, 5vw, 52px)', lineHeight: 1.05, letterSpacing: '-1.6px', margin: '0 auto', maxWidth: '640px', color: '#0F172A' }}>
              Planes para tu carga académica.
            </h2>
          </motion.div>

          {/* Billing toggle */}
          <motion.div
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: '-10%' }}
            transition={{ duration: 0.75, delay: 0.08, ease: 'easeOut' }}
            style={{ display: 'flex', justifyContent: 'center', margin: '40px 0 60px' }}
          >
            <div style={{ position: 'relative', display: 'flex', padding: '6px', borderRadius: '16px', background: '#F8FAFC', border: '1px solid #E2E8F0', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)' }}>
              <div style={{
                position: 'absolute',
                top: '6px',
                bottom: '6px',
                left: billing === 'monthly' ? '6px' : '50%',
                width: 'calc(50% - 6px)',
                borderRadius: '12px',
                background: '#ffffff',
                boxShadow: '0 2px 8px rgba(15,23,42,0.08)',
                transition: 'left .35s cubic-bezier(.4, 0, .2, 1)'
              }}></div>
              <button
                onClick={() => setBilling('monthly')}
                style={{
                  position: 'relative',
                  zIndex: 1,
                  padding: '12px 28px',
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  fontSize: '15px',
                  transition: 'color .3s',
                  color: billing === 'monthly' ? '#0F172A' : '#64748B'
                }}
              >
                Mensual
              </button>
              <button
                onClick={() => setBilling('yearly')}
                style={{
                  position: 'relative',
                  zIndex: 1,
                  padding: '12px 28px',
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  fontSize: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'color .3s',
                  color: billing === 'yearly' ? '#0F172A' : '#64748B'
                }}
              >
                Anual <span style={{ padding: '2px 8px', borderRadius: '100px', background: 'rgba(16,185,129,0.15)', fontSize: '11px', color: '#10B981', fontWeight: 700 }}>−20%</span>
              </button>
            </div>
          </motion.div>

          {/* Pricing cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px', maxWidth: '820px', margin: '0 auto', alignItems: 'center' }}>
            {planesLoading && <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#64748B' }}>Consultando planes…</p>}
            {planesError && <p role="alert" style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#B91C1C' }}>{planesError}</p>}
            {planesVisibles.map((plan, index) => {
              const pro = plan.id !== 'free';
              const monto = new Intl.NumberFormat('es-MX', {
                style: 'currency',
                currency: (plan.moneda || 'mxn').toUpperCase(),
                maximumFractionDigits: 0
              }).format(plan.precio / 100);
              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 26 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, margin: '-10%' }}
                  transition={{ duration: 0.75, delay: index * 0.1, ease: 'easeOut' }}
                  style={{
                    position: 'relative',
                    padding: '44px 36px',
                    borderRadius: '24px',
                    border: pro ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid #E2E8F0',
                    background: pro ? 'linear-gradient(145deg, #0F172A 0%, #1E293B 100%)' : '#ffffff',
                    boxShadow: pro ? '0 32px 64px rgba(15,23,42,0.25)' : '0 12px 32px rgba(15,23,42,0.04)',
                    display: 'flex',
                    flexDirection: 'column',
                    transform: pro ? 'scale(1.04)' : 'scale(1)',
                    zIndex: pro ? 2 : 1,
                  }}
                >
                  {plan.recomendado && (
                    <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translate(-50%, -50%)', padding: '6px 16px', borderRadius: '100px', background: 'linear-gradient(110deg, #10B981, #34D399)', fontWeight: 700, fontSize: '11px', color: '#fff', letterSpacing: '0.5px', boxShadow: '0 4px 12px rgba(16,185,129,0.3)' }}>
                      MÁS POPULAR
                    </div>
                  )}
                  <div style={{ fontWeight: 600, fontSize: '18px', color: pro ? '#ffffff' : '#0F172A', marginBottom: '24px' }}>{plan.nombre}</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '32px' }}>
                    <span style={{ fontWeight: 700, fontSize: '52px', letterSpacing: '-2.5px', color: pro ? '#ffffff' : '#0F172A' }}>{monto}</span>
                    <span style={{ fontWeight: 500, fontSize: '15px', color: pro ? '#94A3B8' : '#64748B' }}>{plan.ciclo ? `/${plan.ciclo === 'mensual' ? 'mes' : 'año'}` : '/siempre'}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => comprarPlan(plan)}
                    style={{
                      fontWeight: 600,
                      fontSize: '15px',
                      color: pro ? '#0F172A' : '#1E293B',
                      padding: '16px',
                      borderRadius: '12px',
                      border: pro ? 'none' : '1px solid #E2E8F0',
                      background: pro ? 'linear-gradient(110deg, #34D399, #10B981)' : '#F8FAFC',
                      marginBottom: '36px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = pro ? '0 8px 24px rgba(16,185,129,0.25)' : '0 4px 12px rgba(0,0,0,0.05)'; }}
                    onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                  >
                    {pro ? 'Comenzar con Pro' : 'Empezar gratis'}
                  </button>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {plan.caracteristicas.map((caracteristica, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', fontWeight: 500, fontSize: '15px', color: pro ? '#CBD5E1' : '#475569', lineHeight: 1.4 }}>
                        <Check size={20} color={pro ? '#34D399' : '#10B981'} style={{ flexShrink: 0, marginTop: '1px' }} />
                        {caracteristica}
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
  );
}

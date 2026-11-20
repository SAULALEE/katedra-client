import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { LandingSegmentedToggle, LandingTierCard } from './LandingTiers';
import { TIER_GRID_STYLE } from './landingStyles';

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
            <LandingSegmentedToggle
              ariaLabel="Ciclo de facturación"
              value={billing}
              onChange={setBilling}
              options={[
                { value: 'monthly', label: 'Mensual' },
                { value: 'yearly', label: 'Anual', badge: <span style={{ padding: '2px 8px', borderRadius: '100px', background: 'rgba(16,185,129,0.15)', fontSize: '11px', color: '#10B981', fontWeight: 700 }}>−20%</span> },
              ]}
            />
          </motion.div>

          {/* Pricing cards */}
          <div style={TIER_GRID_STYLE}>
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
                <LandingTierCard
                  key={plan.id}
                  dark={pro}
                  index={index}
                  badge={plan.recomendado ? 'MÁS POPULAR' : null}
                  badgeGradient="linear-gradient(110deg, #10B981, #34D399)"
                  badgeShadow="0 4px 12px rgba(16,185,129,0.3)"
                >
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
                </LandingTierCard>
              );
            })}
          </div>
        </div>
      </section>
  );
}

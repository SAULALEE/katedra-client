import { motion } from 'framer-motion';
import LandingProcessSubjectCard from './LandingProcessSubjectCard';
import LandingProcessSyllabusCard from './LandingProcessSyllabusCard';
import LandingProcessMaterialCard from './LandingProcessMaterialCard';

export default function LandingProcess() {
  return (
      <section id="process" style={{ position: 'relative', background: '#fff', padding: '160px 24px 96px' }}>
        <div style={{ maxWidth: '1080px', margin: '0 auto' }}>

          <motion.div
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: '-10%' }}
            transition={{ duration: 0.75, ease: 'easeOut' }}
            style={{ textAlign: 'center', marginBottom: '64px' }}
          >
            <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '9px', letterSpacing: '1.35px', textTransform: 'uppercase', color: '#10B981', marginBottom: '14px' }}>El Proceso</div>

            <h2 style={{
              fontFamily: "'Inter'",
              fontWeight: 600,
              fontSize: 'clamp(30px, 4.6vw, 52px)',
              lineHeight: 1.05,
              letterSpacing: '-1.6px',
              margin: '0 auto',
              maxWidth: '760px',
              color: '#0F172A'
            }}>
              Materiales estructurados en <span style={{ fontFamily: "'Manrope', sans-serif", fontStyle: 'italic', fontWeight: 600, color: '#0F172A' }}>tres pasos</span>.
            </h2>
            <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: '17px', color: '#64748B', maxWidth: '560px', margin: '16px auto 0' }}>
              Sin flujos complejos. Solo indícanos qué enseñas y Katedra organizará el material de tu clase con rigor académico.
            </p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '22px' }}>

            {/* Card 1: Asignatura */}
            <LandingProcessSubjectCard />

            {/* Card 2: Temario */}
            <LandingProcessSyllabusCard />

            {/* Card 3: Material */}
            <LandingProcessMaterialCard />

          </div>
        </div>
      </section>
  );
}

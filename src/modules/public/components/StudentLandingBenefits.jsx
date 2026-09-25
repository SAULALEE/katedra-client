import { motion } from 'framer-motion';
import { STUDENT_BENEFITS } from './studentLandingContent';

export default function StudentLandingBenefits() {
  return (
    <section className="student-section student-section-lavender" id="beneficios" aria-labelledby="student-benefits-title">
      <div className="student-container">
        <motion.div className="student-section-heading" initial={{ opacity: 0, y: 26 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, margin: '-10%' }} transition={{ duration: 0.7 }}>
          <div className="student-section-label">Pensado para aprender</div>
          <h2 id="student-benefits-title">Menos tiempo buscando. Más claridad para avanzar.</h2>
          <p>El contenido de la clase se presenta con jerarquía, contexto y una ruta visible para cada estudiante.</p>
        </motion.div>

        <div className="student-benefit-grid">
          {STUDENT_BENEFITS.map(({ title, description, Icon, tone }, index) => (
            <motion.article className="student-benefit" key={title} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, margin: '-8%' }} transition={{ duration: 0.65, delay: index * 0.07 }}>
              <div className={`student-benefit-icon ${tone}`}><Icon size={22} /></div>
              <div><h3>{title}</h3><p>{description}</p></div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

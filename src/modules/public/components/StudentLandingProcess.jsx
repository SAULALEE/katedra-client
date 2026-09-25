import { motion } from 'framer-motion';
import { STUDENT_STEPS } from './studentLandingContent';

export default function StudentLandingProcess() {
  return (
    <section className="student-section student-process" id="como-funcionara" aria-labelledby="student-process-title">
      <div className="student-container">
        <motion.div className="student-section-heading" initial={{ opacity: 0, y: 26 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, margin: '-10%' }} transition={{ duration: 0.7 }}>
          <div className="student-section-label">Cómo funcionará</div>
          <h2 id="student-process-title">Tu clase, organizada en <span className="student-highlight" style={{ color: '#0F172A' }}>tres pasos</span>.</h2>
          <p>Una experiencia sencilla para saber dónde estás, comprender el material y reconocer qué sigue.</p>
        </motion.div>

        <div className="student-step-grid">
          {STUDENT_STEPS.map(({ number, title, description, Icon }, index) => (
            <motion.article className="student-step-card" key={number} initial={{ opacity: 0, y: 26 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, margin: '-10%' }} transition={{ duration: 0.7, delay: index * 0.08 }}>
              <span className="student-step-number" aria-hidden="true">{number}</span>
              <div className="student-step-icon"><Icon size={23} /></div>
              <h3>{title}</h3>
              <p>{description}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

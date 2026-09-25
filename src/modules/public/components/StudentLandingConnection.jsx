import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { CONNECTION_ITEMS } from './studentLandingContent';

export default function StudentLandingConnection() {
  return (
    <section className="student-section student-connection" id="conexion" aria-labelledby="student-connection-title">
      <div className="student-container student-connection-grid">
        <motion.div className="student-connection-copy" initial={{ opacity: 0, x: -28 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: false, margin: '-10%' }} transition={{ duration: 0.75 }}>
          <div className="student-section-label">Una plataforma conectada</div>
          <h2 id="student-connection-title">Lo que prepara tu profesor llega con contexto.</h2>
          <p>Katedra conecta dos experiencias: el profesor organiza la clase y el alumno encuentra el material, las actividades y las indicaciones en una secuencia comprensible.</p>
        </motion.div>

        <motion.div className="student-connection-flow" initial={{ opacity: 0, x: 28 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: false, margin: '-10%' }} transition={{ duration: 0.75, delay: 0.08 }} aria-label="Flujo entre el material del profesor y la experiencia del alumno">
          {CONNECTION_ITEMS.map(({ label, meta, Icon }, index) => (
            <div key={label}>
              {index > 0 && <div className="student-connection-arrow" aria-hidden="true"><ArrowDown size={16} /></div>}
              <div className="student-connection-item">
                <div className="student-connection-item-icon"><Icon size={20} /></div>
                <div><strong>{label}</strong><span>{meta}</span></div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { STUDENT_FAQS } from './studentLandingContent';

export default function StudentLandingFaq() {
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <section className="student-section student-section-soft" id="preguntas" aria-labelledby="student-faq-title">
      <div className="student-container">
        <motion.div className="student-section-heading" initial={{ opacity: 0, y: 26 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, margin: '-10%' }} transition={{ duration: 0.7 }}>
          <div className="student-section-label">Preguntas frecuentes</div>
          <h2 id="student-faq-title">Lo que debes saber.</h2>
          <p>La experiencia para alumnos está en desarrollo. Estas respuestas delimitan lo que se está preparando.</p>
        </motion.div>

        <motion.div className="student-faq-list" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, margin: '-8%' }} transition={{ duration: 0.7, delay: 0.08 }}>
          {STUDENT_FAQS.map(({ question, answer }, index) => {
            const isOpen = openFaq === index;
            const panelId = `student-faq-panel-${index}`;
            return (
              <div className="student-faq-item" key={question}>
                <button className="student-faq-question" type="button" aria-expanded={isOpen} aria-controls={panelId} onClick={() => setOpenFaq(isOpen ? -1 : index)}>
                  <span>{question}</span>
                  <span className="student-faq-plus" aria-hidden="true"><Plus size={20} /></span>
                </button>
                <div className="student-faq-answer" id={panelId} hidden={!isOpen}>
                  <p>{answer}</p>
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

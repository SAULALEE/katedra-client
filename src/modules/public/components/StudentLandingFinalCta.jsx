import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function StudentLandingFinalCta({ navigate }) {
  const goToTeachers = (event) => {
    event.preventDefault();
    navigate('/');
  };

  return (
    <section className="student-final" aria-labelledby="student-final-title">
      <motion.div className="student-final-card" initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, margin: '-8%' }} transition={{ duration: 0.75 }}>
        <div className="student-final-content">
          <h2 id="student-final-title">Entregar es una parte. Aprender de la devolución completa el ciclo.</h2>
          <p>Katedra conecta el material del profesor, el trabajo del alumno y el siguiente paso para mejorar.</p>
          <a className="student-button student-button-primary" href="/" onClick={goToTeachers}>
            Conocer Katedra para profesores <ArrowRight size={17} />
          </a>
        </div>
      </motion.div>
    </section>
  );
}

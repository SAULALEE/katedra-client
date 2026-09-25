import { motion } from 'framer-motion';
import {
  ArrowRight,
  BarChart3,
  BookOpenCheck,
  Check,
  ClipboardCheck,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

const COMPARISON_ROWS = [
  {
    moment: 'Después de calificar',
    common: 'El alumno recibe una nota y comentarios.',
    katedra: 'Relaciona cada error con el concepto y el material que debe revisar.',
  },
  {
    moment: 'Para reforzar',
    common: 'El profesor prepara otra actividad o el alumno busca ayuda.',
    katedra: 'Propone una explicación breve y práctica basada en ese error.',
  },
  {
    moment: 'Para comprobar mejora',
    common: 'Se reutiliza la entrega o se crea una evaluación nueva.',
    katedra: 'Genera una pregunta diferente del mismo concepto, solo si el profesor la habilita.',
  },
  {
    moment: 'Para la siguiente clase',
    common: 'Se consultan calificaciones y estado de entregas.',
    katedra: 'Resume dificultades del grupo para ayudar al profesor a preparar el refuerzo.',
  },
];

function FormsPreview() {
  return (
    <div className="student-forms-preview" aria-label="Vista conceptual de Katedra Forms">
      <div className="student-forms-bar">
        <div><span>K</span><strong>Katedra Forms</strong></div>
        <small>Vista conceptual</small>
      </div>
      <div className="student-forms-body">
        <div className="student-form-question">
          <div className="student-form-meta"><span>Pregunta 4 de 10</span><span>Parcial · Ecosistemas</span></div>
          <h3>¿Qué sucede si disminuye la población de productores en una cadena alimenticia?</h3>
          {['Aumenta la energía disponible', 'Disminuye la energía para los consumidores', 'No cambia el ecosistema'].map((option, index) => (
            <div className={`student-form-option${index === 1 ? ' is-selected' : ''}`} key={option}>
              <span>{String.fromCharCode(65 + index)}</span>{option}{index === 1 && <Check size={16} />}
            </div>
          ))}
        </div>
        <aside className="student-form-insight">
          <div className="student-form-insight-label"><Sparkles size={14} /> Después del parcial</div>
          <strong>Concepto por reforzar</strong>
          <h4>Flujo de energía</h4>
          <div className="student-form-path"><BookOpenCheck size={16} /><span>Revisa las páginas 8–12</span></div>
          <div className="student-form-path"><RotateCcw size={16} /><span>Nuevo ejercicio autorizado</span></div>
        </aside>
      </div>
    </div>
  );
}

export default function StudentLandingForms() {
  return (
    <section className="student-section student-forms" id="evaluaciones" aria-labelledby="student-forms-title">
      <div className="student-container">
        <div className="student-forms-intro">
          <motion.div className="student-forms-copy" initial={{ opacity: 0, x: -28 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: false, margin: '-10%' }} transition={{ duration: 0.75 }}>
            <div className="student-section-label">Katedra Forms</div>
            <h2 id="student-forms-title">Un parcial que también muestra cómo continuar aprendiendo.</h2>
            <p>El profesor crea y comparte una evaluación desde sus materiales, configura la duración, los intentos y la devolución. Después, Katedra puede convertir los errores en una ruta de refuerzo.</p>
            <div className="student-forms-features">
              <span><ClipboardCheck size={17} /> Evaluaciones dentro de la clase</span>
              <span><BarChart3 size={17} /> Diagnóstico por concepto</span>
              <span><RotateCcw size={17} /> Reintentos controlados</span>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 28 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: false, margin: '-10%' }} transition={{ duration: 0.75, delay: 0.08 }}>
            <FormsPreview />
          </motion.div>
        </div>

        <motion.div className="student-comparison" initial={{ opacity: 0, y: 26 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, margin: '-8%' }} transition={{ duration: 0.75 }}>
          <div className="student-comparison-heading">
            <div>
              <span>El diferenciador</span>
              <h3>La evaluación no termina cuando aparece la calificación.</h3>
            </div>
            <p>Classroom y Teams cubren la asignación, entrega, calificación y retroalimentación. Katedra propone continuar ese flujo con recuperación personalizada y evidencia de mejora.</p>
          </div>

          <div className="student-comparison-table" role="table" aria-label="Comparación del flujo posterior a una evaluación">
            <div className="student-comparison-row student-comparison-header" role="row">
              <div role="columnheader">Momento</div>
              <div role="columnheader">Flujo habitual en un LMS</div>
              <div role="columnheader">Katedra propone</div>
            </div>
            {COMPARISON_ROWS.map(({ moment, common, katedra }) => (
              <div className="student-comparison-row" role="row" key={moment}>
                <div role="cell"><strong>{moment}</strong></div>
                <div role="cell">{common}</div>
                <div role="cell"><ArrowRight size={15} /> <span>{katedra}</span></div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

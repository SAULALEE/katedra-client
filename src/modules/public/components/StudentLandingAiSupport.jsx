import { motion } from 'framer-motion';
import {
  FileText,
  ListChecks,
  MessageCircleQuestion,
  RefreshCcw,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

const AI_MOMENTS = [
  {
    stage: 'Antes de empezar',
    title: 'Entiende qué te están pidiendo',
    description: 'Katedra explica la consigna, la divide en pasos y señala información que debes confirmar con tu profesor.',
    Icon: MessageCircleQuestion,
  },
  {
    stage: 'Mientras estudias',
    title: 'Convierte un PDF en una ruta clara',
    description: 'Resume el material, explica un apartado y señala las páginas usadas para que puedas comprobar la respuesta.',
    Icon: FileText,
  },
  {
    stage: 'Después de la devolución',
    title: 'Comprende cómo puedes mejorar',
    description: 'Traduce la rúbrica y los comentarios del profesor en conceptos por reforzar y acciones concretas.',
    Icon: ListChecks,
  },
];

export default function StudentLandingAiSupport() {
  return (
    <section className="student-section student-ai" id="acompanamiento" aria-labelledby="student-ai-title">
      <div className="student-container">
        <motion.div className="student-section-heading" initial={{ opacity: 0, y: 26 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, margin: '-10%' }} transition={{ duration: 0.7 }}>
          <div className="student-section-label">IA dentro de tu clase</div>
          <h2 id="student-ai-title">Cuando algo no queda claro, sabes qué hacer después.</h2>
          <p>La ayuda parte de la consigna, los materiales y las reglas que definió tu profesor.</p>
        </motion.div>

        <div className="student-ai-grid">
          {AI_MOMENTS.map(({ stage, title, description, Icon }, index) => (
            <motion.article className="student-ai-card" key={stage} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, margin: '-8%' }} transition={{ duration: 0.65, delay: index * 0.08 }}>
              <div className="student-ai-card-top">
                <div className="student-ai-icon"><Icon size={22} /></div>
                <span>{stage}</span>
              </div>
              <h3>{title}</h3>
              <p>{description}</p>
            </motion.article>
          ))}
        </div>

        <motion.div className="student-ai-guardrail" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, margin: '-8%' }} transition={{ duration: 0.65, delay: 0.12 }}>
          <div className="student-ai-guardrail-icon"><ShieldCheck size={24} /></div>
          <div>
            <strong>El profesor mantiene el control.</strong>
            <p>Puede permitir solo la explicación, habilitar una corrección o autorizar un nuevo intento. La IA respeta esa decisión y nunca cambia la calificación.</p>
          </div>
          <div className="student-ai-rule" aria-label="Ejemplo de configuración del profesor">
            <span><Sparkles size={14} /> Explicar devolución</span>
            <span><RefreshCcw size={14} /> Reintento: con autorización</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

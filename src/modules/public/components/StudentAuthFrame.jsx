import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

/**
 * Split auth card for the student portal. Mirrors the teacher TeacherAuthShell layout
 * (copy + illustration on the left, brand + form on the right) with the student accent.
 */
export default function StudentAuthFrame({ eyebrow, headline, lead, icon: Icon = BookOpen, title, description, children }) {
  return <main id="contenido" className="sl-portal-main sl-portal-auth-main">
    <div className="sl-portal-auth-layout sl-container">
      <div className="sl-portal-auth-intro">
        <span className="sl-portal-eyebrow"><Icon size={17} aria-hidden="true" />{eyebrow}</span>
        <h2 className="sl-portal-auth-headline">{headline}</h2>
        <p className="sl-portal-auth-lead">{lead}</p>
        <div className="sl-portal-auth-orbit" aria-hidden="true"><Icon size={66} strokeWidth={1.3} /><span>Katedra Alumnos</span></div>
      </div>
      <div className="sl-portal-card sl-portal-auth-card">
        <span className="sl-portal-auth-mobmark" aria-hidden="true"><Icon size={36} strokeWidth={1.4} /></span>
        <Link to="/alumnos" className="sl-portal-auth-brand" aria-label="Ir a Katedra Alumnos">
          <span className="sl-portal-auth-brand-mark" aria-hidden="true">K</span>
          <span>Katedra <em>Alumnos</em></span>
        </Link>
        <h1 className="sl-portal-auth-title">{title}</h1>
        {description && <p className="sl-portal-auth-description">{description}</p>}
        {children}
      </div>
    </div>
  </main>;
}

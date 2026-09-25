export default function StudentLandingFooter({ navigate }) {
  const goToTeachers = (event) => {
    event.preventDefault();
    navigate('/');
  };

  return (
    <footer className="student-footer">
      <div className="student-container">
        <div className="student-footer-main">
          <div className="student-footer-brand">
            <strong>Katedra para alumnos</strong>
            <p>Una experiencia en desarrollo para entender materiales, presentar evaluaciones y aprender de cada devolución.</p>
          </div>
          <nav className="student-footer-links" aria-label="Enlaces del pie de página">
            <a href="#como-funcionara">Cómo funcionará</a>
            <a href="#acompanamiento">IA para aprender</a>
            <a href="#evaluaciones">Katedra Forms</a>
            <a href="#preguntas">Preguntas</a>
            <a href="/" onClick={goToTeachers}>Para profesores</a>
          </nav>
        </div>
        <div className="student-footer-bottom">
          <span>© 2026 Katedra. Todos los derechos reservados.</span>
          <span>Experiencia para alumnos en desarrollo.</span>
        </div>
      </div>
    </footer>
  );
}

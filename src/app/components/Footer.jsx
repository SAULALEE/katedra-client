import Container from './Container';

export default function Footer() {
  return (
    <footer className="w-full h-[56px] border-t border-hairline bg-canvas text-ink-muted text-sm flex items-center mt-16 select-none">
      <Container size="7xl" className="flex items-center justify-between h-full">
        <p>© {new Date().getFullYear()} Katedra. Todos los derechos reservados.</p>
        <p className="hidden sm:block">Creado con amor para la comunidad educativa.</p>
      </Container>
    </footer>
  );
}

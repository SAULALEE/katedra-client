import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen bg-canvas text-ink flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-surface-1 border border-hairline rounded-2xl p-8 shadow-2xl text-center space-y-4">
        <h1 className="text-xl font-bold">Página no encontrada</h1>
        <p className="text-sm text-ink-muted">La página que buscas no existe o fue movida.</p>
        <Button variant="primary" onClick={() => navigate('/', { replace: true })} className="w-full">
          Volver al inicio
        </Button>
      </div>
    </div>
  );
}

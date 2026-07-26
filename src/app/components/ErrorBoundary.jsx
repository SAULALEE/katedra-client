import { Component } from 'react';
import Button from './Button';

export default class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('Uncaught render error:', error, info);
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <div className="w-full min-h-screen bg-canvas text-ink flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-surface-1 border border-hairline rounded-2xl p-8 shadow-2xl text-center space-y-4">
          <h1 className="text-xl font-bold">Algo salió mal</h1>
          <p className="text-sm text-ink-muted">
            Ha ocurrido un error inesperado. Intenta recargar la página.
          </p>
          <Button variant="primary" onClick={() => window.location.assign('/')} className="w-full">
            Volver al inicio
          </Button>
        </div>
      </div>
    );
  }
}

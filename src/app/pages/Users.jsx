import React, { useState } from 'react';
import ResponsiveSidebar from '../components/ResponsiveSidebar';
import Card from '../components/Card';
import Button from '../components/Button';
import { useUsers } from '../hooks/useUsers';

const ROLE_OPTIONS = [
  { id: 'ROLE_USER', short: 'Usuario' },
  { id: 'ROLE_ADMIN', short: 'Admin' }
];

export default function Users() {
  const { users, loading, error, updateUser, deleteUser } = useUsers();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [rol, setRol] = useState('ROLE_USER');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEditClick = (user) => {
    setEditingUser(user);
    setNombre(user.nombre || '');
    setEmail(user.email || '');
    setRol(user.rol || 'ROLE_USER');
    setFormError('');
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (user) => {
    const confirmed = window.confirm(`¿Eliminar al usuario "${user.nombre}"?`);
    if (!confirmed) {
      return;
    }

    await deleteUser(user.id);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!editingUser) {
      return;
    }

    if (!nombre.trim() || !email.trim()) {
      setFormError('Por favor, completa el nombre y correo electronico.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setFormError('Por favor, ingresa un correo electronico valido.');
      return;
    }

    setIsSubmitting(true);

    const success = await updateUser(editingUser.id, {
      nombre,
      email,
      rol
    });

    setIsSubmitting(false);

    if (success) {
      setIsModalOpen(false);
      setEditingUser(null);
    }
  };

  return (
    <div className="w-full min-h-screen bg-canvas text-ink flex flex-col md:flex-row selection:bg-brand-primary selection:text-white">
      <ResponsiveSidebar />

      <main className="flex-1 flex flex-col min-w-0 bg-canvas">
        <header className="h-[56px] border-b border-hairline bg-canvas/80 backdrop-blur-md sticky top-0 z-30 w-full flex items-center">
          <div className="w-full px-4 sm:px-6 md:px-8 flex items-center justify-between">
            <h2 className="text-sm font-semibold tracking-card-title text-ink">Administracion de Usuarios</h2>
            <Button
              variant="secondary"
              disabled
              className="px-4 py-2 font-medium opacity-60 cursor-not-allowed"
            >
              Alta deshabilitada
            </Button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto">
          <div className="p-6 sm:p-8 md:p-10 flex flex-col gap-6 sm:gap-8 w-full max-w-7xl mx-auto">
            <div className="border border-hairline bg-surface-1/40 rounded-lg p-5 flex flex-col gap-2">
              <span className="text-[10px] uppercase tracking-wider text-brand-primary font-bold">Modulo Administrativo</span>
              <h3 className="text-sm font-semibold text-ink">Mantener Usuarios</h3>
              <p className="text-xs text-ink-muted leading-relaxed max-w-3xl">
                Consulta, actualiza y elimina cuentas registradas desde el backend real.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between px-1">
                <h4 className="text-card-title font-semibold tracking-card-title text-ink">Listado General</h4>
                <span className="text-body-sm text-ink-muted font-medium">
                  {loading ? 'Sincronizando...' : `${users.length} usuarios registrados`}
                </span>
              </div>

              {error && (
                <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-md text-xs text-rose-400">
                  {error}
                </div>
              )}

              <Card surface="1" className="p-0 overflow-hidden shadow-xl border-hairline">
                <div className="overflow-x-auto w-full">
                  <table className="w-full text-left text-body-sm border-collapse min-w-[700px] sm:min-w-0">
                    <thead>
                      <tr className="border-b border-hairline bg-surface-2/60 text-ink-muted font-semibold select-none">
                        <th className="p-4 sm:p-5 font-bold text-caption uppercase tracking-wider">Nombre</th>
                        <th className="p-4 sm:p-5 font-bold text-caption uppercase tracking-wider">Correo Electronico</th>
                        <th className="p-4 sm:p-5 font-bold text-caption uppercase tracking-wider">Rol de Sistema</th>
                        <th className="p-4 sm:p-5 font-bold text-caption uppercase tracking-wider">Fecha Registro</th>
                        <th className="p-4 sm:p-5 font-bold text-caption uppercase tracking-wider text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-hairline">
                      {loading && users.length === 0 ? (
                        [1, 2, 3].map((item) => (
                          <tr key={item} className="animate-pulse">
                            <td className="p-4 sm:p-5"><div className="h-3.5 bg-hairline rounded w-3/4"></div></td>
                            <td className="p-4 sm:p-5"><div className="h-3.5 bg-hairline rounded w-5/6"></div></td>
                            <td className="p-4 sm:p-5"><div className="h-3.5 bg-hairline rounded w-1/2"></div></td>
                            <td className="p-4 sm:p-5"><div className="h-3.5 bg-hairline rounded w-1/3"></div></td>
                            <td className="p-4 sm:p-5 text-right"><div className="h-3.5 bg-hairline rounded w-20 ml-auto"></div></td>
                          </tr>
                        ))
                      ) : users.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="p-8 text-center text-ink-muted text-xs">
                            No se encontraron usuarios en el sistema.
                          </td>
                        </tr>
                      ) : (
                        users.map((u) => (
                          <tr key={u.id} className="hover:bg-surface-2/40 transition-colors duration-150">
                            <td className="p-4 sm:p-5 font-semibold text-ink flex items-center gap-3">
                              <div className="w-7 h-7 rounded-full bg-brand-primary/20 text-brand-primary flex items-center justify-center font-bold text-xs select-none">
                                {u.nombre?.charAt(0) || 'U'}
                              </div>
                              <span>{u.nombre}</span>
                            </td>
                            <td className="p-4 sm:p-5 text-ink-muted font-mono text-[11px] select-all">{u.email}</td>
                            <td className="p-4 sm:p-5">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium border ${
                                u.rol === 'ROLE_ADMIN'
                                  ? 'bg-[#052B58]/10 text-brand-primary border-brand-primary/20'
                                  : 'bg-surface-2 text-ink-muted border-hairline'
                              }`}>
                                {u.rol}
                              </span>
                            </td>
                            <td className="p-4 sm:p-5 text-ink-muted">
                              {u.fechaRegistro ? String(u.fechaRegistro).split('T')[0] : '—'}
                            </td>
                            <td className="p-4 sm:p-5">
                              <div className="flex items-center justify-end gap-4">
                                <button
                                  onClick={() => handleEditClick(u)}
                                  className="text-body-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer select-none"
                                >
                                  Editar
                                </button>
                                <button
                                  onClick={() => handleDeleteClick(u)}
                                  className="text-body-sm font-semibold text-rose-400 hover:text-rose-300 transition-colors cursor-pointer select-none"
                                >
                                  Eliminar
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>

      {isModalOpen && editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#010102]/80 backdrop-blur-md p-6 transition-all duration-200">
          <div
            className="w-full max-w-[500px] bg-surface-1 border border-hairline rounded-2xl shadow-[0_30px_70px_rgba(0,0,0,0.85)] relative flex flex-col"
            style={{ padding: '48px', gap: '32px' }}
          >
            <div className="flex justify-between items-start pb-5 border-b border-hairline select-none" style={{ gap: '20px' }}>
              <div>
                <h3 className="text-lg font-bold text-ink tracking-tight">Editar Usuario</h3>
                <p className="text-xs text-ink-muted mt-1.5 leading-relaxed">
                  Actualiza nombre, correo y rol del usuario.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                type="button"
                className="w-8 h-8 rounded-full border border-hairline hover:border-hairline-strong hover:bg-surface-2 flex items-center justify-center text-ink-muted hover:text-ink cursor-pointer transition-all shrink-0"
                aria-label="Cerrar modal"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col" style={{ gap: '28px' }}>
              <div className="flex flex-col" style={{ gap: '20px' }}>
                <div className="flex flex-col" style={{ gap: '8px' }}>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-ink-muted select-none">
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Ejem. Dra. Viviana Solano"
                    disabled={isSubmitting}
                    className="w-full bg-surface-2 border border-hairline hover:border-hairline-strong focus:border-brand-primary rounded-xl py-3.5 px-4 text-xs text-ink outline-none transition-all placeholder:text-ink-tertiary focus:ring-1 focus:ring-brand-primary-focus"
                  />
                </div>

                <div className="flex flex-col" style={{ gap: '8px' }}>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-ink-muted select-none">
                    Correo Electronico
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="docente@katedra.edu"
                    disabled={isSubmitting}
                    className="w-full bg-surface-2 border border-hairline hover:border-hairline-strong focus:border-brand-primary rounded-xl py-3.5 px-4 text-xs text-ink outline-none transition-all placeholder:text-ink-tertiary focus:ring-1 focus:ring-brand-primary-focus"
                  />
                </div>
              </div>

              <div className="flex flex-col" style={{ gap: '8px' }}>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-ink-muted select-none">
                  Rol de Sistema
                </label>
                <div className="grid grid-cols-2 gap-2 bg-surface-2 p-1.5 rounded-xl border border-hairline select-none">
                  {ROLE_OPTIONS.map((roleOption) => {
                    const isSelected = rol === roleOption.id;
                    return (
                      <button
                        key={roleOption.id}
                        type="button"
                        onClick={() => setRol(roleOption.id)}
                        disabled={isSubmitting}
                        className={`py-3 px-1 text-center text-xs font-semibold rounded-lg cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-surface-1 text-ink border border-hairline-strong shadow-sm font-bold'
                            : 'text-ink-subtle hover:text-ink hover:bg-surface-3/30'
                        }`}
                      >
                        {roleOption.short}
                      </button>
                    );
                  })}
                </div>
              </div>

              {formError && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg text-[11px] text-rose-400 animate-fade-in font-semibold flex items-center gap-2">
                  <svg className="w-3.5 h-3.5 text-rose-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span>{formError}</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-3.5 pt-5 border-t border-hairline select-none">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSubmitting}
                  className="px-4 py-2.5 rounded-lg text-xs font-semibold text-ink-subtle hover:text-ink hover:bg-surface-2/60 cursor-pointer transition-all"
                >
                  Cancelar
                </button>
                <Button
                  variant="primary"
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 text-xs font-semibold"
                >
                  {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

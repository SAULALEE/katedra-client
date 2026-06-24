import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ResponsiveSidebar from '../components/ResponsiveSidebar';
import Button from '../components/Button';
import { useUsers } from '../hooks/useUsers';

const ROLE_OPTIONS = [
  { id: 'Docente Plan Libre', short: 'Libre' },
  { id: 'Docente Premium', short: 'Premium' },
  { id: 'Administrador', short: 'Admin' },
];

const ESTADO_OPTIONS = [
  { id: 'Activo', label: 'Activo' },
  { id: 'Inactivo', label: 'Inactivo' },
];

export default function Users() {
  const { users, loading, error, createUser, updateUser } = useUsers();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [rol, setRol] = useState('Docente Premium');
  const [estado, setEstado] = useState('Activo');

  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const rolIndex = ROLE_OPTIONS.findIndex((option) => option.id === rol);

  const handleAddClick = () => {
    setEditingUser(null);
    setNombre('');
    setEmail('');
    setRol('Docente Premium');
    setEstado('Activo');
    setFormError('');
    setIsModalOpen(true);
  };

  const handleEditClick = (user) => {
    setEditingUser(user);
    setNombre(user.nombre);
    setEmail(user.email);
    setRol(user.rol);
    setEstado(user.estado);
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!nombre.trim() || !email.trim()) {
      setFormError('Por favor, completa el nombre y correo electrónico.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setFormError('Por favor, ingresa un correo electrónico válido.');
      return;
    }

    setIsSubmitting(true);

    const payload = { nombre, email, rol, estado };
    let success = false;

    if (editingUser) {
      success = await updateUser(editingUser.id, payload);
    } else {
      success = await createUser(payload);
    }

    setIsSubmitting(false);

    if (success) {
      setIsModalOpen(false);
    }
  };

  return (
    <div className="w-full h-screen bg-canvas text-ink flex flex-col md:flex-row font-sans overflow-hidden">

      <ResponsiveSidebar />

      <main className="flex-1 flex flex-col min-w-0 bg-surface-2 relative h-screen">

        <header className="h-[72px] border-b border-hairline bg-canvas/80 backdrop-blur-md sticky top-0 z-30 w-full flex items-center px-6 sm:px-10 justify-between gap-4">
          <div className="flex flex-col">
            <h2 className="text-lg sm:text-xl font-bold leading-tight tracking-tight text-ink">Administración de Usuarios</h2>
            <span className="text-[11px] mt-0.5 font-medium text-ink-muted">Gestión de Accesos</span>
          </div>
          <Button
            variant="primary"
            onClick={handleAddClick}
            className="w-full sm:w-auto bg-brand-primary text-white px-5 py-2.5 text-xs font-bold rounded-xl shadow-soft hover:-translate-y-0.5 hover:shadow-hover transition-all duration-300"
          >
            + Agregar Usuario
          </Button>
        </header>

        <div className="flex-1 overflow-y-auto scrollbar-none">
          <div className="p-6 sm:p-10 flex flex-col gap-8 w-full max-w-5xl mx-auto">

            <div className="flex flex-col gap-5 w-full">
              <div className="flex items-center justify-between px-1">
                <h4 className="text-base font-bold tracking-tight text-ink">Listado de Docentes</h4>
                <span className="text-[11px] text-ink-muted font-bold bg-canvas border border-hairline px-3 py-1.5 rounded-full shadow-sm">
                  {loading ? 'Sincronizando...' : `${users.length} registrados`}
                </span>
              </div>

              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-xs font-semibold text-red-500 flex items-center gap-2.5">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                  {error}
                </div>
              )}

              <div className="bg-canvas border border-hairline rounded-[20px] shadow-soft overflow-x-auto w-full">
                <table className="w-full text-left border-collapse min-w-[650px]">
                  <thead>
                    <tr className="border-b border-hairline bg-surface-2/50 text-ink-subtle">
                      <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider">Nombre Completo</th>
                      <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider">Correo Electrónico</th>
                      <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider">Rol Asignado</th>
                      <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider">Estado</th>
                      <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-hairline">
                    {loading && users.length === 0 ? (
                      [1, 2, 3].map((item) => (
                        <tr key={item} className="animate-pulse">
                          <td className="py-4 px-6"><div className="h-3.5 bg-surface-3 rounded w-3/4"></div></td>
                          <td className="py-4 px-6"><div className="h-3.5 bg-surface-3 rounded w-5/6"></div></td>
                          <td className="py-4 px-6"><div className="h-3.5 bg-surface-3 rounded w-1/2"></div></td>
                          <td className="py-4 px-6"><div className="h-5 bg-surface-3 rounded-full w-20"></div></td>
                          <td className="py-4 px-6 text-right"><div className="h-3.5 bg-surface-3 rounded w-12 ml-auto"></div></td>
                        </tr>
                      ))
                    ) : users.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="p-10 text-center text-ink-muted text-sm font-medium">
                          No hay usuarios registrados. Usa el botón superior para agregar uno nuevo.
                        </td>
                      </tr>
                    ) : (
                      users.map((u) => (
                        <tr key={u.id} className="hover:bg-surface-2/80 transition-colors duration-200 group">
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-brand-primary/10 text-brand-primary flex items-center justify-center font-bold text-xs uppercase select-none shrink-0 border border-brand-primary/20">
                                {u.nombre.charAt(0)}
                              </div>
                              <span className="font-semibold text-ink text-sm group-hover:text-brand-primary transition-colors">{u.nombre}</span>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-ink-muted font-medium text-xs select-all">{u.email}</td>
                          <td className="py-4 px-6">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wide uppercase border ${
                              u.rol === 'Administrador'
                                ? 'bg-brand-primary/10 text-brand-primary border-brand-primary/20'
                                : 'bg-surface-3 text-ink-muted border-transparent'
                            }`}>
                              {u.rol}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-bold tracking-wide uppercase ${
                              u.estado === 'Activo' 
                                ? 'bg-semantic-success/10 text-semantic-success border-semantic-success/20' 
                                : 'bg-red-500/10 text-red-500 border-red-500/20'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${u.estado === 'Activo' ? 'bg-semantic-success' : 'bg-red-500'}`}></span>
                              {u.estado}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-right">
                            <button
                              onClick={() => handleEditClick(u)}
                              className="px-3 py-1.5 rounded-lg text-xs font-bold text-brand-primary bg-brand-primary/5 hover:bg-brand-primary/15 transition-colors cursor-pointer select-none"
                            >
                              Editar
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* OVERLAY MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#010102]/70 backdrop-blur-md p-4 sm:p-6 transition-all duration-300">
          <div className="w-full max-w-[480px] bg-canvas border border-hairline rounded-[24px] shadow-illustrative relative flex flex-col p-8 max-h-[90vh] overflow-y-auto scrollbar-none">
            
            <div className="flex justify-between items-start pb-6 border-b border-hairline select-none">
              <div className="flex flex-col gap-1.5">
                <h3 className="text-xl font-bold tracking-tight text-ink">
                  {editingUser ? 'Editar Docente' : 'Nuevo Docente'}
                </h3>
                <p className="text-xs font-medium text-ink-subtle">
                  Completa el perfil del usuario para el sistema.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full border border-hairline bg-surface-1 hover:bg-surface-2 flex items-center justify-center text-ink-subtle hover:text-ink transition-all duration-300 shrink-0 cursor-pointer shadow-sm"
                aria-label="Cerrar modal"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6 mt-6">

              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-ink-subtle select-none">Nombre Completo</label>
                  <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Ej. Dra. Viviana Solano"
                    disabled={isSubmitting}
                    className="w-full rounded-xl py-3 px-4 text-sm font-medium bg-surface-2 border border-transparent focus:bg-surface-1 focus:border-brand-primary text-ink outline-none transition-all placeholder:text-ink-muted/50"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-ink-subtle select-none">Correo Electrónico</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="docente@katedra.edu"
                    disabled={isSubmitting}
                    className="w-full rounded-xl py-3 px-4 text-sm font-medium bg-surface-2 border border-transparent focus:bg-surface-1 focus:border-brand-primary text-ink outline-none transition-all placeholder:text-ink-muted/50"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-ink-subtle select-none">
                  Rol de Sistema
                </label>
                <div className="relative flex bg-surface-2 p-1.5 rounded-xl border border-hairline select-none">
                  <motion.div
                    className="absolute top-1.5 bottom-1.5 left-1.5 w-[calc(33.333%-4px)] rounded-lg bg-surface-1 shadow-sm border border-hairline"
                    animate={{ x: `${rolIndex * 100}%` }}
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                  />
                  {ROLE_OPTIONS.map((roleOption) => {
                    const isSelected = rol === roleOption.id;
                    return (
                      <button
                        key={roleOption.id}
                        type="button"
                        onClick={() => setRol(roleOption.id)}
                        disabled={isSubmitting}
                        className={`relative z-10 flex-1 py-2.5 px-2 text-center text-xs font-bold rounded-lg cursor-pointer transition-colors duration-300 ${
                          isSelected
                            ? 'text-brand-primary'
                            : 'text-ink-muted hover:text-ink'
                        }`}
                      >
                        {roleOption.short}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-ink-subtle select-none">
                  Estado de la Cuenta
                </label>
                <div className="flex gap-3 select-none">
                  {ESTADO_OPTIONS.map((stateOption) => {
                    const isSelected = estado === stateOption.id;
                    return (
                      <button
                        key={stateOption.id}
                        type="button"
                        onClick={() => setEstado(stateOption.id)}
                        disabled={isSubmitting}
                        className={`flex-1 py-2.5 text-xs font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 border ${
                          isSelected && stateOption.id === 'Activo'
                            ? 'bg-semantic-success/10 text-semantic-success border-semantic-success/30 shadow-sm'
                            : isSelected && stateOption.id === 'Inactivo'
                            ? 'bg-red-500/10 text-red-500 border-red-500/30 shadow-sm'
                            : 'bg-surface-2 text-ink-muted border-transparent hover:text-ink hover:bg-surface-3'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          isSelected && stateOption.id === 'Activo' ? 'bg-semantic-success animate-pulse' 
                          : isSelected && stateOption.id === 'Inactivo' ? 'bg-red-500' 
                          : 'bg-ink-tertiary'
                        }`} />
                        <span>{stateOption.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {formError && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-500 font-bold flex items-center gap-2">
                  <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span>{formError}</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-6 border-t border-hairline select-none">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-ink-muted hover:text-ink hover:bg-surface-2 cursor-pointer transition-all duration-300"
                >
                  Cancelar
                </button>
                <Button
                  variant="primary"
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-brand-primary text-white px-6 py-2.5 text-xs font-bold rounded-xl shadow-soft hover:-translate-y-0.5 hover:shadow-hover transition-all duration-300"
                >
                  {isSubmitting ? 'Guardando...' : editingUser ? 'Guardar Cambios' : 'Registrar Docente'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

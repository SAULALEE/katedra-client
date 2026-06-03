import React, { useState } from 'react';
import ResponsiveSidebar from '../components/ResponsiveSidebar';
import Card from '../components/Card';
import Button from '../components/Button';
import { Input } from '../components/Input';
import { useUsers } from '../hooks/useUsers';

export default function Users() {
  const { users, loading, error, createUser, updateUser } = useUsers();
  
  // Modal / Form States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null); // null if adding, user object if editing
  
  // Field States
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [rol, setRol] = useState('Docente Premium');
  const [estado, setEstado] = useState('Activo');
  
  // Error States
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Open modal for adding a new user
  const handleAddClick = () => {
    setEditingUser(null);
    setNombre('');
    setEmail('');
    setRol('Docente Premium');
    setEstado('Activo');
    setFormError('');
    setIsModalOpen(true);
  };

  // Open modal for editing an existing user
  const handleEditClick = (user) => {
    setEditingUser(user);
    setNombre(user.nombre);
    setEmail(user.email);
    setRol(user.rol);
    setEstado(user.estado);
    setFormError('');
    setIsModalOpen(true);
  };

  // Handle form submission (Create or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!nombre.trim() || !email.trim()) {
      setFormError('Por favor, completa el nombre y correo electrónico.');
      return;
    }

    // Basic email validation
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
    <div className="w-full min-h-screen bg-canvas text-ink flex flex-col md:flex-row selection:bg-brand-primary selection:text-white">
      
      {/* Sidebar Navigation */}
      <ResponsiveSidebar />

      {/* Main Content Workspace */}
      <main className="flex-1 flex flex-col min-w-0 bg-canvas">
        
        {/* Top Header Panel */}
        <header className="h-[56px] border-b border-hairline bg-canvas/80 backdrop-blur-md sticky top-0 z-30 w-full flex items-center">
          <div className="w-full px-4 sm:px-6 md:px-8 flex items-center justify-between">
            <h2 className="text-sm font-semibold tracking-card-title text-ink">Administración de Usuarios</h2>
            <Button 
              variant="primary" 
              onClick={handleAddClick}
              className="px-4 py-2 font-medium"
            >
              + Agregar Usuario
            </Button>
          </div>
        </header>

        {/* User Workspace (Using strictly enforced padding p-6 sm:p-8 md:p-10) */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 sm:p-8 md:p-10 flex flex-col gap-6 sm:gap-8 w-full max-w-7xl mx-auto">
            
            {/* Context/Helper Banner */}
            <div className="border border-hairline bg-surface-1/40 rounded-lg p-5 flex flex-col gap-2">
              <span className="text-[10px] uppercase tracking-wider text-brand-primary font-bold">Modulo Administrativo</span>
              <h3 className="text-sm font-semibold text-ink">Base de Datos de Usuarios Katedra</h3>
              <p className="text-xs text-ink-muted leading-relaxed max-w-3xl">
                Administra los perfiles de docentes del sistema. Las operaciones de agregar y editar están 
                conectadas a la capa de servicios mediante un almacén global Zustand y simulan persistencia 
                interactiva. El código está 100% preparado para ser conectado a JPA y base de datos relacional MySQL.
              </p>
            </div>

            {/* List and Table wrapped in standard card container */}
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

              {/* Table Container Card */}
              <Card surface="1" className="p-0 overflow-hidden shadow-xl border-hairline">
                <div className="overflow-x-auto w-full">
                  <table className="w-full text-left text-body-sm border-collapse min-w-[700px] sm:min-w-0">
                    <thead>
                      <tr className="border-b border-hairline bg-surface-2/60 text-ink-muted font-semibold select-none">
                        <th className="p-4 sm:p-5 font-bold text-caption uppercase tracking-wider">Nombre</th>
                        <th className="p-4 sm:p-5 font-bold text-caption uppercase tracking-wider">Correo Electrónico</th>
                        <th className="p-4 sm:p-5 font-bold text-caption uppercase tracking-wider">Rol de Sistema</th>
                        <th className="p-4 sm:p-5 font-bold text-caption uppercase tracking-wider">Fecha Registro</th>
                        <th className="p-4 sm:p-5 font-bold text-caption uppercase tracking-wider">Estado</th>
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
                            <td className="p-4 sm:p-5"><div className="h-5 bg-hairline rounded-full w-16"></div></td>
                            <td className="p-4 sm:p-5 text-right"><div className="h-3.5 bg-hairline rounded w-10 ml-auto"></div></td>
                          </tr>
                        ))
                      ) : users.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="p-8 text-center text-ink-muted text-xs">
                            No se encontraron usuarios en el sistema. Presione "+ Agregar Usuario" para registrar uno.
                          </td>
                        </tr>
                      ) : (
                        users.map((u) => (
                          <tr key={u.id} className="hover:bg-surface-2/40 transition-colors duration-150">
                            <td className="p-4 sm:p-5 font-semibold text-ink flex items-center gap-3">
                              <div className="w-7 h-7 rounded-full bg-brand-primary/20 text-brand-primary flex items-center justify-center font-bold text-xs select-none">
                                {u.nombre.charAt(0)}
                              </div>
                              <span>{u.nombre}</span>
                            </td>
                            <td className="p-4 sm:p-5 text-ink-muted font-mono text-[11px] select-all">{u.email}</td>
                            <td className="p-4 sm:p-5">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium border ${
                                u.rol === 'Administrador' 
                                  ? 'bg-[#052B58]/10 text-brand-primary border-brand-primary/20' 
                                  : 'bg-surface-2 text-ink-muted border-hairline'
                              }`}>
                                {u.rol}
                              </span>
                            </td>
                            <td className="p-4 sm:p-5 text-ink-muted">{u.fechaRegistro}</td>
                            <td className="p-4 sm:p-5">
                              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-caption font-semibold ${
                                u.estado === 'Activo'
                                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                  : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                              }`}>
                                <span className={`w-1 h-1 rounded-full ${u.estado === 'Activo' ? 'bg-emerald-400' : 'bg-rose-400'}`}></span>
                                {u.estado}
                              </span>
                            </td>
                            <td className="p-4 sm:p-5 text-right">
                              <button 
                                onClick={() => handleEditClick(u)}
                                className="text-body-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer select-none"
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
              </Card>
            </div>
          </div>
        </div>
      </main>

      {/* OVERLAY MODAL - Elegant, Clean Minimalist UI Styling */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#010102]/80 backdrop-blur-md p-6 transition-all duration-200">
          
          {/* Modal Container with generous 48px padding and 500px width to ensure it feels luxurious and spacious */}
          <div 
            className="w-full max-w-[500px] bg-surface-1 border border-hairline rounded-2xl shadow-[0_30px_70px_rgba(0,0,0,0.85)] relative flex flex-col"
            style={{ padding: '48px', gap: '32px' }}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-start pb-5 border-b border-hairline select-none" style={{ gap: '20px' }}>
              <div>
                <h3 className="text-lg font-bold text-ink tracking-tight">
                  {editingUser ? 'Editar Docente' : 'Registrar Nuevo Docente'}
                </h3>
                <p className="text-xs text-ink-muted mt-1.5 leading-relaxed">
                  Completa los campos para registrar o actualizar el perfil en el sistema.
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

            {/* Modal Form Flow */}
            <form onSubmit={handleSubmit} className="flex flex-col" style={{ gap: '28px' }}>
              
              {/* Stacked Input Fields with Comfortable Gaps */}
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
                    Correo Electrónico
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

              {/* Rol Selection - Sleek Horizontal Segmented Grid */}
              <div className="flex flex-col" style={{ gap: '8px' }}>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-ink-muted select-none">
                  Rol de Sistema
                </label>
                <div className="grid grid-cols-3 gap-2 bg-surface-2 p-1.5 rounded-xl border border-hairline select-none">
                  {[
                    { id: 'Docente Plan Libre', short: 'Libre' },
                    { id: 'Docente Premium', short: 'Premium' },
                    { id: 'Administrador', short: 'Admin' }
                  ].map((roleOption) => {
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

              {/* Estado Selection - Clean Horizontal Toggle Switch */}
              <div className="flex flex-col" style={{ gap: '8px' }}>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-ink-muted select-none">
                  Estado de la Cuenta
                </label>
                <div className="flex p-1.5 bg-surface-2 rounded-xl border border-hairline select-none">
                  {[
                    { id: 'Activo', label: 'Activo', color: 'text-emerald-400', activeBg: 'bg-emerald-500/10 border-emerald-500/25', dotBg: 'bg-emerald-400 shadow-[0_0_8px_#34d399]' },
                    { id: 'Inactivo', label: 'Inactivo', color: 'text-rose-400', activeBg: 'bg-rose-500/10 border-rose-500/25', dotBg: 'bg-rose-400 shadow-[0_0_8px_#f43f5e]' }
                  ].map((stateOption) => {
                    const isSelected = estado === stateOption.id;
                    return (
                      <button
                        key={stateOption.id}
                        type="button"
                        onClick={() => setEstado(stateOption.id)}
                        disabled={isSubmitting}
                        className={`flex-1 py-3 text-xs font-bold rounded-lg flex items-center justify-center gap-2 cursor-pointer transition-all border border-transparent ${
                          isSelected
                            ? `${stateOption.activeBg} ${stateOption.color} font-bold shadow-md`
                            : 'text-ink-subtle hover:text-ink hover:bg-surface-3/30'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${stateOption.dotBg}`} />
                        <span>{stateOption.label}</span>
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

              {/* Action CTAs */}
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

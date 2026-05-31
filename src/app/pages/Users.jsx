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

      {/* OVERLAY MODAL - Fully Custom, Premium Linear UI Styling */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 sm:p-6 transition-all duration-300 animate-fade-in">
          
          {/* Modal Container (Strictly using p-6 sm:p-8 spacing tokens) */}
          <div 
            className="w-full max-w-[480px] bg-surface-1 border border-hairline rounded-lg p-6 sm:p-8 shadow-2xl relative flex flex-col gap-6"
          >
            
            {/* Modal Header */}
            <div className="flex justify-between items-start border-b border-hairline pb-4">
              <div>
                <span className="text-[9px] uppercase tracking-wider text-brand-primary font-bold">Formulario de Control</span>
                <h3 className="text-base font-bold text-ink mt-0.5">
                  {editingUser ? 'Editar Registro de Docente' : 'Registrar Nuevo Docente'}
                </h3>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-ink-muted hover:text-ink cursor-pointer transition-colors p-1"
                aria-label="Cerrar modal"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Form Flow (Using space-y-4 vertical spacing and space-y-1.5 label spacing) */}
            <form onSubmit={handleSubmit} className="space-y-5">
              
              <Input
                label="Nombre Completo"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ejem. Dra. Viviana Solano"
                disabled={isSubmitting}
              />

              <Input
                label="Correo Electrónico"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="docente@katedra.edu"
                disabled={isSubmitting}
              />

              {/* Rol Selection - Estilizado Linear */}
              <div className="space-y-1.5 w-full">
                <label className="block text-[10px] uppercase tracking-wider text-ink-muted font-medium select-none">
                  Rol de Sistema
                </label>
                <select
                  value={rol}
                  onChange={(e) => setRol(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full bg-surface-1 border border-hairline hover:border-hairline-strong focus:border-brand-primary rounded-md p-3 text-xs text-ink outline-none transition-all duration-200 focus:ring-1 focus:ring-brand-primary-focus cursor-pointer"
                >
                  <option value="Docente Plan Libre">Docente Plan Libre</option>
                  <option value="Docente Premium">Docente Premium</option>
                  <option value="Administrador">Administrador</option>
                </select>
              </div>

              {/* Estado Selection - Estilizado Linear */}
              <div className="space-y-1.5 w-full">
                <label className="block text-[10px] uppercase tracking-wider text-ink-muted font-medium select-none">
                  Estado Operativo
                </label>
                <select
                  value={estado}
                  onChange={(e) => setEstado(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full bg-surface-1 border border-hairline hover:border-hairline-strong focus:border-brand-primary rounded-md p-3 text-xs text-ink outline-none transition-all duration-200 focus:ring-1 focus:ring-brand-primary-focus cursor-pointer"
                >
                  <option value="Activo">Activo</option>
                  <option value="Inactivo">Inactivo</option>
                </select>
              </div>

              {formError && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-md text-[11px] text-rose-400 animate-fade-in">
                  {formError}
                </div>
              )}

              {/* Action CTAs (Using padding px-4 py-2.5 / py-3) */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-hairline">
                <Button 
                  variant="tertiary" 
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSubmitting}
                  className="px-4 py-2.5 text-xs font-semibold"
                >
                  Cancelar
                </Button>
                <Button 
                  variant="primary" 
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 text-xs font-semibold shadow-[0_0_15px_rgba(5,43,88,0.3)]"
                >
                  {isSubmitting ? 'Guardando...' : editingUser ? 'Guardar Cambios' : 'Registrar Usuario'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

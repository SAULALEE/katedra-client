import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTemarios } from '../hooks/useTemarios';
import ResponsiveSidebar from '../components/ResponsiveSidebar';
import Card from '../components/Card';
import Button from '../components/Button';
import { Input } from '../components/Input';
import StatusBadge from '../components/StatusBadge';

export default function Dashboard() {
  const navigate = useNavigate();
  const { courses, loading, crearTemario, error } = useTemarios();

  // Modal & Tab States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('pdf'); // 'pdf', 'link', 'drive', 'manual'

  // Input States
  const [nombre, setNombre] = useState('');
  const [curso, setCurso] = useState('');
  const [temas, setTemas] = useState('6');
  const [origenDetalle, setOrigenDetalle] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState('');

  // UI States
  const [formError, setFormError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Open creation modal
  const handleOpenModal = () => {
    setNombre('');
    setCurso('');
    setTemas('6');
    setOrigenDetalle('');
    setFileName('');
    setFormError('');
    setIsModalOpen(true);
  };

  // Drag and Drop simulation handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setFileName(file.name);
      // Auto fill form values based on file name
      const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ");
      setNombre(`Temario: ${cleanName}`);
      setCurso('Materia del Documento');
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileName(file.name);
      const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ");
      setNombre(`Temario: ${cleanName}`);
      setCurso('Materia del Documento');
    }
  };

  // Select simulated Google Drive document
  const handleSelectDriveFile = (fileNameSimulated, folder) => {
    setFileName(fileNameSimulated);
    setNombre(`Temario de ${fileNameSimulated.replace('.pdf', '')}`);
    setCurso(folder || 'Google Drive');
    setOrigenDetalle(`drive://root/katedra/${fileNameSimulated}`);
  };

  // Handle Ingest submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!nombre.trim() || !curso.trim()) {
      setFormError('Por favor, ingresa el nombre del temario y la materia.');
      return;
    }

    if (activeTab === 'pdf' && !fileName) {
      setFormError('Por favor, arrastra o selecciona un archivo de temario PDF.');
      return;
    }

    if (activeTab === 'link' && !origenDetalle.trim()) {
      setFormError('Por favor, ingresa la dirección URL del programa de estudios.');
      return;
    }

    setIsProcessing(true);

    const origenMap = {
      pdf: 'PDF',
      link: 'Enlace Web',
      drive: 'Google Drive',
      manual: 'Manual'
    };

    const payload = {
      nombre,
      curso,
      temas: parseInt(temas) || 6,
      origen: origenMap[activeTab],
      detalleOrigen: activeTab === 'pdf' ? fileName : origenDetalle
    };

    const success = await crearTemario(payload);
    
    setIsProcessing(false);

    if (success) {
      setIsModalOpen(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-canvas text-ink flex flex-col md:flex-row selection:bg-brand-primary selection:text-white">
      
      {/* Sidebar - Collapsible drawer on mobile, persistent on desktop */}
      <ResponsiveSidebar />

      {/* Main Panel Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-canvas">
        
        {/* Top Navbar (Strictly h-[56px] Top-Nav token from DESIGN.md) */}
        <header className="h-[56px] border-b border-hairline bg-canvas/80 backdrop-blur-md sticky top-0 z-30 w-full flex items-center">
          <div className="w-full px-6 sm:px-8 flex items-center justify-between">
            <h2 className="text-sm font-semibold tracking-card-title text-ink">Panel del Profesor</h2>
            <div className="flex items-center gap-4">
              <Button 
                variant="primary" 
                onClick={handleOpenModal}
                className="px-4 py-2 font-medium"
              >
                + Cargar Temario con IA
              </Button>
            </div>
          </div>
        </header>

        {/* Dashboard Panels */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 sm:p-8 md:p-10 flex flex-col gap-8 w-full max-w-7xl mx-auto">
          
            {/* Stats Bar (Strictly p-6 to p-8 tokens from DESIGN.md) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8">
              {/* Stat 1 */}
              <Card surface="1" className="flex flex-col gap-3 p-6 sm:p-8 hover:border-brand-primary/20 transition-all duration-300">
                <span className="text-caption uppercase tracking-widest text-ink-muted font-medium">Materiales Generados</span>
                <p className="text-display-md font-bold tracking-display-md text-ink leading-none">{courses.length + 44}</p>
                <span className="text-caption text-emerald-400 flex items-center gap-1.5 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>↑ 12 esta semana</span>
                </span>
              </Card>

              {/* Stat 2 */}
              <Card surface="1" className="flex flex-col gap-3 p-6 sm:p-8 hover:border-brand-primary/20 transition-all duration-300">
                <span className="text-caption uppercase tracking-widest text-ink-muted font-medium">Tiempo Total Ahorrado</span>
                <p className="text-display-md font-bold tracking-display-md text-ink leading-none">38.4 hrs</p>
                <span className="text-caption text-indigo-400 font-medium">~ 30-40% por temario</span>
              </Card>

              {/* Stat 3 */}
              <Card surface="1" className="flex flex-col gap-3 p-6 sm:p-8 hover:border-brand-primary/20 transition-all duration-300">
                <span className="text-caption uppercase tracking-widest text-ink-muted font-medium">Llamadas a IA</span>
                <p className="text-display-md font-bold tracking-display-md text-ink leading-none">116</p>
                <span className="text-caption text-ink-muted font-medium">Límite: Ilimitado Premium</span>
              </Card>
            </div>

            {/* List of generated temarios */}
            <div className="flex flex-col gap-5">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-card-title font-semibold tracking-card-title text-ink">Materiales Recientes</h3>
                <span className="text-body-sm text-ink-muted font-medium">
                  {loading ? 'Cargando...' : `${courses.length} documentos activos`}
                </span>
              </div>

              {/* Courses Table / List wrapped inside standard container card */}
              <Card surface="1" className="p-0 overflow-hidden shadow-xl border-hairline bg-surface-1">
                <div className="overflow-x-auto w-full">
                  <table className="w-full text-left text-body-sm border-collapse min-w-[750px] sm:min-w-0">
                    <thead>
                      <tr className="border-b border-hairline bg-surface-2/60 text-ink-muted font-semibold select-none">
                        <th className="px-6 py-4 font-bold text-caption uppercase tracking-wider">Nombre del Temario</th>
                        <th className="px-6 py-4 font-bold text-caption uppercase tracking-wider">Curso / Materia</th>
                        <th className="px-6 py-4 font-bold text-caption uppercase tracking-wider">Subtemas</th>
                        <th className="px-6 py-4 font-bold text-caption uppercase tracking-wider">Origen</th>
                        <th className="px-6 py-4 font-bold text-caption uppercase tracking-wider">Fecha</th>
                        <th className="px-6 py-4 font-bold text-caption uppercase tracking-wider">Estado</th>
                        <th className="px-6 py-4 font-bold text-caption uppercase tracking-wider text-right">Acción</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-hairline">
                      {loading && courses.length === 0 ? (
                        [1, 2, 3].map((item) => (
                          <tr key={item} className="animate-pulse">
                            <td className="px-6 py-4.5"><div className="h-3.5 bg-hairline rounded w-3/4"></div></td>
                            <td className="px-6 py-4.5"><div className="h-3.5 bg-hairline rounded w-1/2"></div></td>
                            <td className="px-6 py-4.5"><div className="h-3.5 bg-hairline rounded w-1/4"></div></td>
                            <td className="px-6 py-4.5"><div className="h-3.5 bg-hairline rounded w-1/4"></div></td>
                            <td className="px-6 py-4.5"><div className="h-3.5 bg-hairline rounded w-1/3"></div></td>
                            <td className="px-6 py-4.5">
                              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-caption font-medium select-none">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                                Completado
                              </span>
                            </td>
                            <td className="px-6 py-4.5 text-right"><div className="h-3.5 bg-hairline rounded w-12 ml-auto"></div></td>
                          </tr>
                        ))
                      ) : (
                        courses.map((c) => (
                          <tr key={c.id} className="hover:bg-surface-2/40 transition-colors duration-150">
                            <td className="px-6 py-4 font-semibold text-ink flex items-center gap-2">
                              <svg className="w-3.5 h-3.5 text-indigo-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              <span className="font-sans font-semibold text-ink leading-snug select-text">{c.nombre}</span>
                            </td>
                            <td className="px-6 py-4 text-ink-muted">{c.curso}</td>
                            <td className="px-6 py-4 text-ink-muted">{c.temas} subtemas</td>
                            <td className="px-6 py-4">
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium border bg-surface-2 text-ink-muted border-hairline">
                                {c.origen || 'Manual'}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-ink-muted">{c.fecha}</td>
                            <td className="px-6 py-4">
                              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-caption font-medium select-none">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                                {c.estado}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <button 
                                onClick={() => navigate(`/contenido/${c.id}`)}
                                className="text-body-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer select-none"
                              >
                                Ver Contenido
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

      {/* MODAL: INGEST NEW TEMARIO WITH IA */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#010102]/80 backdrop-blur-md p-6 transition-all duration-200 animate-fade-in">
          
          {/* Modal Container with generous 48px padding and 580px max-width to ensure it feels luxurious and spacious */}
          <div 
            className="w-full max-w-[580px] bg-surface-1 border border-hairline rounded-2xl shadow-[0_30px_70px_rgba(0,0,0,0.85)] relative flex flex-col"
            style={{ padding: '48px', gap: '32px' }}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-start pb-5 border-b border-hairline select-none" style={{ gap: '20px' }}>
              <div>
                <span className="text-[10px] uppercase tracking-[0.15em] text-brand-primary font-bold">Herramienta de Ingesta Inteligente</span>
                <h3 className="text-lg font-bold text-ink mt-1.5 tracking-tight">Cargar Temario con IA</h3>
                <p className="text-xs text-ink-muted mt-1 leading-relaxed">
                  Carga un programa de estudios o define la asignatura para que la IA estructure el contenido.
                </p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full border border-hairline hover:border-hairline-strong hover:bg-surface-2 flex items-center justify-center text-ink-muted hover:text-ink cursor-pointer transition-all shrink-0"
                aria-label="Cerrar modal"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Ingestion Source Tabs (Linear Tab style with perfect spacing) */}
            <div className="flex border-b border-hairline text-xs gap-2 pb-1.5 select-none">
              {[
                { id: 'pdf', label: 'PDF / Archivo' },
                { id: 'link', label: 'Enlace Web' },
                { id: 'drive', label: 'Google Drive' },
                { id: 'manual', label: 'Manual' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => { setActiveTab(tab.id); setFormError(''); }}
                  className={`flex-1 py-2.5 font-bold text-center rounded-lg transition-all cursor-pointer border text-[11px] ${
                    activeTab === tab.id
                      ? 'bg-brand-primary/10 text-brand-primary border-brand-primary/20'
                      : 'border-transparent text-ink-subtle hover:text-ink hover:bg-surface-2/60'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Ingest Form Flow */}
            <form onSubmit={handleSubmit} className="flex flex-col animate-fade-in" style={{ gap: '28px' }}>
              
              {/* Conditional Content based on Tab */}
              {activeTab === 'pdf' && (
                <div 
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-xl py-10 px-8 flex flex-col items-center justify-center text-center transition-all ${
                    dragActive ? 'border-brand-primary bg-brand-primary/5' : 'border-hairline hover:border-hairline-strong bg-canvas/30'
                  }`}
                  style={{ gap: '12px' }}
                >
                  <input
                    type="file"
                    id="pdf-upload"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <svg className="w-10 h-10 text-indigo-400/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  
                  {fileName ? (
                    <div className="flex flex-col" style={{ gap: '6px' }}>
                      <p className="text-xs font-semibold text-emerald-400 truncate max-w-[320px] mx-auto">{fileName}</p>
                      <p className="text-[10px] text-ink-tertiary">Archivo cargado exitosamente. La IA autodetectará el nombre.</p>
                      <label htmlFor="pdf-upload" className="inline-block mt-2 text-[10px] text-indigo-400 hover:text-indigo-300 font-bold cursor-pointer underline select-none">
                        Cambiar archivo
                      </label>
                    </div>
                  ) : (
                    <div className="flex flex-col" style={{ gap: '6px' }}>
                      <p className="text-xs font-semibold text-ink">Arrastra tu programa de estudios aquí</p>
                      <p className="text-[10px] text-ink-muted">PDF, DOCX o TXT hasta 20MB</p>
                      <label htmlFor="pdf-upload" className="inline-block mt-2.5 px-4 py-2 bg-surface-2 border border-hairline rounded-lg text-[10px] font-bold text-ink hover:bg-surface-3 transition-colors cursor-pointer select-none">
                        Buscar Archivo
                      </label>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'link' && (
                <div className="flex flex-col" style={{ gap: '8px' }}>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-ink-muted select-none">
                    Dirección URL del Temario
                  </label>
                  <input
                    type="url"
                    value={origenDetalle}
                    onChange={(e) => setOrigenDetalle(e.target.value)}
                    placeholder="https://universidad.edu/programas/matematicas-1.html"
                    disabled={isProcessing}
                    className="w-full bg-[#070809] border border-hairline hover:border-hairline-strong focus:border-brand-primary rounded-xl py-3.5 px-4 text-xs text-ink outline-none transition-all placeholder:text-ink-tertiary focus:ring-1 focus:ring-brand-primary-focus"
                  />
                </div>
              )}

              {activeTab === 'drive' && (
                <div className="flex flex-col animate-fade-in" style={{ gap: '10px' }}>
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-ink-muted select-none">
                    Archivos Recientes de Google Drive
                  </span>
                  
                  <div className="bg-[#070809] border border-hairline rounded-xl divide-y divide-hairline overflow-hidden max-h-[160px] overflow-y-auto">
                    {[
                      { name: 'Syllabus_Algoritmos_2026.pdf', folder: 'Estructuras de Datos' },
                      { name: 'Plan_Fisica_Termodinamica.pdf', folder: 'Física Avanzada' },
                      { name: 'Introduccion_Literatura_Hispana.docx', folder: 'Humanidades' }
                    ].map((file) => (
                      <div 
                        key={file.name}
                        onClick={() => handleSelectDriveFile(file.name, file.folder)}
                        className={`py-3 px-4 text-xs flex items-center justify-between cursor-pointer transition-colors ${
                          fileName === file.name ? 'bg-brand-primary/10 text-brand-primary font-medium border-l-2 border-brand-primary' : 'hover:bg-surface-2/40 text-ink-muted hover:text-ink'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <svg className="w-4 h-4 text-amber-400 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" />
                          </svg>
                          <span className="truncate">{file.name}</span>
                        </div>
                        <span className="text-[9px] uppercase tracking-widest text-ink-tertiary font-bold shrink-0">{file.folder}</span>
                      </div>
                    ))}
                  </div>
                  
                  {fileName && (
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-[10px] text-emerald-400 font-semibold mt-1">
                      Seleccionado: <span className="text-ink">{fileName}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Form Standard Metadata inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex flex-col" style={{ gap: '8px' }}>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-ink-muted select-none">
                    Nombre del Temario
                  </label>
                  <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Ej. Programación Avanzada"
                    disabled={isProcessing}
                    className="w-full bg-[#070809] border border-hairline hover:border-hairline-strong focus:border-brand-primary rounded-xl py-3.5 px-4 text-xs text-ink outline-none transition-all placeholder:text-ink-tertiary focus:ring-1 focus:ring-brand-primary-focus"
                  />
                </div>
                
                <div className="flex flex-col" style={{ gap: '8px' }}>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-ink-muted select-none">
                    Materia / Curso
                  </label>
                  <input
                    type="text"
                    value={curso}
                    onChange={(e) => setCurso(e.target.value)}
                    placeholder="Ej. Sistemas Computacionales"
                    disabled={isProcessing}
                    className="w-full bg-[#070809] border border-hairline hover:border-hairline-strong focus:border-brand-primary rounded-xl py-3.5 px-4 text-xs text-ink outline-none transition-all placeholder:text-ink-tertiary focus:ring-1 focus:ring-brand-primary-focus"
                  />
                </div>
              </div>

              {/* Temas Selection - Spacious select dropdown */}
              <div className="flex flex-col" style={{ gap: '8px' }}>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-ink-muted select-none">
                  Número de subtemas a generar con IA
                </label>
                <select
                  value={temas}
                  onChange={(e) => setTemas(e.target.value)}
                  disabled={isProcessing}
                  className="w-full bg-[#070809] border border-hairline hover:border-hairline-strong focus:border-brand-primary rounded-xl py-3.5 px-4 text-xs text-ink outline-none transition-all duration-200 focus:ring-1 focus:ring-brand-primary cursor-pointer"
                >
                  <option value="4">4 subtemas (Generación Rápida)</option>
                  <option value="6">6 subtemas (Generación Estándar)</option>
                  <option value="8">8 subtemas (Generación Completa)</option>
                  <option value="12">12 subtemas (Extensa / Avanzada)</option>
                </select>
              </div>

              {formError && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg text-[11px] text-rose-400 font-semibold flex items-center gap-2">
                  <svg className="w-3.5 h-3.5 text-rose-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span>{formError}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3.5 pt-5 border-t border-hairline select-none">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isProcessing}
                  className="px-4 py-2.5 rounded-lg text-xs font-semibold text-ink-subtle hover:text-ink hover:bg-surface-2/60 cursor-pointer transition-all"
                >
                  Cancelar
                </button>
                
                <button 
                  type="submit"
                  disabled={isProcessing}
                  className="relative px-5 py-2.5 rounded-lg text-xs font-bold text-white bg-indigo-650 hover:bg-indigo-600 cursor-pointer select-none transition-all shadow-[0_4px_20px_rgba(99,102,241,0.25)] flex items-center gap-2 border border-indigo-400/20 active:scale-[0.98]"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-3.5 h-3.5 rounded-full border border-white/20 border-t-white animate-spin"></div>
                      <span>Procesando...</span>
                    </>
                  ) : (
                    <>
                      <span>Cargar y Procesar con IA</span>
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}

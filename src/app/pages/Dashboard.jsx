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
        
        {/* Top Navbar */}
        <header className="h-[56px] border-b border-hairline bg-canvas/80 backdrop-blur-md sticky top-0 z-30 w-full flex items-center">
          <div className="w-full px-4 sm:px-6 md:px-8 flex items-center justify-between">
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
          <div className="p-6 sm:p-8 md:p-10 flex flex-col gap-8 sm:gap-10 w-full max-w-7xl mx-auto">
          
            {/* Stats Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
              {/* Stat 1 */}
              <Card surface="1" className="flex flex-col gap-3 p-6 sm:p-8">
                <span className="text-caption uppercase tracking-widest text-ink-muted font-medium">Materiales Generados</span>
                <p className="text-display-md font-bold tracking-display-md text-ink leading-none">{courses.length + 44}</p>
                <span className="text-caption text-emerald-400 flex items-center gap-1.5 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>↑ 12 esta semana</span>
                </span>
              </Card>

              {/* Stat 2 */}
              <Card surface="1" className="flex flex-col gap-3 p-6 sm:p-8">
                <span className="text-caption uppercase tracking-widest text-ink-muted font-medium">Tiempo Total Ahorrado</span>
                <p className="text-display-md font-bold tracking-display-md text-ink leading-none">38.4 hrs</p>
                <span className="text-caption text-indigo-400 font-medium">~ 30-40% por temario</span>
              </Card>

              {/* Stat 3 */}
              <Card surface="1" className="flex flex-col gap-3 p-6 sm:p-8">
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
              <Card surface="1" className="p-0 overflow-hidden shadow-xl border-hairline">
                <div className="overflow-x-auto w-full">
                  <table className="w-full text-left text-body-sm border-collapse min-w-[750px] sm:min-w-0">
                    <thead>
                      <tr className="border-b border-hairline bg-surface-2/60 text-ink-muted font-semibold select-none">
                        <th className="p-4 sm:p-5 font-bold text-caption uppercase tracking-wider">Nombre del Temario</th>
                        <th className="p-4 sm:p-5 font-bold text-caption uppercase tracking-wider">Curso / Materia</th>
                        <th className="p-4 sm:p-5 font-bold text-caption uppercase tracking-wider">Subtemas</th>
                        <th className="p-4 sm:p-5 font-bold text-caption uppercase tracking-wider">Origen</th>
                        <th className="p-4 sm:p-5 font-bold text-caption uppercase tracking-wider">Fecha</th>
                        <th className="p-4 sm:p-5 font-bold text-caption uppercase tracking-wider">Estado</th>
                        <th className="p-4 sm:p-5 font-bold text-caption uppercase tracking-wider text-right">Acción</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-hairline">
                      {loading && courses.length === 0 ? (
                        [1, 2, 3].map((item) => (
                          <tr key={item} className="animate-pulse">
                            <td className="p-4 sm:p-5"><div className="h-3.5 bg-hairline rounded w-3/4"></div></td>
                            <td className="p-4 sm:p-5"><div className="h-3.5 bg-hairline rounded w-1/2"></div></td>
                            <td className="p-4 sm:p-5"><div className="h-3.5 bg-hairline rounded w-1/4"></div></td>
                            <td className="p-4 sm:p-5"><div className="h-3.5 bg-hairline rounded w-1/4"></div></td>
                            <td className="p-4 sm:p-5"><div className="h-3.5 bg-hairline rounded w-1/3"></div></td>
                            <td className="p-4 sm:p-5">
                              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-caption font-medium select-none">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                                Completado
                              </span>
                            </td>
                            <td className="p-4 sm:p-5 text-right"><div className="h-3.5 bg-hairline rounded w-12 ml-auto"></div></td>
                          </tr>
                        ))
                      ) : (
                        courses.map((c) => (
                          <tr key={c.id} className="hover:bg-surface-2/40 transition-colors duration-150">
                            <td className="p-4 sm:p-5 font-semibold text-ink flex items-center gap-2">
                              <svg className="w-3.5 h-3.5 text-indigo-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              <span className="truncate">{c.nombre}</span>
                            </td>
                            <td className="p-4 sm:p-5 text-ink-muted">{c.curso}</td>
                            <td className="p-4 sm:p-5 text-ink-muted">{c.temas} subtemas</td>
                            <td className="p-4 sm:p-5">
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium border bg-surface-2 text-ink-muted border-hairline">
                                {c.origen || 'Manual'}
                              </span>
                            </td>
                            <td className="p-4 sm:p-5 text-ink-muted">{c.fecha}</td>
                            <td className="p-4 sm:p-5">
                              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-caption font-medium select-none">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                                {c.estado}
                              </span>
                            </td>
                            <td className="p-4 sm:p-5 text-right">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 sm:p-6 transition-all duration-300 animate-fade-in">
          
          {/* Modal Container Card (Strictly using p-8 sm:p-10 spacing to prevent collisions and ensure breathing room) */}
          <div 
            className="w-full max-w-[560px] bg-surface-1 border border-hairline rounded-lg p-8 sm:p-10 shadow-2xl relative flex flex-col gap-6"
          >
            
            {/* Modal Header */}
            <div className="flex justify-between items-start border-b border-hairline pb-4">
              <div>
                <span className="text-[9px] uppercase tracking-wider text-brand-primary font-bold">Herramienta de Ingesta Inteligente</span>
                <h3 className="text-base font-bold text-ink mt-0.5">Cargar Temario con IA</h3>
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

            {/* Ingestion Source Tabs (Estilo Linear con mejor padding) */}
            <div className="flex border-b border-hairline text-xs gap-2 mb-2">
              <button
                onClick={() => { setActiveTab('pdf'); setFormError(''); }}
                className={`flex-1 pb-3 pt-1 font-medium border-b-2 text-center cursor-pointer transition-all ${
                  activeTab === 'pdf' ? 'border-brand-primary text-ink font-semibold' : 'border-transparent text-ink-muted hover:text-ink hover:bg-surface-2/30 rounded-t-md'
                }`}
              >
                PDF / Archivo
              </button>
              <button
                onClick={() => { setActiveTab('link'); setFormError(''); }}
                className={`flex-1 pb-3 pt-1 font-medium border-b-2 text-center cursor-pointer transition-all ${
                  activeTab === 'link' ? 'border-brand-primary text-ink font-semibold' : 'border-transparent text-ink-muted hover:text-ink hover:bg-surface-2/30 rounded-t-md'
                }`}
              >
                Enlace Web
              </button>
              <button
                onClick={() => { setActiveTab('drive'); setFormError(''); }}
                className={`flex-1 pb-3 pt-1 font-medium border-b-2 text-center cursor-pointer transition-all ${
                  activeTab === 'drive' ? 'border-brand-primary text-ink font-semibold' : 'border-transparent text-ink-muted hover:text-ink hover:bg-surface-2/30 rounded-t-md'
                }`}
              >
                Google Drive
              </button>
              <button
                onClick={() => { setActiveTab('manual'); setFormError(''); }}
                className={`flex-1 pb-3 pt-1 font-medium border-b-2 text-center cursor-pointer transition-all ${
                  activeTab === 'manual' ? 'border-brand-primary text-ink font-semibold' : 'border-transparent text-ink-muted hover:text-ink hover:bg-surface-2/30 rounded-t-md'
                }`}
              >
                Manual
              </button>
            </div>

            {/* Ingest Form Flow (Using space-y-6 layout spacing for maximum breathing room) */}
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Conditional Content based on Tab */}
              {activeTab === 'pdf' && (
                <div 
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-lg py-10 px-8 flex flex-col items-center justify-center text-center transition-all ${
                    dragActive ? 'border-brand-primary bg-brand-primary/5' : 'border-hairline hover:border-hairline-strong bg-canvas/30'
                  }`}
                >
                  <input
                    type="file"
                    id="pdf-upload"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <svg className="w-10 h-10 text-indigo-400/80 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  
                  {fileName ? (
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-emerald-400 truncate max-w-[320px]">{fileName}</p>
                      <p className="text-[10px] text-ink-tertiary">Archivo cargado exitosamente. La IA autodetectará el nombre.</p>
                      <label htmlFor="pdf-upload" className="inline-block mt-2 text-[10px] text-indigo-400 hover:text-indigo-300 font-bold cursor-pointer underline select-none">
                        Cambiar archivo
                      </label>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-ink">Arrastra tu programa de estudios aquí</p>
                      <p className="text-[10px] text-ink-muted">Soporta PDF, DOCX o TXT hasta 20MB</p>
                      <label htmlFor="pdf-upload" className="inline-block mt-3 px-4 py-1.5 bg-surface-2 border border-hairline rounded text-[10px] font-bold text-ink hover:bg-surface-3 transition-colors cursor-pointer select-none">
                        Buscar Archivo
                      </label>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'link' && (
                <Input
                  label="Dirección URL del Temario"
                  value={origenDetalle}
                  onChange={(e) => setOrigenDetalle(e.target.value)}
                  placeholder="https://universidad.edu/programas/matematicas-1.html"
                  disabled={isProcessing}
                />
              )}

              {activeTab === 'drive' && (
                <div className="space-y-3">
                  <span className="block text-[10px] uppercase tracking-wider text-ink-muted font-medium select-none">
                    Archivos Recientes de Google Drive
                  </span>
                  
                  <div className="bg-canvas/50 border border-hairline rounded-md divide-y divide-hairline overflow-hidden max-h-[160px] overflow-y-auto">
                    {[
                      { name: 'Syllabus_Algoritmos_2026.pdf', folder: 'Estructuras de Datos' },
                      { name: 'Plan_Fisica_Termodinamica.pdf', folder: 'Física Avanzada' },
                      { name: 'Introduccion_Literatura_Hispana.docx', folder: 'Humanidades' }
                    ].map((file) => (
                      <div 
                        key={file.name}
                        onClick={() => handleSelectDriveFile(file.name, file.folder)}
                        className={`py-3.5 px-4 text-xs flex items-center justify-between cursor-pointer transition-colors ${
                          fileName === file.name ? 'bg-brand-primary/10 text-brand-primary font-medium' : 'hover:bg-surface-2/40 text-ink-muted hover:text-ink'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <svg className="w-3.5 h-3.5 text-amber-400 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" />
                          </svg>
                          <span className="truncate">{file.name}</span>
                        </div>
                        <span className="text-[9px] uppercase tracking-widest text-ink-tertiary font-bold shrink-0">{file.folder}</span>
                      </div>
                    ))}
                  </div>
                  
                  {fileName && (
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded text-[10px] text-emerald-400">
                      Seleccionado: <span className="font-semibold">{fileName}</span> (Cargado desde Google Drive)
                    </div>
                  )}
                </div>
              )}

              {/* Form Standard Metadata inputs (Only manual or displayed as AI options) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Nombre del Temario"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="ejemplo: Estructuras de Datos Lineales"
                  disabled={isProcessing}
                />
                <Input
                  label="Materia / Curso"
                  value={curso}
                  onChange={(e) => setCurso(e.target.value)}
                  placeholder="ejemplo: Programación II"
                  disabled={isProcessing}
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] uppercase tracking-wider text-ink-muted font-medium select-none">
                  Número de subtemas a generar con IA
                </label>
                <select
                  value={temas}
                  onChange={(e) => setTemas(e.target.value)}
                  disabled={isProcessing}
                  className="w-full bg-surface-1 border border-hairline hover:border-hairline-strong focus:border-brand-primary rounded-md p-3.5 text-xs text-ink outline-none transition-all duration-200 focus:ring-1 focus:ring-brand-primary-focus cursor-pointer"
                >
                  <option value="4">4 subtemas (Generación Rápida)</option>
                  <option value="6">6 subtemas (Generación Estándar)</option>
                  <option value="8">8 subtemas (Generación Completa)</option>
                  <option value="12">12 subtemas (Extensa / Avanzada)</option>
                </select>
              </div>

              {formError && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-md text-[11px] text-rose-400">
                  {formError}
                </div>
              )}

              {/* Action Buttons (Refined pt-5 and gap to follow margins discipline) */}
              <div className="flex items-center justify-end gap-3 pt-5 border-t border-hairline">
                <Button 
                  variant="tertiary" 
                  onClick={() => setIsModalOpen(false)}
                  disabled={isProcessing}
                  className="px-4 py-2.5 text-xs font-semibold"
                >
                  Cancelar
                </Button>
                
                <Button 
                  variant="primary" 
                  type="submit"
                  disabled={isProcessing}
                  className="px-6 py-2.5 text-xs font-semibold shadow-[0_0_15px_rgba(5,43,88,0.3)] flex items-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-3.5 h-3.5 rounded-full border border-white/20 border-t-white animate-spin"></div>
                      <span>Procesando con IA...</span>
                    </>
                  ) : (
                    'Cargar y Procesar con IA'
                  )}
                </Button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}

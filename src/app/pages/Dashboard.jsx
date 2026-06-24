import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTemarios } from '../hooks/useTemarios';
import ResponsiveSidebar from '../components/ResponsiveSidebar';
import Button from '../components/Button';

const DOC_ACCENTS = ['var(--app-brand-primary)', 'var(--app-brand-secure)', 'var(--app-semantic-success)', '#7C3AED', '#0891B2', '#D97706'];

export default function Dashboard() {
  const navigate = useNavigate();
  const { courses, loading, crearTemario, error } = useTemarios();

  // Modal & Tab States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('pdf');

  // Input States
  const [titulo, setTitulo] = useState('');
  const [asignatura, setAsignatura] = useState('');
  const [gradoAcademico, setGradoAcademico] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [temas, setTemas] = useState('6');
  const [origenDetalle, setOrigenDetalle] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState('');

  // UI States
  const [formError, setFormError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Infinite-canvas pan + zoom
  const canvasRef = useRef(null);
  const panState = useRef({ active: false, startX: 0, startY: 0, scrollX: 0, scrollY: 0 });
  const [zoom, setZoom] = useState(1);
  const [isPanning, setIsPanning] = useState(false);

  const handlePanDown = (e) => {
    if (e.button !== 0 || e.target.closest('[data-doc-card]')) return;
    const el = canvasRef.current;
    panState.current = { active: true, startX: e.clientX, startY: e.clientY, scrollX: el.scrollLeft, scrollY: el.scrollTop };
    setIsPanning(true);
  };
  const handlePanMove = (e) => {
    if (!panState.current.active) return;
    const el = canvasRef.current;
    el.scrollLeft = panState.current.scrollX - (e.clientX - panState.current.startX);
    el.scrollTop = panState.current.scrollY - (e.clientY - panState.current.startY);
  };
  const handlePanUp = () => { panState.current.active = false; setIsPanning(false); };

  const handleOpenModal = () => {
    setTitulo('');
    setAsignatura('');
    setGradoAcademico('');
    setDescripcion('');
    setTemas('6');
    setOrigenDetalle('');
    setFileName('');
    setFormError('');
    setIsModalOpen(true);
  };

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
      const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ");
      setTitulo(`Temario: ${cleanName}`);
      setAsignatura('Materia del Documento');
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileName(file.name);
      const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ");
      setTitulo(`Temario: ${cleanName}`);
      setAsignatura('Materia del Documento');
    }
  };

  const handleSelectDriveFile = (fileNameSimulated, folder) => {
    setFileName(fileNameSimulated);
    setTitulo(`Temario de ${fileNameSimulated.replace('.pdf', '')}`);
    setAsignatura(folder || 'Google Drive');
    setOrigenDetalle(`drive://root/katedra/${fileNameSimulated}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!titulo.trim() || !asignatura.trim()) {
      setFormError('Por favor, ingresa el título del temario y la asignatura.');
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

    const origenMap = { pdf: 'PDF', link: 'Enlace Web', drive: 'Google Drive', manual: 'Manual' };

    const payload = {
      titulo,
      asignatura,
      gradoAcademico,
      descripcion,
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

  // Snapped Grid Layout instead of crooked organic layout
  const docPosition = (i) => {
    const columns = 4;
    const col = i % columns;
    const row = Math.floor(i / columns);
    return {
      left: 100 + col * 360,
      top: 180 + row * 320,
    };
  };

  return (
    <div className="w-full h-screen flex flex-col md:flex-row bg-canvas text-ink font-sans overflow-hidden">

      <ResponsiveSidebar />

      <main className="flex-1 flex flex-col min-w-0 bg-surface-2 relative h-screen">

        {/* Top Navbar */}
        <header className="h-[88px] sticky top-0 z-30 w-full flex items-center border-b border-hairline bg-canvas/90 backdrop-blur-md">
          <div className="w-full px-6 sm:px-10 flex items-center justify-between gap-4">
            <div className="flex flex-col">
              <h2 className="text-xl sm:text-2xl font-bold leading-tight tracking-tight text-ink">Mis Temarios</h2>
              <span className="text-xs mt-1 font-medium text-brand-secure">Temarios cargados o creados con IA</span>
            </div>

            <div className="flex items-center gap-4">
              {/* Zoom controls */}
              <div className="hidden sm:flex items-center gap-1 rounded-xl p-1.5 bg-surface-1 border border-hairline shadow-sm">
                <button onClick={() => setZoom((z) => Math.max(0.4, +(z - 0.1).toFixed(2)))} className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer transition-all text-ink-muted hover:bg-surface-2 hover:text-ink hover:shadow-sm" aria-label="Alejar">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeWidth={2.5} d="M5 12h14" /></svg>
                </button>
                <span className="text-xs font-bold w-12 text-center select-none text-ink">{Math.round(zoom * 100)}%</span>
                <button onClick={() => setZoom((z) => Math.min(1.5, +(z + 0.1).toFixed(2)))} className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer transition-all text-ink-muted hover:bg-surface-2 hover:text-ink hover:shadow-sm" aria-label="Acercar">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeWidth={2.5} d="M12 5v14M5 12h14" /></svg>
                </button>
              </div>

              <Button variant="primary" onClick={handleOpenModal} className="bg-brand-primary text-white px-6 py-3.5 text-sm font-bold rounded-xl shadow-elevated hover:-translate-y-1 transition-all duration-300">
                + Cargar Temario
              </Button>
            </div>
          </div>
        </header>

        {/* ====================== INFINITE CANVAS ====================== */}
        <div
          ref={canvasRef}
          onMouseDown={handlePanDown}
          onMouseMove={handlePanMove}
          onMouseUp={handlePanUp}
          onMouseLeave={handlePanUp}
          className="flex-1 overflow-auto relative select-none scrollbar-none bg-surface-2"
          style={{
            cursor: isPanning ? 'grabbing' : 'grab',
            backgroundImage: `
              linear-gradient(to right, var(--app-hairline) 1px, transparent 1px),
              linear-gradient(to bottom, var(--app-hairline) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
            backgroundPosition: 'center center'
          }}
        >
          {/* Floating stats widget */}
          <div className="absolute z-10" style={{ left: 100, top: 40, transform: `scale(${zoom})`, transformOrigin: 'top left' }}>
            <div className="flex flex-wrap gap-4">
              {[
                { label: 'Materiales', value: courses.length + 44, sub: '↑ 12 esta semana', color: 'text-brand-secure', bg: 'bg-brand-secure/10', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
                { label: 'Tiempo Ahorrado', value: '38.4 hrs', sub: '~ 30% por temario', color: 'text-semantic-success', bg: 'bg-semantic-success/10', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
                { label: 'Llamadas a IA', value: '116', sub: 'Ilimitado Premium', color: 'text-ink', bg: 'bg-surface-3', icon: 'M13 10V3L4 14h7v7l9-11h-7z' }
              ].map((s, i) => (
                <div key={i} className="flex items-center gap-4 px-6 py-4 rounded-2xl bg-canvas border border-hairline shadow-soft backdrop-blur-md">
                  <span className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${s.bg} ${s.color}`}>
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={s.icon} /></svg>
                  </span>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-ink-subtle">{s.label}</span>
                    <span className="text-2xl font-extrabold leading-none tracking-tight text-ink">{s.value}</span>
                    <span className={`text-[11px] font-bold mt-1 ${s.color}`}>{s.sub}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Canvas Area */}
          <div className="relative" style={{
            width: 2000,
            minHeight: 200 + Math.ceil((Math.max(courses.length, 6)) / 4) * 320 + 200,
            transform: `scale(${zoom})`,
            transformOrigin: 'top left'
          }}>
            {/* Loading skeleton documents */}
            {loading && courses.length === 0
              ? [0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
                  const pos = docPosition(i);
                  return (
                    <div key={i} data-doc-card className="absolute rounded-2xl overflow-hidden animate-pulse bg-canvas border border-hairline shadow-soft" style={{ left: pos.left, top: pos.top, width: 320, height: 260 }}>
                      <div className="h-2 w-full bg-surface-3" />
                      <div className="p-6 flex flex-col gap-4">
                        <div className="w-10 h-10 rounded-xl bg-surface-3" />
                        <div className="h-5 rounded w-3/4 bg-surface-3 mt-2" />
                        <div className="h-3 rounded w-1/2 bg-surface-3" />
                        <div className="h-3 rounded w-full mt-4 bg-surface-3" />
                        <div className="h-3 rounded w-5/6 bg-surface-3" />
                      </div>
                    </div>
                  );
                })
              : courses.map((c, i) => {
                  const pos = docPosition(i);
                  const accent = DOC_ACCENTS[i % DOC_ACCENTS.length];
                  return (
                    <div
                      key={c.id}
                      data-doc-card
                      onClick={() => navigate(`/contenido/${c.id}`)}
                      className="absolute rounded-[24px] overflow-hidden cursor-pointer transition-all duration-300 group bg-canvas border border-hairline shadow-soft hover:shadow-illustrative hover:-translate-y-2 flex flex-col justify-between"
                      style={{ left: pos.left, top: pos.top, width: 320, height: 280 }}
                    >
                      <div className="h-2 w-full transition-opacity opacity-80 group-hover:opacity-100" style={{ background: accent }} />

                      <div className="p-6 flex-1 flex flex-col gap-4">
                        <div className="flex items-start justify-between gap-2">
                          <span className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-surface-2 group-hover:scale-105 transition-transform" style={{ color: accent }}>
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                          </span>
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold select-none bg-semantic-success/10 border border-semantic-success/20 text-semantic-success">
                            <span className="w-1.5 h-1.5 rounded-full animate-pulse bg-semantic-success"></span>
                            {c.estado || 'Completado'}
                          </span>
                        </div>

                        <div className="mt-2">
                          <h3 className="text-lg font-bold leading-snug line-clamp-2 tracking-tight text-ink group-hover:text-brand-primary transition-colors">{c.titulo || c.nombre}</h3>
                          <p className="text-xs mt-1.5 font-medium text-ink-muted truncate">{c.asignatura || c.curso}</p>
                        </div>
                      </div>

                      <div className="px-6 py-5 border-t border-hairline bg-surface-1/50 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-bold text-ink-subtle">{c.temas || 6} subtemas</span>
                        </div>
                        <span className="text-xs font-bold flex items-center gap-1 transition-transform group-hover:gap-2" style={{ color: accent }}>
                          Abrir
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                        </span>
                      </div>
                    </div>
                  );
                })}

            {/* Empty "new doc" card positioned perfectly */}
            {!loading && (
              (() => {
                const pos = docPosition(courses.length);
                return (
                  <button
                    data-doc-card
                    onClick={handleOpenModal}
                    className="absolute rounded-[24px] flex flex-col items-center justify-center gap-4 cursor-pointer transition-all duration-300 bg-canvas border-2 border-dashed border-brand-primary/40 hover:-translate-y-2 hover:border-brand-primary hover:shadow-soft group"
                    style={{ left: pos.left, top: pos.top, width: 320, height: 280 }}
                  >
                    <span className="w-16 h-16 rounded-2xl flex items-center justify-center bg-brand-primary/10 text-brand-primary transition-transform group-hover:scale-110 duration-300 border border-brand-primary/20">
                      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v14M5 12h14" /></svg>
                    </span>
                    <div className="flex flex-col items-center gap-1.5">
                      <span className="text-lg font-bold text-ink group-hover:text-brand-primary transition-colors">Nuevo Temario</span>
                      <span className="text-xs font-medium text-ink-subtle">Cargar o generar con IA</span>
                    </div>
                  </button>
                );
              })()
            )}
          </div>
        </div>
      </main>

      {/* ====================== MODAL: INGEST NEW TEMARIO ====================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#010102]/70 backdrop-blur-md transition-all">
          <div className="w-full max-w-[560px] relative flex flex-col max-h-[95vh] overflow-hidden bg-canvas border border-hairline rounded-[32px] p-8 sm:p-12 gap-8 shadow-illustrative">

            {/* Modal Header */}
            <div className="flex justify-between items-start pb-6 select-none border-b border-hairline gap-4">
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] uppercase font-bold text-brand-primary tracking-widest bg-brand-primary/10 border border-brand-primary/20 w-max px-3 py-1 rounded-lg">Ingesta Inteligente</span>
                <h3 className="text-2xl font-bold tracking-tight text-ink mt-2">Cargar Temario</h3>
                <p className="text-xs font-medium text-ink-subtle">Sube un archivo, ingresa un enlace o define manualmente la asignatura para estructurar el contenido.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all shrink-0 border border-hairline text-ink-subtle bg-surface-1 hover:bg-surface-2 hover:text-ink hover:-translate-y-1 shadow-sm" aria-label="Cerrar modal">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {/* Source Tabs */}
            <div className="flex text-xs gap-3 select-none bg-surface-2 p-1.5 rounded-2xl border border-hairline">
              {[
                { id: 'pdf', label: 'PDF / Archivo' },
                { id: 'link', label: 'Enlace Web' },
                { id: 'drive', label: 'Drive' },
                { id: 'manual', label: 'Manual' }
              ].map((tab) => (
                <button key={tab.id} type="button" onClick={() => { setActiveTab(tab.id); setFormError(''); }}
                  className={`flex-1 py-3 font-bold text-center rounded-xl transition-all cursor-pointer text-[11px] ${activeTab === tab.id ? 'bg-brand-primary text-white shadow-sm' : 'bg-transparent text-ink-muted hover:text-ink'}`}>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Ingest Form */}
            <form onSubmit={handleSubmit} className="flex flex-col overflow-hidden gap-8">
              <div className="flex flex-col overflow-y-auto pr-2 gap-8 scrollbar-none">

                {activeTab === 'pdf' && (
                  <div
                    onDragEnter={handleDrag} onDragOver={handleDrag} onDragLeave={handleDrag} onDrop={handleDrop}
                    className={`rounded-[24px] py-12 px-6 flex flex-col items-center justify-center text-center transition-all border-2 dashed gap-4 ${dragActive ? 'border-brand-primary bg-brand-primary/5' : 'border-hairline-strong bg-surface-2 hover:bg-surface-3 cursor-pointer'}`}
                    onClick={() => document.getElementById('pdf-upload').click()}
                  >
                    <input type="file" id="pdf-upload" accept=".pdf,.doc,.docx,.txt" onChange={handleFileSelect} className="hidden" />
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${dragActive ? 'bg-brand-primary text-white shadow-md' : 'bg-surface-1 text-ink-subtle border border-hairline'}`}>
                      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                    </div>
                    {fileName ? (
                      <div className="flex flex-col items-center gap-2">
                        <p className="text-sm font-bold text-semantic-success bg-semantic-success/10 px-4 py-1.5 rounded-lg border border-semantic-success/20 truncate max-w-[300px]">{fileName}</p>
                        <p className="text-xs text-ink-subtle">Documento analizado y listo.</p>
                        <span className="inline-block mt-2 text-xs font-bold cursor-pointer text-brand-primary underline underline-offset-4">Cambiar archivo</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <p className="text-sm font-bold text-ink">Arrastra tu documento educativo aquí</p>
                        <p className="text-xs text-ink-subtle">Soporta PDF, DOCX o TXT (Máx 20MB)</p>
                        <span className="inline-block mt-4 px-6 py-2.5 rounded-xl text-xs font-bold cursor-pointer select-none bg-canvas border border-hairline text-ink hover:bg-surface-2 shadow-sm transition-all">Explorar Archivos</span>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'link' && (
                  <div className="flex flex-col gap-3">
                    <label className="block text-xs font-bold uppercase tracking-widest select-none text-ink-subtle">Dirección URL del Temario</label>
                    <input type="url" value={origenDetalle} onChange={(e) => setOrigenDetalle(e.target.value)} placeholder="https://universidad.edu/programas/matematicas-1.html" disabled={isProcessing}
                      className="w-full rounded-2xl py-4 px-5 text-sm font-medium outline-none transition-all bg-surface-2 border border-transparent focus:bg-canvas focus:border-brand-primary text-ink focus:ring-4 focus:ring-brand-primary/10" />
                  </div>
                )}

                {activeTab === 'drive' && (
                  <div className="flex flex-col gap-3">
                    <span className="block text-xs font-bold uppercase tracking-widest select-none text-ink-subtle">Archivos de Google Drive</span>
                    <div className="rounded-2xl overflow-hidden max-h-[180px] overflow-y-auto bg-surface-2 border border-hairline">
                      {[
                        { name: 'Syllabus_Algoritmos_2026.pdf', folder: 'Estructuras de Datos' },
                        { name: 'Plan_Fisica_Termodinamica.pdf', folder: 'Física Avanzada' },
                        { name: 'Introduccion_Literatura_Hispana.docx', folder: 'Humanidades' }
                      ].map((file) => (
                        <div key={file.name} onClick={() => handleSelectDriveFile(file.name, file.folder)}
                          className={`py-4 px-5 flex items-center justify-between cursor-pointer transition-all border-b border-hairline last:border-0 ${fileName === file.name ? 'bg-brand-primary/10 text-brand-primary' : 'bg-transparent text-ink-muted hover:bg-surface-3 hover:text-ink'}`}>
                          <div className="flex items-center gap-3 truncate">
                            <svg className="w-5 h-5 shrink-0 text-brand-secure" viewBox="0 0 24 24" fill="currentColor"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" /></svg>
                            <span className="text-sm font-bold truncate">{file.name}</span>
                          </div>
                          <span className="text-[10px] uppercase tracking-widest font-bold shrink-0 opacity-70 bg-surface-1 px-2.5 py-1 rounded-md">{file.folder}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'manual' && (
                  <div className="p-5 rounded-2xl bg-brand-primary/10 border border-brand-primary/20">
                    <p className="text-xs leading-relaxed font-bold text-brand-primary flex items-start gap-3">
                      <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      Creación Manual Inteligente: Define los metadatos esenciales y la IA estructurará el temario de forma autónoma.
                    </p>
                  </div>
                )}

                {/* Standard Metadata inputs */}
                <div className="flex flex-col gap-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="block text-xs font-bold uppercase tracking-widest select-none text-ink-subtle">Título del Temario</label>
                      <input type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Ej. Programación Avanzada" disabled={isProcessing}
                        className="w-full rounded-2xl py-4 px-5 text-sm font-medium outline-none transition-all bg-surface-2 border border-transparent focus:bg-canvas focus:border-brand-primary text-ink focus:ring-4 focus:ring-brand-primary/10" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="block text-xs font-bold uppercase tracking-widest select-none text-ink-subtle">Asignatura</label>
                      <input type="text" value={asignatura} onChange={(e) => setAsignatura(e.target.value)} placeholder="Ej. Sistemas Computacionales" disabled={isProcessing}
                        className="w-full rounded-2xl py-4 px-5 text-sm font-medium outline-none transition-all bg-surface-2 border border-transparent focus:bg-canvas focus:border-brand-primary text-ink focus:ring-4 focus:ring-brand-primary/10" />
                    </div>
                  </div>

                  {activeTab === 'manual' && (
                    <>
                      <div className="flex flex-col gap-2">
                        <label className="block text-xs font-bold uppercase tracking-widest select-none text-ink-subtle">Grado Académico</label>
                        <input type="text" value={gradoAcademico} onChange={(e) => setGradoAcademico(e.target.value)} placeholder="Ej. Universidad, Secundaria..." disabled={isProcessing}
                          className="w-full rounded-2xl py-4 px-5 text-sm font-medium outline-none transition-all bg-surface-2 border border-transparent focus:bg-canvas focus:border-brand-primary text-ink focus:ring-4 focus:ring-brand-primary/10" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="block text-xs font-bold uppercase tracking-widest select-none text-ink-subtle">Descripción (Opcional)</label>
                        <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} placeholder="Objetivo general del temario..." disabled={isProcessing} rows={2}
                          className="w-full rounded-2xl py-4 px-5 text-sm font-medium outline-none transition-all resize-none bg-surface-2 border border-transparent focus:bg-canvas focus:border-brand-primary text-ink focus:ring-4 focus:ring-brand-primary/10" />
                      </div>
                    </>
                  )}
                </div>

                <div className="flex flex-col gap-3">
                  <label className="block text-xs font-bold uppercase tracking-widest select-none text-ink-subtle">Subtemas a generar</label>
                  <select value={temas} onChange={(e) => setTemas(e.target.value)} disabled={isProcessing}
                    className="w-full rounded-2xl py-4 px-5 text-sm font-bold outline-none transition-all cursor-pointer bg-surface-2 border border-transparent focus:bg-canvas focus:border-brand-primary text-ink focus:ring-4 focus:ring-brand-primary/10">
                    <option value="4">4 módulos (Generación Rápida)</option>
                    <option value="6">6 módulos (Estructura Estándar)</option>
                    <option value="8">8 módulos (Formato Completo)</option>
                    <option value="12">12 módulos (Programa Extenso)</option>
                  </select>
                </div>

                {formError && (
                  <div className="p-4 rounded-2xl text-sm font-bold flex items-center gap-3 bg-red-500/10 border border-red-500/20 text-red-500">
                    <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    <span>{formError}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-end gap-4 pt-6 border-t border-hairline select-none">
                <button type="button" onClick={() => setIsModalOpen(false)} disabled={isProcessing}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl text-sm font-bold cursor-pointer transition-all text-ink-muted hover:bg-surface-2 hover:text-ink">
                  Cancelar
                </button>
                <Button variant="primary" type="submit" disabled={isProcessing} className="w-full sm:w-auto bg-brand-primary text-white hover:bg-brand-primary-hover px-8 py-3.5 text-sm font-bold rounded-xl flex items-center justify-center gap-2 shadow-elevated hover:-translate-y-1 transition-all duration-300">
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 rounded-full animate-spin border-2 border-white/30 border-t-white"></div>
                      <span>Procesando...</span>
                    </>
                  ) : (
                    <>
                      <span>Analizar Temario</span>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    </>
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

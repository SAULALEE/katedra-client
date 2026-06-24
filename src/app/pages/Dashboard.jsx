import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTemarios } from '../hooks/useTemarios';
import ResponsiveSidebar from '../components/ResponsiveSidebar';
import Card from '../components/Card';
import Button from '../components/Button';
import { Input } from '../components/Input';
import StatusBadge from '../components/StatusBadge';

/* Whimsical design tokens — official palette (blues & greens) */
const DISPLAY = "'Agrandir','Avenir','Montserrat','Segoe UI',sans-serif";
const BODY = "'Manrope','Helvetica Neue',Helvetica,Arial,sans-serif";
const INK = '#0F172A';
const BLUE = '#2563EB';
const BLUE_PALE = '#DBEAFE';
const LILAC = '#F0F4F8';
const GREEN = '#10B981';
const GREEN_DEEP = '#059669';
const MINT = '#D1FAE5';
const HAIR = 'rgba(15,23,42,0.08)';
const MUTED = 'rgba(15,23,42,0.60)';
const FAINT = 'rgba(15,23,42,0.40)';
const SHADOW_LO = '0 8px 16px -4px rgba(15,23,42,0.06)';
const SHADOW_MD = '0 18px 40px -12px rgba(15,23,42,0.14)';

// Accent rotation for document cards on the canvas
const DOC_ACCENTS = [BLUE, GREEN_DEEP, '#7C3AED', '#0891B2', '#D97706', '#DB2777'];

export default function Dashboard() {
  const navigate = useNavigate();
  const { courses, loading, crearTemario, error } = useTemarios();

  // Modal & Tab States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('pdf'); // 'pdf', 'link', 'drive', 'manual'

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

  // Infinite-canvas pan + zoom (visual workspace)
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

  // Open creation modal
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

  // Select simulated Google Drive document
  const handleSelectDriveFile = (fileNameSimulated, folder) => {
    setFileName(fileNameSimulated);
    setTitulo(`Temario de ${fileNameSimulated.replace('.pdf', '')}`);
    setAsignatura(folder || 'Google Drive');
    setOrigenDetalle(`drive://root/katedra/${fileNameSimulated}`);
  };

  // Handle Ingest submit
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

  // Scatter document cards across the canvas in an organic board layout
  const docPosition = (i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    return {
      left: 80 + col * 380 + (row % 2) * 46,
      top: 120 + row * 340 + col * 26,
      rotate: i % 3 === 0 ? -1.4 : i % 3 === 1 ? 0.8 : 1.6
    };
  };

  const inputBase = {
    fontFamily: BODY, background: '#fff', border: `1.5px solid ${HAIR}`, color: INK
  };

  const modalInputProps = (extra = {}) => ({
    style: { ...inputBase, ...extra },
    onFocus: (e) => { e.target.style.borderColor = BLUE; e.target.style.boxShadow = `0 0 0 4px ${BLUE_PALE}`; },
    onBlur: (e) => { e.target.style.borderColor = HAIR; e.target.style.boxShadow = 'none'; }
  });

  return (
    <div className="w-full min-h-screen flex flex-col md:flex-row" style={{ background: '#fff', color: INK, fontFamily: BODY }}>

      {/* Sidebar — kept as your existing responsive component */}
      <ResponsiveSidebar />

      {/* Main Workspace */}
      <main className="flex-1 flex flex-col min-w-0" style={{ background: LILAC }}>

        {/* Top Navbar */}
        <header className="h-[64px] sticky top-0 z-30 w-full flex items-center" style={{ borderBottom: `1px solid ${HAIR}`, background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(12px)' }}>
          <div className="w-full px-6 sm:px-8 flex items-center justify-between gap-4">
            <div className="flex flex-col">
              <h2 style={{ fontFamily: DISPLAY, color: INK, letterSpacing: '-0.01em' }} className="text-lg font-bold leading-none">Lienzo de Trabajo</h2>
              <span style={{ fontFamily: BODY, color: MUTED }} className="text-[11px] mt-1">Panel del Profesor · Katedra AI</span>
            </div>

            <div className="flex items-center gap-3">
              {/* Zoom controls */}
              <div className="hidden sm:flex items-center gap-1 rounded-xl p-1" style={{ background: '#fff', border: `1px solid ${HAIR}` }}>
                <button onClick={() => setZoom((z) => Math.max(0.6, +(z - 0.1).toFixed(2)))} className="w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer transition-colors" style={{ color: MUTED }} aria-label="Alejar">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeWidth={2.5} d="M5 12h14" /></svg>
                </button>
                <span style={{ fontFamily: BODY, color: INK }} className="text-xs font-bold w-10 text-center select-none">{Math.round(zoom * 100)}%</span>
                <button onClick={() => setZoom((z) => Math.min(1.4, +(z + 0.1).toFixed(2)))} className="w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer transition-colors" style={{ color: MUTED }} aria-label="Acercar">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeWidth={2.5} d="M12 5v14M5 12h14" /></svg>
                </button>
              </div>

              <Button variant="primary" onClick={handleOpenModal} className="!bg-[#0F172A] !text-white px-4 py-2.5 text-sm font-bold !rounded-xl" style={{ fontFamily: BODY, boxShadow: SHADOW_LO }}>
                + Cargar Temario con IA
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
          className="flex-1 overflow-auto relative select-none"
          style={{
            cursor: isPanning ? 'grabbing' : 'grab',
            backgroundColor: LILAC,
            backgroundImage: `radial-gradient(rgba(15,23,42,0.10) 1px, transparent 1px)`,
            backgroundSize: '26px 26px'
          }}
        >
          {/* Floating stats widget (pinned visual, scrolls with canvas) */}
          <div className="absolute z-10" style={{ left: 80, top: 32, transform: `scale(${zoom})`, transformOrigin: 'top left' }}>
            <div className="flex flex-wrap gap-3">
              {[
                { label: 'Materiales Generados', value: courses.length + 44, sub: '↑ 12 esta semana', subColor: GREEN_DEEP, icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
                { label: 'Tiempo Ahorrado', value: '38.4 hrs', sub: '~ 30-40% por temario', subColor: BLUE, icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
                { label: 'Llamadas a IA', value: '116', sub: 'Ilimitado Premium', subColor: MUTED, icon: 'M13 10V3L4 14h7v7l9-11h-7z' }
              ].map((s, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-2xl" style={{ background: 'rgba(255,255,255,0.92)', border: `1px solid ${HAIR}`, boxShadow: SHADOW_LO, backdropFilter: 'blur(8px)' }}>
                  <span className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: LILAC }}>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke={BLUE}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={s.icon} /></svg>
                  </span>
                  <div className="flex flex-col">
                    <span style={{ fontFamily: BODY, color: MUTED, letterSpacing: '0.04em' }} className="text-[9px] font-bold uppercase">{s.label}</span>
                    <span style={{ fontFamily: DISPLAY, color: INK, letterSpacing: '-0.02em' }} className="text-xl font-bold leading-tight">{s.value}</span>
                    <span style={{ fontFamily: BODY, color: s.subColor }} className="text-[10px] font-semibold">{s.sub}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Canvas surface — large area scaled by zoom for the "infinite" feel */}
          <div className="relative" style={{
            width: 1480,
            minHeight: 140 + Math.ceil((Math.max(courses.length, 6)) / 3) * 340 + 240,
            transform: `scale(${zoom})`,
            transformOrigin: 'top left',
            paddingTop: 130
          }}>
            {/* Section label on the board */}
            <div className="absolute" style={{ left: 80, top: 92 }}>
              <span style={{ fontFamily: BODY, color: MUTED, letterSpacing: '1.35px' }} className="text-[10px] font-bold uppercase">Documentos generados con IA</span>
            </div>

            {/* Loading skeleton documents */}
            {loading && courses.length === 0
              ? [0, 1, 2, 3, 4, 5].map((i) => {
                  const pos = docPosition(i);
                  return (
                    <div key={i} data-doc-card className="absolute rounded-2xl overflow-hidden animate-pulse" style={{ left: pos.left, top: pos.top, width: 320, height: 250, background: '#fff', border: `1px solid ${HAIR}`, boxShadow: SHADOW_LO, transform: `rotate(${pos.rotate}deg)` }}>
                      <div className="h-1.5 w-full" style={{ background: HAIR }} />
                      <div className="p-5 space-y-3">
                        <div className="h-4 rounded w-3/4" style={{ background: HAIR }} />
                        <div className="h-3 rounded w-1/2" style={{ background: HAIR }} />
                        <div className="h-2.5 rounded w-full mt-4" style={{ background: HAIR }} />
                        <div className="h-2.5 rounded w-5/6" style={{ background: HAIR }} />
                        <div className="h-2.5 rounded w-2/3" style={{ background: HAIR }} />
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
                      className="absolute rounded-2xl overflow-hidden cursor-pointer transition-all duration-200 hover:-translate-y-1.5 group"
                      style={{ left: pos.left, top: pos.top, width: 320, background: '#fff', border: `1px solid ${HAIR}`, boxShadow: SHADOW_LO, transform: `rotate(${pos.rotate}deg)` }}
                      onMouseEnter={(e) => { e.currentTarget.style.boxShadow = SHADOW_MD; e.currentTarget.style.transform = `rotate(0deg) translateY(-6px)`; }}
                      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = SHADOW_LO; e.currentTarget.style.transform = `rotate(${pos.rotate}deg)`; }}
                    >
                      {/* accent bar */}
                      <div className="h-1.5 w-full" style={{ background: accent }} />

                      <div className="p-5 flex flex-col gap-3">
                        {/* meta header */}
                        <div className="flex items-start justify-between gap-2">
                          <span className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: LILAC }}>
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke={accent}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                          </span>
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold select-none" style={{ fontFamily: BODY, background: MINT, color: GREEN_DEEP }}>
                            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: GREEN }}></span>
                            {c.estado || 'Completado'}
                          </span>
                        </div>

                        {/* title */}
                        <div>
                          <h3 style={{ fontFamily: DISPLAY, color: INK, letterSpacing: '-0.01em' }} className="text-base font-bold leading-snug line-clamp-2">{c.titulo || c.nombre}</h3>
                          <p style={{ fontFamily: BODY, color: MUTED }} className="text-xs mt-1 font-medium">{c.asignatura || c.curso}</p>
                        </div>

                        {/* mini ruled document preview */}
                        <div className="rounded-xl p-3 space-y-1.5" style={{ background: LILAC }}>
                          {[1, 0.85, 0.92, 0.7].map((w, k) => (
                            <div key={k} className="h-1.5 rounded-full" style={{ width: `${w * 100}%`, background: k === 0 ? accent : 'rgba(15,23,42,0.10)' }} />
                          ))}
                        </div>

                        {/* footer */}
                        <div className="flex items-center justify-between pt-1">
                          <div className="flex items-center gap-2">
                            <span style={{ fontFamily: BODY, color: MUTED }} className="text-[10px] font-semibold">{c.temas || 6} subtemas</span>
                            <span style={{ color: FAINT }}>·</span>
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-bold" style={{ fontFamily: BODY, background: LILAC, color: MUTED, border: `1px solid ${HAIR}` }}>{c.origen || 'Manual'}</span>
                          </div>
                          <span className="text-xs font-bold flex items-center gap-1 transition-transform group-hover:translate-x-0.5" style={{ fontFamily: BODY, color: accent }}>
                            Abrir
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}

            {/* Empty "new doc" affordance card */}
            {!loading && (
              (() => {
                const pos = docPosition(courses.length);
                return (
                  <button
                    data-doc-card
                    onClick={handleOpenModal}
                    className="absolute rounded-2xl flex flex-col items-center justify-center gap-3 cursor-pointer transition-all duration-200 hover:-translate-y-1.5"
                    style={{ left: pos.left, top: pos.top, width: 320, height: 250, background: 'rgba(255,255,255,0.5)', border: `2px dashed ${BLUE}`, transform: `rotate(${pos.rotate}deg)` }}
                  >
                    <span className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: BLUE_PALE }}>
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke={BLUE}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v14M5 12h14" /></svg>
                    </span>
                    <span style={{ fontFamily: DISPLAY, color: INK }} className="text-base font-bold">Nuevo temario</span>
                    <span style={{ fontFamily: BODY, color: MUTED }} className="text-xs">Genera un documento con IA</span>
                  </button>
                );
              })()
            )}
          </div>
        </div>
      </main>

      {/* ====================== MODAL: INGEST NEW TEMARIO ====================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6" style={{ background: 'rgba(15,23,42,0.35)', backdropFilter: 'blur(8px)' }}>
          <div className="w-full max-w-[500px] relative flex flex-col max-h-[90vh] overflow-hidden" style={{ background: '#fff', border: `1px solid ${HAIR}`, borderRadius: '28px', padding: '40px', gap: '28px', boxShadow: '0 40px 80px -20px rgba(15,23,42,0.4)' }}>

            {/* Modal Header */}
            <div className="flex justify-between items-start pb-5 select-none" style={{ borderBottom: `1px solid ${HAIR}`, gap: '20px' }}>
              <div>
                <span style={{ fontFamily: BODY, color: BLUE, letterSpacing: '0.15em' }} className="text-[10px] uppercase font-bold">Ingesta Inteligente</span>
                <h3 style={{ fontFamily: DISPLAY, color: INK, letterSpacing: '-0.01em' }} className="text-xl font-bold mt-1.5">Cargar Temario con IA</h3>
                <p style={{ fontFamily: BODY, color: MUTED }} className="text-xs mt-1 leading-relaxed">Carga un programa de estudios o define la asignatura para que la IA estructure el contenido.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="w-9 h-9 rounded-full flex items-center justify-center cursor-pointer transition-all shrink-0" style={{ border: `1px solid ${HAIR}`, color: MUTED, background: '#fff' }} aria-label="Cerrar modal">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {/* Source Tabs */}
            <div className="flex text-xs gap-2 select-none">
              {[
                { id: 'pdf', label: 'PDF / Archivo' },
                { id: 'link', label: 'Enlace Web' },
                { id: 'drive', label: 'Google Drive' },
                { id: 'manual', label: 'Manual' }
              ].map((tab) => (
                <button key={tab.id} type="button" onClick={() => { setActiveTab(tab.id); setFormError(''); }}
                  className="flex-1 py-2.5 font-bold text-center rounded-xl transition-all cursor-pointer text-[11px]"
                  style={{ fontFamily: BODY, background: activeTab === tab.id ? BLUE_PALE : LILAC, color: activeTab === tab.id ? BLUE : MUTED }}>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Ingest Form */}
            <form onSubmit={handleSubmit} className="flex flex-col overflow-hidden" style={{ gap: '24px' }}>
              <div className="flex flex-col overflow-y-auto max-h-[44vh] pr-1.5 gap-6 scrollable-modal-content">

                {activeTab === 'pdf' && (
                  <div
                    onDragEnter={handleDrag} onDragOver={handleDrag} onDragLeave={handleDrag} onDrop={handleDrop}
                    className="rounded-2xl py-10 px-8 flex flex-col items-center justify-center text-center transition-all"
                    style={{ border: `2px dashed ${dragActive ? BLUE : HAIR}`, background: dragActive ? BLUE_PALE : LILAC, gap: '12px' }}
                  >
                    <input type="file" id="pdf-upload" accept=".pdf,.doc,.docx,.txt" onChange={handleFileSelect} className="hidden" />
                    <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke={BLUE}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                    {fileName ? (
                      <div className="flex flex-col" style={{ gap: '6px' }}>
                        <p style={{ fontFamily: BODY, color: GREEN_DEEP }} className="text-xs font-bold truncate max-w-[320px] mx-auto">{fileName}</p>
                        <p style={{ fontFamily: BODY, color: MUTED }} className="text-[10px]">Archivo cargado. La IA autodetectará el nombre.</p>
                        <label htmlFor="pdf-upload" className="inline-block mt-2 text-[10px] font-bold cursor-pointer underline select-none" style={{ color: BLUE }}>Cambiar archivo</label>
                      </div>
                    ) : (
                      <div className="flex flex-col" style={{ gap: '6px' }}>
                        <p style={{ fontFamily: BODY, color: INK }} className="text-xs font-bold">Arrastra tu programa de estudios aquí</p>
                        <p style={{ fontFamily: BODY, color: MUTED }} className="text-[10px]">PDF, DOCX o TXT hasta 20MB</p>
                        <label htmlFor="pdf-upload" className="inline-block mt-2.5 px-4 py-2 rounded-lg text-[10px] font-bold cursor-pointer select-none" style={{ fontFamily: BODY, background: '#fff', border: `1px solid ${HAIR}`, color: INK }}>Buscar Archivo</label>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'link' && (
                  <div className="flex flex-col" style={{ gap: '8px' }}>
                    <label className="block text-[11px] font-bold uppercase tracking-wider select-none" style={{ fontFamily: BODY, color: MUTED }}>Dirección URL del Temario</label>
                    <input type="url" value={origenDetalle} onChange={(e) => setOrigenDetalle(e.target.value)} placeholder="https://universidad.edu/programas/matematicas-1.html" disabled={isProcessing}
                      className="w-full rounded-xl py-3.5 px-4 text-xs outline-none transition-all" {...modalInputProps()} />
                  </div>
                )}

                {activeTab === 'drive' && (
                  <div className="flex flex-col" style={{ gap: '10px' }}>
                    <span className="block text-[11px] font-bold uppercase tracking-wider select-none" style={{ fontFamily: BODY, color: MUTED }}>Archivos Recientes de Google Drive</span>
                    <div className="rounded-xl overflow-hidden max-h-[160px] overflow-y-auto" style={{ background: LILAC, border: `1px solid ${HAIR}` }}>
                      {[
                        { name: 'Syllabus_Algoritmos_2026.pdf', folder: 'Estructuras de Datos' },
                        { name: 'Plan_Fisica_Termodinamica.pdf', folder: 'Física Avanzada' },
                        { name: 'Introduccion_Literatura_Hispana.docx', folder: 'Humanidades' }
                      ].map((file) => (
                        <div key={file.name} onClick={() => handleSelectDriveFile(file.name, file.folder)}
                          className="py-3 px-4 text-xs flex items-center justify-between cursor-pointer transition-colors"
                          style={{ borderBottom: `1px solid ${HAIR}`, background: fileName === file.name ? BLUE_PALE : 'transparent', color: fileName === file.name ? BLUE : MUTED, fontFamily: BODY }}>
                          <div className="flex items-center gap-2.5 truncate">
                            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="#F59E0B"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" /></svg>
                            <span className="truncate">{file.name}</span>
                          </div>
                          <span style={{ color: FAINT }} className="text-[9px] uppercase tracking-widest font-bold shrink-0">{file.folder}</span>
                        </div>
                      ))}
                    </div>
                    {fileName && (
                      <div className="p-3 rounded-xl text-[10px] font-semibold mt-1" style={{ fontFamily: BODY, background: MINT, border: '1px solid rgba(16,185,129,0.2)', color: GREEN_DEEP }}>
                        Seleccionado: <span style={{ color: INK }}>{fileName}</span>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'manual' && (
                  <div className="p-4 rounded-xl" style={{ background: BLUE_PALE, border: `1px solid rgba(37,99,235,0.18)` }}>
                    <p style={{ fontFamily: BODY, color: BLUE }} className="text-xs leading-relaxed font-medium">Estás creando un temario manualmente. La IA tomará el título, asignatura, grado y descripción para generar los subtemas.</p>
                  </div>
                )}

                {/* Standard Metadata inputs */}
                <div className="flex flex-col gap-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="flex flex-col" style={{ gap: '8px' }}>
                      <label className="block text-[11px] font-bold uppercase tracking-wider select-none" style={{ fontFamily: BODY, color: MUTED }}>Título del Temario</label>
                      <input type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Ej. Programación Avanzada" disabled={isProcessing}
                        className="w-full rounded-xl py-3.5 px-4 text-xs outline-none transition-all" {...modalInputProps()} />
                    </div>
                    <div className="flex flex-col" style={{ gap: '8px' }}>
                      <label className="block text-[11px] font-bold uppercase tracking-wider select-none" style={{ fontFamily: BODY, color: MUTED }}>Materia / Asignatura</label>
                      <input type="text" value={asignatura} onChange={(e) => setAsignatura(e.target.value)} placeholder="Ej. Sistemas Computacionales" disabled={isProcessing}
                        className="w-full rounded-xl py-3.5 px-4 text-xs outline-none transition-all" {...modalInputProps()} />
                    </div>
                  </div>

                  {activeTab === 'manual' && (
                    <>
                      <div className="flex flex-col" style={{ gap: '8px' }}>
                        <label className="block text-[11px] font-bold uppercase tracking-wider select-none" style={{ fontFamily: BODY, color: MUTED }}>Grado Académico</label>
                        <input type="text" value={gradoAcademico} onChange={(e) => setGradoAcademico(e.target.value)} placeholder="Ej. Universidad, Secundaria..." disabled={isProcessing}
                          className="w-full rounded-xl py-3.5 px-4 text-xs outline-none transition-all" {...modalInputProps()} />
                      </div>
                      <div className="flex flex-col" style={{ gap: '8px' }}>
                        <label className="block text-[11px] font-bold uppercase tracking-wider select-none" style={{ fontFamily: BODY, color: MUTED }}>Descripción (Opcional)</label>
                        <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} placeholder="Breve descripción del objetivo del temario..." disabled={isProcessing} rows={2}
                          className="w-full rounded-xl py-3 px-4 text-xs outline-none transition-all resize-none" {...modalInputProps()} />
                      </div>
                    </>
                  )}
                </div>

                {/* Temas Selection */}
                <div className="flex flex-col" style={{ gap: '8px' }}>
                  <label className="block text-[11px] font-bold uppercase tracking-wider select-none" style={{ fontFamily: BODY, color: MUTED }}>Número de subtemas a generar con IA</label>
                  <select value={temas} onChange={(e) => setTemas(e.target.value)} disabled={isProcessing}
                    className="w-full rounded-xl py-3.5 px-4 text-xs outline-none transition-all duration-200 cursor-pointer" {...modalInputProps()}>
                    <option value="4">4 subtemas (Generación Rápida)</option>
                    <option value="6">6 subtemas (Generación Estándar)</option>
                    <option value="8">8 subtemas (Generación Completa)</option>
                    <option value="12">12 subtemas (Extensa / Avanzada)</option>
                  </select>
                </div>

                {formError && (
                  <div className="p-3 rounded-lg text-[11px] font-semibold flex items-center gap-2" style={{ fontFamily: BODY, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#DC2626' }}>
                    <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    <span>{formError}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-5 select-none" style={{ borderTop: `1px solid ${HAIR}` }}>
                <button type="button" onClick={() => setIsModalOpen(false)} disabled={isProcessing}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all" style={{ fontFamily: BODY, color: MUTED }}>
                  Cancelar
                </button>
                <Button variant="primary" type="submit" disabled={isProcessing} className="!bg-[#0F172A] !text-white px-5 py-2.5 text-xs font-bold !rounded-xl flex items-center gap-2" style={{ fontFamily: BODY }}>
                  {isProcessing ? (
                    <>
                      <div className="w-3.5 h-3.5 rounded-full animate-spin" style={{ border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff' }}></div>
                      <span>Procesando...</span>
                    </>
                  ) : (
                    <>
                      <span>Cargar y Procesar con IA</span>
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
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

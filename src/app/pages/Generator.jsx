import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useGenerator, PIEZAS, MODELOS } from '../hooks/useGenerator';
import { useAuth } from '../hooks/useAuth';
import { useExport } from '../hooks/useExport';
import { isAdmin } from '../utils/roleUtils';
import { SUBJECT_COLORS, darkenHex } from '../utils/asignaturaVisual';
import { opcionesDePieza } from '../utils/exportOptions';
import { formatTimeAgo } from '../utils/timeAgo';
import { ExportDropdown } from '../components/ExportDropdown';
import { ResponseCountField } from '../components/ResponseCountField';
import {
  Users as UsersIcon,
  FolderDot,
  Sparkles,
  Wand2,
  ChevronLeft,
  Bell,
  CheckCircle2,
  AlertCircle,
  MonitorPlay,
  FileText,
  CheckSquare,
  Settings,
  FileQuestion,
  BookOpen,
  Cpu,
  ChevronDown,
  Heart,
  Lock
} from 'lucide-react';
import { SidebarUserMenu } from '../components/SidebarUserMenu';
import { PlanModal } from '../components/PlanModal';
import { useSuscripcionStore } from '../store/suscripcionStore';
import { useSuscripcion } from '../hooks/useSuscripcion';

const IconZap = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
);

const CustomSelect = ({ value, onChange, options, placeholder, onLockedOption }) => {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  
  React.useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const selectedOption = options.find(o => o.value === value);
  const isSelectedPro = value === 'pro';
  const isSelectedFlash = value === 'flash';

  return (
    <div ref={ref} style={{ position: 'relative', width: '100%' }}>
      <button 
        type="button"
        onClick={() => setOpen(!open)}
        style={{
          width:'100%', height:'42px', padding:'8px 36px 8px 14px', 
          border: open ? '1px solid #10B981' : (value ? '1px solid var(--kt-chip-border)' : '1px solid var(--kt-input-border)'), 
          borderRadius:'10px', background: value ? 'var(--kt-chip-bg)' : 'var(--kt-input-bg)', 
          color: value ? 'var(--kt-heading)' : 'var(--kt-muted)', 
          fontFamily:"'Inter', sans-serif", fontWeight: value ? 700 : 600, fontSize:'13px', 
          display:'flex', alignItems:'center', justifyContent:'space-between',
          boxShadow: open ? '0 0 0 3px rgba(16, 185, 129, 0.2)' : '0 2px 4px rgba(15, 23, 42, 0.03)',
          cursor:'pointer', transition: 'all 0.2s', textAlign:'left'
        }}
      >
        <div style={{ display:'flex', alignItems:'center', gap:'8px', overflow:'hidden' }}>
          {isSelectedFlash && <IconZap style={{ color: 'var(--kt-muted)' }} />}
          {isSelectedPro && <Sparkles size={14} style={{ color: '#10B981', flexShrink: 0 }} />}
          <span style={{ whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', color: 'var(--kt-heading)' }}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>
        <div style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--kt-muted)' }}>
           <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: open ? 'rotate(180deg)' : 'none', transition:'transform .2s' }}><path d="m6 9 6 6 6-6"/></svg>
        </div>
      </button>
      
      {open && (
        <div className="kt-scroller" style={{
          position:'absolute', top:'calc(100% + 6px)', left:0, right:0, 
          background:'var(--kt-panel-bg)', border:'1px solid var(--kt-panel-border)', 
          borderRadius:'10px', boxShadow:'0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)', 
          zIndex:999, maxHeight:'200px', overflowY:'auto', padding:'6px'
        }}>
          {options.length === 0 ? (
             <div style={{ padding:'8px 12px', fontFamily:"'Manrope'", fontSize:'12px', color:'var(--kt-muted)', textAlign:'center' }}>Sin opciones</div>
          ) : options.map(opt => {
            const isOptPro = opt.value === 'pro';
            const isOptFlash = opt.value === 'flash';
            const isSelected = value === opt.value;
            const isLocked = Boolean(opt.disabled);

            return (
              <div
                key={opt.value}
                onClick={() => {
                  if (isLocked) { onLockedOption?.(); setOpen(false); return; }
                  onChange(opt.value); setOpen(false);
                }}
                style={{
                  padding:'10px 12px', borderRadius:'8px', cursor:'pointer',
                  background: isSelected
                    ? 'var(--kt-chip-bg)'
                    : (isOptPro ? 'rgba(16, 185, 129, .02)' : 'transparent'),
                  border: isSelected
                    ? '1px solid var(--kt-chip-border)'
                    : (isOptPro ? '1px solid rgba(16, 185, 129, .2)' : '1px solid transparent'),
                  color: isSelected
                    ? 'var(--kt-heading)'
                    : (isOptPro ? '#10B981' : 'var(--kt-text)'),
                  fontFamily:"'Inter'", fontWeight: (isSelected || isOptPro) ? 700 : 500, fontSize:'13px',
                  transition:'background .15s',
                  marginBottom: '4px',
                  opacity: isLocked ? .7 : 1
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.background = isOptPro ? 'rgba(16, 185, 129, .06)' : 'var(--kt-chip-bg)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.background = isOptPro ? 'rgba(16, 185, 129, .02)' : 'transparent';
                  }
                }}
              >
                <div style={{ display:'flex', alignItems:'center', gap:'6px' }}>
                  {isOptFlash && <IconZap style={{ color: isSelected ? 'var(--kt-heading)' : 'inherit' }} />}
                  {isOptPro && <Sparkles size={14} style={{ color: isSelected ? 'var(--kt-heading)' : '#10B981' }} />}
                  <span>{opt.label}</span>
                  {isLocked ? (
                    <span style={{ display:'inline-flex', alignItems:'center', gap:'3px', fontSize:'9px', background:'var(--kt-chip-bg)', border:'1px solid var(--kt-chip-border)', color:'var(--kt-muted)', padding:'1px 5px', borderRadius:'10px', fontWeight:800, letterSpacing:'0.5px' }}>
                      <Lock size={9} /> PRO
                    </span>
                  ) : isOptPro && (
                    <span style={{ fontSize:'9px', background:'#10B981', color:'#fff', padding:'1px 5px', borderRadius:'10px', transform: 'scale(0.95)', transformOrigin: 'left center', fontWeight:800, letterSpacing:'0.5px' }}>RECOMENDADO</span>
                  )}
                </div>
                {opt.hint && <div style={{ fontSize:'11px', color: isSelected ? 'var(--kt-muted)' : (isOptPro ? 'rgba(16, 185, 129, 0.8)' : 'var(--kt-muted)'), marginTop:'2px', fontWeight:500 }}>{opt.hint}</div>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default function Generator() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { exportar, formatoEnCurso } = useExport();
  const [theme, setTheme] = useState(() => localStorage.getItem('katedra-theme') || 'light');
  React.useEffect(() => { localStorage.setItem('katedra-theme', theme); }, [theme]);
  const [collapsed, setCollapsed] = useState(() => window.innerWidth <= 820);
  const [asignaturasOpen, setAsignaturasOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [configCollapsed, setConfigCollapsed] = useState(false);
  const [showGenConfirmModal, setShowGenConfirmModal] = useState(false);

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [planModalAbierto, setPlanModalAbierto] = useState(false);
  const abrirCheckout = useSuscripcionStore((s) => s.abrirCheckout);
  const { puedeUsarModeloPro, puedeGenerarDiapositivas, puedeExportarAvanzado } = useSuscripcion();

  const {
    asignaturas, asignaturasLoading,
    materiaId, setMateriaId,
    materiaSeleccionada,
    courses, temariosLoading,
    temarioId, setTemarioId,
    temarioSeleccionado,
    piezas, togglePieza, selectAllPiezas, deselectAllPiezas,
    modelo, setModelo,
    limitesModelo,
    numeroDiapositivas, setNumeroDiapositivas,
    numeroParrafos, setNumeroParrafos,
    numeroPreguntas, setNumeroPreguntas,
    resolverConteo,
    piezaYaGenerada,
    contenidoExistente,
    loadingContenido,
    isGenerating,
    generationStep,
    generatedData,
    genError,
    genErrorEsPlan,
    piezasFallidas,
    activeTab, setActiveTab,
    checkedAnswers, setCheckedAnswers,
    handleGenerate, handleSave
  } = useGenerator();

  // Latest known material for the selected temario (fresh generation wins)
  const displayData = generatedData || contenidoExistente;
  const pieceHasContent = (piezaId) => {
    if (!displayData) return false;
    const value = displayData[piezaId];
    if (value == null) return false;
    if (typeof value === 'string') return value.trim().length > 0;
    if (Array.isArray(value)) return value.length > 0;
    return false;
  };
  const canGenerate = temarioId && piezas.length > 0 && !isGenerating;

  useEffect(() => {
    const linkId = 'katedra-fonts';
    if (!document.getElementById(linkId)) {
      const link = document.createElement('link');
      link.id = linkId;
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Manrope:wght@500;600;700;800&display=swap';
      document.head.appendChild(link);
    }
  }, []);

  const [now] = useState(Date.now);

  const notify = (kind, title, msg) => {
    setNotifications(prev => [{ id: Date.now() + Math.random(), kind, title, msg, ts: Date.now() }, ...prev].slice(0, 20));
  };

  const handleExport = async (pieza, opcion) => {
    if (opcion.locked) { setPlanModalAbierto(true); return; }
    const resultado = await exportar({ temarioId, pieza, formato: opcion.id, theme });
    if (resultado.ok) {
      notify('success', 'Exportación lista', `Se descargó ${resultado.filename}.`);
    } else {
      notify('error', 'No se pudo exportar', resultado.message);
    }
  };

  const triggerGeneration = async () => {
    notify('success', 'Generación iniciada', 'Estamos creando el contenido…');
    const ok = await handleGenerate();
    if (ok) {
      const details = [];
      if (piezas.includes('teoria')) {
        const count = resolverConteo(numeroParrafos, limitesModelo.parrafos);
        details.push(`${count} párrafo${count !== 1 ? 's' : ''} de teoría`);
      }
      if (piezas.includes('evaluacion')) {
        const count = resolverConteo(numeroPreguntas, limitesModelo.preguntas);
        details.push(`${count} pregunta${count !== 1 ? 's' : ''} de evaluación`);
      }
      if (piezas.includes('diapositivas')) {
        const count = resolverConteo(numeroDiapositivas, limitesModelo.diapositivas);
        details.push(`${count} diapositiva${count !== 1 ? 's' : ''}`);
      }

      let summary = 'Material generado exitosamente: ';
      if (details.length === 1) summary += details[0] + '.';
      else if (details.length === 2) summary += details[0] + ' y ' + details[1] + '.';
      else if (details.length === 3) summary += details[0] + ', ' + details[1] + ' y ' + details[2] + '.';
      else summary = 'Contenido generado correctamente.';

      notify('success', 'Contenido generado', summary);
    }
  };

  const unreadCount = notifications.length;

  return (
    <>
      <style>{`[data-root]{margin:0;padding:0}
  *{box-sizing:border-box}
  input{outline:none;font-family:inherit}
  ::-webkit-scrollbar{width:10px;height:10px}
  ::-webkit-scrollbar-thumb{background:var(--kt-scrollbar);border-radius:8px;border:2px solid transparent;background-clip:content-box}

  /* ===== THEME TOKENS ===== */
  [data-root]{
    --kt-bg1:#FFFFFF;--kt-bg2:#EEF2F7;--kt-bg3:#F8FAFC;--kt-blob-scale:.5;
    --kt-grain-op:.035;--kt-grain-blend:multiply;
    --kt-text:#334155;--kt-heading:#0F172A;--kt-muted:#64748B;--kt-faint:#94A3B8;--kt-label:#94A3B8;
    --kt-border:rgba(15,23,42,.09);--kt-border-soft:rgba(15,23,42,.06);
    --kt-sidebar-bg:rgba(255,255,255,.75);--kt-panel-bg:rgba(255,255,255,.85);--kt-panel-border:rgba(15,23,42,.08);
    --kt-chip-bg:rgba(15,23,42,.045);--kt-chip-border:rgba(15,23,42,.08);--kt-chip-hover:rgba(15,23,42,.08);
    --kt-row-hover:rgba(15,23,42,.03);
    --kt-input-bg:rgba(241,245,249,.7);--kt-input-border:rgba(15,23,42,.12);
    --kt-modal-bg1:rgba(255,255,255,.98);--kt-modal-bg2:rgba(248,250,252,.98);--kt-modal-border:rgba(15,23,42,.09);--kt-modal-backdrop:rgba(15,23,42,.25);
    --kt-scrollbar:rgba(15,23,42,.16);
    --kt-shadow-panel:0 24px 50px -28px rgba(15,23,42,.16);
    --kt-shadow-modal:0 30px 70px -25px rgba(15,23,42,.25);
  }
  [data-root][data-kt-theme="dark"]{
    --kt-bg1:#0F172A;--kt-bg2:#1E293B;--kt-bg3:#0F172A;--kt-blob-scale:1;
    --kt-grain-op:.09;--kt-grain-blend:overlay;
    --kt-text:#E2E8F0;--kt-heading:#F8FAFC;--kt-muted:#94A3B8;--kt-faint:#64748B;--kt-label:#64748B;
    --kt-border:rgba(148,163,184,.1);--kt-border-soft:rgba(148,163,184,.06);
    --kt-sidebar-bg:rgba(11,17,32,.72);--kt-panel-bg:rgba(17,24,39,.66);--kt-panel-border:rgba(148,163,184,.12);
    --kt-chip-bg:rgba(148,163,184,.08);--kt-chip-border:rgba(148,163,184,.14);--kt-chip-hover:rgba(148,163,184,.16);
    --kt-row-hover:rgba(148,163,184,.05);
    --kt-input-bg:rgba(15,23,42,.6);--kt-input-border:rgba(148,163,184,.14);
    --kt-modal-bg1:rgba(23,31,48,.96);--kt-modal-bg2:rgba(15,23,42,.96);--kt-modal-border:rgba(148,163,184,.16);--kt-modal-backdrop:rgba(2,6,23,.6);
    --kt-scrollbar:rgba(148,163,184,.22);
    --kt-shadow-panel:0 30px 60px -30px rgba(0,0,0,.6);
    --kt-shadow-modal:0 40px 90px -30px rgba(0,0,0,.8);
  }

  /* markdown rendering (mirrors ContentViewer) */
  .markdown-body h1, .markdown-body h2, .markdown-body h3, .markdown-body h4 { font-family:'Inter', sans-serif; font-weight:600; color:var(--kt-heading); margin-bottom:12px; margin-top:24px; }
  .markdown-body h1:first-child, .markdown-body h2:first-child, .markdown-body h3:first-child { margin-top:0; }
  .markdown-body p, .markdown-body li { font-family:'Manrope', sans-serif; font-weight:500; font-size:14.5px; line-height:1.75; color:var(--kt-text); margin-bottom:14px; }
  .markdown-body ul, .markdown-body ol { margin-left:24px; margin-bottom:16px; }
  .markdown-body strong { color:var(--kt-heading); }
  .markdown-body code { font-family:'JetBrains Mono', monospace; font-size:12.5px; padding:2px 6px; border-radius:6px; background:var(--kt-chip-bg); color:var(--kt-heading); }
  .markdown-body pre { background:var(--kt-bg2); color:var(--kt-text); padding:16px; border-radius:12px; overflow-x:auto; margin-bottom:16px; font-family:'JetBrains Mono', monospace; border:1px solid var(--kt-border); }
  .markdown-body pre code { background:transparent; padding:0; color:inherit; font-size:13px; }

  @keyframes ktBlob{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(30px,-28px) scale(1.14)}}
  @keyframes ktBlob2{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(-26px,24px) scale(1.1)}}
  @keyframes ktGrainShift{0%{transform:translate(0,0)}25%{transform:translate(-4%,3%)}50%{transform:translate(3%,-2%)}75%{transform:translate(-2%,-3%)}100%{transform:translate(0,0)}}
  @keyframes ktPulse{0%,100%{opacity:.55;transform:scale(1)}50%{opacity:1;transform:scale(1.35)}}
  @keyframes ktToastIn{0%{transform:translateX(130%) scale(.9);opacity:0}55%{transform:translateX(-10px) scale(1.02);opacity:1}75%{transform:translateX(5px) scale(.99)}100%{transform:translateX(0) scale(1)}}
  @keyframes ktToastOut{to{transform:translateX(130%) scale(.92);opacity:0}}

  .kt-nav:hover{background:var(--kt-chip-hover) !important}
  .kt-actbtn:hover{background:var(--kt-chip-hover) !important;color:var(--kt-heading) !important}
  .kt-actbtn.del:hover{background:rgba(244,63,94,.16) !important;color:#FB7185 !important}
  .kt-row{transition:background .18s ease}
  .kt-row:hover{background:var(--kt-row-hover)}
  .kt-primary:hover{transform:translateY(-2px);box-shadow:0 16px 34px -12px rgba(16,185,129,.7)}
  .kt-primary:active{transform:translateY(0)}

  /* sidebar collapse (manual, works at any width) */
  .kt-sidebar{width:256px; transition: width .32s cubic-bezier(.4,0,.2,1) !important; user-select: none; -webkit-user-select: none;}
  [data-root][data-kt-collapsed="true"] .kt-sidebar{width:76px}
  .kt-sidelabel{transition: opacity .25s ease, max-width .25s ease, margin .25s ease; opacity:1; max-width: 180px; min-width: 0; overflow: hidden; white-space: nowrap; display: inline-block;}
  [data-root][data-kt-collapsed="true"] .kt-sidelabel{display: none !important;}
  .kt-menutitle{transition: opacity .25s ease, max-height .25s ease; opacity: 1; max-height: 20px; overflow: hidden; white-space: nowrap;}
  [data-root][data-kt-collapsed="true"] .kt-menutitle{display: none !important;}
  [data-root][data-kt-collapsed="true"] .kt-navrow{justify-content:center}
  [data-root][data-kt-collapsed="true"] .kt-collapse-icon{transform:rotate(180deg)}

  /* theme switch */
  .kt-theme-icon-sun{display:none}
  .kt-theme-icon-moon{display:inline-flex}
  [data-root][data-kt-theme="dark"] .kt-theme-icon-sun{display:inline-flex}
  [data-root][data-kt-theme="dark"] .kt-theme-icon-moon{display:none}
  .kt-theme-label-light{display:none}
  .kt-theme-label-dark{display:inline}
  [data-root][data-kt-theme="dark"] .kt-theme-label-light{display:inline}
  [data-root][data-kt-theme="dark"] .kt-theme-label-dark{display:none}
  .kt-theme-track{background:#CBD5E1}
  [data-root][data-kt-theme="dark"] .kt-theme-track{background:#10B981}
  .kt-theme-knob{transform:translateX(0)}
  [data-root][data-kt-theme="dark"] .kt-theme-knob{transform:translateX(16px)}

  /* create/edit modal mode swap */
  .kt-only-create{display:inline}
  .kt-only-edit{display:none}
  [data-root][data-kt-modal-mode="edit"] .kt-only-create{display:none}
  [data-root][data-kt-modal-mode="edit"] .kt-only-edit{display:inline}

  /* modal open/close */
  [data-modal]{opacity:0;pointer-events:none;transition:opacity .22s ease}
  [data-root][data-kt-modal="true"] [data-modal]{opacity:1;pointer-events:auto}
  [data-modal-panel]{transform:scale(.94) translateY(10px);transition:transform .3s cubic-bezier(.34,1.56,.64,1)}
  [data-root][data-kt-modal="true"] [data-modal-panel]{transform:scale(1) translateY(0)}

  /* modal role/status pill selector */
  [data-role-opt]{background:transparent;color:var(--kt-muted)}
  [data-root][data-kt-form-role="Libre"] [data-role-opt="Libre"],
  [data-root][data-kt-form-role="Premium"] [data-role-opt="Premium"],
  [data-root][data-kt-form-role="Admin"] [data-role-opt="Admin"]{background:linear-gradient(150deg,#10B981,#059669);color:#fff;box-shadow:0 6px 16px -8px rgba(16,185,129,.7)}
  [data-status-opt]{background:var(--kt-input-bg);border-color:var(--kt-input-border) !important;color:var(--kt-muted)}
  [data-root][data-kt-form-status="Activo"] [data-status-opt="Activo"]{background:rgba(52,211,153,.14);border-color:rgba(52,211,153,.5) !important;color:#059669}
  [data-root][data-kt-theme="dark"][data-kt-form-status="Activo"] [data-status-opt="Activo"]{color:#34D399}
  [data-root][data-kt-form-status="Inactivo"] [data-status-opt="Inactivo"]{background:rgba(244,63,94,.14);border-color:rgba(244,63,94,.5) !important;color:#BE123C}
  [data-root][data-kt-theme="dark"][data-kt-form-status="Inactivo"] [data-status-opt="Inactivo"]{color:#FB7185}

  /* role / status pills (table rows + details drawer) */
  [data-rolepill]{background:var(--kt-chip-bg);color:var(--kt-muted);border:1px solid var(--kt-chip-border)}
  [data-statuspill]{background:var(--kt-chip-bg);color:var(--kt-muted);border:1px solid var(--kt-chip-border)}
  [data-statusdot]{background:var(--kt-muted)}
  .kt-row[data-role="Admin"] [data-rolepill], [data-details-drawer][data-role="Admin"] [data-rolepill]{background:rgba(56,189,248,.16);color:#0369A1;border-color:rgba(56,189,248,.35)}
  .kt-row[data-role="Premium"] [data-rolepill], [data-details-drawer][data-role="Premium"] [data-rolepill]{background:rgba(245,158,11,.16);color:#B45309;border-color:rgba(245,158,11,.35)}
  .kt-row[data-role="Libre"] [data-rolepill], [data-details-drawer][data-role="Libre"] [data-rolepill]{background:rgba(100,116,139,.14);color:#475569;border-color:rgba(100,116,139,.3)}
  [data-root][data-kt-theme="dark"] .kt-row[data-role="Admin"] [data-rolepill], [data-root][data-kt-theme="dark"] [data-details-drawer][data-role="Admin"] [data-rolepill]{color:#7DD3FC}
  [data-root][data-kt-theme="dark"] .kt-row[data-role="Premium"] [data-rolepill], [data-root][data-kt-theme="dark"] [data-details-drawer][data-role="Premium"] [data-rolepill]{color:#FBBF24}
  [data-root][data-kt-theme="dark"] .kt-row[data-role="Libre"] [data-rolepill], [data-root][data-kt-theme="dark"] [data-details-drawer][data-role="Libre"] [data-rolepill]{color:#CBD5E1}
  .kt-row[data-status="Activo"] [data-statuspill], [data-details-drawer][data-status="Activo"] [data-statuspill]{background:rgba(16,185,129,.16);color:#047857;border-color:rgba(16,185,129,.35)}
  .kt-row[data-status="Inactivo"] [data-statuspill], [data-details-drawer][data-status="Inactivo"] [data-statuspill]{background:rgba(244,63,94,.16);color:#BE123C;border-color:rgba(244,63,94,.35)}
  [data-root][data-kt-theme="dark"] .kt-row[data-status="Activo"] [data-statuspill], [data-root][data-kt-theme="dark"] [data-details-drawer][data-status="Activo"] [data-statuspill]{color:#34D399}
  [data-root][data-kt-theme="dark"] .kt-row[data-status="Inactivo"] [data-statuspill], [data-root][data-kt-theme="dark"] [data-details-drawer][data-status="Inactivo"] [data-statuspill]{color:#FB7185}
  .kt-row[data-status="Activo"] [data-statusdot], [data-details-drawer][data-status="Activo"] [data-statusdot]{background:#10B981;box-shadow:0 0 8px #10B981}
  .kt-row[data-status="Inactivo"] [data-statusdot], [data-details-drawer][data-status="Inactivo"] [data-statusdot]{background:#F43F5E;box-shadow:0 0 8px #F43F5E}
  .kt-row[data-role="Admin"] [data-avatar]{background:linear-gradient(150deg,#38BDF8,#2563EB)}
  .kt-row[data-role="Premium"] [data-avatar]{background:linear-gradient(150deg,#FBBF24,#D97706)}
  .kt-row[data-role="Libre"] [data-avatar]{background:linear-gradient(150deg,#34D399,#059669)}
  [data-details-drawer][data-role="Admin"] [data-avatar-lg]{background:linear-gradient(150deg,#38BDF8,#2563EB)}
  [data-details-drawer][data-role="Premium"] [data-avatar-lg]{background:linear-gradient(150deg,#FBBF24,#D97706)}
  [data-details-drawer][data-role="Libre"] [data-avatar-lg]{background:linear-gradient(150deg,#34D399,#059669)}

  /* notifications dropdown */
  [data-notif-panel]{opacity:0;transform:translateY(-8px) scale(.97);pointer-events:none;transition:opacity .18s ease,transform .18s ease}
  [data-root][data-kt-notif="true"] [data-notif-panel]{opacity:1;transform:translateY(0) scale(1);pointer-events:auto}
  [data-notif-catcher]{display:none}
  [data-root][data-kt-notif="true"] [data-notif-catcher]{display:block}
  [data-notif-icon][data-kind="success"]{background:rgba(16,185,129,.16);color:#10B981}
  [data-notif-icon][data-kind="error"]{background:rgba(244,63,94,.16);color:#F43F5E}
  [data-notif-icon][data-kind="warn"]{background:rgba(245,158,11,.16);color:#F59E0B}

  /* details drawer */
  [data-details-backdrop]{opacity:0;pointer-events:none;transition:opacity .25s ease}
  [data-root][data-kt-details="true"] [data-details-backdrop]{opacity:1;pointer-events:auto}
  [data-details-drawer]{transform:translateX(100%);transition:transform .32s cubic-bezier(.4,0,.2,1)}
  [data-root][data-kt-details="true"] [data-details-drawer]{transform:translateX(0)}

  @media(max-width:1024px){
    .kt-sidebar{width:74px !important}
    .kt-sidelabel{display:none !important}
    .kt-menutitle{opacity:0 !important}
    .kt-navrow{justify-content:center !important}
    .kt-collapsebtn{display:none !important}
  }
  @media(max-width:820px){
    .kt-sidebar{position:absolute !important;z-index:90;height:100%;width:260px !important;border-top-right-radius:24px;border-bottom-right-radius:24px;box-shadow:10px 0 40px rgba(0,0,0,0.15) !important;transform:translateX(0)}
    [data-root][data-kt-theme="dark"] .kt-sidebar{box-shadow:10px 0 40px rgba(0,0,0,0.4) !important}
    [data-root][data-kt-collapsed="true"] .kt-sidebar{width:260px !important;transform:translateX(-100%);box-shadow:none !important}
    .kt-sidelabel, .kt-menutitle{display:inline-block !important;opacity:1 !important}
    .kt-navrow, .kt-brand-header{justify-content:flex-start !important;padding-left:12px !important;padding-right:12px !important}
    .kt-brand-header{padding:22px 20px 20px !important}
    [data-root][data-kt-collapsed="true"] .kt-sidelabel, [data-root][data-kt-collapsed="true"] .kt-menutitle{display:none !important}
    .kt-collapsebtn{display:grid !important;right:-20px;width:40px;height:40px;box-shadow:0 4px 12px rgba(0,0,0,0.1)}
  }
  @media(max-width:760px){
          .kt-gen-config-grid { grid-template-columns: 1fr !important; }
    .kt-tablewrap{overflow-x:auto}
    .kt-table{min-width:680px}
    .kt-headtitle{font-size:22px !important}
    .kt-main-pad{padding:18px !important}
  }

  [data-root][data-kt-collapsed="true"] .kt-brand-logo { display: none !important; }
  [data-root][data-kt-collapsed="true"] .kt-brand-header { padding-left: 0 !important; padding-right: 0 !important; justify-content: center !important; }
  [data-root][data-kt-collapsed="true"] .kt-collapsebtn { margin-left: 0 !important; }

        .kt-mobile-overlay {
          display: none;
        }
        @media(max-width:820px) {
          .kt-mobile-overlay {
            display: block;
            position: absolute;
            inset: 0;
            z-index: 8;
            background: rgba(15, 23, 42, 0.5);
            backdrop-filter: blur(2px);
          }
          [data-root][data-kt-theme="dark"] .kt-mobile-overlay {
            background: rgba(0, 0, 0, 0.7);
          }
        }
      `}</style>
      <div 
        data-root 
        data-kt-theme={theme} 
        data-kt-collapsed={collapsed ? "true" : "false"}
        data-kt-notif={notifOpen ? "true" : "false"}
        style={{ position:'fixed', inset:0, display:'flex', overflow:'hidden', fontFamily:"'Manrope',sans-serif", background:'radial-gradient(130% 135% at 12% 6%, var(--kt-bg1) 0%, var(--kt-bg2) 40%, var(--kt-bg3) 100%)', color:'var(--kt-text)' }}
      >
        {/* decorative ambient layer */}
        <div style={{ position:'absolute', inset:0, overflow:'hidden', pointerEvents:'none', zIndex:0 }}>
          <div style={{ position:'absolute', inset:0, opacity:'var(--kt-blob-scale)' }}>
            <div style={{ position:'absolute', top:'-160px', left:'120px', width:'520px', height:'520px', borderRadius:'50%', background:'radial-gradient(circle at 50% 50%, rgba(16,185,129,.32), rgba(16,185,129,0) 68%)', filter:'blur(30px)', animation:'ktBlob 16s ease-in-out infinite' }}></div>
            <div style={{ position:'absolute', bottom:'-200px', right:'-80px', width:'560px', height:'560px', borderRadius:'50%', background:'radial-gradient(circle at 50% 50%, rgba(245,158,11,.24), rgba(245,158,11,0) 66%)', filter:'blur(34px)', animation:'ktBlob2 20s ease-in-out infinite' }}></div>
            <div style={{ position:'absolute', top:'30%', right:'26%', width:'360px', height:'360px', borderRadius:'50%', background:'radial-gradient(circle at 50% 50%, rgba(56,189,248,.18), rgba(56,189,248,0) 70%)', filter:'blur(32px)', animation:'ktBlob 24s ease-in-out infinite' }}></div>
          </div>
          <svg style={{ position:'absolute', inset:'-6%', width:'112%', height:'112%', opacity:'var(--kt-grain-op)', mixBlendMode:'var(--kt-grain-blend)', animation:'ktGrainShift 8s steps(6) infinite' }} xmlns="http://www.w3.org/2000/svg">
            <filter id="ktnoise"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch"></feTurbulence><feColorMatrix type="saturate" values="0"></feColorMatrix></filter>
            <rect width="100%" height="100%" filter="url(#ktnoise)"></rect>
          </svg>
        </div>

        
        {/* Mobile Overlay for sidebars */}
        {!collapsed && (
          <div 
            className="kt-mobile-overlay"
            onClick={() => setCollapsed(true)}
          />
        )}

        {/* SIDEBAR */}
        <aside className="kt-sidebar" style={{ position:'relative', zIndex:10, flex:'none', display:'flex', flexDirection:'column', background:'var(--kt-sidebar-bg)', backdropFilter:'blur(14px)', borderRight:'1px solid var(--kt-border)', transition:'width .32s cubic-bezier(.4,0,.2,1)', overflow:'visible' }}>
          <button className="kt-collapsebtn" onClick={() => { const next = !collapsed; setCollapsed(next); if (next) setAsignaturasOpen(false); }} aria-label="Colapsar" style={{ position:'absolute', right:'-14px', top:'26px', width:'28px', height:'28px', display:'grid', placeItems:'center', border:'1px solid var(--kt-border)', background:'var(--kt-panel-bg)', borderRadius:'50%', color:'var(--kt-muted)', cursor:'pointer', zIndex:50, boxShadow:'0 4px 12px rgba(0,0,0,0.05)' }}>
            <ChevronLeft className="kt-collapse-icon" size={16} style={{ transition:'transform .3s' }} />
          </button>
          
          <div className="kt-brand-header" style={{ display:'flex', alignItems:'center', gap:'11px', padding:'22px 20px 20px', position: 'relative', overflow: 'hidden' }}>
            <div className="kt-brand-logo" style={{ width:'36px', height:'36px', flex:'none', borderRadius:'10px', background:'linear-gradient(150deg,#10B981,#059669)', display:'grid', placeItems:'center', boxShadow:'0 6px 16px -5px rgba(16,185,129,.6)' }}>
              <span style={{ fontFamily:"'Inter'", fontWeight:700, fontSize:'19px', color:'#fff', letterSpacing:'-1px' }}>K</span>
            </div>
            <span className="kt-sidelabel" style={{ fontFamily:"'Inter'", fontWeight:600, fontSize:'19px', letterSpacing:'-.8px', color:'var(--kt-heading)' }}>Katedra</span>
          </div>

          <div className="kt-menutitle" style={{ padding:'6px 22px 10px', fontFamily:"'Manrope'", fontWeight:700, fontSize:'10px', letterSpacing:'1.4px', textTransform:'uppercase', color:'var(--kt-label)', overflow:'hidden' }}>Menú Principal</div>

          <nav style={{ display:'flex', flexDirection:'column', gap:'4px', padding:'0 12px' }}>
            {isAdmin(user) && (
              <Link to="/usuarios" className="kt-nav kt-navrow" style={{ display:'flex', alignItems:'center', gap:'13px', padding:'11px 12px', borderRadius:'11px', textDecoration:'none', background: location.pathname === '/usuarios' ? 'linear-gradient(120deg,rgba(16,185,129,.16),rgba(16,185,129,.06))' : 'transparent', border: location.pathname === '/usuarios' ? '1px solid rgba(16,185,129,.28)' : '1px solid transparent', color: location.pathname === '/usuarios' ? 'var(--kt-heading)' : 'var(--kt-muted)' }}>
                <span style={{ flex:'none', width:'20px', display:'grid', placeItems:'center', color: location.pathname === '/usuarios' ? '#10B981' : 'inherit' }}><UsersIcon size={20} /></span>
                <span className="kt-sidelabel" style={{ fontFamily:"'Manrope'", fontWeight:location.pathname === '/usuarios' ? 700 : 600, fontSize:'14px' }}>Usuarios</span>
              </Link>
            )}

            {/* Módulo Principal: Mis Asignaturas */}
            <div
              onClick={() => navigate('/dashboard')}
              className="kt-nav kt-navrow"
              style={{
                display:'flex',
                alignItems:'center',
                gap:'13px',
                padding:'11px 12px',
                borderRadius:'11px',
                cursor:'pointer',
                color: 'var(--kt-muted)'
              }}
            >
              <span style={{ flex:'none', width:'20px', display:'grid', placeItems:'center' }}><FolderDot size={20} /></span>
              <span className="kt-sidelabel" style={{ fontFamily:"'Manrope'", fontWeight:600, fontSize:'14px', flex: 1 }}>Mis Asignaturas</span>
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  setAsignaturasOpen(!asignaturasOpen);
                }}
                aria-label="Contraer/Desplegar Mis Asignaturas"
                className="kt-sidelabel"
                style={{
                  display:'grid',
                  placeItems:'center',
                  padding:'2px',
                  borderRadius:'6px',
                  cursor:'pointer',
                  opacity: 0.85
                }}
              >
                <ChevronDown size={16} style={{ transform: asignaturasOpen ? 'rotate(0deg)' : 'rotate(-90deg)', transition: 'transform 0.2s cubic-bezier(.4,0,.2,1)' }} />
              </span>
            </div>

            {/* Submódulo de Mis Asignaturas (Únicamente Mis Favoritos) */}
            {asignaturasOpen && (
              <div style={{ display:'flex', flexDirection:'column', gap:'2px', paddingLeft:'12px', marginTop:'-1px', marginBottom:'4px', borderLeft:'2px solid var(--kt-border-soft)', marginLeft:'21px' }}>
                <Link
                  to="/dashboard?view=favoritos"
                  className="kt-nav kt-navrow"
                  style={{
                    display:'flex',
                    alignItems:'center',
                    gap:'10px',
                    padding:'8px 10px',
                    borderRadius:'9px',
                    textDecoration:'none',
                    border: '1px solid transparent',
                    background: 'transparent',
                    color: 'var(--kt-muted)',
                    width:'100%',
                    textAlign:'left'
                  }}
                >
                  <span style={{ flex:'none', width:'18px', display:'grid', placeItems:'center' }}><Heart size={16} /></span>
                  <span className="kt-sidelabel" style={{ fontFamily:"'Manrope'", fontWeight:600, fontSize:'13px' }}>Mis Favoritos</span>
                </Link>
              </div>
            )}

            <Link to="/generador" className="kt-nav kt-navrow" style={{ display:'flex', alignItems:'center', gap:'13px', padding:'11px 12px', borderRadius:'11px', textDecoration:'none', background: location.pathname === '/generador' ? 'linear-gradient(120deg,rgba(16,185,129,.16),rgba(16,185,129,.06))' : 'transparent', border: location.pathname === '/generador' ? '1px solid rgba(16,185,129,.28)' : '1px solid transparent', color: location.pathname === '/generador' ? 'var(--kt-heading)' : 'var(--kt-muted)' }}>
              <span style={{ flex:'none', width:'20px', display:'grid', placeItems:'center', color: location.pathname === '/generador' ? '#10B981' : 'inherit' }}><Wand2 size={20} /></span>
              <span className="kt-sidelabel" style={{ fontFamily:"'Manrope'", fontWeight:location.pathname === '/generador' ? 700 : 600, fontSize:'14px' }}>Generador</span>
            </Link>
            <Link to="/contenidos" className="kt-nav kt-navrow" style={{ display:'flex', alignItems:'center', gap:'13px', padding:'11px 12px', borderRadius:'11px', textDecoration:'none', background: location.pathname === '/contenidos' ? 'linear-gradient(120deg,rgba(16,185,129,.16),rgba(16,185,129,.06))' : 'transparent', border: location.pathname === '/contenidos' ? '1px solid rgba(16,185,129,.28)' : '1px solid transparent', color: location.pathname === '/contenidos' ? 'var(--kt-heading)' : 'var(--kt-muted)' }}>
              <span style={{ flex:'none', width:'20px', display:'grid', placeItems:'center', color: location.pathname === '/contenidos' ? '#10B981' : 'inherit' }}><Sparkles size={20} /></span>
              <span className="kt-sidelabel" style={{ fontFamily:"'Manrope'", fontWeight:location.pathname === '/contenidos' ? 700 : 600, fontSize:'14px' }}>Historial de Contenidos</span>
            </Link>
          </nav>

          <SidebarUserMenu
            user={user}
            theme={theme}
            onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            onLogout={async () => { await logout(); navigate('/login'); }}
            onAbrirPlan={() => setPlanModalAbierto(true)}
          />
        </aside>

        {/* MAIN */}
        <main style={{ position:'relative', zIndex:5, flex:1, minWidth:0, display:'flex', flexDirection:'column', overflowY:'auto' }}>
          <header className="kt-main-pad" style={{ display:'flex', alignItems:'center', gap:'18px', padding:'26px 32px', borderBottom:'1px solid var(--kt-border-soft)' }}>
            <div style={{ minWidth:0 }}>
              <h1 className="kt-headtitle" style={{ fontFamily:"'Inter'", fontWeight:600, fontSize:'27px', lineHeight:1.15, letterSpacing:'-1.2px', color:'var(--kt-heading)', margin:0 }}>Generador de Contenido</h1>
              <p style={{ fontFamily:"'Manrope'", fontWeight:500, fontSize:'13.5px', color:'var(--kt-muted)', margin:'3px 0 0' }}>Crea y edita materiales para tus Temarios</p>
            </div>
            
            <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:'12px' }}>
              {/* notifications */}
              <div style={{ position:'relative' }}>
                <button onClick={() => setNotifOpen(!notifOpen)} aria-label="Notificaciones" style={{ position:'relative', width:'42px', height:'42px', display:'grid', placeItems:'center', border:'1px solid var(--kt-chip-border)', background:'var(--kt-chip-bg)', borderRadius:'11px', color:'var(--kt-muted)', cursor:'pointer' }}>
                  <Bell size={19} />
                  {unreadCount > 0 && (
                    <span style={{ position:'absolute', top:'-2px', right:'-2px', minWidth:'18px', height:'18px', padding:'0 4px', borderRadius:'9px', background:'#F43F5E', color:'#fff', fontFamily:"'Manrope'", fontWeight:800, fontSize:'10px', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 0 0 2px var(--kt-panel-bg)' }}>{unreadCount}</span>
                  )}
                </button>
                <div data-notif-catcher onClick={() => setNotifOpen(false)} style={{ position:'fixed', inset:0, zIndex:65 }}></div>
                <div data-notif-panel style={{ position:'absolute', top:'52px', right:0, width:'320px', maxHeight:'400px', overflow:'auto', background:'var(--kt-modal-bg1)', border:'1px solid var(--kt-modal-border)', borderRadius:'14px', boxShadow:'var(--kt-shadow-modal)', zIndex:70 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'8px', padding:'14px 16px', borderBottom:'1px solid var(--kt-border-soft)' }}>
                    <span style={{ fontFamily:"'Inter'", fontWeight:600, fontSize:'14px', color:'var(--kt-heading)' }}>Notificaciones</span>
                    {unreadCount > 0 && (
                      <span onClick={() => setNotifications([])} style={{ marginLeft:'auto', fontFamily:"'Manrope'", fontWeight:700, fontSize:'11px', color:'#10B981', cursor:'pointer' }}>Marcar leídas</span>
                    )}
                  </div>
                  {notifications.length > 0 ? notifications.map(n => (
                    <div key={n.id} style={{ display:'flex', gap:'10px', padding:'12px 16px', borderBottom:'1px solid var(--kt-border-soft)' }}>
                      <span data-notif-icon data-kind={n.kind} style={{ flex:'none', width:'30px', height:'30px', borderRadius:'9px', display:'grid', placeItems:'center', background: n.kind === 'success' ? 'rgba(16,185,129,.16)' : n.kind === 'error' ? 'rgba(244,63,94,.16)' : 'rgba(245,158,11,.16)', color: n.kind === 'success' ? '#10B981' : n.kind === 'error' ? '#F43F5E' : '#F59E0B' }}>
                        {n.kind === 'success' && <CheckCircle2 size={15} />}
                        {n.kind === 'error' && <AlertCircle size={15} />}
                        {n.kind === 'warn' && <AlertCircle size={15} />}
                      </span>
                      <div style={{ minWidth:0 }}>
                        <div style={{ fontFamily:"'Manrope'", fontWeight:700, fontSize:'12.5px', color:'var(--kt-heading)' }}>{n.title}</div>
                        <div style={{ fontFamily:"'Manrope'", fontWeight:500, fontSize:'11.5px', color:'var(--kt-muted)', marginTop:'1px' }}>{n.msg}</div>
                        <div style={{ fontFamily:"'Manrope'", fontWeight:600, fontSize:'10px', color:'var(--kt-faint)', marginTop:'4px' }}>{formatTimeAgo(n.ts, now)}</div>
                      </div>
                    </div>
                  )) : (
                    <div style={{ padding:'36px 16px', textAlign:'center', fontFamily:"'Manrope'", fontWeight:600, fontSize:'12.5px', color:'var(--kt-faint)' }}>Sin notificaciones por ahora.</div>
                  )}
                </div>
              </div>
            </div>
          </header>

          <div style={{ display: 'flex', position: 'relative' }}>
            <div className="kt-main-pad" style={{ flex:1, padding:'24px', display:'flex', flexDirection:'column', gap:'24px' }}>
            
            {/* LEFT CONFIGURATION PANEL */}
            <section style={{ width:'100%', flex:'none', display:'flex', flexDirection:'column', background:'var(--kt-panel-bg)', backdropFilter:'blur(12px)', border:'1px solid var(--kt-panel-border)', borderRadius:'18px', overflow:'visible', boxShadow:'var(--kt-shadow-panel)', transition:'all .3s ease', zIndex: 50 }}>
              <div style={{ padding:'12px 18px', borderBottom: configCollapsed ? 'none' : '1px solid var(--kt-border-soft)', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'12px' }}>
                <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                  <button onClick={() => setConfigCollapsed(!configCollapsed)} aria-label="Colapsar panel" style={{ background:'var(--kt-chip-bg)', border:'1px solid var(--kt-chip-border)', borderRadius:'8px', width:'32px', height:'32px', cursor:'pointer', color:'var(--kt-muted)', display:'grid', placeItems:'center' }}>
                    <ChevronLeft size={18} style={{ transform: configCollapsed ? 'rotate(-90deg)' : 'rotate(90deg)', transition: 'transform 0.3s ease' }} />
                  </button>
                  <div>
                    <h2 style={{ fontFamily:"'Inter'", fontWeight:600, fontSize:'16px', letterSpacing:'-.5px', color:'var(--kt-heading)', margin:0, display:'flex', alignItems:'center', gap:'8px' }}>
                      <Settings size={18} style={{ color:'var(--kt-muted)' }}/> Configuración
                    </h2>
                    <div style={{ fontFamily:"'Manrope'", fontWeight:500, fontSize:'11.5px', color:'var(--kt-muted)', marginTop:'2px' }}>
                      {materiaSeleccionada?.nombre ? `${materiaSeleccionada.nombre} • ` : ''}{temarioSeleccionado?.titulo || 'Sin temario'} • {piezas.length} piezas • {MODELOS.find(m => m.id === modelo)?.label || 'Básico'}
                    </div>
                  </div>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                  {generatedData && (
                    <button
                      onClick={() => {
                        handleSave();
                        notify('success', 'Contenido guardado', 'El material se guardó en tu Temario.');
                      }}
                      style={{ height:'36px', padding:'0 16px', display:'flex', alignItems:'center', gap:'8px', border:'1px solid #10B981', borderRadius:'9px', background:'rgba(16,185,129,0.1)', color:'#10B981', cursor:'pointer', fontFamily:"'Manrope'", fontWeight:700, fontSize:'13px', transition:'all .2s' }}
                    >
                      <CheckCircle2 size={15} /> Guardar
                    </button>
                  )}
                  <button
                    className="kt-primary"
                    onClick={() => {
                      const hasExistingContent = piezas.some(id => pieceHasContent(id));
                      if (hasExistingContent) {
                        setShowGenConfirmModal(true);
                      } else {
                        triggerGeneration();
                      }
                    }}
                    disabled={!canGenerate}
                    style={{ height:'36px', padding:'0 18px', display:'flex', alignItems:'center', justifyContent:'center', gap:'8px', border:'none', borderRadius:'9px', background: !canGenerate ? 'var(--kt-chip-border)' : 'linear-gradient(150deg,#10B981,#059669)', color: !canGenerate ? 'var(--kt-muted)' : '#fff', cursor: !canGenerate ? 'not-allowed' : 'pointer', fontFamily:"'Manrope'", fontWeight:700, fontSize:'13px', boxShadow: !canGenerate ? 'none' : '0 6px 16px -6px rgba(16,185,129,.7)', transition:'all .2s' }}
                  >
                    {isGenerating ? <div style={{width:'14px',height:'14px',border:'2px solid rgba(255,255,255,.3)',borderTopColor:'#fff',borderRadius:'50%',animation:'spin 1s linear infinite'}} /> : <Wand2 size={15} />}
                    {isGenerating ? 'Procesando...' : (generatedData ? 'Regenerar' : 'Generar')}
                  </button>
                </div>
              </div>

              {!configCollapsed && (
              <div className="kt-gen-config-grid" style={{ padding:'16px 20px', display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'20px', alignItems:'start' }}>

                {/* 1. Materia + Temario selectors */}
                <div style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
                  <div>
                    <label style={{ display:'flex', alignItems:'center', gap:'6px', fontFamily:"'Inter'", fontWeight:600, fontSize:'12px', color:'var(--kt-text)', marginBottom:'7px' }}>
                      <FolderDot size={13} style={{ color:'var(--kt-muted)' }} /> Materia
                    </label>
                    <CustomSelect
                      value={materiaId}
                      onChange={setMateriaId}
                      placeholder="— Selecciona una materia —"
                      options={asignaturas.map(a => ({ value: a.id, label: a.nombre }))}
                    />
                    {!asignaturasLoading && asignaturas.length === 0 && (
                      <p style={{ fontFamily:"'Manrope'", fontWeight:500, fontSize:'11px', color:'var(--kt-muted)', margin:'4px 2px 0' }}>
                        No tienes materias. <Link to="/dashboard" style={{ color:'#10B981', fontWeight:700 }}>Crea una primero</Link>.
                      </p>
                    )}
                  </div>

                  <div style={{ opacity: materiaId ? 1 : 0.5, pointerEvents: materiaId ? 'auto' : 'none', transition:'opacity .2s ease' }}>
                    <label style={{ display:'flex', alignItems:'center', gap:'6px', fontFamily:"'Inter'", fontWeight:600, fontSize:'12px', color:'var(--kt-text)', marginBottom:'7px' }}>
                      <BookOpen size={13} style={{ color:'var(--kt-muted)' }} /> Temario
                    </label>
                    <CustomSelect
                      value={temarioId}
                      onChange={setTemarioId}
                      placeholder={materiaId ? '— Selecciona un temario —' : '— Primero selecciona una materia —'}
                      options={courses.map(c => ({ value: c.id, label: c.titulo }))}
                    />
                    {temarioSeleccionado && (
                      <p style={{ fontFamily:"'Manrope'", fontWeight:500, fontSize:'11px', color:'var(--kt-muted)', margin:'4px 2px 0' }}>
                        {temarioSeleccionado.gradoAcademico ? temarioSeleccionado.gradoAcademico.charAt(0).toUpperCase() + temarioSeleccionado.gradoAcademico.slice(1) : 'Sin grado'} · {loadingContenido ? 'Consultando material...' : (contenidoExistente ? 'Con material' : 'Sin material')}
                      </p>
                    )}
                    {materiaId && !temariosLoading && courses.length === 0 && (
                      <p style={{ fontFamily:"'Manrope'", fontWeight:500, fontSize:'11px', color:'var(--kt-muted)', margin:'4px 2px 0' }}>
                        Esta materia no tiene temarios. <Link to="/dashboard" style={{ color:'#10B981', fontWeight:700 }}>Crea uno primero</Link>.
                      </p>
                    )}
                  </div>
                </div>

                {/* 2. Piece checkboxes with integrated count selectors */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '7px' }}>
                    <label style={{ display:'flex', alignItems:'center', gap:'6px', fontFamily:"'Inter'", fontWeight:600, fontSize:'12px', color:'var(--kt-text)' }}>
                      <CheckSquare size={13} style={{ color:'var(--kt-muted)' }} /> Material a generar
                    </label>
                    {piezas.length === PIEZAS.length ? (
                      <span 
                        onClick={deselectAllPiezas} 
                        style={{ fontFamily: "'Manrope'", fontWeight: 700, fontSize: '11px', color: 'var(--kt-muted)', cursor: 'pointer', transition: 'color 0.2s' }}
                      >
                        Desmarcar todo
                      </span>
                    ) : (
                      <span 
                        onClick={selectAllPiezas} 
                        style={{ fontFamily: "'Manrope'", fontWeight: 700, fontSize: '11px', color: '#10B981', cursor: 'pointer', transition: 'color 0.2s' }}
                      >
                        Seleccionar todo
                      </span>
                    )}
                  </div>
                  <div style={{ display:'flex', flexDirection:'column', gap:'6px' }}>
                    {PIEZAS.map(pieza => {
                      const selected = piezas.includes(pieza.id);
                      const exists = piezaYaGenerada(pieza.id);
                      const theoryExists = piezaYaGenerada('teoria');
                      const theorySelected = piezas.includes('teoria');
                      const isLockedByPlan = pieza.id === 'diapositivas' && !puedeGenerarDiapositivas;
                      const isDisabled = isLockedByPlan || ((pieza.id === 'evaluacion' || pieza.id === 'diapositivas') && !theoryExists && !theorySelected);

                      return (
                        <div
                          key={pieza.id}
                          onClick={() => {
                            if (isLockedByPlan) { setPlanModalAbierto(true); return; }
                            if (temarioId && !isDisabled) togglePieza(pieza.id);
                          }}
                          style={{
                            border:`1px solid ${selected ? '#10B981' : 'var(--kt-input-border)'}`,
                            background: selected ? 'rgba(16,185,129,0.05)' : (isDisabled ? 'var(--kt-border-soft)' : 'var(--kt-input-bg)'),
                            borderRadius:'10px',
                            padding:'8px 12px',
                            cursor: isLockedByPlan ? 'pointer' : ((temarioId && !isDisabled) ? 'pointer' : 'not-allowed'),
                            opacity: (temarioId && !isDisabled) ? 1 : 0.55,
                            transition:'all .2s ease'
                          }}
                        >
                          <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                            <div style={{
                              width:'16px', height:'16px', borderRadius:'4px', 
                              border: `1.5px solid ${selected ? '#10B981' : 'var(--kt-muted)'}`,
                              background: selected ? '#10B981' : 'transparent',
                              display:'flex', alignItems:'center', justifyContent:'center',
                              transition: 'all 0.2s ease', flexShrink: 0
                            }}>
                              {selected && <CheckSquare size={11} color="#ffffff" style={{ strokeWidth: 3 }} />}
                            </div>
                            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <span style={{ fontFamily:"'Manrope'", fontWeight:600, fontSize:'12.5px', color: selected ? 'var(--kt-heading)' : 'var(--kt-text)', transition: 'color 0.2s ease' }}>{pieza.label}</span>
                              {isLockedByPlan ? (
                                <span style={{ display:'inline-flex', alignItems:'center', gap:'3px', fontFamily:"'Manrope'", fontWeight:700, fontSize:'9.5px', color:'var(--kt-muted)', background:'var(--kt-chip-bg)', border:'1px solid var(--kt-chip-border)', padding:'2px 6px', borderRadius:'6px' }}>
                                  <Lock size={9} /> Pro
                                </span>
                              ) : isDisabled && <span style={{ fontFamily:"'Manrope'", fontSize:'9.5px', color:'#F43F5E' }}>Requiere Teoría</span>}
                              {exists && !isDisabled && (
                                <span style={{ display:'inline-flex', alignItems:'center', gap:'3px', fontFamily:"'Manrope'", fontWeight:700, fontSize:'9.5px', color:'#059669', background:'rgba(16,185,129,.14)', border:'1px solid rgba(16,185,129,.3)', padding:'2px 6px', borderRadius:'6px' }}>
                                  <CheckCircle2 size={10} /> Listo
                                </span>
                              )}
                            </div>
                          </div>

                          {selected && (
                            <div 
                              onClick={(e) => e.stopPropagation()}
                              style={{ 
                                marginTop: '8px', 
                                paddingTop: '6px', 
                                borderTop: '1px solid rgba(16,185,129,0.18)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: '8px'
                              }}
                            >
                              <span style={{ fontFamily: "'Manrope'", fontWeight: 500, fontSize: '11px', color: 'var(--kt-muted)' }}>
                                {pieza.id === 'teoria' && `Párrafos (${limitesModelo.parrafos.min}–${limitesModelo.parrafos.max}):`}
                                {pieza.id === 'evaluacion' && `Preguntas (${limitesModelo.preguntas.min}–${limitesModelo.preguntas.max}):`}
                                {pieza.id === 'diapositivas' && `Diapositivas (${limitesModelo.diapositivas.min}–${limitesModelo.diapositivas.max}):`}
                              </span>
                              {pieza.id === 'teoria' && (
                                <ResponseCountField
                                  value={numeroParrafos}
                                  onChange={setNumeroParrafos}
                                  min={limitesModelo.parrafos.min}
                                  max={limitesModelo.parrafos.max}
                                />
                              )}
                              {pieza.id === 'evaluacion' && (
                                <ResponseCountField
                                  value={numeroPreguntas}
                                  onChange={setNumeroPreguntas}
                                  min={limitesModelo.preguntas.min}
                                  max={limitesModelo.preguntas.max}
                                />
                              )}
                              {pieza.id === 'diapositivas' && (
                                <ResponseCountField
                                  value={numeroDiapositivas}
                                  onChange={setNumeroDiapositivas}
                                  min={limitesModelo.diapositivas.min}
                                  max={limitesModelo.diapositivas.max}
                                />
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Model tier selector */}
                <div>
                  <label style={{ display:'flex', alignItems:'center', gap:'6px', fontFamily:"'Inter'", fontWeight:600, fontSize:'12px', color:'var(--kt-text)', marginBottom:'7px' }}>
                    <Cpu size={13} style={{ color:'var(--kt-muted)' }} /> Modelo de IA
                  </label>
                  <CustomSelect
                    value={modelo}
                    onChange={setModelo}
                    placeholder="— Selecciona modelo —"
                    options={MODELOS.map(m => ({ value: m.id, label: m.label, hint: m.hint, disabled: m.id === 'pro' && !puedeUsarModeloPro }))}
                    onLockedOption={() => setPlanModalAbierto(true)}
                  />
                </div>

                {Object.keys(piezasFallidas).length > 0 && (
                  <div style={{ display:'flex', gap:'10px', padding:'12px 14px', borderRadius:'12px', background:'rgba(244,63,94,.1)', border:'1px solid rgba(244,63,94,.25)' }}>
                    <AlertCircle size={16} style={{ color:'#F43F5E', flex:'none', marginTop:'1px' }} />
                    <div style={{ fontFamily:"'Manrope'", fontWeight:600, fontSize:'11.5px', color:'var(--kt-text)', lineHeight:1.5 }}>
                      <p style={{ margin:0 }}>
                        No se pudo generar <strong>{Object.keys(piezasFallidas).map(id => PIEZAS.find(p => p.id === id)?.label || id).join(', ')}</strong> con el modelo seleccionado.
                        Se conservó el contenido anterior — intenta de nuevo o prueba con otro modelo de IA.
                      </p>
                    </div>
                  </div>
                )}

                {genError && (
                  <div style={{ display:'flex', flexDirection:'column', gap:'10px', padding:'12px 14px', borderRadius:'12px', background:'rgba(244,63,94,.1)', border:'1px solid rgba(244,63,94,.25)' }}>
                    <div style={{ display:'flex', gap:'10px' }}>
                      <AlertCircle size={16} style={{ color:'#F43F5E', flex:'none', marginTop:'1px' }} />
                      <p style={{ fontFamily:"'Manrope'", fontWeight:600, fontSize:'11.5px', color:'var(--kt-text)', margin:0, lineHeight:1.5 }}>{genError}</p>
                    </div>
                    {genErrorEsPlan && (
                      <button
                        type="button"
                        onClick={() => setPlanModalAbierto(true)}
                        style={{ alignSelf:'flex-start', display:'flex', alignItems:'center', gap:'6px', padding:'7px 13px', borderRadius:'9px', border:'none', cursor:'pointer', background:'linear-gradient(120deg,#10B981,#059669)', color:'#fff', fontFamily:"'Manrope'", fontWeight:700, fontSize:'11.5px' }}
                      >
                        <Sparkles size={13} />
                        Mejorar a Pro
                      </button>
                    )}
                  </div>
                )}
              </div>
              )}

              <div style={{ display: 'none' }}>
                <style>{`
                  @keyframes spin { to { transform: rotate(360deg); } }
                  @keyframes ktPulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.2; } }
                  @keyframes ktToastIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                  .kt-scroller::-webkit-scrollbar { width: 8px; height: 8px; }
                  .kt-scroller::-webkit-scrollbar-track { background: transparent; }
                  .kt-scroller::-webkit-scrollbar-thumb { background: var(--kt-border); border-radius: 4px; }
                  .kt-scroller::-webkit-scrollbar-thumb:hover { background: var(--kt-muted); }
                  .kt-mobile-overlay {
          display: none;
        }
        @media(max-width:820px) {
          .kt-mobile-overlay {
            display: block;
            position: absolute;
            inset: 0;
            z-index: 8;
            background: rgba(15, 23, 42, 0.5);
            backdrop-filter: blur(2px);
          }
          [data-root][data-kt-theme="dark"] .kt-mobile-overlay {
            background: rgba(0, 0, 0, 0.7);
          }
        }
      `}</style>
              </div>
            </section>

            {/* RIGHT PREVIEW PANEL */}
            <section style={{ display:'flex', flexDirection:'column', background:'var(--kt-panel-bg)', backdropFilter:'blur(12px)', border:'1px solid var(--kt-panel-border)', borderRadius:'18px', overflow:'visible', boxShadow:'var(--kt-shadow-panel)' }}>
              
              {/* Tabs header */}
              <div style={{ display:'flex', overflowX:'auto', borderBottom:'1px solid var(--kt-border-soft)' }}>
                {[
                  { id: 'teoria', label: 'Teoría Docente', icon: <FileText size={16}/> },
                  { id: 'evaluacion', label: 'Evaluación', icon: <FileQuestion size={16}/> },
                  { id: 'diapositivas', label: 'Diapositivas', icon: <MonitorPlay size={16}/> }
                ].map((tab) => {
                  const enabled = pieceHasContent(tab.id);
                  return (
                    <button
                      key={tab.id}
                      disabled={!enabled}
                      onClick={() => setActiveTab(tab.id)}
                      style={{
                        flex:1, height:'58px', minWidth:'140px', display:'flex', alignItems:'center', justifyContent:'center', gap:'8px',
                        background:'transparent', border:'none', borderBottom: activeTab === tab.id && enabled ? '2px solid #10B981' : '2px solid transparent',
                        color: activeTab === tab.id && enabled ? '#10B981' : (enabled ? 'var(--kt-muted)' : 'var(--kt-faint)'),
                        fontFamily:"'Inter'", fontWeight:600, fontSize:'13.5px',
                        cursor: enabled ? 'pointer' : 'not-allowed',
                        transition:'all .2s'
                      }}
                    >
                      {tab.icon} {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Content Viewer Area */}
              <div style={{ padding:'32px' }}>
                {(isGenerating || !displayData) && (
                  <div style={{ position: 'relative', height:'100%', display:'flex', flexDirection:'column', gap:'20px', pointerEvents:'none' }}>
                    <div style={{ animation: isGenerating ? 'ktPulse 1.5s infinite ease-in-out' : 'none' }}>
                      <div style={{ opacity: 0.35, padding: '24px', background: 'var(--kt-input-bg)', borderRadius: '16px', border: '1px solid var(--kt-border-soft)', marginBottom: '20px' }}>
                         <div style={{ width: '40%', height: '24px', background: 'var(--kt-chip-bg)', borderRadius: '6px', marginBottom: '16px' }} />
                         <div style={{ width: '20%', height: '12px', background: 'var(--kt-chip-bg)', borderRadius: '4px', marginBottom: '24px' }} />
                         <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <div style={{ width: '100%', height: '10px', background: 'var(--kt-chip-bg)', borderRadius: '4px' }} />
                            <div style={{ width: '92%', height: '10px', background: 'var(--kt-chip-bg)', borderRadius: '4px' }} />
                            <div style={{ width: '96%', height: '10px', background: 'var(--kt-chip-bg)', borderRadius: '4px' }} />
                         </div>
                      </div>
                      <div style={{ opacity: 0.15, padding: '24px', background: 'var(--kt-input-bg)', borderRadius: '16px', border: '1px solid var(--kt-border-soft)' }}>
                         <div style={{ width: '30%', height: '20px', background: 'var(--kt-chip-bg)', borderRadius: '6px', marginBottom: '16px' }} />
                         <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <div style={{ width: '100%', height: '10px', background: 'var(--kt-chip-bg)', borderRadius: '4px' }} />
                            <div style={{ width: '85%', height: '10px', background: 'var(--kt-chip-bg)', borderRadius: '4px' }} />
                         </div>
                      </div>
                    </div>
                    
                    {/* Overlay */}
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
                       {isGenerating ? (
                         <>
                           <div style={{ width:'64px', height:'64px', borderRadius:'18px', background:'var(--kt-chip-bg)', border:'1px solid var(--kt-chip-border)', display:'grid', placeItems:'center', color:'#10B981', boxShadow: '0 8px 24px rgba(16,185,129,0.1)' }}>
                             <div style={{ width:'32px', height:'32px', borderRadius:'50%', border:'3px solid transparent', borderTopColor:'#10B981', animation:'spin 1s linear infinite' }}></div>
                           </div>
                           <h4 style={{ fontFamily:"'Inter'", fontWeight:600, fontSize:'20px', color:'var(--kt-heading)', margin:'16px 0 0' }}>Creando contenido con IA...</h4>
                           <p style={{ fontFamily:"'Manrope'", fontWeight:600, fontSize:'12px', color:'#10B981', background:'rgba(16,185,129,.1)', padding:'6px 16px', borderRadius:'20px', display:'inline-block', marginTop:'12px', textTransform:'uppercase', letterSpacing:'1px' }}>{generationStep}</p>
                         </>
                       ) : (
                         <>
                           <div style={{ width:'64px', height:'64px', borderRadius:'18px', background:'var(--kt-chip-bg)', border:'1px solid var(--kt-chip-border)', display:'grid', placeItems:'center', color:'var(--kt-muted)', opacity: 0.8, boxShadow: '0 8px 24px rgba(15,23,42,0.05)' }}>
                             <Wand2 size={32} />
                           </div>
                           <h4 style={{ fontFamily:"'Inter'", fontWeight:600, fontSize:'18px', color:'var(--kt-heading)', margin:'16px 0 0', opacity: 0.9 }}>Vista previa de contenido</h4>
                           <p style={{ fontFamily:"'Manrope'", fontWeight:500, fontSize:'14px', color:'var(--kt-muted)', maxWidth:'320px', margin:'8px auto 0', textAlign: 'center', opacity: 0.85 }}>
                             {temarioId ? 'Configura las opciones arriba y presiona Generar para comenzar.' : 'Selecciona un temario para comenzar.'}
                           </p>
                         </>
                       )}
                    </div>
                  </div>
                )}

                {!isGenerating && displayData && !pieceHasContent(activeTab) && (
                  <div style={{ height:'100%', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'16px', textAlign:'center', opacity:0.6 }}>
                    <div style={{ width:'64px', height:'64px', borderRadius:'18px', background:'var(--kt-chip-bg)', border:'1px solid var(--kt-chip-border)', display:'grid', placeItems:'center', color:'var(--kt-muted)' }}>
                      <FileQuestion size={32} />
                    </div>
                    <div>
                      <h4 style={{ fontFamily:"'Inter'", fontWeight:600, fontSize:'18px', color:'var(--kt-heading)', margin:0 }}>Pieza no generada</h4>
                      <p style={{ fontFamily:"'Manrope'", fontWeight:500, fontSize:'14px', color:'var(--kt-muted)', maxWidth:'320px', margin:'8px auto 0' }}>Márcala en el panel izquierdo y genera para verla aquí.</p>
                    </div>
                  </div>
                )}

                {!isGenerating && displayData && pieceHasContent(activeTab) && (
                  <div style={{ animation:'ktToastIn .5s cubic-bezier(.34,1.56,.64,1)' }}>
                    
                    {/* 1. Teoría */}
                    {activeTab === 'teoria' && (
                      <div style={{ display:'flex', flexDirection:'column', gap:'20px' }}>
                        <div style={{ display:'flex', justifyContent:'flex-end' }}>
                          <ExportDropdown
                            options={opcionesDePieza('teoria', { puedeExportarAvanzado })}
                            loadingOptionId={formatoEnCurso('teoria')}
                            onSelect={(opt) => handleExport('teoria', opt)}
                          />
                        </div>
                        <div style={{ background:'var(--kt-bg1)', border:'1px solid var(--kt-border)', borderRadius:'16px', padding:'40px', boxShadow:'var(--kt-shadow-panel)' }}>
                          <h1 style={{ fontFamily:"'Inter'", fontWeight:700, fontSize:'28px', color:'var(--kt-heading)', margin:'0 0 8px' }}>{temarioSeleccionado?.titulo || 'Módulo Teórico'}</h1>
                          <p style={{ fontFamily:"'Manrope'", fontWeight:700, fontSize:'14px', color:'#10B981', margin:'0 0 30px' }}>{temarioSeleccionado?.asignatura || 'Material Académico'}</p>
                          <div className="markdown-body">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                              {displayData.teoria || ''}
                            </ReactMarkdown>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 2. Evaluacion */}
                    {activeTab === 'evaluacion' && (
                      <div style={{ display:'flex', flexDirection:'column', gap:'24px' }}>
                        <div style={{ display:'flex', justifyContent:'flex-end' }}>
                          <ExportDropdown
                            options={opcionesDePieza('evaluacion', { puedeExportarAvanzado })}
                            loadingOptionId={formatoEnCurso('evaluacion')}
                            onSelect={(opt) => handleExport('evaluacion', opt)}
                          />
                        </div>
                        
                        <div style={{ display:'flex', flexDirection:'column', gap:'20px' }}>
                          {displayData.evaluacion.map((q, qIndex) => {
                            const isCorrect = checkedAnswers[qIndex] === q.opcionCorrectaIndex;
                            const isAnswered = checkedAnswers[qIndex] !== undefined;

                            return (
                              <div key={qIndex} style={{ background:'var(--kt-bg1)', border:'1px solid var(--kt-border)', borderRadius:'16px', padding:'28px', boxShadow:'var(--kt-shadow-panel)', position:'relative' }}>
                                <span style={{ fontFamily:"'Manrope'", fontWeight:800, fontSize:'10px', letterSpacing:'1px', textTransform:'uppercase', color:'#10B981', background:'rgba(16,185,129,.1)', padding:'4px 10px', borderRadius:'8px' }}>Pregunta #{qIndex + 1}</span>
                                <h4 style={{ fontFamily:"'Inter'", fontWeight:600, fontSize:'17px', color:'var(--kt-heading)', margin:'14px 0 20px', lineHeight:'1.4' }}>{q.pregunta}</h4>
                                
                                <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
                                  {q.opciones.map((opt, optIndex) => {
                                    const isSelected = checkedAnswers[qIndex] === optIndex;
                                    return (
                                      <button
                                        key={optIndex}
                                        onClick={() => setCheckedAnswers({...checkedAnswers, [qIndex]: optIndex})}
                                        style={{
                                          width:'100%', textAlign:'left', padding:'16px 20px', borderRadius:'12px', cursor: 'pointer',
                                          background: isSelected ? 'rgba(16,185,129,.1)' : 'var(--kt-bg2)',
                                          border: isSelected ? '2px solid #10B981' : '2px solid transparent',
                                          color: isSelected ? '#10B981' : (isAnswered ? 'var(--kt-muted)' : 'var(--kt-text)'),
                                          fontFamily:"'Manrope'", fontWeight:600, fontSize:'14px', transition:'all .2s',
                                          display:'flex', alignItems:'center', gap:'14px'
                                        }}
                                      >
                                        <span style={{ width:'26px', height:'26px', borderRadius:'50%', display:'grid', placeItems:'center', fontSize:'12px', fontWeight:800, border: isSelected ? 'none' : '2px solid var(--kt-chip-border)', background: isSelected ? '#10B981' : 'transparent', color: isSelected ? '#fff' : 'inherit' }}>
                                          {String.fromCharCode(65 + optIndex)}
                                        </span>
                                        {opt}
                                      </button>
                                    );
                                  })}
                                </div>

                                {isAnswered && (
                                  <div style={{ marginTop:'20px', padding:'20px', borderRadius:'14px', background: isCorrect ? 'rgba(16,185,129,.1)' : 'rgba(244,63,94,.1)', border: isCorrect ? '1px solid rgba(16,185,129,.2)' : '1px solid rgba(244,63,94,.2)', display:'flex', gap:'14px' }}>
                                    <span style={{ color: isCorrect ? '#10B981' : '#F43F5E', flex:'none', marginTop:'2px' }}>
                                      {isCorrect ? <CheckCircle2 size={22} /> : <AlertCircle size={22} />}
                                    </span>
                                    <div>
                                      <h5 style={{ fontFamily:"'Manrope'", fontWeight:800, fontSize:'13px', textTransform:'uppercase', letterSpacing:'1px', color: isCorrect ? '#10B981' : '#F43F5E', margin:'0 0 6px' }}>{isCorrect ? 'Correcto' : 'Incorrecto'}</h5>
                                      <p style={{ fontFamily:"'Manrope'", fontWeight:500, fontSize:'13.5px', color:'var(--kt-text)', margin:0, lineHeight:'1.5' }}>{q.explicacion}</p>
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* 4. Diapositivas */}
                    {activeTab === 'diapositivas' && (() => {
                      const slides = displayData.diapositivas;
                      return (
                      <div style={{ display:'flex', flexDirection:'column', gap:'24px', maxWidth:'1040px', margin:'0 auto', width:'100%' }}>
                        {/* Slide Exports */}
                        <div style={{ display:'flex', justifyContent:'flex-end' }}>
                          <ExportDropdown
                            options={opcionesDePieza('diapositivas')}
                            loadingOptionId={formatoEnCurso('diapositivas')}
                            onSelect={(opt) => handleExport('diapositivas', opt)}
                          />
                        </div>

                        <div style={{ background:'var(--kt-panel-bg)',border:'1px solid var(--kt-panel-border)',borderRadius:'18px',boxShadow:'var(--kt-shadow-panel)',padding:'22px',backdropFilter:'blur(12px)'}}>
                          <div style={{position:'relative',borderRadius:'14px',overflow:'hidden',background:'var(--kt-bg1)',aspectRatio:'16/9',boxShadow:'0 20px 50px -24px rgba(0,0,0,.6)', border:'1px solid var(--kt-border)'}}>
                            <div style={{display:'flex',height:'100%',transform:`translateX(-${currentSlideIndex * 100}%)`,transition:'transform .45s cubic-bezier(.4,0,.2,1)'}}>
                              {slides.map((slideItem, idx) => {
                                const colorTema = SUBJECT_COLORS[idx % SUBJECT_COLORS.length];
                                const colorOscuro = darkenHex(colorTema);
                                const isDark = theme === 'dark';
                                const bgCover = isDark ? '#0F172A' : '#FFFFFF';
                                const bgSidebar = isDark ? `linear-gradient(180deg, ${colorOscuro} 0%, #0F172A 100%)` : `linear-gradient(180deg, ${colorTema} 0%, ${colorOscuro} 100%)`;
                                const textColorCover = isDark ? '#FFFFFF' : '#0F172A';
                                const textColorAccent = colorTema;
                                const contentBg = isDark ? 'var(--kt-card-bg)' : '#FFFFFF';

                                return (
                                <div key={idx} style={{flex:'none',width:'100%',height:'100%',position:'relative',display:'flex',background: idx === 0 ? bgCover : contentBg, overflow:'hidden', fontFamily:'sans-serif'}}>
                                  {idx === 0 ? (
                                    <div style={{flex:1,display:'flex',flexDirection:'column',justifyContent:'center',padding:'8% 10%', position:'relative'}}>
                                      <div style={{width:'80px',height:'6px',background:colorTema,borderRadius:'3px',marginBottom:'24px'}}></div>
                                      <div style={{fontWeight:800,fontSize:'15px',letterSpacing:'3px',color:textColorAccent,textTransform:'uppercase',marginBottom:'16px'}}>{temarioSeleccionado?.asignatura || 'Asignatura'}</div>
                                      <h2 style={{fontWeight:700,fontSize:'48px',letterSpacing:'-1.5px',lineHeight:1.1,color:textColorCover,margin:'0 0 24px',maxWidth:'90%'}}>{temarioSeleccionado?.titulo || 'Temario'}</h2>
                                      {slideItem.titulo && slideItem.titulo !== temarioSeleccionado?.titulo && (
                                        <h3 style={{fontWeight:600,fontSize:'24px',letterSpacing:'-.5px',color:isDark ? '#94A3B8' : '#475569',margin:0,maxWidth:'85%'}}>{slideItem.titulo}</h3>
                                      )}
                                    </div>
                                  ) : (
                                    <>
                                      <div style={{width:'32%',background:bgSidebar,display:'flex',flexDirection:'column',padding:'6% 4%',position:'relative'}}>
                                        <div style={{fontWeight:800,fontSize:'42px',color:isDark ? colorTema : '#FFFFFF',lineHeight:1,marginBottom:'16px'}}>{String(idx + 1).padStart(2, '0')}</div>
                                        <div style={{fontWeight:700,fontSize:'12px',letterSpacing:'1.5px',color:'#FFFFFF',textTransform:'uppercase',marginBottom:'12px'}}>{temarioSeleccionado?.asignatura || 'Asignatura'}</div>
                                        <div style={{fontWeight:600,fontSize:'14px',color:isDark ? '#94A3B8' : 'rgba(255,255,255,0.8)',lineHeight:1.5}}>{temarioSeleccionado?.titulo || 'Temario'}</div>
                                      </div>
                                      <div style={{flex:1,display:'flex',flexDirection:'column',padding:'6% 6% 6% 5%',position:'relative'}}>
                                        <h3 style={{fontWeight:700,fontSize:'34px',letterSpacing:'-1px',color:'var(--kt-heading)',margin:'0 0 32px',lineHeight:1.2,maxWidth:'95%'}}>{slideItem.titulo}</h3>
                                        <div style={{display:'flex',flexDirection:'column',gap:'20px',marginBottom:'auto'}}>
                                          {slideItem.puntos.map((pt, pIdx) => (
                                            <div key={pIdx} style={{display:'flex',alignItems:'flex-start',gap:'16px',fontWeight:500,fontSize:'17px',color:'var(--kt-text)',lineHeight:1.5}}>
                                              <span style={{color:colorTema,marginTop:'3px',flex:'none'}}><CheckCircle2 size={20} /></span>
                                              <span>{pt}</span>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    </>
                                  )}
                                  <div style={{position:'absolute',bottom:'6px',left:0,right:0,textAlign:'center',pointerEvents:'none'}}>
                                    <span style={{fontWeight:700,fontSize:'10px',color:isDark ? '#64748B' : '#94A3B8'}}>© Katedra, 2026</span>
                                  </div>
                                </div>
                                );
                              })}
                            </div>

                            {/* Navigation Controls Overlay */}
                            <div style={{position:'absolute', bottom:'20px', left:'50%', transform:'translateX(-50%)', display:'flex', alignItems:'center', gap:'12px', background:'var(--kt-panel-bg)', padding:'6px 12px', borderRadius:'20px', border:'1px solid var(--kt-border)', backdropFilter:'blur(8px)'}}>
                              <button 
                                onClick={() => setCurrentSlideIndex(Math.max(0, currentSlideIndex - 1))}
                                disabled={currentSlideIndex === 0}
                                style={{background:'none', border:'none', color:'var(--kt-text)', cursor: currentSlideIndex === 0 ? 'not-allowed' : 'pointer', opacity: currentSlideIndex === 0 ? 0.5 : 1}}
                              >
                                <ChevronLeft size={20} />
                              </button>
                              <span style={{fontFamily:"'Manrope'",fontWeight:700,fontSize:'12px',color:'var(--kt-heading)'}}>
                                {currentSlideIndex + 1} / {slides.length || 1}
                              </span>
                              <button 
                                onClick={() => setCurrentSlideIndex(Math.min((slides.length || 1) - 1, currentSlideIndex + 1))}
                                disabled={currentSlideIndex === (slides.length || 1) - 1}
                                style={{background:'none', border:'none', color:'var(--kt-text)', cursor: currentSlideIndex === (slides.length || 1) - 1 ? 'not-allowed' : 'pointer', opacity: currentSlideIndex === (slides.length || 1) - 1 ? 0.5 : 1, transform:'rotate(180deg)'}}
                              >
                                <ChevronLeft size={20} />
                              </button>
                            </div>
                          </div>

                          {/* Dots Navigation */}
                          <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'8px',marginTop:'16px'}}>
                            {slides.map((_, idx) => {
                              const colorDot = SUBJECT_COLORS[idx % SUBJECT_COLORS.length];
                              return (
                              <button
                                key={idx}
                                onClick={() => setCurrentSlideIndex(idx)}
                                aria-label={`Lámina ${idx + 1}`}
                                style={{
                                  height:'7px',
                                  width: currentSlideIndex === idx ? '24px' : '7px',
                                  border:'none',
                                  borderRadius:'20px',
                                  background: currentSlideIndex === idx ? colorDot : 'var(--kt-chip-border)',
                                  cursor:'pointer',
                                  padding:0,
                                  transition:'all .3s'
                                }}
                              />
                              );
                            })}
                          </div>

                          {/* Thumbnail Rail */}
                          <div style={{display:'flex',gap:'12px',marginTop:'18px',paddingTop:'18px',borderTop:'1px solid var(--kt-border-soft)',overflowX:'auto'}}>
                            {slides.map((slideItem, idx) => {
                              const isSelected = currentSlideIndex === idx;
                              const accentHex = SUBJECT_COLORS[idx % SUBJECT_COLORS.length];
                              return (
                                <button
                                  key={idx}
                                  onClick={() => setCurrentSlideIndex(idx)}
                                  className="kt-thumb"
                                  style={{
                                    flex:'none',
                                    width:'150px',
                                    textAlign:'left',
                                    border: isSelected ? `2px solid ${accentHex}` : '2px solid var(--kt-panel-border)',
                                    borderRadius:'11px',
                                    overflow:'hidden',
                                    cursor:'pointer',
                                    background:'var(--kt-card-bg)',
                                    padding:0,
                                    transition:'transform .25s,border-color .25s,box-shadow .25s',
                                    outline:'none',
                                    boxShadow: isSelected ? `0 8px 16px -6px ${accentHex}50` : 'none',
                                    transform: isSelected ? 'translateY(-2px)' : 'none'
                                  }}
                                >
                                  <div style={{height:'4px',background: accentHex}}></div>
                                  <div style={{padding:'11px 12px',aspectRatio:'16/9',display:'flex',flexDirection:'column'}}>
                                    <span style={{fontFamily:"'Manrope'",fontWeight:800,fontSize:'8px',letterSpacing:'1px',color:'var(--kt-muted)',textTransform:'uppercase'}}>
                                      {String(idx + 1).padStart(2, '0')}
                                    </span>
                                    <span style={{fontFamily:"'Inter'",fontWeight:600,fontSize:'12px',letterSpacing:'-.2px',color:'var(--kt-heading)',marginTop:'4px',lineHeight:'1.25',display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical',overflow:'hidden'}}>
                                      {slideItem.titulo}
                                    </span>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                      );
                    })()}

                  </div>
                )}
              </div>
            </section>
            </div>


          </div>
        </main>

        {/* GENERATION CONFIRMATION MODAL */}
        <div style={{ position:'fixed', inset:0, zIndex:80, display:'flex', alignItems:'center', justifyContent:'center', padding:'24px', opacity: showGenConfirmModal ? 1 : 0, pointerEvents: showGenConfirmModal ? 'auto' : 'none', transition:'opacity .22s ease' }}>
          <div onClick={() => setShowGenConfirmModal(false)} style={{ position:'absolute', inset:0, background:'var(--kt-modal-backdrop)', backdropFilter:'blur(8px)', WebkitBackdropFilter:'blur(8px)' }}></div>
          <div style={{ position:'relative', width:'100%', maxWidth:'420px', background:'linear-gradient(180deg,var(--kt-modal-bg1),var(--kt-modal-bg2))', border:'1px solid var(--kt-modal-border)', borderRadius:'20px', boxShadow:'var(--kt-shadow-modal)', padding:'28px', transform: showGenConfirmModal ? 'scale(1) translateY(0)' : 'scale(.94) translateY(10px)', transition:'transform .3s cubic-bezier(.34,1.56,.64,1)' }}>
            <div style={{ display:'flex', alignItems:'flex-start', gap:'13px', marginBottom:'18px' }}>
              <div style={{ width:'40px', height:'40px', flex:'none', borderRadius:'11px', background:'linear-gradient(150deg,rgba(245,158,11,.2),rgba(245,158,11,.08))', border:'1px solid rgba(245,158,11,.3)', display:'grid', placeItems:'center', color:'#F59E0B' }}>
                <AlertCircle size={20} />
              </div>
              <div>
                <h3 style={{ fontFamily:"'Inter'", fontWeight:600, fontSize:'19px', letterSpacing:'-.6px', color:'var(--kt-heading)', margin:0 }}>¿Generar nuevo contenido?</h3>
                <p style={{ fontFamily:"'Manrope'", fontWeight:500, fontSize:'13px', color:'var(--kt-muted)', margin:'2px 0 0' }}>Se creará nuevo material para este temario</p>
              </div>
            </div>
            
            <p style={{ fontFamily:"'Manrope'", fontWeight:500, fontSize:'14px', color:'var(--kt-text)', marginBottom:'24px', lineHeight:1.5 }}>
              ¿Estás seguro de que deseas generar contenido? Tu trabajo anterior no guardado no se conservará.
            </p>

            <div style={{ display:'flex', gap:'12px' }}>
              <button onClick={() => setShowGenConfirmModal(false)} style={{ flex:1, height:'44px', border:'1px solid var(--kt-input-border)', background:'none', color:'var(--kt-text)', cursor:'pointer', fontFamily:"'Manrope'", fontWeight:700, fontSize:'13.5px', borderRadius:'11px' }}>Cancelar</button>
              <button onClick={() => {
                setShowGenConfirmModal(false);
                triggerGeneration();
              }} style={{ flex:1, height:'44px', border:'none', borderRadius:'11px', background:'linear-gradient(150deg,#10B981,#059669)', color:'#fff', cursor:'pointer', fontFamily:"'Manrope'", fontWeight:800, fontSize:'13.5px', boxShadow:'0 12px 26px -12px rgba(16,185,129,.7)' }}>Sí, Generar</button>
            </div>
          </div>
        </div>


      <PlanModal
        abierto={planModalAbierto}
        onCerrar={() => setPlanModalAbierto(false)}
        onMejorar={(ciclo) => { setPlanModalAbierto(false); abrirCheckout(ciclo); }}
      />
      </div>

    </>
  );
}

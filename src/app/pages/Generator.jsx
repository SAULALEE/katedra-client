import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useGenerator, PIEZAS, MODELOS } from '../hooks/useGenerator';
import { enviarMensajeAsistente } from '../services/temarioService';
import { useAuth } from '../hooks/useAuth';
import {
  Users as UsersIcon,
  FolderDot,
  Sparkles,
  Wand2,
  ChevronLeft,
  Moon,
  Sun,
  LogOut,
  Bell,
  CheckCircle2,
  AlertCircle,
  MonitorPlay,
  FileText,
  CheckSquare,
  Settings,
  FileQuestion,
  RefreshCw,
  BookOpen,
  Cpu,
  MessageSquare,
  Send,
  X
} from 'lucide-react';

// Reusable SVG Icons for exports

const IconMSForms = () => (
  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="4" width="16" height="16" rx="2" fill="#00828A" fillOpacity="0.1"/>
    <rect x="4" y="4" width="16" height="16" rx="2" stroke="#00828A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 12L11 15L16 9" stroke="#00828A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconZap = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
);

const CustomSelect = ({ value, onChange, options, placeholder }) => {
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
  const isSelectedMax = value === 'max';

  return (
    <div ref={ref} style={{ position: 'relative', width: '100%' }}>
      <button 
        type="button"
        onClick={() => setOpen(!open)}
        style={{
          width:'100%', height:'42px', padding:'8px 36px 8px 14px', 
          border: open ? '1px solid #10B981' : (isSelectedMax ? '1px solid #10B981' : '1px solid var(--kt-input-border)'), 
          borderRadius:'10px', background: isSelectedMax ? 'rgba(16,185,129,0.05)' : 'var(--kt-input-bg)', 
          color: isSelectedMax ? '#10B981' : (selectedOption ? 'var(--kt-heading)' : 'var(--kt-muted)'), 
          fontFamily:"'Inter', sans-serif", fontWeight: isSelectedMax ? 700 : 600, fontSize:'13px', 
          display:'flex', alignItems:'center', justifyContent:'space-between',
          boxShadow: open ? '0 0 0 3px rgba(16, 185, 129, 0.2)' : '0 2px 4px rgba(15, 23, 42, 0.03)',
          cursor:'pointer', transition: 'all 0.2s', textAlign:'left'
        }}
      >
        <div style={{ display:'flex', alignItems:'center', gap:'8px', overflow:'hidden' }}>
          {isSelectedMax && <IconZap />}
          <span style={{ whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>
        <div style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: isSelectedMax ? '#10B981' : 'var(--kt-muted)' }}>
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
            const isOptMax = opt.value === 'max';
            const isSelected = value === opt.value;
            return (
              <div 
                key={opt.value}
                onClick={() => { onChange(opt.value); setOpen(false); }}
                style={{
                  padding:'10px 12px', borderRadius:'8px', cursor:'pointer',
                  background: isSelected 
                    ? 'rgba(16,185,129,.15)' 
                    : (isOptMax ? 'rgba(16,185,129,.03)' : 'transparent'),
                  border: isOptMax ? '1px dashed rgba(16,185,129,.3)' : '1px solid transparent',
                  color: isSelected 
                    ? '#10B981' 
                    : (isOptMax ? '#10B981' : 'var(--kt-text)'),
                  fontFamily:"'Inter'", fontWeight: (isSelected || isOptMax) ? 700 : 500, fontSize:'13px',
                  transition:'background .15s',
                  marginBottom: '4px'
                }}
                onMouseEnter={(e) => { 
                  if (!isSelected) {
                    e.currentTarget.style.background = isOptMax ? 'rgba(16,185,129,.1)' : 'var(--kt-chip-bg)'; 
                  }
                }}
                onMouseLeave={(e) => { 
                  if (!isSelected) {
                    e.currentTarget.style.background = isOptMax ? 'rgba(16,185,129,.03)' : 'transparent'; 
                  }
                }}
              >
                <div style={{ display:'flex', alignItems:'center', gap:'6px' }}>
                  {isOptMax && <IconZap />}
                  <span>{opt.label}</span>
                  {isOptMax && <span style={{ fontSize:'9px', background:'#10B981', color:'#fff', padding:'1px 5px', borderRadius:'10px', transform: 'scale(0.95)', transformOrigin: 'left center', fontWeight:800, letterSpacing:'0.5px' }}>RECOMENDADO</span>}
                </div>
                {opt.hint && <div style={{ fontSize:'11px', color: isOptMax ? '#10B981' : 'var(--kt-muted)', marginTop:'2px', fontWeight:500, opacity: isOptMax ? 0.8 : 1 }}>{opt.hint}</div>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const IconPDF = () => (
  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z" fill="#E11D48" fillOpacity="0.1"/>
    <path d="M14 2V8H20M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z" stroke="#E11D48" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 15H15M9 11H15M9 19H11" stroke="#E11D48" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconPPTX = () => (
  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 4H20C21.1046 4 22 4.89543 22 6V18C22 19.1046 21.1046 20 20 20H4C2.89543 20 2 19.1046 2 18V6C2 4.89543 2.89543 4 4 4Z" fill="#EA580C" fillOpacity="0.1"/>
    <path d="M4 4H20C21.1046 4 22 4.89543 22 6V18C22 19.1046 21.1046 20 20 20H4C2.89543 20 2 19.1046 2 18V6C2 4.89543 2.89543 4 4 4Z" stroke="#EA580C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 10C8 8.89543 8.89543 8 10 8H14C15.1046 8 16 8.89543 16 10C16 11.1046 15.1046 12 14 12H8V10ZM8 12V16" stroke="#EA580C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default function Generator() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [theme, setTheme] = useState('dark');
  const [collapsed, setCollapsed] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [assistantOpen, setAssistantOpen] = useState(true);
  const [chatInput, setChatInput] = useState('');
  const [chatLog, setChatLog] = useState([{ role: 'ai', text: '¡Hola! Soy tu asistente de contenido. Puedo reescribir, resumir o ampliar cualquier sección del temario. ¿Qué te gustaría ajustar?' }]);
  const [configCollapsed, setConfigCollapsed] = useState(false);
  
  const [assistantModel, setAssistantModel] = useState('flash');
  const [assistantLoading, setAssistantLoading] = useState(false);

  const handleSendAssistant = async (textToSend) => {
    const text = textToSend || chatInput;
    if (!text.trim() || assistantLoading) return;

    // Add user message to log
    const updatedLog = [...chatLog, { role: 'user', text }];
    setChatLog(updatedLog);
    if (!textToSend) setChatInput('');
    setAssistantLoading(true);

    try {
      const res = await enviarMensajeAsistente({
        temarioId: temarioId || '',
        action: 'FREE_CHAT', // default to free chat now that custom action dropdown is removed
        message: text,
        modelo: assistantModel
      });

      setChatLog([...updatedLog, { role: 'ai', text: res.content }]);
    } catch (err) {
      setChatLog([...updatedLog, { role: 'ai', text: `Error: ${err.message || 'No se pudo obtener respuesta del asistente.'}` }]);
    } finally {
      setAssistantLoading(false);
    }
  };

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const {
    courses,
    temarioId, setTemarioId,
    temarioSeleccionado,
    piezas, togglePieza,
    modelo, setModelo,
    piezaYaGenerada,
    contenidoExistente,
    loadingContenido,
    isGenerating,
    generationStep,
    generatedData,
    genError,
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
  const hasAnyGeneratedContent = pieceHasContent('teoria') || pieceHasContent('evaluacion') || pieceHasContent('diapositivas');
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

  const timeAgo = (ts) => {
    const s = Math.floor((Date.now() - ts) / 1000);
    if (s < 10) return 'justo ahora';
    if (s < 60) return `hace ${s}s`;
    const m = Math.floor(s / 60);
    if (m < 60) return `hace ${m}min`;
    const h = Math.floor(m / 60);
    if (h < 24) return `hace ${h}h`;
    return `hace ${Math.floor(h / 24)}d`;
  };

  const notify = (kind, title, msg) => {
    setNotifications(prev => [{ id: Date.now() + Math.random(), kind, title, msg, ts: Date.now() }, ...prev].slice(0, 20));
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
  .kt-sidebar{width:256px}
  [data-root][data-kt-collapsed="true"] .kt-sidebar{width:76px}
  [data-root][data-kt-collapsed="true"] .kt-sidelabel{display:none}
  [data-root][data-kt-collapsed="true"] .kt-menutitle{opacity:0}
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
  @media(max-width:760px){
    .kt-tablewrap{overflow-x:auto}
    .kt-table{min-width:680px}
    .kt-headtitle{font-size:22px !important}
    .kt-main-pad{padding:18px !important}
  }
  @media(max-width:560px){
    .kt-sidebar{position:absolute !important;z-index:40;height:100%;box-shadow:0 0 60px rgba(0,0,0,.6)}
  }

  [data-root][data-kt-collapsed="true"] .kt-brand-logo { display: none !important; }
  [data-root][data-kt-collapsed="true"] .kt-brand-header { padding-left: 0 !important; padding-right: 0 !important; justify-content: center !important; }
  [data-root][data-kt-collapsed="true"] .kt-collapsebtn { margin-left: 0 !important; }
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

        {/* SIDEBAR */}
        <aside className="kt-sidebar" style={{ position:'relative', zIndex:10, flex:'none', display:'flex', flexDirection:'column', background:'var(--kt-sidebar-bg)', backdropFilter:'blur(14px)', borderRight:'1px solid var(--kt-border)', transition:'width .32s cubic-bezier(.4,0,.2,1)', overflow:'visible' }}>
          <button className="kt-collapsebtn" onClick={() => setCollapsed(!collapsed)} aria-label="Colapsar" style={{ position:'absolute', right:'-14px', top:'26px', width:'28px', height:'28px', display:'grid', placeItems:'center', border:'1px solid var(--kt-border)', background:'var(--kt-panel-bg)', borderRadius:'50%', color:'var(--kt-muted)', cursor:'pointer', zIndex:50, boxShadow:'0 4px 12px rgba(0,0,0,0.05)' }}>
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
            <Link to="/usuarios" className="kt-nav kt-navrow" style={{ display:'flex', alignItems:'center', gap:'13px', padding:'11px 12px', borderRadius:'11px', textDecoration:'none', background: location.pathname === '/usuarios' ? 'linear-gradient(120deg,rgba(16,185,129,.16),rgba(16,185,129,.06))' : 'transparent', border: location.pathname === '/usuarios' ? '1px solid rgba(16,185,129,.28)' : '1px solid transparent', color: location.pathname === '/usuarios' ? 'var(--kt-heading)' : 'var(--kt-muted)' }}>
              <span style={{ flex:'none', width:'20px', display:'grid', placeItems:'center', color: location.pathname === '/usuarios' ? '#10B981' : 'inherit' }}><UsersIcon size={20} /></span>
              <span className="kt-sidelabel" style={{ fontFamily:"'Manrope'", fontWeight:location.pathname === '/usuarios' ? 700 : 600, fontSize:'14px' }}>Usuarios</span>
            </Link>
            <Link to="/dashboard" className="kt-nav kt-navrow" style={{ display:'flex', alignItems:'center', gap:'13px', padding:'11px 12px', borderRadius:'11px', textDecoration:'none', background: location.pathname === '/dashboard' ? 'linear-gradient(120deg,rgba(16,185,129,.16),rgba(16,185,129,.06))' : 'transparent', border: location.pathname === '/dashboard' ? '1px solid rgba(16,185,129,.28)' : '1px solid transparent', color: location.pathname === '/dashboard' ? 'var(--kt-heading)' : 'var(--kt-muted)' }}>
              <span style={{ flex:'none', width:'20px', display:'grid', placeItems:'center', color: location.pathname === '/dashboard' ? '#10B981' : 'inherit' }}><FolderDot size={20} /></span>
              <span className="kt-sidelabel" style={{ fontFamily:"'Manrope'", fontWeight:location.pathname === '/dashboard' ? 700 : 600, fontSize:'14px' }}>Mis Temarios</span>
            </Link>
            <Link to="/generador" className="kt-nav kt-navrow" style={{ display:'flex', alignItems:'center', gap:'13px', padding:'11px 12px', borderRadius:'11px', textDecoration:'none', background: location.pathname === '/generador' ? 'linear-gradient(120deg,rgba(16,185,129,.16),rgba(16,185,129,.06))' : 'transparent', border: location.pathname === '/generador' ? '1px solid rgba(16,185,129,.28)' : '1px solid transparent', color: location.pathname === '/generador' ? 'var(--kt-heading)' : 'var(--kt-muted)' }}>
              <span style={{ flex:'none', width:'20px', display:'grid', placeItems:'center', color: location.pathname === '/generador' ? '#10B981' : 'inherit' }}><Wand2 size={20} /></span>
              <span className="kt-sidelabel" style={{ fontFamily:"'Manrope'", fontWeight:location.pathname === '/generador' ? 700 : 600, fontSize:'14px' }}>Generador</span>
            </Link>
            <Link to="/contenidos" className="kt-nav kt-navrow" style={{ display:'flex', alignItems:'center', gap:'13px', padding:'11px 12px', borderRadius:'11px', textDecoration:'none', background: location.pathname === '/contenidos' ? 'linear-gradient(120deg,rgba(16,185,129,.16),rgba(16,185,129,.06))' : 'transparent', border: location.pathname === '/contenidos' ? '1px solid rgba(16,185,129,.28)' : '1px solid transparent', color: location.pathname === '/contenidos' ? 'var(--kt-heading)' : 'var(--kt-muted)' }}>
              <span style={{ flex:'none', width:'20px', display:'grid', placeItems:'center', color: location.pathname === '/contenidos' ? '#10B981' : 'inherit' }}><Sparkles size={20} /></span>
              <span className="kt-sidelabel" style={{ fontFamily:"'Manrope'", fontWeight:location.pathname === '/contenidos' ? 700 : 600, fontSize:'14px' }}>Contenidos Generados</span>
            </Link>
          </nav>

          <div style={{ marginTop:'auto', padding:'16px 14px 18px', display:'flex', flexDirection:'column', gap:'12px' }}>
            <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="kt-navrow" style={{ display:'flex', alignItems:'center', gap:'11px', padding:'10px 12px', borderRadius:'12px', background:'var(--kt-chip-bg)', border:'1px solid var(--kt-chip-border)', cursor:'pointer', textAlign:'left', width:'100%' }}>
              {theme === 'dark' ? <Sun size={18} color="#F59E0B" style={{ flex:'none' }} /> : <Moon size={18} style={{ flex:'none', color:'var(--kt-muted)' }} />}
              <span className="kt-sidelabel" style={{ fontFamily:"'Manrope'", fontWeight:600, fontSize:'13px', color:'var(--kt-text)' }}>{theme === 'dark' ? 'Claro' : 'Oscuro'}</span>
              <span className="kt-sidelabel" style={{ marginLeft:'auto', width:'38px', height:'22px', borderRadius:'20px', position:'relative', flex:'none', transition:'background .25s', background: theme === 'dark' ? '#10B981' : '#CBD5E1' }}>
                <span style={{ position:'absolute', top:'2px', left:'2px', width:'18px', height:'18px', borderRadius:'50%', background:'#fff', transition:'transform .25s', transform: theme === 'dark' ? 'translateX(16px)' : 'translateX(0)' }}></span>
              </span>
            </button>
            <div className="kt-navrow" style={{ display:'flex', alignItems:'center', gap:'11px', padding:'6px 8px', overflow:'hidden' }}>
              <div style={{ width:'38px', height:'38px', flex:'none', borderRadius:'11px', background:'linear-gradient(150deg,#38BDF8,#2563EB)', display:'grid', placeItems:'center', fontFamily:"'Manrope'", fontWeight:800, fontSize:'13px', color:'#fff' }}>
                {(user?.nombre || user?.email || 'Docente').charAt(0).toUpperCase()}
              </div>
              <div className="kt-sidelabel" style={{ minWidth:0 }}>
                <div style={{ fontFamily:"'Manrope'", fontWeight:700, fontSize:'13px', color:'var(--kt-heading)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
                  {user?.nombre || user?.email || 'Saul Martinez'}
                </div>
                <div style={{ fontFamily:"'Manrope'", fontWeight:500, fontSize:'11px', color:'var(--kt-muted)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
                  {user?.rol === 'ROLE_ADMIN' ? 'Administrador' : 'Docente'}
                </div>
              </div>
            </div>
            <button onClick={async () => { await logout(); navigate('/login'); }} className="kt-nav kt-navrow" style={{ display:'flex', alignItems:'center', gap:'11px', padding:'11px 12px', borderRadius:'11px', border:'1px solid rgba(244,63,94,.22)', background:'rgba(244,63,94,.08)', color:'#FB7185', cursor:'pointer' }}>
              <span style={{ flex:'none' }}><LogOut size={18} /></span>
              <span className="kt-sidelabel" style={{ fontFamily:"'Manrope'", fontWeight:700, fontSize:'12.5px', letterSpacing:'.3px' }}>CERRAR SESIÓN</span>
            </button>
          </div>
        </aside>

        {/* MAIN */}
        <main style={{ position:'relative', zIndex:5, flex:1, minWidth:0, display:'flex', flexDirection:'column', overflow:'hidden' }}>
          <header className="kt-main-pad" style={{ display:'flex', alignItems:'center', gap:'18px', padding:'26px 32px', borderBottom:'1px solid var(--kt-border-soft)' }}>
            <div style={{ minWidth:0 }}>
              <h1 className="kt-headtitle" style={{ fontFamily:"'Inter'", fontWeight:600, fontSize:'27px', lineHeight:1.15, letterSpacing:'-1.2px', color:'var(--kt-heading)', margin:0 }}>Generador de Contenido</h1>
              <p style={{ fontFamily:"'Manrope'", fontWeight:500, fontSize:'13.5px', color:'var(--kt-muted)', margin:'3px 0 0' }}>Editor de Temarios con Inteligencia Artificial</p>
            </div>
            
            <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:'12px' }}>
              <button 
                onClick={() => setAssistantOpen(!assistantOpen)}
                className="kt-ghostbtn"
                style={{ display:'flex', alignItems:'center', gap:'8px', height:'42px', padding:'0 15px', border:'1px solid var(--kt-chip-border)', background:'var(--kt-chip-bg)', borderRadius:'11px', color:'var(--kt-text)', cursor:'pointer', fontFamily:"'Manrope'", fontWeight:700, fontSize:'13.5px', transition:'all .2s' }}
              >
                <MessageSquare size={17} style={{ color: assistantOpen ? '#10B981' : 'currentColor' }} />
                Asistente IA
              </button>
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
                        <div style={{ fontFamily:"'Manrope'", fontWeight:600, fontSize:'10px', color:'var(--kt-faint)', marginTop:'4px' }}>{timeAgo(n.ts)}</div>
                      </div>
                    </div>
                  )) : (
                    <div style={{ padding:'36px 16px', textAlign:'center', fontFamily:"'Manrope'", fontWeight:600, fontSize:'12.5px', color:'var(--kt-faint)' }}>Sin notificaciones por ahora.</div>
                  )}
                </div>
              </div>
            </div>
          </header>

          <div style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' }}>
            <div className="kt-main-pad" style={{ flex:1, overflow:'hidden', padding:'24px', display:'flex', flexDirection:'column', gap:'24px' }}>
            
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
                      {temarioSeleccionado?.titulo || 'Sin temario'} • {piezas.length} piezas • {MODELOS.find(m => m.id === modelo)?.label || 'Básico'}
                    </div>
                  </div>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                  {generatedData && (
                    <button
                      onClick={() => {
                        handleSave();
                        notify('success', 'Contenido Guardado', 'El material se ha guardado en tu temario.');
                      }}
                      style={{ height:'36px', padding:'0 16px', display:'flex', alignItems:'center', gap:'8px', border:'1px solid #10B981', borderRadius:'9px', background:'rgba(16,185,129,0.1)', color:'#10B981', cursor:'pointer', fontFamily:"'Manrope'", fontWeight:700, fontSize:'13px', transition:'all .2s' }}
                    >
                      <CheckCircle2 size={15} /> Guardar
                    </button>
                  )}
                  <button
                    className="kt-primary"
                    onClick={() => {
                      handleGenerate();
                      notify('success', 'Generación Iniciada', 'La IA está creando el contenido...');
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
              <div style={{ padding:'16px 20px', display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'20px', alignItems:'start' }}>

                {/* 1. Temario selector */}
                <div>
                  <label style={{ display:'flex', alignItems:'center', gap:'6px', fontFamily:"'Inter'", fontWeight:600, fontSize:'12px', color:'var(--kt-text)', marginBottom:'7px' }}>
                    <BookOpen size={13} style={{ color:'var(--kt-muted)' }} /> Temario
                  </label>
                  <CustomSelect 
                    value={temarioId} 
                    onChange={setTemarioId} 
                    placeholder="— Selecciona un temario —"
                    options={courses.map(c => ({ value: c.id, label: c.titulo + ' · ' + c.asignatura }))} 
                  />
                  {temarioSeleccionado && (
                    <p style={{ fontFamily:"'Manrope'", fontWeight:500, fontSize:'11px', color:'var(--kt-muted)', margin:'4px 2px 0' }}>
                      {temarioSeleccionado.gradoAcademico ? temarioSeleccionado.gradoAcademico.charAt(0).toUpperCase() + temarioSeleccionado.gradoAcademico.slice(1) : 'Sin grado'} · {loadingContenido ? 'Consultando material...' : (contenidoExistente ? 'Con material' : 'Sin material')}
                    </p>
                  )}
                  {courses.length === 0 && (
                    <p style={{ fontFamily:"'Manrope'", fontWeight:500, fontSize:'11px', color:'var(--kt-muted)', margin:'4px 2px 0' }}>
                      No tienes temarios. <Link to="/dashboard" style={{ color:'#10B981', fontWeight:700 }}>Crea uno primero</Link>.
                    </p>
                  )}
                </div>

                {/* 2. Piece checkboxes */}
                <div>
                  <label style={{ display:'flex', alignItems:'center', gap:'6px', fontFamily:"'Inter'", fontWeight:600, fontSize:'12px', color:'var(--kt-text)', marginBottom:'7px' }}>
                    <CheckSquare size={13} style={{ color:'var(--kt-muted)' }} /> Material a generar
                  </label>
                  <div style={{ display:'flex', flexDirection:'column', gap:'6px' }}>
                    {PIEZAS.map(pieza => {
                      const selected = piezas.includes(pieza.id);
                      const exists = piezaYaGenerada(pieza.id);
                      const theoryExists = piezaYaGenerada('teoria');
                      const theorySelected = piezas.includes('teoria');
                      const isDisabled = (pieza.id === 'evaluacion' || pieza.id === 'diapositivas') && !theoryExists && !theorySelected;
                      
                      return (
                        <div 
                          key={pieza.id} 
                          onClick={() => { if(temarioId && !isDisabled) togglePieza(pieza.id); }}
                          style={{ 
                            border:`1px solid ${selected ? '#10B981' : 'var(--kt-input-border)'}`, 
                            background: selected ? 'rgba(16,185,129,0.05)' : (isDisabled ? 'var(--kt-border-soft)' : 'var(--kt-input-bg)'), 
                            borderRadius:'10px', 
                            padding:'8px 12px', 
                            cursor: (temarioId && !isDisabled) ? 'pointer' : 'not-allowed', 
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
                              {isDisabled && <span style={{ fontFamily:"'Manrope'", fontSize:'9.5px', color:'#F43F5E' }}>Requiere Teoría</span>}
                              {exists && !isDisabled && (
                                <span style={{ display:'inline-flex', alignItems:'center', gap:'3px', fontFamily:"'Manrope'", fontWeight:700, fontSize:'9.5px', color:'#059669', background:'rgba(16,185,129,.14)', border:'1px solid rgba(16,185,129,.3)', padding:'2px 6px', borderRadius:'6px' }}>
                                  <CheckCircle2 size={10} /> Listo
                                </span>
                              )}
                            </div>
                          </div>
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
                    options={MODELOS.map(m => ({ value: m.id, label: m.label, hint: m.hint }))} 
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
                  <div style={{ display:'flex', gap:'10px', padding:'12px 14px', borderRadius:'12px', background:'rgba(244,63,94,.1)', border:'1px solid rgba(244,63,94,.25)' }}>
                    <AlertCircle size={16} style={{ color:'#F43F5E', flex:'none', marginTop:'1px' }} />
                    <p style={{ fontFamily:"'Manrope'", fontWeight:600, fontSize:'11.5px', color:'var(--kt-text)', margin:0, lineHeight:1.5 }}>{genError}</p>
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
                `}</style>
              </div>
            </section>

            {/* RIGHT PREVIEW PANEL */}
            <section style={{ flex:1, minWidth:0, display:'flex', flexDirection:'column', background:'var(--kt-panel-bg)', backdropFilter:'blur(12px)', border:'1px solid var(--kt-panel-border)', borderRadius:'18px', overflow:'hidden', boxShadow:'var(--kt-shadow-panel)' }}>
              
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
              <div className="kt-scroller" style={{ flex:1, overflowY:'auto', padding:'32px' }}>
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
                          <button onClick={() => notify('success','Exportado','Teoría exportada en PDF.')} style={{ display:'inline-flex', alignItems:'center', gap:'8px', padding:'8px 16px', borderRadius:'10px', border:'1px solid var(--kt-chip-border)', background:'var(--kt-chip-bg)', color:'var(--kt-text)', fontFamily:"'Manrope'", fontWeight:700, fontSize:'12px', cursor:'pointer', transition:'background .2s' }}>
                            <IconPDF /> Exportar PDF
                          </button>
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
                         <div style={{ display:'flex', justifyContent:'flex-end', gap:'10px' }}>
                           <button onClick={() => notify('success','Exportado','Cuestionario exportado a MS Forms.')} style={{ display:'inline-flex', alignItems:'center', gap:'8px', padding:'8px 16px', borderRadius:'10px', border:'1px solid rgba(0,130,138,.2)', background:'rgba(0,130,138,.05)', color:'#00828A', fontFamily:"'Manrope'", fontWeight:700, fontSize:'12px', cursor:'pointer' }}>
                             <IconMSForms /> MS Forms
                           </button>
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
                                        disabled={isAnswered}
                                        style={{
                                          width:'100%', textAlign:'left', padding:'16px 20px', borderRadius:'12px', cursor: isAnswered ? 'not-allowed' : 'pointer',
                                          background: isSelected ? 'rgba(16,185,129,.1)' : (isAnswered ? 'var(--kt-chip-bg)' : 'var(--kt-bg2)'),
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
                      const slideIdx = Math.min(currentSlideIndex, slides.length - 1);
                      const slide = slides[slideIdx];
                      return (
                      <div style={{ display:'flex', flexDirection:'column', gap:'24px' }}>
                         <div style={{ display:'flex', justifyContent:'flex-end', gap:'10px' }}>
                           <button onClick={() => notify('success','Exportado','Diapositivas exportadas a PPTX.')} style={{ display:'inline-flex', alignItems:'center', gap:'8px', padding:'8px 16px', borderRadius:'10px', border:'1px solid rgba(234,88,12,.2)', background:'rgba(234,88,12,.05)', color:'#EA580C', fontFamily:"'Manrope'", fontWeight:700, fontSize:'12px', cursor:'pointer' }}>
                             <IconPPTX /> PPTX
                           </button>
                        </div>

                        <div style={{ background:'var(--kt-bg1)', border:'1px solid var(--kt-border)', borderRadius:'16px', padding:'32px', boxShadow:'var(--kt-shadow-panel)', display:'flex', flexDirection:'column', alignItems:'center' }}>
                          {/* 16:9 Canvas */}
                          <div style={{ width:'100%', maxWidth:'800px', aspectRatio:'16/9', background:'var(--kt-card-bg)', border:'1px solid var(--kt-border)', borderRadius:'12px', boxShadow:'0 20px 50px -20px rgba(0,0,0,.3)', position:'relative', overflow:'hidden', padding:'8% 10%', display:'flex', flexDirection:'column' }}>
                             <div style={{position:'absolute',top:0,left:0,right:0,height:'6px',background:'linear-gradient(90deg,#0284C7,#38BDF8)'}}></div>
                             
                             {slideIdx === 0 ? (
                               <div style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',textAlign:'center',gap:'18px'}}>
                                 <div style={{fontFamily:"'Manrope'",fontWeight:800,fontSize:'12px',letterSpacing:'3px',color:'#38BDF8',textTransform:'uppercase'}}>{temarioSeleccionado?.asignatura || 'Asignatura'}</div>
                                 <h2 style={{fontFamily:"'Inter'",fontWeight:700,fontSize:'48px',letterSpacing:'-1.8px',lineHeight:1.1,color:'var(--kt-heading)',margin:0}}>{temarioSeleccionado?.titulo || 'Temario'}</h2>
                                 {slide.titulo && slide.titulo !== temarioSeleccionado?.titulo && (
                                   <h3 style={{fontFamily:"'Inter'",fontWeight:600,fontSize:'26px',letterSpacing:'-.8px',color:'var(--kt-text)',margin:0}}>{slide.titulo}</h3>
                                 )}
                                 {slide.puntos?.length > 0 && (
                                   <div style={{fontFamily:"'Manrope'",fontWeight:600,fontSize:'15px',color:'var(--kt-muted)'}}>
                                     {slide.puntos.slice(0, 2).join(' · ')}
                                   </div>
                                 )}
                               </div>
                             ) : (
                               <>
                                 <div style={{fontFamily:"'Manrope'",fontWeight:800,fontSize:'12px',letterSpacing:'2px',color:'#38BDF8',textTransform:'uppercase',marginBottom:'auto'}}>{String(slideIdx + 1).padStart(2, '0')} · {temarioSeleccionado?.asignatura || 'Asignatura'}</div>
                                 <div style={{fontFamily:"'Manrope'",fontWeight:700,fontSize:'13px',letterSpacing:'.5px',color:'var(--kt-muted)',marginBottom:'6px'}}>{temarioSeleccionado?.titulo || 'Temario'}</div>
                                 <h3 style={{fontFamily:"'Inter'",fontWeight:600,fontSize:'34px',letterSpacing:'-1.2px',color:'var(--kt-heading)',margin:'0 0 22px'}}>{slide.titulo}</h3>
                                 <div style={{display:'flex',flexDirection:'column',gap:'13px',marginBottom:'auto'}}>
                                   {slide.puntos.map((pt, pIdx) => (
                                     <div key={pIdx} style={{display:'flex',alignItems:'center',gap:'12px',fontFamily:"'Manrope'",fontWeight:600,fontSize:'17px',color:'var(--kt-text)'}}>
                                       <span style={{color:'#38BDF8'}}><CheckCircle2 size={18} /></span>{pt}
                                     </div>
                                   ))}
                                 </div>
                               </>
                             )}

                             <div style={{position:'absolute',bottom:'20px',left:0,right:0,display:'flex',alignItems:'center',justifyContent:'center',gap:'9px',opacity:.45,pointerEvents:'none'}}>
                               <span style={{width:'20px',height:'20px',borderRadius:'5px',background:'#10B981',display:'grid',placeItems:'center',fontFamily:"'Inter'",fontWeight:700,fontSize:'11px',color:'#fff'}}>K</span>
                               <span style={{fontFamily:"'Manrope'",fontWeight:700,fontSize:'10px',letterSpacing:'2.5px',color:'var(--kt-muted)',textTransform:'uppercase'}}>Creado por Katedra</span>
                             </div>
                          </div>

                          {/* Controls */}
                          <div style={{ display:'flex', alignItems:'center', gap:'20px', marginTop:'28px' }}>
                             <button
                               onClick={() => setCurrentSlideIndex(Math.max(0, slideIdx - 1))}
                               disabled={slideIdx === 0}
                               style={{ width:'40px', height:'40px', borderRadius:'50%', border:'1px solid var(--kt-chip-border)', background:'var(--kt-chip-bg)', color:'var(--kt-text)', display:'grid', placeItems:'center', cursor: slideIdx === 0 ? 'not-allowed' : 'pointer', opacity: slideIdx === 0 ? 0.4 : 1, transition:'all .2s' }}
                             >
                               <ChevronLeft size={20} />
                             </button>
                             <div style={{ display:'flex', gap:'6px' }}>
                               {slides.map((_, idx) => (
                                 <button
                                   key={idx}
                                   onClick={() => setCurrentSlideIndex(idx)}
                                   style={{ height:'6px', borderRadius:'10px', border:'none', background: slideIdx === idx ? '#10B981' : 'var(--kt-chip-border)', width: slideIdx === idx ? '24px' : '6px', transition:'all .3s', cursor:'pointer', padding:0 }}
                                 ></button>
                               ))}
                             </div>
                             <button
                               onClick={() => setCurrentSlideIndex(Math.min(slides.length - 1, slideIdx + 1))}
                               disabled={slideIdx === slides.length - 1}
                               style={{ width:'40px', height:'40px', borderRadius:'50%', border:'1px solid var(--kt-chip-border)', background:'var(--kt-chip-bg)', color:'var(--kt-text)', display:'grid', placeItems:'center', cursor: slideIdx === slides.length - 1 ? 'not-allowed' : 'pointer', opacity: slideIdx === slides.length - 1 ? 0.4 : 1, transition:'all .2s' }}
                             >
                               <ChevronLeft size={20} style={{ transform:'rotate(180deg)' }} />
                             </button>
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

        {/* AI ASSISTANT SIDEBAR */}
        <aside 
          style={{
            width: assistantOpen ? '256px' : '0', 
            flex: 'none', 
            display: 'flex', 
            flexDirection: 'column', 
            background: 'var(--kt-panel-bg)', 
            backdropFilter: 'blur(14px)', 
            borderLeft: assistantOpen ? '1px solid var(--kt-border)' : '1px solid transparent',
            transition: 'width .34s cubic-bezier(.4,0,.2,1), border-color .34s',
            position: 'relative', 
            zIndex: 10,
            overflow: 'hidden'
          }}
        >
          <div style={{ width: '256px', height: '100%', display: 'flex', flexDirection: 'column', flex: 'none' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'11px', padding:'18px 18px 16px', borderBottom:'1px solid var(--kt-border-soft)' }}>
              <span style={{ width:'36px', height:'36px', flex:'none', borderRadius:'10px', background:'linear-gradient(150deg,#10B981,#059669)', display:'grid', placeItems:'center', color:'#fff', boxShadow:'0 6px 16px -6px rgba(16,185,129,.6)' }}>
                <Sparkles size={18} />
              </span>
              <div style={{ minWidth:0, marginRight:'auto' }}>
                <div style={{ fontFamily:"'Inter'", fontWeight:600, fontSize:'15px', letterSpacing:'-.3px', color:'var(--kt-heading)' }}>Asistente IA</div>
                <div style={{ display:'flex', alignItems:'center', gap:'6px', fontFamily:"'Manrope'", fontWeight:600, fontSize:'11px', color:'var(--kt-muted)' }}>
                  <span style={{ width:'6px', height:'6px', borderRadius:'50%', background: hasAnyGeneratedContent ? '#10B981' : 'var(--kt-muted)', boxShadow: hasAnyGeneratedContent ? '0 0 8px #10B981' : 'none' }}></span>
                  {hasAnyGeneratedContent ? 'En línea · edita tu contenido' : 'Inactivo · genera contenido primero'}
                </div>
              </div>
              <button onClick={() => setAssistantOpen(false)} aria-label="Cerrar" style={{ flex:'none', width:'30px', height:'30px', display:'grid', placeItems:'center', border:'none', background:'var(--kt-chip-bg)', borderRadius:'9px', color:'var(--kt-muted)', cursor:'pointer' }}>
                <X size={16} />
              </button>
            </div>

            <div style={{ flex:1, overflow:'auto', padding:'18px 16px', display:'flex', flexDirection:'column', gap:'14px', opacity: hasAnyGeneratedContent ? 1 : 0.5 }}>
              {!hasAnyGeneratedContent ? (
                <div style={{ 
                  textAlign: 'center', margin: 'auto 0', padding: '20px', 
                  fontFamily: "'Manrope'", fontWeight: 500, fontSize: '13px', color: 'var(--kt-muted)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px'
                }}>
                  <Sparkles size={24} style={{ color: 'var(--kt-muted)', opacity: 0.6 }} />
                  El asistente se habilitará cuando generes la teoría, ejercicios o diapositivas desde el panel principal.
                </div>
              ) : (
                chatLog.map((msg, i) => (
                  <div key={i} style={{ display:'flex', gap:'10px', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row' }}>
                    {msg.role === 'ai' && (
                      <div style={{ width:'28px', height:'28px', borderRadius:'8px', background:'rgba(16,185,129,.14)', color:'#10B981', display:'grid', placeItems:'center', flex:'none' }}>
                        <Sparkles size={14} />
                      </div>
                    )}
                    <div style={{ 
                      background: msg.role === 'user' ? 'var(--kt-chip-bg)' : 'rgba(16,185,129,.06)', 
                      border: `1px solid ${msg.role === 'user' ? 'var(--kt-chip-border)' : 'rgba(16,185,129,.15)'}`,
                      padding: '12px 14px', borderRadius: '12px',
                      fontFamily:"'Manrope'", fontWeight:500, fontSize:'13px', lineHeight:1.5, color: 'var(--kt-text)',
                      borderTopRightRadius: msg.role === 'user' ? '4px' : '12px',
                      borderTopLeftRadius: msg.role === 'ai' ? '4px' : '12px',
                      maxWidth: '85%'
                    }}>
                      {msg.text}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div style={{ padding:'12px 16px 18px', borderTop:'1px solid var(--kt-border-soft)', display:'flex', flexDirection:'column', gap:'12px' }}>
              {/* MODELOS DE IA */}
              <div>
                <div style={{ fontFamily:"'Manrope'", fontWeight:700, fontSize:'9px', letterSpacing:'.8px', textTransform:'uppercase', color:'var(--kt-label)', marginBottom:'6px' }}>Modelo de IA</div>
                <div style={{ display:'flex', gap:'5px' }}>
                  {[
                    { id: 'flash', label: 'Tutor' },
                    { id: 'pro', label: 'Maestro' },
                    { id: 'max', label: 'Catedrático' }
                  ].map(m => (
                    <button 
                      key={m.id} 
                      onClick={() => setAssistantModel(m.id)} 
                      style={{ 
                        flex: 1, padding:'6px 4px', borderRadius:'8px', fontSize:'11px', fontFamily:"'Manrope'", fontWeight:700,
                        border: `1.5px solid ${assistantModel === m.id ? '#10B981' : 'var(--kt-chip-border)'}`,
                        background: assistantModel === m.id ? 'rgba(16,185,129,.08)' : 'var(--kt-chip-bg)',
                        color: assistantModel === m.id ? '#10B981' : 'var(--kt-text)',
                        cursor: 'pointer', transition: 'all .15s'
                      }}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* TEXT INPUT AREA */}
              <div style={{ 
                display:'flex', alignItems:'flex-end', gap:'9px', padding:'8px 8px 8px 14px', 
                border:'1.5px solid var(--kt-input-border)', 
                background: hasAnyGeneratedContent ? 'var(--kt-input-bg)' : 'var(--kt-panel-bg)', 
                borderRadius:'14px',
                opacity: hasAnyGeneratedContent ? 1 : 0.6
              }}>
                <textarea 
                  rows={1} 
                  value={chatInput} 
                  onChange={e => setChatInput(e.target.value)} 
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey && hasAnyGeneratedContent) {
                      e.preventDefault();
                      handleSendAssistant();
                    }
                  }}
                  placeholder={!hasAnyGeneratedContent ? "Chat inactivo" : assistantLoading ? "Esperando..." : "Pide un cambio a la IA…"} 
                  disabled={assistantLoading || !hasAnyGeneratedContent}
                  style={{ flex:1, border:'none', background:'none', resize:'none', color:'var(--kt-heading)', fontFamily:"'Manrope'", fontWeight:500, fontSize:'13.5px', lineHeight:1.5, maxHeight:'100px', padding:'6px 0', outline:'none' }} 
                />
                <button 
                  onClick={() => handleSendAssistant()}
                  disabled={assistantLoading || !chatInput.trim() || !hasAnyGeneratedContent}
                  style={{ 
                    flex:'none', width:'38px', height:'38px', display:'grid', placeItems:'center', border:'none', borderRadius:'10px', 
                    background:(assistantLoading || !chatInput.trim() || !hasAnyGeneratedContent) ? 'var(--kt-chip-bg)' : 'linear-gradient(150deg,#10B981,#059669)', 
                    color:(assistantLoading || !chatInput.trim() || !hasAnyGeneratedContent) ? 'var(--kt-muted)' : '#fff', 
                    cursor:(assistantLoading || !chatInput.trim() || !hasAnyGeneratedContent) ? 'default' : 'pointer', 
                    boxShadow:(assistantLoading || !chatInput.trim() || !hasAnyGeneratedContent) ? 'none' : '0 8px 18px -8px rgba(16,185,129,.7)' 
                  }}
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}

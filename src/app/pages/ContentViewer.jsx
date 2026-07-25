import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { getContenidoTemario } from '../services/temarioService';
import { useTemarios } from '../hooks/useTemarios';
import { useAuth } from '../hooks/useAuth';
import { useExport } from '../hooks/useExport';
import { SUBJECT_COLORS, darkenHex } from '../utils/asignaturaVisual';
import { isAdmin, formatRoleDisplay } from '../utils/roleUtils';
import { opcionesDePieza } from '../utils/exportOptions';
import { ExportDropdown } from '../components/ExportDropdown';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
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
  FileText,
  FileBox,
  MonitorPlay,
  Copy,
  Heart,
  ChevronDown
} from 'lucide-react';

export default function ContentViewer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { courses } = useTemarios();
  const { logout, user } = useAuth();
  const { exportar, formatoEnCurso } = useExport();
  
  const [theme, setTheme] = useState(() => localStorage.getItem('katedra-theme') || 'light');
  useEffect(() => { localStorage.setItem('katedra-theme', theme); }, [theme]);
  const [collapsed, setCollapsed] = useState(false);
  const [asignaturasOpen, setAsignaturasOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [toasts, setToasts] = useState([]);

  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [contentNotFound, setContentNotFound] = useState(false);
  const [activeTab, setActiveTab] = useState('teoria');
  
  const [tView, setTView] = useState('render');
  const [evalView, setEvalView] = useState('render');

  const [checkedAnswers, setCheckedAnswers] = useState({});
  const [examChecked, setExamChecked] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const course = courses.find(c => c.id === id) || { titulo: 'Temario Generado', asignatura: 'Cargando...' };

  useEffect(() => {
    const linkId = 'katedra-fonts';
    if (!document.getElementById(linkId)) {
      const link = document.createElement('link');
      link.id = linkId;
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Manrope:wght@500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap';
      document.head.appendChild(link);
    }
  }, []);

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      setContentNotFound(false);
      try {
        const data = await getContenidoTemario(id);
        setContent(data);
      } catch (err) {
        if (err.cause?.response?.status === 404 || err.message.includes('404')) {
          setContentNotFound(true);
        } else {
          setContentNotFound(true);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, [id]);

  const getInitial = (name) => {
    if (!name) return 'U';
    const clean = name.replace(/^(prof\.|dra\.|dr\.|ing\.|mtra\.|mtro\.|lic\.)\s*/i, '').trim();
    return (clean[0] || 'U').toUpperCase();
  };

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

  const addToast = (kind, title, msg) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, kind, title, msg }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3200);
  };

  const notify = (kind, title, msg) => {
    addToast(kind, title, msg);
    setNotifications(prev => [{ id: Date.now() + Math.random(), kind, title, msg, ts: Date.now() }, ...prev].slice(0, 20));
  };

  const unreadCount = notifications.length;

  const handleCheckExam = () => {
    if (!content || !content.evaluacion) return;
    setExamChecked(true);
    const score = Object.keys(checkedAnswers).reduce((acc, qIndex) => {
      if (checkedAnswers[qIndex] === content.evaluacion[qIndex].opcionCorrectaIndex) {
        return acc + 1;
      }
      return acc;
    }, 0);
    const total = content.evaluacion.length;
    notify('success', 'Evaluación calificada', `Obtuviste ${score} de ${total} correctas.`);
  };

  const scoreValue = content && content.evaluacion ? Object.keys(checkedAnswers).reduce((acc, qIndex) => {
    if (checkedAnswers[qIndex] === content.evaluacion[qIndex].opcionCorrectaIndex) {
      return acc + 1;
    }
    return acc;
  }, 0) : 0;
  const scoreTotal = content && content.evaluacion ? content.evaluacion.length : 0;

  const hasContent = () => {
    if (!content) return false;
    const hasTeoria = content.teoria && content.teoria.trim().length > 0;
    const hasEval = content.evaluacion && content.evaluacion.length > 0;
    const hasSlides = content.diapositivas && content.diapositivas.length > 0;
    return hasTeoria || hasEval || hasSlides;
  };

  const handleTabClick = (tabId) => {
    if (!hasContent()) {
      setContentNotFound(true);
      return;
    }
    setActiveTab(tabId);
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    notify('success', 'Copiado', 'El contenido fue copiado al portapapeles.');
  };

  const handleExport = async (pieza, opcion) => {
    const resultado = await exportar({ temarioId: id, pieza, formato: opcion.id, theme });
    if (resultado.ok) {
      notify('success', 'Exportación lista', `Se descargó ${resultado.filename}.`);
    } else {
      notify('error', 'No se pudo exportar', resultado.message);
    }
  };

  const getEvaluationMarkdown = () => {
    if (!content || !content.evaluacion) return '';
    return content.evaluacion.map((q, qIndex) => {
      const options = q.opciones.map((opt, optIndex) => {
        const letter = String.fromCharCode(65 + optIndex);
        return `${letter}) ${opt}`;
      }).join('\n');
      return `### Pregunta ${qIndex + 1}\n${q.pregunta}\n\n${options}\n\n*Respuesta Correcta: ${String.fromCharCode(65 + q.opcionCorrectaIndex)}*\n\nExplicación: ${q.explicacion}`;
    }).join('\n\n');
  };

  return (
    <>
      <style>{`[data-root]{margin:0;padding:0}
  *{box-sizing:border-box}
  input,textarea,select,button{outline:none;font-family:inherit}
  ::-webkit-scrollbar{width:10px;height:10px}
  ::-webkit-scrollbar-thumb{background:var(--kt-scrollbar);border-radius:8px;border:2px solid transparent;background-clip:content-box}

  [data-root]{
    --kt-bg1:#FFFFFF;--kt-bg2:#EEF2F7;--kt-bg3:#F8FAFC;--kt-blob-scale:.5;
    --kt-grain-op:.035;--kt-grain-blend:multiply;
    --kt-text:#334155;--kt-heading:#0F172A;--kt-muted:#64748B;--kt-faint:#94A3B8;--kt-label:#94A3B8;
    --kt-border:rgba(15,23,42,.09);--kt-border-soft:rgba(15,23,42,.06);
    --kt-sidebar-bg:rgba(255,255,255,.75);--kt-panel-bg:rgba(255,255,255,.85);--kt-panel-border:rgba(15,23,42,.08);
    --kt-chip-bg:rgba(15,23,42,.045);--kt-chip-border:rgba(15,23,42,.08);--kt-chip-hover:rgba(15,23,42,.08);
    --kt-card-bg:rgba(255,255,255,.9);
    --kt-input-bg:rgba(241,245,249,.7);--kt-input-border:rgba(15,23,42,.12);
    --kt-modal-bg1:rgba(255,255,255,.98);--kt-modal-bg2:rgba(248,250,252,.98);--kt-modal-border:rgba(15,23,42,.09);--kt-modal-backdrop:rgba(15,23,42,.25);
    --kt-scrollbar:rgba(15,23,42,.16);
    --kt-shadow-panel:0 24px 50px -28px rgba(15,23,42,.16);
    --kt-shadow-card:0 14px 30px -18px rgba(15,23,42,.22);
    --kt-shadow-modal:0 30px 70px -25px rgba(15,23,42,.25);
    --kt-code-bg:rgba(16,185,129,.12);--kt-code-fg:#047857;
    --kt-term-bg:rgba(241,245,249,.7);--kt-term-fg:rgba(15,23,42,.8);
  }
  [data-root][data-kt-theme="dark"]{
    --kt-bg1:#0F172A;--kt-bg2:#1E293B;--kt-bg3:#0F172A;--kt-blob-scale:1;
    --kt-grain-op:.09;--kt-grain-blend:overlay;
    --kt-text:#E2E8F0;--kt-heading:#F8FAFC;--kt-muted:#94A3B8;--kt-faint:#64748B;--kt-label:#64748B;
    --kt-border:rgba(148,163,184,.1);--kt-border-soft:rgba(148,163,184,.06);
    --kt-sidebar-bg:rgba(11,17,32,.72);--kt-panel-bg:rgba(17,24,39,.66);--kt-panel-border:rgba(148,163,184,.12);
    --kt-chip-bg:rgba(148,163,184,.08);--kt-chip-border:rgba(148,163,184,.14);--kt-chip-hover:rgba(148,163,184,.16);
    --kt-card-bg:rgba(17,24,39,.72);
    --kt-input-bg:rgba(15,23,42,.6);--kt-input-border:rgba(148,163,184,.14);
    --kt-modal-bg1:rgba(23,31,48,.96);--kt-modal-bg2:rgba(15,23,42,.96);--kt-modal-border:rgba(148,163,184,.16);--kt-modal-backdrop:rgba(2,6,23,.6);
    --kt-scrollbar:rgba(148,163,184,.22);
    --kt-shadow-panel:0 30px 60px -30px rgba(0,0,0,.6);
    --kt-shadow-card:0 20px 40px -22px rgba(0,0,0,.7);
    --kt-shadow-modal:0 40px 90px -30px rgba(0,0,0,.8);
    --kt-code-bg:rgba(52,211,153,.14);--kt-code-fg:#34D399;
    --kt-term-bg:#0B1220;--kt-term-fg:#7DD3A8;
  }

  @keyframes ktBlob{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(30px,-28px) scale(1.14)}}
  @keyframes ktBlob2{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(-26px,24px) scale(1.1)}}
  @keyframes ktGrainShift{0%{transform:translate(0,0)}25%{transform:translate(-4%,3%)}50%{transform:translate(3%,-2%)}75%{transform:translate(-2%,-3%)}100%{transform:translate(0,0)}}
  @keyframes ktToastIn{0%{transform:translateX(130%) scale(.9);opacity:0}55%{transform:translateX(-10px) scale(1.02);opacity:1}75%{transform:translateX(5px) scale(.99)}100%{transform:translateX(0) scale(1)}}
  @keyframes ktToastOut{to{transform:translateX(130%) scale(.92);opacity:0}}
  @keyframes ktBlink{0%,100%{opacity:1}50%{opacity:0}}
  @keyframes ktFadeUp{0%{opacity:0;transform:translateY(8px)}100%{opacity:1;transform:translateY(0)}}

  .kt-nav:hover{background:var(--kt-chip-hover) !important}
  .kt-primary:hover{transform:translateY(-2px);box-shadow:0 16px 34px -12px rgba(16,185,129,.7)}
  .kt-primary:active{transform:translateY(0)}
  .kt-ghostbtn:hover{background:var(--kt-chip-hover) !important;color:var(--kt-heading) !important}
  .kt-iconbtn:hover{background:var(--kt-chip-hover) !important;color:var(--kt-heading) !important}
  .kt-optbtn:hover{border-color:rgba(16,185,129,.4) !important}
  .kt-thumb:hover{transform:translateY(-2px)}

  /* sidebar collapse */
  .kt-sidebar{width:256px; transition: width .32s cubic-bezier(.4,0,.2,1) !important; user-select: none; -webkit-user-select: none;}
  [data-root][data-kt-collapsed="true"] .kt-sidebar{width:76px}
  [data-root][data-kt-collapsed="true"] .kt-sidelabel{display:none}
  [data-root][data-kt-collapsed="true"] .kt-menutitle{opacity:0}
  [data-root][data-kt-collapsed="true"] .kt-navrow{justify-content:center; gap:0 !important; padding-left:0 !important; padding-right:0 !important;}
  [data-root][data-kt-collapsed="true"] .kt-collapse-icon{transform:rotate(180deg)}

  /* theme switch */
  .kt-theme-icon-sun{display:none}.kt-theme-icon-moon{display:inline-flex}
  [data-root][data-kt-theme="dark"] .kt-theme-icon-sun{display:inline-flex}
  [data-root][data-kt-theme="dark"] .kt-theme-icon-moon{display:none}
  .kt-theme-label-light{display:none}.kt-theme-label-dark{display:inline}
  [data-root][data-kt-theme="dark"] .kt-theme-label-light{display:inline}
  [data-root][data-kt-theme="dark"] .kt-theme-label-dark{display:none}
  .kt-theme-track{background:#CBD5E1}
  [data-root][data-kt-theme="dark"] .kt-theme-track{background:#10B981}
  .kt-theme-knob{transform:translateX(0)}
  [data-root][data-kt-theme="dark"] .kt-theme-knob{transform:translateX(16px)}

  /* tabs */
  [data-tabbtn]{color:var(--kt-muted);border-bottom:2px solid transparent;transition:color .2s,border-color .2s}
  [data-tabbtn]:hover{color:var(--kt-heading)}
  [data-root][data-kt-tab="teoria"] [data-tabbtn="teoria"],
  [data-root][data-kt-tab="evaluacion"] [data-tabbtn="evaluacion"],
  [data-root][data-kt-tab="slides"] [data-tabbtn="slides"]{color:var(--kt-heading);border-bottom-color:#10B981}
  [data-tabpanel]{display:none;animation:ktFadeUp .32s ease both}
  [data-root][data-kt-tab="teoria"] [data-tabpanel="teoria"],
  [data-root][data-kt-tab="evaluacion"] [data-tabpanel="evaluacion"],
  [data-root][data-kt-tab="slides"] [data-tabpanel="slides"]{display:block}

  /* segmented toggles */
  [data-seg]{color:var(--kt-muted);background:transparent;transition:all .2s}
  [data-root][data-kt-tview="render"] [data-seg="tv-render"],
  [data-root][data-kt-tview="md"] [data-seg="tv-md"],
  [data-root][data-kt-evalview="render"] [data-seg="evalv-render"],
  [data-root][data-kt-evalview="md"] [data-seg="evalv-md"]{background:var(--kt-card-bg);color:var(--kt-heading);box-shadow:0 2px 6px -2px rgba(15,23,42,.2)}

  /* view swaps */
  .tview-md{display:none}
  [data-root][data-kt-tview="md"] .tview-md{display:block}
  [data-root][data-kt-tview="md"] .tview-render{display:none}

  /* export dropdown */
  
  [data-notif-panel]{opacity:0;pointer-events:none;transform:translateY(-8px) scale(.97);transition:opacity .18s ease,transform .18s ease}
  [data-root][data-kt-notif="true"] [data-notif-panel]{transform:translateY(0) scale(1);opacity:1;pointer-events:auto}
  [data-notif-catcher]{display:none}
  [data-root][data-kt-notif="true"] [data-notif-catcher]{display:block}

  /* exam banner */
  .kt-exam-banner{display:none}
  [data-root][data-kt-examchecked="true"] .kt-exam-banner{display:flex}

  /* markdown styles */
  .markdown-body h1, .markdown-body h2, .markdown-body h3, .markdown-body h4 { font-family:'Inter', sans-serif; font-weight:600; color:var(--kt-heading); margin-bottom:12px; margin-top:24px; }
  .markdown-body p, .markdown-body li { font-family:'Manrope', sans-serif; font-weight:500; font-size:14.5px; lineHeight:1.75; color:var(--kt-text); margin-bottom:14px; }
  .markdown-body ul, .markdown-body ol { margin-left:24px; margin-bottom:16px; }
  .markdown-body code { font-family:'JetBrains Mono', monospace; font-size:12.5px; padding:2px 6px; border-radius:6px; background:var(--kt-code-bg); color:var(--kt-code-fg); }
  .markdown-body pre { background:var(--kt-term-bg); color:var(--kt-term-fg); padding:16px; border-radius:12px; overflow-x:auto; margin-bottom:16px; font-family:'JetBrains Mono', monospace; border:1px solid var(--kt-border); }
  .markdown-body pre code { background:transparent; padding:0; color:inherit; font-size:13px; }

  @media(max-width:1024px){
    .kt-sidebar{width:74px !important}
    .kt-sidelabel{display:none !important}
    .kt-menutitle{opacity:0 !important}
    .kt-navrow{justify-content:center !important; gap:0 !important; padding-left:0 !important; padding-right:0 !important;}
    .kt-collapsebtn{display:none !important}
  }
  @media(max-width:820px){
    .kt-headtitle{font-size:21px !important}
    .kt-main-pad{padding:16px !important}
    .kt-tabscroll{overflow-x:auto}
    .kt-toolbar{flex-wrap:wrap}
  }
  `}</style>
      
      <div data-root data-kt-theme={theme} data-kt-collapsed={collapsed ? "true" : "false"} data-kt-tab={activeTab} data-kt-tview={tView} data-kt-evalview={evalView} data-kt-notif={notifOpen ? "true" : "false"} data-kt-examchecked={examChecked ? "true" : "false"} style={{position:'fixed',inset:0,display:'flex',overflow:'hidden',fontFamily:"'Manrope',sans-serif",background:'radial-gradient(130% 135% at 12% 6%, var(--kt-bg1) 0%, var(--kt-bg2) 40%, var(--kt-bg3) 100%)',color:'var(--kt-text)'}}>
        
        {/* ambient */}
        <div style={{position:'absolute',inset:0,overflow:'hidden',pointerEvents:'none',zIndex:0}}>
          <div style={{position:'absolute',inset:0,opacity:'var(--kt-blob-scale)'}}>
            <div style={{position:'absolute',top:'-160px',left:'120px',width:'520px',height:'520px',borderRadius:'50%',background:'radial-gradient(circle at 50% 50%, rgba(16,185,129,.32), rgba(16,185,129,0) 68%)',filter:'blur(30px)',animation:'ktBlob 16s ease-in-out infinite'}}></div>
            <div style={{position:'absolute',bottom:'-200px',right:'-80px',width:'560px',height:'560px',borderRadius:'50%',background:'radial-gradient(circle at 50% 50%, rgba(245,158,11,.24), rgba(245,158,11,0) 66%)',filter:'blur(34px)',animation:'ktBlob2 20s ease-in-out infinite'}}></div>
            <div style={{position:'absolute',top:'30%',right:'26%',width:'360px',height:'360px',borderRadius:'50%',background:'radial-gradient(circle at 50% 50%, rgba(56,189,248,.18), rgba(56,189,248,0) 70%)',filter:'blur(32px)',animation:'ktBlob 24s ease-in-out infinite'}}></div>
          </div>
          <svg style={{position:'absolute',inset:'-6%',width:'112%',height:'112%',opacity:'var(--kt-grain-op)',mixBlendMode:'var(--kt-grain-blend)',animation:'ktGrainShift 8s steps(6) infinite'}} xmlns="http://www.w3.org/2000/svg">
            <filter id="ktnoise"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch"></feTurbulence><feColorMatrix type="saturate" values="0"></feColorMatrix></filter>
            <rect width="100%" height="100%" filter="url(#ktnoise)"></rect>
          </svg>
        </div>

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

            <div
              onClick={() => navigate('/dashboard?view=asignaturas')}
              className="kt-nav kt-navrow"
              style={{
                display:'flex',
                alignItems:'center',
                gap:'13px',
                padding:'11px 12px',
                borderRadius:'11px',
                cursor:'pointer',
                background: 'transparent',
                border: '1px solid transparent',
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
            <Link to="/contenidos" className="kt-nav kt-navrow" style={{ display:'flex', alignItems:'center', gap:'13px', padding:'11px 12px', borderRadius:'11px', textDecoration:'none', background: location.pathname.startsWith('/contenido') ? 'linear-gradient(120deg,rgba(16,185,129,.16),rgba(16,185,129,.06))' : 'transparent', border: location.pathname.startsWith('/contenido') ? '1px solid rgba(16,185,129,.28)' : '1px solid transparent', color: location.pathname.startsWith('/contenido') ? 'var(--kt-heading)' : 'var(--kt-muted)' }}>
              <span style={{ flex:'none', width:'20px', display:'grid', placeItems:'center', color: location.pathname.startsWith('/contenido') ? '#10B981' : 'inherit' }}><Sparkles size={20} /></span>
              <span className="kt-sidelabel" style={{ fontFamily:"'Manrope'", fontWeight:location.pathname.startsWith('/contenido') ? 700 : 600, fontSize:'14px' }}>Historial de Contenidos</span>
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
              <div style={{ width:'38px', height:'38px', flex:'none', borderRadius:'11px', background:'linear-gradient(150deg,#0284C7,#0284C7)', display:'grid', placeItems:'center', fontFamily:"'Manrope'", fontWeight:800, fontSize:'13px', color:'#fff' }}>
                {getInitial(user?.nombre || user?.email || 'Docente')}
              </div>
              <div className="kt-sidelabel" style={{ minWidth:0 }}>
                <div style={{ fontFamily:"'Manrope'", fontWeight:700, fontSize:'13px', color:'var(--kt-heading)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
                  {user?.nombre || user?.email || 'Saul Martinez'}
                </div>
                <div style={{ fontFamily:"'Manrope'", fontWeight:500, fontSize:'11px', color:'var(--kt-muted)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
                  {formatRoleDisplay(user?.rol)}
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
        <main style={{position:'relative',zIndex:5,flex:1,minWidth:0,display:'flex',flexDirection:'column',overflow:'hidden'}}>
          {/* Header */}
          <header className="kt-main-pad" style={{display:'flex',alignItems:'center',gap:'16px',padding:'22px 32px 0'}}>
            <div style={{display:'flex',alignItems:'center',gap:'14px',minWidth:0}}>
              <div style={{width:'46px',height:'46px',flex:'none',borderRadius:'13px',background:'linear-gradient(150deg,rgba(16,185,129,.16),rgba(16,185,129,.05))',border:'1px solid rgba(16,185,129,.25)',display:'grid',placeItems:'center',color:'#10B981'}}>
                <FileBox size={22} />
              </div>
              <div style={{minWidth:0}}>
                <h1 className="kt-headtitle" style={{fontFamily:"'Inter'",fontWeight:600,fontSize:'24px',lineHeight:1.15,letterSpacing:'-1.1px',color:'var(--kt-heading)',margin:0}}>{course.titulo || 'Contenido Generado'}</h1>
                <p style={{fontFamily:"'Manrope'",fontWeight:600,fontSize:'13px',color:'var(--kt-muted)',margin:'2px 0 0'}}>{course.asignatura || 'Material Académico'} · Contenido generado con IA</p>
              </div>
            </div>
            <div style={{marginLeft:'auto',display:'flex',alignItems:'center',gap:'12px'}}>
              <div style={{position:'relative'}}>
                <button onClick={() => setNotifOpen(!notifOpen)} aria-label="Notificaciones" style={{position:'relative',width:'42px',height:'42px',display:'grid',placeItems:'center',border:'1px solid var(--kt-chip-border)',background:'var(--kt-chip-bg)',borderRadius:'11px',color:'var(--kt-muted)',cursor:'pointer'}}>
                  <Bell size={19} />
                  {unreadCount > 0 && (
                    <span style={{position:'absolute',top:'5px',right:'5px',minWidth:'16px',height:'16px',padding:'0 4px',borderRadius:'8px',background:'#F43F5E',color:'#fff',fontFamily:"'Manrope'",fontWeight:800,fontSize:'9.5px',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 0 0 2px var(--kt-panel-bg)'}}>{unreadCount}</span>
                  )}
                </button>
                <div data-notif-catcher onClick={() => setNotifOpen(false)} style={{position:'fixed',inset:0,zIndex:65}}></div>
                <div data-notif-panel style={{position:'absolute',top:'52px',right:0,width:'320px',maxHeight:'400px',overflow:'auto',background:'var(--kt-modal-bg1)',border:'1px solid var(--kt-modal-border)',borderRadius:'14px',boxShadow:'var(--kt-shadow-modal)',zIndex:70}}>
                  <div style={{display:'flex',alignItems:'center',gap:'8px',padding:'14px 16px',borderBottom:'1px solid var(--kt-border-soft)'}}>
                    <span style={{fontFamily:"'Inter'",fontWeight:600,fontSize:'14px',color:'var(--kt-heading)'}}>Notificaciones</span>
                    {unreadCount > 0 && (
                      <span onClick={() => setNotifications([])} style={{marginLeft:'auto',fontFamily:"'Manrope'",fontWeight:700,fontSize:'11px',color:'#10B981',cursor:'pointer'}}>Marcar leídas</span>
                    )}
                  </div>
                  {notifications.length > 0 ? notifications.map(n => (
                    <div key={n.id} style={{display:'flex',gap:'10px',padding:'12px 16px',borderBottom:'1px solid var(--kt-border-soft)'}}>
                      <span data-notif-icon data-kind={n.kind} style={{flex:'none',width:'30px',height:'30px',borderRadius:'9px',display:'grid',placeItems:'center'}}>
                        {n.kind === 'success' && <CheckCircle2 size={15} />}
                        {n.kind === 'error' && <AlertCircle size={15} />}
                        {n.kind === 'warn' && <AlertCircle size={15} />}
                      </span>
                      <div style={{minWidth:0}}>
                        <div style={{fontFamily:"'Manrope'",fontWeight:700,fontSize:'12.5px',color:'var(--kt-heading)'}}>{n.title}</div>
                        <div style={{fontFamily:"'Manrope'",fontWeight:500,fontSize:'11.5px',color:'var(--kt-muted)',marginTop:'1px'}}>{n.msg}</div>
                        <div style={{fontFamily:"'Manrope'",fontWeight:600,fontSize:'10px',color:'var(--kt-faint)',marginTop:'4px'}}>{timeAgo(n.ts)}</div>
                      </div>
                    </div>
                  )) : (
                    <div style={{padding:'36px 16px',textAlign:'center',fontFamily:"'Manrope'",fontWeight:600,fontSize:'12.5px',color:'var(--kt-faint)'}}>Sin notificaciones por ahora.</div>
                  )}
                </div>
              </div>
              <button onClick={() => navigate(-1)} className="kt-ghostbtn" style={{flex:'none',display:'flex',alignItems:'center',gap:'8px',height:'42px',padding:'0 18px',border:'1px solid var(--kt-chip-border)',background:'var(--kt-chip-bg)',borderRadius:'11px',color:'var(--kt-text)',cursor:'pointer',fontFamily:"'Manrope'",fontWeight:700,fontSize:'13.5px'}}>
                <ChevronLeft size={16} />
                Volver
              </button>
            </div>
          </header>

          {/* Body */}
          <div style={{flex:1,overflow:'hidden',display:'flex',flexDirection:'column'}}>
            {loading ? (
              <div style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:'20px'}}>
                <div style={{width:'48px',height:'48px',borderRadius:'50%',border:'3px solid var(--kt-border)',borderTopColor:'#10B981',animation:'ktPulse 1s infinite linear'}}></div>
                <p style={{fontFamily:"'Manrope'",fontWeight:700,fontSize:'14px',color:'var(--kt-muted)',textTransform:'uppercase',letterSpacing:'1px',animation:'ktBlink 1.5s infinite'}}>Cargando Material...</p>
              </div>
            ) : contentNotFound ? (
              <div style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:'20px',textAlign:'center',padding:'32px'}}>
                <div style={{width:'64px',height:'64px',borderRadius:'20px',background:'rgba(37,99,235,.1)',color:'#0284C7',display:'flex',alignItems:'center',justifyContent:'center',border:'1px solid rgba(37,99,235,.2)'}}>
                  <Wand2 size={32} />
                </div>
                <div style={{display:'flex',flexDirection:'column',gap:'8px',maxWidth:'420px'}}>
                  <p style={{fontFamily:"'Inter'",fontWeight:700,fontSize:'20px',color:'var(--kt-heading)',margin:0}}>NO HAS GENERADO CONTENIDO</p>
                  <p style={{fontFamily:"'Manrope'",fontWeight:500,fontSize:'14px',color:'var(--kt-muted)',margin:0,lineHeight:1.6}}>Este temario todavía no tiene contenido estructurado. Ve al Generador para elegir qué piezas crear (teoría, examen o diapositivas) y con qué modelo de IA.</p>
                </div>
                <button onClick={() => navigate(`/generador?temarioId=${id}`)} style={{padding:'0 24px',height:'48px',borderRadius:'12px',background:'linear-gradient(150deg,#0284C7,#1d4ed8)',color:'#fff',border:'none',cursor:'pointer',fontFamily:"'Manrope'",fontWeight:800,fontSize:'14px',boxShadow:'0 12px 24px -10px rgba(37,99,235,.6)',marginTop:'10px',transition:'transform .2s, box-shadow .2s'}} className="kt-primary">
                  Ir al Generador de Material
                </button>
              </div>
            ) : !content ? (
              <div style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:'16px'}}>
                <div style={{width:'64px',height:'64px',borderRadius:'20px',background:'rgba(244,63,94,.1)',color:'#F43F5E',display:'flex',alignItems:'center',justifyContent:'center'}}>
                  <AlertCircle size={32} />
                </div>
                <p style={{fontFamily:"'Inter'",fontWeight:700,fontSize:'18px',color:'var(--kt-heading)'}}>Material No Encontrado</p>
              </div>
            ) : (
              <div style={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden'}}>
                {/* tabs */}
                <div className="kt-tabscroll kt-main-pad" style={{display:'flex',gap:'26px',padding:'18px 32px 0',borderBottom:'1px solid var(--kt-border-soft)'}}>
                  {[
                    { id: 'teoria', label: 'Teoría Docente', icon: <FileText size={16} color="#10B981" /> },
                    { id: 'evaluacion', label: 'Evaluación', icon: <CheckCircle2 size={16} color="#10B981" /> },
                    { id: 'slides', label: 'Diapositivas', icon: <MonitorPlay size={16} color="#10B981" /> }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      data-tabbtn={tab.id}
                      onClick={() => handleTabClick(tab.id)}
                      style={{display:'flex',alignItems:'center',gap:'8px',padding:'0 2px 14px',border:'none',borderBottom:'2px solid transparent',background:'none',cursor:'pointer',fontFamily:"'Manrope'",fontWeight:700,fontSize:'14px',whiteSpace:'nowrap'}}
                    >
                      {tab.icon}{tab.label}
                    </button>
                  ))}
                </div>

                {/* scroll body */}
                <div className="kt-main-pad" style={{flex:1,overflow:'auto',padding:'24px 32px 70px'}}>
                  <div style={{maxWidth:'1040px',margin:'0 auto'}}>

                    {/* ========================= TEORÍA ========================= */}
                    <div data-tabpanel="teoria">
                      <div className="kt-toolbar" style={{display:'flex',alignItems:'center',gap:'14px',flexWrap:'wrap',padding:'16px 18px',background:'var(--kt-panel-bg)',border:'1px solid var(--kt-panel-border)',borderRadius:'15px',backdropFilter:'blur(12px)',marginBottom:'20px',position:'relative',zIndex:30}}>
                        <div style={{width:'40px',height:'40px',flex:'none',borderRadius:'11px',background:'rgba(16,185,129,.14)',color:'#10B981',display:'grid',placeItems:'center'}}><FileText size={19} /></div>
                        <div style={{minWidth:0,marginRight:'auto'}}>
                          <div style={{fontFamily:"'Inter'",fontWeight:600,fontSize:'15.5px',letterSpacing:'-.4px',color:'var(--kt-heading)'}}>Material Teórico</div>
                          <div style={{fontFamily:"'Manrope'",fontWeight:500,fontSize:'12px',color:'var(--kt-muted)'}}>Lectura de ~4 min</div>
                        </div>
                        {/* render/markdown toggle */}
                        <div style={{display:'flex',gap:'3px',padding:'3px',background:'var(--kt-input-bg)',border:'1px solid var(--kt-input-border)',borderRadius:'10px'}}>
                          <button data-seg={tView === 'render' ? 'tv-render' : ''} onClick={() => setTView('render')} style={{display:'flex',alignItems:'center',gap:'6px',height:'32px',padding:'0 12px',border:'none',borderRadius:'8px',cursor:'pointer',fontFamily:"'Manrope'",fontWeight:700,fontSize:'12px'}}>Vista</button>
                          <button data-seg={tView === 'md' ? 'tv-md' : ''} onClick={() => setTView('md')} style={{display:'flex',alignItems:'center',gap:'6px',height:'32px',padding:'0 12px',border:'none',borderRadius:'8px',cursor:'pointer',fontFamily:"'Manrope'",fontWeight:700,fontSize:'12px'}}>Markdown</button>
                        </div>
                        <button onClick={() => handleCopy(content?.teoria)} className="kt-iconbtn" style={{display:'flex',alignItems:'center',justifyContent:'center',width:'40px',height:'40px',border:'1px solid var(--kt-chip-border)',background:'var(--kt-chip-bg)',borderRadius:'10px',color:'var(--kt-text)',cursor:'pointer'}} title="Copiar Teoría">
                          <Copy size={17} />
                        </button>
                        <ExportDropdown
                          variant="primary"
                          options={opcionesDePieza('teoria', { disponible: Boolean(content?.teoria) })}
                          loadingOptionId={formatoEnCurso('teoria')}
                          onSelect={(opt) => handleExport('teoria', opt)}
                        />
                      </div>

                      <div style={{background:'var(--kt-card-bg)',border:'1px solid var(--kt-panel-border)',borderRadius:'16px',boxShadow:'var(--kt-shadow-panel)',overflow:'hidden'}}>
                        <div style={{height:'4px',background:'linear-gradient(90deg,#10B981,#0284C7)'}}></div>
                        <div style={{padding:'34px 40px 40px'}}>
                          {tView === 'render' ? (
                            <div className="markdown-body">
                              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {content?.teoria || ''}
                              </ReactMarkdown>
                            </div>
                          ) : (
                            <pre style={{margin:0,fontFamily:"'JetBrains Mono',monospace",fontSize:'13px',lineHeight:1.75,color:'var(--kt-text)',whiteSpace:'pre-wrap',wordBreak:'break-word', background:'transparent'}}>
                              {content?.teoria || ''}
                            </pre>
                          )}
                        </div>
                      </div>

                    </div>

                    {/* ========================= EVALUACIÓN ========================= */}
                    <div data-tabpanel="evaluacion">
                      <div className="kt-toolbar" style={{display:'flex',alignItems:'center',gap:'14px',flexWrap:'wrap',padding:'16px 18px',background:'var(--kt-panel-bg)',border:'1px solid var(--kt-panel-border)',borderRadius:'15px',backdropFilter:'blur(12px)',marginBottom:'20px',position:'relative',zIndex:30}}>
                        <div style={{width:'40px',height:'40px',flex:'none',borderRadius:'11px',background:'rgba(16,185,129,.14)',color:'#10B981',display:'grid',placeItems:'center'}}><CheckCircle2 size={19} /></div>
                        <div style={{minWidth:0,marginRight:'auto'}}>
                          <div style={{fontFamily:"'Inter'",fontWeight:600,fontSize:'15.5px',letterSpacing:'-.4px',color:'var(--kt-heading)'}}>Banco de Preguntas</div>
                          <div style={{fontFamily:"'Manrope'",fontWeight:500,fontSize:'12px',color:'var(--kt-muted)'}}>Cuestionario interactivo</div>
                        </div>
                        <div style={{display:'flex',gap:'3px',padding:'3px',background:'var(--kt-input-bg)',border:'1px solid var(--kt-input-border)',borderRadius:'10px'}}>
                          <button data-seg={evalView === 'render' ? 'evalv-render' : ''} onClick={() => setEvalView('render')} style={{display:'flex',alignItems:'center',gap:'6px',height:'32px',padding:'0 12px',border:'none',borderRadius:'8px',cursor:'pointer',fontFamily:"'Manrope'",fontWeight:700,fontSize:'12px'}}>Vista</button>
                          <button data-seg={evalView === 'md' ? 'evalv-md' : ''} onClick={() => setEvalView('md')} style={{display:'flex',alignItems:'center',gap:'6px',height:'32px',padding:'0 12px',border:'none',borderRadius:'8px',cursor:'pointer',fontFamily:"'Manrope'",fontWeight:700,fontSize:'12px'}}>Markdown</button>
                        </div>
                        <button onClick={() => handleCopy(getEvaluationMarkdown())} className="kt-iconbtn" style={{display:'flex',alignItems:'center',justifyContent:'center',width:'40px',height:'40px',border:'1px solid var(--kt-chip-border)',background:'var(--kt-chip-bg)',borderRadius:'10px',color:'var(--kt-text)',cursor:'pointer'}} title="Copiar Evaluación">
                          <Copy size={17} />
                        </button>
                        <ExportDropdown
                          variant="primary"
                          options={opcionesDePieza('evaluacion', { disponible: Boolean(content?.evaluacion?.length) })}
                          loadingOptionId={formatoEnCurso('evaluacion')}
                          onSelect={(opt) => handleExport('evaluacion', opt)}
                        />
                      </div>

                      {evalView === 'render' ? (
                        <>
                          {examChecked && (
                            <div className="kt-exam-banner" style={{alignItems:'center',gap:'14px',padding:'16px 20px',borderRadius:'15px',background:'rgba(16,185,129,.1)',border:'1px solid rgba(16,185,129,.28)',marginBottom:'20px'}}>
                              <div style={{width:'44px',height:'44px',flex:'none',borderRadius:'12px',background:'#10B981',color:'#fff',display:'grid',placeItems:'center'}}><CheckCircle2 size={22} /></div>
                              <div style={{marginRight:'auto'}}>
                                <div style={{fontFamily:"'Inter'",fontWeight:600,fontSize:'16px',letterSpacing:'-.3px',color:'var(--kt-heading)'}}>Resultado: {scoreValue} / {scoreTotal}</div>
                                <div style={{fontFamily:"'Manrope'",fontWeight:500,fontSize:'12.5px',color:'var(--kt-muted)'}}>Has finalizado la evaluación.</div>
                              </div>
                              <button onClick={() => {setExamChecked(false); setCheckedAnswers({});}} className="kt-ghostbtn" style={{display:'flex',alignItems:'center',gap:'7px',height:'38px',padding:'0 15px',border:'1px solid var(--kt-chip-border)',background:'var(--kt-card-bg)',borderRadius:'10px',color:'var(--kt-text)',cursor:'pointer',fontFamily:"'Manrope'",fontWeight:700,fontSize:'13px'}}>
                                Reintentar
                              </button>
                            </div>
                          )}

                          <div style={{display:'flex',flexDirection:'column',gap:'18px'}}>
                            {content?.evaluacion?.map((q, qIndex) => {
                              const isCorrect = checkedAnswers[qIndex] === q.opcionCorrectaIndex;
                              const isAnswered = checkedAnswers[qIndex] !== undefined;

                              return (
                                <div key={qIndex} style={{background:'var(--kt-card-bg)',border:'1px solid var(--kt-panel-border)',borderRadius:'16px',boxShadow:'var(--kt-shadow-card)',padding:'22px 24px'}}>
                                  <span style={{display:'inline-flex',padding:'5px 11px',borderRadius:'8px',background:'rgba(2,132,199,.14)',color:'#0284C7',fontFamily:"'Manrope'",fontWeight:800,fontSize:'10.5px',letterSpacing:'.8px',textTransform:'uppercase',marginBottom:'14px'}}>Pregunta #{qIndex + 1}</span>
                                  <div style={{fontFamily:"'Inter'",fontWeight:600,fontSize:'17px',letterSpacing:'-.3px',color:'var(--kt-heading)',marginBottom:'16px'}}>{q.pregunta}</div>
                                  
                                  <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
                                    {q.opciones.map((opt, optIndex) => {
                                      const isSelected = checkedAnswers[qIndex] === optIndex;
                                      return (
                                        <button
                                          key={optIndex}
                                          onClick={() => !examChecked && setCheckedAnswers({...checkedAnswers, [qIndex]: optIndex})}
                                          disabled={examChecked}
                                          style={{
                                            display:'flex',alignItems:'center',gap:'13px',padding:'13px 15px',
                                            border:'1.5px solid',
                                            borderColor: isSelected ? '#10B981' : 'var(--kt-input-border)',
                                            background: isSelected ? 'rgba(16,185,129,.1)' : 'var(--kt-card-bg)',
                                            borderRadius:'12px',cursor: examChecked ? 'default' : 'pointer',textAlign:'left',transition:'border-color .18s,background .18s',
                                            opacity: examChecked && !isSelected ? 0.6 : 1
                                          }}
                                        >
                                          <span style={{flex:'none',width:'28px',height:'28px',borderRadius:'50%',border:'1px solid',borderColor: isSelected ? '#10B981' : 'var(--kt-chip-border)',background: isSelected ? '#10B981' : 'var(--kt-chip-bg)',color: isSelected ? '#fff' : 'var(--kt-muted)',fontFamily:"'Manrope'",fontWeight:800,fontSize:'12px',display:'grid',placeItems:'center'}}>
                                            {String.fromCharCode(65 + optIndex)}
                                          </span>
                                          <span style={{fontFamily:"'Manrope'",fontWeight:600,fontSize:'14px',color:'var(--kt-heading)'}}>{opt}</span>
                                        </button>
                                      );
                                    })}
                                  </div>

                                  {examChecked && isAnswered && (
                                    <div style={{marginTop:'14px',padding:'15px 16px',borderRadius:'12px',background: isCorrect ? 'rgba(16,185,129,.06)' : 'rgba(244,63,94,.06)',border:'1px solid',borderColor: isCorrect ? 'rgba(16,185,129,.2)' : 'rgba(244,63,94,.2)'}}>
                                      <div style={{fontFamily:"'Manrope'",fontWeight:800,fontSize:'11px',letterSpacing:'.5px',textTransform:'uppercase',color: isCorrect ? '#059669' : '#E11D48',marginBottom:'7px'}}>
                                        {isCorrect ? 'Correcto' : 'Incorrecto'}
                                      </div>
                                      <p style={{fontFamily:"'Manrope'",fontWeight:500,fontSize:'13.5px',lineHeight:1.65,color:'var(--kt-text)',margin:0}}>
                                        {q.explicacion}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>

                          {!examChecked && (
                            <div style={{
                              marginTop: '24px',
                              padding: '20px 24px',
                              background: 'var(--kt-panel-bg)',
                              border: '1px solid var(--kt-panel-border)',
                              borderRadius: '16px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              backdropFilter: 'blur(12px)',
                              boxShadow: 'var(--kt-shadow-panel)'
                            }}>
                              <div style={{display:'flex', flexDirection:'column', gap:'4px'}}>
                                <span style={{fontFamily:"'Inter'", fontWeight:700, fontSize:'15px', color:'var(--kt-heading)'}}>Progreso de Evaluación</span>
                                <span style={{fontFamily:"'Manrope'", fontWeight:600, fontSize:'13px', color:'var(--kt-muted)'}}>
                                  Has respondido {Object.keys(checkedAnswers).length} de {content?.evaluacion?.length || 0} preguntas.
                                </span>
                              </div>
                              <button 
                                onClick={handleCheckExam} 
                                disabled={Object.keys(checkedAnswers).length === 0}
                                style={{
                                  display:'flex',alignItems:'center',gap:'8px',height:'42px',padding:'0 20px',border:'none',borderRadius:'10px',
                                  background: (Object.keys(checkedAnswers).length === 0) ? 'var(--kt-chip-bg)' : 'linear-gradient(150deg,#10B981,#059669)',
                                  color: (Object.keys(checkedAnswers).length === 0) ? 'var(--kt-muted)' : '#fff',
                                  cursor: (Object.keys(checkedAnswers).length === 0) ? 'not-allowed' : 'pointer',
                                  fontFamily:"'Manrope'",fontWeight:800,fontSize:'13.5px',boxShadow:(Object.keys(checkedAnswers).length === 0) ? 'none' : '0 10px 22px -12px rgba(16,185,129,.7)',transition:'all .18s'
                                }}
                              >
                                Revisar Cuestionario
                              </button>
                            </div>
                          )}
                        </>
                      ) : (
                        <div style={{background:'var(--kt-card-bg)',border:'1px solid var(--kt-panel-border)',borderRadius:'16px',boxShadow:'var(--kt-shadow-panel)',overflow:'hidden'}}>
                          <div style={{height:'4px',background:'linear-gradient(90deg,#0284C7,#10B981)'}}></div>
                          <pre style={{margin:0,padding:'28px 32px',fontFamily:"'JetBrains Mono',monospace",fontSize:'13px',lineHeight:1.75,color:'var(--kt-text)',whiteSpace:'pre-wrap',wordBreak:'break-word', background:'transparent'}}>
                            {getEvaluationMarkdown()}
                          </pre>
                        </div>
                      )}
                    </div>

                    {/* ========================= SLIDES ========================= */}
                    <div data-tabpanel="slides">
                      <div className="kt-toolbar" style={{display:'flex',alignItems:'center',gap:'14px',flexWrap:'wrap',padding:'16px 18px',background:'var(--kt-panel-bg)',border:'1px solid var(--kt-panel-border)',borderRadius:'15px',backdropFilter:'blur(12px)',marginBottom:'20px',position:'relative',zIndex:30}}>
                        <div style={{width:'40px',height:'40px',flex:'none',borderRadius:'11px',background:'rgba(16,185,129,.14)',color:'#10B981',display:'grid',placeItems:'center'}}><MonitorPlay size={19} /></div>
                        <div style={{minWidth:0,marginRight:'auto'}}>
                          <div style={{fontFamily:"'Inter'",fontWeight:600,fontSize:'15.5px',letterSpacing:'-.4px',color:'var(--kt-heading)'}}>Presentación Visual</div>
                          <div style={{fontFamily:"'Manrope'",fontWeight:500,fontSize:'12px',color:'var(--kt-muted)'}}>Visor de láminas autogeneradas (16:9)</div>
                        </div>
                        <ExportDropdown
                          variant="primary"
                          options={opcionesDePieza('diapositivas', { disponible: Boolean(content?.diapositivas?.length) })}
                          loadingOptionId={formatoEnCurso('diapositivas')}
                          onSelect={(opt) => handleExport('diapositivas', opt)}
                        />
                      </div>

                      <div style={{background:'var(--kt-panel-bg)',border:'1px solid var(--kt-panel-border)',borderRadius:'18px',boxShadow:'var(--kt-shadow-panel)',padding:'22px',backdropFilter:'blur(12px)'}}>
                        <div style={{position:'relative',borderRadius:'14px',overflow:'hidden',background:'var(--kt-bg1)',aspectRatio:'16/9',boxShadow:'0 20px 50px -24px rgba(0,0,0,.6)', border:'1px solid var(--kt-border)'}}>
                          <div style={{display:'flex',height:'100%',transform:`translateX(-${currentSlideIndex * 100}%)`,transition:'transform .45s cubic-bezier(.4,0,.2,1)'}}>
                            {content?.diapositivas?.map((slide, idx) => {
                              const colorTema = SUBJECT_COLORS[idx % SUBJECT_COLORS.length];
                              const colorOscuro = darkenHex(colorTema);
                              const isDark = theme === 'dark';
                              // Portada usa fondo sólido sutil idéntico al PDF/PPTX
                              const bgCover = isDark ? '#0F172A' : '#FFFFFF';
                              const bgSidebar = isDark ? `linear-gradient(180deg, ${colorOscuro} 0%, #0F172A 100%)` : `linear-gradient(180deg, ${colorTema} 0%, ${colorOscuro} 100%)`;
                              const textColorCover = isDark ? '#FFFFFF' : '#0F172A';
                              const textColorAccent = isDark ? colorTema : colorTema;
                              const contentBg = isDark ? 'var(--kt-card-bg)' : '#FFFFFF';

                              return (
                                <div key={idx} style={{flex:'none',width:'100%',height:'100%',position:'relative',display:'flex',background: idx === 0 ? bgCover : contentBg, overflow:'hidden', fontFamily:'sans-serif'}}>
                                  {idx === 0 ? (
                                    /* Cover slide: temario + topic title, large and stylish */
                                    <div style={{flex:1,display:'flex',flexDirection:'column',justifyContent:'center',padding:'8% 10%', position:'relative'}}>
                                      <div style={{width:'80px',height:'6px',background:colorTema,borderRadius:'3px',marginBottom:'24px'}}></div>
                                      <div style={{fontWeight:800,fontSize:'15px',letterSpacing:'3px',color:textColorAccent,textTransform:'uppercase',marginBottom:'16px'}}>{course.asignatura}</div>
                                      <h2 style={{fontWeight:700,fontSize:'48px',letterSpacing:'-1.5px',lineHeight:1.1,color:textColorCover,margin:'0 0 24px',maxWidth:'90%'}}>{course.titulo}</h2>
                                      {slide.titulo && slide.titulo !== course.titulo && (
                                        <h3 style={{fontWeight:600,fontSize:'24px',letterSpacing:'-.5px',color:isDark ? '#94A3B8' : '#475569',margin:0,maxWidth:'85%'}}>{slide.titulo}</h3>
                                      )}
                                    </div>
                                  ) : (
                                    /* Content slide: two-column layout */
                                    <>
                                      <div style={{width:'32%',background:bgSidebar,display:'flex',flexDirection:'column',padding:'6% 4%',position:'relative'}}>
                                        <div style={{fontWeight:800,fontSize:'42px',color:isDark ? colorTema : '#FFFFFF',lineHeight:1,marginBottom:'16px'}}>{String(idx + 1).padStart(2, '0')}</div>
                                        <div style={{fontWeight:700,fontSize:'12px',letterSpacing:'1.5px',color:'#FFFFFF',textTransform:'uppercase',marginBottom:'12px'}}>{course.asignatura}</div>
                                        <div style={{fontWeight:600,fontSize:'14px',color:isDark ? '#94A3B8' : 'rgba(255,255,255,0.8)',lineHeight:1.5}}>{course.titulo}</div>
                                      </div>
                                      <div style={{flex:1,display:'flex',flexDirection:'column',padding:'6% 6% 6% 5%',position:'relative'}}>
                                        <h3 style={{fontWeight:700,fontSize:'34px',letterSpacing:'-1px',color:'var(--kt-heading)',margin:'0 0 32px',lineHeight:1.2,maxWidth:'95%'}}>{slide.titulo}</h3>
                                        <div style={{display:'flex',flexDirection:'column',gap:'20px',marginBottom:'auto'}}>
                                          {slide.puntos.map((pt, pIdx) => (
                                            <div key={pIdx} style={{display:'flex',alignItems:'flex-start',gap:'16px',fontWeight:500,fontSize:'17px',color:'var(--kt-text)',lineHeight:1.5}}>
                                              <span style={{color:colorTema,marginTop:'3px',flex:'none'}}><CheckCircle2 size={20} /></span>
                                              <span>{pt}</span>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    </>
                                  )}

                                  {/* Watermark Centered Bottom — sits below the nav pill (bottom:20px, ~32px
                                      tall) so the two never overlap on shorter/mobile heights */}
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
                              {currentSlideIndex + 1} / {content?.diapositivas?.length || 1}
                            </span>
                            <button
                              onClick={() => setCurrentSlideIndex(Math.min((content?.diapositivas?.length || 1) - 1, currentSlideIndex + 1))}
                              disabled={currentSlideIndex === (content?.diapositivas?.length || 1) - 1}
                              style={{background:'none', border:'none', color:'var(--kt-text)', cursor: currentSlideIndex === (content?.diapositivas?.length || 1) - 1 ? 'not-allowed' : 'pointer', opacity: currentSlideIndex === (content?.diapositivas?.length || 1) - 1 ? 0.5 : 1, transform:'rotate(180deg)'}}
                            >
                              <ChevronLeft size={20} />
                            </button>
                          </div>

                        {/* Dots Navigation */}
                        <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'8px',marginTop:'16px'}}>
                          {content?.diapositivas?.map((_, idx) => {
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
                      </div>

                        {/* Thumbnail Rail */}
                        <div style={{display:'flex',gap:'12px',marginTop:'18px',paddingTop:'18px',borderTop:'1px solid var(--kt-border-soft)',overflowX:'auto'}}>
                          {content?.diapositivas?.map((slide, idx) => {
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
                                    {slide.titulo}
                                  </span>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* TOASTS */}
        <div data-toasts style={{position:'absolute',right:'22px',bottom:'22px',zIndex:80,display:'flex',flexDirection:'column',gap:'12px',pointerEvents:'none'}}>
          {toasts.map(t => (
            <div key={t.id} style={{pointerEvents:'auto',display:'flex',alignItems:'center',gap:'12px',minWidth:'270px',maxWidth:'340px',padding:'13px 15px',borderRadius:'13px',background:'rgba(17,24,39,.94)',backdropFilter:'blur(12px)',border:`1px solid rgba(${t.kind==='success'?'16,185,129':t.kind==='warn'?'245,158,11':'244,63,94'},.35)`,boxShadow:'0 18px 40px -16px rgba(0,0,0,.7)',animation:'ktToastIn .55s cubic-bezier(.34,1.56,.64,1) both'}}>
              <span style={{flex:'none',width:'34px',height:'34px',borderRadius:'10px',display:'grid',placeItems:'center',background:`rgba(${t.kind==='success'?'16,185,129':t.kind==='warn'?'245,158,11':'244,63,94'},.16)`,color:t.kind==='success'?'#34D399':t.kind==='warn'?'#FBBF24':'#FB7185'}}>
                {t.kind === 'success' && <CheckCircle2 size={18} />}
                {t.kind === 'error' && <AlertCircle size={18} />}
                {t.kind === 'warn' && <AlertCircle size={18} />}
              </span>
              <div style={{minWidth:0}}>
                <div style={{fontFamily:"'Manrope'",fontWeight:700,fontSize:'13.5px',color:'#F1F5F9'}}>{t.title}</div>
                <div style={{fontFamily:"'Manrope'",fontWeight:500,fontSize:'12px',color:'#94A3B8',marginTop:'1px'}}>{t.msg}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

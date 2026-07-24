import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTemarios } from '../hooks/useTemarios';
import { isAdmin, formatRoleDisplay } from '../utils/roleUtils';
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
  Trash2,
  BookOpen,
  Settings,
  FileText,
  Heart,
  ChevronDown
} from 'lucide-react';

export default function GeneratedContents() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { courses, loading } = useTemarios();

  const [theme, setTheme] = useState(() => localStorage.getItem('katedra-theme') || 'light');
  useEffect(() => { localStorage.setItem('katedra-theme', theme); }, [theme]);
  const [collapsed, setCollapsed] = useState(false);
  const [asignaturasOpen, setAsignaturasOpen] = useState(false);
  const [zoom, setZoom] = useState(100);

  const [generations, setGenerations] = useState([]);
  const [expandedGenId, setExpandedGenId] = useState(null);

  useEffect(() => {
    const loadLogs = () => {
      let list = JSON.parse(localStorage.getItem('katedra_activity_log') || '[]');
      if (list.length === 0) {
        const oldGens = JSON.parse(localStorage.getItem('katedra_generations') || '[]');
        if (oldGens.length > 0) {
          list = oldGens.map(g => ({
            ...g,
            action: 'GENERADO',
            piezasGeneradas: g.piezas || ['teoria', 'evaluacion', 'diapositivas'],
            modeloUsado: g.modelo || 'pro'
          }));
        } else if (courses.length > 0) {
          list = courses.map((c, idx) => ({
            id: 'act_' + c.id + '_' + idx,
            action: 'CREADO',
            temarioId: c.id,
            temarioTitulo: c.titulo || c.nombre,
            asignatura: c.asignatura || c.curso || 'Materia',
            createdAt: c.createdAt || new Date(Date.now() - idx * 86400000).toISOString()
          }));
        }
        localStorage.setItem('katedra_activity_log', JSON.stringify(list));
      }
      setGenerations(list);
    };

    loadLogs();
    
    const handleStorage = (e) => {
      if (e.key === 'katedra_activity_log') {
        loadLogs();
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [courses]);

  const handleDelete = (id) => {
    const updated = generations.filter(g => g.id !== id);
    setGenerations(updated);
    localStorage.setItem('katedra_activity_log', JSON.stringify(updated));
    if (expandedGenId === id) setExpandedGenId(null);
  };

  const handleDeleteAll = () => {
    setGenerations([]);
    localStorage.removeItem('katedra_activity_log');
    setExpandedGenId(null);
  };

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

  const getInitial = (name) => {
    if (!name) return 'U';
    const clean = name.replace(/^(prof\.|dra\.|dr\.|ing\.|mtra\.|mtro\.|lic\.)\s*/i, '').trim();
    return (clean[0] || 'U').toUpperCase();
  };

  const calculatePct = (done, total) => {
    if (!total) return 0;
    return Math.round((done / total) * 100);
  };

  return (
    <>
      <style>{`
        [data-root]{margin:0;padding:0}
        *{box-sizing:border-box}
        input,textarea,select{outline:none;font-family:inherit}
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
          --kt-card-bg:rgba(255,255,255,.9);
          --kt-input-bg:rgba(241,245,249,.7);--kt-input-border:rgba(15,23,42,.12);
          --kt-modal-bg1:rgba(255,255,255,.98);--kt-modal-bg2:rgba(248,250,252,.98);--kt-modal-border:rgba(15,23,42,.09);--kt-modal-backdrop:rgba(15,23,42,.25);
          --kt-scrollbar:rgba(15,23,42,.16);
          --kt-shadow-panel:0 24px 50px -28px rgba(15,23,42,.16);
          --kt-shadow-card:0 14px 30px -18px rgba(15,23,42,.22);
          --kt-shadow-modal:0 30px 70px -25px rgba(15,23,42,.25);
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
        }

        @keyframes ktBlob{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(30px,-28px) scale(1.14)}}
        @keyframes ktBlob2{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(-26px,24px) scale(1.1)}}
        @keyframes ktGrainShift{0%{transform:translate(0,0)}25%{transform:translate(-4%,3%)}50%{transform:translate(3%,-2%)}75%{transform:translate(-2%,-3%)}100%{transform:translate(0,0)}}
        @keyframes ktToastIn{0%{transform:translateX(130%) scale(.9);opacity:0}55%{transform:translateX(-10px) scale(1.02);opacity:1}75%{transform:translateX(5px) scale(.99)}100%{transform:translateX(0) scale(1)}}
        @keyframes ktToastOut{to{transform:translateX(130%) scale(.92);opacity:0}}
        @keyframes ktShimmer{0%{background-position:-360px 0}100%{background-position:360px 0}}
        @keyframes ktSpin{to{transform:rotate(360deg)}}

        .kt-nav:hover{background:var(--kt-chip-hover) !important}
        .kt-primary:hover{transform:translateY(-2px);box-shadow:0 16px 34px -12px rgba(16,185,129,.7)}
        .kt-primary:active{transform:translateY(0)}
        .kt-ghostbtn:hover{background:var(--kt-chip-hover) !important;color:var(--kt-heading) !important}

        /* stat widgets */
        .kt-stat{transition:transform .22s cubic-bezier(.34,1.56,.64,1),box-shadow .25s,border-color .25s;cursor:pointer}
        .kt-stat:hover{transform:translateY(-3px);box-shadow:var(--kt-shadow-card);border-color:rgba(16,185,129,.3)}
        .kt-stat:hover .kt-stat-action{opacity:1;transform:translateX(0)}
        .kt-stat-action{opacity:0;transform:translateX(-4px);transition:opacity .2s,transform .2s}

        /* syllabus cards */
        .kt-scard{position:relative;transition:transform .24s cubic-bezier(.34,1.56,.64,1),box-shadow .28s,border-color .25s;overflow:hidden}
        .kt-scard:hover{transform:translateY(-4px);box-shadow:var(--kt-shadow-card)}
        .kt-scard:hover .kt-scard-open{gap:9px}
        .kt-iconbtn:hover{background:var(--kt-chip-hover) !important;color:var(--kt-heading) !important}
        .kt-iconbtn.del:hover{background:rgba(244,63,94,.16) !important;color:#FB7185 !important}
        .kt-newcard{transition:transform .24s cubic-bezier(.34,1.56,.64,1),border-color .25s,background .25s;cursor:pointer}
        .kt-newcard:hover{transform:translateY(-4px);border-color:rgba(16,185,129,.5);background:rgba(16,185,129,.05)}
        .kt-newcard:hover .kt-newplus{transform:scale(1.08) rotate(90deg);background:linear-gradient(150deg,#10B981,#059669);color:#fff}

        .kt-scard[data-status="Completado"], .kt-scard[data-status="Activo"]{--sc:#10B981;--sc-rgb:16,185,129}
        .kt-scard[data-status="En proceso"]{--sc:#0284C7;--sc-rgb:2,132,199}
        .kt-scard[data-status="Borrador"]{--sc:#F59E0B;--sc-rgb:245,158,11}
        .kt-scard .kt-accentbar{background:var(--sc)}
        .kt-scard .kt-statuspill{background:rgba(var(--sc-rgb),.14);color:var(--sc);border:1px solid rgba(var(--sc-rgb),.3)}
        .kt-scard .kt-progressfill{background:var(--sc)}
        .kt-scard .kt-cardicon{background:rgba(var(--sc-rgb),.14);color:var(--sc)}
        [data-root][data-kt-theme="dark"] .kt-scard[data-status="En proceso"]{--sc:#38BDF8;--sc-rgb:56,189,248}
        [data-root][data-kt-theme="dark"] .kt-scard[data-status="Borrador"]{--sc:#FBBF24;--sc-rgb:251,191,36}
        [data-root][data-kt-theme="dark"] .kt-scard[data-status="Completado"], [data-root][data-kt-theme="dark"] .kt-scard[data-status="Activo"]{--sc:#34D399;--sc-rgb:52,211,153}

        /* sidebar collapse */
        .kt-sidebar{width:256px; transition: width .32s cubic-bezier(.4,0,.2,1) !important; user-select: none; -webkit-user-select: none;}
        [data-root][data-kt-collapsed="true"] .kt-sidebar{width:76px}
        .kt-sidelabel{transition: opacity .25s ease, max-width .25s ease, margin .25s ease; opacity:1; max-width: 180px; min-width: 0; overflow: hidden; white-space: nowrap; display: inline-block;}
        [data-root][data-kt-collapsed="true"] .kt-sidelabel{display: none !important;}
        .kt-menutitle{transition: opacity .25s ease, max-height .25s ease; opacity: 1; max-height: 20px; overflow: hidden; white-space: nowrap;}
        [data-root][data-kt-collapsed="true"] .kt-menutitle{display: none !important;}
        [data-root][data-kt-collapsed="true"] .kt-collapse-icon{transform:rotate(180deg)}
        .kt-navrow{transition: background .18s ease, padding .32s cubic-bezier(.4,0,.2,1), gap .32s cubic-bezier(.4,0,.2,1) !important;}
        .kt-brand-header{transition: padding .32s cubic-bezier(.4,0,.2,1), gap .32s cubic-bezier(.4,0,.2,1) !important;}
        [data-root][data-kt-collapsed="true"] .kt-navrow{justify-content:center !important; gap:0 !important; padding-left:0 !important; padding-right:0 !important;}
        [data-root][data-kt-collapsed="true"] .kt-brand-header{justify-content:center !important; gap:0 !important; padding-left:0 !important; padding-right:0 !important;}

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

        /* modal reveal */
        [data-modal]{opacity:0;pointer-events:none;transition:opacity .22s ease}
        [data-modal-panel]{transform:scale(.94) translateY(10px);transition:transform .32s cubic-bezier(.34,1.56,.64,1)}
        [data-root][data-kt-modal="true"] [data-modal]{opacity:1;pointer-events:auto}
        [data-root][data-kt-modal="true"] [data-modal-panel]{transform:scale(1) translateY(0)}

        /* modal mode swap */
        .kt-only-create{display:inline}.kt-only-edit{display:none}
        [data-root][data-kt-modal-mode="edit"] .kt-only-create{display:none}
        [data-root][data-kt-modal-mode="edit"] .kt-only-edit{display:inline}

        /* modal tabs */
        [data-tab-opt]{background:transparent;color:var(--kt-muted)}
        [data-root][data-kt-tab="file"] [data-tab-opt="file"],
        [data-root][data-kt-tab="web"] [data-tab-opt="web"],
        [data-root][data-kt-tab="manual"] [data-tab-opt="manual"]{background:linear-gradient(150deg,#10B981,#059669);color:#fff;box-shadow:0 6px 16px -8px rgba(16,185,129,.7)}
        [data-tab-panel]{display:none}
        [data-root][data-kt-tab="file"] [data-tab-panel="file"],
        [data-root][data-kt-tab="web"] [data-tab-panel="web"],
        [data-root][data-kt-tab="manual"] [data-tab-panel="manual"]{display:block}
        .kt-manual-only{display:none}
        [data-root][data-kt-tab="manual"] .kt-manual-only{display:block}

        /* notifications */
        [data-notif-panel]{opacity:0;pointer-events:none;transition:opacity .18s ease,transform .18s ease;transform:translateY(-8px) scale(.97)}
        [data-root][data-kt-notif="true"] [data-notif-panel]{opacity:1;pointer-events:auto;transform:translateY(0) scale(1)}
        [data-notif-catcher]{display:none}
        [data-root][data-kt-notif="true"] [data-notif-catcher]{display:block}
        [data-notif-icon][data-kind="success"]{background:rgba(16,185,129,.16);color:#10B981}
        [data-notif-icon][data-kind="error"]{background:rgba(244,63,94,.16);color:#F43F5E}
        [data-notif-icon][data-kind="warn"]{background:rgba(245,158,11,.16);color:#F59E0B}

        @media(max-width:1024px){
          .kt-sidebar{width:74px !important}
          .kt-sidelabel{display:none !important}
          .kt-menutitle{opacity:0 !important}
          .kt-navrow{justify-content:center !important}
          .kt-collapsebtn{display:none !important}
        }
        @media(max-width:760px){
          .kt-headtitle{font-size:22px !important}
          .kt-main-pad{padding:18px !important}
          .kt-zoom{display:none !important}
          .kt-modal-2col{grid-template-columns:1fr !important}
        }
        @media(max-width:560px){
          .kt-sidebar{position:absolute !important;z-index:40;height:100%;box-shadow:0 0 60px rgba(0,0,0,.6)}
        }
      `}</style>

      <div 
        data-root 
        data-kt-theme={theme}
        data-kt-collapsed={collapsed ? "true" : "false"}
        style={{ position:'fixed', inset:0, display:'flex', overflow:'hidden', fontFamily:"'Manrope',sans-serif", background:'radial-gradient(130% 135% at 12% 6%, var(--kt-bg1) 0%, var(--kt-bg2) 40%, var(--kt-bg3) 100%)', color:'var(--kt-text)' }}
      >
        {/* Decorative layer */}
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
              onClick={() => navigate('/dashboard')}
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
        <main style={{ position:'relative', zIndex:5, flex:1, minWidth:0, display:'flex', flexDirection:'column', overflow:'hidden' }}>
          {/* Header */}
          <header className="kt-main-pad" style={{ display:'flex', alignItems:'center', gap:'18px', padding:'26px 32px', borderBottom:'1px solid var(--kt-border-soft)' }}>
            <div style={{ minWidth:0 }}>
              <h1 className="kt-headtitle" style={{ fontFamily:"'Inter'", fontWeight:600, fontSize:'27px', lineHeight:1.15, letterSpacing:'-1.2px', color:'var(--kt-heading)', margin:0 }}>Historial de Creaciones</h1>
              <p style={{ fontFamily:"'Manrope'", fontWeight:500, fontSize:'13.5px', color:'var(--kt-muted)', margin:'3px 0 0' }}>Contenidos generados recientemente</p>
            </div>
            <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:'12px' }}>
              {generations.length > 0 && (
                <button 
                  onClick={handleDeleteAll} 
                  style={{ height:'44px', padding:'0 20px', border:'1px solid #F43F5E', borderRadius:'11px', background:'rgba(244,63,94,0.08)', color:'#F43F5E', cursor:'pointer', fontFamily:"'Manrope'", fontWeight:800, fontSize:'14px', transition:'all .2s' }}
                >
                  Eliminar todo
                </button>
              )}
              <button className="kt-primary" onClick={() => navigate('/generador')} style={{ flex:'none', whiteSpace:'nowrap', display:'flex', alignItems:'center', gap:'8px', height:'44px', padding:'0 20px', border:'none', borderRadius:'11px', background:'linear-gradient(150deg,#10B981,#059669)', color:'#fff', cursor:'pointer', fontFamily:"'Manrope'", fontWeight:800, fontSize:'14px', boxShadow:'0 12px 26px -12px rgba(16,185,129,.7)', transition:'transform .18s,box-shadow .25s' }}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"></path></svg> Generar Nuevo
              </button>
            </div>
          </header>

          {/* Timeline View */}
          <div className="kt-main-pad" style={{ flex:1, overflow:'auto', padding:'40px 32px 80px' }}>
            <div style={{ maxWidth:'900px', margin:'0 auto', position:'relative' }}>
              {/* Timeline spine */}
              <div style={{ position:'absolute', top:'10px', bottom:0, left:'28px', width:'2px', background:'linear-gradient(to bottom, rgba(16,185,129,.3), transparent)' }}></div>

              {loading && generations.length === 0 ? (
                 <div style={{ padding:'40px 60px', color:'var(--kt-muted)', fontFamily:"'Manrope'", fontSize:'14px' }}>Cargando línea de tiempo...</div>
              ) : generations.length === 0 ? (
                 <div style={{ padding:'40px 60px', color:'var(--kt-faint)', fontFamily:"'Manrope'", fontSize:'14px' }}>No hay contenidos generados todavía.</div>
              ) : (
                 generations.map((g, idx) => {
                   const isExpanded = expandedGenId === g.id;
                   const isGenerado = g.action === 'GENERADO';
                   
                   // Determine icon and color based on action
                   let actionLabel = 'Modificado';
                   let ActionIcon = FolderDot;
                   let actionColor = 'var(--kt-heading)';
                   let iconBg = 'var(--kt-chip-bg)';
                   let iconBorder = 'var(--kt-chip-border)';
                   
                   if (g.action === 'CREADO') {
                     actionLabel = 'Temario Creado';
                     ActionIcon = FolderDot;
                   } else if (g.action === 'EDITADO') {
                     actionLabel = 'Temario Editado';
                     ActionIcon = Settings;
                   } else if (g.action === 'ELIMINADO') {
                     actionLabel = 'Temario Eliminado';
                     ActionIcon = Trash2;
                     actionColor = '#F43F5E';
                     iconBg = 'rgba(244,63,94,.1)';
                     iconBorder = 'rgba(244,63,94,.2)';
                   } else if (g.action === 'GENERADO') {
                     actionLabel = `Contenido Generado (${g.modeloUsado?.toUpperCase() || 'IA'})`;
                     ActionIcon = Sparkles;
                     actionColor = '#38BDF8';
                     iconBg = 'rgba(56,189,248,.1)';
                     iconBorder = 'rgba(56,189,248,.2)';
                   }
                   
                   return (
                     <div key={g.id} style={{ position:'relative', paddingLeft:'74px', marginBottom:'32px', display:'flex', flexDirection:'column', gap:'12px' }}>
                       
                       {/* Timeline node */}
                       <div style={{ position:'absolute', left:'17px', top:'24px', width:'24px', height:'24px', borderRadius:'50%', background:'var(--kt-bg1)', border:'2px solid #10B981', boxShadow:'0 0 0 4px var(--kt-bg2)', display:'grid', placeItems:'center', zIndex:2 }}>
                         <div style={{ width:'8px', height:'8px', borderRadius:'50%', background:'#10B981' }}></div>
                       </div>

                       <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                         <span style={{ fontFamily:"'Manrope'", fontWeight:800, fontSize:'12px', letterSpacing:'1px', color:'var(--kt-muted)', textTransform:'uppercase' }}>{g.createdAt ? new Date(g.createdAt).toLocaleDateString('es-ES', { month:'long', day:'numeric', year:'numeric', hour:'2-digit', minute:'2-digit' }) : 'Reciente'}</span>
                         <span style={{ padding:'3px 10px', borderRadius:'20px', background:'rgba(16,185,129,.12)', border:'1px solid rgba(16,185,129,.2)', fontFamily:"'Manrope'", fontWeight:800, fontSize:'9.5px', letterSpacing:'1.2px', textTransform:'uppercase', color:'#10B981' }}>{actionLabel}</span>
                       </div>

                       <div className="kt-scard" style={{ display:'flex', flexDirection:'column', background:'var(--kt-card-bg)', border:'1px solid var(--kt-panel-border)', borderRadius:'16px', padding:'24px', backdropFilter:'blur(12px)' }}>
                         
                         <div style={{ display:'flex', gap:'16px', alignItems:'flex-start' }}>
                           <div style={{ width:'52px', height:'52px', flex:'none', borderRadius:'14px', background:iconBg, display:'grid', placeItems:'center', color:actionColor, border:`1px solid ${iconBorder}` }}>
                             <ActionIcon size={24} strokeWidth={1.5} />
                           </div>
                           
                           <div style={{ flex:1, minWidth:0 }}>
                             <h3 style={{ fontFamily:"'Inter'", fontWeight:600, fontSize:'20px', letterSpacing:'-.6px', color:'var(--kt-heading)', margin:'0 0 4px 0' }}>{g.temarioTitulo}</h3>
                             <p style={{ fontFamily:"'Manrope'", fontWeight:500, fontSize:'14px', color:'var(--kt-muted)', margin:0 }}>{g.asignatura}</p>
                           </div>

                           <div style={{ flex:'none', display:'flex', alignItems:'center', gap:'10px' }}>
                             {g.action !== 'ELIMINADO' && (
                               <button 
                                 onClick={() => navigate(`/contenido/${g.temarioId}`)}
                                 style={{ display:'flex', alignItems:'center', gap:'6px', height:'32px', padding:'0 12px', border:'1px solid var(--kt-chip-border)', borderRadius:'8px', background:'var(--kt-chip-bg)', color:'var(--kt-heading)', cursor:'pointer', fontFamily:"'Manrope'", fontWeight:700, fontSize:'12px', transition:'background .2s' }}
                               >
                                 <BookOpen size={13} />
                                 Ver Temario
                               </button>
                             )}
                             <button 
                               onClick={() => handleDelete(g.id)}
                               aria-label="Eliminar versión"
                               style={{ background:'rgba(244,63,94,0.08)', border:'1px solid rgba(244,63,94,0.2)', color:'#F43F5E', width:'32px', height:'32px', borderRadius:'8px', cursor:'pointer', display:'grid', placeItems:'center' }}
                             >
                               <Trash2 size={15} />
                             </button>
                           </div>
                         </div>

                         {isGenerado && g.piezasGeneradas && (
                           <div style={{ marginTop:'20px', paddingTop:'16px', borderTop:'1px solid var(--kt-border-soft)', display:'flex', alignItems:'center', gap:'20px' }}>
                             <span style={{ fontFamily:"'Manrope'", fontWeight:600, fontSize:'12px', color:'var(--kt-faint)' }}>Piezas generadas:</span>
                             <div style={{ display:'flex', gap:'6px' }}>
                               {g.piezasGeneradas.map((pieza, pIdx) => (
                                 <span key={pIdx} style={{ padding:'4px 10px', borderRadius:'8px', background:'rgba(56,189,248,.1)', fontFamily:"'Manrope'", fontWeight:700, fontSize:'11px', color:'#38BDF8', textTransform:'capitalize' }}>{pieza}</span>
                               ))}
                             </div>
                           </div>
                         )}

                       </div>
                     </div>
                   );
                 })
              )}

            </div>
          </div>
        </main>
      </div>
    </>
  );
}

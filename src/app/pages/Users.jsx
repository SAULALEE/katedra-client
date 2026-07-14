import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useUsers } from '../hooks/useUsers';
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
  Search,
  Eye,
  Edit2,
  Trash2,
  X,
  UserPlus,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

const ROLE_OPTIONS = [
  { id: 'Docente Plan Libre', short: 'Libre' },
  { id: 'Docente Premium', short: 'Premium' },
  { id: 'Administrador', short: 'Admin' },
];

const ESTADO_OPTIONS = [
  { id: 'Activo', label: 'Activo' },
  { id: 'Inactivo', label: 'Inactivo' },
];

export default function Users() {
  const { users, loading, error, createUser, updateUser, deleteUser } = useUsers();
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [theme, setTheme] = useState('dark');
  const [collapsed, setCollapsed] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formRole, setFormRole] = useState('Premium');
  const [formStatus, setFormStatus] = useState('Activo');
  const [query, setQuery] = useState('');
  const [notifOpen, setNotifOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsUser, setDetailsUser] = useState(null);
  const [deleteConfirmUser, setDeleteConfirmUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  
  const [toasts, setToasts] = useState([]);

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

  const filteredUsers = users.filter(u => 
    !query || 
    u.nombre.toLowerCase().includes(query.toLowerCase()) || 
    u.email.toLowerCase().includes(query.toLowerCase())
  );

  const getRoleShort = (longRole) => {
    if (!longRole) return 'Libre';
    const r = longRole.toUpperCase();
    if (r === 'ADMINISTRADOR' || r === 'ROLE_ADMIN' || r === 'ADMIN') return 'Admin';
    if (r === 'DOCENTE PREMIUM' || r === 'ROLE_PROFESOR' || r === 'ROLE_PREMIUM' || r === 'PREMIUM') return 'Premium';
    return 'Libre';
  };

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

  const handleAddClick = () => {
    setEditId(null);
    setNombre('');
    setEmail('');
    setFormRole('Premium');
    setFormStatus('Activo');
    setFormError('');
    setModalOpen(true);
  };

  const handleEditClick = (u) => {
    setEditId(u.id);
    setNombre(u.nombre);
    setEmail(u.email);
    setFormRole(getRoleShort(u.rol));
    setFormStatus(u.estado || 'Activo');
    setFormError('');
    setModalOpen(true);
  };

  const handleViewDetails = (u) => {
    setDetailsUser(u);
    setDetailsOpen(true);
  };

  const handleDeleteClick = (u) => {
    setDeleteConfirmUser(u);
  };

  const confirmDelete = async () => {
    if (!deleteConfirmUser) return;
    if (deleteUser) {
      await deleteUser(deleteConfirmUser.id);
      notify('error', 'Docente eliminado', deleteConfirmUser.nombre + ' fue removido.');
    }
    setDeleteConfirmUser(null);
  };

  const handleSubmit = async (e) => {
    if(e) e.preventDefault();
    setFormError('');

    if (!nombre.trim() || !email.trim()) {
      setFormError('Completa nombre y correo.');
      notify('error', 'Faltan datos', 'Completa nombre y correo.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setFormError('Revisa el formato del correo.');
      notify('error', 'Correo inválido', 'Revisa el formato del correo.');
      return;
    }

    setIsSubmitting(true);
    const longRole = formRole === 'Admin' ? 'Administrador' : formRole === 'Premium' ? 'Docente Premium' : 'Docente Plan Libre';
    const payload = { nombre, email, rol: longRole, estado: formStatus };
    let success = false;

    if (editId) {
      success = await updateUser(editId, payload);
      if(success) notify('success', 'Cambios guardados', nombre + ' fue actualizado.');
    } else {
      success = await createUser(payload);
      if(success) notify('success', 'Docente registrado', nombre + ' se añadió al listado.');
    }

    setIsSubmitting(false);
    if (success) {
      setModalOpen(false);
      if(detailsOpen && detailsUser && detailsUser.id === editId) {
         setDetailsUser({ ...detailsUser, ...payload });
      }
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

  /* sidebar collapse */
  .kt-sidebar{width:256px; transition: width .32s cubic-bezier(.4,0,.2,1) !important;}
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
  .kt-row[data-role="Admin"] [data-rolepill], .kt-details-wrapper[data-role="Admin"] [data-rolepill]{background:rgba(56,189,248,.16);color:#0369A1;border-color:rgba(56,189,248,.35)}
  .kt-row[data-role="Premium"] [data-rolepill], .kt-details-wrapper[data-role="Premium"] [data-rolepill]{background:rgba(245,158,11,.16);color:#B45309;border-color:rgba(245,158,11,.35)}
  .kt-row[data-role="Libre"] [data-rolepill], .kt-details-wrapper[data-role="Libre"] [data-rolepill]{background:rgba(100,116,139,.14);color:#475569;border-color:rgba(100,116,139,.3)}
  [data-root][data-kt-theme="dark"] .kt-row[data-role="Admin"] [data-rolepill], [data-root][data-kt-theme="dark"] .kt-details-wrapper[data-role="Admin"] [data-rolepill]{color:#7DD3FC}
  [data-root][data-kt-theme="dark"] .kt-row[data-role="Premium"] [data-rolepill], [data-root][data-kt-theme="dark"] .kt-details-wrapper[data-role="Premium"] [data-rolepill]{color:#FBBF24}
  [data-root][data-kt-theme="dark"] .kt-row[data-role="Libre"] [data-rolepill], [data-root][data-kt-theme="dark"] .kt-details-wrapper[data-role="Libre"] [data-rolepill]{color:#CBD5E1}
  .kt-row[data-status="Activo"] [data-statuspill], .kt-details-wrapper[data-status="Activo"] [data-statuspill]{background:rgba(16,185,129,.16);color:#047857;border-color:rgba(16,185,129,.35)}
  .kt-row[data-status="Inactivo"] [data-statuspill], .kt-details-wrapper[data-status="Inactivo"] [data-statuspill]{background:rgba(244,63,94,.16);color:#BE123C;border-color:rgba(244,63,94,.35)}
  [data-root][data-kt-theme="dark"] .kt-row[data-status="Activo"] [data-statuspill], [data-root][data-kt-theme="dark"] .kt-details-wrapper[data-status="Activo"] [data-statuspill]{color:#34D399}
  [data-root][data-kt-theme="dark"] .kt-row[data-status="Inactivo"] [data-statuspill], [data-root][data-kt-theme="dark"] .kt-details-wrapper[data-status="Inactivo"] [data-statuspill]{color:#FB7185}
  .kt-row[data-status="Activo"] [data-statusdot], .kt-details-wrapper[data-status="Activo"] [data-statusdot]{background:#10B981;box-shadow:0 0 8px #10B981}
  .kt-row[data-status="Inactivo"] [data-statusdot], .kt-details-wrapper[data-status="Inactivo"] [data-statusdot]{background:#F43F5E;box-shadow:0 0 8px #F43F5E}
  .kt-row[data-role="Admin"] [data-avatar]{background:linear-gradient(150deg,#38BDF8,#2563EB)}
  .kt-row[data-role="Premium"] [data-avatar]{background:linear-gradient(150deg,#FBBF24,#D97706)}
  .kt-row[data-role="Libre"] [data-avatar]{background:linear-gradient(150deg,#34D399,#059669)}
  .kt-details-wrapper[data-role="Admin"] [data-avatar-lg]{background:linear-gradient(150deg,#38BDF8,#2563EB)}
  .kt-details-wrapper[data-role="Premium"] [data-avatar-lg]{background:linear-gradient(150deg,#FBBF24,#D97706)}
  .kt-details-wrapper[data-role="Libre"] [data-avatar-lg]{background:linear-gradient(150deg,#34D399,#059669)}

  /* notifications dropdown */
  [data-notif-panel]{opacity:0;transform:translateY(-8px) scale(.97);pointer-events:none;transition:opacity .18s ease,transform .18s ease}
  [data-root][data-kt-notif="true"] [data-notif-panel]{opacity:1;transform:translateY(0) scale(1);pointer-events:auto}
  [data-notif-catcher]{display:none}
  [data-root][data-kt-notif="true"] [data-notif-catcher]{display:block}
  [data-notif-icon][data-kind="success"]{background:rgba(16,185,129,.16);color:#10B981}
  [data-notif-icon][data-kind="error"]{background:rgba(244,63,94,.16);color:#F43F5E}
  [data-notif-icon][data-kind="warn"]{background:rgba(245,158,11,.16);color:#F59E0B}

  /* details drawer side panel */
  .kt-details-wrapper { width: 0; transition: width .32s cubic-bezier(.4,0,.2,1); overflow: hidden; flex: none; background: var(--kt-modal-bg1); border-left: 1px solid transparent; zIndex: 10; position: relative; }
  [data-root][data-kt-details="true"] .kt-details-wrapper { width: 256px; border-color: var(--kt-border); }

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

 `}</style>
      <div 
        data-root 
        data-kt-theme={theme} 
        data-kt-collapsed={collapsed ? "true" : "false"}
        data-kt-modal={modalOpen ? "true" : "false"}
        data-kt-details={detailsOpen ? "true" : "false"}
        data-kt-notif={notifOpen ? "true" : "false"}
        data-kt-form-role={formRole}
        data-kt-form-status={formStatus}
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
                {getInitial(user?.nombre || user?.email || 'Docente')}
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
              <h1 className="kt-headtitle" style={{ fontFamily:"'Inter'", fontWeight:600, fontSize:'27px', lineHeight:1.15, letterSpacing:'-1.2px', color:'var(--kt-heading)', margin:0 }}>Administración de Usuarios</h1>
              <p style={{ fontFamily:"'Manrope'", fontWeight:500, fontSize:'13.5px', color:'var(--kt-muted)', margin:'3px 0 0' }}>Gestión de Accesos</p>
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
                        <div style={{ fontFamily:"'Manrope'", fontWeight:600, fontSize:'10px', color:'var(--kt-faint)', marginTop:'4px' }}>{timeAgo(n.ts)}</div>
                      </div>
                    </div>
                  )) : (
                    <div style={{ padding:'36px 16px', textAlign:'center', fontFamily:"'Manrope'", fontWeight:600, fontSize:'12.5px', color:'var(--kt-faint)' }}>Sin notificaciones por ahora.</div>
                  )}
                </div>
              </div>

              <button className="kt-primary" onClick={handleAddClick} style={{ flex:'none', whiteSpace:'nowrap', display:'flex', alignItems:'center', gap:'8px', height:'44px', padding:'0 20px', border:'none', borderRadius:'11px', background:'linear-gradient(150deg,#10B981,#059669)', color:'#fff', cursor:'pointer', fontFamily:"'Manrope'", fontWeight:800, fontSize:'14px', boxShadow:'0 12px 26px -12px rgba(16,185,129,.7)', transition:'transform .18s,box-shadow .25s' }}>
                <UserPlus size={17} strokeWidth={2.4} />
                Agregar Usuario
              </button>
            </div>
          </header>

          <div className="kt-main-pad" style={{ flex:1, overflow:'auto', padding:'28px 32px 60px' }}>
            <div style={{ maxWidth:'1180px', margin:'0 auto' }}>
              <section style={{ background:'var(--kt-panel-bg)', backdropFilter:'blur(12px)', border:'1px solid var(--kt-panel-border)', borderRadius:'18px', overflow:'hidden', boxShadow:'var(--kt-shadow-panel)' }}>
                <div style={{ display:'flex', alignItems:'center', gap:'16px', flexWrap:'wrap', padding:'20px 22px', borderBottom:'1px solid var(--kt-border-soft)' }}>
                  <h2 style={{ fontFamily:"'Inter'", fontWeight:600, fontSize:'17px', letterSpacing:'-.5px', color:'var(--kt-heading)', margin:0 }}>Listado de Docentes</h2>
                  <div style={{ position:'relative', marginLeft:'8px', flex:1, maxWidth:'280px', minWidth:'150px' }}>
                    <span style={{ position:'absolute', left:'12px', top:'50%', transform:'translateY(-50%)', color:'var(--kt-muted)' }}><Search size={15} /></span>
                    <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Buscar docente…" style={{ width:'100%', height:'38px', padding:'0 12px 0 34px', border:'1px solid var(--kt-input-border)', borderRadius:'10px', background:'var(--kt-input-bg)', color:'var(--kt-text)', fontFamily:"'Manrope'", fontWeight:500, fontSize:'13px' }} />
                  </div>
                  <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:'7px', padding:'6px 13px', borderRadius:'20px', background:'var(--kt-chip-bg)', border:'1px solid var(--kt-chip-border)' }}>
                    <span style={{ width:'6px', height:'6px', borderRadius:'50%', background:'#34D399', boxShadow:'0 0 8px #34D399' }}></span>
                    <span style={{ fontFamily:"'Manrope'", fontWeight:700, fontSize:'12px', color:'var(--kt-text)' }}>{users.length} registrados</span>
                  </div>
                </div>

                <div className="kt-tablewrap">
                  <div className="kt-table">
                    <div style={{ display:'grid', gridTemplateColumns:'2fr 2.2fr 1.6fr 1.1fr 1.2fr', gap:'12px', padding:'14px 24px', borderBottom:'1px solid var(--kt-border-soft)' }}>
                      <div style={{ fontFamily:"'Manrope'", fontWeight:700, fontSize:'10.5px', letterSpacing:'1px', color:'var(--kt-label)' }}>NOMBRE COMPLETO</div>
                      <div style={{ fontFamily:"'Manrope'", fontWeight:700, fontSize:'10.5px', letterSpacing:'1px', color:'var(--kt-label)' }}>CORREO ELECTRÓNICO</div>
                      <div style={{ fontFamily:"'Manrope'", fontWeight:700, fontSize:'10.5px', letterSpacing:'1px', color:'var(--kt-label)' }}>ROL ASIGNADO</div>
                      <div style={{ fontFamily:"'Manrope'", fontWeight:700, fontSize:'10.5px', letterSpacing:'1px', color:'var(--kt-label)' }}>ESTADO</div>
                      <div style={{ fontFamily:"'Manrope'", fontWeight:700, fontSize:'10.5px', letterSpacing:'1px', color:'var(--kt-label)', textAlign:'right' }}>ACCIONES</div>
                    </div>

                    <div data-tbody>
                      {filteredUsers.length > 0 ? filteredUsers.map(u => (
                        <div 
                          key={u.id} 
                          className="kt-row" 
                          data-uid={u.id} 
                          data-role={getRoleShort(u.rol)} 
                          data-status={u.estado || 'Activo'} 
                          onClick={() => handleViewDetails(u)}
                          style={{ display:'grid', gridTemplateColumns:'2fr 2.2fr 1.6fr 1.1fr 1.2fr', gap:'12px', alignItems:'center', padding:'14px 24px', borderBottom:'1px solid var(--kt-border-soft)', overflow:'hidden', cursor:'pointer' }}
                        >
                          <div style={{ display:'flex', alignItems:'center', gap:'12px', minWidth:0 }}>
                            <div data-avatar style={{ width:'36px', height:'36px', flex:'none', borderRadius:'10px', display:'grid', placeItems:'center', fontFamily:"'Manrope'", fontWeight:800, fontSize:'13px', color:'#fff', transition:'opacity .2s' }}>{getInitial(u.nombre)}</div>
                            <span style={{ fontFamily:"'Manrope'", fontWeight:700, fontSize:'13.5px', color:'var(--kt-heading)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{u.nombre}</span>
                          </div>
                          <div style={{ fontFamily:"'Manrope'", fontWeight:500, fontSize:'13px', color:'var(--kt-muted)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{u.email}</div>
                          <div><span data-rolepill style={{ display:'inline-flex', alignItems:'center', padding:'5px 11px', borderRadius:'8px', fontFamily:"'Manrope'", fontWeight:700, fontSize:'10.5px', letterSpacing:'.6px', textTransform:'uppercase' }}>{getRoleShort(u.rol)}</span></div>
                          <div><span data-statuspill style={{ display:'inline-flex', alignItems:'center', gap:'7px', padding:'5px 11px', borderRadius:'20px', fontFamily:"'Manrope'", fontWeight:700, fontSize:'10.5px', letterSpacing:'.5px', textTransform:'uppercase' }}><span data-statusdot style={{ width:'6px', height:'6px', borderRadius:'50%', animation:'ktPulse 2s ease-in-out infinite' }}></span>{u.estado || 'Activo'}</span></div>
                          <div style={{ display:'flex', alignItems:'center', justifyContent:'flex-end', gap:'6px' }} onClick={(e) => e.stopPropagation()}>
                            <button className="kt-actbtn" onClick={() => handleViewDetails(u)} aria-label="Ver" style={{ width:'32px', height:'32px', display:'grid', placeItems:'center', border:'none', background:'var(--kt-chip-bg)', borderRadius:'9px', color:'var(--kt-muted)', cursor:'pointer', transition:'background .18s,color .18s' }}><Eye size={16} /></button>
                            <button className="kt-actbtn" onClick={() => handleEditClick(u)} aria-label="Editar" style={{ width:'32px', height:'32px', display:'grid', placeItems:'center', border:'none', background:'var(--kt-chip-bg)', borderRadius:'9px', color:'var(--kt-muted)', cursor:'pointer', transition:'background .18s,color .18s' }}><Edit2 size={15} /></button>
                            <button className="kt-actbtn del" onClick={() => handleDeleteClick(u)} aria-label="Eliminar" style={{ width:'32px', height:'32px', display:'grid', placeItems:'center', border:'none', background:'var(--kt-chip-bg)', borderRadius:'9px', color:'var(--kt-muted)', cursor:'pointer', transition:'background .18s,color .18s' }}><Trash2 size={15} /></button>
                          </div>
                        </div>
                      )) : (
                        <div style={{ padding:'48px 24px', textAlign:'center', fontFamily:"'Manrope'", fontWeight:600, fontSize:'14px', color:'var(--kt-muted)' }}>Sin resultados.</div>
                      )}
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </main>

        {/* DETAILS DRAWER */}
        <aside className="kt-details-wrapper" data-role={detailsUser ? getRoleShort(detailsUser.rol) : ''} data-status={detailsUser ? (detailsUser.estado || 'Activo') : ''}>
          <div style={{ width: '256px', height: '100%', display: 'flex', flexDirection: 'column' }}>
            {detailsUser && (
              <>
                <div style={{ display:'flex', alignItems:'center', padding:'26px 22px 20px', borderBottom:'1px solid var(--kt-border-soft)' }}>
                  <span style={{ fontFamily:"'Inter'", fontWeight:600, fontSize:'16px', letterSpacing:'-.3px', color:'var(--kt-heading)' }}>Detalle del Docente</span>
                  <button onClick={() => setDetailsOpen(false)} aria-label="Cerrar" style={{ marginLeft:'auto', width:'30px', height:'30px', display:'grid', placeItems:'center', border:'none', background:'var(--kt-chip-bg)', borderRadius:'9px', color:'var(--kt-muted)', cursor:'pointer' }}><X size={16} /></button>
                </div>
                <div style={{ flex:1, overflow:'auto', padding:'28px 24px' }}>
                  <div style={{ display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center', paddingBottom:'22px', borderBottom:'1px solid var(--kt-border-soft)', marginBottom:'22px' }}>
                    <div data-avatar-lg style={{ width:'72px', height:'72px', borderRadius:'18px', display:'grid', placeItems:'center', fontFamily:"'Manrope'", fontWeight:800, fontSize:'26px', color:'#fff', marginBottom:'14px' }}>{getInitial(detailsUser.nombre)}</div>
                    <div style={{ fontFamily:"'Inter'", fontWeight:600, fontSize:'18px', letterSpacing:'-.4px', color:'var(--kt-heading)' }}>{detailsUser.nombre}</div>
                    <div style={{ fontFamily:"'Manrope'", fontWeight:500, fontSize:'13px', color:'var(--kt-muted)', marginTop:'3px' }}>{detailsUser.email}</div>
                    <div style={{ display:'flex', gap:'8px', marginTop:'14px' }}>
                      <span data-rolepill style={{ display:'inline-flex', alignItems:'center', padding:'6px 12px', borderRadius:'8px', fontFamily:"'Manrope'", fontWeight:700, fontSize:'10.5px', letterSpacing:'.6px', textTransform:'uppercase' }}>{getRoleShort(detailsUser.rol)}</span>
                      <span data-statuspill style={{ display:'inline-flex', alignItems:'center', gap:'7px', padding:'6px 12px', borderRadius:'20px', fontFamily:"'Manrope'", fontWeight:700, fontSize:'10.5px', letterSpacing:'.5px', textTransform:'uppercase' }}><span data-statusdot style={{ width:'6px', height:'6px', borderRadius:'50%' }}></span>{detailsUser.estado || 'Activo'}</span>
                    </div>
                  </div>
                  <div style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
                    <div>
                      <div style={{ fontFamily:"'Manrope'", fontWeight:700, fontSize:'10px', letterSpacing:'1px', color:'var(--kt-label)', marginBottom:'5px' }}>CORREO ELECTRÓNICO</div>
                      <div style={{ fontFamily:"'Manrope'", fontWeight:600, fontSize:'13.5px', color:'var(--kt-text)' }}>{detailsUser.email}</div>
                    </div>
                  </div>
                </div>
                <div style={{ display:'flex', gap:'12px', padding:'18px 24px', borderTop:'1px solid var(--kt-border-soft)' }}>
                  <button onClick={() => setDetailsOpen(false)} style={{ flex:1, height:'42px', border:'1px solid var(--kt-input-border)', background:'none', color:'var(--kt-text)', cursor:'pointer', fontFamily:"'Manrope'", fontWeight:700, fontSize:'13.5px', borderRadius:'10px' }}>Cerrar</button>
                  <button className="kt-primary" onClick={() => { setDetailsOpen(false); handleEditClick(detailsUser); }} style={{ flex:1, height:'42px', border:'none', borderRadius:'10px', background:'linear-gradient(150deg,#10B981,#059669)', color:'#fff', cursor:'pointer', fontFamily:"'Manrope'", fontWeight:800, fontSize:'13.5px' }}>Editar</button>
                </div>
              </>
            )}
          </div>
        </aside>

        {/* MODAL */}
        <div data-modal style={{ position:'absolute', inset:0, zIndex:50, display:'flex', alignItems:'center', justifyContent:'center', padding:'24px' }}>
          <div onClick={() => setModalOpen(false)} style={{ position:'absolute', inset:0, background:'var(--kt-modal-backdrop)', backdropFilter:'blur(8px)', WebkitBackdropFilter:'blur(8px)' }}></div>
          <div data-modal-panel style={{ position:'relative', width:'100%', maxWidth:'480px', background:'linear-gradient(180deg,var(--kt-modal-bg1),var(--kt-modal-bg2))', border:'1px solid var(--kt-modal-border)', borderRadius:'20px', boxShadow:'var(--kt-shadow-modal)', padding:'28px' }}>
            <div style={{ display:'flex', alignItems:'flex-start', gap:'13px', marginBottom:'22px' }}>
              <div style={{ width:'40px', height:'40px', flex:'none', borderRadius:'11px', background:'linear-gradient(150deg,rgba(16,185,129,.2),rgba(16,185,129,.08))', border:'1px solid rgba(16,185,129,.3)', display:'grid', placeItems:'center', color:'#10B981' }}><UserPlus size={20} /></div>
              <div>
                <h3 style={{ fontFamily:"'Inter'", fontWeight:600, fontSize:'19px', letterSpacing:'-.6px', color:'var(--kt-heading)', margin:0 }}><span className="kt-only-create">{editId ? 'Editar Docente' : 'Nuevo Docente'}</span></h3>
                <p style={{ fontFamily:"'Manrope'", fontWeight:500, fontSize:'13px', color:'var(--kt-muted)', margin:'2px 0 0' }}><span className="kt-only-create">{editId ? 'Actualiza los datos de acceso' : 'Registra un nuevo acceso al sistema'}</span></p>
              </div>
              <button onClick={() => setModalOpen(false)} aria-label="Cerrar" style={{ marginLeft:'auto', width:'30px', height:'30px', display:'grid', placeItems:'center', border:'none', background:'var(--kt-chip-bg)', borderRadius:'9px', color:'var(--kt-muted)', cursor:'pointer' }}><X size={16} /></button>
            </div>

            <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
              <div>
                <label style={{ display:'block', fontFamily:"'Inter'", fontWeight:600, fontSize:'12px', color:'var(--kt-text)', marginBottom:'7px' }}>Nombre Completo</label>
                <input value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Ej. Dra. Laura Fuentes" style={{ width:'100%', height:'44px', padding:'0 14px', border:'1.5px solid var(--kt-input-border)', borderRadius:'11px', background:'var(--kt-input-bg)', color:'var(--kt-heading)', fontWeight:500, fontSize:'14px', transition:'border-color .2s,box-shadow .2s' }} />
              </div>
              <div>
                <label style={{ display:'block', fontFamily:"'Inter'", fontWeight:600, fontSize:'12px', color:'var(--kt-text)', marginBottom:'7px' }}>Correo Electrónico</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="nombre@katedra.com" style={{ width:'100%', height:'44px', padding:'0 14px', border:'1.5px solid var(--kt-input-border)', borderRadius:'11px', background:'var(--kt-input-bg)', color:'var(--kt-heading)', fontWeight:500, fontSize:'14px', transition:'border-color .2s,box-shadow .2s' }} />
              </div>
              <div>
                <label style={{ display:'block', fontFamily:"'Inter'", fontWeight:600, fontSize:'12px', color:'var(--kt-text)', marginBottom:'7px' }}>Rol de Sistema</label>
                <div style={{ display:'flex', gap:'8px', padding:'4px', background:'var(--kt-input-bg)', border:'1px solid var(--kt-input-border)', borderRadius:'12px' }}>
                  <button data-role-opt="Libre" onClick={() => setFormRole('Libre')} style={{ flex:1, height:'38px', border:'none', borderRadius:'9px', cursor:'pointer', fontFamily:"'Manrope'", fontWeight:700, fontSize:'13px', transition:'all .2s' }}>Libre</button>
                  <button data-role-opt="Premium" onClick={() => setFormRole('Premium')} style={{ flex:1, height:'38px', border:'none', borderRadius:'9px', cursor:'pointer', fontFamily:"'Manrope'", fontWeight:700, fontSize:'13px', transition:'all .2s' }}>Premium</button>
                  <button data-role-opt="Admin" onClick={() => setFormRole('Admin')} style={{ flex:1, height:'38px', border:'none', borderRadius:'9px', cursor:'pointer', fontFamily:"'Manrope'", fontWeight:700, fontSize:'13px', transition:'all .2s' }}>Admin</button>
                </div>
              </div>
              <div>
                <label style={{ display:'block', fontFamily:"'Inter'", fontWeight:600, fontSize:'12px', color:'var(--kt-text)', marginBottom:'7px' }}>Estado de la Cuenta</label>
                <div style={{ display:'flex', gap:'10px' }}>
                  <button data-status-opt="Activo" onClick={() => setFormStatus('Activo')} style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:'8px', height:'42px', border:'1.5px solid', borderRadius:'11px', cursor:'pointer', fontFamily:"'Manrope'", fontWeight:700, fontSize:'13px', transition:'all .2s' }}>
                    <span style={{ width:'7px', height:'7px', borderRadius:'50%', background:'#10B981' }}></span>Activo
                  </button>
                  <button data-status-opt="Inactivo" onClick={() => setFormStatus('Inactivo')} style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:'8px', height:'42px', border:'1.5px solid', borderRadius:'11px', cursor:'pointer', fontFamily:"'Manrope'", fontWeight:700, fontSize:'13px', transition:'all .2s' }}>
                    <span style={{ width:'7px', height:'7px', borderRadius:'50%', background:'#F43F5E' }}></span>Inactivo
                  </button>
                </div>
              </div>
            </div>
            
            {formError && (
              <div style={{ marginTop:'16px', padding:'10px', background:'rgba(244,63,94,.1)', border:'1px solid rgba(244,63,94,.3)', borderRadius:'10px', color:'#F43F5E', fontFamily:"'Manrope'", fontSize:'12px', fontWeight:600 }}>{formError}</div>
            )}

            <div style={{ display:'flex', alignItems:'center', justifyContent:'flex-end', gap:'12px', marginTop:'26px' }}>
              <button onClick={() => setModalOpen(false)} style={{ height:'44px', padding:'0 18px', border:'none', background:'none', color:'var(--kt-muted)', cursor:'pointer', fontFamily:"'Manrope'", fontWeight:700, fontSize:'14px' }}>Cancelar</button>
              <button className="kt-primary" onClick={handleSubmit} style={{ height:'44px', padding:'0 22px', border:'none', borderRadius:'11px', background:'linear-gradient(150deg,#10B981,#059669)', color:'#fff', cursor:'pointer', fontFamily:"'Manrope'", fontWeight:800, fontSize:'14px', boxShadow:'0 12px 26px -12px rgba(16,185,129,.7)', transition:'transform .18s,box-shadow .25s' }}>
                <span className="kt-only-create">{isSubmitting ? 'Guardando...' : (editId ? 'Guardar Cambios' : 'Registrar Docente')}</span>
              </button>
            </div>
          </div>
        </div>

        {/* DELETE CONFIRMATION MODAL */}
        <div style={{ position:'absolute', inset:0, zIndex:80, display:'flex', alignItems:'center', justifyContent:'center', padding:'24px', opacity: deleteConfirmUser ? 1 : 0, pointerEvents: deleteConfirmUser ? 'auto' : 'none', transition:'opacity .22s ease' }}>
          <div onClick={() => setDeleteConfirmUser(null)} style={{ position:'absolute', inset:0, background:'var(--kt-modal-backdrop)', backdropFilter:'blur(8px)', WebkitBackdropFilter:'blur(8px)' }}></div>
          <div style={{ position:'relative', width:'100%', maxWidth:'400px', background:'linear-gradient(180deg,var(--kt-modal-bg1),var(--kt-modal-bg2))', border:'1px solid var(--kt-modal-border)', borderRadius:'20px', boxShadow:'var(--kt-shadow-modal)', padding:'28px', transform: deleteConfirmUser ? 'scale(1) translateY(0)' : 'scale(.94) translateY(10px)', transition:'transform .3s cubic-bezier(.34,1.56,.64,1)' }}>
            <div style={{ display:'flex', alignItems:'flex-start', gap:'13px', marginBottom:'22px' }}>
              <div style={{ width:'40px', height:'40px', flex:'none', borderRadius:'11px', background:'linear-gradient(150deg,rgba(244,63,94,.2),rgba(244,63,94,.08))', border:'1px solid rgba(244,63,94,.3)', display:'grid', placeItems:'center', color:'#F43F5E' }}><AlertCircle size={20} /></div>
              <div>
                <h3 style={{ fontFamily:"'Inter'", fontWeight:600, fontSize:'19px', letterSpacing:'-.6px', color:'var(--kt-heading)', margin:0 }}>Eliminar Docente</h3>
                <p style={{ fontFamily:"'Manrope'", fontWeight:500, fontSize:'13px', color:'var(--kt-muted)', margin:'2px 0 0' }}>¿Estás seguro de que deseas continuar?</p>
              </div>
            </div>
            
            <p style={{ fontFamily:"'Manrope'", fontWeight:500, fontSize:'14px', color:'var(--kt-text)', marginBottom:'24px', lineHeight:1.5 }}>
              Estás a punto de eliminar a <strong style={{ color:'var(--kt-heading)' }}>{deleteConfirmUser?.nombre}</strong>. Esta acción no se puede deshacer y el usuario perderá su acceso al sistema.
            </p>

            <div style={{ display:'flex', gap:'12px' }}>
              <button onClick={() => setDeleteConfirmUser(null)} style={{ flex:1, height:'44px', border:'1px solid var(--kt-input-border)', background:'none', color:'var(--kt-text)', cursor:'pointer', fontFamily:"'Manrope'", fontWeight:700, fontSize:'13.5px', borderRadius:'11px' }}>Cancelar</button>
              <button onClick={confirmDelete} style={{ flex:1, height:'44px', border:'none', borderRadius:'11px', background:'linear-gradient(150deg,#F43F5E,#BE123C)', color:'#fff', cursor:'pointer', fontFamily:"'Manrope'", fontWeight:800, fontSize:'13.5px', boxShadow:'0 12px 26px -12px rgba(244,63,94,.7)' }}>Sí, Eliminar</button>
            </div>
          </div>
        </div>

        {/* TOASTS */}
        <div data-toasts style={{ position:'absolute', right:'22px', bottom:'22px', zIndex:80, display:'flex', flexDirection:'column', gap:'12px', pointerEvents:'none' }}>
          {toasts.map(t => (
            <div key={t.id} style={{ pointerEvents:'auto', display:'flex', alignItems:'center', gap:'12px', minWidth:'270px', maxWidth:'340px', padding:'13px 15px', borderRadius:'13px', background:'rgba(17,24,39,.94)', backdropFilter:'blur(12px)', WebkitBackdropFilter:'blur(12px)', border:`1px solid rgba(${t.kind==='success'?'16,185,129':t.kind==='warn'?'245,158,11':'244,63,94'},.35)`, boxShadow:'0 18px 40px -16px rgba(0,0,0,.7)', animation:'ktToastIn .55s cubic-bezier(.34,1.56,.64,1) both' }}>
              <span style={{ flex:'none', width:'34px', height:'34px', borderRadius:'10px', display:'grid', placeItems:'center', background:`rgba(${t.kind==='success'?'16,185,129':t.kind==='warn'?'245,158,11':'244,63,94'},.16)`, color:t.kind==='success'?'#34D399':t.kind==='warn'?'#FBBF24':'#FB7185' }}>
                {t.kind === 'success' && <CheckCircle2 size={18} />}
                {t.kind === 'error' && <AlertCircle size={18} />}
                {t.kind === 'warn' && <AlertCircle size={18} />}
              </span>
              <div style={{ minWidth:0 }}>
                <div style={{ fontFamily:"'Manrope'", fontWeight:700, fontSize:'13.5px', color:'#F1F5F9' }}>{t.title}</div>
                <div style={{ fontFamily:"'Manrope'", fontWeight:500, fontSize:'12px', color:'#94A3B8', marginTop:'1px' }}>{t.msg}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

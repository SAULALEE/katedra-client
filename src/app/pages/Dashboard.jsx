import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTemarios } from '../hooks/useTemarios';
import { useAsignaturas } from '../hooks/useAsignaturas';
import { isAdmin, formatRoleDisplay } from '../utils/roleUtils';
import {
  GRADOS_ACADEMICOS,
  GRADO_ACADEMICO_OTRO,
  filtrarTemarios
} from '../utils/asignaturas';
import { prepararContenidoFuente } from '../utils/contenidoFuente';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
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
  Search,
  Heart
} from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { courses, assignmentCourses, assignmentLoading, favoriteCourses, favoritesLoading, aiCalls, sourceContent, sourceLoading, sourceError, refetchStats, fetchCoursesByAsignatura, fetchFavoritos, toggleFavorito, fetchFuenteTemario, clearFuenteTemario, crearTemario, cargarTemario, updateTemario, deleteTemario } = useTemarios();
  const { asignaturas, loading: asignaturasLoading, crearAsignatura, eliminarAsignatura } = useAsignaturas();

  const [theme, setTheme] = useState(() => localStorage.getItem('katedra-theme') || 'light');
  React.useEffect(() => { localStorage.setItem('katedra-theme', theme); }, [theme]);
  const [collapsed, setCollapsed] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [tab, setTab] = useState('file');
  const [zoom, setZoom] = useState(100);
  const [generating, setGenerating] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [deletePending, setDeletePending] = useState(null);
  const [deleteProcessing, setDeleteProcessing] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [sourcePanelCourse, setSourcePanelCourse] = useState(null);
  const [asignaturaActiva, setAsignaturaActiva] = useState(null);
  const [vistaFavoritos, setVistaFavoritos] = useState(false);
  const [favoritoProcessingId, setFavoritoProcessingId] = useState(null);
  const [asignaturaModalOpen, setAsignaturaModalOpen] = useState(false);
  const [nombreAsignatura, setNombreAsignatura] = useState('');
  const [descripcionAsignatura, setDescripcionAsignatura] = useState('');
  const [busquedaBiblioteca, setBusquedaBiblioteca] = useState('');
  const [gradoFiltro, setGradoFiltro] = useState('');

  // Form fields
  const [titulo, setTitulo] = useState('');
  const [asignaturaId, setAsignaturaId] = useState('');
  const [creandoAsignaturaTemario, setCreandoAsignaturaTemario] = useState(false);
  const [nombreNuevaAsignatura, setNombreNuevaAsignatura] = useState('');
  const [descripcionNuevaAsignatura, setDescripcionNuevaAsignatura] = useState('');
  const [gradoSeleccionado, setGradoSeleccionado] = useState('');
  const [gradoOtro, setGradoOtro] = useState('');
  const [modelo, setModelo] = useState('BASICO');
  const [desc, setDesc] = useState('');
  const [subtemas, setSubtemas] = useState('6');
  const [url, setUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const [isProcessing, setIsProcessing] = useState(false);
  const gradoOptions = GRADOS_ACADEMICOS;
  const gradoOtroKey = GRADO_ACADEMICO_OTRO;

  const parseGrado = (gradoAcademico = '') => {
    const grado = String(gradoAcademico).split(',')[0].trim();
    const esConocido = gradoOptions.includes(grado);
    return {
      selected: esConocido ? grado : grado ? gradoOtroKey : '',
      other: esConocido ? '' : grado
    };
  };

  const buildGradoAcademico = () => {
    return gradoSeleccionado === gradoOtroKey ? gradoOtro.trim() : gradoSeleccionado;
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
      setSelectedFile(file);
      setFileName(file.name);
      const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ");
      if (!titulo) setTitulo(`Temario: ${cleanName}`);
      notify('success', 'Archivo cargado', 'Listo para analizar.');
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setFileName(file.name);
      const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ");
      if (!titulo) setTitulo(`Temario: ${cleanName}`);
      notify('success', 'Archivo cargado', 'Listo para analizar.');
    }
  };

  const handleOpenCreate = () => {
    setEditId(null);
    setTab('file');
    setTitulo('');
    setAsignaturaId(asignaturaActiva?.id || '');
    setCreandoAsignaturaTemario(false);
    setNombreNuevaAsignatura('');
    setDescripcionNuevaAsignatura('');
    setGradoSeleccionado('');
    setGradoOtro('');
    setModelo('BASICO');
    setDesc('');
    setSubtemas('6');
    setUrl('');
    setFileName('');
    setSelectedFile(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (c) => {
    setEditId(c.id);
    setTab('manual');
    setTitulo(c.titulo || c.nombre || '');
    setAsignaturaId(c.asignaturaId || c.asignatura?.id || '');
    const parsedGrado = parseGrado(c.gradoAcademico || '');
    setGradoSeleccionado(parsedGrado.selected);
    setGradoOtro(parsedGrado.other);
    setDesc(c.descripcion || '');
    setSubtemas(String(c.temas || 6));
    setModalOpen(true);
  };

  const handleDelete = (e, id, name) => {
    e.stopPropagation();
    setDeletePending({ type: 'temario', id, name });
  };

  const handleAnalyze = async () => {
    if (!asignaturaId) {
      notify('error', 'Falta la asignatura', 'Selecciona o crea una asignatura.');
      return;
    }

    if (!titulo.trim()) {
      notify('error', 'Falta el título', 'Escribe un título para el temario.');
      return;
    }

    if (tab === 'file' && !editId && !selectedFile) {
      notify('error', 'Falta el archivo', 'Selecciona un archivo para cargar el temario.');
      return;
    }

    if (tab === 'web' && !editId && !url.trim()) {
      notify('error', 'Falta la URL', 'Ingresa una URL para cargar el temario.');
      return;
    }

    const gradoAcademico = buildGradoAcademico();
    if (!gradoAcademico) {
      notify('error', 'Falta el grado académico', 'Selecciona un grado académico.');
      return;
    }

    setIsProcessing(true);

    if (editId) {
      if (updateTemario) {
        const result = await updateTemario(editId, {
          titulo,
          descripcion: desc,
          asignaturaId,
          gradoAcademico
        });
        setIsProcessing(false);
        if (result.success) {
          setModalOpen(false);
          notify('success', 'Temario actualizado', `${titulo} fue modificado.`);
        } else {
          notify('error', 'No se pudo actualizar', result.error);
        }
        return;
      }
      setIsProcessing(false);
      notify('error', 'No se pudo actualizar', 'El flujo de edición no está disponible.');
      return;
    }

    // CREATE Flow
    setModalOpen(false);
    setGenerating(true);

    const origenMap = { file: 'PDF', web: 'Enlace Web', manual: 'Manual' };
    const payload = {
      titulo,
      asignaturaId,
      gradoAcademico,
      modelo,
      descripcion: desc,
      temas: parseInt(subtemas) || 6,
      origen: origenMap[tab],
      detalleOrigen: tab === 'file' ? fileName : tab === 'web' ? url : ''
    };

    let result = { success: false };
    if (tab === 'file' && cargarTemario) {
      result = await cargarTemario('archivo', { file: selectedFile, titulo, asignaturaId, gradoAcademico, modelo });
    } else if (tab === 'web' && cargarTemario) {
      result = await cargarTemario('url', { url, titulo, asignaturaId, gradoAcademico, modelo });
    } else if (crearTemario) {
      result = await crearTemario(payload);
    }
    
    // Simulate generation time if needed, but crearTemario should await
    setGenerating(false);
    setIsProcessing(false);
    if (result.success) {
      await Promise.all([
        refetchStats(),
        fetchCoursesByAsignatura(asignaturaActiva.id)
      ]);
      notify('success', 'Temario generado', `${titulo} se estructuró con IA (${subtemas} módulos).`);
    } else {
      notify('error', 'No se pudo crear', result.error || 'Revisa los datos e intenta nuevamente.');
    }
  };

  const calculatePct = (done, total) => {
    if (!total) return 0;
    return Math.round((done / total) * 100);
  };

  const handleOpenFuente = async (course) => {
    setOpenMenuId(null);
    setSourcePanelCourse(course);
    await fetchFuenteTemario(course.id);
  };

  const handleCloseFuente = () => {
    setSourcePanelCourse(null);
    clearFuenteTemario();
  };

  const handleOpenAsignatura = async (asignaturaSeleccionada) => {
    const result = await fetchCoursesByAsignatura(asignaturaSeleccionada.id);
    if (result.success) {
      setAsignaturaActiva(asignaturaSeleccionada);
      setVistaFavoritos(false);
      setBusquedaBiblioteca('');
      setGradoFiltro('');
    } else {
      notify('error', 'No se pudieron cargar los temarios', result.error);
    }
  };

  const handleOpenFavoritos = async () => {
    const result = await fetchFavoritos();
    if (result.success) {
      setAsignaturaActiva(null);
      setVistaFavoritos(true);
    } else {
      notify('error', 'No se pudieron cargar los favoritos', result.error);
    }
  };

  const handleToggleFavorito = async (event, course) => {
    event.stopPropagation();
    if (favoritoProcessingId) return;

    setFavoritoProcessingId(course.id);
    const nuevoEstado = !course.favorito;
    const result = await toggleFavorito(course.id, nuevoEstado);
    setFavoritoProcessingId(null);

    if (!result.success) {
      notify('error', 'No se pudo actualizar Favoritos', result.error);
    }
  };

  const handleCreateAsignatura = async (event) => {
    event.preventDefault();
    if (!nombreAsignatura.trim()) {
      notify('error', 'Falta el nombre', 'Escribe el nombre de la asignatura.');
      return;
    }

    const result = await crearAsignatura({
      nombre: nombreAsignatura.trim(),
      descripcion: descripcionAsignatura.trim()
    });
    if (result.success) {
      setAsignaturaModalOpen(false);
      setNombreAsignatura('');
      setDescripcionAsignatura('');
      notify('success', 'Asignatura creada', 'La biblioteca fue actualizada.');
    } else {
      notify('error', 'No se pudo crear', result.error);
    }
  };

  const handleDeleteAsignatura = (asignaturaSeleccionada) => {
    setDeletePending({ type: 'asignatura', id: asignaturaSeleccionada.id, name: asignaturaSeleccionada.nombre });
  };

  const handleConfirmDelete = async () => {
    if (!deletePending || deleteProcessing) return;
    setDeleteProcessing(true);

    const esAsignatura = deletePending.type === 'asignatura';
    const result = esAsignatura
      ? await eliminarAsignatura(deletePending.id)
      : await deleteTemario(deletePending.id);

    setDeleteProcessing(false);
    if (result.success) {
      notify('success', esAsignatura ? 'Asignatura eliminada' : 'Temario eliminado', `${deletePending.name} fue removido.`);
      setDeletePending(null);
      if (!esAsignatura && asignaturaActiva) {
        await fetchCoursesByAsignatura(asignaturaActiva.id);
      }
      return;
    }

    notify(
      'error',
      esAsignatura && result.status === 409 ? 'La asignatura contiene temarios' : 'No se pudo eliminar',
      result.error
    );
    setDeletePending(null);
  };

  const handleCreateAsignaturaTemario = async () => {
    if (!nombreNuevaAsignatura.trim()) {
      notify('error', 'Falta el nombre', 'Escribe el nombre de la asignatura.');
      return;
    }

    const result = await crearAsignatura({
      nombre: nombreNuevaAsignatura.trim(),
      descripcion: descripcionNuevaAsignatura.trim()
    });
    if (result.success) {
      setAsignaturaId(result.asignatura.id);
      setCreandoAsignaturaTemario(false);
      setNombreNuevaAsignatura('');
      setDescripcionNuevaAsignatura('');
      notify('success', 'Asignatura creada', 'La nueva asignatura quedó seleccionada.');
    } else {
      notify('error', 'No se pudo crear', result.error);
    }
  };

  const temariosFiltrados = filtrarTemarios(assignmentCourses, {
    busqueda: busquedaBiblioteca,
    grado: gradoFiltro
  });
  const asignaturaSeleccionada = asignaturaActiva;
  const mostrandoTemarios = Boolean(asignaturaSeleccionada || vistaFavoritos);
  const temariosVisibles = vistaFavoritos ? favoriteCourses : temariosFiltrados;
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
        .markdown-body h1,.markdown-body h2,.markdown-body h3,.markdown-body h4{font-family:'Inter',sans-serif;font-weight:600;color:var(--kt-heading);margin:24px 0 12px}
        .markdown-body h1:first-child,.markdown-body h2:first-child,.markdown-body h3:first-child{margin-top:0}
        .markdown-body h1{font-size:24px}.markdown-body h2{font-size:20px}.markdown-body h3{font-size:17px}
        .markdown-body p,.markdown-body li{font-family:'Manrope',sans-serif;font-weight:500;font-size:14.5px;line-height:1.75;color:var(--kt-text);margin-bottom:14px}
        .markdown-body ul,.markdown-body ol{margin:0 0 16px 24px;padding:0}
        .markdown-body strong{color:var(--kt-heading);font-weight:800}
        .markdown-body code{font-family:'JetBrains Mono',monospace;font-size:12.5px;padding:2px 6px;border-radius:6px;background:var(--kt-chip-bg);color:var(--kt-heading)}
        .markdown-body pre{background:var(--kt-bg2);color:var(--kt-text);padding:16px;border-radius:12px;overflow-x:auto;margin-bottom:16px;border:1px solid var(--kt-border)}
        .markdown-body pre code{background:transparent;padding:0;color:inherit;font-size:13px}
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
        data-kt-modal={modalOpen ? "true" : "false"}
        data-kt-modal-mode={editId ? "edit" : "create"}
        data-kt-tab={tab}
        data-kt-notif={notifOpen ? "true" : "false"}
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
            {isAdmin(user) && (
              <Link to="/usuarios" className="kt-nav kt-navrow" style={{ display:'flex', alignItems:'center', gap:'13px', padding:'11px 12px', borderRadius:'11px', textDecoration:'none', background: location.pathname === '/usuarios' ? 'linear-gradient(120deg,rgba(16,185,129,.16),rgba(16,185,129,.06))' : 'transparent', border: location.pathname === '/usuarios' ? '1px solid rgba(16,185,129,.28)' : '1px solid transparent', color: location.pathname === '/usuarios' ? 'var(--kt-heading)' : 'var(--kt-muted)' }}>
                <span style={{ flex:'none', width:'20px', display:'grid', placeItems:'center', color: location.pathname === '/usuarios' ? '#10B981' : 'inherit' }}><UsersIcon size={20} /></span>
                <span className="kt-sidelabel" style={{ fontFamily:"'Manrope'", fontWeight:location.pathname === '/usuarios' ? 700 : 600, fontSize:'14px' }}>Usuarios</span>
              </Link>
            )}
            <Link to="/dashboard" className="kt-nav kt-navrow" style={{ display:'flex', alignItems:'center', gap:'13px', padding:'11px 12px', borderRadius:'11px', textDecoration:'none', background: location.pathname === '/dashboard' ? 'linear-gradient(120deg,rgba(16,185,129,.16),rgba(16,185,129,.06))' : 'transparent', border: location.pathname === '/dashboard' ? '1px solid rgba(16,185,129,.28)' : '1px solid transparent', color: location.pathname === '/dashboard' ? 'var(--kt-heading)' : 'var(--kt-muted)' }}>
              <span style={{ flex:'none', width:'20px', display:'grid', placeItems:'center', color: location.pathname === '/dashboard' ? '#10B981' : 'inherit' }}><FolderDot size={20} /></span>
              <span className="kt-sidelabel" style={{ fontFamily:"'Manrope'", fontWeight:location.pathname === '/dashboard' ? 700 : 600, fontSize:'14px' }}>{asignaturaSeleccionada ? 'Mis Temarios' : 'Mis Asignaturas'}</span>
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
          <header className="kt-main-pad" style={{ display:'flex', alignItems:'center', gap:'18px', padding:'26px 32px', borderBottom:'1px solid var(--kt-border-soft)' }}>
            <div style={{ minWidth:0 }}>
              <h1 className="kt-headtitle" style={{ fontFamily:"'Inter'", fontWeight:600, fontSize:'27px', lineHeight:1.15, letterSpacing:'-1.2px', color:'var(--kt-heading)', margin:0 }}>{vistaFavoritos ? 'Favoritos' : asignaturaSeleccionada ? 'Mis Temarios' : 'Mis Asignaturas'}</h1>
              <p style={{ fontFamily:"'Manrope'", fontWeight:500, fontSize:'13.5px', color:'var(--kt-muted)', margin:'3px 0 0' }}>{vistaFavoritos ? 'Tus temarios favoritos' : asignaturaSeleccionada ? 'Temarios de la asignatura' : 'Administra tus asignaturas'}</p>
            </div>
            
            <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:'12px' }}>
              {/* Zoom controls */}
              <div className="kt-zoom" style={{ display:'flex', alignItems:'center', gap:'4px', height:'40px', padding:'0 5px', border:'1px solid var(--kt-chip-border)', background:'var(--kt-chip-bg)', borderRadius:'11px' }}>
                <button className="kt-ghostbtn" onClick={() => setZoom(Math.max(40, zoom - 10))} aria-label="Menos" style={{ width:'28px', height:'28px', display:'grid', placeItems:'center', border:'none', background:'none', borderRadius:'8px', color:'var(--kt-muted)', cursor:'pointer' }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M5 12h14"></path></svg>
                </button>
                <span style={{ minWidth:'42px', textAlign:'center', fontFamily:"'Manrope'", fontWeight:700, fontSize:'12.5px', color:'var(--kt-text)' }}>{zoom}%</span>
                <button className="kt-ghostbtn" onClick={() => setZoom(Math.min(140, zoom + 10))} aria-label="Más" style={{ width:'28px', height:'28px', display:'grid', placeItems:'center', border:'none', background:'none', borderRadius:'8px', color:'var(--kt-muted)', cursor:'pointer' }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M12 5v14M5 12h14"></path></svg>
                </button>
              </div>

              {/* Notifications */}
              <div style={{ position:'relative' }}>
                <button onClick={() => setNotifOpen(!notifOpen)} aria-label="Notificaciones" style={{ position:'relative', width:'42px', height:'42px', display:'grid', placeItems:'center', border:'1px solid var(--kt-chip-border)', background:'var(--kt-chip-bg)', borderRadius:'11px', color:'var(--kt-muted)', cursor:'pointer' }}>
                  <Bell size={19} />
                  {unreadCount > 0 && (
                    <span style={{ position:'absolute', top:'5px', right:'5px', minWidth:'16px', height:'16px', padding:'0 4px', borderRadius:'8px', background:'#F43F5E', color:'#fff', fontFamily:"'Manrope'", fontWeight:800, fontSize:'9.5px', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 0 0 2px var(--kt-panel-bg)' }}>{unreadCount}</span>
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
                      <span data-notif-icon data-kind={n.kind} style={{ flex:'none', width:'30px', height:'30px', borderRadius:'9px', display:'grid', placeItems:'center' }}>
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

              {asignaturaSeleccionada && (
                <button className="kt-primary" onClick={handleOpenCreate} style={{ flex:'none', whiteSpace:'nowrap', display:'flex', alignItems:'center', gap:'8px', height:'44px', padding:'0 20px', border:'none', borderRadius:'11px', background:'linear-gradient(150deg,#10B981,#059669)', color:'#fff', cursor:'pointer', fontFamily:"'Manrope'", fontWeight:800, fontSize:'14px', boxShadow:'0 12px 26px -12px rgba(16,185,129,.7)', transition:'transform .18s,box-shadow .25s' }}>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"></path></svg>
                  Cargar Temario
                </button>
              )}
              {!mostrandoTemarios && (
                <button onClick={handleOpenFavoritos} style={{ flex:'none', whiteSpace:'nowrap', display:'flex', alignItems:'center', gap:'8px', height:'44px', padding:'0 16px', border:'1px solid var(--kt-chip-border)', borderRadius:'11px', background:'var(--kt-chip-bg)', color:'var(--kt-heading)', cursor:'pointer', fontFamily:"'Manrope'", fontWeight:800, fontSize:'13.5px' }}>
                  <Heart size={17} />
                  Favoritos
                </button>
              )}
              {!mostrandoTemarios && (
                <button className="kt-primary" onClick={() => setAsignaturaModalOpen(true)} style={{ flex:'none', whiteSpace:'nowrap', display:'flex', alignItems:'center', gap:'8px', height:'44px', padding:'0 20px', border:'none', borderRadius:'11px', background:'linear-gradient(150deg,#10B981,#059669)', color:'#fff', cursor:'pointer', fontFamily:"'Manrope'", fontWeight:800, fontSize:'14px', boxShadow:'0 12px 26px -12px rgba(16,185,129,.7)', transition:'transform .18s,box-shadow .25s' }}>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"></path></svg>
                  + Agregar asignatura
                </button>
              )}
            </div>
          </header>

          <div className="kt-main-pad" style={{ flex:1, overflow:'auto', padding:'28px 32px 60px' }}>
            <div style={{ maxWidth:'1180px', margin:'0 auto' }}>

              {/* STAT WIDGETS */}
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:'18px', marginBottom:'26px' }}>
                <div className="kt-stat" onClick={asignaturaSeleccionada ? handleOpenCreate : undefined} style={{ display:'flex', flexDirection:'column', gap:'14px', padding:'20px', background:'var(--kt-panel-bg)', border:'1px solid var(--kt-panel-border)', borderRadius:'16px', backdropFilter:'blur(12px)' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                    <div style={{ width:'44px', height:'44px', flex:'none', borderRadius:'12px', background:'rgba(16,185,129,.14)', color:'#10B981', display:'grid', placeItems:'center' }}><svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"></path></svg></div>
                    <div style={{ fontFamily:"'Manrope'", fontWeight:700, fontSize:'10px', letterSpacing:'1.2px', textTransform:'uppercase', color:'var(--kt-label)' }}>Materiales</div>
                  </div>
                  <div style={{ display:'flex', alignItems:'baseline', gap:'8px' }}>
                    <span style={{ fontFamily:"'Inter'", fontWeight:600, fontSize:'32px', letterSpacing:'-1.4px', color:'var(--kt-heading)' }}>{courses.length}</span>
                  </div>
                  <div className="kt-stat-action" style={{ display:'flex', alignItems:'center', gap:'6px', fontFamily:"'Manrope'", fontWeight:700, fontSize:'12px', color:'#10B981' }}>Cargar nuevo <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"></path></svg></div>
                </div>

                <div className="kt-stat" style={{ display:'flex', flexDirection:'column', gap:'14px', padding:'20px', background:'var(--kt-panel-bg)', border:'1px solid var(--kt-panel-border)', borderRadius:'16px', backdropFilter:'blur(12px)' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                    <div style={{ width:'44px', height:'44px', flex:'none', borderRadius:'12px', background:'rgba(245,158,11,.14)', color:'#F59E0B', display:'grid', placeItems:'center' }}><svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9z"></path></svg></div>
                    <div style={{ fontFamily:"'Manrope'", fontWeight:700, fontSize:'10px', letterSpacing:'1.2px', textTransform:'uppercase', color:'var(--kt-label)' }}>Peticiones IA</div>
                  </div>
                  <div style={{ display:'flex', alignItems:'baseline', gap:'8px' }}>
                    <span style={{ fontFamily:"'Inter'", fontWeight:600, fontSize:'32px', letterSpacing:'-1.4px', color:'var(--kt-heading)' }}>{aiCalls}</span>
                  </div>
                  <div style={{ display:'inline-flex', alignItems:'center', gap:'6px', alignSelf:'flex-start', padding:'3px 9px', borderRadius:'8px', background:'rgba(245,158,11,.14)', fontFamily:"'Manrope'", fontWeight:700, fontSize:'11px', color:'#B45309' }}>✦ Ilimitado Premium</div>
                </div>
              </div>

              {/* SECTION HEADING */}
              <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'16px' }}>
                {mostrandoTemarios && (
                  <button className="kt-iconbtn" onClick={() => { setAsignaturaActiva(null); setVistaFavoritos(false); setBusquedaBiblioteca(''); setGradoFiltro(''); }} aria-label="Volver a asignaturas" style={{ width:'32px', height:'32px', display:'grid', placeItems:'center', border:'none', background:'var(--kt-chip-bg)', borderRadius:'9px', color:'var(--kt-muted)', cursor:'pointer' }}>
                    <ChevronLeft size={17} />
                  </button>
                )}
                <h2 style={{ fontFamily:"'Inter'", fontWeight:600, fontSize:'17px', letterSpacing:'-.5px', color:'var(--kt-heading)', margin:0 }}>
                  {vistaFavoritos ? 'Favoritos' : asignaturaSeleccionada ? asignaturaSeleccionada.nombre : 'Mis Asignaturas'}
                </h2>
                <span style={{ padding:'3px 10px', borderRadius:'20px', background:'var(--kt-chip-bg)', border:'1px solid var(--kt-chip-border)', fontFamily:"'Manrope'", fontWeight:700, fontSize:'11px', color:'var(--kt-muted)' }}>
                  {mostrandoTemarios ? temariosVisibles.length : asignaturas.length}
                </span>
              </div>

              {asignaturaSeleccionada && <div style={{ display:'grid', gridTemplateColumns:'minmax(220px,1fr) minmax(180px,240px)', gap:'12px', marginBottom:'18px' }}>
                <div style={{ position:'relative' }}>
                  <Search size={17} style={{ position:'absolute', left:'14px', top:'50%', transform:'translateY(-50%)', color:'var(--kt-muted)', pointerEvents:'none' }} />
                  <input
                    type="search"
                    value={busquedaBiblioteca}
                    onChange={e => setBusquedaBiblioteca(e.target.value)}
                    placeholder="Buscar temarios"
                    aria-label="Buscar temarios"
                    style={{ width:'100%', height:'44px', padding:'0 14px 0 42px', border:'1.5px solid var(--kt-input-border)', borderRadius:'11px', background:'var(--kt-input-bg)', color:'var(--kt-heading)', fontFamily:"'Manrope'", fontWeight:600, fontSize:'13.5px' }}
                  />
                </div>
                <select
                  value={gradoFiltro}
                  onChange={e => setGradoFiltro(e.target.value)}
                  aria-label="Filtrar por grado académico"
                  style={{ width:'100%', height:'44px', padding:'0 14px', border:'1.5px solid var(--kt-input-border)', borderRadius:'11px', background:'var(--kt-input-bg)', color:'var(--kt-heading)', fontFamily:"'Manrope'", fontWeight:700, fontSize:'13.5px', cursor:'pointer' }}
                >
                  <option value="">Todos los grados</option>
                  {gradoOptions.map(grado => <option key={grado} value={grado}>{grado}</option>)}
                  <option value={gradoOtroKey}>{gradoOtroKey}</option>
                </select>
              </div>}

              {/* CARD GRID */}
              <div data-grid style={{ display:'grid', gridTemplateColumns: mostrandoTemarios ? `repeat(auto-fill,minmax(${Math.round(300 * zoom / 100)}px,1fr))` : 'repeat(auto-fit,minmax(280px,360px))', justifyContent: mostrandoTemarios ? 'stretch' : 'center', gap:'20px', alignItems:'stretch', transition:'grid-template-columns .2s' }}>
                
                {generating && (
                  <div style={{ display:'flex', flexDirection:'column', padding:'20px', minHeight:'230px', background:'var(--kt-card-bg)', border:'1px solid var(--kt-panel-border)', borderRadius:'16px', boxShadow:'var(--kt-shadow-card)' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'18px' }}>
                      <div style={{ width:'40px', height:'40px', borderRadius:'11px', background:'rgba(16,185,129,.14)', display:'grid', placeItems:'center', color:'#10B981' }}><span style={{ width:'18px', height:'18px', border:'2.4px solid rgba(16,185,129,.3)', borderTopColor:'#10B981', borderRadius:'50%', display:'block', animation:'ktSpin .7s linear infinite' }}></span></div>
                      <div style={{ fontFamily:"'Manrope'", fontWeight:700, fontSize:'12px', color:'#10B981' }}>Analizando con IA…</div>
                    </div>
                    <div style={{ height:'16px', width:'70%', borderRadius:'6px', marginBottom:'10px', background:'linear-gradient(90deg,var(--kt-chip-bg) 25%,var(--kt-chip-hover) 50%,var(--kt-chip-bg) 75%)', backgroundSize:'720px 100%', animation:'ktShimmer 1.3s infinite linear' }}></div>
                    <div style={{ height:'12px', width:'45%', borderRadius:'6px', marginBottom:'22px', background:'linear-gradient(90deg,var(--kt-chip-bg) 25%,var(--kt-chip-hover) 50%,var(--kt-chip-bg) 75%)', backgroundSize:'720px 100%', animation:'ktShimmer 1.3s infinite linear' }}></div>
                    <div style={{ height:'8px', width:'100%', borderRadius:'6px', marginTop:'auto', background:'linear-gradient(90deg,var(--kt-chip-bg) 25%,var(--kt-chip-hover) 50%,var(--kt-chip-bg) 75%)', backgroundSize:'720px 100%', animation:'ktShimmer 1.3s infinite linear' }}></div>
                  </div>
                )}

                {!mostrandoTemarios && asignaturasLoading && asignaturas.length === 0 && (
                   <div style={{ padding:'40px', textAlign:'center', color:'var(--kt-muted)' }}>Cargando asignaturas...</div>
                )}

                {asignaturaSeleccionada && assignmentLoading && (
                   <div style={{ padding:'40px', textAlign:'center', color:'var(--kt-muted)' }}>Cargando temarios...</div>
                )}

                {asignaturaSeleccionada && !assignmentLoading && temariosVisibles.length === 0 && (
                  <div style={{ padding:'40px', textAlign:'center', color:'var(--kt-muted)', fontFamily:"'Manrope'", fontWeight:600 }}>No se encontraron temarios con estos filtros.</div>
                )}

                {vistaFavoritos && favoritesLoading && (
                   <div style={{ padding:'40px', textAlign:'center', color:'var(--kt-muted)' }}>Cargando favoritos...</div>
                )}

                {vistaFavoritos && !favoritesLoading && temariosVisibles.length === 0 && (
                  <div style={{ padding:'40px', textAlign:'center', color:'var(--kt-muted)', fontFamily:"'Manrope'", fontWeight:600 }}>Todavía no hay temarios favoritos.</div>
                )}

                {!mostrandoTemarios && asignaturas.map((item) => (
                  <div key={item.id} className="kt-scard" data-status="Activo" style={{ display:'flex', flexDirection:'column', padding:'20px', minHeight:'230px', background:'var(--kt-card-bg)', border:'1px solid var(--kt-panel-border)', borderRadius:'16px', backdropFilter:'blur(12px)' }}>
                    <div className="kt-accentbar" style={{ position:'absolute', top:0, left:0, right:0, height:'4px' }}></div>
                    <div style={{ display:'flex', alignItems:'flex-start', gap:'12px', marginBottom:'16px' }}>
                      <div className="kt-cardicon" style={{ width:'42px', height:'42px', flex:'none', borderRadius:'12px', display:'grid', placeItems:'center' }}><FolderDot size={21} /></div>
                      <span className="kt-statuspill" style={{ marginLeft:'auto', display:'inline-flex', alignItems:'center', gap:'6px', padding:'5px 11px', borderRadius:'20px', fontFamily:"'Manrope'", fontWeight:700, fontSize:'10.5px', letterSpacing:'.4px' }}>
                        <span style={{ width:'6px', height:'6px', borderRadius:'50%', background:'currentColor' }}></span>Asignatura
                      </span>
                    </div>
                    <div style={{ fontFamily:"'Inter'", fontWeight:600, fontSize:'17px', letterSpacing:'-.5px', color:'var(--kt-heading)', lineHeight:1.25 }}>{item.nombre}</div>
                    <div style={{ fontFamily:"'Manrope'", fontWeight:500, fontSize:'13px', color:'var(--kt-muted)', marginTop:'8px', lineHeight:1.5 }}>{item.descripcion || 'Sin descripción'}</div>
                    <div style={{ marginTop:'auto', display:'flex', alignItems:'center', paddingTop:'14px', borderTop:'1px solid var(--kt-border-soft)' }}>
                      <button className="kt-iconbtn del" onClick={() => handleDeleteAsignatura(item)} style={{ display:'flex', alignItems:'center', gap:'6px', height:'32px', padding:'0 11px', border:'none', background:'var(--kt-chip-bg)', borderRadius:'9px', color:'var(--kt-muted)', cursor:'pointer', fontFamily:"'Manrope'", fontWeight:700, fontSize:'12px' }}>Eliminar</button>
                      <button className="kt-scard-open" onClick={() => handleOpenAsignatura(item)} style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:'6px', height:'32px', padding:'0 13px', border:'none', borderRadius:'9px', background:'rgba(var(--sc-rgb),.14)', color:'var(--sc)', cursor:'pointer', fontFamily:"'Manrope'", fontWeight:700, fontSize:'12.5px', transition:'gap .2s' }}>Abrir <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M9 6l6 6-6 6"></path></svg></button>
                    </div>
                  </div>
                ))}

                {mostrandoTemarios && temariosVisibles.map(c => {
                  const done = c.done || c.temas || 6;
                  const total = c.temas || 6;
                  const pct = calculatePct(done, total);
                  
                  return (
                    <div key={c.id} className="kt-scard" data-status={c.estado || 'Activo'} style={{ display:'flex', flexDirection:'column', padding:'20px', minHeight:'230px', background:'var(--kt-card-bg)', border:'1px solid var(--kt-panel-border)', borderRadius:'16px', backdropFilter:'blur(12px)' }}>
                      <div className="kt-accentbar" style={{ position:'absolute', top:0, left:0, right:0, height:'4px' }}></div>
                      <div style={{ display:'flex', alignItems:'flex-start', gap:'12px', marginBottom:'16px' }}>
                        <div className="kt-cardicon" style={{ width:'42px', height:'42px', flex:'none', borderRadius:'12px', display:'grid', placeItems:'center' }}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><path d="M14 2v6h6"></path></svg></div>
                        <button
                          type="button"
                          onClick={(event) => handleToggleFavorito(event, c)}
                          disabled={favoritoProcessingId === c.id}
                          aria-label={c.favorito ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                          aria-pressed={Boolean(c.favorito)}
                          style={{ marginLeft:'auto', width:'34px', height:'34px', display:'grid', placeItems:'center', border:'1px solid var(--kt-chip-border)', borderRadius:'10px', background:c.favorito ? 'rgba(244,63,94,.12)' : 'var(--kt-chip-bg)', color:c.favorito ? '#F43F5E' : 'var(--kt-muted)', cursor:favoritoProcessingId === c.id ? 'wait' : 'pointer', opacity:favoritoProcessingId === c.id ? .65 : 1 }}
                        >
                          <Heart size={18} fill={c.favorito ? 'currentColor' : 'none'} />
                        </button>
                        <span className="kt-statuspill" style={{ display:'inline-flex', alignItems:'center', gap:'6px', padding:'5px 11px', borderRadius:'20px', fontFamily:"'Manrope'", fontWeight:700, fontSize:'10.5px', letterSpacing:'.4px' }}>
                          <span style={{ width:'6px', height:'6px', borderRadius:'50%', background:'currentColor' }}></span>{c.estado || 'Activo'}
                        </span>
                      </div>
                      <div style={{ fontFamily:"'Inter'", fontWeight:600, fontSize:'17px', letterSpacing:'-.5px', color:'var(--kt-heading)', lineHeight:1.25 }}>{c.titulo || c.nombre}</div>
                      <div style={{ fontFamily:"'Manrope'", fontWeight:500, fontSize:'13px', color:'var(--kt-muted)', marginTop:'3px' }}>{c.asignatura || c.curso || 'Asignatura'}</div>

                      <div style={{ marginTop:'16px', marginBottom:'16px' }}>
                        <div style={{ display:'flex', justifyContent:'space-between', fontFamily:"'Manrope'", fontWeight:600, fontSize:'11px', color:'var(--kt-muted)', marginBottom:'6px' }}>
                          <span>Progreso</span><span>{pct}%</span>
                        </div>
                        <div style={{ height:'6px', borderRadius:'6px', background:'var(--kt-chip-bg)', overflow:'hidden' }}>
                          <div className="kt-progressfill" style={{ height:'100%', borderRadius:'6px', width:`${pct}%`, transition:'width .6s cubic-bezier(.4,0,.2,1)' }}></div>
                        </div>
                      </div>

                      <div style={{ marginTop:'auto', display:'flex', alignItems:'center', paddingTop:'14px', borderTop:'1px solid var(--kt-border-soft)' }}>
                        <span style={{ fontFamily:"'Manrope'", fontWeight:600, fontSize:'12px', color:'var(--kt-faint)' }}>{total} subtemas</span>
                        <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:'6px' }}>
                          <button className="kt-iconbtn" onClick={() => handleOpenEdit(c)} aria-label="Editar" style={{ width:'32px', height:'32px', display:'grid', placeItems:'center', border:'none', background:'var(--kt-chip-bg)', borderRadius:'9px', color:'var(--kt-muted)', cursor:'pointer', transition:'background .18s,color .18s' }}><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z"></path></svg></button>
                          <button className="kt-iconbtn del" onClick={(e) => handleDelete(e, c.id, c.titulo || c.nombre)} aria-label="Eliminar" style={{ width:'32px', height:'32px', display:'grid', placeItems:'center', border:'none', background:'var(--kt-chip-bg)', borderRadius:'9px', color:'var(--kt-muted)', cursor:'pointer', transition:'background .18s,color .18s' }}><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path></svg></button>
                          <div style={{ position:'relative' }}>
                            <button className="kt-scard-open" onClick={() => setOpenMenuId(openMenuId === c.id ? null : c.id)} aria-expanded={openMenuId === c.id} style={{ display:'flex', alignItems:'center', gap:'6px', height:'32px', padding:'0 13px', border:'none', borderRadius:'9px', background:'rgba(var(--sc-rgb),.14)', color:'var(--sc)', cursor:'pointer', fontFamily:"'Manrope'", fontWeight:700, fontSize:'12.5px', transition:'gap .2s' }}>Abrir <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M9 6l6 6-6 6"></path></svg></button>
                            {openMenuId === c.id && (
                              <div role="menu" style={{ position:'absolute', right:0, bottom:'40px', zIndex:30, width:'150px', padding:'6px', background:'var(--kt-modal-bg1)', border:'1px solid var(--kt-modal-border)', borderRadius:'11px', boxShadow:'var(--kt-shadow-card)', backdropFilter:'blur(14px)' }}>
                                <button role="menuitem" onClick={() => handleOpenFuente(c)} style={{ width:'100%', height:'36px', padding:'0 10px', border:'none', borderRadius:'8px', background:'transparent', color:'var(--kt-heading)', cursor:'pointer', textAlign:'left', fontFamily:"'Manrope'", fontWeight:700, fontSize:'12.5px' }}>Contenido</button>
                                <button role="menuitem" onClick={() => navigate(`/contenido/${c.id}`)} style={{ width:'100%', height:'36px', padding:'0 10px', border:'none', borderRadius:'8px', background:'transparent', color:'var(--kt-heading)', cursor:'pointer', textAlign:'left', fontFamily:"'Manrope'", fontWeight:700, fontSize:'12.5px' }}>Material</button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {!vistaFavoritos && <div className="kt-newcard" onClick={asignaturaSeleccionada ? handleOpenCreate : () => setAsignaturaModalOpen(true)} style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'12px', minHeight:'230px', padding:'20px', background:'transparent', border:'2px dashed var(--kt-input-border)', borderRadius:'16px', textAlign:'center' }}>
                  <div className="kt-newplus" style={{ width:'56px', height:'56px', borderRadius:'15px', background:'var(--kt-chip-bg)', color:'#10B981', display:'grid', placeItems:'center', transition:'transform .3s cubic-bezier(.34,1.56,.64,1),background .25s,color .25s' }}><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"></path></svg></div>
                  <div style={{ fontFamily:"'Inter'", fontWeight:600, fontSize:'16px', letterSpacing:'-.4px', color:'var(--kt-heading)' }}>{asignaturaSeleccionada ? 'Nuevo Temario' : '+ Agregar asignatura'}</div>
                  <div style={{ fontFamily:"'Manrope'", fontWeight:500, fontSize:'12.5px', color:'var(--kt-muted)' }}>{asignaturaSeleccionada ? 'Cargar o generar con IA' : 'Nombre y descripción'}</div>
                </div>}

              </div>
            </div>
          </div>
        </main>

        {sourcePanelCourse && (
          <aside aria-label="Contenido fuente del temario" style={{ position:'absolute', top:0, right:0, bottom:0, zIndex:60, width:'min(620px,calc(100% - 48px))', display:'flex', flexDirection:'column', background:'var(--kt-modal-bg1)', borderLeft:'1px solid var(--kt-modal-border)', boxShadow:'-24px 0 60px -30px rgba(15,23,42,.45)', backdropFilter:'blur(18px)' }}>
            <div style={{ display:'flex', alignItems:'flex-start', gap:'14px', padding:'24px 24px 20px', borderBottom:'1px solid var(--kt-border-soft)' }}>
              <div style={{ minWidth:0 }}>
                <div style={{ fontFamily:"'Manrope'", fontWeight:800, fontSize:'10px', letterSpacing:'1.1px', textTransform:'uppercase', color:'#10B981', marginBottom:'7px' }}>Contenido fuente</div>
                <h3 style={{ fontFamily:"'Inter'", fontWeight:600, fontSize:'19px', letterSpacing:'-.6px', color:'var(--kt-heading)', margin:0 }}>{sourcePanelCourse.titulo || sourcePanelCourse.nombre}</h3>
              </div>
              <button onClick={handleCloseFuente} aria-label="Cerrar panel de contenido" style={{ marginLeft:'auto', flex:'none', width:'36px', height:'36px', display:'grid', placeItems:'center', border:'none', background:'var(--kt-chip-bg)', borderRadius:'50%', color:'var(--kt-muted)', cursor:'pointer', fontSize:'20px' }}>×</button>
            </div>
            <div style={{ flex:1, overflow:'auto', padding:'24px' }}>
              {sourceLoading && (
                <div style={{ display:'flex', alignItems:'center', gap:'10px', color:'var(--kt-muted)', fontFamily:"'Manrope'", fontWeight:700, fontSize:'13px' }}>
                  <span style={{ width:'18px', height:'18px', border:'2px solid var(--kt-input-border)', borderTopColor:'#10B981', borderRadius:'50%', animation:'ktSpin .7s linear infinite' }}></span>
                  Cargando contenido...
                </div>
              )}
              {!sourceLoading && sourceError && (
                <div style={{ padding:'14px 16px', borderRadius:'11px', background:'rgba(244,63,94,.10)', border:'1px solid rgba(244,63,94,.24)', color:'#FB7185', fontFamily:"'Manrope'", fontWeight:700, fontSize:'13px', lineHeight:1.5 }}>{sourceError}</div>
              )}
              {!sourceLoading && !sourceError && sourceContent && (
                <div className="markdown-body" style={{ overflowWrap:'anywhere' }}>
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {prepararContenidoFuente(sourceContent.contenidoFuente) || 'El temario no contiene texto fuente.'}
                  </ReactMarkdown>
                </div>
              )}
            </div>
          </aside>
        )}

        <DeleteConfirmationModal
          open={Boolean(deletePending)}
          title={`Eliminar ${deletePending?.type || ''}`}
          name={deletePending?.name || ''}
          loading={deleteProcessing}
          onCancel={() => setDeletePending(null)}
          onConfirm={handleConfirmDelete}
        />

        {asignaturaModalOpen && (
          <div style={{ position:'absolute', inset:0, zIndex:60, display:'flex', alignItems:'center', justifyContent:'center', padding:'24px' }}>
            <div onClick={() => setAsignaturaModalOpen(false)} style={{ position:'absolute', inset:0, background:'var(--kt-modal-backdrop)', backdropFilter:'blur(8px)', WebkitBackdropFilter:'blur(8px)' }}></div>
            <form onSubmit={handleCreateAsignatura} style={{ position:'relative', width:'100%', maxWidth:'500px', background:'linear-gradient(180deg,var(--kt-modal-bg1),var(--kt-modal-bg2))', border:'1px solid var(--kt-modal-border)', borderRadius:'20px', boxShadow:'var(--kt-shadow-modal)', padding:'26px 28px' }}>
              <div style={{ display:'flex', alignItems:'center', marginBottom:'22px' }}>
                <h3 style={{ fontFamily:"'Inter'", fontWeight:600, fontSize:'22px', letterSpacing:'-.8px', color:'var(--kt-heading)', margin:0 }}>Agregar asignatura</h3>
                <button type="button" onClick={() => setAsignaturaModalOpen(false)} aria-label="Cerrar" style={{ marginLeft:'auto', width:'34px', height:'34px', display:'grid', placeItems:'center', border:'none', background:'var(--kt-chip-bg)', borderRadius:'50%', color:'var(--kt-muted)', cursor:'pointer' }}>×</button>
              </div>
              <label style={{ display:'block', marginBottom:'16px', fontFamily:"'Manrope'", fontWeight:700, fontSize:'12px', color:'var(--kt-muted)' }}>
                Nombre
                <input value={nombreAsignatura} onChange={(event) => setNombreAsignatura(event.target.value)} autoFocus style={{ display:'block', width:'100%', height:'44px', marginTop:'7px', padding:'0 14px', border:'1.5px solid var(--kt-input-border)', borderRadius:'11px', background:'var(--kt-input-bg)', color:'var(--kt-heading)', fontSize:'13.5px' }} />
              </label>
              <label style={{ display:'block', marginBottom:'22px', fontFamily:"'Manrope'", fontWeight:700, fontSize:'12px', color:'var(--kt-muted)' }}>
                Descripción
                <textarea value={descripcionAsignatura} onChange={(event) => setDescripcionAsignatura(event.target.value)} rows="4" style={{ display:'block', resize:'vertical', width:'100%', marginTop:'7px', padding:'12px 14px', border:'1.5px solid var(--kt-input-border)', borderRadius:'11px', background:'var(--kt-input-bg)', color:'var(--kt-heading)', fontSize:'13.5px' }} />
              </label>
              <div style={{ display:'flex', justifyContent:'flex-end', gap:'10px' }}>
                <button type="button" onClick={() => setAsignaturaModalOpen(false)} style={{ height:'40px', padding:'0 16px', border:'1px solid var(--kt-input-border)', borderRadius:'10px', background:'var(--kt-chip-bg)', color:'var(--kt-muted)', cursor:'pointer', fontFamily:"'Manrope'", fontWeight:700 }}>Cancelar</button>
                <button type="submit" disabled={asignaturasLoading} style={{ height:'40px', padding:'0 18px', border:'none', borderRadius:'10px', background:'linear-gradient(150deg,#10B981,#059669)', color:'#fff', cursor:'pointer', fontFamily:"'Manrope'", fontWeight:800 }}>{asignaturasLoading ? 'Guardando...' : 'Agregar'}</button>
              </div>
            </form>
          </div>
        )}

        {/* MODAL */}
        <div data-modal style={{ position:'absolute', inset:0, zIndex:50, display:'flex', alignItems:'center', justifyContent:'center', padding:'24px' }}>
          <div onClick={() => setModalOpen(false)} style={{ position:'absolute', inset:0, background:'var(--kt-modal-backdrop)', backdropFilter:'blur(8px)', WebkitBackdropFilter:'blur(8px)' }}></div>
          <div data-modal-panel style={{ position:'relative', width:'100%', maxWidth:'560px', maxHeight:'92vh', overflow:'auto', background:'linear-gradient(180deg,var(--kt-modal-bg1),var(--kt-modal-bg2))', border:'1px solid var(--kt-modal-border)', borderRadius:'20px', boxShadow:'var(--kt-shadow-modal)', padding:'26px 28px' }}>
            <div style={{ display:'flex', alignItems:'flex-start', marginBottom:'18px' }}>
              <div>
                <span style={{ display:'inline-flex', alignItems:'center', padding:'4px 10px', borderRadius:'7px', background:'rgba(16,185,129,.14)', color:'#059669', fontFamily:"'Manrope'", fontWeight:800, fontSize:'9.5px', letterSpacing:'1.2px', textTransform:'uppercase', marginBottom:'12px' }}>
                  {editId ? 'Editar Temario' : 'Ingesta Inteligente'}
                </span>
                <h3 style={{ fontFamily:"'Inter'", fontWeight:600, fontSize:'22px', letterSpacing:'-.8px', color:'var(--kt-heading)', margin:0 }}>
                  {editId ? 'Editar Temario' : 'Cargar Temario'}
                </h3>
                <p style={{ fontFamily:"'Manrope'", fontWeight:500, fontSize:'13px', color:'var(--kt-muted)', margin:'5px 0 0', maxWidth:'400px' }}>
                  Sube un archivo, ingresa un enlace o define manualmente el temario para estructurar el contenido.
                </p>
              </div>
              <button onClick={() => setModalOpen(false)} aria-label="Cerrar" style={{ marginLeft:'auto', flex:'none', width:'34px', height:'34px', display:'grid', placeItems:'center', border:'none', background:'var(--kt-chip-bg)', borderRadius:'50%', color:'var(--kt-muted)', cursor:'pointer' }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"></path></svg></button>
            </div>

            <div style={{ height:'1px', background:'var(--kt-border-soft)', marginBottom:'18px' }}></div>

            {/* tabs */}
            {!editId && (
              <div style={{ display:'flex', gap:'4px', padding:'5px', background:'var(--kt-input-bg)', border:'1px solid var(--kt-input-border)', borderRadius:'12px', marginBottom:'20px' }}>
                <button data-tab-opt="file" onClick={() => setTab('file')} style={{ flex:1, height:'38px', border:'none', borderRadius:'9px', cursor:'pointer', fontFamily:"'Manrope'", fontWeight:700, fontSize:'13px', transition:'all .2s' }}>PDF / Archivo</button>
                <button data-tab-opt="web" onClick={() => setTab('web')} style={{ flex:1, height:'38px', border:'none', borderRadius:'9px', cursor:'pointer', fontFamily:"'Manrope'", fontWeight:700, fontSize:'13px', transition:'all .2s' }}>Enlace Web</button>
                <button data-tab-opt="manual" onClick={() => setTab('manual')} style={{ flex:1, height:'38px', border:'none', borderRadius:'9px', cursor:'pointer', fontFamily:"'Manrope'", fontWeight:700, fontSize:'13px', transition:'all .2s' }}>Manual</button>
              </div>
            )}

            {/* tab: file */}
            {tab === 'file' && !editId && (
              <label onDragEnter={handleDrag} onDragOver={handleDrag} onDragLeave={handleDrag} onDrop={handleDrop} style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'8px', padding:'38px 20px', border:`2px dashed ${dragActive ? 'rgba(16,185,129,.5)' : 'var(--kt-input-border)'}`, borderRadius:'14px', cursor:'pointer', textAlign:'center', transition:'border-color .2s,background .2s', background: dragActive ? 'rgba(16,185,129,.04)' : 'transparent' }}>
                <input type="file" accept=".pdf,.doc,.docx,.md" onChange={handleFileSelect} className="hidden" style={{ display: 'none' }} />
                <div style={{ width:'56px', height:'56px', borderRadius:'15px', background: dragActive ? 'rgba(16,185,129,.14)' : 'var(--kt-chip-bg)', color: dragActive ? '#10B981' : 'var(--kt-muted)', display:'grid', placeItems:'center', marginBottom:'4px' }}><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 14.9A7 7 0 1 1 15.7 8h1.8a4.5 4.5 0 0 1 2.5 8.2"></path><path d="M12 12v9M8 16l4-4 4 4"></path></svg></div>
                {fileName ? (
                  <>
                    <div style={{ fontFamily:"'Inter'", fontWeight:600, fontSize:'15px', color:'var(--kt-heading)' }}>{fileName}</div>
                    <div style={{ fontFamily:"'Manrope'", fontWeight:500, fontSize:'12.5px', color:'var(--kt-muted)' }}>Documento analizado y listo.</div>
                    <span style={{ marginTop:'6px', display:'inline-flex', padding:'9px 16px', borderRadius:'9px', background:'var(--kt-heading)', color:'var(--kt-bg1)', fontFamily:"'Manrope'", fontWeight:700, fontSize:'12.5px' }}>Cambiar Archivo</span>
                  </>
                ) : (
                  <>
                    <div style={{ fontFamily:"'Inter'", fontWeight:600, fontSize:'15px', color:'var(--kt-heading)' }}>Arrastra tu documento educativo aquí</div>
                    <div style={{ fontFamily:"'Manrope'", fontWeight:500, fontSize:'12.5px', color:'var(--kt-muted)' }}>Soporta PDF, DOC, DOCX o MD (Máx 20MB)</div>
                    <span style={{ marginTop:'6px', display:'inline-flex', padding:'9px 16px', borderRadius:'9px', background:'var(--kt-heading)', color:'var(--kt-bg1)', fontFamily:"'Manrope'", fontWeight:700, fontSize:'12.5px' }}>Explorar Archivos</span>
                  </>
                )}
              </label>
            )}

            {/* tab: web */}
            {tab === 'web' && !editId && (
              <div>
                <div style={{ fontFamily:"'Manrope'", fontWeight:700, fontSize:'10px', letterSpacing:'1px', color:'var(--kt-label)', marginBottom:'8px' }}>DIRECCIÓN URL DEL TEMARIO</div>
                <input value={url} onChange={e => setUrl(e.target.value)} placeholder="https://universidad.edu/programas/matematicas-1.html" style={{ width:'100%', height:'48px', padding:'0 15px', border:'1.5px solid var(--kt-input-border)', borderRadius:'12px', background:'var(--kt-input-bg)', color:'var(--kt-heading)', fontWeight:500, fontSize:'14px' }} />
              </div>
            )}

            {/* tab: manual */}
            {tab === 'manual' && !editId && (
              <div style={{ display:'flex', gap:'11px', padding:'14px 15px', borderRadius:'12px', background:'rgba(16,185,129,.08)', border:'1px solid rgba(16,185,129,.25)' }}>
                <span style={{ flex:'none', color:'#10B981' }}><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4M12 8h.01"></path></svg></span>
                <div style={{ fontFamily:"'Manrope'", fontWeight:700, fontSize:'12.5px', lineHeight:1.5, color:'#059669' }}><span style={{ fontWeight:800 }}>Creación Manual Inteligente:</span> Define los metadatos esenciales y la IA estructurará el temario de forma autónoma.</div>
              </div>
            )}

            <div className="kt-modal-2col" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px', marginTop:'20px' }}>
              <div>
                <div style={{ fontFamily:"'Manrope'", fontWeight:700, fontSize:'10px', letterSpacing:'1px', color:'var(--kt-label)', marginBottom:'8px' }}>TÍTULO DEL TEMARIO</div>
                <input value={titulo} onChange={e => setTitulo(e.target.value)} placeholder="Ej. Programación Avanzada" style={{ width:'100%', height:'46px', padding:'0 14px', border:'1.5px solid var(--kt-input-border)', borderRadius:'11px', background:'var(--kt-input-bg)', color:'var(--kt-heading)', fontWeight:500, fontSize:'14px' }} />
              </div>
              <div>
                <div style={{ fontFamily:"'Manrope'", fontWeight:700, fontSize:'10px', letterSpacing:'1px', color:'var(--kt-label)', marginBottom:'8px' }}>ASIGNATURA</div>
                <select value={asignaturaId} onChange={e => setAsignaturaId(e.target.value)} style={{ width:'100%', height:'46px', padding:'0 14px', border:'1.5px solid var(--kt-input-border)', borderRadius:'11px', background:'var(--kt-input-bg)', color:asignaturaId ? 'var(--kt-heading)' : 'var(--kt-muted)', fontWeight:700, fontSize:'14px', cursor:'pointer' }}>
                  <option value="">{asignaturas.length ? 'Selecciona una asignatura' : 'Sin asignaturas disponibles'}</option>
                  {asignaturas.map(item => <option key={item.id} value={item.id}>{item.nombre}</option>)}
                </select>
              </div>
            </div>

            <div style={{ marginTop:'10px', display:'flex', alignItems:'center', gap:'12px', flexWrap:'wrap' }}>
              {asignaturas.length === 0 && (
                <span style={{ fontFamily:"'Manrope'", fontWeight:700, fontSize:'12px', color:'#F59E0B' }}>Debes crear una asignatura antes de cargar el temario.</span>
              )}
              <button type="button" onClick={() => setCreandoAsignaturaTemario(value => !value)} style={{ marginLeft:asignaturas.length ? 'auto' : 0, border:'none', background:'none', color:'#10B981', cursor:'pointer', fontFamily:"'Manrope'", fontWeight:800, fontSize:'12.5px' }}>+ Crear asignatura</button>
            </div>

            {creandoAsignaturaTemario && (
              <div style={{ marginTop:'12px', padding:'14px', border:'1px solid var(--kt-input-border)', borderRadius:'12px', background:'var(--kt-chip-bg)' }}>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px' }}>
                  <input value={nombreNuevaAsignatura} onChange={e => setNombreNuevaAsignatura(e.target.value)} placeholder="Nombre" style={{ width:'100%', height:'42px', padding:'0 12px', border:'1.5px solid var(--kt-input-border)', borderRadius:'10px', background:'var(--kt-input-bg)', color:'var(--kt-heading)', fontWeight:500, fontSize:'13px' }} />
                  <input value={descripcionNuevaAsignatura} onChange={e => setDescripcionNuevaAsignatura(e.target.value)} placeholder="Descripción" style={{ width:'100%', height:'42px', padding:'0 12px', border:'1.5px solid var(--kt-input-border)', borderRadius:'10px', background:'var(--kt-input-bg)', color:'var(--kt-heading)', fontWeight:500, fontSize:'13px' }} />
                </div>
                <div style={{ display:'flex', justifyContent:'flex-end', gap:'8px', marginTop:'10px' }}>
                  <button type="button" onClick={() => setCreandoAsignaturaTemario(false)} style={{ height:'34px', padding:'0 12px', border:'none', background:'none', color:'var(--kt-muted)', cursor:'pointer', fontFamily:"'Manrope'", fontWeight:700 }}>Cancelar</button>
                  <button type="button" onClick={handleCreateAsignaturaTemario} disabled={asignaturasLoading} style={{ height:'34px', padding:'0 14px', border:'none', borderRadius:'9px', background:'#10B981', color:'#fff', cursor:'pointer', fontFamily:"'Manrope'", fontWeight:800 }}>{asignaturasLoading ? 'Creando...' : 'Crear'}</button>
                </div>
              </div>
            )}

            <div style={{ marginTop:'16px' }}>
              <div style={{ fontFamily:"'Manrope'", fontWeight:700, fontSize:'10px', letterSpacing:'1px', color:'var(--kt-label)', marginBottom:'8px' }}>GRADO ACADÉMICO *</div>
              <select value={gradoSeleccionado} onChange={e => { setGradoSeleccionado(e.target.value); if (e.target.value !== gradoOtroKey) setGradoOtro(''); }} style={{ width:'100%', height:'46px', padding:'0 14px', border:'1.5px solid var(--kt-input-border)', borderRadius:'11px', background:'var(--kt-input-bg)', color:gradoSeleccionado ? 'var(--kt-heading)' : 'var(--kt-muted)', fontWeight:700, fontSize:'14px', cursor:'pointer', marginBottom:gradoSeleccionado === gradoOtroKey ? '10px' : '16px' }}>
                <option value="">Selecciona un grado académico</option>
                {gradoOptions.map(option => <option key={option} value={option}>{option}</option>)}
                <option value={gradoOtroKey}>{gradoOtroKey}</option>
              </select>
              {gradoSeleccionado === gradoOtroKey && (
                <input value={gradoOtro} onChange={e => setGradoOtro(e.target.value)} placeholder="Ej. Diplomado de programación" style={{ width:'100%', height:'46px', padding:'0 14px', border:'1.5px solid var(--kt-input-border)', borderRadius:'11px', background:'var(--kt-input-bg)', color:'var(--kt-heading)', fontWeight:500, fontSize:'14px', marginBottom:'16px' }} />
              )}
            </div>

            {!editId && (
              <div style={{ marginTop:'16px' }}>
                <div style={{ fontFamily:"'Manrope'", fontWeight:700, fontSize:'10px', letterSpacing:'1px', color:'var(--kt-label)', marginBottom:'8px' }}>MODELO DE GENERACIÓN</div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px', marginBottom:'16px' }}>
                  {[
                    { value:'BASICO', label:'Básico' },
                    { value:'AVANZADO', label:'Avanzado' }
                  ].map(option => (
                    <label key={option.value} style={{ display:'flex', alignItems:'center', gap:'10px', height:'46px', padding:'0 14px', border:`1.5px solid ${modelo === option.value ? 'rgba(16,185,129,.55)' : 'var(--kt-input-border)'}`, borderRadius:'11px', background:modelo === option.value ? 'rgba(16,185,129,.14)' : 'var(--kt-input-bg)', color:modelo === option.value ? '#10B981' : 'var(--kt-heading)', cursor:'pointer', fontFamily:"'Manrope'", fontWeight:800, fontSize:'13px' }}>
                      <input type="radio" name="modelo" value={option.value} checked={modelo === option.value} onChange={e => setModelo(e.target.value)} style={{ accentColor:'#10B981' }} />
                      {option.label}
                    </label>
                  ))}
                </div>
              </div>
            )}

            {(tab === 'manual' || editId) && (
              <div style={{ marginTop:'16px' }}>
                <div style={{ fontFamily:"'Manrope'", fontWeight:700, fontSize:'10px', letterSpacing:'1px', color:'var(--kt-label)', marginBottom:'8px' }}>DESCRIPCIÓN (OPCIONAL)</div>
                <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={3} placeholder="Objetivo general del temario…" style={{ width:'100%', padding:'12px 14px', border:'1.5px solid var(--kt-input-border)', borderRadius:'11px', background:'var(--kt-input-bg)', color:'var(--kt-heading)', fontWeight:500, fontSize:'14px', resize:'vertical' }}></textarea>
              </div>
            )}

            <div style={{ marginTop:'16px' }}>
              <div style={{ fontFamily:"'Manrope'", fontWeight:700, fontSize:'10px', letterSpacing:'1px', color:'var(--kt-label)', marginBottom:'8px' }}>SUBTEMAS A GENERAR</div>
              <select value={subtemas} onChange={e => setSubtemas(e.target.value)} style={{ width:'100%', height:'48px', padding:'0 14px', border:'1.5px solid var(--kt-input-border)', borderRadius:'11px', background:'var(--kt-input-bg)', color:'var(--kt-heading)', fontWeight:700, fontSize:'14px', cursor:'pointer' }}>
                <option value="4">4 módulos (Compacto)</option>
                <option value="6">6 módulos (Estructura Estándar)</option>
                <option value="8">8 módulos (Detallado)</option>
                <option value="10">10 módulos (Exhaustivo)</option>
              </select>
            </div>

            <div style={{ height:'1px', background:'var(--kt-border-soft)', margin:'22px 0 18px' }}></div>

            <div style={{ display:'flex', alignItems:'center', justifyContent:'flex-end', gap:'14px' }}>
              <button onClick={() => setModalOpen(false)} style={{ height:'46px', padding:'0 18px', border:'none', background:'none', color:'var(--kt-muted)', cursor:'pointer', fontFamily:"'Manrope'", fontWeight:700, fontSize:'14px' }}>Cancelar</button>
              <button className="kt-primary" onClick={handleAnalyze} disabled={isProcessing || !asignaturaId} style={{ height:'46px', padding:'0 24px', border:'none', borderRadius:'12px', background:'linear-gradient(150deg,#10B981,#059669)', color:'#fff', cursor:asignaturaId ? 'pointer' : 'not-allowed', opacity:asignaturaId ? 1 : .6, fontFamily:"'Manrope'", fontWeight:800, fontSize:'14px', boxShadow:'0 12px 26px -12px rgba(16,185,129,.7)', transition:'transform .18s,box-shadow .25s', display:'flex', alignItems:'center', gap:'9px' }}>
                {isProcessing ? 'Procesando...' : editId ? 'Guardar Cambios' : 'Analizar Temario'}
                {!isProcessing && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9z"></path></svg>}
              </button>
            </div>
          </div>
        </div>

        {/* TOASTS */}
        <div style={{ position:'absolute', right:'22px', bottom:'22px', zIndex:80, display:'flex', flexDirection:'column', gap:'12px', pointerEvents:'none' }}>
          {toasts.map(t => {
            const ok = t.kind === 'success', warn = t.kind === 'warn';
            const col = ok ? '#34D399' : warn ? '#FBBF24' : '#FB7185';
            const rgb = ok ? '16,185,129' : warn ? '245,158,11' : '244,63,94';
            return (
              <div key={t.id} style={{ pointerEvents:'auto', display:'flex', alignItems:'center', gap:'12px', minWidth:'270px', maxWidth:'340px', padding:'13px 15px', borderRadius:'13px', background:'rgba(17,24,39,.94)', backdropFilter:'blur(12px)', border:`1px solid rgba(${rgb},.35)`, boxShadow:'0 18px 40px -16px rgba(0,0,0,.7)', animation:'ktToastIn .55s cubic-bezier(.34,1.56,.64,1) both' }}>
                <span style={{ flex:'none', width:'34px', height:'34px', borderRadius:'10px', display:'grid', placeItems:'center', background:`rgba(${rgb},.16)`, color:col }}>
                  {ok ? <CheckCircle2 size={18} /> : warn ? <AlertCircle size={18} /> : <AlertCircle size={18} />}
                </span>
                <div style={{ minWidth:0 }}>
                  <div style={{ fontFamily:"'Manrope'", fontWeight:700, fontSize:'13.5px', color:'#F1F5F9' }}>{t.title}</div>
                  <div style={{ fontFamily:"'Manrope'", fontWeight:500, fontSize:'12px', color:'#94A3B8', marginTop:'1px' }}>{t.msg}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

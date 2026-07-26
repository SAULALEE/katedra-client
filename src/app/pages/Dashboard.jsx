import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTemarios } from '../hooks/useTemarios';
import { useAsignaturas } from '../hooks/useAsignaturas';
import { useAsignaturaVisual } from '../hooks/useAsignaturaVisual';
import { isAdmin, formatRoleDisplay } from '../utils/roleUtils';
import {
  filtrarTemarios
} from '../utils/asignaturas';
import { SUBJECT_COLORS, SUBJECT_ICONS, ICON_NAMES_ES, rgbFromHex, darkenHex } from '../utils/asignaturaVisual';
import { applyAsignaturaOrder, moveAsignaturaBefore, moveAsignaturaToEnd } from '../utils/asignaturaOrder';
import { prepararContenidoFuente } from '../utils/contenidoFuente';
import { getModulosOptions, isModulosValueValidForModelo } from '../utils/modulosOptions';
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
  Heart,
  FileText,
  ChevronDown,
  X,
  Zap,
  Lock
} from 'lucide-react';
import { SidebarUserMenu } from '../components/SidebarUserMenu';
import { PlanModal } from '../components/PlanModal';
import { useSuscripcionStore } from '../store/suscripcionStore';
import { useSuscripcion } from '../hooks/useSuscripcion';

const ICON_KEYS = Object.keys(SUBJECT_ICONS);

const GRADOS_ACADEMICOS = [
  { value: 'primaria', label: 'Primaria' },
  { value: 'secundaria', label: 'Secundaria' },
  { value: 'bachillerato', label: 'Bachillerato' },
  { value: 'universitario', label: 'Universitario' },
  { value: 'posgrado', label: 'Posgrado' }
];

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { courses, assignmentCourses, assignmentLoading, favoriteCourses, favoritesLoading, sourceContent, sourceLoading, sourceError, refetchStats, fetchCoursesByAsignatura, fetchFavoritos, toggleFavorito, fetchFuenteTemario, clearFuenteTemario, crearTemario, cargarTemario, updateTemario, deleteTemario } = useTemarios();
  const { asignaturas, loading: asignaturasLoading, crearAsignatura, eliminarAsignatura } = useAsignaturas();
  const { getMeta, setMeta } = useAsignaturaVisual();

  const [ordenVersion, setOrdenVersion] = useState(0);
  const asignaturasOrdenadas = useMemo(() => applyAsignaturaOrder(asignaturas), [asignaturas, ordenVersion]);
  const [dragAsignaturaId, setDragAsignaturaId] = useState(null);
  const handleDropAsignatura = (dropId) => {
    if (!dragAsignaturaId || dragAsignaturaId === dropId) { setDragAsignaturaId(null); return; }
    moveAsignaturaBefore(asignaturasOrdenadas, dragAsignaturaId, dropId);
    setDragAsignaturaId(null);
    setOrdenVersion((v) => v + 1);
  };
  const handleDropAsignaturaAtEnd = () => {
    if (!dragAsignaturaId) return;
    moveAsignaturaToEnd(asignaturasOrdenadas, dragAsignaturaId);
    setDragAsignaturaId(null);
    setOrdenVersion((v) => v + 1);
  };

  const [theme, setTheme] = useState(() => localStorage.getItem('katedra-theme') || 'light');
  useEffect(() => { localStorage.setItem('katedra-theme', theme); }, [theme]);
  const [collapsed, setCollapsed] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [tab, setTab] = useState('file');
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
  const [asignaturasOpen, setAsignaturasOpen] = useState(true);
  const [favoritoProcessingId, setFavoritoProcessingId] = useState(null);
  const [busquedaBiblioteca, setBusquedaBiblioteca] = useState('');
  const [gradoFiltro, setGradoFiltro] = useState('');
  const [gradoFilterOpen, setGradoFilterOpen] = useState(false);
  const gradoFilterRef = useRef(null);
  const [subtemasOpen, setSubtemasOpen] = useState(false);
  const subtemasRef = useRef(null);
  const [gradoModalOpen, setGradoModalOpen] = useState(false);
  const gradoModalRef = useRef(null);
  const [modeloOpen, setModeloOpen] = useState(false);
  const modeloRef = useRef(null);
  const fuenteRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (gradoFilterRef.current && !gradoFilterRef.current.contains(e.target)) {
        setGradoFilterOpen(false);
      }
      if (subtemasRef.current && !subtemasRef.current.contains(e.target)) {
        setSubtemasOpen(false);
      }
      if (gradoModalRef.current && !gradoModalRef.current.contains(e.target)) {
        setGradoModalOpen(false);
      }
      if (modeloRef.current && !modeloRef.current.contains(e.target)) {
        setModeloOpen(false);
      }
      if (!e.target.closest('[data-menu-toggle]') && !e.target.closest('[role="menu"]')) {
        setOpenMenuId(null);
      }
      if (fuenteRef.current && !fuenteRef.current.contains(e.target)) {
        setSourcePanelCourse(null);
        clearFuenteTemario();
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Subject (asignatura) modal
  const [asignaturaModalOpen, setAsignaturaModalOpen] = useState(false);
  const [subEditId, setSubEditId] = useState(null);
  const [nombreAsignatura, setNombreAsignatura] = useState('');
  const [descripcionAsignatura, setDescripcionAsignatura] = useState('');
  const [smColor, setSmColor] = useState(SUBJECT_COLORS[0]);
  const [smIcon, setSmIcon] = useState(ICON_KEYS[0]);
  const [nameError, setNameError] = useState(false);
  const [iconPickerOpen, setIconPickerOpen] = useState(false);

  // Temario (load/edit) modal form fields
  const [titulo, setTitulo] = useState('');
  const [asignaturaId, setAsignaturaId] = useState('');
  const [creandoAsignaturaTemario, setCreandoAsignaturaTemario] = useState(false);
  const [nombreNuevaAsignatura, setNombreNuevaAsignatura] = useState('');
  const [descripcionNuevaAsignatura, setDescripcionNuevaAsignatura] = useState('');
  const [grado, setGrado] = useState('');
  const [modelo, setModelo] = useState('TUTOR');
  const [desc, setDesc] = useState('');
  const [subtemas, setSubtemas] = useState('6');
  const [url, setUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const [isProcessing, setIsProcessing] = useState(false);
  const [planModalAbierto, setPlanModalAbierto] = useState(false);
  const { puedeCargarArchivo, puedeCargarUrl } = useSuscripcion();
  const abrirCheckout = useSuscripcionStore((s) => s.abrirCheckout);

  const handleModeloChange = (nuevoModelo) => {
    setModelo(nuevoModelo);
    if (!isModulosValueValidForModelo(nuevoModelo, subtemas)) {
      setSubtemas(getModulosOptions(nuevoModelo)[0].value);
    }
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

  const calculatePct = (done, total) => {
    if (!total) return 0;
    return Math.round((done / total) * 100);
  };

  const subjectStats = (subjectId) => {
    const list = courses.filter((c) => c.asignaturaId === subjectId);
    if (!list.length) return { count: 0, pct: 0 };
    const totalPct = list.reduce((acc, c) => {
      const total = c.temas || 6;
      const done = c.done || total;
      return acc + calculatePct(done, total);
    }, 0);
    return { count: list.length, pct: Math.round(totalPct / list.length) };
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
    setTab(puedeCargarArchivo ? 'file' : 'manual');
    setTitulo('');
    setAsignaturaId(asignaturaActiva?.id || '');
    setCreandoAsignaturaTemario(false);
    setNombreNuevaAsignatura('');
    setDescripcionNuevaAsignatura('');
    setGrado('');
    setModelo('TUTOR');
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
    setGrado(c.gradoAcademico || '');
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

    if (!editId && !grado) {
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
          gradoAcademico: grado || 'universitario'
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
    const numeroModulos = parseInt(subtemas, 10) || getModulosOptions(modelo)[0].value;
    const payload = {
      titulo,
      asignaturaId,
      gradoAcademico: grado,
      modelo,
      descripcion: desc,
      numeroModulos,
      origen: origenMap[tab],
      detalleOrigen: tab === 'file' ? fileName : tab === 'web' ? url : ''
    };

    let result = { success: false };
    if (tab === 'file' && cargarTemario) {
      result = await cargarTemario('archivo', { file: selectedFile, titulo, asignaturaId, gradoAcademico: grado, modelo, numeroModulos });
    } else if (tab === 'web' && cargarTemario) {
      result = await cargarTemario('url', { url, titulo, asignaturaId, gradoAcademico: grado, modelo, numeroModulos });
    } else if (crearTemario) {
      result = await crearTemario(payload);
    }

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

  const handleOpenAsignaturas = () => {
    setAsignaturaActiva(null);
    setVistaFavoritos(false);
  };

  const handleOpenTemarios = async () => {
    setVistaFavoritos(false);
    if (!asignaturaActiva && asignaturas && asignaturas.length > 0) {
      await handleOpenAsignatura(asignaturas[0]);
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

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const viewParam = params.get('view');
    if (viewParam === 'favoritos') {
      handleOpenFavoritos();
    } else if (viewParam === 'temarios') {
      setVistaFavoritos(false);
      if (!asignaturaActiva && asignaturas && asignaturas.length > 0) {
        handleOpenAsignatura(asignaturas[0]);
      }
    } else if (viewParam === 'asignaturas') {
      setAsignaturaActiva(null);
      setVistaFavoritos(false);
    }
  }, [location.search, asignaturasLoading]);

  const handleToggleFavorito = async (event, course) => {
    event.stopPropagation();
    if (favoritoProcessingId) return;

    setFavoritoProcessingId(course.id);
    const nuevoEstado = !course.favorito;
    const result = await toggleFavorito(course.id, nuevoEstado);
    setFavoritoProcessingId(null);

    if (result.success) {
      if (nuevoEstado) notify('fav', 'Añadido a favoritos', course.titulo || course.nombre || '');
      else addToast('warn', 'Quitado de favoritos', course.titulo || course.nombre || '');
    } else {
      notify('error', 'No se pudo actualizar Favoritos', result.error);
    }
  };

  const handleOpenAddAsignatura = () => {
    setSubEditId(null);
    setNombreAsignatura('');
    setDescripcionAsignatura('');
    setSmColor(SUBJECT_COLORS[0]);
    setSmIcon(ICON_KEYS[0]);
    setNameError(false);
    setAsignaturaModalOpen(true);
  };

  const handleOpenEditAsignatura = (item) => {
    const meta = getMeta(item.id);
    setSubEditId(item.id);
    setNombreAsignatura(meta.nombreOverride || item.nombre);
    setDescripcionAsignatura(meta.descripcionOverride ?? item.descripcion ?? '');
    setSmColor(meta.color);
    setSmIcon(meta.icon);
    setNameError(false);
    setAsignaturaModalOpen(true);
  };

  const handleSubmitAsignatura = async () => {
    const nombre = nombreAsignatura.trim();
    if (!nombre) {
      setNameError(true);
      return;
    }

    if (subEditId) {
      setMeta(subEditId, {
        color: smColor,
        icon: smIcon,
        nombreOverride: nombre,
        descripcionOverride: descripcionAsignatura.trim()
      });
      setAsignaturaModalOpen(false);
      notify('success', 'Asignatura actualizada', `${nombre} fue modificada.`);
      return;
    }

    const result = await crearAsignatura({
      nombre,
      descripcion: descripcionAsignatura.trim()
    });
    if (result.success) {
      setMeta(result.asignatura.id, { color: smColor, icon: smIcon });
      setAsignaturaModalOpen(false);
      notify('success', 'Asignatura creada', `${nombre} se añadió a tu biblioteca.`);
    } else {
      notify('error', 'No se pudo crear', result.error);
    }
  };

  const handleDeleteAsignatura = (e, asignaturaSeleccionada) => {
    e.stopPropagation();
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
  const temariosVisibles = vistaFavoritos ? favoriteCourses : temariosFiltrados;
  const view = vistaFavoritos ? 'favoritos' : asignaturaSeleccionada ? 'temarios' : 'asignaturas';
  const favCount = courses.filter((c) => c.favorito).length;
  const activeMeta = asignaturaSeleccionada ? getMeta(asignaturaSeleccionada.id) : null;
  const activeStats = asignaturaSeleccionada ? subjectStats(asignaturaSeleccionada.id) : { count: 0, pct: 0 };
  const ActiveIcon = activeMeta ? (SUBJECT_ICONS[activeMeta.icon] || SUBJECT_ICONS.book) : SUBJECT_ICONS.book;

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
        .kt-stat{transition:transform .22s cubic-bezier(.34,1.56,.64,1),box-shadow .25s,border-color .25s}
        .kt-stat.clickable{cursor:pointer}
        .kt-stat.clickable:hover{transform:translateY(-3px);box-shadow:var(--kt-shadow-card);border-color:rgba(16,185,129,.3)}

        /* subject (asignatura) library cards */
        .kt-subcard{position:relative;transition:transform .26s cubic-bezier(.34,1.56,.64,1),box-shadow .3s;cursor:pointer;overflow:hidden}
        .kt-subcard:hover{transform:translateY(-6px)}
        .kt-subcard:hover .kt-spine{width:14px}
        .kt-subcard:hover .kt-subopen{gap:9px}
        .kt-spine{transition:width .26s cubic-bezier(.34,1.56,.64,1)}

        /* syllabus cards */
        .kt-scard{position:relative;transition:transform .24s cubic-bezier(.34,1.56,.64,1),box-shadow .28s,border-color .25s;overflow:visible}
        .kt-scard:hover{transform:translateY(-4px);box-shadow:var(--kt-shadow-card)}
        .kt-scard:hover .kt-scard-open{gap:9px}
        .kt-iconbtn:hover{background:var(--kt-chip-hover) !important;color:var(--kt-heading) !important}
        .kt-iconbtn.del:hover{background:rgba(16,185,129,.16) !important;color:#FB7185 !important}
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

        /* fuente details wrapper (pushes content, does not overlay) */
        .kt-fuente-wrapper{width:0;transition:width .32s cubic-bezier(.4,0,.2,1);overflow:hidden;flex:none;background:var(--kt-modal-bg1);border-left:1px solid transparent;position:relative;z-index:10}
        [data-root][data-kt-fuente="true"] .kt-fuente-wrapper{width:420px;border-color:var(--kt-border)}
        @media(max-width:760px){
          [data-root][data-kt-fuente="true"] .kt-fuente-wrapper{width:min(420px,90vw)}
        }

        /* modal reveal */
        [data-modal]{opacity:0;pointer-events:none;transition:opacity .22s ease}
        [data-modal-panel]{transform:scale(.94) translateY(10px);transition:transform .32s cubic-bezier(.34,1.56,.64,1)}
        [data-root][data-kt-modal="true"] [data-modal]{opacity:1;pointer-events:auto}
        [data-root][data-kt-modal="true"] [data-modal-panel]{transform:scale(1) translateY(0)}
        [data-root][data-kt-submodal="true"] [data-submodal]{opacity:1;pointer-events:auto}
        [data-root][data-kt-submodal="true"] [data-submodal] [data-modal-panel]{transform:scale(1) translateY(0)}

        /* modal mode swap */
        .kt-only-create{display:inline}.kt-only-edit{display:none}
        [data-root][data-kt-modal-mode="edit"] .kt-only-create{display:none}
        [data-root][data-kt-modal-mode="edit"] .kt-only-edit{display:inline}
        .kt-sm-create{display:inline}.kt-sm-edit{display:none}
        [data-root][data-kt-submodal-mode="edit"] .kt-sm-create{display:none}
        [data-root][data-kt-submodal-mode="edit"] .kt-sm-edit{display:inline}

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
        [data-notif-icon][data-kind="error"]{background:rgba(16,185,129,.16);color:#10B981}
        [data-notif-icon][data-kind="warn"]{background:rgba(245,158,11,.16);color:#F59E0B}
        [data-notif-icon][data-kind="fav"]{background:rgba(16,185,129,.16);color:#10B981}

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
          .kt-modal-2col{grid-template-columns:1fr !important}
          .kt-searchrow{flex-direction:column !important;align-items:stretch !important}
        }
        @media(max-width:560px){
          .kt-sidebar{position:absolute !important;z-index:40;height:100%;box-shadow:0 0 60px rgba(0,0,0,.6)}
        }

        /* modal scrollable content */
        [data-modal-panel] > div:nth-child(3){
          scrollbar-width:thin;
          scrollbar-color:var(--kt-scrollbar) transparent;
        }
        [data-modal-panel] > div:nth-child(3)::-webkit-scrollbar{
          width:8px;
        }
        [data-modal-panel] > div:nth-child(3)::-webkit-scrollbar-track{
          background:transparent;
        }
        [data-modal-panel] > div:nth-child(3)::-webkit-scrollbar-thumb{
          background:var(--kt-scrollbar);
          border-radius:6px;
          border:1.5px solid transparent;
          background-clip:content-box;
        }
        [data-modal-panel] > div:nth-child(3)::-webkit-scrollbar-thumb:hover{
          background:var(--kt-heading);
          background-clip:content-box;
        }

        /* dropdown scroller custom scrollbar */
        .kt-scroller{
          scrollbar-width:thin;
          scrollbar-color:var(--kt-scrollbar) transparent;
        }
        .kt-scroller::-webkit-scrollbar{
          width:6px;
        }
        .kt-scroller::-webkit-scrollbar-track{
          background:transparent;
        }
        .kt-scroller::-webkit-scrollbar-thumb{
          background:rgba(16,185,129,.4);
          border-radius:4px;
          border:1px solid transparent;
          background-clip:content-box;
        }
        .kt-scroller::-webkit-scrollbar-thumb:hover{
          background:var(--kt-scrollbar);
          background-clip:content-box;
        }
      `}</style>

      <div
        data-root
        data-kt-theme={theme}
        data-kt-collapsed={collapsed ? "true" : "false"}
        data-kt-modal={modalOpen ? "true" : "false"}
        data-kt-submodal={asignaturaModalOpen ? "true" : "false"}
        data-kt-modal-mode={editId ? "edit" : "create"}
        data-kt-submodal-mode={subEditId ? "edit" : "create"}
        data-kt-tab={tab}
        data-kt-notif={notifOpen ? "true" : "false"}
        data-kt-fuente={sourcePanelCourse ? "true" : "false"}
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

            {/* Módulo Principal: Mis Asignaturas (Collapsible) */}
            <div
              onClick={handleOpenAsignaturas}
              className="kt-nav kt-navrow"
              style={{
                display:'flex',
                alignItems:'center',
                gap:'13px',
                padding:'11px 12px',
                borderRadius:'11px',
                cursor:'pointer',
                background: view === 'asignaturas' || view === 'temarios' ? 'linear-gradient(120deg,rgba(16,185,129,.16),rgba(16,185,129,.06))' : 'transparent',
                border: view === 'asignaturas' || view === 'temarios' ? '1px solid rgba(16,185,129,.28)' : '1px solid transparent',
                color: view === 'asignaturas' || view === 'temarios' ? 'var(--kt-heading)' : 'var(--kt-muted)'
              }}
            >
              <span style={{ flex:'none', width:'20px', display:'grid', placeItems:'center', color: view === 'asignaturas' || view === 'temarios' ? '#10B981' : 'inherit' }}><FolderDot size={20} /></span>
              <span className="kt-sidelabel" style={{ fontFamily:"'Manrope'", fontWeight: view === 'asignaturas' || view === 'temarios' ? 700 : 600, fontSize:'14px', flex: 1 }}>Mis Asignaturas</span>
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
                <button
                  onClick={handleOpenFavoritos}
                  className="kt-nav kt-navrow"
                  style={{
                    display:'flex',
                    alignItems:'center',
                    gap:'10px',
                    padding:'8px 10px',
                    borderRadius:'9px',
                    textDecoration:'none',
                    border: view === 'favoritos' ? '1px solid rgba(16,185,129,.28)' : '1px solid transparent',
                    background: view === 'favoritos' ? 'linear-gradient(120deg,rgba(16,185,129,.16),rgba(16,185,129,.06))' : 'transparent',
                    color: view === 'favoritos' ? 'var(--kt-heading)' : 'var(--kt-muted)',
                    cursor:'pointer',
                    width:'100%',
                    textAlign:'left'
                  }}
                >
                  <span style={{ flex:'none', width:'18px', display:'grid', placeItems:'center', color: view === 'favoritos' ? '#10B981' : 'inherit' }}><Heart size={16} /></span>
                  <span className="kt-sidelabel" style={{ fontFamily:"'Manrope'", fontWeight: view === 'favoritos' ? 700 : 600, fontSize:'13px' }}>Mis Favoritos</span>
                </button>
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
        <main style={{ position:'relative', zIndex:5, flex:1, minWidth:0, display:'flex', flexDirection:'column', overflow:'hidden' }}>
          <header className="kt-main-pad" style={{ display:'flex', alignItems:'center', gap:'18px', padding:'26px 32px', borderBottom:'1px solid var(--kt-border-soft)' }}>
            <div style={{ minWidth:0 }}>
              <h1 className="kt-headtitle" style={{ fontFamily:"'Inter'", fontWeight:600, fontSize:'27px', lineHeight:1.15, letterSpacing:'-1.2px', color:'var(--kt-heading)', margin:0 }}>{view === 'favoritos' ? 'Favoritos' : view === 'temarios' ? 'Mis Temarios' : 'Mis Asignaturas'}</h1>
              <p style={{ fontFamily:"'Manrope'", fontWeight:500, fontSize:'13.5px', color:'var(--kt-muted)', margin:'3px 0 0' }}>{view === 'favoritos' ? 'Tus temarios marcados en un solo lugar' : view === 'temarios' ? 'Temarios de la asignatura seleccionada' : 'Administra tus asignaturas'}</p>
            </div>

            <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:'12px' }}>
              {/* Notifications */}
              <div style={{ position:'relative' }}>
                <button onClick={() => setNotifOpen(!notifOpen)} aria-label="Notificaciones" style={{ position:'relative', width:'42px', height:'42px', display:'grid', placeItems:'center', border:'1px solid var(--kt-chip-border)', background:'var(--kt-chip-bg)', borderRadius:'11px', color:'var(--kt-muted)', cursor:'pointer' }}>
                  <Bell size={19} />
                  {unreadCount > 0 && (
                    <span style={{ position:'absolute', top:'5px', right:'5px', minWidth:'16px', height:'16px', padding:'0 4px', borderRadius:'8px', background:'#10B981', color:'#fff', fontFamily:"'Manrope'", fontWeight:800, fontSize:'9.5px', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 0 0 2px var(--kt-panel-bg)' }}>{unreadCount}</span>
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
                        {n.kind === 'fav' && <Heart size={15} fill="currentColor" />}
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

              {view === 'temarios' && (
                <button className="kt-primary" onClick={handleOpenCreate} style={{ flex:'none', whiteSpace:'nowrap', display:'flex', alignItems:'center', gap:'8px', height:'44px', padding:'0 20px', border:'none', borderRadius:'11px', background:'linear-gradient(150deg,#10B981,#059669)', color:'#fff', cursor:'pointer', fontFamily:"'Manrope'", fontWeight:800, fontSize:'14px', boxShadow:'0 12px 26px -12px rgba(16,185,129,.7)', transition:'transform .18s,box-shadow .25s' }}>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"></path></svg>
                  Cargar Temario
                </button>
              )}
              {view === 'temarios' && (
                <button onClick={() => setAsignaturaActiva(null)} className="kt-ghostbtn" style={{ flex:'none', whiteSpace:'nowrap', display:'flex', alignItems:'center', gap:'8px', height:'44px', padding:'0 18px', border:'1px solid var(--kt-chip-border)', background:'var(--kt-chip-bg)', borderRadius:'11px', color:'var(--kt-text)', cursor:'pointer', fontFamily:"'Manrope'", fontWeight:700, fontSize:'14px' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"></path></svg>
                  Mis Asignaturas
                </button>
              )}
              {view === 'asignaturas' && (
                <button className="kt-primary" onClick={handleOpenAddAsignatura} style={{ flex:'none', whiteSpace:'nowrap', display:'flex', alignItems:'center', gap:'8px', height:'44px', padding:'0 20px', border:'none', borderRadius:'11px', background:'linear-gradient(150deg,#10B981,#059669)', color:'#fff', cursor:'pointer', fontFamily:"'Manrope'", fontWeight:800, fontSize:'14px', boxShadow:'0 12px 26px -12px rgba(16,185,129,.7)', transition:'transform .18s,box-shadow .25s' }}>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"></path></svg>
                  Agregar asignatura
                </button>
              )}
              {view === 'favoritos' && (
                <button onClick={() => { setVistaFavoritos(false); }} className="kt-ghostbtn" style={{ flex:'none', whiteSpace:'nowrap', display:'flex', alignItems:'center', gap:'8px', height:'44px', padding:'0 18px', border:'1px solid var(--kt-chip-border)', background:'var(--kt-chip-bg)', borderRadius:'11px', color:'var(--kt-text)', cursor:'pointer', fontFamily:"'Manrope'", fontWeight:700, fontSize:'14px' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"></path></svg>
                  Volver a Asignaturas
                </button>
              )}
            </div>
          </header>

          <div className="kt-main-pad" style={{ flex:1, overflow:'auto', padding:'28px 32px 60px' }}>
            <div style={{ maxWidth:'1180px', margin:'0 auto' }}>

              {/* ============ VIEW: MIS ASIGNATURAS ============ */}
              {view === 'asignaturas' && (
                <>
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(230px,1fr))', gap:'18px', marginBottom:'28px' }}>
                    <div className="kt-stat" style={{ display:'flex', flexDirection:'column', gap:'14px', padding:'20px', background:'var(--kt-panel-bg)', border:'1px solid var(--kt-panel-border)', borderRadius:'16px', backdropFilter:'blur(12px)' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                        <div style={{ width:'44px', height:'44px', flex:'none', borderRadius:'12px', background:'rgba(16,185,129,.14)', color:'#10B981', display:'grid', placeItems:'center' }}><FolderDot size={21} /></div>
                        <div style={{ fontFamily:"'Manrope'", fontWeight:700, fontSize:'10px', letterSpacing:'1.2px', textTransform:'uppercase', color:'var(--kt-label)' }}>Asignaturas</div>
                      </div>
                      <div style={{ display:'flex', alignItems:'baseline', gap:'8px' }}><span style={{ fontFamily:"'Inter'", fontWeight:600, fontSize:'32px', letterSpacing:'-1.4px', color:'var(--kt-heading)' }}>{asignaturas.length}</span><span style={{ fontFamily:"'Manrope'", fontWeight:600, fontSize:'12px', color:'var(--kt-muted)' }}>activas</span></div>
                    </div>
                    <div className="kt-stat" style={{ display:'flex', flexDirection:'column', gap:'14px', padding:'20px', background:'var(--kt-panel-bg)', border:'1px solid var(--kt-panel-border)', borderRadius:'16px', backdropFilter:'blur(12px)' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                        <div style={{ width:'44px', height:'44px', flex:'none', borderRadius:'12px', background:'rgba(2,132,199,.14)', color:'#0284C7', display:'grid', placeItems:'center' }}><svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><path d="M14 2v6h6"></path></svg></div>
                        <div style={{ fontFamily:"'Manrope'", fontWeight:700, fontSize:'10px', letterSpacing:'1.2px', textTransform:'uppercase', color:'var(--kt-label)' }}>Temarios totales</div>
                      </div>
                      <div style={{ display:'flex', alignItems:'baseline', gap:'8px' }}><span style={{ fontFamily:"'Inter'", fontWeight:600, fontSize:'32px', letterSpacing:'-1.4px', color:'var(--kt-heading)' }}>{courses.length}</span><span style={{ fontFamily:"'Manrope'", fontWeight:600, fontSize:'12px', color:'var(--kt-muted)' }}>en toda tu biblioteca</span></div>
                    </div>
                    <div className="kt-stat clickable" onClick={handleOpenFavoritos} style={{ display:'flex', flexDirection:'column', gap:'14px', padding:'20px', background:'var(--kt-panel-bg)', border:'1px solid var(--kt-panel-border)', borderRadius:'16px', backdropFilter:'blur(12px)' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                        <div style={{ width:'44px', height:'44px', flex:'none', borderRadius:'12px', background:'rgba(16,185,129,.14)', color:'#10B981', display:'grid', placeItems:'center' }}><Heart size={21} fill="currentColor" /></div>
                        <div style={{ fontFamily:"'Manrope'", fontWeight:700, fontSize:'10px', letterSpacing:'1.2px', textTransform:'uppercase', color:'var(--kt-label)' }}>Favoritos</div>
                      </div>
                      <div style={{ display:'flex', alignItems:'baseline', gap:'8px' }}><span style={{ fontFamily:"'Inter'", fontWeight:600, fontSize:'32px', letterSpacing:'-1.4px', color:'var(--kt-heading)' }}>{favCount}</span><span style={{ fontFamily:"'Manrope'", fontWeight:700, fontSize:'12px', color:'#10B981' }}>ver todos →</span></div>
                    </div>
                  </div>

                  <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'16px' }}>
                    <h2 style={{ fontFamily:"'Inter'", fontWeight:600, fontSize:'17px', letterSpacing:'-.5px', color:'var(--kt-heading)', margin:0 }}>Biblioteca de Asignaturas</h2>
                    <span style={{ padding:'3px 10px', borderRadius:'20px', background:'var(--kt-chip-bg)', border:'1px solid var(--kt-chip-border)', fontFamily:"'Manrope'", fontWeight:700, fontSize:'11px', color:'var(--kt-muted)' }}>{asignaturas.length}</span>
                  </div>

                  <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(288px,1fr))', gap:'20px', alignItems:'stretch' }}>
                    {asignaturasLoading && asignaturas.length === 0 && (
                      <div style={{ padding:'40px', textAlign:'center', color:'var(--kt-muted)' }}>Cargando asignaturas...</div>
                    )}

                    {asignaturasOrdenadas.map((item) => {
                      const meta = getMeta(item.id);
                      const nombre = meta.nombreOverride || item.nombre;
                      const descripcion = meta.descripcionOverride ?? item.descripcion;
                      const stats = subjectStats(item.id);
                      const Icon = SUBJECT_ICONS[meta.icon] || SUBJECT_ICONS.book;
                      const tint = `rgba(${rgbFromHex(meta.color)},.14)`;
                      const isDragging = dragAsignaturaId === item.id;
                      return (
                        <div
                          key={item.id}
                          className="kt-subcard"
                          onClick={() => handleOpenAsignatura(item)}
                          draggable
                          onDragStart={(e) => { e.stopPropagation(); e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', item.id); setDragAsignaturaId(item.id); }}
                          onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; }}
                          onDrop={(e) => { e.preventDefault(); e.stopPropagation(); handleDropAsignatura(item.id); }}
                          onDragEnd={() => setDragAsignaturaId(null)}
                          style={{ display:'flex', flexDirection:'column', minHeight:'190px', padding:'24px', background:'var(--kt-card-bg)', border:`2px solid rgba(${rgbFromHex(meta.color)},.35)`, borderTop:`8px solid ${meta.color}`, borderRadius:'18px', backdropFilter:'blur(12px)', boxShadow:'0 2px 12px rgba(15,23,42,.06)', position:'relative', cursor:'pointer', opacity:isDragging ? .45 : 1, transition:'opacity .15s' }}
                        >
                          <span
                            onClick={(e) => e.stopPropagation()}
                            title="Arrastra para reordenar"
                            style={{ position:'absolute', top:'12px', left:'50%', transform:'translateX(-50%)', color:'var(--kt-faint)', cursor:'grab', display:'grid', placeItems:'center', zIndex:2, opacity:.55 }}
                          >
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><circle cx="8" cy="6" r="1.6"/><circle cx="16" cy="6" r="1.6"/><circle cx="8" cy="12" r="1.6"/><circle cx="16" cy="12" r="1.6"/><circle cx="8" cy="18" r="1.6"/><circle cx="16" cy="18" r="1.6"/></svg>
                          </span>

                          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'18px' }}>
                            <div style={{ width:'48px', height:'48px', flex:'none', borderRadius:'14px', background:tint, color:meta.color, display:'grid', placeItems:'center' }}><Icon size={24} /></div>

                            <div style={{ display:'flex', gap:'6px' }}>
                              <button onClick={(e) => { e.stopPropagation(); handleOpenEditAsignatura(item); }} className="kt-iconbtn" aria-label="Editar" style={{ width:'34px', height:'34px', display:'grid', placeItems:'center', border:'1px solid var(--kt-border-soft)', background:'var(--kt-chip-bg)', borderRadius:'10px', color:'var(--kt-heading)', cursor:'pointer', transition:'background .18s,color .18s' }}><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z"></path></svg></button>
                              <button onClick={(e) => handleDeleteAsignatura(e, item)} className="kt-iconbtn del" aria-label="Eliminar" style={{ width:'34px', height:'34px', display:'grid', placeItems:'center', border:'1px solid var(--kt-border-soft)', background:'var(--kt-chip-bg)', borderRadius:'10px', color:'var(--kt-heading)', cursor:'pointer', transition:'background .18s,color .18s' }}><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path></svg></button>
                            </div>
                          </div>

                          <div style={{ flex: 1 }}>
                            <div style={{ fontFamily:"'Inter'", fontWeight:600, fontSize:'19px', letterSpacing:'-.6px', color:'var(--kt-heading)', lineHeight:1.2 }}>{nombre}</div>
                            <div style={{ fontFamily:"'Manrope'", fontWeight:500, fontSize:'13px', color:'var(--kt-muted)', marginTop:'6px', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{descripcion || 'Sin descripción'}</div>
                          </div>

                          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:'24px' }}>
                            <div style={{ display:'flex', gap:'8px', flexWrap:'wrap' }}>
                              <span style={{ padding:'5px 10px', borderRadius:'8px', background:'var(--kt-chip-bg)', color:'var(--kt-faint)', fontFamily:"'Manrope'", fontWeight:700, fontSize:'11px', letterSpacing:'.3px' }}>{stats.count} Temario{stats.count !== 1 && 's'}</span>
                            </div>
                            
                            <span className="kt-subopen" style={{ flex:'none', width:'34px', height:'34px', display:'grid', placeItems:'center', borderRadius:'10px', background:meta.color, color:'#fff', transition:'transform .2s' }}>
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="M12 5l7 7-7 7"></path></svg>
                            </span>
                          </div>
                        </div>
                      );
                    })}

                    <div
                      className="kt-newcard"
                      onClick={handleOpenAddAsignatura}
                      onDragOver={(e) => { if (dragAsignaturaId) { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; } }}
                      onDrop={(e) => { if (dragAsignaturaId) { e.preventDefault(); e.stopPropagation(); handleDropAsignaturaAtEnd(); } }}
                      style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'12px', minHeight:'190px', padding:'20px', background:'transparent', border:'2px dashed var(--kt-input-border)', borderRadius:'18px', textAlign:'center', cursor:'pointer' }}
                    >
                      <div className="kt-newplus" style={{ width:'52px', height:'52px', borderRadius:'14px', background:'var(--kt-chip-bg)', color:'#10B981', display:'grid', placeItems:'center', transition:'transform .3s cubic-bezier(.34,1.56,.64,1),background .25s,color .25s' }}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"></path></svg></div>
                      <div>
                        <div style={{ fontFamily:"'Inter'", fontWeight:600, fontSize:'16px', letterSpacing:'-.4px', color:'var(--kt-heading)' }}>Agregar asignatura</div>
                        <div style={{ fontFamily:"'Manrope'", fontWeight:500, fontSize:'12.5px', color:'var(--kt-muted)', marginTop:'3px' }}>Nombre, color e ícono</div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* ============ VIEW: TEMARIOS (drill-down) ============ */}
              {view === 'temarios' && asignaturaSeleccionada && (
                <>
                  <div style={{ position:'relative', overflow:'hidden', borderRadius:'20px', padding:'24px 26px', marginBottom:'22px', background:'var(--kt-card-bg)', border:`1.5px solid rgba(${rgbFromHex(activeMeta.color)}, 0.15)`, boxShadow:'var(--kt-shadow-card)', backdropFilter:'blur(10px)' }}>
                    <div style={{ position:'absolute', inset:0, background:`linear-gradient(120deg, rgba(${rgbFromHex(activeMeta.color)}, 0.08), rgba(${rgbFromHex(activeMeta.color)}, 0.02))` }}></div>
                    <div style={{ position:'absolute', right:'-30px', top:'-40px', width:'200px', height:'200px', borderRadius:'50%', background:`rgba(${rgbFromHex(activeMeta.color)}, 0.08)`, filter:'blur(40px)' }}></div>
                    <div style={{ position:'absolute', right:'70px', bottom:'-70px', width:'150px', height:'150px', borderRadius:'50%', background:`rgba(${rgbFromHex(activeMeta.color)}, 0.08)`, filter:'blur(40px)' }}></div>
                    
                    <div style={{ position:'relative', display:'flex', alignItems:'center', gap:'16px' }}>
                      <div style={{ flex:'none', width:'52px', height:'52px', borderRadius:'14px', background:`rgba(${rgbFromHex(activeMeta.color)}, 0.1)`, display:'grid', placeItems:'center', color:activeMeta.color }}><ActiveIcon size={26} /></div>
                      <div style={{ minWidth:0 }}>
                        <div style={{ display:'flex', alignItems:'center', gap:'8px', fontFamily:"'Manrope'", fontWeight:700, fontSize:'11px', letterSpacing:'.4px', color:'var(--kt-faint)', marginBottom:'3px' }}><span style={{ cursor:'pointer', color:activeMeta.color }} onClick={() => setAsignaturaActiva(null)}>Mis Asignaturas</span><span style={{ opacity:.6 }}>/</span><span>Temarios</span></div>
                        <div style={{ fontFamily:"'Inter'", fontWeight:700, fontSize:'24px', letterSpacing:'-1px', lineHeight:1.1, color:'var(--kt-heading)' }}>{activeMeta.nombreOverride || asignaturaSeleccionada.nombre}</div>
                        {(activeMeta.descripcionOverride || asignaturaSeleccionada.descripcion) && (
                          <div style={{ fontFamily:"'Manrope'", fontWeight:500, fontSize:'12.5px', color:'var(--kt-muted)', marginTop:'4px' }}>{activeMeta.descripcionOverride || asignaturaSeleccionada.descripcion}</div>
                        )}
                      </div>
                      <div style={{ marginLeft:'auto', display:'flex', flexDirection:'column', alignItems:'flex-end', gap:'2px', flexShrink:0 }}>
                        <div style={{ fontFamily:"'Inter'", fontWeight:800, fontSize:'26px', letterSpacing:'-1px', color:activeMeta.color, lineHeight:1 }}>{activeStats.count}</div>
                        <div style={{ fontFamily:"'Manrope'", fontWeight:700, fontSize:'11px', color:'var(--kt-muted)', textTransform:'uppercase', letterSpacing:'.5px' }}>temario{activeStats.count === 1 ? '' : 's'}</div>
                      </div>
                    </div>
                  </div>

                  <div className="kt-searchrow" style={{ display:'grid', gridTemplateColumns:'minmax(220px,1fr) minmax(180px,240px)', gap:'12px', marginBottom:'20px' }}>
                    <div style={{ position:'relative' }}>
                      <Search size={17} style={{ position:'absolute', left:'14px', top:'50%', transform:'translateY(-50%)', color:'var(--kt-faint)', pointerEvents:'none' }} />
                      <input
                        type="search"
                        value={busquedaBiblioteca}
                        onChange={e => setBusquedaBiblioteca(e.target.value)}
                        placeholder="Buscar temarios…"
                        aria-label="Buscar temarios"
                        style={{ width:'100%', height:'48px', padding:'0 15px 0 42px', border:'1.5px solid var(--kt-input-border)', borderRadius:'13px', background:'var(--kt-input-bg)', color:'var(--kt-heading)', fontFamily:"'Manrope'", fontWeight:500, fontSize:'14px' }}
                      />
                    </div>
                    
                    {/* Custom Styled Select for Grado Filtro */}
                    <div ref={gradoFilterRef} style={{ position: 'relative', width: '100%' }}>
                      <button
                        type="button"
                        onClick={() => setGradoFilterOpen(!gradoFilterOpen)}
                        style={{
                          width:'100%', height:'48px', padding:'0 38px 0 14px',
                          border:'1.5px solid var(--kt-input-border)',
                          borderRadius:'13px', background:'var(--kt-input-bg)',
                          color: gradoFiltro ? 'var(--kt-heading)' : 'var(--kt-text)',
                          fontFamily:"'Manrope', sans-serif", fontWeight: 700, fontSize:'13.5px',
                          display:'flex', alignItems:'center', justifyContent:'space-between',
                          cursor:'pointer', transition: 'all 0.2s', textAlign:'left',
                          position: 'relative'
                        }}
                      >
                        <span style={{ whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
                          {gradoFiltro || "Todos los grados"}
                        </span>
                        <div style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--kt-muted)', display: 'grid', placeItems: 'center' }}>
                           <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: gradoFilterOpen ? 'rotate(180deg)' : 'none', transition:'transform .2s' }}><path d="m6 9 6 6 6-6"/></svg>
                        </div>
                      </button>
                      
                      {gradoFilterOpen && (
                        <div className="kt-scroller" style={{
                          position:'absolute', top:'calc(100% + 6px)', left:0, right:0, 
                          background:'var(--kt-panel-bg)', border:'1px solid var(--kt-panel-border)', 
                          borderRadius:'12px', boxShadow:'0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)', 
                          zIndex:999, maxHeight:'200px', overflowY:'auto', padding:'6px'
                        }}>
                          <div 
                            onClick={() => { setGradoFiltro(''); setGradoFilterOpen(false); }}
                            style={{
                              padding:'10px 12px', borderRadius:'8px', cursor:'pointer',
                              background: gradoFiltro === '' ? 'var(--kt-chip-bg)' : 'transparent',
                              border: gradoFiltro === '' ? '1px solid var(--kt-chip-border)' : '1px solid transparent',
                              color: gradoFiltro === '' ? 'var(--kt-heading)' : 'var(--kt-text)',
                              fontFamily:"'Inter'", fontWeight: gradoFiltro === '' ? 700 : 500, fontSize:'13px',
                              transition:'background .15s',
                              marginBottom: '4px'
                            }}
                            onMouseEnter={(e) => { if (gradoFiltro !== '') e.currentTarget.style.background = 'var(--kt-chip-bg)'; }}
                            onMouseLeave={(e) => { if (gradoFiltro !== '') e.currentTarget.style.background = 'transparent'; }}
                          >
                            Todos los grados
                          </div>
                          {GRADOS_ACADEMICOS.map(gradoOption => {
                            const isSelected = gradoFiltro === gradoOption.value;
                            return (
                              <div
                                key={gradoOption.value}
                                onClick={() => { setGradoFiltro(gradoOption.value); setGradoFilterOpen(false); }}
                                style={{
                                  padding:'10px 12px', borderRadius:'8px', cursor:'pointer',
                                  background: isSelected ? 'var(--kt-chip-bg)' : 'transparent',
                                  border: isSelected ? '1px solid var(--kt-chip-border)' : '1px solid transparent',
                                  color: isSelected ? 'var(--kt-heading)' : 'var(--kt-text)',
                                  fontFamily:"'Inter'", fontWeight: isSelected ? 700 : 500, fontSize:'13px',
                                  transition:'background .15s',
                                  marginBottom: '4px'
                                }}
                                onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.background = 'var(--kt-chip-bg)'; }}
                                onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.background = 'transparent'; }}
                              >
                                {gradoOption.label}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:'20px', alignItems:'stretch' }}>
                    {generating && (
                      <div style={{ display:'flex', flexDirection:'column', padding:'20px', minHeight:'236px', background:'var(--kt-card-bg)', border:'1px solid var(--kt-panel-border)', borderRadius:'16px', boxShadow:'var(--kt-shadow-card)' }}>
                        <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'18px' }}>
                          <div style={{ width:'40px', height:'40px', borderRadius:'11px', background:'rgba(16,185,129,.14)', display:'grid', placeItems:'center', color:'#10B981' }}><span style={{ width:'18px', height:'18px', border:'2.4px solid rgba(16,185,129,.3)', borderTopColor:'#10B981', borderRadius:'50%', display:'block', animation:'ktSpin .7s linear infinite' }}></span></div>
                          <div style={{ fontFamily:"'Manrope'", fontWeight:700, fontSize:'12px', color:'#10B981' }}>Analizando con IA…</div>
                        </div>
                        <div style={{ height:'16px', width:'70%', borderRadius:'6px', marginBottom:'10px', background:'linear-gradient(90deg,var(--kt-chip-bg) 25%,var(--kt-chip-hover) 50%,var(--kt-chip-bg) 75%)', backgroundSize:'720px 100%', animation:'ktShimmer 1.3s infinite linear' }}></div>
                        <div style={{ height:'12px', width:'45%', borderRadius:'6px', background:'linear-gradient(90deg,var(--kt-chip-bg) 25%,var(--kt-chip-hover) 50%,var(--kt-chip-bg) 75%)', backgroundSize:'720px 100%', animation:'ktShimmer 1.3s infinite linear' }}></div>
                      </div>
                    )}

                    {assignmentLoading && (
                      <div style={{ padding:'40px', textAlign:'center', color:'var(--kt-muted)' }}>Cargando temarios...</div>
                    )}

                    {!assignmentLoading && temariosVisibles.length === 0 && (busquedaBiblioteca.trim() !== '' || gradoFiltro !== '') && (
                      <div style={{ gridColumn:'1/-1', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'10px', padding:'56px 20px', textAlign:'center' }}>
                        <div style={{ width:'60px', height:'60px', borderRadius:'16px', background:'var(--kt-chip-bg)', color:'var(--kt-faint)', display:'grid', placeItems:'center' }}><Search size={28} /></div>
                        <div style={{ fontFamily:"'Inter'", fontWeight:600, fontSize:'16px', color:'var(--kt-heading)' }}>Sin coincidencias</div>
                        <div style={{ fontFamily:"'Manrope'", fontWeight:500, fontSize:'13px', color:'var(--kt-muted)' }}>Prueba con otro término o cambia el filtro de estado.</div>
                      </div>
                    )}

                    {temariosVisibles.map(c => {
                      const total = c.temas || 6;
                      const pct = c.progreso || 0;

                      return (
                        <div key={c.id} className="kt-scard" data-status="Activo" onClick={() => { if (c.progreso > 25) { navigate(`/contenido/${c.id}`); } else { navigate('/generador', { state: { temarioId: c.id } }); } }} style={{ display:'flex', flexDirection:'column', padding:'20px', minHeight:'236px', background:'var(--kt-card-bg)', border:'1px solid var(--kt-panel-border)', borderTop:'4px solid var(--sc)', borderRadius:'16px', backdropFilter:'blur(12px)', cursor:'pointer', overflow:'visible', position:'relative' }}>
                          {c.progreso <= 25 && (
                            <div style={{ position:'absolute', top:'-8px', left:'50%', transform:'translateX(-50%)', padding:'8px 14px', background:'rgba(59,130,246,.95)', backdropFilter:'blur(10px)', border:'1px solid rgba(59,130,246,.4)', borderRadius:'10px', fontSize:'12px', fontFamily:"'Manrope'", fontWeight:700, color:'#fff', whiteSpace:'nowrap', zIndex:20, opacity:0, transition:'opacity .2s', pointerEvents:'none', boxShadow:'0 4px 12px rgba(59,130,246,.3)' }} className="card-tooltip">
                              Aún no tienes material generado
                            </div>
                          )}
                          <div style={{ display:'flex', alignItems:'flex-start', gap:'12px', marginBottom:'14px' }}>
                            <div className="kt-cardicon" style={{ width:'42px', height:'42px', flex:'none', borderRadius:'12px', display:'grid', placeItems:'center' }}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><path d="M14 2v6h6"></path></svg></div>
                            <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:'8px' }}>
                              <button
                                type="button"
                                onClick={(event) => handleToggleFavorito(event, c)}
                                disabled={favoritoProcessingId === c.id}
                                aria-label={c.favorito ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                                aria-pressed={Boolean(c.favorito)}
                                style={{ width:'34px', height:'34px', display:'grid', placeItems:'center', border:'none', background:'var(--kt-chip-bg)', borderRadius:'10px', cursor:favoritoProcessingId === c.id ? 'wait' : 'pointer', opacity:favoritoProcessingId === c.id ? .65 : 1 }}
                              >
                                <Heart size={17} color={c.favorito ? '#10B981' : 'var(--kt-faint)'} fill={c.favorito ? '#10B981' : 'none'} />
                              </button>
                            </div>
                          </div>
                          <div style={{ fontFamily:"'Inter'", fontWeight:600, fontSize:'17px', letterSpacing:'-.5px', color:'var(--kt-heading)', lineHeight:1.25 }}>{c.titulo || c.nombre}</div>
                          <div style={{ fontFamily:"'Manrope'", fontWeight:500, fontSize:'13px', color:'var(--kt-muted)', marginTop:'3px' }}>{c.asignatura || asignaturaSeleccionada.nombre}</div>
                          <div style={{ marginTop:'16px', marginBottom:'16px' }}>
                            <div style={{ display:'flex', justifyContent:'space-between', fontFamily:"'Manrope'", fontWeight:600, fontSize:'11px', color:'var(--kt-muted)', marginBottom:'6px' }}><span>Progreso</span><span>{pct}%</span></div>
                            <div style={{ height:'6px', borderRadius:'6px', background:'var(--kt-chip-bg)', overflow:'hidden' }}><div className="kt-progressfill" style={{ height:'100%', borderRadius:'6px', width:`${pct}%`, transition:'width .6s cubic-bezier(.4,0,.2,1)' }}></div></div>
                          </div>
                          <div style={{ marginTop:'auto', display:'flex', alignItems:'center', paddingTop:'14px', borderTop:'1px solid var(--kt-border-soft)' }}>
                            <span style={{ fontFamily:"'Manrope'", fontWeight:600, fontSize:'12px', color:'var(--kt-faint)' }}>{total} subtemas</span>
                            <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:'6px' }}>
                              <button className="kt-iconbtn" onClick={() => handleOpenEdit(c)} aria-label="Editar" style={{ width:'32px', height:'32px', display:'grid', placeItems:'center', border:'none', background:'var(--kt-chip-bg)', borderRadius:'9px', color:'var(--kt-muted)', cursor:'pointer', transition:'background .18s,color .18s' }}><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z"></path></svg></button>
                              <button className="kt-iconbtn del" onClick={(e) => handleDelete(e, c.id, c.titulo || c.nombre)} aria-label="Eliminar" style={{ width:'32px', height:'32px', display:'grid', placeItems:'center', border:'none', background:'var(--kt-chip-bg)', borderRadius:'9px', color:'var(--kt-muted)', cursor:'pointer', transition:'background .18s,color .18s' }}><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path></svg></button>
                              <div style={{ position:'relative' }}>
                                <button data-menu-toggle className="kt-scard-open" title={c.progreso <= 25 ? 'Aún no tienes material generado' : ''} onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === c.id ? null : c.id); }} aria-expanded={openMenuId === c.id} style={{ display:'flex', alignItems:'center', gap:'6px', height:'32px', padding:'0 13px', border:'none', borderRadius:'9px', background:'rgba(var(--sc-rgb),.14)', color:'var(--sc)', cursor:'pointer', fontFamily:"'Manrope'", fontWeight:700, fontSize:'12.5px', transition:'gap .2s' }}>Abrir <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M9 6l6 6-6 6"></path></svg></button>
                                {openMenuId === c.id && (
                                  <div role="menu" onClick={(e) => e.stopPropagation()} style={{ position:'absolute', right:0, bottom:'calc(100% + 8px)', zIndex:30, width:'190px', padding:'8px', background:'var(--kt-modal-bg1)', border:'1px solid var(--kt-modal-border)', borderRadius:'14px', boxShadow:'var(--kt-shadow-card)', backdropFilter:'blur(14px)', display:'flex', flexDirection:'column', gap:'4px' }}>
                                    <button role="menuitem" onClick={(e) => { e.stopPropagation(); setOpenMenuId(null); handleOpenFuente(c); }} className="kt-menu-item" style={{ display:'flex', alignItems:'center', gap:'10px', width:'100%', height:'40px', padding:'0 12px', border:'none', borderRadius:'10px', background:'transparent', color:'var(--kt-heading)', cursor:'pointer', textAlign:'left', fontFamily:"'Manrope'", fontWeight:700, fontSize:'13px', transition:'background .2s' }}>
                                      <FileText size={16} color="var(--kt-muted)" /> Contenido Fuente
                                    </button>
                                    <button role="menuitem" onClick={(e) => { e.stopPropagation(); setOpenMenuId(null); if (c.progreso > 25) { navigate(`/contenido/${c.id}`); } else { navigate('/generador', { state: { temarioId: c.id } }); } }} className="kt-menu-item" style={{ display:'flex', alignItems:'center', gap:'10px', width:'100%', height:'40px', padding:'0 12px', border:'none', borderRadius:'10px', background:'rgba(16,185,129,.1)', color:'#10B981', cursor:'pointer', textAlign:'left', fontFamily:"'Manrope'", fontWeight:800, fontSize:'13px', transition:'background .2s' }}>
                                      <Sparkles size={16} color="#10B981" /> {c.progreso > 25 ? 'Material' : 'Generar Material'}
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    <div className="kt-newcard" onClick={handleOpenCreate} style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'12px', minHeight:'236px', padding:'20px', background:'transparent', border:'2px dashed var(--kt-input-border)', borderRadius:'16px', textAlign:'center' }}>
                      <div className="kt-newplus" style={{ width:'56px', height:'56px', borderRadius:'15px', background:'var(--kt-chip-bg)', color:'#10B981', display:'grid', placeItems:'center', transition:'transform .3s cubic-bezier(.34,1.56,.64,1),background .25s,color .25s' }}><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"></path></svg></div>
                      <div style={{ fontFamily:"'Inter'", fontWeight:600, fontSize:'16px', letterSpacing:'-.4px', color:'var(--kt-heading)' }}>Nuevo Temario</div>
                      <div style={{ fontFamily:"'Manrope'", fontWeight:500, fontSize:'12.5px', color:'var(--kt-muted)' }}>Cargar o generar con IA</div>
                    </div>
                  </div>
                </>
              )}

              {/* ============ VIEW: FAVORITOS ============ */}
              {view === 'favoritos' && (
                <>
                  <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'6px' }}>
                    <span style={{ width:'38px', height:'38px', flex:'none', borderRadius:'11px', background:'rgba(16,185,129,.14)', color:'#10B981', display:'grid', placeItems:'center' }}><Heart size={19} fill="currentColor" /></span>
                    <h2 style={{ fontFamily:"'Inter'", fontWeight:600, fontSize:'19px', letterSpacing:'-.6px', color:'var(--kt-heading)', margin:0 }}>Temarios Favoritos</h2>
                    <span style={{ padding:'3px 10px', borderRadius:'20px', background:'rgba(16,185,129,.12)', border:'1px solid rgba(16,185,129,.25)', fontFamily:"'Manrope'", fontWeight:700, fontSize:'11px', color:'#10B981' }}>{favoriteCourses.length}</span>
                  </div>
                  <p style={{ fontFamily:"'Manrope'", fontWeight:500, fontSize:'13.5px', color:'var(--kt-muted)', margin:'0 0 22px' }}>Tus temarios marcados de todas las asignaturas, en un solo lugar.</p>

                  {favoritesLoading && (
                    <div style={{ padding:'40px', textAlign:'center', color:'var(--kt-muted)' }}>Cargando favoritos...</div>
                  )}

                  {!favoritesLoading && favoriteCourses.length > 0 && (
                    <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:'20px', alignItems:'stretch' }}>
                      {favoriteCourses.map(c => {
                        const subj = asignaturas.find(a => a.id === c.asignaturaId);
                        const meta = subj ? getMeta(subj.id) : null;
                        const accent = meta ? meta.color : '#10B981';
                        const total = c.temas || 6;
                        const pct = c.progreso || 0;
                        return (
                          <div key={c.id} className="kt-scard" data-status="Activo" onClick={() => { if (c.progreso > 25) { navigate(`/contenido/${c.id}`); } else { navigate('/generador', { state: { temarioId: c.id } }); } }} style={{ display:'flex', flexDirection:'column', padding:'20px', minHeight:'236px', background:'var(--kt-card-bg)', border:'1px solid var(--kt-panel-border)', borderTop:'4px solid var(--sc)', borderRadius:'16px', backdropFilter:'blur(12px)', cursor:'pointer', overflow:'visible', position:'relative' }}>
                            {c.progreso <= 25 && (
                              <div style={{ position:'absolute', top:'-8px', left:'50%', transform:'translateX(-50%)', padding:'8px 14px', background:'rgba(59,130,246,.95)', backdropFilter:'blur(10px)', border:'1px solid rgba(59,130,246,.4)', borderRadius:'10px', fontSize:'12px', fontFamily:"'Manrope'", fontWeight:700, color:'#fff', whiteSpace:'nowrap', zIndex:20, opacity:0, transition:'opacity .2s', pointerEvents:'none', boxShadow:'0 4px 12px rgba(59,130,246,.3)' }} className="card-tooltip">
                                Aún no tienes material generado
                              </div>
                            )}
                            <div style={{ display:'flex', alignItems:'flex-start', gap:'12px', marginBottom:'14px' }}>
                              <div className="kt-cardicon" style={{ width:'42px', height:'42px', flex:'none', borderRadius:'12px', display:'grid', placeItems:'center' }}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><path d="M14 2v6h6"></path></svg></div>
                              <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:'8px' }}>
                                <button
                                  type="button"
                                  onClick={(event) => handleToggleFavorito(event, c)}
                                  disabled={favoritoProcessingId === c.id}
                                  aria-label="Quitar de favoritos"
                                  aria-pressed={Boolean(c.favorito)}
                                  style={{ width:'34px', height:'34px', display:'grid', placeItems:'center', border:'none', background:'var(--kt-chip-bg)', borderRadius:'10px', cursor:favoritoProcessingId === c.id ? 'wait' : 'pointer', opacity:favoritoProcessingId === c.id ? .65 : 1 }}
                                >
                                  <Heart size={17} color={c.favorito ? '#10B981' : 'var(--kt-faint)'} fill={c.favorito ? '#10B981' : 'none'} />
                                </button>
                              </div>
                            </div>
                            <div style={{ fontFamily:"'Inter'", fontWeight:600, fontSize:'17px', letterSpacing:'-.5px', color:'var(--kt-heading)', lineHeight:1.25 }}>{c.titulo || c.nombre}</div>
                            <div style={{ fontFamily:"'Manrope'", fontWeight:500, fontSize:'13px', color:'var(--kt-muted)', marginTop:'3px' }}>{c.asignatura || subj?.nombre}</div>
                            <div style={{ marginTop:'16px', marginBottom:'16px' }}>
                              <div style={{ display:'flex', justifyContent:'space-between', fontFamily:"'Manrope'", fontWeight:600, fontSize:'11px', color:'var(--kt-muted)', marginBottom:'6px' }}><span>Progreso</span><span>{pct}%</span></div>
                              <div style={{ height:'6px', borderRadius:'6px', background:'var(--kt-chip-bg)', overflow:'hidden' }}><div className="kt-progressfill" style={{ height:'100%', borderRadius:'6px', width:`${pct}%`, transition:'width .6s cubic-bezier(.4,0,.2,1)' }}></div></div>
                            </div>
                            <div style={{ marginTop:'auto', display:'flex', alignItems:'center', paddingTop:'14px', borderTop:'1px solid var(--kt-border-soft)' }}>
                              <span style={{ fontFamily:"'Manrope'", fontWeight:600, fontSize:'12px', color:'var(--kt-faint)' }}>{total} subtemas</span>
                              <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:'6px' }}>
                                <button className="kt-iconbtn" onClick={() => handleOpenEdit(c)} aria-label="Editar" style={{ width:'32px', height:'32px', display:'grid', placeItems:'center', border:'none', background:'var(--kt-chip-bg)', borderRadius:'9px', color:'var(--kt-muted)', cursor:'pointer', transition:'background .18s,color .18s' }}><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z"></path></svg></button>
                                <button className="kt-iconbtn del" onClick={(e) => handleDelete(e, c.id, c.titulo || c.nombre)} aria-label="Eliminar" style={{ width:'32px', height:'32px', display:'grid', placeItems:'center', border:'none', background:'var(--kt-chip-bg)', borderRadius:'9px', color:'var(--kt-muted)', cursor:'pointer', transition:'background .18s,color .18s' }}><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path></svg></button>
                                <div style={{ position:'relative' }}>
                                  <button data-menu-toggle className="kt-scard-open" title={c.progreso <= 25 ? 'Aún no tienes material generado' : ''} onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === c.id ? null : c.id); }} aria-expanded={openMenuId === c.id} style={{ display:'flex', alignItems:'center', gap:'6px', height:'32px', padding:'0 13px', border:'none', borderRadius:'9px', background:'rgba(var(--sc-rgb),.14)', color:'var(--sc)', cursor:'pointer', fontFamily:"'Manrope'", fontWeight:700, fontSize:'12.5px', transition:'gap .2s' }}>Abrir <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M9 6l6 6-6 6"></path></svg></button>
                                  {openMenuId === c.id && (
                                    <div role="menu" onClick={(e) => e.stopPropagation()} style={{ position:'absolute', right:0, bottom:'calc(100% + 8px)', zIndex:30, width:'190px', padding:'8px', background:'var(--kt-modal-bg1)', border:'1px solid var(--kt-modal-border)', borderRadius:'14px', boxShadow:'var(--kt-shadow-card)', backdropFilter:'blur(14px)', display:'flex', flexDirection:'column', gap:'4px' }}>
                                      <button role="menuitem" onClick={(e) => { e.stopPropagation(); setOpenMenuId(null); handleOpenFuente(c); }} className="kt-menu-item" style={{ display:'flex', alignItems:'center', gap:'10px', width:'100%', height:'40px', padding:'0 12px', border:'none', borderRadius:'10px', background:'transparent', color:'var(--kt-heading)', cursor:'pointer', textAlign:'left', fontFamily:"'Manrope'", fontWeight:700, fontSize:'13px', transition:'background .2s' }}>
                                        <FileText size={16} color="var(--kt-muted)" /> Contenido Fuente
                                      </button>
                                      <button role="menuitem" onClick={(e) => { e.stopPropagation(); setOpenMenuId(null); if (c.progreso > 25) { navigate(`/contenido/${c.id}`); } else { navigate('/generador', { state: { temarioId: c.id } }); } }} className="kt-menu-item" style={{ display:'flex', alignItems:'center', gap:'10px', width:'100%', height:'40px', padding:'0 12px', border:'none', borderRadius:'10px', background:'rgba(16,185,129,.1)', color:'#10B981', cursor:'pointer', textAlign:'left', fontFamily:"'Manrope'", fontWeight:800, fontSize:'13px', transition:'background .2s' }}>
                                        <Sparkles size={16} color="#10B981" /> {c.progreso > 25 ? 'Material' : 'Generar Material'}
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {!favoritesLoading && favoriteCourses.length === 0 && (
                    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'14px', padding:'64px 20px', textAlign:'center', background:'var(--kt-panel-bg)', border:'1px dashed var(--kt-input-border)', borderRadius:'20px' }}>
                      <div style={{ width:'72px', height:'72px', borderRadius:'20px', background:'rgba(16,185,129,.1)', color:'#10B981', display:'grid', placeItems:'center' }}><Heart size={34} /></div>
                      <div style={{ fontFamily:"'Inter'", fontWeight:600, fontSize:'18px', letterSpacing:'-.5px', color:'var(--kt-heading)' }}>Aún no tienes favoritos</div>
                      <div style={{ fontFamily:"'Manrope'", fontWeight:500, fontSize:'13.5px', color:'var(--kt-muted)', maxWidth:'360px' }}>Marca un temario con el ♥ para tenerlo siempre a mano aquí, sin importar la asignatura.</div>
                      <button onClick={() => setVistaFavoritos(false)} className="kt-primary" style={{ display:'flex', alignItems:'center', gap:'8px', height:'44px', padding:'0 20px', border:'none', borderRadius:'11px', background:'linear-gradient(150deg,#10B981,#059669)', color:'#fff', cursor:'pointer', fontFamily:"'Manrope'", fontWeight:800, fontSize:'14px', boxShadow:'0 12px 26px -12px rgba(16,185,129,.7)', marginTop:'4px' }}>Explorar asignaturas</button>
                    </div>
                  )}
                </>
              )}

            </div>
          </div>
        </main>

        <aside ref={fuenteRef} className="kt-fuente-wrapper" aria-label="Contenido fuente del temario">
          <div style={{ width:'420px', height:'100%', display:'flex', flexDirection:'column' }}>
            {sourcePanelCourse && (() => {
              const fuenteSubj = asignaturas.find(a => a.id === sourcePanelCourse.asignaturaId);
              const fuenteMeta = fuenteSubj ? getMeta(fuenteSubj.id) : null;
              const fuenteAccent = fuenteMeta ? fuenteMeta.color : '#10B981';
              return (
              <>
                <div style={{ display:'flex', alignItems:'center', padding:'26px 22px 20px', borderBottom:'1px solid var(--kt-border-soft)' }}>
                  <span style={{ fontFamily:"'Inter'", fontWeight:600, fontSize:'16px', letterSpacing:'-.3px', color:'var(--kt-heading)' }}>Contenido Fuente</span>
                  <button onClick={handleCloseFuente} aria-label="Cerrar" style={{ marginLeft:'auto', width:'30px', height:'30px', display:'grid', placeItems:'center', border:'none', background:'var(--kt-chip-bg)', borderRadius:'9px', color:'var(--kt-muted)', cursor:'pointer' }}><X size={16} /></button>
                </div>
                <div style={{ flex:1, overflow:'auto', padding:'28px 24px' }}>
                  <div style={{ display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center', paddingBottom:'22px', borderBottom:'1px solid var(--kt-border-soft)', marginBottom:'22px' }}>
                    <div style={{ width:'72px', height:'72px', borderRadius:'18px', display:'grid', placeItems:'center', color:'#fff', marginBottom:'14px', background:`linear-gradient(150deg,${fuenteAccent},${darkenHex(fuenteAccent)})` }}>
                      <FileText size={30} />
                    </div>
                    <div style={{ fontFamily:"'Inter'", fontWeight:600, fontSize:'18px', letterSpacing:'-.4px', color:'var(--kt-heading)' }}>{sourcePanelCourse.titulo || sourcePanelCourse.nombre}</div>
                    {fuenteSubj && (
                      <div style={{ fontFamily:"'Manrope'", fontWeight:500, fontSize:'13px', color:'var(--kt-muted)', marginTop:'3px' }}>{fuenteMeta?.nombreOverride || fuenteSubj.nombre}</div>
                    )}
                    {sourcePanelCourse.descripcion && (
                      <div style={{ fontFamily:"'Manrope'", fontWeight:500, fontSize:'12px', color:'var(--kt-muted)', lineHeight:1.6, marginTop:'10px' }}>{sourcePanelCourse.descripcion}</div>
                    )}
                  </div>
                  <div style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
                    <div>
                      <div style={{ fontFamily:"'Manrope'", fontWeight:700, fontSize:'10px', letterSpacing:'1px', textTransform:'uppercase', color:'var(--kt-label)', marginBottom:'12px' }}>CONTENIDO FUENTE</div>
                      {sourceLoading && (
                        <div style={{ display:'flex', alignItems:'center', gap:'10px', color:'var(--kt-muted)', fontFamily:"'Manrope'", fontWeight:700, fontSize:'13px' }}>
                          <span style={{ width:'18px', height:'18px', border:'2px solid var(--kt-input-border)', borderTopColor:'#10B981', borderRadius:'50%', animation:'ktSpin .7s linear infinite' }}></span>
                          Cargando contenido...
                        </div>
                      )}
                      {!sourceLoading && sourceError && (
                        <div style={{ padding:'12px 14px', borderRadius:'10px', background:'rgba(244,63,94,.1)', border:'1px solid rgba(244,63,94,.3)', color:'#F43F5E', fontFamily:"'Manrope'", fontWeight:600, fontSize:'12px', lineHeight:1.5 }}>{sourceError}</div>
                      )}
                      {!sourceLoading && !sourceError && sourceContent && (
                        <div className="markdown-body" style={{ overflowWrap:'anywhere', fontSize:'13px', lineHeight:1.6 }}>
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {prepararContenidoFuente(sourceContent.contenidoFuente) || 'El temario no contiene texto fuente.'}
                          </ReactMarkdown>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div style={{ display:'flex', gap:'12px', padding:'18px 24px', borderTop:'1px solid var(--kt-border-soft)' }}>
                  <button onClick={handleCloseFuente} style={{ flex:1, height:'42px', border:'1px solid var(--kt-input-border)', background:'none', color:'var(--kt-text)', cursor:'pointer', fontFamily:"'Manrope'", fontWeight:700, fontSize:'13.5px', borderRadius:'10px' }}>Cerrar</button>
                  <button className="kt-primary" onClick={() => { handleCloseFuente(); navigate('/generador', { state: { temarioId: sourcePanelCourse.id } }); }} style={{ flex:1, height:'42px', border:'none', borderRadius:'10px', background:'linear-gradient(150deg,#10B981,#059669)', color:'#fff', cursor:'pointer', fontFamily:"'Manrope'", fontWeight:800, fontSize:'13.5px', display:'flex', alignItems:'center', justifyContent:'center', gap:'6px' }}>
                    <Sparkles size={16} />
                    Generar Material
                  </button>
                </div>
              </>
              );
            })()}
          </div>
        </aside>

        <DeleteConfirmationModal
          open={Boolean(deletePending)}
          title={`Eliminar ${deletePending?.type || ''}`}
          name={deletePending?.name || ''}
          loading={deleteProcessing}
          onCancel={() => setDeletePending(null)}
          onConfirm={handleConfirmDelete}
        />

        {/* ============ ADD / EDIT SUBJECT MODAL ============ */}
        <div data-modal data-submodal style={{ position:'absolute', inset:0, zIndex:50, display:'flex', alignItems:'center', justifyContent:'center', padding:'24px' }}>
          <div onClick={() => setAsignaturaModalOpen(false)} style={{ position:'absolute', inset:0, background:'var(--kt-modal-backdrop)', backdropFilter:'blur(8px)', WebkitBackdropFilter:'blur(8px)' }}></div>
          <div data-modal-panel style={{ position:'relative', width:'100%', maxWidth:'540px', maxHeight:'92vh', overflow:'auto', background:'linear-gradient(180deg,var(--kt-modal-bg1),var(--kt-modal-bg2))', border:'1px solid var(--kt-modal-border)', borderRadius:'20px', boxShadow:'var(--kt-shadow-modal)', padding:'26px 28px' }}>
            <div style={{ display:'flex', alignItems:'flex-start', gap:'14px', marginBottom:'20px' }}>
              <div style={{ width:'52px', height:'52px', flex:'none', borderRadius:'14px', background:`rgba(${rgbFromHex(smColor)},.14)`, color:smColor, display:'grid', placeItems:'center', transition:'background .2s,color .2s' }}>
                {(() => { const SmIcon = SUBJECT_ICONS[smIcon] || SUBJECT_ICONS.book; return <SmIcon size={24} />; })()}
              </div>
              <div style={{ flex:1 }}>
                <span style={{ display:'inline-flex', alignItems:'center', padding:'4px 10px', borderRadius:'7px', background:'rgba(16,185,129,.14)', color:'#059669', fontFamily:"'Manrope'", fontWeight:800, fontSize:'9.5px', letterSpacing:'1.2px', textTransform:'uppercase', marginBottom:'9px' }}><span className="kt-sm-create">Nueva asignatura</span><span className="kt-sm-edit">Editar asignatura</span></span>
                <h3 style={{ fontFamily:"'Inter'", fontWeight:600, fontSize:'21px', letterSpacing:'-.7px', color:'var(--kt-heading)', margin:0 }}><span className="kt-sm-create">Crear asignatura</span><span className="kt-sm-edit">Editar asignatura</span></h3>
              </div>
              <button onClick={() => setAsignaturaModalOpen(false)} aria-label="Cerrar" style={{ flex:'none', width:'34px', height:'34px', display:'grid', placeItems:'center', border:'none', background:'var(--kt-chip-bg)', borderRadius:'50%', color:'var(--kt-muted)', cursor:'pointer' }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"></path></svg></button>
            </div>

            <div style={{ height:'1px', background:'var(--kt-border-soft)', marginBottom:'20px' }}></div>

            <div style={{ marginBottom:'16px' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'6px', marginBottom:'8px' }}><span style={{ fontFamily:"'Manrope'", fontWeight:700, fontSize:'10px', letterSpacing:'1px', textTransform:'uppercase', color:'var(--kt-label)' }}>Nombre de la asignatura</span><span style={{ color:'#10B981' }}>*</span></div>
              <input
                value={nombreAsignatura}
                onChange={(e) => { setNombreAsignatura(e.target.value); if (e.target.value.trim()) setNameError(false); }}
                placeholder="Ej. Español I, Matemáticas II…"
                style={{ width:'100%', height:'48px', padding:'0 15px', border:`1.5px solid ${nameError ? 'rgba(16,185,129,.6)' : 'var(--kt-input-border)'}`, borderRadius:'12px', background:'var(--kt-input-bg)', color:'var(--kt-heading)', fontWeight:600, fontSize:'14.5px' }}
              />
              {nameError && (
                <div style={{ display:'flex', alignItems:'center', gap:'6px', marginTop:'7px', fontFamily:"'Manrope'", fontWeight:600, fontSize:'11.5px', color:'#10B981' }}><AlertCircle size={13} /><span>El nombre es obligatorio.</span></div>
              )}
            </div>

            <div style={{ marginBottom:'18px' }}>
              <div style={{ fontFamily:"'Manrope'", fontWeight:700, fontSize:'10px', letterSpacing:'1px', textTransform:'uppercase', color:'var(--kt-label)', marginBottom:'8px' }}>Descripción <span style={{ color:'var(--kt-faint)', fontWeight:600 }}>(opcional)</span></div>
              <textarea value={descripcionAsignatura} onChange={(e) => setDescripcionAsignatura(e.target.value)} rows={2} placeholder="Breve descripción de la asignatura…" style={{ width:'100%', padding:'12px 15px', border:'1.5px solid var(--kt-input-border)', borderRadius:'12px', background:'var(--kt-input-bg)', color:'var(--kt-heading)', fontWeight:500, fontSize:'14px', resize:'vertical' }}></textarea>
            </div>

            <div style={{ marginBottom:'18px' }}>
              <div style={{ fontFamily:"'Manrope'", fontWeight:700, fontSize:'10px', letterSpacing:'1px', textTransform:'uppercase', color:'var(--kt-label)', marginBottom:'10px' }}>Color de la asignatura</div>
              <div style={{ display:'flex', gap:'10px', flexWrap:'wrap' }}>
                {SUBJECT_COLORS.map((color) => {
                  const on = smColor === color;
                  return (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSmColor(color)}
                      aria-label={color}
                      style={{
                        width:'38px',
                        height:'38px',
                        borderRadius:'12px',
                        border: on ? '2px solid var(--kt-heading)' : '2px solid transparent',
                        background: color,
                        cursor: 'pointer',
                        boxShadow: on ? `0 0 0 3px var(--kt-modal-bg1), 0 0 0 5px ${color}` : '0 2px 5px rgba(0,0,0,0.1)',
                        display: 'grid',
                        placeItems: 'center',
                        color: '#fff',
                        transition: 'transform .18s, box-shadow .18s'
                      }}
                    >
                      {on && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"></path></svg>}
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ marginBottom:'18px', position:'relative' }}>
              <div style={{ fontFamily:"'Manrope'", fontWeight:700, fontSize:'10px', letterSpacing:'1px', textTransform:'uppercase', color:'var(--kt-label)', marginBottom:'10px' }}>Ícono</div>
              <button 
                type="button" 
                onClick={() => setIconPickerOpen(!iconPickerOpen)} 
                style={{ width:'100%', height:'48px', padding:'0 15px', border:'1.5px solid var(--kt-input-border)', borderRadius:'12px', background:'var(--kt-input-bg)', color:'var(--kt-heading)', display:'flex', alignItems:'center', justifyContent:'space-between', cursor:'pointer' }}
              >
                <div style={{ display:'flex', alignItems:'center', gap:'12px', fontWeight:600, fontSize:'14px' }}>
                  {(() => {
                    const CurrentIcon = SUBJECT_ICONS[smIcon] || SUBJECT_ICONS['book'];
                    return <CurrentIcon size={20} style={{ color: smColor }} />;
                  })()}
                  <span style={{ textTransform: 'capitalize' }}>{ICON_NAMES_ES[smIcon] || smIcon}</span>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: .6, transform: iconPickerOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}><path d="m6 9 6 6 6-6"/></svg>
              </button>
              
              {iconPickerOpen && (
                <div style={{ position:'absolute', zIndex:100, bottom:'calc(100% + 6px)', left:0, width:'100%', background:'var(--kt-modal-bg1)', border:'1.5px solid var(--kt-input-border)', borderRadius:'14px', boxShadow:'var(--kt-shadow-modal)', padding:'12px', maxHeight:'280px', display:'flex', flexDirection:'column' }}>
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(46px, 1fr))', gap:'8px', overflowY:'auto' }}>
                    {ICON_KEYS.map((key) => {
                      const IconOpt = SUBJECT_ICONS[key];
                      const on = smIcon === key;
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => { setSmIcon(key); setIconPickerOpen(false); }}
                          aria-label={ICON_NAMES_ES[key] || key}
                          title={ICON_NAMES_ES[key] || key}
                          style={{ width:'46px', height:'46px', borderRadius:'10px', border:`1.5px solid ${on ? smColor : 'transparent'}`, background:on ? `rgba(${rgbFromHex(smColor)},.14)` : 'transparent', color:on ? smColor : 'var(--kt-muted)', cursor:'pointer', display:'grid', placeItems:'center', transition:'all .18s' }}
                          onMouseOver={(e) => { if(!on) { e.currentTarget.style.background = 'var(--kt-chip-bg)'; e.currentTarget.style.color = 'var(--kt-heading)'; } }}
                          onMouseOut={(e) => { if(!on) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--kt-muted)'; } }}
                        ><IconOpt size={22} /></button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div style={{ height:'1px', background:'var(--kt-border-soft)', margin:'22px 0 18px' }}></div>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'flex-end', gap:'14px' }}>
              <button onClick={() => setAsignaturaModalOpen(false)} style={{ height:'46px', padding:'0 18px', border:'none', background:'none', color:'var(--kt-muted)', cursor:'pointer', fontFamily:"'Manrope'", fontWeight:700, fontSize:'14px' }}>Cancelar</button>
              <button className="kt-primary" onClick={handleSubmitAsignatura} disabled={asignaturasLoading} style={{ height:'46px', padding:'0 24px', border:'none', borderRadius:'12px', background:'linear-gradient(150deg,#10B981,#059669)', color:'#fff', cursor:'pointer', fontFamily:"'Manrope'", fontWeight:800, fontSize:'14px', boxShadow:'0 12px 26px -12px rgba(16,185,129,.7)', display:'flex', alignItems:'center', gap:'9px' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"></path></svg>
                <span className="kt-sm-create">{asignaturasLoading ? 'Guardando...' : 'Crear asignatura'}</span><span className="kt-sm-edit">Guardar cambios</span>
              </button>
            </div>
          </div>
        </div>

        {/* ============ CARGAR / EDITAR TEMARIO MODAL ============ */}
        <div data-modal style={{ position:'absolute', inset:0, zIndex:50, display:'flex', alignItems:'center', justifyContent:'center', padding:'24px' }}>
          <div onClick={() => setModalOpen(false)} style={{ position:'absolute', inset:0, background:'var(--kt-modal-backdrop)', backdropFilter:'blur(8px)', WebkitBackdropFilter:'blur(8px)' }}></div>
          <div data-modal-panel style={{ position:'relative', display:'flex', flexDirection:'column', width:'100%', maxWidth:'560px', height:'92vh', background:'linear-gradient(180deg,var(--kt-modal-bg1),var(--kt-modal-bg2))', border:'1px solid var(--kt-modal-border)', borderRadius:'20px', boxShadow:'var(--kt-shadow-modal)' }}>
            <div style={{ padding:'26px 28px', flex:'none' }}>
              <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:'12px', marginBottom:'12px' }}>
                <div>
                  <span style={{ display:'inline-flex', alignItems:'center', padding:'4px 10px', borderRadius:'7px', background:'rgba(16,185,129,.14)', color:'#059669', fontFamily:"'Manrope'", fontWeight:800, fontSize:'9.5px', letterSpacing:'1.2px', textTransform:'uppercase', marginBottom:'12px' }}>
                    {editId ? 'Editar Temario' : 'Ingesta Inteligente'}
                  </span>
                  <h3 style={{ fontFamily:"'Inter'", fontWeight:600, fontSize:'22px', letterSpacing:'-.8px', color:'var(--kt-heading)', margin:0 }}>
                    {editId ? 'Editar Temario' : 'Cargar Temario'}
                  </h3>
                </div>
                <button onClick={() => setModalOpen(false)} aria-label="Cerrar" style={{ flex:'none', width:'34px', height:'34px', display:'grid', placeItems:'center', border:'none', background:'var(--kt-chip-bg)', borderRadius:'50%', color:'var(--kt-muted)', cursor:'pointer' }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"></path></svg></button>
              </div>
              <p style={{ fontFamily:"'Manrope'", fontWeight:500, fontSize:'13px', color:'var(--kt-muted)', margin:0 }}>
                Sube un archivo, ingresa un enlace o define manualmente el temario para estructurar el contenido.
              </p>
            </div>

            <div style={{ height:'1px', background:'var(--kt-border-soft)', flex:'none' }}></div>

            <div style={{ flex:1, overflowY:'auto', overflowX:'hidden', padding:'0 28px' }}>
              <div style={{ padding:'18px 0' }}>

            {!editId && (
              <div style={{ display:'flex', gap:'4px', padding:'5px', background:'var(--kt-input-bg)', border:'1px solid var(--kt-input-border)', borderRadius:'12px', marginBottom:'20px' }}>
                <button
                  data-tab-opt="file"
                  onClick={() => (puedeCargarArchivo ? setTab('file') : setPlanModalAbierto(true))}
                  style={{ flex:1, height:'38px', border:'none', borderRadius:'9px', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:'6px', fontFamily:"'Manrope'", fontWeight:700, fontSize:'13px', transition:'all .2s', opacity: puedeCargarArchivo ? 1 : .7 }}
                >
                  {!puedeCargarArchivo && <Lock size={11} />}
                  PDF / Archivo
                </button>
                <button
                  data-tab-opt="web"
                  onClick={() => (puedeCargarUrl ? setTab('web') : setPlanModalAbierto(true))}
                  style={{ flex:1, height:'38px', border:'none', borderRadius:'9px', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:'6px', fontFamily:"'Manrope'", fontWeight:700, fontSize:'13px', transition:'all .2s', opacity: puedeCargarUrl ? 1 : .7 }}
                >
                  {!puedeCargarUrl && <Lock size={11} />}
                  Enlace Web
                </button>
                <button data-tab-opt="manual" onClick={() => setTab('manual')} style={{ flex:1, height:'38px', border:'none', borderRadius:'9px', cursor:'pointer', fontFamily:"'Manrope'", fontWeight:700, fontSize:'13px', transition:'all .2s' }}>Manual</button>
              </div>
            )}

            {!editId && (
              <div style={{ marginBottom: '20px' }}>
                {tab === 'file' && (
                  <label onDragEnter={handleDrag} onDragOver={handleDrag} onDragLeave={handleDrag} onDrop={handleDrop} style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'8px', padding:'24px 20px', border:`2px dashed ${dragActive ? 'rgba(16,185,129,.5)' : 'var(--kt-input-border)'}`, borderRadius:'14px', cursor:'pointer', textAlign:'center', transition:'border-color .2s,background .2s', background: dragActive ? 'rgba(16,185,129,.04)' : 'transparent', height:'220px', boxSizing:'border-box' }}>
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

                {tab === 'web' && (
                  <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
                    <div>
                      <div style={{ fontFamily:"'Manrope'", fontWeight:700, fontSize:'10px', letterSpacing:'1px', color:'var(--kt-label)', marginBottom:'8px' }}>DIRECCIÓN URL DEL TEMARIO</div>
                      <input value={url} onChange={e => setUrl(e.target.value)} placeholder="https://universidad.edu/programas/matematicas-1.html" style={{ width:'100%', height:'48px', padding:'0 15px', border:'1.5px solid var(--kt-input-border)', borderRadius:'12px', background:'var(--kt-input-bg)', color:'var(--kt-heading)', fontWeight:500, fontSize:'14px' }} />
                    </div>
                    <div style={{ display:'flex', gap:'11px', padding:'12px 14px', borderRadius:'12px', background:'rgba(16,185,129,.08)', border:'1px solid rgba(16,185,129,.25)' }}>
                      <span style={{ flex:'none', color:'#10B981' }}><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4M12 8h.01"></path></svg></span>
                      <div style={{ fontFamily:"'Manrope'", fontWeight:700, fontSize:'12px', lineHeight:1.45, color:'#059669' }}><span style={{ fontWeight:800 }}>Importación Web:</span> La IA analizará la página provista para extraer los temas y estructurar el temario automáticamente.</div>
                    </div>
                  </div>
                )}

                {tab === 'manual' && (
                  <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
                    <div style={{ display:'flex', gap:'11px', padding:'12px 14px', borderRadius:'12px', background:'rgba(16,185,129,.08)', border:'1px solid rgba(16,185,129,.25)' }}>
                      <span style={{ flex:'none', color:'#10B981' }}><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4M12 8h.01"></path></svg></span>
                      <div style={{ fontFamily:"'Manrope'", fontWeight:700, fontSize:'12.5px', lineHeight:1.45, color:'#059669' }}><span style={{ fontWeight:800 }}>Creación Manual Inteligente:</span> Define los metadatos y la IA estructurará el temario de forma autónoma.</div>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="kt-modal-2col" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px', marginTop:'20px' }}>
              <div>
                <div style={{ fontFamily:"'Manrope'", fontWeight:700, fontSize:'10px', letterSpacing:'1px', color:'var(--kt-label)', marginBottom:'8px' }}>TÍTULO DEL TEMARIO</div>
                <input value={titulo} onChange={e => setTitulo(e.target.value)} placeholder="Ej. Programación Avanzada" style={{ width:'100%', height:'46px', padding:'0 14px', border:'1.5px solid var(--kt-input-border)', borderRadius:'11px', background:'var(--kt-input-bg)', color:'var(--kt-heading)', fontWeight:500, fontSize:'14px' }} />
              </div>
              <div>
                <div style={{ fontFamily:"'Manrope'", fontWeight:700, fontSize:'10px', letterSpacing:'1px', color:'var(--kt-label)', marginBottom:'8px' }}>ASIGNATURA</div>
                <select
                  value={asignaturaId}
                  onChange={e => setAsignaturaId(e.target.value)}
                  disabled={!!asignaturaActiva || !!editId}
                  style={{ width:'100%', height:'46px', padding:'0 14px', border:'1.5px solid var(--kt-input-border)', borderRadius:'11px', background:'var(--kt-input-bg)', color:asignaturaId ? 'var(--kt-heading)' : 'var(--kt-muted)', fontWeight:700, fontSize:'14px', cursor: (asignaturaActiva || editId) ? 'not-allowed' : 'pointer', opacity: (asignaturaActiva || editId) ? 0.75 : 1, WebkitAppearance:'none', MozAppearance:'none', appearance:'none' }}
                >
                  <option value="">{asignaturas.length ? 'Selecciona una asignatura' : 'Sin asignaturas disponibles'}</option>
                  {asignaturas.map(item => <option key={item.id} value={item.id}>{getMeta(item.id).nombreOverride || item.nombre}</option>)}
                </select>
              </div>
            </div>

            {(!asignaturaActiva && !editId) && (
              <div style={{ marginTop:'10px', display:'flex', alignItems:'center', gap:'12px', flexWrap:'wrap' }}>
                {asignaturas.length === 0 && (
                  <span style={{ fontFamily:"'Manrope'", fontWeight:700, fontSize:'12px', color:'#F59E0B' }}>Debes crear una asignatura antes de cargar el temario.</span>
                )}
                <button type="button" onClick={() => setCreandoAsignaturaTemario(value => !value)} style={{ marginLeft:asignaturas.length ? 'auto' : 0, border:'none', background:'none', color:'#10B981', cursor:'pointer', fontFamily:"'Manrope'", fontWeight:800, fontSize:'12.5px' }}>+ Crear asignatura</button>
              </div>
            )}

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

            {!editId && (
              <div style={{ marginTop:'16px' }}>
                <div style={{ fontFamily:"'Manrope'", fontWeight:700, fontSize:'10px', letterSpacing:'1px', color:'var(--kt-label)', marginBottom:'8px' }}>OBJETIVO DEL TEMARIO (OPCIONAL)</div>
                <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={2} placeholder="Objetivo general del temario…" style={{ width:'100%', padding:'10px 12px', border:'1.5px solid var(--kt-input-border)', borderRadius:'11px', background:'var(--kt-input-bg)', color:'var(--kt-heading)', fontWeight:500, fontSize:'13.5px', resize:'none', marginBottom:'16px' }}></textarea>

                <div style={{ fontFamily:"'Manrope'", fontWeight:700, fontSize:'10px', letterSpacing:'1px', color:'var(--kt-label)', marginBottom:'8px' }}>GRADO ACADÉMICO *</div>
                <div ref={gradoModalRef} style={{ position:'relative', width:'100%', marginBottom:'16px' }}>
                  <button
                    type="button"
                    onClick={() => setGradoModalOpen(!gradoModalOpen)}
                    style={{
                      width:'100%', height:'46px', padding:'0 38px 0 14px',
                      border:'1.5px solid var(--kt-input-border)',
                      borderRadius:'11px', background:'var(--kt-input-bg)',
                      color: grado ? 'var(--kt-heading)' : 'var(--kt-muted)',
                      fontFamily:"'Manrope'", fontWeight:700, fontSize:'14px',
                      display:'flex', alignItems:'center', justifyContent:'space-between',
                      cursor:'pointer', transition:'all .2s', textAlign:'left', position:'relative'
                    }}
                  >
                    <span style={{ whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
                      {GRADOS_ACADEMICOS.find(g => g.value === grado)?.label || 'Selecciona un grado…'}
                    </span>
                    <div style={{ position:'absolute', right:'14px', top:'50%', transform:'translateY(-50%)', pointerEvents:'none', color:'var(--kt-muted)', display:'grid', placeItems:'center' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: gradoModalOpen ? 'rotate(180deg)' : 'none', transition:'transform .2s' }}><path d="m6 9 6 6 6-6"/></svg>
                    </div>
                  </button>
                  {gradoModalOpen && (
                    <div className="kt-scroller" style={{
                      position:'absolute', top:'calc(100% + 6px)', left:0, right:0,
                      background:'var(--kt-bg1)', border:'1px solid var(--kt-panel-border)',
                      borderRadius:'12px', boxShadow:'0 10px 25px -5px rgba(0,0,0,0.15), 0 8px 10px -6px rgba(0,0,0,0.15)',
                      zIndex:999, maxHeight:'200px', overflowY:'auto', padding:'6px'
                    }}>
                      {GRADOS_ACADEMICOS.map(g => {
                        const isSelected = grado === g.value;
                        return (
                          <div
                            key={g.value}
                            onClick={() => { setGrado(g.value); setGradoModalOpen(false); }}
                            style={{
                              padding:'10px 12px', borderRadius:'8px', cursor:'pointer',
                              background: isSelected ? 'var(--kt-chip-bg)' : 'transparent',
                              border: isSelected ? '1px solid var(--kt-chip-border)' : '1px solid transparent',
                              color: isSelected ? 'var(--kt-heading)' : 'var(--kt-text)',
                              fontFamily:"'Inter'", fontWeight: isSelected ? 700 : 500, fontSize:'13px',
                              transition:'background .15s', marginBottom:'4px'
                            }}
                            onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.background = 'var(--kt-chip-bg)'; }}
                            onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.background = 'transparent'; }}
                          >
                            {g.label}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {editId && (
              <div style={{ marginTop:'16px' }}>
                <div style={{ fontFamily:"'Manrope'", fontWeight:700, fontSize:'10px', letterSpacing:'1px', color:'var(--kt-label)', marginBottom:'8px' }}>GRADO ACADÉMICO</div>
                <div ref={gradoModalRef} style={{ position:'relative', width:'100%', marginBottom:'16px' }}>
                  <button
                    type="button"
                    onClick={() => setGradoModalOpen(!gradoModalOpen)}
                    style={{
                      width:'100%', height:'46px', padding:'0 38px 0 14px',
                      border:'1.5px solid var(--kt-input-border)',
                      borderRadius:'11px', background:'var(--kt-input-bg)',
                      color: grado ? 'var(--kt-heading)' : 'var(--kt-muted)',
                      fontFamily:"'Manrope'", fontWeight:700, fontSize:'14px',
                      display:'flex', alignItems:'center', justifyContent:'space-between',
                      cursor:'pointer', transition:'all .2s', textAlign:'left', position:'relative'
                    }}
                  >
                    <span style={{ whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
                      {GRADOS_ACADEMICOS.find(g => g.value === grado)?.label || 'Selecciona un grado…'}
                    </span>
                    <div style={{ position:'absolute', right:'14px', top:'50%', transform:'translateY(-50%)', pointerEvents:'none', color:'var(--kt-muted)', display:'grid', placeItems:'center' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: gradoModalOpen ? 'rotate(180deg)' : 'none', transition:'transform .2s' }}><path d="m6 9 6 6 6-6"/></svg>
                    </div>
                  </button>
                  {gradoModalOpen && (
                    <div className="kt-scroller" style={{
                      position:'absolute', top:'calc(100% + 6px)', left:0, right:0,
                      background:'var(--kt-bg1)', border:'1px solid var(--kt-panel-border)',
                      borderRadius:'12px', boxShadow:'0 10px 25px -5px rgba(0,0,0,0.15), 0 8px 10px -6px rgba(0,0,0,0.15)',
                      zIndex:999, maxHeight:'200px', overflowY:'auto', padding:'6px'
                    }}>
                      {GRADOS_ACADEMICOS.map(g => {
                        const isSelected = grado === g.value;
                        return (
                          <div
                            key={g.value}
                            onClick={() => { setGrado(g.value); setGradoModalOpen(false); }}
                            style={{
                              padding:'10px 12px', borderRadius:'8px', cursor:'pointer',
                              background: isSelected ? 'var(--kt-chip-bg)' : 'transparent',
                              border: isSelected ? '1px solid var(--kt-chip-border)' : '1px solid transparent',
                              color: isSelected ? 'var(--kt-heading)' : 'var(--kt-text)',
                              fontFamily:"'Inter'", fontWeight: isSelected ? 700 : 500, fontSize:'13px',
                              transition:'background .15s', marginBottom:'4px'
                            }}
                            onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.background = 'var(--kt-chip-bg)'; }}
                            onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.background = 'transparent'; }}
                          >
                            {g.label}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div style={{ fontFamily:"'Manrope'", fontWeight:700, fontSize:'10px', letterSpacing:'1px', color:'var(--kt-label)', marginBottom:'8px' }}>DESCRIPCIÓN (OPCIONAL)</div>
                <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={3} placeholder="Objetivo general del temario…" style={{ width:'100%', padding:'12px 14px', border:'1.5px solid var(--kt-input-border)', borderRadius:'11px', background:'var(--kt-input-bg)', color:'var(--kt-heading)', fontWeight:500, fontSize:'14px', resize:'vertical' }}></textarea>
              </div>
            )}

            <div style={{ marginTop:'16px', position: 'relative' }}>
              <div style={{ fontFamily:"'Manrope'", fontWeight:700, fontSize:'10px', letterSpacing:'1px', color:'var(--kt-label)', marginBottom:'8px' }}>SUBTEMAS A GENERAR</div>
              <div ref={subtemasRef} style={{ position: 'relative', width: '100%' }}>
                <button
                  type="button"
                  onClick={() => setSubtemasOpen(!subtemasOpen)}
                  style={{
                    width:'100%', height:'48px', padding:'0 38px 0 14px',
                    border: '1.5px solid var(--kt-input-border)',
                    borderRadius:'13px', background: 'var(--kt-input-bg)',
                    color: 'var(--kt-heading)',
                    fontFamily:"'Manrope', sans-serif", fontWeight: 700, fontSize:'13.5px',
                    display:'flex', alignItems:'center', justifyContent:'space-between',
                    cursor:'pointer', transition: 'all 0.2s', textAlign:'left',
                    position: 'relative'
                  }}
                >
                  <span style={{ whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
                    {(() => {
                      const modulosOptions = getModulosOptions(modelo);
                      const selectedSubtemasOpt = modulosOptions.find(o => o.value === subtemas) || modulosOptions[0];
                      return selectedSubtemasOpt.label;
                    })()}
                  </span>
                  <div style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--kt-muted)', display: 'grid', placeItems: 'center' }}>
                     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: subtemasOpen ? 'rotate(180deg)' : 'none', transition:'transform .2s' }}><path d="m6 9 6 6 6-6"/></svg>
                  </div>
                </button>

                {subtemasOpen && (
                  <div className="kt-scroller" style={{
                    position:'absolute', top:'calc(100% + 6px)', left:0, right:0,
                    background:'var(--kt-bg1)', border:'1px solid var(--kt-panel-border)',
                    borderRadius:'12px', boxShadow:'0 10px 25px -5px rgba(0,0,0,0.15), 0 8px 10px -6px rgba(0,0,0,0.15)',
                    zIndex:999, maxHeight:'200px', overflowY:'auto', padding:'6px'
                  }}>
                    {getModulosOptions(modelo).map(opt => {
                      const isSelected = subtemas === opt.value;
                      return (
                        <div
                          key={opt.value}
                          onClick={() => { setSubtemas(opt.value); setSubtemasOpen(false); }}
                          style={{
                            padding:'10px 12px', borderRadius:'8px', cursor:'pointer',
                            background: isSelected ? 'var(--kt-chip-bg)' : 'transparent',
                            border: isSelected ? '1px solid var(--kt-chip-border)' : '1px solid transparent',
                            color: isSelected ? 'var(--kt-heading)' : 'var(--kt-text)',
                            fontFamily:"'Inter'", fontWeight: isSelected ? 700 : 500, fontSize:'13px',
                            transition:'background .15s',
                            marginBottom: '4px'
                          }}
                          onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.background = 'var(--kt-chip-bg)'; }}
                          onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.background = 'transparent'; }}
                        >
                          {opt.label}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {!editId && (
              <div style={{ marginTop:'16px', position: 'relative' }}>
                <div style={{ fontFamily:"'Manrope'", fontWeight:700, fontSize:'10px', letterSpacing:'1px', color:'var(--kt-label)', marginBottom:'8px' }}>MODELO DE GENERACIÓN</div>
                <div ref={modeloRef} style={{ position:'relative', width:'100%' }}>
                  <button
                    type="button"
                    onClick={() => setModeloOpen(!modeloOpen)}
                    style={{
                      width:'100%', height:'46px', padding:'8px 38px 8px 14px',
                      border: modeloOpen ? '1px solid #10B981' : (modelo ? '1px solid var(--kt-chip-border)' : '1px solid var(--kt-input-border)'),
                      borderRadius:'11px', background: modelo ? 'var(--kt-chip-bg)' : 'var(--kt-input-bg)',
                      color:'var(--kt-heading)',
                      fontFamily:"'Inter'", fontWeight:700, fontSize:'14px',
                      display:'flex', alignItems:'center', justifyContent:'space-between',
                      boxShadow: modeloOpen ? '0 0 0 3px rgba(16,185,129,.2)' : 'none',
                      cursor:'pointer', transition:'all .2s', textAlign:'left', position:'relative'
                    }}
                  >
                    <div style={{ display:'flex', alignItems:'center', gap:'8px', overflow:'hidden' }}>
                      {modelo === 'TUTOR' && <Zap size={14} style={{ color:'var(--kt-muted)', flexShrink:0 }} />}
                      {modelo === 'CATEDRATICO' && <Sparkles size={14} style={{ color:'#10B981', flexShrink:0 }} />}
                      <span style={{ whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
                        {modelo === 'CATEDRATICO' ? 'Catedrático' : 'Tutor'}
                      </span>
                    </div>
                    <div style={{ position:'absolute', right:'14px', top:'50%', transform:'translateY(-50%)', pointerEvents:'none', color:'var(--kt-muted)' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: modeloOpen ? 'rotate(180deg)' : 'none', transition:'transform .2s' }}><path d="m6 9 6 6 6-6"/></svg>
                    </div>
                  </button>

                  {modeloOpen && (
                    <div className="kt-scroller" style={{
                      position:'absolute', top:'calc(100% + 6px)', left:0, right:0,
                      background:'var(--kt-panel-bg)', border:'1px solid var(--kt-panel-border)',
                      borderRadius:'10px', boxShadow:'0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',
                      zIndex:999, maxHeight:'200px', overflowY:'auto', padding:'6px'
                    }}>
                      {[
                        { value:'TUTOR', label:'Tutor', hint:'Rápido y directo, ideal para respuestas ágiles' },
                        { value:'CATEDRATICO', label:'Catedrático', hint:'Máxima profundidad y rigor académico' }
                      ].map(opt => {
                        const isCatedratico = opt.value === 'CATEDRATICO';
                        const isSelected = modelo === opt.value;
                        return (
                          <div
                            key={opt.value}
                            onClick={() => { handleModeloChange(opt.value); setModeloOpen(false); }}
                            style={{
                              padding:'10px 12px', borderRadius:'8px', cursor:'pointer',
                              background: isSelected ? 'var(--kt-chip-bg)' : (isCatedratico ? 'rgba(16,185,129,.02)' : 'transparent'),
                              border: isSelected ? '1px solid var(--kt-chip-border)' : (isCatedratico ? '1px solid rgba(16,185,129,.2)' : '1px solid transparent'),
                              color: isSelected ? 'var(--kt-heading)' : (isCatedratico ? '#10B981' : 'var(--kt-text)'),
                              fontFamily:"'Inter'", fontWeight: (isSelected || isCatedratico) ? 700 : 500, fontSize:'13px',
                              transition:'background .15s', marginBottom:'4px'
                            }}
                            onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.background = isCatedratico ? 'rgba(16,185,129,.06)' : 'var(--kt-chip-bg)'; }}
                            onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.background = isCatedratico ? 'rgba(16,185,129,.02)' : 'transparent'; }}
                          >
                            <div style={{ display:'flex', alignItems:'center', gap:'6px' }}>
                              {opt.value === 'TUTOR' && <Zap size={14} style={{ color: isSelected ? 'var(--kt-heading)' : 'inherit' }} />}
                              {isCatedratico && <Sparkles size={14} style={{ color: isSelected ? 'var(--kt-heading)' : '#10B981' }} />}
                              <span>{opt.label}</span>
                              {isCatedratico && <span style={{ fontSize:'9px', background:'#10B981', color:'#fff', padding:'1px 5px', borderRadius:'10px', fontWeight:800, letterSpacing:'0.5px' }}>RECOMENDADO</span>}
                            </div>
                            <div style={{ fontSize:'11px', color: isSelected ? 'var(--kt-muted)' : (isCatedratico ? 'rgba(16,185,129,.8)' : 'var(--kt-muted)'), marginTop:'2px', fontWeight:500 }}>{opt.hint}</div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

              <div style={{ height:'1px', background:'var(--kt-border-soft)', margin:'22px 0 0' }}></div>
              </div>
            </div>

            <div style={{ height:'1px', background:'var(--kt-border-soft)', flex:'none' }}></div>

            <div style={{ padding:'18px 28px', flex:'none' }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'flex-end', gap:'14px' }}>
                <button onClick={() => setModalOpen(false)} style={{ height:'46px', padding:'0 18px', border:'none', background:'none', color:'var(--kt-muted)', cursor:'pointer', fontFamily:"'Manrope'", fontWeight:700, fontSize:'14px' }}>Cancelar</button>
                <button className="kt-primary" onClick={handleAnalyze} disabled={isProcessing || !asignaturaId} style={{ height:'46px', padding:'0 24px', border:'none', borderRadius:'12px', background:'linear-gradient(150deg,#10B981,#059669)', color:'#fff', cursor:asignaturaId ? 'pointer' : 'not-allowed', opacity:asignaturaId ? 1 : .6, fontFamily:"'Manrope'", fontWeight:800, fontSize:'14px', boxShadow:'0 12px 26px -12px rgba(16,185,129,.7)', transition:'transform .18s,box-shadow .25s', display:'flex', alignItems:'center', gap:'9px' }}>
                  {isProcessing ? 'Procesando...' : editId ? 'Guardar Cambios' : 'Analizar Temario'}
                  {!isProcessing && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9z"></path></svg>}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* TOASTS */}
        <div style={{ position:'absolute', right:'22px', bottom:'22px', zIndex:80, display:'flex', flexDirection:'column', gap:'12px', pointerEvents:'none' }}>
          {toasts.map(t => {
            const ok = t.kind === 'success', warn = t.kind === 'warn', fav = t.kind === 'fav';
            const col = ok ? '#34D399' : warn ? '#FBBF24' : fav ? '#FB7185' : '#FB7185';
            const rgb = ok ? '16,185,129' : warn ? '245,158,11' : '16,185,129';
            return (
              <div key={t.id} style={{ pointerEvents:'auto', display:'flex', alignItems:'center', gap:'12px', minWidth:'270px', maxWidth:'340px', padding:'13px 15px', borderRadius:'13px', background:'rgba(17,24,39,.94)', backdropFilter:'blur(12px)', border:`1px solid rgba(${rgb},.35)`, boxShadow:'0 18px 40px -16px rgba(0,0,0,.7)', animation:'ktToastIn .55s cubic-bezier(.34,1.56,.64,1) both' }}>
                <span style={{ flex:'none', width:'34px', height:'34px', borderRadius:'10px', display:'grid', placeItems:'center', background:`rgba(${rgb},.16)`, color:col }}>
                  {ok ? <CheckCircle2 size={18} /> : fav ? <Heart size={18} fill="currentColor" /> : <AlertCircle size={18} />}
                </span>
                <div style={{ minWidth:0 }}>
                  <div style={{ fontFamily:"'Manrope'", fontWeight:700, fontSize:'13.5px', color:'#F1F5F9' }}>{t.title}</div>
                  <div style={{ fontFamily:"'Manrope'", fontWeight:500, fontSize:'12px', color:'#94A3B8', marginTop:'1px' }}>{t.msg}</div>
                </div>
              </div>
            );
          })}
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

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import { generarMaterialParaTemario, getContenidoTemario } from '../services/temarioService';
import { useTemarios } from './useTemarios';
import { useAsignaturas } from './useAsignaturas';
import { useSuscripcionStore } from '../store/suscripcionStore';

export const PIEZAS = [
  { id: 'teoria', label: 'Teoría Docente' },
  { id: 'evaluacion', label: 'Examen / Evaluación' },
  { id: 'diapositivas', label: 'Diapositivas' }
];

export const MODELOS = [
  { id: 'flash', label: 'Tutor', hint: 'Rápido y directo, ideal para respuestas ágiles' },
  { id: 'pro', label: 'Catedrático', hint: 'Máxima profundidad y rigor académico' }
];

/** Maps a response tier key to its display name. */
export const MODELO_LABELS = Object.fromEntries(MODELOS.map(m => [m.id, m.label]));

/**
 * Per-tier [min, max, default] for the user-selectable generation counts. Mirrors the
 * backend's ModeloIA ranges — kept in sync manually since there is no shared schema.
 */
export const MODELO_LIMITES = {
  flash: {
    diapositivas: { min: 5, max: 10, default: 8 },
    parrafos: { min: 5, max: 15, default: 10 },
    preguntas: { min: 1, max: 10, default: 5 }
  },
  pro: {
    diapositivas: { min: 10, max: 20, default: 15 },
    parrafos: { min: 20, max: 40, default: 20 },
    preguntas: { min: 15, max: 30, default: 20 }
  }
};

const clamp = (value, { min, max }) => Math.min(Math.max(value, min), max);

/**
 * Resolves a (possibly in-progress) input value against a tier's [min, max, default]:
 * blank/NaN falls back to the tier default, otherwise the number is clamped into range.
 * Used to finalize a count on blur or right before submission — never while the user is
 * still typing, since clamping mid-keystroke makes most multi-digit values unreachable
 * (e.g. typing "12" in a 5-15 range passes through "1", which would get force-clamped to
 * 5 before the second digit is even entered).
 */
const resolverConteo = (value, limite) => {
  const num = Number(value);
  if (value === '' || value == null || Number.isNaN(num)) return limite.default;
  return clamp(num, limite);
};

/** True when the piece has real content in a ContenidoTemarioResponseDTO. */
const pieceExists = (contenido, piezaId) => {
  if (!contenido) return false;
  const value = contenido[piezaId];
  if (value == null) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return false;
};

export const useGenerator = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const { courses, assignmentCourses, assignmentLoading, fetchCoursesByAsignatura } = useTemarios();
  const { asignaturas, loading: asignaturasLoading } = useAsignaturas();
  const cargarUso = useSuscripcionStore((s) => s.cargarUso);

  const initialTemarioId = searchParams.get('temarioId') || location.state?.temarioId || '';
  const [temarioId, setTemarioIdState] = useState(initialTemarioId);
  const [materiaId, setMateriaIdState] = useState('');
  // True once the materia owning `initialTemarioId` has been resolved from `courses`
  // (or immediately when there is no temario to preselect).
  const [initialTemarioResolved, setInitialTemarioResolved] = useState(!initialTemarioId);
  const [piezas, setPiezas] = useState([]);
  const [modelo, setModeloState] = useState('flash');
  const [numeroDiapositivas, setNumeroDiapositivas] = useState(MODELO_LIMITES.flash.diapositivas.default);
  const [numeroParrafos, setNumeroParrafos] = useState(MODELO_LIMITES.flash.parrafos.default);
  const [numeroPreguntas, setNumeroPreguntas] = useState(MODELO_LIMITES.flash.preguntas.default);

  // Switching tiers resets every count to the new tier's default, since a value valid
  // under one tier's range (e.g. Avanzado's 20-40 párrafos) can fall outside the other's.
  const setModelo = useCallback((nuevoModelo) => {
    setModeloState(nuevoModelo);
    const limites = MODELO_LIMITES[nuevoModelo];
    if (limites) {
      setNumeroDiapositivas(limites.diapositivas.default);
      setNumeroParrafos(limites.parrafos.default);
      setNumeroPreguntas(limites.preguntas.default);
    }
  }, []);

  // Existing material of the selected temario (null = nothing generated yet)
  const [contenidoExistente, setContenidoExistente] = useState(null);
  const [loadingContenido, setLoadingContenido] = useState(!!initialTemarioId);

  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState('');
  const [generatedData, setGeneratedData] = useState(null);
  const [genError, setGenError] = useState('');
  // True when genError came from a plan gate (403 capability lock, 429 quota exhausted),
  // so the UI can offer "Mejorar a Pro" instead of just "try again" on a rejection that
  // retrying will never fix.
  const [genErrorEsPlan, setGenErrorEsPlan] = useState(false);
  // { [piezaId]: mensaje } for pieces whose generation failed server-side;
  // their previous content is preserved rather than overwritten.
  const [piezasFallidas, setPiezasFallidas] = useState({});

  const [activeTab, setActiveTab] = useState('teoria');
  const [checkedAnswers, setCheckedAnswers] = useState({});

  // When the temario changes, fetch its existing material (404 => none yet).
  // loadingContenido is set by selectTemario / initial state, cleared here async.
  useEffect(() => {
    if (!temarioId) return undefined;
    let cancelled = false;
    getContenidoTemario(temarioId)
      .then(data => { if (!cancelled) setContenidoExistente(data); })
      .catch(() => { if (!cancelled) setContenidoExistente(null); })
      .finally(() => { if (!cancelled) setLoadingContenido(false); });
    return () => { cancelled = true; };
  }, [temarioId]);

  // A temario was preselected (via ?temarioId= or router state) before its materia was
  // known — the config panel requires a materia first, so derive it from the full
  // temarios list once loaded, then load that materia's temario options.
  useEffect(() => {
    if (initialTemarioResolved) return;
    const match = courses.find(c => c.id === initialTemarioId);
    if (!match) return;
    setMateriaIdState(match.asignaturaId);
    fetchCoursesByAsignatura(match.asignaturaId);
    setInitialTemarioResolved(true);
  }, [courses, initialTemarioId, initialTemarioResolved, fetchCoursesByAsignatura]);

  // Event-driven selection: resets generation state alongside the new temario
  const selectTemario = useCallback((id) => {
    setTemarioIdState(id);
    setLoadingContenido(!!id);
    setGeneratedData(null);
    setContenidoExistente(null);
    setPiezas([]);
    setPiezasFallidas({});
    setGenError('');
    setCheckedAnswers({});
  }, []);

  // Selecting a materia resets the temario (and its generation state) and loads that
  // materia's temarios — the temario selector stays empty/locked until this runs.
  const selectMateria = useCallback((id) => {
    setMateriaIdState(id);
    setTemarioIdState('');
    setLoadingContenido(false);
    setGeneratedData(null);
    setContenidoExistente(null);
    setPiezas([]);
    setPiezasFallidas({});
    setGenError('');
    setCheckedAnswers({});
    if (id) fetchCoursesByAsignatura(id);
  }, [fetchCoursesByAsignatura]);

  const materiaSeleccionada = asignaturas.find(a => a.id === materiaId) || null;
  const temarioSeleccionado = assignmentCourses.find(c => c.id === temarioId)
    || courses.find(c => c.id === temarioId)
    || null;

  const togglePieza = useCallback((piezaId) => {
    setPiezas(prev => prev.includes(piezaId) ? prev.filter(p => p !== piezaId) : [...prev, piezaId]);
  }, []);

  const selectAllPiezas = useCallback(() => {
    setPiezas(PIEZAS.map(p => p.id));
  }, []);

  const deselectAllPiezas = useCallback(() => {
    setPiezas([]);
  }, []);

  const piezaYaGenerada = useCallback(
    (piezaId) => pieceExists(generatedData || contenidoExistente, piezaId),
    [generatedData, contenidoExistente]
  );

  const handleGenerate = async () => {
    if (!temarioId || piezas.length === 0) return;
    setIsGenerating(true);
    setGenError('');
    setGenErrorEsPlan(false);
    setPiezasFallidas({});
    setCheckedAnswers({});

    const steps = [
      'Analizando el temario seleccionado...',
      'Generando contenido con OpenAI API...',
      'Estructurando el material académico...',
      'Validando esquemas de datos finales...'
    ];
    let currentStepIndex = 0;
    setGenerationStep(steps[currentStepIndex]);
    const stepInterval = setInterval(() => {
      currentStepIndex++;
      if (currentStepIndex < steps.length) {
        setGenerationStep(steps[currentStepIndex]);
      } else {
        clearInterval(stepInterval);
      }
    }, 1600);

    try {
      const limites = MODELO_LIMITES[modelo];
      const data = await generarMaterialParaTemario(temarioId, {
        piezas,
        modelo,
        numeroDiapositivas: resolverConteo(numeroDiapositivas, limites.diapositivas),
        numeroParrafos: resolverConteo(numeroParrafos, limites.parrafos),
        numeroPreguntas: resolverConteo(numeroPreguntas, limites.preguntas)
      });
      setGeneratedData(data);
      const fallidas = data.piezasFallidas || {};
      if (Object.keys(fallidas).length > 0) {
        console.error('Fallos de generación IA:', fallidas);
      }
      setPiezasFallidas(fallidas);
      const firstGenerated = PIEZAS.find(p => piezas.includes(p.id) && !fallidas[p.id]);
      setActiveTab((firstGenerated || PIEZAS.find(p => pieceExists(data, p.id)) || PIEZAS[0]).id);
      return true;
    } catch (error) {
      console.error('AI Generation failed:', error);
      const status = error.cause?.response?.status;
      setGenErrorEsPlan(status === 403 || status === 429);
      setGenError(status === 403 || status === 429
        ? error.message
        : 'No se pudo generar el material. Intenta de nuevo.');
      return false;
    } finally {
      setIsGenerating(false);
      clearInterval(stepInterval);
      // Every attempt (success, partial failure, or a 403/429 rejection) may have moved
      // today's quota; resync so the sidebar meter never lags behind what just happened.
      cargarUso();
    }
  };

  const handleSave = () => {
    if (generatedData) {
      setContenidoExistente(generatedData);
      setGeneratedData(null);
    }
  };

  return {
    asignaturas, asignaturasLoading,
    materiaId, setMateriaId: selectMateria,
    materiaSeleccionada,
    courses: assignmentCourses, temariosLoading: assignmentLoading,
    temarioId, setTemarioId: selectTemario,
    temarioSeleccionado,
    piezas, togglePieza, selectAllPiezas, deselectAllPiezas,
    modelo, setModelo,
    limitesModelo: MODELO_LIMITES[modelo],
    // Raw setters: the input is left uncontrolled-range while typing (including blank),
    // so intermediate keystrokes are never force-corrected. Callers should clamp on blur
    // via resolverConteo — handleGenerate already does this at submission time regardless.
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
    handleGenerate,
    handleSave
  };
};

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { generarMaterialParaTemario, getContenidoTemario } from '../services/temarioService';
import { useTemarios } from './useTemarios';

export const PIEZAS = [
  { id: 'teoria', label: 'Teoría Docente' },
  { id: 'ejercicios', label: 'Ejercicios Prácticos' },
  { id: 'evaluacion', label: 'Examen / Evaluación' },
  { id: 'diapositivas', label: 'Diapositivas' }
];

export const MODELOS = [
  { id: 'flash', label: 'Tutor', hint: 'Rápido y económico, teoría breve (4–5 párrafos)' },
  { id: 'pro', label: 'Maestro', hint: 'Profundidad equilibrada (6–8 párrafos)' },
  { id: 'max', label: 'Catedrático', hint: 'Máximo rigor con modelo de razonamiento (8–10 párrafos), más costoso' }
];

/** Maps a response tier key to its display name. */
export const MODELO_LABELS = Object.fromEntries(MODELOS.map(m => [m.id, m.label]));

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
  const { courses } = useTemarios();

  const initialTemarioId = searchParams.get('temarioId') || '';
  const [temarioId, setTemarioIdState] = useState(initialTemarioId);
  const [piezas, setPiezas] = useState([]);
  const [modelo, setModelo] = useState('flash');

  // Existing material of the selected temario (null = nothing generated yet)
  const [contenidoExistente, setContenidoExistente] = useState(null);
  const [loadingContenido, setLoadingContenido] = useState(!!initialTemarioId);

  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState('');
  const [generatedData, setGeneratedData] = useState(null);
  const [genError, setGenError] = useState('');
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

  const temarioSeleccionado = courses.find(c => c.id === temarioId) || null;

  const togglePieza = useCallback((piezaId) => {
    setPiezas(prev => prev.includes(piezaId) ? prev.filter(p => p !== piezaId) : [...prev, piezaId]);
  }, []);

  const piezaYaGenerada = useCallback(
    (piezaId) => pieceExists(generatedData || contenidoExistente, piezaId),
    [generatedData, contenidoExistente]
  );

  const handleGenerate = async () => {
    if (!temarioId || piezas.length === 0) return;
    setIsGenerating(true);
    setGenError('');
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
      const data = await generarMaterialParaTemario(temarioId, { piezas, modelo });
      setGeneratedData(data);
      setContenidoExistente(data);
      const fallidas = data.piezasFallidas || {};
      if (Object.keys(fallidas).length > 0) {
        // Raw provider/exception detail is developer information, not user-facing text.
        console.error('Fallos de generación IA:', fallidas);
      }
      setPiezasFallidas(fallidas);
      const firstGenerated = PIEZAS.find(p => piezas.includes(p.id) && !fallidas[p.id]);
      setActiveTab((firstGenerated || PIEZAS.find(p => pieceExists(data, p.id)) || PIEZAS[0]).id);
    } catch (error) {
      console.error('AI Generation failed:', error);
      setGenError('No se pudo generar el material. Intenta de nuevo.');
    } finally {
      setIsGenerating(false);
      clearInterval(stepInterval);
    }
  };

  return {
    courses,
    temarioId, setTemarioId: selectTemario,
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
    handleGenerate
  };
};

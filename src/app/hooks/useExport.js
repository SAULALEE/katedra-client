import { useCallback, useState } from 'react';
import { exportarMaterialTemario } from '../services/temarioService';
import { descargarBlob } from '../utils/descargarArchivo';
import { useSuscripcionStore } from '../store/suscripcionStore';

/**
 * Downloads a generated material piece, tracking which piece/format is in flight so the UI can
 * show a spinner on that exact menu row.
 *
 * Keeps the UI -> hook -> service flow: no axios call ever lives in a component.
 */
export const useExport = () => {
  const [enCurso, setEnCurso] = useState(null);
  const [error, setError] = useState(null);
  const cargarUso = useSuscripcionStore((s) => s.cargarUso);

  const exportar = useCallback(async ({ temarioId, pieza, formato, theme }) => {
    setEnCurso(`${pieza}:${formato}`);
    setError(null);

    try {
      const { blob, filename } = await exportarMaterialTemario(temarioId, pieza, formato, theme);
      descargarBlob(blob, filename);
      return { ok: true, filename };
    } catch (err) {
      setError(err.message);
      return { ok: false, message: err.message };
    } finally {
      setEnCurso(null);
      // The export may have consumed today's quota (or been rejected by it); resync so the
      // sidebar meter reflects it immediately instead of on next page load.
      cargarUso();
    }
  }, [cargarUso]);

  const estaExportando = useCallback(
    (pieza, formato) => enCurso === `${pieza}:${formato}`,
    [enCurso]
  );

  /** Format id currently downloading for that piece, for ExportDropdown's loadingOptionId. */
  const formatoEnCurso = useCallback(
    (pieza) => (enCurso?.startsWith(`${pieza}:`) ? enCurso.split(':')[1] : null),
    [enCurso]
  );

  return { exportar, enCurso, estaExportando, formatoEnCurso, error };
};

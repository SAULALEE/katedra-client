/** Browser-side file download helpers for the material exports. */

/**
 * Reads the filename the server chose.
 * RFC 5987's `filename*` wins over the plain `filename`, which is an ASCII fallback for old clients.
 *
 * @returns {string|null} null when the header is missing or carries no name
 */
export const nombreDesdeContentDisposition = (cabecera) => {
  if (!cabecera) return null;

  const extendido = cabecera.match(/filename\*=UTF-8''([^;]+)/i);
  if (extendido) {
    try {
      return decodeURIComponent(extendido[1].trim());
    } catch {
      return extendido[1].trim();
    }
  }

  const simple = cabecera.match(/filename="?([^";]+)"?/i);
  return simple ? simple[1].trim() : null;
};

/**
 * Saves a blob to disk through a temporary object URL.
 * The revoke is deferred: doing it synchronously after click() aborts the download in Firefox
 * and Safari, while never revoking leaks the blob for the life of the page.
 */
export const descargarBlob = (blob, nombreArchivo) => {
  const url = URL.createObjectURL(blob);
  const enlace = document.createElement('a');
  enlace.href = url;
  enlace.download = nombreArchivo;
  enlace.rel = 'noopener';

  document.body.appendChild(enlace);
  enlace.click();
  enlace.remove();

  setTimeout(() => URL.revokeObjectURL(url), 1500);
};

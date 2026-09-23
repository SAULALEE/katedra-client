const esTituloPrincipal = (linea) => {
  const letras = linea.replace(/[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ]/g, '');
  return letras.length >= 4 && linea.length <= 100 && linea === linea.toLocaleUpperCase('es');
};

const esSubtitulo = (linea) => linea.length <= 100 && linea.endsWith(':');
const esLista = (linea) => /^\s*(?:[-*+]|\d+[.)])\s+/.test(linea);

export const prepararContenidoFuente = (contenidoFuente = '') => {
  const fuente = String(contenidoFuente).trim();
  if (!fuente) return fuente;

  if (/^(?:\s{0,3}#{1,6}\s|```)/m.test(fuente)) return fuente;

  const lineas = fuente.split(/\r?\n/).map(linea => linea.trim()).filter(Boolean);
  if (lineas.length === 1) {
    const oraciones = fuente.split(/(?<=[.!?])\s+(?=[A-ZÁÉÍÓÚÜÑ])/);
    if (oraciones.length < 3) return fuente;

    const bloques = [];
    for (let index = 0; index < oraciones.length; index += 2) {
      bloques.push(oraciones.slice(index, index + 2).join(' '));
    }
    return bloques.join('\n\n');
  }

  return lineas.reduce((resultado, linea, index) => {
    const presentada = esTituloPrincipal(linea)
      ? `## ${linea}`
      : esSubtitulo(linea)
        ? `### ${linea}`
        : linea;
    if (index === 0) return presentada;

    const anterior = lineas[index - 1];
    const separador = esLista(anterior) && esLista(linea) ? '\n' : '\n\n';
    return `${resultado}${separador}${presentada}`;
  }, '');
};

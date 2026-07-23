const NOMBRE_SIN_ASIGNATURA = 'Sin asignatura';

export const GRADOS_ACADEMICOS = [
  'Primaria',
  'Secundaria',
  'Preparatoria',
  'Universidad',
  'Posgrado'
];
export const GRADO_ACADEMICO_OTRO = 'Otro';

export const obtenerNombreAsignatura = (temario) => (
  temario.asignatura?.trim() || temario.curso?.trim() || NOMBRE_SIN_ASIGNATURA
);

const normalizarTexto = (value = '') => String(value)
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLocaleLowerCase('es')
  .trim();

export const filtrarTemarios = (temarios, { busqueda = '', grado = '' } = {}) => {
  const termino = normalizarTexto(busqueda);

  return temarios.filter((temario) => {
    const coincideBusqueda = !termino || [
      temario.titulo,
      temario.nombre,
      obtenerNombreAsignatura(temario)
    ].some(value => normalizarTexto(value).includes(termino));
    const grados = String(temario.gradoAcademico || '')
      .split(',')
      .map(normalizarTexto)
      .filter(Boolean);
    const gradoNormalizado = normalizarTexto(grado);
    const gradosSoportados = GRADOS_ACADEMICOS.map(normalizarTexto);
    const coincideGrado = !gradoNormalizado
      || (grado === GRADO_ACADEMICO_OTRO
        ? grados.some(value => !gradosSoportados.includes(value))
        : grados.includes(gradoNormalizado));

    return coincideBusqueda && coincideGrado;
  });
};

export const agruparTemariosPorAsignatura = (temarios) => {
  const grupos = new Map();

  temarios.forEach((temario) => {
    const nombre = obtenerNombreAsignatura(temario);
    const grupo = grupos.get(nombre) || { nombre, temarios: [], totalTemas: 0 };
    grupo.temarios.push(temario);
    grupo.totalTemas += Number(temario.temas) || 0;
    grupos.set(nombre, grupo);
  });

  return [...grupos.values()];
};

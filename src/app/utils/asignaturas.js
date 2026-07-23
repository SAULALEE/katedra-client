const NOMBRE_SIN_ASIGNATURA = 'Sin asignatura';

export const obtenerNombreAsignatura = (temario) => (
  temario.asignatura?.trim() || temario.curso?.trim() || NOMBRE_SIN_ASIGNATURA
);

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

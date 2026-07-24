const ORDER_KEY = 'katedra_asignatura_order';

const readOrder = () => {
  try {
    return JSON.parse(localStorage.getItem(ORDER_KEY) || '[]');
  } catch {
    return [];
  }
};

const writeOrder = (order) => {
  localStorage.setItem(ORDER_KEY, JSON.stringify(order));
};

/**
 * Applies the persisted custom order to a list of asignaturas.
 * New asignaturas (not yet present in the stored order) are appended at the end,
 * preserving the order they arrived in from the backend.
 */
export const applyAsignaturaOrder = (asignaturas) => {
  const order = readOrder();
  const byId = new Map(asignaturas.map((item) => [item.id, item]));
  const ordered = order.map((id) => byId.get(id)).filter(Boolean);
  const orderedIds = new Set(ordered.map((item) => item.id));
  const rest = asignaturas.filter((item) => !orderedIds.has(item.id));
  const full = [...ordered, ...rest];

  const newOrder = full.map((item) => item.id);
  if (JSON.stringify(newOrder) !== JSON.stringify(order)) {
    writeOrder(newOrder);
  }

  return full;
};

/**
 * Moves `dragId` to just before `dropId` in the persisted order and saves it.
 */
export const moveAsignaturaBefore = (asignaturas, dragId, dropId) => {
  if (dragId === dropId) return asignaturas.map((item) => item.id);
  const ids = asignaturas.map((item) => item.id);
  const from = ids.indexOf(dragId);
  const to = ids.indexOf(dropId);
  if (from === -1 || to === -1) return ids;

  const next = [...ids];
  next.splice(from, 1);
  const insertAt = next.indexOf(dropId);
  next.splice(insertAt, 0, dragId);

  writeOrder(next);
  return next;
};

/**
 * Moves `dragId` to the end of the persisted order and saves it.
 */
export const moveAsignaturaToEnd = (asignaturas, dragId) => {
  const ids = asignaturas.map((item) => item.id);
  const from = ids.indexOf(dragId);
  if (from === -1) return ids;

  const next = [...ids];
  next.splice(from, 1);
  next.push(dragId);

  writeOrder(next);
  return next;
};

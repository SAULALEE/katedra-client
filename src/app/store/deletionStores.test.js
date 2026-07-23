import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('DELETE de temario sincroniza la colección general y la asignatura activa', async () => {
  const source = await readFile(new URL('./temarioStore.js', import.meta.url), 'utf8');

  assert.match(source, /courses: state\.courses\.filter\(\(course\) => course\.id !== id\)/);
  assert.match(source, /assignmentCourses: state\.assignmentCourses\.filter\(\(course\) => course\.id !== id\)/);
});

test('los stores solo eliminan tarjetas después de un DELETE exitoso', async () => {
  const temarioStore = await readFile(new URL('./temarioStore.js', import.meta.url), 'utf8');
  const asignaturaStore = await readFile(new URL('./asignaturaStore.js', import.meta.url), 'utf8');

  assert.match(temarioStore, /await eliminarTemarioRequest\(id\);\s*set\(\(state\)/);
  assert.match(asignaturaStore, /await eliminarAsignaturaRequest\(id\);\s*set\(\(state\)/);
  assert.match(asignaturaStore, /status = error\.cause\?\.response\?\.status/);
});

test('Dashboard usa confirmación visual para asignaturas y temarios', async () => {
  const source = await readFile(new URL('../pages/Dashboard.jsx', import.meta.url), 'utf8');
  const modal = await readFile(new URL('../components/DeleteConfirmationModal.jsx', import.meta.url), 'utf8');

  assert.doesNotMatch(source, /window\.confirm/);
  assert.match(source, /<DeleteConfirmationModal/);
  assert.match(source, /setDeletePending\(\{ type: 'asignatura'/);
  assert.match(source, /setDeletePending\(\{ type: 'temario'/);
  assert.match(source, /title=\{`Eliminar \$\{deletePending\?\.type \|\| ''\}`\}/);
  assert.match(modal, />Cancelar</);
  assert.match(modal, /'Eliminando\.\.\.' : 'Eliminar'/);
  assert.match(modal, /Esta acción no se puede deshacer/);
});

test('Temario vuelve a consultar la asignatura activa después del DELETE exitoso', async () => {
  const source = await readFile(new URL('../pages/Dashboard.jsx', import.meta.url), 'utf8');

  assert.match(
    source,
    /if \(result\.success\) \{[\s\S]*?if \(!esAsignatura && asignaturaActiva\) \{\s*await fetchCoursesByAsignatura\(asignaturaActiva\.id\);\s*\}/
  );
});

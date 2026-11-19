import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import * as roleUtils from '../../app/utils/roleUtils.js';

const readProjectFile = (path) => readFile(new URL(path, import.meta.url), 'utf8');
const hasProjectFile = (path) => existsSync(fileURLToPath(new URL(path, import.meta.url)));

test('la ruta del panel exige ROLE_ALUMNO y usa el acceso de alumnos', async () => {
  const app = await readProjectFile('../../App.jsx');

  assert.match(app, /path="\/alumnos\/panel"/);
  assert.match(app, /allowedRoles=\{\['ROLE_ALUMNO'\]\}/);
  assert.match(app, /loginPath="\/alumnos\/iniciar-sesion"/);
  assert.match(app, /<StudentPanel\s*\/>/);
});

test('el panel muestra bienvenida y navegación a panel, cuenta y cierre de sesión', async () => {
  const panel = await readProjectFile('./pages/StudentPanel.jsx');

  assert.match(panel, /Bienvenido a tus clases/);
  assert.match(panel, /name: 'Panel'[\s\S]*path: '\/alumnos\/panel'/);
  assert.match(panel, /name: 'Mi cuenta'[\s\S]*path: '\/alumnos\/mi-cuenta'/);
  assert.match(panel, /<ResponsiveSidebar/);
  assert.match(panel, /logoutPath="\/alumnos"/);
});

test('la barra lateral acepta navegación del panel sin cambiar los menús existentes', async () => {
  const sidebar = await readProjectFile('../../app/components/ResponsiveSidebar.jsx');

  assert.match(sidebar, /navigationItems/);
  assert.match(sidebar, /navigationItems\s*\|\|\s*\(isAdmin\(user\)/);
  assert.match(sidebar, /handleNavigation\(homePath\)/);
  assert.match(sidebar, /navigate\(logoutPath\)/);
});

test('el acceso y registro de alumnos terminan en el panel provisional', async () => {
  const studentPages = await readProjectFile('../public/pages/StudentPages.jsx');

  assert.match(studentPages, /navigate\('\/alumnos\/panel',\s*\{\s*replace:\s*true\s*\}\)/);
});

test('el servicio consulta el perfil real del alumno autenticado', async () => {
  assert.ok(hasProjectFile('./services/studentService.js'));
  const service = await readProjectFile('./services/studentService.js');

  assert.match(service, /api\.get\('\/students\/me'\)/);
  assert.match(service, /return response\.data/);
});

test('el hook del perfil maneja carga, error y reintento', async () => {
  assert.ok(hasProjectFile('./hooks/useStudentProfile.js'));
  const hook = await readProjectFile('./hooks/useStudentProfile.js');

  assert.match(hook, /getMyStudentProfile/);
  assert.match(hook, /useState\(true\)/);
  assert.match(hook, /setError/);
  assert.match(hook, /retry|reintentar/i);
});

test('el panel presenta estados y datos devueltos por el perfil', async () => {
  const panel = await readProjectFile('./pages/StudentPanel.jsx');

  assert.match(panel, /useStudentProfile/);
  assert.match(panel, /loading/);
  assert.match(panel, /role="alert"/);
  assert.match(panel, /student\.nombre/);
  assert.match(panel, /student\.email/);
  assert.ok(panel.indexOf('if (loading)') < panel.indexOf('<ResponsiveSidebar'));
  assert.ok(panel.indexOf('if (error || !student)') < panel.indexOf('<ResponsiveSidebar'));
});

test('el perfil debe ser válido antes de liberar el panel', async () => {
  const hook = await readProjectFile('./hooks/useStudentProfile.js');

  assert.match(hook, /profile\?\.id/);
  assert.match(hook, /profile\?\.email/);
  assert.match(hook, /profile\?\.nombre/);
});

test('profesores y administradores se desvían a sus rutas propias', () => {
  assert.equal(roleUtils.getDefaultRoute({ rol: 'ROLE_PROFESOR' }), '/dashboard');
  assert.equal(roleUtils.getDefaultRoute({ rol: 'ROLE_ADMIN' }), '/usuarios');
});

test('ProtectedRoute redirige cualquier rol distinto de ROLE_ALUMNO a su inicio', async () => {
  const guard = await readProjectFile('../../app/components/ProtectedRoute.jsx');

  assert.match(guard, /!effectiveAllowedRoles\.includes\(userRole\)/);
  assert.match(guard, /<Navigate to=\{getDefaultRoute\(user\)\}/);
  assert.match(guard, /getUserRole\(user\)/);
  assert.doesNotMatch(guard, /\? 'ROLE_PROFESOR'/);
});

test('los roles desconocidos no se convierten en profesor', () => {
  assert.equal(roleUtils.getUserRole?.(null), null);
  assert.equal(roleUtils.getUserRole?.({}), null);
  assert.equal(roleUtils.getUserRole?.({ rol: 'ROLE_DESCONOCIDO' }), 'ROLE_DESCONOCIDO');
  assert.equal(roleUtils.getUserRole?.({ roles: ['ROLE_PROFESOR'] }), 'ROLE_PROFESOR');
});

test('un 401 en el portal de alumnos redirige a su login', async () => {
  const api = await readProjectFile('../../app/services/api.js');

  assert.match(api, /window\.location\.pathname\.startsWith\('\/alumnos'\)/);
  assert.match(api, /\? '\/alumnos\/iniciar-sesion'/);
  assert.match(api, /window\.location\.assign\(loginPath\)/);
});

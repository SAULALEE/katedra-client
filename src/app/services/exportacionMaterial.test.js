import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const leer = (ruta) => readFileSync(fileURLToPath(new URL(ruta, import.meta.url)), 'utf8');

const temarioService = leer('./temarioService.js');
const useExport = leer('../hooks/useExport.js');
const exportDropdown = leer('../components/ExportDropdown.jsx');

test('el servicio pide el archivo como blob al endpoint de exportaciones', () => {
  assert.match(temarioService, /\/temarios\/\$\{id\}\/exportaciones/);
  assert.match(temarioService, /responseType:\s*'blob'/);
  assert.match(temarioService, /const params = \{\s*pieza,\s*formato\s*\}/);
  assert.match(temarioService, /params\.theme = theme/);
});

test('el servicio define un timeout para no dejar el spinner colgado', () => {
  assert.match(temarioService, /timeout:\s*\d+/);
  assert.match(temarioService, /ECONNABORTED/);
});

test('el servicio lee el mensaje de error cuando el cuerpo llega como Blob', () => {
  assert.match(temarioService, /instanceof Blob/);
  assert.match(temarioService, /JSON\.parse\(await data\.text\(\)\)/);
});

test('el hook delega en el servicio y en el descargador, sin axios propio', () => {
  assert.match(useExport, /from '\.\.\/services\/temarioService'/);
  assert.match(useExport, /descargarBlob/);
  assert.doesNotMatch(useExport, /import .*from '.*axios'/, 'el hook no debe importar axios');
});

test('el menú de exportación es accesible y soporta estado de carga', () => {
  assert.match(exportDropdown, /role="menu"/);
  assert.match(exportDropdown, /role="menuitem"/);
  assert.match(exportDropdown, /aria-haspopup="menu"/);
  assert.match(exportDropdown, /aria-expanded/);
  assert.match(exportDropdown, /loadingOptionId/);
  assert.match(exportDropdown, /'Escape'/);
});

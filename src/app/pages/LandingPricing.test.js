import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const landing = readFileSync(new URL('./Landing.jsx', import.meta.url), 'utf8');
const service = readFileSync(new URL('../services/suscripcionService.js', import.meta.url), 'utf8');

test('la Landing obtiene el catálogo público mediante la capa de servicio', () => {
  assert.match(service, /getPlanesRequest/);
  assert.match(service, /\/suscripciones\/planes/);
  assert.match(landing, /usePlanes/);
  assert.doesNotMatch(landing, /billing === 'monthly' \? '\$19' : '\$15'/);
});

test('el CTA conserva ciclo e intención de compra para usuarios sin sesión', () => {
  assert.match(landing, /checkoutIntent/);
  assert.match(landing, /abrirCheckout/);
  assert.match(landing, /isAuthenticated/);
});

test('el carrusel sólo anuncia formatos soportados por exportOptions', () => {
  // Google Forms is a real export (FormatoExportacion.APPS_SCRIPT -> exportOptions 'gs'),
  // so the landing may advertise it. Classroom/Canvas/Moodle are not integrations we ship.
  for (const formato of ['Documento Word', 'Documento PDF', 'Markdown', 'Presentación PPTX', 'Google Forms']) {
    assert.match(landing, new RegExp(formato));
  }
  for (const integracion of ['Google Classroom', 'Canvas LMS', 'Moodle']) {
    assert.doesNotMatch(landing, new RegExp(integracion));
  }
});

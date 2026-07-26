import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const leer = (ruta) => readFileSync(new URL(ruta, import.meta.url), 'utf8');
const landing = leer('./Landing.jsx');
const login = leer('./Login.jsx');
const register = leer('./Register.jsx');
const dashboard = leer('./Dashboard.jsx');
const generator = leer('./Generator.jsx');
const planModal = leer('../components/PlanModal.jsx');

test('la Landing evita frases promocionales exageradas', () => {
  for (const frase of ['con el poder de la IA', 'Teoría rigurosa', 'Notas de clase rigurosas', 'editor en jefe']) {
    assert.doesNotMatch(landing, new RegExp(frase, 'i'));
  }
});

test('Login y registro usan mensajes directos', () => {
  assert.doesNotMatch(login, /supercargada|algo grandioso/i);
  assert.doesNotMatch(register, /Potencia tu/i);
});

test('creación y generación describen acciones sin lenguaje artificial', () => {
  for (const frase of ['Ingesta Inteligente', 'Importación Web:', 'Creación Manual Inteligente', 'Máxima profundidad y rigor académico']) {
    assert.doesNotMatch(dashboard, new RegExp(frase, 'i'));
  }
  assert.doesNotMatch(generator, /Generación Iniciada|Generación Completada|Inteligencia Artificial/);
  assert.doesNotMatch(planModal, /desbloquear todo Katedra/i);
});

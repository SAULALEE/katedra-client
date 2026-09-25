import test from 'node:test';
import assert from 'node:assert/strict';
import { DEMO_STEPS, nextDemoStep, previousDemoStep } from './studentLandingJourney.js';
import * as journey from './studentLandingJourney.js';

test('la demo cuenta la ruta completa de una actividad hasta el siguiente paso', () => {
  assert.deepEqual(DEMO_STEPS.map((step) => step.id), [
    'consigna', 'material', 'respuesta', 'retroalimentacion', 'siguiente',
  ]);
  assert.ok(DEMO_STEPS.every((step) => step.title && step.status && step.body));
  assert.match(DEMO_STEPS.at(-1).body, /repasa|practica/i);
});

test('la navegación de la demo se detiene en ambos extremos', () => {
  assert.equal(previousDemoStep(0), 0);
  assert.equal(nextDemoStep(0), 1);
  assert.equal(nextDemoStep(DEMO_STEPS.length - 1), DEMO_STEPS.length - 1);
});

test('la acción principal lleva a la demo disponible', () => {
  assert.deepEqual(journey.PRIMARY_CTA, {
    label: 'Explorar la clase demo',
    href: '#como-funciona',
  });
});

test('la etapa activa corresponde a una selección directa y respeta límites', () => {
  assert.equal(typeof journey.getDemoStep, 'function');
  assert.equal(journey.getDemoStep(4).id, 'siguiente');
  assert.equal(journey.getDemoStep(-1).id, 'consigna');
  assert.equal(journey.getDemoStep(99).id, 'siguiente');
});

test('Forms distingue respuestas correctas e incorrectas y permite repetir', () => {
  assert.equal(typeof journey.getFormResult, 'function');
  assert.equal(journey.getFormResult(null), null);
  assert.deepEqual(journey.getFormResult(1), { correct: true, correctIndex: 1 });
  assert.deepEqual(journey.getFormResult(0), { correct: false, correctIndex: 1 });
});

test('cada ejemplo de IA conserva pregunta, respuesta y acción relacionadas', () => {
  assert.equal(journey.AI_HELP?.length, 3);
  assert.ok(journey.AI_HELP.every(({ title, prompt, answer, action }) => title && prompt && answer && action));
});

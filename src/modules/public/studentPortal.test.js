import test from 'node:test';
import assert from 'node:assert/strict';
import { searchStudentContent, getStudentChatReply, validateStudentAccess } from './studentPortal.js';

test('la búsqueda encuentra contenido público sin depender de tildes o mayúsculas', () => {
  const results = searchStudentContent('EVALUACION');
  assert.ok(results.some((item) => item.href === '/alumnos#katedra-forms'));
  assert.ok(searchStudentContent('retroalimentación').length > 0);
  assert.deepEqual(searchStudentContent(''), []);
  assert.deepEqual(searchStudentContent('palabra-inexistente-xyz'), []);
});

test('el chatbot da respuestas predefinidas y reconoce consultas desconocidas', () => {
  assert.match(getStudentChatReply('¿Qué es Katedra Forms?'), /evaluaci[oó]n/i);
  assert.match(getStudentChatReply('¿Cómo recupero mi contraseña?'), /contrase[ñn]a/i);
  assert.match(getStudentChatReply('consulta-inexistente-xyz'), /no tengo una respuesta/i);
});

test('el acceso de demostración reutiliza las reglas de validación de profesores', () => {
  assert.equal(validateStudentAccess('login', { email: 'incorrecto', password: 'secreto' }), 'Ingresa un correo electrónico válido.');
  assert.equal(validateStudentAccess('login', { email: 'alumno@escuela.edu', password: 'secreto' }), null);
  assert.equal(validateStudentAccess('register', { nombre: 'Ana', email: 'ana@escuela.edu', password: '12345', confirmPassword: '12345', acceptedTerms: true }), 'La contraseña debe tener al menos 6 caracteres.');
  assert.equal(validateStudentAccess('register', { nombre: 'Ana', email: 'ana@escuela.edu', password: 'secreto', confirmPassword: 'distinta', acceptedTerms: true }), 'Las contraseñas no coinciden.');
  assert.match(validateStudentAccess('register', { nombre: 'Ana', email: 'ana@escuela.edu', password: 'secreto', confirmPassword: 'secreto', acceptedTerms: false }), /condiciones/i);
  assert.equal(validateStudentAccess('register', { nombre: 'Ana', email: 'ana@escuela.edu', password: 'secreto', confirmPassword: 'secreto', acceptedTerms: true }), null);
});

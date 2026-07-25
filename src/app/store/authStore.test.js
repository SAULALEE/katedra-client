import test, { beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import api from '../services/api.js';
import {
  SESSION_LAST_ACTIVE_KEY,
  SESSION_TOLERANCE_MS
} from '../services/authService.js';
import { useAuthStore } from './authStore.js';

const values = new Map();
let tokenWrites = 0;

globalThis.localStorage = {
  getItem: (key) => values.get(key) ?? null,
  setItem: (key, value) => {
    if (key === 'katedra_token') tokenWrites += 1;
    values.set(key, String(value));
  },
  removeItem: (key) => values.delete(key)
};

beforeEach(() => {
  values.clear();
  tokenWrites = 0;
  useAuthStore.setState({
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null
  });
});

test('restaura una sesión que estuvo fuera menos de 15 minutos', () => {
  const now = 2_000_000;
  localStorage.setItem('katedra_user', JSON.stringify({ id: '1' }));
  localStorage.setItem('katedra_token', 'jwt');
  localStorage.setItem(SESSION_LAST_ACTIVE_KEY, now - SESSION_TOLERANCE_MS + 1);

  useAuthStore.getState().initAuth(now);

  assert.equal(useAuthStore.getState().isAuthenticated, true);
});

test('limpia una sesión que estuvo fuera 15 minutos', () => {
  const now = 2_000_000;
  localStorage.setItem('katedra_user', JSON.stringify({ id: '1' }));
  localStorage.setItem('katedra_token', 'jwt');
  localStorage.setItem(SESSION_LAST_ACTIVE_KEY, now - SESSION_TOLERANCE_MS);

  useAuthStore.getState().initAuth(now);

  assert.equal(useAuthStore.getState().isAuthenticated, false);
  assert.equal(localStorage.getItem('katedra_user'), null);
  assert.equal(localStorage.getItem('katedra_token'), null);
  assert.equal(localStorage.getItem(SESSION_LAST_ACTIVE_KEY), null);
});

test('registra la última actividad al abandonar Katedra', () => {
  useAuthStore.setState({ isAuthenticated: true });

  useAuthStore.getState().recordLastActivity(12345);

  assert.equal(localStorage.getItem(SESSION_LAST_ACTIVE_KEY), '12345');
});

test('login local inicia también la tolerancia de sesión', async () => {
  const originalAdapter = api.defaults.adapter;
  api.defaults.adapter = async () => ({
    data: {
      token: 'jwt-local',
      usuario: {
        id: '1',
        email: 'ada@katedra.mx',
        nombre: 'Ada',
        rol: 'ROLE_PROFESOR'
      }
    },
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {}
  });

  try {
    const success = await useAuthStore.getState().login(
      'ada@katedra.mx',
      'secreto',
      54321
    );

    assert.equal(success, true);
    assert.equal(localStorage.getItem(SESSION_LAST_ACTIVE_KEY), '54321');
  } finally {
    api.defaults.adapter = originalAdapter;
  }
});

test('AuthCallback es idempotente ante la doble ejecución de StrictMode', () => {
  const payload = btoa(JSON.stringify({
    sub: 'google-1',
    email: 'ada@katedra.mx',
    name: 'Ada',
    role: 'ROLE_PROFESOR'
  })).replace(/=/g, '');
  const token = `header.${payload}.signature`;
  let currentHref = `http://localhost/auth/callback?token=${token}`;
  let urlCleanups = 0;

  globalThis.document = { title: 'Katedra' };
  globalThis.window = {
    location: {
      get href() {
        return currentHref;
      }
    },
    history: {
      replaceState: (_state, _title, cleanUrl) => {
        currentHref = `http://localhost${cleanUrl}`;
        urlCleanups += 1;
      }
    }
  };

  const firstSession = useAuthStore.getState().handleOAuthCallback(1000);
  const secondSession = useAuthStore.getState().handleOAuthCallback(1001);

  assert.deepEqual(secondSession, firstSession);
  assert.equal(useAuthStore.getState().isAuthenticated, true);
  assert.equal(localStorage.getItem('katedra_token'), token);
  assert.equal(tokenWrites, 1);
  assert.equal(urlCleanups, 1);
  assert.equal(currentHref, 'http://localhost/auth/callback');
});

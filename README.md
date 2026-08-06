# Katedra Client

[![CI](https://github.com/SAULALEE/katedra-client/actions/workflows/ci.yml/badge.svg)](https://github.com/SAULALEE/katedra-client/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

Frontend de **Katedra**, un generador de contenido académico impulsado por IA para
profesores. React 19, Vite, Tailwind CSS, Zustand, Stripe Elements.

Versión en inglés: [README.en.md](README.en.md) · Backend: [katedra-server](https://github.com/SAULALEE/katedra-server)

---

## Demo en vivo

- **App:** https://katedra-client.vercel.app
- **API:** https://katedra-server.onrender.com/api/v1

> **Credenciales de demo:** aún no publicadas. Regístrate desde la página de Registro de la
> app para probarla de inmediato — una demo pública sembrada (Free + Pro) está planeada. El
> API corre en el plan gratuito de Render, así que la primera petición tras un período de
> inactividad puede tardar hasta un minuto.

---

## Arquitectura

```mermaid
flowchart LR
    UI["Componente UI (.jsx)"] --> Hook["Custom Hook"]
    Hook --> Store["Zustand Store"]
    Hook --> Service["Service (src/app/services)"]
    Store --> Service
    Service -->|Axios, REST /api/v1| API[("katedra-server")]
```

Flujo unidireccional, cero llamadas directas a Axios/fetch dentro de componentes — cada
petición pasa por un Hook y un archivo Service. Detalles en
[katedra-server/docs/2_ARCHITECTURE_AND_TECH_STACK.md](https://github.com/SAULALEE/katedra-server/blob/main/docs/2_ARCHITECTURE_AND_TECH_STACK.md).

---

## Stack tecnológico

| | |
|---|---|
| Framework | React 19, Vite |
| Estilos | Tailwind CSS, componentes estilo shadcn/ui, Framer Motion |
| Estado | Zustand |
| HTTP | Axios |
| UI de pagos | Stripe Elements (`@stripe/react-stripe-js`) |
| Tests | `node:test` (nativo de Node) — 68 tests |
| Contenedor | Dockerfile multi-etapa → nginx, ruteo con fallback de SPA |

---

## Inicio rápido (sin necesitar cuenta de Doppler)

Requiere Node 22+ y npm.

```bash
git clone https://github.com/SAULALEE/katedra-client.git
cd katedra-client
npm install
cp .env.example .env.local
npm run dev:local
```

Se abre en `http://localhost:5173`. Deja `VITE_API_BASE_URL` sin definir en `.env.local` — el
servidor de desarrollo de Vite hace proxy de `/api/v1` hacia `http://localhost:8080`, así que
habla con un [katedra-server](https://github.com/SAULALEE/katedra-server) corriendo
localmente sin configurar CORS. Para apuntar al API en vivo, define
`VITE_API_BASE_URL=https://katedra-server.onrender.com/api/v1`.

Quienes tengan acceso a la organización de Doppler del proyecto pueden omitir `.env.local` y
usar `npm run dev` en su lugar.

---

## Scripts

| Script | Qué hace |
|---|---|
| `npm run dev` / `dev:local` | Servidor de desarrollo Vite, con/sin Doppler |
| `npm run build` / `build:local` | Build de producción, con/sin Doppler |
| `npm run preview` / `preview:local` | Previsualiza un build de producción localmente |
| `npm run lint` | ESLint |
| `npm test` | Corre la suite de tests (`node --test src/`) |

---

## Tests

```bash
npm test
```

68 tests escritos con `node:test` (nativo de Node) — sin dependencia extra de test runner. CI
ejecuta esto, `npm run lint` y `npm run build:local` en cada push a `main` y `staging`.

---

## Documentación de la API

Este cliente consume el API REST de
[katedra-server](https://github.com/SAULALEE/katedra-server). Consulta ese repositorio para
Swagger UI (generado en vivo desde el código) y una colección de Bruno ejecutable que cubre
los 37 endpoints.

---

## Estructura del proyecto

```
src/app/
  components/   componentes de UI compartidos
  hooks/        un hook por área de funcionalidad — lo único que llaman los componentes
  pages/        componentes de nivel de ruta
  services/     llamadas Axios — el único lugar que habla con el API
  store/        stores de Zustand
  utils/        funciones auxiliares puras
```

---

## Roadmap

Ver [katedra-server/docs/3_STATUS_AND_ROADMAP.md](https://github.com/SAULALEE/katedra-server/blob/main/docs/3_STATUS_AND_ROADMAP.md)
para lo que ya está publicado y lo que sigue en ambos repositorios.

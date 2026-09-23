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
    Hook --> Service["Service (src/modules/teacher/services o src/app/services)"]
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

## Inicio rápido

Requiere Node 22+, npm y acceso al proyecto `katedra-client` en Doppler.

```bash
git clone https://github.com/SAULALEE/katedra-client.git
cd katedra-client
doppler login
npm install
npm run dev:local
```

`dev:local` usa la configuración Doppler `dev`. Esa configuración debe definir
`VITE_API_BASE_URL=/api/v1`; Vite hará proxy hacia `http://localhost:8080`.

Para probar la aplicación contra el backend y la base alojados:

```bash
npm run dev:production
```

La configuración Doppler `prd` debe definir `VITE_API_BASE_URL` con la URL pública
del backend, por ejemplo `https://katedra-server.onrender.com/api/v1`.

No se usan `.env`, `.env.local` ni valores locales alternativos.

---

## Scripts

| Script | Qué hace |
|---|---|
| `npm run dev:local` | Cliente local → backend local |
| `npm run dev:production` | Cliente local → backend alojado |
| `npm run build:local` | Build con configuración local |
| `npm run build:production` | Build con configuración de producción |
| `npm run lint` | ESLint mediante Doppler |
| `npm test` | Suite de tests mediante Doppler |

Los scripts usan explícitamente el proyecto `katedra-client` y las configuraciones Doppler
`dev` o `prd`.

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

# Katedra Client

[![CI](https://github.com/SAULALEE/katedra-client/actions/workflows/ci.yml/badge.svg)](https://github.com/SAULALEE/katedra-client/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

Frontend for **Katedra**, an AI-driven academic content generator for teachers. React 19,
Vite, Tailwind CSS, Zustand, Stripe Elements.

Spanish version: [README.md](README.md) · Backend: [katedra-server](https://github.com/SAULALEE/katedra-server)

---

## Live demo

- **App:** https://katedra-client.vercel.app
- **API:** https://katedra-server.onrender.com/api/v1

> **Demo credentials:** not published yet. Register your own account from the app's
> Register page to try it immediately — a public seeded demo (Free + Pro) is planned. The
> API runs on Render's free tier, so the first request after inactivity can take up to a
> minute.

---

## Architecture

```mermaid
flowchart LR
    UI["UI Component (.jsx)"] --> Hook["Custom Hook"]
    Hook --> Store["Zustand Store"]
    Hook --> Service["Service (src/app/services)"]
    Store --> Service
    Service -->|Axios, REST /api/v1| API[("katedra-server")]
```

Unidirectional flow, zero direct Axios/fetch calls inside components — every request goes
through a Hook and a Service file. Details in
[katedra-server/docs/2_ARCHITECTURE_AND_TECH_STACK.md](https://github.com/SAULALEE/katedra-server/blob/main/docs/2_ARCHITECTURE_AND_TECH_STACK.md).

---

## Tech stack

| | |
|---|---|
| Framework | React 19, Vite |
| Styling | Tailwind CSS, shadcn/ui-style components, Framer Motion |
| State | Zustand |
| HTTP | Axios |
| Payments UI | Stripe Elements (`@stripe/react-stripe-js`) |
| Tests | Node's built-in `node:test` — 68 tests |
| Container | Multi-stage Dockerfile → nginx, SPA fallback routing |

---

## Quickstart

Requires Node 22+, npm, and access to the `katedra-client` Doppler project.

```bash
git clone https://github.com/SAULALEE/katedra-client.git
cd katedra-client
doppler login
npm install
npm run dev:local
```

`dev:local` uses the Doppler `dev` configuration. It must define
`VITE_API_BASE_URL=/api/v1`; Vite then proxies to `http://localhost:8080`.

To test against the hosted backend and production database:

```bash
npm run dev:production
```

The Doppler `prd` configuration must define `VITE_API_BASE_URL` with the public API
URL, such as `https://katedra-server.onrender.com/api/v1`.

No `.env`, `.env.local`, or local fallback values are used.

---

## Scripts

| Script | What it does |
|---|---|
| `npm run dev:local` | Local client → local backend |
| `npm run dev:production` | Local client → hosted backend |
| `npm run build:local` | Build with local configuration |
| `npm run build:production` | Build with production configuration |
| `npm run lint` | ESLint through Doppler |
| `npm test` | Test suite through Doppler |

Scripts explicitly use the `katedra-client` Doppler project and the `dev` or `prd`
configuration.

---

## Tests

```bash
npm test
```

68 tests written against Node's built-in `node:test` — no extra test runner dependency. CI
runs this, `npm run lint`, and `npm run build:local` on every push to `main` and `staging`.

---

## API documentation

This client consumes [katedra-server](https://github.com/SAULALEE/katedra-server)'s REST API.
See that repo for Swagger UI (generated live from the code) and a runnable Bruno collection
covering all 37 endpoints.

---

## Project structure

```
src/app/
  components/   shared UI components
  hooks/        one hook per feature area — the only thing components call
  pages/        route-level components
  services/     Axios calls — the only place that talks to the API
  store/        Zustand stores
  utils/        pure helpers
```

---

## Roadmap

See [katedra-server/docs/3_STATUS_AND_ROADMAP.md](https://github.com/SAULALEE/katedra-server/blob/main/docs/3_STATUS_AND_ROADMAP.md)
for what's shipped and what's next across both repos.

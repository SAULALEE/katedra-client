---
name: architecture-client
description: General architecture of the project
---

# SKILL: Full-Stack Architecture & Data Flow (Katedra Core)

## 1. CONTEXT OF ACTIVATION (C_σ)
- **Trigger:** Scaffolding new full-stack features, defining data flows, creating React hooks/services, or building Spring Boot REST layers (Controller/Service/Repository).
- **Exclusion:** Does not handle UI/UX styling (use `ui-design-linear.md`) or database schema migrations (use `database-jpa-architect.md`).

## 2. STRICT ARCHITECTURAL RULES (T_σ)
- **Product Experiences:** Keep teacher and student journeys as distinct feature domains in the client. Teacher authoring/generation is operational; class sharing and student learning workflows remain planned. The student site at `/alumnos` has a conceptual landing, local search, static chatbot, demo access forms, and a Forms 404 page. These do not create student accounts, sessions, messages, or saved data. Never imply demo data is live.
- **Role-aware routing:** Route authenticated users to their authorized experience based on server-validated roles and class membership. Hiding a button or route in React is not authorization.
- **Frontend Paradigm (React 19 + Vite):** Unidirectional data flow and separation of concerns.
  - **Flow:** `UI Component` → `Custom Hook` → `Zustand Store` (if global) / `API Service (Axios)`.
  - **Rule:** ZERO direct Axios or `fetch` calls inside `.jsx`/`.tsx` UI components. Always delegate to a dedicated service file (`src/app/services/` for the teacher app or the relevant feature module service directory).
  - **Student data rule:** Student requests must use class-scoped server contracts; never trust a client-supplied role, class ID, or resource ID as proof of access.
  - **Motion:** Use Motion for React (Motion.dev) for meaningful interaction feedback and transitions. Essential text and actions remain available without animation; respect `prefers-reduced-motion` and keep DOM reading order semantic.
- **Backend Paradigm (Spring Boot 4.x):** Layered Modular Monolith architecture with `teacher` and planned `student` domains.
  - **Flow:** `REST Controller` ↔ `DTO` ↔ `Service` ↔ `Entity` ↔ `Repository` ↔ `PostgreSQL`.
  - **Rule:** Entities NEVER leave the `Service` layer. Controllers only accept and return `DTO`s.
- **Communication:** Asynchronous REST over HTTP using JSON. Strict HTTP status codes mapping (200, 201, 400, 401, 403, 404, 500).

## 3. STANDARD OPERATING PROCEDURE (π_σ)
1. **Contract Definition:** Define the JSON payload (DTO) expected between Client and Server.
2. **Backend Execution:**
   - Build/Update `Repository`.
   - Build `Service` handling business logic and Entity-DTO mapping.
   - Build `Controller` mapping the route (e.g., `/api/v1/temarios`).
3. **Frontend Execution:**
   - Add endpoint to `src/app/services/[name]Service.js` for the existing teacher app, or to the relevant feature module service for student workflows.
   - Create/Update a Custom Hook in `src/app/hooks/` or the relevant feature module to handle loading, error, and data states.
   - Bind the hook to the `UI Component`.

## 4. COMPACT RECIPE (FEW-SHOT)
Input: "Create the frontend flow to fetch Temarios"
Output Expected:
```javascript
// 1. Service: src/app/services/temariosService.js
import api from './api'; // configured Axios instance

export const getTemarios = async () => {
  const response = await api.get('/temarios');
  return response.data;
};

// 2. Hook: src/app/hooks/useTemarios.js
import { useState, useEffect } from 'react';
import { getTemarios } from '@/app/services/temariosService';

export const useTemarios = () => {
  const [temarios, setTemarios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTemarios().then(setTemarios).finally(() => setLoading(false));
  }, []);

  return { temarios, loading };
};

// 3. Component: src/app/pages/Temarios.jsx
import { useTemarios } from '@/app/hooks/useTemarios';

export const Temarios = () => {
  const { temarios, loading } = useTemarios();
  if (loading) return <p>Loading...</p>;
  return <div>{temarios.map(t => <span key={t.id}>{t.nombre}</span>)}</div>;
};
```

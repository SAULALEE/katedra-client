---
name: architecture-client
description: General architecture of the project
---

# SKILL: Full-Stack Architecture & Data Flow (Katedra Core)

## 1. CONTEXT OF ACTIVATION (C_σ)
- **Trigger:** Scaffolding new full-stack features, defining data flows, creating React hooks/services, or building Spring Boot REST layers (Controller/Service/Repository).
- **Exclusion:** Does not handle UI/UX styling (use `ui-design-linear.md`) or database schema migrations (use `database-jpa-architect.md`).

## 2. STRICT ARCHITECTURAL RULES (T_σ)
- **Frontend Paradigm (React 18+):** Unidirectional data flow and separation of concerns. 
  - **Flow:** `UI Component` → `Custom Hook` → `Zustand Store` (if global) / `API Service (Axios)`.
  - **Rule:** ZERO direct Axios or `fetch` calls inside `.jsx`/`.tsx` UI components. Always delegate to a dedicated service file (`src/services/`).
- **Backend Paradigm (Spring Boot 3.x):** Layered Monolith architecture.
  - **Flow:** `REST Controller` ↔ `DTO` ↔ `Service` ↔ `Entity` ↔ `Repository` ↔ `MySQL`.
  - **Rule:** Entities NEVER leave the `Service` layer. Controllers only accept and return `DTO`s.
- **Communication:** Asynchronous REST over HTTP using JSON. Strict HTTP status codes mapping (200, 201, 400, 401, 403, 404, 500).

## 3. STANDARD OPERATING PROCEDURE (π_σ)
1. **Contract Definition:** Define the JSON payload (DTO) expected between Client and Server.
2. **Backend Execution:** 
   - Build/Update `Repository`.
   - Build `Service` handling business logic and Entity-DTO mapping.
   - Build `Controller` mapping the route (e.g., `/api/v1/temarios`).
3. **Frontend Execution:**
   - Add endpoint to `src/services/[name]Service.js`.
   - Create/Update a Custom Hook (`src/hooks/use[Name].js`) to handle loading, error, and data states.
   - Bind the hook to the `UI Component`.

## 4. COMPACT RECIPE (FEW-SHOT)
Input: "Create the frontend flow to fetch Temarios"
Output Expected:
```javascript
// 1. Service: src/services/temariosService.js
import api from './api'; // configured Axios instance

export const getTemarios = async () => {
  const response = await api.get('/temarios');
  return response.data;
};

// 2. Hook: src/hooks/useTemarios.js
import { useState, useEffect } from 'react';
import { getTemarios } from '@/services/temariosService';

export const useTemarios = () => {
  const [temarios, setTemarios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTemarios().then(setTemarios).finally(() => setLoading(false));
  }, []);

  return { temarios, loading };
};

// 3. Component: src/pages/Temarios.jsx
import { useTemarios } from '@/hooks/useTemarios';

export const Temarios = () => {
  const { temarios, loading } = useTemarios();
  if (loading) return <p>Loading...</p>;
  return <div>{temarios.map(t => <span key={t.id}>{t.nombre}</span>)}</div>;
};
```
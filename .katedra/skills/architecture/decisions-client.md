---
name: decisions-client
description: Architectural Decision Records (ADR)
---

# SKILL: ARCHITECTURAL DECISION RECORDS (ADR) & POLICY KEEPER

## 1. CONTEXT OF ACTIVATION (C_σ)
- **Trigger:** Whenever proposing a new technical solution, choosing a library, altering the architecture, or questioning an existing implementation in `katedra-client` or `katedra-server`.
- **Exclusion:** Does not apply to trivial refactors or CSS-only changes (use `DESIGN.md`).

## 2. STRICT ARCHITECTURAL RULES (T_σ)
- **Authority:** ADRs are the final word. If a proposed change contradicts an established ADR (e.g., ADR-002: Modular Monolith), the agent must halt and flag the conflict.
- **Core Stack:** React 19 + Vite, shadcn/ui and Tailwind CSS, Zustand, Axios, Motion for React (Motion.dev), Spring Boot 4.x (Java 21), PostgreSQL, and Flyway. The current client imports the existing `framer-motion` package; use the Motion.dev package/import convention when the dependency is deliberately migrated. No duplicate animation libraries.
- **Product Boundary:** Teacher and student experiences belong to the same Katedra product. Keep role-specific screens and state separate, with server-authoritative roles and class membership. Student product requirements exist, but do not assume student APIs are already implemented.
- **Justification:** Every architectural change must be mapped to a business goal (Scalability, Development Speed, Portfolio Value).

## 3. STANDARD OPERATING PROCEDURE (π_σ)
1. **Consultation:** Search/Read the project context and existing ADRs to identify the constraints of the requested feature.
2. **Alignment:** Validate if the solution aligns with the "React + Spring Boot + PostgreSQL" stack and "Modular Monolith" pattern.
3. **Drafting:** Propose the implementation. If it introduces a new technology or structural change, format it as a mini-ADR entry.
4. **Rejection:** Strictly reject polyglot architectures (e.g., adding NestJS) or microservices overhead for this 1-dev team scope.

## 4. COMPACT RECIPE (FEW-SHOT)
Input: "Should I use NestJS for the new reporting module?"
Output Expected:
> **Check:** Current architecture is "Modular Monolith in Spring Boot" (ADR-002).
> **Decision:** Rejected. Adding NestJS creates a polyglot architecture, increasing complexity for a 1-dev team.
> **Proposed Path:** Implement the reporting module as a new package within the existing `katedra-server` Spring Boot project.

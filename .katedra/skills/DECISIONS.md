# SKILL: ARCHITECTURAL DECISION RECORDS (ADR) & POLICY KEEPER

## 1. CONTEXT OF ACTIVATION (C_σ)
- **Trigger:** Whenever proposing a new technical solution, choosing a library, altering the architecture, or questioning an existing implementation in `katedra-client` or `katedra-server`.
- **Exclusion:** Does not apply to trivial refactors or CSS-only changes (use `DESIGN.md`).

## 2. STRICT ARCHITECTURAL RULES (T_σ)
- **Authority:** ADRs are the final word. If a proposed change contradicts an established ADR (e.g., ADR-002: Modular Monolith), the agent must halt and flag the conflict.
- **Core Stack:** React 18+ with shadcn/ui and Tailwind CSS, Zustand, Spring Boot 3.x (Java 21), MySQL 8.0, and Flyway[cite: 1]. No deviations allowed.
- **Justification:** Every architectural change must be mapped to a business goal (Scalability, Development Speed, Portfolio Value)[cite: 1].

## 3. STANDARD OPERATING PROCEDURE (π_σ)
1. **Consultation:** Search/Read the project context and existing ADRs to identify the constraints of the requested feature.
2. **Alignment:** Validate if the solution aligns with the "React + Spring Boot + MySQL" stack and "Modular Monolith" pattern[cite: 1].
3. **Drafting:** Propose the implementation. If it introduces a new technology or structural change, format it as a mini-ADR entry.
4. **Rejection:** Strictly reject polyglot architectures (e.g., adding NestJS[cite: 1]) or microservices overhead for this 1-dev team scope[cite: 1].

## 4. COMPACT RECIPE (FEW-SHOT)
Input: "Should I use NestJS for the new reporting module?"
Output Expected:
> **Check:** Current architecture is "Monolito modular en Spring Boot" (ADR-002)[cite: 1].
> **Decision:** Rejected. Adding NestJS creates a polyglot architecture, increasing complexity for a 1-dev team[cite: 1].
> **Proposed Path:** Implement the reporting module as a new package within the existing `katedra-server` Spring Boot project[cite: 1].
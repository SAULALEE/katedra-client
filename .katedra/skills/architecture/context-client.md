---
name: context-client
description: Business and domain context
---

# SKILL: SYSTEM CONTEXT & TECHNOLOGY STACK

## 1. CONTEXT OF ACTIVATION (C_σ)
- **Trigger:** Whenever a foundational understanding of Katedra's core functionality (AI content generation) or technology stack is required to scope, design, or build new features.
- **Exclusion:** Does not handle component-level styling (use `DESIGN.md`) or specific architectural data flows (use `ARCHITECTURE.md`).

## 2. STRICT BUSINESS & TECH RULES (T_σ)
- **Product Scope:** Katedra connects two experiences: teachers prepare materials today, with class publishing/sharing and student learning workflows planned. The teacher workspace is operational. The student landing, static chatbot, local search, and demo access forms exist. Student accounts, classes, submissions, and feedback are still planned product capabilities. Student Help and Inbox pages are not part of the current site.
- **Teacher Journey:** Prepare a syllabus, generate theory/evaluations/slides with AI, and organize materials. Class publishing/sharing is future work.
- **Student Methodology:** Keep class → topic/material → activity → student response → teacher feedback → next step together. Contextual AI may explain a prompt or feedback and suggest practice; student work remains the student's, and the teacher controls grades and attempts.
- **Target Audience:** Teachers preparing instruction and students learning/responding within shared classes.
- **Frontend Stack:** React 19 + Vite, Tailwind CSS, shadcn/ui, Zustand, Axios, and Motion for React (Motion.dev; the repository currently uses the `framer-motion` package/imports).
- **Backend Stack:** Spring Boot 4.x (Java 21) with Spring AI integration, modular monolith architecture.
- **Database Stack:** PostgreSQL, Flyway migrations, UUIDs (`VARCHAR(36)`), soft deletes (`deleted_at`).
- **AI Integration Architecture:**
  - **Primary AI Provider:** OpenAI (GPT-4, GPT-4-turbo, GPT-4o) with structured JSON output
  - **Spring AI Integration:** ChatClient abstracts OpenAI communication, enabling provider-agnostic design
  - **Async Processing:** All LLM operations use non-blocking patterns (CompletableFuture, Mono) for efficiency
  - Spring Backend orchestrates content generation with async ChatClient calls
  - Frontend consumes generated content via Spring REST endpoints (no direct LLM calls)

## 3. STANDARD OPERATING PROCEDURE (π_σ)
1. **Goal Verification:** Ensure features support either teacher preparation/publishing or the student learning/response journey. Do not reject student-facing work just because it does not generate AI content.
2. **Stack Alignment:** Validate that solutions strictly use the approved technology stack. Automatically reject unauthorized technologies (e.g., MongoDB, Angular, NextJS).
3. **Language Awareness:** Maintain code, variables, and database tables in Spanish (`snake_case` for DB, `camelCase` for Java/JS) to match the established domain language, while keeping system prompts/skills in English.

## 4. COMPACT RECIPE (FEW-SHOT)
Input: "What is the core feature of this app and what are all its components?"
Output Expected:
> **Core Product:** Katedra connects teacher preparation and publishing with a student learning journey. The teacher workflow is operational; the student landing and requirements are present, while student learning workflows remain planned.
>
> **System Architecture:**
> - **Frontend (React):** Displays syllabi, triggers content generation, shows generated theory/exercises/quizzes in real-time
> - **Backend API (Spring Boot 4.x with Spring AI):** Manages users, authentication, syllabi storage, orchestrates content generation with async ChatClient calls
> - **AI Integration (Spring AI ChatClient):** Abstracts OpenAI API communication, all calls non-blocking (CompletableFuture/Mono)
> - **Database (PostgreSQL):** Stores users, syllabi, and generated content with soft-delete support
>
> **Data Flow:** Frontend calls Spring API → Spring uses ChatClient → OpenAI (async, non-blocking) → Returns structured JSON → Spring saves to DB → Frontend displays

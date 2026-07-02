---
name: context-client
description: Business and domain context
---

# SKILL: SYSTEM CONTEXT & TECHNOLOGY STACK

## 1. CONTEXT OF ACTIVATION (C_σ)
- **Trigger:** Whenever a foundational understanding of Katedra's core functionality (AI content generation) or technology stack is required to scope, design, or build new features.
- **Exclusion:** Does not handle component-level styling (use `DESIGN.md`) or specific architectural data flows (use `ARCHITECTURE.md`).

## 2. STRICT BUSINESS & TECH RULES (T_σ)
- **Core App Functionality:** Katedra is an **AI-driven academic content generator**. Its primary engine takes a structured syllabus and automatically creates complete educational materials (theory, practical exercises, evaluations, and presentation slides) using LLMs. 
- **Target Audience:** Teachers (designed specifically to save 30-40% of manual preparation time).
- **Frontend Stack:** React 18+ (Vite), Tailwind CSS, shadcn/ui (Linear aesthetic), Zustand, Axios.
- **Backend Stack:** Spring Boot 3.x (Java 21) with Spring AI integration, Modular Monolith architecture.
- **Database Stack:** MySQL 8.0, Flyway migrations, UUIDs (`CHAR(36)`), soft deletes (`deleted_at`).
- **AI Integration Architecture:**
  - **Primary AI Provider:** OpenAI (GPT-4, GPT-4-turbo, GPT-4o) with structured JSON output
  - **Spring AI Integration:** ChatClient abstracts OpenAI communication, enabling provider-agnostic design
  - **Async Processing:** All LLM operations use non-blocking patterns (CompletableFuture, Mono) for efficiency
  - Spring Backend orchestrates content generation with async ChatClient calls
  - Frontend consumes generated content via Spring REST endpoints (no direct LLM calls)

## 3. STANDARD OPERATING PROCEDURE (π_σ)
1. **Goal Verification:** Ensure any new proposed feature directly serves the primary core goal: **Generating academic content via AI**. Reject features that deviate from this purpose.
2. **Stack Alignment:** Validate that solutions strictly use the approved technology stack. Automatically reject unauthorized technologies (e.g., MongoDB, Angular, NextJS).
3. **Language Awareness:** Maintain code, variables, and database tables in Spanish (`snake_case` for DB, `camelCase` for Java/JS) to match the established domain language, while keeping system prompts/skills in English.

## 4. COMPACT RECIPE (FEW-SHOT)
Input: "What is the core feature of this app and what are all its components?"
Output Expected:
> **Core Feature:** Katedra is an AI content generator for teachers. It automatically creates theory, exercises, and evaluations from syllabuses using OpenAI's GPT-4/4o models.
> 
> **System Architecture:**
> - **Frontend (React):** Displays syllabi, triggers content generation, shows generated theory/exercises/quizzes in real-time
> - **Backend API (Spring Boot 3.x with Spring AI):** Manages users, authentication, syllabi storage, orchestrates content generation with async ChatClient calls
> - **AI Integration (Spring AI ChatClient):** Abstracts OpenAI API communication, all calls non-blocking (CompletableFuture/Mono)
> - **Database (MySQL):** Stores users, syllabi, and generated content with soft-delete support
> 
> **Data Flow:** Frontend calls Spring API → Spring uses ChatClient → OpenAI (async, non-blocking) → Returns structured JSON → Spring saves to DB → Frontend displays
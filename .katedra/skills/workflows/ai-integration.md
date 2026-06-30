---
name: ai-integration
description: How to integrate AI calls into the code
---

# SKILL: AI Integration & Prompt Engineering (Katedra Core)

## 1. CONTEXT OF ACTIVATION (C_σ)
- **Trigger:** Defining prompt templates, calling AI provider APIs (Anthropic, OpenAI), parsing structured LLM responses, or modifying services that process generated educational content.
- **Exclusion:** Does not handle database storage structure (use `database-jpa-architect.md`) or REST routing mechanisms (use `ARCHITECTURE.md`).

## 2. STRICT ARCHITECTURAL RULES (T_σ)
- **Structured JSON Engine:** AI APIs must return highly structured, valid JSON. Always leverage structured outputs, tool definitions, or strict JSON modes rather than relying on manual regex extraction from raw markdown.
- **Prompt Isolation:** Prompt templates must never be hardcoded into business logic methods. Place prompts in isolated constants, property files, or dedicated template builders.
- **Error Resilience:** Implement robust validation schemas for LLM responses. If the JSON structure is incomplete or parsing fails, trigger a retry mechanism or return an explicit academic fallback payload rather than throwing a raw 500 exception.
- **Localisation:** The generated academic content (theory, exercises, solutions) must be written in professional, grammatically impeccable Spanish appropriate for the target grade level.
- **Token Optimization:** Avoid sending excessive historical data. Keep system prompts dense, precise, and highly instructions-focused to reduce latency and token costs.

## 3. STANDARD OPERATING PROCEDURE (π_σ)
1. **JSON Schema Definition:** Design the exact target JSON structure (using DTOs) that represents the desired educational output (e.g., questions, explanations).
2. **Prompt Drafting:** Write the system prompt defining the persona (academic expert) and the user prompt supplying the syllabus variables.
3. **API Execution:** Package the prompt, invoke the LLM service wrapper, and enforce JSON mode.
4. **Validation & Mapping:** Parse the returned string into the Java DTO. Validate fields (e.g., ensuring multiple-choice questions have exactly 4 choices and exactly 1 correct answer) before serving it.

## 4. COMPACT RECIPE (FEW-SHOT)
Input: "Create a prompt template and parser structure for generating 3 multiple choice questions"
Output Expected:
```java
// 1. DTO for Structured AI Response
public record EvaluationQuestionDTO(
    String question,
    List<String> options,
    Integer correctOptionIndex,
    String explanation
) {}

public record EvaluationResponseDTO(
    List<EvaluationQuestionDTO> questions
) {}

// 2. Service Prompt Constant & Parsing logic
@Service
public class EvaluationAIService {
    private static final String SYSTEM_PROMPT = """
        You are an expert academic generator. Generate a valid JSON containing multiple choice questions.
        Strictly comply with this format:
        {
          "questions": [
            {
              "question": "Question text",
              "options": ["Option A", "Option B", "Option C", "Option D"],
              "correctOptionIndex": 0,
              "explanation": "Detailed explanation"
            }
          ]
        }
        The content must be in Spanish and suitable for university level.
        """;

    public EvaluationResponseDTO generateQuestions(String topic) {
        String rawJson = llmClient.call(SYSTEM_PROMPT, "Topic to evaluate: " + topic);
        return objectMapper.readValue(rawJson, EvaluationResponseDTO.class);
    }
}
```

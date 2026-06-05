---
paths:
  - ".claude/agents/**"
  - ".claude/skills/**"
  - "**/*prompt*"
description: Prompt engineering patterns for agent delegation and tool calls
---

# Prompt Engineering Rules

## Mandatory Structure: CTCO Protocol

Every prompt to a subagent or tool MUST include these 4 elements:

1. **CONTEXT** (2-3 sentences): What the agent needs to know. File paths, prior findings, constraints.
2. **TASK** (one action verb + target): "Fix the error in X" not "look into X"
3. **CONSTRAINTS** (max 3): What NOT to do. Boundaries.
4. **OUTPUT** (format + length): What to return. "Return JSON with fields X, Y" or "Return under 200 words"

## Model-Specific Prompting

### Haiku (researcher, logger) — max 200 words
- Short, direct prompts. No examples needed.
- One task per prompt. No multi-step instructions.
- Explicit output format required (Haiku guesses poorly).

### Sonnet (implementer, deployer) — max 500 words
- Include one example of expected output.
- Specify constraints clearly (Sonnet follows them well).
- Can handle 2-3 sequential steps in one prompt.

### Opus (orchestrator, reviewer) — max 1000 words
- Can handle complex multi-step reasoning.
- Include edge cases and decision criteria.
- Benefits from "think step by step" for analytical tasks.

## Core Patterns

### Role-Task-Format (RTF)
```
You are a [ROLE] with expertise in [DOMAIN].
Your task is to [SPECIFIC TASK].
Output in [FORMAT]: [specifications]
```

### Few-Shot (for consistent formatting)
Provide 2-3 input/output examples BEFORE the actual task.
Critical when output format matters (JSON, tables, structured data).

### Chain-of-Thought (for complex reasoning)
"Solve step by step: 1. Identify the issue 2. List relevant facts 3. Apply reasoning 4. Conclude"
Improves accuracy 20-40% on complex tasks.

### Constraint-First (for safety)
List DO/DON'T rules BEFORE the task. Models follow constraints better when they appear early.

## Anti-Patterns (NEVER)

1. **Vague delegation**: "look into this" → "Find all TypeScript errors in src/pages/classroom.tsx"
2. **Context dumping**: Pasting full file contents → Point to file path, let agent read
3. **Multi-task prompts**: "do X and Y and Z" → One task per agent invocation
4. **Missing output spec**: Letting agent decide format → "Return: file path, diff, test results"
5. **Negative framing**: "Don't mention X" → "Focus exclusively on Y" (negative framing backfires)
6. **Over-prompting Haiku**: Sending 500+ words to Haiku → Keep under 200 words

## Temperature Guide

| Task | Temperature |
|------|------------|
| Factual extraction, classification | 0.0 |
| Code generation, summarization | 0.1-0.3 |
| Technical writing | 0.2-0.4 |
| Creative writing, brainstorming | 0.7-1.0 |

## Token Efficiency

- System prompts >2,000 tokens cause instruction-following degradation
- After 20+ turns, restate critical instructions (context degradation)
- Break long tasks into independent sub-tasks with fresh context
- Redirect verbose output to files, grep for results (never flood context)

# Blank RICE-POT Template

Copy this, fill each section, and hand it to your AI tool.

```
### R — Role
[Who should the AI act as? e.g., "expert QA tester with 15 years' experience"]

### I — Instructions
1. [First step]
2. [Second step]
...
Do NOT:
- [What the AI must never do]
- [Another hard rule]

### C — Context
- [Product / system / background the AI needs]
- [What inputs or files you are attaching]

### E — Example
[One sample row or snippet showing the ideal output]

### P — Parameters
- [Quality / accuracy / style constraints]
- [Determinism, traceability, length limits, no hallucination, etc.]

### O — Output
- Format: [CSV / JSON / Markdown table / code]
- Columns / structure: [exact spec, in order]

### T — Tone
[Technical / plain / formal / output-only]
```

## Recommended Parameters block (for factual or technical output)
```
- Output must be deterministic (same input → same output).
- Every assertion must be traceable to a provided input.
- If information is missing or unclear, respond exactly: "Insufficient information to determine."
- If a detail is inferred, label it exactly: "Inference (low confidence)".
- Do not invent features, IDs, APIs, error codes, UI elements, or behavior.
- Do not assume default or "typical" system behavior.
```
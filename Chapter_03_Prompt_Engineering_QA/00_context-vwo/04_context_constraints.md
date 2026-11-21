# 04 · Constraints and Guardrails

> Append this block to every prompt. It mirrors `Chapter_02_Prompt_Engineering/anti-hallucination-rules.md`.

## Hard Rules
1. Use only the information in files 01–03 and any requirements pasted into the prompt.
2. Do not invent features, error messages, password rules, limits or timeouts.
3. If something is missing, write **"Requires clarification"** (or "Insufficient information to determine").
4. Label any inferred detail as **"Inference (low confidence)"**.
5. Use synthetic test data and placeholders only. No real credentials or personal data.
6. Do not run authentication attempts against the live application.
7. Never mark a plan or report as final. A human owns sign-off.

## Output Self-Check (ask the model to finish with this)
- [ ] Every scenario traces to a requirement ID
- [ ] No invented messages, rules or values
- [ ] Gaps listed as open questions
- [ ] No personal data or real credentials

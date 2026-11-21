# 04 · Constraints and Guardrails

> How to fill this file: [04_context_constraints_usage_guide.html](04_context_constraints_usage_guide.html) · Whole pack: [00_context_pack_usage_guide.html](00_context_pack_usage_guide.html)
> Project-independent. Append this block to every prompt. Add project-specific rules at the bottom.

## Hard Rules
1. Use only the information in files 01–03 and any requirements pasted into the prompt.
2. Do not invent features, error messages, password rules, limits or timeouts.
3. If something is missing, write **"Requires clarification"** (or "Insufficient information to determine").
4. Label any inferred detail as **"Inference (low confidence)"**.
5. Use synthetic test data and placeholders only. No real credentials or personal data.
6. Do not run actions against live systems unless explicitly authorised.
7. Never mark a plan or report as final. A human owns sign-off.

## Project-specific rules
- [RULE, e.g. "Do not test payment flows in production"]

## Output Self-Check (ask the model to finish with this)
- [ ] Every scenario traces to a requirement ID
- [ ] No invented messages, rules or values
- [ ] Gaps listed as open questions
- [ ] No personal data or real credentials

# Bugs 06 · Anti-Hallucination Reminder

**Use when:** append this block to any bug-related prompt, or send it as a follow-up when an answer looks invented.
Based on `Chapter_02_Prompt_Engineering/anti-hallucination-rules.md`.

```text
REMINDER - VERIFY BEFORE YOU ANSWER

1. Use ONLY the observations, logs and requirements I supplied.
2. Do NOT invent error text, codes, versions, URLs, steps or root causes.
3. Missing information -> "Not supplied" or "Requires clarification".
4. Inferred information -> label "Inference (low confidence)".
5. Keep observed behaviour and assumptions in separate sections.
6. Severity stays "provisional" until a human triages it.

Before the final answer, output:
- Verified Facts:
- Missing / Unknown Information:
- Self-Check: list any statement you could not trace to my input, then remove or relabel it.
```

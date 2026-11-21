# 11 · Gap Analysis (STAR)

> Compare a current state against an expected state and produce a prioritised gap register.

**Framework:** STAR (Situation · Task · Action · Result) — definition: [STAR](../Templates/Template_STAR.md)
**Usage guide:** [11_Gap_Analysis_STAR_usage_guide.html](11_Gap_Analysis_STAR_usage_guide.html)

| Use when | Skip when |
|----------|-----------|
| Comparing test cases against a PRD<br>Comparing a repo, process or feature against a standard or reference | You only need requirement quality checks (use 01) |

## Inputs you need
- [ ] Expected state (PRD, standard, checklist, reference)
- [ ] Current state (test cases, implementation notes, repo listing)
- [ ] Scope of the comparison

> Tip: for project background, fill the blank context pack [`../00_context-template/`](../00_context-template/) and paste it above the prompt. [`../00_context-vwo/`](../00_context-vwo/) is a filled example.

## Prompt (copy everything inside the block)

```text
## S: Situation
I am comparing [CURRENT STATE] against [EXPECTED STATE] for [SCOPE].
Expected:
[PASTE]
Current:
[PASTE]

## T: Task
Identify and prioritise the gaps between current and expected.

## A: Action
- List expected items with IDs (EXP-01, ...).
- For each, check the current state: Covered / Partial / Missing.
- Also list Extra items (present in current, not in expected).
- Quote evidence from the input for each status.
- Rate impact High / Medium / Low with a reason and give a recommendation.

## R: Result
Return:
1. Gap register
2. Summary counts by status
3. Top 5 gaps to close first
4. Questions / missing information

GUARDRAILS (always apply)
- Use ONLY the information pasted into this prompt.
- Do NOT invent requirements, IDs, error messages, numbers, dates or behaviour.
- Missing information -> write "Requires clarification" or "Not supplied".
- Inferred information -> label it "Inference (low confidence)".
- Synthetic data and placeholders only (e.g. <registered_test_email>). No real credentials or personal data.
- Finish with a short Self-Check: list anything you could not trace to the input.
```

## Expected output format

```text
| Gap ID | Expected Item | Current State | Status | Evidence | Impact | Recommendation | Owner |
```

## Worked example (VWO login)

**Input (excerpt):** Expected: test cases cover the domain redirect (app.vwo.com -> app.wingify.com). Current: v1 test cases assert app.vwo.com.

**Output (excerpt):**

```text
| GAP-01 | Login URL after redirect | Tests assert app.vwo.com | Missing | 'expect URL app.vwo.com' in TC-002 | High | Assert the final URL after redirect | QA |
```

## Review checklist
- [ ] Every status has quoted evidence
- [ ] Extra items are listed, not ignored
- [ ] Impact has a reason
- [ ] No assumed facts

## Common problems
| Problem | Fix |
|---------|-----|
| Status given without evidence | Ask for a quote from the input for each row. |
| Recommendations are generic | Ask for one concrete action per gap. |

## Next steps
- Feeds into: [Requirement Analysis](01_Requirement_Analysis_STAR.md), [Status Report](13_Status_Report_CRISP.md)
- Related quick prompts:
- [Gap_Analysis_anti-hallucination.html](../../Chapter_02_Prompt_Engineering/output/Gap_Analysis_anti-hallucination.html)

## Convert to SKILL.md
Create `skills/gap-analyzer/SKILL.md` with this frontmatter, then paste the Prompt, Output format and Review checklist sections below it as the skill instructions:

```yaml
---
name: "gap-analyzer"
description: "Compare a current state against an expected state and produce a prioritised gap register. Use when the user says "gap analysis", "compare against the PRD", "what is missing compared to"."
version: "1.0.0"
author: "Chaitanya Hasabnis"
license: "MIT"
tags:
  - qa
  - star
---
```

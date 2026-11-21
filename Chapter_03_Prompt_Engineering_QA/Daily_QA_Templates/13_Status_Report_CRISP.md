# 13 · Status Report (CRISP)

> Write a short stakeholder status report with a suggested RAG status, numbers, risks and asks.

**Framework:** CRISP (Context · Role · Instructions · Style · Parameters) — definition: [CRISP](../Templates/Template_CRISP.md)
**Usage guide:** [13_Status_Report_CRISP_usage_guide.html](13_Status_Report_CRISP_usage_guide.html)

| Use when | Skip when |
|----------|-----------|
| Daily / weekly QA status to PM, Dev Lead or management<br>Before a go/no-go meeting | You need the detailed defect board (use 05) |

## Inputs you need
- [ ] Period and release
- [ ] Execution numbers
- [ ] Defect summary
- [ ] Blockers, risks, milestones

> Tip: paste the context pack from [`../00_context-vwo/`](../00_context-vwo/) above the prompt for project background.

## Prompt (copy everything inside the block)

```text
## C: Context
QA status for [RELEASE], period [FROM - TO].
Execution: [PASTE NUMBERS]
Defects: [PASTE SUMMARY]
Blockers / risks: [PASTE]
Milestones: [PASTE]

## R: Role
Act as a QA Lead reporting to stakeholders.

## I: Instructions
Sections: Overall status (suggested RAG + one-line reason), Progress, Defects, Blockers and risks, Plan for next period, Decisions / help needed.
Suggested RAG rule: Green = on track and no open Critical; Amber = at risk; Red = blocked or Critical open.
Use only the supplied numbers; do not invent dates.

## S: Style
Executive and brief. First line is the conclusion.

## P: Parameters
- Under 300 words.
- One table for numbers, with totals.
- RAG labelled 'suggested'.

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
Overall: <RAG (suggested)> - reason
| Metric | Value |
Risks / Blockers / Next / Asks
```

## Worked example (VWO login)

**Input (excerpt):** 40 planned, 32 executed, 28 pass, 4 fail; 1 High open (BUG-101); staging down 4h.

**Output (excerpt):**

```text
Overall: Amber (suggested) - 80% executed, one High defect open.
| Executed | 32 / 40 | Pass | 28 | Fail | 4 |
```

## Review checklist
- [ ] Every number is from the input
- [ ] RAG follows the stated rule
- [ ] Asks are specific
- [ ] Under the word limit

## Common problems
| Problem | Fix |
|---------|-----|
| Percentages don't match counts | Ask it to show the calculation. |
| Optimistic tone hides risk | Ask for blockers before progress. |

## Next steps
- Feeds into: -
- Related quick prompts:
- None

## Convert to SKILL.md
Create `skills/qa-status-reporter/SKILL.md` with this frontmatter, then paste the Prompt, Output format and Review checklist sections below it as the skill instructions:

```yaml
---
name: "qa-status-reporter"
description: "Write a short stakeholder status report with a suggested RAG status, numbers, risks and asks. Use when the user says "QA status report", "weekly test status", "write a status update"."
version: "1.0.0"
author: "Chaitanya Hasabnis"
license: "MIT"
tags:
  - qa
  - crisp
---
```

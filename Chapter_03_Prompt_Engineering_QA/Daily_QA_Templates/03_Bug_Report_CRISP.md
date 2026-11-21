# 03 · Bug Report (CRISP)

> Turn observations into a reproducible bug report a developer can act on without asking questions.

**Framework:** CRISP (Context · Role · Instructions · Style · Parameters) — definition: [CRISP](../Templates/Template_CRISP.md)
**Usage guide:** [03_Bug_Report_CRISP_usage_guide.html](03_Bug_Report_CRISP_usage_guide.html)

| Use when | Skip when |
|----------|-----------|
| You observed a defect and have steps and results<br>A bug report needs rewriting before filing | You only have messy session notes with several issues (use Reusable_Templates/bugs/05) |

## Inputs you need
- [ ] Requirement being violated
- [ ] Starting state and steps
- [ ] Expected vs observed result
- [ ] Reproducibility (x of y)
- [ ] Environment details and attachments, or 'Not supplied'

> Tip: for project background, fill the blank context pack [`../00_context-template/`](../00_context-template/) and paste it above the prompt. [`../00_context-vwo/`](../00_context-vwo/) is a filled example.

## Prompt (copy everything inside the block)

```text
## C: Context
At [URL / MODULE] I observed:
- Requirement: [REQUIREMENT]
- Starting state: [STATE]
- Steps: [STEPS]
- Observation: [WHAT HAPPENED]
- Reproducibility: [x of y attempts]
- Environment (browser, OS, build): [VALUES or Not supplied]
- Attachments: [LIST or Not supplied]

## R: Role
Act as a Senior QA Engineer writing for a developer who has not seen the issue.

## I: Instructions
Write a bug report with: Title, Environment, Preconditions, Test Data, Steps to Reproduce, Expected Result, Actual Result, Reproducibility, Severity (provisional) with rationale, Priority (suggested), Attachments.
Separate observed behaviour from assumptions. Do not invent message text.

## S: Style
Concise and factual. Numbered steps. Title format: [Area] - [what fails] when [condition].

## P: Parameters
- One report, under 400 words.
- Placeholders for accounts.
- Missing details: 'Not supplied'. Missing attachments: 'Not provided'.

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
Title / Environment / Preconditions / Test Data / Steps to Reproduce / Expected / Actual / Reproducibility / Severity (provisional) / Priority / Attachments
```

## Worked example (VWO login)

**Input (excerpt):** Empty password, registered email, submit -> form submits, no validation shown, 3/3.

**Output (excerpt):**

```text
Title: Login - form submits without validation when password is empty
Expected: Login is not completed and the user is told the password is required (exact text: Requires clarification).
Severity (provisional): Major - mandatory-field rule not enforced.
```

## Review checklist
- [ ] Steps reproduce the issue from a clean state
- [ ] Expected result traces to a requirement
- [ ] Observed and assumed are separate
- [ ] Severity is labelled provisional

## Common problems
| Problem | Fix |
|---------|-----|
| Root cause guessed in the report | Move guesses to 'Notes (Inference, low confidence)' or remove them. |
| Environment invented (e.g. Chrome 120) | Replace with 'Not supplied' and add it before filing. |

## Next steps
- Feeds into: [Bug Triaging](08_Bug_Triaging_CRISP.md), [Defect Tracking](05_Defect_Tracking_CRISP.md)
- Related quick prompts:
- [CRISP.md](../CRISP.md)
- [01_Basic_Bug_Report.md](../Reusable_Templates/bugs/01_Basic_Bug_Report.md)
- [04_Bug_Report_Review.md](../Reusable_Templates/bugs/04_Bug_Report_Review.md)

## Convert to SKILL.md
Create `skills/bug-report-writer/SKILL.md` with this frontmatter, then paste the Prompt, Output format and Review checklist sections below it as the skill instructions:

```yaml
---
name: "bug-report-writer"
description: "Turn observations into a reproducible bug report a developer can act on without asking questions. Use when the user says "write a bug report", "log this defect", "turn this into a bug"."
version: "1.0.0"
author: "Chaitanya Hasabnis"
license: "MIT"
tags:
  - qa
  - crisp
---
```

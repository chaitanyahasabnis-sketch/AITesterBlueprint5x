# 05 · Defect Tracking (CRISP)

> Produce a defect board update: status, aging, stale and reopened bugs, and owner actions.

**Framework:** CRISP (Context · Role · Instructions · Style · Parameters) — definition: [CRISP](../Templates/Template_CRISP.md)
**Usage guide:** [05_Defect_Tracking_CRISP_usage_guide.html](05_Defect_Tracking_CRISP_usage_guide.html)

| Use when | Skip when |
|----------|-----------|
| Weekly or daily defect review<br>Before a release go/no-go | You are deciding severity of new bugs (use 08 Bug Triaging) |

## Inputs you need
- [ ] Defect export: ID, title, severity, priority, status, assignee, created, updated, reopen count
- [ ] Report date
- [ ] Stale threshold in days

> Tip: for project background, fill the blank context pack [`../00_context-template/`](../00_context-template/) and paste it above the prompt. [`../00_context-vwo/`](../00_context-vwo/) is a filled example.

## Prompt (copy everything inside the block)

```text
## C: Context
Defect export for [PROJECT / RELEASE] as of [REPORT DATE]:
[PASTE DEFECT LIST]

## R: Role
Act as a QA Lead maintaining the defect board.

## I: Instructions
Produce:
1. Counts by status and by severity
2. Aging: days open from 'created' to report date
3. Stale defects: no update for more than [N] days
4. Reopened defects
5. Release blockers: Critical/High still open
6. Actions per owner
Compute only from the data. Missing fields: 'Not supplied'.

## S: Style
Scannable tables, neutral tone, no blame.

## P: Parameters
- One page.
- Sort by severity, then age.
- Dates as YYYY-MM-DD.

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
| Defect ID | Title | Severity | Status | Assignee | Age (days) | Last Update | Flag (Stale / Reopened / Blocker) |
```

## Worked example (VWO login)

**Input (excerpt):** BUG-101 | Login no validation | High | Open | dev-a | created 2026-11-12 | updated 2026-11-12; report date 2026-11-21; stale > 5 days

**Output (excerpt):**

```text
| BUG-101 | Login no validation | High | Open | dev-a | 9 | 2026-11-12 | Stale, Blocker |
```

## Review checklist
- [ ] Ages are computed from the given dates
- [ ] Every blocker is High/Critical and open
- [ ] No defects added or dropped
- [ ] Actions name an owner

## Common problems
| Problem | Fix |
|---------|-----|
| Ages computed from today's real date | State the report date explicitly in Context. |
| Statuses renamed | Ask it to keep status values exactly as exported. |

## Next steps
- Feeds into: [Status Report](13_Status_Report_CRISP.md), [Bug Triaging](08_Bug_Triaging_CRISP.md)
- Related quick prompts:
- [02_Bug_Classification.md](../Reusable_Templates/bugs/02_Bug_Classification.md)

## Convert to SKILL.md
Create `skills/defect-tracker/SKILL.md` with this frontmatter, then paste the Prompt, Output format and Review checklist sections below it as the skill instructions:

```yaml
---
name: "defect-tracker"
description: "Produce a defect board update: status, aging, stale and reopened bugs, and owner actions. Use when the user says "defect status update", "which bugs are stale", "summarise the bug board"."
version: "1.0.0"
author: "Chaitanya Hasabnis"
license: "MIT"
tags:
  - qa
  - crisp
---
```

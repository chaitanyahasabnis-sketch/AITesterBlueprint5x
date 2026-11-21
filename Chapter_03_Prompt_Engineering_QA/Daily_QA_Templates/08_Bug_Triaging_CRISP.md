# 08 · Bug Triaging (CRISP)

> Prepare provisional severity, priority and decisions for a triage meeting.

**Framework:** CRISP (Context · Role · Instructions · Style · Parameters) — definition: [CRISP](../Templates/Template_CRISP.md)
**Usage guide:** [08_Bug_Triaging_CRISP_usage_guide.html](08_Bug_Triaging_CRISP_usage_guide.html)

| Use when | Skip when |
|----------|-----------|
| New bugs are waiting for triage<br>Before a release cut to decide what gets fixed | You are writing a single new bug report (use 03) |

## Inputs you need
- [ ] List of untriaged bugs with description
- [ ] Release date
- [ ] Severity/priority definitions (default provided)
- [ ] Optional: team capacity

> Tip: paste the context pack from [`../00_context-vwo/`](../00_context-vwo/) above the prompt for project background.

## Prompt (copy everything inside the block)

```text
## C: Context
Untriaged bugs for [PROJECT], release on [DATE]:
[PASTE BUGS]
Severity: Critical (security/data loss/no workaround), High (major function broken), Medium (workaround exists), Low (cosmetic).
Priority: P0 fix now, P1 this release, P2 backlog.

## R: Role
Act as a QA Lead preparing a triage meeting.

## I: Instructions
For each bug give: Severity, Priority, one-line rationale, possible duplicates (only among the supplied bugs), Needs-more-info (Y/N + what), Decision: Fix now / This release / Backlog / Needs PO decision.
All outputs are provisional; the triage meeting decides.

## S: Style
One line per rationale, neutral, no blame.

## P: Parameters
- Table grouped by Decision.
- Rationale max [25] words.
- End with questions for the meeting.

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
| Bug ID | Title | Severity | Priority | Rationale | Duplicate Of | Needs Info | Decision (provisional) |
```

## Worked example (VWO login)

**Input (excerpt):** BUG-101 Login form submits with empty password.

**Output (excerpt):**

```text
| BUG-101 | Login submits with empty password | High | P1 | Mandatory-field rule broken; no data loss | - | N | This release |
```

## Review checklist
- [ ] Scales used exactly as defined
- [ ] Duplicates only among supplied bugs
- [ ] Every decision has a rationale
- [ ] Marked provisional

## Common problems
| Problem | Fix |
|---------|-----|
| Everything rated High | Ask it to justify each High against the definition. |
| Duplicates referenced to bugs not in the list | Repeat 'only among the supplied bugs'. |

## Next steps
- Feeds into: [Defect Tracking](05_Defect_Tracking_CRISP.md), [Status Report](13_Status_Report_CRISP.md)
- Related quick prompts:
- [02_Bug_Classification.md](../Reusable_Templates/bugs/02_Bug_Classification.md)
- [03_Bug_Analysis.md](../Reusable_Templates/bugs/03_Bug_Analysis.md)

## Convert to SKILL.md
Create `skills/bug-triage-assistant/SKILL.md` with this frontmatter, then paste the Prompt, Output format and Review checklist sections below it as the skill instructions:

```yaml
---
name: "bug-triage-assistant"
description: "Prepare provisional severity, priority and decisions for a triage meeting. Use when the user says "triage these bugs", "prioritise defects", "prepare bug triage"."
version: "1.0.0"
author: "Chaitanya Hasabnis"
license: "MIT"
tags:
  - qa
  - crisp
---
```

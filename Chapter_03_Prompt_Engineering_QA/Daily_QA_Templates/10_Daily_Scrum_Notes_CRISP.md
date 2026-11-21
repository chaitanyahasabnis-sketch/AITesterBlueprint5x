# 10 · Daily Scrum Notes (CRISP)

> Turn raw stand-up notes into clean Yesterday / Today / Blockers notes with action items.

**Framework:** CRISP (Context · Role · Instructions · Style · Parameters) — definition: [CRISP](../Templates/Template_CRISP.md)
**Usage guide:** [10_Daily_Scrum_Notes_CRISP_usage_guide.html](10_Daily_Scrum_Notes_CRISP_usage_guide.html)

| Use when | Skip when |
|----------|-----------|
| Right after the daily stand-up<br>You keep a QA log for the sprint | You need a stakeholder report (use 13) |

## Inputs you need
- [ ] Raw notes from the stand-up
- [ ] Date and sprint
- [ ] Names or roles as they should appear

> Tip: paste the context pack from [`../00_context-vwo/`](../00_context-vwo/) above the prompt for project background.

## Prompt (copy everything inside the block)

```text
## C: Context
Raw notes from the daily stand-up on [DATE], sprint [SPRINT]:
[PASTE NOTES]

## R: Role
Act as a QA engineer documenting the stand-up.

## I: Instructions
For each person: Yesterday / Today / Blockers.
Then: QA highlights (test progress, defects raised, environment issues), Decisions, Action items with owner and due date (only if stated).
Do not attribute anything to a person that is not in the notes.

## S: Style
Bullets of at most 15 words. Past tense for Yesterday, present/future for Today.

## P: Parameters
- One page.
- Use names or roles exactly as given.
- Missing info: 'Not stated'.

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
### <Name>
- Yesterday: ...
- Today: ...
- Blockers: ...

| Action | Owner | Due |
```

## Worked example (VWO login)

**Input (excerpt):** QA: finished login TCs, 1 bug, today regression; blocked: staging down since morning.

**Output (excerpt):**

```text
### QA
- Yesterday: Completed login test cases; raised BUG-101.
- Today: Start regression.
- Blockers: Staging unavailable since morning.
```

## Review checklist
- [ ] Nothing attributed that isn't in the notes
- [ ] Action items have owners only if stated
- [ ] Blockers are explicit
- [ ] Short bullets

## Common problems
| Problem | Fix |
|---------|-----|
| Model invents due dates | Ask for 'Not stated' where no date was given. |
| Notes rewritten into long prose | Repeat the 15-word bullet limit. |

## Next steps
- Feeds into: [Status Report](13_Status_Report_CRISP.md)
- Related quick prompts:
- None

## Convert to SKILL.md
Create `skills/scrum-notes-writer/SKILL.md` with this frontmatter, then paste the Prompt, Output format and Review checklist sections below it as the skill instructions:

```yaml
---
name: "scrum-notes-writer"
description: "Turn raw stand-up notes into clean Yesterday / Today / Blockers notes with action items. Use when the user says "write up today's standup", "scrum notes", "daily standup summary"."
version: "1.0.0"
author: "Chaitanya Hasabnis"
license: "MIT"
tags:
  - qa
  - crisp
---
```

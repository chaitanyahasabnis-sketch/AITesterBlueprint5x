# 04 · Test Case Execution (STAR)

> Convert raw execution notes into a clean execution log with statuses, defects to raise and a summary.

**Framework:** STAR (Situation · Task · Action · Result) — definition: [STAR](../Templates/Template_STAR.md)
**Usage guide:** [04_Test_Case_Execution_STAR_usage_guide.html](04_Test_Case_Execution_STAR_usage_guide.html)

| Use when | Skip when |
|----------|-----------|
| You finished (part of) a test run and have notes per test<br>You need an execution log for a report | Results already come from a tool report (use the tool's export with 13 Status Report) |

## Inputs you need
- [ ] Build / version and environment
- [ ] Execution date
- [ ] Test case list (IDs + titles)
- [ ] Raw notes per test: what happened, evidence, defect IDs

> Tip: for project background, fill the blank context pack [`../00_context-template/`](../00_context-template/) and paste it above the prompt. [`../00_context-vwo/`](../00_context-vwo/) is a filled example.

## Prompt (copy everything inside the block)

```text
## S: Situation
I executed test cases for [FEATURE] on build [BUILD] in [ENVIRONMENT] on [DATE].
Test cases:
[PASTE TC IDs + TITLES + EXPECTED]
Raw results:
[PASTE NOTES PER TC]

## T: Task
Turn the raw notes into a structured execution log and summary.

## A: Action
- Map every note to its TC ID; tests without a note are 'Not Run'.
- Status rules: Pass = expected result observed; Fail = differs from expected; Blocked = could not execute (state the reason); Not Run = not attempted.
- Never mark Pass without a note that supports it.
- For Fail, record actual vs expected and the defect ID if given; if none, list it under 'Defects to raise'.
- Calculate counts only from the data.

## R: Result
Return:
1. Execution log table
2. Summary: total, Pass, Fail, Blocked, Not Run, pass rate (Pass / executed)
3. Blocked items with reasons
4. Defects to raise
5. Retest list

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
| TC ID | Title | Status | Actual Result | Defect ID | Evidence | Notes |
```

## Worked example (VWO login)

**Input (excerpt):** TC-006 empty password -> submitted, nothing shown. TC-001 -> dashboard opened. TC-010 -> env down.

**Output (excerpt):**

```text
| TC-006 | Submit with empty password | Fail | Form submitted, no validation | Not supplied -> raise | Not supplied | |
| TC-010 | ... | Blocked | Environment unavailable | - | - | Retest |
```

## Review checklist
- [ ] Every TC appears exactly once
- [ ] Status follows the defined rules
- [ ] Counts add up to the total
- [ ] Failures without a defect ID are listed to raise

## Common problems
| Problem | Fix |
|---------|-----|
| Untested cases shown as Pass | Point to the rule 'Never mark Pass without a supporting note'. |
| Pass rate uses total instead of executed | Ask it to show the formula next to the number. |

## Next steps
- Feeds into: [Bug Report](03_Bug_Report_CRISP.md), [Defect Tracking](05_Defect_Tracking_CRISP.md), [Status Report](13_Status_Report_CRISP.md)
- Related quick prompts:
- [06_Regression_Suite.md](../Reusable_Templates/testing/06_Regression_Suite.md)

## Convert to SKILL.md
Create `skills/test-execution-logger/SKILL.md` with this frontmatter, then paste the Prompt, Output format and Review checklist sections below it as the skill instructions:

```yaml
---
name: "test-execution-logger"
description: "Convert raw execution notes into a clean execution log with statuses, defects to raise and a summary. Use when the user says "log my test execution", "create an execution report", "summarise this test run"."
version: "1.0.0"
author: "Chaitanya Hasabnis"
license: "MIT"
tags:
  - qa
  - star
---
```

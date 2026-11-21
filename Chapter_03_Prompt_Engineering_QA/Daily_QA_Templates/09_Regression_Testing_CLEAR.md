# 09 · Regression Testing (CLEAR)

> Select a risk-based regression set from existing tests for a specific change, within a time budget.

**Framework:** CLEAR (Context · Limits · Examples · Action · Review) — definition: [CLEAR](../Templates/Template_CLEAR.md)
**Usage guide:** [09_Regression_Testing_CLEAR_usage_guide.html](09_Regression_Testing_CLEAR_usage_guide.html)

| Use when | Skip when |
|----------|-----------|
| A release or significant change is coming<br>You must cut regression to fit time | Only a quick build check is needed (use 07) |

## Inputs you need
- [ ] Change description (tickets, modules, PR summary)
- [ ] Existing test suite (IDs, titles, area, automated Y/N, duration)
- [ ] Time budget

> Tip: paste the context pack from [`../00_context-vwo/`](../00_context-vwo/) above the prompt for project background.

## Prompt (copy everything inside the block)

```text
## C: Context
Act as a QA Lead planning regression for [RELEASE].
Changes:
[PASTE]
Existing tests:
[PASTE TC ID | Title | Area | Automated | Minutes]
Time budget: [HOURS]

## L: Limits
1. Select only supplied test IDs; suggestions for new tests go in a separate list.
2. Justify every selection by change impact.
3. Respect the time budget; automated tests count separately from manual time.

## E: Examples
Row: TC-001 | Valid login | Critical | Login module changed | Automated | 1

## A: Action
Map changed areas to dependent areas, then place tests in tiers: Critical (must run), Impacted, Extended (if time allows). Give an execution order.

## R: Review
1. Every changed area has at least one test.
2. Manual time total within budget.
3. Gaps -> new tests to write.
4. Risk statement if Extended is skipped.

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
| TC ID | Title | Tier | Reason (impact) | Automated | Minutes |
```

## Worked example (VWO login)

**Input (excerpt):** Change: login validation fix (BUG-101). Budget 2 hours.

**Output (excerpt):**

```text
| TC-006 | Empty password | Critical | Directly changed | Yes | 1 |
Gap: no test for whitespace-only password -> write new test.
```

## Review checklist
- [ ] Only supplied IDs
- [ ] Each selection has an impact reason
- [ ] Time totals shown
- [ ] Gaps listed separately

## Common problems
| Problem | Fix |
|---------|-----|
| Whole suite selected | Ask it to cut to the time budget and show the total. |
| New test IDs mixed into the selection | Repeat Limit 1. |

## Next steps
- Feeds into: [Test Case Execution](04_Test_Case_Execution_STAR.md), [Test Coverage](17_Test_Coverage_STAR.md)
- Related quick prompts:
- [06_Regression_Suite.md](../Reusable_Templates/testing/06_Regression_Suite.md)

## Convert to SKILL.md
Create `skills/regression-planner/SKILL.md` with this frontmatter, then paste the Prompt, Output format and Review checklist sections below it as the skill instructions:

```yaml
---
name: "regression-planner"
description: "Select a risk-based regression set from existing tests for a specific change, within a time budget. Use when the user says "plan regression", "what should we retest", "regression scope for this release"."
version: "1.0.0"
author: "Chaitanya Hasabnis"
license: "MIT"
tags:
  - qa
  - clear
---
```

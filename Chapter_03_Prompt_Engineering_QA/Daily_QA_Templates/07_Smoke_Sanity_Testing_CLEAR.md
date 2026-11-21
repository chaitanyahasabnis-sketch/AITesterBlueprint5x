# 07 · Smoke and Sanity Testing (CLEAR)

> Produce a short, time-boxed smoke or sanity checklist with an explicit go/no-go rule.

**Framework:** CLEAR (Context · Limits · Examples · Action · Review) — definition: [CLEAR](../Templates/Template_CLEAR.md)
**Usage guide:** [07_Smoke_Sanity_Testing_CLEAR_usage_guide.html](07_Smoke_Sanity_Testing_CLEAR_usage_guide.html)

| Use when | Skip when |
|----------|-----------|
| A new build lands (smoke: broad and shallow)<br>A fix or small change lands (sanity: narrow and deep) | You need full regression scope (use 09) |

## Inputs you need
- [ ] Build number and environment
- [ ] Smoke or Sanity
- [ ] Critical flows list
- [ ] Change / fix notes (for sanity)
- [ ] Time box

> Tip: for project background, fill the blank context pack [`../00_context-template/`](../00_context-template/) and paste it above the prompt. [`../00_context-vwo/`](../00_context-vwo/) is a filled example.

## Prompt (copy everything inside the block)

```text
## C: Context
Build [BUILD] is deployed to [ENVIRONMENT]. Run type: [Smoke / Sanity].
Critical flows:
[PASTE]
Change or fix notes (sanity):
[PASTE or Not supplied]

## L: Limits
1. Smoke: at most [15] checks, total time <= [30] minutes, one check per critical flow.
2. Sanity: only the changed area and directly connected flows.
3. Use only the supplied flows; do not invent features.
4. Every check has a clear pass/fail criterion.

## E: Examples
Row: SM-01 | [Critical flow] | [Minimal steps] | [Observable expected result] | Pass if [criterion] | [Minutes]

## A: Action
Generate the checklist and a go/no-go rule. For sanity, include verification of the fix plus adjacent checks.

## R: Review
1. Each critical flow is covered once.
2. Total time fits the time box.
3. Go/no-go rule is explicit (e.g. any P0 check fails = no-go).
4. List data or accounts needed.

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
| Check ID | Flow | Steps | Expected | Pass Criterion | Time (min) |  + Go / No-Go rule
```

## Worked example (VWO login)

**Input (excerpt):** Sanity after fix for BUG-101 (empty password validation).

**Output (excerpt):**

```text
| SN-01 | Login | Submit with empty password | Login blocked, validation shown | Pass if not logged in and a message is visible | 2 |
Go/No-Go: SN-01 fails = reject build.
```

## Review checklist
- [ ] Within the check and time limits
- [ ] Go/no-go rule is stated
- [ ] Sanity stays near the change
- [ ] Only supplied flows used

## Common problems
| Problem | Fix |
|---------|-----|
| Smoke list grows into regression | Reduce the limit and ask for the most critical check per flow. |
| No go/no-go rule | Ask for the Review step output explicitly. |

## Next steps
- Feeds into: [Regression Testing](09_Regression_Testing_CLEAR.md), [Test Case Execution](04_Test_Case_Execution_STAR.md)
- Related quick prompts:
- [06_Regression_Suite.md](../Reusable_Templates/testing/06_Regression_Suite.md)

## Convert to SKILL.md
Create `skills/smoke-sanity-planner/SKILL.md` with this frontmatter, then paste the Prompt, Output format and Review checklist sections below it as the skill instructions:

```yaml
---
name: "smoke-sanity-planner"
description: "Produce a short, time-boxed smoke or sanity checklist with an explicit go/no-go rule. Use when the user says "smoke test checklist", "sanity check for this build", "build verification test"."
version: "1.0.0"
author: "Chaitanya Hasabnis"
license: "MIT"
tags:
  - qa
  - clear
---
```

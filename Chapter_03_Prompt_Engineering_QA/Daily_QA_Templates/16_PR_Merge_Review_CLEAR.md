# 16 · PR Merge / Review (CLEAR)

> Give a QA merge recommendation for a pull request based on explicit merge criteria and CI evidence.

**Framework:** CLEAR (Context · Limits · Examples · Action · Review) — definition: [CLEAR](../Templates/Template_CLEAR.md)
**Usage guide:** [16_PR_Merge_Review_CLEAR_usage_guide.html](16_PR_Merge_Review_CLEAR_usage_guide.html)

| Use when | Skip when |
|----------|-----------|
| A PR is ready for QA sign-off<br>You need a consistent go/no-go for merging | You want line-by-line code feedback (use 14) |

## Inputs you need
- [ ] PR title, description and linked ticket acceptance criteria
- [ ] Changed files list or diff
- [ ] CI results output
- [ ] Review status / open comments

> Tip: for project background, fill the blank context pack [`../00_context-template/`](../00_context-template/) and paste it above the prompt. [`../00_context-vwo/`](../00_context-vwo/) is a filled example.

## Prompt (copy everything inside the block)

```text
## C: Context
Act as the QA reviewer for PR [TITLE / LINK].
Description: [PASTE]
Linked acceptance criteria: [PASTE]
Changed files: [PASTE]
CI results: [PASTE]
Review status: [PASTE]

## L: Limits
1. Base the verdict only on the supplied CI output and diff; never say tests passed unless the CI output shows it.
2. Merge criteria: CI green; tests added or updated for changed behaviour; no secrets; acceptance criteria covered; required approvals present; no unresolved blocking comments.

## E: Examples
Row: CI green | Met | 'Tests: 10 passed, 0 failed' in CI log

## A: Action
Evaluate each criterion (Met / Not met / Unknown) with evidence, map acceptance criteria to tests in the PR, and name risk areas to test before merge.

## R: Review
Verdict: Merge / Merge after fixes / Do not merge, with blocking items and questions for the author.

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
| Criterion | Status (Met / Not met / Unknown) | Evidence |  + AC -> Test map + Verdict
```

## Worked example (VWO login)

**Input (excerpt):** CI: 9 passed, 1 skipped (needs SF credentials); no test changes for the new validation.

**Output (excerpt):**

```text
| Tests added for changed behaviour | Not met | No test files in the diff |
Verdict: Merge after fixes - add a test for the empty-password validation.
```

## Review checklist
- [ ] Every criterion has evidence or 'Unknown'
- [ ] No claimed results beyond CI output
- [ ] Clear verdict and blockers

## Common problems
| Problem | Fix |
|---------|-----|
| 'All tests pass' without CI output | Paste the CI log; otherwise status must be Unknown. |
| Verdict without criteria table | Ask for the table first, then the verdict. |

## Next steps
- Feeds into: -
- Related quick prompts:
- None

## Convert to SKILL.md
Create `skills/pr-review-gate/SKILL.md` with this frontmatter, then paste the Prompt, Output format and Review checklist sections below it as the skill instructions:

```yaml
---
name: "pr-review-gate"
description: "Give a QA merge recommendation for a pull request based on explicit merge criteria and CI evidence. Use when the user says "review this PR", "can we merge this", "QA sign-off for pull request"."
version: "1.0.0"
author: "Chaitanya Hasabnis"
license: "MIT"
tags:
  - qa
  - clear
---
```

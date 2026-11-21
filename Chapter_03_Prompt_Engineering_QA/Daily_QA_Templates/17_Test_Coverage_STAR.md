# 17 · Test Coverage (STAR)

> Measure requirement, execution and (if supplied) code coverage, and recommend tests to close gaps.

**Framework:** STAR (Situation · Task · Action · Result) — definition: [STAR](../Templates/Template_STAR.md)
**Usage guide:** [17_Test_Coverage_STAR_usage_guide.html](17_Test_Coverage_STAR_usage_guide.html)

| Use when | Skip when |
|----------|-----------|
| Before sign-off or a release review<br>To justify where more testing is needed | No requirement or test list exists yet |

## Inputs you need
- [ ] Requirements with IDs
- [ ] Test cases with REQ references and types
- [ ] Optional: execution results
- [ ] Optional: code coverage report

> Tip: paste the context pack from [`../00_context-vwo/`](../00_context-vwo/) above the prompt for project background.

## Prompt (copy everything inside the block)

```text
## S: Situation
Coverage review for [RELEASE / FEATURE].
Requirements: [PASTE]
Test cases: [PASTE]
Execution results: [PASTE or Not supplied]
Code coverage report: [PASTE or Not supplied]

## T: Task
Measure coverage and identify the gaps.

## A: Action
- Requirement coverage = REQs with >= 1 test / total REQs.
- Execution coverage = executed tests / total tests; pass rate = passed / executed.
- Break down by test type (positive / negative / boundary / non-functional) and priority.
- Report code coverage only if a report is supplied.
- List uncovered requirements and weak areas.

## R: Result
Return:
1. Metrics table (metric, formula, value)
2. Coverage by category
3. Uncovered / weak requirements
4. Recommended tests (prioritised)
5. Data limitations

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
| Metric | Formula | Value |  + | REQ ID | Tests | Types Covered | Gap |
```

## Worked example (VWO login)

**Input (excerpt):** 5 requirements; tests reference REQ-01..REQ-04; no execution data.

**Output (excerpt):**

```text
| Requirement coverage | 4 / 5 | 80% |
| Execution coverage | Not supplied | - |
Uncovered: REQ-05 (exact error message) -> add TC for invalid-login message.
```

## Review checklist
- [ ] Formulas shown next to values
- [ ] Unsupplied data marked, not estimated
- [ ] Uncovered requirements listed
- [ ] Recommendations prioritised

## Common problems
| Problem | Fix |
|---------|-----|
| Code coverage % invented | Ask for 'Not supplied' unless a report is pasted. |
| Coverage counts tests, not requirements | Point to the formula in Action. |

## Next steps
- Feeds into: [Requirements Traceability Matrix (RTM)](06_RTM_CLEAR.md), [Regression Testing](09_Regression_Testing_CLEAR.md)
- Related quick prompts:
- [02_PRD_TC_Comprehensive.md](../Reusable_Templates/testing/02_PRD_TC_Comprehensive.md)

## Convert to SKILL.md
Create `skills/coverage-analyzer/SKILL.md` with this frontmatter, then paste the Prompt, Output format and Review checklist sections below it as the skill instructions:

```yaml
---
name: "coverage-analyzer"
description: "Measure requirement, execution and (if supplied) code coverage, and recommend tests to close gaps. Use when the user says "test coverage report", "how much is covered", "coverage gaps"."
version: "1.0.0"
author: "Chaitanya Hasabnis"
license: "MIT"
tags:
  - qa
  - star
---
```

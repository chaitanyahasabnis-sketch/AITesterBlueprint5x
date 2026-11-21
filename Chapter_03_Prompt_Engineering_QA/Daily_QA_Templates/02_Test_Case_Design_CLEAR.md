# 02 · Test Case Design (CLEAR)

> Design traceable, prioritised test cases with hard scope limits and a self-review pass.

**Framework:** CLEAR (Context · Limits · Examples · Action · Review) — definition: [CLEAR](../Templates/Template_CLEAR.md)
**Usage guide:** [02_Test_Case_Design_CLEAR_usage_guide.html](02_Test_Case_Design_CLEAR_usage_guide.html)

| Use when | Skip when |
|----------|-----------|
| Requirements are analysed (ideally with template 01)<br>You need a test case set for one feature | You only need a quick handful of cases (use Reusable_Templates/testing/01)<br>Requirements are still unclear |

## Inputs you need
- [ ] Requirements with IDs
- [ ] Feature name and URL / module
- [ ] Maximum number of test cases
- [ ] Priority scheme (default P0/P1/P2)

> Tip: for project background, fill the blank context pack [`../00_context-template/`](../00_context-template/) and paste it above the prompt. [`../00_context-vwo/`](../00_context-vwo/) is a filled example.

## Prompt (copy everything inside the block)

```text
## C: Context
Act as a Senior QA Engineer. Feature: [FEATURE] at [URL / MODULE].
Requirements:
[PASTE REQUIREMENTS WITH IDs]
Use Equivalence Partitioning, Boundary Value Analysis, Decision Tables and Error Guessing.

## L: Limits
1. Scope is [FEATURE] only.
2. Do not invent validation rules, limits or exact error messages.
3. Every test case references at least one REQ ID.
4. Synthetic test data placeholders only.
5. Priority: P0 (critical) / P1 (high) / P2 (medium-low).
6. At most [N] test cases, no duplicates.

## E: Examples
Format: Test ID | REQ ID | Scenario | Preconditions | Steps | Test Data | Expected Result | Type | Priority | Requirement Status
Example: TC-001 | REQ-01 | [Main success scenario for REQ-01] | [Required state] | 1. [Step] 2. [Step] 3. [Step] | [<placeholder data>] | [Observable expected result] | Positive | P0 | Confirmed

## A: Action
Generate positive, negative and boundary cases, plus UI, accessibility and security cases where the requirements support them.

## R: Review
1. Merge duplicates.
2. Show coverage per REQ ID and list any REQ with no test.
3. Mark P0 smoke candidates and automation candidates.
4. List open questions.

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
| Test ID | REQ ID | Scenario | Preconditions | Steps | Test Data | Expected Result | Type | Priority | Requirement Status |
```

## Worked example (VWO login)

**Input (excerpt):** REQ-03: Email and password are mandatory.

**Output (excerpt):**

```text
| TC-006 | REQ-03 | Submit with empty password | Logged out | 1. Enter email 2. Leave password empty 3. Submit | <registered_test_email> / (blank) | Login not completed; validation text: Requires clarification | Negative | P0 | Requires clarification |
```

## Review checklist
- [ ] Every test traces to a REQ ID
- [ ] Expected results are observable, not 'works correctly'
- [ ] No invented messages or limits
- [ ] Coverage table shows no silent gaps

## Common problems
| Problem | Fix |
|---------|-----|
| Expected result says 'appropriate error shown' | Ask for the observable outcome; unknown text becomes 'Requires clarification'. |
| Too many near-duplicate cases | Lower N and ask for the Review step to merge by equivalence class. |

## Next steps
- Feeds into: [Requirements Traceability Matrix (RTM)](06_RTM_CLEAR.md), [Test Case Execution](04_Test_Case_Execution_STAR.md), [Automation Code Generation](15_Automation_Code_Generation_RICEPOT.md)
- Related quick prompts:
- [CLEAR.md](../CLEAR.md)
- [04_Negative_TC.md](../Reusable_Templates/testing/04_Negative_TC.md)
- [05_Security_TC.md](../Reusable_Templates/testing/05_Security_TC.md)

## Convert to SKILL.md
Create `skills/test-case-designer/SKILL.md` with this frontmatter, then paste the Prompt, Output format and Review checklist sections below it as the skill instructions:

```yaml
---
name: "test-case-designer"
description: "Design traceable, prioritised test cases with hard scope limits and a self-review pass. Use when the user says "write test cases for", "design test cases", "create a test suite for this feature"."
version: "1.0.0"
author: "Chaitanya Hasabnis"
license: "MIT"
tags:
  - qa
  - clear
---
```

# 06 · Requirements Traceability Matrix (RTM) (CLEAR)

> Map requirements to test cases (and results/defects) and expose untested requirements and orphan tests.

**Framework:** CLEAR (Context · Limits · Examples · Action · Review) — definition: [CLEAR](../Templates/Template_CLEAR.md)
**Usage guide:** [06_RTM_CLEAR_usage_guide.html](06_RTM_CLEAR_usage_guide.html)

| Use when | Skip when |
|----------|-----------|
| Test cases exist and need traceability<br>Audit or release sign-off needs an RTM | Requirements have no IDs yet (run 01 first) |

## Inputs you need
- [ ] Requirement list with IDs
- [ ] Test case list with IDs and REQ references
- [ ] Optional: execution status and defect IDs

> Tip: for project background, fill the blank context pack [`../00_context-template/`](../00_context-template/) and paste it above the prompt. [`../00_context-vwo/`](../00_context-vwo/) is a filled example.

## Prompt (copy everything inside the block)

```text
## C: Context
Act as a QA Engineer building an RTM for [RELEASE].
Requirements:
[PASTE REQ IDs + TEXT]
Test cases:
[PASTE TC IDs + TITLES + REQ REFS]
Optional execution results / defects:
[PASTE or Not supplied]

## L: Limits
1. Use only the supplied IDs; never create new ones.
2. Map a test to a requirement only if it references it. If the link is only implied by the title, mark 'Inferred (low confidence)'.
3. Status comes only from execution data; otherwise 'Not executed'.

## E: Examples
Row: REQ-01 | [Requirement text] | TC-001, TC-002 | Positive, Negative | 1 Pass, 1 Fail | [DEFECT ID] | Partially verified

## A: Action
Build forward traceability (REQ -> tests) and backward traceability (test -> REQ), with a status roll-up per requirement.

## R: Review
1. List requirements with zero tests.
2. List orphan tests (no REQ).
3. Flag requirements covered only by positive or only by negative tests.
4. Requirement coverage % = REQs with >= 1 test / total REQs.
5. List inferred mappings to confirm.

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
| REQ ID | Requirement | Test Case IDs | Test Types | Execution Status | Defects | Verification Status |
```

## Worked example (VWO login)

**Input (excerpt):** REQ-04 Successful login opens dashboard; TC-002 refs REQ-04; no execution data.

**Output (excerpt):**

```text
| REQ-04 | Successful login opens dashboard | TC-002 | Positive | Not executed | - | Not verified |
```

## Review checklist
- [ ] No invented IDs
- [ ] Zero-test requirements are listed
- [ ] Coverage % shows its formula
- [ ] Inferred links are labelled

## Common problems
| Problem | Fix |
|---------|-----|
| Model maps tests by guessing | Remind it of Limit 2 and ask for the inferred list. |
| Statuses filled without execution data | Ask it to show 'Not executed' where no data was given. |

## Next steps
- Feeds into: [Test Coverage](17_Test_Coverage_STAR.md), [Test Case Design](02_Test_Case_Design_CLEAR.md)
- Related quick prompts:
- [02_PRD_TC_Comprehensive.md](../Reusable_Templates/testing/02_PRD_TC_Comprehensive.md)

## Convert to SKILL.md
Create `skills/rtm-builder/SKILL.md` with this frontmatter, then paste the Prompt, Output format and Review checklist sections below it as the skill instructions:

```yaml
---
name: "rtm-builder"
description: "Map requirements to test cases (and results/defects) and expose untested requirements and orphan tests. Use when the user says "build an RTM", "traceability matrix", "map requirements to test cases"."
version: "1.0.0"
author: "Chaitanya Hasabnis"
license: "MIT"
tags:
  - qa
  - clear
---
```

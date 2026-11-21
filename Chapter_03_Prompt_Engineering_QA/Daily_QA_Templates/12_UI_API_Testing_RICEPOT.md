# 12 · UI and API Testing (RICE-POT)

> Design tests for the same feature at UI and API level, including UI-to-API consistency checks.

**Framework:** RICE-POT (Role · Instructions · Context · Example · Parameters · Output · Tone) — definition: [RICE-POT](../../Chapter_02_Prompt_Engineering/Template_RICE_POT/Template.RICEPPOT.md)
**Usage guide:** [12_UI_API_Testing_RICEPOT_usage_guide.html](12_UI_API_Testing_RICEPOT_usage_guide.html)

| Use when | Skip when |
|----------|-----------|
| A feature has both a screen and an API<br>You want to push checks down to the API layer | Only API documentation exists (use Reusable_Templates/api/*) |

## Inputs you need
- [ ] Feature and page URL
- [ ] API documentation (endpoints, schemas, status codes)
- [ ] UI description or screenshots
- [ ] Scope: UI only / API only / both

> Tip: for project background, fill the blank context pack [`../00_context-template/`](../00_context-template/) and paste it above the prompt. [`../00_context-vwo/`](../00_context-vwo/) is a filled example.

## Prompt (copy everything inside the block)

```text
## R: Role
You are a Senior QA Engineer experienced in web UI and REST API testing.

## I: Instructions
Design tests for [FEATURE] at the UI layer ([PAGE]) and the API layer ([ENDPOINTS]).
Check validations at both layers and that the UI shows what the API returns.
Do not invent endpoints, fields, status codes or UI elements.

## C: Context
UI: [URL + DESCRIPTION / SCREENSHOT NOTES]
API documentation:
[PASTE]

## E: Example
UI: UI-01 | [Main user action on PAGE] | [Observable UI result] | P0
API: API-01 | [METHOD] [ENDPOINT] with valid body | [DOCUMENTED SUCCESS STATUS] + [key response field] present | P0

## P: Parameters
- Scope: [UI / API / both].
- At most [N] tests per layer.
- Auth via placeholders (<valid_token>).
- Priority P0/P1/P2.

## O: Output
Section A - UI tests table
Section B - API tests table
Section C - UI <-> API consistency checks
Section D - Open questions

## T: Tone
Precise and technical.

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
UI: | ID | Scenario | Steps | Expected | Priority |
API: | ID | Method + Endpoint | Request | Expected Status | Key Assertions | Priority |
```

## Worked example (VWO login)

**Input (excerpt):** Login page + login endpoint documented with success and 401 responses.

**Output (excerpt):**

```text
| API-03 | POST [login] wrong password | {email, password: <wrong>} | 401 (documented) | error body has no stack trace | P0 |
Consistency: UI shows the same failure message the API returns -> text: Requires clarification
```

## Review checklist
- [ ] No undocumented endpoints or codes
- [ ] Each layer has its own table
- [ ] Consistency checks exist
- [ ] Auth uses placeholders

## Common problems
| Problem | Fix |
|---------|-----|
| Status codes guessed | Ask it to cite the documentation for each code. |
| UI and API tests duplicate each other | Ask for checks to be pushed to the lowest layer that can catch the bug. |

## Next steps
- Feeds into: [Automation Code Generation](15_Automation_Code_Generation_RICEPOT.md), [Requirements Traceability Matrix (RTM)](06_RTM_CLEAR.md)
- Related quick prompts:
- [03_API_TC_Gen.md](../Reusable_Templates/testing/03_API_TC_Gen.md)
- [02_API_Validation.md](../Reusable_Templates/api/02_API_Validation.md)

## Convert to SKILL.md
Create `skills/ui-api-test-designer/SKILL.md` with this frontmatter, then paste the Prompt, Output format and Review checklist sections below it as the skill instructions:

```yaml
---
name: "ui-api-test-designer"
description: "Design tests for the same feature at UI and API level, including UI-to-API consistency checks. Use when the user says "UI and API tests", "test this endpoint and screen", "api test cases"."
version: "1.0.0"
author: "Chaitanya Hasabnis"
license: "MIT"
tags:
  - qa
  - rice-pot
---
```

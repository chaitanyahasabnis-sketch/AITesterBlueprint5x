# 01 · Requirement Analysis (STAR)

> Check requirements for testability and surface gaps before any test design starts.

**Framework:** STAR (Situation · Task · Action · Result) — definition: [STAR](../Templates/Template_STAR.md)
**Usage guide:** [01_Requirement_Analysis_STAR_usage_guide.html](01_Requirement_Analysis_STAR_usage_guide.html)

| Use when | Skip when |
|----------|-----------|
| A new PRD, user story or Jira ticket arrives<br>Before writing test cases or a test plan<br>You need questions for the Product Owner | Requirements are already reviewed and signed off<br>You only need test cases (use 02) |

## Inputs you need
- [ ] The requirement text (PRD section, user story or ticket body)
- [ ] Feature / module name
- [ ] Optional: a filled context pack (from 00_context-template/)

> Tip: for project background, fill the blank context pack [`../00_context-template/`](../00_context-template/) and paste it above the prompt. [`../00_context-vwo/`](../00_context-vwo/) is a filled example.

## Prompt (copy everything inside the block)

```text
## S: Situation
I am a QA engineer on [PROJECT]. I received [PRD / user story / Jira key] for [FEATURE].
Requirements:
[PASTE REQUIREMENTS]

## T: Task
Analyse these requirements for testability before test design begins.

## A: Action
- Number each requirement REQ-01, REQ-02, ... and classify it Functional or Non-functional.
- Check each one: clear, complete, testable, consistent, has acceptance criteria.
- Quote the exact wording of anything ambiguous.
- List what is missing: error states, boundaries, roles/permissions, non-functional targets, test data.
- Write one question per gap, addressed to the role that can answer it (PO / Dev / UX).

## R: Result
Return:
1. Requirement table
2. Ambiguities (quoted)
3. Missing information
4. Questions for the author (numbered)
5. Risks for testing
6. Summary: total requirements, testable, partly testable, not testable

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
| REQ ID | Requirement | Type | Testable (Yes / Partly / No) | Issue |
```

## Worked example (VWO login)

**Input (excerpt):** PRD (VWO login): "Password Requirements: Enforced security standards for password complexity."

**Output (excerpt):**

```text
| REQ-07 | Password complexity is enforced | Functional | Partly | Rules not stated: minimum length? character classes? |
Q-03 (PO): What are the exact password complexity rules?
```

## Review checklist
- [ ] Every requirement has an ID and a testability verdict
- [ ] Ambiguities quote the source wording
- [ ] No password rules, limits or messages were invented
- [ ] Each question is specific and has an owner

## Common problems
| Problem | Fix |
|---------|-----|
| The model fills in 'typical' rules (e.g. 8 characters) | Re-send the guardrails and ask it to replace invented values with 'Requires clarification'. |
| Questions are vague ('clarify password') | Ask for one question per gap, phrased so it can be answered in one line. |

## Next steps
- Feeds into: [Test Case Design](02_Test_Case_Design_CLEAR.md), [Requirements Traceability Matrix (RTM)](06_RTM_CLEAR.md), [Gap Analysis](11_Gap_Analysis_STAR.md)
- Related quick prompts:
- [02_PRD_TC_Comprehensive.md](../Reusable_Templates/testing/02_PRD_TC_Comprehensive.md)

## Convert to SKILL.md
Create `skills/requirement-analyzer/SKILL.md` with this frontmatter, then paste the Prompt, Output format and Review checklist sections below it as the skill instructions:

```yaml
---
name: "requirement-analyzer"
description: "Check requirements for testability and surface gaps before any test design starts. Use when the user says "analyse these requirements", "is this user story testable", "review this PRD for gaps"."
version: "1.0.0"
author: "Chaitanya Hasabnis"
license: "MIT"
tags:
  - qa
  - star
---
```

# 14 · Code Review (Test Automation) (CLEAR)

> Review automation code against a clear checklist with line-referenced, severity-rated findings.

**Framework:** CLEAR (Context · Limits · Examples · Action · Review) — definition: [CLEAR](../Templates/Template_CLEAR.md)
**Usage guide:** [14_Code_Review_CLEAR_usage_guide.html](14_Code_Review_CLEAR_usage_guide.html)

| Use when | Skip when |
|----------|-----------|
| Reviewing test automation code or a diff<br>Self-review before raising a PR | You need a merge decision for a whole PR (use 16) |

## Inputs you need
- [ ] Code or diff
- [ ] Language and framework
- [ ] Team conventions (or point to the framework guide)

> Tip: paste the context pack from [`../00_context-vwo/`](../00_context-vwo/) above the prompt for project background.

## Prompt (copy everything inside the block)

```text
## C: Context
Act as a Senior SDET reviewing [LANGUAGE / FRAMEWORK] test code.
Conventions: [PASTE or e.g. Chapter_02_Prompt_Engineering/PlaywrightFramework/FRAMEWORK_GUIDE.md]
Code:
[PASTE CODE OR DIFF]

## L: Limits
1. Review only the supplied code; cite file and line.
2. Severity: Blocker / Major / Minor / Nit.
3. If something is not visible in the code, raise it as a Question, not a bug.
4. Suggest small fixes; do not rewrite whole files.

## E: Examples
Row: LoginPage.java:25 | Minor | Locator | XPath used for an element with an id | Prefer By.id("username") / @FindBy(id = "username")

## A: Action
Check: assertion correctness, locator strategy, waits (no hard sleeps), test independence and cleanup, hard-coded secrets or URLs, naming, duplication / page-object use, error handling, logging, flakiness risk.

## R: Review
1. Remove duplicate findings.
2. Every finding has a line reference.
3. Verdict: Approve / Request changes, with the top 3 items.

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
| File:Line | Severity | Category | Finding | Suggested Fix |  + Verdict
```

## Worked example (VWO login)

**Input (excerpt):** @FindBy(xpath = "//input[@id='username']") in LoginPage.java

**Output (excerpt):**

```text
| LoginPage.java:25 | Minor | Locator | XPath wraps a plain id lookup | Use @FindBy(id = "username") |
```

## Review checklist
- [ ] All findings cite lines
- [ ] Severities are justified
- [ ] Speculation is marked as Question
- [ ] Clear verdict

## Common problems
| Problem | Fix |
|---------|-----|
| Findings about code not shown | Repeat Limit 3. |
| Style nits dominate | Ask it to list Blocker/Major first and cap Nits. |

## Next steps
- Feeds into: [PR Merge / Review](16_PR_Merge_Review_CLEAR.md)
- Related quick prompts:
- [FRAMEWORK_GUIDE.md](../../Chapter_02_Prompt_Engineering/PlaywrightFramework/FRAMEWORK_GUIDE.md)

## Convert to SKILL.md
Create `skills/test-code-reviewer/SKILL.md` with this frontmatter, then paste the Prompt, Output format and Review checklist sections below it as the skill instructions:

```yaml
---
name: "test-code-reviewer"
description: "Review automation code against a clear checklist with line-referenced, severity-rated findings. Use when the user says "review this test code", "code review my automation", "check this Selenium/Playwright code"."
version: "1.0.0"
author: "Chaitanya Hasabnis"
license: "MIT"
tags:
  - qa
  - clear
---
```

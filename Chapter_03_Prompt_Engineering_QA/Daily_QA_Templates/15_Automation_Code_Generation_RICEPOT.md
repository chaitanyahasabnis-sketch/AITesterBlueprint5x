# 15 · Automation Code Generation (RICE-POT)

> Generate automation code for supplied test cases that follows the existing framework's conventions.

**Framework:** RICE-POT (Role · Instructions · Context · Example · Parameters · Output · Tone) — definition: [RICE-POT](../../Chapter_02_Prompt_Engineering/Template_RICE_POT/Template.RICEPPOT.md)
**Usage guide:** [15_Automation_Code_Generation_RICEPOT_usage_guide.html](15_Automation_Code_Generation_RICEPOT_usage_guide.html)

| Use when | Skip when |
|----------|-----------|
| Test cases are approved and selected for automation<br>Adding tests to the Playwright or Selenium framework | Locators or page structure are unknown and cannot be supplied |

## Inputs you need
- [ ] Test cases to automate
- [ ] Framework structure / conventions
- [ ] Locators or HTML snippets
- [ ] Target language and test runner

> Tip: for project background, fill the blank context pack [`../00_context-template/`](../00_context-template/) and paste it above the prompt. [`../00_context-vwo/`](../00_context-vwo/) is a filled example.

## Prompt (copy everything inside the block)

```text
## R: Role
You are a Senior SDET working in [Playwright + TypeScript / Selenium + Java + TestNG].

## I: Instructions
Automate the supplied test cases following the existing framework: page objects, fixtures, test data kept separate, no hard waits, web-first assertions, secrets from environment variables, one test per TC ID with the ID in the title.
If a locator is not supplied, leave a clear TODO; do not guess.

## C: Context
Framework structure / conventions:
[PASTE FOLDER TREE / FRAMEWORK GUIDE]
Test cases:
[PASTE]
Locators / HTML:
[PASTE]

## E: Example
[PASTE ONE EXISTING TEST FROM YOUR FRAMEWORK]
The generated tests must copy its structure: imports, fixtures / page objects, naming, assertion style.

## P: Parameters
- Language: [TS / Java].
- Files to create or modify: [LIST].
- At most [N] files.
- Credentials only via env vars.

## O: Output
1. One code block per file, with its path as a heading
2. The command to run the tests
3. Assumptions and TODOs

## T: Tone
Production-quality code; comments only where the intent is not obvious.

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
### path/to/File.ts
```ts
...
```
Run: npx playwright test ...
Assumptions / TODO: ...
```

## Worked example (VWO login)

**Input (excerpt):** TC-006 Submit with empty password (expected: not logged in).

**Output (excerpt):**

```text
test('TC-006 empty password does not log in', async ({ loginPage }) => {
  await loginPage.fill(env.email, '');
  await loginPage.submit();
  await expect(loginPage.page).not.toHaveURL(/dashboard/);
  // TODO: assert validation text once confirmed (Requires clarification)
});
```

## Review checklist
- [ ] Follows existing page objects and fixtures
- [ ] No hard-coded credentials
- [ ] No guessed locators
- [ ] Run command provided and works

## Common problems
| Problem | Fix |
|---------|-----|
| New framework patterns invented | Paste the framework guide and ask it to reuse existing classes. |
| Fixed sleeps added | Ask for web-first assertions / explicit waits only. |

## Next steps
- Feeds into: [Code Review (Test Automation)](14_Code_Review_CLEAR.md), [PR Merge / Review](16_PR_Merge_Review_CLEAR.md)
- Related quick prompts:
- [REAL_RICE_POT_PW.md](../../Chapter_02_Prompt_Engineering/REAL_RICE_POT_PW.md)
- [REALPROMPT_RICE_POT.md](../../Chapter_02_Prompt_Engineering/REALPROMPT_RICE_POT.md)

## Convert to SKILL.md
Create `skills/automation-code-generator/SKILL.md` with this frontmatter, then paste the Prompt, Output format and Review checklist sections below it as the skill instructions:

```yaml
---
name: "automation-code-generator"
description: "Generate automation code for supplied test cases that follows the existing framework's conventions. Use when the user says "automate these test cases", "generate Playwright tests", "write Selenium code for"."
version: "1.0.0"
author: "Chaitanya Hasabnis"
license: "MIT"
tags:
  - qa
  - rice-pot
---
```

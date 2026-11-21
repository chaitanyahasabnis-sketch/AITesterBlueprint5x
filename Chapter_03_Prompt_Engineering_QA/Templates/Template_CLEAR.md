# CLEAR Prompt Framework

**Best for:** test case design, where you need hard limits on scope and a self-review pass at the end.

| Letter | Stands for | What to write |
|--------|------------|---------------|
| **C** | Context | Role, application/URL, objective, and the test design techniques to use. |
| **L** | Limits | Numbered hard rules: scope boundaries, what not to invent, data rules, priority scheme. |
| **E** | Examples | The exact test case format plus one fully filled example. |
| **A** | Action | The coverage list: categories and the scenarios inside each. |
| **R** | Review | The checks the AI must run on its own output (duplicates, coverage, open questions). |

## When to use CLEAR
- You want many test cases in a consistent format.
- You need the model to police itself (dedupe, coverage matrix, flag gaps) before handing over.

## Fill-in template

```markdown
## C: Context
Act as a [role]. Application: [URL]. Objective: design test cases for [feature/fields].
Use [EP / BVA / Decision Tables / Error Guessing].

## L: Limits
1. Restrict scope to [feature].
2. Do not invent validation rules or exact error messages.
3. Use only synthetic test data.
4. Prioritise as P0 / P1 / P2.

## E: Examples
Format: Test Case ID | Scenario | Preconditions | Steps | Test Data | Expected Result | Type | Priority | Requirement Status
Example: [one complete test case]

## A: Action
Generate test cases covering:
1. [Category] - [scenarios]
2. [Category] - [scenarios]

## R: Review
1. Merge duplicates.
2. Confirm positive / negative / boundary coverage.
3. List requirements needing clarification.
4. Give a coverage summary by category and priority.
```

## Example (short)

> **C:** Senior QA, search box on a demo shop, use EP and BVA.
> **L:** Search field only; don't invent the max length; P0–P2.
> **E:** `TC-001 | Search with a valid keyword | … | P0`
> **A:** Valid keyword, empty input, special characters, very long input.
> **R:** Dedupe, coverage table, open questions.

Worked example in this repo: [`../CLEAR.md`](../CLEAR.md).

# CRISP Prompt Framework

**Best for:** bug reports and other short, factual write-ups that a developer must be able to act on.

| Letter | Stands for | What to write |
|--------|------------|---------------|
| **C** | Context | The observed facts: requirement, starting state, action, observation, reproducibility, and what is *not* supplied. |
| **R** | Role | Who the AI should write as (e.g. senior QA engineer). |
| **I** | Instructions | The sections the output must contain and the rules (don't invent text, separate observed from assumed). |
| **S** | Style | Tone and audience (concise, factual, numbered steps, for a developer who hasn't seen it). |
| **P** | Parameters | Hard output constraints: count, word limit, placeholders, labels for missing data. |

## When to use CRISP
- You have raw observations and need a reproducible, developer-ready report.
- You want missing data called out ("Not supplied") instead of filled in by the model.

## Fill-in template

```markdown
## C: Context
At [URL] I observed:
- Requirement: [requirement]
- Starting state: [state]
- Action: [steps taken]
- Observation: [what happened]
- Reproducibility: [x of y attempts]
- Environment details: [values or "Not supplied"]
- Attachments: [list or "Not supplied"]

## R: Role
Act as a [role] writing a clear, reproducible bug report.

## I: Instructions
Create a bug report with: Title, Environment, Preconditions, Test Data, Steps to Reproduce,
Expected Result, Actual Result, Reproducibility, Suggested Severity (provisional), Attachments.
Do not invent exact messages. Separate observed behaviour from assumptions.

## S: Style
Concise, factual, numbered steps, written for a developer who has not seen the issue.

## P: Parameters
- One report, under [N] words.
- Placeholders for account details.
- Missing details marked "Not supplied".
```

## Example (short)

> **C:** On a demo shop, adding the same item twice shows quantity 1 (3/3 attempts). Browser: not supplied.
> **R:** Senior QA engineer.
> **I:** Standard 10 sections; severity provisional.
> **S:** Factual, numbered steps.
> **P:** One report, under 300 words.

Worked example in this repo: [`../CRISP.md`](../CRISP.md).

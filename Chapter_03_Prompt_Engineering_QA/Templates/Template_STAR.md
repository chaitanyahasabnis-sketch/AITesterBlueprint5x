# STAR Prompt Framework

**Best for:** test plans, test strategies, and any QA deliverable that needs a clear goal and a defined result shape.

| Letter | Stands for | What to write |
|--------|------------|---------------|
| **S** | Situation | Who you are, the application/URL, and the approved requirements (numbered). |
| **T** | Task | The single deliverable you want, and the template it must follow. |
| **A** | Action | The steps or coverage the AI must apply, plus the guardrails (what not to invent). |
| **R** | Result | The exact sections, format and tone of the output. |

## When to use STAR
- You have a short, fixed list of requirements and want a structured document.
- You want the output to follow a known template (e.g. `../Template.md`).

## Fill-in template

```markdown
## S: Situation
I am a [role] preparing to test [feature] at [URL]. The approved requirements are:
1. [REQ-01]
2. [REQ-02]

## T: Task
Create a [deliverable] for [module] using the template at [path].

## A: Action
- Cover [flows / scenario types].
- Include positive, negative and boundary scenarios where the requirements support them.
- Mark unspecified behaviour as "Requires clarification". Do not invent [rules / messages / timeouts].

## R: Result
Return a [deliverable] containing: [section list].
Use tables where useful. Label proposed criteria as recommendations.
```

## Example (short)

> **S:** I am a QA engineer testing the checkout page of a demo shop. Requirement: a cart total of 0 cannot be checked out.
> **T:** Create a functional test plan for checkout using `Template.md`.
> **A:** Cover empty cart, single item and multiple items. Do not invent payment rules.
> **R:** Return Objective, Scope, Scenarios, Entry/Exit Criteria and Risks as tables.

Worked example in this repo: [`../STAR.md`](../STAR.md).

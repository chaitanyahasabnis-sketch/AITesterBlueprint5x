---
name: "advance-testplan-creator"
description: Turn a JIRA ticket into a review-ready test plan. Use when a tester or QA lead says "write a test plan for JIRA-1234", "plan testing for this story", "what should we test here", or pastes an acceptance-criteria / user-story ticket. Fetches the ticket, analyzes it for gaps and ambiguities, fills the standard test-plan template, and stops for human review before anything is treated as final.
license: MIT
metadata:
  author: Chaitanya Hasabnis
  stlc-phase: Test Planning
  version: 1.0.0
  tag: ["testplan"]
---

# Test Plan Generator
You produce a **test plan a human still has to approve** — never a "done" artifact.

# Core Principle
Your job is analysis + drafting + surfacing what is missing, not silent completion.

## When to use
- A JIRA key or story text is provided and someone wants testing planned.
- Someone asks "what are the risks / edge cases / gaps in this ticket".
- If somebody says, "Create a test plan for this Jira ticket" 
- Somebody says, "Test plan for this ticket" 
- Test plan for this.

## Workflow (follow in order)

### 1. Fetch the ticket
- If a JIRA key is given (e.g. `KAN-4`), fetch it by running `python scripts/fetch-jira.py KAN-4` (works on any OS, no extra installs). `scripts/fetch-jira.sh KAN-4` is an alternative where `curl` and `jq` are available.
- Both scripts need `JIRA_BASE_URL`, `JIRA_EMAIL` and `JIRA_API_TOKEN`, set in the shell or in a `.env` file (copy `.env.example` from this skill folder).
- If the fetch does not work, show the error and ask the user to paste the ticket body — **do not invent ticket content.**
- Capture: summary, description, acceptance criteria, components, linked issues, attachments, and the fix version / sprint.

### 2. Analyze the Ticket for acceptance criteria
Run the ticket through `references/requirement-checklist.md`. For every item, mark
✅ present / ⚠️ ambiguous / ❌ missing. Explicitly list:
- Missing or vague acceptance criteria
- Undefined edge cases, error states, empty/limit/boundary conditions
- Unstated non-functional needs (perf, security, a11y, i18n, permissions/roles)
- Missing test data, environments, or dependencies
- Ambiguous wording that two engineers could read two ways

### 3. Find the missing pieces and gaps
If you found some gaps, Output this as a **"Gaps & Questions for the author"** section. This is the most valuable part — a tester's leverage is asking the question before the bug ships.

### 4. Draft the test plan
Fill `references/test-plan-template.md` completely. Drive test scenarios from the acceptance criteria and the gaps you found. Cover positive, negative, boundary, and cross-role/permission paths. Tag each scenario P0/P1/P2 by risk and also use the `misc/mycompanydetails.md` as reference.

### 5. STOP for human review (mandatory)
End with a **Human Review Gate**:
- Summarize what you assumed and what you could not confirm.
- List the open questions from step 2 that block sign-off.
- Ask the tester to confirm/edit before the plan is considered approved.
- Do **not** proceed to write test cases or automation until a human approves.

## Output shape
``` markdown
## Test Plan — <JIRA-KEY>: <title>
1. Scope & Objectives
2. Gaps & Questions for the author <-- surface missing pieces here
3. Test Scenarios (P0/P1/P2)
4. Test Data & Environment
5. Risks & Assumptions
6. Entry / Exit criteria
--- HUMAN REVIEW GATE ---
Assumptions made / Open questions / "Approve or edit before I continue"
Also add the company info and the logo from `misc/company.png` to the output.
```
## Guardrails and Security
- Never mark the plan "final" — a human owns sign-off.
- Never fabricate acceptance criteria; a missing AC is a finding, not a blank to fill.
- Keep scenarios traceable: each maps to an AC or a gap.

## References
- `references/requirement-checklist.md` — the gap-analysis checklist
- `references/test-plan-template.md` — the plan template to fill
- `scripts/fetch-jira.py` — pull a ticket over the JIRA REST API (standard-library Python)
- `scripts/fetch-jira.sh` — same, using curl + jq
- `.env.example` — template for the Jira credentials


## Anti Hallucination Rules
- Never assume anything. If you have any doubt or anything, you ask the user. 
- Always create a test plan from the ticket which is given, and ask for any clarification. 
- Do not invent anything.

## When not to use
Do not use it whenever no proper JIRA ticket has been given, or somebody has not even mentioned a test plan or something. 

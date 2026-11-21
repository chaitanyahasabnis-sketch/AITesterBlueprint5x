# Testing 06 · Regression Suite Selection

**Use when:** a change is coming and you need to choose which existing tests to rerun.

```text
ROLE: You are a QA Lead planning a regression cycle.

TASK:
1. Read the change description and the existing test case list.
2. Place tests into: Smoke (must run), Impacted (directly affected), Extended (nice to run).
3. Flag areas touched by the change that have no existing test.

CONSTRAINTS (always)
- Use ONLY the requirements / input pasted below.
- Do NOT invent features, error messages, limits, codes or behaviour.
- If information is missing, write "Requires clarification".
- Label any inferred detail "Inference (low confidence)".
- Synthetic data and placeholders only (e.g. <registered_test_email>). No real credentials or personal data.
- Select only from the supplied test IDs. Put suggestions for new tests in a separate list.

FORMAT:
| Test ID | Title | Suite (Smoke/Impacted/Extended) | Reason | Automated (Y/N) |
Then: coverage gaps (bullets) and a suggested execution order.

INPUT:
Change description: [PASTE]
Existing test cases: [PASTE TABLE OR FILE PATH]
```

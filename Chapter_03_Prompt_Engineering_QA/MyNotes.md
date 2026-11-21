# Chapter 03 · Prompt Run Log

Which prompt produced which output. Add a row each time you run a prompt.

| Date | Prompt file | Framework | Output | Notes |
|------|-------------|-----------|--------|-------|
| [Requires clarification] | `CLEAR.md` | CLEAR | `output/VWO_Login_Test_Cases.docx`, `output/VWO_Login_Test_Cases.xlsx` | Email + password test cases with P0/P1/P2 priority |
| [Requires clarification] | `CRISP.md` | CRISP | `output/VWO_Login_Bug_Report.docx` | Hypothetical training bug: empty password submits without validation |
| 2026-11-21 | `STAR.md` + `Template.md` | STAR | `output/VWO_Login_Functional_Test_Plan.docx` | 5 supplied requirements → 11 scenarios; 6 open questions logged |

## How to run a prompt

```
@Chapter_03_Prompt_Engineering_QA/STAR.md use this prompt and give me the
output in docx in the Chapter_03_Prompt_Engineering_QA/output folder
```

For a new feature, combine:
1. The context pack: `00_context-vwo/01` → `04` (edit placeholders first).
2. A framework (`Templates/Template_STAR.md`, `_CLEAR.md`, `_CRISP.md`) or a ready template from `Reusable_Templates/`.
3. `Reusable_Templates/bugs/06_Anti_Hallucination_Reminder.md` as a final guardrail.

# Daily QA Templates

17 prompt templates for everyday QA work, each built on one prompt framework and each paired with an HTML usage guide.
Every template has the same sections, so it can be turned into a `SKILL.md` later without restructuring.

**Frameworks used:** STAR: 4 · CLEAR: 6 · CRISP: 5 · RICE-POT: 2

| # | Task | Framework | Template | Usage guide | Future skill name |
|---|------|-----------|----------|-------------|-------------------|
| 01 | Requirement Analysis | STAR | [01_Requirement_Analysis_STAR.md](01_Requirement_Analysis_STAR.md) | [guide](01_Requirement_Analysis_STAR_usage_guide.html) | `requirement-analyzer` |
| 02 | Test Case Design | CLEAR | [02_Test_Case_Design_CLEAR.md](02_Test_Case_Design_CLEAR.md) | [guide](02_Test_Case_Design_CLEAR_usage_guide.html) | `test-case-designer` |
| 03 | Bug Report | CRISP | [03_Bug_Report_CRISP.md](03_Bug_Report_CRISP.md) | [guide](03_Bug_Report_CRISP_usage_guide.html) | `bug-report-writer` |
| 04 | Test Case Execution | STAR | [04_Test_Case_Execution_STAR.md](04_Test_Case_Execution_STAR.md) | [guide](04_Test_Case_Execution_STAR_usage_guide.html) | `test-execution-logger` |
| 05 | Defect Tracking | CRISP | [05_Defect_Tracking_CRISP.md](05_Defect_Tracking_CRISP.md) | [guide](05_Defect_Tracking_CRISP_usage_guide.html) | `defect-tracker` |
| 06 | Requirements Traceability Matrix (RTM) | CLEAR | [06_RTM_CLEAR.md](06_RTM_CLEAR.md) | [guide](06_RTM_CLEAR_usage_guide.html) | `rtm-builder` |
| 07 | Smoke and Sanity Testing | CLEAR | [07_Smoke_Sanity_Testing_CLEAR.md](07_Smoke_Sanity_Testing_CLEAR.md) | [guide](07_Smoke_Sanity_Testing_CLEAR_usage_guide.html) | `smoke-sanity-planner` |
| 08 | Bug Triaging | CRISP | [08_Bug_Triaging_CRISP.md](08_Bug_Triaging_CRISP.md) | [guide](08_Bug_Triaging_CRISP_usage_guide.html) | `bug-triage-assistant` |
| 09 | Regression Testing | CLEAR | [09_Regression_Testing_CLEAR.md](09_Regression_Testing_CLEAR.md) | [guide](09_Regression_Testing_CLEAR_usage_guide.html) | `regression-planner` |
| 10 | Daily Scrum Notes | CRISP | [10_Daily_Scrum_Notes_CRISP.md](10_Daily_Scrum_Notes_CRISP.md) | [guide](10_Daily_Scrum_Notes_CRISP_usage_guide.html) | `scrum-notes-writer` |
| 11 | Gap Analysis | STAR | [11_Gap_Analysis_STAR.md](11_Gap_Analysis_STAR.md) | [guide](11_Gap_Analysis_STAR_usage_guide.html) | `gap-analyzer` |
| 12 | UI and API Testing | RICE-POT | [12_UI_API_Testing_RICEPOT.md](12_UI_API_Testing_RICEPOT.md) | [guide](12_UI_API_Testing_RICEPOT_usage_guide.html) | `ui-api-test-designer` |
| 13 | Status Report | CRISP | [13_Status_Report_CRISP.md](13_Status_Report_CRISP.md) | [guide](13_Status_Report_CRISP_usage_guide.html) | `qa-status-reporter` |
| 14 | Code Review (Test Automation) | CLEAR | [14_Code_Review_CLEAR.md](14_Code_Review_CLEAR.md) | [guide](14_Code_Review_CLEAR_usage_guide.html) | `test-code-reviewer` |
| 15 | Automation Code Generation | RICE-POT | [15_Automation_Code_Generation_RICEPOT.md](15_Automation_Code_Generation_RICEPOT.md) | [guide](15_Automation_Code_Generation_RICEPOT_usage_guide.html) | `automation-code-generator` |
| 16 | PR Merge / Review | CLEAR | [16_PR_Merge_Review_CLEAR.md](16_PR_Merge_Review_CLEAR.md) | [guide](16_PR_Merge_Review_CLEAR_usage_guide.html) | `pr-review-gate` |
| 17 | Test Coverage | STAR | [17_Test_Coverage_STAR.md](17_Test_Coverage_STAR.md) | [guide](17_Test_Coverage_STAR_usage_guide.html) | `coverage-analyzer` |

## Why each framework
| Framework | Shape | Best for |
|-----------|-------|----------|
| STAR | Situation · Task · Action · Result | Analysis with a defined result (requirements, execution, gaps, coverage) |
| CLEAR | Context · Limits · Examples · Action · Review | Design work that needs hard limits and a self-review (test design, RTM, regression, reviews) |
| CRISP | Context · Role · Instructions · Style · Parameters | Short factual write-ups for a reader (bugs, triage, scrum notes, status) |
| RICE-POT | Role · Instructions · Context · Example · Parameters · Output · Tone | Rich generation needing examples and strict output (UI/API tests, automation code) |

## Typical daily flow
`01 Requirement Analysis` → `02 Test Case Design` → `06 RTM` → `07 Smoke/Sanity` → `04 Execution` → `03 Bug Report` → `08 Triage` → `05 Defect Tracking` → `09 Regression` → `17 Coverage` → `13 Status Report`, with `10 Scrum Notes` every day and `14`/`15`/`16` for automation work.

## How these relate to `../Reusable_Templates/`
- `Reusable_Templates/` = short, single-purpose prompts for quick one-off use.
- `Daily_QA_Templates/` = full framework-based templates with inputs, examples, review checklists and skill frontmatter.

## Every template contains
1. Purpose, use when / skip when
2. Inputs checklist
3. The framework prompt with `[PLACEHOLDERS]` and a shared GUARDRAILS block
4. Expected output format
5. Worked example (VWO login)
6. Review checklist and common problems
7. Next steps and related prompts
8. SKILL.md frontmatter ready to copy

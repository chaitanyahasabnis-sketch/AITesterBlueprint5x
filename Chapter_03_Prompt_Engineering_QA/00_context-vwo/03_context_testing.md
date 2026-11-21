# 03 · Testing Context

> How testing for this project is set up. Fill the placeholders for your team.

## Test Types in Scope
- Functional (positive, negative, boundary)
- Security (HTTPS, generic error messages, rate limiting, from PRD)
- Accessibility (WCAG 2.1 AA, keyboard navigation, screen reader, from PRD)
- Performance (login page loads within 2 seconds, from PRD)
- Responsive / mobile layout (from PRD)

## Test Design Techniques
- Equivalence Partitioning, Boundary Value Analysis, Decision Tables, Error Guessing

## Priority Scheme
| Priority | Meaning |
|----------|---------|
| P0 | Blocks login or exposes security risk; smoke candidate |
| P1 | Major functional / UX impact |
| P2 | Minor / cosmetic |

## Tools
- **Automation:** Playwright + TypeScript (`Chapter_02_Prompt_Engineering/PlaywrightFramework`), Selenium + Java
- **Reporting:** Allure
- **Test management:** [Requires clarification]
- **Defect tracking:** Jira

## Test Data Rules
- Synthetic data only. Use placeholders such as `<registered_test_email>` and `<valid_password>`.
- Never paste real credentials into prompts or outputs.

## Output Formats
- Test cases: Markdown table → XLSX / DOCX
- Test plans and bug reports: DOCX

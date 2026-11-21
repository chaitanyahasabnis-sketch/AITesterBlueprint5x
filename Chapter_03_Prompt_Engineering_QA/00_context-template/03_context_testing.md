# 03 · Testing Context

> How to fill this file: [03_context_testing_usage_guide.html](03_context_testing_usage_guide.html) · Whole pack: [00_context_pack_usage_guide.html](00_context_pack_usage_guide.html)
> How testing is set up for this project. Delete lines that don't apply.

## Test Types in Scope
- [Functional (positive, negative, boundary)]
- [Security]
- [Accessibility, e.g. WCAG 2.1 AA]
- [Performance, e.g. page load target]
- [Compatibility: browsers / devices]

## Test Design Techniques
- [Equivalence Partitioning, Boundary Value Analysis, Decision Tables, Error Guessing]

## Priority Scheme
| Priority | Meaning |
|----------|---------|
| P0 | [e.g. Blocks the core flow or a security risk] |
| P1 | [e.g. Major functional / UX impact] |
| P2 | [e.g. Minor / cosmetic] |

## Tools
- **Automation:** [FRAMEWORK + LANGUAGE]
- **Reporting:** [TOOL]
- **Test management:** [TOOL]
- **Defect tracking:** [TOOL]

## Test Data Rules
- Synthetic data only, using placeholders such as `<test_user_email>` and `<valid_password>`.
- Never paste real credentials into prompts or outputs.

## Output Formats
- Test cases: [e.g. Markdown table → XLSX / DOCX]
- Test plans and bug reports: [e.g. DOCX]

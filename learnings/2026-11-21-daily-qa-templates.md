# Daily QA Templates with Usage Guides

## Date
2026-11-21

## Objective
Create one prompt template for each of 17 everyday QA tasks, each built on the prompt framework that fits it best (STAR, CLEAR, CRISP or RICE-POT). Add an HTML usage guide for each template. Structure them so each can later be converted into a `SKILL.md`.

## Tools and Technologies Used
- Markdown prompt templates; HTML/CSS usage guides (self-contained, light and dark mode, phone-friendly)
- Python generator (kept in the session scratchpad) rendering both formats from one data source
- Playwright (from `Chapter_02_Prompt_Engineering/PlaywrightFramework/node_modules`) for screenshot checks

## Steps Performed
1. Reviewed the existing Chapter 03 frameworks (`Templates/`, `STAR.md`, `CLEAR.md`, `CRISP.md`) and the Chapter 02 RICE-POT template.
2. Agreed with the user: folder `Chapter_03_Prompt_Engineering_QA/Daily_QA_Templates/`, one framework per task, the task-to-framework mapping, keep `Reusable_Templates/` as well, and add an HTML usage guide per template.
3. Wrote the content for all 17 tasks once (purpose, use/skip, inputs, framework blocks, output format, VWO example, review checklist, common problems, next steps, skill name, trigger phrases).
4. Rendered 17 `.md` templates, 17 `*_usage_guide.html` files and a `README.md` index.
5. Updated the repository README (structure tree and Chapter 03 section).

## Code Examples
File naming: `NN_Task_Name_FRAMEWORK.md` and `NN_Task_Name_FRAMEWORK_usage_guide.html`, e.g.
```
01_Requirement_Analysis_STAR.md
01_Requirement_Analysis_STAR_usage_guide.html
```
Each template ends with ready-to-copy skill frontmatter:
```yaml
---
name: "requirement-analyzer"
description: "Check requirements for testability ... Use when the user says \"analyse these requirements\", ..."
---
```

## Challenges Faced
- 34 files must stay consistent; hand-editing would drift.
- The usage guide's framework section initially showed only the first line of each block, which for list blocks was a fragment ("1. Scope is ...").

## Solutions Implemented
- Single data source → both the template and its guide are generated from the same text.
- Added a short explanation of each framework letter, followed by the template's own line as an example.

## Key Learnings
- Matching the framework to the task type matters: CRISP for short reader-focused write-ups, CLEAR when hard limits and self-review are needed, STAR for analysis with a defined result, RICE-POT when examples and strict output (code) matter.
- A shared GUARDRAILS block in every template keeps outputs honest ("Requires clarification" instead of invented values).
- Designing the sections up front (purpose/triggers, inputs, prompt, output, review) makes the later SKILL.md conversion mechanical.

## Testing and Verification
- 257 relative links across all templates and guides checked: all resolve.
- All 17 HTML files parsed with balanced tags.
- Rendered in Chromium at 390 px (light) and 1280 px (dark): no horizontal overflow, readable in both themes.
- Templates have not yet been run against a model; that is the next step.

## Future Improvements
- Run each template once against the VWO PRD and log results in `../MyNotes.md`.
- Convert the templates into `SKILL.md` files (frontmatter is already in each template).
- Add more worked examples from real runs.

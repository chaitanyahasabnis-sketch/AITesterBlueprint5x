# Chapter 03 Prompt Library, STAR Test Plan and Naming Fixes

## Date
2026-11-21

## Objective
Close the remaining gaps found by comparing this repository with a reference course repository:
fix file names that agents and skill loaders could not discover reliably, build out the Chapter 03 prompt library, and generate the missing STAR functional test plan.

## Tools and Technologies Used
- Git (`git mv` for history-preserving renames)
- Markdown prompt templates (STAR, CLEAR, CRISP, Role-Task-Constraints-Format-Input)
- Python 3 + `python-docx` (installed in a throwaway virtual environment, not globally)
- VWO Login Dashboard PRD (`Chapter_02_Prompt_Engineering/resources/`) as the only source for the context pack

## Steps Performed
1. Gap analysis: listed both repositories, compared structure and key files, and agreed the scope with the user (naming fixes + Chapter 03 library + STAR DOCX).
2. Renamed with `git mv`:
   - `Agents.md` → `AGENTS.md`
   - `testplan-creator-skill/SKILLS.md` → `SKILL.md`
   - `testcase-creator-skill/testcases_skills.md` → `SKILL.md`
   - `Chapter_03_Prompt_Engineering_QA/TestPlanTemlate.md` (empty, misspelled) → `Template.md`
3. Fixed the test-plan skill frontmatter: kebab-case `name`, trigger-style `description`, full author name.
4. Wrote `Template.md` (12 sections plus document control) and reformatted `STAR.md` / `CRISP.md` with Markdown headings, without changing their wording.
5. Added `Templates/` (STAR, CLEAR, CRISP definitions), `00_context-vwo/` (4 context files), 18 templates under `Reusable_Templates/{testing,bugs,api}`, and `MyNotes.md` (run log).
6. Generated `output/VWO_Login_Functional_Test_Plan.docx` from the STAR prompt with a scratchpad script.
7. Updated `README.md` (structure tree, Chapter 03 library table, renamed file references).

## Code Examples
History-preserving rename (git shows `R`, not delete + add):
```bash
git mv Agents.md AGENTS.md
git mv Chapter_03_Prompt_Engineering_QA/TestPlanTemlate.md Chapter_03_Prompt_Engineering_QA/Template.md
```

One shared guardrail block injected into every reusable template:
```python
GUARD = """CONSTRAINTS (always)
- Use ONLY the requirements / input pasted below.
- Do NOT invent features, error messages, limits, codes or behaviour.
- If information is missing, write "Requires clarification".
..."""
```

## Challenges Faced
- `STAR.md` pointed to `Chapter_03_Prompt_Engineering_QA/Template.md`, which did not exist; the only template file was empty and misspelled.
- `Agents.md` worked on Windows only because the file system is case-insensitive; on Linux or GitHub the agent would not find it.
- Writing 18 templates with a Bash heredoc failed on mixed quotes and backticks.
- `python-docx` was not installed on the machine.

## Solutions Implemented
- Renaming the empty file to `Template.md` and filling it fixed the broken reference.
- Case-only rename through `git mv` so the index records the new case.
- Switched to a small Python generator (kept in the session scratchpad, not the repo) for the templates.
- Created a temporary venv for `python-docx` to avoid changing the global Python install.

## Key Learnings
- Skill loaders and agents depend on exact file names (`SKILL.md`, `AGENTS.md`); case matters once code leaves Windows.
- A context pack plus reusable templates removes the need to re-describe the product in every prompt.
- Putting the same anti-hallucination block in every template keeps outputs consistent: gaps surface as "Requires clarification" instead of invented values.
- With only five supplied requirements, the honest test plan has many open questions. That is a useful output, not a weakness.

## Testing and Verification
- `git status` shows the four renames as `R` (history kept).
- `Reusable_Templates/` contains 18 files (6 each in `testing/`, `bugs/`, `api/`); `00_context-vwo/` has 4, `Templates/` has 3.
- The DOCX was reopened with `python-docx`: all sections 0–12 present, 10 tables, and an email-pattern check found no real addresses (placeholders only).
- README has no remaining references to the old file names.
- No automated test suites were run; this task changed documentation and prompt files only.

## Future Improvements
- Run each reusable template against the VWO PRD and log results in `MyNotes.md`.
- Fill in the missing dates for the earlier CLEAR / CRISP runs in `MyNotes.md`.
- Add the optional items from the gap analysis: a standalone Playwright login project and a real `api-response-validator-skill`.
- Get answers to open questions Q-01 to Q-06 in the STAR test plan and regenerate it as v2.

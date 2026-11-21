# Make Prompts and Skills Generic

## Date
2026-11-21

## Objective
Remove hard-coded project values (VWO, login, repo paths, sample code) from the reusable prompts and skills, so they work for any project, while keeping VWO as clearly labelled worked examples.

## Tools and Technologies Used
- Markdown prompt templates and SKILL.md files
- Python generator (session scratchpad) for the Daily QA templates
- grep / awk scans limited to the copy-paste prompt sections

## Steps Performed
1. Audited every prompt and skill and grouped files as generic, generic with sample values in the prompt, hard-coded, or intentionally specific (worked examples).
2. `Chapter_02_Prompt_Engineering/anti-hallucination-rules.md`: the VWO PRD path became `[PRD / requirement source]`.
3. `testcase-creator-skill/SKILL.md`: neutral description with trigger phrases; company/project name, requirements, template columns and output folder are now inputs; the old column set is an explicit default that must be confirmed.
4. `testplan-creator-skill_a/SKILL.md`: asks for a `[COMPANY PROFILE]`; the saved profile (`misc/mycompanydetails.md`) is only offered and used when the user confirms. Added `misc/company-profile.template.md`.
5. Daily QA templates: neutral placeholder rows inside the prompts of 02, 06, 07, 09, 12, 14 and 15 (02, 09 and 12 were found by a second, case-insensitive scan). Template 15 now asks for one existing test from the user's framework as the style example instead of embedding repo-specific code. VWO stays only in the worked-example sections.
6. Added `Chapter_03_Prompt_Engineering_QA/00_context-template/` (blank pack); templates now point to it first, with `00_context-vwo/` as the filled example.
7. Updated the README.
8. Added HTML usage guides to `00_context-template/`: one per file (`01`–`04_*_usage_guide.html`: why it matters, where to find the information, field-by-field table with VWO examples, steps, common mistakes, checklist) and `00_context_pack_usage_guide.html` (set-up, paste order 01–03 → prompt → 04, which files each task needs). Each blank `.md` links to its guide.

## Code Examples
Scan only the part users copy, not the example sections:
```bash
awk '/^## Prompt/{p=1} /^## Expected output/{p=0} p' 15_Automation_Code_Generation_RICEPOT.md \
  | grep -niE "login|dashboard|vwo|LoginPage|Chapter_0"
```

## Challenges Faced
- The first scan was case-sensitive and missed "Log in" / "Dashboard" sample rows in three templates.
- Few-shot examples are useful but bias output toward the sample domain.

## Solutions Implemented
- Re-ran the scan case-insensitively and restricted to prompt sections.
- Used structural placeholders in examples (`[Main success scenario for REQ-01]`, `[File]:[Line]`) so the format is shown without a domain.
- For code generation, the best example is the user's own existing test, so the prompt now asks for it.

## Key Learnings
- "Generic" must be checked in the part that is actually sent to the model; worked examples outside the prompt can stay specific.
- A skill should ask for company-specific context rather than read a fixed file silently.

## Testing and Verification
- Case-insensitive scan of all 17 prompt sections for login/VWO/repo-specific terms: no matches.
- Blank context pack, test-case skill and anti-hallucination rules: no VWO/login/URL values.
- 308 relative links across Daily_QA_Templates and the blank context pack resolve; all HTML guides parse with balanced tags.
- Context-pack guides: 30 links resolve, HTML tags balanced; rendered at 390 px (light) and 1280 px (dark) with no horizontal overflow (an 8 px phone overflow from a long inline path was fixed by letting inline code wrap).
- Templates and skills were not run against a model in this task.

## Future Improvements
- Rename the two `Chapter_02_Prompt_Engineering/RICEPOT_Template_*` files to `RICEPOT_Example_VWO_*` (they are filled examples, not blank templates).
- Convert the Daily QA templates into SKILL.md files.

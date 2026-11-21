# VWO-49 Passkey & SSO Login — Test Plan Generation

## Date
2026-11-17

## Objective
Use the `advance-testplan-creator` skill (`Chapter_00_SKILL_Basics/01_Advanced_Skills/testplan-creator-skill_a/SKILL.md`) to produce a review-ready test plan for JIRA story VWO-49 in `Chapter_00_SKILL_Basics/output`.

## Tools and Technologies Used
- Claude Code following the SKILL.md workflow
- Skill references: `references/requirement-checklist.md`, `references/test-plan-template.md`, `misc/mycompanydetails.md`, `misc/company.png`
- Python 3 (standard library only) to extract text from the JIRA HTML export and render Markdown to self-contained HTML

## Steps Performed
1. Read SKILL.md, the checklist, the template, the company details and the fetch script.
2. The live JIRA fetch was not possible because no `.env` / JIRA credentials were present. Used the existing local export `resources/VWO-49.doc` (an HTML file) as the ticket source instead of inventing content.
3. Extracted the ticket text: 6 AC groups, out-of-scope items, DoD, and comments showing 6 automated runs where all 4 TCs were BLOCKED.
4. Scored every checklist item (✅/⚠️/❌) and raised 20 questions for the author.
5. Filled the template: scope, gaps, 40 traceable scenarios (P0/P1/P2), data/environment, risks, entry/exit criteria, and a Human Review Gate.
6. Rendered an HTML version with the company logo embedded as base64, and copied the logo to `output/assets/` for the Markdown version.

## Code Examples
```python
# Strip HTML from the JIRA .doc export
t = re.sub(r'(?is)<(script|style).*?</\1>', '', t)
t = re.sub(r'(?i)<br\s*/?>|</(p|div|tr|li|h\d)>', '\n', t)
t = html.unescape(re.sub(r'<[^>]+>', ' ', t))
```

## Challenges Faced
- No JIRA credentials were available for `scripts/fetch-jira.sh`.
- The ticket ACs use vague wording ("appropriate", "fallback or guidance", "supported browsers").
- The logo in `misc/company.png` ("TheTesting Academy") does not match the company details (VWO/Wingify).
- `misc/figma-design.fig` is empty, so there was no design to check against.

## Solutions Implemented
- Used the local ticket export and stated that clearly in the plan's assumptions.
- Turned every vague AC into a numbered gap/question instead of inventing expected results.
- Flagged the logo mismatch in the Human Review Gate rather than guessing.

## Key Learnings
- The "Gaps & Questions" section is where most of the value is: 7 of the 20 gaps block objective pass/fail.
- Automated runs that end BLOCKED with no reason recorded are themselves a risk worth surfacing.
- Mapping each scenario to an AC or a gap keeps the plan traceable and avoids fabricated requirements.

## Testing and Verification
- Verified that the generated HTML contains all 40 scenario rows (10 P0, 20 P1, 10 P2).
- No test execution was performed; this task produced a plan only. The plan is a DRAFT pending human approval.

## Future Improvements
- Add a `.env` with JIRA credentials so the skill can fetch live tickets.
- Generate a PDF export alongside the HTML.
- Once approved, derive test cases and Playwright automation from the P0/P1 scenarios.

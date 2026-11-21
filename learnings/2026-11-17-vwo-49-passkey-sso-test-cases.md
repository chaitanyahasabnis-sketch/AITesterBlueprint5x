# VWO-49 Passkey and SSO Login Test Case Generation

## Date
2026-11-17

## Objective
Generate test cases for Jira story VWO-49 ("Add Passkey and SSO Login Options to VWO Login Page") using the template and rules in `Chapter_00_SKILL_Basics/00_Basic_Skills/testcase-creator-skill/testcases_skills.md`, and output them as CSV, XLSX and HTML in `Chapter_00_SKILL_Basics/output/`.

## Tools and Technologies Used
- Python 3 (`csv`, `html`, `re` standard library)
- openpyxl 3.1.5 (XLSX generation and styling)
- Plain HTML/CSS with a small JS scenario filter

## Steps Performed
1. Read the skill file (template headings, core principles, output formats) and `Notes.md`.
2. Found that `resources/VWO-49.doc` is a Jira "Word" export that is really HTML, so extracted its text with a regex/`html.unescape` pass instead of a .doc parser.
3. Mapped the acceptance criteria, test scenarios, out-of-scope items and earlier automated-run comments (TC-01..TC-04) to 8 scenario groups (TS01-TS08).
4. Wrote 22 test cases using the 14-column template exactly as given, repeated column names included.
5. Generated CSV (UTF-8 BOM so Excel opens it cleanly), styled XLSX (frozen header, filters, colour-coded priority) and HTML (summary, scope, filter).
6. Checked the row and column counts in all three files and confirmed no personal names appear in them.

## Code Examples
```python
# Jira .doc export is HTML - strip tags to get readable text
t = re.sub(r'(?is)<(script|style).*?</\1>', '', t)
t = re.sub(r'(?i)<br\s*/?>|</p>|</tr>|</li>', '\n', t)
t = html.unescape(re.sub(r'<[^>]+>', '', t))
```

## Challenges Faced
- The template has two `Expected Result` and two `Actual Result` columns, and no earlier example shows how to fill them.
- `python -I` (isolated mode) ignored the user-site openpyxl install.
- The story comments contain the reporter's name and earlier blocked automation runs.

## Solutions Implemented
- 1st pair (TestSteps / Expected Result) = high-level flow and overall outcome; 2nd pair (Steps to Execute / Expected Result) = detailed numbered steps with expected results for each step.
- Ran the self-written generator without `-I`.
- Left out personal names. Earlier automation runs are mentioned only in Misc (Comments) as "BLOCKED", without inventing pass/fail results.

## Key Learnings
- Check what a file really is (`file`) before picking a parser: Jira `.doc` exports are HTML.
- Keep test cases tied to the acceptance criteria. Out-of-scope items (passkey registration, SSO provider configuration) become preconditions, not tests.
- Actual Result, Status and QA Name must stay unexecuted until someone really runs the tests.

## Testing and Verification
- CSV: 22 data rows, every row 14 columns.
- XLSX: 22 data rows, 14 columns (re-opened with openpyxl).
- HTML: 22 test case rows rendered.
- Searched the outputs for the reporter's name: not found.
- The test cases themselves have not been run against app.vwo.com.

## Future Improvements
- Turn the generator into a reusable script inside the skill folder that takes any Jira export as input.
- Add Playwright automation for the cases mapped to TC-01..TC-04 once the blocker is fixed.

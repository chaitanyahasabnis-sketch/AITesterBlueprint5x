# VWO Login Test Cases with RICE-POT (Anti-Hallucination)

## Date
2026-11-17

## Objective
Generate PRD-traceable test cases for the VWO login dashboard (app.vwo.com) using the RICE-POT prompt template plus the anti-hallucination rules, delivered as `Chapter_02_Prompt_Engineering/output/Test_Cases_without_hallucination.xlsx`.

## Tools and Technologies Used
- RICE-POT template (`Template_RICE_POT/Template.RICEPPOT.md`) and `RICEPOT_Template_without_hallucination.md`
- `anti-hallucination-rules.md` (Verified Facts / Missing Info / Output / Self-Validation)
- PRD: `resources/Product Requirements Document_ VWO Login Dashboard.pdf`
- Python + openpyxl

## Steps Performed
1. Read the filled RICE-POT prompt and the blank template's recommended Parameters block.
2. Read the 7-page PRD and extracted testable requirements by section and page.
3. Wrote 58 test cases, each citing its PRD section and page.
4. Marked each expected result as `Verified (PRD)` or `Inference (low confidence)`. Recorded every unspecified detail as "Insufficient information to determine."
5. Built a workbook with four sheets: Test_Cases, Summary (COUNTIF formulas), Validation_Report and RICE-POT_Prompt.

## Code Examples
```python
ws.append([f"TC_{n:03d}", *t, "Not Run", "", ""])
if t[10] == INF:
    ws.cell(r, 12).fill = inf_fill   # highlight inferred expectations
sm.append([it, f'=COUNTIF(Test_Cases!$B$2:$B${last},"{it}")'])
```

## Challenges Faced
- The PRD does not give exact error messages, password rules, timeout values, rate-limit thresholds or SSO entry points.
- The prompt asked for "all pages," but the PRD covers only the login dashboard. It does not mention app.wingify.com.
- The LibreOffice recalc helper failed on Windows (`socket.AF_UNIX` missing).

## Solutions Implemented
- Each gap is recorded per test case in an "Open Questions / Missing Info" column instead of guessed values.
- Scope limits are documented in the Validation_Report sheet.
- The workbook is set to recalculate fully on load. The COUNTIF ranges were checked against Python counts.

## Key Learnings
- Separate *verified* expectations from *inferred* ones in their own column. This makes hallucination visible to reviewers.
- A one-line RICE-POT instruction like "check all pages" needs scope from the source document. Otherwise the model invents pages.
- Use placeholder test data (`<registered_email>`) so that no credentials are stored.

## Testing and Verification
- Script ran and wrote 58 test cases.
- Python counts: P1 22, P2 20, P3 16; 49 Verified, 9 Inference. Summary formula ranges (rows 2–59) match.
- Formulas were not evaluated by LibreOffice (recalc failed on Windows). Excel computes them on open.
- The test cases have not been executed against app.vwo.com. All statuses are "Not Run".

## Future Improvements
- Get the missing details (error texts, password policy, timeouts) from the product team and turn the inferred rows into verified ones.
- Automate the P1 cases in the existing Playwright framework.

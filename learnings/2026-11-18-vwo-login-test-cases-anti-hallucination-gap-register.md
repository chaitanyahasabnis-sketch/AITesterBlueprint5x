# VWO Login Test Cases with Anti-Hallucination Gap Register

## Date
2026-11-18

## Objective
Regenerate the VWO login test cases from `RICEPOT_Template_with_anti-hallucination.md`. Produce `output/Test_Cases_with_anti-hallucination_rules.xlsx` and report how many missing-information gaps the anti-hallucination rules found.

## Tools and Technologies Used
- RICE-POT template + anti-hallucination Parameters block
- PRD: `Chapter_02_Prompt_Engineering/resources/Product Requirements Document_ VWO Login Dashboard.pdf`
- Python + openpyxl

## Steps Performed
1. Read the updated prompt. Its new output file name and embedded anti-hallucination rules are the main changes.
2. Reused the 58 PRD-traced test cases from the 2026-11-17 run.
3. Built a Gap Register of 44 gaps (G01–G44). Each gap has a category, a description, the affected test cases, and the response "Insufficient information to determine."
4. Added a "Gap IDs" column to Test_Cases and gap counts (COUNTIF/COUNTA formulas) to the Summary sheet.
5. Generated `output/Gap_Analysis_anti-hallucination.html` from the workbook's Gap_Register sheet. Generating from the sheet keeps the report and the Excel file consistent. The page has summary stats, a category chart, a filterable gap table, and an "Impact" per gap (the highest priority among the affected test cases): 16 P1, 8 P2, 13 P3, 7 global.

## Code Examples
```python
GAPS = [("Functional", "Exact error message text ...", [8, 9, 21]), ...]
for gi, (_, _, tcs) in enumerate(GAPS, 1):
    for t in tcs:
        TC_GAPS.setdefault(t, []).append(f"G{gi:02d}")
```

## Challenges Faced
- The prompt still says "check all pages", but the PRD covers only the login dashboard.
- The Google Docs link in the prompt is private, so only the local PDF could be used.

## Solutions Implemented
- Recorded scope and input problems as their own gaps (G38–G44) instead of inventing pages or content.

## Key Learnings
- Give each missing detail its own ID so it can be counted, tracked and handed to the product owner as a question list.
- Linking gaps to test cases shows which cases are blocked on clarification: 44 of 58 cases depend on at least one gap.

## Testing and Verification
- The script ran: 58 test cases, 44 gaps, 44 test cases linked to gaps.
- Formula ranges were checked (Gap_Register rows 2–45, Test_Cases rows 2–59). LibreOffice recalc is unavailable on Windows, so Excel computes the values on open.
- The test cases have not been executed. All statuses are "Not Run".

## Future Improvements
- Close the gaps with the product team and promote the inferred cases to verified.

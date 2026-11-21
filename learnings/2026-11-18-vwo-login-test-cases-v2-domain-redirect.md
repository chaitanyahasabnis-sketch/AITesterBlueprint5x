# VWO Login Test Cases v2 After New Domain Information

## Date
2026-11-18

## Objective
Regenerate the VWO login test cases with one new fact from the user: app.vwo.com and app.wingify.com are the same application, and opening app.vwo.com now lands on app.wingify.com. Then report in HTML whether the new information produced better test cases.

## Tools and Technologies Used
- RICE-POT template (`Chapter_02_Prompt_Engineering/Template_RICE_POT/Template.RICEPPOT.md`) and `anti-hallucination-rules.md` (4-step process: Verified Facts, Missing Info, Generated Output, Self-Validation)
- VWO Login Dashboard PRD (PDF)
- Python + openpyxl; a static HTML report

## Steps Performed
1. Copied the v1 generator. Kept the TC IDs stable so that v1 and v2 can be compared row by row.
2. Changed the navigation URL to `https://app.wingify.com/#/login` in 7 test cases (TC_001, 006, 013, 014, 038, 044, 052).
3. Added 5 URL/Domain test cases (TC_059–063): 3 verified from the user input, 2 labelled as inferences.
4. Marked gap G39 (relation between the two domains) as resolved. Logged 3 new gaps (G45–G47): redirect mechanism, deep-link preservation, and cross-domain sessions.
5. Added a Change_Log sheet. Rewrote Validation_Report in the 4-step format from anti-hallucination-rules.md.
6. Built `output/Test_Case_Improvement_Report_v1_vs_v2.html` by reading both workbooks.

## Code Examples
```python
RESOLVED = {39: "Resolved by user input (2026-11-18): ..."}
for gi, (_, _, tcs) in enumerate(GAPS, 1):
    if gi in RESOLVED:
        continue          # resolved gaps no longer flag test cases
```

## Challenges Faced
- The prompt referenced `RICE_POT/Template_RICE_POT/...`, but that folder does not exist. The template is still at `Template_RICE_POT/`.
- The new fact says the user "lands on" app.wingify.com, but not how: no status code, and nothing about path or session handling.

## Solutions Implemented
- Asserted only the final URL. Recorded the redirect details as new gaps instead of assuming a 301/302.

## Key Learnings
- New information can close one gap and raise others. Open gaps went from 44 to 46, yet the test suite is more accurate.
- To judge "better", compare by evidence type (verified vs. inferred), coverage, and correctness of the URLs used, not only by test case count.

## Testing and Verification
- Script results: v2 has 63 test cases (52 verified, 11 inferred), 47 gaps logged, 46 open, and 48 test cases linked to open gaps.
- The report's metrics are computed from both workbooks: v1 had 7 test cases using the old URL, v2 has 0.
- Excel formulas were not evaluated by LibreOffice (recalc is unavailable on Windows). Excel computes them on open.
- No test cases have been executed.

## Future Improvements
- Confirm the redirect behaviour (G45–G47) by running TC_059–063 against the live site.
- Close the P1-linked PRD gaps with the product team.

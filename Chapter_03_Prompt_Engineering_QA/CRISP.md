CRISP


Context:  

For a training exercise, assume I observed the following defect at https://app.vwo.com/:



- Requirement: Email and password are mandatory.

- Starting state: The user is logged out.

- Action: Enter a registered test email, leave the password empty, and submit the login form.

- Observation: The form submits, but no visible validation feedback appears.

- Reproducibility: 3 out of 3 attempts.

- Browser/version, operating system, build, and execution time: Not supplied.

- Screenshots, video, and logs: Not supplied.



This is a hypothetical defect, not a confirmed issue in VWO.



Role:  

Act as a senior QA engineer writing a clear, reproducible bug report.



Instructions:  

Create a bug report with:

1. Title

2. Environment

3. Preconditions

4. Test Data

5. Steps to Reproduce

6. Expected Result

7. Actual Result

8. Reproducibility

9. Suggested Severity and rationale

10. Attachments



Base the expected result on the mandatory-password requirement. Do not invent the exact validation text. Distinguish observed behavior from assumptions. Label severity as provisional.



Style:  

Use concise, factual language and numbered reproduction steps. Write for a developer who has not seen the issue.



Parameters:  

- Produce one bug report.

- Keep it under 500 words.

- Use placeholders for account details.

- Mark missing environment details as “Not supplied.”

- Mark attachments as “Not provided.”

- Clearly label the report “Hypothetical training example.
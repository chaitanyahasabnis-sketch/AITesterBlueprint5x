# Generate a VWO Login Functional Test Plan Using the STAR Framework

## S: Situation

I am a QA engineer preparing to test the login page at https://app.vwo.com/. For this exercise, assume the approved requirements are:

1. Registered users can log in with valid credentials.
2. Invalid credentials must not grant access and give error.
3. Email and password are mandatory.
4. Successful login opens the authenticated dashboard.
5. Invalid login gives error message "Your email, password, IP address or location did not match"

## T: Task

Create a functional test plan for the login module use the template here - `Chapter_03_Prompt_Engineering_QA/Template.md`

## A: Action

- Define the objectives, scope, and testing approach.
- Cover valid login, invalid credentials, empty fields, and access to the dashboard after login.
- Include positive, negative, and boundary scenarios where the supplied requirements support them.
- Define test environment needs, test data, entry criteria, exit criteria, deliverables, and risks.
- Mark unspecified behavior as "Requires clarification." Do not invent password rules, exact error messages, or session timeouts.

## R: Result

Return a test plan containing:

- Test Plan ID and Title
- Objective
- In Scope and Out of Scope
- Test Approach
- Test Scenarios
- Environment and Test Data
- Entry and Exit Criteria
- Deliverables
- Risks and Open Questions

Use clear language and tables where useful. Label any proposed criteria as recommendations.

# Generate VWO Login Test Cases Using the CLEAR Framework

## C: Context

Act as a Senior QA Engineer and Test Automation Architect with expertise in web application testing, authentication, security, and test design techniques.

Application URL: https://app.vwo.com/#/login

Objective: Design comprehensive test cases for the Email Address and Password fields on the VWO Login page.

Use risk-based testing, Equivalence Partitioning, Boundary Value Analysis, Decision Tables, and Error Guessing.

## L: Limits

1. Restrict the scope to Email Address, Password, and their related login behavior.
2. Cover functional, positive, negative, boundary, security, usability, and accessibility testing.
3. Do not invent application-specific validation rules or exact error messages.
4. If the live application cannot be inspected, clearly identify assumptions and requirements requiring confirmation.
5. Use only synthetic test credentials.
6. Do not execute authentication attempts against the live application.
7. Avoid duplicate and redundant test cases.
8. Prioritize test cases using P0 (Critical), P1 (High), and P2 (Medium/Low).

## E: Examples

Use the following test case format:

- Test Case ID
- Module
- Test Scenario
- Preconditions
- Test Steps
- Test Data
- Expected Result
- Test Type
- Priority
- Automation Feasibility
- Requirement Status (Confirmed / Needs Confirmation)

Example:

Test Case ID: VWO-LOGIN-001

Scenario: Verify successful login using a valid email address and password.

Precondition: An active test account with valid credentials exists.

Steps:
1. Navigate to the VWO login page.
2. Enter a registered email address.
3. Enter the correct password.
4. Click the login button.

Expected Result: The user is authenticated and redirected to the authorized landing page.

Priority: P0

Automation Feasibility: Yes

Requirement Status: Needs Confirmation

## A: Action

Generate a comprehensive test suite covering:

### 1. Email Address Validation
- Valid registered email
- Unregistered email
- Blank email
- Missing @ symbol
- Missing domain
- Leading and trailing spaces
- Uppercase and lowercase characters
- Special characters
- Maximum length and boundary conditions
- Unicode and internationalized addresses where supported

### 2. Password Validation
- Correct password
- Incorrect password
- Blank password
- Case-sensitive password
- Leading and trailing spaces
- Special characters
- Very long password
- Password masking
- Show/hide password behavior, if available
- Copy/paste behavior

### 3. Email and Password Combinations
- Valid email + valid password
- Valid email + invalid password
- Invalid email + valid password
- Invalid email + invalid password
- Both fields blank
- Email blank + password populated
- Email populated + password blank
- Submission using Enter
- Repeated login submissions

### 4. Security Testing
- SQL injection-like input handling
- XSS-like input handling
- Generic authentication error responses
- Password visibility in URL, logs, and browser storage
- Session creation after successful login
- Rate limiting and account lockout behavior, if applicable
- HTTPS enforcement

### 5. Usability and Accessibility
- Field labels and placeholders
- Keyboard navigation
- Tab order
- Focus indication
- Error message clarity
- Screen-reader compatibility
- Responsive layout behavior

For every scenario, provide complete test cases with test steps, test data, expected results, priority, test type, and automation feasibility.

## R: Review

After generating the test cases:

1. Review for duplicates and merge overlapping scenarios.
2. Verify positive, negative, and boundary test coverage.
3. Check that expected results are specific and verifiable.
4. Identify requirements that need product-owner clarification.
5. Provide a coverage matrix by test category.
6. Identify P0 smoke-test candidates.
7. Identify regression-test candidates.
8. Recommend test cases suitable for Playwright with TypeScript.
9. Highlight any missing high-risk authentication scenarios.
10. Provide a final summary showing total test cases by category and priority.

## Expected Output

Produce a structured Markdown table of test cases, followed by:

- Test coverage summary
- Priority distribution
- Automation recommendations
- Open questions and assumptions
- Final QA review findings

Do not generate automation code at this stage. Focus on designing high-quality, executable test cases.
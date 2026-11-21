# Test Plan — TOP-5: Product Requirements Document: VWO Login Dashboard

> Status: **DRAFT — pending human review.** Not approved until a QA owner signs off.

## 1. Scope & Objectives

- **In scope:** Functional verification of the VWO login dashboard as described in the PRD (e.g., authentication fields, remember-me, error handling, password reset, responsive design, accessibility, security features, SSO, social login, analytics tracking).  
- **Out of scope:** Post-login dashboard features, downstream product workflows, non-login related VWO modules, third-party identity provider implementations beyond what is specified.  
- **Objective:** Validate that the login experience meets the documented requirements (REQ-12 through REQ-64, REQ-74-82, etc.), provides clear feedback, enforces security controls, and performs within the defined performance targets.

## 2. Gaps & Questions for the author

| # | Area | Finding (⚠️/❌) | Question to author |
|---|------|----------------|--------------------|
| 1 | Acceptance criteria identifiers | ❌ | The source lists requirement IDs but does not provide explicit acceptance criteria (e.g., AC-1, AC-2). Should we map each requirement to a generated AC number, or are AC IDs defined elsewhere? |
| 2 | Performance thresholds | ⚠️ | REQ-44 mentions “login page loading within 2 seconds” and REQ-66 “sub-2-second login page loading,” but no specific test environment or network conditions are defined. What are the acceptable test conditions? |
| 3 | Error message text | ❌ | REQ-23 and REQ-62 call for “clear, actionable error messages,” but the exact wording is not provided. Should we verify presence of messages only, or also their exact content? |
| 4 | Multi-Factor Authentication flow | ⚠️ | REQ-18 states “optional 2FA support,” but details of the flow (SMS, authenticator app, backup codes) are missing. What variants need to be covered? |
| 5 | SSO protocols | ❌ | REQ-19 and REQ-53 reference SSO integration (SAML, OAuth) without specifying supported IdPs or configuration steps. Are these in scope for functional testing now? |
| 6 | Accessibility compliance level | ❌ | REQ-31, REQ-32, REQ-33, REQ-92 mention ARIA, high-contrast, keyboard navigation, WCAG 2.1 AA, but no test checklists are supplied. Should we use external WCAG test tools as part of validation? |
| 7 | Analytics events | ❌ | REQ-51 and REQ-99 describe tracking of login success/failure and user behavior, but event names, payloads, and collection endpoints are not defined. Need clarification to design verification steps. |
| 8 | Mobile optimization details | ⚠️ | REQ-27 and REQ-77 require mobile-optimized design, yet supported device matrix, screen sizes, and browsers are not listed. Which devices should be included in the test matrix? |
| 9 | Rate limiting behavior | ❌ | REQ-43 mentions protection against brute-force attacks, but the threshold (e.g., max attempts, lockout duration) is not specified. Need exact limits to test. |
| 10 | Branding assets | ❌ | REQ-34 and REQ-35 require brand consistency and visual appeal, but no style guide or asset repository is referenced. How should visual compliance be validated? |

## 3. Test Scenarios

| ID | Priority | Type (pos/neg/boundary) | Scenario | Maps to (AC / gap) |
|----|----------|-------------------------|----------|--------------------|
| TS-1 | Proposed: P0 | pos | Verify that the login page loads within 2 seconds on a standard broadband connection. | REQ-44, REQ-66 |
| TS-2 | Proposed: P0 | pos | Successful login with valid email (format verified) and password meeting REQ-26 requirements. | REQ-12, REQ-21, REQ-26, REQ-64 |
| TS-3 | Proposed: P1 | neg | Attempt login with an incorrectly formatted email and verify real-time validation message appears. | REQ-20, REQ-21 |
| TS-4 | Proposed: P1 | neg | Attempt login with a password that fails strength criteria and verify visual feedback per REQ-22. | REQ-22, REQ-26 |
| TS-5 | Proposed: P1 | neg | Submit login with empty email and password fields and verify error handling per REQ-23/62. | REQ-23, REQ-62 |
| TS-6 | Proposed: P2 | pos | Verify that the “Remember Me” checkbox persists the session across browser restarts. | REQ-13, REQ-17 |
| TS-7 | Proposed: P2 | pos | Verify that clicking the “Forgot Password” link initiates the password recovery flow described in REQ-24/25. | REQ-24, REQ-25 |
| TS-8 | Proposed: P2 | pos | Verify that the login page is responsive and renders correctly on a mobile device (e.g., iPhone 13, Android Chrome). | REQ-27, REQ-77 |
| TS-9 | Proposed: P2 | pos | Verify ARIA labels and keyboard navigation for all interactive elements (email, password, submit, links). | REQ-31, REQ-33, REQ-92 |
| TS-10 | Proposed: P2 | pos | Verify that the login page supports both Light and Dark mode toggles. | REQ-36 |
| TS-11 | Proposed: P1 | neg | Simulate 6 consecutive failed login attempts and verify rate-limiting behavior (lockout or captcha). | REQ-43, Gap-9 |
| TS-12 | Proposed: P1 | pos | Verify successful SSO login using a SAML IdP (if configured). | REQ-19, REQ-53, Gap-5 |
| TS-13 | Proposed: P1 | pos | Verify optional 2FA flow using an authenticator app after correct primary credentials. | REQ-18, Gap-4 |
| TS-14 | Proposed: P1 | pos | Verify that successful login triggers analytics event “login_success” with required payload fields. | REQ-51, REQ-99, Gap-7 |
| TS-15 | Proposed: P1 | neg | Verify that a failed login triggers analytics event “login_failure” with error code. | REQ-51, REQ-99, Gap-7 |

## 4. Test Data & Environment

- **Data:** Valid email/password pairs that satisfy REQ-26; invalid email formats; passwords failing strength criteria; accounts with 2FA enabled; SSO test accounts (SAML/OAuth) if available.  
- **Environment / flags:** Web browsers (Chrome, Firefox, Safari) on desktop and mobile; network throttling to simulate broadband; feature flags for Dark Mode, Social Login, SSO.  
- **Roles / permissions:** Standard user role (digital marketer) as primary login target; enterprise admin role for SSO/SSO-admin scenarios if applicable.

## 5. Risks & Assumptions

- **Assumptions made:**  
  - REQ-12-16 define the primary authentication flow; no additional hidden steps exist.  
  - “Remember Me” persists via a secure cookie as per typical implementations.  
  - Accessibility requirements can be validated with standard WCAG testing tools.  
- **Risks:**  
  - Missing detailed specifications for error message text may cause false-negative results.  
  - Lack of concrete rate-limiting thresholds could make boundary testing ambiguous.  
  - SSO and 2FA configurations may not be available in the test environment, limiting coverage.

## 6. Entry / Exit criteria

- **Entry:**  
  - Test environment provisioned with the latest build of the login page.  
  - Test data (valid/invalid credentials, 2FA tokens, SSO test accounts) prepared.  
  - Required tools for performance, accessibility, and analytics verification installed.  
- **Exit:**  
  - All test scenarios executed with results recorded.  
  - No high-severity defects (P0) remain open.  
  - Acceptance of any remaining medium/low defects by product owner.

## 7. Resource Allocation

Insufficient information to determine.

## 8. Timelines, Sprint Details

Insufficient information to determine.

---

## HUMAN REVIEW GATE

- **I assumed:** The login page implements the features listed in the PRD (requirements REQ-12-64, REQ-74-82) and that standard web testing tools are available.  
- **I could not confirm:** Exact acceptance criteria IDs, performance test conditions, error message wording, rate-limiting thresholds, SSO/2FA configuration details, and analytics event schemas.  
- **Open questions blocking sign-off:** Items listed in the “Gaps & Questions for the author” table (especially AC identifiers, performance environment, error text, MFA flow, SSO details, accessibility checklists, analytics payloads, rate-limit limits, branding assets).  
- **Approve, or edit, before I write test cases / automation.**

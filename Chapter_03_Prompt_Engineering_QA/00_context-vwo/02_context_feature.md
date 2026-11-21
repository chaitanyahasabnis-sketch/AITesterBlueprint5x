# 02 · Feature Context: Login

> Source: VWO Login Dashboard PRD. Items without a PRD source are marked **[Requires clarification]**.

## Feature
- **Name:** Login (email + password)
- **Goal:** Authenticate a registered user and open the VWO dashboard.

## Requirements (from PRD)

| ID | Requirement | PRD section |
|----|-------------|-------------|
| F-01 | Email and password login with secure validation | Login Process |
| F-02 | Remember Me checkbox for persistent sessions | Existing Features |
| F-03 | Link to free-trial sign-up for new users | Existing Features |
| F-04 | Real-time field validation on blur | User Input Validation |
| F-05 | Email format validation | User Input Validation |
| F-06 | Clear, actionable error messages for failed authentication | User Input Validation |
| F-07 | Forgot Password flow with email-based reset | Password Management |
| F-08 | Optional 2FA | Login Process |
| F-09 | Enterprise SSO (SAML, OAuth) | Login Process / Third-Party Services |
| F-10 | Optional social login (Google, Microsoft) | Third-Party Services |
| F-11 | Auto-focus on first input field | Interface Design |
| F-12 | Loading state during authentication | Interface Design |
| F-13 | Light and Dark Mode | Branding and Visual Design |
| F-14 | Successful login transitions to the main dashboard | Platform Integrations |

## Not specified in the PRD
- Exact error message text: [Requires clarification]
- Password complexity rules (PRD says "enforced", no values): [Requires clarification]
- Session timeout value (PRD says "configurable"): [Requires clarification]
- Lockout / rate-limit thresholds: [Requires clarification]
- Email / password max length: [Requires clarification]

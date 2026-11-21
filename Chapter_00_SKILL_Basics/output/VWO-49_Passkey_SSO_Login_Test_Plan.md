<p align="left"><img src="assets/company.png" alt="Company logo" width="110"></p>

**Company:** VWO (a Wingify product) — A/B testing and experience-optimization platform for websites · ~5,000 employees (per `misc/mycompanydetails.md`)

# Test Plan — VWO-49: [VWO] Add Passkey and SSO Login Options to VWO Login Page

> Status: **DRAFT — pending human review.** Not approved until a QA owner signs off.

| Field | Value (from ticket) |
|---|---|
| Ticket | VWO-49 · Story · Status: To Do |
| Epic | Authentication Enhancements |
| Priority | Field says **Medium**; description says **High** (see Gap #19) |
| Reporter / Assignee | Pramod / Unassigned |
| Components / Fix version / Sprint | None / None / Not set |
| Source | Local JIRA export `resources/VWO-49.doc` (JIRA API credentials not configured, so the live ticket was not fetched) |
| Plan drafted | 2026-11-17 |

---

## 1. Scope & Objectives

- **In scope:**
  - Visibility and placement of the new **"Sign in using SSO"** and **"Sign in with Passkey"** buttons on the VWO login page (AC-1)
  - SSO login flow: success → dashboard, failure → error message (AC-2)
  - Passkey login flow: registered passkey → dashboard; no passkey → fallback or guidance message (AC-3)
  - Error handling for failed SSO, failed passkey and unsupported browser/device (AC-4)
  - Compatibility: passkey on supported browsers/devices only; SSO across all configured IdPs (AC-5)
  - Security: OAuth/SAML/WebAuthn protocol use; no sensitive data in the UI or network logs (AC-6)
  - Responsiveness and accessibility of the new options (the ticket's own "Test Scenarios" list)
  - Regression of the existing login methods (email/password, "Sign in with Google")
- **Out of scope (per ticket):**
  - Passkey registration flow (a separate story)
  - SSO provider configuration
- **Objective:** VWO-49 counts as "tested" when every AC (AC-1 to AC-6) has at least one executed P0/P1 scenario with recorded evidence, existing login methods show no regression, and the Definition of Done is met: deployed to staging, all ACs met, QA sign-off, no open critical or high defects, documentation updated.

**AC reference key used below**

| Key | Acceptance criterion (summarized from the ticket) |
|---|---|
| AC-1 | UI Visibility: both buttons are visible, below "Sign in with Google" |
| AC-2 | SSO Login Flow: valid credentials → authenticated + dashboard; invalid → appropriate error |
| AC-3 | Passkey Login Flow: registered and verified passkey → logged in + dashboard; none available → fallback/guidance message |
| AC-4 | Error Handling: messages for failed SSO, passkey failure, unsupported browser/device |
| AC-5 | Compatibility: passkey only on supported browsers/devices; SSO across all configured IdPs |
| AC-6 | Security: OAuth/SAML/WebAuthn; no sensitive data exposed in UI or network logs |

---

## 2. Gaps & Questions for the author

Requirement checklist score (from `references/requirement-checklist.md`):

| Checklist item | Score | Note |
|---|---|---|
| Clear user story / goal | ✅ | "As a user, I want to log in using Passkey or SSO…" |
| AC testable (observable pass/fail) | ⚠️ | "Appropriate error messages", "fallback or guidance message" and "function seamlessly" have no observable expected result |
| Happy path fully described | ⚠️ | The SSO path never says how the user's IdP is identified (email, domain, org ID?) |
| Negative / error paths | ⚠️ | Listed, but no messages, codes or post-error state are defined |
| Boundary & empty states | ❌ | Cancel/timeout, multiple passkeys, multiple VWO accounts: none defined |
| State transitions / workflow | ❌ | No flow or sequence diagram; redirect chain not described |
| Test data specified | ❌ | No test IdP tenants, SSO users or passkey-holding accounts named |
| Environment / flags | ⚠️ | DoD says "staging", but the automated runs hit app.vwo.com and app.wingify.com/#/login. No feature flag named |
| External dependencies | ⚠️ | "All configured identity providers": none listed |
| Preconditions | ❌ | Account and plan prerequisites for SSO are not stated |
| Performance | ❌ | None stated |
| Security / authorization | ⚠️ | Protocols named; roles, 2FA interaction and rate limiting not covered |
| Accessibility | ⚠️ | Mentioned in the scenario list only; no standard (e.g. WCAG level) |
| i18n / l10n | ❌ | None stated |
| Audit / logging | ❌ | None stated |
| Regression surface | ⚠️ | The "alongside existing methods" wording implies it; not explicit |
| Backward compatibility | ❌ | Not stated |
| Browser / device matrix | ❌ | "Supported browsers/devices" is not defined |
| Rollback / feature flag | ❌ | Not stated |
| Ambiguous wording | ⚠️ | "should", "seamlessly", "smooth", "appropriate", "proper" |
| Terms consistent | ⚠️ | "SSO credentials" vs IdP-side authentication |
| Mockups / designs linked | ❌ | No design link; `misc/figma-design.fig` is an empty (0-byte) file |

**Questions for the ticket author**

| # | Area | Finding (⚠️/❌) | Question to author |
|---|------|----------------|--------------------|
| 1 | SSO flow | ❌ How the user's IdP is identified is not described | After the user clicks "Sign in using SSO", how do we determine the IdP: work-email domain lookup, organization/account ID entry, or a direct redirect? What happens with an email whose domain has no SSO configured? |
| 2 | SSO errors | ⚠️ "Appropriate error messages" is undefined | What is the exact text and placement of each SSO error (invalid credentials at the IdP, IdP unavailable, SAML assertion rejected, user not provisioned in VWO)? The automated runs expect "Invalid credentials". Is that the agreed copy? |
| 3 | SSO credentials | ⚠️ Invalid credentials are normally entered on the IdP's page, not VWO's | Is VWO expected to show an error for invalid IdP credentials, or only for a failed or denied IdP response returned to VWO? |
| 4 | Identity providers | ❌ "All configured identity providers" is not enumerated | Which IdPs and protocols are in scope for test (e.g. Okta, Azure AD/Entra ID, Google Workspace, OneLogin; SAML 2.0 and/or OIDC)? Will QA get test tenants? |
| 5 | Provisioning | ❌ Not covered | What happens when an SSO-authenticated user has no VWO user record (JIT provisioning, or a "contact admin" error)? And when the user is disabled or deleted in VWO? |
| 6 | Account eligibility | ❌ Not covered | Is SSO limited to certain plans or accounts (e.g. Enterprise)? Can SSO-enforced accounts still use email/password, Google or passkey? |
| 7 | Passkey fallback | ⚠️ "Fallback or guidance message" is undefined | What exactly is shown when no passkey is available: which text, and does it link to email/password login, the passkey registration page, or help docs? |
| 8 | Passkey cancel / timeout | ❌ Not covered | What is the expected behavior when the user cancels the browser/OS passkey prompt, or it times out? Is that an error message or a silent return? |
| 9 | Passkey discovery | ❌ Not covered | Is passkey login username-less (discoverable credentials), or must the user enter an email first? How is a user with multiple passkeys, or passkeys for several VWO accounts, handled? |
| 10 | Browser/device matrix | ❌ "Supported browsers/devices" is not listed | Please provide the supported matrix (browser versions, OS, platform authenticator vs. security key vs. cross-device/hybrid QR). Is the Passkey button hidden or disabled on unsupported browsers, or shown with an error after a click? |
| 11 | 2FA interplay | ❌ Not covered | If the VWO user has 2FA enabled, is 2FA still required after SSO or passkey login, or skipped? |
| 12 | Multi-account / roles | ❌ Not covered | For users belonging to multiple VWO accounts or workspaces, which dashboard do they land on? Do the new options behave the same for all roles (Admin, Editor, Viewer…)? |
| 13 | Button order | ⚠️ AC only says "below Sign in with Google" | Is the order between SSO and Passkey fixed (the automated TC-01 checks "correct order")? Are there exact labels, icons, spacing and mobile layout? A design link is needed. |
| 14 | Session & logout | ❌ Not covered | What are the session duration and "remember me" behavior for SSO/passkey sessions? Is IdP-initiated login or Single Logout (SLO) in scope? |
| 15 | Security specifics | ⚠️ "Sensitive data" is undefined | Which artifacts count as sensitive: SAML assertions, OAuth codes/tokens, WebAuthn challenge/credential IDs, emails? Must they never appear in URLs, console logs, analytics or front-end error payloads? |
| 16 | Abuse protection | ❌ Not covered | Is there rate limiting or lockout on the SSO initiation and passkey assertion endpoints? |
| 17 | Non-functional | ❌ Not covered | Are there performance targets (e.g. time from click to dashboard), an accessibility standard (WCAG 2.1 AA?), supported languages, and audit-log entries for SSO/passkey logins? |
| 18 | Environment / flag | ⚠️ Conflicting URLs | Which environment is the test target (staging URL)? Is the feature behind a flag, and what is the rollback behavior if the flag is turned off? |
| 19 | Ticket hygiene | ⚠️ Inconsistent fields | Priority is Medium in the field but High in the description: which is correct? Components, fix version, sprint and assignee are empty. The comment "XYZ module is a risk" names no module: which module? |
| 20 | Prior automated runs | ⚠️ 6 runs (10–20 Oct 2026), all 4 TCs BLOCKED, no reason recorded | Why were the runs blocked (feature not deployed, wrong URL, login wall, missing test accounts)? Was the 01-Jul comment "not able to reproduce" for this story? |

---

## 3. Test Scenarios (P0/P1/P2)

Priority: **P0** = blocks release or security-critical · **P1** = core behavior or a major error path · **P2** = secondary, cosmetic or nice-to-have.

### 3.1 UI Visibility (AC-1)

| ID | Priority | Type | Scenario | Maps to |
|----|----------|------|----------|---------|
| TS-01 | P0 | Positive | Open the login page as a logged-out user and verify that the "Sign in using SSO" and "Sign in with Passkey" buttons are visible | AC-1 |
| TS-02 | P1 | Positive | Verify both buttons are rendered **below** "Sign in with Google", and in the agreed order relative to each other | AC-1, Gap 13 |
| TS-03 | P1 | Positive | Verify the button labels match the ticket text exactly (spelling, casing) and are enabled/clickable | AC-1 |
| TS-04 | P0 | Regression | Verify the existing email/password and "Sign in with Google" options are still present and functional | Scope, Gap (regression) |
| TS-05 | P2 | Positive | Verify the layout on mobile and tablet widths (no overlap or truncation, buttons stay below Google) | Ticket scenario "UI responsiveness" |

### 3.2 SSO Login Flow (AC-2)

| ID | Priority | Type | Scenario | Maps to |
|----|----------|------|----------|---------|
| TS-06 | P0 | Positive | Click "Sign in using SSO", authenticate with valid credentials at a configured IdP, and verify the user is authenticated and redirected to the VWO dashboard | AC-2 |
| TS-07 | P0 | Negative | Enter invalid credentials at the IdP (or the IdP returns a failure) and verify an error message is shown and the user is not logged in | AC-2, AC-4, Gaps 2, 3 |
| TS-08 | P1 | Positive | Repeat TS-06 for **each** configured IdP and protocol (SAML / OIDC) | AC-5, Gap 4 |
| TS-09 | P1 | Negative | The user cancels or denies consent at the IdP and returns to VWO: verify graceful handling and an error/guidance message | AC-4, Gap 2 |
| TS-10 | P1 | Negative | The SSO user authenticates at the IdP but has no VWO user record, or the VWO user is disabled: verify the defined behavior (JIT provisioning or error) | Gap 5 |
| TS-11 | P1 | Negative | Email/domain with no SSO configured (if identification is by email/domain): verify a clear message | Gap 1 |
| TS-12 | P1 | Negative | The IdP is unreachable or times out: verify an error message and that no partial session is created | AC-4, Gap 2 |
| TS-13 | P1 | Negative | Tampered or expired SAML response / invalid OAuth `state` or code replay: verify the login is rejected | AC-6 |
| TS-14 | P2 | Boundary | User belonging to multiple VWO accounts logs in via SSO: verify the landing dashboard/account selection | Gap 12 |
| TS-15 | P1 | Positive | A user with 2FA enabled logs in via SSO: verify the agreed 2FA behavior | Gap 11 |
| TS-16 | P2 | Positive | Browser back button / refresh during the SSO redirect chain: no error loop, no duplicate session | AC-2 ("smooth experience") |

### 3.3 Passkey Login Flow (AC-3)

| ID | Priority | Type | Scenario | Maps to |
|----|----------|------|----------|---------|
| TS-17 | P0 | Positive | A user with a registered passkey clicks "Sign in with Passkey", verifies (biometric/PIN), and is logged in and redirected to the dashboard | AC-3 |
| TS-18 | P0 | Negative | No registered passkey is available on the device/account: verify the fallback or guidance message is shown and the user stays on the login page | AC-3, Gap 7 |
| TS-19 | P1 | Negative | The user cancels the browser/OS passkey prompt: verify the defined behavior and that the page is still usable | Gap 8 |
| TS-20 | P1 | Negative | The passkey prompt times out: verify the message and that a retry works | Gap 8 |
| TS-21 | P1 | Negative | Passkey verification fails (wrong PIN / biometric failure / revoked credential): verify the passkey failure error message | AC-4 |
| TS-22 | P2 | Boundary | The user has multiple passkeys, or passkeys for more than one VWO account: verify correct account selection | Gap 9 |
| TS-23 | P2 | Positive | Cross-device passkey (hybrid / QR from phone) and a hardware security key, if listed as supported | AC-5, Gap 10 |
| TS-24 | P1 | Positive | A user with 2FA enabled logs in via passkey: verify the agreed 2FA behavior | Gap 11 |

### 3.4 Error Handling & Compatibility (AC-4, AC-5)

| ID | Priority | Type | Scenario | Maps to |
|----|----------|------|----------|---------|
| TS-25 | P0 | Negative | On a browser/device **without** WebAuthn/passkey support, verify the "unsupported browser/device" message (or that the button is hidden/disabled, per Gap 10) | AC-4, AC-5 |
| TS-26 | P1 | Positive | Passkey login across the supported browser/OS matrix (e.g. Chrome, Safari, Edge, Firefox on Windows, macOS, Android, iOS: **to be confirmed**) | AC-5, Gap 10 |
| TS-27 | P1 | Positive | SSO login across the supported browser matrix | AC-5 |
| TS-28 | P2 | Negative | Third-party cookies blocked / private-browsing mode during SSO: verify the behavior or the message | AC-4, AC-5 |
| TS-29 | P1 | Positive | Every error message is user-readable, specific and actionable, with no stack traces or raw codes | AC-4 |

### 3.5 Security (AC-6)

| ID | Priority | Type | Scenario | Maps to |
|----|----------|------|----------|---------|
| TS-30 | P0 | Security | Inspect network traffic (DevTools/HAR) for SSO and passkey logins: no passwords, tokens, SAML assertions or credential secrets in URLs, query strings, console or client logs | AC-6, Gap 15 |
| TS-31 | P0 | Security | SSO uses OAuth/OIDC or SAML correctly: HTTPS only, `state`/`nonce` or `RelayState` validated, signed assertions enforced | AC-6 |
| TS-32 | P0 | Security | Passkey uses WebAuthn correctly: the challenge is single-use, origin/RP ID bound, and replaying an old assertion is rejected | AC-6 |
| TS-33 | P1 | Security | Open-redirect check: tampering with return/redirect URL parameters cannot send the user to an external domain | AC-6 |
| TS-34 | P1 | Security | Session cookies after SSO/passkey login have `Secure`, `HttpOnly` and `SameSite` set; the session is invalidated on logout | AC-6, Gap 14 |
| TS-35 | P2 | Security | Repeated failed SSO/passkey attempts: verify rate limiting/lockout (once defined) | Gap 16 |

### 3.6 Accessibility & Non-functional (ticket scenario list, gaps)

| ID | Priority | Type | Scenario | Maps to |
|----|----------|------|----------|---------|
| TS-36 | P1 | Accessibility | Both buttons are keyboard reachable (Tab order is logical), activate with Enter/Space, and have a visible focus indicator | Ticket scenario "accessibility", Gap 17 |
| TS-37 | P1 | Accessibility | Screen reader (NVDA / VoiceOver) announces the button names and error/guidance messages (e.g. via an ARIA live region) | Ticket scenario "accessibility", Gap 17 |
| TS-38 | P2 | Accessibility | Color contrast of the buttons and error text meets the agreed standard | Gap 17 |
| TS-39 | P2 | Performance | Time from button click to dashboard for SSO and passkey is within the agreed target (target TBD) | Gap 17 |
| TS-40 | P2 | Observability | SSO and passkey login success/failure events are captured in the audit log / analytics (if required) | Gap 17 |

**Traceability summary**

| AC / Gap | Scenarios |
|---|---|
| AC-1 | TS-01 – TS-05 |
| AC-2 | TS-06, TS-07, TS-09, TS-12, TS-16 |
| AC-3 | TS-17, TS-18 |
| AC-4 | TS-07, TS-09, TS-12, TS-21, TS-25, TS-28, TS-29 |
| AC-5 | TS-08, TS-23, TS-25 – TS-28 |
| AC-6 | TS-13, TS-30 – TS-34 |
| Gaps only | TS-10, TS-11, TS-14, TS-15, TS-19, TS-20, TS-22, TS-24, TS-35 – TS-40 |

---

## 4. Test Data & Environment

- **Data (needed, not yet provided):**
  - VWO test user(s) linked to each configured IdP (valid credentials)
  - IdP user with wrong password; IdP user with no VWO account; disabled VWO user
  - VWO user with a pre-registered passkey (registration is out of scope here, so it must be pre-seeded); a VWO user with no passkey
  - Users with 2FA enabled; a user belonging to multiple VWO accounts
- **Environment / flags:**
  - Target: **staging** (per the DoD). The URL is not stated in the ticket; automated runs used `app.vwo.com` and `app.wingify.com/#/login`. To be confirmed (Gap 18).
  - Feature flag name and default state: unknown (Gap 18)
  - IdP test tenants (SAML/OIDC): to be provided (Gap 4)
  - Browsers/devices: the supported passkey matrix is to be provided (Gap 10), plus at least one unsupported browser for TS-25. Platform authenticators: Windows Hello, Touch ID / Face ID, Android biometrics; optional hardware security key.
  - Tools: browser DevTools / HAR capture, a screen reader (NVDA / VoiceOver), an accessibility scanner (e.g. axe), and the existing Playwright framework in this repo for later automation
- **Roles / permissions:** Not defined in the ticket. Assume all VWO roles see the same login options until confirmed (Gap 12).

---

## 5. Risks & Assumptions

- **Assumptions made:**
  - The local export `resources/VWO-49.doc` (generated 25-Oct-2026) is the current version of the ticket.
  - "Configured identity providers" will be supplied by the team; no IdP is assumed.
  - Passkeys can be pre-registered for test users through the separate registration story or a back-end seed.
  - Existing email/password and Google login must keep working (implied by "alongside existing authentication methods").
  - The browsers named in TS-26 are only placeholders until the supported matrix is provided.
- **Risks:**
  - **High:** No test IdP tenants or passkey-seeded accounts, so P0 scenarios TS-06, TS-07, TS-17 and TS-18 cannot run. Six automated runs (10–20 Oct 2026) already ended 4/4 BLOCKED with no stated cause.
  - **High:** Undefined error/fallback copy means TS-07, TS-18, TS-21 and TS-25 have no objective pass/fail criterion.
  - **High:** Security-sensitive flow (auth bypass, token leakage, open redirect); defects here are release blockers.
  - **Medium:** Passkey behavior differs by browser/OS/authenticator, and the matrix is undefined, so coverage could be incomplete.
  - **Medium:** Dependency on external IdPs (availability, configuration drift) can cause flaky results.
  - **Medium:** Unclear interaction with 2FA and SSO-enforced accounts could create a security gap or user lock-out.
  - **Low/unknown:** The triage comment flags an unnamed "XYZ module" as a risk (Gap 19).

---

## 6. Entry / Exit criteria

- **Entry:**
  - Feature deployed to staging and the staging URL confirmed
  - Open questions 1, 2, 4, 7 and 10 answered (they block objective pass/fail)
  - Test data from §4 available (IdP tenants, SSO users, passkey-registered users)
  - Supported browser/device matrix agreed
  - The cause of the blocked automated runs identified and resolved
- **Exit:**
  - All P0 scenarios executed and passed; all P1 scenarios executed, and any failure is a logged defect that is not critical or high
  - No open critical or high defects (per the DoD)
  - Each AC (AC-1 to AC-6) has traceable, evidenced execution
  - Regression of the existing login methods passed
  - Documentation updated (per the DoD) and QA sign-off recorded by a human QA owner

---

## 7. Resource Allocation

Not specified in the ticket (assignee: Unassigned; estimates: Not Specified). **To be filled by the QA lead:** QA owner, security reviewer, accessibility tester, and the devices or device-cloud access needed.

## 8. Timelines, Sprint Details

Not specified in the ticket (Sprint: empty; Fix version: None). **To be filled by the QA lead / PO:** target sprint, test window and release date.

---

## — HUMAN REVIEW GATE —

- **I assumed:**
  - The local JIRA export is the latest ticket version (the live JIRA fetch was not possible because no credentials or `.env` were configured)
  - Existing login methods are in the regression scope
  - The browser list in TS-26 and the WCAG reference in TS-36 – TS-38 are placeholders, not requirements
- **I could not confirm:**
  - The SSO user-identification flow, the IdP list, the exact error/fallback copy, the passkey support matrix, the 2FA interplay, the test environment URL, the feature flag, and why all automated runs were BLOCKED
  - That the logo in `misc/company.png` ("TheTesting Academy") is the intended branding, since the company details describe VWO / Wingify
- **Open questions blocking sign-off:** Gaps **#1, #2, #4, #7, #10, #18 and #20** (they prevent objective pass/fail or test execution). The remaining gaps should be answered before test-case design.
- **This plan is a DRAFT, not final.** Approve or edit it before I continue to test cases or automation.

| Reviewer | Decision (Approve / Edit / Reject) | Date | Comments |
|---|---|---|---|
| | | | |

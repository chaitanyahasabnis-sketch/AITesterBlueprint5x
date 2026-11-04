# VWO Login Dashboard — Playwright + TypeScript Automation Framework

Enterprise-grade UI automation framework for the **VWO Login Dashboard** login
functionality, built with **Playwright Test** and **TypeScript** using the
**Page Object Model**, fixtures, structured exception handling and **Allure**
reporting.

- **Application under test:** https://app.wingify.com/#/login (the page is now branded *Wingify*)
- **Requirements source:** *Product Requirements Document: VWO Login Dashboard* (PRD)
- **Prompt:** [`../REAL_RICE_POT_PW.md`](../REAL_RICE_POT_PW.md) (RICE-POT format)

---

## 1. Architecture

```
PlaywrightFramework/
├── src/
│   ├── config/
│   │   └── env.ts                 # Typed, validated environment configuration (.env)
│   ├── data/
│   │   └── loginData.ts           # Negative-path data, verified routes/status codes/messages
│   ├── fixtures/
│   │   └── test.fixtures.ts       # loginPage / forgotPasswordPage fixtures + auto diagnostics
│   ├── pages/
│   │   ├── BasePage.ts            # Shared step + try/catch wrapper for every page action
│   │   ├── LoginPage.ts           # Login Page Object (locators + reusable actions)
│   │   └── ForgotPasswordPage.ts  # Forgot-password view Page Object
│   └── utils/
│       ├── errors.ts              # FrameworkError / LoginPageError + failure classification
│       └── logger.ts              # Structured logging (attached to every Allure result)
├── tests/
│   ├── login-valid.spec.ts        # Positive, UI and PRD-driven scenarios
│   ├── login-invalid.spec.ts      # Negative scenarios
│   └── support/
│       └── authAssertions.ts      # Shared "authentication rejected" assertion
├── playwright.config.ts           # Chromium / Firefox / WebKit + list/html/json/Allure reporters
├── allurerc.mjs                   # Allure 3 report config (single-file HTML)
├── tsconfig.json
├── .env.example
└── .gitignore
```

### Design principles

- **Page Object Model** — all login locators and interactions live in `LoginPage`;
  assertions live only in the spec files (and the shared `authAssertions` helper).
- **Playwright fixtures** — `loginPage` opens the login page and is injected into
  every test; an **auto fixture** records browser console, page errors and
  `POST /login` traffic, and on failure attaches a full-page screenshot, the URL
  and the classified failure reason to Allure.
- **Web-first assertions & auto-waiting** — `toBeVisible()`, `toHaveValue()`,
  `toBeFocused()`, `toHaveURL()`, `waitFor({ state })`, `waitForResponse()`.
  No `waitForTimeout`, no sleeps, no fixed waits.
- **Deterministic loading-state test** — the `POST /login` request is held with
  `page.route()` until the spinner has been asserted, then released.
- **Structured exception handling** — every page action runs through
  `BasePage.perform()`, which wraps it in a reported step and a `try/catch` that
  rethrows a typed `LoginPageError` with a category (`LOCATOR_TIMEOUT`,
  `NAVIGATION_FAILURE`, `AUTHENTICATION_FAILURE`, `BROWSER_FAILURE`,
  `UNEXPECTED_BEHAVIOUR`) and the original cause.
- **Locator strategy** — `getByRole()` first, then `getByLabel()` / `getByText()`,
  and **XPath only as a fallback** where no accessible locator exists. **No CSS
  selectors.**
- **Lifecycle management** — Playwright creates/closes a browser context per
  test; one test also creates and closes its own `browser.newContext()` explicitly
  inside `try/finally`.
- **Configuration** — base URL, credentials, worker count and timeouts come from
  environment variables; nothing sensitive is hard-coded.

---

## 2. Prerequisites

- Node.js 18+ (verified on Node 26)
- npm 9+
- **No Java required** — the HTML report is generated with Allure 3 (pure Node.js).

---

## 3. Setup

```bash
# 1. Install dependencies
npm install

# 2. Install the Playwright browsers (Chromium, Firefox, WebKit)
npx playwright install

# 3. Create your environment file from the template
#    (Windows: copy / macOS-Linux: cp)
copy .env.example .env
```

Then edit `.env`:

```ini
BASE_URL=https://app.wingify.com/#/login
VALID_EMAIL=              # only if you have a verified test account
VALID_PASSWORD=           # only if you have a verified test account
HEADLESS=true
WORKERS=2                 # keep low: the login endpoint is rate limited
```

> Credentials are **never invented**. If `VALID_EMAIL` / `VALID_PASSWORD` are
> empty, the two successful-login scenarios are reported as *skipped* with the
> reason "Requires test data" rather than faked.

---

## 4. Execution commands

| Purpose | Command |
| --- | --- |
| Install dependencies | `npm install` |
| Install Playwright browsers | `npx playwright install` |
| Run all tests (all browsers) | `npm test` |
| Run only **valid** login tests | `npm run test:valid` |
| Run only **invalid** login tests | `npm run test:invalid` |
| Run in **headed** mode | `npm run test:headed` |
| Run in **debug** mode | `npm run test:debug` |
| Run a single browser | `npm run test:chromium` / `test:firefox` / `test:webkit` |
| Headed, one browser, one worker | `npx playwright test --project=chromium --headed --workers=1` |
| Generate **Allure results** | *(produced automatically during every run → `./allure-results`)* |
| Generate the **Allure HTML report** | `npm run allure:generate` |
| Open the **Allure report** | `npm run allure:open` |
| Generate and open in one step | `npm run allure:serve` |
| Playwright HTML report | `npm run report` |
| Type-check the framework | `npm run typecheck` |
| Remove all generated output | `npm run clean` |

`npm run allure:generate` writes a **single self-contained file**,
`allure-report/index.html`, which can be opened directly or shared as-is.
Run `npm run clean` before a fresh run if you do not want results from earlier
runs merged into the next report.

---

## 5. Reporting

Every run drives four reporters simultaneously:

1. **list** — live console output.
2. **html** — the Playwright report (`playwright-report/`).
3. **json** — machine-readable results (`test-results/results.json`).
4. **allure-playwright** — raw Allure results (`allure-results/`), including
   epic/feature/story, severity, descriptions, steps for every page action,
   status, failure details, **screenshots on failure**, framework and browser
   logs, the failure category, and the Playwright trace/video for failed tests.

---

## 6. Test coverage

### Positive & UI (`tests/login-valid.spec.ts`) — 15 tests
Navigation & HTTPS (including HTTP→HTTPS redirect), element visibility, email
field (auto-focus, `type="email"`, input), password masking & visibility toggle,
Remember Me check/uncheck, Remember Me retained while filling the form,
successful login → dashboard *(needs credentials)*, Remember Me session in a new
tab *(needs credentials)*, keyboard navigation, Forgot Password navigation (and
back), Free Trial link, field validation on blur, loading state during
authentication, mobile viewport, Light/Dark mode *(skipped — not present)*.

### Negative (`tests/login-invalid.spec.ts`) — 12 tests
Unregistered email, invalid password, both invalid, empty email, empty password,
both empty, malformed email formats, verified error message, password masking /
no leakage into page text, Enter-key submission, no dashboard access after a
failed login, and no dashboard access from a fresh unauthenticated context.

### Latest results (2026-11-04)

| Run | Passed | Skipped | Failed |
| --- | --- | --- | --- |
| Headless — Chromium + Firefox + WebKit (81 tests) | 72 | 9 | 0 |
| Headed — Chromium, 1 worker (27 tests) | 24 | 3 | 0 |

The skips are the two credential-gated tests and the Light/Dark mode test,
in each browser.

---

## 7. Verified behaviour & limitations

This framework was built against the **live** login page. Locators and
assertions were checked against the real application; PRD features that could
not be verified are skipped or recorded as annotations with the observed reason,
instead of asserting invented behaviour.

- **Login endpoint:** `POST https://app.wingify.com/login`. Rejected credentials
  return **HTTP 401** and the page shows
  *"Your email, password, IP address or location did not match"*.
- **No client-side blocking:** the login form is `novalidate` and its fields are
  not `required`, so empty and malformed submissions are still sent to the
  server and rejected there with 401.
- **Rate limiting (verified):** after repeated failed attempts the endpoint
  returns **HTTP 429** (16 of the cross-browser run's attempts were throttled).
  Negative tests accept **401 or 429** as a valid rejection, always assert the
  user stays on `#/login`, and only assert the error text on 401, because the
  UI text for 429 has not been verified. Do not hammer production with this suite.
- **Dashboard guard:** opening `#/dashboard` without a session redirects to `#/login`.
- **Successful login:** skipped unless verified credentials are supplied — no
  credentials are fabricated.
- **Loading state:** while authenticating, the Sign in button gets the
  `is-in-action` class and shows a spinner.
- **Free Trial:** the link points to `vwo.com/free-trial/`, opens in a new tab,
  and currently redirects to `wingify.com/free-trial/`.
- **Light/Dark mode:** skipped — no theme control exists on the login page.
- **PRD gaps observed (recorded as annotations, not failures):**
  - The Remember Me checkbox is **not reachable with Tab**
    (order is Email → Password → Toggle → Forgot Password? → Sign in), although
    the PRD requires keyboard access to all interactive elements.
  - "Field validation on blur" only changes the field's native validity state;
    **no visible inline message** is shown.
  - Without `VALID_EMAIL`, "invalid password" cannot be distinguished from
    "unknown email"; the test records this as insufficient test data.
- **Not testable from the login UI** (out of scope here): MFA, SSO/SAML
  configuration, session timeout, password hashing/storage, GDPR compliance.
- **Locator notes:**
  - The page keeps the login, forgot-password, SSO and reset-password views in
    the DOM at the same time, and they share the same labels and placeholders.
    Login controls are therefore scoped to the login form, which has no
    accessible name and is located by XPath on its stable id `js-login-form`.
  - The Remember Me `<input>` is visually hidden; its state is read via
    `getByLabel('Remember me')` and it is toggled by clicking the visible label.
  - The error notification and the button spinner have no role or accessible
    name, so they use XPath (`js-notification-box-msg`, `span[contains(@class,"loader")]`).
  - `data-qa` attributes exist but look like generated hashes, so they are not
    relied on.

---

## 8. Anti-hallucination guarantees

- The PRD was treated as the requirements source; the live page was inspected
  before any locator was written.
- No CSS selectors, no `force: true` clicks, no `page.evaluate()`, no fixed
  sleeps. (The only in-page call is `locator.evaluate()` to read the email
  input's native `checkValidity()`, which has no web-first equivalent.)
- No credentials, UI elements, error codes or behaviours were invented; every
  assertion is traceable to the PRD or to verified application behaviour.

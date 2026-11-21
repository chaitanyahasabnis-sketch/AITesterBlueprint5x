# Test Artifacts Studio

Enter a Jira issue ID. The app reads the issue from Jira (read-only) and generates a **test plan**, a **test strategy** or **test cases** from the project templates. Each one has its own Generate button. Test cases are linked back to their requirements in the strategy's traceability summary.

**Live:** https://ch-test-artifacts-studio.vercel.app

```
02_implementation/
├── api/index.js         Vercel serverless entry (re-exports the Express app)
├── src/
│   ├── frontend/        React (Vite): Home, Generator, History, Settings; docx.js = Markdown → Word, xlsx.js = test cases → Excel
│   └── backend/
│       ├── app.js       Express API (stateless; used locally and on Vercel)
│       ├── server.js    local server: API + built UI
│       ├── config.js    env config, read-only settings on Vercel, credential binding
│       ├── jira.js      Jira fetch + requirement extraction (AC-n / REQ-n)
│       ├── llm.js       Groq / Ollama client (temperature 0, seed, 429 back-off, fallback)
│       ├── templates.js runtime template loading + Markdown section helpers
│       ├── generator.js plan / strategy / cases / traceability
│       └── tests/       mocked unit tests
├── scripts/bundle-templates.js   copies ../01_plan templates into ./templates for deployment
├── vercel.json  .vercelignore  .env.example  .gitignore  package.json  vite.config.js
```

## Prerequisites and installation
- Node.js 18.17 or later (verified on 26.x)
- Run `npm install` inside `02_implementation`

## Configuration
| Key | Required | Purpose |
|---|---|---|
| `JIRA_BASE_URL`, `JIRA_EMAIL`, `JIRA_API_TOKEN` | yes | Jira Cloud (`*.atlassian.net` uses REST v3) or Server/DC (REST v2) |
| `GROQ_API_KEY` | yes, for Groq | LLM provider |
| `GROQ_MODEL` | no | Defaults to `openai/gpt-oss-120b`. The project doesn't specify a model. |
| `LLM_PROVIDER`, `OLLAMA_BASE_URL`, `OLLAMA_MODEL` | no | Use a local Ollama, or Ollama as the fallback |
| `GROQ_TPM_LIMIT` | no | Tokens per minute on your Groq tier (default 8000). Used to size each request. |

- **Locally**, values are read from `Chapter_04_AI_Agents_Basics/.env`, or from the file named in `ENV_FILE`. Settings saved in the UI stay in server memory until restart.
- **On Vercel**, values come only from the project's **Environment Variables**. Nothing is hard-coded or uploaded. The Settings page is read-only there, and the email is shown masked.
- Secrets never reach the browser. The API only reports whether each secret is set.
- A saved Jira token is only ever sent to the saved Jira URL and email. Testing or saving a different URL or email requires entering its own token.

## Templates
- **Locally**, templates are read from `../01_plan/` every time a document is generated:
  - `00_TestPlan/test-plan-template.md`
  - `02_TestStrategy/test-strategy-template.md`
  - `01_TestCases/test-case-template.md`
- To change a template locally, edit the file. No restart is needed.
- **On Vercel**, files outside `02_implementation` aren't uploaded. `npm run bundle-templates` copies the three templates into `./templates` (gitignored) right before each deploy, so re-deploy after changing a template.
- If a template is missing, only the output that needs it fails, and the error shows the exact path.

## Run locally
```bash
npm run build      # build the React app into dist/
npm start          # API + UI on http://localhost:3001
```
For development, run `npm run dev:backend` and `npm run dev:frontend` (http://localhost:5173, proxies `/api`) in two terminals. Tests: `npm test`.

## Deploy to Vercel
```bash
npm run bundle-templates
vercel link --project ch-test-artifacts-studio        # once
vercel env add JIRA_BASE_URL production               # once per key; JIRA_API_TOKEN / GROQ_API_KEY with --sensitive
vercel deploy --prod
```
The function `api/index.js` handles `/api/*` (`maxDuration` 300 s) and the static Vite build serves the UI.

## Use
1. Open **Generator**, enter a Jira ID (e.g. `QA-123`) and click **Fetch** to preview the issue and its extracted requirements.
2. Choose a tab and click its button: **Generate Test Plan**, **Generate Test Strategy** or **Generate Test Cases**. Each button generates only that artifact. One generation runs at a time, to stay within Groq's token budget, and progress streams back as it runs.
   - The strategy uses the test plan, if you've generated one, to stay consistent with it. It fills the traceability summary (§22) from test cases that already exist. If you generate test cases afterwards, §22 updates automatically without another LLM call.
3. On each tab: **Copy**, **Regenerate**, **Download .md**. The Test Plan and Test Strategy tabs also have **Export .docx**. The Test Case tab has **Export .xlsx**, with one sheet per template section (Requirements, Test cases with the template's 10 columns, Traceability matrix, Open questions).
4. **History** lists the documents generated in this browser session. **Settings** has Test connection and Test Groq/Ollama.

## How the outputs stay traceable and deterministic
- **Requirement IDs come from code.** Acceptance criteria become `AC-1…`. Every other description item becomes `REQ-1…`, numbered in the order it appears in Jira.
- **Code fills these parts, not the LLM:**
  - Strategy §1 (Jira metadata), §4.1 (requirements table) and §22 (traceability).
  - Test case IDs (`KEY-TC-001…`), sorted by requirement order. Test cases that reference no valid requirement are discarded with a warning. Requirements with no test case are flagged.
- **The LLM fills everything else** at temperature 0 with a fixed seed. It must write "Insufficient information to determine." for missing information and mark anything not in the sources "Proposed:". Jira text is treated as data, never as instructions. If an output is missing a template heading, it gets one retry, then fails and lists the missing headings.

## Verification performed
| Check | Type | Result |
|---|---|---|
| Unit tests: key validation, ID extraction, plan/strategy/cases structure, deterministic test case IDs, untraceable cases discarded, uncovered requirements flagged, strategy with and without test cases, missing heading fails, missing template reports its path, real templates parse, credential binding, Markdown → valid .docx, test cases → valid .xlsx | **Mocked** Jira + LLM | 12/12 pass |
| `POST /api/generate/plan` generates only the plan: one LLM call, progress streamed | Live, local + Vercel | OK (TOP-5 plan in about 5 s on Vercel) |
| XLSX export of real TOP-5 test cases (97) | Node + openpyxl | 4 sheets. Test cases sheet has 98 rows × the template's 10 columns. Bold, frozen header; wrapped steps. |
| DOCX export of real TOP-5 plan and strategy outputs | Node, using the same converter | Every heading and table present (plan 10 headings / 2 tables, strategy 38 / 20) |
| Earlier full run on a 101-requirement epic (before the per-tab split) | Live | All 3 outputs passed the template check. 97 test cases. |
| Vercel: page loads, config read from env vars, Jira connected, bundled templates found, Settings read-only, email masked, redirecting the token to another host rejected | Live | OK |
| Invalid ID, unknown artifact type, wrong token | Live | Clear errors |

## Known limitations and risks
- **The live URL is public.** Anyone who has it can read issues from the configured Jira site through the app and use up the Groq quota. Turn on Vercel Deployment Protection (Settings → Deployment Protection) or add authentication if that's a concern.
- Groq's free tier allows about 8K tokens per minute. Large tickets, especially test cases for big PRDs, can take minutes. Vercel stops a function after 300 s, and the UI then reports that the connection closed.
- LLM wording can vary between runs. Structure, IDs and traceability come from code and are stable. Review every draft at the template's human review gate.
- Requirement extraction treats every description paragraph as a REQ, so background text can show up as uncovered.
- Not implemented: .docx upload, the refine-chat box, history versions and review status, and "Push to Jira" (the app is read-only). History is kept only in the browser session.
- The Ollama path wasn't tested live, and it isn't reachable from Vercel.

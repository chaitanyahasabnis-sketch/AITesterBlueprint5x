# Jira Test Artifacts Generator App (Test Artifacts Studio)

## Date
2026-11-22

## Objective
Build a lightweight React + Express app (Chapter 04, `VIBE_CODING/01_Intelligent_Test_Artifacts_AIAgent/02_implementation`) that takes a Jira issue ID, reads the issue, and generates a test plan, test strategy and test cases from the templates in `01_plan/`, with requirement-to-test-case traceability. Based on `jira-test-plan-generator-prompt.md` and the UI designs in `00_design/`.

## Tools and Technologies Used
- React 19 + Vite 8, `marked` for Markdown rendering
- Node.js 26, Express 5, dotenv
- Jira Cloud REST API v3 (read-only), Groq OpenAI-compatible API (`openai/gpt-oss-120b`), optional Ollama
- `node:test` for mocked unit tests, headless Edge for UI screenshots

## Steps Performed
1. Reviewed the 4 design PNGs, the 3 templates and the `.env` key names (no `config.md` exists, so `.env` is the config source).
2. Probed Groq: listed the available models and found the free-tier limit of 8000 tokens per minute (TPM). That limit shaped the design.
3. Inspected a real Jira epic (TOP-5, ~100 list items, no AC heading) so the extraction logic would handle real ADF content.
4. Built the backend: Jira client and requirement extractor, LLM client, runtime template loader, a section-based generator, and background jobs with polling.
5. Built the frontend pages: Home, Generator (Plan/Strategy/Case tabs), History (session only), Settings.
6. Wrote 8 mocked tests, then ran live checks against Jira and Groq.

## Code Examples
Section-based template filling: the model fills `##` sections, and code puts back the template's exact headings and validates them:
```js
const found = parsed.sections.find((p) => norm(p.heading) === norm(s.heading));
if (!found) missing.push(s.heading);           // retry once, then fail with the missing list
lines[at] = sub;                               // restore template wording of ### sub-headings
```
Deterministic test case IDs:
```js
.sort((a, b) => byId.get(a.reqIds[0]).order - byId.get(b.reqIds[0]).order || a._seq - b._seq)
.map((c, i) => ({ id: `${issue.key}-TC-${String(i + 1).padStart(3, '0')}`, ...c }))
```

## Challenges Faced
- Groq's 8K TPM limit: one request has to fit prompt plus completion within 8K, and a full run needs about 15 requests.
- The 233-line strategy template plus a 100-requirement PRD is too large for a single call.
- The LLM emitted non-breaking hyphens (`REQ‑12`), which break ID search and traceability.
- The test case template is a prompt with a "Section A–D" format, not a document skeleton.

## Solutions Implemented
- Background job plus frontend polling. On 429 the client waits for `retry-after`. `max_completion_tokens` is capped from the prompt-size estimate.
- Strategy is generated in 3 section groups. Code fills §1 (metadata), §4.1 (requirements table) and §22 (traceability), which saves tokens and keeps those parts deterministic.
- Test cases are requested as JSON in batches (at most 12 requirements or 2,500 chars per batch). A batch is split in half if it gets truncated. Code renders Section A–D using the column list parsed from the template.
- `[‐‑]` is replaced with `-` on every LLM response.
- Requirement text is abbreviated progressively for plan/strategy prompts when it's too large. IDs always stay exact.

## Key Learnings
- Keep everything that must be exact (IDs, metadata, traceability) in code, and let the LLM fill only prose and table rows inside known sections.
- Validate LLM output structurally against the template headings, with one corrective retry.
- Free-tier rate limits are an architecture constraint: design for them up front.
- Treat Jira content as data inside delimiters, and neutralise HTML before rendering model output.

## Testing and Verification
- `npm test`: 8/8 pass (**mocked** Jira and LLM).
- Live: backend start, `.env` load, template status. Jira connection test, fetch, invalid ID → 400, unknown issue → 404, bad token → 401. Groq test prompt and model list.
- Live full run on TOP-5 (101 requirements): ~4.5 min. Template check passed: plan 10/10, strategy 38/38, cases A–D. 97 test cases, 7 requirements flagged as uncovered.
- Live run on TOP-2 (empty description): all outputs generated, no test cases invented, open question raised.
- Duplicate submission returns the running job. No secrets in API responses, `src/` or `dist/`.
- Headless Edge screenshots of all 4 pages render, close to the designs.
- Not verified: the Ollama provider (no local Ollama available). The hyphen fix and the "Proposed:" prompt tweaks were added after the TOP-5 run and were checked only by the mocked tests.

## Follow-up: per-tab generation, DOCX export, Vercel deployment (same day)
- **Problem:** one "Generate test artifacts" click ran all three generators (about 15 LLM calls), which used up Groq's free-tier tokens immediately.
- **Change:** each tab now has its own button (Generate Test Plan / Test Strategy / Test Cases) that calls `POST /api/generate/:type` and generates only that artifact. One generation runs at a time. The strategy reuses an existing plan for consistency and existing test cases for traceability. Generating test cases later refreshes the strategy's §22 through `POST /api/strategy/traceability`, with no LLM call.
- **Serverless-friendly:** removed the in-memory job queue and polling, which don't survive on Vercel. Each generation streams NDJSON progress and then the result in one request. History moved to browser-session state.
- **DOCX:** `src/frontend/docx.js` converts the Markdown (headings, lists, tables, `<br>` in cells, blockquotes) to Word using the `docx` library, loaded lazily. Test Plan and Test Strategy have an "Export .docx" button.
- **Vercel:** `api/index.js` re-exports the Express app (`maxDuration` 300 s). Templates are copied into `./templates` by `npm run bundle-templates`, because files outside the deploy folder aren't uploaded. The 4 `.env` values were piped into Vercel Environment Variables, with the token and key marked sensitive. Nothing is hard-coded.
- **Security fix found while preparing the public deploy:** Settings could change the Jira URL and keep the saved token, which would have sent the token to any host. `resolveJira()` now binds the saved token to the saved URL and email. On Vercel, Settings is read-only and the email is masked.
- **Verified:** 10/10 mocked tests (adds credential binding, strategy with and without test cases, and a valid .docx). Live: the plan endpoint makes one LLM call and streams progress, locally and on Vercel (TOP-5 plan in about 5 s). Real TOP-5 plan and strategy converted to .docx with every heading and table present. Production smoke tests passed: env config, Jira connected, templates found, read-only settings, token-redirect blocked.
- **Not verified after the split:** a live strategy or test case run on Vercel. A large test case run may hit the 300 s function limit.
- **XLSX (added later):** the Test Case tab has "Export .xlsx". `src/frontend/xlsx.js` turns each `## Section` table into a sheet. It's a minimal SpreadsheetML writer on top of `fflate` (already a dependency of docx), which avoids the outdated npm `xlsx` package with its known vulnerabilities. Verified by 2 unit tests, and by an independent `openpyxl` read of the real TOP-5 file: 97 test cases × the template's 10 columns, header frozen.
- **Learning:** rate limits and serverless limits both point the same way: small, user-triggered, stateless units of work with streamed progress.

## Future Improvements
- Persist history (versions and review status per the History design).
- .docx upload and export, plus the refine-prompt box from the Generator design.
- Smarter requirement extraction (skip background/vision text, or let the user deselect items).
- Stream progress via SSE instead of polling.

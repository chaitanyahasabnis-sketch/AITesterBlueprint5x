# Fix the Jira Fetch Script and Repository Path Issues

## Date
2026-11-21

## Objective
Fix issues found in a repository health check. The main one: the advanced test-plan skill's live Jira fetch could not work as set up (wrong script name, mismatched variable names, no `.env` loading, missing `jq`, empty Python script). Also tidy several smaller path and content issues.

## Tools and Technologies Used
- Python 3 standard library (`urllib`, `json`, `base64`) for the new fetch script
- Bash, curl, jq (existing shell script)
- `python-docx` (temporary virtual environment) to edit a DOCX in place
- A local `http.server` mock of the Jira REST API for testing

## Steps Performed
1. Health check: scanned for secrets, tracked build output, broken path references, absolute local paths; type-checked the Playwright framework.
2. Wrote `scripts/fetch-jira.py` (was 0 lines): reads `JIRA_BASE_URL`, `JIRA_EMAIL`, `JIRA_API_TOKEN` from the environment or the nearest `.env`, calls `/rest/api/3/issue/{key}`, and prints compact JSON with a plain-text `description_text` flattened from Atlassian Document Format.
3. Updated `scripts/fetch-jira.sh`: correct name in usage text, `.env` loading, `JIRA_API_TOKEN` (old `JIRA_TOKEN` still accepted), a clear message when `jq` is missing.
4. Added `.env.example` to the skill folder.
5. `SKILL.md`: points to `fetch-jira.py` (the old reference was `fetch_jira.sh`, a file that does not exist), lists the correct variables, fixes typos.
6. Replaced hard-coded `D:\MyGitHub\...` PRD paths with repo-relative paths in `anti-hallucination-rules.md` and `RICEPOT_Template_with_anti-hallucination.md`.
7. Fixed the outdated `Chapter_02_Prompt_Engineering_QA` path inside `VWO_Login_Test_Cases.docx`.
8. Filled in the 2026-11-14 run dates in `Chapter_03_Prompt_Engineering_QA/MyNotes.md`.
9. README Configuration section: `.env` location and how to test the connection.

## Code Examples
`.env` discovery stops at the repository root, so it never reads a file outside the repo:
```python
def find_env_file(start: Path) -> Path | None:
    for folder in [start, *start.parents]:
        if (folder / ".env").is_file():
            return folder / ".env"
        if (folder / ".git").exists():
            break
    return None
```

## Challenges Faced
- Three names were in use for the same thing: `fetch_jira.sh` vs `fetch-jira.sh`, and `JIRA_TOKEN` vs `JIRA_API_TOKEN`.
- `jq` is not installed on this Windows machine, so the shell script could never run here.
- No real Jira credentials were available for testing.
- Java/Maven are not on this terminal's PATH, so the Selenium framework could not be compiled.

## Solutions Implemented
- Standardised on `fetch-jira.*` and `JIRA_API_TOKEN`, keeping `JIRA_TOKEN` as a fallback so existing `.env` files still work.
- Made the standard-library Python script the primary path; it needs no extra installs.
- Tested against a local mock Jira server instead of the real one.

## Key Learnings
- A skill is only as reliable as the exact script names and variable names it cites; one character (`_` vs `-`) silently breaks it, and the agent then falls back to a local export.
- Keep README, skill instructions and script in agreement. Ideally one place (`.env.example`) defines the variable names.
- Absolute local paths in prompts break for anyone who clones the repo.

## Testing and Verification
Against a local mock Jira API (temporary copy of the script in a scratch folder):
- No args → usage message, exit 1.
- Malformed key → clear error, exit 1.
- No credentials and no `.env` → lists missing variables, exit 1.
- `.env` with legacy `JIRA_TOKEN`, lowercase key → exit 0; asserted key, flattened description, links.
- Environment variable overriding `.env` with a wrong token → "HTTP 401 … check JIRA_EMAIL / JIRA_API_TOKEN", exit 2.

Also: `bash -n fetch-jira.sh` passed, Playwright `tsc --noEmit` passed, the DOCX was reopened to confirm the old path is gone (0 remaining).

Selenium framework: JDK 21 and Maven 3.9.9 were already installed under `C:\Users\User\tools` but not on PATH. After adding `JAVA_HOME`, `MAVEN_HOME` and both `bin` folders to the user PATH, `mvn -B clean test -Dheadless=true` gave **BUILD SUCCESS**: 10 tests run, 0 failures, 0 errors, 1 skipped (`verifyValidLogin`, skipped by design because `SF_USERNAME` / `SF_PASSWORD` are not set). The Allure single-file report was generated in `target/allure-report/`. A harmless SLF4J "StaticLoggerBinder" warning appears in the log.

**Not verified:** a call to the real Jira instance, and the Salesforce valid-login test (needs real credentials).

## Future Improvements
- Run `python scripts/fetch-jira.py VWO-49` with real credentials and regenerate the VWO-49 test plan from the live ticket.
- Run the Selenium valid-login test with `SF_USERNAME` / `SF_PASSWORD` set for a test org.
- Remove the SLF4J warning by aligning the SLF4J versions on the test classpath.

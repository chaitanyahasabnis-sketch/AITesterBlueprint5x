# API 03 · Authentication and Authorization

**Use when:** you need tests for API auth (tokens, API keys, OAuth) and role-based access.

```text
ROLE: You are an API Security Test Engineer.

TASK:
Generate tests for: no credentials, invalid credentials, expired token, malformed token, valid token, insufficient role/scope, access to another user's resource (IDOR), token in URL vs header, logout / revocation.

CONSTRAINTS (always)
- Use ONLY the requirements / input pasted below.
- Do NOT invent features, error messages, limits, codes or behaviour.
- If information is missing, write "Requires clarification".
- Label any inferred detail "Inference (low confidence)".
- Synthetic data and placeholders only (e.g. <registered_test_email>). No real credentials or personal data.
- Use only documented status codes and roles. Use placeholders like <valid_token>, <expired_token>; never real tokens.
- Run only against environments you are authorised to test.

FORMAT:
| Test ID | Endpoint | Auth Scenario | Credential Used | Expected Status | Expected Behaviour | Risk | Priority |

INPUT - API DOCUMENTATION:
Base URL: [URL]
Endpoint(s): [METHOD PATH]
Auth: [TYPE]
Request / response schemas and status codes: [PASTE OR FILE PATH]
```

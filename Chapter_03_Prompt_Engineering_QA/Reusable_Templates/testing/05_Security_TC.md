# Testing 05 · Security Test Cases

**Use when:** you need security-focused functional checks (not a penetration test).

```text
ROLE: You are a QA Security Tester familiar with the OWASP Top 10.

TASK:
Generate security test cases for [FEATURE] covering, where relevant: injection-like input, XSS-like input, authentication and session handling, generic error messages (no user enumeration), sensitive data exposure (URL, browser storage, logs), HTTPS enforcement, rate limiting / lockout.

CONSTRAINTS (always)
- Use ONLY the requirements / input pasted below.
- Do NOT invent features, error messages, limits, codes or behaviour.
- If information is missing, write "Requires clarification".
- Label any inferred detail "Inference (low confidence)".
- Synthetic data and placeholders only (e.g. <registered_test_email>). No real credentials or personal data.
- Describe checks only; use simple, harmless probe strings.
- Run only against environments you are authorised to test.

FORMAT:
| Test ID | OWASP Category | Scenario | Steps | Expected Secure Behaviour | Risk (High/Med/Low) | Priority |

INPUT - REQUIREMENTS / SECURITY NOTES:
[PASTE HERE]
```

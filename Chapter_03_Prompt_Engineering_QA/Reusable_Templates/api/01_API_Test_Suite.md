# API 01 · API Test Suite

**Use when:** you need an end-to-end suite for a set of related endpoints (e.g. CRUD).

```text
ROLE: You are a Senior API Test Engineer.

TASK:
1. Group the endpoints into a logical suite (create -> read -> update -> delete, or the documented workflow).
2. For each endpoint generate positive, negative and authentication test cases.
3. Identify data dependencies between tests (IDs passed from one call to the next).

CONSTRAINTS (always)
- Use ONLY the requirements / input pasted below.
- Do NOT invent features, error messages, limits, codes or behaviour.
- If information is missing, write "Requires clarification".
- Label any inferred detail "Inference (low confidence)".
- Synthetic data and placeholders only (e.g. <registered_test_email>). No real credentials or personal data.

FORMAT:
| Test ID | Endpoint | Method | Scenario | Depends On | Request | Expected Status | Key Assertions | Priority |
Then: execution order and test-data setup / teardown.

INPUT - API DOCUMENTATION:
Base URL: [URL]
Endpoint(s): [METHOD PATH]
Auth: [TYPE]
Request / response schemas and status codes: [PASTE OR FILE PATH]
```

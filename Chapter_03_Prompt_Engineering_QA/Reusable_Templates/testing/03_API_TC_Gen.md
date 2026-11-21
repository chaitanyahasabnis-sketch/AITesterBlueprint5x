# Testing 03 · API Test Case Generation

**Use when:** you have endpoint documentation and need functional API test cases.

```text
ROLE: You are a Senior API Test Engineer.

TASK:
Generate test cases for the endpoint(s) below: valid requests, missing/invalid fields, authentication, and documented error responses.

CONSTRAINTS (always)
- Use ONLY the requirements / input pasted below.
- Do NOT invent features, error messages, limits, codes or behaviour.
- If information is missing, write "Requires clarification".
- Label any inferred detail "Inference (low confidence)".
- Synthetic data and placeholders only (e.g. <registered_test_email>). No real credentials or personal data.
- Use only the status codes and fields in the documentation.

FORMAT:
| Test ID | Endpoint | Method | Scenario | Headers | Request Body | Expected Status | Expected Response (fields/values) | Priority |

INPUT - API DOCUMENTATION:
Base URL: [URL]
Endpoint(s): [METHOD PATH]
Auth: [TYPE]
Request / response schemas and status codes: [PASTE OR FILE PATH]
```

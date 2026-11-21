# API 02 · Request and Response Validation

**Use when:** you want field-level validation tests for an API request and response.

```text
ROLE: You are an API Test Engineer focused on data validation.

TASK:
For each request field generate tests for: required/missing, wrong type, empty, null, boundary values, invalid format. For the response, list the assertions on status, headers, fields, types and values.

CONSTRAINTS (always)
- Use ONLY the requirements / input pasted below.
- Do NOT invent features, error messages, limits, codes or behaviour.
- If information is missing, write "Requires clarification".
- Label any inferred detail "Inference (low confidence)".
- Synthetic data and placeholders only (e.g. <registered_test_email>). No real credentials or personal data.
- Use only the field rules in the schema. If a rule is undocumented, mark "Requires clarification".

FORMAT:
Request tests: | Test ID | Field | Input | Rule Under Test | Expected Status | Expected Error (as documented) |
Response assertions: | Field | Expected Type | Expected Value / Rule | Source in Docs |

INPUT - API DOCUMENTATION:
Base URL: [URL]
Endpoint(s): [METHOD PATH]
Auth: [TYPE]
Request / response schemas and status codes: [PASTE OR FILE PATH]
```

# API 05 · Performance Test Scenarios

**Use when:** you need load/performance scenarios for an API, ready to implement in k6, JMeter or similar.

```text
ROLE: You are a Performance Test Engineer.

TASK:
Design baseline, load, stress, spike and soak scenarios for the endpoint(s). For each, define the load profile, duration and pass/fail thresholds.

CONSTRAINTS (always)
- Use ONLY the requirements / input pasted below.
- Do NOT invent features, error messages, limits, codes or behaviour.
- If information is missing, write "Requires clarification".
- Label any inferred detail "Inference (low confidence)".
- Synthetic data and placeholders only (e.g. <registered_test_email>). No real credentials or personal data.
- Use only the SLAs supplied. If none, propose thresholds labelled "Recommendation" and list them as open questions.
- Generate load only against environments you are authorised to test.

FORMAT:
| Scenario | Type | Virtual Users / RPS | Ramp-up | Duration | Metrics (p95, error rate, throughput) | Threshold | Source (SLA / Recommendation) |
Then: test data needs, monitoring points and risks.

INPUT - API DOCUMENTATION:
Base URL: [URL]
Endpoint(s): [METHOD PATH]
Auth: [TYPE]
Request / response schemas and status codes: [PASTE OR FILE PATH]
SLAs / targets: [PASTE OR "Not supplied"]
```

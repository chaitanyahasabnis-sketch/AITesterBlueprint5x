# Test Plan Template

Use this skeleton for every functional test plan generated from a Chapter 03 prompt (for example `STAR.md`).
Fill each section **only** from the supplied requirements. Where a detail is not supplied, write **"Requires clarification"**. Label any proposed criteria or numbers as **Recommendation**.

---

## 0. Document Control

| Field | Value |
|-------|-------|
| Test Plan ID | TP-[PROJECT]-[MODULE]-[NNN] |
| Title | [Module] Functional Test Plan |
| Application / URL | [Application name and URL] |
| Version | 0.1 (Draft, pending review) |
| Prepared by | [QA name] |
| Date | [YYYY-MM-DD] |
| Status | Draft: not final until approved in Section 12 |

## 1. Objective

- What this plan verifies and why.
- The requirements in scope, listed with IDs (REQ-01, REQ-02, …).

## 2. Scope

### 2.1 In Scope
- Features, flows and fields that will be tested.

### 2.2 Out of Scope
- Features explicitly not tested in this cycle, with a reason.

## 3. Test Approach / Strategy

- Test levels (functional, integration, UI, etc.).
- Test design techniques (Equivalence Partitioning, Boundary Value Analysis, Decision Table, Error Guessing). Use them only where the supplied requirements support them.
- Manual vs automation split.
- Defect reporting process: tool, severity/priority definitions, triage owner.

## 4. Test Scenarios

| Scenario ID | Requirement ID | Scenario | Type (Positive / Negative / Boundary) | Priority (P0/P1/P2) | Requirement Status (Confirmed / Requires clarification) |
|-------------|----------------|----------|---------------------------------------|---------------------|--------------------------------------------------------|
| TS-01 | REQ-01 | | | | |

## 5. Test Environment

| Item | Detail |
|------|--------|
| Environment / URL | |
| Browsers / Devices | |
| Operating Systems | |
| Test Accounts | Placeholders only, e.g. `<registered_test_email>` |

## 6. Test Data

| Data Set | Purpose | Example (synthetic) |
|----------|---------|---------------------|
| Valid credentials | Positive login | `<registered_test_email>` / `<valid_password>` |

## 7. Entry and Exit Criteria

### 7.1 Entry Criteria
- [ ] Requirements reviewed
- [ ] Build deployed to the test environment
- [ ] Test data and accounts available

### 7.2 Exit Criteria
- [ ] All P0 scenarios executed
- [ ] No open Critical / High defects (or accepted with sign-off)

## 8. Schedule

| Activity | Owner | Start | End |
|----------|-------|-------|-----|
| Test design | | | |
| Execution | | | |
| Reporting | | | |

## 9. Deliverables

- Test plan (this document)
- Test cases
- Defect reports
- Test summary report

## 10. Tools

| Purpose | Tool |
|---------|------|
| Test management | |
| Defect tracking | |
| Automation | |

## 11. Risks, Assumptions and Open Questions

| ID | Type (Risk / Assumption / Open Question) | Description | Impact | Mitigation / Owner |
|----|------------------------------------------|-------------|--------|--------------------|
| R-01 | | | | |

## 12. Approvals

| Role | Name | Decision | Date |
|------|------|----------|------|
| QA Lead | | Pending | |
| Product Owner | | Pending | |
| Dev Lead | | Pending | |

> This plan is a draft. It is not final until every approver above has signed off.

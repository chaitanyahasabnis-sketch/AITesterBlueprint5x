---
name: "testcase-creator-skill"
description: "Create test cases from a PRD, user story or requirement using the team's test case template, and export them as CSV, XLSX and HTML. Use when the user says 'create test cases for X', 'write test cases from this PRD', or shares requirements and asks for test cases."
version: "1.1.0"
author: "Chaitanya Hasabnis"
license: "MIT"
tags:
  - testcase
---

# Test Case Creator

Create test cases from the requirements the user shares, in the column template the user's team uses.

## Core Principles

1. Use only the information the user provides (PRD, story, requirement text, template).
2. Do not invent requirements, validation rules, limits or error messages. Write "Requires clarification" where something is not specified.

## When to Use

- The user shares a PRD, user story or requirement and asks for test cases.
- The user says "create a test case for X" or "write test cases for this feature".

## Inputs to collect

Ask for anything that is missing before generating:

| Input | Placeholder | If not supplied |
|-------|-------------|-----------------|
| Company / project name | `[COMPANY / PROJECT]` | Ask the user. Do not assume a company. |
| Requirements | `[PRD / USER STORY / REQUIREMENT TEXT]` | Ask the user. Do not proceed without it. |
| Test case template (column headings) | `[TEMPLATE COLUMNS]` | Offer the default template below and confirm before using it. |
| Output folder | `[OUTPUT FOLDER]` | Use `Chapter_00_SKILL_Basics/output/`. |

## Default template

Use these columns only if the user has not supplied their own template and has confirmed this one:

Scenario_TID | TestCase Description | PreCondition | TestSteps | Expected Result | Actual Result | Steps to Execute | Expected Result | Actual Result | Status | Executed QA Name | Misc (Comments) | Priority | Is_Automated

## Steps

1. Confirm the inputs above.
2. Number the requirements (REQ-01, REQ-02, ...) if they have no IDs.
3. Write test cases in the confirmed template: positive, negative and boundary cases where the requirements support them. Leave execution columns (Actual Result, Status, Executed QA Name) empty.
4. Name files `[COMPANY / PROJECT]_[FEATURE]_Test_Cases.{csv,xlsx,html}`.
5. List open questions (anything marked "Requires clarification").

## Output

- CSV, XLSX and HTML files with the same content.
- A short summary: number of test cases by priority, and the open questions.

## Security and Safety

- Do not include personal information, real credentials or anything risky in the output. Use placeholders such as `<registered_test_email>`.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { unzipSync, strFromU8 } from 'fflate';
import { sheetsFromMarkdown, buildXlsx } from '../xlsx.js';

const md = `# Test Cases — QA-1: Login

> Status: **DRAFT — pending human review.**

## Section A - Requirements

| REQ ID | Requirement | PRD Section |
| --- | --- | --- |
| AC-1 | Reset link is emailed | QA-1 / Description |

## Section B - Test cases

| Test ID | REQ ID | Scenario | Steps | Expected Result |
| --- | --- | --- | --- | --- |
| QA-1-TC-001 | AC-1 | Valid & "quoted" \\| piped | 1. Open<br>2. Submit <registered_test_email> | Insufficient information to determine. |

## Section C - Traceability matrix

| REQ ID | Test IDs |
| --- | --- |
| AC-1 | QA-1-TC-001 |

## Section D - Open questions

None raised.`;

test('test case markdown becomes one sheet per template section', () => {
  const sheets = sheetsFromMarkdown(md);
  assert.deepEqual(sheets.map((s) => s.name), ['Requirements', 'Test cases', 'Traceability matrix', 'Open questions']);
  const tc = sheets[1];
  assert.deepEqual(tc.rows[0], ['Test ID', 'REQ ID', 'Scenario', 'Steps', 'Expected Result']);
  assert.equal(tc.rows[1][2], 'Valid & "quoted" | piped');
  assert.equal(tc.rows[1][3], '1. Open\n2. Submit <registered_test_email>');
  assert.deepEqual(sheets[3].rows, [['None raised.']]);
});

test('workbook is a valid xlsx package with escaped inline strings', () => {
  const files = unzipSync(buildXlsx(sheetsFromMarkdown(md)));
  for (const f of ['[Content_Types].xml', '_rels/.rels', 'xl/workbook.xml', 'xl/_rels/workbook.xml.rels', 'xl/styles.xml', 'xl/worksheets/sheet4.xml']) assert.ok(files[f], f);
  const s2 = strFromU8(files['xl/worksheets/sheet2.xml']);
  assert.match(s2, /Valid &amp; &quot;quoted&quot; \| piped/);
  assert.match(s2, /&lt;registered_test_email&gt;/);
  assert.match(s2, /state="frozen"/);
  assert.match(strFromU8(files['xl/workbook.xml']), /name="Test cases"/);
});

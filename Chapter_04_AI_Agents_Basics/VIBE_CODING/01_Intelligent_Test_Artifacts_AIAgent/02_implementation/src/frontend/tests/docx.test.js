import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as d from 'docx';
import { buildDocument } from '../docx.js';

const md = `# Test Plan — QA-1: Login

> Status: **DRAFT — pending human review.**

## 1. Scope & Objectives
- **In scope:** login form
- Nested
  - child item

## 3. Test Scenarios
| ID | Priority | Scenario |
|----|----------|----------|
| TS-1 | Proposed: P0 | Valid login<br>2. check <registered_test_email> |

1. first
2. second

---
## HUMAN REVIEW GATE
Done & dusted.`;

test('markdown converts to a valid .docx with headings, tables and lists', async () => {
  const buf = await d.Packer.toBuffer(buildDocument(md, 'Test Plan — QA-1', d));
  assert.equal(buf.subarray(0, 2).toString(), 'PK'); // zip container
  const { unzipSync, strFromU8 } = await import('fflate'); // docx's own zip dependency
  const xml = strFromU8(unzipSync(new Uint8Array(buf))['word/document.xml']);
  for (const text of ['Test Plan — QA-1: Login', '1. Scope &amp; Objectives', 'HUMAN REVIEW GATE', 'TS-1', 'Proposed: P0', '&lt;registered_test_email&gt;', 'child item', 'Done &amp; dusted.']) {
    assert.ok(xml.includes(text), `missing: ${text}`);
  }
  assert.match(xml, /<w:tbl>/);
  assert.match(xml, /Heading1/);
  assert.match(xml, /<w:br\/>/); // <br> inside a table cell became a line break
});

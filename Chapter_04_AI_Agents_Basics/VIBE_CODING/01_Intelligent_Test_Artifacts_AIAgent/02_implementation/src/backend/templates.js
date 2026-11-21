// Loads the authoritative templates from 01_plan at request time and provides Markdown section helpers.
import fs from 'node:fs';
import path from 'node:path';
import { AppError, TEMPLATE_DIR } from './config.js';

export const TEMPLATE_FILES = {
  plan: '00_TestPlan/test-plan-template.md',
  strategy: '02_TestStrategy/test-strategy-template.md',
  cases: '01_TestCases/test-case-template.md',
};

export function loadTemplate(type) {
  const file = path.join(TEMPLATE_DIR, TEMPLATE_FILES[type]);
  try {
    return fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
  } catch {
    throw new AppError(500, 'TEMPLATE_MISSING', `Template not found or unreadable: ${file}`);
  }
}

export function templateStatus() {
  return Object.entries(TEMPLATE_FILES).map(([type, rel]) => ({
    type,
    path: rel,
    ok: fs.existsSync(path.join(TEMPLATE_DIR, rel)),
  }));
}

export const stripComments = (s) => s.replace(/<!--[\s\S]*?-->\n?/g, '');
export const norm = (h) => h.replace(/^#+\s*/, '').replace(/[*_`]/g, '').replace(/\s+/g, ' ').trim().toLowerCase();

function linesOutsideFences(md, fn) {
  let fence = false;
  for (const line of md.split('\n')) {
    if (/^\s*```/.test(line)) fence = !fence;
    fn(line, fence);
  }
}

/** Splits Markdown into a preamble and level-2 ("## ") sections. */
export function splitSections(md) {
  const preamble = [];
  const sections = [];
  let cur = null;
  linesOutsideFences(md, (line, fence) => {
    if (!fence && /^## /.test(line)) {
      cur = { heading: line.trim(), body: [] };
      sections.push(cur);
    } else (cur ? cur.body : preamble).push(line);
  });
  return { preamble: preamble.join('\n'), sections: sections.map((s) => ({ heading: s.heading, body: s.body.join('\n') })) };
}

export function headingsOf(md) {
  const out = [];
  linesOutsideFences(md, (line, fence) => {
    if (!fence && /^#{1,6} /.test(line)) out.push(line.trim());
  });
  return out;
}

/** Checks that every template heading appears in the output, in order. */
export function checkHeadings(templateMd, outputMd) {
  const expected = headingsOf(stripComments(templateMd));
  const actual = headingsOf(outputMd).map(norm);
  const missing = [];
  let i = 0;
  for (const h of expected) {
    const at = actual.indexOf(norm(h), i);
    if (at === -1) missing.push(h);
    else i = at + 1;
  }
  return { ok: missing.length === 0, expected: expected.length, missing };
}

/** Replaces the body under a heading (until the next heading of the same or higher level). */
export function replaceUnderHeading(md, headingMatcher, newBody) {
  const lines = md.split('\n');
  const start = lines.findIndex((l) => /^#{2,6} /.test(l) && headingMatcher.test(l));
  if (start === -1) return md;
  const level = lines[start].match(/^#+/)[0].length;
  let end = lines.length;
  for (let i = start + 1; i < lines.length; i++) {
    const m = lines[i].match(/^(#+) /);
    if (m && m[1].length <= level) {
      end = i;
      break;
    }
  }
  return [...lines.slice(0, start + 1), '', newBody.trim(), '', ...lines.slice(end)].join('\n');
}

/** Returns the header + separator lines of the first Markdown table under a heading. */
export function tableHeaderUnder(md, headingMatcher) {
  const lines = md.split('\n');
  const start = lines.findIndex((l) => /^#{2,6} /.test(l) && headingMatcher.test(l));
  if (start === -1) return null;
  for (let i = start + 1; i < lines.length - 1; i++) {
    if (/^#{1,6} /.test(lines[i])) return null;
    if (lines[i].startsWith('|') && /^\|[\s:|-]+\|$/.test(lines[i + 1].trim())) return [lines[i], lines[i + 1]];
  }
  return null;
}

export const cell = (v) => String(v ?? '').replace(/\|/g, '\\|').replace(/\r?\n/g, '<br>').trim();
export const row = (cells) => `| ${cells.map(cell).join(' | ')} |`;

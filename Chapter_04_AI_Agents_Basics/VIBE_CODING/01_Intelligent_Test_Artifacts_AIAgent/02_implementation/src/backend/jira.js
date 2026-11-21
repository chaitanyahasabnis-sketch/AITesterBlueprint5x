// Read-only Jira client: fetches one issue and extracts metadata + requirements with stable IDs.
import { AppError } from './config.js';

const KEY_RE = /^[A-Z][A-Z0-9_]*-\d+$/;

export function normalizeKey(raw) {
  const key = String(raw || '').trim().toUpperCase();
  if (!KEY_RE.test(key)) {
    throw new AppError(400, 'INVALID_ISSUE_ID', `"${String(raw || '').slice(0, 40)}" is not a valid Jira issue ID. Expected a format like QA-123.`);
  }
  return key;
}

function assertConfig(jira) {
  const missing = [];
  if (!jira.baseUrl) missing.push('JIRA_BASE_URL');
  if (!jira.email) missing.push('JIRA_EMAIL');
  if (!jira.token) missing.push('JIRA_API_TOKEN');
  if (missing.length) throw new AppError(500, 'MISSING_CONFIG', `Jira configuration is incomplete. Missing: ${missing.join(', ')}.`);
}

// Jira Cloud (atlassian.net) uses REST v3 (ADF descriptions); Server/Data Center uses v2.
const apiVersion = (baseUrl) => (/\.atlassian\.net$/i.test(new URL(baseUrl).hostname) ? 3 : 2);

async function jiraGet(jira, pathname) {
  assertConfig(jira);
  let url;
  try {
    url = `${jira.baseUrl}/rest/api/${apiVersion(jira.baseUrl)}${pathname}`;
  } catch {
    throw new AppError(500, 'MISSING_CONFIG', 'JIRA_BASE_URL is not a valid URL.');
  }
  let res;
  try {
    res = await fetch(url, {
      headers: {
        Authorization: 'Basic ' + Buffer.from(`${jira.email}:${jira.token}`).toString('base64'),
        Accept: 'application/json',
      },
      signal: AbortSignal.timeout(20000),
    });
  } catch {
    throw new AppError(502, 'NETWORK_ERROR', 'Could not reach Jira. Check JIRA_BASE_URL and your network connection.');
  }
  if (res.status === 401) throw new AppError(401, 'AUTH_FAILED', 'Jira rejected the credentials. Check JIRA_EMAIL and JIRA_API_TOKEN.');
  if (res.status === 403) throw new AppError(403, 'PERMISSION_DENIED', 'The Jira account does not have permission for this request.');
  if (res.status === 404) return { notFound: true };
  if (!res.ok) throw new AppError(502, 'JIRA_ERROR', `Jira returned HTTP ${res.status}.`);
  return { data: await res.json() };
}

export async function testJira(jira) {
  const r = await jiraGet(jira, '/myself');
  if (r.notFound) throw new AppError(502, 'JIRA_ERROR', 'Jira API not found at JIRA_BASE_URL.');
  return { ok: true };
}

export async function fetchIssue(rawKey, jira) {
  const key = normalizeKey(rawKey);
  const r = await jiraGet(jira, `/issue/${encodeURIComponent(key)}?expand=names`);
  if (r.notFound) throw new AppError(404, 'ISSUE_NOT_FOUND', `Issue ${key} does not exist or this account cannot view it.`);
  return normalizeIssue(r.data, jira.baseUrl);
}

// ---------- extraction ----------

function inlineText(node) {
  if (!node) return '';
  if (node.type === 'text') return node.text || '';
  if (node.type === 'hardBreak') return ' ';
  if (['mention', 'emoji', 'status'].includes(node.type)) return node.attrs?.text || '';
  if (['inlineCard', 'blockCard'].includes(node.type)) return node.attrs?.url || '';
  if (node.type === 'date') return node.attrs?.timestamp ? new Date(Number(node.attrs.timestamp)).toISOString().slice(0, 10) : '';
  return (node.content || []).map(inlineText).join('');
}

const clean = (s) => String(s || '').replace(/\s+/g, ' ').trim();

// Flattens an ADF document into ordered blocks: headings and text items (paragraphs, list items, table rows).
export function adfToBlocks(doc) {
  const out = [];
  const visit = (node) => {
    if (!node) return;
    switch (node.type) {
      case 'heading':
        out.push({ kind: 'heading', level: node.attrs?.level || 1, text: clean(inlineText(node)) });
        break;
      case 'paragraph':
      case 'codeBlock':
        if (clean(inlineText(node))) out.push({ kind: 'item', text: clean(inlineText(node)) });
        break;
      case 'listItem': {
        const own = (node.content || []).filter((c) => !['bulletList', 'orderedList'].includes(c.type));
        const text = clean(own.map(inlineText).join(' '));
        if (text) out.push({ kind: 'item', text });
        (node.content || []).filter((c) => ['bulletList', 'orderedList'].includes(c.type)).forEach(visit);
        break;
      }
      case 'tableRow': {
        const cells = (node.content || []).map((c) => clean(inlineText(c)));
        const isHeader = (node.content || []).every((c) => c.type === 'tableHeader');
        if (!isHeader && cells.some(Boolean)) out.push({ kind: 'item', text: cells.join(' | ') });
        break;
      }
      default:
        (node.content || []).forEach(visit);
    }
  };
  visit(doc);
  return out;
}

// Jira Server wiki markup / plain text fallback.
export function textToBlocks(text) {
  return String(text || '')
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => {
      const h = l.match(/^h([1-6])\.\s*(.*)$/) || l.match(/^(#{1,6})\s+(.*)$/);
      if (h) return { kind: 'heading', level: Number(h[1]) || h[1].length, text: clean(h[2]) };
      return { kind: 'item', text: clean(l.replace(/^([*#\-]+|\d+[.)])\s+/, '')) };
    })
    .filter((b) => b.text);
}

const toBlocks = (value) => (value && typeof value === 'object' ? adfToBlocks(value) : textToBlocks(value));

export function normalizeIssue(raw, baseUrl) {
  const f = raw.fields || {};
  const names = raw.names || {};
  const key = raw.key;
  const issue = {
    key,
    summary: f.summary || '',
    type: f.issuetype?.name || '',
    project: f.project ? `${f.project.name} (${f.project.key})` : '',
    status: f.status?.name || '',
    priority: f.priority?.name || '',
    fixVersions: (f.fixVersions || []).map((v) => v.name),
    components: (f.components || []).map((c) => c.name),
    labels: f.labels || [],
    url: `${baseUrl}/browse/${key}`,
    retrievedAt: new Date().toISOString(),
  };

  // Requirements, numbered in the order they appear in Jira.
  const reqs = [];
  let ac = 0;
  let rq = 0;
  const add = (text, isAc, source) => {
    const id = isAc ? `AC-${++ac}` : `REQ-${++rq}`;
    reqs.push({ id, text, source: `${key} / ${source}`, order: reqs.length });
  };

  const path = [];
  let acLevel = null;
  for (const b of toBlocks(f.description)) {
    if (b.kind === 'heading') {
      while (path.length && path[path.length - 1].level >= b.level) path.pop();
      path.push(b);
      if (acLevel !== null && b.level <= acLevel) acLevel = null;
      if (/acceptance\s+criteria/i.test(b.text)) acLevel = b.level;
      continue;
    }
    const section = ['Description', ...path.map((p) => p.text)].join(' › ');
    add(b.text, acLevel !== null, section);
  }

  // Dedicated "Acceptance Criteria" custom field, if the site has one.
  for (const [fieldId, name] of Object.entries(names)) {
    if (/acceptance\s+criteria/i.test(name) && f[fieldId]) {
      for (const b of toBlocks(f[fieldId])) if (b.kind === 'item') add(b.text, true, name);
    }
  }

  issue.requirements = reqs;
  issue.descriptionPreview = reqs.slice(0, 2).map((r) => r.text).join(' ').slice(0, 220);
  return issue;
}

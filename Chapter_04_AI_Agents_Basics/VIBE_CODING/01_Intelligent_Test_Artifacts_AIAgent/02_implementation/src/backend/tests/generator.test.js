// MOCKED checks: Jira and the LLM are simulated. These do not prove a live integration.
import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

process.env.ENV_FILE = 'does-not-exist.env'; // never load real credentials in tests
let jira, gen, tpl;
before(async () => {
  jira = await import('../jira.js');
  gen = await import('../generator.js');
  tpl = await import('../templates.js');
});

const LLM = { provider: 'groq', groqKey: 'mock-key', groqModel: 'mock-model', fallback: false };

const adf = {
  type: 'doc',
  content: [
    { type: 'paragraph', content: [{ type: 'text', text: 'As a user I can reset my password.' }] },
    { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: 'Acceptance Criteria' }] },
    { type: 'bulletList', content: ['Reset link is emailed', 'Link expires after use', 'Unknown email shows a neutral message'].map((t) => ({ type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: t }] }] })) },
    { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: 'Notes' }] },
    { type: 'paragraph', content: [{ type: 'text', text: 'Applies to web only.' }] },
  ],
};
const rawIssue = {
  key: 'QA-123',
  names: {},
  fields: { summary: 'Password reset', issuetype: { name: 'Story' }, project: { name: 'Demo', key: 'QA' }, status: { name: 'To Do' }, priority: { name: 'High' }, fixVersions: [], components: [], labels: ['auth'], description: adf },
};

// Mock LLM: echoes requested template sections; for JSON requests returns test cases.
function mockFetch({ dropHeading = false, uncovered = 'AC-3' } = {}) {
  globalThis.fetch = async (url, init) => {
    const body = JSON.parse(init.body);
    const user = body.messages.at(-1).content;
    let content;
    if (body.response_format) {
      const ids = [...user.matchAll(/^((?:AC|REQ)-\d+) \[/gm)].map((m) => m[1]).filter((id) => id !== uncovered);
      content = JSON.stringify({
        testCases: [
          ...ids.reverse().map((id) => ({ reqIds: [id], scenario: `Verify ${id}`, preconditions: 'None', steps: ['Open page', 'Act'], testData: '<registered_test_email>', expectedResult: 'Insufficient information to determine.', type: 'Positive', priority: 'Proposed: High', requirementStatus: 'Confirmed' })),
          { reqIds: ['AC-99'], scenario: 'Invented requirement', steps: [] },
        ],
        openQuestions: [{ reqId: 'AC-2', question: 'What is the expiry time?' }],
      });
    } else {
      const block = user.split('<template_sections>')[1].split('</template_sections>')[0];
      let headings = block.split('\n').filter((l) => /^#{2,3} /.test(l));
      if (dropHeading) headings = headings.slice(1);
      content = headings.map((h) => `${h}\nFilled from source.`).join('\n\n');
    }
    return new Response(JSON.stringify({ choices: [{ finish_reason: 'stop', message: { content } }] }), { status: 200 });
  };
}

test('[MOCK] Jira key validation', () => {
  assert.equal(jira.normalizeKey(' qa-123 '), 'QA-123');
  assert.throws(() => jira.normalizeKey('hello'), /not a valid Jira issue ID/);
  assert.throws(() => jira.normalizeKey(''), (e) => e.code === 'INVALID_ISSUE_ID');
});

test('[MOCK] requirement extraction assigns stable IDs in Jira order', () => {
  const issue = jira.normalizeIssue(rawIssue, 'https://x.atlassian.net');
  assert.deepEqual(issue.requirements.map((r) => r.id), ['REQ-1', 'AC-1', 'AC-2', 'AC-3', 'REQ-2']);
  assert.equal(issue.requirements[1].source, 'QA-123 / Description › Acceptance Criteria');
  assert.equal(issue.url, 'https://x.atlassian.net/browse/QA-123');
});

test('[MOCK] test plan contains every template section in order', async () => {
  mockFetch();
  const issue = jira.normalizeIssue(rawIssue, 'https://x.atlassian.net');
  const plan = await gen.generatePlan(issue, { llm: LLM });
  assert.ok(plan.validation.ok, JSON.stringify(plan.validation));
  assert.equal(plan.validation.expected, 10);
  assert.match(plan.markdown, /^# Test Plan — QA-123: Password reset/);
});

test('[MOCK] strategy + test cases + traceability', async () => {
  mockFetch();
  const issue = jira.normalizeIssue(rawIssue, 'https://x.atlassian.net');
  const draft = await gen.generateStrategy(issue, '## 1. Scope & Objectives\nx', { llm: LLM });
  assert.match(draft.markdown, /\| Jira Issue Key \| QA-123 \|/);
  assert.match(draft.markdown, /\| AC-1 \| Reset link is emailed \| QA-123 \/ Description › Acceptance Criteria \|/);
  assert.doesNotMatch(draft.markdown, /\{\{|<!--/);
  // Generated on its own: traceability waits for test cases.
  assert.equal(draft.traceabilityFilled, false);
  assert.ok(draft.validation.ok, JSON.stringify(draft.validation));
  assert.match(draft.markdown, /\| AC-1 \| Reset link is emailed \| — \| Not generated yet — generate test cases to populate\. \| — \|/);

  const cases = await gen.generateCases(issue, { llm: LLM });
  assert.ok(cases.validation.ok, JSON.stringify(cases.validation));
  // Deterministic IDs ordered by requirement order, invented AC-99 discarded.
  assert.deepEqual(cases.testCases.map((c) => [c.id, c.reqIds[0]]), [
    ['QA-123-TC-001', 'REQ-1'], ['QA-123-TC-002', 'AC-1'], ['QA-123-TC-003', 'AC-2'], ['QA-123-TC-004', 'REQ-2'],
  ]);
  assert.ok(cases.warnings.some((w) => /discarded/.test(w)));
  assert.match(cases.markdown, /\| Test ID \| REQ ID \| Scenario \| Preconditions \| Steps \| Test Data \| Expected Result \| Type \| Priority \| Requirement Status \(Confirmed \/ Requires clarification\) \|/);

  // Browser sends back only {id, reqIds, type}; references are sanitised before linking.
  const refs = gen.cleanCaseRefs([...cases.testCases.map(({ id, reqIds, type }) => ({ id, reqIds, type })), { id: 'bad id', reqIds: ['AC-1'] }]);
  assert.equal(refs.length, 4);
  const final = gen.fillTraceability(draft.markdown, issue, refs);
  assert.ok(final.validation.ok, JSON.stringify(final.validation));
  assert.equal(final.traceabilityFilled, true);
  assert.match(final.markdown, /\| AC-1 \| Reset link is emailed \| Positive \| QA-123-TC-002 \| Yes \|/);
  assert.match(final.markdown, /\| AC-3 \| .* \| No test case — ⚠️ flagged \| No — ⚠️ flagged \|/);
});

test('[MOCK] model output missing a template section fails clearly', async () => {
  mockFetch({ dropHeading: true });
  const issue = jira.normalizeIssue(rawIssue, 'https://x.atlassian.net');
  await assert.rejects(gen.generatePlan(issue, { llm: LLM }), (e) => e.code === 'GENERATION_FAILED' && /Scope & Objectives/.test(e.message));
});

test('[MOCK] strategy generated with existing test cases fills traceability directly', async () => {
  mockFetch();
  const issue = jira.normalizeIssue(rawIssue, 'https://x.atlassian.net');
  const refs = [{ id: 'QA-123-TC-001', reqIds: ['AC-1'], type: 'Negative' }];
  const s = await gen.generateStrategy(issue, null, { llm: LLM }, refs);
  assert.equal(s.traceabilityFilled, true);
  assert.match(s.markdown, /\| AC-1 \| Reset link is emailed \| Negative \| QA-123-TC-001 \| Yes \|/);
});

test('saved Jira token is never sent to a different URL or email', async () => {
  const cfg = await import('../config.js');
  Object.assign(cfg.settings.jira, { baseUrl: 'https://mine.atlassian.net', email: 'me@x.com', token: 'secret' });
  assert.equal(cfg.resolveJira({ baseUrl: 'https://mine.atlassian.net', email: 'me@x.com' }).token, 'secret');
  assert.throws(() => cfg.resolveJira({ baseUrl: 'https://attacker.example' }), (e) => e.code === 'TOKEN_REQUIRED');
  assert.throws(() => cfg.resolveJira({ email: 'other@x.com' }), (e) => e.code === 'TOKEN_REQUIRED');
  assert.equal(cfg.resolveJira({ baseUrl: 'https://other.atlassian.net', token: 'own' }).token, 'own');
  assert.throws(() => cfg.updateSettings({ jira: { baseUrl: 'https://attacker.example' } }), (e) => e.code === 'TOKEN_REQUIRED');
  assert.equal(cfg.settings.jira.baseUrl, 'https://mine.atlassian.net');
});

test('missing template reports the exact path', () => {
  const script = "import('./src/backend/templates.js').then(t=>{try{t.loadTemplate('plan')}catch(e){console.log(e.code+' '+e.message)}})";
  const out = execFileSync(process.execPath, ['-e', script], { env: { ...process.env, TEMPLATE_DIR: '/nope', ENV_FILE: 'none' }, encoding: 'utf8' });
  assert.match(out, /TEMPLATE_MISSING .*nope.*test-plan-template\.md/);
});

test('real templates load and parse', () => {
  for (const t of ['plan', 'strategy', 'cases']) assert.ok(tpl.loadTemplate(t).length > 100);
  const { sections, B } = gen.parseCaseTemplate(tpl.loadTemplate('cases'));
  assert.deepEqual(sections.map((s) => s.letter), ['A', 'B', 'C', 'D']);
  assert.equal(B.columns.length, 10);
});

// Express API. Stateless, so the same app runs locally (server.js) and as a Vercel function (api/index.js).
import express from 'express';
import { envLoaded, settings, publicSettings, updateSettings, resolveJira, AppError } from './config.js';
import { fetchIssue, testJira, normalizeKey } from './jira.js';
import { testLlm, listModels } from './llm.js';
import { templateStatus } from './templates.js';
import { generatePlan, generateStrategy, generateCases, fillTraceability, cleanCaseRefs } from './generator.js';

const app = express();
app.use(express.json({ limit: '1mb' }));

const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res)).catch(next);
const str = (v, max) => (typeof v === 'string' ? v.slice(0, max) : '');

app.get('/api/status', wrap(async (req, res) => {
  const jira = { configured: Boolean(settings.jira.baseUrl && settings.jira.email && settings.jira.token), connected: null };
  try {
    jira.host = settings.jira.baseUrl ? new URL(settings.jira.baseUrl).host : '';
  } catch {}
  if (req.query.check && jira.configured) {
    try {
      await testJira(settings.jira);
      jira.connected = true;
    } catch (e) {
      jira.connected = false;
      jira.error = e.message;
    }
  }
  const { llm } = settings;
  res.json({
    envLoaded,
    jira,
    llm: {
      provider: llm.provider,
      model: llm.provider === 'groq' ? llm.groqModel : llm.ollamaModel,
      configured: llm.provider === 'groq' ? Boolean(llm.groqKey) : Boolean(llm.ollamaModel),
      fallback: llm.fallback,
    },
    templates: templateStatus(),
  });
}));

app.get('/api/settings', (req, res) => res.json(publicSettings()));
app.put('/api/settings', (req, res) => {
  updateSettings(req.body);
  res.json(publicSettings());
});

// Tests the values currently in the form; nothing is saved.
app.post('/api/settings/test-jira', wrap(async (req, res) => {
  await testJira(resolveJira(req.body));
  res.json({ ok: true });
}));

app.post('/api/settings/test-llm', wrap(async (req, res) => {
  const b = req.body || {};
  const provider = b.provider === 'ollama' ? 'ollama' : 'groq';
  const llm = {
    ...settings.llm,
    provider,
    groqKey: str(b.groqKey, 200).trim() || settings.llm.groqKey,
    groqModel: provider === 'groq' && b.model ? str(b.model, 100) : settings.llm.groqModel,
    ollamaModel: provider === 'ollama' && b.model ? str(b.model, 100) : settings.llm.ollamaModel,
  };
  res.json(await testLlm(llm));
}));

app.get('/api/models', wrap(async (req, res) => {
  const provider = req.query.provider === 'ollama' ? 'ollama' : 'groq';
  res.json({ provider, models: await listModels(provider, settings.llm) });
}));

app.get('/api/jira/issue/:key', wrap(async (req, res) => {
  res.json(await fetchIssue(req.params.key, settings.jira));
}));

/**
 * Generates ONE artifact. The response is NDJSON: {"type":"progress"} lines, then {"type":"result"} or {"type":"error"}.
 * Streaming keeps long Groq waits visible and works within a single serverless invocation.
 */
app.post('/api/generate/:type', wrap(async (req, res) => {
  const type = req.params.type;
  if (!['plan', 'strategy', 'cases'].includes(type)) throw new AppError(404, 'NOT_FOUND', 'Unknown artifact type.');
  const b = req.body || {};
  const key = normalizeKey(b.key);
  const provider = b.provider === 'ollama' || b.provider === 'groq' ? b.provider : settings.llm.provider;
  const opts = { llm: { ...settings.llm, provider }, instructions: str(b.instructions, 1000) };

  res.setHeader('Content-Type', 'application/x-ndjson; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('X-Accel-Buffering', 'no');
  const send = (o) => res.write(JSON.stringify(o) + '\n');
  opts.progress = (msg) => send({ type: 'progress', msg });

  try {
    opts.progress(`Retrieving ${key} from Jira…`);
    const issue = await fetchIssue(key, settings.jira);
    opts.progress(`Retrieved ${issue.requirements.length} requirement(s).`);
    let result;
    if (type === 'plan') {
      opts.progress('Generating test plan…');
      result = await generatePlan(issue, opts);
    } else if (type === 'strategy') {
      result = await generateStrategy(issue, str(b.planMarkdown, 200000) || null, opts, cleanCaseRefs(b.testCases));
    } else {
      result = await generateCases(issue, opts);
    }
    send({ type: 'result', issue, result });
  } catch (e) {
    if (!(e instanceof AppError)) console.error('[generate]', e.message);
    send({ type: 'error', error: { code: e.code || 'ERROR', message: e instanceof AppError || e.code ? e.message : 'Unexpected error during generation.' } });
  }
  res.end();
}));

// Re-links an existing strategy to newly generated test cases.
app.post('/api/strategy/traceability', wrap(async (req, res) => {
  const b = req.body || {};
  const markdown = str(b.markdown, 500000);
  if (!markdown) throw new AppError(400, 'BAD_REQUEST', 'Strategy markdown is required.');
  const issue = await fetchIssue(b.key, settings.jira);
  res.json(fillTraceability(markdown, issue, cleanCaseRefs(b.testCases)));
}));

app.use('/api', (req, res) => res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Unknown API route.' } }));

app.use((err, req, res, next) => {
  if (err instanceof AppError) return res.status(err.status).json({ error: { code: err.code, message: err.message } });
  if (err.type === 'entity.parse.failed') return res.status(400).json({ error: { code: 'BAD_REQUEST', message: 'Invalid JSON body.' } });
  if (err.type === 'entity.too.large') return res.status(413).json({ error: { code: 'TOO_LARGE', message: 'Request body too large.' } });
  console.error('[error]', err.message);
  res.status(500).json({ error: { code: 'SERVER_ERROR', message: 'Unexpected server error.' } });
});

export default app;

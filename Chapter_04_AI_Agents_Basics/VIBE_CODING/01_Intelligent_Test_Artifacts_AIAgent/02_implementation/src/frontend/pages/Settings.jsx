import { useCallback, useEffect, useState } from 'react';
import { api } from '../api.js';
import { Alert, Badge, Icon, Spinner } from '../components.jsx';

const blank = { jira: { baseUrl: '', email: '', token: '' }, llm: { provider: 'groq', groqKey: '', groqModel: '', ollamaModel: '', fallback: true } };

export default function Settings({ onSaved, go }) {
  const [form, setForm] = useState(blank);
  const [saved, setSaved] = useState(null);
  const [showToken, setShowToken] = useState(false);
  const [models, setModels] = useState({ groq: [], ollama: [] });
  const [jiraTest, setJiraTest] = useState({});
  const [llmTest, setLlmTest] = useState({});
  const [saveState, setSaveState] = useState({});
  const [loadError, setLoadError] = useState(null);

  const load = useCallback(async () => {
    try {
      const s = await api('/api/settings');
      setSaved(s);
      // Secrets are never sent to the browser; blank secret fields mean "keep the configured value".
      setForm({ jira: { baseUrl: s.jira.baseUrl, email: s.jira.email, token: '' }, llm: { ...s.llm, groqKey: '' } });
      setLoadError(null);
    } catch (e) {
      setLoadError(e.message);
    }
  }, []);
  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    ['groq', 'ollama'].forEach((p) => api(`/api/models?provider=${p}`).then((r) => setModels((m) => ({ ...m, [p]: r.models }))).catch(() => {}));
  }, []);

  const setJira = (k, v) => { setForm((f) => ({ ...f, jira: { ...f.jira, [k]: v } })); setJiraTest({}); };
  const setLlm = (k, v) => { setForm((f) => ({ ...f, llm: { ...f.llm, [k]: v } })); setLlmTest({}); };
  const isGroq = form.llm.provider === 'groq';
  const modelKey = isGroq ? 'groqModel' : 'ollamaModel';
  const modelList = models[form.llm.provider];

  const testJira = async () => {
    setJiraTest({ loading: true });
    try {
      await api('/api/settings/test-jira', { method: 'POST', body: form.jira });
      setJiraTest({ ok: true });
    } catch (e) {
      setJiraTest({ error: e.message });
    }
  };
  const testLlm = async () => {
    setLlmTest({ loading: true });
    try {
      const r = await api('/api/settings/test-llm', { method: 'POST', body: { provider: form.llm.provider, groqKey: form.llm.groqKey, model: form.llm[modelKey] } });
      setLlmTest({ ok: true, model: r.model });
    } catch (e) {
      setLlmTest({ error: e.message });
    }
  };
  const save = async () => {
    setSaveState({ loading: true });
    try {
      await api('/api/settings', { method: 'PUT', body: form });
      await load();
      onSaved?.();
      setSaveState({ ok: true });
    } catch (e) {
      setSaveState({ error: e.message });
    }
  };

  return (
    <div className="container narrow">
      <h1 className="h1">Settings</h1>
      <p className="lead small-lead">Connect Jira and choose which LLM generates your documents.</p>
      {loadError && <Alert>{loadError}</Alert>}
      {saved?.readOnly && (
        <Alert tone="warn">On this deployment, settings come from Vercel environment variables and cannot be saved here. <b>Test connection</b> and <b>Test Groq</b> still work.</Alert>
      )}

      <section className="card settings-card">
        <div className="settings-head">
          <span className="icon-tile tile-indigo sm"><Icon name="link" /></span>
          <div className="grow"><h3 className="h4">Jira connection</h3><p className="muted small">Used to fetch ticket details by Jira ID</p></div>
          {jiraTest.ok ? <Badge tone="green"><i className="dot ok" /> Connected</Badge> : jiraTest.error ? <Badge tone="red">Not connected</Badge> : saved?.jira.tokenSet ? <Badge tone="gray">Configured</Badge> : <Badge tone="gray">Not configured</Badge>}
        </div>
        <div className="settings-body">
          <label className="label" htmlFor="jurl">Jira URL</label>
          <input id="jurl" className="input" placeholder="https://your-site.atlassian.net" value={form.jira.baseUrl} onChange={(e) => setJira('baseUrl', e.target.value)} />
          <div className="two">
            <div>
              <label className="label" htmlFor="jemail">Email</label>
              <input id="jemail" className="input" type="email" placeholder="you@company.com" value={form.jira.email} onChange={(e) => setJira('email', e.target.value)} autoComplete="off" />
            </div>
            <div>
              <label className="label" htmlFor="jtoken">API token</label>
              <div className="input-btn">
                <input id="jtoken" className="input" type={showToken ? 'text' : 'password'} autoComplete="new-password"
                  placeholder={saved?.jira.tokenSet ? '•••••••••••••••• (saved)' : 'Paste API token'}
                  value={form.jira.token} onChange={(e) => setJira('token', e.target.value)} />
                <button type="button" className="icon-btn" aria-label={showToken ? 'Hide token' : 'Show token'} onClick={() => setShowToken((s) => !s)}><Icon name="eye" /></button>
              </div>
              <p className="hint">Create one in your Atlassian account security settings. Leave blank to keep the saved token.</p>
            </div>
          </div>
        </div>
        <div className="settings-foot">
          <span>
            {jiraTest.loading && <span className="muted"><Spinner /> Testing…</span>}
            {jiraTest.ok && <span className="ok-text"><Icon name="check" size={18} /> Connection successful</span>}
            {jiraTest.error && <span className="error-text">{jiraTest.error}</span>}
          </span>
          <button className="btn btn-outline" onClick={testJira} disabled={jiraTest.loading}>Test connection</button>
        </div>
      </section>

      <section className="card settings-card">
        <div className="settings-head">
          <span className="icon-tile tile-orange sm"><Icon name="cpu" /></span>
          <div className="grow"><h3 className="h4">LLM configuration</h3><p className="muted small">Choose a local or cloud model for generation</p></div>
        </div>
        <div className="settings-body">
          <div className="two">
            {[['ollama', 'Ollama', 'Local · runs on your machine, no data leaves it'], ['groq', 'Groq', 'Cloud · fast hosted models, needs an API key']].map(([v, t, d]) => (
              <label key={v} className={`radio-card ${form.llm.provider === v ? 'checked' : ''}`}>
                <input type="radio" name="provider" value={v} checked={form.llm.provider === v} onChange={() => setLlm('provider', v)} />
                <span><strong>{t}</strong><span className="muted">{d}</span></span>
                <i className="radio" />
              </label>
            ))}
          </div>
          <div className="two">
            {isGroq && (
              <div>
                <label className="label" htmlFor="gkey">Groq API key</label>
                <input id="gkey" className="input" type="password" autoComplete="new-password"
                  placeholder={saved?.llm.groqKeySet ? '•••••••••••••••••••• (saved)' : 'Paste Groq API key'}
                  value={form.llm.groqKey} onChange={(e) => setLlm('groqKey', e.target.value)} />
                <p className="hint">Get a key from <a className="link" href="https://console.groq.com" target="_blank" rel="noreferrer">console.groq.com</a></p>
              </div>
            )}
            <div>
              <label className="label" htmlFor="lmodel">Model</label>
              <select id="lmodel" className="input" value={form.llm[modelKey] || ''} onChange={(e) => setLlm(modelKey, e.target.value)}>
                <option value="">Select a model</option>
                {[...new Set([...(form.llm[modelKey] ? [form.llm[modelKey]] : []), ...modelList])].map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
              {!isGroq && !modelList.length && <p className="hint">No local Ollama models found (is Ollama running?).</p>}
            </div>
          </div>
          <label className="check">
            <input type="checkbox" checked={form.llm.fallback} onChange={(e) => setLlm('fallback', e.target.checked)} />
            Use the other provider as a fallback if this one fails
          </label>
        </div>
        <div className="settings-foot">
          <span>
            {llmTest.loading && <span className="muted"><Spinner /> Running test prompt…</span>}
            {llmTest.ok && <span className="ok-text"><Icon name="check" size={18} /> {llmTest.model} responded</span>}
            {llmTest.error && <span className="error-text">{llmTest.error}</span>}
            {!llmTest.loading && !llmTest.ok && !llmTest.error && <span className="muted">Run a short prompt to check the model responds.</span>}
          </span>
          <button className="btn btn-outline" onClick={testLlm} disabled={llmTest.loading}>Test {isGroq ? 'Groq' : 'Ollama'}</button>
        </div>
      </section>

      <div className="actions">
        {saveState.ok && <span className="ok-text">Saved until the server restarts.</span>}
        {saveState.error && <span className="error-text">{saveState.error}</span>}
        <button className="btn btn-outline btn-lg" onClick={() => { load(); setJiraTest({}); setLlmTest({}); setSaveState({}); go('home'); }}>Cancel</button>
        <button className="btn btn-primary btn-lg" onClick={save} disabled={saveState.loading || saved?.readOnly}>{saveState.loading ? <Spinner /> : 'Save changes'}</button>
      </div>
    </div>
  );
}

import { useCallback, useEffect, useRef, useState } from 'react';
import { api, streamPost } from './api.js';
import { Icon } from './components.jsx';
import Home from './pages/Home.jsx';
import Generator from './pages/Generator.jsx';
import History from './pages/History.jsx';
import Settings from './pages/Settings.jsx';

const ROUTES = ['home', 'generator', 'history', 'settings'];
const readRoute = () => {
  const r = window.location.hash.replace(/^#\/?/, '');
  return ROUTES.includes(r) ? r : 'home';
};
const EMPTY = { plan: null, strategy: null, cases: null };
const caseRefs = (cases) => cases.testCases.map(({ id, reqIds, type }) => ({ id, reqIds, type }));

/**
 * Generator state lives here so input and results survive navigation.
 * Each tab generates only its own artifact; one generation runs at a time to stay inside Groq's token budget.
 */
function useGenerator(addHistory) {
  const [key, setKey] = useState('');
  const [issue, setIssue] = useState(null);
  const [fetchState, setFetchState] = useState({ loading: false, error: null });
  const [outputs, setOutputs] = useState(EMPTY);
  const [runningTab, setRunningTab] = useState(null);
  const [tab, setTab] = useState('plan');
  const [provider, setProvider] = useState('');
  const [instructions, setInstructions] = useState('');
  const outputsRef = useRef(outputs);
  outputsRef.current = outputs;
  const running = runningTab !== null;

  const patch = (t, fn) => setOutputs((prev) => ({ ...prev, [t]: fn(prev[t]) }));
  // Outputs always belong to one issue; switching issue clears them.
  const forKey = (k, prev) => (Object.values(prev).some((o) => o && o.key !== k) ? EMPTY : prev);

  const fetchIssue = useCallback(async (k) => {
    const id = (k ?? key).trim();
    if (!id) return setFetchState({ loading: false, error: 'Enter a Jira issue ID, e.g. QA-142.' });
    setFetchState({ loading: true, error: null });
    try {
      const data = await api(`/api/jira/issue/${encodeURIComponent(id)}`);
      setIssue(data);
      setKey(data.key);
      setOutputs((prev) => forKey(data.key, prev));
      setFetchState({ loading: false, error: null });
    } catch (e) {
      setIssue(null);
      setFetchState({ loading: false, error: e.message });
    }
  }, [key]);

  const generate = async (t) => {
    if (running) return; // no duplicate / parallel submissions
    const K = key.trim().toUpperCase();
    if (!K) return patch(t, () => ({ status: 'failed', key: '', error: { message: 'Enter a Jira issue ID first.' } }));
    const current = forKey(K, outputsRef.current);
    const body = { key: K, provider: provider || undefined, instructions };
    if (t === 'strategy') {
      if (current.plan?.status === 'success') body.planMarkdown = current.plan.markdown; // keep plan + strategy consistent
      if (current.cases?.status === 'success') body.testCases = caseRefs(current.cases); // fill traceability
    }
    setOutputs({ ...current, [t]: { status: 'running', key: K, progress: [] } });
    setRunningTab(t);
    try {
      const ev = await streamPost(`/api/generate/${t}`, body, (msg) => patch(t, (o) => ({ ...o, progress: [...(o?.progress || []), msg] })));
      const out = { status: 'success', key: ev.issue.key, createdAt: new Date().toISOString(), ...ev.result };
      setIssue(ev.issue);
      patch(t, () => out);
      addHistory({ type: t, key: ev.issue.key, summary: ev.issue.summary, provider: ev.result.provider, model: ev.result.model, output: out });
      // New test cases -> refresh the existing strategy's traceability summary (no LLM call).
      const strat = outputsRef.current.strategy;
      if (t === 'cases' && strat?.status === 'success' && strat.key === out.key) {
        try {
          const r = await api('/api/strategy/traceability', { method: 'POST', body: { key: out.key, markdown: strat.markdown, testCases: caseRefs(out) } });
          patch('strategy', (o) => ({ ...o, ...r }));
        } catch (e) {
          patch('strategy', (o) => ({ ...o, warnings: [`Traceability could not be refreshed: ${e.message}`] }));
        }
      }
    } catch (e) {
      patch(t, (o) => ({ status: 'failed', key: K, progress: o?.progress || [], error: { message: e.message } }));
    } finally {
      setRunningTab(null);
    }
  };

  const openHistory = (entry) => {
    setKey(entry.key);
    setOutputs((prev) => ({ ...forKey(entry.key, prev), [entry.type]: entry.output }));
    setTab(entry.type);
  };

  return { key, setKey, issue, fetchState, fetchIssue, outputs, generate, running, runningTab, tab, setTab, provider, setProvider, instructions, setInstructions, openHistory };
}

export default function App() {
  const [route, setRoute] = useState(readRoute);
  const [status, setStatus] = useState(null);
  const [history, setHistory] = useState([]); // this browser session only

  useEffect(() => {
    const onHash = () => setRoute(readRoute());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const loadStatus = useCallback(() => api('/api/status?check=1').then(setStatus).catch(() => setStatus({ offline: true })), []);
  useEffect(() => { loadStatus(); }, [loadStatus]);

  const addHistory = (e) => setHistory((h) => [{ id: crypto.randomUUID(), createdAt: new Date().toISOString(), ...e }, ...h]);
  const gen = useGenerator(addHistory);
  const go = (r) => { window.location.hash = `/${r}`; };

  const jiraOk = status?.jira?.connected;
  const llmName = status?.llm?.provider === 'ollama' ? 'Ollama' : 'Groq';

  return (
    <>
      <header className="topbar">
        <div className="topbar-inner">
          <a className="brand" href="#/home"><span className="brand-mark"><Icon name="logo" /></span>Test Artifacts Studio</a>
          <nav className="nav">
            {ROUTES.map((r) => (
              <a key={r} href={`#/${r}`} className={route === r ? 'active' : ''}>{r[0].toUpperCase() + r.slice(1)}</a>
            ))}
          </nav>
          <div className="pills">
            {route === 'home' && (
              <span className="pill"><i className={`dot ${jiraOk ? 'ok' : jiraOk === false ? 'bad' : 'idle'}`} />{jiraOk ? 'Jira connected' : jiraOk === false ? 'Jira error' : 'Jira not checked'}</span>
            )}
            {(route === 'home' || route === 'generator') && (
              <span className="pill"><i className={`dot ${status?.llm?.configured ? 'ok' : 'bad'}`} />LLM: {llmName}</span>
            )}
          </div>
        </div>
      </header>
      <main className="page">
        {status?.offline && <div className="alert alert-error banner">Cannot reach the backend API.</div>}
        {route === 'home' && <Home status={status} gen={gen} go={go} />}
        {route === 'generator' && <Generator status={status} gen={gen} />}
        {route === 'history' && <History history={history} gen={gen} go={go} />}
        {route === 'settings' && <Settings onSaved={loadStatus} go={go} />}
      </main>
    </>
  );
}

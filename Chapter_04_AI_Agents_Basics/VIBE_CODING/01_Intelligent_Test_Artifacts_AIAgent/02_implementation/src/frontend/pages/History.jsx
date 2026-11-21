import { useMemo, useState } from 'react';
import { DOCS } from '../api.js';
import { Badge, Icon, statusLabel, statusTone } from '../components.jsx';

const TONE = { plan: 'indigo', strategy: 'orange', cases: 'green' };

export default function History({ history, gen, go }) {
  const [q, setQ] = useState('');
  const [type, setType] = useState('all');
  const [selected, setSelected] = useState(null);

  const rows = useMemo(() => history
    .filter((r) => type === 'all' || r.type === type)
    .filter((r) => !q || `${r.key} ${r.summary}`.toLowerCase().includes(q.toLowerCase())), [history, q, type]);
  const sel = rows.find((r) => r.id === selected);

  const open = (r) => {
    gen.openHistory(r);
    go('generator');
  };

  return (
    <div className="container">
      <div className="page-head">
        <div>
          <h1 className="h1">History</h1>
          <p className="lead small-lead">Every document generated in this browser session (not stored anywhere).</p>
        </div>
      </div>
      <div className="card filters">
        <div className="field grow">
          <label className="label" htmlFor="hq">Search</label>
          <div className="input-icon"><Icon name="search" size={18} /><input id="hq" className="input" placeholder="Jira ID or title" value={q} onChange={(e) => setQ(e.target.value)} /></div>
        </div>
        <div className="field">
          <label className="label" htmlFor="ht">Document type</label>
          <select id="ht" className="input" value={type} onChange={(e) => setType(e.target.value)}>
            <option value="all">All types</option>
            {Object.entries(DOCS).map(([k, d]) => <option key={k} value={k}>{d.label}</option>)}
          </select>
        </div>
      </div>
      <div className="history">
        <div className="card table-card">
          <div className="table-note muted">{rows.length ? 'Click a row to see details' : ''}</div>
          {rows.length === 0 ? (
            <div className="empty"><h3 className="h4">No documents yet</h3><p className="muted">Generated documents appear here.</p></div>
          ) : (
            <table className="table">
              <thead><tr><th>Document</th><th>Status</th><th>Model</th><th>Generated</th></tr></thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className={selected === r.id ? 'selected' : ''} onClick={() => setSelected(r.id)}>
                    <td><div className="row-c"><Badge tone={TONE[r.type]}>{DOCS[r.type].label}</Badge><strong>{r.summary || r.key}</strong></div><span className="muted small">Jira {r.key}</span></td>
                    <td><Badge tone={statusTone[r.output.status]}>{statusLabel[r.output.status]}</Badge></td>
                    <td>{r.provider === 'ollama' ? 'Ollama' : 'Groq'}</td>
                    <td>{new Date(r.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        {sel && (
          <aside className="card detail">
            <div className="pad">
              <Badge tone={TONE[sel.type]}>{DOCS[sel.type].label}</Badge>
              <h3 className="h3">{sel.summary || sel.key}</h3>
              <p className="muted small">Jira {sel.key} · {sel.model || sel.provider} · {new Date(sel.createdAt).toLocaleString()}</p>
            </div>
            <div className="pad border-top">
              <button className="btn btn-primary btn-block" onClick={() => open(sel)}>Open</button>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}

import { useState } from 'react';
import { DOCS } from '../api.js';
import { markdownToDocxBlob } from '../docx.js';
import { Alert, Badge, Icon, Markdown, Spinner, statusLabel, statusTone } from '../components.jsx';

const saveBlob = (blob, name) => {
  const url = URL.createObjectURL(blob);
  Object.assign(document.createElement('a'), { href: url, download: name }).click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

export default function Generator({ status, gen }) {
  const { outputs, tab, issue } = gen;
  const doc = DOCS[tab];
  const out = outputs[tab];
  const [copied, setCopied] = useState(false);
  const [exportState, setExportState] = useState({});
  const provider = gen.provider || status?.llm?.provider || 'groq';
  const busyHere = gen.runningTab === tab;
  const busyOther = gen.running && !busyHere;
  const ok = out?.status === 'success';

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(out.markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };
  const downloadMd = () => saveBlob(new Blob([out.markdown], { type: 'text/markdown' }), `${out.key}-${doc.file}.md`);
  // Test Plan / Test Strategy -> .docx, Test Cases -> .xlsx (both built in the browser, loaded on demand).
  const exportFile = async () => {
    setExportState({ loading: true });
    try {
      const blob = doc.export === 'xlsx'
        ? (await import('../xlsx.js')).markdownToXlsxBlob(out.markdown)
        : await markdownToDocxBlob(out.markdown, `${doc.label} — ${out.key}`);
      saveBlob(blob, `${out.key}-${doc.file}.${doc.export}`);
      setExportState({});
    } catch (e) {
      setExportState({ error: `${doc.export.toUpperCase()} export failed: ${e.message}` });
    }
  };

  return (
    <div className="container">
      <div className="page-head">
        <div>
          <p className="crumbs"><a href="#/home">Home</a> / {doc.label}</p>
          <h1 className="h1">{doc.label} generator</h1>
        </div>
        <div className="segmented" role="tablist">
          {Object.entries(DOCS).map(([k, d]) => {
            const st = outputs[k]?.status;
            return (
              <button key={k} role="tab" aria-selected={tab === k} className={tab === k ? 'active' : ''} onClick={() => gen.setTab(k)}>
                {d.label}{st && <i className={`dot ${st === 'success' ? 'ok' : st === 'failed' ? 'bad' : 'busy'}`} />}
              </button>
            );
          })}
        </div>
      </div>

      <div className="workspace">
        <aside className="side">
          <form className="card pad" onSubmit={(e) => { e.preventDefault(); gen.fetchIssue(); }}>
            <h3 className="h4">Requirement source</h3>
            <label className="label" htmlFor="jid">Jira ID</label>
            <div className="row">
              <input id="jid" className="input" placeholder="e.g. QA-142" value={gen.key} onChange={(e) => gen.setKey(e.target.value)} disabled={gen.running} />
              <button className="btn btn-outline" type="submit" disabled={gen.fetchState.loading || gen.running}>
                {gen.fetchState.loading ? <Spinner /> : 'Fetch'}
              </button>
            </div>
            {gen.fetchState.error && <Alert>{gen.fetchState.error}</Alert>}
            {gen.fetchState.loading && <p className="hint">Retrieving issue from Jira…</p>}
            {issue && !gen.fetchState.loading && (
              <div className="ticket">
                <div className="ticket-top"><Badge>{issue.key} · {issue.type || 'Issue'}</Badge><span className="muted small">{issue.status}</span></div>
                <strong>{issue.summary}</strong>
                <p className="muted small">{issue.descriptionPreview || 'No description in Jira.'}</p>
                <p className="small">
                  {issue.requirements.length
                    ? `${issue.requirements.length} requirement(s) extracted: ${issue.requirements.filter((r) => r.id.startsWith('AC')).length} AC, ${issue.requirements.filter((r) => r.id.startsWith('REQ')).length} REQ`
                    : <span className="warn-text">No description or acceptance criteria — outputs will mostly be “Insufficient information to determine.”</span>}
                </p>
                <a className="link small" href={issue.url} target="_blank" rel="noreferrer">Open in Jira ↗</a>
              </div>
            )}
          </form>

          <div className="card pad">
            <h3 className="h4">Options</h3>
            <label className="label" htmlFor="model">Model</label>
            <select id="model" className="input" value={provider} onChange={(e) => gen.setProvider(e.target.value)} disabled={gen.running}>
              <option value="groq">Groq (cloud)</option>
              <option value="ollama">Ollama (local)</option>
            </select>
            <label className="label" htmlFor="instr">Additional instructions <span className="muted">(optional)</span></label>
            <textarea id="instr" className="input" rows={3} placeholder="e.g. Focus on security and email deliverability" value={gen.instructions} onChange={(e) => gen.setInstructions(e.target.value)} disabled={gen.running} />
            <button className="btn btn-primary btn-block btn-lg" onClick={() => gen.generate(tab)} disabled={gen.running || !gen.key.trim()}>
              {busyHere ? <><Spinner /> Generating…</> : <><Icon name="sparkle" size={18} /> {doc.button}</>}
            </button>
            {busyOther && <p className="hint">Wait for the {DOCS[gen.runningTab].label.toLowerCase()} to finish. One generation runs at a time.</p>}
            {tab === 'strategy' && !gen.running && (
              <p className="hint">
                Uses the generated test plan for consistency{outputs.plan?.status === 'success' ? ' ✓' : ' (not generated yet)'}.
                Traceability links to test cases{outputs.cases?.status === 'success' ? ' ✓' : ' once they are generated'}.
              </p>
            )}
          </div>
        </aside>

        <section className="card result">
          <div className="result-head">
            <div className="row-c">
              <strong>{doc.label}{out?.key ? ` · ${out.key}` : ''}</strong>
              {out && <Badge tone={statusTone[out.status]}>{statusLabel[out.status]}</Badge>}
            </div>
            <div className="row-c">
              <button className="btn btn-outline btn-sm" onClick={copy} disabled={!ok}>{copied ? 'Copied' : 'Copy'}</button>
              <button className="btn btn-outline btn-sm" onClick={() => gen.generate(tab)} disabled={gen.running || !out}>Regenerate</button>
              <button className="btn btn-outline btn-sm" onClick={downloadMd} disabled={!ok}>Download .md</button>
              <button className="btn btn-dark btn-sm" onClick={exportFile} disabled={!ok || exportState.loading}>
                {exportState.loading ? <Spinner /> : `Export .${doc.export}`}
              </button>
            </div>
          </div>
          <div className="result-body">
            {exportState.error && <Alert>{exportState.error}</Alert>}
            <ResultBody out={out} doc={doc} />
          </div>
        </section>
      </div>
    </div>
  );
}

function ResultBody({ out, doc }) {
  const label = doc.label.toLowerCase();
  if (!out) {
    return (
      <div className="empty">
        <span className="icon-tile tile-indigo"><Icon name="file" size={26} /></span>
        <h3 className="h4">No {label} yet</h3>
        <p className="muted">Enter a Jira ID, then click <b>{doc.button}</b>.</p>
      </div>
    );
  }
  if (out.status === 'running') {
    return (
      <div className="loading">
        <Spinner />
        <div>
          <strong>Generating {label}…</strong>
          <ul className="progress">{(out.progress || []).slice(-4).map((p, i) => <li key={i}>{p}</li>)}</ul>
          <p className="hint">Groq’s free tier allows about 8K tokens per minute, so large tickets can take a few minutes.</p>
        </div>
      </div>
    );
  }
  if (out.status === 'failed') return <Alert title={`${doc.label} failed`}>{out.error?.message}</Alert>;
  return (
    <>
      <div className="meta-line">
        {out.validation && (out.validation.ok
          ? <Badge tone="green">Template check: all {out.validation.expected} sections present, in order</Badge>
          : <Badge tone="red">Template check: missing {out.validation.missing.join(', ')}</Badge>)}
        {out.model && <span className="muted small">{out.provider} · {out.model}</span>}
        {out.testCases && <span className="muted small">{out.testCases.length} test case(s)</span>}
      </div>
      {out.traceabilityFilled === false && <Alert tone="warn">Traceability summary (section 22) is waiting for test cases. Generate test cases to populate it.</Alert>}
      {out.warnings?.map((w) => <Alert key={w} tone="warn">{w}</Alert>)}
      <Markdown source={out.markdown} />
    </>
  );
}

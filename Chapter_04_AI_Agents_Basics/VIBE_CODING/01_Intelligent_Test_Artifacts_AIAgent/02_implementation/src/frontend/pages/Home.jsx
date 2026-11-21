import { Badge, Icon } from '../components.jsx';

const CARDS = [
  { tab: 'plan', icon: 'file', tone: 'indigo', title: 'Test Plan', level: 'Release level', text: 'Scope, scenarios, risks, resources and timelines for a release.', items: ['Scope & objectives', 'Test scenarios', 'Risks & mitigation', 'Resources & timeline'], primary: true },
  { tab: 'strategy', icon: 'target', tone: 'orange', title: 'Test Strategy', level: 'Project level', text: 'Testing levels, types, tools and risk approach for the project.', items: ['Test levels & types', 'Tools & environments', 'Risk-based approach', 'Entry & exit criteria'] },
  { tab: 'cases', icon: 'logo', tone: 'green', title: 'Test Case', level: 'Story level', text: 'Step-by-step cases with preconditions and expected results.', items: ['Preconditions & test data', 'Positive & negative steps', 'Expected results', 'Priority & tags'] },
];

export default function Home({ status, gen, go }) {
  const quickStart = (e) => {
    e.preventDefault();
    if (!gen.key.trim()) return;
    gen.fetchIssue(gen.key);
    go('generator');
  };
  const open = (tab) => { gen.setTab(tab); go('generator'); };
  const jira = status?.jira;
  const llm = status?.llm;

  return (
    <div className="container">
      <section className="hero">
        <div>
          <p className="eyebrow">Get started</p>
          <h1 className="display">Select your choice</h1>
          <p className="lead">Pick the QA document you want to generate. Add a Jira ID, and the generator does the rest.</p>
        </div>
        <form className="card quick" onSubmit={quickStart}>
          <label className="label" htmlFor="qs">Quick start with a Jira ID</label>
          <div className="row">
            <input id="qs" className="input" placeholder="e.g. QA-142" value={gen.key} onChange={(e) => gen.setKey(e.target.value)} />
            <button className="btn btn-primary" type="submit" disabled={!gen.key.trim()}>Fetch ticket</button>
          </div>
        </form>
      </section>

      <section className="grid3">
        {CARDS.map((c) => (
          <article key={c.tab} className="card doc-card">
            <div className="doc-card-top">
              <span className={`icon-tile tile-${c.tone}`}><Icon name={c.icon} size={24} /></span>
              <Badge tone={c.tone}>{c.level}</Badge>
            </div>
            <h2 className="h2">{c.title}</h2>
            <p className="muted">{c.text}</p>
            <ul className={`checks checks-${c.tone}`}>
              {c.items.map((i) => <li key={i}><Icon name="check" size={18} />{i}</li>)}
            </ul>
            <button className={`btn btn-block ${c.primary ? 'btn-primary' : 'btn-outline'}`} onClick={() => open(c.tab)}>
              Open generator <Icon name="arrow" size={18} />
            </button>
          </article>
        ))}
      </section>

      <section className="grid-2-1">
        <div className="card pad-lg">
          <h3 className="h3">How it works</h3>
          <div className="steps">
            {[['Pick a document', 'Test Plan, Test Strategy or Test Case.'], ['Add the requirement', 'Enter a Jira ID; the ticket is read (never modified).'], ['Review & export', 'Check the draft, then copy it or export .md / .docx.']].map(([t, d], i) => (
              <div key={t}><span className="step-no">{i + 1}</span><h4>{t}</h4><p className="muted">{d}</p></div>
            ))}
          </div>
        </div>
        <div className="card pad-lg">
          <h3 className="h3">Connections</h3>
          <div className="conn">
            <div><strong>Jira</strong><span className="muted">{jira?.host || 'Not configured'}</span></div>
            {jira?.connected ? <Badge tone="green">Connected</Badge> : <Badge tone={jira?.configured ? 'red' : 'gray'}>{jira?.configured ? 'Error' : 'Missing'}</Badge>}
          </div>
          <div className="conn">
            <div><strong>LLM provider</strong><span className="muted">{llm ? `${llm.provider === 'groq' ? 'Groq (cloud)' : 'Ollama (local)'}${llm.fallback ? ` · ${llm.provider === 'groq' ? 'Ollama' : 'Groq'} as fallback` : ''}` : '—'}</span></div>
            <Badge tone={llm?.configured ? 'green' : 'gray'}>{llm?.configured ? 'Ready' : 'Not set'}</Badge>
          </div>
          {jira?.error && <p className="hint error-text">{jira.error}</p>}
          <a className="link" href="#/settings">Manage in Settings →</a>
        </div>
      </section>
    </div>
  );
}

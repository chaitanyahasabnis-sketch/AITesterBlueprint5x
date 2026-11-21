import { useMemo } from 'react';
import { marked } from 'marked';

const P = { fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' };
const paths = {
  logo: <><rect x="4" y="4" width="16" height="16" rx="3" /><path d="m9 12 2 2 4-4" /></>,
  file: <><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" /><path d="M14 3v5h5M9 13h6M9 17h6" /></>,
  target: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.5" /></>,
  check: <path d="m5 12 5 5L20 7" />,
  arrow: <path d="M5 12h14m-6-6 6 6-6 6" />,
  link: <><path d="M10 14a4 4 0 0 0 5.66 0l3-3a4 4 0 0 0-5.66-5.66l-1 1" /><path d="M14 10a4 4 0 0 0-5.66 0l-3 3a4 4 0 0 0 5.66 5.66l1-1" /></>,
  cpu: <><rect x="6" y="6" width="12" height="12" rx="2" /><rect x="9.5" y="9.5" width="5" height="5" /><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4" /></>,
  eye: <><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></>,
  sparkle: <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6" />,
  search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></>,
};
export const Icon = ({ name, size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...P} aria-hidden="true">{paths[name]}</svg>
);

export const Badge = ({ tone = 'indigo', children }) => <span className={`badge badge-${tone}`}>{children}</span>;

export const Spinner = () => <span className="spinner" aria-hidden="true" />;

export function Alert({ tone = 'error', title, children }) {
  return (
    <div className={`alert alert-${tone}`} role={tone === 'error' ? 'alert' : 'status'}>
      {title && <strong>{title}</strong>}
      <div>{children}</div>
    </div>
  );
}

// Raw HTML from the model/Jira is neutralised before Markdown rendering (only <br> is allowed back).
export function Markdown({ source }) {
  const html = useMemo(() => {
    const safe = source.replace(/</g, '&lt;').replace(/&lt;br>/g, '<br>');
    return marked.parse(safe, { gfm: true }).replace(/href="\s*(javascript|data|vbscript):[^"]*"/gi, 'href="#"');
  }, [source]);
  return <div className="md" dangerouslySetInnerHTML={{ __html: html }} />;
}

export const statusTone = { success: 'green', failed: 'red', running: 'amber', pending: 'gray' };
export const statusLabel = { success: 'Generated', failed: 'Failed', running: 'Generating…', pending: 'Queued' };

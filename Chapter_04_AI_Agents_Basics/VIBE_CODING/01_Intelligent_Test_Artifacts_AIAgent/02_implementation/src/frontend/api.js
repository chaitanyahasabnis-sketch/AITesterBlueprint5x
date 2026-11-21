export async function api(path, { method = 'GET', body } = {}) {
  let res;
  try {
    res = await fetch(path, {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : {},
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error('Cannot reach the backend server.');
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.error?.message || `Request failed (HTTP ${res.status}).`);
    err.code = data.error?.code;
    throw err;
  }
  return data;
}

/** POSTs and reads an NDJSON stream of {type:'progress'|'result'|'error'} events. Resolves with the result event. */
export async function streamPost(path, body, onProgress) {
  let res;
  try {
    res = await fetch(path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  } catch {
    throw new Error('Cannot reach the backend server.');
  }
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error?.message || `Request failed (HTTP ${res.status}).`);
  }
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buf = '';
  for (;;) {
    const { done, value } = await reader.read().catch(() => ({ done: true }));
    if (value) buf += decoder.decode(value, { stream: true });
    const lines = buf.split('\n');
    buf = done ? '' : lines.pop();
    for (const line of lines) {
      if (!line.trim()) continue;
      let ev;
      try {
        ev = JSON.parse(line);
      } catch {
        continue;
      }
      if (ev.type === 'progress') onProgress?.(ev.msg);
      else if (ev.type === 'result') return ev;
      else if (ev.type === 'error') throw new Error(ev.error?.message || 'Generation failed.');
    }
    if (done) break;
  }
  throw new Error('The server closed the connection before generation finished (it may have hit its time limit). Please try again.');
}

export const DOCS = {
  plan: { label: 'Test Plan', button: 'Generate Test Plan', file: 'test-plan', export: 'docx' },
  strategy: { label: 'Test Strategy', button: 'Generate Test Strategy', file: 'test-strategy', export: 'docx' },
  cases: { label: 'Test Case', button: 'Generate Test Cases', file: 'test-cases', export: 'xlsx' },
};

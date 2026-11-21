// LLM access (Groq cloud or local Ollama) with deterministic settings, 429 back-off and optional fallback.
import { AppError, GROQ_TPM_LIMIT, OLLAMA_BASE_URL } from './config.js';

const SEED = 42;
const GROQ_URL = 'https://api.groq.com/openai/v1';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
export const estimateTokens = (s) => Math.ceil(String(s).length / 3.2);

class LlmError extends Error {
  constructor(message, code = 'LLM_ERROR') {
    super(message);
    this.code = code;
  }
}

async function callGroq({ messages, maxTokens, json }, llm, onWait) {
  if (!llm.groqKey) throw new LlmError('Groq API key is not configured (GROQ_API_KEY).', 'MISSING_CONFIG');
  const model = llm.groqModel;
  const promptTokens = estimateTokens(messages.map((m) => m.content).join('\n'));
  // Keep prompt + completion inside the per-minute token budget, or Groq rejects the request.
  const budget = GROQ_TPM_LIMIT - promptTokens - 200;
  const max = Math.max(600, Math.min(maxTokens, budget));
  const body = { model, messages, temperature: 0, top_p: 1, seed: SEED, max_completion_tokens: max };
  if (/gpt-oss/i.test(model)) {
    body.reasoning_effort = 'low';
    body.include_reasoning = false;
  }
  if (json) body.response_format = { type: 'json_object' };

  for (let attempt = 0; attempt < 8; attempt++) {
    let res;
    try {
      res = await fetch(`${GROQ_URL}/chat/completions`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${llm.groqKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(180000),
      });
    } catch {
      throw new LlmError('Could not reach Groq (network error or timeout).', 'NETWORK_ERROR');
    }
    if (res.status === 429) {
      const wait = Math.min(65, parseFloat(res.headers.get('retry-after')) || 10);
      onWait?.(`Groq rate limit reached, waiting ${Math.ceil(wait)}s…`);
      await sleep(wait * 1000 + 300);
      continue;
    }
    if (!res.ok) {
      let msg = `HTTP ${res.status}`;
      try {
        msg = (await res.json()).error?.message || msg;
      } catch {}
      if (res.status === 401) msg = 'Groq rejected the API key.';
      throw new LlmError(`Groq: ${msg}`);
    }
    const data = await res.json();
    const choice = data.choices?.[0];
    if (choice?.finish_reason === 'length') throw new LlmError('Model output was cut off (token limit).', 'TRUNCATED');
    const text = choice?.message?.content || '';
    if (!text.trim()) throw new LlmError('Model returned an empty response.');
    return { text, model };
  }
  throw new LlmError('Groq rate limit did not clear after several retries.', 'RATE_LIMITED');
}

async function callOllama({ messages, maxTokens, json }, llm) {
  if (!llm.ollamaModel) throw new LlmError('No Ollama model selected in Settings.', 'MISSING_CONFIG');
  let res;
  try {
    res = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: llm.ollamaModel,
        messages,
        stream: false,
        format: json ? 'json' : undefined,
        options: { temperature: 0, seed: SEED, num_predict: maxTokens },
      }),
      signal: AbortSignal.timeout(600000),
    });
  } catch {
    throw new LlmError(`Could not reach Ollama at ${OLLAMA_BASE_URL}.`, 'NETWORK_ERROR');
  }
  if (!res.ok) throw new LlmError(`Ollama: HTTP ${res.status}`);
  const data = await res.json();
  if (data.done_reason === 'length') throw new LlmError('Model output was cut off (token limit).', 'TRUNCATED');
  return { text: data.message?.content || '', model: llm.ollamaModel };
}

const callers = { groq: callGroq, ollama: callOllama };

/** Calls the selected provider, then the other one if fallback is enabled. */
export async function chat(req, llm, onWait) {
  const order = [llm.provider];
  if (llm.fallback) order.push(llm.provider === 'groq' ? 'ollama' : 'groq');
  const errors = [];
  for (const provider of order) {
    try {
      const r = await callers[provider](req, llm, onWait);
      // Models sometimes emit non-breaking hyphens ("REQ‑12"); normalise so IDs stay searchable/traceable.
      return { ...r, text: r.text.replace(/[‐‑]/g, '-'), provider };
    } catch (e) {
      if (e.code === 'TRUNCATED') throw e; // caller handles by splitting work
      errors.push(`${provider}: ${e.message}`);
    }
  }
  throw new AppError(502, 'GENERATION_FAILED', errors.join(' | '));
}

export async function testLlm(llm) {
  const r = await chat({ messages: [{ role: 'user', content: 'Reply with the single word OK.' }], maxTokens: 300 }, { ...llm, fallback: false });
  return { ok: true, provider: r.provider, model: r.model };
}

export async function listModels(provider, llm) {
  try {
    if (provider === 'groq') {
      if (!llm.groqKey) return [];
      const res = await fetch(`${GROQ_URL}/models`, { headers: { Authorization: `Bearer ${llm.groqKey}` }, signal: AbortSignal.timeout(15000) });
      if (!res.ok) return [];
      const data = await res.json();
      return (data.data || [])
        .map((m) => m.id)
        .filter((id) => !/whisper|orpheus|guard|tts|playai|allam/i.test(id))
        .sort();
    }
    const res = await fetch(`${OLLAMA_BASE_URL}/api/tags`, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) return [];
    return ((await res.json()).models || []).map((m) => m.name).sort();
  } catch {
    return [];
  }
}

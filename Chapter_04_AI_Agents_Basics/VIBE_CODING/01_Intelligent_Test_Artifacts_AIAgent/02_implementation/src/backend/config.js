// Server-side configuration. Secrets are read from the .env file and never sent to the browser.
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

const here = path.dirname(fileURLToPath(import.meta.url));
export const APP_ROOT = path.resolve(here, '../..'); // 02_implementation/
// Default: Chapter_04_AI_Agents_Basics/.env (three levels above 02_implementation)
export const ENV_FILE = process.env.ENV_FILE || path.resolve(APP_ROOT, '../../../.env');
// Local: the authoritative ../01_plan folder. Vercel: the copy bundled by `npm run bundle-templates`.
const SOURCE_TEMPLATES = path.resolve(APP_ROOT, '../01_plan');
export const TEMPLATE_DIR = process.env.TEMPLATE_DIR
  || (fs.existsSync(SOURCE_TEMPLATES) ? SOURCE_TEMPLATES : path.resolve(APP_ROOT, 'templates'));

// On Vercel, configuration comes only from project environment variables; the Settings page is read-only.
export const READ_ONLY_SETTINGS = Boolean(process.env.VERCEL);

export const envLoaded = fs.existsSync(ENV_FILE);
if (envLoaded) dotenv.config({ path: ENV_FILE, quiet: true });

export const PORT = Number(process.env.PORT || 3001);
export const GROQ_TPM_LIMIT = Number(process.env.GROQ_TPM_LIMIT || 8000);
// Documented default; selectable in Settings. Not stated in the project inputs.
export const DEFAULT_GROQ_MODEL = 'openai/gpt-oss-120b';
export const OLLAMA_BASE_URL = (process.env.OLLAMA_BASE_URL || 'http://localhost:11434').replace(/\/+$/, '');

// Runtime settings. "Save changes" in the UI updates this object in memory only (never written to disk).
export const settings = {
  jira: {
    baseUrl: (process.env.JIRA_BASE_URL || '').trim().replace(/\/+$/, ''),
    email: (process.env.JIRA_EMAIL || '').trim(),
    token: (process.env.JIRA_API_TOKEN || '').trim(),
  },
  llm: {
    provider: process.env.LLM_PROVIDER || (process.env.GROQ_API_KEY ? 'groq' : 'ollama'),
    groqKey: (process.env.GROQ_API_KEY || '').trim(),
    groqModel: process.env.GROQ_MODEL || DEFAULT_GROQ_MODEL,
    ollamaModel: process.env.OLLAMA_MODEL || '',
    fallback: true,
  },
};

const maskEmail = (e) => e.replace(/^(.)[^@]*(@.*)$/, '$1•••$2');
export const publicEmail = () => (READ_ONLY_SETTINGS ? maskEmail(settings.jira.email) : settings.jira.email);

/**
 * Resolves Jira credentials from form values. A saved token is only ever sent to the saved URL + email;
 * a different URL or email requires its own token (prevents sending the token to another host).
 */
export function resolveJira(form = {}) {
  const baseUrl = typeof form.baseUrl === 'string' && form.baseUrl.trim() ? form.baseUrl.trim().replace(/\/+$/, '') : settings.jira.baseUrl;
  const email = typeof form.email === 'string' && form.email.trim() && form.email.trim() !== publicEmail() ? form.email.trim() : settings.jira.email;
  const token = typeof form.token === 'string' ? form.token.trim() : '';
  if (token) return { baseUrl, email, token };
  if (baseUrl !== settings.jira.baseUrl || email !== settings.jira.email) {
    throw new AppError(400, 'TOKEN_REQUIRED', 'Enter the API token for this Jira URL and email. The saved token is only used with the saved URL and email.');
  }
  return { ...settings.jira };
}

export function publicSettings() {
  const { jira, llm } = settings;
  return {
    readOnly: READ_ONLY_SETTINGS,
    jira: { baseUrl: jira.baseUrl, email: publicEmail(), tokenSet: Boolean(jira.token) },
    llm: {
      provider: llm.provider,
      groqKeySet: Boolean(llm.groqKey),
      groqModel: llm.groqModel,
      ollamaModel: llm.ollamaModel,
      fallback: llm.fallback,
    },
  };
}

export function updateSettings(body = {}) {
  if (READ_ONLY_SETTINGS) {
    throw new AppError(403, 'READ_ONLY', 'Settings on this deployment are managed through Vercel environment variables.');
  }
  const l = body.llm || {};
  settings.jira = resolveJira(body.jira); // validates first: blank token = keep, only for the same URL + email
  if (l.provider === 'groq' || l.provider === 'ollama') settings.llm.provider = l.provider;
  if (typeof l.groqKey === 'string' && l.groqKey.trim()) settings.llm.groqKey = l.groqKey.trim();
  if (typeof l.groqModel === 'string' && l.groqModel) settings.llm.groqModel = l.groqModel;
  if (typeof l.ollamaModel === 'string') settings.llm.ollamaModel = l.ollamaModel;
  if (typeof l.fallback === 'boolean') settings.llm.fallback = l.fallback;
}

export class AppError extends Error {
  constructor(status, code, message) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

export const MISSING = 'Insufficient information to determine.';
export const INFERENCE = 'Inference (low confidence)';

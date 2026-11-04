import path from 'node:path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '../../.env'), quiet: true });

function readNumber(name: string, fallback: number): number {
  const raw = process.env[name];
  if (raw === undefined || raw.trim() === '') return fallback;
  const value = Number(raw);
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(`Environment variable ${name} must be a positive number, received "${raw}"`);
  }
  return value;
}

function readString(name: string, fallback = ''): string {
  return (process.env[name] ?? fallback).trim();
}

/** Typed, validated runtime configuration. Credentials only ever come from the environment. */
export const env = Object.freeze({
  baseUrl: readString('BASE_URL', 'https://app.wingify.com/#/login'),
  validEmail: readString('VALID_EMAIL'),
  validPassword: readString('VALID_PASSWORD'),
  headless: readString('HEADLESS', 'true').toLowerCase() !== 'false',
  workers: readNumber('WORKERS', 2),
  actionTimeout: readNumber('ACTION_TIMEOUT_MS', 15_000),
  navigationTimeout: readNumber('NAVIGATION_TIMEOUT_MS', 30_000),
  expectTimeout: readNumber('EXPECT_TIMEOUT_MS', 10_000),
});

export const hasValidCredentials = (): boolean => env.validEmail !== '' && env.validPassword !== '';

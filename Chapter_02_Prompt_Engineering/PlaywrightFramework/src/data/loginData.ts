/**
 * Negative-path test data. These values are deliberately invalid and are NOT real accounts.
 * Valid credentials are never stored here — they come only from VALID_EMAIL / VALID_PASSWORD.
 */
export const invalidCredentials = {
  unregisteredEmail: 'qa.automation.unregistered@example.com',
  wrongPassword: 'Invalid#Passw0rd!',
  // Reserved TLD (RFC 2606) guarantees this mailbox does not exist.
  anotherUnregisteredEmail: 'not.a.vwo.user@invalid.test',
} as const;

export const malformedEmails: readonly string[] = ['plainaddress', 'user@', '@example.com', 'user@@example.com'];

/** Verified behaviour (2026-11-04): the login form is `novalidate`, so every submit reaches POST /login. */
export const AUTH = {
  loginEndpointPath: '/login',
  rejectedStatus: 401,
  rateLimitedStatus: 429,
  // Observed verbatim in the live application after a 401 response.
  rejectedMessage: 'Your email, password, IP address or location did not match',
} as const;

export const ROUTES = {
  login: /#\/login$/,
  forgotPassword: /#\/forgot-password$/,
  dashboard: /#\/dashboard/,
  freeTrialLink: /^https:\/\/vwo\.com\/free-trial\//,
  // Verified: vwo.com/free-trial/ currently redirects to wingify.com/free-trial/.
  freeTrialLanding: /^https:\/\/(vwo|wingify)\.com\/free-trial\//,
} as const;

export const MOBILE_VIEWPORT = { width: 390, height: 844 } as const;

/**
 * Session & portal-key helpers.
 * Web Crypto only, so the same code runs in middleware (Edge) and in API routes (Node).
 */

export const SESSION_COOKIE = 'igeads_session';
export const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 gün

export interface SessionUser {
  userId: string;
  orgId: string;
  email: string;
  name: string;
  role: string; // owner, admin, member
  type: 'agency' | 'business';
}

interface SessionPayload extends SessionUser {
  exp: number;
}

const DEV_SECRET = 'igeads-dev-secret-do-not-use-in-production';

function getSecret(): string | null {
  const secret = process.env.AUTH_SECRET?.trim();
  if (secret) return secret;
  if (process.env.NODE_ENV !== 'production') return DEV_SECRET;
  return null;
}

const encoder = new TextEncoder();

function toBase64Url(bytes: Uint8Array): string {
  let binary = '';
  bytes.forEach(b => { binary += String.fromCharCode(b); });
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(input: string): Uint8Array {
  const padded = input.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((input.length + 3) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function hmac(data: string): Promise<string | null> {
  const secret = getSecret();
  if (!secret) return null;
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(data));
  return toBase64Url(new Uint8Array(sig));
}

export function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function createSessionToken(user: SessionUser): Promise<string | null> {
  const payload: SessionPayload = { ...user, exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS };
  const body = toBase64Url(encoder.encode(JSON.stringify(payload)));
  const sig = await hmac(`session.${body}`);
  return sig ? `${body}.${sig}` : null;
}

export async function verifySessionToken(token?: string | null): Promise<SessionUser | null> {
  if (!token) return null;
  const [body, sig] = token.split('.');
  if (!body || !sig) return null;
  const expected = await hmac(`session.${body}`);
  if (!expected || !safeEqual(sig, expected)) return null;
  try {
    const payload = JSON.parse(new TextDecoder().decode(fromBase64Url(body))) as SessionPayload;
    if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) return null;
    // Sessions issued before accounts existed carry no organization; they must sign in again
    if (!payload.userId || !payload.orgId) return null;
    const { exp, ...user } = payload;
    return user;
  } catch {
    return null;
  }
}

/** Müşteri portalı linkine eklenen, markaya özel erişim anahtarı: "<orgId>.<imza>" */
export async function createPortalKey(orgId: string, clientSlug: string): Promise<string | null> {
  const sig = await hmac(`portal.${orgId}.${clientSlug}`);
  return sig ? `${orgId}.${sig.slice(0, 32)}` : null;
}

/** Returns the organization the portal key was issued for, or null when the key is not valid for this brand */
export async function verifyPortalKey(clientSlug?: string | null, key?: string | null): Promise<string | null> {
  if (!clientSlug || !key) return null;
  const orgId = key.split('.')[0];
  if (!orgId) return null;
  const expected = await createPortalKey(orgId, clientSlug);
  return expected && safeEqual(key, expected) ? orgId : null;
}

/** Yönetici hesabı ortam değişkenlerinden okunur; geliştirme ortamında varsayılan hesap açılır. */
export function getAdminCredentials(): { email: string; password: string } | null {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (email && password) return { email, password };
  if (process.env.NODE_ENV !== 'production') {
    return { email: 'admin@igeads.com', password: 'igeads-dev' };
  }
  return null;
}

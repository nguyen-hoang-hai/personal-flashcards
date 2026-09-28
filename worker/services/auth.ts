import { Env, User } from '../types';

export async function hashToken(token: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(token);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export function parseCookies(header: string | null): Record<string, string> {
  const cookies: Record<string, string> = {};
  if (!header) return cookies;
  const parts = header.split(';');
  for (const part of parts) {
    const [name, ...val] = part.trim().split('=');
    if (name && val.length > 0) {
      cookies[name] = decodeURIComponent(val.join('='));
    }
  }
  return cookies;
}

export async function getSessionUser(request: Request, env: Env): Promise<User | null> {
  const cookieHeader = request.headers.get('Cookie');
  const cookies = parseCookies(cookieHeader);
  const token = cookies['__Host-session'] || cookies['session'];
  if (!token) return null;

  const tokenHash = await hashToken(token);
  const now = new Date().toISOString();

  const session = await env.DB.prepare(
    `SELECT s.id as session_id, u.* 
     FROM sessions s 
     JOIN users u ON s.user_id = u.id 
     WHERE s.token_hash = ? AND s.expires_at > ? AND s.revoked_at IS NULL`
  )
    .bind(tokenHash, now)
    .first<User & { session_id: string }>();

  if (!session) return null;
  return {
    id: session.id,
    email: session.email,
    display_name: session.display_name,
    created_at: session.created_at,
    last_login_at: session.last_login_at,
  };
}

export async function createSession(userId: string, env: Env, request?: Request): Promise<{ token: string; cookie: string }> {
  const token = crypto.randomUUID();
  const tokenHash = await hashToken(token);
  const sessionId = crypto.randomUUID();
  // 30 days session
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

  await env.DB.prepare(
    `INSERT INTO sessions (id, user_id, token_hash, expires_at) VALUES (?, ?, ?, ?)`
  )
    .bind(sessionId, userId, tokenHash, expiresAt)
    .run();

  // Update last login
  await env.DB.prepare(`UPDATE users SET last_login_at = CURRENT_TIMESTAMP WHERE id = ?`)
    .bind(userId)
    .run();

  const isHttps = request ? new URL(request.url).protocol === 'https:' : false;
  const cookieName = isHttps ? '__Host-session' : 'session';
  const cookie = `${cookieName}=${token}; Path=/; Max-Age=2592000; HttpOnly; SameSite=Lax${isHttps ? '; Secure' : ''}`;

  return { token, cookie };
}

export function createClearCookie(request?: Request): string {
  const isHttps = request ? new URL(request.url).protocol === 'https:' : false;
  const cookieName = isHttps ? '__Host-session' : 'session';
  return `${cookieName}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax${isHttps ? '; Secure' : ''}`;
}

export interface GoogleJwtPayload {
  email: string;
  name?: string;
  picture?: string;
  sub: string;
  aud: string;
  exp: number;
}

export function decodeGoogleJwt(token: string): GoogleJwtPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload) as GoogleJwtPayload;
  } catch {
    return null;
  }
}

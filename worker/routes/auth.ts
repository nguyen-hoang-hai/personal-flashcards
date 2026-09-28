import { Env, User } from '../types';
import {
  createSession,
  createClearCookie,
  decodeGoogleJwt,
  getSessionUser,
  hashToken,
} from '../services/auth';

export async function handleAuthRoutes(
  request: Request,
  env: Env,
  url: URL
): Promise<Response> {
  const method = request.method;
  const path = url.pathname;

  if (path === '/api/auth/me' && method === 'GET') {
    const user = await getSessionUser(request, env);
    if (!user) {
      return Response.json({ user: null }, { status: 401 });
    }
    return Response.json({ user });
  }

  if (path === '/api/auth/dev-login' && method === 'POST') {
    // Only available in dev or for initial setup
    const rawAllowed = env.ALLOWED_EMAIL || 'hai@example.com';
    const allowedEmail = rawAllowed.split(',')[0].trim();
    let user = await env.DB.prepare('SELECT * FROM users WHERE LOWER(email) = LOWER(?)')
      .bind(allowedEmail)
      .first<User>();

    if (!user) {
      const id = crypto.randomUUID();
      await env.DB.prepare(
        'INSERT INTO users (id, email, display_name) VALUES (?, ?, ?)'
      )
        .bind(id, allowedEmail, 'Hai')
        .run();

      user = {
        id,
        email: allowedEmail,
        display_name: 'Hai',
        created_at: new Date().toISOString(),
        last_login_at: null,
      };
    }

    const { cookie } = await createSession(user.id, env, request);
    return new Response(JSON.stringify({ success: true, user }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': cookie,
      },
    });
  }

  if (path === '/api/auth/google' && method === 'POST') {
    try {
      const body = (await request.json()) as { credential?: string };
      if (!body.credential) {
        return Response.json({ error: 'Missing Google credential' }, { status: 400 });
      }

      const payload = decodeGoogleJwt(body.credential);
      if (!payload || !payload.email) {
        return Response.json({ error: 'Invalid Google credential' }, { status: 400 });
      }

      // Check allowed email
      const allowedEmails = (env.ALLOWED_EMAIL || '')
        .split(',')
        .map((e) => e.trim().toLowerCase())
        .filter(Boolean);
      if (allowedEmails.length > 0 && !allowedEmails.includes(payload.email.toLowerCase())) {
        return Response.json(
          { error: `Unauthorized email: ${payload.email}. Chỉ chủ sở hữu mới có quyền truy cập.` },
          { status: 403 }
        );
      }

      // Find or create user
      let user = await env.DB.prepare('SELECT * FROM users WHERE email = ?')
        .bind(payload.email)
        .first<User>();

      if (!user) {
        const id = crypto.randomUUID();
        const name = payload.name || payload.email.split('@')[0];
        await env.DB.prepare(
          'INSERT INTO users (id, email, display_name) VALUES (?, ?, ?)'
        )
          .bind(id, payload.email, name)
          .run();

        user = {
          id,
          email: payload.email,
          display_name: name,
          created_at: new Date().toISOString(),
          last_login_at: null,
        };
      }

      const { cookie } = await createSession(user.id, env, request);
      return new Response(JSON.stringify({ success: true, user }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Set-Cookie': cookie,
        },
      });
    } catch (e: any) {
      return Response.json({ error: e.message || 'Google Auth Error' }, { status: 500 });
    }
  }

  if (path === '/api/auth/logout' && method === 'POST') {
    const user = await getSessionUser(request, env);
    if (user) {
      // revoke all or current session
      await env.DB.prepare(
        'UPDATE sessions SET revoked_at = CURRENT_TIMESTAMP WHERE user_id = ?'
      )
        .bind(user.id)
        .run();
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': createClearCookie(request),
      },
    });
  }

  return Response.json({ error: 'Not Found' }, { status: 404 });
}

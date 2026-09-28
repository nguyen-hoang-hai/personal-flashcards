import { Env } from './types';
import { getSessionUser } from './services/auth';
import { handleAuthRoutes } from './routes/auth';
import { handleDeckRoutes } from './routes/decks';
import { handleVocabularyRoutes } from './routes/vocabulary';
import { handleStudyRoutes } from './routes/study';
import { handleHealthRoutes } from './routes/health';
import { handleLanguageRoutes } from './routes/languages';

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    // Handle CORS preflight for dev
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': request.headers.get('Origin') || '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Allow-Credentials': 'true',
        },
      });
    }

    try {
      // API routing
      if (url.pathname.startsWith('/api/auth')) {
        return await handleAuthRoutes(request, env, url);
      }

      if (url.pathname.startsWith('/api/')) {
        // Authenticate user
        const user = await getSessionUser(request, env);
        if (!user) {
          return Response.json({ error: 'Unauthorized. Please login.' }, { status: 401 });
        }

        if (url.pathname.startsWith('/api/decks')) {
          return await handleDeckRoutes(request, env, user, url);
        }

        if (url.pathname.startsWith('/api/vocabulary')) {
          return await handleVocabularyRoutes(request, env, user, url);
        }

        if (url.pathname.startsWith('/api/study')) {
          return await handleStudyRoutes(request, env, user, url);
        }

        if (url.pathname.startsWith('/api/health')) {
          return await handleHealthRoutes(request, env, user, url);
        }

        if (url.pathname.startsWith('/api/languages')) {
          return await handleLanguageRoutes(request, env, user, url);
        }

        return Response.json({ error: 'API endpoint not found' }, { status: 404 });
      }

      // Static assets fallback if deployed with assets
      if (env.ASSETS) {
        let res = await env.ASSETS.fetch(request);
        if (res.status === 404 && request.method === 'GET') {
          // SPA fallback: return index.html for client-side routing
          const indexUrl = new URL('/index.html', request.url);
          return await env.ASSETS.fetch(new Request(indexUrl.toString(), request));
        }
        return res;
      }

      return new Response('Personal Flashcards Worker Running', { status: 200 });
    } catch (err: any) {
      console.error('Worker unhandled error:', err);
      return Response.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
    }
  },
};

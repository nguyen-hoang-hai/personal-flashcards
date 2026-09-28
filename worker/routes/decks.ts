import { Env, User, Deck } from '../types';

export async function handleDeckRoutes(
  request: Request,
  env: Env,
  user: User,
  url: URL
): Promise<Response> {
  const method = request.method;
  const path = url.pathname;

  // GET /api/decks?language=en
  if (path === '/api/decks' && method === 'GET') {
    const lang = url.searchParams.get('language') || 'en';
    const now = new Date().toISOString();

    const query = `
      SELECT 
        d.*,
        COALESCE(uds.study_status, 'active') as study_status,
        COALESCE(uds.new_card_weight, 1.0) as new_card_weight,
        COALESCE(uds.display_order, 0) as display_order,
        COUNT(DISTINCT v.id) as total_words,
        COUNT(DISTINCT CASE 
          WHEN ucp.status IN ('learning', 'review', 'mastered') AND ucp.due_at <= ? 
          THEN sd.id 
          ELSE NULL 
        END) as due_count,
        COUNT(DISTINCT CASE 
          WHEN ucp.status = 'new' OR ucp.status IS NULL 
          THEN v.id 
          ELSE NULL 
        END) as new_count
      FROM decks d
      LEFT JOIN user_deck_settings uds ON d.id = uds.deck_id AND uds.user_id = ?
      LEFT JOIN vocabulary v ON d.id = v.deck_id AND v.is_active = 1
      LEFT JOIN study_directions sd ON v.id = sd.vocabulary_id AND sd.activation_status = 'active'
      LEFT JOIN user_card_progress ucp ON sd.id = ucp.study_direction_id AND ucp.user_id = ?
      WHERE d.owner_id = ? AND d.language = ?
      GROUP BY d.id
      ORDER BY uds.display_order ASC, d.created_at ASC
    `;

    const { results } = await env.DB.prepare(query)
      .bind(now, user.id, user.id, user.id, lang)
      .all<Deck>();

    return Response.json({ decks: results });
  }

  // POST /api/decks
  if (path === '/api/decks' && method === 'POST') {
    const body = (await request.json()) as {
      language: 'en' | 'ja';
      title: string;
      description?: string;
    };

    if (!body.title || !body.language) {
      return Response.json({ error: 'Title and language are required' }, { status: 400 });
    }

    const id = crypto.randomUUID();
    await env.DB.prepare(
      `INSERT INTO decks (id, owner_id, language, title, description, source_type)
       VALUES (?, ?, ?, ?, ?, 'personal')`
    )
      .bind(id, user.id, body.language, body.title, body.description || null)
      .run();

    await env.DB.prepare(
      `INSERT INTO user_deck_settings (user_id, deck_id, study_status) VALUES (?, ?, 'active')`
    )
      .bind(user.id, id)
      .run();

    return Response.json({ success: true, deckId: id });
  }

  // PUT /api/decks/:id/settings
  const settingsMatch = path.match(/^\/api\/decks\/([^/]+)\/settings$/);
  if (settingsMatch && method === 'PUT') {
    const deckId = settingsMatch[1];
    const body = (await request.json()) as {
      study_status?: 'active' | 'hidden' | 'archived';
      new_card_weight?: number;
    };

    await env.DB.prepare(
      `INSERT INTO user_deck_settings (user_id, deck_id, study_status, new_card_weight, updated_at)
       VALUES (?, ?, COALESCE(?, 'active'), COALESCE(?, 1.0), CURRENT_TIMESTAMP)
       ON CONFLICT(user_id, deck_id) DO UPDATE SET
         study_status = COALESCE(?, user_deck_settings.study_status),
         new_card_weight = COALESCE(?, user_deck_settings.new_card_weight),
         updated_at = CURRENT_TIMESTAMP`
    )
      .bind(
        user.id,
        deckId,
        body.study_status || null,
        body.new_card_weight || null,
        body.study_status || null,
        body.new_card_weight || null
      )
      .run();

    return Response.json({ success: true });
  }

  // PUT /api/decks/:id
  const idMatch = path.match(/^\/api\/decks\/([^/]+)$/);
  if (idMatch && method === 'PUT') {
    const deckId = idMatch[1];
    const body = (await request.json()) as { title: string; description?: string };
    await env.DB.prepare(
      `UPDATE decks SET title = ?, description = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND owner_id = ?`
    )
      .bind(body.title, body.description || null, deckId, user.id)
      .run();

    return Response.json({ success: true });
  }

  // DELETE /api/decks/:id
  if (idMatch && method === 'DELETE') {
    const deckId = idMatch[1];
    await env.DB.prepare(`DELETE FROM decks WHERE id = ? AND owner_id = ?`)
      .bind(deckId, user.id)
      .run();

    return Response.json({ success: true });
  }

  return Response.json({ error: 'Not Found' }, { status: 404 });
}

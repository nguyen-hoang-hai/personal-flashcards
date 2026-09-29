import { Env, User, Language } from '../types';

export async function handleLanguageRoutes(
  request: Request,
  env: Env,
  user: User,
  url: URL
): Promise<Response> {
  const method = request.method;
  const path = url.pathname;

  // GET /api/languages/hub
  if (path === '/api/languages/hub' && method === 'GET') {
    const enStats = await getLanguageSummary(env, user.id, 'en');
    const jaStats = await getLanguageSummary(env, user.id, 'ja');
    return Response.json({ en: enStats, ja: jaStats });
  }

  // GET /api/languages/:lang/dashboard
  const dashMatch = path.match(/^\/api\/languages\/([a-z]{2})\/dashboard$/);
  if (dashMatch && method === 'GET') {
    const lang = dashMatch[1] as Language;
    const summary = await getLanguageSummary(env, user.id, lang);

    // Check if there's an active session
    const activeSession = await env.DB.prepare(
      `SELECT * FROM study_sessions 
       WHERE user_id = ? AND language = ? AND status = 'active'
       ORDER BY started_at DESC LIMIT 1`
    )
      .bind(user.id, lang)
      .first<any>();

    return Response.json({ ...summary, activeSession });
  }

  // GET /api/languages/:lang/statistics
  const statsMatch = path.match(/^\/api\/languages\/([a-z]{2})\/statistics$/);
  if (statsMatch && method === 'GET') {
    const lang = statsMatch[1] as Language;

    // Vocabulary status breakdown (per vocabulary word)
    const { results: statusCounts } = await env.DB.prepare(
      `WITH vocab_status AS (
         SELECT 
           v.id,
           CASE 
             WHEN MAX(CASE WHEN ucp.status = 'learning' THEN 1 ELSE 0 END) = 1 THEN 'learning'
             WHEN MAX(CASE WHEN ucp.status = 'review' THEN 1 ELSE 0 END) = 1 THEN 'review'
             WHEN MIN(CASE WHEN ucp.status = 'mastered' THEN 1 ELSE 0 END) = 1 AND COUNT(ucp.status) = COUNT(sd.id) THEN 'mastered'
             ELSE 'new'
           END as status
         FROM vocabulary v
         JOIN decks d ON v.deck_id = d.id
         JOIN study_directions sd ON v.id = sd.vocabulary_id AND sd.activation_status = 'active'
         LEFT JOIN user_card_progress ucp ON sd.id = ucp.study_direction_id AND ucp.user_id = ?
         WHERE v.language = ? AND v.is_active = 1
         GROUP BY v.id
       )
       SELECT status, COUNT(*) as count
       FROM vocab_status
       GROUP BY status`
    )
      .bind(user.id, lang)
      .all<{ status: string; count: number }>();

    // Ratings breakdown
    const { results: ratingCounts } = await env.DB.prepare(
      `SELECT rl.rating, COUNT(rl.id) as count
       FROM review_logs rl
       JOIN study_directions sd ON rl.study_direction_id = sd.id
       JOIN vocabulary v ON sd.vocabulary_id = v.id
       WHERE rl.user_id = ? AND v.language = ?
       GROUP BY rl.rating`
    )
      .bind(user.id, lang)
      .all<{ rating: string; count: number }>();

    // Activity in last 14 days
    const { results: recentActivity } = await env.DB.prepare(
      `SELECT 
         DATE(rl.reviewed_at) as review_date,
         COUNT(rl.id) as review_count
       FROM review_logs rl
       JOIN study_directions sd ON rl.study_direction_id = sd.id
       JOIN vocabulary v ON sd.vocabulary_id = v.id
       WHERE rl.user_id = ? AND v.language = ? AND rl.reviewed_at >= DATE('now', '-14 days')
       GROUP BY DATE(rl.reviewed_at)
       ORDER BY review_date ASC`
    )
      .bind(user.id, lang)
      .all<{ review_date: string; review_count: number }>();

    return Response.json({
      statusDistribution: statusCounts,
      ratingDistribution: ratingCounts,
      recentActivity,
    });
  }

  return Response.json({ error: 'Not Found' }, { status: 404 });
}

async function getLanguageSummary(env: Env, userId: string, language: Language) {
  const endOfDay = new Date();
  endOfDay.setUTCHours(23, 59, 59, 999);
  const endOfDayIso = endOfDay.toISOString();
  const startOfDay = new Date();
  startOfDay.setUTCHours(0, 0, 0, 0);

  // Due count (các thẻ cần ôn trong ngày hôm nay hoặc quá hạn)
  const dueResult = await env.DB.prepare(
    `SELECT COUNT(DISTINCT sd.id) as count
     FROM study_directions sd
     JOIN vocabulary v ON sd.vocabulary_id = v.id AND v.is_active = 1
     JOIN decks d ON v.deck_id = d.id
     LEFT JOIN user_deck_settings uds ON d.id = uds.deck_id AND uds.user_id = ?
     LEFT JOIN user_card_progress ucp ON sd.id = ucp.study_direction_id AND ucp.user_id = ?
     WHERE v.language = ? AND sd.activation_status = 'active'
       AND COALESCE(uds.study_status, 'active') = 'active'
       AND ucp.status IN ('learning', 'review', 'mastered') AND ucp.due_at <= ?`
  )
    .bind(userId, userId, language, endOfDayIso)
    .first<{ count: number }>();

  // Available new vocabulary count
  const newResult = await env.DB.prepare(
    `SELECT COUNT(DISTINCT v.id) as count
     FROM vocabulary v
     JOIN decks d ON v.deck_id = d.id
     LEFT JOIN user_deck_settings uds ON d.id = uds.deck_id AND uds.user_id = ?
     JOIN study_directions sd ON v.id = sd.vocabulary_id AND sd.activation_status = 'active'
     LEFT JOIN user_card_progress ucp ON sd.id = ucp.study_direction_id AND ucp.user_id = ?
     WHERE v.language = ?
       AND COALESCE(uds.study_status, 'active') = 'active'
       AND (ucp.status = 'new' OR ucp.status IS NULL)`
  )
    .bind(userId, userId, language)
    .first<{ count: number }>();

  // Completed sessions today
  const sessionResult = await env.DB.prepare(
    `SELECT COUNT(id) as count
     FROM study_sessions
     WHERE user_id = ? AND language = ? AND status = 'completed' AND completed_at >= ?`
  )
    .bind(userId, language, startOfDay.toISOString())
    .first<{ count: number }>();

  // Total decks
  const decksResult = await env.DB.prepare(
    `SELECT COUNT(id) as count FROM decks WHERE language = ?`
  )
    .bind(language)
    .first<{ count: number }>();

  return {
    language,
    dueCards: dueResult?.count || 0,
    newWords: newResult?.count || 0,
    sessionsCompletedToday: sessionResult?.count || 0,
    totalDecks: decksResult?.count || 0,
  };
}

import { Env, User, StudySession, StudySessionCard, Rating } from '../types';
import { buildStudyPlan, CandidateCard } from '../services/planner';
import { calculateNextSchedule, canUnlockProgressiveDirection } from '../services/scheduler';

export async function handleStudyRoutes(
  request: Request,
  env: Env,
  user: User,
  url: URL
): Promise<Response> {
  const method = request.method;
  const path = url.pathname;

  // GET /api/study/session/active?language=en
  if (path === '/api/study/session/active' && method === 'GET') {
    const lang = url.searchParams.get('language') || 'en';

    const session = await env.DB.prepare(
      `SELECT * FROM study_sessions 
       WHERE user_id = ? AND language = ? AND status = 'active'
       ORDER BY started_at DESC LIMIT 1`
    )
      .bind(user.id, lang)
      .first<StudySession>();

    if (!session) {
      return Response.json({ session: null });
    }

    const cards = await getSessionCards(env, session.id);
    return Response.json({ session, cards });
  }

  // POST /api/study/session/start
  if (path === '/api/study/session/start' && method === 'POST') {
    const body = (await request.json()) as {
      language: 'en' | 'ja';
      activeDeckIds?: string[];
      sessionSize?: number;
      mode?: 'standard' | 'cram';
    };

    const lang = body.language || 'en';
    const sessionSize = body.sessionSize || 10;

    // Determine active deck IDs if not provided
    let deckIds = body.activeDeckIds;
    if (!deckIds || deckIds.length === 0) {
      const { results } = await env.DB.prepare(
        `SELECT d.id FROM decks d
         JOIN user_deck_settings uds ON d.id = uds.deck_id AND uds.user_id = ?
         WHERE d.owner_id = ? AND d.language = ? AND uds.study_status = 'active'`
      )
        .bind(user.id, user.id, lang)
        .all<{ id: string }>();

      deckIds = results.map((r: { id: string }) => r.id);
    }

    if (deckIds.length === 0) {
      return Response.json({ error: 'No active decks selected' }, { status: 400 });
    }

    // Abandon any existing active session for this language
    await env.DB.prepare(
      `UPDATE study_sessions SET status = 'abandoned' 
       WHERE user_id = ? AND language = ? AND status = 'active'`
    )
      .bind(user.id, lang)
      .run();

    // Query candidate cards
    const query = `
      SELECT 
        sd.id as study_direction_id,
        v.id as vocabulary_id,
        v.deck_id,
        v.language,
        sd.direction,
        COALESCE(ucp.status, 'new') as status,
        ucp.due_at,
        COALESCE(ucp.interval_days, 0) as interval_days,
        COALESCE(ucp.version, 1) as version,
        v.word,
        v.reading,
        v.meaning_vi,
        v.meaning_en,
        v.definition_en,
        v.example,
        v.example_translation,
        v.level,
        d.title as deck_title
      FROM study_directions sd
      JOIN vocabulary v ON sd.vocabulary_id = v.id AND v.is_active = 1
      JOIN decks d ON v.deck_id = d.id
      LEFT JOIN user_card_progress ucp ON sd.id = ucp.study_direction_id AND ucp.user_id = ?
      WHERE d.owner_id = ? AND v.language = ? AND sd.activation_status = 'active'
    `;

    const { results } = await env.DB.prepare(query)
      .bind(user.id, user.id, lang)
      .all<CandidateCard>();

    const plannedQueue = buildStudyPlan(results, deckIds, {
      sessionSize,
      maxNewVocabulary: sessionSize,
      siblingGap: 5,
      deckGap: 1,
      mode: body.mode || 'standard',
    });

    const sessionCards = plannedQueue.slice(0, sessionSize);

    if (sessionCards.length === 0) {
      return Response.json({
        session: null,
        message: 'No cards due for review or available to learn right now!',
      });
    }

    // Create session
    const sessionId = crypto.randomUUID();
    await env.DB.prepare(
      `INSERT INTO study_sessions (id, user_id, language, status, total_cards, completed_cards)
       VALUES (?, ?, ?, 'active', ?, 0)`
    )
      .bind(sessionId, user.id, lang, sessionCards.length)
      .run();

    // Insert cards
    for (let i = 0; i < sessionCards.length; i++) {
      const card = sessionCards[i];
      const cardRowId = crypto.randomUUID();
      await env.DB.prepare(
        `INSERT INTO study_session_cards (id, session_id, study_direction_id, position, status, progress_version)
         VALUES (?, ?, ?, ?, 'pending', ?)`
      )
        .bind(cardRowId, sessionId, card.study_direction_id, i + 1, card.version)
        .run();
    }

    const cards = await getSessionCards(env, sessionId);
    const session = await env.DB.prepare('SELECT * FROM study_sessions WHERE id = ?')
      .bind(sessionId)
      .first<StudySession>();

    return Response.json({ session, cards });
  }

  // GET /api/study/session/:id
  const sessionMatch = path.match(/^\/api\/study\/session\/([^/]+)$/);
  if (sessionMatch && method === 'GET') {
    const sessionId = sessionMatch[1];
    const session = await env.DB.prepare(
      'SELECT * FROM study_sessions WHERE id = ? AND user_id = ?'
    )
      .bind(sessionId, user.id)
      .first<StudySession>();

    if (!session) {
      return Response.json({ error: 'Session not found' }, { status: 404 });
    }

    const cards = await getSessionCards(env, sessionId);
    return Response.json({ session, cards });
  }

  // POST /api/study/session/:id/answer
  const answerMatch = path.match(/^\/api\/study\/session\/([^/]+)\/answer$/);
  if (answerMatch && method === 'POST') {
    const sessionId = answerMatch[1];
    const body = (await request.json()) as {
      studyDirectionId: string;
      rating: Rating;
      expectedProgressVersion: number;
      responseTimeMs?: number;
    };

    // Verify session
    const session = await env.DB.prepare(
      'SELECT * FROM study_sessions WHERE id = ? AND user_id = ?'
    )
      .bind(sessionId, user.id)
      .first<StudySession>();

    if (!session || session.status !== 'active') {
      return Response.json({ error: 'Session is not active' }, { status: 400 });
    }

    // Fetch existing progress
    let progress = await env.DB.prepare(
      'SELECT * FROM user_card_progress WHERE user_id = ? AND study_direction_id = ?'
    )
      .bind(user.id, body.studyDirectionId)
      .first<any>();

    if (!progress) {
      // First time learning
      progress = {
        user_id: user.id,
        study_direction_id: body.studyDirectionId,
        status: 'new',
        repetitions: 0,
        lapses: 0,
        interval_days: 0,
        ease_factor: 2.5,
        version: 1,
      };
    }

    // Optimistic Concurrency Control (OCC)
    if (progress.version !== body.expectedProgressVersion) {
      return Response.json(
        {
          status: 'conflict',
          message: 'Thẻ này đã được cập nhật từ thiết bị khác.',
          latestProgress: progress,
        },
        { status: 409 }
      );
    }

    // Calculate next schedule
    const schedule = calculateNextSchedule(progress, body.rating);
    const newVersion = progress.version + 1;

    // Update user_card_progress
    await env.DB.prepare(
      `INSERT INTO user_card_progress (
        user_id, study_direction_id, status, repetitions, lapses, interval_days,
        ease_factor, due_at, first_reviewed_at, last_reviewed_at, version, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(user_id, study_direction_id) DO UPDATE SET
        status = ?,
        repetitions = ?,
        lapses = ?,
        interval_days = ?,
        ease_factor = ?,
        due_at = ?,
        last_reviewed_at = CURRENT_TIMESTAMP,
        version = ?,
        updated_at = CURRENT_TIMESTAMP`
    )
      .bind(
        user.id,
        body.studyDirectionId,
        schedule.status,
        schedule.repetitions,
        schedule.lapses,
        schedule.interval_days,
        schedule.ease_factor,
        schedule.due_at,
        newVersion,
        // update set params
        schedule.status,
        schedule.repetitions,
        schedule.lapses,
        schedule.interval_days,
        schedule.ease_factor,
        schedule.due_at,
        newVersion
      )
      .run();

    // Log review
    const logId = crypto.randomUUID();
    await env.DB.prepare(
      `INSERT INTO review_logs (
        id, user_id, study_direction_id, rating, previous_interval, next_interval, response_time_ms
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
      .bind(
        logId,
        user.id,
        body.studyDirectionId,
        body.rating,
        progress.interval_days || 0,
        schedule.interval_days,
        body.responseTimeMs || null
      )
      .run();

    // Mark card answered in session
    await env.DB.prepare(
      `UPDATE study_session_cards 
       SET status = 'answered', answered_at = CURRENT_TIMESTAMP, progress_version = ?
       WHERE session_id = ? AND study_direction_id = ? AND status = 'pending'`
    )
      .bind(newVersion, sessionId, body.studyDirectionId)
      .run();

    // Increment completed_cards
    await env.DB.prepare(
      `UPDATE study_sessions 
       SET completed_cards = completed_cards + 1, last_activity_at = CURRENT_TIMESTAMP 
       WHERE id = ?`
    )
      .bind(sessionId)
      .run();

    // If rated 'again', append card to the end of the session to review again
    if (body.rating === 'again') {
      const maxPos = await env.DB.prepare(
        'SELECT MAX(position) as max_pos FROM study_session_cards WHERE session_id = ?'
      )
        .bind(sessionId)
        .first<{ max_pos: number }>();

      const nextPos = (maxPos?.max_pos || 0) + 1;
      const reRowId = crypto.randomUUID();
      await env.DB.prepare(
        `INSERT INTO study_session_cards (id, session_id, study_direction_id, position, status, progress_version)
         VALUES (?, ?, ?, ?, 'pending', ?)`
      )
        .bind(reRowId, sessionId, body.studyDirectionId, nextPos, newVersion)
        .run();

      await env.DB.prepare(
        `UPDATE study_sessions SET total_cards = total_cards + 1 WHERE id = ?`
      )
        .bind(sessionId)
        .run();
    }

    // Check progressive unlock
    let unlockedDirectionInfo: any = null;
    if (canUnlockProgressiveDirection({ ...progress, ...schedule }, body.rating)) {
      const nextDir = await env.DB.prepare(
        `SELECT sd.*, v.word FROM study_directions sd
         JOIN vocabulary v ON sd.vocabulary_id = v.id
         WHERE sd.prerequisite_direction_id = ? AND sd.activation_status = 'locked' LIMIT 1`
      )
        .bind(body.studyDirectionId)
        .first<any>();

      if (nextDir) {
        await env.DB.prepare(
          `UPDATE study_directions SET activation_status = 'active', unlocked_at = CURRENT_TIMESTAMP WHERE id = ?`
        )
          .bind(nextDir.id)
          .run();

        await env.DB.prepare(
          `INSERT OR IGNORE INTO user_card_progress (user_id, study_direction_id, status, version)
           VALUES (?, ?, 'new', 1)`
        )
          .bind(user.id, nextDir.id)
          .run();

        unlockedDirectionInfo = {
          directionId: nextDir.id,
          direction: nextDir.direction,
          word: nextDir.word,
        };
      }
    }

    return Response.json({
      status: 'success',
      newVersion,
      schedule,
      progressiveUnlock: unlockedDirectionInfo,
    });
  }

  // POST /api/study/session/:id/complete
  const completeMatch = path.match(/^\/api\/study\/session\/([^/]+)\/complete$/);
  if (completeMatch && method === 'POST') {
    const sessionId = completeMatch[1];
    await env.DB.prepare(
      `UPDATE study_sessions SET status = 'completed', completed_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?`
    )
      .bind(sessionId, user.id)
      .run();

    return Response.json({ success: true });
  }

  // POST /api/study/session/:id/abandon
  const abandonMatch = path.match(/^\/api\/study\/session\/([^/]+)\/abandon$/);
  if (abandonMatch && method === 'POST') {
    const sessionId = abandonMatch[1];
    await env.DB.prepare(
      `UPDATE study_sessions SET status = 'abandoned' WHERE id = ? AND user_id = ?`
    )
      .bind(sessionId, user.id)
      .run();

    return Response.json({ success: true });
  }

  return Response.json({ error: 'Not Found' }, { status: 404 });
}

async function getSessionCards(env: Env, sessionId: string): Promise<StudySessionCard[]> {
  const query = `
    SELECT 
      ssc.id,
      ssc.session_id,
      ssc.study_direction_id,
      ssc.position,
      ssc.status,
      ssc.progress_version,
      ssc.answered_at,
      sd.direction,
      v.id as vocabulary_id,
      v.word,
      v.reading,
      v.romaji,
      v.pronunciation,
      v.meaning_vi,
      v.meaning_en,
      v.definition_en,
      v.example,
      v.example_translation,
      v.level,
      d.title as deck_title,
      d.id as deck_id,
      COALESCE(ucp.status, 'new') as card_status,
      COALESCE(ucp.interval_days, 0) as current_interval,
      COALESCE(ucp.version, 1) as version
    FROM study_session_cards ssc
    JOIN study_directions sd ON ssc.study_direction_id = sd.id
    JOIN vocabulary v ON sd.vocabulary_id = v.id
    JOIN decks d ON v.deck_id = d.id
    LEFT JOIN user_card_progress ucp ON sd.id = ucp.study_direction_id
    WHERE ssc.session_id = ?
    ORDER BY ssc.position ASC
  `;

  const { results } = await env.DB.prepare(query).bind(sessionId).all<StudySessionCard>();
  return results;
}

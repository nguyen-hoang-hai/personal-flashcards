import { Env, User, Vocabulary, StudyDirection } from '../types';

export async function handleVocabularyRoutes(
  request: Request,
  env: Env,
  user: User,
  url: URL
): Promise<Response> {
  const method = request.method;
  const path = url.pathname;

  // GET /api/vocabulary
  if (path === '/api/vocabulary' && method === 'GET') {
    const deckId = url.searchParams.get('deckId');
    const language = url.searchParams.get('language') || 'en';
    const search = url.searchParams.get('search')?.trim().toLowerCase() || '';
    const page = Math.max(1, parseInt(url.searchParams.get('page') || '1', 10));
    const limit = Math.min(200, Math.max(10, parseInt(url.searchParams.get('limit') || '200', 10)));
    const offset = (page - 1) * limit;

    let whereClause = ` WHERE v.language = ? AND v.is_active = 1`;
    const params: any[] = [language];

    if (deckId) {
      whereClause += ` AND v.deck_id = ?`;
      params.push(deckId);
    }

    if (search) {
      whereClause += ` AND (v.word LIKE ? OR v.meaning_vi LIKE ? OR v.reading LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    // Total count query
    const countSql = `
      SELECT COUNT(DISTINCT v.id) as total
      FROM vocabulary v
      JOIN decks d ON v.deck_id = d.id
      ${whereClause}
    `;
    const countResult = await env.DB.prepare(countSql).bind(...params).first<{ total: number }>();
    const total = countResult?.total || 0;

    // Data query with ordering by id to preserve lesson sequence
    const dataSql = `
      SELECT v.*, d.title as deck_title
      FROM vocabulary v
      JOIN decks d ON v.deck_id = d.id
      ${whereClause}
      ORDER BY v.id ASC
      LIMIT ? OFFSET ?
    `;
    const dataParams = [...params, limit, offset];
    const { results } = await env.DB.prepare(dataSql).bind(...dataParams).all<Vocabulary & { deck_title: string }>();

    // Fetch directions for these words in chunks to avoid D1 variable limits (max 100)
    const vocabIds = results.map((r: Vocabulary & { deck_title: string }) => r.id);
    let directionsMap: Record<string, StudyDirection[]> = {};

    if (vocabIds.length > 0) {
      const CHUNK_SIZE = 50;
      for (let i = 0; i < vocabIds.length; i += CHUNK_SIZE) {
        const chunk = vocabIds.slice(i, i + CHUNK_SIZE);
        const placeholders = chunk.map(() => '?').join(',');
        const dirSql = `
          SELECT sd.*, ucp.status as progress_status, ucp.repetitions, ucp.interval_days, ucp.due_at, ucp.version
          FROM study_directions sd
          LEFT JOIN user_card_progress ucp ON sd.id = ucp.study_direction_id AND ucp.user_id = ?
          WHERE sd.vocabulary_id IN (${placeholders})
        `;
        const { results: dirResults } = await env.DB.prepare(dirSql)
          .bind(user.id, ...chunk)
          .all<any>();

        for (const d of dirResults) {
          if (!directionsMap[d.vocabulary_id]) directionsMap[d.vocabulary_id] = [];
          directionsMap[d.vocabulary_id].push({
          id: d.id,
          vocabulary_id: d.vocabulary_id,
          direction: d.direction,
          prompt_template: d.prompt_template,
          answer_template: d.answer_template,
          activation_status: d.activation_status,
          prerequisite_direction_id: d.prerequisite_direction_id,
          unlocked_at: d.unlocked_at,
          created_at: d.created_at,
          progress: d.progress_status
            ? {
                user_id: user.id,
                study_direction_id: d.id,
                status: d.progress_status,
                repetitions: d.repetitions,
                lapses: 0,
                interval_days: d.interval_days,
                ease_factor: 2.5,
                difficulty: null,
                stability: null,
                retrievability: null,
                due_at: d.due_at,
                first_reviewed_at: null,
                last_reviewed_at: null,
                version: d.version || 1,
                updated_at: '',
              }
            : undefined,
        });
      }
    }
  }

    const enriched = results.map((v: Vocabulary) => ({
      ...v,
      study_directions: directionsMap[v.id] || [],
    }));

    return Response.json({
      vocabulary: enriched,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    });
  }

  // POST /api/vocabulary
  if (path === '/api/vocabulary' && method === 'POST') {
    const body = (await request.json()) as {
      deck_id: string;
      language: 'en' | 'ja';
      word: string;
      reading?: string;
      romaji?: string;
      pronunciation?: string;
      meaning_vi: string;
      meaning_en?: string;
      definition_en?: string;
      example?: string;
      example_translation?: string;
      level?: string;
      part_of_speech?: string;
      tags?: string;
      notes?: string;
    };

    if (!body.deck_id || !body.word || !body.meaning_vi) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const vocabId = crypto.randomUUID();
    const normalizedWord = body.word.trim().toLowerCase();

    await env.DB.prepare(
      `INSERT INTO vocabulary (
        id, deck_id, language, word, normalized_word, reading, romaji, pronunciation,
        meaning_vi, meaning_en, definition_en, example, example_translation,
        level, part_of_speech, tags, notes, source_type
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'personal')`
    )
      .bind(
        vocabId,
        body.deck_id,
        body.language,
        body.word.trim(),
        normalizedWord,
        body.reading || null,
        body.romaji || null,
        body.pronunciation || null,
        body.meaning_vi.trim(),
        body.meaning_en || null,
        body.definition_en || null,
        body.example || null,
        body.example_translation || null,
        body.level || null,
        body.part_of_speech || null,
        body.tags || null,
        body.notes || null
      )
      .run();

    // Automatically create study directions based on language & rules
    await createDefaultStudyDirections(env, vocabId, body, user.id);

    return Response.json({ success: true, vocabularyId: vocabId });
  }

  // POST /api/vocabulary/bulk
  if (path === '/api/vocabulary/bulk' && method === 'POST') {
    const { deck_id, language, items } = (await request.json()) as {
      deck_id: string;
      language: 'en' | 'ja';
      items: Array<{
        word: string;
        reading?: string;
        pronunciation?: string;
        meaning_vi: string;
        definition_en?: string;
        example?: string;
        example_translation?: string;
        level?: string;
        tags?: string;
      }>;
    };

    if (!deck_id || !items || !Array.isArray(items) || items.length === 0) {
      return Response.json({ error: 'Dữ liệu import không hợp lệ hoặc rỗng' }, { status: 400 });
    }

    let importedCount = 0;
    for (const item of items) {
      if (!item.word || !item.meaning_vi) continue;
      const vocabId = crypto.randomUUID();
      const normalizedWord = item.word.trim().toLowerCase();

      await env.DB.prepare(
        `INSERT INTO vocabulary (
          id, deck_id, language, word, normalized_word, reading, pronunciation,
          meaning_vi, definition_en, example, example_translation, level, tags, source_type
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'imported')`
      )
        .bind(
          vocabId,
          deck_id,
          language,
          item.word.trim(),
          normalizedWord,
          item.reading || null,
          item.pronunciation || null,
          item.meaning_vi.trim(),
          item.definition_en || null,
          item.example || null,
          item.example_translation || null,
          item.level || null,
          item.tags || null
        )
        .run();

      await createDefaultStudyDirections(env, vocabId, { ...item, language }, user.id);
      importedCount++;
    }

    return Response.json({ success: true, count: importedCount });
  }

  // PUT /api/vocabulary/:id/directions/:dirId/status
  const dirMatch = path.match(/^\/api\/vocabulary\/[^/]+\/directions\/([^/]+)\/status$/);
  if (dirMatch && method === 'PUT') {
    const dirId = dirMatch[1];
    const { status } = (await request.json()) as { status: 'active' | 'suspended' | 'available' | 'locked' };

    await env.DB.prepare(
      `UPDATE study_directions SET activation_status = ? WHERE id = ?`
    )
      .bind(status, dirId)
      .run();

    return Response.json({ success: true });
  }

  // DELETE /api/vocabulary/:id
  const idMatch = path.match(/^\/api\/vocabulary\/([^/]+)$/);
  if (idMatch && method === 'DELETE') {
    const vocabId = idMatch[1];
    await env.DB.prepare(`DELETE FROM vocabulary WHERE id = ?`).bind(vocabId).run();
    return Response.json({ success: true });
  }

  return Response.json({ error: 'Not Found' }, { status: 404 });
}

async function createDefaultStudyDirections(
  env: Env,
  vocabId: string,
  vocab: any,
  userId: string
) {
  const directionsToInsert: {
    id: string;
    direction: string;
    status: 'active' | 'locked';
    prereqId?: string;
  }[] = [];

  if (vocab.language === 'en') {
    const baseId = crypto.randomUUID();
    const reverseId = crypto.randomUUID();
    // en_to_vi: Word -> Meaning (Active)
    directionsToInsert.push({
      id: baseId,
      direction: 'en_to_vi',
      status: 'active',
    });
    // vi_to_en: Meaning -> Word (Locked until base direction progresses)
    directionsToInsert.push({
      id: reverseId,
      direction: 'vi_to_en',
      status: 'locked',
      prereqId: baseId,
    });
  } else {
    // Japanese
    const hasKanji = /[\u4e00-\u9faf]/.test(vocab.word);
    const baseId = crypto.randomUUID();
    directionsToInsert.push({
      id: baseId,
      direction: 'ja_to_vi',
      status: 'active',
    });

    if (hasKanji && vocab.reading) {
      const readingId = crypto.randomUUID();
      directionsToInsert.push({
        id: readingId,
        direction: 'ja_to_reading',
        status: 'active',
      });

      const readingToKanjiId = crypto.randomUUID();
      directionsToInsert.push({
        id: readingToKanjiId,
        direction: 'reading_to_ja',
        status: 'locked',
        prereqId: readingId,
      });
    }

    const reverseId = crypto.randomUUID();
    directionsToInsert.push({
      id: reverseId,
      direction: 'vi_to_ja',
      status: 'locked',
      prereqId: baseId,
    });
  }

  for (const d of directionsToInsert) {
    await env.DB.prepare(
      `INSERT INTO study_directions (id, vocabulary_id, direction, activation_status, prerequisite_direction_id)
       VALUES (?, ?, ?, ?, ?)`
    )
      .bind(d.id, vocabId, d.direction, d.status, d.prereqId || null)
      .run();

    // If active, initialize card progress as 'new'
    if (d.status === 'active') {
      await env.DB.prepare(
        `INSERT INTO user_card_progress (user_id, study_direction_id, status, version)
         VALUES (?, ?, 'new', 1)`
      )
        .bind(userId, d.id)
        .run();
    }
  }
}

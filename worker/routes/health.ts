import { Env, User, Language } from '../types';

export interface HealthIssue {
  id: string;
  vocabularyId: string;
  word: string;
  deckId: string;
  deckTitle: string;
  severity: 'error' | 'warning' | 'suggestion';
  message: string;
  field?: string;
}

export async function handleHealthRoutes(
  request: Request,
  env: Env,
  user: User,
  url: URL
): Promise<Response> {
  const method = request.method;
  const path = url.pathname;

  if (path === '/api/health' && method === 'GET') {
    const language = (url.searchParams.get('language') || 'en') as Language;
    const deckId = url.searchParams.get('deckId');

    let sql = `
      SELECT v.*, d.title as deck_title, COUNT(sd.id) as direction_count
      FROM vocabulary v
      JOIN decks d ON v.deck_id = d.id
      LEFT JOIN study_directions sd ON v.id = sd.vocabulary_id
      WHERE d.owner_id = ? AND v.language = ? AND v.is_active = 1
    `;
    const params: any[] = [user.id, language];

    if (deckId) {
      sql += ` AND v.deck_id = ?`;
      params.push(deckId);
    }

    sql += ` GROUP BY v.id`;

    const { results } = await env.DB.prepare(sql).bind(...params).all<any>();

    const issues: HealthIssue[] = [];

    // Duplicate detection map: deck_id + normalized_word
    const seenWords = new Map<string, string>(); // key -> first vocabId

    for (const v of results) {
      const key = `${v.deck_id}:${v.normalized_word}`;
      if (seenWords.has(key)) {
        issues.push({
          id: crypto.randomUUID(),
          vocabularyId: v.id,
          word: v.word,
          deckId: v.deck_id,
          deckTitle: v.deck_title,
          severity: 'warning',
          message: `Từ "${v.word}" bị trùng lặp trong cùng một deck`,
          field: 'word',
        });
      } else {
        seenWords.set(key, v.id);
      }

      // Check Errors
      if (!v.word || v.word.trim() === '') {
        issues.push({
          id: crypto.randomUUID(),
          vocabularyId: v.id,
          word: v.word || '(Trống)',
          deckId: v.deck_id,
          deckTitle: v.deck_title,
          severity: 'error',
          message: 'Từ vựng bị để trống',
          field: 'word',
        });
      }

      if (!v.meaning_vi || v.meaning_vi.trim() === '') {
        issues.push({
          id: crypto.randomUUID(),
          vocabularyId: v.id,
          word: v.word,
          deckId: v.deck_id,
          deckTitle: v.deck_title,
          severity: 'error',
          message: 'Chưa nhập nghĩa tiếng Việt',
          field: 'meaning_vi',
        });
      }

      if (v.direction_count === 0) {
        issues.push({
          id: crypto.randomUUID(),
          vocabularyId: v.id,
          word: v.word,
          deckId: v.deck_id,
          deckTitle: v.deck_title,
          severity: 'error',
          message: 'Từ này không có bất kỳ chiều học (study direction) nào',
        });
      }

      // Check Language specific rules
      if (language === 'en') {
        if (!v.pronunciation || v.pronunciation.trim() === '') {
          issues.push({
            id: crypto.randomUUID(),
            vocabularyId: v.id,
            word: v.word,
            deckId: v.deck_id,
            deckTitle: v.deck_title,
            severity: 'suggestion',
            message: 'Chưa có phiên âm IPA',
            field: 'pronunciation',
          });
        }
        if (!v.example || v.example.trim() === '') {
          issues.push({
            id: crypto.randomUUID(),
            vocabularyId: v.id,
            word: v.word,
            deckId: v.deck_id,
            deckTitle: v.deck_title,
            severity: 'warning',
            message: 'Chưa có câu ví dụ minh họa',
            field: 'example',
          });
        }
      } else {
        // Japanese
        const hasKanji = /[\u4e00-\u9faf]/.test(v.word);
        if (hasKanji && (!v.reading || v.reading.trim() === '')) {
          issues.push({
            id: crypto.randomUUID(),
            vocabularyId: v.id,
            word: v.word,
            deckId: v.deck_id,
            deckTitle: v.deck_title,
            severity: 'error',
            message: 'Từ chứa Kanji nhưng chưa có cách đọc (Furigana / Hiragana)',
            field: 'reading',
          });
        }
        if (!v.example || v.example.trim() === '') {
          issues.push({
            id: crypto.randomUUID(),
            vocabularyId: v.id,
            word: v.word,
            deckId: v.deck_id,
            deckTitle: v.deck_title,
            severity: 'suggestion',
            message: 'Chưa có câu ví dụ tiếng Nhật',
            field: 'example',
          });
        }
      }
    }

    return Response.json({
      summary: {
        totalIssues: issues.length,
        errors: issues.filter((i) => i.severity === 'error').length,
        warnings: issues.filter((i) => i.severity === 'warning').length,
        suggestions: issues.filter((i) => i.severity === 'suggestion').length,
      },
      issues,
    });
  }

  return Response.json({ error: 'Not Found' }, { status: 404 });
}

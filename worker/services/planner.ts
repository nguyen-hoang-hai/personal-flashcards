import { Language } from '../types';

export interface CandidateCard {
  study_direction_id: string;
  vocabulary_id: string;
  deck_id: string;
  language: Language;
  direction: string;
  status: string;
  due_at: string | null;
  interval_days: number;
  word: string;
  reading: string | null;
  meaning_vi: string;
  meaning_en: string | null;
  definition_en: string | null;
  example: string | null;
  example_translation: string | null;
  level: string | null;
  deck_title: string;
  version: number;
}

export interface PlannerConfig {
  sessionSize: number;
  maxNewVocabulary: number;
  siblingGap: number;
  deckGap: number;
  mode?: 'standard' | 'cram';
}

export function buildStudyPlan(
  allCards: CandidateCard[],
  activeDeckIds: string[],
  config: PlannerConfig,
  now: Date = new Date()
): CandidateCard[] {
  const eligible = allCards.filter(
    (c) => activeDeckIds.includes(c.deck_id) && c.status !== 'suspended'
  );

  // Cram Mode (Ôn tập sớm / Luyện tập tự do các từ đã học)
  if (config.mode === 'cram') {
    const learnedCards = eligible.filter((c) => c.status !== 'new');
    learnedCards.sort((a, b) => {
      const aDue = a.due_at ? new Date(a.due_at).getTime() : 0;
      const bDue = b.due_at ? new Date(b.due_at).getTime() : 0;
      return aDue - bDue;
    });
    const pool = learnedCards.length > 0 
      ? learnedCards.slice(0, config.sessionSize) 
      : eligible.filter((c) => c.status === 'new').slice(0, config.sessionSize);
    return applyGapSpacing(pool, config.siblingGap, config.deckGap);
  }

  const nowTime = now.getTime();
  const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999).getTime();

  const learningDue: CandidateCard[] = [];
  const overdue: CandidateCard[] = [];
  const dueToday: CandidateCard[] = [];
  const newCardsByVocab = new Map<string, CandidateCard[]>();

  for (const card of eligible) {
    if (card.status === 'learning') {
      const due = card.due_at ? new Date(card.due_at).getTime() : 0;
      if (due <= endOfToday) {
        learningDue.push(card);
      }
    } else if (card.status === 'review' || card.status === 'mastered') {
      const due = card.due_at ? new Date(card.due_at).getTime() : 0;
      if (due < nowTime - 24 * 60 * 60 * 1000) {
        overdue.push(card);
      } else if (due <= endOfToday) {
        dueToday.push(card);
      }
    } else if (card.status === 'new') {
      if (!newCardsByVocab.has(card.vocabulary_id)) {
        newCardsByVocab.set(card.vocabulary_id, []);
      }
      newCardsByVocab.get(card.vocabulary_id)!.push(card);
    }
  }

  // Strict Review-First Policy:
  // Bắt buộc phải ôn tập hết các từ cần ôn (totalDueCount === 0) thì mới cho phép học từ mới!
  const totalDueCount = learningDue.length + overdue.length + dueToday.length;
  let allowedNewVocab = 0;
  if (totalDueCount === 0) {
    allowedNewVocab = config.maxNewVocabulary;
  }

  // Select new vocabulary up to allowedNewVocab (chỉ khi không còn thẻ nào cần ôn)
  const selectedNewCards: CandidateCard[] = [];
  let vocabCount = 0;
  for (const [, cards] of newCardsByVocab) {
    if (vocabCount >= allowedNewVocab) break;
    selectedNewCards.push(...cards);
    vocabCount++;
  }

  // Shuffle within groups
  const shuffledDueToday = controlledInterleave(dueToday);
  const shuffledNewCards = controlledInterleave(selectedNewCards);

  // Combine by priority
  const queue = [
    ...learningDue,
    ...overdue,
    ...shuffledDueToday,
    ...shuffledNewCards,
  ];

  // Apply sibling gap and deck gap
  return applyGapSpacing(queue, config.siblingGap, config.deckGap);
}

function controlledInterleave(cards: CandidateCard[]): CandidateCard[] {
  if (cards.length <= 1) return cards;
  const byDeck = new Map<string, CandidateCard[]>();
  for (const card of cards) {
    if (!byDeck.has(card.deck_id)) byDeck.set(card.deck_id, []);
    byDeck.get(card.deck_id)!.push(card);
  }

  const result: CandidateCard[] = [];
  const deckKeys = Array.from(byDeck.keys());
  let hasMore = true;
  let idx = 0;

  while (hasMore) {
    hasMore = false;
    for (const key of deckKeys) {
      const list = byDeck.get(key)!;
      if (idx < list.length) {
        result.push(list[idx]);
        hasMore = true;
      }
    }
    idx++;
  }

  return result;
}

function applyGapSpacing(cards: CandidateCard[], siblingGap: number, deckGap: number): CandidateCard[] {
  if (cards.length <= 1) return cards;
  const result: CandidateCard[] = [];
  const pool = [...cards];

  while (pool.length > 0) {
    let bestIndex = 0;
    let bestScore = -1;

    for (let i = 0; i < Math.min(pool.length, 10); i++) {
      const candidate = pool[i];
      let score = 100;

      // Check deck gap with last item
      if (result.length > 0 && deckGap > 0) {
        const last = result[result.length - 1];
        if (last.deck_id === candidate.deck_id) {
          score -= 40;
        }
      }

      // Check sibling gap
      for (let g = 1; g <= siblingGap && g <= result.length; g++) {
        const prev = result[result.length - g];
        if (prev.vocabulary_id === candidate.vocabulary_id) {
          score -= (siblingGap - g + 1) * 20;
        }
      }

      if (score > bestScore) {
        bestScore = score;
        bestIndex = i;
      }
    }

    result.push(pool.splice(bestIndex, 1)[0]);
  }

  return result;
}

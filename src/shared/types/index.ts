export type Language = 'en' | 'ja';

export interface User {
  id: string;
  email: string;
  display_name: string | null;
  created_at: string;
}

export interface Deck {
  id: string;
  owner_id: string;
  language: Language;
  title: string;
  description: string | null;
  source_type: 'seed' | 'personal' | 'imported';
  study_status: 'active' | 'hidden' | 'archived';
  new_card_weight: number;
  display_order: number;
  total_words: number;
  due_count: number;
  new_count: number;
  created_at: string;
}

export interface StudyDirection {
  id: string;
  vocabulary_id: string;
  direction: string;
  activation_status: 'locked' | 'available' | 'active' | 'suspended';
  prerequisite_direction_id: string | null;
  progress?: {
    status: 'new' | 'learning' | 'review' | 'mastered' | 'suspended';
    repetitions: number;
    interval_days: number;
    due_at: string | null;
    version: number;
  };
}

export interface Vocabulary {
  id: string;
  deck_id: string;
  language: Language;
  word: string;
  normalized_word: string;
  reading: string | null;
  romaji: string | null;
  pronunciation: string | null;
  meaning_vi: string;
  meaning_en: string | null;
  definition_en: string | null;
  example: string | null;
  example_translation: string | null;
  level: string | null;
  part_of_speech: string | null;
  tags: string | null;
  notes: string | null;
  deck_title?: string;
  study_directions?: StudyDirection[];
  created_at: string;
}

export interface StudySessionCard {
  id: string;
  session_id: string;
  study_direction_id: string;
  position: number;
  status: 'pending' | 'shown' | 'answered' | 'skipped';
  direction: string;
  vocabulary_id: string;
  word: string;
  reading: string | null;
  romaji: string | null;
  pronunciation: string | null;
  meaning_vi: string;
  meaning_en: string | null;
  definition_en: string | null;
  example: string | null;
  example_translation: string | null;
  level: string | null;
  deck_title: string;
  deck_id: string;
  card_status: string;
  current_interval: number;
  version: number;
}

export interface StudySession {
  id: string;
  user_id: string;
  language: Language;
  status: 'active' | 'completed' | 'abandoned' | 'expired';
  total_cards: number;
  completed_cards: number;
  started_at: string;
}

export type Rating = 'again' | 'hard' | 'good' | 'easy';

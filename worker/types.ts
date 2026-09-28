export interface Env {
  DB: D1Database;
  ASSETS?: Fetcher;
  ALLOWED_EMAIL?: string;
  GOOGLE_CLIENT_ID?: string;
  APP_SECRET?: string;
  APP_ENV?: string;
}

export interface User {
  id: string;
  email: string;
  display_name: string | null;
  created_at: string;
  last_login_at: string | null;
}

export interface Session {
  id: string;
  user_id: string;
  token_hash: string;
  expires_at: string;
  created_at: string;
  revoked_at: string | null;
}

export type Language = 'en' | 'ja';

export interface Deck {
  id: string;
  owner_id: string;
  language: Language;
  title: string;
  description: string | null;
  source_type: 'seed' | 'personal' | 'imported';
  study_status?: 'active' | 'hidden' | 'archived';
  new_card_weight?: number;
  display_order?: number;
  total_words?: number;
  due_count?: number;
  new_count?: number;
  created_at: string;
  updated_at: string;
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
  source_type: string;
  is_user_modified: number;
  is_active: number;
  created_at: string;
  updated_at: string;
  study_directions?: StudyDirection[];
}

export interface StudyDirection {
  id: string;
  vocabulary_id: string;
  direction: string;
  prompt_template: string | null;
  answer_template: string | null;
  activation_status: 'locked' | 'available' | 'active' | 'suspended';
  prerequisite_direction_id: string | null;
  unlocked_at: string | null;
  created_at: string;
  // Included in queries:
  progress?: UserCardProgress;
}

export interface UserCardProgress {
  user_id: string;
  study_direction_id: string;
  status: 'new' | 'learning' | 'review' | 'mastered' | 'suspended';
  repetitions: number;
  lapses: number;
  interval_days: number;
  ease_factor: number;
  difficulty: number | null;
  stability: number | null;
  retrievability: number | null;
  due_at: string | null;
  first_reviewed_at: string | null;
  last_reviewed_at: string | null;
  version: number;
  updated_at: string;
}

export type Rating = 'again' | 'hard' | 'good' | 'easy';

export interface StudySession {
  id: string;
  user_id: string;
  language: Language;
  status: 'active' | 'completed' | 'abandoned' | 'expired';
  total_cards: number;
  completed_cards: number;
  started_at: string;
  last_activity_at: string;
  completed_at: string | null;
}

export interface StudySessionCard {
  id: string;
  session_id: string;
  study_direction_id: string;
  position: number;
  status: 'pending' | 'shown' | 'answered' | 'skipped';
  progress_version: number | null;
  answered_at: string | null;
  // Joined card details for the UI:
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

PRAGMA foreign_keys = ON;

CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  display_name TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_login_at TEXT
);

CREATE TABLE sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  token_hash TEXT NOT NULL UNIQUE,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  revoked_at TEXT,
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE decks (
  id TEXT PRIMARY KEY,
  owner_id TEXT NOT NULL,
  language TEXT NOT NULL CHECK(language IN ('en','ja')),
  title TEXT NOT NULL,
  description TEXT,
  source_type TEXT NOT NULL DEFAULT 'personal' CHECK(source_type IN ('seed','personal','imported')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(owner_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE user_deck_settings (
  user_id TEXT NOT NULL,
  deck_id TEXT NOT NULL,
  study_status TEXT NOT NULL DEFAULT 'active' CHECK(study_status IN ('active','hidden','archived')),
  new_card_weight REAL NOT NULL DEFAULT 1.0,
  display_order INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY(user_id, deck_id),
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY(deck_id) REFERENCES decks(id) ON DELETE CASCADE
);

CREATE TABLE vocabulary (
  id TEXT PRIMARY KEY,
  deck_id TEXT NOT NULL,
  language TEXT NOT NULL CHECK(language IN ('en','ja')),
  word TEXT NOT NULL,
  normalized_word TEXT NOT NULL,
  reading TEXT,
  romaji TEXT,
  pronunciation TEXT,
  meaning_vi TEXT NOT NULL,
  meaning_en TEXT,
  definition_en TEXT,
  example TEXT,
  example_translation TEXT,
  level TEXT,
  part_of_speech TEXT,
  tags TEXT,
  notes TEXT,
  source_type TEXT NOT NULL DEFAULT 'personal' CHECK(source_type IN ('seed','personal','imported')),
  seed_key TEXT,
  seed_version INTEGER,
  is_user_modified INTEGER NOT NULL DEFAULT 0,
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(deck_id) REFERENCES decks(id) ON DELETE CASCADE,
  UNIQUE(deck_id, normalized_word)
);

CREATE TABLE study_directions (
  id TEXT PRIMARY KEY,
  vocabulary_id TEXT NOT NULL,
  direction TEXT NOT NULL,
  prompt_template TEXT,
  answer_template TEXT,
  activation_status TEXT NOT NULL DEFAULT 'active' CHECK(activation_status IN ('locked','available','active','suspended')),
  prerequisite_direction_id TEXT,
  unlocked_at TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(vocabulary_id) REFERENCES vocabulary(id) ON DELETE CASCADE,
  FOREIGN KEY(prerequisite_direction_id) REFERENCES study_directions(id) ON DELETE SET NULL,
  UNIQUE(vocabulary_id, direction)
);

CREATE TABLE user_card_progress (
  user_id TEXT NOT NULL,
  study_direction_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK(status IN ('new','learning','review','mastered','suspended')),
  repetitions INTEGER NOT NULL DEFAULT 0,
  lapses INTEGER NOT NULL DEFAULT 0,
  interval_days REAL NOT NULL DEFAULT 0,
  ease_factor REAL NOT NULL DEFAULT 2.5,
  difficulty REAL,
  stability REAL,
  retrievability REAL,
  due_at TEXT,
  first_reviewed_at TEXT,
  last_reviewed_at TEXT,
  version INTEGER NOT NULL DEFAULT 1,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY(user_id, study_direction_id),
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY(study_direction_id) REFERENCES study_directions(id) ON DELETE CASCADE
);

CREATE TABLE review_logs (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  study_direction_id TEXT NOT NULL,
  rating TEXT NOT NULL CHECK(rating IN ('again','hard','good','easy')),
  previous_interval REAL NOT NULL DEFAULT 0,
  next_interval REAL NOT NULL DEFAULT 0,
  response_time_ms INTEGER,
  reviewed_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY(study_direction_id) REFERENCES study_directions(id) ON DELETE CASCADE
);

CREATE TABLE user_language_settings (
  user_id TEXT NOT NULL,
  language TEXT NOT NULL CHECK(language IN ('en','ja')),
  settings_json TEXT NOT NULL DEFAULT '{}',
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY(user_id, language),
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE study_sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  language TEXT NOT NULL CHECK(language IN ('en','ja')),
  status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active','completed','abandoned','expired')),
  total_cards INTEGER NOT NULL DEFAULT 0,
  completed_cards INTEGER NOT NULL DEFAULT 0,
  started_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_activity_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  completed_at TEXT,
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE study_session_cards (
  id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL,
  study_direction_id TEXT NOT NULL,
  position INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','shown','answered','skipped')),
  progress_version INTEGER,
  answered_at TEXT,
  FOREIGN KEY(session_id) REFERENCES study_sessions(id) ON DELETE CASCADE,
  FOREIGN KEY(study_direction_id) REFERENCES study_directions(id) ON DELETE CASCADE
);

CREATE INDEX idx_sessions_user_expires ON sessions(user_id, expires_at);
CREATE INDEX idx_decks_owner_language ON decks(owner_id, language);
CREATE INDEX idx_user_deck_status ON user_deck_settings(user_id, study_status);
CREATE INDEX idx_vocabulary_deck ON vocabulary(deck_id);
CREATE INDEX idx_directions_vocabulary ON study_directions(vocabulary_id);
CREATE INDEX idx_progress_due ON user_card_progress(user_id, status, due_at);
CREATE INDEX idx_review_logs_user_date ON review_logs(user_id, reviewed_at);
CREATE INDEX idx_sessions_user_language_status ON study_sessions(user_id, language, status);
CREATE INDEX idx_session_cards_session_position ON study_session_cards(session_id, position);

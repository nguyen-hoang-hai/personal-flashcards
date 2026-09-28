import fs from 'fs';
import { unitsPart1 } from './toeic-data/part1.js';
import { unitsPart2 } from './toeic-data/part2.js';
import { unitsPart3 } from './toeic-data/part3.js';

const allUnits = [...unitsPart1, ...unitsPart2, ...unitsPart3];

function escapeSql(str) {
  if (str === null || str === undefined) return 'NULL';
  return `'${String(str).replace(/'/g, "''")}'`;
}

const rawVocab = [];
let unitIdx = 1;
for (const unit of allUnits) {
  let wordIdx = 1;
  for (const item of unit.words) {
    rawVocab.push({
      unitId: unit.id,
      unitTitle: unit.title,
      unitIdx: wordIdx,
      word: item.word,
      pos: item.pos,
      ipa: item.ipa,
      vi: item.vi,
      ex: item.ex,
    });
    wordIdx++;
  }
  unitIdx++;
}

console.log(`Total TOEIC vocabulary items parsed: ${rawVocab.length}`);

let sql = `-- ========================================================
-- DECK: TOEIC 990 (Bộ 990 từ vựng TOEIC toàn diện)
-- Total Vocabulary: ${rawVocab.length} words
-- Total Study Directions: ${rawVocab.length * 2} directions (en_to_vi active, vi_to_en locked)
-- Generated automatically from verified 33 units
-- ========================================================

-- Ensure Deck exists
INSERT OR REPLACE INTO decks (id, owner_id, language, title, description, source_type)
VALUES (
  'deck_toeic_990',
  'ed0f5e54-8832-4b8b-91e7-c55628f69004',
  'en',
  'TOEIC 990',
  'Bộ 990 từ vựng TOEIC toàn diện (Mục tiêu 750 - 990+) phân loại 33 chủ đề chuyên sâu bám sát mọi bài thi ETS Listening & Reading.',
  'imported'
);

-- Ensure user settings for all existing users
INSERT OR REPLACE INTO user_deck_settings (user_id, deck_id, study_status, new_card_weight, display_order)
SELECT id, 'deck_toeic_990', 'active', 1.0, 1 FROM users;

`;

// Vocabulary chunks (50 per statement)
const vocabChunkSize = 50;
const directions = [];

for (let i = 0; i < rawVocab.length; i += vocabChunkSize) {
  const chunk = rawVocab.slice(i, i + vocabChunkSize);
  sql += `INSERT OR REPLACE INTO vocabulary (
  id, deck_id, language, word, normalized_word, pronunciation, meaning_vi, example, level, part_of_speech, tags, source_type, seed_key, seed_version
) VALUES\n`;

  const rows = chunk.map((v, idx) => {
    const globalIdx = i + idx + 1;
    const vocId = `voc_toeic_${String(globalIdx).padStart(4, '0')}`;
    const seedKey = `toeic_${String(v.unitId).padStart(2, '0')}_${String(v.unitIdx).padStart(2, '0')}`;
    const normalized = v.word.trim().toLowerCase();
    const tags = `TOEIC,990,Unit-${String(v.unitId).padStart(2, '0')}`;

    // Study directions: en_to_vi (active) and vi_to_en (locked)
    const dirBase = `dir_toeic_${String(globalIdx).padStart(4, '0')}_en_vi`;
    const dirRev = `dir_toeic_${String(globalIdx).padStart(4, '0')}_vi_en`;

    directions.push({
      id: dirBase,
      vocabulary_id: vocId,
      direction: 'en_to_vi',
      activation_status: 'active',
      prerequisite_direction_id: null
    });

    directions.push({
      id: dirRev,
      vocabulary_id: vocId,
      direction: 'vi_to_en',
      activation_status: 'locked',
      prerequisite_direction_id: dirBase
    });

    return `  (${escapeSql(vocId)}, 'deck_toeic_990', 'en', ${escapeSql(v.word)}, ${escapeSql(normalized)}, ${escapeSql(v.ipa)}, ${escapeSql(v.vi)}, ${escapeSql(v.ex)}, '750-990+', ${escapeSql(v.pos)}, ${escapeSql(tags)}, 'imported', ${escapeSql(seedKey)}, 1)`;
  });

  sql += rows.join(',\n') + ';\n\n';
}

sql += `-- ========================================================\n`;
sql += `-- STUDY DIRECTIONS (${directions.length} directions total)\n`;
sql += `-- ========================================================\n\n`;

// Study directions chunks (80 per statement)
const dirChunkSize = 80;
for (let i = 0; i < directions.length; i += dirChunkSize) {
  const chunk = directions.slice(i, i + dirChunkSize);
  sql += `INSERT OR REPLACE INTO study_directions (
  id, vocabulary_id, direction, activation_status, prerequisite_direction_id
) VALUES\n`;

  const rows = chunk.map(d => {
    return `  (${escapeSql(d.id)}, ${escapeSql(d.vocabulary_id)}, ${escapeSql(d.direction)}, ${escapeSql(d.activation_status)}, ${escapeSql(d.prerequisite_direction_id)})`;
  });

  sql += rows.join(',\n') + ';\n\n';
}

const dest = 'D:\\OneDrive\\Flashcard Project\\seed-toeic-990.sql';
fs.writeFileSync(dest, sql, 'utf8');
console.log(`Saved ${dest} successfully!`);
console.log(`Total vocabulary: ${rawVocab.length}`);
console.log(`Total study directions: ${directions.length}`);

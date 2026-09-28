import fs from 'fs';
import path from 'path';

const vocabPath = 'C:\\Users\\2412n\\.gemini\\antigravity\\brain\\9b43481d-6ba6-4b96-896f-38cebb515a56\\minna-no-nihongo-n5-vocab.md';
const content = fs.readFileSync(vocabPath, 'utf8');
const lines = content.split('\n');

function escapeSql(str) {
  if (str === null || str === undefined) return 'NULL';
  return `'${String(str).replace(/'/g, "''")}'`;
}

function hasKanji(str) {
  return /[\u4e00-\u9faf]/.test(str);
}

let currentLesson = 0;
let currentLessonTitle = '';

const rawEntries = [];

for (const rawLine of lines) {
  const line = rawLine.trim();
  const lessonMatch = line.match(/^##\s*📌?\s*BÀI\s*(\d+)[:\s]*(.*)/i);
  if (lessonMatch) {
    currentLesson = parseInt(lessonMatch[1], 10);
    currentLessonTitle = lessonMatch[2].trim();
    continue;
  }
  if (!line.startsWith('|') || line.includes('---') || line.includes('STT')) continue;

  const parts = line.split('|').map(s => s.trim()).filter((s, idx, arr) => idx > 0 && idx < arr.length - 1);
  if (parts.length >= 6) {
    const stt = parseInt(parts[0], 10);
    const word = parts[1];
    const reading = parts[2];
    const romaji = parts[3];
    const pos = parts[4];
    const meaning = parts[5];

    if (!word || word === 'Từ vựng (Kanji/Kana)') continue;

    rawEntries.push({
      lesson: currentLesson,
      lessonTitle: currentLessonTitle,
      stt,
      word,
      reading,
      romaji,
      pos,
      meaning,
    });
  }
}

console.log(`Total raw entries parsed: ${rawEntries.length}`);

// Disambiguation & deduplication map
// If exact same meaning, merge lessons into tags.
// If distinct meaning, clarify word display & normalized_word.
const exactMergeWords = new Set([
  '試験', '会議', '映画', 'アルバイト', '始めます', '特に', '留学します', 'おなかがいっぱいです', '～君', 'よく'
]);

const processedVocab = [];
const mergedMap = new Map();

for (const item of rawEntries) {
  let displayWord = item.word;
  let normalized = item.word.trim().toLowerCase();
  let lessonTag = `Bài-${String(item.lesson).padStart(2, '0')}`;

  if (exactMergeWords.has(item.word)) {
    if (mergedMap.has(item.word)) {
      const existing = mergedMap.get(item.word);
      if (!existing.tags.includes(lessonTag)) {
        existing.tags += `,${lessonTag}`;
      }
      continue;
    }
  } else if (item.word === '～から') {
    if (item.lesson === 4) {
      displayWord = '～から (thời gian)';
      normalized = '～から (thời gian)';
    } else {
      displayWord = '～から (lý do)';
      normalized = '～から (lý do)';
    }
  } else if (item.word === '～人') {
    if (item.lesson === 1) {
      displayWord = '～人 (quốc tịch)';
      normalized = '～人 (quốc tịch)';
    } else {
      displayWord = '～人 (đếm người)';
      normalized = '～人 (đếm người)';
    }
  } else if (item.word === 'どちら') {
    if (item.lesson === 3) {
      displayWord = 'どちら (phương hướng)';
      normalized = 'どちら (phương hướng)';
    } else {
      displayWord = 'どちら (so sánh)';
      normalized = 'どちら (so sánh)';
    }
  } else if (item.word === 'あります') {
    if (item.lesson === 9) {
      displayWord = 'あります (sở hữu)';
      normalized = 'あります (sở hữu)';
    } else {
      displayWord = 'あります (tồn tại)';
      normalized = 'あります (tồn tại)';
    }
  } else if (item.word === 'お茶') {
    if (item.lesson === 6) {
      displayWord = 'お茶 (đồ uống)';
      normalized = 'お茶 (đồ uống)';
    } else {
      displayWord = 'お茶 (trà đạo)';
      normalized = 'お茶 (trà đạo)';
    }
  } else if (item.word === '～年') {
    if (item.lesson === 5) {
      displayWord = '～年 (năm nào)';
      normalized = '～年 (năm nào)';
    } else {
      displayWord = '～年 (thời lượng)';
      normalized = '～年 (thời lượng)';
    }
  }

  const vocabEntry = {
    ...item,
    word: displayWord,
    normalized,
    tags: `N5,Minna,${lessonTag}`,
  };

  if (exactMergeWords.has(item.word)) {
    mergedMap.set(item.word, vocabEntry);
  }
  processedVocab.push(vocabEntry);
}

console.log(`Processed final vocab count: ${processedVocab.length}`);

// Generate SQL
let sql = `-- ========================================================
-- DECK: Minna no Nihongo N5 (Trọn bộ 25 bài JLPT N5)
-- Total Vocabulary: ${processedVocab.length} words
-- Generated automatically from minna-no-nihongo-n5-vocab.md
-- ========================================================

-- Ensure Deck exists
INSERT OR REPLACE INTO decks (id, owner_id, language, title, description, source_type)
VALUES (
  'deck_minna_n5',
  'ed0f5e54-8832-4b8b-91e7-c55628f69004',
  'ja',
  'Minna no Nihongo N5',
  'Trọn bộ từ vựng 25 bài giáo trình Minna no Nihongo I trình độ JLPT N5, đối chiếu chuẩn từ điển Mazii.',
  'imported'
);

-- Ensure user settings for all existing users
INSERT OR REPLACE INTO user_deck_settings (user_id, deck_id, study_status, new_card_weight, display_order)
SELECT id, 'deck_minna_n5', 'active', 1.0, 1 FROM users;

`;

// Vocabulary chunks (50 per statement)
const vocabChunkSize = 50;
const directions = [];

for (let i = 0; i < processedVocab.length; i += vocabChunkSize) {
  const chunk = processedVocab.slice(i, i + vocabChunkSize);
  sql += `INSERT OR REPLACE INTO vocabulary (
  id, deck_id, language, word, normalized_word, reading, romaji, meaning_vi, level, part_of_speech, tags, source_type, seed_key, seed_version
) VALUES\n`;

  const rows = chunk.map((v, idx) => {
    const globalIdx = i + idx + 1;
    const vocId = `voc_mn5_${String(globalIdx).padStart(4, '0')}`;
    const seedKey = `mn5_${String(v.lesson).padStart(2, '0')}_${String(v.stt).padStart(2, '0')}`;
    
    // Check if word has kanji
    const wordHasKanji = hasKanji(v.word);
    
    // Add study directions
    const dirBase = `dir_mn5_${String(globalIdx).padStart(4, '0')}_base`;
    const dirRead = `dir_mn5_${String(globalIdx).padStart(4, '0')}_read`;
    const dirRev = `dir_mn5_${String(globalIdx).padStart(4, '0')}_rev`;
    const dirKanji = `dir_mn5_${String(globalIdx).padStart(4, '0')}_kanji`;

    // ja_to_vi is always active
    directions.push({
      id: dirBase,
      vocabulary_id: vocId,
      direction: 'ja_to_vi',
      activation_status: 'active',
      prerequisite_direction_id: null
    });

    if (wordHasKanji) {
      // ja_to_reading is active
      directions.push({
        id: dirRead,
        vocabulary_id: vocId,
        direction: 'ja_to_reading',
        activation_status: 'active',
        prerequisite_direction_id: null
      });
      // vi_to_ja is locked
      directions.push({
        id: dirRev,
        vocabulary_id: vocId,
        direction: 'vi_to_ja',
        activation_status: 'locked',
        prerequisite_direction_id: dirBase
      });
      // reading_to_ja is locked
      directions.push({
        id: dirKanji,
        vocabulary_id: vocId,
        direction: 'reading_to_ja',
        activation_status: 'locked',
        prerequisite_direction_id: dirRead
      });
    } else {
      // pure kana words only need vi_to_ja
      directions.push({
        id: dirRev,
        vocabulary_id: vocId,
        direction: 'vi_to_ja',
        activation_status: 'locked',
        prerequisite_direction_id: dirBase
      });
    }

    return `  (${escapeSql(vocId)}, 'deck_minna_n5', 'ja', ${escapeSql(v.word)}, ${escapeSql(v.normalized)}, ${escapeSql(v.reading)}, ${escapeSql(v.romaji)}, ${escapeSql(v.meaning)}, 'N5', ${escapeSql(v.pos)}, ${escapeSql(v.tags)}, 'imported', ${escapeSql(seedKey)}, 1)`;
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

fs.writeFileSync('D:\\OneDrive\\Flashcard Project\\seed-minna-n5.sql', sql, 'utf8');
console.log('Saved seed-minna-n5.sql successfully!');
console.log(`Total vocabulary: ${processedVocab.length}`);
console.log(`Total study directions: ${directions.length}`);

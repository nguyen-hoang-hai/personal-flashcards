-- ========================================================
-- JLPT N5 JAPANESE VOCABULARY SEED DATA (MAZII & MINNA NO NIHONGO)
-- ========================================================

-- Ensure Japanese Decks exist
INSERT OR REPLACE INTO decks (id, owner_id, language, title, description, source_type)
VALUES 
  (
    'deck_n5_verbs',
    'ed0f5e54-8832-4b8b-91e7-c55628f69004',
    'ja',
    'JLPT N5 - Động từ thiết yếu',
    '15 động từ nhóm 1, nhóm 2 và nhóm 3 xuất hiện nhiều nhất trong đề thi JLPT N5 và đời sống thường nhật (chuẩn từ điển Mazii).',
    'personal'
  ),
  (
    'deck_n5_adjectives',
    'ed0f5e54-8832-4b8b-91e7-c55628f69004',
    'ja',
    'JLPT N5 - Tính từ miêu tả',
    '15 tính từ đuôi い và đuôi な thông dụng nhất để miêu tả trạng thái, cảm xúc, đồ vật và thời tiết (chuẩn Mazii).',
    'personal'
  ),
  (
    'deck_n5_daily_life',
    'ed0f5e54-8832-4b8b-91e7-c55628f69004',
    'ja',
    'JLPT N5 - Đời sống & Giao tiếp',
    '15 từ vựng cốt lõi về xưng hô, con người, thời gian, phương tiện và địa điểm quen thuộc (chuẩn Minna & Mazii).',
    'personal'
  );

-- Default User Deck Settings for Hai
INSERT OR REPLACE INTO user_deck_settings (user_id, deck_id, study_status, new_card_weight, display_order)
VALUES 
  ('ed0f5e54-8832-4b8b-91e7-c55628f69004', 'deck_n5_verbs', 'active', 1.0, 1),
  ('ed0f5e54-8832-4b8b-91e7-c55628f69004', 'deck_n5_adjectives', 'active', 1.0, 2),
  ('ed0f5e54-8832-4b8b-91e7-c55628f69004', 'deck_n5_daily_life', 'active', 1.0, 3);

-- ========================================================
-- DECK 1: JLPT N5 - Động từ thiết yếu (15 verbs)
-- ========================================================

-- 1. 行く (iku)
INSERT OR REPLACE INTO vocabulary (id, deck_id, language, word, normalized_word, reading, romaji, meaning_vi, meaning_en, definition_en, example, example_translation, level, part_of_speech, tags, source_type)
VALUES (
  'voc_ja_v1', 'deck_n5_verbs', 'ja', '行く', '行く', 'いく', 'iku',
  'đi', 'to go', 'to move from one place to another',
  '明日、東京へ行きます。', 'Ngày mai tôi sẽ đi Tokyo.',
  'N5', 'Động từ nhóm 1', 'N5,Động từ,Di chuyển,Mazii', 'imported'
);

-- 2. 来る (kuru)
INSERT OR REPLACE INTO vocabulary (id, deck_id, language, word, normalized_word, reading, romaji, meaning_vi, meaning_en, definition_en, example, example_translation, level, part_of_speech, tags, source_type)
VALUES (
  'voc_ja_v2', 'deck_n5_verbs', 'ja', '来る', '来る', 'くる', 'kuru',
  'đến, tới', 'to come', 'to move toward a place or person',
  '友達が家に遊びに来ました。', 'Bạn bè đã đến nhà tôi chơi.',
  'N5', 'Động từ nhóm 3', 'N5,Động từ,Di chuyển,Mazii', 'imported'
);

-- 3. 帰る (kaeru)
INSERT OR REPLACE INTO vocabulary (id, deck_id, language, word, normalized_word, reading, romaji, meaning_vi, meaning_en, definition_en, example, example_translation, level, part_of_speech, tags, source_type)
VALUES (
  'voc_ja_v3', 'deck_n5_verbs', 'ja', '帰る', '帰る', 'かえる', 'kaeru',
  'về, trở về (nhà, quê hương)', 'to return, to go home', 'to go back to one’s place of residence or origin',
  '毎晩７時にうちへ帰ります。', 'Mỗi tối tôi về nhà lúc 7 giờ.',
  'N5', 'Động từ nhóm 1', 'N5,Động từ,Hằng ngày,Mazii', 'imported'
);

-- 4. 食べる (taberu)
INSERT OR REPLACE INTO vocabulary (id, deck_id, language, word, normalized_word, reading, romaji, meaning_vi, meaning_en, definition_en, example, example_translation, level, part_of_speech, tags, source_type)
VALUES (
  'voc_ja_v4', 'deck_n5_verbs', 'ja', '食べる', '食べる', 'たべる', 'taberu',
  'ăn', 'to eat', 'to put food into the mouth and swallow it',
  '毎朝パンと卵を食べます。', 'Mỗi sáng tôi đều ăn bánh mì và trứng.',
  'N5', 'Động từ nhóm 2', 'N5,Động từ,Ăn uống,Mazii', 'imported'
);

-- 5. 飲む (nomu)
INSERT OR REPLACE INTO vocabulary (id, deck_id, language, word, normalized_word, reading, romaji, meaning_vi, meaning_en, definition_en, example, example_translation, level, part_of_speech, tags, source_type)
VALUES (
  'voc_ja_v5', 'deck_n5_verbs', 'ja', '飲む', '飲む', 'のむ', 'nomu',
  'uống', 'to drink', 'to take liquid into the mouth and swallow it',
  '朝起きて、冷たい水を飲みます。', 'Buổi sáng thức dậy, tôi uống nước lạnh.',
  'N5', 'Động từ nhóm 1', 'N5,Động từ,Ăn uống,Mazii', 'imported'
);

-- 6. 見る (miru)
INSERT OR REPLACE INTO vocabulary (id, deck_id, language, word, normalized_word, reading, romaji, meaning_vi, meaning_en, definition_en, example, example_translation, level, part_of_speech, tags, source_type)
VALUES (
  'voc_ja_v6', 'deck_n5_verbs', 'ja', '見る', '見る', 'みる', 'miru',
  'nhìn, xem, ngắm', 'to see, to watch', 'to perceive with the eyes',
  '週末によく映画を見ます。', 'Cuối tuần tôi thường xem phim.',
  'N5', 'Động từ nhóm 2', 'N5,Động từ,Giác quan,Mazii', 'imported'
);

-- 7. 聞く (kiku)
INSERT OR REPLACE INTO vocabulary (id, deck_id, language, word, normalized_word, reading, romaji, meaning_vi, meaning_en, definition_en, example, example_translation, level, part_of_speech, tags, source_type)
VALUES (
  'voc_ja_v7', 'deck_n5_verbs', 'ja', '聞く', '聞く', 'きく', 'kiku',
  'nghe, hỏi', 'to listen, to ask', 'to perceive sound or ask a question',
  '電車の中で音楽を聞きます。', 'Tôi nghe nhạc trên tàu điện.',
  'N5', 'Động từ nhóm 1', 'N5,Động từ,Giác quan,Mazii', 'imported'
);

-- 8. 読む (yomu)
INSERT OR REPLACE INTO vocabulary (id, deck_id, language, word, normalized_word, reading, romaji, meaning_vi, meaning_en, definition_en, example, example_translation, level, part_of_speech, tags, source_type)
VALUES (
  'voc_ja_v8', 'deck_n5_verbs', 'ja', '読む', '読む', 'よむ', 'yomu',
  'đọc', 'to read', 'to look at and comprehend the meaning of written words',
  '毎晩寝る前に本を読みます。', 'Mỗi tối trước khi đi ngủ tôi đọc sách.',
  'N5', 'Động từ nhóm 1', 'N5,Động từ,Học tập,Mazii', 'imported'
);

-- 9. 書く (kaku)
INSERT OR REPLACE INTO vocabulary (id, deck_id, language, word, normalized_word, reading, romaji, meaning_vi, meaning_en, definition_en, example, example_translation, level, part_of_speech, tags, source_type)
VALUES (
  'voc_ja_v9', 'deck_n5_verbs', 'ja', '書く', '書く', 'かく', 'kaku',
  'viết, vẽ', 'to write, to draw', 'to mark on a surface with a pen or pencil',
  '先生に日本語で手紙を書きました。', 'Tôi đã viết thư cho thầy giáo bằng tiếng Nhật.',
  'N5', 'Động từ nhóm 1', 'N5,Động từ,Học tập,Mazii', 'imported'
);

-- 10. 買う (kau)
INSERT OR REPLACE INTO vocabulary (id, deck_id, language, word, normalized_word, reading, romaji, meaning_vi, meaning_en, definition_en, example, example_translation, level, part_of_speech, tags, source_type)
VALUES (
  'voc_ja_v10', 'deck_n5_verbs', 'ja', '買う', '買う', 'かう', 'kau',
  'mua', 'to buy', 'to obtain in exchange for payment',
  'スーパーで野菜と果物を買います。', 'Tôi mua rau và trái cây ở siêu thị.',
  'N5', 'Động từ nhóm 1', 'N5,Động từ,Mua sắm,Mazii', 'imported'
);

-- 11. 勉強する (benkyousuru)
INSERT OR REPLACE INTO vocabulary (id, deck_id, language, word, normalized_word, reading, romaji, meaning_vi, meaning_en, definition_en, example, example_translation, level, part_of_speech, tags, source_type)
VALUES (
  'voc_ja_v11', 'deck_n5_verbs', 'ja', '勉強する', '勉強する', 'べんきょうする', 'benkyousuru',
  'học, học tập', 'to study', 'to devote time and attention to acquiring knowledge',
  '毎日２時間日本語を勉強します。', 'Mỗi ngày tôi học tiếng Nhật hai tiếng.',
  'N5', 'Động từ nhóm 3', 'N5,Động từ,Học tập,Mazii', 'imported'
);

-- 12. 会う (au)
INSERT OR REPLACE INTO vocabulary (id, deck_id, language, word, normalized_word, reading, romaji, meaning_vi, meaning_en, definition_en, example, example_translation, level, part_of_speech, tags, source_type)
VALUES (
  'voc_ja_v12', 'deck_n5_verbs', 'ja', '会う', '会う', 'あう', 'au',
  'gặp, gặp gỡ', 'to meet', 'to see and talk to someone',
  '日曜日に駅の前で友達に会います。', 'Chủ nhật tôi sẽ gặp bạn ở trước nhà ga.',
  'N5', 'Động từ nhóm 1', 'N5,Động từ,Giao tiếp,Mazii', 'imported'
);

-- 13. 待つ (matsu)
INSERT OR REPLACE INTO vocabulary (id, deck_id, language, word, normalized_word, reading, romaji, meaning_vi, meaning_en, definition_en, example, example_translation, level, part_of_speech, tags, source_type)
VALUES (
  'voc_ja_v13', 'deck_n5_verbs', 'ja', '待つ', '待つ', 'まつ', 'matsu',
  'chờ, đợi', 'to wait', 'to stay where one is until an expected event happens',
  'ここで少し待ってください。', 'Xin vui lòng chờ ở đây một lát.',
  'N5', 'Động từ nhóm 1', 'N5,Động từ,Hành động,Mazii', 'imported'
);

-- 14. 話す (hanasu)
INSERT OR REPLACE INTO vocabulary (id, deck_id, language, word, normalized_word, reading, romaji, meaning_vi, meaning_en, definition_en, example, example_translation, level, part_of_speech, tags, source_type)
VALUES (
  'voc_ja_v14', 'deck_n5_verbs', 'ja', '話す', '話す', 'はなす', 'hanasu',
  'nói, nói chuyện', 'to speak, to talk', 'to say words in order to express thoughts',
  '日本語で上手に話したいです。', 'Tôi muốn nói chuyện lưu loát bằng tiếng Nhật.',
  'N5', 'Động từ nhóm 1', 'N5,Động từ,Giao tiếp,Mazii', 'imported'
);

-- 15. 起きる (okiru)
INSERT OR REPLACE INTO vocabulary (id, deck_id, language, word, normalized_word, reading, romaji, meaning_vi, meaning_en, definition_en, example, example_translation, level, part_of_speech, tags, source_type)
VALUES (
  'voc_ja_v15', 'deck_n5_verbs', 'ja', '起きる', '起きる', 'おきる', 'okiru',
  'thức dậy', 'to wake up, to get up', 'to cease to sleep',
  '毎朝６時に起きて、散歩します。', 'Mỗi sáng tôi dậy lúc 6 giờ và đi dạo.',
  'N5', 'Động từ nhóm 2', 'N5,Động từ,Hằng ngày,Mazii', 'imported'
);

-- ========================================================
-- DECK 2: JLPT N5 - Tính từ miêu tả (15 adjectives)
-- ========================================================

-- 16. 大きい (ookii)
INSERT OR REPLACE INTO vocabulary (id, deck_id, language, word, normalized_word, reading, romaji, meaning_vi, meaning_en, definition_en, example, example_translation, level, part_of_speech, tags, source_type)
VALUES (
  'voc_ja_a1', 'deck_n5_adjectives', 'ja', '大きい', '大きい', 'おおきい', 'ookii',
  'to, lớn', 'big, large', 'of considerable size or extent',
  'この部屋はとても大きいです。', 'Căn phòng này rất rộng lớn.',
  'N5', 'Tính từ đuôi い', 'N5,Tính từ,Kích thước,Mazii', 'imported'
);

-- 17. 小さい (chiisai)
INSERT OR REPLACE INTO vocabulary (id, deck_id, language, word, normalized_word, reading, romaji, meaning_vi, meaning_en, definition_en, example, example_translation, level, part_of_speech, tags, source_type)
VALUES (
  'voc_ja_a2', 'deck_n5_adjectives', 'ja', '小さい', '小さい', 'ちいさい', 'chiisai',
  'nhỏ, bé', 'small, little', 'of limited size',
  '庭に小さい白い猫がいます。', 'Trong vườn có một chú mèo con màu trắng.',
  'N5', 'Tính từ đuôi い', 'N5,Tính từ,Kích thước,Mazii', 'imported'
);

-- 18. 新しい (atarashii)
INSERT OR REPLACE INTO vocabulary (id, deck_id, language, word, normalized_word, reading, romaji, meaning_vi, meaning_en, definition_en, example, example_translation, level, part_of_speech, tags, source_type)
VALUES (
  'voc_ja_a3', 'deck_n5_adjectives', 'ja', '新しい', '新しい', 'あたらしい', 'atarashii',
  'mới', 'new', 'not existing before; made, introduced, or discovered recently',
  '新しい携帯電話を買いました。', 'Tôi vừa mua chiếc điện thoại di động mới.',
  'N5', 'Tính từ đuôi い', 'N5,Tính từ,Trạng thái,Mazii', 'imported'
);

-- 19. 古い (furui)
INSERT OR REPLACE INTO vocabulary (id, deck_id, language, word, normalized_word, reading, romaji, meaning_vi, meaning_en, definition_en, example, example_translation, level, part_of_speech, tags, source_type)
VALUES (
  'voc_ja_a4', 'deck_n5_adjectives', 'ja', '古い', '古い', 'ふるい', 'furui',
  'cũ, cổ (đồ vật)', 'old (objects)', 'having lived or existed for a long time',
  'このお寺はとても古いです。', 'Ngôi chùa này rất cổ kính.',
  'N5', 'Tính từ đuôi い', 'N5,Tính từ,Trạng thái,Mazii', 'imported'
);

-- 20. いい / 良い (ii / yoi)
INSERT OR REPLACE INTO vocabulary (id, deck_id, language, word, normalized_word, reading, romaji, meaning_vi, meaning_en, definition_en, example, example_translation, level, part_of_speech, tags, source_type)
VALUES (
  'voc_ja_a5', 'deck_n5_adjectives', 'ja', 'いい', 'いい', 'いい', 'ii',
  'tốt, đẹp, hay', 'good, fine', 'to be desired or approved of',
  '今日はとてもいい天気ですね。', 'Hôm nay thời tiết đẹp quá nhỉ.',
  'N5', 'Tính từ đuôi い', 'N5,Tính từ,Đánh giá,Mazii', 'imported'
);

-- 21. 暑い (atsui)
INSERT OR REPLACE INTO vocabulary (id, deck_id, language, word, normalized_word, reading, romaji, meaning_vi, meaning_en, definition_en, example, example_translation, level, part_of_speech, tags, source_type)
VALUES (
  'voc_ja_a6', 'deck_n5_adjectives', 'ja', '暑い', '暑い', 'あつい', 'atsui',
  'nóng (thời tiết)', 'hot (weather)', 'having a high degree of heat',
  '日本の夏はとても暑いです。', 'Mùa hè ở Nhật Bản rất nóng.',
  'N5', 'Tính từ đuôi い', 'N5,Tính từ,Thời tiết,Mazii', 'imported'
);

-- 22. 寒い (samui)
INSERT OR REPLACE INTO vocabulary (id, deck_id, language, word, normalized_word, reading, romaji, meaning_vi, meaning_en, definition_en, example, example_translation, level, part_of_speech, tags, source_type)
VALUES (
  'voc_ja_a7', 'deck_n5_adjectives', 'ja', '寒い', '寒い', 'さむい', 'samui',
  'lạnh (thời tiết)', 'cold (weather)', 'of or at a low or relatively low temperature',
  '今日は風が強くて寒いですね。', 'Hôm nay gió mạnh và lạnh quá.',
  'N5', 'Tính từ đuôi い', 'N5,Tính từ,Thời tiết,Mazii', 'imported'
);

-- 23. 忙しい (isogashii)
INSERT OR REPLACE INTO vocabulary (id, deck_id, language, word, normalized_word, reading, romaji, meaning_vi, meaning_en, definition_en, example, example_translation, level, part_of_speech, tags, source_type)
VALUES (
  'voc_ja_a8', 'deck_n5_adjectives', 'ja', '忙しい', '忙しい', 'いそがしい', 'isogashii',
  'bận rộn', 'busy', 'having a great deal to do',
  '今週は仕事でとても忙しいです。', 'Tuần này tôi rất bận rộn với công việc.',
  'N5', 'Tính từ đuôi い', 'N5,Tính từ,Trạng thái,Mazii', 'imported'
);

-- 24. 美味しい (oishii)
INSERT OR REPLACE INTO vocabulary (id, deck_id, language, word, normalized_word, reading, romaji, meaning_vi, meaning_en, definition_en, example, example_translation, level, part_of_speech, tags, source_type)
VALUES (
  'voc_ja_a9', 'deck_n5_adjectives', 'ja', '美味しい', '美味しい', 'おいしい', 'oishii',
  'ngon (đồ ăn, thức uống)', 'delicious, tasty', 'highly pleasant to the taste',
  '母が作った料理はとても美味しいです。', 'Món ăn mẹ nấu rất ngon.',
  'N5', 'Tính từ đuôi い', 'N5,Tính từ,Ẩm thực,Mazii', 'imported'
);

-- 25. 高い (takai)
INSERT OR REPLACE INTO vocabulary (id, deck_id, language, word, normalized_word, reading, romaji, meaning_vi, meaning_en, definition_en, example, example_translation, level, part_of_speech, tags, source_type)
VALUES (
  'voc_ja_a10', 'deck_n5_adjectives', 'ja', '高い', '高い', 'たかい', 'takai',
  'cao; đắt (tiền)', 'high; expensive', 'of great vertical extent; costing a lot of money',
  '富士山は日本で一番高い山です。', 'Núi Phú Sĩ là ngọn núi cao nhất Nhật Bản.',
  'N5', 'Tính từ đuôi い', 'N5,Tính từ,Đặc điểm,Mazii', 'imported'
);

-- 26. 安い (yasui)
INSERT OR REPLACE INTO vocabulary (id, deck_id, language, word, normalized_word, reading, romaji, meaning_vi, meaning_en, definition_en, example, example_translation, level, part_of_speech, tags, source_type)
VALUES (
  'voc_ja_a11', 'deck_n5_adjectives', 'ja', '安い', '安い', 'やすい', 'yasui',
  'rẻ (giá cả)', 'cheap, inexpensive', 'costing little money',
  'このスーパーの果物は安くて新鮮です。', 'Trái cây ở siêu thị này rẻ và tươi ngon.',
  'N5', 'Tính từ đuôi い', 'N5,Tính từ,Giá cả,Mazii', 'imported'
);

-- 27. 綺麗 (kirei)
INSERT OR REPLACE INTO vocabulary (id, deck_id, language, word, normalized_word, reading, romaji, meaning_vi, meaning_en, definition_en, example, example_translation, level, part_of_speech, tags, source_type)
VALUES (
  'voc_ja_a12', 'deck_n5_adjectives', 'ja', '綺麗', '綺麗', 'きれい', 'kirei',
  'đẹp; sạch sẽ', 'pretty, clean', 'attractive in a delicate way; free from dirt',
  '公園の桜の花がとても綺麗です。', 'Hoa anh đào ở công viên rất đẹp.',
  'N5', 'Tính từ đuôi な', 'N5,Tính từ,Sắc đẹp,Mazii', 'imported'
);

-- 28. 元気 (genki)
INSERT OR REPLACE INTO vocabulary (id, deck_id, language, word, normalized_word, reading, romaji, meaning_vi, meaning_en, definition_en, example, example_translation, level, part_of_speech, tags, source_type)
VALUES (
  'voc_ja_a13', 'deck_n5_adjectives', 'ja', '元気', '元気', 'げんき', 'genki',
  'khỏe mạnh, tràn đầy năng lượng', 'healthy, energetic', 'in good health; lively',
  'お元気ですか。はい、元気です。', 'Bạn có khỏe không? Vâng, tôi khỏe.',
  'N5', 'Tính từ đuôi な', 'N5,Tính từ,Sức khỏe,Mazii', 'imported'
);

-- 29. 好き (suki)
INSERT OR REPLACE INTO vocabulary (id, deck_id, language, word, normalized_word, reading, romaji, meaning_vi, meaning_en, definition_en, example, example_translation, level, part_of_speech, tags, source_type)
VALUES (
  'voc_ja_a14', 'deck_n5_adjectives', 'ja', '好き', '好き', 'すき', 'suki',
  'thích', 'liked, favorite', 'regarded with preference or liking',
  '私は日本の文化が好きです。', 'Tôi rất thích văn hóa Nhật Bản.',
  'N5', 'Tính từ đuôi な', 'N5,Tính từ,Cảm xúc,Mazii', 'imported'
);

-- 30. 便利 (benri)
INSERT OR REPLACE INTO vocabulary (id, deck_id, language, word, normalized_word, reading, romaji, meaning_vi, meaning_en, definition_en, example, example_translation, level, part_of_speech, tags, source_type)
VALUES (
  'voc_ja_a15', 'deck_n5_adjectives', 'ja', '便利', '便利', 'べんり', 'benri',
  'tiện lợi, thuận tiện', 'convenient, handy', 'fitting in well with a person’s needs',
  'コンビニは２４時間開いていて便利です。', 'Cửa hàng tiện lợi mở cửa 24 giờ rất thuận tiện.',
  'N5', 'Tính từ đuôi な', 'N5,Tính từ,Đánh giá,Mazii', 'imported'
);

-- ========================================================
-- DECK 3: JLPT N5 - Đời sống & Giao tiếp (15 nouns & terms)
-- ========================================================

-- 31. 私 (watashi)
INSERT OR REPLACE INTO vocabulary (id, deck_id, language, word, normalized_word, reading, romaji, meaning_vi, meaning_en, definition_en, example, example_translation, level, part_of_speech, tags, source_type)
VALUES (
  'voc_ja_d1', 'deck_n5_daily_life', 'ja', '私', '私', 'わたし', 'watashi',
  'tôi (đại từ nhân xưng ngôi thứ nhất)', 'I, me', 'used by a speaker to refer to themselves',
  '私はベトナムから来ました。', 'Tôi đến từ Việt Nam.',
  'N5', 'Đại từ', 'N5,Xưng hô,Minna bài 1,Mazii', 'imported'
);

-- 32. 先生 (sensei)
INSERT OR REPLACE INTO vocabulary (id, deck_id, language, word, normalized_word, reading, romaji, meaning_vi, meaning_en, definition_en, example, example_translation, level, part_of_speech, tags, source_type)
VALUES (
  'voc_ja_d2', 'deck_n5_daily_life', 'ja', '先生', '先生', 'せんせい', 'sensei',
  'thầy cô giáo; bác sĩ', 'teacher; doctor', 'a person who teaches or practices medicine',
  '田中先生はとても優しいです。', 'Thầy Tanaka rất hiền từ.',
  'N5', 'Danh từ', 'N5,Nghề nghiệp,Minna bài 1,Mazii', 'imported'
);

-- 33. 学生 (gakusei)
INSERT OR REPLACE INTO vocabulary (id, deck_id, language, word, normalized_word, reading, romaji, meaning_vi, meaning_en, definition_en, example, example_translation, level, part_of_speech, tags, source_type)
VALUES (
  'voc_ja_d3', 'deck_n5_daily_life', 'ja', '学生', '学生', 'がくせい', 'gakusei',
  'học sinh, sinh viên', 'student', 'a person who is studying at a school or university',
  '弟は東京の大学の学生です。', 'Em trai tôi là sinh viên một trường đại học ở Tokyo.',
  'N5', 'Danh từ', 'N5,Con người,Minna bài 1,Mazii', 'imported'
);

-- 34. 日本 (nihon)
INSERT OR REPLACE INTO vocabulary (id, deck_id, language, word, normalized_word, reading, romaji, meaning_vi, meaning_en, definition_en, example, example_translation, level, part_of_speech, tags, source_type)
VALUES (
  'voc_ja_d4', 'deck_n5_daily_life', 'ja', '日本', '日本', 'にほん', 'nihon',
  'Nhật Bản', 'Japan', 'an island country in East Asia',
  '来年の春に日本へ旅行に行きます。', 'Mùa xuân năm sau tôi sẽ đi du lịch Nhật Bản.',
  'N5', 'Danh từ riêng', 'N5,Đất nước,Minna bài 1,Mazii', 'imported'
);

-- 35. 今日 (kyou)
INSERT OR REPLACE INTO vocabulary (id, deck_id, language, word, normalized_word, reading, romaji, meaning_vi, meaning_en, definition_en, example, example_translation, level, part_of_speech, tags, source_type)
VALUES (
  'voc_ja_d5', 'deck_n5_daily_life', 'ja', '今日', '今日', 'きょう', 'kyou',
  'hôm nay', 'today', 'on or in the course of this present day',
  '今日は友達と買い物をします。', 'Hôm nay tôi sẽ đi mua sắm cùng bạn bè.',
  'N5', 'Danh từ thời gian', 'N5,Thời gian,Minna bài 4,Mazii', 'imported'
);

-- 36. 明日 (ashita)
INSERT OR REPLACE INTO vocabulary (id, deck_id, language, word, normalized_word, reading, romaji, meaning_vi, meaning_en, definition_en, example, example_translation, level, part_of_speech, tags, source_type)
VALUES (
  'voc_ja_d6', 'deck_n5_daily_life', 'ja', '明日', '明日', 'あした', 'ashita',
  'ngày mai', 'tomorrow', 'on the day after today',
  '明日はテストがあります。', 'Ngày mai tôi có bài kiểm tra.',
  'N5', 'Danh từ thời gian', 'N5,Thời gian,Minna bài 4,Mazii', 'imported'
);

-- 37. 昨日 (kinou)
INSERT OR REPLACE INTO vocabulary (id, deck_id, language, word, normalized_word, reading, romaji, meaning_vi, meaning_en, definition_en, example, example_translation, level, part_of_speech, tags, source_type)
VALUES (
  'voc_ja_d7', 'deck_n5_daily_life', 'ja', '昨日', '昨日', 'きのう', 'kinou',
  'hôm qua', 'yesterday', 'on the day before today',
  '昨日は家でゆっくり休みました。', 'Hôm qua tôi đã nghỉ ngơi thong thả ở nhà.',
  'N5', 'Danh từ thời gian', 'N5,Thời gian,Minna bài 4,Mazii', 'imported'
);

-- 38. 朝 (asa)
INSERT OR REPLACE INTO vocabulary (id, deck_id, language, word, normalized_word, reading, romaji, meaning_vi, meaning_en, definition_en, example, example_translation, level, part_of_speech, tags, source_type)
VALUES (
  'voc_ja_d8', 'deck_n5_daily_life', 'ja', '朝', '朝', 'あさ', 'asa',
  'buổi sáng', 'morning', 'the period of time between midnight or sunrise and noon',
  '朝の空気はとても爽やかです。', 'Không khí buổi sáng rất trong lành dễ chịu.',
  'N5', 'Danh từ thời gian', 'N5,Thời gian,Minna bài 4,Mazii', 'imported'
);

-- 39. 夜 (yoru)
INSERT OR REPLACE INTO vocabulary (id, deck_id, language, word, normalized_word, reading, romaji, meaning_vi, meaning_en, definition_en, example, example_translation, level, part_of_speech, tags, source_type)
VALUES (
  'voc_ja_d9', 'deck_n5_daily_life', 'ja', '夜', '夜', 'よる', 'yoru',
  'buổi tối, ban đêm', 'night, evening', 'the period from sunset to sunrise in each twenty-four hours',
  '夜は１１時ごろに寝ます。', 'Buổi tối tôi đi ngủ vào khoảng 11 giờ.',
  'N5', 'Danh từ thời gian', 'N5,Thời gian,Minna bài 4,Mazii', 'imported'
);

-- 40. 時間 (jikan)
INSERT OR REPLACE INTO vocabulary (id, deck_id, language, word, normalized_word, reading, romaji, meaning_vi, meaning_en, definition_en, example, example_translation, level, part_of_speech, tags, source_type)
VALUES (
  'voc_ja_d10', 'deck_n5_daily_life', 'ja', '時間', '時間', 'じかん', 'jikan',
  'thời gian; tiếng (đồng hồ)', 'time; hour', 'the indefinite continued progress of existence; duration',
  '映画が始まる時間まであと３０分です。', 'Còn 30 phút nữa là đến giờ phim chiếu.',
  'N5', 'Danh từ', 'N5,Thời gian,Minna bài 4,Mazii', 'imported'
);

-- 41. 学校 (gakkou)
INSERT OR REPLACE INTO vocabulary (id, deck_id, language, word, normalized_word, reading, romaji, meaning_vi, meaning_en, definition_en, example, example_translation, level, part_of_speech, tags, source_type)
VALUES (
  'voc_ja_d11', 'deck_n5_daily_life', 'ja', '学校', '学校', 'がっこう', 'gakkou',
  'trường học', 'school', 'an institution for educating children or students',
  '自転車で学校へ通っています。', 'Tôi đi học đến trường bằng xe đạp.',
  'N5', 'Danh từ', 'N5,Địa điểm,Minna bài 5,Mazii', 'imported'
);

-- 42. 会社 (kaisha)
INSERT OR REPLACE INTO vocabulary (id, deck_id, language, word, normalized_word, reading, romaji, meaning_vi, meaning_en, definition_en, example, example_translation, level, part_of_speech, tags, source_type)
VALUES (
  'voc_ja_d12', 'deck_n5_daily_life', 'ja', '会社', '会社', 'かいしゃ', 'kaisha',
  'công ty', 'company', 'a commercial business',
  '父は日本の自動車の会社で働いています。', 'Bố tôi đang làm việc tại một công ty ô tô của Nhật.',
  'N5', 'Danh từ', 'N5,Địa điểm,Minna bài 1,Mazii', 'imported'
);

-- 43. 家 (uchi)
INSERT OR REPLACE INTO vocabulary (id, deck_id, language, word, normalized_word, reading, romaji, meaning_vi, meaning_en, definition_en, example, example_translation, level, part_of_speech, tags, source_type)
VALUES (
  'voc_ja_d13', 'deck_n5_daily_life', 'ja', '家', '家', 'うち', 'uchi',
  'nhà, gia đình', 'house, home', 'a building for human habitation',
  '週末はずっと家で本を読んでいました。', 'Cuối tuần tôi ở nhà đọc sách suốt.',
  'N5', 'Danh từ', 'N5,Địa điểm,Minna bài 3,Mazii', 'imported'
);

-- 44. 電車 (densha)
INSERT OR REPLACE INTO vocabulary (id, deck_id, language, word, normalized_word, reading, romaji, meaning_vi, meaning_en, definition_en, example, example_translation, level, part_of_speech, tags, source_type)
VALUES (
  'voc_ja_d14', 'deck_n5_daily_life', 'ja', '電車', '電車', 'でんしゃ', 'densha',
  'tàu điện', 'electric train', 'a connected series of railroad cars',
  '電車に乗って会社へ行きます。', 'Tôi lên tàu điện để đi đến công ty.',
  'N5', 'Danh từ', 'N5,Phương tiện,Minna bài 5,Mazii', 'imported'
);

-- 45. お金 (okane)
INSERT OR REPLACE INTO vocabulary (id, deck_id, language, word, normalized_word, reading, romaji, meaning_vi, meaning_en, definition_en, example, example_translation, level, part_of_speech, tags, source_type)
VALUES (
  'voc_ja_d15', 'deck_n5_daily_life', 'ja', 'お金', 'お金', 'おかね', 'okane',
  'tiền, tiền bạc', 'money', 'a current medium of exchange in the form of coins and banknotes',
  'お金を大切に使います。', 'Tôi chi tiêu tiền bạc một cách cẩn thận.',
  'N5', 'Danh từ', 'N5,Đồ vật,Minna bài 3,Mazii', 'imported'
);

-- ========================================================
-- STUDY DIRECTIONS FOR JAPANESE (ja_to_vi, ja_to_reading active; reading_to_ja, vi_to_ja locked)
-- ========================================================

-- Directions for Verbs
INSERT OR REPLACE INTO study_directions (id, vocabulary_id, direction, activation_status, prerequisite_direction_id)
VALUES
  ('dir_ja_v1_base', 'voc_ja_v1', 'ja_to_vi', 'active', NULL),
  ('dir_ja_v1_read', 'voc_ja_v1', 'ja_to_reading', 'active', NULL),
  ('dir_ja_v1_rev', 'voc_ja_v1', 'vi_to_ja', 'locked', 'dir_ja_v1_base'),
  ('dir_ja_v1_kanji', 'voc_ja_v1', 'reading_to_ja', 'locked', 'dir_ja_v1_read'),

  ('dir_ja_v2_base', 'voc_ja_v2', 'ja_to_vi', 'active', NULL),
  ('dir_ja_v2_read', 'voc_ja_v2', 'ja_to_reading', 'active', NULL),
  ('dir_ja_v2_rev', 'voc_ja_v2', 'vi_to_ja', 'locked', 'dir_ja_v2_base'),
  ('dir_ja_v2_kanji', 'voc_ja_v2', 'reading_to_ja', 'locked', 'dir_ja_v2_read'),

  ('dir_ja_v3_base', 'voc_ja_v3', 'ja_to_vi', 'active', NULL),
  ('dir_ja_v3_read', 'voc_ja_v3', 'ja_to_reading', 'active', NULL),
  ('dir_ja_v3_rev', 'voc_ja_v3', 'vi_to_ja', 'locked', 'dir_ja_v3_base'),
  ('dir_ja_v3_kanji', 'voc_ja_v3', 'reading_to_ja', 'locked', 'dir_ja_v3_read'),

  ('dir_ja_v4_base', 'voc_ja_v4', 'ja_to_vi', 'active', NULL),
  ('dir_ja_v4_read', 'voc_ja_v4', 'ja_to_reading', 'active', NULL),
  ('dir_ja_v4_rev', 'voc_ja_v4', 'vi_to_ja', 'locked', 'dir_ja_v4_base'),
  ('dir_ja_v4_kanji', 'voc_ja_v4', 'reading_to_ja', 'locked', 'dir_ja_v4_read'),

  ('dir_ja_v5_base', 'voc_ja_v5', 'ja_to_vi', 'active', NULL),
  ('dir_ja_v5_read', 'voc_ja_v5', 'ja_to_reading', 'active', NULL),
  ('dir_ja_v5_rev', 'voc_ja_v5', 'vi_to_ja', 'locked', 'dir_ja_v5_base'),
  ('dir_ja_v5_kanji', 'voc_ja_v5', 'reading_to_ja', 'locked', 'dir_ja_v5_read'),

  ('dir_ja_v6_base', 'voc_ja_v6', 'ja_to_vi', 'active', NULL),
  ('dir_ja_v6_read', 'voc_ja_v6', 'ja_to_reading', 'active', NULL),
  ('dir_ja_v6_rev', 'voc_ja_v6', 'vi_to_ja', 'locked', 'dir_ja_v6_base'),
  ('dir_ja_v6_kanji', 'voc_ja_v6', 'reading_to_ja', 'locked', 'dir_ja_v6_read'),

  ('dir_ja_v7_base', 'voc_ja_v7', 'ja_to_vi', 'active', NULL),
  ('dir_ja_v7_read', 'voc_ja_v7', 'ja_to_reading', 'active', NULL),
  ('dir_ja_v7_rev', 'voc_ja_v7', 'vi_to_ja', 'locked', 'dir_ja_v7_base'),
  ('dir_ja_v7_kanji', 'voc_ja_v7', 'reading_to_ja', 'locked', 'dir_ja_v7_read'),

  ('dir_ja_v8_base', 'voc_ja_v8', 'ja_to_vi', 'active', NULL),
  ('dir_ja_v8_read', 'voc_ja_v8', 'ja_to_reading', 'active', NULL),
  ('dir_ja_v8_rev', 'voc_ja_v8', 'vi_to_ja', 'locked', 'dir_ja_v8_base'),
  ('dir_ja_v8_kanji', 'voc_ja_v8', 'reading_to_ja', 'locked', 'dir_ja_v8_read'),

  ('dir_ja_v9_base', 'voc_ja_v9', 'ja_to_vi', 'active', NULL),
  ('dir_ja_v9_read', 'voc_ja_v9', 'ja_to_reading', 'active', NULL),
  ('dir_ja_v9_rev', 'voc_ja_v9', 'vi_to_ja', 'locked', 'dir_ja_v9_base'),
  ('dir_ja_v9_kanji', 'voc_ja_v9', 'reading_to_ja', 'locked', 'dir_ja_v9_read'),

  ('dir_ja_v10_base', 'voc_ja_v10', 'ja_to_vi', 'active', NULL),
  ('dir_ja_v10_read', 'voc_ja_v10', 'ja_to_reading', 'active', NULL),
  ('dir_ja_v10_rev', 'voc_ja_v10', 'vi_to_ja', 'locked', 'dir_ja_v10_base'),
  ('dir_ja_v10_kanji', 'voc_ja_v10', 'reading_to_ja', 'locked', 'dir_ja_v10_read'),

  ('dir_ja_v11_base', 'voc_ja_v11', 'ja_to_vi', 'active', NULL),
  ('dir_ja_v11_read', 'voc_ja_v11', 'ja_to_reading', 'active', NULL),
  ('dir_ja_v11_rev', 'voc_ja_v11', 'vi_to_ja', 'locked', 'dir_ja_v11_base'),
  ('dir_ja_v11_kanji', 'voc_ja_v11', 'reading_to_ja', 'locked', 'dir_ja_v11_read'),

  ('dir_ja_v12_base', 'voc_ja_v12', 'ja_to_vi', 'active', NULL),
  ('dir_ja_v12_read', 'voc_ja_v12', 'ja_to_reading', 'active', NULL),
  ('dir_ja_v12_rev', 'voc_ja_v12', 'vi_to_ja', 'locked', 'dir_ja_v12_base'),
  ('dir_ja_v12_kanji', 'voc_ja_v12', 'reading_to_ja', 'locked', 'dir_ja_v12_read'),

  ('dir_ja_v13_base', 'voc_ja_v13', 'ja_to_vi', 'active', NULL),
  ('dir_ja_v13_read', 'voc_ja_v13', 'ja_to_reading', 'active', NULL),
  ('dir_ja_v13_rev', 'voc_ja_v13', 'vi_to_ja', 'locked', 'dir_ja_v13_base'),
  ('dir_ja_v13_kanji', 'voc_ja_v13', 'reading_to_ja', 'locked', 'dir_ja_v13_read'),

  ('dir_ja_v14_base', 'voc_ja_v14', 'ja_to_vi', 'active', NULL),
  ('dir_ja_v14_read', 'voc_ja_v14', 'ja_to_reading', 'active', NULL),
  ('dir_ja_v14_rev', 'voc_ja_v14', 'vi_to_ja', 'locked', 'dir_ja_v14_base'),
  ('dir_ja_v14_kanji', 'voc_ja_v14', 'reading_to_ja', 'locked', 'dir_ja_v14_read'),

  ('dir_ja_v15_base', 'voc_ja_v15', 'ja_to_vi', 'active', NULL),
  ('dir_ja_v15_read', 'voc_ja_v15', 'ja_to_reading', 'active', NULL),
  ('dir_ja_v15_rev', 'voc_ja_v15', 'vi_to_ja', 'locked', 'dir_ja_v15_base'),
  ('dir_ja_v15_kanji', 'voc_ja_v15', 'reading_to_ja', 'locked', 'dir_ja_v15_read');

-- Directions for Adjectives
INSERT OR REPLACE INTO study_directions (id, vocabulary_id, direction, activation_status, prerequisite_direction_id)
VALUES
  ('dir_ja_a1_base', 'voc_ja_a1', 'ja_to_vi', 'active', NULL),
  ('dir_ja_a1_read', 'voc_ja_a1', 'ja_to_reading', 'active', NULL),
  ('dir_ja_a1_rev', 'voc_ja_a1', 'vi_to_ja', 'locked', 'dir_ja_a1_base'),
  ('dir_ja_a1_kanji', 'voc_ja_a1', 'reading_to_ja', 'locked', 'dir_ja_a1_read'),

  ('dir_ja_a2_base', 'voc_ja_a2', 'ja_to_vi', 'active', NULL),
  ('dir_ja_a2_read', 'voc_ja_a2', 'ja_to_reading', 'active', NULL),
  ('dir_ja_a2_rev', 'voc_ja_a2', 'vi_to_ja', 'locked', 'dir_ja_a2_base'),
  ('dir_ja_a2_kanji', 'voc_ja_a2', 'reading_to_ja', 'locked', 'dir_ja_a2_read'),

  ('dir_ja_a3_base', 'voc_ja_a3', 'ja_to_vi', 'active', NULL),
  ('dir_ja_a3_read', 'voc_ja_a3', 'ja_to_reading', 'active', NULL),
  ('dir_ja_a3_rev', 'voc_ja_a3', 'vi_to_ja', 'locked', 'dir_ja_a3_base'),
  ('dir_ja_a3_kanji', 'voc_ja_a3', 'reading_to_ja', 'locked', 'dir_ja_a3_read'),

  ('dir_ja_a4_base', 'voc_ja_a4', 'ja_to_vi', 'active', NULL),
  ('dir_ja_a4_read', 'voc_ja_a4', 'ja_to_reading', 'active', NULL),
  ('dir_ja_a4_rev', 'voc_ja_a4', 'vi_to_ja', 'locked', 'dir_ja_a4_base'),
  ('dir_ja_a4_kanji', 'voc_ja_a4', 'reading_to_ja', 'locked', 'dir_ja_a4_read'),

  ('dir_ja_a5_base', 'voc_ja_a5', 'ja_to_vi', 'active', NULL),
  ('dir_ja_a5_rev', 'voc_ja_a5', 'vi_to_ja', 'locked', 'dir_ja_a5_base'),

  ('dir_ja_a6_base', 'voc_ja_a6', 'ja_to_vi', 'active', NULL),
  ('dir_ja_a6_read', 'voc_ja_a6', 'ja_to_reading', 'active', NULL),
  ('dir_ja_a6_rev', 'voc_ja_a6', 'vi_to_ja', 'locked', 'dir_ja_a6_base'),
  ('dir_ja_a6_kanji', 'voc_ja_a6', 'reading_to_ja', 'locked', 'dir_ja_a6_read'),

  ('dir_ja_a7_base', 'voc_ja_a7', 'ja_to_vi', 'active', NULL),
  ('dir_ja_a7_read', 'voc_ja_a7', 'ja_to_reading', 'active', NULL),
  ('dir_ja_a7_rev', 'voc_ja_a7', 'vi_to_ja', 'locked', 'dir_ja_a7_base'),
  ('dir_ja_a7_kanji', 'voc_ja_a7', 'reading_to_ja', 'locked', 'dir_ja_a7_read'),

  ('dir_ja_a8_base', 'voc_ja_a8', 'ja_to_vi', 'active', NULL),
  ('dir_ja_a8_read', 'voc_ja_a8', 'ja_to_reading', 'active', NULL),
  ('dir_ja_a8_rev', 'voc_ja_a8', 'vi_to_ja', 'locked', 'dir_ja_a8_base'),
  ('dir_ja_a8_kanji', 'voc_ja_a8', 'reading_to_ja', 'locked', 'dir_ja_a8_read'),

  ('dir_ja_a9_base', 'voc_ja_a9', 'ja_to_vi', 'active', NULL),
  ('dir_ja_a9_read', 'voc_ja_a9', 'ja_to_reading', 'active', NULL),
  ('dir_ja_a9_rev', 'voc_ja_a9', 'vi_to_ja', 'locked', 'dir_ja_a9_base'),
  ('dir_ja_a9_kanji', 'voc_ja_a9', 'reading_to_ja', 'locked', 'dir_ja_a9_read'),

  ('dir_ja_a10_base', 'voc_ja_a10', 'ja_to_vi', 'active', NULL),
  ('dir_ja_a10_read', 'voc_ja_a10', 'ja_to_reading', 'active', NULL),
  ('dir_ja_a10_rev', 'voc_ja_a10', 'vi_to_ja', 'locked', 'dir_ja_a10_base'),
  ('dir_ja_a10_kanji', 'voc_ja_a10', 'reading_to_ja', 'locked', 'dir_ja_a10_read'),

  ('dir_ja_a11_base', 'voc_ja_a11', 'ja_to_vi', 'active', NULL),
  ('dir_ja_a11_read', 'voc_ja_a11', 'ja_to_reading', 'active', NULL),
  ('dir_ja_a11_rev', 'voc_ja_a11', 'vi_to_ja', 'locked', 'dir_ja_a11_base'),
  ('dir_ja_a11_kanji', 'voc_ja_a11', 'reading_to_ja', 'locked', 'dir_ja_a11_read'),

  ('dir_ja_a12_base', 'voc_ja_a12', 'ja_to_vi', 'active', NULL),
  ('dir_ja_a12_read', 'voc_ja_a12', 'ja_to_reading', 'active', NULL),
  ('dir_ja_a12_rev', 'voc_ja_a12', 'vi_to_ja', 'locked', 'dir_ja_a12_base'),
  ('dir_ja_a12_kanji', 'voc_ja_a12', 'reading_to_ja', 'locked', 'dir_ja_a12_read'),

  ('dir_ja_a13_base', 'voc_ja_a13', 'ja_to_vi', 'active', NULL),
  ('dir_ja_a13_read', 'voc_ja_a13', 'ja_to_reading', 'active', NULL),
  ('dir_ja_a13_rev', 'voc_ja_a13', 'vi_to_ja', 'locked', 'dir_ja_a13_base'),
  ('dir_ja_a13_kanji', 'voc_ja_a13', 'reading_to_ja', 'locked', 'dir_ja_a13_read'),

  ('dir_ja_a14_base', 'voc_ja_a14', 'ja_to_vi', 'active', NULL),
  ('dir_ja_a14_read', 'voc_ja_a14', 'ja_to_reading', 'active', NULL),
  ('dir_ja_a14_rev', 'voc_ja_a14', 'vi_to_ja', 'locked', 'dir_ja_a14_base'),
  ('dir_ja_a14_kanji', 'voc_ja_a14', 'reading_to_ja', 'locked', 'dir_ja_a14_read'),

  ('dir_ja_a15_base', 'voc_ja_a15', 'ja_to_vi', 'active', NULL),
  ('dir_ja_a15_read', 'voc_ja_a15', 'ja_to_reading', 'active', NULL),
  ('dir_ja_a15_rev', 'voc_ja_a15', 'vi_to_ja', 'locked', 'dir_ja_a15_base'),
  ('dir_ja_a15_kanji', 'voc_ja_a15', 'reading_to_ja', 'locked', 'dir_ja_a15_read');

-- Directions for Daily Life
INSERT OR REPLACE INTO study_directions (id, vocabulary_id, direction, activation_status, prerequisite_direction_id)
VALUES
  ('dir_ja_d1_base', 'voc_ja_d1', 'ja_to_vi', 'active', NULL),
  ('dir_ja_d1_read', 'voc_ja_d1', 'ja_to_reading', 'active', NULL),
  ('dir_ja_d1_rev', 'voc_ja_d1', 'vi_to_ja', 'locked', 'dir_ja_d1_base'),
  ('dir_ja_d1_kanji', 'voc_ja_d1', 'reading_to_ja', 'locked', 'dir_ja_d1_read'),

  ('dir_ja_d2_base', 'voc_ja_d2', 'ja_to_vi', 'active', NULL),
  ('dir_ja_d2_read', 'voc_ja_d2', 'ja_to_reading', 'active', NULL),
  ('dir_ja_d2_rev', 'voc_ja_d2', 'vi_to_ja', 'locked', 'dir_ja_d2_base'),
  ('dir_ja_d2_kanji', 'voc_ja_d2', 'reading_to_ja', 'locked', 'dir_ja_d2_read'),

  ('dir_ja_d3_base', 'voc_ja_d3', 'ja_to_vi', 'active', NULL),
  ('dir_ja_d3_read', 'voc_ja_d3', 'ja_to_reading', 'active', NULL),
  ('dir_ja_d3_rev', 'voc_ja_d3', 'vi_to_ja', 'locked', 'dir_ja_d3_base'),
  ('dir_ja_d3_kanji', 'voc_ja_d3', 'reading_to_ja', 'locked', 'dir_ja_d3_read'),

  ('dir_ja_d4_base', 'voc_ja_d4', 'ja_to_vi', 'active', NULL),
  ('dir_ja_d4_read', 'voc_ja_d4', 'ja_to_reading', 'active', NULL),
  ('dir_ja_d4_rev', 'voc_ja_d4', 'vi_to_ja', 'locked', 'dir_ja_d4_base'),
  ('dir_ja_d4_kanji', 'voc_ja_d4', 'reading_to_ja', 'locked', 'dir_ja_d4_read'),

  ('dir_ja_d5_base', 'voc_ja_d5', 'ja_to_vi', 'active', NULL),
  ('dir_ja_d5_read', 'voc_ja_d5', 'ja_to_reading', 'active', NULL),
  ('dir_ja_d5_rev', 'voc_ja_d5', 'vi_to_ja', 'locked', 'dir_ja_d5_base'),
  ('dir_ja_d5_kanji', 'voc_ja_d5', 'reading_to_ja', 'locked', 'dir_ja_d5_read'),

  ('dir_ja_d6_base', 'voc_ja_d6', 'ja_to_vi', 'active', NULL),
  ('dir_ja_d6_read', 'voc_ja_d6', 'ja_to_reading', 'active', NULL),
  ('dir_ja_d6_rev', 'voc_ja_d6', 'vi_to_ja', 'locked', 'dir_ja_d6_base'),
  ('dir_ja_d6_kanji', 'voc_ja_d6', 'reading_to_ja', 'locked', 'dir_ja_d6_read'),

  ('dir_ja_d7_base', 'voc_ja_d7', 'ja_to_vi', 'active', NULL),
  ('dir_ja_d7_read', 'voc_ja_d7', 'ja_to_reading', 'active', NULL),
  ('dir_ja_d7_rev', 'voc_ja_d7', 'vi_to_ja', 'locked', 'dir_ja_d7_base'),
  ('dir_ja_d7_kanji', 'voc_ja_d7', 'reading_to_ja', 'locked', 'dir_ja_d7_read'),

  ('dir_ja_d8_base', 'voc_ja_d8', 'ja_to_vi', 'active', NULL),
  ('dir_ja_d8_read', 'voc_ja_d8', 'ja_to_reading', 'active', NULL),
  ('dir_ja_d8_rev', 'voc_ja_d8', 'vi_to_ja', 'locked', 'dir_ja_d8_base'),
  ('dir_ja_d8_kanji', 'voc_ja_d8', 'reading_to_ja', 'locked', 'dir_ja_d8_read'),

  ('dir_ja_d9_base', 'voc_ja_d9', 'ja_to_vi', 'active', NULL),
  ('dir_ja_d9_read', 'voc_ja_d9', 'ja_to_reading', 'active', NULL),
  ('dir_ja_d9_rev', 'voc_ja_d9', 'vi_to_ja', 'locked', 'dir_ja_d9_base'),
  ('dir_ja_d9_kanji', 'voc_ja_d9', 'reading_to_ja', 'locked', 'dir_ja_d9_read'),

  ('dir_ja_d10_base', 'voc_ja_d10', 'ja_to_vi', 'active', NULL),
  ('dir_ja_d10_read', 'voc_ja_d10', 'ja_to_reading', 'active', NULL),
  ('dir_ja_d10_rev', 'voc_ja_d10', 'vi_to_ja', 'locked', 'dir_ja_d10_base'),
  ('dir_ja_d10_kanji', 'voc_ja_d10', 'reading_to_ja', 'locked', 'dir_ja_d10_read'),

  ('dir_ja_d11_base', 'voc_ja_d11', 'ja_to_vi', 'active', NULL),
  ('dir_ja_d11_read', 'voc_ja_d11', 'ja_to_reading', 'active', NULL),
  ('dir_ja_d11_rev', 'voc_ja_d11', 'vi_to_ja', 'locked', 'dir_ja_d11_base'),
  ('dir_ja_d11_kanji', 'voc_ja_d11', 'reading_to_ja', 'locked', 'dir_ja_d11_read'),

  ('dir_ja_d12_base', 'voc_ja_d12', 'ja_to_vi', 'active', NULL),
  ('dir_ja_d12_read', 'voc_ja_d12', 'ja_to_reading', 'active', NULL),
  ('dir_ja_d12_rev', 'voc_ja_d12', 'vi_to_ja', 'locked', 'dir_ja_d12_base'),
  ('dir_ja_d12_kanji', 'voc_ja_d12', 'reading_to_ja', 'locked', 'dir_ja_d12_read'),

  ('dir_ja_d13_base', 'voc_ja_d13', 'ja_to_vi', 'active', NULL),
  ('dir_ja_d13_read', 'voc_ja_d13', 'ja_to_reading', 'active', NULL),
  ('dir_ja_d13_rev', 'voc_ja_d13', 'vi_to_ja', 'locked', 'dir_ja_d13_base'),
  ('dir_ja_d13_kanji', 'voc_ja_d13', 'reading_to_ja', 'locked', 'dir_ja_d13_read'),

  ('dir_ja_d14_base', 'voc_ja_d14', 'ja_to_vi', 'active', NULL),
  ('dir_ja_d14_read', 'voc_ja_d14', 'ja_to_reading', 'active', NULL),
  ('dir_ja_d14_rev', 'voc_ja_d14', 'vi_to_ja', 'locked', 'dir_ja_d14_base'),
  ('dir_ja_d14_kanji', 'voc_ja_d14', 'reading_to_ja', 'locked', 'dir_ja_d14_read'),

  ('dir_ja_d15_base', 'voc_ja_d15', 'ja_to_vi', 'active', NULL),
  ('dir_ja_d15_read', 'voc_ja_d15', 'ja_to_reading', 'active', NULL),
  ('dir_ja_d15_rev', 'voc_ja_d15', 'vi_to_ja', 'locked', 'dir_ja_d15_base'),
  ('dir_ja_d15_kanji', 'voc_ja_d15', 'reading_to_ja', 'locked', 'dir_ja_d15_read');

-- Initialize progress for Hai for active Japanese cards
INSERT OR IGNORE INTO user_card_progress (user_id, study_direction_id, status, version)
SELECT 'ed0f5e54-8832-4b8b-91e7-c55628f69004', sd.id, 'new', 1
FROM study_directions sd
JOIN vocabulary v ON sd.vocabulary_id = v.id
WHERE v.language = 'ja' AND sd.activation_status = 'active';

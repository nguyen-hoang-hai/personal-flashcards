-- Ensure User Exists
INSERT OR IGNORE INTO users (id, email, display_name)
VALUES 
  ('ed0f5e54-8832-4b8b-91e7-c55628f69004', '2412nguyenhoanghai@gmail.com', 'Hai');

-- Create Decks
INSERT OR IGNORE INTO decks (id, owner_id, language, title, description, source_type)
VALUES 
  ('deck_ielts_daily_routines', 'ed0f5e54-8832-4b8b-91e7-c55628f69004', 'en', 'IELTS - Daily Routines', 'Từ vựng & thành ngữ chủ đề Thói quen hàng ngày từ tài liệu IELTS Nguyễn Huyền.', 'personal'),
  ('deck_ielts_friendship', 'ed0f5e54-8832-4b8b-91e7-c55628f69004', 'en', 'IELTS - Friendship', 'Từ vựng & collocations diễn đạt chủ đề Tình bạn trong IELTS Speaking.', 'personal');

-- User Deck Settings
INSERT OR REPLACE INTO user_deck_settings (user_id, deck_id, study_status, new_card_weight, display_order)
VALUES 
  ('ed0f5e54-8832-4b8b-91e7-c55628f69004', 'deck_ielts_daily_routines', 'active', 1.0, 1),
  ('ed0f5e54-8832-4b8b-91e7-c55628f69004', 'deck_ielts_friendship', 'active', 1.0, 2);

-- ========================================================
-- VOCABULARY FOR DECK 1: IELTS - Daily Routines
-- ========================================================

-- 1. sleep in
INSERT OR REPLACE INTO vocabulary (id, deck_id, language, word, normalized_word, pronunciation, meaning_vi, definition_en, example, example_translation, tags, source_type)
VALUES (
  'voc_dr_1', 'deck_ielts_daily_routines', 'en', 'sleep in', 'sleep in', '/sliːp ɪn/',
  'ngủ nướng, ngủ dậy muộn hơn bình thường',
  'to stay in bed later than usual in the morning',
  'I have a long history of sleeping in on weekends.',
  'Tôi có thói quen ngủ nướng vào dịp cuối tuần.',
  'routine,morning,habit', 'imported'
);

-- 2. scroll through social media
INSERT OR REPLACE INTO vocabulary (id, deck_id, language, word, normalized_word, pronunciation, meaning_vi, definition_en, example, example_translation, tags, source_type)
VALUES (
  'voc_dr_2', 'deck_ielts_daily_routines', 'en', 'scroll through social media', 'scroll through social media', '/skrəʊl θruː ˈsəʊ.ʃəl ˈmiː.di.ə/',
  'lướt mạng xã hội',
  'to look through content on social networking apps',
  'I try not to scroll through social media first thing in the morning.',
  'Tôi cố gắng không lướt mạng xã hội ngay đầu buổi sáng.',
  'routine,habit,digital', 'imported'
);

-- 3. make the bed
INSERT OR REPLACE INTO vocabulary (id, deck_id, language, word, normalized_word, pronunciation, meaning_vi, definition_en, example, example_translation, tags, source_type)
VALUES (
  'voc_dr_3', 'deck_ielts_daily_routines', 'en', 'make the bed', 'make the bed', '/meɪk ðə bed/',
  'gấp chăn màn, dọn giường cho ngăn nắp',
  'to arrange the covers on a bed so that it is neat',
  'After making my bed, I head to the kitchen to prepare breakfast.',
  'Sau khi dọn giường ngăn nắp, tôi vào bếp làm đồ ăn sáng.',
  'morning,routine,household', 'imported'
);

-- 4. do some stretches
INSERT OR REPLACE INTO vocabulary (id, deck_id, language, word, normalized_word, pronunciation, meaning_vi, definition_en, example, example_translation, tags, source_type)
VALUES (
  'voc_dr_4', 'deck_ielts_daily_routines', 'en', 'do some stretches', 'do some stretches', '/duː sʌm ˈstretʃ.ɪz/',
  'tập vài động tác giãn cơ',
  'to perform gentle exercises that stretch your muscles',
  'Doing some stretches in the morning helps awaken my muscles and boost flexibility.',
  'Tập vài động tác giãn cơ vào buổi sáng giúp đánh thức cơ bắp và tăng độ dẻo dai.',
  'health,exercise,morning', 'imported'
);

-- 5. lukewarm water
INSERT OR REPLACE INTO vocabulary (id, deck_id, language, word, normalized_word, pronunciation, meaning_vi, definition_en, example, example_translation, tags, source_type)
VALUES (
  'voc_dr_5', 'deck_ielts_daily_routines', 'en', 'lukewarm water', 'lukewarm water', '/ˌluːk.wɔːm ˈwɔː.tər/',
  'nước ấm vừa phải',
  'water that is only slightly warm, not hot or cold',
  'I usually drink a glass of lukewarm water right after waking up to boost my metabolism.',
  'Tôi thường uống một ly nước ấm ngay sau khi thức dậy để tăng cường trao đổi chất.',
  'health,morning,nutrition', 'imported'
);

-- 6. on an empty stomach
INSERT OR REPLACE INTO vocabulary (id, deck_id, language, word, normalized_word, pronunciation, meaning_vi, definition_en, example, example_translation, tags, source_type)
VALUES (
  'voc_dr_6', 'deck_ielts_daily_routines', 'en', 'on an empty stomach', 'on an empty stomach', '/ɒn ən ˈemp.ti ˈstʌm.ək/',
  'khi bụng đói, chưa ăn gì',
  'without having eaten any food beforehand',
  'Drinking warm lemon water on an empty stomach is beneficial for your digestive system.',
  'Uống nước chanh ấm khi bụng đói rất có lợi cho hệ tiêu hóa.',
  'health,nutrition,phrase', 'imported'
);

-- 7. early bird
INSERT OR REPLACE INTO vocabulary (id, deck_id, language, word, normalized_word, pronunciation, meaning_vi, definition_en, example, example_translation, tags, source_type)
VALUES (
  'voc_dr_7', 'deck_ielts_daily_routines', 'en', 'early bird', 'early bird', '/ˌɜː.li ˈbɜːd/',
  'người có thói quen dậy sớm',
  'a person who habitually wakes up early in the morning',
  'She is an early bird who feels most productive before 8 AM.',
  'Cô ấy là người có thói quen dậy sớm và cảm thấy làm việc năng suất nhất trước 8 giờ sáng.',
  'lifestyle,personality,idiom', 'imported'
);

-- 8. night owl
INSERT OR REPLACE INTO vocabulary (id, deck_id, language, word, normalized_word, pronunciation, meaning_vi, definition_en, example, example_translation, tags, source_type)
VALUES (
  'voc_dr_8', 'deck_ielts_daily_routines', 'en', 'night owl', 'night owl', '/ˈnaɪt ˌaʊl/',
  'người hay thức khuya, cú đêm',
  'a person who enjoys staying up late and is active at night',
  'Being a night owl makes it difficult for him to focus during 8 AM meetings.',
  'Thói quen làm cú đêm khiến anh ấy khó tập trung vào các cuộc họp lúc 8 giờ sáng.',
  'lifestyle,personality,idiom', 'imported'
);

-- 9. kick start your day
INSERT OR REPLACE INTO vocabulary (id, deck_id, language, word, normalized_word, pronunciation, meaning_vi, definition_en, example, example_translation, tags, source_type)
VALUES (
  'voc_dr_9', 'deck_ielts_daily_routines', 'en', 'kick start your day', 'kick start your day', '/kɪk stɑːt jɔː deɪ/',
  'bắt đầu ngày mới tràn đầy năng lượng',
  'to begin the day with strong energy and enthusiasm',
  'Listening to an inspiring podcast is a great way to kick start your day.',
  'Nghe một bài podcast truyền cảm hứng là cách tuyệt vời để bắt đầu ngày mới đầy năng lượng.',
  'routine,motivation,collocation', 'imported'
);

-- 10. rise and shine
INSERT OR REPLACE INTO vocabulary (id, deck_id, language, word, normalized_word, pronunciation, meaning_vi, definition_en, example, example_translation, tags, source_type)
VALUES (
  'voc_dr_10', 'deck_ielts_daily_routines', 'en', 'rise and shine', 'rise and shine', '/ˌraɪz ənd ˈʃaɪn/',
  'thức dậy tràn trề năng lượng để đón ngày mới',
  'said to tell someone to wake up and get out of bed cheerfully',
  'Rise and shine! The weather is beautiful today.',
  'Dậy thôi nào! Thời tiết hôm nay đẹp lắm.',
  'idiom,morning', 'imported'
);

-- 11. under the weather
INSERT OR REPLACE INTO vocabulary (id, deck_id, language, word, normalized_word, pronunciation, meaning_vi, definition_en, example, example_translation, tags, source_type)
VALUES (
  'voc_dr_11', 'deck_ielts_daily_routines', 'en', 'under the weather', 'under the weather', '/ˈʌn.dər ðə ˈweð.ər/',
  'cảm thấy hơi mệt mỏi, không được khỏe',
  'feeling slightly ill or unwell',
  'I felt a bit under the weather yesterday, so I went to bed early.',
  'Hôm qua tôi thấy hơi mệt trong người nên đã đi ngủ sớm.',
  'idiom,health', 'imported'
);

-- 12. hit the books
INSERT OR REPLACE INTO vocabulary (id, deck_id, language, word, normalized_word, pronunciation, meaning_vi, definition_en, example, example_translation, tags, source_type)
VALUES (
  'voc_dr_12', 'deck_ielts_daily_routines', 'en', 'hit the books', 'hit the books', '/hɪt ðə bʊks/',
  'cắm đầu vào học một cách chăm chỉ, nghiêm túc',
  'to begin studying with serious determination',
  'I need to hit the books tonight because the IELTS test is in two weeks.',
  'Tối nay tôi phải cắm đầu vào học thôi vì chỉ còn 2 tuần nữa là thi IELTS rồi.',
  'idiom,study,ielts', 'imported'
);

-- ========================================================
-- VOCABULARY FOR DECK 2: IELTS - Friendship
-- ========================================================

-- 13. click with somebody
INSERT OR REPLACE INTO vocabulary (id, deck_id, language, word, normalized_word, pronunciation, meaning_vi, definition_en, example, example_translation, tags, source_type)
VALUES (
  'voc_fs_1', 'deck_ielts_friendship', 'en', 'click with somebody', 'click with somebody', '/klɪk wɪð ˈsʌm.bə.di/',
  'nhanh chóng ăn ý, trở thành bạn bè thân thiết',
  'to quickly become friendly with someone and get along easily',
  'As soon as we started talking about books, we just clicked.',
  'Ngay khi bắt đầu nói về sách, chúng tôi đã rất ăn ý và nhanh chóng thân nhau.',
  'friendship,relationship,informal', 'imported'
);

-- 14. through thick and thin
INSERT OR REPLACE INTO vocabulary (id, deck_id, language, word, normalized_word, pronunciation, meaning_vi, definition_en, example, example_translation, tags, source_type)
VALUES (
  'voc_fs_2', 'deck_ielts_friendship', 'en', 'through thick and thin', 'through thick and thin', '/θruː θɪk ənd θɪn/',
  'cùng nhau vượt qua mọi thăng trầm, gian khó',
  'in spite of all problems, difficulties, or hardships',
  'A true friend is someone who stands by you through thick and thin.',
  'Người bạn thật sự là người luôn sát cánh bên bạn qua mọi thăng trầm gian khó.',
  'idiom,friendship,loyalty', 'imported'
);

-- 15. have someone''s best interest at heart
INSERT OR REPLACE INTO vocabulary (id, deck_id, language, word, normalized_word, pronunciation, meaning_vi, definition_en, example, example_translation, tags, source_type)
VALUES (
  'voc_fs_3', 'deck_ielts_friendship', 'en', 'have someone''s best interest at heart', 'have someone''s best interest at heart', '/hæv ˈsʌm.wʌnz best ˈɪn.trəst ət hɑːt/',
  'thật lòng muốn điều tốt đẹp nhất cho ai',
  'to be concerned about someone and want to do what is best for them',
  'Her advice was honest because she genuinely had my best interest at heart.',
  'Lời khuyên của cô ấy rất chân thành vì cô ấy thật lòng muốn điều tốt nhất cho tôi.',
  'idiom,friendship,care', 'imported'
);

-- 16. talk behind someone''s back
INSERT OR REPLACE INTO vocabulary (id, deck_id, language, word, normalized_word, pronunciation, meaning_vi, definition_en, example, example_translation, tags, source_type)
VALUES (
  'voc_fs_4', 'deck_ielts_friendship', 'en', 'talk behind someone''s back', 'talk behind someone''s back', '/tɔːk bɪˈhaɪnd ˈsʌm.wʌnz bæk/',
  'nói xấu sau lưng ai đó',
  'to speak critically or maliciously about someone when they are not present',
  'A loyal friend will discuss issues with you directly rather than talk behind your back.',
  'Một người bạn chân thành sẽ trao đổi thẳng thắn với bạn thay vì đi nói xấu sau lưng.',
  'relationship,character,idiom', 'imported'
);

-- 17. stand by someone
INSERT OR REPLACE INTO vocabulary (id, deck_id, language, word, normalized_word, pronunciation, meaning_vi, definition_en, example, example_translation, tags, source_type)
VALUES (
  'voc_fs_5', 'deck_ielts_friendship', 'en', 'stand by someone', 'stand by someone', '/stænd baɪ ˈsʌm.wʌn/',
  'luôn ở bên cạnh ủng hộ, sát cánh cùng ai',
  'to support or remain loyal to someone in a difficult situation',
  'Thank you for standing by me when things got overwhelming.',
  'Cảm ơn bạn đã luôn ở bên cạnh ủng hộ tôi khi mọi thứ trở nên quá sức.',
  'phrasal-verb,friendship,support', 'imported'
);

-- 18. give someone a hand
INSERT OR REPLACE INTO vocabulary (id, deck_id, language, word, normalized_word, pronunciation, meaning_vi, definition_en, example, example_translation, tags, source_type)
VALUES (
  'voc_fs_6', 'deck_ielts_friendship', 'en', 'give someone a hand', 'give someone a hand', '/ɡɪv ˈsʌm.wʌn ə hænd/',
  'giúp đỡ ai đó một tay',
  'to help someone with an activity or task',
  'Whenever I needed help moving house, my friends were right there to give me a hand.',
  'Bất cứ khi nào tôi cần chuyển nhà, bạn bè đều có mặt ngay để giúp một tay.',
  'idiom,helping,friendship', 'imported'
);

-- ========================================================
-- STUDY DIRECTIONS (en_to_vi active, vi_to_en locked)
-- ========================================================

-- Directions for Daily Routines
INSERT OR REPLACE INTO study_directions (id, vocabulary_id, direction, activation_status)
VALUES 
  ('dir_dr_1_base', 'voc_dr_1', 'en_to_vi', 'active'),
  ('dir_dr_1_rev', 'voc_dr_1', 'vi_to_en', 'locked'),
  ('dir_dr_2_base', 'voc_dr_2', 'en_to_vi', 'active'),
  ('dir_dr_2_rev', 'voc_dr_2', 'vi_to_en', 'locked'),
  ('dir_dr_3_base', 'voc_dr_3', 'en_to_vi', 'active'),
  ('dir_dr_3_rev', 'voc_dr_3', 'vi_to_en', 'locked'),
  ('dir_dr_4_base', 'voc_dr_4', 'en_to_vi', 'active'),
  ('dir_dr_4_rev', 'voc_dr_4', 'vi_to_en', 'locked'),
  ('dir_dr_5_base', 'voc_dr_5', 'en_to_vi', 'active'),
  ('dir_dr_5_rev', 'voc_dr_5', 'vi_to_en', 'locked'),
  ('dir_dr_6_base', 'voc_dr_6', 'en_to_vi', 'active'),
  ('dir_dr_6_rev', 'voc_dr_6', 'vi_to_en', 'locked'),
  ('dir_dr_7_base', 'voc_dr_7', 'en_to_vi', 'active'),
  ('dir_dr_7_rev', 'voc_dr_7', 'vi_to_en', 'locked'),
  ('dir_dr_8_base', 'voc_dr_8', 'en_to_vi', 'active'),
  ('dir_dr_8_rev', 'voc_dr_8', 'vi_to_en', 'locked'),
  ('dir_dr_9_base', 'voc_dr_9', 'en_to_vi', 'active'),
  ('dir_dr_9_rev', 'voc_dr_9', 'vi_to_en', 'locked'),
  ('dir_dr_10_base', 'voc_dr_10', 'en_to_vi', 'active'),
  ('dir_dr_10_rev', 'voc_dr_10', 'vi_to_en', 'locked'),
  ('dir_dr_11_base', 'voc_dr_11', 'en_to_vi', 'active'),
  ('dir_dr_11_rev', 'voc_dr_11', 'vi_to_en', 'locked'),
  ('dir_dr_12_base', 'voc_dr_12', 'en_to_vi', 'active'),
  ('dir_dr_12_rev', 'voc_dr_12', 'vi_to_en', 'locked');

-- Directions for Friendship
INSERT OR REPLACE INTO study_directions (id, vocabulary_id, direction, activation_status)
VALUES 
  ('dir_fs_1_base', 'voc_fs_1', 'en_to_vi', 'active'),
  ('dir_fs_1_rev', 'voc_fs_1', 'vi_to_en', 'locked'),
  ('dir_fs_2_base', 'voc_fs_2', 'en_to_vi', 'active'),
  ('dir_fs_2_rev', 'voc_fs_2', 'vi_to_en', 'locked'),
  ('dir_fs_3_base', 'voc_fs_3', 'en_to_vi', 'active'),
  ('dir_fs_3_rev', 'voc_fs_3', 'vi_to_en', 'locked'),
  ('dir_fs_4_base', 'voc_fs_4', 'en_to_vi', 'active'),
  ('dir_fs_4_rev', 'voc_fs_4', 'vi_to_en', 'locked'),
  ('dir_fs_5_base', 'voc_fs_5', 'en_to_vi', 'active'),
  ('dir_fs_5_rev', 'voc_fs_5', 'vi_to_en', 'locked'),
  ('dir_fs_6_base', 'voc_fs_6', 'en_to_vi', 'active'),
  ('dir_fs_6_rev', 'voc_fs_6', 'vi_to_en', 'locked');

-- Initialize user_card_progress for active directions
INSERT OR IGNORE INTO user_card_progress (user_id, study_direction_id, status, version)
SELECT 'ed0f5e54-8832-4b8b-91e7-c55628f69004', id, 'new', 1
FROM study_directions
WHERE activation_status = 'active';

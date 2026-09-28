# 07. Daily Planner

## Planner chạy riêng theo ngôn ngữ

```text
buildLanguageDailyPlan(language = en)
buildLanguageDailyPlan(language = ja)
```

Không có queue chung English + Japanese.

## Input

- Language được chọn.
- Active deck IDs của ngôn ngữ đó.
- Learning due.
- Overdue.
- Due today.
- New available.
- Daily settings.

## Priority

1. Learning due
2. Overdue
3. Due today
4. New

## Backlog control theo từng ngôn ngữ

- Due <= 30: dùng đủ new limit.
- Due 31-50: giảm new limit còn một nửa.
- Due > 50: dừng từ mới của chính ngôn ngữ đó.

Backlog English không làm dừng từ mới Japanese và ngược lại.

## Thời lượng dự kiến

Khởi tạo gợi ý:

- Review: 12 giây.
- Learning: 18 giây.
- New: 30 giây.

Sau khi có dữ liệu, thay bằng trung bình thực tế của user.

## Controlled shuffle

Chỉ xáo danh sách đã được chọn cho hôm nay, không xáo toàn bộ kho.

Quy tắc:

- Giữ priority group.
- Xen kẽ deck trong cùng group.
- `sibling_gap = 5`: cố gắng cách hai direction cùng vocabulary ít nhất 5 thẻ.
- `deck_gap = 1`: tránh cùng deck liền nhau nếu có deck khác.

## Pseudocode

```javascript
function buildLanguageDailyPlan({
  language,
  cards,
  activeDeckIds,
  settings,
  now
}) {
  const eligible = cards.filter(card =>
    card.language === language &&
    activeDeckIds.includes(card.deckId) &&
    card.status !== "suspended"
  )

  const groups = classifyCards(eligible, now)
  const dueCount =
    groups.learningDue.length +
    groups.overdue.length +
    groups.dueToday.length

  const newLimit = calculateNewLimit(
    dueCount,
    settings.maximumNewVocabulary
  )

  const newCards = distributeNewCardsAcrossDecks({
    cards: groups.newAvailable,
    activeDeckIds,
    totalLimit: newLimit
  })

  const scheduled = [
    ...sortByPriority(groups.learningDue),
    ...sortByPriority(groups.overdue),
    ...shuffleAcrossDecks(groups.dueToday),
    ...shuffleAcrossDecks(newCards)
  ]

  return createSessions({
    cards: scheduled,
    sessionSize: settings.sessionSize,
    siblingGap: 5,
    deckGap: 1
  })
}
```

## Again trong phiên

- Đưa vào relearning queue.
- Không lặp lại ngay lập tức.
- Đủ delay thì chèn gần cuối phiên hoặc phiên tiếp theo.
- Nếu chưa đủ delay, dashboard vẫn hiển thị thẻ learning cần ôn.

## Backlog vượt daily cap

- Không đổi due date để che backlog.
- Học learning và overdue trước.
- Hiện rõ số thẻ còn tồn.
- Dừng new cards nếu vượt ngưỡng.

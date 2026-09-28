# 06. Spaced repetition scheduler

## Hai tầng

1. Scheduler tính `due_at` cho từng study direction.
2. Daily Planner chọn thẻ cần học hôm nay và chia phiên.

## Rating

- Again: không nhớ hoặc sai.
- Hard: nhớ khó, chưa chắc chắn.
- Good: nhớ đúng ở mức bình thường.
- Easy: nhớ rất nhanh và chắc.

## Learning steps MVP

```text
New -> 10 phút -> 1 ngày -> Review
```

## Logic MVP

- Again: chuyển/retiếp tục learning, tăng lapse, due lại sau khoảng ngắn.
- Hard: tăng interval nhẹ.
- Good: tăng interval bình thường.
- Easy: tăng interval mạnh hơn.

Scheduler phải là service độc lập để sau này thay bằng FSRS.

## Progress phải ở mức study direction

Không dùng khóa chỉ `user_id + vocabulary_id`.

Dùng:

```text
user_id + study_direction_id
```

Vì người dùng có thể nhớ nghĩa nhưng quên cách đọc.

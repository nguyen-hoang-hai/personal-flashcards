# 08. UI and routes

## Routes

```text
/login                          # Đăng nhập
/select-language                # Language Hub (English / 日本語)

# --- Phân hệ English ---
/en/dashboard                   # Dashboard chính, chọn deck, chỉ số trong ngày
/en/study                       # Màn hình flashcard học tập (tối giản, tập trung)
/en/study/summary               # Màn hình tổng kết sau khi kết thúc phiên học
/en/decks                       # Danh sách deck, tạo/ẩn/lưu trữ deck
/en/vocabulary                  # Quản lý, tìm kiếm, sửa từ vựng dạng danh sách
/en/health                      # Data Health scanner (lọc lỗi, cảnh báo, sửa nhanh)
/en/import                      # Import CSV, xem trước (preview) & đối soát
/en/statistics                  # Đồ thị học tập, phân bố thẻ, thời gian ôn
/en/settings                    # Cài đặt daily limit, session size, gaps

# --- Phân hệ 日本語 ---
/ja/dashboard                   # Dashboard chính tiếng Nhật
/ja/study                       # Màn hình flashcard tiếng Nhật
/ja/study/summary               # Tổng kết phiên học tiếng Nhật
/ja/decks                       # Danh sách deck tiếng Nhật
/ja/vocabulary                  # Quản lý từ vựng, Kanji, Kana
/ja/health                      # Data Health tiếng Nhật
/ja/import                      # Import CSV tiếng Nhật
/ja/statistics                  # Đồ thị học tập tiếng Nhật
/ja/settings                    # Cài đặt tiếng Nhật

/account                        # Thông tin cá nhân, Export Full Backup, Đổi mật khẩu
```

## Language Hub

```text
+-------------------------------------------------------+
|                 Welcome back, Hai                     |
|           What do you want to study today?            |
|                                                       |
|  +------------------------+  +---------------------+  |
|  |        ENGLISH         |  |       日本語        |  |
|  |  Due: 18  |  New: 5    |  |  Due: 24 |  New: 5  |  |
|  |  Sessions today: 1     |  |  Sessions today: 0  |  |
|  +------------------------+  +---------------------+  |
+-------------------------------------------------------+
```

## Deck selector (Dashboard)

```text
English Decks
[x] Daily English                  8 due   5 new
[x] Electrical Engineering       10 due   0 new
[ ] Workplace English             6 paused due

[Quick Session: 10 cards]  [Standard: 20 cards]  [Clear all due]
```

## Study actions & UX

- Quick session: 10 cards (mặc định)
- Standard session: 20 cards
- Clear all due
- Resume session: Hiển thị banner khi có phiên học chưa kết thúc.
- Bottom Rating Bar:
  - 1: Again (< 10m) - Đỏ Rose
  - 2: Hard (1d) - Cam Amber
  - 3: Good (3d) - Xanh Primary
  - 4: Easy (7d) - Xanh Emerald
- Phím tắt: `Space` (Lật thẻ), `1`-`4` (Chọn mức nhớ), `Z` (Hoàn tác nếu bấm nhầm).

## Mobile Ergonomics

- Floating Quick Add button (FAB) ở góc dưới phải.
- Rating buttons đủ to, dễ chạm bằng một tay.
- Font chữ tiếng Nhật to, rõ nét (dùng Noto Sans JP).

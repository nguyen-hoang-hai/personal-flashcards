# 09. API design

## Auth
```text
POST /api/auth/login             # Đăng nhập (trả về Set-Cookie __Host-session)
POST /api/auth/logout            # Đăng xuất (xóa cookie và revoke session trong D1)
GET  /api/auth/me                # Lấy thông tin user hiện tại
POST /api/auth/password          # Đổi mật khẩu
```

## Language & Dashboard
```text
GET  /api/languages/:lang/dashboard    # Lấy tổng quan số due, new, session trong ngày
GET  /api/languages/:lang/settings     # Lấy cài đặt theo ngôn ngữ
PUT  /api/languages/:lang/settings     # Cập nhật cài đặt ngôn ngữ
GET  /api/languages/:lang/statistics   # Dữ liệu biểu đồ học tập
GET  /api/languages/:lang/health       # Quét Data Health (lỗi, cảnh báo)
```

## Decks
```text
GET    /api/decks                      # Lấy danh sách deck theo ngôn ngữ
POST   /api/decks                      # Tạo deck mới
GET    /api/decks/:deckId              # Chi tiết deck
PUT    /api/decks/:deckId              # Cập nhật thông tin deck
DELETE /api/decks/:deckId              # Xóa deck
PUT    /api/decks/:deckId/settings     # Cập nhật study_status (active, hidden, archived)
PUT    /api/decks/selection            # Lưu danh sách deck được chọn để học
```

## Vocabulary & Directions
```text
GET    /api/vocabulary                 # Tìm kiếm, lọc từ vựng theo deck, tag, lỗi
POST   /api/vocabulary                 # Thêm từ vựng mới (Quick/Detailed Add)
GET    /api/vocabulary/:id             # Chi tiết từ vựng và các study directions
PUT    /api/vocabulary/:id             # Cập nhật từ vựng
DELETE /api/vocabulary/:id             # Xóa từ vựng
PUT    /api/vocabulary/:id/directions/:dirId/status # Bật/tắt/kích hoạt chiều học
POST   /api/import/csv                 # Upload và import CSV
GET    /api/export/csv                 # Export CSV theo deck/ngôn ngữ
GET    /api/export/backup              # Export full backup JSON
POST   /api/restore/backup             # Khôi phục từ backup JSON
```

## Study Sessions & Review
```text
GET    /api/study/session/active       # Kiểm tra xem có session nào dở dang không
POST   /api/study/session/start        # Tạo session mới (kích hoạt Daily Planner)
GET    /api/study/session/:id          # Lấy danh sách thẻ trong session
POST   /api/study/session/:id/answer   # Trả lời 1 thẻ kèm version (kiểm tra xung đột OCC)
POST   /api/study/session/:id/complete # Hoàn thành session
POST   /api/study/session/:id/abandon  # Hủy bỏ session dở dang
```

### Review answer payload
```json
{
  "studyDirectionId": "dir_123",
  "rating": "good",
  "expectedProgressVersion": 8,
  "responseTimeMs": 4200
}
```

### Review answer response (Success)
```json
{
  "status": "success",
  "newVersion": 9,
  "nextIntervalDays": 3.0,
  "dueAt": "2026-10-01T10:00:00Z",
  "progressiveUnlockAvailable": null
}
```

### Review answer response (Conflict 409)
```json
{
  "status": "conflict",
  "message": "Thẻ này đã được cập nhật từ thiết bị khác",
  "latestProgress": {
    "version": 9,
    "status": "review",
    "dueAt": "2026-10-01T10:00:00Z"
  }
}
```

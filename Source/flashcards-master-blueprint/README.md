# Personal Flashcards Complete Blueprint

Blueprint tổng hợp cho website flashcard cá nhân học **English** và **日本語**.

## Quyết định thiết kế đã chốt

- Một GitHub repository.
- Một ứng dụng Cloudflare.
- Một tài khoản cá nhân, dùng được trên máy tính và điện thoại.
- Cookie duy trì đăng nhập. Mở lại website sẽ bỏ qua bước login nếu session còn hợp lệ.
- Sau đăng nhập luôn hiện Language Hub để chọn English hoặc 日本語.
- English và Japanese là hai không gian học độc lập.
- Mỗi ngôn ngữ có deck, queue, backlog, giới hạn từ mới, settings và statistics riêng.
- Trong một ngôn ngữ, người dùng chọn một hoặc nhiều deck để học.
- Chọn nhiều deck thì hệ thống trộn thẻ giữa các deck đã chọn.
- Ẩn deck thì deck không xuất hiện trong queue và dashboard chính, nhưng dữ liệu và tiến độ vẫn được giữ.
- Code và seed CSV lưu trên GitHub.
- Vocabulary, study directions, progress, settings và review logs lưu trong Cloudflare D1.
- Google Sheets chỉ dùng để chuẩn bị bộ từ chuẩn, sau đó xuất CSV.
- Quick Add, Detailed Add, CSV Import và Export Backup.
- Một vocabulary gốc có thể tạo nhiều study direction, mỗi direction có lịch ôn riêng.
- Scheduler quyết định ngày ôn từng thẻ. Daily Planner chọn thẻ hôm nay và chia thành các phiên.

## Cấu trúc

```text
flashcards-complete-blueprint/
├── README.md
├── docs/
│   ├── 01-product-requirements.md
│   ├── 02-system-architecture.md
│   ├── 03-auth-and-language-hub.md
│   ├── 04-deck-selection.md
│   ├── 05-vocabulary-management.md
│   ├── 06-spaced-repetition.md
│   ├── 07-daily-planner.md
│   ├── 08-ui-routes.md
│   ├── 09-api-design.md
│   ├── 10-security-backup.md
│   └── 11-implementation-plan.md
├── database/
│   └── schema.sql
├── config/
│   └── planner-defaults.yaml
├── seed-data/
│   ├── english/sample-english.csv
│   └── japanese/sample-japanese.csv
└── templates/
    ├── english-import-template.csv
    └── japanese-import-template.csv
```

## Luồng dữ liệu

```text
Google Sheets -> CSV chuẩn -> GitHub -> seed một lần -> D1
Website Add/Import -> Worker API -> D1
Review answer -> Scheduler -> Progress + Review Log trong D1
Git push thay đổi code -> Cloudflare build/deploy
```

## Công nghệ đề xuất

- React + Vite + TypeScript
- React Router
- Tailwind CSS
- Cloudflare Worker
- Cloudflare D1
- Zod
- React Hook Form
- Papa Parse
- date-fns
- Lucide React
- Vitest + Playwright

## Thứ tự đọc

1. `docs/01-product-requirements.md`
2. `docs/02-system-architecture.md`
3. `docs/04-deck-selection.md`
4. `docs/06-spaced-repetition.md`
5. `docs/07-daily-planner.md`
6. `database/schema.sql`
7. `docs/11-implementation-plan.md`

## Bổ sung phiên bản này

- Data Health theo language/deck.
- Statistics bằng đồ thị, không tạo áp lực.
- Lưu và tiếp tục study session.
- Tránh học trùng trên hai thiết bị bằng progress version.
- Mở khóa chiều đảo dần theo tiến độ.
- Daily new limit tính theo vocabulary, không theo số cards.
- Thư mục `schematics/` có SVG để mở xem trực tiếp, ngoài Mermaid trong Markdown.

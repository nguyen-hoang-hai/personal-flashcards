# 02. System architecture

```mermaid
flowchart LR
  U[User] --> CF[Cloudflare App]
  CF --> UI[React + Vite]
  UI --> W[Worker API]
  W --> AUTH[Session Validation]
  W --> D1[(Cloudflare D1)]
  D1 --> A[Users and Sessions]
  D1 --> B[Decks and Vocabulary]
  D1 --> C[Study Directions]
  D1 --> D[Progress and Review Logs]
  DEV[Developer] --> GH[GitHub]
  GH --> CF
  GS[Google Sheets] --> CSV[Seed CSV]
  CSV --> GH
  CSV --> D1
```

## GitHub lưu

- Mã nguồn.
- Migration SQL.
- Seed CSV.
- Tài liệu thiết kế.

## D1 lưu

- Users và sessions.
- Decks và trạng thái deck theo user.
- Vocabulary.
- Study directions.
- Progress riêng cho từng study direction.
- Review logs.
- Settings theo ngôn ngữ.

## Cấu trúc source đề xuất

```text
src/
├── app/
├── modules/
│   ├── language-hub/
│   ├── english/
│   └── japanese/
└── shared/

worker/
├── routes/
├── services/
│   ├── auth/
│   ├── scheduler/
│   ├── planner/
│   └── import/
└── index.ts
```

# 03. Authentication and Language Hub

```mermaid
flowchart TD
  A[Open website] --> B{Valid session?}
  B -->|No| C[Login]
  C --> D[Create session in D1]
  D --> E[Set secure cookie]
  B -->|Yes| F[Language Hub]
  E --> F
  F --> EN[English]
  F --> JA[日本語]
```

Cookie đề xuất:

```http
Set-Cookie: __Host-session=<random-token>; Path=/; Max-Age=2592000; Secure; HttpOnly; SameSite=Lax
```

- Mỗi thiết bị có session riêng.
- Dữ liệu vẫn đồng bộ vì nằm trong D1.
- Sau login luôn hiện Language Hub.
- Chọn English thì chỉ dùng queue English.
- Chọn Japanese thì chỉ dùng queue Japanese.

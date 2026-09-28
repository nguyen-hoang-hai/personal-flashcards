# 10. Security and backup

## Security

- Secure, HttpOnly, SameSite cookie.
- API lấy user từ session, không tin `user_id` từ client.
- Parameterized SQL.
- Validate body bằng schema.
- Giới hạn kích thước và số dòng CSV.
- Secret nằm trong Cloudflare environment/secrets.
- Không commit token, OAuth secret hoặc backup cá nhân.

## Backup

- Export English CSV.
- Export Japanese CSV.
- Export full JSON.
- Restore JSON có schema version.

JSON backup nên có:

- Decks.
- User deck settings.
- Vocabulary.
- Study directions.
- Progress.
- Review logs, tùy chọn.
- Language settings.

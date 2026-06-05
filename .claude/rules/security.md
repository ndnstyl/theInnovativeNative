---
paths:
  - "src/**"
  - "**/*auth*"
  - "**/*supabase*"
  - "**/*api*"
  - "**/*.env*"
  - "scripts/**"
description: Security rules — secrets, RLS, audit requirements
---

# Security Rules

1. **NEVER print API keys, tokens, or passwords in console output.** Use env vars.
2. **TDD audit is mandatory** before every n8n deployment — schema-level checks.
3. **Always check for existing data** before database migrations (Hostinger, n8n, Supabase).
4. **Supabase RLS** must be enabled on all tables with user data.
5. **Static export constraints**: Supabase JS auth module hangs on static export. Use direct REST fetch with localStorage tokens.

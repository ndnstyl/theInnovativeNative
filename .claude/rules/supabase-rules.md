---
paths:
  - "**/*supabase*"
  - "src/lib/**"
  - "src/pages/**"
description: Supabase patterns for static export architecture
---

# Supabase Rules

1. **Auth module hangs on static export.** Use direct REST fetch with localStorage tokens for all critical operations.
2. **REST fetch pattern**: Use `@supabase/supabase-js` client for data queries, but handle auth state manually via localStorage.
3. **RLS must be enabled** on all tables with user data.
4. **Community Supabase**: `etglkowtxfhrszxnkrcq` (us-east-1)
5. **LFR Supabase** (separate): `nvvifollmlsarrmdzfkk`
6. **OB1 Supabase** (separate): `mihnndoucbaftcwujstz`

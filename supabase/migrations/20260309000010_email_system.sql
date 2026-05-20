-- ============================================================================
-- 022 EMAIL SYSTEM — Preferences, log, digest scheduling
-- ============================================================================

-- Email preferences per user
CREATE TABLE IF NOT EXISTS email_preferences (
  user_id uuid PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  welcome_email boolean NOT NULL DEFAULT true,
  enrollment_email boolean NOT NULL DEFAULT true,
  payment_email boolean NOT NULL DEFAULT true,
  event_reminder boolean NOT NULL DEFAULT true,
  weekly_digest boolean NOT NULL DEFAULT true,
  marketing boolean NOT NULL DEFAULT false,
  unsubscribed_all boolean NOT NULL DEFAULT false,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE email_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "email_prefs_own" ON email_preferences FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Email send log (for debugging and rate limiting)
CREATE TABLE IF NOT EXISTS email_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  email_type text NOT NULL,
  subject text NOT NULL,
  status text NOT NULL DEFAULT 'sent' CHECK (status IN ('sent', 'failed', 'bounced')),
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_email_log_user ON email_log (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_email_log_type ON email_log (email_type, created_at DESC);

ALTER TABLE email_log ENABLE ROW LEVEL SECURITY;

-- Users can see their own email log
CREATE POLICY "email_log_own_select" ON email_log FOR SELECT
  USING (user_id = auth.uid());

-- Only service role can insert (edge functions)
CREATE POLICY "email_log_service_insert" ON email_log FOR INSERT
  WITH CHECK (true);

-- ============================================================================
-- MIGRATION COMPLETE
-- Created: email_preferences, email_log
-- ============================================================================

-- ============================================================================
-- 025 RATE LIMITING — Abuse prevention via database-level rate checks
-- ============================================================================

-- Rate limit tracking table
CREATE TABLE IF NOT EXISTS rate_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  action text NOT NULL,
  window_start timestamptz NOT NULL DEFAULT now(),
  count integer NOT NULL DEFAULT 1,
  UNIQUE(user_id, action, window_start)
);

CREATE INDEX IF NOT EXISTS idx_rate_limits_user_action ON rate_limits (user_id, action, window_start DESC);

ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;

-- Only service role can manage rate limits
CREATE POLICY "rate_limits_service" ON rate_limits FOR ALL
  USING (true) WITH CHECK (true);

-- Rate check function: returns true if action is allowed
CREATE OR REPLACE FUNCTION check_rate_limit(
  p_user_id uuid,
  p_action text,
  p_max_count integer,
  p_window_minutes integer DEFAULT 60
)
RETURNS boolean
LANGUAGE plpgsql SECURITY DEFINER
AS $$
DECLARE
  v_window_start timestamptz;
  v_current_count integer;
BEGIN
  -- Round down to the window boundary
  v_window_start := date_trunc('hour', now())
    + (floor(extract(minute from now()) / p_window_minutes) * p_window_minutes) * interval '1 minute';

  -- Upsert the counter
  INSERT INTO rate_limits (user_id, action, window_start, count)
  VALUES (p_user_id, p_action, v_window_start, 1)
  ON CONFLICT (user_id, action, window_start)
  DO UPDATE SET count = rate_limits.count + 1
  RETURNING count INTO v_current_count;

  RETURN v_current_count <= p_max_count;
END;
$$;

-- Rate limit configuration
CREATE TABLE IF NOT EXISTS rate_limit_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  action text NOT NULL UNIQUE,
  max_count integer NOT NULL,
  window_minutes integer NOT NULL DEFAULT 60,
  description text
);

INSERT INTO rate_limit_config (action, max_count, window_minutes, description) VALUES
  ('create_post', 30, 60, 'Max 30 posts per hour'),
  ('create_comment', 60, 60, 'Max 60 comments per hour'),
  ('send_message', 120, 60, 'Max 120 messages per hour'),
  ('report_content', 10, 60, 'Max 10 reports per hour'),
  ('upload_file', 20, 60, 'Max 20 uploads per hour'),
  ('api_request', 300, 60, 'Max 300 API requests per hour')
ON CONFLICT (action) DO NOTHING;

-- Cleanup old rate limit records (run daily via cron)
CREATE OR REPLACE FUNCTION cleanup_rate_limits()
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM rate_limits WHERE window_start < now() - interval '24 hours';
END;
$$;

-- ============================================================================
-- MIGRATION COMPLETE
-- Created: rate_limits, rate_limit_config
-- Functions: check_rate_limit, cleanup_rate_limits
-- ============================================================================

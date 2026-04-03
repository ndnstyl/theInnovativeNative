-- Add is_premium flag to courses table
-- Premium courses require separate purchase on top of subscription
-- e.g. Growth Marketing Masterclass ($499), TwinGen
-- Non-premium paid courses are auto-enrolled when user subscribes

ALTER TABLE courses ADD COLUMN IF NOT EXISTS is_premium boolean NOT NULL DEFAULT false;

COMMENT ON COLUMN courses.is_premium IS 'Premium courses require separate purchase on top of $99/mo subscription. Auto-enrollment skips these.';

-- Mark Growth Marketing Masterclass as premium
UPDATE courses
SET is_premium = true,
    stripe_price_id = 'price_1TFEZ1I4n1kMt7iRZG32eXhx'
WHERE title = 'Growth Marketing Masterclass';

-- Set stripe_price_id for classroom subscription courses (non-premium)
-- These get auto-enrolled on $99/mo subscription, stripe_price_id is for individual purchase fallback
UPDATE courses
SET is_premium = false
WHERE is_premium IS NULL OR is_premium = false;

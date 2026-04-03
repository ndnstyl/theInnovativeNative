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
UPDATE courses
SET is_premium = false
WHERE is_premium IS NULL OR is_premium = false;

-- Set thumbnail_url for all courses (local paths served from static export)
UPDATE courses SET thumbnail_url = '/images/classroom/course-brand-vibe.jpg' WHERE title = 'Brand Vibe - START HERE';
UPDATE courses SET thumbnail_url = '/images/classroom/course-chaos-to-clarity.jpg' WHERE title LIKE 'Chaos to Clarity%';
UPDATE courses SET thumbnail_url = '/images/classroom/course-n8n-templates.jpg' WHERE title = 'n8n Templates';
UPDATE courses SET thumbnail_url = '/images/classroom/course-glossary.jpg' WHERE title LIKE '%Glossary%';
UPDATE courses SET thumbnail_url = '/images/classroom/course-resources.jpg' WHERE title LIKE '%YouTube%' OR title LIKE '%Youtube%';
UPDATE courses SET thumbnail_url = '/images/classroom/course-templates.jpg' WHERE title LIKE '%AI Fluency%';
UPDATE courses SET thumbnail_url = '/images/classroom/course-n8n-templates.jpg' WHERE title LIKE '%Growth Marketing%';
UPDATE courses SET thumbnail_url = '/images/twingen/cover.png' WHERE title = 'TwinGen';

-- ============================================================================
-- SEED DATA — The Innovative Native Community Platform
-- Spec: 024-database-schema (FR-028) | Date: 2026-03-09
-- Default community, categories, levels, point_config
-- All inserts use ON CONFLICT DO NOTHING for idempotency
-- ============================================================================

-- ============================================================================
-- 1. Default Community
-- ============================================================================

INSERT INTO communities (id, name, slug, description, privacy, pricing_model)
VALUES (
  'a0000000-0000-0000-0000-000000000001',
  'The Innovative Native',
  'the-innovative-native',
  'AI systems that replace your fragmented SaaS stack. Education + deployable systems + community ecosystem.',
  'public',
  'freemium'
)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- 2. Default Categories (FR-028)
-- ============================================================================

INSERT INTO categories (id, community_id, name, description, display_order)
VALUES
  ('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'General', 'General discussion', 0),
  ('b0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'Wins', 'Share your wins and milestones', 1),
  ('b0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'Questions', 'Ask questions and get help', 2),
  ('b0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001', 'Resources', 'Share tools, templates, and resources', 3)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 3. Default Levels (9 levels matching Skool thresholds — FR-010 from spec 014)
-- ============================================================================

INSERT INTO levels (id, community_id, level_number, name, min_points)
VALUES
  ('c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 1, 'Newcomer', 0),
  ('c0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 2, 'Contributor', 15),
  ('c0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 3, 'Regular', 60),
  ('c0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001', 4, 'Established', 165),
  ('c0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000001', 5, 'Veteran', 405),
  ('c0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000001', 6, 'Expert', 945),
  ('c0000000-0000-0000-0000-000000000007', 'a0000000-0000-0000-0000-000000000001', 7, 'Master', 2205),
  ('c0000000-0000-0000-0000-000000000008', 'a0000000-0000-0000-0000-000000000001', 8, 'Grandmaster', 8505),
  ('c0000000-0000-0000-0000-000000000009', 'a0000000-0000-0000-0000-000000000001', 9, 'Legend', 33015)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 4. Default Point Config (per spec 014 FR-001 through FR-006)
-- ============================================================================

INSERT INTO point_config (id, community_id, action, points)
VALUES
  ('d0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'like_received', 1),
  ('d0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'post_created', 2),
  ('d0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'comment_created', 1),
  ('d0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001', 'lesson_completed', 5),
  ('d0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000001', 'course_completed', 10),
  ('d0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000001', 'event_attended', 3)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 5. Default Courses (from Skool migration inventory — spec 012)
-- Free courses are created directly. Paid courses need Stripe Price IDs.
-- ============================================================================

INSERT INTO courses (id, community_id, title, description, is_free, published, display_order)
VALUES
  -- Priority 1: Brand Vibe (FREE, introductory)
  ('e0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001',
   'Brand Vibe - START HERE', 'Introductory course — your first steps into AI-powered business systems.', true, true, 1),

  -- Priority 2: Chaos to Clarity (PAID $99/mo — stripe_price_id set after Stripe product creation)
  ('e0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001',
   'Chaos to Clarity: AI-First Systems', 'Transform your scattered workflows into a unified AI system. 3 modules, 16 lessons.', false, false, 2),

  -- Priority 3: n8n Templates (FREE)
  ('e0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001',
   'n8n Templates', 'Ready-to-deploy n8n workflow templates for common business automations.', true, true, 3),

  -- Priority 4: Glossary & Resources (FREE)
  ('e0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001',
   'Glossary & Resources', 'AI, automation, and business systems glossary with curated resources.', true, true, 4),

  -- Priority 5: YouTube Workflows (FREE)
  ('e0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000001',
   'YouTube Workflows', 'Video production and distribution workflows for content creators.', true, true, 5),

  -- Priority 6: AI Fluency Weekend Build (PAID $99/mo)
  ('e0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000001',
   'AI Fluency Weekend Build', 'Youth AI literacy — build real AI systems in a weekend.', false, false, 6),

  -- Priority 7: Growth Marketing Masterclass (PAID $99/mo — needs content refresh)
  ('e0000000-0000-0000-0000-000000000007', 'a0000000-0000-0000-0000-000000000001',
   'Growth Marketing Masterclass', 'Data-driven marketing systems built on AI automation.', false, false, 7)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- SEED COMPLETE
-- Community: 1 | Categories: 4 | Levels: 9 | Point Config: 6 | Courses: 7
-- ============================================================================

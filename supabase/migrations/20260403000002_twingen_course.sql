-- ============================================================================
-- TwinGen Course + 6 Modules
-- Premium course (requires separate purchase on top of $99/mo subscription)
-- Stripe Price ID: price_1T2ZsdI4n1kMt7iRG9urq2tr
-- ============================================================================

-- Insert TwinGen course (premium = true, requires separate purchase)
INSERT INTO courses (id, community_id, title, description, is_free, is_premium, stripe_price_id, published, display_order, thumbnail_url)
VALUES (
  'e0000000-0000-0000-0000-000000000008',
  'a0000000-0000-0000-0000-000000000001',
  'TwinGen',
  'Build your own AI influencer from scratch. The complete automation system — from character creation to published videos. No coding required.',
  false,
  true,
  'price_1T2ZsdI4n1kMt7iRG9urq2tr',
  true,
  8,
  '/images/twingen/cover.png'
)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 6 Modules (matching the product spec)
-- ============================================================================

-- Module 1: Brand Foundation
INSERT INTO modules (id, course_id, title, display_order)
VALUES (
  'f0000000-0000-0000-0001-000000000001',
  'e0000000-0000-0000-0000-000000000008',
  'Brand Foundation',
  1
)
ON CONFLICT (id) DO NOTHING;

-- Module 2: Mission Control
INSERT INTO modules (id, course_id, title, display_order)
VALUES (
  'f0000000-0000-0000-0001-000000000002',
  'e0000000-0000-0000-0000-000000000008',
  'Mission Control',
  2
)
ON CONFLICT (id) DO NOTHING;

-- Module 3: AI Image & Video Generation
INSERT INTO modules (id, course_id, title, display_order)
VALUES (
  'f0000000-0000-0000-0001-000000000003',
  'e0000000-0000-0000-0000-000000000008',
  'AI Image & Video Generation',
  3
)
ON CONFLICT (id) DO NOTHING;

-- Module 4: Automation Engine
INSERT INTO modules (id, course_id, title, display_order)
VALUES (
  'f0000000-0000-0000-0001-000000000004',
  'e0000000-0000-0000-0000-000000000008',
  'Automation Engine',
  4
)
ON CONFLICT (id) DO NOTHING;

-- Module 5: Video Assembly
INSERT INTO modules (id, course_id, title, display_order)
VALUES (
  'f0000000-0000-0000-0001-000000000005',
  'e0000000-0000-0000-0000-000000000008',
  'Video Assembly',
  5
)
ON CONFLICT (id) DO NOTHING;

-- Module 6: Content Strategy & Scaling
INSERT INTO modules (id, course_id, title, display_order)
VALUES (
  'f0000000-0000-0000-0001-000000000006',
  'e0000000-0000-0000-0000-000000000008',
  'Content Strategy & Scaling',
  6
)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- Lessons for each module (skeleton — titles from product spec deliverables)
-- ============================================================================

-- Module 1: Brand Foundation (5 lessons)
INSERT INTO lessons (id, module_id, title, display_order) VALUES
  ('70000000-0000-0001-0001-000000000001', 'f0000000-0000-0000-0001-000000000001', 'Brand System Template', 1),
  ('70000000-0000-0001-0001-000000000002', 'f0000000-0000-0000-0001-000000000001', 'Character Sheet Generator', 2),
  ('70000000-0000-0001-0001-000000000003', 'f0000000-0000-0000-0001-000000000001', '60+ Gemini Prompt Templates', 3),
  ('70000000-0000-0001-0001-000000000004', 'f0000000-0000-0000-0001-000000000001', 'Tone of Voice Builder', 4),
  ('70000000-0000-0001-0001-000000000005', 'f0000000-0000-0000-0001-000000000001', 'Visual Identity Lockdown Checklist', 5)
ON CONFLICT (id) DO NOTHING;

-- Module 2: Mission Control (4 lessons)
INSERT INTO lessons (id, module_id, title, display_order) VALUES
  ('70000000-0000-0001-0002-000000000001', 'f0000000-0000-0000-0001-000000000002', 'Airtable Base Template', 1),
  ('70000000-0000-0001-0002-000000000002', 'f0000000-0000-0000-0001-000000000002', 'Field-by-Field Setup Guide', 2),
  ('70000000-0000-0001-0002-000000000003', 'f0000000-0000-0000-0001-000000000002', 'Pipeline State Machine', 3),
  ('70000000-0000-0001-0002-000000000004', 'f0000000-0000-0000-0001-000000000002', 'Table Schema Reference', 4)
ON CONFLICT (id) DO NOTHING;

-- Module 3: AI Image & Video Generation (6 lessons)
INSERT INTO lessons (id, module_id, title, display_order) VALUES
  ('70000000-0000-0001-0003-000000000001', 'f0000000-0000-0000-0001-000000000003', 'Script Generator Workflow (WF-003)', 1),
  ('70000000-0000-0001-0003-000000000002', 'f0000000-0000-0000-0001-000000000003', 'Asset Generator Workflow (WF-004)', 2),
  ('70000000-0000-0001-0003-000000000003', 'f0000000-0000-0000-0001-000000000003', 'Gemini API Setup Guide', 3),
  ('70000000-0000-0001-0003-000000000004', 'f0000000-0000-0000-0001-000000000003', 'Quality Scoring Rubric', 4),
  ('70000000-0000-0001-0003-000000000005', 'f0000000-0000-0000-0001-000000000003', 'Character Consistency Guide', 5),
  ('70000000-0000-0001-0003-000000000006', 'f0000000-0000-0000-0001-000000000003', 'Google Drive Asset Structure', 6)
ON CONFLICT (id) DO NOTHING;

-- Module 4: Automation Engine (6 lessons)
INSERT INTO lessons (id, module_id, title, display_order) VALUES
  ('70000000-0000-0001-0004-000000000001', 'f0000000-0000-0000-0001-000000000004', 'Master Orchestrator Workflow (WF-001)', 1),
  ('70000000-0000-0001-0004-000000000002', 'f0000000-0000-0000-0001-000000000004', 'n8n Setup Guide (Self-Hosted)', 2),
  ('70000000-0000-0001-0004-000000000003', 'f0000000-0000-0000-0001-000000000004', 'n8n Setup Guide (Cloud)', 3),
  ('70000000-0000-0001-0004-000000000004', 'f0000000-0000-0000-0001-000000000004', 'Webhook Integration Guide', 4),
  ('70000000-0000-0001-0004-000000000005', 'f0000000-0000-0000-0001-000000000004', 'Error Handling Patterns', 5),
  ('70000000-0000-0001-0004-000000000006', 'f0000000-0000-0000-0001-000000000004', 'Credential Reference', 6)
ON CONFLICT (id) DO NOTHING;

-- Module 5: Video Assembly (6 lessons)
INSERT INTO lessons (id, module_id, title, display_order) VALUES
  ('70000000-0000-0001-0005-000000000001', 'f0000000-0000-0000-0001-000000000005', 'FFMPEG Assembler Workflow (WF-006)', 1),
  ('70000000-0000-0001-0005-000000000002', 'f0000000-0000-0000-0001-000000000005', 'FFMPEG Command Recipe Library', 2),
  ('70000000-0000-0001-0005-000000000003', 'f0000000-0000-0000-0001-000000000005', 'Output Spec Reference', 3),
  ('70000000-0000-0001-0005-000000000004', 'f0000000-0000-0000-0001-000000000005', 'Text Overlay System', 4),
  ('70000000-0000-0001-0005-000000000005', 'f0000000-0000-0000-0001-000000000005', 'Music Integration Guide', 5),
  ('70000000-0000-0001-0005-000000000006', 'f0000000-0000-0000-0001-000000000005', 'Platform Export Presets', 6)
ON CONFLICT (id) DO NOTHING;

-- Module 6: Content Strategy & Scaling (6 lessons)
INSERT INTO lessons (id, module_id, title, display_order) VALUES
  ('70000000-0000-0001-0006-000000000001', 'f0000000-0000-0000-0001-000000000006', 'Content Strategy Playbook', 1),
  ('70000000-0000-0001-0006-000000000002', 'f0000000-0000-0000-0001-000000000006', '20+ Hook Formulas', 2),
  ('70000000-0000-0001-0006-000000000003', 'f0000000-0000-0000-0001-000000000006', 'Video Structure Templates', 3),
  ('70000000-0000-0001-0006-000000000004', 'f0000000-0000-0000-0001-000000000006', 'Content Framing Rules', 4),
  ('70000000-0000-0001-0006-000000000005', 'f0000000-0000-0000-0001-000000000006', 'Niche Adaptation Guide', 5),
  ('70000000-0000-0001-0006-000000000006', 'f0000000-0000-0000-0001-000000000006', 'Trend Automation Roadmap', 6)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- SEED COMPLETE: TwinGen — 1 course, 6 modules, 33 lessons
-- ============================================================================

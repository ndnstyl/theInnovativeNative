---
paths:
  - "projects/website/**"
  - "src/**"
description: Core tech stack reference — loaded when touching website code
---

# Tech Stack

## Website
- TypeScript 5.2.2 / React 18.2.0 + Next.js 13.4.19 (Pages Router, `output: 'export'` — static HTML only)
- SCSS 1.66.1 + Bootstrap 5.3.1 + GSAP 3.12.2
- Hosting: hosting.com shared plan (LiteSpeed, NOT Hostinger)
- Supabase JS client (REST fetch pattern for auth — NOT auth-helpers)

## Community Platform (Supabase)
- Project: etglkowtxfhrszxnkrcq (us-east-1, Pro plan)
- Tables: courses, modules, lessons, lesson_progress, enrollments, posts, post_comments, post_likes, profiles, community_members, reactions, categories
- Tiptap rich text editor (installed)
- @supabase/supabase-js (NOT auth-helpers for static export)

## Content Production
- Remotion 4.0 (video), ffmpeg 8.0 (VO cleanup + SFX), Whisper (transcription)
- Pexels API (stock), Pixabay API (supplementary stock + SFX)
- ElevenLabs Voice: Kal Jones `68RUZBDjLe2YBQvv8zFx`
- n8n (IG auto-posting), Airtable (Publishing Calendar)

## Integrations
- Airtable MCP, n8n MCP, Supabase MCP, Google Drive MCP
- Stripe (payments), Brevo (email), Slack (notifications)

-- ============================================================================
-- 023 STORAGE SYSTEM — Bucket creation and RLS policies
-- ============================================================================

-- Create storage buckets (idempotent via INSERT ... ON CONFLICT)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('avatars', 'avatars', true, 5242880,
   ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  ('post-attachments', 'post-attachments', true, 26214400,
   ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf', 'application/zip', 'text/csv']),
  ('course-content', 'course-content', false, 104857600,
   ARRAY['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'application/pdf']),
  ('event-covers', 'event-covers', true, 5242880,
   ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('community-assets', 'community-assets', true, 10485760,
   ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'])
ON CONFLICT (id) DO UPDATE SET
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Avatars: users can upload their own, anyone can view
CREATE POLICY "avatars_public_read" ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');
CREATE POLICY "avatars_user_upload" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "avatars_user_update" ON storage.objects FOR UPDATE
  USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "avatars_user_delete" ON storage.objects FOR DELETE
  USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Post attachments: authenticated upload, public read
CREATE POLICY "post_attachments_read" ON storage.objects FOR SELECT
  USING (bucket_id = 'post-attachments');
CREATE POLICY "post_attachments_upload" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'post-attachments' AND auth.role() = 'authenticated');

-- Course content: enrolled users read, admin upload
CREATE POLICY "course_content_read" ON storage.objects FOR SELECT
  USING (bucket_id = 'course-content' AND auth.role() = 'authenticated');
CREATE POLICY "course_content_admin_upload" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'course-content' AND EXISTS (
    SELECT 1 FROM community_members
    WHERE member_id = auth.uid() AND role IN ('admin', 'owner')
  ));

-- Event covers: public read, admin upload
CREATE POLICY "event_covers_read" ON storage.objects FOR SELECT
  USING (bucket_id = 'event-covers');
CREATE POLICY "event_covers_upload" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'event-covers' AND EXISTS (
    SELECT 1 FROM community_members
    WHERE member_id = auth.uid() AND role IN ('admin', 'owner', 'moderator')
  ));

-- Community assets: public read, admin upload
CREATE POLICY "community_assets_read" ON storage.objects FOR SELECT
  USING (bucket_id = 'community-assets');
CREATE POLICY "community_assets_upload" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'community-assets' AND EXISTS (
    SELECT 1 FROM community_members
    WHERE member_id = auth.uid() AND role IN ('admin', 'owner')
  ));

-- ============================================================================
-- MIGRATION COMPLETE
-- Buckets: avatars, post-attachments, course-content, event-covers, community-assets
-- RLS: User-scoped uploads, public reads, admin-only for course/community assets
-- ============================================================================

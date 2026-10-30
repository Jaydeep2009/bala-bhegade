-- ============================================================
-- Bala Bhegade Website - Storage Policies
-- Migration: 003_storage
-- ============================================================

-- Create storage bucket for public media uploads
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'media',
  'media',
  true,
  10485760,  -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
);

-- ============================================================
-- Storage policies
-- Public: read all files in media bucket
-- Admin only: upload, update, delete files
-- ============================================================

-- Anyone can view public media files
CREATE POLICY "Public media read access"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'media');

-- Only admins can upload files
CREATE POLICY "Admin media upload"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'media'
    AND EXISTS (
      SELECT 1 FROM admin_profiles
      WHERE user_id = auth.uid()
        AND is_active = true
    )
  );

-- Only admins can update files
CREATE POLICY "Admin media update"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'media'
    AND EXISTS (
      SELECT 1 FROM admin_profiles
      WHERE user_id = auth.uid()
        AND is_active = true
    )
  );

-- Only admins can delete files
CREATE POLICY "Admin media delete"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'media'
    AND EXISTS (
      SELECT 1 FROM admin_profiles
      WHERE user_id = auth.uid()
        AND is_active = true
    )
  );

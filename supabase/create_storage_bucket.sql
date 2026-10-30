-- ============================================================
-- SUPABASE STORAGE BUCKET CREATION & PERMISSIONS
-- Run this in your Supabase SQL Editor to enable photo uploads
-- ============================================================

-- 1. Create the public buckets 'images' and 'media'
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('images', 'images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']),
  ('media', 'media', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'])
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Clean up any existing policies
DROP POLICY IF EXISTS "Public storage read" ON storage.objects;
DROP POLICY IF EXISTS "Public storage upload" ON storage.objects;
DROP POLICY IF EXISTS "Public storage update" ON storage.objects;
DROP POLICY IF EXISTS "Public storage delete" ON storage.objects;
DROP POLICY IF EXISTS "Allow upload" ON storage.objects;
DROP POLICY IF EXISTS "Allow update" ON storage.objects;
DROP POLICY IF EXISTS "Allow delete" ON storage.objects;
DROP POLICY IF EXISTS "Admin media upload" ON storage.objects;
DROP POLICY IF EXISTS "Admin media update" ON storage.objects;
DROP POLICY IF EXISTS "Admin media delete" ON storage.objects;
DROP POLICY IF EXISTS "Public media read access" ON storage.objects;

-- 3. Create permissive access policies for the public buckets
CREATE POLICY "Public storage read" ON storage.objects 
  FOR SELECT USING (bucket_id IN ('images', 'media'));

CREATE POLICY "Public storage upload" ON storage.objects 
  FOR INSERT WITH CHECK (bucket_id IN ('images', 'media'));

CREATE POLICY "Public storage update" ON storage.objects 
  FOR UPDATE USING (bucket_id IN ('images', 'media'));

CREATE POLICY "Public storage delete" ON storage.objects 
  FOR DELETE USING (bucket_id IN ('images', 'media'));

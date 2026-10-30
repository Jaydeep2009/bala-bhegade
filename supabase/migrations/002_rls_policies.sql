-- ============================================================
-- Bala Bhegade Website - Row Level Security Policies
-- Migration: 002_rls_policies
-- ============================================================

-- ============================================================
-- Helper function: Check if user is an active admin
-- This is called within RLS policies to verify admin authorization.
-- An authenticated user is NOT automatically an admin.
-- ============================================================
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_profiles
    WHERE user_id = auth.uid()
      AND is_active = true
      AND role IN ('super_admin', 'admin', 'editor')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_super_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_profiles
    WHERE user_id = auth.uid()
      AND is_active = true
      AND role = 'super_admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- Enable RLS on all tables
-- ============================================================
ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE homepage_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_posts ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- Admin Profiles policies
-- Only super_admins can manage other admin profiles
-- Admins can read their own profile
-- ============================================================
CREATE POLICY "Admins can read own profile"
  ON admin_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Super admins can read all profiles"
  ON admin_profiles FOR SELECT
  USING (is_super_admin());

CREATE POLICY "Super admins can insert profiles"
  ON admin_profiles FOR INSERT
  WITH CHECK (is_super_admin());

CREATE POLICY "Super admins can update profiles"
  ON admin_profiles FOR UPDATE
  USING (is_super_admin());

CREATE POLICY "Super admins can delete profiles"
  ON admin_profiles FOR DELETE
  USING (is_super_admin());

-- ============================================================
-- Site Settings policies
-- Public: read all settings
-- Admin: full CRUD
-- ============================================================
CREATE POLICY "Anyone can read site settings"
  ON site_settings FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert site settings"
  ON site_settings FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update site settings"
  ON site_settings FOR UPDATE
  USING (is_admin());

CREATE POLICY "Admins can delete site settings"
  ON site_settings FOR DELETE
  USING (is_admin());

-- ============================================================
-- Homepage Sections policies
-- Public: read visible sections
-- Admin: full CRUD
-- ============================================================
CREATE POLICY "Anyone can read visible homepage sections"
  ON homepage_sections FOR SELECT
  USING (is_visible = true OR is_admin());

CREATE POLICY "Admins can insert homepage sections"
  ON homepage_sections FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update homepage sections"
  ON homepage_sections FOR UPDATE
  USING (is_admin());

CREATE POLICY "Admins can delete homepage sections"
  ON homepage_sections FOR DELETE
  USING (is_admin());

-- ============================================================
-- News Articles policies
-- Public: read only published articles
-- Admin: full CRUD
-- ============================================================
CREATE POLICY "Anyone can read published news"
  ON news_articles FOR SELECT
  USING (status = 'published' OR is_admin());

CREATE POLICY "Admins can insert news"
  ON news_articles FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update news"
  ON news_articles FOR UPDATE
  USING (is_admin());

CREATE POLICY "Admins can delete news"
  ON news_articles FOR DELETE
  USING (is_admin());

-- ============================================================
-- Gallery Items policies
-- Public: read visible items
-- Admin: full CRUD
-- ============================================================
CREATE POLICY "Anyone can read visible gallery items"
  ON gallery_items FOR SELECT
  USING (is_visible = true OR is_admin());

CREATE POLICY "Admins can insert gallery items"
  ON gallery_items FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update gallery items"
  ON gallery_items FOR UPDATE
  USING (is_admin());

CREATE POLICY "Admins can delete gallery items"
  ON gallery_items FOR DELETE
  USING (is_admin());

-- ============================================================
-- Events policies
-- Public: read all events (upcoming and past are public)
-- Admin: full CRUD
-- ============================================================
CREATE POLICY "Anyone can read events"
  ON events FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert events"
  ON events FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update events"
  ON events FOR UPDATE
  USING (is_admin());

CREATE POLICY "Admins can delete events"
  ON events FOR DELETE
  USING (is_admin());

-- ============================================================
-- Social Posts policies
-- Public: read featured posts
-- Admin: full CRUD
-- ============================================================
CREATE POLICY "Anyone can read featured social posts"
  ON social_posts FOR SELECT
  USING (is_featured = true OR is_admin());

CREATE POLICY "Admins can insert social posts"
  ON social_posts FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update social posts"
  ON social_posts FOR UPDATE
  USING (is_admin());

CREATE POLICY "Admins can delete social posts"
  ON social_posts FOR DELETE
  USING (is_admin());

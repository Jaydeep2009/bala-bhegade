-- ============================================================
-- BALA BHEGADE OFFICIAL WEBSITE - ALL-IN-ONE SUPABASE SETUP
-- Run this entire script in Supabase SQL Editor (Click 'Run')
-- It is idempotent (safe to run multiple times).
-- ============================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 2. Create Tables
-- ============================================================

-- 2.1 Admin Profiles
CREATE TABLE IF NOT EXISTS public.admin_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'editor' CHECK (role IN ('super_admin', 'admin', 'editor')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- 2.2 Site Settings
CREATE TABLE IF NOT EXISTS public.site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT NOT NULL,
  value JSONB NOT NULL DEFAULT '{}',
  language TEXT NOT NULL DEFAULT 'en' CHECK (language IN ('en', 'mr')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(key, language)
);

-- 2.3 Homepage Sections
CREATE TABLE IF NOT EXISTS public.homepage_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section_key TEXT NOT NULL UNIQUE,
  title_en TEXT NOT NULL DEFAULT '',
  title_mr TEXT NOT NULL DEFAULT '',
  subtitle_en TEXT,
  subtitle_mr TEXT,
  content_en TEXT,
  content_mr TEXT,
  image_url TEXT,
  image_focal_point TEXT DEFAULT 'center',
  cta_links JSONB,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  config JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2.4 News Articles
CREATE TABLE IF NOT EXISTS public.news_articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title_en TEXT NOT NULL,
  title_mr TEXT NOT NULL DEFAULT '',
  slug TEXT NOT NULL UNIQUE,
  summary_en TEXT,
  summary_mr TEXT,
  body_en TEXT,
  body_mr TEXT,
  cover_image_url TEXT,
  category TEXT NOT NULL DEFAULT 'general',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  published_at TIMESTAMPTZ,
  author TEXT,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_news_articles_slug ON public.news_articles(slug);
CREATE INDEX IF NOT EXISTS idx_news_articles_status ON public.news_articles(status);
CREATE INDEX IF NOT EXISTS idx_news_articles_published_at ON public.news_articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_articles_category ON public.news_articles(category);

-- 2.5 Gallery Items
CREATE TABLE IF NOT EXISTS public.gallery_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  image_url TEXT NOT NULL,
  thumbnail_url TEXT,
  caption_en TEXT,
  caption_mr TEXT,
  alt_text_en TEXT NOT NULL DEFAULT '',
  alt_text_mr TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT 'general',
  display_order INTEGER NOT NULL DEFAULT 0,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_gallery_items_category ON public.gallery_items(category);
CREATE INDEX IF NOT EXISTS idx_gallery_items_order ON public.gallery_items(display_order);

-- 2.6 Events
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title_en TEXT NOT NULL,
  title_mr TEXT NOT NULL DEFAULT '',
  description_en TEXT,
  description_mr TEXT,
  event_date DATE NOT NULL,
  event_time TIME,
  location_en TEXT,
  location_mr TEXT,
  image_url TEXT,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'past', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_events_date ON public.events(event_date DESC);
CREATE INDEX IF NOT EXISTS idx_events_status ON public.events(status);

-- 2.7 Social Posts
CREATE TABLE IF NOT EXISTS public.social_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  platform TEXT NOT NULL DEFAULT 'instagram' CHECK (platform IN ('instagram', 'twitter', 'facebook')),
  post_url TEXT NOT NULL,
  caption_en TEXT,
  caption_mr TEXT,
  thumbnail_url TEXT,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_social_posts_platform ON public.social_posts(platform);
CREATE INDEX IF NOT EXISTS idx_social_posts_order ON public.social_posts(display_order);

-- ============================================================
-- 3. Automatic Timestamps Function & Triggers
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_admin_profiles_updated_at ON public.admin_profiles;
CREATE TRIGGER update_admin_profiles_updated_at BEFORE UPDATE ON public.admin_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_site_settings_updated_at ON public.site_settings;
CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_homepage_sections_updated_at ON public.homepage_sections;
CREATE TRIGGER update_homepage_sections_updated_at BEFORE UPDATE ON public.homepage_sections FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_news_articles_updated_at ON public.news_articles;
CREATE TRIGGER update_news_articles_updated_at BEFORE UPDATE ON public.news_articles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_gallery_items_updated_at ON public.gallery_items;
CREATE TRIGGER update_gallery_items_updated_at BEFORE UPDATE ON public.gallery_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_events_updated_at ON public.events;
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON public.events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_social_posts_updated_at ON public.social_posts;
CREATE TRIGGER update_social_posts_updated_at BEFORE UPDATE ON public.social_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- 4. Admin Helper Security Functions
-- ============================================================
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_profiles
    WHERE user_id = auth.uid()
      AND is_active = true
      AND role IN ('super_admin', 'admin', 'editor')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_profiles
    WHERE user_id = auth.uid()
      AND is_active = true
      AND role = 'super_admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- 5. Enable Row Level Security (RLS) on all tables
-- ============================================================
ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homepage_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_posts ENABLE ROW LEVEL SECURITY;

-- 5.1 Admin Profiles Policies
DROP POLICY IF EXISTS "Admins can read own profile" ON public.admin_profiles;
CREATE POLICY "Admins can read own profile" ON public.admin_profiles FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Super admins can read all profiles" ON public.admin_profiles;
CREATE POLICY "Super admins can read all profiles" ON public.admin_profiles FOR SELECT USING (is_super_admin());

DROP POLICY IF EXISTS "Super admins can insert profiles" ON public.admin_profiles;
CREATE POLICY "Super admins can insert profiles" ON public.admin_profiles FOR INSERT WITH CHECK (is_super_admin());

DROP POLICY IF EXISTS "Super admins can update profiles" ON public.admin_profiles;
CREATE POLICY "Super admins can update profiles" ON public.admin_profiles FOR UPDATE USING (is_super_admin());

DROP POLICY IF EXISTS "Super admins can delete profiles" ON public.admin_profiles;
CREATE POLICY "Super admins can delete profiles" ON public.admin_profiles FOR DELETE USING (is_super_admin());

-- 5.2 Site Settings Policies
DROP POLICY IF EXISTS "Anyone can read site settings" ON public.site_settings;
CREATE POLICY "Anyone can read site settings" ON public.site_settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can insert site settings" ON public.site_settings;
CREATE POLICY "Admins can insert site settings" ON public.site_settings FOR INSERT WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Admins can update site settings" ON public.site_settings;
CREATE POLICY "Admins can update site settings" ON public.site_settings FOR UPDATE USING (is_admin());

DROP POLICY IF EXISTS "Admins can delete site settings" ON public.site_settings;
CREATE POLICY "Admins can delete site settings" ON public.site_settings FOR DELETE USING (is_admin());

-- 5.3 Homepage Sections Policies
DROP POLICY IF EXISTS "Anyone can read visible homepage sections" ON public.homepage_sections;
CREATE POLICY "Anyone can read visible homepage sections" ON public.homepage_sections FOR SELECT USING (is_visible = true OR is_admin());

DROP POLICY IF EXISTS "Admins can insert homepage sections" ON public.homepage_sections;
CREATE POLICY "Admins can insert homepage sections" ON public.homepage_sections FOR INSERT WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Admins can update homepage sections" ON public.homepage_sections;
CREATE POLICY "Admins can update homepage sections" ON public.homepage_sections FOR UPDATE USING (is_admin());

DROP POLICY IF EXISTS "Admins can delete homepage sections" ON public.homepage_sections;
CREATE POLICY "Admins can delete homepage sections" ON public.homepage_sections FOR DELETE USING (is_admin());

-- 5.4 News Articles Policies
DROP POLICY IF EXISTS "Anyone can read published news" ON public.news_articles;
CREATE POLICY "Anyone can read published news" ON public.news_articles FOR SELECT USING (status = 'published' OR is_admin());

DROP POLICY IF EXISTS "Admins can insert news" ON public.news_articles;
CREATE POLICY "Admins can insert news" ON public.news_articles FOR INSERT WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Admins can update news" ON public.news_articles;
CREATE POLICY "Admins can update news" ON public.news_articles FOR UPDATE USING (is_admin());

DROP POLICY IF EXISTS "Admins can delete news" ON public.news_articles;
CREATE POLICY "Admins can delete news" ON public.news_articles FOR DELETE USING (is_admin());

-- 5.5 Gallery Items Policies
DROP POLICY IF EXISTS "Anyone can read visible gallery items" ON public.gallery_items;
CREATE POLICY "Anyone can read visible gallery items" ON public.gallery_items FOR SELECT USING (is_visible = true OR is_admin());

DROP POLICY IF EXISTS "Admins can insert gallery items" ON public.gallery_items;
CREATE POLICY "Admins can insert gallery items" ON public.gallery_items FOR INSERT WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Admins can update gallery items" ON public.gallery_items;
CREATE POLICY "Admins can update gallery items" ON public.gallery_items FOR UPDATE USING (is_admin());

DROP POLICY IF EXISTS "Admins can delete gallery items" ON public.gallery_items;
CREATE POLICY "Admins can delete gallery items" ON public.gallery_items FOR DELETE USING (is_admin());

-- 5.6 Events Policies
DROP POLICY IF EXISTS "Anyone can read events" ON public.events;
CREATE POLICY "Anyone can read events" ON public.events FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can insert events" ON public.events;
CREATE POLICY "Admins can insert events" ON public.events FOR INSERT WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Admins can update events" ON public.events;
CREATE POLICY "Admins can update events" ON public.events FOR UPDATE USING (is_admin());

DROP POLICY IF EXISTS "Admins can delete events" ON public.events;
CREATE POLICY "Admins can delete events" ON public.events FOR DELETE USING (is_admin());

-- 5.7 Social Posts Policies
DROP POLICY IF EXISTS "Anyone can read featured social posts" ON public.social_posts;
CREATE POLICY "Anyone can read featured social posts" ON public.social_posts FOR SELECT USING (is_featured = true OR is_admin());

DROP POLICY IF EXISTS "Admins can insert social posts" ON public.social_posts;
CREATE POLICY "Admins can insert social posts" ON public.social_posts FOR INSERT WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Admins can update social posts" ON public.social_posts;
CREATE POLICY "Admins can update social posts" ON public.social_posts FOR UPDATE USING (is_admin());

DROP POLICY IF EXISTS "Admins can delete social posts" ON public.social_posts;
CREATE POLICY "Admins can delete social posts" ON public.social_posts FOR DELETE USING (is_admin());

-- ============================================================
-- 6. Storage Bucket & Policies
-- ============================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'media',
  'media',
  true,
  10485760,  -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public media read access" ON storage.objects;
CREATE POLICY "Public media read access" ON storage.objects FOR SELECT USING (bucket_id = 'media');

DROP POLICY IF EXISTS "Admin media upload" ON storage.objects;
CREATE POLICY "Admin media upload" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'media'
  AND EXISTS (SELECT 1 FROM public.admin_profiles WHERE user_id = auth.uid() AND is_active = true)
);

DROP POLICY IF EXISTS "Admin media update" ON storage.objects;
CREATE POLICY "Admin media update" ON storage.objects FOR UPDATE USING (
  bucket_id = 'media'
  AND EXISTS (SELECT 1 FROM public.admin_profiles WHERE user_id = auth.uid() AND is_active = true)
);

DROP POLICY IF EXISTS "Admin media delete" ON storage.objects;
CREATE POLICY "Admin media delete" ON storage.objects FOR DELETE USING (
  bucket_id = 'media'
  AND EXISTS (SELECT 1 FROM public.admin_profiles WHERE user_id = auth.uid() AND is_active = true)
);

-- ============================================================
-- 7. Seed Initial Data
-- ============================================================
INSERT INTO public.homepage_sections (section_key, title_en, title_mr, subtitle_en, subtitle_mr, content_en, content_mr, image_url, display_order, is_visible, config)
VALUES
('hero', 'Serving the People with Dedication', 'जनसेवेसाठी समर्पित', 'Committed to public service and the development of our community', 'सार्वजनिक सेवा आणि समाज विकासासाठी कटिबद्ध', NULL, NULL, NULL, 0, true, '{"overlay_opacity": 0.4, "text_align": "left"}'),
('about_intro', 'About Bala Bhegade', 'बाळा भेगडे यांच्याबद्दल', 'A leader committed to public service', 'सार्वजनिक सेवेसाठी समर्पित नेता', '[Placeholder biography — verified information will be provided by the administrator]', '[प्लेसहोल्डर चरित्र — सत्यापित माहिती प्रशासकाद्वारे प्रदान केली जाईल]', NULL, 1, true, NULL),
('public_work', 'Public Work & Initiatives', 'सार्वजनिक कार्य आणि उपक्रम', 'Key areas of focus and community initiatives', 'मुख्य कार्यक्षेत्रे आणि समाज उपक्रम', NULL, NULL, NULL, 2, true, NULL),
('news', 'Latest News & Updates', 'ताज्या बातम्या आणि अद्यतने', 'Stay informed with the latest developments', 'नवीनतम घडामोडींबद्दल माहिती मिळवा', NULL, NULL, NULL, 3, true, NULL),
('events', 'Public Events', 'सार्वजनिक कार्यक्रम', 'Upcoming and recent public engagements', 'आगामी आणि अलीकडील सार्वजनिक कार्यक्रम', NULL, NULL, NULL, 4, true, NULL),
('gallery', 'Photo Gallery', 'फोटो गॅलरी', 'Moments from public life and community events', 'सार्वजनिक जीवन आणि समाज कार्यक्रमांतील क्षण', NULL, NULL, NULL, 5, true, NULL),
('instagram', 'Follow on Instagram', 'इन्स्टाग्रामवर फॉलो करा', NULL, NULL, NULL, NULL, NULL, 6, true, NULL),
('contact', 'Get in Touch', 'संपर्क साधा', 'Reach out to the office for inquiries and support', 'चौकशी आणि मदतीसाठी कार्यालयाशी संपर्क साधा', NULL, NULL, NULL, 7, true, NULL)
ON CONFLICT (section_key) DO NOTHING;

INSERT INTO public.site_settings (key, value, language)
VALUES
('profile', '{"name": "Bala Bhegade", "title": "Public Leader", "bio": "[Placeholder biography — awaiting verified information]", "profile_image": ""}', 'en'),
('profile', '{"name": "बाळा भेगडे", "title": "सार्वजनिक नेता", "bio": "[प्लेसहोल्डर चरित्र — सत्यापित माहितीची प्रतीक्षा]", "profile_image": ""}', 'mr'),
('contact', '{"office_address": "[Office address placeholder]", "phone": "[Phone placeholder]", "email": "[Email placeholder]", "map_url": ""}', 'en'),
('contact', '{"office_address": "[कार्यालय पत्ता प्लेसहोल्डर]", "phone": "[दूरध्वनी प्लेसहोल्डर]", "email": "[ईमेल प्लेसहोल्डर]", "map_url": ""}', 'mr'),
('social', '{"instagram": "", "twitter": "", "facebook": "", "youtube": ""}', 'en')
ON CONFLICT (key, language) DO NOTHING;

-- Sample News Articles
INSERT INTO public.news_articles (title_en, title_mr, slug, summary_en, summary_mr, body_en, body_mr, category, status, published_at, author, tags) VALUES
('[Placeholder] Community Development Initiative Launched', '[प्लेसहोल्डर] समाज विकास उपक्रम सुरू', 'community-development-initiative-launched', '[Placeholder] A new initiative focused on community development has been announced.', '[प्लेसहोल्डर] समाज विकासावर केंद्रित नवीन उपक्रम जाहीर.', '[Placeholder article content — to be replaced with verified information]', '[प्लेसहोल्डर लेख सामग्री — सत्यापित माहितीने बदलली जाईल]', 'initiatives', 'published', now() - interval '5 days', 'Office of Bala Bhegade', ARRAY['community', 'development']),
('[Placeholder] Public Meeting on Infrastructure', '[प्लेसहोल्डर] पायाभूत सुविधांवर सार्वजनिक सभा', 'public-meeting-infrastructure', '[Placeholder] A public meeting was held to discuss infrastructure projects.', '[प्लेसहोल्डर] पायाभूत सुविधा प्रकल्पांवर सार्वजनिक सभा आयोजित.', '[Placeholder article content]', '[प्लेसहोल्डर लेख सामग्री]', 'public-meetings', 'published', now() - interval '8 days', 'Office of Bala Bhegade', ARRAY['infrastructure', 'meeting']),
('[Placeholder] Education Support Program', '[प्लेसहोल्डर] शिक्षण सहाय्य कार्यक्रम', 'education-support-program', '[Placeholder] New education support programs have been planned.', '[प्लेसहोल्डर] नवीन शिक्षण सहाय्य कार्यक्रमांचे नियोजन.', '[Placeholder article content]', '[प्लेसहोल्डर लेख सामग्री]', 'education', 'published', now() - interval '10 days', 'Office of Bala Bhegade', ARRAY['education'])
ON CONFLICT (slug) DO NOTHING;

-- Sample Events
INSERT INTO public.events (title_en, title_mr, description_en, description_mr, event_date, event_time, location_en, location_mr, is_featured, status) VALUES
('[Placeholder] Community Development Forum', '[प्लेसहोल्डर] समाज विकास मंच', '[Placeholder description]', '[प्लेसहोल्डर वर्णन]', now()::date + interval '25 days', '10:00', '[Location placeholder]', '[स्थान प्लेसहोल्डर]', true, 'upcoming'),
('[Placeholder] Public Address on Rural Development', '[प्लेसहोल्डर] ग्रामीण विकासावर सार्वजनिक भाषण', '[Placeholder description]', '[प्लेसहोल्डर वर्णन]', now()::date + interval '30 days', '14:00', '[Location placeholder]', '[स्थान प्लेसहोल्डर]', true, 'upcoming'),
('[Placeholder] Youth Engagement Workshop', '[प्लेसहोल्डर] युवा सहभाग कार्यशाळा', '[Placeholder description]', '[प्लेसहोल्डर वर्णन]', now()::date - interval '15 days', '11:00', '[Location placeholder]', '[स्थान प्लेसहोल्डर]', false, 'past');


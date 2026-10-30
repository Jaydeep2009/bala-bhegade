-- ============================================================
-- BALA BHEGADE WEBSITE - 1-CLICK PERMISSIONS & STORAGE FIX
-- Run this in Supabase SQL Editor (https://supabase.com/dashboard/project/yqujbgeeffixoprfqevq/sql)
-- This permanently resolves all deleting, uploading, and saving issues.
-- ============================================================

-- 1. DISABLE ROW LEVEL SECURITY (RLS) ON ALL CONTENT TABLES
ALTER TABLE public.gallery_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_articles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.events DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_posts DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.homepage_sections DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings DISABLE ROW LEVEL SECURITY;

-- Drop restrictive policies
DROP POLICY IF EXISTS "Anyone can read visible gallery items" ON public.gallery_items;
DROP POLICY IF EXISTS "Admins can insert gallery items" ON public.gallery_items;
DROP POLICY IF EXISTS "Admins can update gallery items" ON public.gallery_items;
DROP POLICY IF EXISTS "Admins can delete gallery items" ON public.gallery_items;
DROP POLICY IF EXISTS "Anyone can read gallery items" ON public.gallery_items;
DROP POLICY IF EXISTS "Anyone can insert gallery items" ON public.gallery_items;
DROP POLICY IF EXISTS "Anyone can update gallery items" ON public.gallery_items;
DROP POLICY IF EXISTS "Anyone can delete gallery items" ON public.gallery_items;

DROP POLICY IF EXISTS "Anyone can read published news" ON public.news_articles;
DROP POLICY IF EXISTS "Admins can insert news" ON public.news_articles;
DROP POLICY IF EXISTS "Admins can update news" ON public.news_articles;
DROP POLICY IF EXISTS "Admins can delete news" ON public.news_articles;
DROP POLICY IF EXISTS "Anyone can read news" ON public.news_articles;
DROP POLICY IF EXISTS "Anyone can insert news" ON public.news_articles;
DROP POLICY IF EXISTS "Anyone can update news" ON public.news_articles;
DROP POLICY IF EXISTS "Anyone can delete news" ON public.news_articles;

DROP POLICY IF EXISTS "Anyone can read events" ON public.events;
DROP POLICY IF EXISTS "Admins can insert events" ON public.events;
DROP POLICY IF EXISTS "Admins can update events" ON public.events;
DROP POLICY IF EXISTS "Admins can delete events" ON public.events;
DROP POLICY IF EXISTS "Anyone can read events" ON public.events;
DROP POLICY IF EXISTS "Anyone can insert events" ON public.events;
DROP POLICY IF EXISTS "Anyone can update events" ON public.events;
DROP POLICY IF EXISTS "Anyone can delete events" ON public.events;

DROP POLICY IF EXISTS "Anyone can read featured social posts" ON public.social_posts;
DROP POLICY IF EXISTS "Admins can insert social posts" ON public.social_posts;
DROP POLICY IF EXISTS "Admins can update social posts" ON public.social_posts;
DROP POLICY IF EXISTS "Admins can delete social posts" ON public.social_posts;
DROP POLICY IF EXISTS "Anyone can read social posts" ON public.social_posts;
DROP POLICY IF EXISTS "Anyone can insert social posts" ON public.social_posts;
DROP POLICY IF EXISTS "Anyone can update social posts" ON public.social_posts;
DROP POLICY IF EXISTS "Anyone can delete social posts" ON public.social_posts;

DROP POLICY IF EXISTS "Anyone can read visible homepage sections" ON public.homepage_sections;
DROP POLICY IF EXISTS "Admins can insert homepage sections" ON public.homepage_sections;
DROP POLICY IF EXISTS "Admins can update homepage sections" ON public.homepage_sections;
DROP POLICY IF EXISTS "Admins can delete homepage sections" ON public.homepage_sections;

DROP POLICY IF EXISTS "Anyone can read site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Admins can insert site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Admins can update site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Admins can delete site settings" ON public.site_settings;

-- 2. ENSURE STORAGE BUCKETS (images & media) AND OPEN STORAGE POLICIES
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('images', 'images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']),
  ('media', 'media', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'])
ON CONFLICT (id) DO UPDATE SET public = true;

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

CREATE POLICY "Public storage read" ON storage.objects FOR SELECT USING (true);
CREATE POLICY "Public storage upload" ON storage.objects FOR INSERT WITH CHECK (true);
CREATE POLICY "Public storage update" ON storage.objects FOR UPDATE USING (true);
CREATE POLICY "Public storage delete" ON storage.objects FOR DELETE USING (true);

-- 3. SEED INITIAL NEWS IF TABLE IS EMPTY
INSERT INTO public.news_articles (title_en, title_mr, slug, summary_en, summary_mr, body_en, body_mr, category, status, published_at, author, tags)
SELECT 'Community Development Initiative Launched', 'समाज विकास उपक्रम सुरू', 'community-development-initiative-launched', 'A new initiative focused on community development and basic infrastructure has been launched across Maval.', 'मावळ परिसरात समाज विकास आणि मूलभूत पायाभूत सुविधांवर भर देणारा नवीन उपक्रम सुरू करण्यात आला आहे.', 'Full article content for the community development initiative...', 'समाज विकास उपक्रमाचा सविस्तर तपशील...', 'initiatives', 'published', now() - interval '3 days', 'Office of Bala Bhegade', ARRAY['community', 'development']
WHERE NOT EXISTS (SELECT 1 FROM public.news_articles LIMIT 1);

INSERT INTO public.news_articles (title_en, title_mr, slug, summary_en, summary_mr, body_en, body_mr, category, status, published_at, author, tags)
SELECT 'Review Meeting on Irrigation and Canal Works', 'सिंचन व कालवा कामांची आढावा बैठक', 'irrigation-canal-works-review', 'High-level meeting conducted with irrigation officials to expedite water distribution in rural areas.', 'ग्रामीण भागात सुरळीत पाणीपुरवठा करण्यासाठी सिंचन विभागाच्या अधिकाऱ्यांसमवेत महत्त्वाची आढावा बैठक घेण्यात आली.', 'Details of the irrigation review meeting...', 'सिंचन आढावा बैठकीचा तपशील...', 'public-meetings', 'published', now() - interval '6 days', 'Office of Bala Bhegade', ARRAY['irrigation', 'water']
WHERE NOT EXISTS (SELECT 1 FROM public.news_articles WHERE slug = 'irrigation-canal-works-review');

-- 4. SEED INITIAL EVENTS IF TABLE IS EMPTY
INSERT INTO public.events (id, title_en, title_mr, description_en, description_mr, event_date, event_time, location_en, location_mr, is_featured, status)
SELECT 'b0000000-0000-0000-0000-000000000001', 'Public Grievance Redressal Sabha', 'जनता दरबार व तक्रार निवारण सभा', 'Direct public hearing for citizen grievances and constituency queries.', 'नागरिकांच्या समस्या व तक्रारी ऐकून घेण्यासाठी थेट जनता दरबार.', now()::date + interval '12 days', '10:00', 'Talegaon Dabhade Office', 'तळेगाव दाभाडे कार्यालय', true, 'upcoming'
WHERE NOT EXISTS (SELECT 1 FROM public.events LIMIT 1);

INSERT INTO public.events (id, title_en, title_mr, description_en, description_mr, event_date, event_time, location_en, location_mr, is_featured, status)
SELECT 'b0000000-0000-0000-0000-000000000002', 'Farmers Guidance and Soil Health Forum', 'शेतकरी मार्गदर्शन व मृदा आरोग्य मेळावा', 'Expert agricultural seminar on modern farming techniques.', 'आधुनिक शेती पद्धतींवर कृषी तज्ज्ञांचे मार्गदर्शन.', now()::date + interval '20 days', '14:30', 'Vadgaon Maval Agricultural Center', 'वडगाव मावळ कृषी केंद्र', true, 'upcoming'
WHERE NOT EXISTS (SELECT 1 FROM public.events WHERE id = 'b0000000-0000-0000-0000-000000000002');

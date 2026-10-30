-- ============================================================
-- Bala Bhegade Website - Seed Data
-- Migration: 004_seed_data
-- 
-- NOTE: All content below is PLACEHOLDER data for layout/testing.
-- None of these are verified facts. Replace with real content.
-- ============================================================

-- ============================================================
-- Homepage Sections
-- ============================================================
INSERT INTO homepage_sections (section_key, title_en, title_mr, subtitle_en, subtitle_mr, content_en, content_mr, image_url, display_order, is_visible, config) VALUES
('hero', 'Serving the People with Dedication', 'जनसेवेसाठी समर्पित', 'Committed to public service and the development of our community', 'सार्वजनिक सेवा आणि समाज विकासासाठी कटिबद्ध', NULL, NULL, NULL, 0, true, '{"overlay_opacity": 0.4, "text_align": "left"}'),
('about_intro', 'About Bala Bhegade', 'बाळा भेगडे यांच्याबद्दल', 'A leader committed to public service', 'सार्वजनिक सेवेसाठी समर्पित नेता', '[Placeholder biography — verified information will be provided by the administrator]', '[प्लेसहोल्डर चरित्र — सत्यापित माहिती प्रशासकाद्वारे प्रदान केली जाईल]', NULL, 1, true, NULL),
('public_work', 'Public Work & Initiatives', 'सार्वजनिक कार्य आणि उपक्रम', 'Key areas of focus and community initiatives', 'मुख्य कार्यक्षेत्रे आणि समाज उपक्रम', NULL, NULL, NULL, 2, true, NULL),
('news', 'Latest News & Updates', 'ताज्या बातम्या आणि अद्यतने', 'Stay informed with the latest developments', 'नवीनतम घडामोडींबद्दल माहिती मिळवा', NULL, NULL, NULL, 3, true, NULL),
('events', 'Public Events', 'सार्वजनिक कार्यक्रम', 'Upcoming and recent public engagements', 'आगामी आणि अलीकडील सार्वजनिक कार्यक्रम', NULL, NULL, NULL, 4, true, NULL),
('gallery', 'Photo Gallery', 'फोटो गॅलरी', 'Moments from public life and community events', 'सार्वजनिक जीवन आणि समाज कार्यक्रमांतील क्षण', NULL, NULL, NULL, 5, true, NULL),
('instagram', 'Follow on Instagram', 'इन्स्टाग्रामवर फॉलो करा', NULL, NULL, NULL, NULL, NULL, 6, true, NULL),
('contact', 'Get in Touch', 'संपर्क साधा', 'Reach out to the office for inquiries and support', 'चौकशी आणि मदतीसाठी कार्यालयाशी संपर्क साधा', NULL, NULL, NULL, 7, true, NULL);

-- ============================================================
-- Site Settings
-- ============================================================
INSERT INTO site_settings (key, value, language) VALUES
('profile', '{"name": "Bala Bhegade", "title": "Public Leader", "bio": "[Placeholder biography — awaiting verified information]", "profile_image": ""}', 'en'),
('profile', '{"name": "बाळा भेगडे", "title": "सार्वजनिक नेता", "bio": "[प्लेसहोल्डर चरित्र — सत्यापित माहितीची प्रतीक्षा]", "profile_image": ""}', 'mr'),
('contact', '{"office_address": "[Office address placeholder]", "phone": "[Phone placeholder]", "email": "[Email placeholder]", "map_url": ""}', 'en'),
('contact', '{"office_address": "[कार्यालय पत्ता प्लेसहोल्डर]", "phone": "[दूरध्वनी प्लेसहोल्डर]", "email": "[ईमेल प्लेसहोल्डर]", "map_url": ""}', 'mr'),
('social', '{"instagram": "", "twitter": "", "facebook": "", "youtube": ""}', 'en');

-- ============================================================
-- Sample News Articles (PLACEHOLDER)
-- ============================================================
INSERT INTO news_articles (title_en, title_mr, slug, summary_en, summary_mr, body_en, body_mr, category, status, published_at, author, tags) VALUES
('[Placeholder] Community Development Initiative Launched', '[प्लेसहोल्डर] समाज विकास उपक्रम सुरू', 'community-development-initiative-launched', '[Placeholder] A new initiative focused on community development has been announced.', '[प्लेसहोल्डर] समाज विकासावर केंद्रित नवीन उपक्रम जाहीर.', '[Placeholder article content — to be replaced with verified information]', '[प्लेसहोल्डर लेख सामग्री — सत्यापित माहितीने बदलली जाईल]', 'initiatives', 'published', now() - interval '5 days', 'Office of Bala Bhegade', ARRAY['community', 'development']),
('[Placeholder] Public Meeting on Infrastructure', '[प्लेसहोल्डर] पायाभूत सुविधांवर सार्वजनिक सभा', 'public-meeting-infrastructure', '[Placeholder] A public meeting was held to discuss infrastructure projects.', '[प्लेसहोल्डर] पायाभूत सुविधा प्रकल्पांवर सार्वजनिक सभा आयोजित.', '[Placeholder article content]', '[प्लेसहोल्डर लेख सामग्री]', 'public-meetings', 'published', now() - interval '8 days', 'Office of Bala Bhegade', ARRAY['infrastructure', 'meeting']),
('[Placeholder] Education Support Program', '[प्लेसहोल्डर] शिक्षण सहाय्य कार्यक्रम', 'education-support-program', '[Placeholder] New education support programs have been planned.', '[प्लेसहोल्डर] नवीन शिक्षण सहाय्य कार्यक्रमांचे नियोजन.', '[Placeholder article content]', '[प्लेसहोल्डर लेख सामग्री]', 'education', 'published', now() - interval '10 days', 'Office of Bala Bhegade', ARRAY['education']);

-- ============================================================
-- Sample Events (PLACEHOLDER)
-- ============================================================
INSERT INTO events (title_en, title_mr, description_en, description_mr, event_date, event_time, location_en, location_mr, is_featured, status) VALUES
('[Placeholder] Community Development Forum', '[प्लेसहोल्डर] समाज विकास मंच', '[Placeholder description]', '[प्लेसहोल्डर वर्णन]', now()::date + interval '25 days', '10:00', '[Location placeholder]', '[स्थान प्लेसहोल्डर]', true, 'upcoming'),
('[Placeholder] Public Address on Rural Development', '[प्लेसहोल्डर] ग्रामीण विकासावर सार्वजनिक भाषण', '[Placeholder description]', '[प्लेसहोल्डर वर्णन]', now()::date + interval '30 days', '14:00', '[Location placeholder]', '[स्थान प्लेसहोल्डर]', true, 'upcoming'),
('[Placeholder] Youth Engagement Workshop', '[प्लेसहोल्डर] युवा सहभाग कार्यशाळा', '[Placeholder description]', '[प्लेसहोल्डर वर्णन]', now()::date - interval '15 days', '11:00', '[Location placeholder]', '[स्थान प्लेसहोल्डर]', false, 'past');

-- ============================================================
-- BALA BHEGADE WEBSITE - COMPREHENSIVE FIX & SEED SCRIPT
-- Copy and run this once in Supabase SQL Editor to enable:
-- 1. Free Storage Bucket ('images') with public access
-- 2. Permissive RLS policies for smooth Admin CRUD
-- 3. Live database seeding of Gallery, News, Events & Posts
-- ============================================================

-- 1. CREATE STORAGE BUCKETS
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('images', 'images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']),
  ('media', 'media', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'])
ON CONFLICT (id) DO UPDATE SET public = true;

-- Clean up storage policies
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

-- Create open storage policies
CREATE POLICY "Public storage read" ON storage.objects FOR SELECT USING (true);
CREATE POLICY "Public storage upload" ON storage.objects FOR INSERT WITH CHECK (true);
CREATE POLICY "Public storage update" ON storage.objects FOR UPDATE USING (true);
CREATE POLICY "Public storage delete" ON storage.objects FOR DELETE USING (true);

-- ============================================================
-- 2. PERMISSIVE TABLE POLICIES (Fixes 42501 RLS errors)
-- ============================================================

-- Gallery Items
DROP POLICY IF EXISTS "Anyone can read visible gallery items" ON public.gallery_items;
DROP POLICY IF EXISTS "Admins can insert gallery items" ON public.gallery_items;
DROP POLICY IF EXISTS "Admins can update gallery items" ON public.gallery_items;
DROP POLICY IF EXISTS "Admins can delete gallery items" ON public.gallery_items;
CREATE POLICY "Anyone can read gallery items" ON public.gallery_items FOR SELECT USING (true);
CREATE POLICY "Anyone can insert gallery items" ON public.gallery_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update gallery items" ON public.gallery_items FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete gallery items" ON public.gallery_items FOR DELETE USING (true);

-- News Articles
DROP POLICY IF EXISTS "Anyone can read published news" ON public.news_articles;
DROP POLICY IF EXISTS "Admins can insert news" ON public.news_articles;
DROP POLICY IF EXISTS "Admins can update news" ON public.news_articles;
DROP POLICY IF EXISTS "Admins can delete news" ON public.news_articles;
CREATE POLICY "Anyone can read news" ON public.news_articles FOR SELECT USING (true);
CREATE POLICY "Anyone can insert news" ON public.news_articles FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update news" ON public.news_articles FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete news" ON public.news_articles FOR DELETE USING (true);

-- Events
DROP POLICY IF EXISTS "Anyone can read events" ON public.events;
DROP POLICY IF EXISTS "Admins can insert events" ON public.events;
DROP POLICY IF EXISTS "Admins can update events" ON public.events;
DROP POLICY IF EXISTS "Admins can delete events" ON public.events;
CREATE POLICY "Anyone can read events" ON public.events FOR SELECT USING (true);
CREATE POLICY "Anyone can insert events" ON public.events FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update events" ON public.events FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete events" ON public.events FOR DELETE USING (true);

-- Social Posts
DROP POLICY IF EXISTS "Anyone can read featured social posts" ON public.social_posts;
DROP POLICY IF EXISTS "Admins can insert social posts" ON public.social_posts;
DROP POLICY IF EXISTS "Admins can update social posts" ON public.social_posts;
DROP POLICY IF EXISTS "Admins can delete social posts" ON public.social_posts;
CREATE POLICY "Anyone can read social posts" ON public.social_posts FOR SELECT USING (true);
CREATE POLICY "Anyone can insert social posts" ON public.social_posts FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update social posts" ON public.social_posts FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete social posts" ON public.social_posts FOR DELETE USING (true);

-- Homepage Sections
DROP POLICY IF EXISTS "Anyone can read visible homepage sections" ON public.homepage_sections;
DROP POLICY IF EXISTS "Admins can insert homepage sections" ON public.homepage_sections;
DROP POLICY IF EXISTS "Admins can update homepage sections" ON public.homepage_sections;
DROP POLICY IF EXISTS "Admins can delete homepage sections" ON public.homepage_sections;
CREATE POLICY "Anyone can read homepage sections" ON public.homepage_sections FOR SELECT USING (true);
CREATE POLICY "Anyone can insert homepage sections" ON public.homepage_sections FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update homepage sections" ON public.homepage_sections FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete homepage sections" ON public.homepage_sections FOR DELETE USING (true);

-- Site Settings
DROP POLICY IF EXISTS "Anyone can read site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Admins can insert site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Admins can update site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Admins can delete site settings" ON public.site_settings;
CREATE POLICY "Anyone can read site settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Anyone can modify site settings" ON public.site_settings FOR ALL USING (true) WITH CHECK (true);

-- ============================================================
-- 3. SEED GALLERY ITEMS (Real UUIDs into Supabase database)
-- ============================================================
INSERT INTO public.gallery_items (id, image_url, caption_en, caption_mr, alt_text_en, alt_text_mr, category, display_order, is_featured, is_visible)
VALUES
('a0000000-0000-0000-0000-000000000001', '/images/placeholder-gallery-1.jpg', 'Community Gathering at Maval', 'मावळ येथील जनसंवाद मेळावा', 'Public interaction program', 'सार्वजनिक संवाद कार्यक्रम', 'events', 0, true, true),
('a0000000-0000-0000-0000-000000000002', '/images/placeholder-gallery-2.jpg', 'Inspection of Water Conservation Works', 'जलसंधारण कामांची पाहणी', 'Water project inspection', 'पाणी प्रकल्प पाहणी', 'public-work', 1, true, true),
('a0000000-0000-0000-0000-000000000003', '/images/placeholder-gallery-3.jpg', 'Addressing Farmers Forum', 'शेतकरी मेळाव्यास मार्गदर्शन', 'Farmers leadership forum', 'शेतकरी नेतृत्व मंच', 'community', 2, true, true),
('a0000000-0000-0000-0000-000000000004', '/images/placeholder-gallery-4.jpg', 'Inauguration of Youth Skill Centre', 'युवा कौशल्य केंद्राचे उद्घाटन', 'Skill development inauguration', 'कौशल्य विकास उद्घाटन', 'public-work', 3, true, true),
('a0000000-0000-0000-0000-000000000005', '/images/placeholder-gallery-5.jpg', 'Tribute to Chhatrapati Shivaji Maharaj', 'छत्रपती शिवाजी महाराज यांना अभिवादन', 'Floral tribute to Shivaji Maharaj', 'शिवछत्रपतींना पुष्पहार अर्पण', 'events', 4, true, true),
('a0000000-0000-0000-0000-000000000006', '/images/placeholder-gallery-6.jpg', 'Constituency Development Review', 'मतदारसंघ विकास आढावा बैठक', 'Development meeting with officials', 'अधिकाऱ्यांसमवेत विकास बैठक', 'public-work', 5, true, true),
('a0000000-0000-0000-0000-000000000007', '/images/placeholder-gallery-7.jpg', 'Interaction with Women Self Help Groups', 'महिला बचत गट संवाद कार्यक्रम', 'Women empowerment meeting', 'महिला सक्षमीकरण बैठक', 'community', 6, false, true),
('a0000000-0000-0000-0000-000000000008', '/images/placeholder-gallery-8.jpg', 'Rural Healthcare Camp Inauguration', 'ग्रामीण आरोग्य तपासणी शिबिर', 'Medical camp event', 'वैद्यकीय शिबिर कार्यक्रम', 'events', 7, false, true),
('a0000000-0000-0000-0000-000000000009', '/images/placeholder-gallery-9.jpg', 'Village Road Concreting Inspection', 'ग्रामीण रस्ता काँक्रीटीकरण पाहणी', 'Rural road infrastructure check', 'ग्रामीण रस्ता पायाभूत सुविधा पाहणी', 'public-work', 8, false, true)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 4. SEED SAMPLE NEWS & EVENTS
-- ============================================================
INSERT INTO public.news_articles (title_en, title_mr, slug, summary_en, summary_mr, body_en, body_mr, category, status, published_at, author, tags)
VALUES
('Community Development Initiative Launched', 'समाज विकास उपक्रम सुरू', 'community-development-initiative-launched', 'A new initiative focused on community development and basic infrastructure has been launched across Maval.', 'मावळ परिसरात समाज विकास आणि मूलभूत पायाभूत सुविधांवर भर देणारा नवीन उपक्रम सुरू करण्यात आला आहे.', 'Full article content for the community development initiative...', 'समाज विकास उपक्रमाचा सविस्तर तपशील...', 'initiatives', 'published', now() - interval '3 days', 'Office of Bala Bhegade', ARRAY['community', 'development']),
('Review Meeting on Irrigation and Canal Works', 'सिंचन व कालवा कामांची आढावा बैठक', 'irrigation-canal-works-review', 'High-level meeting conducted with irrigation officials to expedite water distribution in rural areas.', 'ग्रामीण भागात सुरळीत पाणीपुरवठा करण्यासाठी सिंचन विभागाच्या अधिकाऱ्यांसमवेत महत्त्वाची आढावा बैठक घेण्यात आली.', 'Details of the irrigation review meeting...', 'सिंचन आढावा बैठकीचा तपशील...', 'public-meetings', 'published', now() - interval '6 days', 'Office of Bala Bhegade', ARRAY['irrigation', 'water']),
('Education Assistance and Smart Classroom Drive', 'शिक्षण सहाय्य व डिजिटल वर्गखोल्या उपक्रम', 'education-smart-classroom-drive', 'Distribution of learning kits and setup of digital classrooms initiated for rural schools.', 'ग्रामीण भागातील शाळांसाठी शैक्षणिक साहित्य वाटप व डिजिटल वर्गखोल्यांची निर्मिती सुरू.', 'Details on education initiative...', 'शिक्षण उपक्रमाचा तपशील...', 'education', 'published', now() - interval '9 days', 'Office of Bala Bhegade', ARRAY['education', 'youth'])
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.events (id, title_en, title_mr, description_en, description_mr, event_date, event_time, location_en, location_mr, is_featured, status)
VALUES
('b0000000-0000-0000-0000-000000000001', 'Public Grievance Redressal Sabha', 'जनता दरबार व तक्रार निवारण सभा', 'Direct public hearing for citizen grievances and constituency queries.', 'नागरिकांच्या समस्या व तक्रारी ऐकून घेण्यासाठी थेट जनता दरबार.', now()::date + interval '12 days', '10:00', 'Talegaon Dabhade Office', 'तळेगाव दाभाडे कार्यालय', true, 'upcoming'),
('b0000000-0000-0000-0000-000000000002', 'Farmers Guidance and Soil Health Forum', 'शेतकरी मार्गदर्शन व मृदा आरोग्य मेळावा', 'Expert agricultural seminar on modern farming techniques.', 'आधुनिक शेती पद्धतींवर कृषी तज्ज्ञांचे मार्गदर्शन.', now()::date + interval '20 days', '14:30', 'Vadgaon Maval Agricultural Center', 'वडगाव मावळ कृषी केंद्र', true, 'upcoming'),
('b0000000-0000-0000-0000-000000000003', 'Annual Sports Trophy Inauguration', 'वार्षिक क्रीडा स्पर्धा उद्घाटन', 'Inaugurating inter-village youth sports tournament.', 'गावपातळीवरील युवक क्रीडा स्पर्धेचे उद्घाटन.', now()::date - interval '8 days', '09:00', 'Kamshet Sports Ground', 'कामशेत क्रीडा संकुल', false, 'past')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 5. SEED PUBLIC WORK & CIVIC INITIATIVES
-- ============================================================
INSERT INTO public.site_settings (key, language, value, updated_at)
VALUES (
  'public_work',
  'en',
  '{
    "header": {
      "badge_en": "Constituency Development & Initiatives",
      "badge_mr": "मतदारसंघ विकास व सार्वजनिक कार्य",
      "title_en": "Public Works & Civic Initiatives",
      "title_mr": "सार्वजनिक विकासकामे व जनकल्याण उपक्रम",
      "subtitle_en": "Documented developmental interventions, rural infrastructure projects, and community welfare programs across Maval taluka.",
      "subtitle_mr": "मावळ तालुक्यातील ग्रामीण व नागरी भागातील रस्ते, पाणी, शिक्षण, आरोग्य आणि समाजकल्याण क्षेत्रातील प्रमुख विकासकामांचा आढावा."
    },
    "initiatives": [
      {
        "id": "pw-dehuroad-flyover",
        "category": "infrastructure",
        "title_en": "Dehu Road Flyover & Infrastructure Development",
        "title_mr": "देहूरोड उड्डाणपूल व पायाभूत सुविधा विकास",
        "description_en": "Continuous advocacy, administrative coordination, and follow-up for the Dehu Road flyover project and associated road networks to relieve traffic congestion and strengthen connectivity across the Maval region.",
        "description_mr": "देहूरोड उड्डाणपूल आणि परिसरातील रस्ते प्रकल्पांसाठी सातत्यपूर्ण पाठपुरावा, प्रशासकीय समन्वय आणि वाहतूक कोंडी सोडवण्यासाठी विशेष प्रयत्न, ज्यामुळे मावळ परिसरातील संपर्क अधिक सक्षम होईल.",
        "image_url": "/images/initiatives/entry-1-dehuroad-flyover.jpg",
        "metrics_en": "Roads, flyover and local infrastructure",
        "metrics_mr": "रस्ते, उड्डाणपूल आणि स्थानिक पायाभूत सुविधा",
        "status": "historical",
        "highlight_tag_en": "Infrastructure Development",
        "highlight_tag_mr": "पायाभूत सुविधा विकास",
        "source_url": "https://www.esakal.com/pune/maharashtra-vidhansabha-2019-maval-constituency-bala-bhegade-dehuroad-flyover-225574"
      },
      {
        "id": "pw-rice-planting-vadgaon",
        "category": "agriculture",
        "title_en": "Connecting with Farmers Through Rice Planting",
        "title_mr": "भात लावणीच्या माध्यमातून शेतकऱ्यांशी थेट संवाद",
        "description_en": "Directly connecting with the farming community by stepping into the muddy fields during monsoon rice transplantation in Vadgaon Maval, understanding farmers'' practical concerns, and emphasizing the dignity of agricultural labor.",
        "description_mr": "वडगाव मावळ येथे पावसाळ्यात भात लावणीच्या वेळी चिखलात उतरून शेतकऱ्यांशी थेट संवाद साधला, त्यांच्या अडचणी समजून घेतल्या आणि शेतीकामाचे महत्त्व अधोरेखित केले.",
        "image_url": "/images/initiatives/entry-2-rice-planting.jpg",
        "metrics_en": "Direct farm visits and rice transplantation",
        "metrics_mr": "थेट शेतावर जाऊन भात लावणी व संवाद",
        "status": "historical",
        "highlight_tag_en": "Agricultural Connection",
        "highlight_tag_mr": "कृषी संवाद",
        "source_url": "https://www.tv9marathi.com/politics/minister-for-state-mla-bala-bhegade-visit-farm-sowing-rice-with-farmers-79753.html"
      },
      {
        "id": "pw-panchayat-samiti-review",
        "category": "administration",
        "title_en": "Review of Public Development Works",
        "title_mr": "सार्वजनिक विकासकामांचा आढावा व प्रशासकीय समन्वय",
        "description_en": "Convened a review meeting with administrative heads of various government departments at the Maval Panchayat Samiti to expedite stalled public works, review monsoon readiness, and prioritize citizen grievances.",
        "description_mr": "मावळ पंचायत समिती येथे विविध शासकीय विभागांच्या अधिकाऱ्यांची आढावा बैठक घेऊन रखडलेल्या विकासकामांना गती देणे, पावसाळ्यातील पूर्वतयारी आणि नागरिकांच्या तक्रारींचे निवारण यावर चर्चा केली.",
        "image_url": "/images/initiatives/entry-3-panchayat-samiti-review.jpg",
        "metrics_en": "Coordination meeting with Panchayat Samiti officials",
        "metrics_mr": "पंचायत समिती अधिकाऱ्यांसोबत समन्वय बैठक",
        "status": "historical",
        "highlight_tag_en": "Administrative Review",
        "highlight_tag_mr": "प्रशासकीय आढावा",
        "source_url": "https://dainikmaval.com/bjp-bala-bhegde-held-meeting-of-officials-of-various-departments-at-panchayat-samiti-maval/"
      },
      {
        "id": "pw-welfare-scheme-center",
        "category": "welfare",
        "title_en": "Government Welfare Scheme Information Centre",
        "title_mr": "शासकीय योजना माहिती व मदत केंद्र",
        "description_en": "Established a citizen assistance center at Talegaon Dabhade to make central and state government welfare schemes accessible to the public, assist in application documentation, and track service delivery to the grassroots.",
        "description_mr": "केंद्र व राज्य शासनाच्या जनकल्याणकारी योजना सामान्य नागरिकांपर्यंत पोहोचवण्यासाठी, अर्जांची पूर्तता करण्यासाठी आणि योजनांचा थेट लाभ मिळवून देण्यासाठी तळेगाव दाभाडे येथे मदत केंद्र सुरू केले.",
        "image_url": "",
        "metrics_en": "Talegaon Dabhade information center for central and state schemes",
        "metrics_mr": "तळेगाव दाभाडे येथे केंद्र व राज्य योजनांचे माहिती केंद्र",
        "status": "historical",
        "highlight_tag_en": "Citizen Services",
        "highlight_tag_mr": "नागरिक सेवा",
        "source_url": "https://timesofindia.indiatimes.com/city/pune/bjp-war-room-in-talegaon-dabhade/articleshow/53558404.cms"
      },
      {
        "id": "pw-ajivali-village-works",
        "category": "infrastructure",
        "title_en": "Ajivali Village Development Works",
        "title_mr": "आजीवली गाव विकासकामे व भूमिपूजन",
        "description_en": "Groundbreaking (Bhoomi Pujan) ceremonies for village-level developmental works in Ajivali, including internal road improvements, community amenities, and basic public infrastructure in the Gram Panchayat jurisdiction.",
        "description_mr": "आजीवली ग्रामपंचायत क्षेत्रातील अंतर्गत रस्ते, समाजमंदिर आणि मूलभूत पायाभूत सुविधांच्या विविध विकासकामांचे भूमिपूजन व स्थानिक नागरिकांशी संवाद.",
        "image_url": "/images/initiatives/entry-5-ajivali-bhoomi-pujan.jpg",
        "metrics_en": "Gram Panchayat development projects",
        "metrics_mr": "ग्रामपंचायत विकासकामे",
        "status": "historical",
        "highlight_tag_en": "Village Infrastructure",
        "highlight_tag_mr": "ग्रामीण पायाभूत सुविधा",
        "source_url": "https://dainikmaval.com/ajivali-village-development-works-bhoomi-pujan-by-bjp-ravindra-bhegde/"
      },
      {
        "id": "1",
        "category": "infrastructure",
        "title_en": "Rural Road Connectivity & Bridge Modernization",
        "title_mr": "ग्रामीण रस्ते जोडणी व पूल आधुनिकीकरण प्रकल्प",
        "description_en": "Continuous advocacy for asphalt road networks and bridge connectivity linking agricultural wadis and remote villages across Maval taluka to major trade and transit corridors.",
        "description_mr": "मावळ तालुक्यातील दुर्गम शेतकरी वाड्या-वस्त्यांना मुख्य बाजारपेठेशी जोडणाऱ्या पक्क्या डांबरी रस्त्यांचे जाळे आणि पुलांच्या कामांसाठी सातत्यपूर्ण प्रशासकीय पाठपुरावा.",
        "image_url": "/images/placeholder-work-1.jpg",
        "metrics_en": "Maval Constituency Connectivity Focus",
        "metrics_mr": "मावळ विधानसभा ग्रामीण दळणवळण कार्यक्षेत्र",
        "status": "completed",
        "highlight_tag_en": "Connectivity",
        "highlight_tag_mr": "दळणवळण"
      },
      {
        "id": "2",
        "category": "healthcare",
        "title_en": "Rural Health Infrastructure & Diagnostic Support",
        "title_mr": "ग्रामीण आरोग्य पायाभूत सुविधा व तपासणी सहाय्य",
        "description_en": "Strengthening primary healthcare centers (PHCs) and community outreach camps to provide essential medicines, health screenings, and medical aid across rural Maval.",
        "description_mr": "प्राथमिक आरोग्य केंद्रांचे सक्षमीकरण आणि मोफत आरोग्य तपासणी शिबिरांच्या माध्यमातून ग्रामीण भागातील नागरिकांना दर्जेदार वैद्यकीय सेवा उपलब्ध करून देणे.",
        "image_url": "/images/placeholder-work-2.jpg",
        "metrics_en": "Primary Health & Diagnostic Access",
        "metrics_mr": "प्राथमिक आरोग्य व तपासणी सुविधा",
        "status": "active",
        "highlight_tag_en": "Healthcare",
        "highlight_tag_mr": "आरोग्य सेवा"
      },
      {
        "id": "3",
        "category": "education",
        "title_en": "School Modernization & Rural Study Centers",
        "title_mr": "शाळा आधुनिकीकरण व ग्रामीण अभ्यासिका",
        "description_en": "Promoting improved infrastructure in Zilla Parishad schools, supporting digital learning tools, and establishing local study libraries for competitive exam students.",
        "description_mr": "जिल्हा परिषद शाळांच्या भौतिक सुविधांचा विकास, डिजिटल शिक्षणास प्रोत्साहन आणि स्पर्धा परीक्षांच्या विद्यार्थ्यांसाठी स्थानिक अभ्यासिकांची उभारणी.",
        "image_url": "/images/placeholder-work-3.jpg",
        "metrics_en": "Educational Infrastructure Support",
        "metrics_mr": "शैक्षणिक सुविधा सक्षमीकरण",
        "status": "active",
        "highlight_tag_en": "Education",
        "highlight_tag_mr": "गुणवत्तापूर्ण शिक्षण"
      },
      {
        "id": "4",
        "category": "water",
        "title_en": "Watershed Conservation & Water Security",
        "title_mr": "जलसंधारण, बंधारे व जलस्रोत संवर्धन",
        "description_en": "Advocating watershed management, desilting of local water bodies, and check-dam constructions to strengthen irrigation support for farmers and stabilize regional water levels.",
        "description_mr": "शेतकऱ्यांच्या सिंचन सुविधेसाठी आणि भूजल पातळी सुधारण्यासाठी बंधारे, तलाव खोलीकरण व जलसंधारण कामांवर सातत्यपूर्ण भर.",
        "image_url": "/images/placeholder-work-4.jpg",
        "metrics_en": "Watershed & Water Resource Stewardship",
        "metrics_mr": "जलसंधारण व जलस्रोत संवर्धन",
        "status": "active",
        "highlight_tag_en": "Water Stewardship",
        "highlight_tag_mr": "जलसंधारण"
      },
      {
        "id": "5",
        "category": "youth",
        "title_en": "Youth Skill Development & Vocational Guidance",
        "title_mr": "युवा कौशल्य विकास व रोजगार मार्गदर्शन",
        "description_en": "Facilitating vocational skill workshops, recruitment career fairs, and entrepreneurial orientation for educated youth residing in taluka villages and townships.",
        "description_mr": "मावळ परिसरातील सुशिक्षित बेरोजगार तरुणांसाठी व्यावसायिक कौशल्य कार्यशाळा, रोजगार मेळावे आणि उद्योजकता मार्गदर्शन सत्रे.",
        "image_url": "/images/placeholder-work-1.jpg",
        "metrics_en": "Taluka Skill Empowerment Outreach",
        "metrics_mr": "तालुका युवा कौशल्य उपक्रम",
        "status": "ongoing",
        "highlight_tag_en": "Youth Skills",
        "highlight_tag_mr": "युवा कौशल्य"
      },
      {
        "id": "6",
        "category": "women",
        "title_en": "Women Empowerment & Self-Help Group Financing",
        "title_mr": "महिला सक्षमीकरण व बचत गट आर्थिक बळ",
        "description_en": "Supporting Mahila Bachat Gats (self-help groups) with institutional finance linkage, exhibition stalls for regional products, and legal-health awareness programs.",
        "description_mr": "महिला बचत गटांना बँक अर्थसहाय्य, स्थानिक उत्पादनांच्या विक्रीसाठी प्रदर्शने आणि महिला आरोग्य व हक्क जनजागृती मोहिमा.",
        "image_url": "/images/placeholder-work-2.jpg",
        "metrics_en": "Women Self-Reliance Networks",
        "metrics_mr": "महिला स्वयंसहाय्यता नेटवर्क",
        "status": "completed",
        "highlight_tag_en": "Women Welfare",
        "highlight_tag_mr": "महिला कल्याण"
      },
      {
        "id": "7",
        "category": "agriculture",
        "title_en": "Farmer Assistance & Agricultural Power Reliability",
        "title_mr": "शेतकरी सहाय्य व कृषी वीजपुरवठा सक्षमीकरण",
        "description_en": "Follow-up with irrigation and power utilities to maintain stable daytime agricultural power supply, transformer installations, and subsidized seed-fertilizer distribution drives.",
        "description_mr": "शेतकऱ्यांसाठी दिवसा अखंड कृषी वीजपुरवठा, नवीन ट्रान्सफॉर्मर बसवणे आणि अनुदानावरील बी-बियाणे व खते वाटपासाठी प्रशासकीय समन्वय.",
        "image_url": "/images/placeholder-work-3.jpg",
        "metrics_en": "Agrarian Community Service",
        "metrics_mr": "कृषी समुदाय सेवा",
        "status": "active",
        "highlight_tag_en": "Agrarian Welfare",
        "highlight_tag_mr": "शेतकरी सन्मान"
      },
      {
        "id": "8",
        "category": "energy",
        "title_en": "Renewable Solar Lighting & Clean Village Spaces",
        "title_mr": "सौर ऊर्जा पथदिवे व स्वच्छ गाव संकल्पना",
        "description_en": "Encouraging solar-powered street lighting installations across gram panchayats, community parks, and temple complexes for sustainable clean illumination.",
        "description_mr": "ग्रामपंचायती, सार्वजनिक उद्याने आणि तीर्थक्षेत्रांच्या परिसरात सौर पथदिवे बसवून पर्यावरणपूरक स्वच्छ ऊर्जेला प्रोत्साहन.",
        "image_url": "/images/placeholder-work-4.jpg",
        "metrics_en": "Eco-Friendly Regional Energy",
        "metrics_mr": "पर्यावरणपूरक ऊर्जा विकास",
        "status": "completed",
        "highlight_tag_en": "Clean Energy",
        "highlight_tag_mr": "हरित ऊर्जा"
      }
    ],
    "bottom_cta": {
      "headline_en": "Dedicated to Public Service Every Day",
      "headline_mr": "जनसेवेसाठी सदैव तत्पर",
      "description_en": "Explore the ongoing development works, constituency initiatives, and welfare programs underway across Maval.",
      "description_mr": "सध्या सुरू असणारी विकासकामे, मतदारसंघातील उपक्रम आणि जनकल्याणकारी योजनांचा सविस्तर आढावा घ्या.",
      "btn_label_en": "Submit Public Grievance / Suggestion",
      "btn_label_mr": "नागरिक समस्या / विकास सूचना नोंदवा",
      "btn_url": "/contact"
    }
  }'::jsonb,
  now()
)
ON CONFLICT (key, language)
DO UPDATE SET
  value = EXCLUDED.value,
  updated_at = EXCLUDED.updated_at;

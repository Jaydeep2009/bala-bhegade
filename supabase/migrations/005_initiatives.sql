-- ============================================================
-- Migration: 005_initiatives.sql
-- Description: Seed documented public activities for Bala Bhegade
-- into site_settings ('public_work').
-- ============================================================

-- Ensure site_settings write permissions for seamless admin sync
DROP POLICY IF EXISTS "Anyone can modify site settings" ON public.site_settings;
CREATE POLICY "Anyone can modify site settings" ON public.site_settings FOR ALL USING (true) WITH CHECK (true);

-- Upsert the documented initiatives and civic projects into site_settings
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

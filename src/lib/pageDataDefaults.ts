export interface AboutHeroData {
  badge_en: string;
  badge_mr: string;
  name_en: string;
  name_mr: string;
  title_en: string;
  title_mr: string;
  bio_summary_en: string;
  bio_summary_mr: string;
  profile_image: string;
  stat_terms: number;
  stat_terms_label_en: string;
  stat_terms_label_mr: string;
  stat_role_en: string;
  stat_role_desc_en: string;
  stat_role_desc_mr: string;
  stat_region_en: string;
  stat_region_desc_en: string;
  stat_region_desc_mr: string;
}

export interface AboutChapterItem {
  id: string;
  title_en: string;
  title_mr: string;
  content_en: string;
  content_mr: string;
}

export interface AboutValueItem {
  id: string;
  icon_name: string;
  title_en: string;
  title_mr: string;
  description_en: string;
  description_mr: string;
}

export interface AboutMilestoneItem {
  id: string;
  year: string;
  title_en: string;
  title_mr: string;
  description_en: string;
  description_mr: string;
  tag_en: string;
  tag_mr: string;
}

export interface AboutBottomCtaData {
  headline_en: string;
  headline_mr: string;
  description_en: string;
  description_mr: string;
  btn1_label_en: string;
  btn1_label_mr: string;
  btn1_url: string;
  btn2_label_en: string;
  btn2_label_mr: string;
  btn2_url: string;
}

export interface AboutPageData {
  hero: AboutHeroData;
  quote: {
    text_en: string;
    text_mr: string;
    author_en: string;
    author_mr: string;
  };
  chapters: AboutChapterItem[];
  values: AboutValueItem[];
  milestones: AboutMilestoneItem[];
  bottom_cta: AboutBottomCtaData;
}

export interface PublicWorkItem {
  id: string;
  category:
    | 'infrastructure'
    | 'healthcare'
    | 'education'
    | 'water'
    | 'youth'
    | 'women'
    | 'agriculture'
    | 'energy'
    | 'administration'
    | 'welfare';
  title_en: string;
  title_mr: string;
  description_en: string;
  description_mr: string;
  image_url: string;
  metrics_en: string;
  metrics_mr: string;
  status: 'ongoing' | 'active' | 'completed' | 'historical' | 'unverified';
  highlight_tag_en: string;
  highlight_tag_mr: string;
  source_url?: string;
}

export interface PublicWorkPageData {
  header: {
    badge_en: string;
    badge_mr: string;
    title_en: string;
    title_mr: string;
    subtitle_en: string;
    subtitle_mr: string;
  };
  initiatives: PublicWorkItem[];
  bottom_cta: {
    headline_en: string;
    headline_mr: string;
    description_en: string;
    description_mr: string;
    btn_label_en: string;
    btn_label_mr: string;
    btn_url: string;
  };
}

export interface OfficeLocation {
  id: string;
  name_en: string;
  name_mr: string;
  role_en: string;
  role_mr: string;
  address_en: string;
  address_mr: string;
  phone: string;
  email: string;
  hours_en: string;
  hours_mr: string;
  is_primary: boolean;
}

export interface ContactPageData {
  header: {
    badge_en: string;
    badge_mr: string;
    title_en: string;
    title_mr: string;
    subtitle_en: string;
    subtitle_mr: string;
  };
  offices: OfficeLocation[];
  helpline: {
    phone: string;
    label_en: string;
    label_mr: string;
  };
  grievance_email: string;
  visiting_notice_en: string;
  visiting_notice_mr: string;
}

export interface PrivacySectionItem {
  id: string;
  icon_name: string;
  title_en: string;
  title_mr: string;
  content_en: string;
  content_mr: string;
}

export interface PrivacyPageData {
  last_updated: string;
  title_en: string;
  title_mr: string;
  subtitle_en: string;
  subtitle_mr: string;
  sections: PrivacySectionItem[];
}

// ============================================================
// DEFAULTS
// ============================================================

export const DEFAULT_ABOUT_PAGE_DATA: AboutPageData = {
  hero: {
    badge_en: 'Biography & Leadership Journey',
    badge_mr: 'जीवनप्रवास आणि नेतृत्व प्रवास',
    name_en: 'Sanjay (Bala) Vishwanath Bhegade',
    name_mr: 'संजय (बाळा) विश्वनाथ भेगडे',
    title_en: 'Former Minister of State, Maharashtra | Former MLA, Maval (2009–2019)',
    title_mr: 'माजी राज्यमंत्री, महाराष्ट्र शासन | माजी आमदार, मावळ (२००९–२०१९)',
    bio_summary_en:
      'A seasoned public leader associated with Maval in Pune district, Maharashtra. Having served a decade in the Maharashtra Legislative Assembly and as Minister of State, his public journey remains anchored in grassroots constituent service and balanced regional development.',
    bio_summary_mr:
      'पुणे जिल्ह्यातील मावळ परिसराशी संबंधित ज्येष्ठ राजकीय नेते. महाराष्ट्र विधानसभेत सलग दहा वर्षे आमदार म्हणून आणि राज्यमंत्री म्हणून कार्य केल्यानंतरही, तळागाळातील नागरिकांशी थेट संवाद आणि प्रादेशिक विकासासाठी ते सातत्याने कार्यरत आहेत.',
    profile_image: '/images/bala-bhegade-portrait.png',
    stat_terms: 2,
    stat_terms_label_en: 'MLA, Maval (2009–2019)',
    stat_terms_label_mr: 'मावळ आमदार (२००९–२०१९)',
    stat_role_en: 'MoS',
    stat_role_desc_en: 'Minister of State (2019)',
    stat_role_desc_mr: 'राज्यमंत्री, महाराष्ट्र (२०१९)',
    stat_region_en: 'Maval',
    stat_region_desc_en: 'Pune District, Maharashtra',
    stat_region_desc_mr: 'पुणे जिल्हा, महाराष्ट्र',
  },
  quote: {
    text_en:
      'संकल्प मावळच्या सर्वांगीण विकासाचा — True leadership is rooted in continuous dialogue with the people, understanding grassroots priorities, and working transparently for balanced regional progress.',
    text_mr:
      'संकल्प मावळच्या सर्वांगीण विकासाचा — जनतेशी अखंड संवाद, तळागाळातील समस्यांची जाण आणि सर्वांगीण विकासासाठी पारदर्शक कार्य हीच जनसेवेची खरी व्याख्या आहे.',
    author_en: 'Sanjay (Bala) Vishwanath Bhegade',
    author_mr: 'संजय (बाळा) विश्वनाथ भेगडे',
  },
  chapters: [
    {
      id: 'ch-1',
      title_en: 'Political Journey & Legislative Mandate (2009–2019)',
      title_mr: 'राजकीय प्रवास व विधिमंडळ कार्यकाळ (२००९–२०१९)',
      content_en:
        'Sanjay (Bala) Vishwanath Bhegade is a political figure associated with Maval in Pune district, Maharashtra. He began his reported political journey through youth organisation work in 2004, serving as president of the Maval taluka Bharatiya Janata Yuva Morcha, dedicated to building active youth networks across regional villages.\n\nIn 2009, he contested and won the Maharashtra Legislative Assembly election from the Maval constituency. Re-elected with an overwhelming mandate in 2014, he served a decade as Member of the Legislative Assembly, continuously raising regional developmental requirements, rural road connectivity, and community issues on the floor of the House.',
      content_mr:
        'संजय (बाळा) विश्वनाथ भेगडे हे पुणे जिल्ह्यातील मावळ परिसराशी संबंधित प्रमुख राजकीय नेते आहेत. त्यांनी २००४ मध्ये युवा संघटनेच्या माध्यमातून राजकीय प्रवासाला सुरुवात केली. मावळ तालुका भारतीय जनता युवा मोर्चाच्या अध्यक्षपदावरून त्यांनी ग्रामीण भागातील तरुणांचे सशक्त संघटन उभे केले.\n\n२००९ च्या विधानसभा निवडणुकीत मावळ मतदारसंघातून ते पहिल्यांदा आमदार म्हणून निवडून आले. त्यानंतर २०१४ मध्ये जनतेने त्यांच्यावर पुन्हा विश्वास दाखवत त्यांना सलग दुसऱ्यांदा विधानसभेत पाठवले. या दहा वर्षांच्या कार्यकाळात त्यांनी मावळच्या ग्रामीण व नागरी भागातील विविध विकासप्रश्नांना विधिमंडळात वाचा फोडली.',
    },
    {
      id: 'ch-2',
      title_en: 'State Ministerial Responsibilities (2019)',
      title_mr: 'मंत्रिमंडळ जबाबदाऱ्या व राज्यस्तरीय कार्य (२०१९)',
      content_en:
        'On 16 June 2019, he was inducted into the Maharashtra State Cabinet as Minister of State. During his ministerial tenure, he was entrusted with critical portfolios including Labour, Environment, Relief and Rehabilitation, and Earthquake Rehabilitation, directing policy deliberations and administrative interventions across Maharashtra.',
      content_mr:
        '१६ जून २०१९ रोजी त्यांची महाराष्ट्र शासनाच्या राज्यमंत्रीपदी नियुक्ती करण्यात आली. या काळात त्यांच्याकडे कामगार, पर्यावरण, मदत व पुनर्वसन आणि भूकंप पुनर्वसन या महत्त्वाच्या खात्यांची धुरा सोपवण्यात आली होती. या जबाबदाऱ्या पार पाडताना त्यांनी धोरणात्मक निर्णय आणि प्रशासकीय समन्वयावर भर दिला.',
    },
    {
      id: 'ch-3',
      title_en: 'Constituency Public Life & Community Dialogue',
      title_mr: 'मतदारसंघातील जनसंपर्क व सामाजिक कार्य',
      content_en:
        'Throughout his career, Sanjay (Bala) Bhegade has maintained deep local connections across Talegaon Dabhade, Wadgaon Maval, and rural gram panchayat clusters. In 2023, he was appointed vice-president of the Maharashtra BJP unit. His public engagement continues through direct dialogue with citizens, participation in community forums, and addressing civic priorities.',
      content_mr:
        'आपल्या संपूर्ण राजकीय प्रवासात संजय (बाळा) भेगडे यांनी तळेगाव दाभाडे, वडगाव मावळ तसेच ग्रामीण भागातील नागरिकांशी थेट संपर्क कायम ठेवला आहे. मे २०२३ मध्ये त्यांची महाराष्ट्र भाजपच्या प्रदेश उपाध्यक्षपदी निवड झाली होती. स्थानिक विकासकामांचा पाठपुरावा, सामाजिक उपक्रम आणि नागरिकांशी निरंतर संवाद हे त्यांच्या सार्वजनिक जीवनाचे वैशिष्ट्य राहिले आहे.',
    },
  ],
  values: [
    {
      id: 'val-1',
      icon_name: 'ShieldCheck',
      title_en: 'Integrity & Transparency',
      title_mr: 'पारदर्शकता आणि सचोटी',
      description_en:
        'Maintaining the highest standards of ethics, accountability, and clarity in all public works and administrative allocations.',
      description_mr:
        'सार्वजनिक कामे आणि निधी वाटपात नैतिकता, उत्तरदायित्व आणि पारदर्शकतेची कठोर अंमलबजावणी.',
    },
    {
      id: 'val-2',
      icon_name: 'Sprout',
      title_en: 'Agricultural Dignity',
      title_mr: 'शेतकरी सन्मान व समृद्धी',
      description_en:
        'Empowering farmers with modern irrigation, fair market access, crop insurance support, and sustainable water solutions.',
      description_mr:
        'शेतकऱ्यांना आधुनिक जलसिंचन, योग्य बाजारपेठ आणि शाश्वत शेतीसाठी सर्वतोपरी सहाय्य.',
    },
    {
      id: 'val-3',
      icon_name: 'GraduationCap',
      title_en: 'Youth & Quality Education',
      title_mr: 'युवा सक्षमीकरण व गुणवत्तापूर्ण शिक्षण',
      description_en:
        'Fostering vocational training, competitive exam guidance, and modern school infrastructure for rural youth.',
      description_mr:
        'ग्रामीण भागातील तरुणांना कौशल्य प्रशिक्षण, स्पर्धा परीक्षा मार्गदर्शन आणि आधुनिक शाळांच्या सुविधा.',
    },
    {
      id: 'val-4',
      icon_name: 'Users',
      title_en: 'Inclusive Social Welfare',
      title_mr: 'सर्वसमावेशक समाजकल्याण',
      description_en:
        'Uplifting women through self-help groups, providing senior citizen care networks, and ensuring dignified healthcare for all.',
      description_mr:
        'महिला बचत गटांना बळ, ज्येष्ठ नागरिकांना सन्मान आणि प्रत्येक कुटुंबासाठी आरोग्य सेवांची हमी.',
    },
    {
      id: 'val-5',
      icon_name: 'Award',
      title_en: 'Sustainable Regional Growth',
      title_mr: 'शाश्वत प्रादेशिक विकास',
      description_en:
        'Balancing rapid economic development with environmental stewardship, clean energy, and cultural preservation.',
      description_mr:
        'पर्यावरणाचे रक्षण, हरित ऊर्जा आणि संस्कृती जपत वेगाने होणारा शाश्वत सर्वांगीण विकास.',
    },
    {
      id: 'val-6',
      icon_name: 'HeartHandshake',
      title_en: 'Grassroots Accessibility',
      title_mr: 'तळागाळातील संवाद व सहज उपलब्धता',
      description_en:
        'Continuous presence in regional villages and open constituent dialogue to understand and solve everyday problems.',
      description_mr:
        'गावागावांत सातत्यपूर्ण उपस्थिती आणि नागरिकांशी थेट संवाद साधून दैनंदिन समस्यांचे तत्काळ निवारण.',
    },
  ],
  milestones: [
    {
      id: 'm-1',
      year: '2004',
      title_en: 'Grassroots Political Organisation',
      title_mr: 'तळागाळातील युवा संघटना कार्य',
      description_en:
        'Reported start of his political career as president of the Maval taluka Bharatiya Janata Yuva Morcha, dedicated to building youth networks across regional villages.',
      description_mr:
        'मावळ तालुका भारतीय जनता युवा मोर्चाच्या अध्यक्षपदावरून राजकीय प्रवासाची सुरुवात; ग्रामीण भागातील युवकांचे संघटन व समाजकार्य.',
      tag_en: 'Youth Leadership',
      tag_mr: 'युवा नेतृत्व',
    },
    {
      id: 'm-2',
      year: '2009',
      title_en: 'First Election to Maharashtra Assembly',
      title_mr: 'विधानसभेत प्रथमच लोकप्रतिनिधी म्हणून निवड',
      description_en:
        'Elected as the Member of Legislative Assembly (MLA) from the Maval constituency, initiating a decade of legislative representation in Maharashtra.',
      description_mr:
        'मावळ विधानसभा मतदारसंघातून प्रथमच आमदार म्हणून जनतेचा कौल; विधिमंडळात मतदारसंघाच्या प्रश्नांना प्रभावीपणे मांडण्यास सुरुवात.',
      tag_en: 'Assembly Mandate',
      tag_mr: 'विधिमंडळ टप्पा',
    },
    {
      id: 'm-3',
      year: '2014',
      title_en: 'Second Consecutive Assembly Mandate',
      title_mr: 'सलग दुसऱ्यांदा विधानसभेत फेरनिवड',
      description_en:
        'Re-elected to the Maharashtra Legislative Assembly from Maval with a strong public mandate, serving his second consecutive term.',
      description_mr:
        'मावळ मतदारसंघातून सलग दुसऱ्यांदा भरघोस मताधिक्याने फेरनिवड; ग्रामीण व नागरी विकासाला गती देणारे कार्य.',
      tag_en: 'Re-election',
      tag_mr: 'दुसरा कार्यकाळ',
    },
    {
      id: 'm-4',
      year: '2019',
      title_en: 'Minister of State, Government of Maharashtra',
      title_mr: 'महाराष्ट्र शासन राज्यमंत्रिपद',
      description_en:
        'Sworn in on 16 June 2019 as Minister of State in the Government of Maharashtra, holding responsibilities for Labour, Environment, Relief and Rehabilitation, and Earthquake Rehabilitation.',
      description_mr:
        '१६ जून २०१९ रोजी महाराष्ट्र शासनाच्या राज्यमंत्रीपदी नियुक्ती; कामगार, पर्यावरण, मदत व पुनर्वसन आणि भूकंप पुनर्वसन खात्यांची जबाबदारी सांभाळली.',
      tag_en: 'State Ministerial Role',
      tag_mr: 'मंत्रिमंडळ जबाबदारी',
    },
    {
      id: 'm-5',
      year: '2023',
      title_en: 'State Party Leadership Appointment',
      title_mr: 'प्रदेश उपाध्यक्ष, महाराष्ट्र भाजप',
      description_en:
        'Appointed Vice President of the Bharatiya Janata Party Maharashtra unit in May 2023, expanding organizational and developmental leadership across the state.',
      description_mr:
        'मे २०२३ मध्ये महाराष्ट्र प्रदेश भाजपच्या उपाध्यक्षपदी नियुक्ती; राज्यस्तरीय पक्ष संघटन आणि जनसंपर्काची मोठी जबाबदारी.',
      tag_en: 'Organizational Leadership',
      tag_mr: 'पक्ष संघटन नेतृत्व',
    },
  ],
  bottom_cta: {
    headline_en: 'Dedicated to Public Service Every Day',
    headline_mr: 'जनसेवेसाठी सदैव तत्पर',
    description_en:
      'Explore the ongoing development works, constituency initiatives, and welfare programs underway across Maval.',
    description_mr:
      'सध्या सुरू असणारी विकासकामे, मतदारसंघातील उपक्रम आणि जनकल्याणकारी योजनांचा सविस्तर आढावा घ्या.',
    btn1_label_en: 'View Public Initiatives',
    btn1_label_mr: 'सार्वजनिक उपक्रम पहा',
    btn1_url: '/public-work',
    btn2_label_en: 'Contact Office',
    btn2_label_mr: 'कार्यालयाशी संपर्क',
    btn2_url: '/contact',
  },
};

export const DEFAULT_PUBLIC_WORK_PAGE_DATA: PublicWorkPageData = {
  header: {
    badge_en: 'Constituency Development & Initiatives',
    badge_mr: 'मतदारसंघ विकास व सार्वजनिक कार्य',
    title_en: 'Public Works & Civic Initiatives',
    title_mr: 'सार्वजनिक विकासकामे व जनकल्याण उपक्रम',
    subtitle_en:
      'Documented developmental interventions, rural infrastructure projects, and community welfare programs across Maval taluka.',
    subtitle_mr:
      'मावळ तालुक्यातील ग्रामीण व नागरी भागातील रस्ते, पाणी, शिक्षण, आरोग्य आणि समाजकल्याण क्षेत्रातील प्रमुख विकासकामांचा आढावा.',
  },
  initiatives: [
    {
      id: 'pw-dehuroad-flyover',
      category: 'infrastructure',
      title_en: 'Dehu Road Flyover & Infrastructure Development',
      title_mr: 'देहूरोड उड्डाणपूल व पायाभूत सुविधा विकास',
      description_en:
        'Continuous advocacy, administrative coordination, and follow-up for the Dehu Road flyover project and associated road networks to relieve traffic congestion and strengthen connectivity across the Maval region.',
      description_mr:
        'देहूरोड उड्डाणपूल आणि परिसरातील रस्ते प्रकल्पांसाठी सातत्यपूर्ण पाठपुरावा, प्रशासकीय समन्वय आणि वाहतूक कोंडी सोडवण्यासाठी विशेष प्रयत्न, ज्यामुळे मावळ परिसरातील संपर्क अधिक सक्षम होईल.',
      image_url: '/images/initiatives/entry-1-dehuroad-flyover.jpg',
      metrics_en: 'Roads, flyover and local infrastructure',
      metrics_mr: 'रस्ते, उड्डाणपूल आणि स्थानिक पायाभूत सुविधा',
      status: 'historical',
      highlight_tag_en: 'Infrastructure Development',
      highlight_tag_mr: 'पायाभूत सुविधा विकास',
      source_url:
        'https://www.esakal.com/pune/maharashtra-vidhansabha-2019-maval-constituency-bala-bhegade-dehuroad-flyover-225574',
    },
    {
      id: 'pw-rice-planting-vadgaon',
      category: 'agriculture',
      title_en: 'Connecting with Farmers Through Rice Planting',
      title_mr: 'भात लावणीच्या माध्यमातून शेतकऱ्यांशी थेट संवाद',
      description_en:
        'Directly connecting with the farming community by stepping into the muddy fields during monsoon rice transplantation in Vadgaon Maval, understanding farmers\' practical concerns, and emphasizing the dignity of agricultural labor.',
      description_mr:
        'वडगाव मावळ येथे पावसाळ्यात भात लावणीच्या वेळी चिखलात उतरून शेतकऱ्यांशी थेट संवाद साधला, त्यांच्या अडचणी समजून घेतल्या आणि शेतीकामाचे महत्त्व अधोरेखित केले.',
      image_url: '/images/initiatives/entry-2-rice-planting.jpg',
      metrics_en: 'Direct farm visits and rice transplantation',
      metrics_mr: 'थेट शेतावर जाऊन भात लावणी व संवाद',
      status: 'historical',
      highlight_tag_en: 'Agricultural Connection',
      highlight_tag_mr: 'कृषी संवाद',
      source_url:
        'https://www.tv9marathi.com/politics/minister-for-state-mla-bala-bhegade-visit-farm-sowing-rice-with-farmers-79753.html',
    },
    {
      id: 'pw-panchayat-samiti-review',
      category: 'administration',
      title_en: 'Review of Public Development Works',
      title_mr: 'सार्वजनिक विकासकामांचा आढावा व प्रशासकीय समन्वय',
      description_en:
        'Convened a review meeting with administrative heads of various government departments at the Maval Panchayat Samiti to expedite stalled public works, review monsoon readiness, and prioritize citizen grievances.',
      description_mr:
        'मावळ पंचायत समिती येथे विविध शासकीय विभागांच्या अधिकाऱ्यांची आढावा बैठक घेऊन रखडलेल्या विकासकामांना गती देणे, पावसाळ्यातील पूर्वतयारी आणि नागरिकांच्या तक्रारींचे निवारण यावर चर्चा केली.',
      image_url: '/images/initiatives/entry-3-panchayat-samiti-review.jpg',
      metrics_en: 'Coordination meeting with Panchayat Samiti officials',
      metrics_mr: 'पंचायत समिती अधिकाऱ्यांसोबत समन्वय बैठक',
      status: 'historical',
      highlight_tag_en: 'Administrative Review',
      highlight_tag_mr: 'प्रशासकीय आढावा',
      source_url:
        'https://dainikmaval.com/bjp-bala-bhegde-held-meeting-of-officials-of-various-departments-at-panchayat-samiti-maval/',
    },
    {
      id: 'pw-welfare-scheme-center',
      category: 'welfare',
      title_en: 'Government Welfare Scheme Information Centre',
      title_mr: 'शासकीय योजना माहिती व मदत केंद्र',
      description_en:
        'Established a citizen assistance center at Talegaon Dabhade to make central and state government welfare schemes accessible to the public, assist in application documentation, and track service delivery to the grassroots.',
      description_mr:
        'केंद्र व राज्य शासनाच्या जनकल्याणकारी योजना सामान्य नागरिकांपर्यंत पोहोचवण्यासाठी, अर्जांची पूर्तता करण्यासाठी आणि योजनांचा थेट लाभ मिळवून देण्यासाठी तळेगाव दाभाडे येथे मदत केंद्र सुरू केले.',
      image_url: '',
      metrics_en: 'Talegaon Dabhade information center for central and state schemes',
      metrics_mr: 'तळेगाव दाभाडे येथे केंद्र व राज्य योजनांचे माहिती केंद्र',
      status: 'historical',
      highlight_tag_en: 'Citizen Services',
      highlight_tag_mr: 'नागरिक सेवा',
      source_url:
        'https://timesofindia.indiatimes.com/city/pune/bjp-war-room-in-talegaon-dabhade/articleshow/53558404.cms',
    },
    {
      id: 'pw-ajivali-village-works',
      category: 'infrastructure',
      title_en: 'Ajivali Village Development Works',
      title_mr: 'आजीवली गाव विकासकामे व भूमिपूजन',
      description_en:
        'Groundbreaking (Bhoomi Pujan) ceremonies for village-level developmental works in Ajivali, including internal road improvements, community amenities, and basic public infrastructure in the Gram Panchayat jurisdiction.',
      description_mr:
        'आजीवली ग्रामपंचायत क्षेत्रातील अंतर्गत रस्ते, समाजमंदिर आणि मूलभूत पायाभूत सुविधांच्या विविध विकासकामांचे भूमिपूजन व स्थानिक नागरिकांशी संवाद.',
      image_url: '/images/initiatives/entry-5-ajivali-bhoomi-pujan.jpg',
      metrics_en: 'Gram Panchayat development projects',
      metrics_mr: 'ग्रामपंचायत विकासकामे',
      status: 'historical',
      highlight_tag_en: 'Village Infrastructure',
      highlight_tag_mr: 'ग्रामीण पायाभूत सुविधा',
      source_url:
        'https://dainikmaval.com/ajivali-village-development-works-bhoomi-pujan-by-bjp-ravindra-bhegde/',
    },
    {
      id: '1',
      category: 'infrastructure',
      title_en: 'Rural Road Connectivity & Bridge Modernization',
      title_mr: 'ग्रामीण रस्ते जोडणी व पूल आधुनिकीकरण प्रकल्प',
      description_en:
        'Continuous advocacy for asphalt road networks and bridge connectivity linking agricultural wadis and remote villages across Maval taluka to major trade and transit corridors.',
      description_mr:
        'मावळ तालुक्यातील दुर्गम शेतकरी वाड्या-वस्त्यांना मुख्य बाजारपेठेशी जोडणाऱ्या पक्क्या डांबरी रस्त्यांचे जाळे आणि पुलांच्या कामांसाठी सातत्यपूर्ण प्रशासकीय पाठपुरावा.',
      image_url: '/images/placeholder-work-1.jpg',
      metrics_en: 'Maval Constituency Connectivity Focus',
      metrics_mr: 'मावळ विधानसभा ग्रामीण दळणवळण कार्यक्षेत्र',
      status: 'completed',
      highlight_tag_en: 'Connectivity',
      highlight_tag_mr: 'दळणवळण',
    },
    {
      id: '2',
      category: 'healthcare',
      title_en: 'Rural Health Infrastructure & Diagnostic Support',
      title_mr: 'ग्रामीण आरोग्य पायाभूत सुविधा व तपासणी सहाय्य',
      description_en:
        'Strengthening primary healthcare centers (PHCs) and community outreach camps to provide essential medicines, health screenings, and medical aid across rural Maval.',
      description_mr:
        'प्राथमिक आरोग्य केंद्रांचे सक्षमीकरण आणि मोफत आरोग्य तपासणी शिबिरांच्या माध्यमातून ग्रामीण भागातील नागरिकांना दर्जेदार वैद्यकीय सेवा उपलब्ध करून देणे.',
      image_url: '/images/placeholder-work-2.jpg',
      metrics_en: 'Primary Health & Diagnostic Access',
      metrics_mr: 'प्राथमिक आरोग्य व तपासणी सुविधा',
      status: 'active',
      highlight_tag_en: 'Healthcare',
      highlight_tag_mr: 'आरोग्य सेवा',
    },
    {
      id: '3',
      category: 'education',
      title_en: 'School Modernization & Rural Study Centers',
      title_mr: 'शाळा आधुनिकीकरण व ग्रामीण अभ्यासिका',
      description_en:
        'Promoting improved infrastructure in Zilla Parishad schools, supporting digital learning tools, and establishing local study libraries for competitive exam students.',
      description_mr:
        'जिल्हा परिषद शाळांच्या भौतिक सुविधांचा विकास, डिजिटल शिक्षणास प्रोत्साहन आणि स्पर्धा परीक्षांच्या विद्यार्थ्यांसाठी स्थानिक अभ्यासिकांची उभारणी.',
      image_url: '/images/placeholder-work-3.jpg',
      metrics_en: 'Educational Infrastructure Support',
      metrics_mr: 'शैक्षणिक सुविधा सक्षमीकरण',
      status: 'active',
      highlight_tag_en: 'Education',
      highlight_tag_mr: 'गुणवत्तापूर्ण शिक्षण',
    },
    {
      id: '4',
      category: 'water',
      title_en: 'Watershed Conservation & Water Security',
      title_mr: 'जलसंधारण, बंधारे व जलस्रोत संवर्धन',
      description_en:
        'Advocating watershed management, desilting of local water bodies, and check-dam constructions to strengthen irrigation support for farmers and stabilize regional water levels.',
      description_mr:
        'शेतकऱ्यांच्या सिंचन सुविधेसाठी आणि भूजल पातळी सुधारण्यासाठी बंधारे, तलाव खोलीकरण व जलसंधारण कामांवर सातत्यपूर्ण भर.',
      image_url: '/images/placeholder-work-4.jpg',
      metrics_en: 'Watershed & Water Resource Stewardship',
      metrics_mr: 'जलसंधारण व जलस्रोत संवर्धन',
      status: 'active',
      highlight_tag_en: 'Water Stewardship',
      highlight_tag_mr: 'जलसंधारण',
    },
    {
      id: '5',
      category: 'youth',
      title_en: 'Youth Skill Development & Vocational Guidance',
      title_mr: 'युवा कौशल्य विकास व रोजगार मार्गदर्शन',
      description_en:
        'Facilitating vocational skill workshops, recruitment career fairs, and entrepreneurial orientation for educated youth residing in taluka villages and townships.',
      description_mr:
        'मावळ परिसरातील सुशिक्षित बेरोजगार तरुणांसाठी व्यावसायिक कौशल्य कार्यशाळा, रोजगार मेळावे आणि उद्योजकता मार्गदर्शन सत्रे.',
      image_url: '/images/placeholder-work-1.jpg',
      metrics_en: 'Taluka Skill Empowerment Outreach',
      metrics_mr: 'तालुका युवा कौशल्य उपक्रम',
      status: 'ongoing',
      highlight_tag_en: 'Youth Skills',
      highlight_tag_mr: 'युवा कौशल्य',
    },
    {
      id: '6',
      category: 'women',
      title_en: 'Women Empowerment & Self-Help Group Financing',
      title_mr: 'महिला सक्षमीकरण व बचत गट आर्थिक बळ',
      description_en:
        'Supporting Mahila Bachat Gats (self-help groups) with institutional finance linkage, exhibition stalls for regional products, and legal-health awareness programs.',
      description_mr:
        'महिला बचत गटांना बँक अर्थसहाय्य, स्थानिक उत्पादनांच्या विक्रीसाठी प्रदर्शने आणि महिला आरोग्य व हक्क जनजागृती मोहिमा.',
      image_url: '/images/placeholder-work-2.jpg',
      metrics_en: 'Women Self-Reliance Networks',
      metrics_mr: 'महिला स्वयंसहाय्यता नेटवर्क',
      status: 'completed',
      highlight_tag_en: 'Women Welfare',
      highlight_tag_mr: 'महिला कल्याण',
    },
    {
      id: '7',
      category: 'agriculture',
      title_en: 'Farmer Assistance & Agricultural Power Reliability',
      title_mr: 'शेतकरी सहाय्य व कृषी वीजपुरवठा सक्षमीकरण',
      description_en:
        'Follow-up with irrigation and power utilities to maintain stable daytime agricultural power supply, transformer installations, and subsidized seed-fertilizer distribution drives.',
      description_mr:
        'शेतकऱ्यांसाठी दिवसा अखंड कृषी वीजपुरवठा, नवीन ट्रान्सफॉर्मर बसवणे आणि अनुदानावरील बी-बियाणे व खते वाटपासाठी प्रशासकीय समन्वय.',
      image_url: '/images/placeholder-work-3.jpg',
      metrics_en: 'Agrarian Community Service',
      metrics_mr: 'कृषी समुदाय सेवा',
      status: 'active',
      highlight_tag_en: 'Agrarian Welfare',
      highlight_tag_mr: 'शेतकरी सन्मान',
    },
    {
      id: '8',
      category: 'energy',
      title_en: 'Renewable Solar Lighting & Clean Village Spaces',
      title_mr: 'सौर ऊर्जा पथदिवे व स्वच्छ गाव संकल्पना',
      description_en:
        'Encouraging solar-powered street lighting installations across gram panchayats, community parks, and temple complexes for sustainable clean illumination.',
      description_mr:
        'ग्रामपंचायती, सार्वजनिक उद्याने आणि तीर्थक्षेत्रांच्या परिसरात सौर पथदिवे बसवून पर्यावरणपूरक स्वच्छ ऊर्जेला प्रोत्साहन.',
      image_url: '/images/placeholder-work-4.jpg',
      metrics_en: 'Eco-Friendly Regional Energy',
      metrics_mr: 'पर्यावरणपूरक ऊर्जा विकास',
      status: 'active',
      highlight_tag_en: 'Clean Energy',
      highlight_tag_mr: 'स्वच्छ ऊर्जा',
    },
  ],
  bottom_cta: {
    headline_en: 'Dedicated to Continuing Sustainable Constituency Progress',
    headline_mr: 'मावळच्या अखंड विकासासाठी कटिबद्ध',
    description_en:
      'Have suggestions for regional development projects or community priorities? Submit your thoughts directly to our planning cell.',
    description_mr:
      'आपल्या भागातील रस्ते, पाणी किंवा नागरी सुविधांबाबत काही सूचना आहेत का? जनसंपर्क कार्यालयाशी संपर्क साधा.',
    btn_label_en: 'Submit Community Suggestion',
    btn_label_mr: 'विकासकामांची सूचना पाठवा',
    btn_url: '/contact',
  },
};

export const DEFAULT_CONTACT_PAGE_DATA: ContactPageData = {
  header: {
    badge_en: 'Constituent Outreach',
    badge_mr: 'जनसंपर्क कक्ष',
    title_en: 'Get in Touch with Bala Bhegade Office',
    title_mr: 'बाळा भेगडे यांच्या जनसंपर्क कार्यालयाशी संपर्क साधा',
    subtitle_en:
      'Our doors and communication lines are always open for citizens. Reach out with your concerns, suggestions, or community proposals.',
    subtitle_mr:
      'नागरिकांच्या समस्या, विकासकामांच्या सूचना आणि निवेदनांसाठी जनसंपर्क कार्यालय सदैव तत्पर आहे.',
  },
  offices: [
    {
      id: 'off-1',
      name_en: 'Central Public Office (Talegaon Dabhade)',
      name_mr: 'मध्यवर्ती जनसंपर्क कार्यालय (तळेगाव दाभाडे)',
      role_en: 'Headquarters & Constituency Liaison',
      role_mr: 'मुख्य कार्यालय व मतदारसंघ समन्वय कक्ष',
      address_en:
        'Central Public Liaison Office, Near Maruti Mandir, Station Road, Talegaon Dabhade, Taluka Maval, District Pune, Maharashtra 410506',
      address_mr:
        'मध्यवर्ती जनसंपर्क कार्यालय, मारुती मंदिराशेजारी, स्टेशन रोड, तळेगाव दाभाडे, तालुका मावळ, जिल्हा पुणे, महाराष्ट्र ४१०५०६',
      phone: '+91 (020) 2500-0100',
      email: 'contact@balabhegade.in',
      hours_en: 'Monday – Saturday: 9:30 AM – 6:30 PM',
      hours_mr: 'सोमवार ते शनिवार: स. ९:३० ते सायं. ६:३०',
      is_primary: true,
    },
    {
      id: 'off-2',
      name_en: 'Wadgaon Maval Taluka Office',
      name_mr: 'वडगाव मावळ तालुका जनसंपर्क कार्यालय',
      role_en: 'Sub-Division Grievance & Revenue Coordination',
      role_mr: 'तहसील व महसूल समन्वय जनसंपर्क कक्ष',
      address_en:
        'Near Tahsildar Office, Old Mumbai-Pune Highway, Wadgaon Maval, District Pune, Maharashtra 410506',
      address_mr:
        'तहसीलदार कार्यालयाजवळ, जुना मुंबई-पुणे महामार्ग, वडगाव मावळ, जिल्हा पुणे, महाराष्ट्र ४१०५०६',
      phone: '+91 (02114) 223300',
      email: 'wadgaon.office@balabhegade.in',
      hours_en: 'Monday – Friday: 10:00 AM – 5:00 PM',
      hours_mr: 'सोमवार ते शुक्रवार: स. १०:०० ते सायं. ५:००',
      is_primary: false,
    },
  ],
  helpline: {
    phone: '+91 98220 00000',
    label_en: '24/7 Citizen Emergency & Grievance Helpline',
    label_mr: '२४/७ नागरी आपत्कालीन व तक्रार निवारण हेल्पलाईन',
  },
  grievance_email: 'grievance@balabhegade.in',
  visiting_notice_en: 'Delegations and collective citizen representations are met on Tuesdays and Saturdays by prior registration.',
  visiting_notice_mr: 'सामूहिक शिष्टमंडळे आणि नागरिकांच्या बैठका मंगळवारी व शनिवारी पूर्वनोंदणीनुसार आयोजित केल्या जातात.',
};

export const DEFAULT_PRIVACY_PAGE_DATA: PrivacyPageData = {
  last_updated: 'October 2026',
  title_en: 'Privacy Policy',
  title_mr: 'गोपनीयता धोरण',
  subtitle_en:
    'Our commitment to transparency, citizen confidentiality, and responsible data protection across this official public service portal.',
  subtitle_mr:
    'नागरिकांची गोपनीयता, माहितीचे संरक्षण आणि पारदर्शक कारभाराप्रती आमची वचनबद्धता.',
  sections: [
    {
      id: 'collection',
      icon_name: 'FileText',
      title_en: '1. Information Collection',
      title_mr: '१. माहिती संकलन',
      content_en:
        'We collect personal information that you voluntarily provide when contacting our office, submitting public grievances, requesting appointments, or subscribing to constituency newsletters. This may include your name, mobile phone number, email address, residential village/taluka, and details of your inquiry. We do not collect sensitive biometric or financial data through this portal.',
      content_mr:
        'आमच्या कार्यालयाशी संपर्क साधताना, नागरी समस्या मांडताना, भेटीची वेळ मागताना अथवा प्रसिद्धीपत्रकांसाठी नोंदणी करताना तुम्ही स्वेच्छेने दिलेली वैयक्तिक माहिती संकलित केली जाते. आम्ही या पोर्टलवरून कोणताही गोपनीय आर्थिक डेटा गोळा करत नाही.',
    },
    {
      id: 'usage',
      icon_name: 'UserCheck',
      title_en: '2. Use of Information',
      title_mr: '२. माहितीचा वापर',
      content_en:
        'Collected information is used solely for public service and constituent communication purposes. Specifically, it enables us to respond to your inquiries, facilitate civic follow-ups with administrative departments, provide updates on local developmental initiatives, and inform you of upcoming public forums. We do not sell, rent, or trade your personal information to commercial third parties.',
      content_mr:
        'संकलित माहितीचा वापर केवळ जनसेवा आणि नागरिक संवादासाठी केला जातो. तुमच्या तक्रारींची दखल घेणे, शासकीय विभागांकडे पाठपुरावा करणे, स्थानिक विकासकामांचे वृत्त देणे यासाठीच या माहितीचा विनियोग होतो. आम्ही नागरिकांची माहिती कोणत्याही व्यावसायिक संस्थेला विकत अथवा भाड्याने देत नाही.',
    },
    {
      id: 'protection',
      icon_name: 'Lock',
      title_en: '3. Data Protection & Security',
      title_mr: '३. डेटा सुरक्षा व गोपनीयता',
      content_en:
        'We implement industry-standard administrative, technical, and physical safeguards to protect citizen information from unauthorized access, alteration, or disclosure. All web traffic is secured via encrypted HTTPS protocols, and administrative access is restricted to verified office personnel.',
      content_mr:
        'नागरिकांच्या माहितीचे अनधिकृत प्रवेश, फेरफार किंवा गैरवापरापासून रक्षण करण्यासाठी योग्य तांत्रिक आणि प्रशासकीय सुरक्षा मानके लागू करण्यात आली आहेत. संकेतस्थळावरील सर्व देवाणघेवाण एनक्रिप्टेड HTTPS प्रोटोकॉलद्वारे सुरक्षित आहे.',
    },
    {
      id: 'cookies',
      icon_name: 'Cookie',
      title_en: '4. Cookies & Web Technologies',
      title_mr: '४. कुकीज आणि वेब तंत्रज्ञान',
      content_en:
        'This website uses essential functional cookies to enhance your browsing experience, such as remembering your preferred language (English or Marathi). We may also use privacy-respecting analytics to gauge website performance and identify popular public resources. You may configure your browser to decline cookies, though certain navigational preferences may be affected.',
      content_mr:
        'हे संकेतस्थळ वापरकर्त्याचा अनुभव सुलभ करण्यासाठी आवश्यक फंक्शनल कुकीज वापरते (उदा. तुमची भाषा निवड - मराठी किंवा इंग्रजी लक्षात ठेवणे). आपण आपल्या ब्राउझरमध्ये कुकीज बंद करू शकता.',
    },
    {
      id: 'third-party',
      icon_name: 'Share2',
      title_en: '5. Third-Party Links & Social Media',
      title_mr: '५. बाह्य दुवे व सोशल मीडिया',
      content_en:
        'Our website contains informational links to external government portals, news publications, and social media platforms (such as Facebook, X/Twitter, Instagram, and YouTube). Please note that we do not govern the privacy practices or content of third-party platforms. We encourage constituents to review the privacy policies of external sites before engaging.',
      content_mr:
        'या संकेतस्थळावर शासकीय पोर्टल, वृत्तपत्रे आणि अधिकृत सोशल मीडिया खात्यांचे दुवे समाविष्ट आहेत. बाह्य संकेतस्थळांच्या स्वतंत्र गोपनीयता नियमांवर आमचे नियंत्रण नसते.',
    },
    {
      id: 'contact',
      icon_name: 'Mail',
      title_en: '6. Privacy Inquiries & Contact',
      title_mr: '६. गोपनीयता संपर्क व निवारण',
      content_en:
        'If you have any questions regarding this Privacy Policy, wish to update your contact information, or request the removal of any submitted inquiry from our constituent database, please contact our administrative desk at contact@balabhegade.in or visit the public relations office.',
      content_mr:
        'या गोपनीयता धोरणाबाबत काही शंका असल्यास अथवा आपल्या संपर्क माहितीमध्ये सुधारणा करायची असल्यास कृपया contact@balabhegade.in वर ईमेल पाठवा अथवा जनसंपर्क कार्यालयाशी संपर्क साधा.',
    },
  ],
};

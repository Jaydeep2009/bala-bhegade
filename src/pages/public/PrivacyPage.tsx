import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Calendar,
  Lock,
  Cookie,
  Mail,
  FileText,
  UserCheck,
  Share2,
  Sparkles,
} from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import {
  getPrivacyPageData,
  type PrivacyPageData,
  type PrivacySectionItem,
} from '@/lib/api';
import { DEFAULT_PRIVACY_PAGE_DATA } from '@/lib/pageDataDefaults';

const PRIVACY_ICONS: Record<string, typeof FileText> = {
  FileText,
  UserCheck,
  Lock,
  Cookie,
  Share2,
  Mail,
  ShieldCheck,
};

export default function PrivacyPage() {
  const { t, isMarathi } = useLanguage();
  const [pageData, setPageData] = useState<PrivacyPageData>(DEFAULT_PRIVACY_PAGE_DATA);

  useEffect(() => {
    getPrivacyPageData().then((res) => {
      if (res && res.sections && res.sections.length > 0) {
        setPageData(res);
      }
    });
  }, []);

  const sections = pageData.sections;

  return (
    <div className="min-h-screen bg-warm-50 text-charcoal-900 pb-20">
      <Helmet>
        <title>
          {isMarathi
            ? 'गोपनीयता धोरण - बाळा भेगडे'
            : 'Privacy Policy - Bala Bhegade'}
        </title>
        <meta
          name="description"
          content={
            isMarathi
              ? 'बाळा भेगडे यांच्या अधिकृत संकेतस्थळाचे गोपनीयता धोरण, नागरिक माहिती सुरक्षा आणि कार्यप्रणाली.'
              : 'Privacy Policy for the official website of Bala Bhegade. How citizen data and inquiries are safeguarded and handled.'
          }
        />
      </Helmet>

      {/* Header Banner */}
      <section className="bg-gradient-to-b from-warmWhite-200 via-white to-warmWhite-100 text-charcoal-900 py-16 sm:py-20 border-b border-charcoal-200/80">
        <div className="container-lg">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-saffron-50 border border-saffron-200 text-saffron-700 text-xs sm:text-sm font-semibold uppercase tracking-wider mb-4">
              <ShieldCheck className="w-3.5 h-3.5 text-saffron-600" />
              {t('Transparency & Trust', 'पारदर्शकता आणि विश्वास')}
            </span>
            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-charcoal-900 mb-4">
              {t(pageData.title_en, pageData.title_mr)}
            </h1>
            <p className="text-charcoal-700 text-base sm:text-lg leading-relaxed mb-4">
              {t(pageData.subtitle_en, pageData.subtitle_mr)}
            </p>
            <div className="inline-flex items-center gap-2 text-xs sm:text-sm text-saffron-800 bg-saffron-50 px-3.5 py-1.5 rounded-full border border-saffron-200">
              <Calendar className="w-3.5 h-3.5 text-saffron-600" />
              <span>{t(`Last Updated: ${pageData.last_updated}`, `अंतिम अद्यतन: ${pageData.last_updated}`)}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Content Container */}
      <div className="container-lg max-w-4xl mt-12 sm:mt-16">
        {/* Citizen Privacy Commitment */}
        <div className="mb-10 p-4 rounded-xl bg-saffron-50/70 border border-saffron-200 text-xs sm:text-sm text-charcoal-700 flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-saffron-600 flex-shrink-0 mt-0.5" />
          <p>
            <strong className="font-semibold text-saffron-900 mr-1.5">
              {t('Citizen Privacy Assurance:', 'नागरिक गोपनीयता हमी:')}
            </strong>
            {t(
              'This official privacy statement outlines how constituent communications, grievance submissions, and public queries are securely handled by the Office of Bala Bhegade.',
              'हे अधिकृत गोपनीयता विधान स्पष्ट करते की बाळा भेगडे यांच्या कार्यालयामार्फत नागरिक संवाद, निवेदने आणि समस्या कशा प्रकारे सुरक्षितरीत्या हाताळल्या जातात.'
            )}
          </p>
        </div>

        {/* Policy Sections Stack */}
        <div className="space-y-8 sm:space-y-10">
          {sections.map((section) => {
            const Icon = PRIVACY_ICONS[section.icon_name] || FileText;
            return (
              <section
                key={section.id}
                className="bg-white rounded-2xl p-6 sm:p-8 border border-charcoal-200/80 shadow-sm"
              >
                <div className="flex items-center gap-3.5 mb-4 pb-3 border-b border-charcoal-100">
                  <div className="w-9 h-9 rounded-lg bg-saffron-50 text-saffron-600 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h2 className="font-heading text-xl sm:text-2xl font-bold text-charcoal-950">
                    {t(section.title_en, section.title_mr)}
                  </h2>
                </div>

                <div className="prose-editorial text-charcoal-700 text-sm sm:text-base leading-relaxed">
                  <p>{t(section.content_en, section.content_mr)}</p>
                </div>
              </section>
            );
          })}
        </div>

        {/* Bottom Contact Anchor */}
        <div className="mt-12 p-8 rounded-2xl bg-warmWhite-200/80 border border-charcoal-200 text-center">
          <h3 className="font-heading text-xl font-bold text-charcoal-950 mb-2">
            {t('Have Questions About Our Privacy Standards?', 'गोपनीयता नियमांविषयी काही प्रश्न आहेत?')}
          </h3>
          <p className="text-charcoal-600 text-sm max-w-xl mx-auto mb-6">
            {t(
              'Our team is happy to assist with any questions regarding constituent privacy and administrative protocols.',
              'नागरिक गोपनीयता आणि प्रशासकीय कार्यपद्धतीबाबत माहितीसाठी आमच्या संपर्क कक्षाशी संवाद साधा.'
            )}
          </p>
          <Link to="/contact" className="btn-primary">
            {t('Contact Public Office', 'कार्यालयाशी संपर्क साधा')}
          </Link>
        </div>
      </div>
    </div>
  );
}

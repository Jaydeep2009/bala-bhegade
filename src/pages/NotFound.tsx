import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Home, Compass, ArrowLeft, Globe, Newspaper, Phone } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function NotFound() {
  const { language, setLanguage, t, isMarathi } = useLanguage();

  return (
    <div className="min-h-screen bg-warm-50 text-charcoal-900 flex flex-col justify-between selection:bg-saffron-100 selection:text-saffron-900">
      <Helmet>
        <title>
          {isMarathi
            ? '४०४ - पृष्ठ आढळले नाही | बाळा भेगडे'
            : '404 - Page Not Found | Bala Bhegade'}
        </title>
        <meta
          name="description"
          content={
            isMarathi
              ? 'हे पृष्ठ उपलब्ध नाही किंवा काढण्यात आले आहे. मुख्यपृष्ठावर परत जा.'
              : 'The page you are looking for does not exist. Return to Bala Bhegade official homepage.'
          }
        />
      </Helmet>

      {/* Top Standalone Brand Bar */}
      <header className="border-b border-charcoal-200 bg-white px-4 sm:px-8 py-4 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-saffron-500 to-saffron-600 shadow-sm flex items-center justify-center font-heading text-white font-bold text-xl group-hover:shadow-md transition-shadow">
              BB
            </div>
            <div>
              <span className="font-heading font-bold text-lg sm:text-xl text-charcoal-900 tracking-wide block">
                {t('Bala Bhegade', 'बाळा भेगडे')}
              </span>
              <span className="text-[11px] uppercase tracking-wider text-saffron-600 block font-semibold">
                {t('Official Website', 'अधिकृत संकेतस्थळ')}
              </span>
            </div>
          </Link>

          {/* Language Switcher */}
          <button
            onClick={() => setLanguage(language === 'en' ? 'mr' : 'en')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-charcoal-200 bg-charcoal-50 hover:bg-saffron-50 text-xs font-semibold text-charcoal-700 hover:text-saffron-600 transition-colors cursor-pointer"
            aria-label="Toggle language"
          >
            <Globe className="w-3.5 h-3.5 text-saffron-600" />
            <span>{language === 'en' ? 'मराठी' : 'English'}</span>
          </button>
        </div>
      </header>

      {/* Center 404 Hero Section */}
      <main className="flex-1 flex items-center justify-center px-4 py-12 sm:py-20 relative overflow-hidden">
        {/* Subtle background glow effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-saffron-200/30 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-2xl w-full text-center relative z-10">
          {/* Compass Icon Badge */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-saffron-50 border border-saffron-200 flex items-center justify-center mx-auto mb-6 shadow-md">
            <Compass className="w-8 h-8 sm:w-10 sm:h-10 text-saffron-600 animate-spin-slow" />
          </div>

          {/* Large 404 Number */}
          <h1 className="font-heading text-8xl sm:text-9xl md:text-[11rem] font-black tracking-tight leading-none text-transparent bg-clip-text bg-gradient-to-r from-saffron-500 via-amber-500 to-saffron-600 drop-shadow-sm select-none">
            404
          </h1>

          {/* Decorative Tri-color Divider */}
          <div className="w-20 h-1 bg-gradient-to-r from-saffron-500 via-warm-100 to-green-600 mx-auto my-6 rounded-full" />

          {/* Page Not Found Message */}
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-charcoal-950 mb-3">
            {t('Page Not Found', 'पृष्ठ आढळले नाही')}
          </h2>

          <p className="text-charcoal-600 text-sm sm:text-base max-w-lg mx-auto leading-relaxed mb-8">
            {t(
              'The page you are looking for might have been moved, renamed, or is temporarily unavailable. Please navigate back to the main portal.',
              'आपण शोधत असलेले पृष्ठ हलवले असावे, नाव बदलले असावे किंवा तात्पुरते अनुपलब्ध असावे. कृपया मुख्य पृष्ठावर परत जा.'
            )}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/"
              className="btn-primary inline-flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
            >
              <Home className="w-4 h-4" />
              <span>{t('Back to Homepage', 'मुख्यपृष्ठावर जा')}</span>
            </Link>

            <Link
              to="/news"
              className="btn-secondary inline-flex items-center gap-2"
            >
              <Newspaper className="w-4 h-4 text-saffron-600" />
              <span>{t('Latest News', 'ताज्या बातम्या')}</span>
            </Link>

            <Link
              to="/contact"
              className="btn-secondary inline-flex items-center gap-2"
            >
              <Phone className="w-4 h-4 text-saffron-600" />
              <span>{t('Contact Office', 'कार्यालय संपर्क')}</span>
            </Link>
          </div>
        </div>
      </main>

      {/* Standalone Footer */}
      <footer className="border-t border-charcoal-200 bg-white px-4 py-6 text-center text-xs text-charcoal-500">
        <p>
          © {new Date().getFullYear()} {t('Office of Bala Bhegade. All rights reserved.', 'बाळा भेगडे जनसंपर्क कार्यालय. सर्व हक्क राखीव.')}
        </p>
      </footer>
    </div>
  );
}

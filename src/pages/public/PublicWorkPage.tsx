import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Building2,
  HeartPulse,
  GraduationCap,
  Droplets,
  Trophy,
  Users,
  Sprout,
  SunMedium,
  CheckCircle2,
  Clock,
  ArrowRight,
  Filter,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import {
  getPublicWorkPageData,
  type PublicWorkPageData,
  type PublicWorkItem,
} from '@/lib/api';
import { DEFAULT_PUBLIC_WORK_PAGE_DATA } from '@/lib/pageDataDefaults';
import SectionHeading from '@/components/ui/SectionHeading';
import OptimizedImage from '@/components/ui/OptimizedImage';

export default function PublicWorkPage() {
  const { t, isMarathi } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [pageData, setPageData] = useState<PublicWorkPageData>(DEFAULT_PUBLIC_WORK_PAGE_DATA);

  useEffect(() => {
    getPublicWorkPageData().then((res) => {
      if (res && res.initiatives && res.initiatives.length > 0) {
        setPageData(res);
      }
    });
  }, []);

  const initiatives = pageData.initiatives;

  const categories = [
    { id: 'all', label_en: 'All Initiatives', label_mr: 'सर्व उपक्रम' },
    { id: 'infrastructure', label_en: 'Infrastructure', label_mr: 'पायाभूत सुविधा' },
    { id: 'agriculture', label_en: 'Agriculture & Rural', label_mr: 'कृषी व शेतकरी' },
    { id: 'administration', label_en: 'Public Administration', label_mr: 'प्रशासकीय समन्वय' },
    { id: 'welfare', label_en: 'Citizen Welfare', label_mr: 'जनकल्याण व मदत केंद्र' },
    { id: 'healthcare', label_en: 'Healthcare', label_mr: 'आरोग्य सेवा' },
    { id: 'education', label_en: 'Education', label_mr: 'शिक्षण' },
    { id: 'water', label_en: 'Water & Irrigation', label_mr: 'जलसंधारण' },
    { id: 'youth', label_en: 'Youth & Sports', label_mr: 'युवा व क्रीडा' },
    { id: 'women', label_en: 'Women Empowerment', label_mr: 'महिला सक्षमीकरण' },
    { id: 'energy', label_en: 'Green Energy', label_mr: 'हरित ऊर्जा' },
  ];

  const filteredInitiatives = useMemo(() => {
    if (selectedCategory === 'all') return initiatives;
    return initiatives.filter((item) => item.category === selectedCategory);
  }, [selectedCategory, initiatives]);

  return (
    <div className="min-h-screen bg-ivory-50 text-charcoal-900 pb-20">
      <Helmet>
        <title>
          {isMarathi
            ? 'सार्वजनिक कार्य आणि उपक्रम - बाळा भेगडे'
            : 'Public Work & Initiatives - Bala Bhegade'}
        </title>
        <meta
          name="description"
          content={
            isMarathi
              ? 'बाळा भेगडे यांच्या नेतृत्वाखालील सार्वजनिक कार्ये, रस्ते, आरोग्य, शिक्षण, पाणी व समाजोपयोगी उपक्रमांची सविस्तर माहिती.'
              : 'Explore the key public initiatives, infrastructure developments, healthcare drives, and community welfare programs led by Bala Bhegade.'
          }
        />
      </Helmet>

      {/* Header Banner */}
      <section className="bg-gradient-to-b from-warmWhite-200 via-white to-warmWhite-100 text-charcoal-900 py-16 sm:py-20 border-b border-charcoal-200/80">
        <div className="container-xl">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-saffron-50 border border-saffron-200 text-saffron-700 text-xs sm:text-sm font-semibold uppercase tracking-wider mb-4">
              <Sparkles className="w-3.5 h-3.5 text-saffron-500" />
              {t(pageData.header.badge_en, pageData.header.badge_mr)}
            </span>
            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-charcoal-900 mb-4">
              {t(pageData.header.title_en, pageData.header.title_mr)}
            </h1>
            <p className="text-charcoal-700 text-base sm:text-lg leading-relaxed">
              {t(pageData.header.subtitle_en, pageData.header.subtitle_mr)}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="container-xl mt-10 sm:mt-14">
        {/* Administrative Archive Notice */}
        <div className="mb-8 p-4 rounded-xl bg-saffron-50 border border-saffron-200 text-xs sm:text-sm text-charcoal-700 flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-saffron-500 flex-shrink-0 mt-0.5" />
          <p>
            <strong className="font-semibold text-saffron-900 mr-1.5">
              {t('Administrative Notice:', 'प्रशासकीय नोंदवही सूचना:')}
            </strong>
            {t(
              'Initiatives listed here represent key legislative focus areas and constituency advocacy across Maval taluka. Project-specific administrative archives, sanctioned expenditures, and official status records are maintained via the office.',
              'येथे दर्शविलेले उपक्रम हे मावळ मतदारसंघातील प्रमुख विकासक्षेत्रे व प्रशासकीय पाठपुराव्याशी संबंधित आहेत. प्रकल्पनिहाय शासकीय नोंदवही, मंजूर निधी व अधिकृत अहवाल कार्यालयामार्फत उपलब्ध केले जातात.'
            )}
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 sm:mb-12 no-scrollbar">
          <div className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-charcoal-500 uppercase tracking-wider flex-shrink-0">
            <Filter className="w-3.5 h-3.5" />
            <span>{t('Filter:', 'फिल्टर:')}</span>
          </div>
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap flex-shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-saffron-500 text-white shadow-md'
                    : 'bg-white text-charcoal-700 border border-charcoal-200 hover:border-saffron-500 hover:bg-warmWhite-100'
                }`}
              >
                {t(cat.label_en, cat.label_mr)}
              </button>
            );
          })}
        </div>

        {/* Initiatives Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <AnimatePresence>
            {filteredInitiatives.map((item, idx) => (
              <motion.article
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.35, delay: idx * 0.05 }}
                className="bg-white rounded-2xl overflow-hidden border border-charcoal-200/80 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col group"
              >
                {/* Image & Badge */}
                <div className="relative aspect-[16/10] overflow-hidden bg-charcoal-100">
                  {item.image_url ? (
                    <OptimizedImage
                      src={item.image_url}
                      alt={t(item.title_en, item.title_mr)}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-charcoal-800 via-charcoal-900 to-charcoal-950 text-white p-6 text-center select-none">
                      <div className="w-12 h-12 rounded-full bg-saffron-500/20 border border-saffron-400/30 flex items-center justify-center text-saffron-400 mb-2">
                        <Building2 className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-semibold text-warmWhite-200 uppercase tracking-wider">
                        {t(item.highlight_tag_en, item.highlight_tag_mr)}
                      </span>
                      <span className="text-[11px] text-charcoal-400 mt-1">
                        {t('Ground photo upload pending via admin', 'प्रशासकीय छायाचित्र अपलोड प्रलंबित')}
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity pointer-events-none" />

                  {/* Category Pill */}
                  <div className="absolute top-3 left-3 z-10">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/95 text-saffron-700 backdrop-blur-sm border border-saffron-200 shadow-xs">
                      {t(item.highlight_tag_en, item.highlight_tag_mr)}
                    </span>
                  </div>

                  {/* Status Pill */}
                  <div className="absolute top-3 right-3 z-10">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium backdrop-blur-sm shadow-xs ${
                        item.status === 'completed'
                          ? 'bg-green-700/95 text-white border border-green-500'
                          : item.status === 'historical'
                          ? 'bg-charcoal-900/95 text-warmWhite-100 border border-charcoal-600'
                          : item.status === 'unverified'
                          ? 'bg-amber-800/95 text-white border border-amber-600'
                          : 'bg-saffron-700/95 text-white border border-saffron-500'
                      }`}
                    >
                      {item.status === 'completed'
                        ? t('Completed Phase', 'पूर्ण टप्पा')
                        : item.status === 'historical'
                        ? t('Documented Activity', 'नोंदवलेला उपक्रम')
                        : item.status === 'unverified'
                        ? t('Status Unverified', 'सद्यस्थिती अप्रमाणित')
                        : t('Ongoing Project', 'प्रगतीपथावर')}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-heading text-xl font-bold text-charcoal-900 mb-2.5 group-hover:text-saffron-600 transition-colors">
                      {t(item.title_en, item.title_mr)}
                    </h3>

                    <p className="text-charcoal-600 text-sm leading-relaxed mb-4 line-clamp-3">
                      {t(item.description_en, item.description_mr)}
                    </p>
                  </div>

                  <div>
                    {/* Source Article Link (if documented) */}
                    {item.source_url && (
                      <a
                        href={item.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-saffron-700 hover:text-saffron-800 bg-saffron-50 hover:bg-saffron-100/80 border border-saffron-200 px-2.5 py-1 rounded-md transition-colors w-fit mb-3"
                      >
                        <ExternalLink className="w-3.5 h-3.5 flex-shrink-0 text-saffron-600" />
                        <span>{t('Source Article ↗', 'वृत्त संदर्भ / बातमी दुवा ↗')}</span>
                      </a>
                    )}

                    {/* Impact Metrics Pill (Indian Green) */}
                    <div className="py-2.5 px-3 rounded-lg bg-green-50 border border-green-200/80 mb-4 text-xs font-medium text-green-900 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span className="line-clamp-1">{t(item.metrics_en, item.metrics_mr)}</span>
                    </div>

                    <div className="pt-3 border-t border-charcoal-100 flex items-center justify-between text-xs font-semibold">
                      <span className="text-saffron-700/80 font-medium">
                        {t('Focus Area', 'प्रमुख कार्यक्षेत्र')}
                      </span>
                      <Link
                        to="/contact"
                        className="inline-flex items-center gap-1 text-saffron-600 hover:text-saffron-700 transition-colors group-hover:translate-x-0.5 duration-200"
                      >
                        <span>{t('Inquire / Details', 'माहिती विचारा')}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {filteredInitiatives.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-charcoal-200 my-8">
            <p className="text-charcoal-500 text-lg mb-4">
              {t('No initiatives found in this category.', 'या वर्गात कोणतेही उपक्रम आढळले नाहीत.')}
            </p>
            <button
              onClick={() => setSelectedCategory('all')}
              className="btn-primary"
            >
              {t('View All Initiatives', 'सर्व उपक्रम पहा')}
            </button>
          </div>
        )}

        {/* Bottom Contact / Grievance CTA */}
        <div className="mt-16 sm:mt-20 p-8 sm:p-10 rounded-2xl bg-gradient-to-r from-saffron-500 to-saffron-600 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
          <div className="text-center md:text-left relative z-10">
            <h3 className="font-heading text-2xl sm:text-3xl font-bold mb-2 text-white">
              {t(pageData.bottom_cta.headline_en, pageData.bottom_cta.headline_mr)}
            </h3>
            <p className="text-white/90 text-sm sm:text-base max-w-xl">
              {t(pageData.bottom_cta.description_en, pageData.bottom_cta.description_mr)}
            </p>
          </div>
          <Link
            to={pageData.bottom_cta.btn_url || '/contact'}
            className="inline-flex items-center justify-center rounded-md bg-white px-6 py-3 text-sm font-semibold text-saffron-700 shadow-sm hover:bg-warmWhite-100 transition-colors whitespace-nowrap flex-shrink-0 relative z-10"
          >
            {t(pageData.bottom_cta.btn_label_en, pageData.bottom_cta.btn_label_mr)}
          </Link>
          {/* Tri-color bottom strip */}
          <div className="absolute inset-x-0 bottom-0 h-2 flex">
            <div className="flex-1 bg-saffron-400" />
            <div className="flex-1 bg-white" />
            <div className="flex-1 bg-green-600" />
          </div>
        </div>
      </div>
    </div>
  );
}

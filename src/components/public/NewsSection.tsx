import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { Calendar, ArrowRight } from 'lucide-react';
import { useLanguage, AutoTranslate } from '@/lib/i18n/LanguageContext';
import { mockNewsArticles } from '@/lib/mock-data';
import { getPublishedNews } from '@/lib/api';
import type { NewsArticle } from '@/types/database';
import SectionHeading from '@/components/ui/SectionHeading';

export function NewsSection() {
  const { isMarathi } = useLanguage();
  const shouldReduceMotion = useReducedMotion();
  const [articles, setArticles] = useState<NewsArticle[]>(() =>
    mockNewsArticles.filter((a) => a.status === 'published')
  );

  useEffect(() => {
    getPublishedNews().then((data) => {
      if (data && data.length > 0) {
        setArticles(data.filter((a) => a.status === 'published'));
      }
    });
  }, []);

  const featured = articles[0];
  const sideArticles = articles.slice(1, 4);

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString(isMarathi ? 'mr-IN' : 'en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const formatCategory = (cat: string) => {
    const map: Record<string, { en: string; mr: string }> = {
      initiatives: { en: 'Initiatives', mr: 'उपक्रम' },
      'public-meetings': { en: 'Public Meetings', mr: 'सार्वजनिक सभा' },
      education: { en: 'Education', mr: 'शिक्षण' },
      health: { en: 'Healthcare', mr: 'आरोग्य' },
      general: { en: 'News', mr: 'बातम्या' },
    };
    return map[cat] ? (isMarathi ? map[cat].mr : map[cat].en) : cat;
  };

  const cinematicEase = [0.16, 1, 0.3, 1];

  const containerVariants = {
    hidden: { opacity: shouldReduceMotion ? 1 : 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.12,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: cinematicEase,
      },
    },
  };

  return (
    <section className="py-20 lg:py-28 bg-white border-b border-charcoal-200/60 relative">
      <div className="container-xl">
        {/* Section Heading */}
        <SectionHeading
          badge={isMarathi ? 'बातम्या व घडामोडी' : 'Press & Updates'}
          title={isMarathi ? 'ताज्या बातम्या आणि घडामोडी' : 'Latest News & Updates'}
          subtitle={
            isMarathi
              ? 'मतदारसंघातील विविध विकासकामे, सार्वजनिक कार्यक्रम आणि उपक्रमांची अधिकृत माहिती'
              : 'Official updates, press releases, public announcements, and developments from the constituency'
          }
          align="center"
        />

        {/* 2/3 + 1/3 Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-14"
        >
          {/* Featured Large Article (2/3 width) */}
          {featured && (
            <motion.div variants={cardVariants} className="lg:col-span-2">
              <Link
                to={`/news/${featured.slug}`}
                className="group block h-full bg-white rounded-2xl border border-charcoal-200/90 overflow-hidden shadow-sm hover:shadow-2xl hover:border-saffron-300 hover:-translate-y-2 transition-all duration-300"
              >
                <div className="relative aspect-[16/9] overflow-hidden bg-charcoal-100">
                  <motion.img
                    initial={{ scale: 1.06 }}
                    whileInView={{ scale: 1.0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.1, ease: cinematicEase }}
                    src={featured.cover_image_url || '/images/placeholder-news-1.jpg'}
                    alt={isMarathi ? featured.title_mr : featured.title_en}
                    className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500 ease-out"
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.style.display = 'none';
                      if (target.parentElement) {
                        target.parentElement.className =
                          'aspect-[16/9] bg-saffron-600 flex items-center justify-center text-white';
                        target.parentElement.innerHTML =
                          '<span class="font-heading text-xl font-bold text-white">Bala Bhegade News</span>';
                      }
                    }}
                  />
                  {/* Category Pill */}
                  <div className="absolute top-4 left-4">
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-white/95 text-saffron-700 shadow-sm border border-saffron-200 backdrop-blur-sm">
                      {formatCategory(featured.category)}
                    </span>
                  </div>
                </div>

                <div className="p-6 sm:p-8">
                  {/* Date */}
                  <div className="flex items-center gap-2 text-charcoal-500 text-xs sm:text-sm mb-3">
                    <Calendar className="w-4 h-4 text-green-600" />
                    <span className="font-medium">{formatDate(featured.published_at)}</span>
                    <span className="text-charcoal-300">•</span>
                    <span>{featured.author}</span>
                  </div>

                  {/* Title */}
                  <h3 className="font-heading font-bold text-2xl sm:text-3xl text-charcoal-900 group-hover:text-saffron-600 transition-colors leading-snug mb-3">
                    <AutoTranslate en={featured.title_en} mr={featured.title_mr} />
                  </h3>

                  {/* Summary */}
                  <p className="text-charcoal-600 text-base leading-relaxed line-clamp-3 mb-6">
                    <AutoTranslate en={featured.summary_en} mr={featured.summary_mr} />
                  </p>

                  <div className="inline-flex items-center gap-2 text-saffron-600 font-semibold text-sm group-hover:text-saffron-700">
                    <span>{isMarathi ? 'संपूर्ण बातमी वाचा' : 'Read Full Story'}</span>
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-2" />
                  </div>
                </div>
              </Link>
            </motion.div>
          )}

          {/* Side Articles Stack (1/3 width) */}
          <div className="lg:col-span-1 flex flex-col gap-6 justify-between">
            {sideArticles.map((article) => (
              <motion.div key={article.id} variants={cardVariants} className="flex-1">
                <Link
                  to={`/news/${article.slug}`}
                  className="group flex flex-col sm:flex-row lg:flex-col bg-white rounded-xl border border-charcoal-200/90 overflow-hidden shadow-sm hover:shadow-xl hover:border-saffron-300 hover:-translate-y-1.5 transition-all duration-300 h-full"
                >
                  <div className="relative aspect-[16/9] sm:w-48 lg:w-full overflow-hidden bg-charcoal-100 flex-shrink-0">
                    <motion.img
                      initial={{ scale: 1.05 }}
                      whileInView={{ scale: 1.0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, ease: cinematicEase }}
                      src={article.cover_image_url || '/images/placeholder-news.jpg'}
                      alt={isMarathi ? article.title_mr : article.title_en}
                      className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500 ease-out"
                      onError={(e) => {
                        const target = e.currentTarget;
                        target.style.display = 'none';
                        if (target.parentElement) {
                          target.parentElement.className =
                            'h-full bg-saffron-600 flex items-center justify-center text-white';
                          target.parentElement.innerHTML =
                            '<span class="font-heading text-xs font-bold text-white">News</span>';
                        }
                      }}
                    />
                    <div className="absolute top-2.5 left-2.5">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white/95 text-saffron-700 border border-saffron-200 backdrop-blur-sm">
                        {formatCategory(article.category)}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Date */}
                      <div className="flex items-center gap-1.5 text-charcoal-500 text-xs mb-1.5">
                        <Calendar className="w-3.5 h-3.5 text-green-600" />
                        <span className="font-medium">{formatDate(article.published_at)}</span>
                      </div>

                      {/* Title */}
                      <h4 className="font-heading font-bold text-base sm:text-lg text-charcoal-900 group-hover:text-saffron-600 transition-colors line-clamp-2 leading-snug">
                        <AutoTranslate en={article.title_en} mr={article.title_mr} />
                      </h4>

                      {/* Excerpt */}
                      <p className="text-charcoal-600 text-xs sm:text-sm line-clamp-2 mt-1.5 leading-relaxed">
                        <AutoTranslate en={article.summary_en} mr={article.summary_mr} />
                      </p>
                    </div>

                    <div className="mt-3 inline-flex items-center gap-1 text-saffron-600 font-semibold text-xs group-hover:text-saffron-700">
                      <span>{isMarathi ? 'वाचा' : 'Read'}</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1.5" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Link to /news at bottom */}
        <div className="text-center">
          <Link
            to="/news"
            className="group btn-secondary"
          >
            <span>{isMarathi ? 'सर्व बातम्या व प्रसिद्धीपत्रके पहा' : 'View All News & Press Releases'}</span>
            <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default NewsSection;

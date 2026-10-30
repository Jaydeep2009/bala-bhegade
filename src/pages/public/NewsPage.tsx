import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Search,
  X,
  Calendar,
  User,
  ArrowRight,
  Filter,
  Newspaper,
  Tag,
  Sparkles,
} from 'lucide-react';
import { useLanguage, AutoTranslate } from '@/lib/i18n/LanguageContext';
import { getPublishedNews } from '@/lib/api';
import { mockNewsArticles } from '@/lib/mock-data';
import type { NewsArticle } from '@/types/database';
import OptimizedImage from '@/components/ui/OptimizedImage';

export default function NewsPage() {
  const { t, isMarathi } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [articles, setArticles] = useState<NewsArticle[]>(() =>
    mockNewsArticles.filter((article) => article.status === 'published')
  );

  useEffect(() => {
    getPublishedNews().then((data) => {
      if (data && data.length > 0) {
        setArticles(data);
      }
    });
  }, []);

  const categories = [
    { id: 'all', label_en: 'All', label_mr: 'सर्व' },
    { id: 'initiatives', label_en: 'Initiatives', label_mr: 'उपक्रम' },
    { id: 'public-meetings', label_en: 'Public Meetings', label_mr: 'सार्वजनिक सभा' },
    { id: 'education', label_en: 'Education', label_mr: 'शिक्षण' },
    { id: 'health', label_en: 'Health', label_mr: 'आरोग्य' },
  ];

  // Only show published articles
  const publishedArticles = useMemo(() => {
    return articles.filter((article) => article.status === 'published');
  }, [articles]);

  // Filter by category and search term
  const filteredArticles = useMemo(() => {
    return publishedArticles.filter((article) => {
      const matchesCategory =
        selectedCategory === 'all' || article.category === selectedCategory;

      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase().trim();
      const titleEn = (article.title_en || '').toLowerCase();
      const titleMr = (article.title_mr || '').toLowerCase();
      const sumEn = (article.summary_en || '').toLowerCase();
      const sumMr = (article.summary_mr || '').toLowerCase();
      const tags = (article.tags || []).join(' ').toLowerCase();

      return (
        titleEn.includes(q) ||
        titleMr.includes(q) ||
        sumEn.includes(q) ||
        sumMr.includes(q) ||
        tags.includes(q)
      );
    });
  }, [publishedArticles, selectedCategory, searchQuery]);

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString(isMarathi ? 'mr-IN' : 'en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const getCategoryLabel = (category: string) => {
    const found = categories.find((c) => c.id === category);
    if (!found) return category;
    return t(found.label_en, found.label_mr);
  };

  return (
    <div className="min-h-screen bg-ivory-50 text-charcoal-900 pb-20">
      <Helmet>
        <title>
          {isMarathi
            ? 'बातम्या आणि अद्यतने - बाळा भेगडे'
            : 'News & Updates - Bala Bhegade'}
        </title>
        <meta
          name="description"
          content={
            isMarathi
              ? 'बाळा भेगडे यांच्या मतदारसंघातील ताज्या बातम्या, उपक्रम, सार्वजनिक सभा आणि अधिकृत प्रसिद्धीपत्रके.'
              : 'Latest press releases, public meeting reports, developmental updates, and announcements from Bala Bhegade.'
          }
        />
      </Helmet>

      {/* Header Banner */}
      <section className="bg-gradient-to-b from-warmWhite-200 via-white to-warmWhite-100 text-charcoal-900 py-16 sm:py-20 border-b border-charcoal-200/80">
        <div className="container-xl">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-saffron-50 border border-saffron-200 text-saffron-700 text-xs sm:text-sm font-semibold uppercase tracking-wider mb-4">
              <Newspaper className="w-3.5 h-3.5 text-saffron-500" />
              {t('Press & Media Desk', 'माहिती व प्रसिद्धी कक्ष')}
            </span>
            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-charcoal-900 mb-4">
              {t('News & Press Releases', 'ताज्या बातम्या व घडामोडी')}
            </h1>
            <p className="text-charcoal-700 text-base sm:text-lg leading-relaxed">
              {t(
                'Stay informed with the latest constituency announcements, public meeting dispatches, and welfare program rollouts.',
                'मतदारसंघातील विकासकामे, जनसंवाद सभा, शासकीय योजना आणि महत्त्वाच्या निर्णयांची अद्ययावत माहिती.'
              )}
            </p>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="container-xl mt-10 sm:mt-12">
        {/* Search Bar & Filter Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8 sm:mb-12">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
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

          {/* Search Box */}
          <div className="relative w-full lg:w-72 flex-shrink-0">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('Search news articles...', 'बातम्या शोधा...')}
              className="w-full pl-10 pr-9 py-2 rounded-full border border-charcoal-300 bg-white text-sm text-charcoal-900 placeholder:text-charcoal-400 focus:outline-none focus:border-saffron-500 focus:ring-1 focus:ring-saffron-500 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-400 hover:text-charcoal-600 p-0.5"
                aria-label={t('Clear search', 'शोध पुसा')}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Results Counter if searching */}
        {searchQuery && (
          <div className="mb-6 text-xs sm:text-sm text-charcoal-600 flex items-center gap-2">
            <span>
              {t(
                `Found ${filteredArticles.length} result(s) for "${searchQuery}"`,
                `"${searchQuery}" साठी ${filteredArticles.length} निकाल सापडले`
              )}
            </span>
            <button
              onClick={() => setSearchQuery('')}
              className="text-saffron-600 hover:text-saffron-700 font-semibold underline cursor-pointer text-xs"
            >
              {t('Clear search', 'शोध पुसा')}
            </button>
          </div>
        )}

        {/* News Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <AnimatePresence>
            {filteredArticles.map((article, idx) => (
              <motion.article
                key={article.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35, delay: idx * 0.05 }}
                className="bg-white rounded-2xl overflow-hidden border border-charcoal-200/80 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col group"
              >
                {/* Cover Image & Category Badge */}
                <Link
                  to={`/news/${article.slug}`}
                  className="relative aspect-[16/10] overflow-hidden bg-charcoal-100 block"
                >
                  <OptimizedImage
                    src={article.cover_image_url || '/images/placeholder-news-1.jpg'}
                    alt={t(article.title_en, article.title_mr)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity" />

                  {/* Category Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/95 text-saffron-700 backdrop-blur-sm border border-saffron-200 shadow-xs">
                      {getCategoryLabel(article.category)}
                    </span>
                  </div>
                </Link>

                {/* Article Body */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Meta Info */}
                    <div className="flex items-center gap-4 text-xs text-charcoal-500 mb-3">
                      {article.published_at && (
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-green-600" />
                          <span>{formatDate(article.published_at)}</span>
                        </div>
                      )}
                      {article.author && (
                        <div className="flex items-center gap-1.5 line-clamp-1">
                          <User className="w-3.5 h-3.5 text-charcoal-400" />
                          <span>{article.author}</span>
                        </div>
                      )}
                    </div>

                    {/* Headline */}
                    <h3 className="font-heading text-xl font-bold text-charcoal-900 mb-3 group-hover:text-saffron-600 transition-colors line-clamp-2">
                      <Link to={`/news/${article.slug}`}>
                        <AutoTranslate en={article.title_en} mr={article.title_mr} />
                      </Link>
                    </h3>

                    {/* Summary */}
                    <p className="text-charcoal-600 text-sm leading-relaxed mb-4 line-clamp-3">
                      <AutoTranslate en={article.summary_en} mr={article.summary_mr} />
                    </p>
                  </div>

                  {/* Read More Link */}
                  <div className="pt-4 border-t border-charcoal-100 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {(article.tags || []).slice(0, 2).map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="text-[11px] font-medium text-charcoal-500 bg-charcoal-50 px-2 py-0.5 rounded border border-charcoal-200"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <Link
                      to={`/news/${article.slug}`}
                      className="inline-flex items-center gap-1 text-sm font-semibold text-saffron-600 hover:text-saffron-700 transition-colors group-hover:translate-x-1 duration-200"
                    >
                      <span>{t('Read More', 'अधिक वाचा')}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {filteredArticles.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-charcoal-200 my-8 p-6">
            <Newspaper className="w-12 h-12 text-charcoal-300 mx-auto mb-3" />
            <p className="text-charcoal-700 font-heading text-xl font-bold mb-2">
              {t('No news articles found', 'कोणत्याही बातम्या आढळल्या नाहीत')}
            </p>
            <p className="text-charcoal-500 text-sm max-w-md mx-auto mb-6">
              {t(
                'Try clearing your search query or selecting a different category filter.',
                'कृपया शोध शब्द बदलून पहा किंवा दुसरा वर्ग निवडून पहा.'
              )}
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="btn-primary"
            >
              {t('Reset Filters', 'फिल्टर पूर्ववत करा')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

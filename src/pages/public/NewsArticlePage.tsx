import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Calendar,
  User,
  Clock,
  Share2,
  Copy,
  Check,
  Tag,
  AlertCircle,
  ArrowRight,
  Bookmark,
  Quote,
  CheckCircle2,
} from 'lucide-react';
import { useLanguage, useAutoTranslate } from '@/lib/i18n/LanguageContext';
import { getNewsBySlug, getPublishedNews } from '@/lib/api';
import { mockNewsArticles } from '@/lib/mock-data';
import type { NewsArticle } from '@/types/database';
import OptimizedImage from '@/components/ui/OptimizedImage';

export default function NewsArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const { t, isMarathi } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [article, setArticle] = useState<NewsArticle | null>(() =>
    mockNewsArticles.find((a) => a.slug === slug && a.status === 'published') || null
  );
  const [allNews, setAllNews] = useState<NewsArticle[]>(mockNewsArticles);

  useEffect(() => {
    let isMounted = true;
    if (slug) {
      setLoading(true);
      getNewsBySlug(slug)
        .then((data) => {
          if (isMounted) {
            setArticle(data || null);
            setLoading(false);
          }
        })
        .catch(() => {
          if (isMounted) {
            setLoading(false);
          }
        });
    }

    getPublishedNews().then((data) => {
      if (isMounted && data && data.length > 0) {
        setAllNews(data);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [slug]);

  // ALL HOOKS MUST RUN UNCONDITIONALLY AT THE TOP LEVEL BEFORE ANY RETURN
  const title = useAutoTranslate(article?.title_en || '', article?.title_mr || '');
  const summary = useAutoTranslate(article?.summary_en || '', article?.summary_mr || '');
  const body = useAutoTranslate(article?.body_en || '', article?.body_mr || '');

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString(isMarathi ? 'mr-IN' : 'en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // Related articles (excluding current)
  const relatedArticles = allNews
    .filter((a) => a.id !== article?.id && a.status === 'published')
    .slice(0, 3);

  // If still loading and no initial mock match, show smooth loader
  if (loading && !article) {
    return (
      <div className="min-h-[70vh] bg-ivory-50 flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-saffron-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-charcoal-500 font-medium">
            {t('Loading article...', 'लेख लोड होत आहे...')}
          </p>
        </div>
      </div>
    );
  }

  // If article not found after loading, render 404 state
  if (!article) {
    return (
      <div className="min-h-[70vh] bg-ivory-50 flex items-center justify-center p-4">
        <Helmet>
          <title>{t('Article Not Found | Bala Bhegade', 'लेख आढळला नाही | बाळा भेगडे')}</title>
        </Helmet>
        <div className="max-w-md w-full bg-white rounded-2xl p-8 border border-charcoal-200 shadow-sm text-center">
          <div className="w-14 h-14 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center mx-auto mb-4 border border-amber-200">
            <AlertCircle className="w-7 h-7" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-charcoal-900 mb-2">
            {t('Article Not Found', 'लेख सापडला नाही')}
          </h1>
          <p className="text-charcoal-600 text-sm mb-6 leading-relaxed">
            {t(
              'The requested news article does not exist, has been removed, or is still a draft.',
              'आपण शोधत असलेला बातमी लेख अस्तित्वात नाही, काढण्यात आला आहे किंवा अद्याप अप्रकाशित आहे.'
            )}
          </p>
          <Link to="/news" className="btn-primary inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            <span>{t('Back to All News', 'सर्व बातम्यांकडे परत जा')}</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory-50 text-charcoal-900 pb-20">
      <Helmet>
        <title>{`${title} | Bala Bhegade`}</title>
        <meta name="description" content={summary} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={summary} />
        <meta property="og:type" content="article" />
      </Helmet>

      {/* Top Breadcrumb & Navigation */}
      <div className="border-b border-charcoal-200/80 bg-white">
        <div className="container-lg py-4">
          <Link
            to="/news"
            className="inline-flex items-center gap-2 text-sm font-semibold text-saffron-600 hover:text-saffron-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t('Back to News & Updates', 'बातम्या व अद्यतनांकडे परत')}</span>
          </Link>
        </div>
      </div>

      {/* Article Header & Cover */}
      <article className="container-lg pt-10 sm:pt-14">
        {/* Category Pill & Reading Time */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className="px-3.5 py-1 rounded-full text-xs font-semibold bg-saffron-50 text-saffron-700 border border-saffron-200 uppercase tracking-wider">
            {article.category}
          </span>
          <span className="flex items-center gap-1 text-xs text-charcoal-500 font-medium">
            <Clock className="w-3.5 h-3.5 text-saffron-500" />
            <span>{t('3 min read', '३ मिनिट वाचन')}</span>
          </span>
        </div>

        {/* Title */}
        <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-charcoal-900 leading-tight mb-6">
          {title}
        </h1>

        {/* Metadata Bar & Share Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 border-y border-charcoal-200/80 mb-8 text-sm text-charcoal-600">
          <div className="flex flex-wrap items-center gap-6">
            {article.author && (
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-charcoal-400" />
                <span className="font-medium text-charcoal-900">{article.author}</span>
              </div>
            )}
            {article.published_at && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-green-600" />
                <span>{formatDate(article.published_at)}</span>
              </div>
            )}
          </div>

          {/* Share Buttons */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-charcoal-500 mr-1 flex items-center gap-1">
              <Share2 className="w-3.5 h-3.5" />
              {t('Share:', 'शेअर:')}
            </span>
            <button
              onClick={handleCopyLink}
              title={t('Copy Link', 'दुवा कॉपी करा')}
              className="p-2 rounded-lg border border-charcoal-200 hover:bg-saffron-50 hover:text-saffron-600 transition-colors cursor-pointer text-charcoal-600 relative"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              {copied && (
                <span className="absolute -top-7 left-1/2 -translate-x-1/2 text-[10px] bg-charcoal-900 text-white px-2 py-0.5 rounded shadow">
                  {t('Copied!', 'कॉपी झाले!')}
                </span>
              )}
            </button>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`${title} - ${window.location.href}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1.5 rounded-lg border border-charcoal-200 text-xs font-medium hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
            >
              WhatsApp
            </a>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(window.location.href)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1.5 rounded-lg border border-charcoal-200 text-xs font-medium hover:bg-sky-50 hover:text-sky-700 transition-colors"
            >
              X / Twitter
            </a>
          </div>
        </div>

        {/* Cover Image */}
        <div className="relative aspect-[16/9] sm:aspect-[21/9] rounded-2xl overflow-hidden shadow-lg mb-10 bg-charcoal-100">
          <OptimizedImage
            src={article.cover_image_url || '/images/placeholder-news-1.jpg'}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Editorial Body Content */}
        <div className="prose-editorial max-w-none space-y-6 text-charcoal-800 text-base sm:text-lg leading-relaxed">
          {/* Summary Lead Paragraph */}
          <div className="p-6 rounded-xl bg-warmWhite-100 border-l-4 border-saffron-500 font-medium text-charcoal-800 text-lg sm:text-xl leading-relaxed border border-charcoal-200/60">
            {summary}
          </div>

          {/* Official Press Release Badge */}
          <div className="p-4 rounded-xl bg-saffron-50 border border-saffron-200/90 text-xs sm:text-sm text-charcoal-700 font-medium flex flex-wrap items-center justify-between gap-2">
            <span className="font-semibold text-saffron-800 uppercase tracking-wide flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              {t('Official Constituency Press Release', 'अधिकृत मतदारसंघ प्रसिद्धीपत्रक')}
            </span>
            <span className="text-charcoal-500 text-xs">
              {t('Taluka Public Relations Desk • Maval', 'तालुका जनसंपर्क कक्ष • मावळ')}
            </span>
          </div>

          {/* Article Full Body */}
          {body && (
            <p className="text-charcoal-800 text-base sm:text-lg leading-relaxed font-normal">
              {body}
            </p>
          )}

          <p>
            {t(
              'The engagement reflects continuous grassroots dialogue and commitment to balanced regional development across rural and urban clusters in Maval taluka. Constituents, village representatives, and youth workers actively participated to discuss civic and developmental priorities.',
              'हा उपक्रम मावळ तालुक्यातील ग्रामीण व नागरी भागात निरंतर जनसंवाद आणि समतोल विकासाच्या संकल्पाचा भाग आहे. परिसरातील ग्रामस्थ, विविध संस्थांचे प्रतिनिधी आणि युवक कार्यकर्त्यांनी मोठ्या संख्येने उपस्थित राहून आपले विचार मांडले.'
            )}
          </p>

          <div className="my-8 bg-warmWhite-200/90 text-charcoal-900 p-6 sm:p-8 rounded-xl border-l-4 border-saffron-500 border border-charcoal-200/80 shadow-xs">
            <p className="font-heading italic text-lg sm:text-xl text-charcoal-900 leading-relaxed mb-2">
              "{t(
                'Our commitment is grounded in transparent administration, active public consultation, and swift execution of every public initiative.',
                'पारदर्शक कारभार, लोकसहभाग आणि प्रत्येक विकासकामाची तत्पर अंमलबजावणी हीच आमची जनसेवेतील मुख्य भूमिका आहे.'
              )}"
            </p>
            <span className="text-saffron-600 text-xs font-semibold uppercase tracking-wider">
              — {t('Office of Bala Bhegade', 'बाळा भेगडे जनसंपर्क कार्यालय')}
            </span>
          </div>

          <p>
            {t(
              'Constituency representatives reiterated that priority will continue to be accorded to drinking water supply, road connectivity, educational infrastructure, and healthcare accessibility for all residents.',
              'स्थानिक प्रतिनिधींनी नमूद केले की शुद्ध पिण्याचे पाणी, रस्ते दळणवळण, शाळा-अभ्यासिका सक्षमीकरण आणि दर्जेदार आरोग्य सेवा या मूलभूत विषयांना सर्वोच्च प्राधान्य दिले जाईल.'
            )}
          </p>

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="pt-6 border-t border-charcoal-200 flex items-center gap-2 flex-wrap">
              <Tag className="w-4 h-4 text-saffron-600" />
              <span className="text-xs font-semibold text-charcoal-500 uppercase tracking-wider">
                {t('Tags:', 'टॅग्ज:')}
              </span>
              {article.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-warmWhite-200 text-charcoal-800 border border-charcoal-200"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </article>

      {/* Related Articles Section */}
      {relatedArticles.length > 0 && (
        <section className="container-lg mt-16 sm:mt-24 pt-12 border-t border-charcoal-200">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-charcoal-900">
              {t('Related News & Articles', 'संबंधित बातम्या व लेख')}
            </h2>
            <Link
              to="/news"
              className="text-sm font-semibold text-saffron-600 hover:text-saffron-700 inline-flex items-center gap-1"
            >
              <span>{t('View All', 'सर्व पहा')}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedArticles.map((rel) => (
              <article
                key={rel.id}
                className="bg-white rounded-xl overflow-hidden border border-charcoal-200 shadow-xs hover:shadow-md transition-shadow flex flex-col group"
              >
                <Link
                  to={`/news/${rel.slug}`}
                  className="aspect-[16/10] overflow-hidden bg-charcoal-100 block relative"
                >
                  <OptimizedImage
                    src={rel.cover_image_url || '/images/placeholder-news-1.jpg'}
                    alt={t(rel.title_en, rel.title_mr)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2.5 left-2.5">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white/95 text-saffron-700 border border-saffron-200">
                      {rel.category}
                    </span>
                  </div>
                </Link>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="text-[11px] text-charcoal-500 mb-1.5 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-green-600" />
                      <span>{formatDate(rel.published_at)}</span>
                    </div>
                    <h3 className="font-heading font-bold text-charcoal-900 group-hover:text-saffron-600 transition-colors line-clamp-2 text-base">
                      <Link to={`/news/${rel.slug}`}>
                        {t(rel.title_en, rel.title_mr)}
                      </Link>
                    </h3>
                  </div>
                  <div className="pt-3 mt-3 border-t border-charcoal-100">
                    <Link
                      to={`/news/${rel.slug}`}
                      className="text-xs font-semibold text-saffron-600 hover:text-saffron-700 inline-flex items-center gap-1"
                    >
                      <span>{t('Read Article', 'लेख वाचा')}</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

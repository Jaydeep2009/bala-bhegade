import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Images,
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
  Filter,
  Sparkles,
} from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { getVisibleGalleryItems } from '@/lib/api';
import { mockGalleryItems } from '@/lib/mock-data';
import type { GalleryItem } from '@/types/database';
import OptimizedImage from '@/components/ui/OptimizedImage';

export default function GalleryPage() {
  const { t, isMarathi } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);
  const [items, setItems] = useState<GalleryItem[]>(mockGalleryItems);

  useEffect(() => {
    getVisibleGalleryItems().then((data) => {
      if (data && data.length > 0) {
        setItems(data);
      }
    });
  }, []);

  const categories = [
    { id: 'all', label_en: 'All Photos', label_mr: 'सर्व छायाचित्रे' },
    { id: 'events', label_en: 'Public Events', label_mr: 'सार्वजनिक कार्यक्रम' },
    { id: 'public-work', label_en: 'Development Works', label_mr: 'विकासकामे' },
    { id: 'community', label_en: 'Community & Meetings', label_mr: 'जनसंवाद व भेटी' },
  ];

  // Filter visible items by category and sort by display_order
  const filteredItems = useMemo(() => {
    return [...items]
      .filter((item) => item.is_visible)
      .filter(
        (item) => selectedCategory === 'all' || item.category === selectedCategory
      )
      .sort((a, b) => a.display_order - b.display_order);
  }, [items, selectedCategory]);

  // Lightbox navigation
  const openLightbox = (index: number) => {
    setActiveImageIndex(index);
  };

  const closeLightbox = () => {
    setActiveImageIndex(null);
  };

  const showNext = useCallback(() => {
    if (activeImageIndex === null || filteredItems.length === 0) return;
    setActiveImageIndex((prev) =>
      prev === null ? 0 : (prev + 1) % filteredItems.length
    );
  }, [activeImageIndex, filteredItems.length]);

  const showPrev = useCallback(() => {
    if (activeImageIndex === null || filteredItems.length === 0) return;
    setActiveImageIndex((prev) =>
      prev === null ? 0 : (prev - 1 + filteredItems.length) % filteredItems.length
    );
  }, [activeImageIndex, filteredItems.length]);

  // Handle keyboard events for lightbox
  useEffect(() => {
    if (activeImageIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') showNext();
      if (e.key === 'ArrowLeft') showPrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    // Lock body scroll
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [activeImageIndex, showNext, showPrev]);

  const activeItem: GalleryItem | null =
    activeImageIndex !== null ? filteredItems[activeImageIndex] || null : null;

  return (
    <div className="min-h-screen bg-ivory-50 text-charcoal-900 pb-20">
      <Helmet>
        <title>
          {isMarathi
            ? 'फोटो गॅलरी - बाळा भेगडे | सार्वजनिक जीवन आणि क्षण'
            : 'Photo Gallery - Bala Bhegade | Public Moments'}
        </title>
        <meta
          name="description"
          content={
            isMarathi
              ? 'बाळा भेगडे यांच्या सार्वजनिक कार्यक्रमांची, जनसंवादाची आणि विकासकामांची छायाचित्रे.'
              : 'Explore photographs and visual moments from public rallies, developmental inspections, and community meetings led by Bala Bhegade.'
          }
        />
      </Helmet>

      {/* Header Banner */}
      <section className="bg-gradient-to-b from-warmWhite-200 via-white to-warmWhite-100 text-charcoal-900 py-16 sm:py-20 border-b border-charcoal-200/80">
        <div className="container-xl">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-saffron-50 border border-saffron-200 text-saffron-700 text-xs sm:text-sm font-semibold uppercase tracking-wider mb-4">
              <Images className="w-3.5 h-3.5 text-saffron-500" />
              {t('Visual Moments', 'क्षणचित्रे')}
            </span>
            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-charcoal-900 mb-4">
              {t('Photo Gallery', 'फोटो गॅलरी')}
            </h1>
            <p className="text-charcoal-700 text-base sm:text-lg leading-relaxed">
              {t(
                'A visual chronicle of public rallies, developmental inaugurations, farmer dialogues, and community festivities.',
                'जनसंवाद, विकासकामांचे लोकार्पण, शेतकरी मेळावे आणि सामाजिक उपक्रमांतील महत्त्वपूर्ण क्षणचित्रे.'
              )}
            </p>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="container-xl mt-10 sm:mt-12">
        {/* Placeholder disclaimer badge */}
        <div className="mb-8 p-4 rounded-xl bg-saffron-50 border border-saffron-200 text-xs sm:text-sm text-charcoal-700 flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-saffron-500 flex-shrink-0 mt-0.5" />
          <p>
            <strong className="font-semibold text-saffron-900 mr-1.5">
              {t('[Preview Mode Notice]:', '[पूर्वावलोकन सूचना]:')}
            </strong>
            {t(
              'The photos and captions below represent design placeholders. High-resolution archival event photos will be synchronized via the administrative media portal.',
              'खालील छायाचित्रे व कॅप्शन्स मांडणी दर्शवण्यासाठी प्रातिनिधिक आहेत. अधिकृत उच्च दर्जाची छायाचित्रे लवकरच प्रशासकीय मीडिया पोर्टलद्वारे अद्ययावत केली जातील.'
            )}
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 sm:mb-12 no-scrollbar">
          <div className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-charcoal-500 uppercase tracking-wider flex-shrink-0">
            <Filter className="w-3.5 h-3.5" />
            <span>{t('Category:', 'वर्ग:')}</span>
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

        {/* Gallery Grid (4 col desktop, 3 col tablet, 2 col mobile) */}
        <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          <AnimatePresence>
            {filteredItems.map((item, idx) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: idx * 0.03 }}
                onClick={() => openLightbox(idx)}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openLightbox(idx);
                  }
                }}
                className="group relative aspect-square sm:aspect-[4/3] rounded-xl overflow-hidden bg-white border border-charcoal-200 shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-saffron-500"
              >
                <OptimizedImage
                  src={item.image_url}
                  alt={t(item.alt_text_en, item.alt_text_mr)}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                />

                {/* Hover Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/90 via-charcoal-950/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3.5 sm:p-4 text-white" />

                {/* Category Badge on hover */}
                <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-saffron-500 text-white shadow-xs">
                    {item.category}
                  </span>
                </div>

                {/* Zoom Icon on hover */}
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white">
                    <Maximize2 className="w-4 h-4" />
                  </div>
                </div>

                {/* Caption at bottom on hover */}
                <div className="absolute bottom-0 inset-x-0 p-3 sm:p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white z-10 pointer-events-none">
                  <p className="text-xs sm:text-sm font-medium leading-snug line-clamp-2 text-ivory-100">
                    {t(item.caption_en || '', item.caption_mr || '')}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-charcoal-200 my-8 p-6">
            <Images className="w-12 h-12 text-charcoal-300 mx-auto mb-3" />
            <p className="text-charcoal-700 font-heading text-xl font-bold mb-2">
              {t('No photos in this category', 'या वर्गात कोणतीही छायाचित्रे नाहीत')}
            </p>
            <button
              onClick={() => setSelectedCategory('all')}
              className="btn-primary mt-4"
            >
              {t('Show All Photos', 'सर्व छायाचित्रे पहा')}
            </button>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {activeItem && activeImageIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6"
            onClick={closeLightbox}
          >
            {/* Top Toolbar */}
            <div
              className="flex items-center justify-between z-10 text-white/90"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3">
                <span className="text-xs sm:text-sm font-semibold tracking-wider px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                  {activeImageIndex + 1} / {filteredItems.length}
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider text-saffron-400">
                  {activeItem.category}
                </span>
              </div>

              <button
                onClick={closeLightbox}
                className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                aria-label={t('Close lightbox', 'बंद करा')}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Main Stage with Image and Prev/Next */}
            <div
              className="relative flex-1 flex items-center justify-center my-2 max-h-[75vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Prev Button */}
              {filteredItems.length > 1 && (
                <button
                  onClick={showPrev}
                  className="absolute left-2 sm:left-6 z-20 p-3 rounded-full bg-black/60 hover:bg-black/90 text-white transition-all duration-200 border border-white/20 cursor-pointer shadow-lg hover:scale-105"
                  aria-label={t('Previous photo', 'मागील फोटो')}
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              )}

              {/* Large Image */}
              <motion.div
                key={activeItem.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                className="max-w-4xl max-h-full w-full h-full flex items-center justify-center p-2"
              >
                <img
                  src={activeItem.image_url}
                  alt={t(activeItem.alt_text_en, activeItem.alt_text_mr)}
                  className="max-h-[70vh] max-w-full object-contain rounded-lg shadow-2xl"
                />
              </motion.div>

              {/* Next Button */}
              {filteredItems.length > 1 && (
                <button
                  onClick={showNext}
                  className="absolute right-2 sm:right-6 z-20 p-3 rounded-full bg-black/60 hover:bg-black/90 text-white transition-all duration-200 border border-white/20 cursor-pointer shadow-lg hover:scale-105"
                  aria-label={t('Next photo', 'पुढील फोटो')}
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              )}
            </div>

            {/* Bottom Caption Bar */}
            <div
              className="max-w-2xl mx-auto text-center z-10 p-3 rounded-xl bg-black/40 backdrop-blur-sm border border-white/10 text-white"
              onClick={(e) => e.stopPropagation()}
            >
              <p className="text-sm sm:text-base font-medium text-ivory-100 mb-1">
                {t(activeItem.caption_en || '', activeItem.caption_mr || '')}
              </p>
              <p className="text-xs text-white/50">
                {t(
                  'Use left/right arrows to navigate • Esc to exit',
                  'नेव्हिगेट करण्यासाठी डावा/उजवा बाण वापरा • बाहेर पडण्यासाठी Esc दाबा'
                )}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

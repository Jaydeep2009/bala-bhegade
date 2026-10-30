import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Pause,
  Play,
  ShieldCheck,
} from 'lucide-react';
import type { HomepageSection, HeroSlide } from '@/types/database';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { mockHomepageSections, DEFAULT_HERO_SLIDES } from '@/lib/mock-data';

export interface HeroSectionProps {
  section?: HomepageSection | null;
  data?: HomepageSection | null;
}

const defaultHero = mockHomepageSections.find((s) => s.section_key === 'hero');

export function HeroSection({ section, data }: HeroSectionProps) {
  const { isMarathi } = useLanguage();
  const shouldReduceMotion = useReducedMotion();
  const current = section || data || defaultHero;

  const cfg = (current?.config as Record<string, unknown>) || {};

  // Resolve slides dynamically from admin config, falling back to verified default slides
  const configSlides =
    Array.isArray(cfg.slides) && cfg.slides.length > 0
      ? (cfg.slides as HeroSlide[])
      : null;

  const baseSlides: HeroSlide[] = configSlides && configSlides.length > 0 ? configSlides : DEFAULT_HERO_SLIDES;

  // If root current.image_url is set and differs from slide 0, sync slide 0's image
  const primaryBannerUrl =
    current?.image_url && !current.image_url.includes('placeholder-hero')
      ? current.image_url
      : null;

  const slides: HeroSlide[] = baseSlides.map((s, idx) => {
    if (idx === 0 && primaryBannerUrl && primaryBannerUrl !== s.image) {
      return { ...s, image: primaryBannerUrl, mobileImage: primaryBannerUrl };
    }
    return s;
  });

  const autoplayEnabled = cfg.autoplay !== false;
  const rawInterval = typeof cfg.autoplayInterval === 'number' ? cfg.autoplayInterval : 7;
  const autoplayInterval = Math.max(rawInterval, 3) * 1000;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const totalSlides = slides.length;
  const activeSlide = slides[currentIndex];

  const handleNext = useCallback(() => {
    setDirection('next');
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const handlePrev = useCallback(() => {
    setDirection('prev');
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  const handleGoTo = (index: number) => {
    setDirection(index > currentIndex ? 'next' : 'prev');
    setCurrentIndex(index);
  };

  // Autoplay timer, pauses on hover, when document is hidden, or if disabled in admin
  useEffect(() => {
    if (!isPlaying || isHovered || !autoplayEnabled) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      handleNext();
    }, autoplayInterval);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, isHovered, autoplayEnabled, autoplayInterval, handleNext]);

  // Pause when browser tab is not visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsPlaying(false);
      } else {
        setIsPlaying(true);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      handleNext();
    } else if (e.key === 'ArrowLeft') {
      handlePrev();
    }
  };

  const handleScrollDown = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth',
    });
  };

  const cinematicEase = [0.16, 1, 0.3, 1];

  return (
    <section
      role="region"
      aria-roledescription="carousel"
      aria-label={isMarathi ? 'मुख्य दालन' : 'Featured Campaign Hero Carousel'}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative w-full h-screen min-h-[600px] overflow-hidden bg-charcoal-950 select-none focus:outline-none"
      style={{ height: '100svh', minHeight: '600px' }}
    >
      {/* ============================================================ */}
      {/* 1. FULL-VIEWPORT BACKGROUND IMAGE SLIDESHOW                   */}
      {/* ============================================================ */}
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={activeSlide.id}
          custom={direction}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.1, ease: 'easeInOut' }}
          className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden"
        >
          {/* Subtle Ken Burns Zoom settling from 1.05 to 1.0 */}
          <motion.img
            src={activeSlide.image}
            alt={isMarathi ? activeSlide.title_mr : activeSlide.title_en}
            initial={shouldReduceMotion ? { scale: 1 } : { scale: 1.05 }}
            animate={{ scale: 1 }}
            transition={{ duration: 7, ease: [0.16, 1, 0.3, 1] }}
            style={{
              objectPosition: activeSlide.focalPointDesktop || 'center center',
            }}
            className="w-full h-full object-cover object-center max-w-none"
            loading="eager"
            decoding="async"
            onError={(e) => {
              // Graceful fallback to static asset
              e.currentTarget.src = '/images/hero-campaign-banner.png';
            }}
          />
        </motion.div>
      </AnimatePresence>

      {/* ============================================================ */}
      {/* 2. ATMOSPHERIC LIGHTING OVERLAYS (Ensures legibility & beauty) */}
      {/* ============================================================ */}
      {/* Top subtle vignette so transparent navbar text is 100% crisp */}
      <div className="absolute top-0 inset-x-0 h-36 bg-gradient-to-b from-charcoal-950/80 via-charcoal-950/30 to-transparent pointer-events-none z-10" />

      {/* Bottom cinematic gradient overlay for lower-third content */}
      <div className="absolute bottom-0 inset-x-0 h-[62%] sm:h-[55%] bg-gradient-to-t from-charcoal-950/95 via-charcoal-950/60 to-transparent pointer-events-none z-10" />

      {/* Subtle warm saffron and green atmospheric glow on edges */}
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-saffron-500/15 rounded-full blur-3xl pointer-events-none z-10" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-green-600/10 rounded-full blur-3xl pointer-events-none z-10" />

      {/* ============================================================ */}
      {/* 3. HERO CONTENT POSITIONED IN LOWER THIRD (narendramodi.in style) */}
      {/* ============================================================ */}
      <div className="absolute inset-0 flex flex-col justify-end z-20 pb-16 sm:pb-20 lg:pb-24 pointer-events-none">
        <div className="container-xl w-full pointer-events-auto">
          <div className="max-w-3xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSlide.id}
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.65, ease: cinematicEase }}
                className="flex flex-col items-start"
              >
                {/* Official Mandate Tagline Badge */}
                <div className="mb-3 sm:mb-4">
                  <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold tracking-wide bg-charcoal-900/80 text-saffron-300 border border-saffron-400/40 backdrop-blur-md shadow-md">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-saffron-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-saffron-400" />
                    </span>
                    <span>{isMarathi ? activeSlide.badge_mr : activeSlide.badge_en}</span>
                  </span>
                </div>

                {/* Main Headline */}
                {/* If Slide 1 (hasBakedHeadline), the banner artwork already displays the Marathi slogan prominently */}
                {activeSlide.hasBakedHeadline ? (
                  <div className="mb-2">
                    <p className="font-heading font-bold text-2xl sm:text-3xl lg:text-4xl text-white tracking-tight drop-shadow-md">
                      {isMarathi ? 'संजय (बाळा) विश्वनाथ भेगडे' : 'Sanjay (Bala) Vishwanath Bhegade'}
                    </p>
                    <p className="text-saffron-400 font-semibold text-sm sm:text-base tracking-wide flex items-center gap-2 mt-0.5">
                      <ShieldCheck className="w-4 h-4 text-green-400 flex-shrink-0" />
                      <span>{isMarathi ? 'माजी राज्यमंत्री, महाराष्ट्र शासन' : 'Former Minister of State, Maharashtra'}</span>
                    </p>
                  </div>
                ) : (
                  <h1 className="font-heading font-bold text-3xl sm:text-4xl md:text-5xl text-white tracking-tight mb-2 leading-tight drop-shadow-md">
                    {isMarathi ? activeSlide.title_mr : activeSlide.title_en}
                  </h1>
                )}

                {/* Subtitle / Narrative Line */}
                <p className="text-warmWhite-100/90 text-sm sm:text-base lg:text-lg max-w-2xl leading-relaxed mb-6 font-light drop-shadow-sm">
                  {isMarathi ? activeSlide.subtitle_mr : activeSlide.subtitle_en}
                </p>

                {/* Interactive CTA Buttons */}
                <div className="flex flex-wrap items-center gap-3.5 sm:gap-4">
                  <Link
                    to={activeSlide.cta1.url}
                    className="inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3 rounded-lg font-semibold text-sm sm:text-base text-white bg-saffron-500 hover:bg-saffron-600 shadow-lg shadow-saffron-950/60 hover:shadow-saffron-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer group"
                  >
                    <span>{isMarathi ? activeSlide.cta1.label_mr : activeSlide.cta1.label_en}</span>
                    <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>

                  {activeSlide.cta2 && (
                    <Link
                      to={activeSlide.cta2.url}
                      className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3 rounded-lg font-semibold text-sm sm:text-base text-white bg-charcoal-900/60 hover:bg-charcoal-900/90 border border-white/30 hover:border-saffron-400 backdrop-blur-md hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
                    >
                      <span>{isMarathi ? activeSlide.cta2.label_mr : activeSlide.cta2.label_en}</span>
                    </Link>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 4. CAROUSEL CONTROLS & INDICATORS (Near lower-right corner)  */}
      {/* ============================================================ */}
      <div className="absolute bottom-6 right-6 sm:bottom-10 sm:right-10 z-30 flex items-center gap-3">
        {/* Slide Counter (e.g. 01 / 04) */}
        <div className="hidden sm:flex items-center text-xs font-mono font-bold tracking-widest text-white/80 bg-charcoal-900/70 border border-white/20 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm">
          <span className="text-saffron-400">0{currentIndex + 1}</span>
          <span className="mx-1.5 text-white/40">/</span>
          <span>0{totalSlides}</span>
        </div>

        {/* Slide Dots / Indicators */}
        <div className="flex items-center gap-1.5 bg-charcoal-900/70 border border-white/20 backdrop-blur-md px-2.5 py-1.5 rounded-full shadow-sm">
          {slides.map((slide, idx) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => handleGoTo(idx)}
              className={`h-2 rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-saffron-500 ${
                idx === currentIndex
                  ? 'w-7 bg-saffron-500'
                  : 'w-2 bg-white/40 hover:bg-white/80'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
              aria-current={idx === currentIndex ? 'true' : 'false'}
            />
          ))}
        </div>

        {/* Previous / Next Arrow Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handlePrev}
            className="w-9 h-9 rounded-full bg-charcoal-900/70 hover:bg-saffron-500 border border-white/20 hover:border-saffron-400 text-white flex items-center justify-center backdrop-blur-md transition-colors shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-saffron-500"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="w-9 h-9 rounded-full bg-charcoal-900/70 hover:bg-saffron-500 border border-white/20 hover:border-saffron-400 text-white flex items-center justify-center backdrop-blur-md transition-colors shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-saffron-500"
            aria-label="Next slide"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Autoplay Pause / Play Toggle */}
          <button
            type="button"
            onClick={() => setIsPlaying((p) => !p)}
            className="w-9 h-9 rounded-full bg-charcoal-900/70 hover:bg-charcoal-800 border border-white/20 text-white/80 hover:text-white flex items-center justify-center backdrop-blur-md transition-colors shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-saffron-500"
            aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 5. SMOOTH SCROLL DOWN BUTTON (Centered at viewport bottom)  */}
      {/* ============================================================ */}
      <motion.button
        type="button"
        onClick={handleScrollDown}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-1 text-white/70 hover:text-white transition-colors cursor-pointer group"
        aria-label="Scroll down to content"
      >
        <span className="text-[10px] uppercase tracking-widest font-semibold group-hover:text-saffron-400 transition-colors drop-shadow-sm">
          {isMarathi ? 'खाली स्क्रोल करा' : 'Scroll Down'}
        </span>
        <motion.div
          animate={shouldReduceMotion ? {} : { y: [0, 4, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-4 h-4 text-saffron-400" />
        </motion.div>
      </motion.button>

      {/* ============================================================ */}
      {/* 6. BJP TRI-COLOR ACCENT LINE AT HERO BOTTOM                  */}
      {/* ============================================================ */}
      <div className="absolute bottom-0 inset-x-0 h-1.5 flex z-30 pointer-events-none">
        <div className="w-1/3 bg-saffron-500" />
        <div className="w-1/3 bg-white" />
        <div className="w-1/3 bg-green-600" />
      </div>
    </section>
  );
}

export default HeroSection;

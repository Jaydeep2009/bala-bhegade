import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import {
  HeartHandshake,
  ShieldCheck,
  GraduationCap,
  Sprout,
  Users,
  Award,
  Calendar,
  ArrowRight,
  Quote,
  Sparkles,
  MapPin,
  CheckCircle2,
  Heart,
  Building2,
} from 'lucide-react';
import { useLanguage, useAutoTranslate } from '@/lib/i18n/LanguageContext';
import { mockSiteSettings } from '@/lib/mock-data';
import {
  getLeaderProfile,
  getAboutPageData,
  type LeaderProfile,
  type AboutPageData,
} from '@/lib/api';
import { DEFAULT_ABOUT_PAGE_DATA } from '@/lib/pageDataDefaults';
import SectionHeading from '@/components/ui/SectionHeading';
import AnimatedCounter from '@/components/ui/AnimatedCounter';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  ShieldCheck,
  Sprout,
  GraduationCap,
  Users,
  Award,
  HeartHandshake,
  Heart,
  Building2,
};

export default function AboutPage() {
  const { t, isMarathi } = useLanguage();
  const location = useLocation();
  const passedImage = (location.state as { profileImage?: string } | null)?.profileImage;

  const [pageData, setPageData] = useState<AboutPageData>(DEFAULT_ABOUT_PAGE_DATA);

  const [profile, setProfile] = useState<LeaderProfile>(() => ({
    name_en: mockSiteSettings.profile.name_en,
    name_mr: mockSiteSettings.profile.name_mr,
    title_en: mockSiteSettings.profile.title_en,
    title_mr: mockSiteSettings.profile.title_mr,
    bio_en: mockSiteSettings.profile.bio_en,
    bio_mr: mockSiteSettings.profile.bio_mr,
    profile_image: passedImage || mockSiteSettings.profile.profile_image || '/images/bala-bhegade-portrait.png',
  }));

  useEffect(() => {
    // 1. Fetch full about page data (editable by admin)
    getAboutPageData().then((data) => {
      if (data) {
        setPageData(data);
      }
    });

    // 2. Fetch leader profile
    getLeaderProfile().then((data) => {
      if (data) {
        setProfile((prev) => ({
          ...data,
          profile_image:
            (data.profile_image && !data.profile_image.includes('placeholder-profile'))
              ? data.profile_image
              : (passedImage || data.profile_image || prev.profile_image),
        }));
      }
    });
  }, [passedImage]);

  const heroName = pageData.hero.name_en || profile.name_en;
  const heroNameMr = pageData.hero.name_mr || profile.name_mr;
  const heroTitle = pageData.hero.title_en || profile.title_en;
  const heroTitleMr = pageData.hero.title_mr || profile.title_mr;
  const heroBio = pageData.hero.bio_summary_en || profile.bio_en;
  const heroBioMr = pageData.hero.bio_summary_mr || profile.bio_mr;
  const heroImage =
    pageData.hero.profile_image && !pageData.hero.profile_image.includes('placeholder-profile')
      ? pageData.hero.profile_image
      : profile.profile_image || '/images/bala-bhegade-portrait.png';

  const displayBio = useAutoTranslate(heroBio, heroBioMr);
  const displayTitle = useAutoTranslate(heroTitle, heroTitleMr);
  const displayBadge = useAutoTranslate(pageData.hero.badge_en, pageData.hero.badge_mr);

  const milestones = pageData.milestones && pageData.milestones.length > 0
    ? pageData.milestones
    : DEFAULT_ABOUT_PAGE_DATA.milestones;

  const chapters = pageData.chapters && pageData.chapters.length > 0
    ? pageData.chapters
    : DEFAULT_ABOUT_PAGE_DATA.chapters;

  const coreValues = pageData.values && pageData.values.length > 0
    ? pageData.values
    : DEFAULT_ABOUT_PAGE_DATA.values;

  const valuesContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const valueCardVariants = {
    hidden: { opacity: 0, y: 35 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.65,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <div className="min-h-screen bg-ivory-50 text-charcoal-900">
      <Helmet>
        <title>
          {isMarathi
            ? 'परिचय - बाळा भेगडे | जीवनप्रवास आणि कार्य'
            : 'About - Bala Bhegade | Biography & Journey'}
        </title>
        <meta
          name="description"
          content={
            isMarathi
              ? 'बाळा भेगडे यांचा जीवनप्रवास, तत्त्वे, आणि समाजविकासासाठी केलेले कार्य याबद्दलची माहिती.'
              : 'Learn about Bala Bhegade, dedicated public leader, his life journey, values, and vision for community empowerment.'
          }
        />
      </Helmet>

      {/* Hero-style compact banner with Floating Portrait & Cinematic Masked Reveal */}
      <section className="relative overflow-hidden bg-gradient-to-b from-warmWhite-200 via-white to-warmWhite-100 text-charcoal-900 py-16 sm:py-20 lg:py-24 border-b border-charcoal-200/80">
        <div className="absolute top-0 right-0 w-96 h-96 bg-saffron-100/30 rounded-full blur-3xl -z-0 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-green-100/30 rounded-full blur-3xl -z-0 pointer-events-none" />

        <div className="container-xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Profile Photo with Cinematic Floating Motion & Breathing Saffron Glow */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-5 flex justify-center lg:justify-start"
            >
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                className="relative group"
              >
                {/* Breathing Saffron Backdrop Aura */}
                <motion.div
                  animate={{ opacity: [0.35, 0.7, 0.35], scale: [0.98, 1.05, 0.98] }}
                  transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -inset-3 rounded-3xl bg-gradient-to-tr from-saffron-500/40 via-saffron-400/25 to-amber-300/10 blur-xl group-hover:blur-2xl transition-all"
                />

                {/* Portrait Card */}
                <div className="relative w-64 h-80 sm:w-72 sm:h-96 md:w-80 md:h-[430px] rounded-2xl overflow-hidden border-2 border-saffron-400/70 shadow-2xl bg-warmWhite-100 flex items-center justify-center transition-all duration-500 group-hover:border-saffron-500 group-hover:shadow-saffron-500/25">
                  <img
                    key={heroImage}
                    src={heroImage}
                    alt={t(heroName, heroNameMr)}
                    className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-700 ease-out"
                    loading="eager"
                    decoding="async"
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.style.display = 'none';
                      if (target.parentElement && !target.parentElement.querySelector('.profile-avatar-fallback')) {
                        const fallback = document.createElement('div');
                        fallback.className = 'profile-avatar-fallback w-full h-full bg-gradient-to-br from-saffron-500 to-saffron-600 flex flex-col items-center justify-center p-8 text-center text-white';
                        fallback.innerHTML = `
                          <span class="font-heading font-bold text-5xl mb-2">BB</span>
                          <span class="text-sm font-semibold text-saffron-100 tracking-wider uppercase">${isMarathi ? 'मा. बाळा भेगडे' : 'Bala Bhegade'}</span>
                        `;
                        target.parentElement.appendChild(fallback);
                      }
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/85 via-charcoal-950/20 to-transparent pointer-events-none" />
                  
                  {/* Subtle top saffron-white-green bar on hover */}
                  <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-saffron-500 via-white to-green-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="absolute bottom-4 left-4 right-4 text-center pointer-events-none transform group-hover:-translate-y-1 transition-transform duration-300">
                    <span className="inline-block px-3.5 py-1 bg-saffron-500 text-white font-semibold text-xs rounded-full uppercase tracking-wider shadow-md border border-saffron-400/50">
                      {t('Grassroots Leader', 'लोकनेता')}
                    </span>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Profile Header Details with Masked Name Reveal */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-7 text-center lg:text-left"
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-saffron-50 border border-saffron-200 text-saffron-700 text-xs sm:text-sm font-medium mb-4 shadow-2xs"
              >
                <Sparkles className="w-4 h-4 text-saffron-500" />
                <span>{displayBadge}</span>
              </motion.div>

              {/* Masked Headline Reveal */}
              <div className="overflow-hidden py-1 mb-2">
                <motion.h1
                  initial={{ y: '115%', opacity: 0 }}
                  animate={{ y: '0%', opacity: 1 }}
                  transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
                  className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-charcoal-900"
                >
                  {t(heroName, heroNameMr)}
                </motion.h1>
              </div>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-xl sm:text-2xl text-saffron-600 font-semibold mb-6"
              >
                {displayTitle}
              </motion.p>

              {/* Bio Summary */}
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.28 }}
                className="text-charcoal-700 text-base sm:text-lg max-w-2xl leading-relaxed mb-8"
              >
                {displayBio}
              </motion.p>

              {/* Stat Highlights - Verified Legislative & Ministerial Mandates with Magnetic Lift */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.35 }}
                className="grid grid-cols-3 gap-3 sm:gap-4 pt-4 border-t border-charcoal-200 max-w-xl mx-auto lg:mx-0"
              >
                <div className="p-3 sm:p-4 rounded-xl bg-white border border-charcoal-200 shadow-xs hover:border-saffron-300 hover:shadow-md hover:-translate-y-1 transition-all duration-300 ease-out group text-center sm:text-left">
                  <div className="font-heading text-2xl sm:text-3xl font-bold text-saffron-600 flex items-baseline justify-center sm:justify-start gap-1">
                    <AnimatedCounter target={pageData.hero.stat_terms || 2} />
                    <span>{isMarathi ? 'वेळा' : 'Terms'}</span>
                  </div>
                  <div className="text-xs sm:text-sm text-charcoal-600 font-medium">
                    {t(pageData.hero.stat_terms_label_en, pageData.hero.stat_terms_label_mr)}
                  </div>
                </div>

                <div className="p-3 sm:p-4 rounded-xl bg-white border border-charcoal-200 shadow-xs hover:border-saffron-300 hover:shadow-md hover:-translate-y-1 transition-all duration-300 ease-out group text-center sm:text-left">
                  <div className="font-heading text-2xl sm:text-3xl font-bold text-saffron-600">
                    {pageData.hero.stat_role_en || 'MoS'}
                  </div>
                  <div className="text-xs sm:text-sm text-charcoal-600 font-medium">
                    {t(pageData.hero.stat_role_desc_en, pageData.hero.stat_role_desc_mr)}
                  </div>
                </div>

                <div className="p-3 sm:p-4 rounded-xl bg-white border border-charcoal-200 shadow-xs hover:border-saffron-300 hover:shadow-md hover:-translate-y-1 transition-all duration-300 ease-out group text-center sm:text-left">
                  <div className="font-heading text-2xl sm:text-3xl font-bold text-saffron-600">
                    {pageData.hero.stat_region_en || 'Maval'}
                  </div>
                  <div className="text-xs sm:text-sm text-charcoal-600 font-medium">
                    {t(pageData.hero.stat_region_desc_en, pageData.hero.stat_region_desc_mr)}
                  </div>
                </div>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.42 }}
                className="flex flex-wrap gap-4 mt-8 justify-center lg:justify-start"
              >
                <Link to="/public-work" className="btn-primary group">
                  <span>{t('Explore Public Work', 'सार्वजनिक कार्य पहा')}</span>
                  <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/contact" className="btn-secondary">
                  {t('Get in Touch', 'संपर्क साधा')}
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Full Biography Section with Refined Editorial Flow */}
      <section className="py-16 sm:py-24 bg-ivory-50">
        <div className="container-lg">
          <SectionHeading
            title={t('Biography & Public Commitment', 'चरित्र व जनसेवेचा संकल्प')}
            subtitle={t(
              'A lifetime rooted in the soil, dedicated to public good and empowering future generations.',
              'मातीशी घट्ट नाळ, जनहिताचा ध्यास आणि भावी पिढीच्या उज्ज्वल भविष्यासाठी सातत्यपूर्ण कार्य.'
            )}
            align="center"
          />

          {/* Pull Quote with Float Watermark & Magnetic Border */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="my-10 relative bg-warmWhite-200/90 text-charcoal-900 p-6 sm:p-10 rounded-2xl shadow-xs hover:shadow-xl hover:border-saffron-400 transition-all duration-300 overflow-hidden border-l-4 border-saffron-500 border border-charcoal-200/80 group"
          >
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -right-4 -bottom-4 pointer-events-none"
            >
              <Quote className="w-32 h-32 text-saffron-500/10" />
            </motion.div>
            <p className="font-heading italic text-lg sm:text-2xl text-charcoal-900 leading-relaxed mb-4">
              "{t(pageData.quote.text_en, pageData.quote.text_mr)}"
            </p>
            <div className="flex items-center gap-3 text-saffron-600 text-sm font-semibold tracking-wide">
              <span>— {t(pageData.quote.author_en || heroName, pageData.quote.author_mr || heroNameMr)}</span>
            </div>
          </motion.div>

          {/* Editorial Content with Staggered Story Segments */}
          <div className="prose-editorial max-w-none space-y-8 text-charcoal-800 text-base sm:text-lg leading-relaxed">
            {chapters.map((ch, idx) => (
              <motion.div
                key={ch.id || idx}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-4 bg-white/70 rounded-2xl p-6 sm:p-8 border border-charcoal-200/80 shadow-2xs hover:shadow-md transition-shadow"
              >
                <h3 className="text-2xl font-bold text-charcoal-900 font-heading border-l-3 border-saffron-500 pl-3.5">
                  {t(ch.title_en, ch.title_mr)}
                </h3>
                <div className="space-y-4 text-charcoal-700 leading-relaxed whitespace-pre-line">
                  {t(ch.content_en, ch.content_mr)}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Guiding Principles & Core Values Section with Domino Wave & Magnetic Lift */}
      <section className="py-16 sm:py-24 bg-warmWhite-200/50 border-y border-charcoal-200/80">
        <div className="container-xl">
          <SectionHeading
            title={t('Core Values & Guiding Principles', 'मूल्ये व तत्त्वे')}
            subtitle={t(
              'The ethical foundation that shapes every initiative, policy decision, and public interaction.',
              'प्रत्येक निर्णय, धोरण आणि लोकसेवेमागील तत्त्वनिष्ठ विचारसरणी.'
            )}
            align="center"
          />

          <motion.div
            variants={valuesContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mt-10"
          >
            {coreValues.map((val, idx) => {
              const Icon = ICON_MAP[val.icon_name] || ShieldCheck;
              return (
                <motion.div
                  key={val.id || idx}
                  variants={valueCardVariants}
                  className="group bg-white rounded-2xl p-6 sm:p-8 shadow-xs hover:shadow-2xl hover:border-saffron-400 hover:-translate-y-2 transition-all duration-300 ease-out border border-charcoal-200/90 flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-saffron-50 text-saffron-600 flex items-center justify-center mb-5 group-hover:bg-saffron-500 group-hover:text-white group-hover:scale-110 group-hover:shadow-md transition-all duration-300 shadow-xs">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h4 className="font-heading text-xl font-bold text-charcoal-900 mb-2 group-hover:text-saffron-600 transition-colors">
                      {t(val.title_en, val.title_mr)}
                    </h4>
                    <p className="text-charcoal-600 text-sm sm:text-base leading-relaxed">
                      {t(val.description_en, val.description_mr)}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Key Milestones Timeline Section with Alternating Directional Glide & Pulsing Nodes */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="container-lg">
          <SectionHeading
            title={t('Key Milestones & Journey', 'महत्त्वाचे टप्पे व वाटचाल')}
            subtitle={t(
              'A documented path of dedication, service, and developmental breakthroughs over the years.',
              'वर्षानुवर्षे अखंड परिश्रम, विकासकामे आणि समाजसेवेची यशस्वी वाटचाल.'
            )}
            align="center"
          />

          <div className="relative mt-14">
            {/* Center Timeline Spine with Animated Reveal */}
            <motion.div
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              style={{ originY: 0 }}
              className="hidden md:block absolute left-1/2 top-4 bottom-4 -translate-x-1/2 w-1 bg-gradient-to-b from-saffron-400 via-saffron-500 to-green-600 rounded-full"
            />

            <div className="space-y-8 sm:space-y-12">
              {milestones.map((milestone, idx) => {
                const isEven = idx % 2 === 0;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: isEven ? -45 : 45 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
                    className={`relative flex flex-col md:flex-row items-center ${
                      isEven ? 'md:flex-row-reverse' : ''
                    }`}
                  >
                    {/* Content Card with Magnetic Lift */}
                    <div className="w-full md:w-1/2 px-0 md:px-8">
                      <div className="group bg-white rounded-2xl p-6 sm:p-7 shadow-xs hover:shadow-2xl border border-charcoal-200/90 hover:border-saffron-400 hover:-translate-y-1.5 transition-all duration-300 ease-out border-t-4 border-t-saffron-500">
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-heading text-2xl sm:text-3xl font-bold text-saffron-600 group-hover:scale-105 transition-transform duration-300 origin-left">
                            {milestone.year}
                          </span>
                          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-saffron-50 text-saffron-700 border border-saffron-200 shadow-2xs">
                            {t(milestone.tag_en, milestone.tag_mr)}
                          </span>
                        </div>
                        <h4 className="font-heading text-lg sm:text-xl font-bold text-charcoal-900 group-hover:text-saffron-600 transition-colors mb-2">
                          {t(milestone.title_en, milestone.title_mr)}
                        </h4>
                        <p className="text-charcoal-600 text-sm leading-relaxed mb-3">
                          {t(milestone.description_en, milestone.description_mr)}
                        </p>
                        <div className="text-[11px] font-medium text-saffron-700/80 flex items-center gap-1.5 pt-2.5 border-t border-charcoal-100">
                          <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
                          <span>{t('Verified Historical Milestone', 'प्रमाणित राजकीय टप्पा नोंद')}</span>
                        </div>
                      </div>
                    </div>

                    {/* Timeline Center Node with Pulsing Aura Ring */}
                    <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center justify-center w-10 h-10 rounded-full bg-white border-4 border-saffron-500 shadow-lg text-charcoal-900 z-10 group-hover:scale-110 transition-transform duration-300">
                      <div className="w-2.5 h-2.5 rounded-full bg-green-600" />
                      <div className="absolute -inset-1.5 rounded-full bg-saffron-400/35 animate-ping -z-10" />
                    </div>

                    {/* Empty placeholder spacer for alternating side */}
                    <div className="hidden md:block w-1/2" />
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Bottom CTA Card with Ambient Shimmer & Interactive Buttons */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 25 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mt-16 sm:mt-20 p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-saffron-500 via-saffron-600 to-saffron-500 text-white text-center shadow-xl relative overflow-hidden"
          >
            <div className="relative z-10">
              <h3 className="font-heading text-2xl sm:text-3xl font-bold mb-3 text-white">
                {t(pageData.bottom_cta.headline_en, pageData.bottom_cta.headline_mr)}
              </h3>
              <p className="text-white/90 max-w-xl mx-auto mb-6 text-sm sm:text-base leading-relaxed">
                {t(pageData.bottom_cta.description_en, pageData.bottom_cta.description_mr)}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link
                  to={pageData.bottom_cta.btn1_url || '/public-work'}
                  className="inline-flex items-center justify-center rounded-xl bg-white px-6 py-3 text-sm font-semibold text-saffron-700 shadow-sm hover:bg-warmWhite-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
                >
                  <span>{t(pageData.bottom_cta.btn1_label_en, pageData.bottom_cta.btn1_label_mr)}</span>
                  <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to={pageData.bottom_cta.btn2_url || '/contact'}
                  className="inline-flex items-center justify-center rounded-xl border border-white/50 bg-white/10 px-6 py-3 text-sm font-semibold text-white hover:bg-white/20 hover:-translate-y-0.5 transition-all duration-200"
                >
                  {t(pageData.bottom_cta.btn2_label_en, pageData.bottom_cta.btn2_label_mr)}
                </Link>
              </div>
            </div>
            {/* Tri-color bottom strip */}
            <div className="absolute inset-x-0 bottom-0 h-2 flex">
              <div className="flex-1 bg-saffron-400" />
              <div className="flex-1 bg-white" />
              <div className="flex-1 bg-green-600" />
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronRight } from 'lucide-react';
import type { HomepageSection } from '@/types/database';
import { useLanguage, useAutoTranslate } from '@/lib/i18n/LanguageContext';
import { mockHomepageSections, mockSiteSettings } from '@/lib/mock-data';
import { getLeaderProfile, getAboutPageData } from '@/lib/api';
import SectionHeading from '@/components/ui/SectionHeading';

export interface CommunityPhotoItem {
  image_url: string;
  caption_en: string;
  caption_mr: string;
  location_en?: string;
  location_mr?: string;
  year?: string;
}

export interface AboutIntroSectionProps {
  section?: HomepageSection | null;
}

interface MilestoneItem {
  year_en: string;
  year_mr: string;
  title_en: string;
  title_mr: string;
  desc_en: string;
  desc_mr: string;
}

// Verified milestones as specified in requirements
const VERIFIED_MILESTONES: MilestoneItem[] = [
  {
    year_en: '2009',
    year_mr: '२००९',
    title_en: 'Elected MLA from Maval',
    title_mr: 'मावळचे आमदार म्हणून प्रथमच निवड',
    desc_en: 'Elected to the Maharashtra Legislative Assembly representing Maval constituency.',
    desc_mr: 'मावळ विधानसभा मतदारसंघातून पहिल्यांदा आमदार म्हणून लोकप्रतिनिधित्व सुरू केले.',
  },
  {
    year_en: '2014',
    year_mr: '२०१४',
    title_en: 'Re-elected MLA',
    title_mr: 'सलग दुसऱ्यांदा आमदार म्हणून फेरनिवड',
    desc_en: 'Re-elected for a second consecutive term in the Legislative Assembly.',
    desc_mr: 'मावळच्या मतदारांच्या विश्वासाने सलग दुसऱ्यांदा विधानसभेत फेरनिवड झाली.',
  },
  {
    year_en: '2019',
    year_mr: '२०१९',
    title_en: 'Served as Minister of State',
    title_mr: 'महाराष्ट्र शासन राज्यमंत्रिपद',
    desc_en: 'Appointed Minister of State in Maharashtra, holding key developmental portfolios.',
    desc_mr: 'महाराष्ट्र शासनात राज्यमंत्री म्हणून कामगार, पर्यावरण व पुनर्वसन खात्यांचा कार्यभार सांभाळला.',
  },
];

const defaultSection = mockHomepageSections.find((s) => s.section_key === 'about_intro');

export function AboutIntroSection({ section }: AboutIntroSectionProps) {
  const { isMarathi } = useLanguage();
  const current = section || defaultSection;

  const defaultPortrait = '/images/bala-bhegade-portrait.png';

  const [resolvedImageUrl, setResolvedImageUrl] = useState<string>(() => {
    const raw = current?.image_url;
    if (raw && !raw.includes('placeholder-profile')) return raw;
    const settingsImg = mockSiteSettings.profile.profile_image;
    if (settingsImg && !settingsImg.includes('placeholder-profile')) return settingsImg;
    return defaultPortrait;
  });

  const [timelineItems, setTimelineItems] = useState<MilestoneItem[]>(VERIFIED_MILESTONES);

  useEffect(() => {
    if (current?.image_url && !current.image_url.includes('placeholder-profile')) {
      setResolvedImageUrl(current.image_url);
    } else {
      getLeaderProfile().then((profile) => {
        if (profile?.profile_image && !profile.profile_image.includes('placeholder-profile')) {
          setResolvedImageUrl(profile.profile_image);
        } else {
          setResolvedImageUrl(defaultPortrait);
        }
      });
    }

    getAboutPageData().then((aboutData) => {
      if (aboutData?.milestones && aboutData.milestones.length > 0) {
        const mapped: MilestoneItem[] = aboutData.milestones.slice(0, 3).map((m) => ({
          year_en: m.year,
          year_mr: m.year,
          title_en: m.title_en,
          title_mr: m.title_mr,
          desc_en: m.description_en,
          desc_mr: m.description_mr,
        }));
        setTimelineItems(mapped);
      }
    });
  }, [current?.image_url]);

  // Filter out any placeholder text from bio
  const sanitizeBio = (content?: string | null): string => {
    if (!content) return '';
    if (content.toLowerCase().includes('placeholder') || content.includes('[Placeholder')) {
      return '';
    }
    return content.trim();
  };

  const defaultTitleEn = 'About Sanjay (Bala) Bhegade';
  const defaultTitleMr = 'संजय (बाळा) भेगडे यांच्याबद्दल';
  const defaultSubtitleEn = 'Former Minister of State, Maharashtra | Former MLA, Maval (2009–2019)';
  const defaultSubtitleMr = 'माजी राज्यमंत्री, महाराष्ट्र शासन | माजी आमदार, मावळ (२००९–२०१९)';

  const rawTitleEn = current?.title_en?.trim();
  const rawTitleMr = current?.title_mr?.trim();
  const title = useAutoTranslate(
    rawTitleEn || defaultTitleEn,
    rawTitleMr || (rawTitleEn ? undefined : defaultTitleMr)
  );

  const rawSubtitleEn = current?.subtitle_en?.trim();
  const rawSubtitleMr = current?.subtitle_mr?.trim();
  const subtitle = useAutoTranslate(
    rawSubtitleEn || defaultSubtitleEn,
    rawSubtitleMr || (rawSubtitleEn ? undefined : defaultSubtitleMr)
  );

  const rawBioEn = sanitizeBio(current?.content_en);
  const rawBioMr = sanitizeBio(current?.content_mr);

  // Auto-translate custom English bio to Marathi when Marathi version is not explicitly provided
  const customBio = useAutoTranslate(rawBioEn, rawBioMr);

  const defaultBioPara1 = isMarathi
    ? 'संजय (बाळा) विश्वनाथ भेगडे हे पुणे जिल्ह्यातील मावळ परिसरातील ज्येष्ठ राजकीय नेते आहेत. तळागाळातील युवा संघटनात्मक कार्यातून सार्वजनिक जीवनाची सुरुवात करून त्यांनी २००९ आणि २०१४ अशा सलग दोन विधानसभा निवडणुकांमध्ये मावळ मतदारसंघाचे प्रतिनिधित्व केले.'
    : 'Sanjay (Bala) Vishwanath Bhegade is a seasoned political leader from Maval taluka in Pune district, Maharashtra. Commencing his public journey through grassroots youth organisation, he was elected to represent the Maval constituency in the Maharashtra Legislative Assembly for two consecutive terms (2009–2019).';

  const defaultBioPara2 = isMarathi
    ? 'जून २०१९ मध्ये त्यांची महाराष्ट्र शासनाच्या राज्यमंत्रीपदी नियुक्ती झाली; या काळात त्यांनी कामगार, पर्यावरण, मदत व पुनर्वसन तसेच भूकंप पुनर्वसन खात्यांची जबाबदारी सांभाळली. आपल्या संपूर्ण सार्वजनिक वाटचालीत त्यांनी मावळ परिसरातील खेड्यापाड्यांशी, शहरांशी आणि नागरिकांशी निरंतर संवाद जपला आहे.'
    : 'In June 2019, he was appointed Minister of State in the Government of Maharashtra, overseeing key portfolios including Labour, Environment, Relief and Rehabilitation, and Earthquake Rehabilitation. Throughout his public life, he has maintained direct engagement with the villages, towns, and communities across Maval.';

  // Authentic community photos (from admin config if present)
  // Per instructions: "If suitable assets are unavailable, leave this element hidden until an administrator adds them."
  const communityPhotos = Array.isArray(current?.config?.community_photos)
    ? (current?.config?.community_photos as CommunityPhotoItem[])
    : [];

  return (
    <section
      id="about_intro"
      className="py-16 md:py-24 lg:py-28 bg-[#FFFDF9] border-y border-charcoal-200/70 relative overflow-hidden"
    >
      <div className="container-xl">
        {/* Main Two-Column Editorial Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 xl:gap-16 items-start">
          {/* ========================================================= */}
          {/* Left Column: Portrait Photograph & Editorial Caption      */}
          {/* ========================================================= */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 flex flex-col items-center lg:items-start"
          >
            <div className="w-full max-w-md lg:max-w-none">
              {/* Refined Photographic Frame */}
              <div className="relative rounded-xl overflow-hidden bg-warmWhite-200 border border-charcoal-200 shadow-md aspect-[4/5] w-full">
                <img
                  src={resolvedImageUrl}
                  alt={isMarathi ? 'संजय (बाळा) भेगडे' : 'Sanjay (Bala) Bhegade'}
                  loading="lazy"
                  className="w-full h-full object-cover object-top transition-transform duration-700 ease-out hover:scale-[1.02]"
                  onError={(e) => {
                    const img = e.currentTarget;
                    if (img.src !== defaultPortrait) {
                      img.src = defaultPortrait;
                    }
                  }}
                />
              </div>

              {/* Verified Editorial Caption below photograph */}
              <div className="mt-4 pt-3.5 border-t border-charcoal-200 text-left">
                <h3 className="font-heading font-bold text-base sm:text-lg text-charcoal-900 leading-snug">
                  {isMarathi ? 'संजय (बाळा) विश्वनाथ भेगडे' : 'Sanjay (Bala) Vishwanath Bhegade'}
                </h3>
                <p className="text-xs sm:text-sm text-charcoal-600 mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 leading-relaxed">
                  <span className="font-semibold text-saffron-700">
                    {isMarathi ? 'माजी राज्यमंत्री, महाराष्ट्र शासन' : 'Former Minister of State, Maharashtra'}
                  </span>
                  <span className="text-charcoal-400 hidden sm:inline" aria-hidden="true">•</span>
                  <span>
                    {isMarathi ? 'माजी आमदार, मावळ (२००९–२०१९)' : 'Former MLA, Maval (2009–2019)'}
                  </span>
                </p>
              </div>
            </div>
          </motion.div>

          {/* ========================================================= */}
          {/* Right Column: Editorial Biography, Milestones & Actions   */}
          {/* ========================================================= */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 flex flex-col items-start"
          >
            {/* Section Heading */}
            <SectionHeading
              align="left"
              badge={isMarathi ? 'परिचय व कार्यप्रवास' : 'Public Journey & Service'}
              title={title}
              subtitle={subtitle}
              className="mb-6 !items-start w-full"
            />

            {/* Factual Editorial Biography */}
            <div className="space-y-4 text-charcoal-700 text-base sm:text-[17px] leading-relaxed mb-8">
              {customBio ? (
                <div className="space-y-4">
                  {customBio.split('\n\n').map((paragraph, idx) => (
                    <p key={idx} className="whitespace-pre-line leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              ) : (
                <>
                  <p>{defaultBioPara1}</p>
                  <p className="text-charcoal-600 text-sm sm:text-base leading-relaxed">
                    {defaultBioPara2}
                  </p>
                </>
              )}
            </div>

            {/* ======================================================= */}
            {/* Political Journey Timeline (Replacing stat cards)       */}
            {/* ======================================================= */}
            <div className="w-full mb-9 pt-6 border-t border-charcoal-200/80">
              <div className="flex items-center gap-2 mb-5">
                <span className="w-2 h-2 rounded-full bg-saffron-500" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal-700">
                  {isMarathi ? 'प्रमुख राजकीय टप्पे' : 'Key Legislative Milestones'}
                </h4>
              </div>

              {/* Desktop Horizontal Milestone Sequence */}
              <div className="hidden sm:grid sm:grid-cols-3 gap-5 relative">
                {/* Connecting track across cards */}
                <div
                  className="absolute top-3.5 left-6 right-6 h-[1.5px] bg-charcoal-200 -z-0"
                  aria-hidden="true"
                />

                {timelineItems.map((m, idx) => (
                  <div key={idx} className="relative z-10 flex flex-col items-start pr-1">
                    {/* Year badge and node */}
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-7 h-7 rounded-full bg-[#FFFDF9] border-2 border-saffron-500 flex items-center justify-center shadow-xs">
                        <span className="w-2 h-2 rounded-full bg-saffron-600" />
                      </span>
                      <span className="font-heading font-bold text-xl lg:text-2xl text-charcoal-900 tracking-tight">
                        {isMarathi ? m.year_mr : m.year_en}
                      </span>
                    </div>

                    <h5 className="font-heading font-semibold text-sm lg:text-[15px] text-charcoal-900 leading-snug mt-1">
                      {isMarathi ? m.title_mr : m.title_en}
                    </h5>
                    <p className="text-xs sm:text-[13px] text-charcoal-600 mt-1 leading-relaxed">
                      {isMarathi ? m.desc_mr : m.desc_en}
                    </p>
                  </div>
                ))}
              </div>

              {/* Mobile Vertical Timeline */}
              <div className="sm:hidden space-y-6 relative pl-6 border-l-2 border-saffron-400/80 ml-2 py-1">
                {timelineItems.map((m, idx) => (
                  <div key={idx} className="relative">
                    {/* Node on vertical line */}
                    <span
                      className="absolute -left-[31px] top-0.5 w-5 h-5 rounded-full bg-white border-2 border-saffron-500 flex items-center justify-center shadow-xs"
                      aria-hidden="true"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-saffron-600" />
                    </span>

                    <span className="font-heading font-bold text-lg text-charcoal-900">
                      {isMarathi ? m.year_mr : m.year_en}
                    </span>
                    <h5 className="font-heading font-semibold text-sm text-charcoal-900 leading-snug mt-0.5">
                      {isMarathi ? m.title_mr : m.title_en}
                    </h5>
                    <p className="text-xs text-charcoal-600 mt-1 leading-relaxed">
                      {isMarathi ? m.desc_mr : m.desc_en}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* ======================================================= */}
            {/* Calls to Action: Single Primary Action & Subtle Link    */}
            {/* ======================================================= */}
            <div className="flex flex-wrap items-center gap-5 pt-2">
              <Link
                to="/public-work"
                className="btn-primary"
              >
                <span>{isMarathi ? 'विकासकामे पहा →' : 'Explore Public Work →'}</span>
              </Link>

              <Link
                to="/about"
                state={{ profileImage: resolvedImageUrl }}
                className="inline-flex items-center text-sm font-medium text-charcoal-700 hover:text-saffron-600 underline-offset-4 hover:underline transition-colors py-2 px-1"
              >
                <span>{isMarathi ? 'सविस्तर परिचय वाचा' : 'Read Full Biography'}</span>
                <ChevronRight className="w-4 h-4 ml-1 text-charcoal-400" />
              </Link>
            </div>
          </motion.div>
        </div>

        {/* =========================================================== */}
        {/* Authentic Public-Service Element: "Connected with Maval"    */}
        {/* Rendered ONLY when verified genuine community photos exist   */}
        {/* =========================================================== */}
        {communityPhotos.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
            className="mt-16 md:mt-20 pt-12 border-t border-charcoal-200"
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h4 className="font-heading text-xl md:text-2xl font-bold text-charcoal-900">
                  {isMarathi ? 'मावळशी जोडलेली नाळ' : 'Connected with Maval'}
                </h4>
                <p className="text-xs sm:text-sm text-charcoal-600 mt-1">
                  {isMarathi
                    ? 'मतदारसंघातील गावे, वाड्या आणि जनसंपर्क'
                    : 'Constituency visits and direct citizen engagement across Maval'}
                </p>
              </div>
            </div>

            {/* Photographic Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {communityPhotos.map((photo, pIdx) => (
                <div
                  key={pIdx}
                  className="group bg-white rounded-lg border border-charcoal-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow duration-300"
                >
                  <div className="aspect-[16/10] overflow-hidden bg-charcoal-100">
                    <img
                      src={photo.image_url}
                      alt={isMarathi ? photo.caption_mr : photo.caption_en}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-3.5">
                    <p className="text-xs sm:text-sm font-medium text-charcoal-800 leading-snug">
                      {isMarathi ? photo.caption_mr : photo.caption_en}
                    </p>
                    {(photo.location_en || photo.year) && (
                      <p className="text-[11px] text-charcoal-500 mt-1">
                        {isMarathi ? photo.location_mr || photo.location_en : photo.location_en}
                        {photo.year && ` • ${photo.year}`}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}

export default AboutIntroSection;

import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { getHomepageSections } from '@/lib/api';
import { mockHomepageSections } from '@/lib/mock-data';
import type { HomepageSection } from '@/types/database';
import ErrorBoundary from '@/components/ui/ErrorBoundary';

// Public section components
import HeroSection from '@/components/public/HeroSection';
import AnnouncementTicker from '@/components/public/AnnouncementTicker';
import AboutIntroSection from '@/components/public/AboutIntroSection';
import PublicWorkSection from '@/components/public/PublicWorkSection';
import NewsSection from '@/components/public/NewsSection';
import EventsSection from '@/components/public/EventsSection';
import GallerySection from '@/components/public/GallerySection';
import InstagramSection from '@/components/public/InstagramSection';
import ContactSection from '@/components/public/ContactSection';

interface SectionComponentProps {
  section?: HomepageSection;
  data?: HomepageSection;
}

const sectionComponentMap: Record<string, React.ComponentType<SectionComponentProps>> = {
  hero: HeroSection,
  about_intro: AboutIntroSection,
  public_work: PublicWorkSection,
  news: NewsSection,
  events: EventsSection,
  gallery: GallerySection,
  instagram: InstagramSection,
  contact: ContactSection,
};

export default function HomePage() {
  const { t, isMarathi } = useLanguage();
  const [sections, setSections] = useState<HomepageSection[]>(mockHomepageSections);

  useEffect(() => {
    getHomepageSections().then((data) => {
      if (data && data.length > 0) {
        setSections(data);
      }
    });
  }, []);

  // Filter sections by is_visible and sort by display_order
  const visibleSections = sections
    .filter((section) => section.is_visible)
    .sort((a, b) => a.display_order - b.display_order);

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-warm-50 text-charcoal-900 selection:bg-saffron-100 selection:text-saffron-900">
        <Helmet>
          <title>
            {isMarathi
              ? 'बाळा भेगडे - अधिकृत संकेतस्थळ | जनसेवेसाठी समर्पित'
              : 'Bala Bhegade | Official Website - Serving the People'}
          </title>
          <meta
            name="description"
            content={
              isMarathi
                ? 'बाळा भेगडे यांचे अधिकृत संकेतस्थळ. सार्वजनिक सेवा, समाज विकास, शेतकरी व युवा कल्याणासाठी समर्पित नेतृत्व.'
                : 'Official website of Bala Bhegade. Dedicated to public service, community development, rural empowerment, and progressive leadership.'
            }
          />
          <meta property="og:title" content="Bala Bhegade | Official Website" />
          <meta
            property="og:description"
            content="Dedicated to public service, community development, and leadership."
          />
          <meta property="og:type" content="website" />
        </Helmet>

        <main className="w-full">
          {visibleSections.map((section) => {
            const Component = sectionComponentMap[section.section_key];
            if (!Component) return null;

            return (
              <React.Fragment key={section.id}>
                <ErrorBoundary>
                  <section id={section.section_key} className="relative">
                    <Component section={section} data={section} />
                  </section>
                </ErrorBoundary>
                {section.section_key === 'hero' && <AnnouncementTicker />}
              </React.Fragment>
            );
          })}
        </main>
      </div>
    </ErrorBoundary>
  );
}

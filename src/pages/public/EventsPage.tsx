import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Sparkles,
  Star,
  ArrowRight,
  CalendarCheck,
  History,
  CheckCircle2,
} from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { getEvents } from '@/lib/api';
import { mockEvents } from '@/lib/mock-data';
import type { EventItem } from '@/types/database';
import OptimizedImage from '@/components/ui/OptimizedImage';

export default function EventsPage() {
  const { t, isMarathi } = useLanguage();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [eventsList, setEventsList] = useState<EventItem[]>(mockEvents);

  useEffect(() => {
    getEvents().then((data) => {
      if (data && data.length > 0) {
        setEventsList(data);
      }
    });
  }, []);

  const upcomingCount = useMemo(
    () => eventsList.filter((e) => e.status === 'upcoming').length,
    [eventsList]
  );
  const pastCount = useMemo(
    () => eventsList.filter((e) => e.status === 'past').length,
    [eventsList]
  );

  // Filter and sort events
  const displayedEvents = useMemo(() => {
    const list = eventsList.filter((event) => event.status === activeTab);

    return [...list].sort((a, b) => {
      if (activeTab === 'upcoming') {
        // Ascending: nearest upcoming first
        return a.event_date.localeCompare(b.event_date);
      } else {
        // Descending: most recent past first
        return b.event_date.localeCompare(a.event_date);
      }
    });
  }, [activeTab]);

  // Parse date into parts for large display
  const parseDateParts = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      const day = date.getDate();
      const month = date.toLocaleDateString(isMarathi ? 'mr-IN' : 'en-US', {
        month: 'short',
      });
      const weekday = date.toLocaleDateString(isMarathi ? 'mr-IN' : 'en-US', {
        weekday: 'short',
      });
      const year = date.getFullYear();
      return { day, month, weekday, year };
    } catch {
      return { day: '', month: dateStr, weekday: '', year: '' };
    }
  };

  const formatTime = (timeStr: string | null) => {
    if (!timeStr) return '';
    try {
      const [hourStr, minuteStr] = timeStr.split(':');
      const hour = parseInt(hourStr, 10);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const formattedHour = hour % 12 || 12;
      return `${formattedHour}:${minuteStr} ${ampm}`;
    } catch {
      return timeStr;
    }
  };

  return (
    <div className="min-h-screen bg-ivory-50 text-charcoal-900 pb-20">
      <Helmet>
        <title>
          {isMarathi
            ? 'कार्यक्रम आणि सहभाग - बाळा भेगडे'
            : 'Events & Public Engagements - Bala Bhegade'}
        </title>
        <meta
          name="description"
          content={
            isMarathi
              ? 'बाळा भेगडे यांच्या आगामी आणि नुकत्याच पार पडलेल्या सार्वजनिक सभा, मेळावे, उद्घाटन आणि कार्यक्रमांची माहिती.'
              : 'Official calendar of upcoming and past public gatherings, community forums, and civic engagements with Bala Bhegade.'
          }
        />
      </Helmet>

      {/* Header Banner */}
      <section className="bg-gradient-to-b from-warmWhite-200 via-white to-warmWhite-100 text-charcoal-900 py-16 sm:py-20 border-b border-charcoal-200/80">
        <div className="container-xl">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-saffron-50 border border-saffron-200 text-saffron-700 text-xs sm:text-sm font-semibold uppercase tracking-wider mb-4">
              <CalendarIcon className="w-3.5 h-3.5 text-saffron-500" />
              {t('Public Calendar', 'सार्वजनिक दिनदर्शिका')}
            </span>
            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-charcoal-900 mb-4">
              {t('Events & Engagements', 'कार्यक्रम आणि जनसंवाद')}
            </h1>
            <p className="text-charcoal-700 text-base sm:text-lg leading-relaxed">
              {t(
                'Connect directly at town halls, developmental inaugurations, citizen forums, and cultural celebrations across the constituency.',
                'मतदारसंघातील विविध विकासकामांचे भूमिपूजन, लोकार्पण, जनसंवाद सभा आणि मेळाव्यांचे वेळापत्रक.'
              )}
            </p>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="container-lg mt-10 sm:mt-12">
        {/* Toggle Upcoming vs Past */}
        <div className="flex items-center justify-center mb-10">
          <div className="inline-flex p-1.5 rounded-full bg-white border border-charcoal-200 shadow-xs">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer ${
                activeTab === 'upcoming'
                  ? 'bg-saffron-500 text-white shadow-md'
                  : 'text-charcoal-700 hover:text-saffron-700 hover:bg-warmWhite-100'
              }`}
            >
              <CalendarCheck className="w-4 h-4" />
              <span>{t('Upcoming Events', 'आगामी कार्यक्रम')}</span>
              <span
                className={`ml-1 px-2 py-0.5 rounded-full text-xs font-bold ${
                  activeTab === 'upcoming'
                    ? 'bg-white text-saffron-700'
                    : 'bg-charcoal-100 text-charcoal-700'
                }`}
              >
                {upcomingCount}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('past')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer ${
                activeTab === 'past'
                  ? 'bg-saffron-500 text-white shadow-md'
                  : 'text-charcoal-700 hover:text-saffron-700 hover:bg-warmWhite-100'
              }`}
            >
              <History className="w-4 h-4" />
              <span>{t('Past Events', 'मागील कार्यक्रम')}</span>
              <span
                className={`ml-1 px-2 py-0.5 rounded-full text-xs font-bold ${
                  activeTab === 'past'
                    ? 'bg-white text-saffron-700'
                    : 'bg-charcoal-100 text-charcoal-700'
                }`}
              >
                {pastCount}
              </span>
            </button>
          </div>
        </div>

        {/* Placeholder disclaimer badge */}
        <div className="mb-8 p-4 rounded-xl bg-saffron-50 border border-saffron-200 text-xs sm:text-sm text-charcoal-700 flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-saffron-500 flex-shrink-0 mt-0.5" />
          <p>
            <strong className="font-semibold text-saffron-900 mr-1.5">
              {t('[Notice]:', '[सूचना]:')}
            </strong>
            {t(
              'Event dates, venues, and timings shown below are preview placeholders. Official invitation cards and verified itineraries are published ahead of scheduled engagements.',
              'खाली दर्शवलेली तारीख, ठिकाण आणि वेळ ही पूर्वावलोकनासाठी प्रातिनिधिक आहे. अधिकृत कार्यक्रम पत्रिका आणि दौरा वेळापत्रक नियोजित वेळेनुसार जाहीर केले जाते.'
            )}
          </p>
        </div>

        {/* Events Cards Stack */}
        <motion.div layout className="space-y-6 sm:space-y-8">
          <AnimatePresence>
            {displayedEvents.map((event, idx) => {
              const dateParts = parseDateParts(event.event_date);
              const title = t(event.title_en, event.title_mr);
              const desc = t(event.description_en || '', event.description_mr || '');
              const location = t(
                event.location_en || 'Taluka Center',
                event.location_mr || 'तालुका केंद्र'
              );

              return (
                <motion.div
                  key={event.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.35, delay: idx * 0.05 }}
                  className={`bg-white rounded-2xl overflow-hidden border shadow-xs hover:shadow-md transition-all duration-300 flex flex-col md:flex-row group ${
                    event.is_featured
                      ? 'border-saffron-400 ring-1 ring-saffron-400/40'
                      : 'border-charcoal-200/90'
                  }`}
                >
                  {/* Left Column: Date Callout Box */}
                  <div
                    className={`md:w-44 flex-shrink-0 flex md:flex-col items-center justify-center p-6 text-center border-b md:border-b-0 md:border-r ${
                      event.is_featured
                        ? 'bg-gradient-to-br from-saffron-500 to-saffron-600 text-white border-saffron-400'
                        : 'bg-warmWhite-100 text-charcoal-900 border-charcoal-200/80'
                    }`}
                  >
                    <div className="flex md:flex-col items-center gap-2 md:gap-0">
                      <span
                        className={`text-xs sm:text-sm font-bold uppercase tracking-widest ${
                          event.is_featured ? 'text-white/90' : 'text-saffron-600'
                        }`}
                      >
                        {dateParts.month}
                      </span>
                      <span className="font-heading text-4xl sm:text-5xl font-extrabold my-0.5">
                        {dateParts.day}
                      </span>
                      <span
                        className={`text-xs font-medium ${
                          event.is_featured ? 'text-white/80' : 'text-charcoal-500'
                        }`}
                      >
                        {dateParts.year} • {dateParts.weekday}
                      </span>
                    </div>

                    {event.is_featured && (
                      <div className="mt-3 hidden md:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/20 border border-white/30 text-white text-[11px] font-semibold">
                        <Star className="w-3 h-3 fill-white text-white" />
                        <span>{t('Featured', 'विशेष')}</span>
                      </div>
                    )}
                  </div>

                  {/* Middle Column: Event Content */}
                  <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Featured pill on mobile */}
                      {event.is_featured && (
                        <div className="md:hidden inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-saffron-50 border border-saffron-200 text-saffron-700 text-[11px] font-semibold mb-2">
                          <Star className="w-3 h-3 fill-saffron-500 text-saffron-500" />
                          <span>{t('Featured Engagement', 'विशेष कार्यक्रम')}</span>
                        </div>
                      )}

                      <h3 className="font-heading text-xl sm:text-2xl font-bold text-charcoal-900 mb-3 group-hover:text-saffron-600 transition-colors">
                        {title}
                      </h3>

                      <p className="text-charcoal-600 text-sm sm:text-base leading-relaxed mb-5">
                        {desc}
                      </p>

                      {/* Event Details: Time & Venue */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-charcoal-700 pt-3 border-t border-charcoal-100">
                        {event.event_time && (
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-saffron-600 flex-shrink-0" />
                            <span className="font-medium">{formatTime(event.event_time)}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-green-600 flex-shrink-0" />
                          <span className="font-medium line-clamp-1">{location}</span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom CTA & Notice */}
                    <div className="mt-6 pt-4 border-t border-charcoal-100 flex items-center justify-between">
                      <span className="text-xs text-saffron-700/80 font-medium">
                        {t('Constituent Engagement', 'मतदारसंघ जनसंवाद')}
                      </span>
                      <Link
                        to="/contact"
                        className="btn-secondary text-xs sm:text-sm py-1.5 px-3.5 inline-flex items-center gap-1.5"
                      >
                        <span>{t('Inquire About Event', 'कार्यक्रमाविषयी विचारा')}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>

                  {/* Right Column: Thumbnail if available */}
                  {event.image_url && (
                    <div className="hidden lg:block w-52 flex-shrink-0 relative overflow-hidden bg-charcoal-100">
                      <OptimizedImage
                        src={event.image_url}
                        alt={title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {displayedEvents.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-charcoal-200 my-8 p-6">
            <CalendarIcon className="w-12 h-12 text-charcoal-300 mx-auto mb-3" />
            <p className="text-charcoal-700 font-heading text-xl font-bold mb-2">
              {activeTab === 'upcoming'
                ? t('No upcoming events scheduled right now', 'सध्या कोणतेही आगामी कार्यक्रम नियोजित नाहीत')
                : t('No past events in archive', 'मागील कार्यक्रमांची नोंद नाही')}
            </p>
            <p className="text-charcoal-500 text-sm max-w-md mx-auto mb-6">
              {t(
                'Please check back soon or follow our announcements on social channels for public schedules.',
                'नवीन कार्यक्रमांच्या तारखा व अधिकृत वेळापत्रकासाठी कृपया पुन्हा भेट द्या.'
              )}
            </p>
            <button
              onClick={() => setActiveTab(activeTab === 'upcoming' ? 'past' : 'upcoming')}
              className="btn-primary"
            >
              {activeTab === 'upcoming'
                ? t('View Past Events', 'मागील कार्यक्रम पहा')
                : t('View Upcoming Events', 'आगामी कार्यक्रम पहा')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

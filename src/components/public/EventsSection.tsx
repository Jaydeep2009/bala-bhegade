import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, ArrowRight, Sparkles } from 'lucide-react';
import { useLanguage, AutoTranslate } from '@/lib/i18n/LanguageContext';
import { mockEvents } from '@/lib/mock-data';
import { getEvents } from '@/lib/api';
import type { EventItem } from '@/types/database';
import SectionHeading from '@/components/ui/SectionHeading';

export function EventsSection() {
  const { isMarathi } = useLanguage();
  const [eventsList, setEventsList] = useState<EventItem[]>(mockEvents);

  useEffect(() => {
    getEvents().then((data) => {
      if (data && data.length > 0) {
        setEventsList(data);
      }
    });
  }, []);

  const displayEvents = eventsList.slice(0, 3);

  const parseEventDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      const month = d.toLocaleDateString(isMarathi ? 'mr-IN' : 'en-US', { month: 'short' });
      const day = d.getDate();
      const year = d.getFullYear();
      return { month, day, year };
    } catch {
      return { month: 'TBA', day: '00', year: '' };
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 35 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <section className="py-20 lg:py-28 bg-white border-b border-charcoal-200/60">
      <div className="container-xl">
        {/* Section Heading */}
        <SectionHeading
          badge={isMarathi ? 'सार्वजनिक कार्यक्रम' : 'Schedule & Engagements'}
          title={isMarathi ? 'आगामी आणि अलीकडील कार्यक्रम' : 'Public Events & Engagements'}
          subtitle={
            isMarathi
              ? 'नागरिकांशी थेट संवाद, जनसंपर्क दौरे आणि विविध सामाजिक उपक्रमांचे वेळापत्रक'
              : 'Join upcoming community gatherings, constituency dialogues, and public forums'
          }
          align="center"
        />

        {/* 3-Column Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-14"
        >
          {displayEvents.map((event) => {
            const { month, day, year } = parseEventDate(event.event_date);
            const isPast = event.status === 'past';
            const title = isMarathi ? event.title_mr : event.title_en;
            const desc = isMarathi ? event.description_mr : event.description_en;
            const location = isMarathi ? event.location_mr : event.location_en;

            return (
              <motion.div
                key={event.id}
                variants={cardVariants}
                className={`group relative bg-white rounded-2xl border border-charcoal-200/90 p-6 sm:p-7 shadow-xs hover:shadow-2xl hover:border-saffron-300 transition-all duration-300 ease-out flex flex-col justify-between ${
                  isPast
                    ? 'opacity-75 grayscale-[25%] bg-charcoal-50/50 hover:-translate-y-1'
                    : 'hover:-translate-y-2'
                }`}
              >
                <div>
                  {/* Top Bar with Date and Badges */}
                  <div className="flex items-start justify-between gap-4 mb-5">
                    {/* Date Block with Micro-Scale on Hover */}
                    <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-gradient-to-br from-saffron-500 to-saffron-600 text-white flex flex-col items-center justify-center shadow-xs border border-saffron-400 group-hover:scale-105 group-hover:shadow-md transition-all duration-300">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-white/90">
                        {month}
                      </span>
                      <span className="font-heading font-bold text-2xl leading-none text-white">
                        {day}
                      </span>
                    </div>

                    {/* Status & Featured Badges */}
                    <div className="flex flex-col items-end gap-1.5">
                      {event.is_featured && !isPast && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-saffron-50 text-saffron-700 border border-saffron-200">
                          <Sparkles className="w-3 h-3 text-saffron-500" />
                          <span>{isMarathi ? 'महत्त्वाचा' : 'Featured'}</span>
                        </span>
                      )}
                      {isPast ? (
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-charcoal-100 text-charcoal-700">
                          {isMarathi ? 'संपन्न' : 'Past'}
                        </span>
                      ) : (
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-green-50 text-green-700 border border-green-200">
                          {isMarathi ? 'आगामी' : 'Upcoming'}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="font-heading font-bold text-xl text-charcoal-900 group-hover:text-saffron-600 transition-colors mb-3 leading-snug">
                    <AutoTranslate en={event.title_en} mr={event.title_mr} />
                  </h3>

                  {/* Description */}
                  {(event.description_en || event.description_mr) && (
                    <p className="text-charcoal-600 text-sm leading-relaxed line-clamp-2 mb-4">
                      <AutoTranslate en={event.description_en} mr={event.description_mr} />
                    </p>
                  )}
                </div>

                {/* Event Details (Location & Time) */}
                <div className="pt-4 border-t border-charcoal-100 space-y-2 text-xs sm:text-sm text-charcoal-600">
                  {(event.location_en || event.location_mr) && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-green-600 flex-shrink-0 group-hover:scale-110 transition-transform" />
                      <span className="line-clamp-1">
                        <AutoTranslate en={event.location_en} mr={event.location_mr} />
                      </span>
                    </div>
                  )}
                  {event.event_time && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-saffron-600 flex-shrink-0 group-hover:scale-110 transition-transform" />
                      <span>{event.event_time}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Link to /events at bottom */}
        <div className="text-center">
          <Link
            to="/events"
            className="btn-primary"
          >
            <span>{isMarathi ? 'सर्व कार्यक्रम व दौरे पहा' : 'View All Public Events & Engagements'}</span>
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default EventsSection;

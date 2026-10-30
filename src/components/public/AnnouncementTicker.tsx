import React from 'react';
import { Link } from 'react-router-dom';
import { Bell, ArrowRight, Sparkles } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export interface AnnouncementItem {
  id: string;
  date_mr: string;
  date_en: string;
  text_mr: string;
  text_en: string;
  slug?: string;
}

const VERIFIED_ANNOUNCEMENTS: AnnouncementItem[] = [
  {
    id: '1',
    date_mr: '२१ मार्च २०२५',
    date_en: '21 Mar 2025',
    text_mr: 'वडगाव मावळ येथे स्वर्गीय मदन बाफना यांच्या स्मरणार्थ प्रेरणा दिन कार्यक्रमात सहभाग',
    text_en: 'Addressed the Prerana Din memorial gathering honouring late minister Madan Bafna in Wadgaon Maval',
    slug: 'prerana-din-memorial-wadgaon-maval',
  },
  {
    id: '2',
    date_mr: '१० नोव्हेंबर २०२५',
    date_en: '10 Nov 2025',
    text_mr: 'तळेगाव दाभाडे नगरपरिषद व स्थानिक नागरी विकासाबाबत महत्त्वपूर्ण जनसंवाद',
    text_en: 'Key public address and civic dialogue on Talegaon Dabhade municipal development',
    slug: 'talegaon-dabhade-municipal-developments',
  },
  {
    id: '3',
    date_mr: '०१ डिसेंबर २०२५',
    date_en: '01 Dec 2025',
    text_mr: 'वडगाव मावळ नगरपंचायत निवडणूक प्रचार मोहिमेत प्रमुख मार्गदर्शन',
    text_en: 'Keynote address during Wadgaon Maval Nagar Panchayat election campaign',
    slug: 'wadgaon-maval-civic-campaign-address',
  },
];

export function AnnouncementTicker() {
  const { t, isMarathi } = useLanguage();

  return (
    <div
      role="region"
      aria-label={isMarathi ? 'ताज्या घडामोडी' : 'Latest Announcements'}
      className="relative bg-warmWhite-100 border-b border-charcoal-200/90 overflow-hidden text-xs sm:text-sm select-none z-20"
    >
      <div className="container-xl py-2 flex items-center justify-between gap-3">
        {/* Fixed Badge on Left */}
        <div className="flex-shrink-0 flex items-center gap-2 bg-saffron-500 text-white font-semibold px-3 py-1 rounded-full shadow-xs text-xs">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
          </span>
          <span className="tracking-wide uppercase font-heading text-[11px] sm:text-xs">
            {isMarathi ? 'ताज्या घडामोडी' : 'Updates'}
          </span>
        </div>

        {/* Marquee Ticker Track */}
        <div className="flex-1 overflow-hidden relative group">
          <div className="inline-flex gap-8 whitespace-nowrap animate-ticker group-hover:[animation-play-state:paused] focus-within:[animation-play-state:paused]">
            {/* Repeated twice for seamless marquee loop */}
            {[...VERIFIED_ANNOUNCEMENTS, ...VERIFIED_ANNOUNCEMENTS].map((item, idx) => (
              <Link
                key={`${item.id}-${idx}`}
                to="/news"
                className="inline-flex items-center gap-2 text-charcoal-800 hover:text-saffron-600 transition-colors cursor-pointer group/item py-0.5"
              >
                <span className="px-2 py-0.5 rounded bg-saffron-50 text-saffron-800 font-medium text-[11px] border border-saffron-200/60">
                  {isMarathi ? item.date_mr : item.date_en}
                </span>
                <span className="text-charcoal-700 font-medium group-hover/item:text-saffron-700">
                  {isMarathi ? item.text_mr : item.text_en}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-saffron-500 opacity-0 group-hover/item:opacity-100 group-hover/item:translate-x-0.5 transition-all" />
                <span className="text-charcoal-300 ml-4">•</span>
              </Link>
            ))}
          </div>
        </div>

        {/* View All News Link on Right */}
        <div className="hidden md:flex flex-shrink-0 items-center">
          <Link
            to="/news"
            className="text-xs font-semibold text-saffron-700 hover:text-saffron-800 flex items-center gap-1 hover:underline underline-offset-4"
          >
            <span>{isMarathi ? 'सर्व बातम्या' : 'View All'}</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Subtle Tri-Color Underline Accent */}
      <div className="h-[2px] w-full flex">
        <div className="w-1/3 bg-saffron-500/80" />
        <div className="w-1/3 bg-white" />
        <div className="w-1/3 bg-green-600/80" />
      </div>
    </div>
  );
}

export default AnnouncementTicker;

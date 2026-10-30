import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
  type ElementType,
} from 'react';
import { translateText, getCachedTranslation } from '@/lib/translation';

export type Language = 'en' | 'mr';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (en: string, mr?: string | null) => string;
  isMarathi: boolean;
  translate: (text?: string | null, targetLang?: string) => Promise<string>;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

const translations = {
  en: {
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.publicWork': 'Public Work',
    'nav.news': 'News',
    'nav.gallery': 'Gallery',
    'nav.events': 'Events',
    'nav.contact': 'Contact',
    'nav.privacy': 'Privacy Policy',
    'footer.quickLinks': 'Quick Links',
    'footer.connect': 'Connect',
    'footer.office': 'Office',
    'footer.rights': 'All rights reserved.',
    'footer.privacy': 'Privacy Policy',
    'common.readMore': 'Read More',
    'common.viewAll': 'View All',
    'common.loading': 'Loading...',
    'common.error': 'Something went wrong',
    'common.retry': 'Try Again',
    'common.upcoming': 'Upcoming',
    'common.past': 'Past',
    'common.featured': 'Featured',
    'common.published': 'Published',
    'common.draft': 'Draft',
    'common.share': 'Share',
    'common.back': 'Back',
    'common.search': 'Search',
    'common.noResults': 'No results found',
    'home.heroTitle': 'Serving the People',
    'home.heroSubtitle': 'Dedicated to public service and community development',
    'home.aboutTitle': 'About Bala Bhegade',
    'home.publicWorkTitle': 'Public Work & Initiatives',
    'home.newsTitle': 'Latest News',
    'home.eventsTitle': 'Upcoming Events',
    'home.galleryTitle': 'Photo Gallery',
    'home.instagramTitle': 'On Instagram',
    'home.contactTitle': 'Get in Touch',
    'about.title': 'About',
    'about.biography': 'Biography',
    'news.title': 'News & Updates',
    'news.categories': 'Categories',
    'news.all': 'All',
    'gallery.title': 'Photo Gallery',
    'gallery.categories': 'Categories',
    'events.title': 'Events & Engagements',
    'contact.title': 'Contact',
    'contact.officeAddress': 'Office Address',
    'contact.phone': 'Phone',
    'contact.email': 'Email',
    'contact.followUs': 'Follow Us',
    'privacy.title': 'Privacy Policy',
  },
  mr: {
    'nav.home': 'मुख्यपृष्ठ',
    'nav.about': 'परिचय',
    'nav.publicWork': 'सार्वजनिक कार्य',
    'nav.news': 'बातम्या',
    'nav.gallery': 'फोटो गॅलरी',
    'nav.events': 'कार्यक्रम',
    'nav.contact': 'संपर्क',
    'nav.privacy': 'गोपनीयता धोरण',
    'footer.quickLinks': 'जलद दुवे',
    'footer.connect': 'संपर्क साधा',
    'footer.office': 'कार्यालय',
    'footer.rights': 'सर्व हक्क राखीव.',
    'footer.privacy': 'गोपनीयता धोरण',
    'common.readMore': 'अधिक वाचा',
    'common.viewAll': 'सर्व पहा',
    'common.loading': 'लोड होत आहे...',
    'common.error': 'काहीतरी चूक झाली',
    'common.retry': 'पुन्हा प्रयत्न करा',
    'common.upcoming': 'आगामी',
    'common.past': 'मागील',
    'common.featured': 'वैशिष्ट्यीकृत',
    'common.published': 'प्रकाशित',
    'common.draft': 'मसुदा',
    'common.share': 'शेअर करा',
    'common.back': 'मागे',
    'common.search': 'शोधा',
    'common.noResults': 'कोणतेही परिणाम आढळले नाहीत',
    'home.heroTitle': 'जनसेवेसाठी समर्पित',
    'home.heroSubtitle': 'सार्वजनिक सेवा आणि समाज विकासासाठी कटिबद्ध',
    'home.aboutTitle': 'बाळा भेगडे यांच्याबद्दल',
    'home.publicWorkTitle': 'सार्वजनिक कार्य आणि उपक्रम',
    'home.newsTitle': 'ताज्या बातम्या',
    'home.eventsTitle': 'आगामी कार्यक्रम',
    'home.galleryTitle': 'फोटो गॅलरी',
    'home.instagramTitle': 'इन्स्टाग्रामवर',
    'home.contactTitle': 'संपर्क साधा',
    'about.title': 'परिचय',
    'about.biography': 'चरित्र',
    'news.title': 'बातम्या आणि अद्यतने',
    'news.categories': 'वर्ग',
    'news.all': 'सर्व',
    'gallery.title': 'फोटो गॅलरी',
    'gallery.categories': 'वर्ग',
    'events.title': 'कार्यक्रम आणि सहभाग',
    'contact.title': 'संपर्क',
    'contact.officeAddress': 'कार्यालय पत्ता',
    'contact.phone': 'दूरध्वनी',
    'contact.email': 'ईमेल',
    'contact.followUs': 'आम्हाला फॉलो करा',
    'privacy.title': 'गोपनीयता धोरण',
  },
} as const;

type TranslationKey = keyof typeof translations.en;

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('bb-language');
      if (saved === 'en' || saved === 'mr') return saved;
    }
    return 'en';
  });

  const [cacheVersion, setCacheVersion] = useState(0);

  const handleSetLanguage = useCallback((lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('bb-language', lang);
    document.documentElement.lang = lang;
  }, []);

  const translate = useCallback(async (text?: string | null, targetLang: string = 'mr'): Promise<string> => {
    if (!text) return '';
    const res = await translateText(text, targetLang);
    setCacheVersion((v) => v + 1);
    return res;
  }, []);

  const t = useCallback(
    (en: string, mr?: string | null): string => {
      if (language !== 'mr') return en;
      if (mr && mr.trim().length > 0) return mr;
      if (!en) return '';

      // Check synchronous cache
      const cached = getCachedTranslation(en, 'mr');
      if (cached) return cached;

      // Asynchronously trigger translation so subsequent renders have it
      translateText(en, 'mr').then(() => {
        setCacheVersion((v) => v + 1);
      });

      return en;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [language, cacheVersion]
  );

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage: handleSetLanguage,
        t,
        isMarathi: language === 'mr',
        translate,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

export function useTranslation() {
  const { language } = useLanguage();
  return useCallback(
    (key: TranslationKey): string => {
      return translations[language][key] || key;
    },
    [language]
  );
}

/**
 * Hook to automatically display Marathi translation for any content
 * where only English was set by the admin.
 */
export function useAutoTranslate(
  textEn?: string | null,
  textMr?: string | null
): string {
  const { isMarathi } = useLanguage();

  const [displayValue, setDisplayValue] = useState<string>(() => {
    if (!isMarathi) return textEn || '';
    if (textMr && textMr.trim()) return textMr;
    if (textEn) {
      const cached = getCachedTranslation(textEn, 'mr');
      if (cached) return cached;
    }
    return textMr || textEn || '';
  });

  useEffect(() => {
    if (!isMarathi) {
      setDisplayValue(textEn || '');
      return;
    }

    if (textMr && textMr.trim()) {
      setDisplayValue(textMr);
      return;
    }

    if (!textEn || !textEn.trim()) {
      setDisplayValue('');
      return;
    }

    const cached = getCachedTranslation(textEn, 'mr');
    if (cached) {
      setDisplayValue(cached);
      return;
    }

    let isSubscribed = true;
    translateText(textEn, 'mr')
      .then((translated) => {
        if (isSubscribed && translated) {
          setDisplayValue(translated);
        }
      })
      .catch(() => {
        if (isSubscribed) {
          setDisplayValue(textEn);
        }
      });

    return () => {
      isSubscribed = false;
    };
  }, [isMarathi, textEn, textMr]);

  return displayValue;
}

/**
 * Drop-in component that automatically translates English text into Marathi
 * when the user toggles Marathi, while honoring any manual Marathi text.
 */
export function AutoTranslate({
  en,
  mr,
  as: Component = 'span',
  className = '',
}: {
  en?: string | null;
  mr?: string | null;
  as?: ElementType;
  className?: string;
}) {
  const text = useAutoTranslate(en, mr);
  return <Component className={className}>{text}</Component>;
}

export { translations };

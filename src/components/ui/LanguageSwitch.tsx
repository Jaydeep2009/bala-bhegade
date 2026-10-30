import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage, type Language } from '@/lib/i18n/LanguageContext';

export interface LanguageSwitchProps {
  className?: string;
  theme?: 'light' | 'dark' | 'glass';
  variant?: 'pill' | 'compact' | 'select' | 'minimal' | string;
}

export const LanguageSwitch: React.FC<LanguageSwitchProps> = ({
  className = '',
  theme = 'light',
}) => {
  const { language, setLanguage } = useLanguage();

  const handleToggle = (lang: Language) => {
    if (language !== lang) {
      setLanguage(lang);
    }
  };

  const getContainerBg = () => {
    switch (theme) {
      case 'dark':
        return 'bg-charcoal-900/80 backdrop-blur-md border-charcoal-700 text-white';
      case 'glass':
        return 'bg-black/30 backdrop-blur-md border-white/25 text-white shadow-sm';
      case 'light':
      default:
        return 'bg-warm-100 border-charcoal-200 text-charcoal-800 shadow-inner';
    }
  };

  const isLight = theme === 'light';

  return (
    <div
      role="radiogroup"
      aria-label="Language selection"
      className={`relative inline-flex items-center rounded-full p-1 border text-xs font-medium select-none ${getContainerBg()} ${className}`}
    >
      {/* English Option */}
      <button
        type="button"
        role="radio"
        aria-checked={language === 'en'}
        onClick={() => handleToggle('en')}
        className={`relative z-10 px-2.5 py-1 rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-saffron-500 ${
          language === 'en'
            ? 'text-white font-semibold'
            : isLight
              ? 'text-charcoal-600 hover:text-charcoal-900'
              : 'text-white/80 hover:text-white'
        }`}
      >
        {language === 'en' && (
          <motion.div
            layoutId="langPillHighlight"
            className="absolute inset-0 rounded-full bg-saffron-500 shadow-sm"
            transition={{ type: 'spring', stiffness: 500, damping: 35 }}
          />
        )}
        <span className="relative z-10">EN</span>
      </button>

      {/* Marathi Option */}
      <button
        type="button"
        role="radio"
        aria-checked={language === 'mr'}
        onClick={() => handleToggle('mr')}
        className={`relative z-10 px-2.5 py-1 rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-saffron-500 ${
          language === 'mr'
            ? 'text-white font-semibold'
            : isLight
              ? 'text-charcoal-600 hover:text-charcoal-900'
              : 'text-white/80 hover:text-white'
        }`}
      >
        {language === 'mr' && (
          <motion.div
            layoutId="langPillHighlight"
            className="absolute inset-0 rounded-full bg-saffron-500 shadow-sm"
            transition={{ type: 'spring', stiffness: 500, damping: 35 }}
          />
        )}
        <span className="relative z-10 font-marathi">मराठी</span>
      </button>
    </div>
  );
};

export default LanguageSwitch;

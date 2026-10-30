import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useLanguage, useTranslation } from '@/lib/i18n/LanguageContext';
import LanguageSwitch from '@/components/ui/LanguageSwitch';

interface NavItem {
  key: 'nav.home' | 'nav.about' | 'nav.publicWork' | 'nav.news' | 'nav.gallery' | 'nav.events' | 'nav.contact';
  to: string;
}

const NAV_ITEMS: NavItem[] = [
  { key: 'nav.home', to: '/' },
  { key: 'nav.about', to: '/about' },
  { key: 'nav.publicWork', to: '/public-work' },
  { key: 'nav.news', to: '/news' },
  { key: 'nav.gallery', to: '/gallery' },
  { key: 'nav.events', to: '/events' },
  { key: 'nav.contact', to: '/contact' },
];

export function Header() {
  const { isMarathi } = useLanguage();
  const tr = useTranslation();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      // 50px threshold as specified in requirement 4
      const scrolled = window.scrollY > 50;
      setIsScrolled((prev) => (prev !== scrolled ? scrolled : prev));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Is transparent only if on the homepage AND not scrolled past 50px
  const isTransparent = isHome && !isScrolled;

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileOpen]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${
        isTransparent
          ? 'bg-transparent border-b border-transparent shadow-none'
          : 'bg-white/95 backdrop-blur-md border-b border-charcoal-200/90 shadow-sm'
      }`}
    >
      <div className="container-xl">
        <div
          className={`flex items-center justify-between transition-all duration-300 ${
            isTransparent ? 'h-20 md:h-[84px]' : 'h-16 md:h-[68px]'
          }`}
        >
          {/* Left: Brand / Name */}
          <Link
            to="/"
            className="group flex flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-500 rounded"
            aria-label="Bala Bhegade Home"
          >
            <span
              className={`font-heading font-bold text-xl md:text-2xl tracking-tight transition-colors ${
                isTransparent
                  ? 'text-white drop-shadow-sm group-hover:text-saffron-300'
                  : 'text-charcoal-900 group-hover:text-[#F15A24]'
              }`}
            >
              Bala Bhegade
            </span>
            {isMarathi && (
              <span
                className={`text-xs font-marathi font-semibold tracking-wide -mt-0.5 transition-colors ${
                  isTransparent
                    ? 'text-saffron-300 drop-shadow-sm'
                    : 'text-[#F15A24]'
                }`}
              >
                बाळा भेगडे
              </span>
            )}
          </Link>

          {/* Center: Desktop Nav */}
          <nav
            className="hidden lg:flex items-center space-x-1 xl:space-x-2"
            aria-label="Main Navigation"
          >
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.key}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `relative px-3.5 py-2 text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? isTransparent
                        ? 'text-saffron-300 font-semibold drop-shadow-sm'
                        : 'text-[#F15A24] font-semibold'
                      : isTransparent
                        ? 'text-white/90 hover:text-saffron-300 drop-shadow-xs'
                        : 'text-charcoal-700 hover:text-[#F15A24]'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span>{tr(item.key)}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeNavIndicator"
                        className="absolute bottom-0 left-2 right-2 h-[2.5px] bg-saffron-500 rounded-full"
                        transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Right: Language Switch & Mobile Toggle */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:block">
              <LanguageSwitch theme={isTransparent ? 'glass' : 'light'} />
            </div>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setIsMobileOpen(true)}
              className={`lg:hidden p-2 rounded-md transition-colors ${
                isTransparent
                  ? 'text-white hover:text-saffron-300 hover:bg-white/15'
                  : 'text-charcoal-800 hover:text-[#F15A24] hover:bg-saffron-50'
              }`}
              aria-label="Open mobile menu"
              aria-expanded={isMobileOpen}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Full-Screen Overlay Menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.28, ease: 'easeInOut' }}
            className="fixed inset-0 z-50 bg-white flex flex-col lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation"
          >
            {/* Mobile Top Bar */}
            <div className="container-xl h-16 flex items-center justify-between border-b border-charcoal-200">
              <Link
                to="/"
                onClick={() => setIsMobileOpen(false)}
                className="flex flex-col"
              >
                <span className="font-heading font-bold text-xl text-charcoal-900">
                  Bala Bhegade
                </span>
                {isMarathi && (
                  <span className="text-xs font-marathi font-semibold text-saffron-600">
                    बाळा भेगडे
                  </span>
                )}
              </Link>
              <div className="flex items-center gap-3">
                <LanguageSwitch variant="compact" />
                <button
                  type="button"
                  onClick={() => setIsMobileOpen(false)}
                  className="p-2 rounded-md text-charcoal-700 hover:text-saffron-600 hover:bg-saffron-50"
                  aria-label="Close mobile menu"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Mobile Nav Links */}
            <nav className="flex-1 overflow-y-auto px-6 py-8 space-y-4">
              {NAV_ITEMS.map((item, index) => (
                <motion.div
                  key={item.key}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04 }}
                >
                  <NavLink
                    to={item.to}
                    end={item.to === '/'}
                    onClick={() => setIsMobileOpen(false)}
                    className={({ isActive }) =>
                      `block text-xl font-heading py-2.5 transition-colors border-b border-charcoal-100 ${
                        isActive
                          ? 'text-saffron-600 font-bold underline underline-offset-8 decoration-2 decoration-saffron-500'
                          : 'text-charcoal-800 hover:text-saffron-600'
                      }`
                    }
                  >
                    {tr(item.key)}
                  </NavLink>
                </motion.div>
              ))}

              <div className="pt-6">
                <p className="text-xs uppercase tracking-wider text-charcoal-400 font-semibold mb-3">
                  {isMarathi ? 'भाषा बदला' : 'Change Language'}
                </p>
                <LanguageSwitch />
              </div>
            </nav>

            {/* Mobile Menu Footer */}
            <div className="p-6 border-t border-charcoal-200 bg-ivory-50 text-center">
              <p className="text-xs text-charcoal-500 font-medium">
                © {new Date().getFullYear()} Bala Bhegade. All rights reserved.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Header;

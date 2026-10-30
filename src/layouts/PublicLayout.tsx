import React, { useLayoutEffect, Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import DevModeBanner from '@/components/ui/DevModeBanner';
import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';

export const PublicLayout: React.FC = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';

  // Synchronously reset scroll to top before browser paint on route change
  useLayoutEffect(() => {
    if (location.hash) {
      const el = document.querySelector(location.hash);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [location.pathname, location.hash]);

  return (
    <div className="min-h-screen flex flex-col bg-warm-50 text-charcoal-900 selection:bg-saffron-100 selection:text-saffron-900">
      {/* Dev Mode Banner (only shown on non-homepage routes so full-viewport hero has zero top margin) */}
      {!isHome && <DevModeBanner />}

      {/* Main Public Header */}
      <Header />

      {/* Main Public Content */}
      <main className={`flex-1 w-full ${isHome ? 'pt-0' : 'pt-16 md:pt-[72px]'}`}>
        <Suspense
          fallback={
            <div className="min-h-[50vh] flex items-center justify-center p-8">
              <div className="w-9 h-9 border-3 border-saffron-500 border-t-transparent rounded-full animate-spin" />
            </div>
          }
        >
          <Outlet />
        </Suspense>
      </main>

      {/* Main Public Footer */}
      <Footer />
    </div>
  );
};

export default PublicLayout;

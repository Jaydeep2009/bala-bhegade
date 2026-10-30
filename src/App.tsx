import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { LanguageProvider } from '@/lib/i18n/LanguageContext';
import { AuthProvider } from '@/lib/auth/AuthContext';
import PublicLayout from '@/layouts/PublicLayout';
import AdminLayout from '@/layouts/AdminLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import LoadingScreen from '@/components/ui/LoadingScreen';
import NotFound from '@/pages/NotFound';

// Public pages - lazy loaded
const HomePage = lazy(() => import('@/pages/public/HomePage'));
const AboutPage = lazy(() => import('@/pages/public/AboutPage'));
const PublicWorkPage = lazy(() => import('@/pages/public/PublicWorkPage'));
const NewsPage = lazy(() => import('@/pages/public/NewsPage'));
const NewsArticlePage = lazy(() => import('@/pages/public/NewsArticlePage'));
const GalleryPage = lazy(() => import('@/pages/public/GalleryPage'));
const EventsPage = lazy(() => import('@/pages/public/EventsPage'));
const ContactPage = lazy(() => import('@/pages/public/ContactPage'));
const PrivacyPage = lazy(() => import('@/pages/public/PrivacyPage'));

// Admin pages - lazy loaded
const AdminLogin = lazy(() => import('@/pages/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard'));
const AdminHomepage = lazy(() => import('@/pages/admin/AdminHomepage'));
const AdminAbout = lazy(() => import('@/pages/admin/AdminAbout'));
const AdminPublicWork = lazy(() => import('@/pages/admin/AdminPublicWork'));
const AdminContact = lazy(() => import('@/pages/admin/AdminContact'));
const AdminNews = lazy(() => import('@/pages/admin/AdminNews'));
const AdminNewsEditor = lazy(() => import('@/pages/admin/AdminNewsEditor'));
const AdminGallery = lazy(() => import('@/pages/admin/AdminGallery'));
const AdminEvents = lazy(() => import('@/pages/admin/AdminEvents'));
const AdminSettings = lazy(() => import('@/pages/admin/AdminSettings'));
const AdminInstagram = lazy(() => import('@/pages/admin/AdminInstagram'));

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Suspense fallback={<LoadingScreen />}>
          <Routes>
            {/* Public routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/public-work" element={<PublicWorkPage />} />
              <Route path="/news" element={<NewsPage />} />
              <Route path="/news/:slug" element={<NewsArticlePage />} />
              <Route path="/gallery" element={<GalleryPage />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
            </Route>

            {/* Admin login */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Protected admin routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<AdminLayout />}>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/homepage" element={<AdminHomepage />} />
                <Route path="/admin/about" element={<AdminAbout />} />
                <Route path="/admin/public-work" element={<AdminPublicWork />} />
                <Route path="/admin/contact" element={<AdminContact />} />
                <Route path="/admin/news" element={<AdminNews />} />
                <Route path="/admin/news/new" element={<AdminNewsEditor />} />
                <Route path="/admin/news/:id/edit" element={<AdminNewsEditor />} />
                <Route path="/admin/gallery" element={<AdminGallery />} />
                <Route path="/admin/events" element={<AdminEvents />} />
                <Route path="/admin/settings" element={<AdminSettings />} />
                <Route path="/admin/instagram" element={<AdminInstagram />} />
              </Route>
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </LanguageProvider>
  );
}

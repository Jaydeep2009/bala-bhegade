import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Home,
  UserCheck,
  Briefcase,
  MapPin,
  Newspaper,
  Image as ImageIcon,
  Calendar,
  Instagram,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';

interface SidebarNavItem {
  name: string;
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  exact?: boolean;
}

const SIDEBAR_NAV: SidebarNavItem[] = [
  { name: 'Dashboard', to: '/admin', icon: LayoutDashboard, exact: true },
  { name: 'Homepage', to: '/admin/homepage', icon: Home },
  { name: 'About Page', to: '/admin/about', icon: UserCheck },
  { name: 'Public Work', to: '/admin/public-work', icon: Briefcase },
  { name: 'Contact Info', to: '/admin/contact', icon: MapPin },
  { name: 'News', to: '/admin/news', icon: Newspaper },
  { name: 'Gallery', to: '/admin/gallery', icon: ImageIcon },
  { name: 'Events', to: '/admin/events', icon: Calendar },
  { name: 'Instagram', to: '/admin/instagram', icon: Instagram },
  { name: 'Settings', to: '/admin/settings', icon: Settings },
];

export const AdminLayout: React.FC = () => {
  const { user, adminProfile, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Close mobile drawer on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/admin/login', { replace: true });
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  // Determine current page title
  const currentNav = SIDEBAR_NAV.find((item) =>
    item.exact ? location.pathname === item.to : location.pathname.startsWith(item.to)
  );
  const pageTitle = currentNav?.name || 'Admin Portal';

  const adminDisplayName = adminProfile?.display_name || user?.email?.split('@')[0] || 'Administrator';
  const adminRole = adminProfile?.role ? adminProfile.role.replace('_', ' ') : 'Admin';

  return (
    <div className="min-h-screen bg-charcoal-50 flex">
      {/* 1. Mobile Drawer Backdrop */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsMobileOpen(false)}
            className="fixed inset-0 z-40 bg-charcoal-950/60 backdrop-blur-xs lg:hidden"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* 2. Mobile Drawer Sidebar */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed inset-y-0 left-0 z-50 w-[280px] bg-white text-charcoal-800 flex flex-col shadow-2xl lg:hidden border-r border-charcoal-200"
            aria-label="Mobile Admin Navigation"
          >
            {/* Drawer Header */}
            <div className="h-16 flex items-center justify-between px-5 border-b border-charcoal-200 bg-white">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-saffron-500 to-saffron-600 shadow-sm flex items-center justify-center font-heading font-bold text-white text-sm">
                  BB
                </div>
                <div>
                  <h2 className="font-heading font-bold text-sm tracking-wide text-charcoal-900 leading-tight">
                    Bala Bhegade
                  </h2>
                  <p className="text-[10px] text-saffron-600 font-semibold uppercase tracking-wider">Administration</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsMobileOpen(false)}
                className="p-1.5 rounded-md text-charcoal-500 hover:text-charcoal-900 hover:bg-charcoal-100 transition-colors"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
              {SIDEBAR_NAV.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.exact}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                        isActive
                          ? 'bg-saffron-50 text-saffron-700 font-semibold border-l-4 border-saffron-500 shadow-xs'
                          : 'text-charcoal-600 hover:bg-warm-50 hover:text-saffron-700'
                      }`
                    }
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{item.name}</span>
                  </NavLink>
                );
              })}
            </nav>

            {/* Drawer Footer User Info & Logout */}
            <div className="p-4 border-t border-charcoal-200 bg-warm-50/60">
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-charcoal-900 truncate">{adminDisplayName}</p>
                  <p className="text-[11px] text-charcoal-500 capitalize truncate">{adminRole}</p>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="p-2 rounded-md text-charcoal-500 hover:text-red-600 hover:bg-charcoal-100 transition-colors"
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* 3. Desktop Collapsible Sidebar (280px wide default) */}
      <aside
        className={`hidden lg:flex flex-col bg-white text-charcoal-800 border-r border-charcoal-200 transition-all duration-300 shrink-0 sticky top-0 h-screen z-30 ${
          isCollapsed ? 'w-20' : 'w-[280px]'
        }`}
        aria-label="Admin Navigation"
      >
        {/* Brand Bar */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-charcoal-200 bg-white">
          <div className={`flex items-center gap-3 overflow-hidden ${isCollapsed ? 'justify-center w-full' : ''}`}>
            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-saffron-500 to-saffron-600 shadow-sm flex items-center justify-center font-heading font-bold text-white shrink-0">
              BB
            </div>
            {!isCollapsed && (
              <div className="min-w-0">
                <h1 className="font-heading font-bold text-sm tracking-wide text-charcoal-900 truncate">
                  Bala Bhegade
                </h1>
                <p className="text-[11px] text-saffron-600 font-semibold uppercase tracking-wider truncate">Admin Panel</p>
              </div>
            )}
          </div>

          {!isCollapsed && (
            <button
              type="button"
              onClick={() => setIsCollapsed(true)}
              className="p-1.5 rounded-md text-charcoal-400 hover:text-charcoal-700 hover:bg-charcoal-100 transition-colors"
              title="Collapse sidebar"
              aria-label="Collapse sidebar"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Collapsed Expand Button */}
        {isCollapsed && (
          <div className="pt-2 flex justify-center">
            <button
              type="button"
              onClick={() => setIsCollapsed(false)}
              className="p-2 rounded-md text-charcoal-400 hover:text-charcoal-700 hover:bg-charcoal-100 transition-colors"
              title="Expand sidebar"
              aria-label="Expand sidebar"
            >
              <ChevronLeft className="h-4 w-4 rotate-180" />
            </button>
          </div>
        )}

        {/* Sidebar Nav Links */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5">
          {SIDEBAR_NAV.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.exact}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg text-sm font-medium transition-colors ${
                    isCollapsed ? 'justify-center p-2.5' : 'px-3.5 py-2.5'
                  } ${
                    isActive
                      ? 'bg-saffron-50 text-saffron-700 font-semibold border-l-4 border-saffron-500 shadow-xs'
                      : 'text-charcoal-600 hover:bg-warm-50 hover:text-saffron-700'
                  }`
                }
                title={isCollapsed ? item.name : undefined}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {!isCollapsed && <span className="truncate">{item.name}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* Desktop Sidebar Bottom: View Website link & Admin Info */}
        <div className="p-3 border-t border-charcoal-200 space-y-2 bg-warm-50/40">
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-2.5 rounded-md text-xs text-charcoal-600 hover:text-saffron-600 hover:bg-saffron-50 transition-colors ${
              isCollapsed ? 'justify-center p-2' : 'px-3 py-2'
            }`}
            title="View public website"
          >
            <ExternalLink className="h-3.5 w-3.5 shrink-0" />
            {!isCollapsed && <span>View Website</span>}
          </Link>

          {!isCollapsed && (
            <div className="pt-2 border-t border-charcoal-200 flex items-center justify-between px-2">
              <div className="min-w-0 pr-2">
                <p className="text-xs font-semibold text-charcoal-900 truncate">{adminDisplayName}</p>
                <p className="text-[10px] text-charcoal-500 capitalize truncate">{adminRole}</p>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="p-1.5 rounded-md text-charcoal-400 hover:text-red-600 hover:bg-charcoal-100 transition-colors"
                title="Logout"
                aria-label="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          )}

          {isCollapsed && (
            <div className="flex justify-center pt-1 border-t border-charcoal-200">
              <button
                type="button"
                onClick={handleLogout}
                className="p-2 rounded-md text-charcoal-400 hover:text-red-600 hover:bg-charcoal-100 transition-colors"
                title={`Logout (${adminDisplayName})`}
                aria-label="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* 4. Main Body Wrapper (Top Header + Outlet) */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {/* Top Header Bar */}
        <header className="h-16 bg-white border-b border-charcoal-200 px-4 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-20 shadow-xs">
          <div className="flex items-center gap-3">
            {/* Mobile menu toggle */}
            <button
              type="button"
              onClick={() => setIsMobileOpen(true)}
              className="lg:hidden p-2 rounded-md text-charcoal-700 hover:bg-saffron-50 hover:text-saffron-600 transition-colors"
              aria-label="Open sidebar menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Current Page Title */}
            <div>
              <h1 className="font-heading text-lg sm:text-xl font-bold text-charcoal-900">
                {pageTitle}
              </h1>
            </div>
          </div>

          {/* Right Header: User info & Logout */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-sm font-semibold text-charcoal-800">
                {adminDisplayName}
              </span>
              <span className="text-xs text-charcoal-500 capitalize">
                {adminRole}
              </span>
            </div>

            <div className="h-8 w-8 rounded-full bg-saffron-100 text-saffron-800 border border-saffron-300 flex items-center justify-center font-bold text-xs uppercase">
              {adminDisplayName.slice(0, 2)}
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-charcoal-600 hover:text-red-600 px-2.5 py-1.5 rounded-md hover:bg-charcoal-100 transition-colors"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

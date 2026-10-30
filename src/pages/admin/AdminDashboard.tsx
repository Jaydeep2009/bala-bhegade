import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  Newspaper,
  Image as GalleryIcon,
  Calendar,
  Instagram,
  Plus,
  TrendingUp,
  Activity,
  ArrowRight,
  Clock,
  ExternalLink,
  Sliders,
  CheckCircle,
  FileText,
  AlertCircle,
  UserCheck,
  Briefcase,
} from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import {
  mockNewsArticles,
  mockGalleryItems,
  mockEvents,
  mockSocialPosts,
} from '@/lib/mock-data';

export const AdminDashboard: React.FC = () => {
  const { user, adminProfile } = useAuth();

  const adminName =
    adminProfile?.display_name || user?.email?.split('@')[0] || 'Administrator';

  const [publishedNewsCount, setPublishedNewsCount] = useState(
    mockNewsArticles.filter((a) => a.status === 'published').length
  );
  const [draftNewsCount, setDraftNewsCount] = useState(
    mockNewsArticles.filter((a) => a.status === 'draft').length
  );
  const [totalNews, setTotalNews] = useState(mockNewsArticles.length);
  const [totalGallery, setTotalGallery] = useState(mockGalleryItems.length);
  const [featuredGallery, setFeaturedGallery] = useState(
    mockGalleryItems.filter((g) => g.is_featured).length
  );
  const [upcomingEvents, setUpcomingEvents] = useState(
    mockEvents.filter((e) => e.status === 'upcoming').length
  );
  const [totalEvents, setTotalEvents] = useState(mockEvents.length);
  const [totalSocial, setTotalSocial] = useState(mockSocialPosts.length);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;

    Promise.all([
      supabase.from('news_articles').select('status'),
      supabase.from('gallery_items').select('is_featured'),
      supabase.from('events').select('status'),
      supabase.from('social_posts').select('id'),
    ]).then(([newsRes, galRes, evRes, socRes]) => {
      if (newsRes.data && newsRes.data.length > 0) {
        setTotalNews(newsRes.data.length);
        setPublishedNewsCount(newsRes.data.filter((n: any) => n.status === 'published').length);
        setDraftNewsCount(newsRes.data.filter((n: any) => n.status === 'draft').length);
      }
      if (galRes.data && galRes.data.length > 0) {
        setTotalGallery(galRes.data.length);
        setFeaturedGallery(galRes.data.filter((g: any) => g.is_featured).length);
      }
      if (evRes.data && evRes.data.length > 0) {
        setTotalEvents(evRes.data.length);
        setUpcomingEvents(evRes.data.filter((e: any) => e.status === 'upcoming').length);
      }
      if (socRes.data && socRes.data.length > 0) {
        setTotalSocial(socRes.data.length);
      }
    });
  }, []);

  // Stat cards configuration
  const stats = [
    {
      title: 'News Articles',
      count: totalNews,
      subtext: `${publishedNewsCount} published • ${draftNewsCount} drafts`,
      icon: Newspaper,
      link: '/admin/news',
      accentColor: 'border-l-saffron-500 text-saffron-700 bg-saffron-50',
      badge: `${publishedNewsCount} Live`,
    },
    {
      title: 'Gallery Items',
      count: totalGallery,
      subtext: `${featuredGallery} featured on homepage`,
      icon: GalleryIcon,
      link: '/admin/gallery',
      accentColor: 'border-l-saffron-600 text-saffron-800 bg-warm-100',
      badge: 'Photos & Media',
    },
    {
      title: 'Upcoming Events',
      count: upcomingEvents,
      subtext: `${totalEvents} total scheduled/past`,
      icon: Calendar,
      link: '/admin/events',
      accentColor: 'border-l-emerald-600 text-emerald-700 bg-emerald-50',
      badge: 'Public Gatherings',
    },
    {
      title: 'Instagram Posts',
      count: totalSocial,
      subtext: 'Curated social media showcase',
      icon: Instagram,
      link: '/admin/instagram',
      accentColor: 'border-l-rose-500 text-rose-600 bg-rose-50',
      badge: 'Social Feed',
    },
  ];

  // Quick action buttons
  const quickActions = [
    {
      label: 'Edit About Page',
      description: 'Update biography, milestones & quote',
      to: '/admin/about',
      icon: UserCheck,
      color: 'btn-primary',
    },
    {
      label: 'Manage Public Work',
      description: 'Development initiatives & projects',
      to: '/admin/public-work',
      icon: Briefcase,
      color: 'btn-secondary',
    },
    {
      label: 'New Article',
      description: 'Draft or publish a news story',
      to: '/admin/news/new',
      icon: Plus,
      color: 'btn-secondary',
    },
    {
      label: 'Upload Photos',
      description: 'Add photos to the public gallery',
      to: '/admin/gallery',
      icon: GalleryIcon,
      color: 'btn-secondary',
    },
    {
      label: 'Add Event',
      description: 'Schedule a public engagement',
      to: '/admin/events',
      icon: Calendar,
      color: 'btn-secondary',
    },
    {
      label: 'Edit Homepage',
      description: 'Reorder sections and banner hero',
      to: '/admin/homepage',
      icon: Sliders,
      color: 'btn-secondary',
    },
  ];

  // Mock recent activity list
  const recentActivity = [
    {
      id: 'act-1',
      title: 'Community Development Initiative Launched',
      type: 'News Article',
      action: 'Published',
      time: '2 hours ago',
      user: adminName,
      status: 'success',
    },
    {
      id: 'act-2',
      title: 'Rural Youth Engagement Workshop',
      type: 'Event',
      action: 'Added event schedule',
      time: 'Yesterday',
      user: adminName,
      status: 'info',
    },
    {
      id: 'act-3',
      title: 'Photo Gallery Update',
      type: 'Gallery',
      action: 'Featured 3 new high-res photographs',
      time: '3 days ago',
      user: adminName,
      status: 'info',
    },
    {
      id: 'act-4',
      title: 'Health Camp Organized in Rural Area',
      type: 'News Article',
      action: 'Saved draft article',
      time: '5 days ago',
      user: adminName,
      status: 'pending',
    },
    {
      id: 'act-5',
      title: 'Homepage Hero Banner',
      type: 'Homepage',
      action: 'Updated subtitle and banner CTA',
      time: '1 week ago',
      user: adminName,
      status: 'success',
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      <Helmet>
        <title>Dashboard Overview | Admin Bala Bhegade</title>
      </Helmet>

      {/* Dev Mode Notice */}
      {!isSupabaseConfigured && (
        <div className="rounded-xl bg-saffron-50 border border-saffron-200 p-4 flex items-center justify-between text-saffron-900">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-saffron-600 flex-shrink-0" />
            <div className="text-sm">
              <span className="font-semibold">Development Preview Mode:</span> Changes made in
              the dashboard are stored in local state and will not be permanently saved until
              Supabase database credentials are configured in your environment.
            </div>
          </div>
          <span className="hidden sm:inline-flex text-xs px-2.5 py-1 rounded bg-saffron-200/80 font-semibold text-saffron-900 uppercase tracking-wide">
            Preview Active
          </span>
        </div>
      )}

      {/* Welcome Banner */}
      <div className="admin-card p-6 sm:p-8 bg-white border border-charcoal-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-saffron-500 via-white to-green-600" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-saffron-50 border border-saffron-200 text-saffron-800 text-xs font-semibold uppercase tracking-wider mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Admin Portal Active
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-charcoal-950 tracking-tight">
            Welcome back, {adminName}
          </h1>
          <p className="mt-2 text-charcoal-600 text-sm sm:text-base leading-relaxed">
            Manage public updates, press releases, media galleries, public meetings, and official portal settings for Hon. Bala Bhegade.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/admin/news/new"
              className="btn-primary inline-flex items-center gap-2 text-xs sm:text-sm py-2 px-4 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Write New Story
            </Link>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary inline-flex items-center gap-2 text-xs sm:text-sm py-2 px-4"
            >
              <ExternalLink className="w-4 h-4 text-charcoal-500" />
              View Public Website
            </a>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-charcoal-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-saffron-600" />
            Content Overview
          </h2>
          <span className="text-xs text-charcoal-500">Live data summary</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Link
                key={stat.title}
                to={stat.link}
                className="admin-card p-5 border-l-4 hover:shadow-md transition-shadow group flex flex-col justify-between"
                style={{ borderLeftColor: 'currentColor' }}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-charcoal-500 uppercase tracking-wider">
                      {stat.title}
                    </span>
                    <div className={`p-2 rounded-lg ${stat.accentColor}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-charcoal-900">{stat.count}</span>
                    <span className="text-xs text-charcoal-400 font-medium">items</span>
                  </div>
                  <p className="mt-1 text-xs text-charcoal-600">{stat.subtext}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-charcoal-100 flex items-center justify-between text-xs font-medium text-saffron-600 group-hover:text-saffron-700">
                  <span>Manage section</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div>
        <h2 className="text-lg font-semibold text-charcoal-900 mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-saffron-600" />
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.label}
                to={action.to}
                className="admin-card p-4 hover:border-saffron-500 hover:shadow-sm transition-all flex items-start gap-3.5 group"
              >
                <div className="p-2.5 rounded-lg bg-saffron-50 text-saffron-600 group-hover:bg-saffron-500 group-hover:text-white transition-colors flex-shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-charcoal-900 group-hover:text-saffron-600 transition-colors">
                    {action.label}
                  </h3>
                  <p className="text-xs text-charcoal-500 mt-0.5">{action.description}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* 2-Column: Recent Activity & Quick Navigation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity (2 Cols) */}
        <div className="lg:col-span-2 admin-card p-6">
          <div className="flex items-center justify-between border-b border-charcoal-100 pb-4 mb-4">
            <div>
              <h3 className="text-base font-semibold text-charcoal-900">Recent Content Updates</h3>
              <p className="text-xs text-charcoal-500">History of site changes and editorial logs</p>
            </div>
            <Link
              to="/admin/news"
              className="text-xs font-semibold text-saffron-600 hover:text-saffron-700 flex items-center gap-1"
            >
              View all
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="divide-y divide-charcoal-100">
            {recentActivity.map((item) => (
              <div key={item.id} className="py-3.5 flex items-start justify-between gap-4 first:pt-0 last:pb-0">
                <div className="flex items-start gap-3">
                  <div className="mt-1 p-1.5 rounded-full bg-saffron-50 text-saffron-600">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-charcoal-900">{item.title}</h4>
                    <p className="text-xs text-charcoal-500 mt-0.5">
                      <span className="font-medium text-charcoal-700">{item.action}</span> in{' '}
                      <span className="text-saffron-700 font-medium">{item.type}</span>
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end flex-shrink-0 text-right">
                  <span className="inline-flex items-center gap-1 text-xs text-charcoal-400">
                    <Clock className="w-3 h-3" />
                    {item.time}
                  </span>
                  <span className="text-[11px] text-charcoal-400 mt-0.5 font-mono">
                    by {item.user}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Admin Sections Guide (1 Col) */}
        <div className="admin-card p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-semibold text-charcoal-900 border-b border-charcoal-100 pb-4 mb-4">
              Management Portals
            </h3>
            <ul className="space-y-3">
              {[
                { name: 'Homepage Sections', desc: 'Hero banner, order, visibility', to: '/admin/homepage' },
                { name: 'About Bala Bhegade', desc: 'Biographical chapters, values, milestones', to: '/admin/about' },
                { name: 'Public Work & Initiatives', desc: 'Infrastructure, healthcare, water projects', to: '/admin/public-work' },
                { name: 'Contact & Grievances', desc: 'Offices, visiting hours, helplines', to: '/admin/contact' },
                { name: 'News & Press Releases', desc: 'Manage official statements', to: '/admin/news' },
                { name: 'Photo Gallery', desc: 'Upload community photos', to: '/admin/gallery' },
                { name: 'Events & Engagements', desc: 'Schedule public rallies & meetings', to: '/admin/events' },
                { name: 'Instagram Feed', desc: 'Curate social highlights', to: '/admin/instagram' },
                { name: 'System Settings', desc: 'Contact info, bio, footer, privacy', to: '/admin/settings' },
              ].map((section) => (
                <li key={section.to}>
                  <Link
                    to={section.to}
                    className="group block p-2.5 rounded-lg hover:bg-saffron-50/60 transition-colors border border-transparent hover:border-saffron-200"
                  >
                    <div className="flex items-center justify-between text-sm font-medium text-charcoal-800 group-hover:text-saffron-700">
                      <span>{section.name}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-charcoal-400 group-hover:text-saffron-600 group-hover:translate-x-0.5 transition-all" />
                    </div>
                    <p className="text-xs text-charcoal-500 mt-0.5">{section.desc}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 pt-4 border-t border-charcoal-100 text-xs text-charcoal-500 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              All systems online
            </span>
            <span className="font-mono text-[11px]">v1.0.0</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

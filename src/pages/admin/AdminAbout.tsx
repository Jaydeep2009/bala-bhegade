import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import {
  UserCheck,
  Save,
  Check,
  AlertCircle,
  ExternalLink,
  Sparkles,
  Quote,
  BookOpen,
  ShieldCheck,
  Calendar,
  Layers,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Sprout,
  GraduationCap,
  Users,
  Award,
  HeartHandshake,
  Heart,
  Building2,
  ChevronRight,
} from 'lucide-react';
import ImageUpload from '@/components/ui/ImageUpload';
import { translateText } from '@/lib/translation';
import {
  getAboutPageData,
  updateAboutPageData,
  type AboutPageData,
  type AboutChapterItem,
  type AboutValueItem,
  type AboutMilestoneItem,
} from '@/lib/api';
import { DEFAULT_ABOUT_PAGE_DATA } from '@/lib/pageDataDefaults';

const AVAILABLE_ICONS = [
  { name: 'ShieldCheck', icon: ShieldCheck, label: 'Integrity / Shield' },
  { name: 'Sprout', icon: Sprout, label: 'Agriculture / Sprout' },
  { name: 'GraduationCap', icon: GraduationCap, label: 'Education' },
  { name: 'Users', icon: Users, label: 'Community / Welfare' },
  { name: 'Award', icon: Award, label: 'Excellence / Trophy' },
  { name: 'HeartHandshake', icon: HeartHandshake, label: 'Public Service / Trust' },
  { name: 'Building2', icon: Building2, label: 'Infrastructure / City' },
];

export const AdminAbout: React.FC = () => {
  const [data, setData] = useState<AboutPageData>(DEFAULT_ABOUT_PAGE_DATA);
  const [activeTab, setActiveTab] = useState<'hero' | 'quote' | 'chapters' | 'values' | 'milestones' | 'cta'>('hero');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    getAboutPageData().then((res) => {
      setData(res);
      setIsLoading(false);
    });
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      // Auto-translate any missing Marathi fields before saving
      const updated = { ...data };

      if (updated.hero.title_en && !updated.hero.title_mr) {
        updated.hero.title_mr = await translateText(updated.hero.title_en, 'mr');
      }
      if (updated.hero.bio_summary_en && !updated.hero.bio_summary_mr) {
        updated.hero.bio_summary_mr = await translateText(updated.hero.bio_summary_en, 'mr');
      }
      if (updated.quote.text_en && !updated.quote.text_mr) {
        updated.quote.text_mr = await translateText(updated.quote.text_en, 'mr');
      }

      await updateAboutPageData(updated);
      setData(updated);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3500);
    } catch (err) {
      console.error('Failed to save about page:', err);
    } finally {
      setIsSaving(false);
    }
  };

  // Chapter management
  const handleAddChapter = () => {
    const newChapter: AboutChapterItem = {
      id: `ch-${Date.now()}`,
      title_en: 'New Leadership Chapter',
      title_mr: 'नवीन कार्यप्रवास टप्पा',
      content_en: 'Enter descriptive public service narrative here.',
      content_mr: 'येथे या टप्प्याविषयी सविस्तर माहिती लिहा.',
    };
    setData((prev) => ({
      ...prev,
      chapters: [...prev.chapters, newChapter],
    }));
  };

  const handleRemoveChapter = (id: string) => {
    setData((prev) => ({
      ...prev,
      chapters: prev.chapters.filter((c) => c.id !== id),
    }));
  };

  const handleMoveChapter = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= data.chapters.length) return;
    const chapters = [...data.chapters];
    const [moved] = chapters.splice(index, 1);
    chapters.splice(targetIdx, 0, moved);
    setData((prev) => ({ ...prev, chapters }));
  };

  // Values management
  const handleAddValue = () => {
    const newValue: AboutValueItem = {
      id: `val-${Date.now()}`,
      icon_name: 'ShieldCheck',
      title_en: 'New Core Principle',
      title_mr: 'नवीन तत्त्व व मूल्य',
      description_en: 'Detailed explanation of this guiding principle.',
      description_mr: 'या तत्त्वाचे सविस्तर वर्णन येथे लिहा.',
    };
    setData((prev) => ({
      ...prev,
      values: [...prev.values, newValue],
    }));
  };

  const handleRemoveValue = (id: string) => {
    setData((prev) => ({
      ...prev,
      values: prev.values.filter((v) => v.id !== id),
    }));
  };

  // Milestones management
  const handleAddMilestone = () => {
    const newM: AboutMilestoneItem = {
      id: `m-${Date.now()}`,
      year: new Date().getFullYear().toString(),
      title_en: 'Key Legislative Milestone',
      title_mr: 'प्रमुख राजकीय टप्पा',
      description_en: 'Summary of the accomplishment or electoral victory.',
      description_mr: 'या राजकीय टप्प्याचे सविस्तर वर्णन.',
      tag_en: 'Public Service',
      tag_mr: 'जनसेवा',
    };
    setData((prev) => ({
      ...prev,
      milestones: [...prev.milestones, newM],
    }));
  };

  const handleRemoveMilestone = (id: string) => {
    setData((prev) => ({
      ...prev,
      milestones: prev.milestones.filter((m) => m.id !== id),
    }));
  };

  const handleMoveMilestone = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= data.milestones.length) return;
    const milestones = [...data.milestones];
    const [moved] = milestones.splice(index, 1);
    milestones.splice(targetIdx, 0, moved);
    setData((prev) => ({ ...prev, milestones }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-3 border-saffron-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-20">
      <Helmet>
        <title>About Page Editor | Admin Bala Bhegade</title>
      </Helmet>

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-charcoal-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-saffron-50 text-saffron-600">
              <UserCheck className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-heading font-semibold text-charcoal-900">
              About Page Content Editor
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-charcoal-500 mt-1">
            Edit full biographical narratives, political milestones timeline, core values, quote, and hero statistics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/about"
            target="_blank"
            className="btn-secondary text-xs py-2 px-3 flex items-center gap-1.5"
          >
            <span>View Live Page</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="btn-primary text-xs py-2 px-4 flex items-center gap-2"
          >
            {isSaving ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : saveSuccess ? (
              <Check className="w-4 h-4 text-emerald-300" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{saveSuccess ? 'Changes Saved!' : 'Save All Changes'}</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-charcoal-200 scrollbar-none">
        {[
          { key: 'hero', label: '1. Profile & Hero', icon: UserCheck },
          { key: 'quote', label: '2. Leader Quote', icon: Quote },
          { key: 'chapters', label: '3. Bio Chapters', icon: BookOpen, count: data.chapters.length },
          { key: 'values', label: '4. Core Values', icon: ShieldCheck, count: data.values.length },
          { key: 'milestones', label: '5. Milestones Timeline', icon: Calendar, count: data.milestones.length },
          { key: 'cta', label: '6. Bottom Banner CTA', icon: Layers },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-saffron-600 text-white shadow-xs'
                  : 'text-charcoal-600 hover:text-charcoal-900 hover:bg-charcoal-100'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {typeof tab.count === 'number' && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-white/20 text-white' : 'bg-charcoal-200 text-charcoal-700'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab 1: Hero & Profile */}
      {activeTab === 'hero' && (
        <div className="space-y-6">
          <div className="admin-card p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-charcoal-100">
              <div>
                <h3 className="text-base font-semibold text-charcoal-900">Hero Section Details</h3>
                <p className="text-xs text-charcoal-500">Banner title, designation, badges and portrait image</p>
              </div>
              <button
                type="button"
                disabled={isTranslating}
                onClick={async () => {
                  setIsTranslating(true);
                  try {
                    const [bMr, nMr, tMr, sMr] = await Promise.all([
                      data.hero.badge_en ? translateText(data.hero.badge_en, 'mr') : Promise.resolve(''),
                      data.hero.name_en ? translateText(data.hero.name_en, 'mr') : Promise.resolve(''),
                      data.hero.title_en ? translateText(data.hero.title_en, 'mr') : Promise.resolve(''),
                      data.hero.bio_summary_en ? translateText(data.hero.bio_summary_en, 'mr') : Promise.resolve(''),
                    ]);
                    setData((prev) => ({
                      ...prev,
                      hero: {
                        ...prev.hero,
                        badge_mr: bMr || prev.hero.badge_mr,
                        name_mr: nMr || prev.hero.name_mr,
                        title_mr: tMr || prev.hero.title_mr,
                        bio_summary_mr: sMr || prev.hero.bio_summary_mr,
                      },
                    }));
                  } finally {
                    setIsTranslating(false);
                  }
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-saffron-50 hover:bg-saffron-100 text-saffron-700 border border-saffron-200 rounded-lg text-xs font-medium transition-colors cursor-pointer self-start sm:self-auto"
              >
                {isTranslating ? (
                  <span className="w-3.5 h-3.5 border-2 border-saffron-600/30 border-t-saffron-600 rounded-full animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5 text-saffron-500" />
                )}
                <span>⚡ Auto-Translate to Marathi</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="admin-label">Top Badge (English)</label>
                <input
                  type="text"
                  value={data.hero.badge_en}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      hero: { ...prev.hero, badge_en: e.target.value },
                    }))
                  }
                  className="admin-input"
                />
              </div>
              <div>
                <label className="admin-label">Top Badge (Marathi)</label>
                <input
                  type="text"
                  value={data.hero.badge_mr}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      hero: { ...prev.hero, badge_mr: e.target.value },
                    }))
                  }
                  className="admin-input font-marathi"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="admin-label">Leader Name (English)</label>
                <input
                  type="text"
                  value={data.hero.name_en}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      hero: { ...prev.hero, name_en: e.target.value },
                    }))
                  }
                  className="admin-input font-medium"
                />
              </div>
              <div>
                <label className="admin-label">Leader Name (Marathi)</label>
                <input
                  type="text"
                  value={data.hero.name_mr}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      hero: { ...prev.hero, name_mr: e.target.value },
                    }))
                  }
                  className="admin-input font-marathi font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="admin-label">Official Title / Designation (English)</label>
                <input
                  type="text"
                  value={data.hero.title_en}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      hero: { ...prev.hero, title_en: e.target.value },
                    }))
                  }
                  className="admin-input"
                />
              </div>
              <div>
                <label className="admin-label">Official Title / Designation (Marathi)</label>
                <input
                  type="text"
                  value={data.hero.title_mr}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      hero: { ...prev.hero, title_mr: e.target.value },
                    }))
                  }
                  className="admin-input font-marathi"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="admin-label">Short Bio Summary (English)</label>
                <textarea
                  rows={4}
                  value={data.hero.bio_summary_en}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      hero: { ...prev.hero, bio_summary_en: e.target.value },
                    }))
                  }
                  className="admin-input"
                />
              </div>
              <div>
                <label className="admin-label">Short Bio Summary (Marathi)</label>
                <textarea
                  rows={4}
                  value={data.hero.bio_summary_mr}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      hero: { ...prev.hero, bio_summary_mr: e.target.value },
                    }))
                  }
                  className="admin-input font-marathi"
                />
              </div>
            </div>

            <div>
              <ImageUpload
                label="Official Portrait Photograph"
                description="High resolution portrait used on the About Page hero with breathing saffron glow"
                value={data.hero.profile_image}
                onChange={(url) =>
                  setData((prev) => ({
                    ...prev,
                    hero: { ...prev.hero, profile_image: url },
                  }))
                }
              />
            </div>
          </div>

          {/* 3 Stat Cards on Hero */}
          <div className="admin-card p-6 space-y-4">
            <h3 className="text-base font-semibold text-charcoal-900 border-b border-charcoal-100 pb-3">
              Hero Stat Highlights (3 Metric Cards)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Stat 1 */}
              <div className="p-4 rounded-xl bg-warmWhite-100 border border-charcoal-200 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-saffron-600">Stat Card 1 (Assembly Terms)</span>
                <div>
                  <label className="admin-label text-xs">Number of Terms</label>
                  <input
                    type="number"
                    value={data.hero.stat_terms}
                    onChange={(e) =>
                      setData((prev) => ({
                        ...prev,
                        hero: { ...prev.hero, stat_terms: parseInt(e.target.value, 10) || 0 },
                      }))
                    }
                    className="admin-input text-sm"
                  />
                </div>
                <div>
                  <label className="admin-label text-xs">Label (English)</label>
                  <input
                    type="text"
                    value={data.hero.stat_terms_label_en}
                    onChange={(e) =>
                      setData((prev) => ({
                        ...prev,
                        hero: { ...prev.hero, stat_terms_label_en: e.target.value },
                      }))
                    }
                    className="admin-input text-xs"
                  />
                </div>
                <div>
                  <label className="admin-label text-xs">Label (Marathi)</label>
                  <input
                    type="text"
                    value={data.hero.stat_terms_label_mr}
                    onChange={(e) =>
                      setData((prev) => ({
                        ...prev,
                        hero: { ...prev.hero, stat_terms_label_mr: e.target.value },
                      }))
                    }
                    className="admin-input text-xs font-marathi"
                  />
                </div>
              </div>

              {/* Stat 2 */}
              <div className="p-4 rounded-xl bg-warmWhite-100 border border-charcoal-200 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-saffron-600">Stat Card 2 (Ministerial Role)</span>
                <div>
                  <label className="admin-label text-xs">Badge/Header</label>
                  <input
                    type="text"
                    value={data.hero.stat_role_en}
                    onChange={(e) =>
                      setData((prev) => ({
                        ...prev,
                        hero: { ...prev.hero, stat_role_en: e.target.value },
                      }))
                    }
                    className="admin-input text-sm"
                  />
                </div>
                <div>
                  <label className="admin-label text-xs">Description (English)</label>
                  <input
                    type="text"
                    value={data.hero.stat_role_desc_en}
                    onChange={(e) =>
                      setData((prev) => ({
                        ...prev,
                        hero: { ...prev.hero, stat_role_desc_en: e.target.value },
                      }))
                    }
                    className="admin-input text-xs"
                  />
                </div>
                <div>
                  <label className="admin-label text-xs">Description (Marathi)</label>
                  <input
                    type="text"
                    value={data.hero.stat_role_desc_mr}
                    onChange={(e) =>
                      setData((prev) => ({
                        ...prev,
                        hero: { ...prev.hero, stat_role_desc_mr: e.target.value },
                      }))
                    }
                    className="admin-input text-xs font-marathi"
                  />
                </div>
              </div>

              {/* Stat 3 */}
              <div className="p-4 rounded-xl bg-warmWhite-100 border border-charcoal-200 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-saffron-600">Stat Card 3 (Constituency)</span>
                <div>
                  <label className="admin-label text-xs">Constituency Name</label>
                  <input
                    type="text"
                    value={data.hero.stat_region_en}
                    onChange={(e) =>
                      setData((prev) => ({
                        ...prev,
                        hero: { ...prev.hero, stat_region_en: e.target.value },
                      }))
                    }
                    className="admin-input text-sm"
                  />
                </div>
                <div>
                  <label className="admin-label text-xs">Region Details (English)</label>
                  <input
                    type="text"
                    value={data.hero.stat_region_desc_en}
                    onChange={(e) =>
                      setData((prev) => ({
                        ...prev,
                        hero: { ...prev.hero, stat_region_desc_en: e.target.value },
                      }))
                    }
                    className="admin-input text-xs"
                  />
                </div>
                <div>
                  <label className="admin-label text-xs">Region Details (Marathi)</label>
                  <input
                    type="text"
                    value={data.hero.stat_region_desc_mr}
                    onChange={(e) =>
                      setData((prev) => ({
                        ...prev,
                        hero: { ...prev.hero, stat_region_desc_mr: e.target.value },
                      }))
                    }
                    className="admin-input text-xs font-marathi"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Leader Quote */}
      {activeTab === 'quote' && (
        <div className="admin-card p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-charcoal-100">
            <div>
              <h3 className="text-base font-semibold text-charcoal-900">Official Leader Statement / Pull Quote</h3>
              <p className="text-xs text-charcoal-500">Highlighted quote block shown prominently on the About Page</p>
            </div>
            <button
              type="button"
              disabled={isTranslating}
              onClick={async () => {
                setIsTranslating(true);
                try {
                  const [tMr, aMr] = await Promise.all([
                    data.quote.text_en ? translateText(data.quote.text_en, 'mr') : Promise.resolve(''),
                    data.quote.author_en ? translateText(data.quote.author_en, 'mr') : Promise.resolve(''),
                  ]);
                  setData((prev) => ({
                    ...prev,
                    quote: {
                      ...prev.quote,
                      text_mr: tMr || prev.quote.text_mr,
                      author_mr: aMr || prev.quote.author_mr,
                    },
                  }));
                } finally {
                  setIsTranslating(false);
                }
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-saffron-50 hover:bg-saffron-100 text-saffron-700 border border-saffron-200 rounded-lg text-xs font-medium transition-colors cursor-pointer self-start sm:self-auto"
            >
              <Sparkles className="w-3.5 h-3.5 text-saffron-500" />
              <span>⚡ Auto-Translate Quote</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="admin-label">Quote Statement (English)</label>
              <textarea
                rows={4}
                value={data.quote.text_en}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    quote: { ...prev.quote, text_en: e.target.value },
                  }))
                }
                className="admin-input"
              />
            </div>
            <div>
              <label className="admin-label">Quote Statement (Marathi)</label>
              <textarea
                rows={4}
                value={data.quote.text_mr}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    quote: { ...prev.quote, text_mr: e.target.value },
                  }))
                }
                className="admin-input font-marathi"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="admin-label">Quote Sign-off Author (English)</label>
              <input
                type="text"
                value={data.quote.author_en}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    quote: { ...prev.quote, author_en: e.target.value },
                  }))
                }
                className="admin-input"
              />
            </div>
            <div>
              <label className="admin-label">Quote Sign-off Author (Marathi)</label>
              <input
                type="text"
                value={data.quote.author_mr}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    quote: { ...prev.quote, author_mr: e.target.value },
                  }))
                }
                className="admin-input font-marathi"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Bio Chapters */}
      {activeTab === 'chapters' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 bg-saffron-50 border border-saffron-200 rounded-xl text-xs text-saffron-950">
            <div>
              <span className="font-semibold text-sm text-saffron-900 block">Editorial Biography Chapters</span>
              <p className="text-xs text-saffron-800 mt-0.5">
                Add, reorder, or edit in-depth biographical narratives covering political career, cabinet ministerial work, and constituency dialogue.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddChapter}
              className="btn-primary text-xs py-2 px-3 flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Add Chapter</span>
            </button>
          </div>

          <div className="space-y-4">
            {data.chapters.map((chapter, idx) => (
              <div key={chapter.id} className="admin-card p-5 space-y-4 border border-charcoal-200">
                <div className="flex items-center justify-between gap-2 border-b border-charcoal-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-saffron-100 text-saffron-700 font-bold text-xs flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="font-heading font-semibold text-sm text-charcoal-900">
                      Chapter {idx + 1}: {chapter.title_en || 'Untitled'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMoveChapter(idx, 'up')}
                      className="p-1.5 text-charcoal-400 hover:text-charcoal-700 disabled:opacity-30 cursor-pointer"
                      title="Move Up"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === data.chapters.length - 1}
                      onClick={() => handleMoveChapter(idx, 'down')}
                      className="p-1.5 text-charcoal-400 hover:text-charcoal-700 disabled:opacity-30 cursor-pointer"
                      title="Move Down"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={async () => {
                        const [tMr, cMr] = await Promise.all([
                          chapter.title_en ? translateText(chapter.title_en, 'mr') : Promise.resolve(''),
                          chapter.content_en ? translateText(chapter.content_en, 'mr') : Promise.resolve(''),
                        ]);
                        setData((prev) => ({
                          ...prev,
                          chapters: prev.chapters.map((c) =>
                            c.id === chapter.id
                              ? { ...c, title_mr: tMr || c.title_mr, content_mr: cMr || c.content_mr }
                              : c
                          ),
                        }));
                      }}
                      className="p-1.5 text-saffron-600 hover:text-saffron-800 cursor-pointer"
                      title="⚡ Auto-Translate Chapter"
                    >
                      <Sparkles className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleRemoveChapter(chapter.id)}
                      className="p-1.5 text-red-500 hover:text-red-700 cursor-pointer"
                      title="Delete Chapter"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="admin-label text-xs">Chapter Title (English)</label>
                    <input
                      type="text"
                      value={chapter.title_en}
                      onChange={(e) =>
                        setData((prev) => ({
                          ...prev,
                          chapters: prev.chapters.map((c) =>
                            c.id === chapter.id ? { ...c, title_en: e.target.value } : c
                          ),
                        }))
                      }
                      className="admin-input text-sm"
                    />
                  </div>
                  <div>
                    <label className="admin-label text-xs">Chapter Title (Marathi)</label>
                    <input
                      type="text"
                      value={chapter.title_mr}
                      onChange={(e) =>
                        setData((prev) => ({
                          ...prev,
                          chapters: prev.chapters.map((c) =>
                            c.id === chapter.id ? { ...c, title_mr: e.target.value } : c
                          ),
                        }))
                      }
                      className="admin-input text-sm font-marathi"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="admin-label text-xs">Narrative Content (English)</label>
                    <textarea
                      rows={5}
                      value={chapter.content_en}
                      onChange={(e) =>
                        setData((prev) => ({
                          ...prev,
                          chapters: prev.chapters.map((c) =>
                            c.id === chapter.id ? { ...c, content_en: e.target.value } : c
                          ),
                        }))
                      }
                      className="admin-input text-xs"
                    />
                  </div>
                  <div>
                    <label className="admin-label text-xs">Narrative Content (Marathi)</label>
                    <textarea
                      rows={5}
                      value={chapter.content_mr}
                      onChange={(e) =>
                        setData((prev) => ({
                          ...prev,
                          chapters: prev.chapters.map((c) =>
                            c.id === chapter.id ? { ...c, content_mr: e.target.value } : c
                          ),
                        }))
                      }
                      className="admin-input text-xs font-marathi"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Core Values */}
      {activeTab === 'values' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 bg-saffron-50 border border-saffron-200 rounded-xl text-xs text-saffron-950">
            <div>
              <span className="font-semibold text-sm text-saffron-900 block">Core Values & Guiding Principles</span>
              <p className="text-xs text-saffron-800 mt-0.5">
                Manage the ethical foundations displayed in the 3-column cards grid on the About Page.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddValue}
              className="btn-primary text-xs py-2 px-3 flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Add Principle</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.values.map((val, idx) => (
              <div key={val.id} className="admin-card p-5 space-y-4 border border-charcoal-200">
                <div className="flex items-center justify-between gap-2 border-b border-charcoal-100 pb-3">
                  <span className="font-heading font-semibold text-sm text-charcoal-900">
                    Value #{idx + 1}: {val.title_en || 'Untitled'}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={async () => {
                        const [tMr, dMr] = await Promise.all([
                          val.title_en ? translateText(val.title_en, 'mr') : Promise.resolve(''),
                          val.description_en ? translateText(val.description_en, 'mr') : Promise.resolve(''),
                        ]);
                        setData((prev) => ({
                          ...prev,
                          values: prev.values.map((v) =>
                            v.id === val.id ? { ...v, title_mr: tMr || v.title_mr, description_mr: dMr || v.description_mr } : v
                          ),
                        }));
                      }}
                      className="p-1.5 text-saffron-600 hover:text-saffron-800 cursor-pointer"
                      title="⚡ Auto-Translate"
                    >
                      <Sparkles className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveValue(val.id)}
                      className="p-1.5 text-red-500 hover:text-red-700 cursor-pointer"
                      title="Delete Principle"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="admin-label text-xs">Card Icon</label>
                  <select
                    value={val.icon_name}
                    onChange={(e) =>
                      setData((prev) => ({
                        ...prev,
                        values: prev.values.map((v) =>
                          v.id === val.id ? { ...v, icon_name: e.target.value } : v
                        ),
                      }))
                    }
                    className="admin-input text-xs"
                  >
                    {AVAILABLE_ICONS.map((ic) => (
                      <option key={ic.name} value={ic.name}>
                        {ic.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="admin-label text-xs">Title (English)</label>
                    <input
                      type="text"
                      value={val.title_en}
                      onChange={(e) =>
                        setData((prev) => ({
                          ...prev,
                          values: prev.values.map((v) =>
                            v.id === val.id ? { ...v, title_en: e.target.value } : v
                          ),
                        }))
                      }
                      className="admin-input text-xs"
                    />
                  </div>
                  <div>
                    <label className="admin-label text-xs">Title (Marathi)</label>
                    <input
                      type="text"
                      value={val.title_mr}
                      onChange={(e) =>
                        setData((prev) => ({
                          ...prev,
                          values: prev.values.map((v) =>
                            v.id === val.id ? { ...v, title_mr: e.target.value } : v
                          ),
                        }))
                      }
                      className="admin-input text-xs font-marathi"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="admin-label text-xs">Description (English)</label>
                    <textarea
                      rows={3}
                      value={val.description_en}
                      onChange={(e) =>
                        setData((prev) => ({
                          ...prev,
                          values: prev.values.map((v) =>
                            v.id === val.id ? { ...v, description_en: e.target.value } : v
                          ),
                        }))
                      }
                      className="admin-input text-xs"
                    />
                  </div>
                  <div>
                    <label className="admin-label text-xs">Description (Marathi)</label>
                    <textarea
                      rows={3}
                      value={val.description_mr}
                      onChange={(e) =>
                        setData((prev) => ({
                          ...prev,
                          values: prev.values.map((v) =>
                            v.id === val.id ? { ...v, description_mr: e.target.value } : v
                          ),
                        }))
                      }
                      className="admin-input text-xs font-marathi"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Milestones Timeline */}
      {activeTab === 'milestones' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 bg-saffron-50 border border-saffron-200 rounded-xl text-xs text-saffron-950">
            <div>
              <span className="font-semibold text-sm text-saffron-900 block">Political Journey & Timeline Milestones</span>
              <p className="text-xs text-saffron-800 mt-0.5">
                Chronological historical landmarks (MLA elections, Ministerial appointments, party roles) displayed with the alternating vertical spine.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddMilestone}
              className="btn-primary text-xs py-2 px-3 flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Add Milestone</span>
            </button>
          </div>

          <div className="space-y-4">
            {data.milestones.map((m, idx) => (
              <div key={m.id} className="admin-card p-5 space-y-4 border border-charcoal-200">
                <div className="flex items-center justify-between gap-2 border-b border-charcoal-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="font-heading font-bold text-lg text-saffron-600">
                      {m.year || 'Year'}
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-saffron-50 text-saffron-700 border border-saffron-200">
                      {m.tag_en || 'Tag'}
                    </span>
                    <span className="text-sm font-semibold text-charcoal-800">
                      {m.title_en}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMoveMilestone(idx, 'up')}
                      className="p-1.5 text-charcoal-400 hover:text-charcoal-700 disabled:opacity-30 cursor-pointer"
                      title="Move Up"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === data.milestones.length - 1}
                      onClick={() => handleMoveMilestone(idx, 'down')}
                      className="p-1.5 text-charcoal-400 hover:text-charcoal-700 disabled:opacity-30 cursor-pointer"
                      title="Move Down"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={async () => {
                        const [tMr, dMr, tgMr] = await Promise.all([
                          m.title_en ? translateText(m.title_en, 'mr') : Promise.resolve(''),
                          m.description_en ? translateText(m.description_en, 'mr') : Promise.resolve(''),
                          m.tag_en ? translateText(m.tag_en, 'mr') : Promise.resolve(''),
                        ]);
                        setData((prev) => ({
                          ...prev,
                          milestones: prev.milestones.map((item) =>
                            item.id === m.id
                              ? { ...item, title_mr: tMr || item.title_mr, description_mr: dMr || item.description_mr, tag_mr: tgMr || item.tag_mr }
                              : item
                          ),
                        }));
                      }}
                      className="p-1.5 text-saffron-600 hover:text-saffron-800 cursor-pointer"
                      title="⚡ Auto-Translate"
                    >
                      <Sparkles className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveMilestone(m.id)}
                      className="p-1.5 text-red-500 hover:text-red-700 cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="admin-label text-xs">Milestone Year (e.g. 2009)</label>
                    <input
                      type="text"
                      value={m.year}
                      onChange={(e) =>
                        setData((prev) => ({
                          ...prev,
                          milestones: prev.milestones.map((item) =>
                            item.id === m.id ? { ...item, year: e.target.value } : item
                          ),
                        }))
                      }
                      className="admin-input text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="admin-label text-xs">Category Tag (English)</label>
                    <input
                      type="text"
                      value={m.tag_en}
                      onChange={(e) =>
                        setData((prev) => ({
                          ...prev,
                          milestones: prev.milestones.map((item) =>
                            item.id === m.id ? { ...item, tag_en: e.target.value } : item
                          ),
                        }))
                      }
                      className="admin-input text-xs"
                    />
                  </div>
                  <div>
                    <label className="admin-label text-xs">Category Tag (Marathi)</label>
                    <input
                      type="text"
                      value={m.tag_mr}
                      onChange={(e) =>
                        setData((prev) => ({
                          ...prev,
                          milestones: prev.milestones.map((item) =>
                            item.id === m.id ? { ...item, tag_mr: e.target.value } : item
                          ),
                        }))
                      }
                      className="admin-input text-xs font-marathi"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="admin-label text-xs">Milestone Title (English)</label>
                    <input
                      type="text"
                      value={m.title_en}
                      onChange={(e) =>
                        setData((prev) => ({
                          ...prev,
                          milestones: prev.milestones.map((item) =>
                            item.id === m.id ? { ...item, title_en: e.target.value } : item
                          ),
                        }))
                      }
                      className="admin-input text-xs font-medium"
                    />
                  </div>
                  <div>
                    <label className="admin-label text-xs">Milestone Title (Marathi)</label>
                    <input
                      type="text"
                      value={m.title_mr}
                      onChange={(e) =>
                        setData((prev) => ({
                          ...prev,
                          milestones: prev.milestones.map((item) =>
                            item.id === m.id ? { ...item, title_mr: e.target.value } : item
                          ),
                        }))
                      }
                      className="admin-input text-xs font-marathi font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="admin-label text-xs">Description (English)</label>
                    <textarea
                      rows={3}
                      value={m.description_en}
                      onChange={(e) =>
                        setData((prev) => ({
                          ...prev,
                          milestones: prev.milestones.map((item) =>
                            item.id === m.id ? { ...item, description_en: e.target.value } : item
                          ),
                        }))
                      }
                      className="admin-input text-xs"
                    />
                  </div>
                  <div>
                    <label className="admin-label text-xs">Description (Marathi)</label>
                    <textarea
                      rows={3}
                      value={m.description_mr}
                      onChange={(e) =>
                        setData((prev) => ({
                          ...prev,
                          milestones: prev.milestones.map((item) =>
                            item.id === m.id ? { ...item, description_mr: e.target.value } : item
                          ),
                        }))
                      }
                      className="admin-input text-xs font-marathi"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 6: Bottom Call-to-Action */}
      {activeTab === 'cta' && (
        <div className="admin-card p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-charcoal-100">
            <div>
              <h3 className="text-base font-semibold text-charcoal-900">Bottom Call-to-Action Banner</h3>
              <p className="text-xs text-charcoal-500">Banner displayed at the footer of the About Page with dual action buttons</p>
            </div>
            <button
              type="button"
              disabled={isTranslating}
              onClick={async () => {
                setIsTranslating(true);
                try {
                  const [hMr, dMr, b1Mr, b2Mr] = await Promise.all([
                    data.bottom_cta.headline_en ? translateText(data.bottom_cta.headline_en, 'mr') : Promise.resolve(''),
                    data.bottom_cta.description_en ? translateText(data.bottom_cta.description_en, 'mr') : Promise.resolve(''),
                    data.bottom_cta.btn1_label_en ? translateText(data.bottom_cta.btn1_label_en, 'mr') : Promise.resolve(''),
                    data.bottom_cta.btn2_label_en ? translateText(data.bottom_cta.btn2_label_en, 'mr') : Promise.resolve(''),
                  ]);
                  setData((prev) => ({
                    ...prev,
                    bottom_cta: {
                      ...prev.bottom_cta,
                      headline_mr: hMr || prev.bottom_cta.headline_mr,
                      description_mr: dMr || prev.bottom_cta.description_mr,
                      btn1_label_mr: b1Mr || prev.bottom_cta.btn1_label_mr,
                      btn2_label_mr: b2Mr || prev.bottom_cta.btn2_label_mr,
                    },
                  }));
                } finally {
                  setIsTranslating(false);
                }
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-saffron-50 hover:bg-saffron-100 text-saffron-700 border border-saffron-200 rounded-lg text-xs font-medium transition-colors cursor-pointer self-start sm:self-auto"
            >
              <Sparkles className="w-3.5 h-3.5 text-saffron-500" />
              <span>⚡ Auto-Translate CTA</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="admin-label">Headline (English)</label>
              <input
                type="text"
                value={data.bottom_cta.headline_en}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    bottom_cta: { ...prev.bottom_cta, headline_en: e.target.value },
                  }))
                }
                className="admin-input font-medium"
              />
            </div>
            <div>
              <label className="admin-label">Headline (Marathi)</label>
              <input
                type="text"
                value={data.bottom_cta.headline_mr}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    bottom_cta: { ...prev.bottom_cta, headline_mr: e.target.value },
                  }))
                }
                className="admin-input font-marathi font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="admin-label">Description (English)</label>
              <textarea
                rows={3}
                value={data.bottom_cta.description_en}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    bottom_cta: { ...prev.bottom_cta, description_en: e.target.value },
                  }))
                }
                className="admin-input text-xs"
              />
            </div>
            <div>
              <label className="admin-label">Description (Marathi)</label>
              <textarea
                rows={3}
                value={data.bottom_cta.description_mr}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    bottom_cta: { ...prev.bottom_cta, description_mr: e.target.value },
                  }))
                }
                className="admin-input text-xs font-marathi"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-3 border-t border-charcoal-100">
            {/* Button 1 */}
            <div className="space-y-3 p-4 rounded-xl bg-warmWhite-100 border border-charcoal-200">
              <span className="text-xs font-bold uppercase tracking-wider text-saffron-600">Button 1 (Primary)</span>
              <div>
                <label className="admin-label text-xs">Label (English)</label>
                <input
                  type="text"
                  value={data.bottom_cta.btn1_label_en}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      bottom_cta: { ...prev.bottom_cta, btn1_label_en: e.target.value },
                    }))
                  }
                  className="admin-input text-xs"
                />
              </div>
              <div>
                <label className="admin-label text-xs">Label (Marathi)</label>
                <input
                  type="text"
                  value={data.bottom_cta.btn1_label_mr}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      bottom_cta: { ...prev.bottom_cta, btn1_label_mr: e.target.value },
                    }))
                  }
                  className="admin-input text-xs font-marathi"
                />
              </div>
              <div>
                <label className="admin-label text-xs">Link Target URL</label>
                <input
                  type="text"
                  value={data.bottom_cta.btn1_url}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      bottom_cta: { ...prev.bottom_cta, btn1_url: e.target.value },
                    }))
                  }
                  className="admin-input text-xs"
                />
              </div>
            </div>

            {/* Button 2 */}
            <div className="space-y-3 p-4 rounded-xl bg-warmWhite-100 border border-charcoal-200">
              <span className="text-xs font-bold uppercase tracking-wider text-saffron-600">Button 2 (Secondary)</span>
              <div>
                <label className="admin-label text-xs">Label (English)</label>
                <input
                  type="text"
                  value={data.bottom_cta.btn2_label_en}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      bottom_cta: { ...prev.bottom_cta, btn2_label_en: e.target.value },
                    }))
                  }
                  className="admin-input text-xs"
                />
              </div>
              <div>
                <label className="admin-label text-xs">Label (Marathi)</label>
                <input
                  type="text"
                  value={data.bottom_cta.btn2_label_mr}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      bottom_cta: { ...prev.bottom_cta, btn2_label_mr: e.target.value },
                    }))
                  }
                  className="admin-input text-xs font-marathi"
                />
              </div>
              <div>
                <label className="admin-label text-xs">Link Target URL</label>
                <input
                  type="text"
                  value={data.bottom_cta.btn2_url}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      bottom_cta: { ...prev.bottom_cta, btn2_url: e.target.value },
                    }))
                  }
                  className="admin-input text-xs"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAbout;

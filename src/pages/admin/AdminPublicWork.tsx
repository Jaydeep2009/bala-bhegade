import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  Save,
  Check,
  ExternalLink,
  Sparkles,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Building2,
  Filter,
  CheckCircle2,
  Clock,
  Layers,
  Edit2,
  X,
} from 'lucide-react';
import ImageUpload from '@/components/ui/ImageUpload';
import { translateText } from '@/lib/translation';
import {
  getPublicWorkPageData,
  updatePublicWorkPageData,
  type PublicWorkPageData,
  type PublicWorkItem,
} from '@/lib/api';
import { DEFAULT_PUBLIC_WORK_PAGE_DATA } from '@/lib/pageDataDefaults';

const CATEGORIES = [
  { id: 'all', label: 'All Categories' },
  { id: 'infrastructure', label: 'Infrastructure & Roads' },
  { id: 'agriculture', label: 'Agriculture & Rural' },
  { id: 'administration', label: 'Public Administration' },
  { id: 'welfare', label: 'Welfare & Citizen Services' },
  { id: 'healthcare', label: 'Healthcare & PHCs' },
  { id: 'education', label: 'Education & Schools' },
  { id: 'water', label: 'Water & Watershed' },
  { id: 'youth', label: 'Youth & Skill Dev' },
  { id: 'women', label: 'Women Empowerment' },
  { id: 'energy', label: 'Clean Energy & Solar' },
] as const;

export const AdminPublicWork: React.FC = () => {
  const [data, setData] = useState<PublicWorkPageData>(DEFAULT_PUBLIC_WORK_PAGE_DATA);
  const [filterCat, setFilterCat] = useState<string>('all');
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    getPublicWorkPageData().then((res) => {
      setData(res);
      setIsLoading(false);
    });
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      await updatePublicWorkPageData(data);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3500);
    } catch (err) {
      console.error('Failed to save public work page:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddInitiative = () => {
    const newItem: PublicWorkItem = {
      id: `pw-${Date.now()}`,
      category: 'infrastructure',
      title_en: 'New Development Initiative',
      title_mr: 'नवीन सार्वजनिक विकास उपक्रम',
      description_en: 'Detailed description of this public project and constituent benefits.',
      description_mr: 'या विकासकामाचे सविस्तर वर्णन व नागरिकांसाठी होणारा लाभ.',
      image_url: '/images/placeholder-work-1.jpg',
      metrics_en: 'Constituency Project Outreach',
      metrics_mr: 'मतदारसंघ विकास कार्यक्षेत्र',
      status: 'active',
      highlight_tag_en: 'Development',
      highlight_tag_mr: 'विकासकार्य',
    };
    setData((prev) => ({
      ...prev,
      initiatives: [newItem, ...prev.initiatives],
    }));
    setEditingItemId(newItem.id);
  };

  const handleRemoveInitiative = (id: string) => {
    if (confirm('Are you sure you want to delete this initiative?')) {
      setData((prev) => ({
        ...prev,
        initiatives: prev.initiatives.filter((item) => item.id !== id),
      }));
      if (editingItemId === id) setEditingItemId(null);
    }
  };

  const handleMoveInitiative = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= data.initiatives.length) return;
    const initiatives = [...data.initiatives];
    const [moved] = initiatives.splice(index, 1);
    initiatives.splice(targetIdx, 0, moved);
    setData((prev) => ({ ...prev, initiatives }));
  };

  const filteredInitiatives = filterCat === 'all'
    ? data.initiatives
    : data.initiatives.filter((item) => item.category === filterCat);

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
        <title>Public Work & Initiatives Editor | Admin Bala Bhegade</title>
      </Helmet>

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-charcoal-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-saffron-50 text-saffron-600">
              <Briefcase className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-heading font-semibold text-charcoal-900">
              Public Work & Initiatives Editor
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-charcoal-500 mt-1">
            Manage constituency developmental projects, road connectivity, water conservation, school modernization, and community welfare initiatives.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/public-work"
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
            <span>{saveSuccess ? 'Initiatives Saved!' : 'Save All Changes'}</span>
          </button>
        </div>
      </div>

      {/* 1. Header Banner Configuration */}
      <div className="admin-card p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-charcoal-100">
          <div>
            <h3 className="text-base font-semibold text-charcoal-900">Page Header & Intro Banner</h3>
            <p className="text-xs text-charcoal-500">Badge, headline and subtitle introducing constituency public initiatives</p>
          </div>
          <button
            type="button"
            disabled={isTranslating}
            onClick={async () => {
              setIsTranslating(true);
              try {
                const [bMr, tMr, sMr] = await Promise.all([
                  data.header.badge_en ? translateText(data.header.badge_en, 'mr') : Promise.resolve(''),
                  data.header.title_en ? translateText(data.header.title_en, 'mr') : Promise.resolve(''),
                  data.header.subtitle_en ? translateText(data.header.subtitle_en, 'mr') : Promise.resolve(''),
                ]);
                setData((prev) => ({
                  ...prev,
                  header: {
                    ...prev.header,
                    badge_mr: bMr || prev.header.badge_mr,
                    title_mr: tMr || prev.header.title_mr,
                    subtitle_mr: sMr || prev.header.subtitle_mr,
                  },
                }));
              } finally {
                setIsTranslating(false);
              }
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-saffron-50 hover:bg-saffron-100 text-saffron-700 border border-saffron-200 rounded-lg text-xs font-medium transition-colors cursor-pointer self-start sm:self-auto"
          >
            <Sparkles className="w-3.5 h-3.5 text-saffron-500" />
            <span>⚡ Auto-Translate Header</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="admin-label">Top Badge (English)</label>
            <input
              type="text"
              value={data.header.badge_en}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  header: { ...prev.header, badge_en: e.target.value },
                }))
              }
              className="admin-input"
            />
          </div>
          <div>
            <label className="admin-label">Top Badge (Marathi)</label>
            <input
              type="text"
              value={data.header.badge_mr}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  header: { ...prev.header, badge_mr: e.target.value },
                }))
              }
              className="admin-input font-marathi"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="admin-label">Page Headline (English)</label>
            <input
              type="text"
              value={data.header.title_en}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  header: { ...prev.header, title_en: e.target.value },
                }))
              }
              className="admin-input font-medium"
            />
          </div>
          <div>
            <label className="admin-label">Page Headline (Marathi)</label>
            <input
              type="text"
              value={data.header.title_mr}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  header: { ...prev.header, title_mr: e.target.value },
                }))
              }
              className="admin-input font-marathi font-medium"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="admin-label">Subtitle Description (English)</label>
            <textarea
              rows={2}
              value={data.header.subtitle_en}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  header: { ...prev.header, subtitle_en: e.target.value },
                }))
              }
              className="admin-input"
            />
          </div>
          <div>
            <label className="admin-label">Subtitle Description (Marathi)</label>
            <textarea
              rows={2}
              value={data.header.subtitle_mr}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  header: { ...prev.header, subtitle_mr: e.target.value },
                }))
              }
              className="admin-input font-marathi"
            />
          </div>
        </div>
      </div>

      {/* 2. Initiatives Management List */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setFilterCat(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  filterCat === cat.id
                    ? 'bg-saffron-600 text-white shadow-2xs'
                    : 'bg-white text-charcoal-700 border border-charcoal-200 hover:bg-charcoal-50'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleAddInitiative}
            className="btn-primary text-xs py-2 px-3 flex items-center gap-1.5 flex-shrink-0 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Initiative</span>
          </button>
        </div>

        {/* Initiatives List */}
        <div className="space-y-4">
          {filteredInitiatives.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-charcoal-200 text-charcoal-500 text-sm">
              No initiatives found in this category. Click "Add Initiative" above to create one.
            </div>
          ) : (
            filteredInitiatives.map((item, idx) => {
              const isEditing = editingItemId === item.id;
              return (
                <div
                  key={item.id}
                  className={`admin-card overflow-hidden transition-all border ${
                    isEditing ? 'border-saffron-400 ring-1 ring-saffron-300' : 'border-charcoal-200'
                  }`}
                >
                  {/* Collapsed Header / Summary Row */}
                  <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white">
                    <div className="flex items-center gap-3.5">
                      <div className="w-16 h-12 rounded-lg bg-charcoal-100 overflow-hidden flex-shrink-0 border border-charcoal-200">
                        <img
                          src={item.image_url || '/images/placeholder-work-1.jpg'}
                          alt={item.title_en}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-saffron-50 text-saffron-700 border border-saffron-200">
                            {item.category}
                          </span>
                          <span
                            className={`text-[11px] font-medium px-2 py-0.5 rounded-full capitalize ${
                              item.status === 'completed'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : item.status === 'historical'
                                ? 'bg-charcoal-100 text-charcoal-700 border border-charcoal-300'
                                : item.status === 'unverified'
                                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                : 'bg-saffron-50 text-saffron-700 border border-saffron-200'
                            }`}
                          >
                            {item.status}
                          </span>
                          {item.source_url && (
                            <a
                              href={item.source_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[11px] text-blue-600 hover:text-blue-800 flex items-center gap-1 font-medium underline"
                              title="Open Source Article"
                            >
                              <ExternalLink className="w-3 h-3" />
                              <span>Source</span>
                            </a>
                          )}
                        </div>
                        <h4 className="font-heading font-semibold text-sm sm:text-base text-charcoal-900 leading-snug">
                          {item.title_en}
                        </h4>
                        <p className="text-xs text-charcoal-500 font-marathi mt-0.5">
                          {item.title_mr}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 self-end sm:self-auto">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => handleMoveInitiative(idx, 'up')}
                        className="p-1.5 text-charcoal-400 hover:text-charcoal-700 disabled:opacity-30 cursor-pointer"
                        title="Move Up"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === data.initiatives.length - 1}
                        onClick={() => handleMoveInitiative(idx, 'down')}
                        className="p-1.5 text-charcoal-400 hover:text-charcoal-700 disabled:opacity-30 cursor-pointer"
                        title="Move Down"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingItemId(isEditing ? null : item.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                          isEditing
                            ? 'bg-charcoal-800 text-white'
                            : 'bg-saffron-50 text-saffron-700 hover:bg-saffron-100'
                        }`}
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>{isEditing ? 'Close' : 'Edit'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveInitiative(item.id)}
                        className="p-1.5 text-red-500 hover:text-red-700 cursor-pointer"
                        title="Delete Initiative"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Expanded Edit Form */}
                  {isEditing && (
                    <div className="p-5 border-t border-charcoal-100 bg-warmWhite-50 space-y-4">
                      <div className="flex items-center justify-between gap-2 pb-2 border-b border-charcoal-200">
                        <span className="text-xs font-bold uppercase tracking-wider text-saffron-700">
                          Edit Initiative Details
                        </span>
                        <button
                          type="button"
                          onClick={async () => {
                            const [tMr, dMr, mMr, tgMr] = await Promise.all([
                              item.title_en ? translateText(item.title_en, 'mr') : Promise.resolve(''),
                              item.description_en ? translateText(item.description_en, 'mr') : Promise.resolve(''),
                              item.metrics_en ? translateText(item.metrics_en, 'mr') : Promise.resolve(''),
                              item.highlight_tag_en ? translateText(item.highlight_tag_en, 'mr') : Promise.resolve(''),
                            ]);
                            setData((prev) => ({
                              ...prev,
                              initiatives: prev.initiatives.map((i) =>
                                i.id === item.id
                                  ? {
                                      ...i,
                                      title_mr: tMr || i.title_mr,
                                      description_mr: dMr || i.description_mr,
                                      metrics_mr: mMr || i.metrics_mr,
                                      highlight_tag_mr: tgMr || i.highlight_tag_mr,
                                    }
                                  : i
                              ),
                            }));
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-saffron-100 hover:bg-saffron-200 text-saffron-800 rounded-md text-xs font-medium transition-colors cursor-pointer"
                        >
                          <Sparkles className="w-3 h-3 text-saffron-600" />
                          <span>⚡ Auto-Translate Initiative</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="admin-label text-xs">Category</label>
                          <select
                            value={item.category}
                            onChange={(e) =>
                              setData((prev) => ({
                                ...prev,
                                initiatives: prev.initiatives.map((i) =>
                                  i.id === item.id ? { ...i, category: e.target.value as any } : i
                                ),
                              }))
                            }
                            className="admin-input text-xs"
                          >
                            <option value="infrastructure">Infrastructure & Roads (पायाभूत सुविधा व रस्ते)</option>
                            <option value="agriculture">Agriculture & Rural Development (कृषी व शेतकरी कल्याण)</option>
                            <option value="administration">Public Administration & Governance (प्रशासकीय समन्वय)</option>
                            <option value="welfare">Welfare & Citizen Services (जनकल्याण व मदत केंद्र)</option>
                            <option value="healthcare">Healthcare & PHCs (आरोग्य सेवा)</option>
                            <option value="education">Education & Schools (शिक्षण व अभ्यासिका)</option>
                            <option value="water">Water & Watershed (जलसंधारण व सिंचन)</option>
                            <option value="youth">Youth & Skill Dev (युवा व क्रीडा)</option>
                            <option value="women">Women Empowerment (महिला सक्षमीकरण)</option>
                            <option value="energy">Clean Energy & Solar (हरित व सौर ऊर्जा)</option>
                          </select>
                        </div>

                        <div>
                          <label className="admin-label text-xs">Project Status</label>
                          <select
                            value={item.status}
                            onChange={(e) =>
                              setData((prev) => ({
                                ...prev,
                                initiatives: prev.initiatives.map((i) =>
                                  i.id === item.id ? { ...i, status: e.target.value as any } : i
                                ),
                              }))
                            }
                            className="admin-input text-xs"
                          >
                            <option value="historical">Historical / Documented (ऐतिहासिक / नोंदवलेला उपक्रम)</option>
                            <option value="completed">Completed (पूर्ण झालेले)</option>
                            <option value="active">Active / Ongoing (सुरू असलेले)</option>
                            <option value="ongoing">Planning / Outreach (नियोजित)</option>
                            <option value="unverified">Status Unverified (सद्यस्थिती अप्रमाणित)</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="admin-label text-xs">Initiative Title (English)</label>
                          <input
                            type="text"
                            value={item.title_en}
                            onChange={(e) =>
                              setData((prev) => ({
                                ...prev,
                                initiatives: prev.initiatives.map((i) =>
                                  i.id === item.id ? { ...i, title_en: e.target.value } : i
                                ),
                              }))
                            }
                            className="admin-input text-xs font-medium"
                          />
                        </div>
                        <div>
                          <label className="admin-label text-xs">Initiative Title (Marathi)</label>
                          <input
                            type="text"
                            value={item.title_mr}
                            onChange={(e) =>
                              setData((prev) => ({
                                ...prev,
                                initiatives: prev.initiatives.map((i) =>
                                  i.id === item.id ? { ...i, title_mr: e.target.value } : i
                                ),
                              }))
                            }
                            className="admin-input text-xs font-marathi font-medium"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="admin-label text-xs">Highlight Tag (English)</label>
                          <input
                            type="text"
                            value={item.highlight_tag_en}
                            onChange={(e) =>
                              setData((prev) => ({
                                ...prev,
                                initiatives: prev.initiatives.map((i) =>
                                  i.id === item.id ? { ...i, highlight_tag_en: e.target.value } : i
                                ),
                              }))
                            }
                            className="admin-input text-xs"
                          />
                        </div>
                        <div>
                          <label className="admin-label text-xs">Highlight Tag (Marathi)</label>
                          <input
                            type="text"
                            value={item.highlight_tag_mr}
                            onChange={(e) =>
                              setData((prev) => ({
                                ...prev,
                                initiatives: prev.initiatives.map((i) =>
                                  i.id === item.id ? { ...i, highlight_tag_mr: e.target.value } : i
                                ),
                              }))
                            }
                            className="admin-input text-xs font-marathi"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="admin-label text-xs">Metrics / Scope (English)</label>
                          <input
                            type="text"
                            value={item.metrics_en}
                            onChange={(e) =>
                              setData((prev) => ({
                                ...prev,
                                initiatives: prev.initiatives.map((i) =>
                                  i.id === item.id ? { ...i, metrics_en: e.target.value } : i
                                ),
                              }))
                            }
                            className="admin-input text-xs"
                          />
                        </div>
                        <div>
                          <label className="admin-label text-xs">Metrics / Scope (Marathi)</label>
                          <input
                            type="text"
                            value={item.metrics_mr}
                            onChange={(e) =>
                              setData((prev) => ({
                                ...prev,
                                initiatives: prev.initiatives.map((i) =>
                                  i.id === item.id ? { ...i, metrics_mr: e.target.value } : i
                                ),
                              }))
                            }
                            className="admin-input text-xs font-marathi"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="admin-label text-xs">Description (English)</label>
                          <textarea
                            rows={3}
                            value={item.description_en}
                            onChange={(e) =>
                              setData((prev) => ({
                                ...prev,
                                initiatives: prev.initiatives.map((i) =>
                                  i.id === item.id ? { ...i, description_en: e.target.value } : i
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
                            value={item.description_mr}
                            onChange={(e) =>
                              setData((prev) => ({
                                ...prev,
                                initiatives: prev.initiatives.map((i) =>
                                  i.id === item.id ? { ...i, description_mr: e.target.value } : i
                                ),
                              }))
                            }
                            className="admin-input text-xs font-marathi"
                          />
                        </div>
                      </div>

                      <div>
                        <ImageUpload
                          label="Project Photograph"
                          description="Authentic ground photograph of the developmental initiative"
                          value={item.image_url}
                          onChange={(url) =>
                            setData((prev) => ({
                              ...prev,
                              initiatives: prev.initiatives.map((i) =>
                                i.id === item.id ? { ...i, image_url: url } : i
                              ),
                            }))
                          }
                        />
                      </div>

                      <div className="pt-2 border-t border-charcoal-200">
                        <label className="admin-label text-xs">Source Article / Media Reference URL (Optional)</label>
                        <div className="flex gap-2 items-center">
                          <input
                            type="url"
                            placeholder="https://..."
                            value={item.source_url || ''}
                            onChange={(e) =>
                              setData((prev) => ({
                                ...prev,
                                initiatives: prev.initiatives.map((i) =>
                                  i.id === item.id ? { ...i, source_url: e.target.value } : i
                                ),
                              }))
                            }
                            className="admin-input text-xs font-mono"
                          />
                          {item.source_url && (
                            <a
                              href={item.source_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-2 bg-charcoal-100 hover:bg-charcoal-200 text-charcoal-700 rounded-md text-xs font-medium flex items-center gap-1 whitespace-nowrap"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              <span>Open</span>
                            </a>
                          )}
                        </div>
                        <p className="text-[11px] text-charcoal-500 mt-1">
                          Official news article, press release, or verified documentation link
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 3. Bottom CTA Banner */}
      <div className="admin-card p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-charcoal-100">
          <div>
            <h3 className="text-base font-semibold text-charcoal-900">Bottom Suggestion Banner</h3>
            <p className="text-xs text-charcoal-500">Banner inviting community project proposals and citizen feedback</p>
          </div>
          <button
            type="button"
            disabled={isTranslating}
            onClick={async () => {
              setIsTranslating(true);
              try {
                const [hMr, dMr, bMr] = await Promise.all([
                  data.bottom_cta.headline_en ? translateText(data.bottom_cta.headline_en, 'mr') : Promise.resolve(''),
                  data.bottom_cta.description_en ? translateText(data.bottom_cta.description_en, 'mr') : Promise.resolve(''),
                  data.bottom_cta.btn_label_en ? translateText(data.bottom_cta.btn_label_en, 'mr') : Promise.resolve(''),
                ]);
                setData((prev) => ({
                  ...prev,
                  bottom_cta: {
                    ...prev.bottom_cta,
                    headline_mr: hMr || prev.bottom_cta.headline_mr,
                    description_mr: dMr || prev.bottom_cta.description_mr,
                    btn_label_mr: bMr || prev.bottom_cta.btn_label_mr,
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
              rows={2}
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
              rows={2}
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="admin-label">Button Label (English)</label>
            <input
              type="text"
              value={data.bottom_cta.btn_label_en}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  bottom_cta: { ...prev.bottom_cta, btn_label_en: e.target.value },
                }))
              }
              className="admin-input text-xs"
            />
          </div>
          <div>
            <label className="admin-label">Button Label (Marathi)</label>
            <input
              type="text"
              value={data.bottom_cta.btn_label_mr}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  bottom_cta: { ...prev.bottom_cta, btn_label_mr: e.target.value },
                }))
              }
              className="admin-input text-xs font-marathi"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPublicWork;

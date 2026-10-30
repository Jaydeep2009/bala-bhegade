import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { z } from 'zod';
import {
  ArrowLeft,
  Save,
  Send,
  Image as ImageIcon,
  AlertCircle,
  Check,
  Calendar,
  Tag,
  Globe,
  FileText,
  Clock,
  Sparkles,
} from 'lucide-react';
import { mockNewsArticles } from '@/lib/mock-data';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import { isValidUuid } from '@/lib/api';
import type { NewsArticle } from '@/types/database';
import ImageUpload from '@/components/ui/ImageUpload';
import { translateText } from '@/lib/translation';

// Validation Schema
const newsArticleSchema = z.object({
  title_en: z.string().min(3, 'English title must be at least 3 characters'),
  title_mr: z.string().optional().nullable(),
  slug: z.string().min(3, 'Slug is required and must be URL friendly'),
  category: z.string().min(1, 'Category is required'),
  summary_en: z.string().optional().nullable(),
  summary_mr: z.string().optional().nullable(),
  body_en: z.string().optional().nullable(),
  body_mr: z.string().optional().nullable(),
  cover_image_url: z.string().optional().nullable(),
  status: z.enum(['draft', 'published']),
  published_at: z.string().optional().nullable(),
});

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export const AdminNewsEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  // Form states
  const [titleEn, setTitleEn] = useState('');
  const [titleMr, setTitleMr] = useState('');
  const [slug, setSlug] = useState('');
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);
  const [summaryEn, setSummaryEn] = useState('');
  const [summaryMr, setSummaryMr] = useState('');
  const [bodyEn, setBodyEn] = useState('');
  const [bodyMr, setBodyMr] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [category, setCategory] = useState('initiatives');
  const [tagsInput, setTagsInput] = useState('');
  const [status, setStatus] = useState<'draft' | 'published'>('draft');
  const [publishedAt, setPublishedAt] = useState('');

  // Dirty state tracking for unsaved changes
  const [isDirty, setIsDirty] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAutoTranslating, setIsAutoTranslating] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Auto-translate English fields to Marathi using Google/free translation
  const handleAutoTranslate = async () => {
    if (!titleEn.trim() && !summaryEn.trim() && !bodyEn.trim()) {
      setNotification({
        message: 'Please enter English title, summary, or body before translating.',
        type: 'error',
      });
      return;
    }

    setIsAutoTranslating(true);
    setNotification(null);

    try {
      const [tTitle, tSummary, tBody] = await Promise.all([
        titleEn.trim() ? translateText(titleEn.trim(), 'mr') : Promise.resolve(''),
        summaryEn.trim() ? translateText(summaryEn.trim(), 'mr') : Promise.resolve(''),
        bodyEn.trim() ? translateText(bodyEn.trim(), 'mr') : Promise.resolve(''),
      ]);

      if (tTitle) setTitleMr(tTitle);
      if (tSummary) setSummaryMr(tSummary);
      if (tBody) setBodyMr(tBody);

      setIsDirty(true);
      setNotification({
        message: 'Content successfully translated to Marathi!',
        type: 'success',
      });
    } catch (err: unknown) {
      setNotification({
        message: 'Translation failed. Please check network connection.',
        type: 'error',
      });
    } finally {
      setIsAutoTranslating(false);
    }
  };

  // Load article if editing
  useEffect(() => {
    if (isEditing && id) {
      const existing = mockNewsArticles.find((a) => a.id === id);
      if (existing) {
        setTitleEn(existing.title_en);
        setTitleMr(existing.title_mr);
        setSlug(existing.slug);
        setIsSlugManuallyEdited(true);
        setSummaryEn(existing.summary_en || '');
        setSummaryMr(existing.summary_mr || '');
        setBodyEn(existing.body_en || '');
        setBodyMr(existing.body_mr || '');
        setCoverImageUrl(existing.cover_image_url || '');
        setCategory(existing.category || 'initiatives');
        setTagsInput(existing.tags ? existing.tags.join(', ') : '');
        setStatus(existing.status);
        setPublishedAt(
          existing.published_at ? existing.published_at.slice(0, 10) : ''
        );
      }
    }
  }, [isEditing, id]);

  // Auto-generate slug when title_en changes unless manually customized
  const handleTitleEnChange = (val: string) => {
    setTitleEn(val);
    setIsDirty(true);
    if (!isSlugManuallyEdited) {
      setSlug(generateSlug(val));
    }
  };

  const handleSlugChange = (val: string) => {
    setSlug(val);
    setIsSlugManuallyEdited(true);
    setIsDirty(true);
  };

  // Submit handler
  const handleSave = async (targetStatus?: 'draft' | 'published') => {
    setValidationErrors({});
    setNotification(null);

    const chosenStatus = targetStatus || status;
    const finalPublishedAt =
      chosenStatus === 'published' && !publishedAt
        ? new Date().toISOString().slice(0, 10)
        : publishedAt;

    const parsedTags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    // Auto-translate if Marathi fields were left blank by admin
    let finalTitleMr = titleMr.trim();
    let finalSummaryMr = summaryMr.trim();
    let finalBodyMr = bodyMr.trim();

    if (!finalTitleMr && titleEn.trim()) {
      try {
        finalTitleMr = await translateText(titleEn.trim(), 'mr');
        setTitleMr(finalTitleMr);
      } catch {
        finalTitleMr = titleEn.trim();
      }
    }

    if (!finalSummaryMr && summaryEn.trim()) {
      try {
        finalSummaryMr = await translateText(summaryEn.trim(), 'mr');
        setSummaryMr(finalSummaryMr);
      } catch {
        finalSummaryMr = summaryEn.trim();
      }
    }

    if (!finalBodyMr && bodyEn.trim()) {
      try {
        finalBodyMr = await translateText(bodyEn.trim(), 'mr');
        setBodyMr(finalBodyMr);
      } catch {
        finalBodyMr = bodyEn.trim();
      }
    }

    const formData = {
      title_en: titleEn.trim(),
      title_mr: finalTitleMr || titleEn.trim(),
      slug: slug.trim() || generateSlug(titleEn),
      category,
      summary_en: summaryEn.trim() || null,
      summary_mr: finalSummaryMr || null,
      body_en: bodyEn.trim() || null,
      body_mr: finalBodyMr || null,
      cover_image_url: coverImageUrl.trim() || null,
      status: chosenStatus,
      published_at: finalPublishedAt ? `${finalPublishedAt}T00:00:00Z` : null,
    };

    // Zod validation
    const result = newsArticleSchema.safeParse(formData);
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          errors[err.path[0] as string] = err.message;
        }
      });
      setValidationErrors(errors);
      setNotification({
        message: 'Please resolve the highlighted validation errors before saving.',
        type: 'error',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      if (isSupabaseConfigured && supabase) {
        if (isEditing && id && isValidUuid(id)) {
          const { error } = await supabase
            .from('news_articles')
            .update({
              ...formData,
              tags: parsedTags,
              updated_at: new Date().toISOString(),
            })
            .eq('id', id);
          if (error) throw error;
        } else {
          const { error } = await supabase.from('news_articles').insert({
            ...formData,
            tags: parsedTags,
          });
          if (error) throw error;
        }
        setIsDirty(false);
        setNotification({
          message: isEditing
            ? 'Article updated successfully!'
            : 'New article created successfully!',
          type: 'success',
        });
      } else {
        // Dev mode simulation
        await new Promise((res) => setTimeout(res, 600));
        setIsDirty(false);
        setNotification({
          message:
            'Dev Mode: Article saved in local preview (changes not persisted to database).',
          type: 'success',
        });
      }

      setStatus(chosenStatus);
      if (chosenStatus === 'published' && !publishedAt) {
        setPublishedAt(new Date().toISOString().slice(0, 10));
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setNotification({ message: `Save failed: ${err.message}`, type: 'error' });
      } else {
        setNotification({ message: 'An unexpected error occurred while saving.', type: 'error' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      <Helmet>
        <title>
          {isDirty ? '* ' : ''}
          {isEditing ? `Edit Article: ${titleEn || 'Untitled'}` : 'Create Article'} | Admin Bala Bhegade
        </title>
      </Helmet>

      {/* Top Navigation & Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-charcoal-200 pb-5">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/news"
            className="p-2 rounded-lg bg-white border border-charcoal-200 text-charcoal-600 hover:text-saffron-600 hover:border-saffron-500 transition-colors"
            title="Back to Articles"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-heading font-semibold text-charcoal-900">
                {isEditing ? 'Edit News Article' : 'Create News Article'}
              </h1>
              {isDirty && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">
                  Unsaved changes *
                </span>
              )}
            </div>
            <p className="text-xs text-charcoal-500 mt-0.5">
              {isEditing ? `Editing ID #${id}` : 'Fill in English and Marathi content for this announcement'}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
          <button
            type="button"
            onClick={handleAutoTranslate}
            disabled={isAutoTranslating || isSubmitting}
            className="btn-secondary flex items-center gap-1.5 text-xs sm:text-sm py-2 px-3 text-saffron-700 border-saffron-300 hover:bg-saffron-50"
            title="Automatically translate English title, summary, and body to Marathi"
          >
            {isAutoTranslating ? (
              <span className="w-3.5 h-3.5 border-2 border-saffron-600 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4 text-saffron-600" />
            )}
            <span>{isAutoTranslating ? 'Translating...' : 'Auto-Translate to Marathi'}</span>
          </button>
          <button
            type="button"
            onClick={() => handleSave('draft')}
            disabled={isSubmitting || isAutoTranslating}
            className="btn-secondary flex items-center gap-1.5 text-xs sm:text-sm py-2 px-3.5"
          >
            <Save className="w-4 h-4" />
            <span>Save Draft</span>
          </button>
          <button
            type="button"
            onClick={() => handleSave('published')}
            disabled={isSubmitting || isAutoTranslating}
            className="btn-primary flex items-center gap-1.5 text-xs sm:text-sm py-2 px-4"
          >
            <Send className="w-4 h-4" />
            <span>Publish Now</span>
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div
          className={`p-4 rounded-lg flex items-center gap-3 text-sm animate-fade-in ${
            notification.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {notification.type === 'success' ? (
            <Check className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Main Form Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Fields (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Article Titles */}
          <div className="admin-card p-6 space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-charcoal-600 border-b border-charcoal-100 pb-2">
              Article Titles
            </h2>

            <div>
              <label className="admin-label">
                Title (English) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={titleEn}
                onChange={(e) => handleTitleEnChange(e.target.value)}
                placeholder="e.g. Major Highway Expansion Approved for Maval"
                className={`admin-input ${validationErrors.title_en ? 'border-red-400' : ''}`}
              />
              {validationErrors.title_en && (
                <p className="text-xs text-red-600 mt-1">{validationErrors.title_en}</p>
              )}
            </div>

            <div>
              <label className="admin-label flex items-center justify-between">
                <span>Title (Marathi)</span>
                <span className="text-[11px] text-saffron-700 font-normal">
                  Optional (Auto-translates from English)
                </span>
              </label>
              <input
                type="text"
                value={titleMr}
                onChange={(e) => {
                  setTitleMr(e.target.value);
                  setIsDirty(true);
                }}
                placeholder="उदा. मावळसाठी महत्त्वाचा महामार्ग विस्तार मंजूर"
                className={`admin-input font-marathi ${
                  validationErrors.title_mr ? 'border-red-400' : ''
                }`}
              />
              {validationErrors.title_mr && (
                <p className="text-xs text-red-600 mt-1">{validationErrors.title_mr}</p>
              )}
            </div>

            <div>
              <label className="admin-label flex items-center justify-between">
                <span>URL Slug <span className="text-red-500">*</span></span>
                <span className="text-[11px] text-charcoal-400 font-normal">
                  Auto-generated from English title
                </span>
              </label>
              <div className="flex items-center rounded-md border border-charcoal-300 bg-charcoal-50 px-3">
                <span className="text-xs text-charcoal-400 font-mono select-none">
                  /news/
                </span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => handleSlugChange(e.target.value)}
                  className="w-full bg-transparent border-0 py-2 text-xs font-mono focus:ring-0 focus:outline-none"
                />
              </div>
              {validationErrors.slug && (
                <p className="text-xs text-red-600 mt-1">{validationErrors.slug}</p>
              )}
            </div>
          </div>

          {/* Summaries */}
          <div className="admin-card p-6 space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-charcoal-600 border-b border-charcoal-100 pb-2">
              Short Summary
            </h2>

            <div>
              <label className="admin-label">Summary (English)</label>
              <textarea
                rows={2}
                value={summaryEn}
                onChange={(e) => {
                  setSummaryEn(e.target.value);
                  setIsDirty(true);
                }}
                placeholder="Brief 1-2 sentence lead paragraph..."
                className="admin-input"
              />
            </div>

            <div>
              <label className="admin-label">Summary (Marathi)</label>
              <textarea
                rows={2}
                value={summaryMr}
                onChange={(e) => {
                  setSummaryMr(e.target.value);
                  setIsDirty(true);
                }}
                placeholder="संक्षिप्त सारांश..."
                className="admin-input font-marathi"
              />
            </div>
          </div>

          {/* Full Body Content */}
          <div className="admin-card p-6 space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-charcoal-600 border-b border-charcoal-100 pb-2">
              Full Article Body
            </h2>

            <div>
              <label className="admin-label">Body Content (English)</label>
              <textarea
                rows={8}
                value={bodyEn}
                onChange={(e) => {
                  setBodyEn(e.target.value);
                  setIsDirty(true);
                }}
                placeholder="Detailed article paragraphs..."
                className="admin-input leading-relaxed"
              />
            </div>

            <div>
              <label className="admin-label">Body Content (Marathi)</label>
              <textarea
                rows={8}
                value={bodyMr}
                onChange={(e) => {
                  setBodyMr(e.target.value);
                  setIsDirty(true);
                }}
                placeholder="संपूर्ण लेखाची माहिती..."
                className="admin-input font-marathi leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* Sidebar Meta & Settings (1 Col) */}
        <div className="space-y-6">
          {/* Publishing Status */}
          <div className="admin-card p-6 space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-charcoal-600 border-b border-charcoal-100 pb-2 flex items-center gap-2">
              <Clock className="w-4 h-4 text-saffron-600" />
              Publishing Status
            </h3>

            <div className="space-y-2">
              <label className="flex items-center gap-2.5 text-sm cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="draft"
                  checked={status === 'draft'}
                  onChange={() => {
                    setStatus('draft');
                    setIsDirty(true);
                  }}
                  className="text-saffron-600 focus:ring-saffron-500"
                />
                <span className="font-medium text-charcoal-800">Draft</span>
                <span className="text-xs text-charcoal-400">(Private, visible only to admins)</span>
              </label>

              <label className="flex items-center gap-2.5 text-sm cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="published"
                  checked={status === 'published'}
                  onChange={() => {
                    setStatus('published');
                    setIsDirty(true);
                  }}
                  className="text-saffron-600 focus:ring-saffron-500"
                />
                <span className="font-medium text-charcoal-800">Published</span>
                <span className="text-xs text-charcoal-400">(Publicly visible)</span>
              </label>
            </div>

            <div>
              <label className="admin-label flex items-center gap-1.5 mt-2">
                <Calendar className="w-3.5 h-3.5 text-charcoal-400" />
                <span>Publication Date</span>
              </label>
              <input
                type="date"
                value={publishedAt}
                onChange={(e) => {
                  setPublishedAt(e.target.value);
                  setIsDirty(true);
                }}
                className="admin-input text-xs"
              />
            </div>
          </div>

          {/* Category & Tags */}
          <div className="admin-card p-6 space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-charcoal-600 border-b border-charcoal-100 pb-2 flex items-center gap-2">
              <Tag className="w-4 h-4 text-saffron-600" />
              Category & Tags
            </h3>

            <div>
              <label className="admin-label">Category</label>
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setIsDirty(true);
                }}
                className="admin-input text-sm capitalize"
              >
                <option value="initiatives">Initiatives</option>
                <option value="public-meetings">Public Meetings</option>
                <option value="education">Education</option>
                <option value="health">Healthcare</option>
                <option value="constituency">Constituency Work</option>
                <option value="announcements">Official Announcements</option>
              </select>
            </div>

            <div>
              <label className="admin-label">Tags</label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => {
                  setTagsInput(e.target.value);
                  setIsDirty(true);
                }}
                placeholder="community, development, roads"
                className="admin-input text-xs"
              />
              <p className="text-[11px] text-charcoal-400 mt-1">Separate keywords with commas</p>
            </div>
          </div>

          {/* Cover Image Upload */}
          <div className="admin-card p-6 space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-charcoal-600 border-b border-charcoal-100 pb-2 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-saffron-600" />
              Featured Cover Image
            </h3>

            <ImageUpload
              value={coverImageUrl}
              onChange={(url) => {
                setCoverImageUrl(url);
                setIsDirty(true);
              }}
              description="Upload high quality image for hero card (16:9 recommended)"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminNewsEditor;

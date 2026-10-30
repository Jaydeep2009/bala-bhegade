import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  FileText,
  Search,
  Filter,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { mockNewsArticles } from '@/lib/mock-data';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import { isValidUuid, getAllNews } from '@/lib/api';
import type { NewsArticle } from '@/types/database';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

export const AdminNews: React.FC = () => {
  const { language } = useLanguage();
  const [articles, setArticles] = useState<NewsArticle[]>(mockNewsArticles);

  useEffect(() => {
    getAllNews().then((data) => {
      if (data && data.length > 0) {
        setArticles(data);
      }
    });
  }, []);
  const [activeTab, setActiveTab] = useState<'all' | 'published' | 'draft'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Deletion state
  const [articleToDelete, setArticleToDelete] = useState<NewsArticle | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Extract unique categories
  const categories = Array.from(new Set(articles.map((a) => a.category).filter(Boolean)));

  // Filtered articles
  const filteredArticles = articles.filter((article) => {
    // Status tab filter
    if (activeTab === 'published' && article.status !== 'published') return false;
    if (activeTab === 'draft' && article.status !== 'draft') return false;

    // Category filter
    if (selectedCategory !== 'all' && article.category !== selectedCategory) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchEn = article.title_en.toLowerCase().includes(q);
      const matchMr = article.title_mr.toLowerCase().includes(q);
      const matchCat = article.category.toLowerCase().includes(q);
      if (!matchEn && !matchMr && !matchCat) return false;
    }

    return true;
  });

  const handleDeleteConfirm = async () => {
    if (!articleToDelete) return;
    setIsDeleting(true);

    try {
      if (isSupabaseConfigured && supabase && isValidUuid(articleToDelete.id)) {
        const { error } = await supabase
          .from('news_articles')
          .delete()
          .eq('id', articleToDelete.id);
        if (error) throw error;
      }
      setArticles((prev) => prev.filter((a) => a.id !== articleToDelete.id));
      setArticleToDelete(null);
    } catch (err) {
      console.error('Failed to delete article:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'Not set';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString(language === 'mr' ? 'mr-IN' : 'en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <Helmet>
        <title>Manage News Articles | Admin Bala Bhegade</title>
      </Helmet>

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-charcoal-200 pb-5">
        <div>
          <h1 className="text-2xl font-heading font-semibold text-charcoal-900 flex items-center gap-2.5">
            <FileText className="w-6 h-6 text-saffron-600" />
            News Articles & Press Releases
          </h1>
          <p className="text-sm text-charcoal-500 mt-1">
            Publish announcements, press releases, and constituency development news.
          </p>
        </div>

        <Link
          to="/admin/news/new"
          className="btn-primary self-start sm:self-auto flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>New Article</span>
        </Link>
      </div>

      {/* Filters and Search Bar */}
      <div className="admin-card p-4 space-y-4 sm:space-y-0 sm:flex sm:items-center sm:justify-between sm:gap-4">
        {/* Status Tabs */}
        <div className="flex items-center gap-1 bg-charcoal-100 p-1 rounded-lg">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeTab === 'all'
                ? 'bg-white text-saffron-700 font-semibold shadow-xs'
                : 'text-charcoal-600 hover:text-charcoal-900'
            }`}
          >
            All ({articles.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('published')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeTab === 'published'
                ? 'bg-white text-saffron-700 font-semibold shadow-xs'
                : 'text-charcoal-600 hover:text-charcoal-900'
            }`}
          >
            Published ({articles.filter((a) => a.status === 'published').length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('draft')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeTab === 'draft'
                ? 'bg-white text-saffron-700 font-semibold shadow-xs'
                : 'text-charcoal-600 hover:text-charcoal-900'
            }`}
          >
            Drafts ({articles.filter((a) => a.status === 'draft').length})
          </button>
        </div>

        {/* Search & Category Filter */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Category Dropdown */}
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="admin-input py-1.5 text-xs pr-8 capitalize"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.replace('-', ' ')}
                </option>
              ))}
            </select>
          </div>

          {/* Search Input */}
          <div className="relative min-w-[220px]">
            <Search className="w-4 h-4 text-charcoal-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles..."
              className="admin-input pl-9 py-1.5 text-xs"
            />
          </div>
        </div>
      </div>

      {/* Articles Table */}
      <div className="admin-card overflow-hidden">
        {filteredArticles.length === 0 ? (
          <div className="py-16 text-center">
            <FileText className="w-12 h-12 text-charcoal-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-charcoal-800">No articles found</h3>
            <p className="text-xs text-charcoal-500 mt-1 max-w-sm mx-auto">
              {searchQuery || selectedCategory !== 'all' || activeTab !== 'all'
                ? 'Try adjusting your search criteria or switching the status filter.'
                : 'Get started by creating your first press release or news update.'}
            </p>
            <div className="mt-4">
              <Link to="/admin/news/new" className="btn-primary text-xs py-2 px-4">
                <Plus className="w-3.5 h-3.5 mr-1.5" />
                Create New Article
              </Link>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-charcoal-50 text-xs font-semibold text-charcoal-600 uppercase tracking-wider border-b border-charcoal-200">
                <tr>
                  <th scope="col" className="px-6 py-3.5">
                    Article Title
                  </th>
                  <th scope="col" className="px-6 py-3.5">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3.5">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3.5">
                    Published Date
                  </th>
                  <th scope="col" className="px-6 py-3.5 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal-200">
                {filteredArticles.map((article) => {
                  const isPublished = article.status === 'published';
                  return (
                    <tr
                      key={article.id}
                      className="hover:bg-charcoal-50/70 transition-colors group"
                    >
                      {/* Title */}
                      <td className="px-6 py-4">
                        <div className="flex items-start gap-3">
                          {article.cover_image_url ? (
                            <img
                              src={article.cover_image_url}
                              alt=""
                              className="w-12 h-12 rounded object-cover flex-shrink-0 bg-charcoal-100 border border-charcoal-200"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = 'none';
                              }}
                            />
                          ) : (
                            <div className="w-12 h-12 rounded bg-charcoal-100 flex items-center justify-center flex-shrink-0 text-charcoal-400">
                              <FileText className="w-5 h-5" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <Link
                              to={`/admin/news/${article.id}/edit`}
                              className="font-semibold text-charcoal-900 group-hover:text-saffron-600 transition-colors line-clamp-1 block text-sm"
                            >
                              {language === 'mr' ? article.title_mr : article.title_en}
                            </Link>
                            <span className="text-xs text-charcoal-400 font-marathi block line-clamp-1 mt-0.5">
                              {language === 'mr' ? article.title_en : article.title_mr}
                            </span>
                            <span className="text-[11px] text-charcoal-400 font-mono mt-1 block">
                              slug: /{article.slug}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-charcoal-100 text-charcoal-700 capitalize border border-charcoal-200">
                          {article.category.replace('-', ' ')}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                            isPublished
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {isPublished ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              Published
                            </>
                          ) : (
                            <>
                              <Clock className="w-3.5 h-3.5 text-amber-600" />
                              Draft
                            </>
                          )}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="px-6 py-4 whitespace-nowrap text-xs text-charcoal-500">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-charcoal-400" />
                          <span>{formatDate(article.published_at || article.created_at)}</span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* Public View Link if published */}
                          {isPublished && (
                            <a
                              href={`/news/${article.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded hover:bg-charcoal-100 text-charcoal-500 hover:text-saffron-600 transition-colors"
                              title="View on live website"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}

                          {/* Edit button */}
                          <Link
                            to={`/admin/news/${article.id}/edit`}
                            className="p-1.5 rounded hover:bg-saffron-50 text-charcoal-500 hover:text-saffron-600 transition-colors"
                            title="Edit Article"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>

                          {/* Delete button */}
                          <button
                            type="button"
                            onClick={() => setArticleToDelete(article)}
                            className="p-1.5 rounded hover:bg-red-50 text-charcoal-500 hover:text-red-600 transition-colors"
                            title="Delete Article"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(articleToDelete)}
        title="Delete Article"
        message={`Are you sure you want to delete "${
          articleToDelete ? articleToDelete.title_en : ''
        }"? This action cannot be undone.`}
        confirmText="Delete Article"
        cancelText="Cancel"
        isDestructive={true}
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onClose={() => setArticleToDelete(null)}
      />
    </div>
  );
};

export default AdminNews;

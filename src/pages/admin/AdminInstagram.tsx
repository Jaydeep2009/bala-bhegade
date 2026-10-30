import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Instagram,
  Plus,
  Trash2,
  Star,
  ExternalLink,
  GripVertical,
  Save,
  ChevronUp,
  ChevronDown,
  ArrowUp,
  ArrowDown,
  X,
  Check,
  Sparkles,
  AlertCircle,
  Eye,
  Link as LinkIcon,
} from 'lucide-react';
import { mockSocialPosts } from '@/lib/mock-data';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import { isValidUuid, getAllSocialPosts } from '@/lib/api';
import type { SocialPost } from '@/types/database';
import ImageUpload from '@/components/ui/ImageUpload';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { translateText } from '@/lib/translation';

export const AdminInstagram: React.FC = () => {
  const { language } = useLanguage();
  const [posts, setPosts] = useState<SocialPost[]>(() => {
    return [...mockSocialPosts].sort((a, b) => a.display_order - b.display_order);
  });

  useEffect(() => {
    getAllSocialPosts().then((data) => {
      if (data && data.length > 0) {
        setPosts(data);
      }
    });
  }, []);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<SocialPost | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Post Form
  const [postUrl, setPostUrl] = useState('');
  const [captionEn, setCaptionEn] = useState('');
  const [captionMr, setCaptionMr] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [isFeatured, setIsFeatured] = useState(true);
  const [isAutoTranslating, setIsAutoTranslating] = useState(false);

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Reordering
  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    setPosts((prev) => {
      const next = [...prev];
      const temp = next[index - 1];
      next[index - 1] = next[index];
      next[index] = temp;
      return next.map((p, idx) => ({ ...p, display_order: idx }));
    });
    showNotification('Post position updated');
  };

  const handleMoveDown = (index: number) => {
    if (index === posts.length - 1) return;
    setPosts((prev) => {
      const next = [...prev];
      const temp = next[index + 1];
      next[index + 1] = next[index];
      next[index] = temp;
      return next.map((p, idx) => ({ ...p, display_order: idx }));
    });
    showNotification('Post position updated');
  };

  // Toggle Featured
  const handleToggleFeatured = async (id: string) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, is_featured: !p.is_featured } : p))
    );
    if (isSupabaseConfigured && supabase && isValidUuid(id)) {
      const current = posts.find((p) => p.id === id);
      if (current) {
        await supabase
          .from('social_posts')
          .update({ is_featured: !current.is_featured })
          .eq('id', id);
      }
    }
    showNotification('Featured status updated');
  };

  // Add Post
  const handleAddPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postUrl.trim()) {
      alert('Please enter an Instagram post link');
      return;
    }

    let finalCaptionMr = captionMr.trim();
    if (!finalCaptionMr && captionEn.trim()) {
      try {
        finalCaptionMr = await translateText(captionEn.trim(), 'mr');
        setCaptionMr(finalCaptionMr);
      } catch {
        finalCaptionMr = captionEn.trim();
      }
    }

    const newId = crypto.randomUUID();
    const newPost: SocialPost = {
      id: newId,
      platform: 'instagram',
      post_url: postUrl.trim(),
      caption_en: captionEn.trim() || null,
      caption_mr: finalCaptionMr || null,
      thumbnail_url: thumbnailUrl.trim() || '/images/placeholder-insta-1.jpg',
      is_featured: isFeatured,
      display_order: posts.length,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    try {
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase.from('social_posts').insert({
          id: newId,
          platform: newPost.platform,
          post_url: newPost.post_url,
          caption_en: newPost.caption_en,
          caption_mr: newPost.caption_mr,
          thumbnail_url: newPost.thumbnail_url,
          is_featured: newPost.is_featured,
          display_order: newPost.display_order,
        }).select().single();

        if (error) {
          console.error('Error saving post to Supabase:', error);
          showNotification(`Database save error: ${error.message}`);
          return;
        } else if (data) {
          newPost.id = data.id;
        }
      }

      setPosts((prev) => [newPost, ...prev]);
      setIsAddModalOpen(false);
      setPostUrl('');
      setCaptionEn('');
      setCaptionMr('');
      setThumbnailUrl('');
      setIsFeatured(true);
      showNotification('Instagram highlight added');
    } catch (err: unknown) {
      showNotification(`Failed to add post: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  // Delete
  const handleDeleteConfirm = async () => {
    if (!postToDelete) return;
    try {
      if (isSupabaseConfigured && supabase && isValidUuid(postToDelete.id)) {
        const { error } = await supabase.from('social_posts').delete().eq('id', postToDelete.id);
        if (error) {
          showNotification(`Database delete error: ${error.message}`);
          return;
        }
      }
      setPosts((prev) => prev.filter((p) => p.id !== postToDelete.id));
      setPostToDelete(null);
      showNotification('Post removed');
    } catch (err: unknown) {
      showNotification(`Delete failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      <Helmet>
        <title>Manage Instagram Feed | Admin Bala Bhegade</title>
      </Helmet>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-charcoal-200 pb-5">
        <div>
          <h1 className="text-2xl font-heading font-semibold text-charcoal-900 flex items-center gap-2.5">
            <Instagram className="w-6 h-6 text-pink-600" />
            Instagram Feed Manager
          </h1>
          <p className="text-sm text-charcoal-500 mt-1">
            Curate social highlights, pin key Instagram updates, and arrange order for public visitors.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="btn-primary self-start sm:self-auto flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Post</span>
        </button>
      </div>

      {/* Notification Toast */}
      {toastMessage && (
        <div className="p-3.5 rounded-lg bg-emerald-800 text-white text-xs sm:text-sm font-medium flex items-center gap-2 animate-fade-in shadow-md">
          <Check className="w-4 h-4 text-emerald-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Integration Future Roadmap Banner */}
      <div className="admin-card p-4 bg-gradient-to-r from-pink-50 via-purple-50 to-amber-50 border border-pink-200 flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-pink-600 flex-shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm text-charcoal-800">
          <span className="font-semibold text-charcoal-950">Future API Sync Available:</span>{' '}
          In this preview mode, posts can be curated manually with custom thumbnails and captions.
          To automatically pull the latest media directly from{' '}
          <span className="font-medium text-pink-700">@balabhegade</span>, connect the Instagram
          Basic Display API in Settings.
        </div>
      </div>

      {/* Posts List & Management Table */}
      <div className="admin-card overflow-hidden">
        <div className="p-4 border-b border-charcoal-100 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-charcoal-700">
            Curated Instagram Posts ({posts.length})
          </h2>
          <span className="text-xs text-charcoal-500">
            {posts.filter((p) => p.is_featured).length} featured on homepage
          </span>
        </div>

        {posts.length === 0 ? (
          <div className="py-16 text-center">
            <Instagram className="w-12 h-12 text-charcoal-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-charcoal-800">No Instagram posts added</h3>
            <p className="text-xs text-charcoal-500 mt-1">
              Click &quot;Add Post&quot; to showcase recent Instagram moments on your homepage.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-charcoal-100">
            {posts.map((post, index) => (
              <div
                key={post.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-charcoal-50/70 transition-colors"
              >
                {/* Left: Reorder Controls + Thumbnail + Content */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {/* Reorder Buttons */}
                  <div className="flex flex-col items-center gap-1 text-charcoal-400 flex-shrink-0">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => handleMoveUp(index)}
                      className="p-1 rounded hover:bg-charcoal-200 text-charcoal-600 disabled:opacity-20"
                      title="Move up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={index === posts.length - 1}
                      onClick={() => handleMoveDown(index)}
                      className="p-1 rounded hover:bg-charcoal-200 text-charcoal-600 disabled:opacity-20"
                      title="Move down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Thumbnail */}
                  <div className="relative w-16 h-16 rounded-lg bg-charcoal-200 overflow-hidden flex-shrink-0 border border-charcoal-200">
                    {post.thumbnail_url ? (
                      <img
                        src={post.thumbnail_url}
                        alt=""
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    ) : null}
                    <div className="absolute inset-0 flex items-center justify-center -z-10 text-charcoal-400">
                      <Instagram className="w-6 h-6" />
                    </div>
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono font-medium text-charcoal-500">
                        Order #{index + 1}
                      </span>
                      {post.is_featured && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-pink-100 text-pink-700">
                          <Star className="w-3 h-3 fill-current" />
                          Featured
                        </span>
                      )}
                    </div>

                    <p className="text-sm font-medium text-charcoal-900 truncate">
                      {language === 'mr'
                        ? post.caption_mr || post.caption_en || 'Instagram Update'
                        : post.caption_en || post.caption_mr || 'Instagram Update'}
                    </p>

                    <a
                      href={post.post_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-saffron-600 hover:text-saffron-700 hover:underline mt-0.5 font-mono truncate max-w-md"
                    >
                      <ExternalLink className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">{post.post_url}</span>
                    </a>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => handleToggleFeatured(post.id)}
                    className={`btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5 ${
                      post.is_featured ? 'text-pink-700 border-pink-200 bg-pink-50' : ''
                    }`}
                  >
                    <Star
                      className={`w-3.5 h-3.5 ${
                        post.is_featured ? 'fill-current text-pink-600' : ''
                      }`}
                    />
                    <span>{post.is_featured ? 'Featured' : 'Feature'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPostToDelete(post)}
                    className="p-2 rounded-lg text-charcoal-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Remove post"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Public Preview Section */}
      <div className="admin-card p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-charcoal-100 pb-3">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-saffron-600" />
            <h3 className="text-sm font-semibold uppercase tracking-wider text-charcoal-800">
              Live Public Feed Preview
            </h3>
          </div>
          <span className="text-xs text-charcoal-400">Homepage grid mock-up</span>
        </div>

        <p className="text-xs text-charcoal-500">
          Here is how your curated posts will appear to visitors on the public homepage:
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
          {posts.slice(0, 4).map((post) => (
            <a
              key={post.id}
              href={post.post_url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square rounded-xl overflow-hidden bg-charcoal-100 shadow-sm block border border-charcoal-200"
            >
              <img
                src={post.thumbnail_url || '/images/placeholder-insta-1.jpg'}
                alt=""
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-charcoal-950/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3 text-white text-xs">
                <div className="self-end">
                  <Instagram className="w-4 h-4" />
                </div>
                <p className="line-clamp-3 leading-snug">
                  {language === 'mr' ? post.caption_mr : post.caption_en}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Add Post Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-charcoal-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="admin-card max-w-lg w-full p-6 shadow-2xl relative my-8 animate-scale-up">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 text-charcoal-400 hover:text-charcoal-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-semibold text-charcoal-900 mb-1 flex items-center gap-2">
              <Instagram className="w-5 h-5 text-pink-600" />
              Add Instagram Post
            </h3>
            <p className="text-xs text-charcoal-500 mb-5">
              Add a direct link to an Instagram post along with a thumbnail snapshot.
            </p>

            <form onSubmit={handleAddPost} className="space-y-4">
              <div>
                <label className="admin-label">
                  Instagram Post URL <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <LinkIcon className="w-4 h-4 text-charcoal-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    required
                    value={postUrl}
                    onChange={(e) => setPostUrl(e.target.value)}
                    placeholder="https://www.instagram.com/p/C-XYZ123/"
                    className="admin-input pl-9"
                  />
                </div>
              </div>

              <div>
                <label className="admin-label">Caption / Description (English)</label>
                <textarea
                  rows={2}
                  value={captionEn}
                  onChange={(e) => setCaptionEn(e.target.value)}
                  placeholder="Key highlight or quote from the post..."
                  className="admin-input"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="admin-label mb-0">Caption (Marathi)</label>
                  <button
                    type="button"
                    disabled={!captionEn.trim() || isAutoTranslating}
                    onClick={async () => {
                      setIsAutoTranslating(true);
                      try {
                        const res = await translateText(captionEn, 'mr');
                        setCaptionMr(res);
                      } catch {
                        // ignore error
                      } finally {
                        setIsAutoTranslating(false);
                      }
                    }}
                    className="text-[11px] text-saffron-700 hover:text-saffron-800 font-medium inline-flex items-center gap-1 cursor-pointer disabled:opacity-40"
                  >
                    <Sparkles className="w-3 h-3 text-saffron-600" />
                    <span>{isAutoTranslating ? 'Translating...' : 'Auto-Translate from English'}</span>
                  </button>
                </div>
                <textarea
                  rows={2}
                  value={captionMr}
                  onChange={(e) => setCaptionMr(e.target.value)}
                  placeholder="मराठी मथळा (वैकल्पिक - रिक्त ठेवल्यास इंग्रजीतून भाषांतरित होईल)..."
                  className="admin-input font-marathi"
                />
              </div>

              {/* Thumbnail Upload */}
              <ImageUpload
                label="Post Thumbnail Image"
                description="Upload screenshot or image asset for this post"
                value={thumbnailUrl}
                onChange={(url) => setThumbnailUrl(url)}
              />

              <div className="pt-2">
                <label className="inline-flex items-center gap-2.5 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="rounded text-saffron-600 focus:ring-saffron-500"
                  />
                  <span className="font-medium text-charcoal-800">
                    Feature on Homepage Social Bar
                  </span>
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-charcoal-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="btn-secondary text-sm"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary text-sm flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  <span>Add Post</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(postToDelete)}
        title="Remove Instagram Post"
        message="Are you sure you want to remove this post from the public showcase?"
        confirmText="Remove Post"
        cancelText="Cancel"
        isDestructive={true}
        onConfirm={handleDeleteConfirm}
        onClose={() => setPostToDelete(null)}
      />
    </div>
  );
};

export default AdminInstagram;

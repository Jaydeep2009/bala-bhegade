import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Upload,
  Star,
  StarOff,
  Eye,
  EyeOff,
  Trash2,
  Edit,
  GripVertical,
  ChevronUp,
  ChevronDown,
  ArrowUp,
  ArrowDown,
  Check,
  Plus,
  Filter,
  Image as GalleryIcon,
  X,
  AlertCircle,
  Save,
} from 'lucide-react';
import { mockGalleryItems } from '@/lib/mock-data';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import { isValidUuid, getAllGalleryItems } from '@/lib/api';
import type { GalleryItem } from '@/types/database';
import ImageUpload from '@/components/ui/ImageUpload';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

export const AdminGallery: React.FC = () => {
  const [items, setItems] = useState<GalleryItem[]>(() => {
    return [...mockGalleryItems].sort((a, b) => a.display_order - b.display_order);
  });

  useEffect(() => {
    getAllGalleryItems().then((data) => {
      if (data && data.length > 0) {
        setItems(data);
      }
    });
  }, []);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<GalleryItem | null>(null);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New photo upload form state
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newCaptionEn, setNewCaptionEn] = useState('');
  const [newCaptionMr, setNewCaptionMr] = useState('');
  const [newAltTextEn, setNewAltTextEn] = useState('');
  const [newAltTextMr, setNewAltTextMr] = useState('');
  const [newCategory, setNewCategory] = useState('events');
  const [newIsFeatured, setNewIsFeatured] = useState(false);

  // Categories
  const categories = Array.from(new Set(items.map((i) => i.category).filter(Boolean)));

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Toggle Featured
  const handleToggleFeatured = async (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, is_featured: !item.is_featured } : item
      )
    );
    if (isSupabaseConfigured && supabase && isValidUuid(id)) {
      const current = items.find((i) => i.id === id);
      if (current) {
        await supabase
          .from('gallery_items')
          .update({ is_featured: !current.is_featured })
          .eq('id', id);
      }
    }
    showNotification('Featured status updated');
  };

  // Toggle Visibility
  const handleToggleVisibility = async (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, is_visible: !item.is_visible } : item
      )
    );
    if (isSupabaseConfigured && supabase && isValidUuid(id)) {
      const current = items.find((i) => i.id === id);
      if (current) {
        await supabase
          .from('gallery_items')
          .update({ is_visible: !current.is_visible })
          .eq('id', id);
      }
    }
    showNotification('Visibility updated');
  };

  // Move Up
  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    setItems((prev) => {
      const next = [...prev];
      const temp = next[index - 1];
      next[index - 1] = next[index];
      next[index] = temp;
      return next.map((it, idx) => ({ ...it, display_order: idx }));
    });
    showNotification('Order updated');
  };

  // Move Down
  const handleMoveDown = (index: number) => {
    if (index === items.length - 1) return;
    setItems((prev) => {
      const next = [...prev];
      const temp = next[index + 1];
      next[index + 1] = next[index];
      next[index] = temp;
      return next.map((it, idx) => ({ ...it, display_order: idx }));
    });
    showNotification('Order updated');
  };

  // Delete
  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    try {
      if (isSupabaseConfigured && supabase && isValidUuid(itemToDelete.id)) {
        const { error } = await supabase.from('gallery_items').delete().eq('id', itemToDelete.id);
        if (error) {
          showNotification(`Database delete error: ${error.message}`);
          return;
        }
      }
      setItems((prev) => prev.filter((i) => i.id !== itemToDelete.id));
      setItemToDelete(null);
      showNotification('Photo removed from gallery');
    } catch (err: unknown) {
      showNotification(`Delete failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  // Save Inline Edit
  const handleSaveInlineEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    setItems((prev) =>
      prev.map((it) => (it.id === editingItem.id ? editingItem : it))
    );

    if (isSupabaseConfigured && supabase && isValidUuid(editingItem.id)) {
      const { error } = await supabase
        .from('gallery_items')
        .update({
          caption_en: editingItem.caption_en,
          caption_mr: editingItem.caption_mr,
          alt_text_en: editingItem.alt_text_en,
          alt_text_mr: editingItem.alt_text_mr,
          category: editingItem.category,
        })
        .eq('id', editingItem.id);
      if (error) {
        showNotification(`Database update error: ${error.message}`);
        return;
      }
    }

    setEditingItem(null);
    showNotification('Photo details updated');
  };

  // Add New Photo
  const handleAddPhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newImageUrl) {
      alert('Please upload or specify an image URL');
      return;
    }

    const newId = crypto.randomUUID();
    const newItem: GalleryItem = {
      id: newId,
      image_url: newImageUrl,
      thumbnail_url: null,
      caption_en: newCaptionEn.trim() || null,
      caption_mr: newCaptionMr.trim() || null,
      alt_text_en: newAltTextEn.trim() || 'Photo of Hon. Bala Bhegade',
      alt_text_mr: newAltTextMr.trim() || 'मा. बाळा भेगडे यांचे छायाचित्र',
      category: newCategory,
      display_order: items.length,
      is_featured: newIsFeatured,
      is_visible: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('gallery_items').insert({
        id: newId,
        image_url: newItem.image_url,
        thumbnail_url: newItem.thumbnail_url,
        caption_en: newItem.caption_en,
        caption_mr: newItem.caption_mr,
        alt_text_en: newItem.alt_text_en,
        alt_text_mr: newItem.alt_text_mr,
        category: newItem.category,
        display_order: newItem.display_order,
        is_featured: newItem.is_featured,
        is_visible: newItem.is_visible,
      }).select().single();

      if (error) {
        console.error('Error saving gallery item to Supabase:', error);
        showNotification(`Database save error: ${error.message}`);
        return;
      } else if (data) {
        newItem.id = data.id;
      }
    }

    setItems((prev) => [newItem, ...prev]);
    setShowUploadModal(false);
    setNewImageUrl('');
    setNewCaptionEn('');
    setNewCaptionMr('');
    setNewAltTextEn('');
    setNewAltTextMr('');
    setNewCategory('events');
    setNewIsFeatured(false);
    showNotification('Photo added to gallery successfully');
  };

  const filteredItems = items.filter((item) => {
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      <Helmet>
        <title>Manage Gallery | Admin Bala Bhegade</title>
      </Helmet>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-charcoal-200 pb-5">
        <div>
          <h1 className="text-2xl font-heading font-semibold text-charcoal-900 flex items-center gap-2.5">
            <GalleryIcon className="w-6 h-6 text-saffron-600" />
            Photo Gallery Manager
          </h1>
          <p className="text-sm text-charcoal-500 mt-1">
            Organize photo albums, toggle featured pictures for the homepage carousel, and edit captions.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowUploadModal(true)}
          className="btn-primary self-start sm:self-auto flex items-center gap-2 shadow-sm"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Photos</span>
        </button>
      </div>

      {/* Toast */}
      {toastMessage && (
        <div className="p-3.5 rounded-lg bg-emerald-800 text-white text-xs sm:text-sm font-medium flex items-center gap-2 animate-fade-in shadow-md">
          <Check className="w-4 h-4 text-emerald-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Controls Bar: Categories & Counts */}
      <div className="admin-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs font-semibold text-charcoal-500 flex items-center gap-1 pl-1">
            <Filter className="w-3.5 h-3.5" />
            Category:
          </span>
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              selectedCategory === 'all'
                ? 'bg-saffron-500 text-white shadow-xs'
                : 'bg-charcoal-100 text-charcoal-700 hover:bg-charcoal-200'
            }`}
          >
            All Photos ({items.length})
          </button>
          {categories.map((cat) => {
            const count = items.filter((i) => i.category === cat).length;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap capitalize transition-colors ${
                  selectedCategory === cat
                    ? 'bg-saffron-500 text-white shadow-xs'
                    : 'bg-charcoal-100 text-charcoal-700 hover:bg-charcoal-200'
                }`}
              >
                {cat.replace('-', ' ')} ({count})
              </button>
            );
          })}
        </div>

        <div className="text-xs text-charcoal-500 whitespace-nowrap">
          {items.filter((i) => i.is_featured).length} Featured on Homepage
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item, index) => (
          <div
            key={item.id}
            className={`admin-card overflow-hidden flex flex-col justify-between group border transition-all ${
              !item.is_visible ? 'opacity-60 bg-charcoal-50' : 'bg-white'
            }`}
          >
            {/* Image Preview & Badges */}
            <div className="relative aspect-[4/3] bg-charcoal-100 overflow-hidden">
              <img
                src={item.image_url}
                alt={item.alt_text_en}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center -z-10 text-charcoal-300">
                <GalleryIcon className="w-10 h-10" />
              </div>

              {/* Status Badges Overlay */}
              <div className="absolute top-2 left-2 flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-charcoal-900/80 text-white backdrop-blur-sm capitalize">
                  {item.category.replace('-', ' ')}
                </span>
                {item.is_featured && (
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-saffron-500 text-white flex items-center gap-1 shadow">
                    <Star className="w-3 h-3 fill-current" />
                    Featured
                  </span>
                )}
              </div>

              {/* Order Controls & Quick Toggles */}
              <div className="absolute top-2 right-2 flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-lg p-1 shadow-sm border border-charcoal-200">
                <button
                  type="button"
                  disabled={index === 0}
                  onClick={() => handleMoveUp(index)}
                  className="p-1 text-charcoal-600 hover:text-charcoal-950 disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Move earlier"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  disabled={index === items.length - 1}
                  onClick={() => handleMoveDown(index)}
                  className="p-1 text-charcoal-600 hover:text-charcoal-950 disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Move later"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Captions & Info */}
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div className="space-y-1.5">
                <p className="text-sm font-medium text-charcoal-900 line-clamp-2">
                  {item.caption_en || <span className="text-charcoal-400 italic">No English caption</span>}
                </p>
                <p className="text-xs text-charcoal-500 font-marathi line-clamp-2">
                  {item.caption_mr || <span className="text-charcoal-400 italic">मराठी कॅप्शन नाही</span>}
                </p>
              </div>

              {/* Card Footer Actions */}
              <div className="mt-4 pt-3 border-t border-charcoal-100 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {/* Featured Toggle */}
                  <button
                    type="button"
                    onClick={() => handleToggleFeatured(item.id)}
                    className={`p-1.5 rounded transition-colors ${
                      item.is_featured
                        ? 'text-saffron-600 bg-saffron-50 hover:bg-saffron-100'
                        : 'text-charcoal-400 hover:text-saffron-600 hover:bg-charcoal-100'
                    }`}
                    title={item.is_featured ? 'Remove from featured' : 'Mark as featured'}
                  >
                    {item.is_featured ? (
                      <Star className="w-4 h-4 fill-current" />
                    ) : (
                      <StarOff className="w-4 h-4" />
                    )}
                  </button>

                  {/* Visibility Toggle */}
                  <button
                    type="button"
                    onClick={() => handleToggleVisibility(item.id)}
                    className={`p-1.5 rounded transition-colors ${
                      item.is_visible
                        ? 'text-saffron-700 bg-saffron-50 hover:bg-saffron-100'
                        : 'text-charcoal-400 hover:text-charcoal-700 hover:bg-charcoal-100'
                    }`}
                    title={item.is_visible ? 'Visible on site' : 'Hidden from site'}
                  >
                    {item.is_visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>

                  {/* Edit Captions */}
                  <button
                    type="button"
                    onClick={() => setEditingItem({ ...item })}
                    className="p-1.5 rounded text-charcoal-500 hover:text-saffron-600 hover:bg-charcoal-100 transition-colors"
                    title="Edit captions"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                </div>

                {/* Delete */}
                <button
                  type="button"
                  onClick={() => setItemToDelete(item)}
                  className="p-1.5 rounded text-charcoal-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                  title="Delete image"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Item Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-charcoal-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="admin-card max-w-lg w-full p-6 shadow-2xl relative animate-scale-up">
            <button
              type="button"
              onClick={() => setEditingItem(null)}
              className="absolute top-4 right-4 text-charcoal-400 hover:text-charcoal-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-semibold text-charcoal-900 mb-4 flex items-center gap-2">
              <Edit className="w-5 h-5 text-saffron-600" />
              Edit Photo Details
            </h3>

            <form onSubmit={handleSaveInlineEdit} className="space-y-4">
              <div>
                <label className="admin-label">Caption (English)</label>
                <input
                  type="text"
                  value={editingItem.caption_en || ''}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, caption_en: e.target.value })
                  }
                  className="admin-input"
                />
              </div>

              <div>
                <label className="admin-label">Caption (Marathi)</label>
                <input
                  type="text"
                  value={editingItem.caption_mr || ''}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, caption_mr: e.target.value })
                  }
                  className="admin-input font-marathi"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="admin-label text-xs">Category</label>
                  <select
                    value={editingItem.category}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, category: e.target.value })
                    }
                    className="admin-input text-xs capitalize"
                  >
                    <option value="events">Events</option>
                    <option value="public-work">Public Work</option>
                    <option value="community">Community</option>
                    <option value="speeches">Speeches</option>
                  </select>
                </div>

                <div>
                  <label className="admin-label text-xs">Featured</label>
                  <div className="pt-2">
                    <label className="inline-flex items-center gap-2 text-xs cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editingItem.is_featured}
                        onChange={(e) =>
                          setEditingItem({ ...editingItem, is_featured: e.target.checked })
                        }
                        className="rounded text-saffron-600 focus:ring-saffron-500"
                      />
                      <span>Show in Hero Carousel</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-charcoal-100">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary text-xs flex items-center gap-1.5">
                  <Save className="w-3.5 h-3.5" />
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Upload Photos Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-charcoal-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="admin-card max-w-lg w-full p-6 shadow-2xl relative animate-scale-up">
            <button
              type="button"
              onClick={() => setShowUploadModal(false)}
              className="absolute top-4 right-4 text-charcoal-400 hover:text-charcoal-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-semibold text-charcoal-900 mb-1 flex items-center gap-2">
              <Upload className="w-5 h-5 text-saffron-600" />
              Upload Photos to Gallery
            </h3>
            <p className="text-xs text-charcoal-500 mb-4">
              Add photographs to the official archive and showcase.
            </p>

            <form onSubmit={handleAddPhoto} className="space-y-4">
              <ImageUpload
                multiple={true}
                value={newImageUrl}
                onChange={(url) => setNewImageUrl(url)}
                label="Photograph File"
                helperText="Multi-file uploads are supported in Supabase Storage. Selected image will be added."
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="admin-label text-xs">Caption (English)</label>
                  <input
                    type="text"
                    value={newCaptionEn}
                    onChange={(e) => setNewCaptionEn(e.target.value)}
                    placeholder="Event or rally name"
                    className="admin-input text-xs"
                  />
                </div>
                <div>
                  <label className="admin-label text-xs">Caption (Marathi)</label>
                  <input
                    type="text"
                    value={newCaptionMr}
                    onChange={(e) => setNewCaptionMr(e.target.value)}
                    placeholder="कार्यक्रमाचे नाव"
                    className="admin-input text-xs font-marathi"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="admin-label text-xs">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="admin-input text-xs capitalize"
                  >
                    <option value="events">Events</option>
                    <option value="public-work">Public Work</option>
                    <option value="community">Community</option>
                    <option value="speeches">Speeches</option>
                  </select>
                </div>

                <div>
                  <label className="admin-label text-xs">Featured</label>
                  <div className="pt-2">
                    <label className="inline-flex items-center gap-2 text-xs cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newIsFeatured}
                        onChange={(e) => setNewIsFeatured(e.target.checked)}
                        className="rounded text-saffron-600 focus:ring-saffron-500"
                      />
                      <span>Pin to homepage</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-charcoal-100">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newImageUrl}
                  className="btn-primary text-xs flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Photo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(itemToDelete)}
        title="Delete Photo"
        message="Are you sure you want to remove this photograph from the gallery? This action cannot be reversed."
        confirmText="Remove Photo"
        cancelText="Cancel"
        isDestructive={true}
        onConfirm={handleDeleteConfirm}
        onClose={() => setItemToDelete(null)}
      />
    </div>
  );
};

export default AdminGallery;

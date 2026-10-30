import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Plus,
  Calendar,
  MapPin,
  Clock,
  Star,
  Trash2,
  Edit,
  Save,
  X,
  AlertCircle,
  Check,
  CheckCircle2,
  CalendarDays,
  Sparkles,
} from 'lucide-react';
import { mockEvents } from '@/lib/mock-data';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import { isValidUuid, getEvents } from '@/lib/api';
import type { EventItem } from '@/types/database';
import ImageUpload from '@/components/ui/ImageUpload';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { translateText } from '@/lib/translation';

export const AdminEvents: React.FC = () => {
  const { language } = useLanguage();
  const [events, setEvents] = useState<EventItem[]>(mockEvents);

  useEffect(() => {
    getEvents().then((data) => {
      if (data && data.length > 0) {
        setEvents(data);
      }
    });
  }, []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [eventToDelete, setEventToDelete] = useState<EventItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form Fields
  const [titleEn, setTitleEn] = useState('');
  const [titleMr, setTitleMr] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [descriptionMr, setDescriptionMr] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [locationEn, setLocationEn] = useState('');
  const [locationMr, setLocationMr] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isAutoTranslating, setIsAutoTranslating] = useState(false);

  const handleAutoTranslate = async () => {
    if (!titleEn.trim() && !descriptionEn.trim() && !locationEn.trim()) {
      showNotification('Please enter English title, description, or location first');
      return;
    }
    setIsAutoTranslating(true);
    try {
      const [tTitle, tDesc, tLoc] = await Promise.all([
        titleEn.trim() ? translateText(titleEn.trim(), 'mr') : Promise.resolve(''),
        descriptionEn.trim() ? translateText(descriptionEn.trim(), 'mr') : Promise.resolve(''),
        locationEn.trim() ? translateText(locationEn.trim(), 'mr') : Promise.resolve(''),
      ]);
      if (tTitle) setTitleMr(tTitle);
      if (tDesc) setDescriptionMr(tDesc);
      if (tLoc) setLocationMr(tLoc);
      showNotification('Translated event fields to Marathi');
    } catch {
      showNotification('Translation failed. Please check connection');
    } finally {
      setIsAutoTranslating(false);
    }
  };

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const getComputedStatus = (dateStr: string): 'upcoming' | 'past' => {
    if (!dateStr) return 'upcoming';
    const today = new Date().toISOString().slice(0, 10);
    return dateStr < today ? 'past' : 'upcoming';
  };

  const openAddModal = () => {
    setEditingEvent(null);
    setTitleEn('');
    setTitleMr('');
    setDescriptionEn('');
    setDescriptionMr('');
    setEventDate(new Date().toISOString().slice(0, 10));
    setEventTime('10:00');
    setLocationEn('');
    setLocationMr('');
    setImageUrl('');
    setIsFeatured(false);
    setIsModalOpen(true);
  };

  const openEditModal = (event: EventItem) => {
    setEditingEvent(event);
    setTitleEn(event.title_en);
    setTitleMr(event.title_mr);
    setDescriptionEn(event.description_en || '');
    setDescriptionMr(event.description_mr || '');
    setEventDate(event.event_date);
    setEventTime(event.event_time || '');
    setLocationEn(event.location_en || '');
    setLocationMr(event.location_mr || '');
    setImageUrl(event.image_url || '');
    setIsFeatured(event.is_featured);
    setIsModalOpen(true);
  };

  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleEn.trim() || !eventDate) {
      alert('Please fill in required fields (Title EN and Date)');
      return;
    }

    let finalTitleMr = titleMr.trim();
    let finalDescMr = descriptionMr.trim();
    let finalLocMr = locationMr.trim();

    if (!finalTitleMr && titleEn.trim()) {
      try {
        finalTitleMr = await translateText(titleEn.trim(), 'mr');
        setTitleMr(finalTitleMr);
      } catch {
        finalTitleMr = titleEn.trim();
      }
    }

    if (!finalDescMr && descriptionEn.trim()) {
      try {
        finalDescMr = await translateText(descriptionEn.trim(), 'mr');
        setDescriptionMr(finalDescMr);
      } catch {
        finalDescMr = descriptionEn.trim();
      }
    }

    if (!finalLocMr && locationEn.trim()) {
      try {
        finalLocMr = await translateText(locationEn.trim(), 'mr');
        setLocationMr(finalLocMr);
      } catch {
        finalLocMr = locationEn.trim();
      }
    }

    const computedStatus = getComputedStatus(eventDate);

    if (editingEvent) {
      // Update existing
      const updated: EventItem = {
        ...editingEvent,
        title_en: titleEn.trim(),
        title_mr: finalTitleMr || titleEn.trim(),
        description_en: descriptionEn.trim() || null,
        description_mr: finalDescMr || null,
        event_date: eventDate,
        event_time: eventTime.trim() || null,
        location_en: locationEn.trim() || null,
        location_mr: finalLocMr || null,
        image_url: imageUrl.trim() || null,
        is_featured: isFeatured,
        status: computedStatus,
        updated_at: new Date().toISOString(),
      };

      if (isSupabaseConfigured && supabase && isValidUuid(editingEvent.id)) {
        const { error } = await supabase.from('events').update(updated).eq('id', editingEvent.id);
        if (error) {
          showNotification(`Database update error: ${error.message}`);
          return;
        }
      }

      setEvents((prev) => prev.map((ev) => (ev.id === editingEvent.id ? updated : ev)));
      showNotification('Event schedule updated');
    } else {
      // Create new
      const newId = crypto.randomUUID();
      const newEvent: EventItem = {
        id: newId,
        title_en: titleEn.trim(),
        title_mr: titleMr.trim(),
        description_en: descriptionEn.trim() || null,
        description_mr: descriptionMr.trim() || null,
        event_date: eventDate,
        event_time: eventTime.trim() || null,
        location_en: locationEn.trim() || null,
        location_mr: locationMr.trim() || null,
        image_url: imageUrl.trim() || null,
        is_featured: isFeatured,
        status: computedStatus,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase.from('events').insert({
          id: newId,
          title_en: newEvent.title_en,
          title_mr: newEvent.title_mr,
          description_en: newEvent.description_en,
          description_mr: newEvent.description_mr,
          event_date: newEvent.event_date,
          event_time: newEvent.event_time,
          location_en: newEvent.location_en,
          location_mr: newEvent.location_mr,
          image_url: newEvent.image_url,
          is_featured: newEvent.is_featured,
          status: newEvent.status,
        }).select().single();

        if (error) {
          console.error('Error saving event to Supabase:', error);
          showNotification(`Database save error: ${error.message}`);
          return;
        } else if (data) {
          newEvent.id = data.id;
        }
      }

      setEvents((prev) => [newEvent, ...prev]);
      showNotification('New public event added');
    }

    setIsModalOpen(false);
  };

  const handleDeleteConfirm = async () => {
    if (!eventToDelete) return;
    try {
      if (isSupabaseConfigured && supabase && isValidUuid(eventToDelete.id)) {
        const { error } = await supabase.from('events').delete().eq('id', eventToDelete.id);
        if (error) {
          showNotification(`Database delete error: ${error.message}`);
          return;
        }
      }
      setEvents((prev) => prev.filter((ev) => ev.id !== eventToDelete.id));
      setEventToDelete(null);
      showNotification('Event removed');
    } catch (err: unknown) {
      showNotification(`Delete failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  // Sort events with upcoming first
  const sortedEvents = [...events].sort((a, b) => {
    const aStatus = getComputedStatus(a.event_date);
    const bStatus = getComputedStatus(b.event_date);
    if (aStatus !== bStatus) {
      return aStatus === 'upcoming' ? -1 : 1;
    }
    return new Date(b.event_date).getTime() - new Date(a.event_date).getTime();
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      <Helmet>
        <title>Manage Events | Admin Bala Bhegade</title>
      </Helmet>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-charcoal-200 pb-5">
        <div>
          <h1 className="text-2xl font-heading font-semibold text-charcoal-900 flex items-center gap-2.5">
            <CalendarDays className="w-6 h-6 text-saffron-600" />
            Public Events & Engagements
          </h1>
          <p className="text-sm text-charcoal-500 mt-1">
            Schedule public rallies, citizen meetings, inaugurated projects, and community gatherings.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="btn-primary self-start sm:self-auto flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Event</span>
        </button>
      </div>

      {/* Toast */}
      {toastMessage && (
        <div className="p-3.5 rounded-lg bg-emerald-800 text-white text-xs sm:text-sm font-medium flex items-center gap-2 animate-fade-in shadow-md">
          <Check className="w-4 h-4 text-emerald-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Event List */}
      <div className="space-y-4">
        {sortedEvents.length === 0 ? (
          <div className="admin-card py-16 text-center">
            <Calendar className="w-12 h-12 text-charcoal-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-charcoal-800">No events scheduled</h3>
            <p className="text-xs text-charcoal-500 mt-1">
              Add your upcoming rallies and public meetings to display them on the calendar.
            </p>
            <button
              type="button"
              onClick={openAddModal}
              className="mt-4 btn-primary text-xs py-2 px-4"
            >
              Add First Event
            </button>
          </div>
        ) : (
          sortedEvents.map((event) => {
            const computedStatus = getComputedStatus(event.event_date);
            const isUpcoming = computedStatus === 'upcoming';

            return (
              <div
                key={event.id}
                className="admin-card p-5 hover:shadow-md transition-shadow flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                {/* Left: Thumbnail & Details */}
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  {event.image_url ? (
                    <img
                      src={event.image_url}
                      alt=""
                      className="w-16 h-16 rounded-lg object-cover bg-charcoal-100 flex-shrink-0 border border-charcoal-200"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-saffron-50 text-saffron-600 flex items-center justify-center flex-shrink-0 border border-saffron-200">
                      <Calendar className="w-7 h-7" />
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          isUpcoming
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-charcoal-100 text-charcoal-600 border border-charcoal-200'
                        }`}
                      >
                        {isUpcoming ? 'Upcoming' : 'Past Event'}
                      </span>
                      {event.is_featured && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-saffron-50 text-saffron-800 border border-saffron-200">
                          <Star className="w-3 h-3 fill-current text-saffron-500" />
                          Featured
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-semibold text-charcoal-900 truncate">
                      {language === 'mr' ? event.title_mr : event.title_en}
                    </h3>
                    <p className="text-xs text-charcoal-500 font-marathi truncate">
                      {language === 'mr' ? event.title_en : event.title_mr}
                    </p>

                    <div className="mt-2 flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-charcoal-600">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-saffron-600" />
                        {event.event_date}
                      </span>
                      {event.event_time && (
                        <span className="inline-flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-saffron-600" />
                          {event.event_time}
                        </span>
                      )}
                      {(event.location_en || event.location_mr) && (
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-saffron-600" />
                          {language === 'mr'
                            ? event.location_mr || event.location_en
                            : event.location_en || event.location_mr}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 self-end md:self-center flex-shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-charcoal-100 w-full md:w-auto justify-end">
                  <button
                    type="button"
                    onClick={() => openEditModal(event)}
                    className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => setEventToDelete(event)}
                    className="p-2 rounded-lg text-charcoal-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Delete event"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add / Edit Event Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-charcoal-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="admin-card max-w-2xl w-full p-6 shadow-2xl relative my-8 animate-scale-up">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-charcoal-400 hover:text-charcoal-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <div>
                <h3 className="text-xl font-heading font-semibold text-charcoal-900 mb-1 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-saffron-600" />
                  {editingEvent ? 'Edit Public Event' : 'Add Public Event'}
                </h3>
                <p className="text-xs text-charcoal-500">
                  Enter English details — Marathi can be auto-translated or customized manually.
                </p>
              </div>

              <button
                type="button"
                onClick={handleAutoTranslate}
                disabled={isAutoTranslating || !titleEn.trim()}
                className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5 text-saffron-700 border-saffron-300 hover:bg-saffron-50"
                title="Auto-translate English title, description, and location to Marathi"
              >
                {isAutoTranslating ? (
                  <span className="w-3.5 h-3.5 border-2 border-saffron-600 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5 text-saffron-600" />
                )}
                <span>{isAutoTranslating ? 'Translating...' : 'Auto-Translate to Marathi'}</span>
              </button>
            </div>

            <form onSubmit={handleSaveEvent} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="admin-label">
                    Title (English) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={titleEn}
                    onChange={(e) => setTitleEn(e.target.value)}
                    placeholder="e.g. Talegaon Water Project Rally"
                    className="admin-input"
                  />
                </div>
                <div>
                  <label className="admin-label flex items-center justify-between">
                    <span>Title (Marathi)</span>
                    <span className="text-[11px] text-saffron-700 font-normal">Optional (Auto-translates)</span>
                  </label>
                  <input
                    type="text"
                    value={titleMr}
                    onChange={(e) => setTitleMr(e.target.value)}
                    placeholder="उदा. तळेगाव पाणी योजना मेळावा"
                    className="admin-input font-marathi"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="admin-label">
                    Event Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="admin-input"
                  />
                </div>
                <div>
                  <label className="admin-label">Event Time</label>
                  <input
                    type="time"
                    value={eventTime}
                    onChange={(e) => setEventTime(e.target.value)}
                    className="admin-input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="admin-label">Location / Venue (English)</label>
                  <input
                    type="text"
                    value={locationEn}
                    onChange={(e) => setLocationEn(e.target.value)}
                    placeholder="e.g. Somatane Phata Ground"
                    className="admin-input"
                  />
                </div>
                <div>
                  <label className="admin-label">Location / Venue (Marathi)</label>
                  <input
                    type="text"
                    value={locationMr}
                    onChange={(e) => setLocationMr(e.target.value)}
                    placeholder="उदा. सोमाटणे फाटा मैदान"
                    className="admin-input font-marathi"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="admin-label">Description (English)</label>
                  <textarea
                    rows={3}
                    value={descriptionEn}
                    onChange={(e) => setDescriptionEn(e.target.value)}
                    placeholder="Event objectives and schedule details..."
                    className="admin-input"
                  />
                </div>
                <div>
                  <label className="admin-label">Description (Marathi)</label>
                  <textarea
                    rows={3}
                    value={descriptionMr}
                    onChange={(e) => setDescriptionMr(e.target.value)}
                    placeholder="कार्यक्रमाची उद्दिष्टे व तपशील..."
                    className="admin-input font-marathi"
                  />
                </div>
              </div>

              {/* Event Image */}
              <ImageUpload
                label="Event Banner / Poster Image"
                value={imageUrl}
                onChange={(url) => setImageUrl(url)}
                description="Upload event banner or location photo"
              />

              {/* Featured checkbox */}
              <div className="pt-2">
                <label className="inline-flex items-center gap-2.5 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="rounded text-saffron-600 focus:ring-saffron-500"
                  />
                  <span className="font-medium text-charcoal-800">
                    Feature prominently on the Homepage and Events banner
                  </span>
                </label>
              </div>

              {/* Modal Buttons */}
              <div className="pt-5 flex justify-end gap-3 border-t border-charcoal-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn-secondary text-sm"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary text-sm flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  <span>{editingEvent ? 'Save Changes' : 'Create Event'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(eventToDelete)}
        title="Delete Event"
        message={`Are you sure you want to delete the event "${
          eventToDelete?.title_en
        }"? This cannot be undone.`}
        confirmText="Delete Event"
        cancelText="Cancel"
        isDestructive={true}
        onConfirm={handleDeleteConfirm}
        onClose={() => setEventToDelete(null)}
      />
    </div>
  );
};

export default AdminEvents;

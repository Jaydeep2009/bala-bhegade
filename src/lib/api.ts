/**
 * Data API layer - abstracts data fetching between Supabase and initial data.
 * When Supabase is configured and has data, fetches live from the database.
 * Falls back gracefully to initial mock data if tables are empty or loading fails.
 */

import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import {
  mockHomepageSections,
  mockNewsArticles,
  mockGalleryItems,
  mockEvents,
  mockSocialPosts,
  mockSiteSettings,
} from '@/lib/mock-data';
import type {
  HomepageSection,
  NewsArticle,
  GalleryItem,
  EventItem,
  SocialPost,
} from '@/types/database';

export function isValidUuid(id?: string | null): boolean {
  if (!id) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
}

// ============================================================
// Homepage Sections
// ============================================================

export async function getHomepageSections(): Promise<HomepageSection[]> {
  if (!isSupabaseConfigured || !supabase) {
    return mockHomepageSections.filter((s) => s.is_visible).sort((a, b) => a.display_order - b.display_order);
  }

  try {
    const { data, error } = await supabase
      .from('homepage_sections')
      .select('*')
      .eq('is_visible', true)
      .order('display_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return mockHomepageSections.filter((s) => s.is_visible).sort((a, b) => a.display_order - b.display_order);
    }

    return data as HomepageSection[];
  } catch (err) {
    console.error('Error fetching homepage sections:', err);
    return mockHomepageSections.filter((s) => s.is_visible).sort((a, b) => a.display_order - b.display_order);
  }
}

export async function getAllHomepageSections(): Promise<HomepageSection[]> {
  if (!isSupabaseConfigured || !supabase) {
    return mockHomepageSections.sort((a, b) => a.display_order - b.display_order);
  }

  try {
    const { data, error } = await supabase
      .from('homepage_sections')
      .select('*')
      .order('display_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return mockHomepageSections.sort((a, b) => a.display_order - b.display_order);
    }

    return data as HomepageSection[];
  } catch (err) {
    console.error('Error fetching all homepage sections:', err);
    return mockHomepageSections;
  }
}

export async function updateHomepageSection(
  id: string,
  updates: Partial<HomepageSection>
): Promise<{ error: string | null }> {
  if (!isSupabaseConfigured || !supabase) {
    console.warn('[Dev Mode] Homepage section update not persisted:', id, updates);
    return { error: null };
  }

  const { error } = await supabase
    .from('homepage_sections')
    .update(updates)
    .eq('id', id);

  return { error: error?.message ?? null };
}

// ============================================================
// News Articles
// ============================================================

export async function getPublishedNews(): Promise<NewsArticle[]> {
  if (!isSupabaseConfigured || !supabase) {
    return mockNewsArticles.filter((a) => a.status === 'published');
  }

  try {
    const { data, error } = await supabase
      .from('news_articles')
      .select('*')
      .eq('status', 'published')
      .order('published_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return mockNewsArticles.filter((a) => a.status === 'published');
    }

    return data as NewsArticle[];
  } catch (err) {
    console.error('Error fetching news:', err);
    return mockNewsArticles.filter((a) => a.status === 'published');
  }
}

export async function getAllNews(): Promise<NewsArticle[]> {
  if (!isSupabaseConfigured || !supabase) {
    return mockNewsArticles;
  }

  try {
    const { data, error } = await supabase
      .from('news_articles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return mockNewsArticles;
    }

    return data as NewsArticle[];
  } catch (err) {
    console.error('Error fetching all news:', err);
    return mockNewsArticles;
  }
}

export async function getNewsBySlug(slug: string): Promise<NewsArticle | null> {
  if (!isSupabaseConfigured || !supabase) {
    return mockNewsArticles.find((a) => a.slug === slug) || null;
  }

  try {
    const { data, error } = await supabase
      .from('news_articles')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error || !data) {
      return mockNewsArticles.find((a) => a.slug === slug) || null;
    }

    return data as NewsArticle;
  } catch {
    return mockNewsArticles.find((a) => a.slug === slug) || null;
  }
}

export async function getNewsById(id: string): Promise<NewsArticle | null> {
  if (!isSupabaseConfigured || !supabase) {
    return mockNewsArticles.find((a) => a.id === id) || null;
  }

  try {
    const { data, error } = await supabase
      .from('news_articles')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return mockNewsArticles.find((a) => a.id === id) || null;
    }

    return data as NewsArticle;
  } catch {
    return mockNewsArticles.find((a) => a.id === id) || null;
  }
}

export async function createNewsArticle(
  article: Omit<NewsArticle, 'id' | 'created_at' | 'updated_at'>
): Promise<{ data: NewsArticle | null; error: string | null }> {
  if (!isSupabaseConfigured || !supabase) {
    const mock: NewsArticle = {
      ...article,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    return { data: mock, error: null };
  }

  const { data, error } = await supabase
    .from('news_articles')
    .insert(article)
    .select()
    .single();

  return { data: data as NewsArticle | null, error: error?.message ?? null };
}

export async function updateNewsArticle(
  id: string,
  updates: Partial<NewsArticle>
): Promise<{ error: string | null }> {
  if (!isSupabaseConfigured || !supabase) {
    return { error: null };
  }

  const { error } = await supabase
    .from('news_articles')
    .update(updates)
    .eq('id', id);

  return { error: error?.message ?? null };
}

export async function deleteNewsArticle(id: string): Promise<{ error: string | null }> {
  if (!isSupabaseConfigured || !supabase) {
    return { error: null };
  }

  const { error } = await supabase.from('news_articles').delete().eq('id', id);

  return { error: error?.message ?? null };
}

// ============================================================
// Gallery Items
// ============================================================

export async function getVisibleGalleryItems(): Promise<GalleryItem[]> {
  if (!isSupabaseConfigured || !supabase) {
    return mockGalleryItems.filter((g) => g.is_visible);
  }

  try {
    const { data, error } = await supabase
      .from('gallery_items')
      .select('*')
      .eq('is_visible', true)
      .order('display_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return mockGalleryItems.filter((g) => g.is_visible);
    }

    return data as GalleryItem[];
  } catch (err) {
    console.error('Error fetching gallery:', err);
    return mockGalleryItems.filter((g) => g.is_visible);
  }
}

export async function getAllGalleryItems(): Promise<GalleryItem[]> {
  if (!isSupabaseConfigured || !supabase) {
    return mockGalleryItems;
  }

  try {
    const { data, error } = await supabase
      .from('gallery_items')
      .select('*')
      .order('display_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return mockGalleryItems;
    }

    return data as GalleryItem[];
  } catch (err) {
    console.error('Error fetching all gallery items:', err);
    return mockGalleryItems;
  }
}

export async function createGalleryItem(
  item: Omit<GalleryItem, 'id' | 'created_at' | 'updated_at'>
): Promise<{ data: GalleryItem | null; error: string | null }> {
  if (!isSupabaseConfigured || !supabase) {
    const mock: GalleryItem = {
      ...item,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    return { data: mock, error: null };
  }

  const { data, error } = await supabase
    .from('gallery_items')
    .insert(item)
    .select()
    .single();

  return { data: data as GalleryItem | null, error: error?.message ?? null };
}

export async function updateGalleryItem(
  id: string,
  updates: Partial<GalleryItem>
): Promise<{ error: string | null }> {
  if (!isSupabaseConfigured || !supabase) {
    return { error: null };
  }

  const { error } = await supabase
    .from('gallery_items')
    .update(updates)
    .eq('id', id);

  return { error: error?.message ?? null };
}

export async function deleteGalleryItem(id: string): Promise<{ error: string | null }> {
  if (!isSupabaseConfigured || !supabase) {
    return { error: null };
  }

  const { error } = await supabase.from('gallery_items').delete().eq('id', id);

  return { error: error?.message ?? null };
}

// ============================================================
// Events
// ============================================================

export async function getEvents(): Promise<EventItem[]> {
  if (!isSupabaseConfigured || !supabase) {
    return mockEvents;
  }

  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('event_date', { ascending: false });

    if (error || !data || data.length === 0) {
      return mockEvents;
    }

    return data as EventItem[];
  } catch (err) {
    console.error('Error fetching events:', err);
    return mockEvents;
  }
}

export async function createEvent(
  event: Omit<EventItem, 'id' | 'created_at' | 'updated_at'>
): Promise<{ data: EventItem | null; error: string | null }> {
  if (!isSupabaseConfigured || !supabase) {
    const mock: EventItem = {
      ...event,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    return { data: mock, error: null };
  }

  const { data, error } = await supabase
    .from('events')
    .insert(event)
    .select()
    .single();

  return { data: data as EventItem | null, error: error?.message ?? null };
}

export async function updateEvent(
  id: string,
  updates: Partial<EventItem>
): Promise<{ error: string | null }> {
  if (!isSupabaseConfigured || !supabase) {
    return { error: null };
  }

  const { error } = await supabase
    .from('events')
    .update(updates)
    .eq('id', id);

  return { error: error?.message ?? null };
}

export async function deleteEvent(id: string): Promise<{ error: string | null }> {
  if (!isSupabaseConfigured || !supabase) {
    return { error: null };
  }

  const { error } = await supabase.from('events').delete().eq('id', id);

  return { error: error?.message ?? null };
}

// ============================================================
// Social Posts
// ============================================================

export async function getFeaturedSocialPosts(): Promise<SocialPost[]> {
  if (!isSupabaseConfigured || !supabase) {
    return mockSocialPosts.filter((p) => p.is_featured);
  }

  try {
    // 1. Fetch featured posts curated by admin
    const { data: featuredData, error: featuredError } = await supabase
      .from('social_posts')
      .select('*')
      .eq('is_featured', true)
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false })
      .limit(8);

    if (!featuredError && featuredData && featuredData.length > 0) {
      return featuredData as SocialPost[];
    }

    // 2. Fallback: if no posts are marked as featured, fetch latest posts automatically
    const { data: latestData, error: latestError } = await supabase
      .from('social_posts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(4);

    if (!latestError && latestData && latestData.length > 0) {
      return latestData as SocialPost[];
    }

    return mockSocialPosts.filter((p) => p.is_featured);
  } catch (err) {
    console.error('Error fetching social posts:', err);
    return mockSocialPosts.filter((p) => p.is_featured);
  }
}

export async function getAllSocialPosts(): Promise<SocialPost[]> {
  if (!isSupabaseConfigured || !supabase) {
    return mockSocialPosts;
  }

  try {
    const { data, error } = await supabase
      .from('social_posts')
      .select('*')
      .order('display_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return mockSocialPosts;
    }

    return data as SocialPost[];
  } catch (err) {
    console.error('Error fetching all social posts:', err);
    return mockSocialPosts;
  }
}

export async function createSocialPost(
  post: Omit<SocialPost, 'id' | 'created_at' | 'updated_at'>
): Promise<{ data: SocialPost | null; error: string | null }> {
  if (!isSupabaseConfigured || !supabase) {
    const mock: SocialPost = {
      ...post,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    return { data: mock, error: null };
  }

  const { data, error } = await supabase
    .from('social_posts')
    .insert(post)
    .select()
    .single();

  return { data: data as SocialPost | null, error: error?.message ?? null };
}

export async function updateSocialPost(
  id: string,
  updates: Partial<SocialPost>
): Promise<{ error: string | null }> {
  if (!isSupabaseConfigured || !supabase) {
    return { error: null };
  }

  const { error } = await supabase
    .from('social_posts')
    .update(updates)
    .eq('id', id);

  return { error: error?.message ?? null };
}

export async function deleteSocialPost(id: string): Promise<{ error: string | null }> {
  if (!isSupabaseConfigured || !supabase) {
    return { error: null };
  }

  const { error } = await supabase.from('social_posts').delete().eq('id', id);

  return { error: error?.message ?? null };
}

// ============================================================
// Site Settings
// ============================================================

export async function getSiteSettings(
  key: string,
  language: 'en' | 'mr' = 'en'
): Promise<Record<string, unknown> | null> {
  if (!isSupabaseConfigured || !supabase) {
    const settingsMap: Record<string, unknown> = mockSiteSettings;
    return (settingsMap[key] as Record<string, unknown>) || null;
  }

  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', key)
      .eq('language', language)
      .single();

    if (error || !data) {
      const settingsMap: Record<string, unknown> = mockSiteSettings;
      return (settingsMap[key] as Record<string, unknown>) || null;
    }

    return data.value as Record<string, unknown>;
  } catch {
    const settingsMap: Record<string, unknown> = mockSiteSettings;
    return (settingsMap[key] as Record<string, unknown>) || null;
  }
}

export async function updateSiteSettings(
  key: string,
  value: Record<string, unknown>,
  language: 'en' | 'mr' = 'en'
): Promise<{ error: string | null }> {
  if (!isSupabaseConfigured || !supabase) {
    return { error: null };
  }

  const { error } = await supabase
    .from('site_settings')
    .upsert({ key, value, language }, { onConflict: 'key,language' });

  return { error: error?.message ?? null };
}

export interface LeaderProfile {
  name_en: string;
  name_mr: string;
  title_en: string;
  title_mr: string;
  bio_en: string;
  bio_mr: string;
  profile_image: string;
}

export async function getLeaderProfile(): Promise<LeaderProfile> {
  const defaultProfile: LeaderProfile = {
    name_en: mockSiteSettings.profile.name_en,
    name_mr: mockSiteSettings.profile.name_mr,
    title_en: mockSiteSettings.profile.title_en,
    title_mr: mockSiteSettings.profile.title_mr,
    bio_en: mockSiteSettings.profile.bio_en,
    bio_mr: mockSiteSettings.profile.bio_mr,
    profile_image: mockSiteSettings.profile.profile_image || '/images/placeholder-profile.jpg',
  };

  if (!isSupabaseConfigured || !supabase) {
    return defaultProfile;
  }

  try {
    // 1. Fetch site_settings 'profile'
    const { data: settingsRow } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'profile')
      .eq('language', 'en')
      .maybeSingle();

    // 2. Fetch homepage_sections 'about_intro'
    const { data: aboutIntroRow } = await supabase
      .from('homepage_sections')
      .select('image_url, title_en, title_mr, content_en, content_mr')
      .eq('section_key', 'about_intro')
      .maybeSingle();

    const settingsVal = (settingsRow?.value as Record<string, string>) || {};

    // Collect candidate images
    const candidateImages = [
      settingsVal.profile_image,
      aboutIntroRow?.image_url,
    ].filter(Boolean) as string[];

    // Pick first non-empty, non-placeholder image
    const customImage = candidateImages.find(
      (img) => img && !img.includes('placeholder-profile')
    );

    const resolvedImage =
      customImage ||
      settingsVal.profile_image ||
      aboutIntroRow?.image_url ||
      defaultProfile.profile_image;

    const isPlaceholder = (str?: string) => !str || str.startsWith('[Placeholder') || str.startsWith('[प्लेसहोल्डर');

    return {
      name_en: !isPlaceholder(settingsVal.name_en) ? settingsVal.name_en : defaultProfile.name_en,
      name_mr: !isPlaceholder(settingsVal.name_mr) ? settingsVal.name_mr : defaultProfile.name_mr,
      title_en: !isPlaceholder(settingsVal.title_en) ? settingsVal.title_en : defaultProfile.title_en,
      title_mr: !isPlaceholder(settingsVal.title_mr) ? settingsVal.title_mr : defaultProfile.title_mr,
      bio_en: !isPlaceholder(settingsVal.bio_en)
        ? settingsVal.bio_en
        : (!isPlaceholder(aboutIntroRow?.content_en) ? aboutIntroRow?.content_en : defaultProfile.bio_en),
      bio_mr: !isPlaceholder(settingsVal.bio_mr)
        ? settingsVal.bio_mr
        : (!isPlaceholder(aboutIntroRow?.content_mr) ? aboutIntroRow?.content_mr : defaultProfile.bio_mr),
      profile_image: resolvedImage || '/images/placeholder-profile.jpg',
    };
  } catch (err) {
    console.error('Error fetching leader profile:', err);
    return defaultProfile;
  }
}

// ============================================================
// File Upload
// ============================================================

export async function uploadFile(
  file: File,
  path: string
): Promise<{ url: string | null; error: string | null }> {
  if (!isSupabaseConfigured || !supabase) {
    const mockUrl = URL.createObjectURL(file);
    return { url: mockUrl, error: null };
  }

  const fileExt = file.name.split('.').pop();
  const fileName = `${path}/${Date.now()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from('media')
    .upload(fileName, file);

  if (uploadError) {
    return { url: null, error: uploadError.message };
  }

  const { data } = supabase.storage.from('media').getPublicUrl(fileName);

  return { url: data.publicUrl, error: null };
}

// ============================================================
// Page Data APIs (About, Public Work, Contact, Privacy)
// ============================================================
import {
  AboutPageData,
  AboutHeroData,
  AboutChapterItem,
  AboutValueItem,
  AboutMilestoneItem,
  AboutBottomCtaData,
  PublicWorkPageData,
  PublicWorkItem,
  ContactPageData,
  OfficeLocation,
  PrivacyPageData,
  PrivacySectionItem,
  DEFAULT_ABOUT_PAGE_DATA,
  DEFAULT_PUBLIC_WORK_PAGE_DATA,
  DEFAULT_CONTACT_PAGE_DATA,
  DEFAULT_PRIVACY_PAGE_DATA,
} from '@/lib/pageDataDefaults';

export type {
  AboutPageData,
  AboutHeroData,
  AboutChapterItem,
  AboutValueItem,
  AboutMilestoneItem,
  AboutBottomCtaData,
  PublicWorkPageData,
  PublicWorkItem,
  ContactPageData,
  OfficeLocation,
  PrivacyPageData,
  PrivacySectionItem,
};

const STORAGE_KEYS = {
  about: 'bb_page_data_about_v1',
  publicWork: 'bb_page_data_public_work_v2',
  contact: 'bb_page_data_contact_v1',
  privacy: 'bb_page_data_privacy_v1',
};

// 1. About Page Data
export async function getAboutPageData(): Promise<AboutPageData> {
  // Check local cache first
  if (typeof window !== 'undefined') {
    try {
      const local = localStorage.getItem(STORAGE_KEYS.about);
      if (local) {
        const parsed = JSON.parse(local);
        if (parsed && parsed.hero) {
          return { ...DEFAULT_ABOUT_PAGE_DATA, ...parsed };
        }
      }
    } catch {
      // ignore
    }
  }

  if (!isSupabaseConfigured || !supabase) {
    return DEFAULT_ABOUT_PAGE_DATA;
  }

  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'about_page')
      .eq('language', 'en')
      .maybeSingle();

    if (error || !data || !data.value) {
      return DEFAULT_ABOUT_PAGE_DATA;
    }

    const merged = { ...DEFAULT_ABOUT_PAGE_DATA, ...(data.value as Partial<AboutPageData>) };
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEYS.about, JSON.stringify(merged));
      } catch {
        // ignore
      }
    }
    return merged;
  } catch (err) {
    console.error('Error fetching about page data:', err);
    return DEFAULT_ABOUT_PAGE_DATA;
  }
}

export async function updateAboutPageData(
  data: AboutPageData
): Promise<{ error: string | null }> {
  // Store locally for instant UI update
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEYS.about, JSON.stringify(data));
    } catch {
      // ignore
    }
  }

  if (!isSupabaseConfigured || !supabase) {
    return { error: null };
  }

  try {
    // 1. Update about_page in site_settings
    const { error } = await supabase
      .from('site_settings')
      .upsert(
        {
          key: 'about_page',
          value: data as unknown as Record<string, unknown>,
          language: 'en',
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'key,language' }
      );

    if (error) throw error;

    // 2. Also keep leader profile in sync
    await supabase.from('site_settings').upsert(
      {
        key: 'profile',
        value: {
          name_en: data.hero.name_en,
          name_mr: data.hero.name_mr,
          title_en: data.hero.title_en,
          title_mr: data.hero.title_mr,
          bio_en: data.hero.bio_summary_en,
          bio_mr: data.hero.bio_summary_mr,
          profile_image: data.hero.profile_image,
        },
        language: 'en',
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'key,language' }
    );

    return { error: null };
  } catch (err: any) {
    console.error('Error updating about page data:', err);
    return { error: err?.message || 'Failed to save about page' };
  }
}

// 2. Public Work Page Data
function mergeInitiativesWithDefaults(
  initiatives: PublicWorkItem[] | undefined
): PublicWorkItem[] {
  if (!initiatives || !Array.isArray(initiatives)) {
    return DEFAULT_PUBLIC_WORK_PAGE_DATA.initiatives;
  }
  const existingMap = new Map(initiatives.map((item) => [item.id, item]));
  const merged: PublicWorkItem[] = [];
  const handledIds = new Set<string>();

  // Keep defaults in canonical order, preserving any admin updates
  for (const defItem of DEFAULT_PUBLIC_WORK_PAGE_DATA.initiatives) {
    if (existingMap.has(defItem.id)) {
      merged.push({ ...defItem, ...existingMap.get(defItem.id)! });
    } else {
      merged.push(defItem);
    }
    handledIds.add(defItem.id);
  }

  // Preserve any additional initiatives created by admin
  for (const item of initiatives) {
    if (!handledIds.has(item.id)) {
      merged.push(item);
    }
  }

  return merged;
}

export async function getPublicWorkPageData(): Promise<PublicWorkPageData> {
  if (typeof window !== 'undefined') {
    try {
      const local = localStorage.getItem(STORAGE_KEYS.publicWork);
      if (local) {
        const parsed = JSON.parse(local);
        if (parsed && Array.isArray(parsed.initiatives)) {
          return {
            ...DEFAULT_PUBLIC_WORK_PAGE_DATA,
            ...parsed,
            initiatives: mergeInitiativesWithDefaults(parsed.initiatives),
          };
        }
      }
    } catch {
      // ignore
    }
  }

  if (!isSupabaseConfigured || !supabase) {
    return DEFAULT_PUBLIC_WORK_PAGE_DATA;
  }

  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'public_work')
      .eq('language', 'en')
      .maybeSingle();

    if (error || !data || !data.value) {
      return DEFAULT_PUBLIC_WORK_PAGE_DATA;
    }

    const valueObj = data.value as Partial<PublicWorkPageData>;
    const merged: PublicWorkPageData = {
      ...DEFAULT_PUBLIC_WORK_PAGE_DATA,
      ...valueObj,
      initiatives: mergeInitiativesWithDefaults(valueObj.initiatives),
    };
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEYS.publicWork, JSON.stringify(merged));
      } catch {
        // ignore
      }
    }
    return merged;
  } catch (err) {
    console.error('Error fetching public work page data:', err);
    return DEFAULT_PUBLIC_WORK_PAGE_DATA;
  }
}

export async function updatePublicWorkPageData(
  data: PublicWorkPageData
): Promise<{ error: string | null }> {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEYS.publicWork, JSON.stringify(data));
    } catch {
      // ignore
    }
  }

  if (!isSupabaseConfigured || !supabase) {
    return { error: null };
  }

  try {
    const { error } = await supabase
      .from('site_settings')
      .upsert(
        {
          key: 'public_work',
          value: data as unknown as Record<string, unknown>,
          language: 'en',
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'key,language' }
      );

    return { error: error?.message ?? null };
  } catch (err: any) {
    console.error('Error updating public work page data:', err);
    return { error: err?.message || 'Failed to save public work page' };
  }
}

// 3. Contact Page Data
export async function getContactPageData(): Promise<ContactPageData> {
  if (typeof window !== 'undefined') {
    try {
      const local = localStorage.getItem(STORAGE_KEYS.contact);
      if (local) {
        const parsed = JSON.parse(local);
        if (parsed && Array.isArray(parsed.offices)) {
          return { ...DEFAULT_CONTACT_PAGE_DATA, ...parsed };
        }
      }
    } catch {
      // ignore
    }
  }

  if (!isSupabaseConfigured || !supabase) {
    return DEFAULT_CONTACT_PAGE_DATA;
  }

  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'contact_page')
      .eq('language', 'en')
      .maybeSingle();

    if (error || !data || !data.value) {
      return DEFAULT_CONTACT_PAGE_DATA;
    }

    const merged = { ...DEFAULT_CONTACT_PAGE_DATA, ...(data.value as Partial<ContactPageData>) };
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEYS.contact, JSON.stringify(merged));
      } catch {
        // ignore
      }
    }
    return merged;
  } catch (err) {
    console.error('Error fetching contact page data:', err);
    return DEFAULT_CONTACT_PAGE_DATA;
  }
}

export async function updateContactPageData(
  data: ContactPageData
): Promise<{ error: string | null }> {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEYS.contact, JSON.stringify(data));
    } catch {
      // ignore
    }
  }

  if (!isSupabaseConfigured || !supabase) {
    return { error: null };
  }

  try {
    const { error } = await supabase
      .from('site_settings')
      .upsert(
        {
          key: 'contact_page',
          value: data as unknown as Record<string, unknown>,
          language: 'en',
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'key,language' }
      );

    // Keep primary office address synced in `contact` key
    const primaryOffice = data.offices.find((o) => o.is_primary) || data.offices[0];
    if (primaryOffice) {
      await supabase.from('site_settings').upsert(
        {
          key: 'contact',
          value: {
            office_address_en: primaryOffice.address_en,
            office_address_mr: primaryOffice.address_mr,
            phone: primaryOffice.phone,
            email: primaryOffice.email,
          },
          language: 'en',
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'key,language' }
      );
    }

    return { error: error?.message ?? null };
  } catch (err: any) {
    console.error('Error updating contact page data:', err);
    return { error: err?.message || 'Failed to save contact page' };
  }
}

// 4. Privacy Page Data
export async function getPrivacyPageData(): Promise<PrivacyPageData> {
  if (typeof window !== 'undefined') {
    try {
      const local = localStorage.getItem(STORAGE_KEYS.privacy);
      if (local) {
        const parsed = JSON.parse(local);
        if (parsed && Array.isArray(parsed.sections)) {
          return { ...DEFAULT_PRIVACY_PAGE_DATA, ...parsed };
        }
      }
    } catch {
      // ignore
    }
  }

  if (!isSupabaseConfigured || !supabase) {
    return DEFAULT_PRIVACY_PAGE_DATA;
  }

  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'privacy_page')
      .eq('language', 'en')
      .maybeSingle();

    if (error || !data || !data.value) {
      return DEFAULT_PRIVACY_PAGE_DATA;
    }

    const merged = { ...DEFAULT_PRIVACY_PAGE_DATA, ...(data.value as Partial<PrivacyPageData>) };
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEYS.privacy, JSON.stringify(merged));
      } catch {
        // ignore
      }
    }
    return merged;
  } catch (err) {
    console.error('Error fetching privacy page data:', err);
    return DEFAULT_PRIVACY_PAGE_DATA;
  }
}

export async function updatePrivacyPageData(
  data: PrivacyPageData
): Promise<{ error: string | null }> {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEYS.privacy, JSON.stringify(data));
    } catch {
      // ignore
    }
  }

  if (!isSupabaseConfigured || !supabase) {
    return { error: null };
  }

  try {
    const { error } = await supabase
      .from('site_settings')
      .upsert(
        {
          key: 'privacy_page',
          value: data as unknown as Record<string, unknown>,
          language: 'en',
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'key,language' }
      );

    return { error: error?.message ?? null };
  } catch (err: any) {
    console.error('Error updating privacy page data:', err);
    return { error: err?.message || 'Failed to save privacy page' };
  }
}

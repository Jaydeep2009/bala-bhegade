// Supabase Database Types
export interface Database {
  public: {
    Tables: {
      site_settings: {
        Row: SiteSettings;
        Insert: Omit<SiteSettings, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<SiteSettings, 'id'>>;
      };
      homepage_sections: {
        Row: HomepageSection;
        Insert: Omit<HomepageSection, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<HomepageSection, 'id'>>;
      };
      news_articles: {
        Row: NewsArticle;
        Insert: Omit<NewsArticle, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<NewsArticle, 'id'>>;
      };
      gallery_items: {
        Row: GalleryItem;
        Insert: Omit<GalleryItem, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<GalleryItem, 'id'>>;
      };
      events: {
        Row: EventItem;
        Insert: Omit<EventItem, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<EventItem, 'id'>>;
      };
      social_posts: {
        Row: SocialPost;
        Insert: Omit<SocialPost, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<SocialPost, 'id'>>;
      };
      admin_profiles: {
        Row: AdminProfile;
        Insert: Omit<AdminProfile, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<AdminProfile, 'id'>>;
      };
    };
  };
}

export interface SiteSettings {
  id: string;
  key: string;
  value: Record<string, unknown>;
  language: 'en' | 'mr';
  created_at: string;
  updated_at: string;
}

export interface HomepageSection {
  id: string;
  section_key: string;
  title_en: string;
  title_mr: string;
  subtitle_en: string | null;
  subtitle_mr: string | null;
  content_en: string | null;
  content_mr: string | null;
  image_url: string | null;
  image_focal_point: string | null;
  cta_links: CTALink[] | null;
  display_order: number;
  is_visible: boolean;
  config: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface CTALink {
  label_en: string;
  label_mr: string;
  url: string;
  variant: 'primary' | 'secondary' | 'gold';
}

export interface HeroSlide {
  id: string;
  image: string;
  mobileImage?: string;
  focalPointDesktop?: string;
  focalPointMobile?: string;
  hasBakedHeadline?: boolean;
  badge_mr: string;
  badge_en: string;
  title_mr: string;
  title_en: string;
  subtitle_mr: string;
  subtitle_en: string;
  cta1: {
    label_mr: string;
    label_en: string;
    url: string;
  };
  cta2?: {
    label_mr: string;
    label_en: string;
    url: string;
  };
}

export interface HeroConfig {
  slides?: HeroSlide[];
  autoplay?: boolean;
  autoplayInterval?: number; // in seconds
  hide_text_overlay?: boolean;
  overlay_opacity?: number;
  text_align?: string;
  [key: string]: unknown;
}

export interface NewsArticle {
  id: string;
  title_en: string;
  title_mr: string;
  slug: string;
  summary_en: string | null;
  summary_mr: string | null;
  body_en: string | null;
  body_mr: string | null;
  cover_image_url: string | null;
  category: string;
  status: 'draft' | 'published';
  published_at: string | null;
  author: string | null;
  tags: string[] | null;
  created_at: string;
  updated_at: string;
}

export interface GalleryItem {
  id: string;
  image_url: string;
  thumbnail_url: string | null;
  caption_en: string | null;
  caption_mr: string | null;
  alt_text_en: string;
  alt_text_mr: string;
  category: string;
  display_order: number;
  is_featured: boolean;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

export interface EventItem {
  id: string;
  title_en: string;
  title_mr: string;
  description_en: string | null;
  description_mr: string | null;
  event_date: string;
  event_time: string | null;
  location_en: string | null;
  location_mr: string | null;
  image_url: string | null;
  is_featured: boolean;
  status: 'upcoming' | 'past' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface SocialPost {
  id: string;
  platform: 'instagram' | 'twitter' | 'facebook';
  post_url: string;
  caption_en: string | null;
  caption_mr: string | null;
  thumbnail_url: string | null;
  is_featured: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface AdminProfile {
  id: string;
  user_id: string;
  display_name: string;
  role: 'super_admin' | 'admin' | 'editor';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

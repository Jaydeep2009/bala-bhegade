import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Eye,
  EyeOff,
  ChevronUp,
  ChevronDown,
  Save,
  Check,
  AlertCircle,
  ArrowUp,
  ArrowDown,
  Layers,
  Sparkles,
  Link as LinkIcon,
  HelpCircle,
  Plus,
  Trash2,
  Sliders,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import { getAllHomepageSections } from '@/lib/api';
import { mockHomepageSections, DEFAULT_HERO_SLIDES } from '@/lib/mock-data';
import type { HomepageSection, CTALink, HeroSlide } from '@/types/database';
import ImageUpload from '@/components/ui/ImageUpload';
import { translateText } from '@/lib/translation';

export const AdminHomepage: React.FC = () => {
  const [sections, setSections] = useState<HomepageSection[]>(() => {
    // Sort sections initially by display_order
    return [...mockHomepageSections].sort((a, b) => a.display_order - b.display_order);
  });

  useEffect(() => {
    getAllHomepageSections().then(async (data) => {
      if (data && data.length > 0) {
        // If about_intro image_url is empty, check site_settings profile for fallback
        const aboutSec = data.find((s) => s.section_key === 'about_intro');
        if (aboutSec && !aboutSec.image_url && isSupabaseConfigured && supabase) {
          try {
            const { data: prof } = await supabase
              .from('site_settings')
              .select('value')
              .eq('key', 'profile')
              .eq('language', 'en')
              .maybeSingle();
            const pVal = prof?.value as { profile_image?: string } | undefined;
            if (pVal?.profile_image) {
              aboutSec.image_url = pVal.profile_image;
            }
          } catch {
            // ignore error
          }
        }
        setSections(data);
      }
    });
  }, []);

  const [expandedSectionId, setExpandedSectionId] = useState<string | null>('1'); // Default open Hero
  const [activeHeroSlideIndex, setActiveHeroSlideIndex] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [isTranslatingAbout, setIsTranslatingAbout] = useState(false);

  // Helper to extract Hero slides
  const getHeroSlides = (section: HomepageSection): HeroSlide[] => {
    const cfg = (section.config as Record<string, unknown>) || {};
    if (Array.isArray(cfg.slides) && cfg.slides.length > 0) {
      return cfg.slides as HeroSlide[];
    }
    return DEFAULT_HERO_SLIDES;
  };

  // Update a single hero slide
  const handleUpdateHeroSlide = (
    sectionId: string,
    slideIndex: number,
    updates: Partial<HeroSlide>
  ) => {
    setSections((prev) =>
      prev.map((sec) => {
        if (sec.id !== sectionId) return sec;
        const cfg = (sec.config as Record<string, unknown>) || {};
        const currentSlides = getHeroSlides(sec);
        const nextSlides = currentSlides.map((slide, idx) =>
          idx === slideIndex ? { ...slide, ...updates } : slide
        );

        // Keep root database fields aligned with Slide 0 for backward-compatibility
        const rootUpdates: Partial<HomepageSection> = {
          config: { ...cfg, slides: nextSlides },
        };
        if (slideIndex === 0) {
          if (updates.image) rootUpdates.image_url = updates.image;
          if (updates.title_en) rootUpdates.title_en = updates.title_en;
          if (updates.title_mr) rootUpdates.title_mr = updates.title_mr;
          if (updates.subtitle_en) rootUpdates.subtitle_en = updates.subtitle_en;
          if (updates.subtitle_mr) rootUpdates.subtitle_mr = updates.subtitle_mr;
        }

        return { ...sec, ...rootUpdates };
      })
    );
  };

  // Add a new slide to hero
  const handleAddHeroSlide = (sectionId: string) => {
    setSections((prev) =>
      prev.map((sec) => {
        if (sec.id !== sectionId) return sec;
        const cfg = (sec.config as Record<string, unknown>) || {};
        const currentSlides = getHeroSlides(sec);
        const newSlide: HeroSlide = {
          id: `slide-${Date.now()}`,
          image: '/images/hero-campaign-banner.png',
          focalPointDesktop: 'center center',
          focalPointMobile: '70% center',
          hasBakedHeadline: false,
          badge_mr: 'लोकसेवा व विकास • मावळ तालुका',
          badge_en: 'Public Service & Regional Development • Maval',
          title_mr: 'नवीन दालन शीर्षक',
          title_en: 'New Slide Title',
          subtitle_mr: 'येथे या दालनाची सविस्तर माहिती व जनसेवेचा संकल्प लिहा.',
          subtitle_en: 'Enter descriptive message and commitment for this slide.',
          cta1: {
            label_mr: 'अधिक जाणून घ्या',
            label_en: 'Learn More',
            url: '/about',
          },
          cta2: {
            label_mr: 'सार्वजनिक कार्य',
            label_en: 'Public Work',
            url: '/public-work',
          },
        };
        const nextSlides = [...currentSlides, newSlide];
        setActiveHeroSlideIndex(nextSlides.length - 1);
        return {
          ...sec,
          config: { ...cfg, slides: nextSlides },
        };
      })
    );
  };

  // Delete a slide from hero
  const handleDeleteHeroSlide = (sectionId: string, slideIndex: number) => {
    setSections((prev) =>
      prev.map((sec) => {
        if (sec.id !== sectionId) return sec;
        const cfg = (sec.config as Record<string, unknown>) || {};
        const currentSlides = getHeroSlides(sec);
        if (currentSlides.length <= 1) return sec;
        const nextSlides = currentSlides.filter((_, idx) => idx !== slideIndex);
        if (activeHeroSlideIndex >= nextSlides.length) {
          setActiveHeroSlideIndex(nextSlides.length - 1);
        }
        return {
          ...sec,
          config: { ...cfg, slides: nextSlides },
        };
      })
    );
  };

  // Reorder slides
  const handleMoveHeroSlide = (sectionId: string, fromIndex: number, toIndex: number) => {
    setSections((prev) =>
      prev.map((sec) => {
        if (sec.id !== sectionId) return sec;
        const cfg = (sec.config as Record<string, unknown>) || {};
        const currentSlides = [...getHeroSlides(sec)];
        if (toIndex < 0 || toIndex >= currentSlides.length) return sec;
        const item = currentSlides.splice(fromIndex, 1)[0];
        currentSlides.splice(toIndex, 0, item);
        setActiveHeroSlideIndex(toIndex);
        return {
          ...sec,
          config: { ...cfg, slides: currentSlides },
        };
      })
    );
  };

  // Update hero general config (e.g., autoplay, interval)
  const handleUpdateHeroConfig = (sectionId: string, updates: Record<string, unknown>) => {
    setSections((prev) =>
      prev.map((sec) => {
        if (sec.id !== sectionId) return sec;
        const cfg = (sec.config as Record<string, unknown>) || {};
        return {
          ...sec,
          config: { ...cfg, ...updates },
        };
      })
    );
  };

  // Toggle visibility of a section
  const handleToggleVisibility = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSections((prev) =>
      prev.map((sec) => (sec.id === id ? { ...sec, is_visible: !sec.is_visible } : sec))
    );
  };

  // Move section up in order
  const handleMoveUp = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (index === 0) return;
    setSections((prev) => {
      const next = [...prev];
      const temp = next[index - 1];
      next[index - 1] = next[index];
      next[index] = temp;
      return next.map((sec, idx) => ({ ...sec, display_order: idx }));
    });
  };

  // Move section down in order
  const handleMoveDown = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (index === sections.length - 1) return;
    setSections((prev) => {
      const next = [...prev];
      const temp = next[index + 1];
      next[index + 1] = next[index];
      next[index] = temp;
      return next.map((sec, idx) => ({ ...sec, display_order: idx }));
    });
  };

  // Update a field on a specific section
  const handleUpdateSection = (id: string, updates: Partial<HomepageSection>) => {
    setSections((prev) =>
      prev.map((sec) => (sec.id === id ? { ...sec, ...updates } : sec))
    );
  };

  // Update CTA link on a specific section
  const handleUpdateCtaLink = (
    sectionId: string,
    linkIndex: number,
    updates: Partial<CTALink>
  ) => {
    setSections((prev) =>
      prev.map((sec) => {
        if (sec.id !== sectionId) return sec;
        const currentLinks = sec.cta_links ? [...sec.cta_links] : [];
        if (currentLinks[linkIndex]) {
          currentLinks[linkIndex] = { ...currentLinks[linkIndex], ...updates };
        }
        return { ...sec, cta_links: currentLinks };
      })
    );
  };

  // Save changes
  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    setSaveMessage(null);

    try {
      // Auto-translate about_intro fields if English is present and Marathi was left blank
      for (const sec of sections) {
        if (sec.section_key === 'about_intro') {
          if (sec.content_en && !sec.content_mr) {
            try {
              sec.content_mr = await translateText(sec.content_en, 'mr');
            } catch {
              // ignore
            }
          }
          if (sec.subtitle_en && !sec.subtitle_mr) {
            try {
              sec.subtitle_mr = await translateText(sec.subtitle_en, 'mr');
            } catch {
              // ignore
            }
          }
          if (sec.title_en && !sec.title_mr) {
            try {
              sec.title_mr = await translateText(sec.title_en, 'mr');
            } catch {
              // ignore
            }
          }
        }
      }

      if (isSupabaseConfigured && supabase) {
        // Upsert all sections
        for (const sec of sections) {
          const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(sec.id);
          const payload: Record<string, unknown> = {
            section_key: sec.section_key,
            title_en: sec.title_en,
            title_mr: sec.title_mr,
            subtitle_en: sec.subtitle_en,
            subtitle_mr: sec.subtitle_mr,
            content_en: sec.content_en,
            content_mr: sec.content_mr,
            image_url: sec.image_url,
            image_focal_point: sec.image_focal_point,
            cta_links: sec.cta_links,
            display_order: sec.display_order,
            is_visible: sec.is_visible,
            config: sec.config,
            updated_at: new Date().toISOString(),
          };
          if (isUuid) {
            payload.id = sec.id;
          }

          const { error } = await supabase
            .from('homepage_sections')
            .upsert(payload, { onConflict: 'section_key' });
          if (error) throw error;

          // If updating about_intro with image_url, also sync with site_settings profile
          if (sec.section_key === 'about_intro' && sec.image_url) {
            const { data: existingProfile } = await supabase
              .from('site_settings')
              .select('value')
              .eq('key', 'profile')
              .eq('language', 'en')
              .maybeSingle();

            const prevVal = (existingProfile?.value as Record<string, unknown>) || {};
            await supabase
              .from('site_settings')
              .upsert(
                {
                  key: 'profile',
                  value: { ...prevVal, profile_image: sec.image_url },
                  language: 'en',
                  updated_at: new Date().toISOString(),
                },
                { onConflict: 'key,language' }
              );
          }
        }
        setSaveMessage('All homepage sections updated successfully!');
      } else {
        // Dev mode simulation
        await new Promise((res) => setTimeout(res, 600));
        setSaveMessage('Dev Mode: Section layout and content saved in local state.');
      }
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setSaveMessage(`Error saving changes: ${err.message}`);
      } else {
        setSaveMessage('An unexpected error occurred while saving.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      <Helmet>
        <title>Homepage Content Editor | Admin Bala Bhegade</title>
      </Helmet>

      {/* Dev Mode Banner */}
      {!isSupabaseConfigured && (
        <div className="rounded-lg bg-saffron-50 border border-saffron-200 p-4 flex items-center gap-3 text-saffron-900">
          <AlertCircle className="w-5 h-5 text-saffron-600 flex-shrink-0" />
          <div className="text-sm font-medium">
            Dev Mode — changes are not persisted to database.
          </div>
        </div>
      )}

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-charcoal-200 pb-5">
        <div>
          <h1 className="text-2xl font-heading font-semibold text-charcoal-900 flex items-center gap-2.5">
            <Layers className="w-6 h-6 text-saffron-600" />
            Homepage Content Editor
          </h1>
          <p className="text-sm text-charcoal-500 mt-1">
            Reorder sections, adjust public visibility, and edit banner content and calls to action.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="btn-primary self-start sm:self-auto flex items-center gap-2 shadow-sm"
        >
          {isSaving ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Saving...</span>
            </>
          ) : saveSuccess ? (
            <>
              <Check className="w-4 h-4 text-emerald-300" />
              <span>Saved!</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </>
          )}
        </button>
      </div>

      {/* Save Toast Feedback */}
      {saveMessage && (
        <div
          className={`p-4 rounded-lg flex items-center gap-3 text-sm animate-fade-in ${
            saveSuccess
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {saveSuccess ? (
            <Check className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          )}
          <span>{saveMessage}</span>
        </div>
      )}

      {/* Reordering Instructions */}
      <div className="text-xs text-charcoal-500 flex items-center justify-between px-1">
        <span>Use the arrow buttons to rearrange section order on the live website.</span>
        <span>{sections.length} Homepage Sections</span>
      </div>

      {/* Section List Accordion */}
      <div className="space-y-3">
        {sections.map((section, index) => {
          const isExpanded = expandedSectionId === section.id;

          return (
            <div
              key={section.id}
              className={`admin-card overflow-hidden transition-all border ${
                isExpanded
                  ? 'border-saffron-500 shadow-md ring-1 ring-saffron-500/10'
                  : 'hover:border-charcoal-300'
              } ${!section.is_visible ? 'opacity-70 bg-charcoal-50/50' : 'bg-white'}`}
            >
              {/* Header row */}
              <div
                onClick={() => setExpandedSectionId(isExpanded ? null : section.id)}
                className="p-4 flex items-center justify-between gap-4 cursor-pointer select-none bg-white hover:bg-charcoal-50/70 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Drag / Reorder Buttons */}
                  <div className="flex items-center gap-1 text-charcoal-400">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={(e) => handleMoveUp(index, e)}
                      title="Move Up"
                      className="p-1 rounded hover:bg-charcoal-200 text-charcoal-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={index === sections.length - 1}
                      onClick={(e) => handleMoveDown(index, e)}
                      title="Move Down"
                      className="p-1 rounded hover:bg-charcoal-200 text-charcoal-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <span className="w-6 h-6 rounded-full bg-charcoal-100 text-charcoal-600 text-xs font-mono font-semibold flex items-center justify-center flex-shrink-0">
                    {index + 1}
                  </span>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-charcoal-900 truncate">
                        {section.title_en}
                      </h3>
                      <span className="text-xs text-charcoal-400 font-normal">
                        ({section.title_mr})
                      </span>
                    </div>
                    <span className="text-xs text-charcoal-400 font-mono">
                      key: {section.section_key}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  {/* Visibility Button */}
                  <button
                    type="button"
                    onClick={(e) => handleToggleVisibility(section.id, e)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                      section.is_visible
                        ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                        : 'bg-charcoal-100 text-charcoal-600 hover:bg-charcoal-200'
                    }`}
                    title={section.is_visible ? 'Section is visible' : 'Section is hidden'}
                  >
                    {section.is_visible ? (
                      <>
                        <Eye className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Visible</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3.5 h-3.5 text-charcoal-500" />
                        <span>Hidden</span>
                      </>
                    )}
                  </button>

                  {/* Expand / Collapse Icon */}
                  <div className="p-1 text-charcoal-400 hover:text-charcoal-700">
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </div>
              </div>

              {/* Expanded Editor Panel */}
              {isExpanded && (
                <div className="border-t border-charcoal-100 p-6 bg-charcoal-50/40 space-y-6 animate-fade-in">
                  {/* Hero Section Editor */}
                  {section.section_key === 'hero' && (() => {
                    const heroConfig = (section.config as Record<string, unknown>) || {};
                    const heroSlides = getHeroSlides(section);
                    const currentSlide = heroSlides[activeHeroSlideIndex] || heroSlides[0];

                    return (
                      <div className="space-y-6">
                        {/* Informational banner */}
                        <div className="p-4 bg-gradient-to-r from-saffron-50 via-warm-50 to-saffron-50 border border-saffron-200 rounded-xl text-xs text-saffron-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
                          <div>
                            <strong className="text-sm font-semibold text-saffron-900 block mb-0.5">
                              Full-Screen Cinematic Hero Carousel
                            </strong>
                            <p className="text-charcoal-600">
                              Customize every slide&apos;s background photograph, headline, mandate pill, narrative description, and CTA buttons below.
                            </p>
                          </div>

                          {/* Global Carousel Controls */}
                          <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm p-2 rounded-lg border border-saffron-200 flex-shrink-0">
                            <label className="flex items-center gap-1.5 cursor-pointer text-xs font-medium text-charcoal-800">
                              <input
                                type="checkbox"
                                checked={heroConfig.autoplay !== false}
                                onChange={(e) =>
                                  handleUpdateHeroConfig(section.id, { autoplay: e.target.checked })
                                }
                                className="rounded text-saffron-600 focus:ring-saffron-500 w-3.5 h-3.5"
                              />
                              <span>Autoplay</span>
                            </label>

                            <span className="text-charcoal-300">|</span>

                            <div className="flex items-center gap-1 text-xs">
                              <span className="text-charcoal-500">Speed:</span>
                              <select
                                value={Number(heroConfig.autoplayInterval || 7)}
                                onChange={(e) =>
                                  handleUpdateHeroConfig(section.id, { autoplayInterval: Number(e.target.value) })
                                }
                                className="text-xs bg-white border border-charcoal-200 rounded px-1.5 py-0.5 text-charcoal-800 focus:outline-none focus:ring-1 focus:ring-saffron-500 font-medium"
                              >
                                <option value={5}>5s</option>
                                <option value={7}>7s</option>
                                <option value={10}>10s</option>
                                <option value={12}>12s</option>
                              </select>
                            </div>
                          </div>
                        </div>

                        {/* Slide Navigation Tabs */}
                        <div className="flex items-center justify-between gap-2 border-b border-charcoal-200 pb-3 overflow-x-auto">
                          <div className="flex items-center gap-2">
                            {heroSlides.map((slide, sIdx) => {
                              const isActive = sIdx === activeHeroSlideIndex;
                              return (
                                <button
                                  key={slide.id || sIdx}
                                  type="button"
                                  onClick={() => setActiveHeroSlideIndex(sIdx)}
                                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all select-none border ${
                                    isActive
                                      ? 'bg-saffron-500 text-white border-saffron-500 shadow-sm'
                                      : 'bg-white text-charcoal-700 border-charcoal-200 hover:border-saffron-300 hover:text-saffron-600'
                                  }`}
                                >
                                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                                    isActive ? 'bg-white/20 text-white' : 'bg-charcoal-100 text-charcoal-600'
                                  }`}>
                                    {sIdx + 1}
                                  </span>
                                  <span className="truncate max-w-[120px] sm:max-w-[160px]">
                                    {slide.title_mr || slide.title_en || `Slide ${sIdx + 1}`}
                                  </span>
                                </button>
                              );
                            })}

                            <button
                              type="button"
                              onClick={() => handleAddHeroSlide(section.id)}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-dashed border-saffron-300 text-saffron-700 hover:bg-saffron-50 hover:border-saffron-500 transition-colors"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>Add Slide</span>
                            </button>
                          </div>

                          {/* Slide Action Controls (Reorder & Delete) */}
                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            <button
                              type="button"
                              disabled={activeHeroSlideIndex === 0}
                              onClick={() =>
                                handleMoveHeroSlide(section.id, activeHeroSlideIndex, activeHeroSlideIndex - 1)
                              }
                              title="Move Slide Left"
                              className="p-1.5 rounded bg-white border border-charcoal-200 text-charcoal-600 hover:border-saffron-300 hover:text-saffron-600 disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                              <ChevronLeft className="w-4 h-4" />
                            </button>

                            <button
                              type="button"
                              disabled={activeHeroSlideIndex === heroSlides.length - 1}
                              onClick={() =>
                                handleMoveHeroSlide(section.id, activeHeroSlideIndex, activeHeroSlideIndex + 1)
                              }
                              title="Move Slide Right"
                              className="p-1.5 rounded bg-white border border-charcoal-200 text-charcoal-600 hover:border-saffron-300 hover:text-saffron-600 disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                              <ChevronRight className="w-4 h-4" />
                            </button>

                            <button
                              type="button"
                              disabled={heroSlides.length <= 1}
                              onClick={() => {
                                if (window.confirm(`Are you sure you want to delete Slide ${activeHeroSlideIndex + 1}?`)) {
                                  handleDeleteHeroSlide(section.id, activeHeroSlideIndex);
                                }
                              }}
                              title="Delete this slide"
                              className="p-1.5 rounded bg-white border border-charcoal-200 text-red-600 hover:bg-red-50 hover:border-red-300 disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Active Slide Form */}
                        {currentSlide && (
                          <div className="space-y-5 bg-white p-5 rounded-xl border border-charcoal-200/90 shadow-2xs">
                            <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-charcoal-100">
                              <span className="text-xs font-bold uppercase tracking-wider text-saffron-600">
                                Editing Slide {activeHeroSlideIndex + 1} of {heroSlides.length}
                              </span>
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={async () => {
                                    try {
                                      const [bMr, tMr, sMr, c1Mr, c2Mr] = await Promise.all([
                                        currentSlide.badge_en ? translateText(currentSlide.badge_en, 'mr') : Promise.resolve(''),
                                        currentSlide.title_en ? translateText(currentSlide.title_en, 'mr') : Promise.resolve(''),
                                        currentSlide.subtitle_en ? translateText(currentSlide.subtitle_en, 'mr') : Promise.resolve(''),
                                        currentSlide.cta1?.label_en ? translateText(currentSlide.cta1.label_en, 'mr') : Promise.resolve(''),
                                        currentSlide.cta2?.label_en ? translateText(currentSlide.cta2.label_en, 'mr') : Promise.resolve(''),
                                      ]);
                                      handleUpdateHeroSlide(section.id, activeHeroSlideIndex, {
                                        badge_mr: bMr || currentSlide.badge_mr,
                                        title_mr: tMr || currentSlide.title_mr,
                                        subtitle_mr: sMr || currentSlide.subtitle_mr,
                                        cta1: {
                                          label_mr: c1Mr || currentSlide.cta1?.label_mr || '',
                                          label_en: currentSlide.cta1?.label_en || '',
                                          url: currentSlide.cta1?.url || '/about',
                                        },
                                        cta2: {
                                          label_mr: c2Mr || currentSlide.cta2?.label_mr || '',
                                          label_en: currentSlide.cta2?.label_en || '',
                                          url: currentSlide.cta2?.url || '/public-work',
                                        },
                                      });
                                    } catch {
                                      // ignore error
                                    }
                                  }}
                                  className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium text-saffron-700 bg-saffron-50 border border-saffron-200 rounded hover:bg-saffron-100 transition-colors"
                                  title="Auto-translate English tagline & dialogs into Marathi"
                                >
                                  <Sparkles className="w-3.5 h-3.5 text-saffron-600" />
                                  <span>Auto-Translate to Marathi</span>
                                </button>
                                <span className="text-xs text-charcoal-400 font-mono">
                                  ID: {currentSlide.id}
                                </span>
                              </div>
                            </div>

                            {/* 1. Background Image Upload */}
                            <div>
                              <ImageUpload
                                label={`Slide ${activeHeroSlideIndex + 1} Background Image`}
                                description="Upload a high-resolution landscape photo or campaign banner (1920x1080 recommended)"
                                value={currentSlide.image || ''}
                                onChange={(url) =>
                                  handleUpdateHeroSlide(section.id, activeHeroSlideIndex, { image: url })
                                }
                              />
                            </div>

                            {/* 2. Tagline / Mandate Badge */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="admin-label">Badge / Pill Text (Marathi)</label>
                                <input
                                  type="text"
                                  value={currentSlide.badge_mr || ''}
                                  onChange={(e) =>
                                    handleUpdateHeroSlide(section.id, activeHeroSlideIndex, {
                                      badge_mr: e.target.value,
                                    })
                                  }
                                  placeholder="उदा. माजी राज्यमंत्री, महाराष्ट्र शासन (२०१९) • माजी आमदार, मावळ"
                                  className="admin-input font-marathi"
                                />
                              </div>
                              <div>
                                <label className="admin-label">Badge / Pill Text (English)</label>
                                <input
                                  type="text"
                                  value={currentSlide.badge_en || ''}
                                  onChange={(e) =>
                                    handleUpdateHeroSlide(section.id, activeHeroSlideIndex, {
                                      badge_en: e.target.value,
                                    })
                                  }
                                  placeholder="e.g. Former Minister of State, Maharashtra • Former MLA, Maval"
                                  className="admin-input"
                                />
                              </div>
                            </div>

                            {/* 3. Title / Headline */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="admin-label">Main Title / Headline (Marathi)</label>
                                <input
                                  type="text"
                                  value={currentSlide.title_mr || ''}
                                  onChange={(e) =>
                                    handleUpdateHeroSlide(section.id, activeHeroSlideIndex, {
                                      title_mr: e.target.value,
                                    })
                                  }
                                  placeholder="उदा. संकल्प मावळच्या सर्वांगीण विकासाचा"
                                  className="admin-input font-marathi"
                                />
                              </div>
                              <div>
                                <label className="admin-label">Main Title / Headline (English)</label>
                                <input
                                  type="text"
                                  value={currentSlide.title_en || ''}
                                  onChange={(e) =>
                                    handleUpdateHeroSlide(section.id, activeHeroSlideIndex, {
                                      title_en: e.target.value,
                                    })
                                  }
                                  placeholder="e.g. A Vision for Maval's Holistic Development"
                                  className="admin-input"
                                />
                              </div>
                            </div>

                            {/* 4. Baked-in Slogan Checkbox */}
                            <div className="p-3.5 bg-warm-100/60 border border-charcoal-200 rounded-lg">
                              <label className="flex items-start gap-2.5 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={Boolean(currentSlide.hasBakedHeadline)}
                                  onChange={(e) =>
                                    handleUpdateHeroSlide(section.id, activeHeroSlideIndex, {
                                      hasBakedHeadline: e.target.checked,
                                    })
                                  }
                                  className="mt-0.5 rounded text-saffron-600 focus:ring-saffron-500 w-4 h-4"
                                />
                                <div>
                                  <span className="text-xs font-semibold text-charcoal-900 block">
                                    Artwork already contains painted Marathi slogan (e.g. for Slide 1 banner)
                                  </span>
                                  <span className="text-[11px] text-charcoal-500 block mt-0.5">
                                    When enabled, avoids duplicating the slogan as extra foreground text and cleanly displays the leader&apos;s name and designation in the lower third.
                                  </span>
                                </div>
                              </label>
                            </div>

                            {/* 5. Subtitle / Narrative Description */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="admin-label">Subtitle / Message (Marathi)</label>
                                <textarea
                                  rows={2}
                                  value={currentSlide.subtitle_mr || ''}
                                  onChange={(e) =>
                                    handleUpdateHeroSlide(section.id, activeHeroSlideIndex, {
                                      subtitle_mr: e.target.value,
                                    })
                                  }
                                  placeholder="तळागाळातील संवाद, पारदर्शक नेतृत्व आणि विकासाचा संकल्प..."
                                  className="admin-input font-marathi text-xs"
                                />
                              </div>
                              <div>
                                <label className="admin-label">Subtitle / Message (English)</label>
                                <textarea
                                  rows={2}
                                  value={currentSlide.subtitle_en || ''}
                                  onChange={(e) =>
                                    handleUpdateHeroSlide(section.id, activeHeroSlideIndex, {
                                      subtitle_en: e.target.value,
                                    })
                                  }
                                  placeholder="Rooted in continuous grassroots dialogue and transparent leadership..."
                                  className="admin-input text-xs"
                                />
                              </div>
                            </div>

                            {/* 6. Action Buttons (CTA Links) */}
                            <div className="border-t border-charcoal-100 pt-4 space-y-4">
                              <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal-800 flex items-center gap-1.5">
                                <LinkIcon className="w-3.5 h-3.5 text-saffron-600" />
                                <span>Slide {activeHeroSlideIndex + 1} Action Buttons</span>
                              </h4>

                              {/* Primary Button */}
                              <div className="p-3.5 bg-saffron-50/50 border border-saffron-200/80 rounded-lg space-y-2">
                                <span className="text-xs font-semibold text-saffron-900 block">
                                  Primary Button (Saffron)
                                </span>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                  <div>
                                    <label className="admin-label text-[11px]">Label (Marathi)</label>
                                    <input
                                      type="text"
                                      value={currentSlide.cta1?.label_mr || ''}
                                      onChange={(e) =>
                                        handleUpdateHeroSlide(section.id, activeHeroSlideIndex, {
                                          cta1: {
                                            label_mr: e.target.value,
                                            label_en: currentSlide.cta1?.label_en || '',
                                            url: currentSlide.cta1?.url || '/about',
                                          },
                                        })
                                      }
                                      className="admin-input text-xs font-marathi"
                                    />
                                  </div>
                                  <div>
                                    <label className="admin-label text-[11px]">Label (English)</label>
                                    <input
                                      type="text"
                                      value={currentSlide.cta1?.label_en || ''}
                                      onChange={(e) =>
                                        handleUpdateHeroSlide(section.id, activeHeroSlideIndex, {
                                          cta1: {
                                            label_mr: currentSlide.cta1?.label_mr || '',
                                            label_en: e.target.value,
                                            url: currentSlide.cta1?.url || '/about',
                                          },
                                        })
                                      }
                                      className="admin-input text-xs"
                                    />
                                  </div>
                                  <div>
                                    <label className="admin-label text-[11px]">Link URL</label>
                                    <input
                                      type="text"
                                      value={currentSlide.cta1?.url || ''}
                                      onChange={(e) =>
                                        handleUpdateHeroSlide(section.id, activeHeroSlideIndex, {
                                          cta1: {
                                            label_mr: currentSlide.cta1?.label_mr || '',
                                            label_en: currentSlide.cta1?.label_en || '',
                                            url: e.target.value,
                                          },
                                        })
                                      }
                                      className="admin-input text-xs"
                                    />
                                  </div>
                                </div>
                              </div>

                              {/* Secondary Button */}
                              <div className="p-3.5 bg-charcoal-50/70 border border-charcoal-200 rounded-lg space-y-2">
                                <span className="text-xs font-semibold text-charcoal-800 block">
                                  Secondary Button (Glass / Outline)
                                </span>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                  <div>
                                    <label className="admin-label text-[11px]">Label (Marathi)</label>
                                    <input
                                      type="text"
                                      value={currentSlide.cta2?.label_mr || ''}
                                      onChange={(e) =>
                                        handleUpdateHeroSlide(section.id, activeHeroSlideIndex, {
                                          cta2: {
                                            label_mr: e.target.value,
                                            label_en: currentSlide.cta2?.label_en || '',
                                            url: currentSlide.cta2?.url || '/public-work',
                                          },
                                        })
                                      }
                                      className="admin-input text-xs font-marathi"
                                    />
                                  </div>
                                  <div>
                                    <label className="admin-label text-[11px]">Label (English)</label>
                                    <input
                                      type="text"
                                      value={currentSlide.cta2?.label_en || ''}
                                      onChange={(e) =>
                                        handleUpdateHeroSlide(section.id, activeHeroSlideIndex, {
                                          cta2: {
                                            label_mr: currentSlide.cta2?.label_mr || '',
                                            label_en: e.target.value,
                                            url: currentSlide.cta2?.url || '/public-work',
                                          },
                                        })
                                      }
                                      className="admin-input text-xs"
                                    />
                                  </div>
                                  <div>
                                    <label className="admin-label text-[11px]">Link URL</label>
                                    <input
                                      type="text"
                                      value={currentSlide.cta2?.url || ''}
                                      onChange={(e) =>
                                        handleUpdateHeroSlide(section.id, activeHeroSlideIndex, {
                                          cta2: {
                                            label_mr: currentSlide.cta2?.label_mr || '',
                                            label_en: currentSlide.cta2?.label_en || '',
                                            url: e.target.value,
                                          },
                                        })
                                      }
                                      className="admin-input text-xs"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })()}

                  {/* About Section Editor */}
                  {section.section_key === 'about_intro' && (
                    <div className="space-y-5">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 bg-saffron-50 border border-saffron-200 rounded-xl text-xs text-saffron-950">
                        <div>
                          <div className="font-semibold text-sm text-saffron-900 flex items-center gap-1.5">
                            <Sparkles className="w-4 h-4 text-saffron-600" />
                            Leader Biography & About Intro
                          </div>
                          <p className="text-xs text-saffron-800 mt-0.5">
                            Marathi fields are optional. Leave them blank to let the website auto-translate on the fly, or click below to preview and adjust the Marathi text.
                          </p>
                        </div>
                        <button
                          type="button"
                          disabled={isTranslatingAbout}
                          onClick={async () => {
                            setIsTranslatingAbout(true);
                            try {
                              const [tMr, sMr, cMr] = await Promise.all([
                                section.title_en ? translateText(section.title_en, 'mr') : Promise.resolve(''),
                                section.subtitle_en ? translateText(section.subtitle_en, 'mr') : Promise.resolve(''),
                                section.content_en ? translateText(section.content_en, 'mr') : Promise.resolve(''),
                              ]);
                              handleUpdateSection(section.id, {
                                title_mr: tMr || section.title_mr,
                                subtitle_mr: sMr || section.subtitle_mr,
                                content_mr: cMr || section.content_mr,
                              });
                            } catch (err) {
                              console.error('About section auto-translate error:', err);
                            } finally {
                              setIsTranslatingAbout(false);
                            }
                          }}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-saffron-600 hover:bg-saffron-700 text-white rounded-lg text-xs font-medium shadow-xs transition-colors self-start sm:self-auto cursor-pointer flex-shrink-0"
                        >
                          {isTranslatingAbout ? (
                            <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          ) : (
                            <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                          )}
                          <span>{isTranslatingAbout ? 'Translating...' : '⚡ Auto-Translate to Marathi'}</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="admin-label">Title (English)</label>
                          <input
                            type="text"
                            value={section.title_en}
                            onChange={(e) =>
                              handleUpdateSection(section.id, { title_en: e.target.value })
                            }
                            className="admin-input"
                          />
                        </div>
                        <div>
                          <label className="admin-label">Title (Marathi)</label>
                          <input
                            type="text"
                            value={section.title_mr}
                            onChange={(e) =>
                              handleUpdateSection(section.id, { title_mr: e.target.value })
                            }
                            className="admin-input font-marathi"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="admin-label">Subtitle / Public Office (English)</label>
                          <input
                            type="text"
                            value={section.subtitle_en || ''}
                            onChange={(e) =>
                              handleUpdateSection(section.id, { subtitle_en: e.target.value })
                            }
                            placeholder="Former Minister of State, Maharashtra | Former MLA, Maval (2009–2019)"
                            className="admin-input"
                          />
                        </div>
                        <div>
                          <label className="admin-label">Subtitle / Public Office (Marathi)</label>
                          <input
                            type="text"
                            value={section.subtitle_mr || ''}
                            onChange={(e) =>
                              handleUpdateSection(section.id, { subtitle_mr: e.target.value })
                            }
                            placeholder="माजी राज्यमंत्री, महाराष्ट्र शासन | माजी आमदार, मावळ (२००९–२०१९)"
                            className="admin-input font-marathi"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="admin-label">Biography Summary (English)</label>
                          <textarea
                            rows={4}
                            value={section.content_en || ''}
                            onChange={(e) =>
                              handleUpdateSection(section.id, { content_en: e.target.value })
                            }
                            placeholder="Enter short biography..."
                            className="admin-input"
                          />
                        </div>
                        <div>
                          <label className="admin-label">Biography Summary (Marathi)</label>
                          <textarea
                            rows={4}
                            value={section.content_mr || ''}
                            onChange={(e) =>
                              handleUpdateSection(section.id, { content_mr: e.target.value })
                            }
                            placeholder="संक्षिप्त चरित्र प्रविष्ट करा..."
                            className="admin-input font-marathi"
                          />
                        </div>
                      </div>

                      <div>
                        <ImageUpload
                          label="Leader Profile Image"
                          description="Official portrait photo"
                          value={section.image_url || ''}
                          onChange={(url) =>
                            handleUpdateSection(section.id, { image_url: url })
                          }
                        />
                      </div>
                    </div>
                  )}

                  {/* Generic Editor for other sections */}
                  {section.section_key !== 'hero' && section.section_key !== 'about_intro' && (
                    <div className="space-y-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="admin-label">Section Title (English)</label>
                          <input
                            type="text"
                            value={section.title_en}
                            onChange={(e) =>
                              handleUpdateSection(section.id, { title_en: e.target.value })
                            }
                            className="admin-input"
                          />
                        </div>
                        <div>
                          <label className="admin-label">Section Title (Marathi)</label>
                          <input
                            type="text"
                            value={section.title_mr}
                            onChange={(e) =>
                              handleUpdateSection(section.id, { title_mr: e.target.value })
                            }
                            className="admin-input font-marathi"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="admin-label">Subtitle / Description (English)</label>
                          <textarea
                            rows={2}
                            value={section.subtitle_en || ''}
                            onChange={(e) =>
                              handleUpdateSection(section.id, { subtitle_en: e.target.value })
                            }
                            className="admin-input"
                          />
                        </div>
                        <div>
                          <label className="admin-label">Subtitle / Description (Marathi)</label>
                          <textarea
                            rows={2}
                            value={section.subtitle_mr || ''}
                            onChange={(e) =>
                              handleUpdateSection(section.id, { subtitle_mr: e.target.value })
                            }
                            className="admin-input font-marathi"
                          />
                        </div>
                      </div>

                      {section.image_url !== null && (
                        <div>
                          <ImageUpload
                            label="Section Feature Graphic"
                            value={section.image_url || ''}
                            onChange={(url) =>
                              handleUpdateSection(section.id, { image_url: url })
                            }
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminHomepage;
